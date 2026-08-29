import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOpenAI } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const services = await prisma.service.findMany();
    const catalog = services
      .map(
        (s) =>
          `- ${s.name} (/services/${s.slug}, category: ${s.category}, fee: ₹${s.fee}, est. time: ${s.estTime}): ${s.summary} Documents needed: ${JSON.parse(s.documents).join(", ")}.`
      )
      .join("\n");

    const systemPrompt = `You are the "Transport Assistant" for the Smart Transport Services Portal, a citizen-facing website (a demo inspired by services like Parivahan, but with original branding and sample data — NOT an official government site).

Your job: help users figure out which transport service they need, what documents are required, how much it costs, and what steps to follow — in short, simple, friendly language. Avoid bureaucratic jargon; explain any technical term you must use.

Only recommend services from this catalog (do not invent services or fees):
${catalog}

Rules:
- Keep answers short (a few sentences or a short list). No long essays.
- If asked something outside transport services (or something you don't know), say so honestly and suggest contacting support via the Contact page.
- When relevant, mention the specific service name and that they can find it under "Services" or via the link path given.
- Respond in the same language the user writes in (English or Hindi).
- Never claim to submit, approve, or process anything yourself — you only guide and inform.`;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages.map((m: any) => ({ role: m.role, content: m.content }))],
      temperature: 0.4,
      max_tokens: 400
    });

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't come up with an answer just now.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    const message = err?.message?.includes("OPENAI_API_KEY")
      ? "The AI Assistant isn't fully set up yet — an OPENAI_API_KEY needs to be added to the server's environment variables."
      : "The assistant is temporarily unavailable. Please try again shortly, or browse Services / check the FAQ page.";
    return NextResponse.json({ reply: message }, { status: 200 });
  }
}
