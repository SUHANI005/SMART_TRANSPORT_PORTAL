import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpenAI } from "@/lib/openai";

function keywordFallback(need: string, services: { slug: string; name: string; summary: string; category: string }[]) {
  const n = need.toLowerCase();
  let best = services[0];
  let bestScore = -1;
  for (const s of services) {
    const haystack = `${s.name} ${s.summary} ${s.category}`.toLowerCase();
    const words = n.split(/\W+/).filter((w) => w.length > 3);
    const score = words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0);
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return { slug: best.slug, name: best.name, reason: `This looked like the closest match to what you described (matched by keywords).` };
}

export async function POST(req: Request) {
  const { need } = await req.json();
  const services = await prisma.service.findMany();

  try {
    const openai = getOpenAI();
    const catalog = services.map((s) => `${s.slug}: ${s.name} — ${s.summary}`).join("\n");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You match a citizen's plain-language description of their situation to the single best-fitting transport service from this list. Respond ONLY with strict JSON: {"slug": "...", "reason": "one short friendly sentence explaining why, in plain language"}. Pick the slug ONLY from this list:\n${catalog}`
        },
        { role: "user", content: need }
      ],
      temperature: 0.2,
      max_tokens: 150
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    const match = services.find((s) => s.slug === parsed.slug);
    if (!match) throw new Error("no match");
    return NextResponse.json({ slug: match.slug, name: match.name, reason: parsed.reason });
  } catch {
    const fallback = keywordFallback(need, services);
    return NextResponse.json(fallback);
  }
}
