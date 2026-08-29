import { NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";

function heuristicCheck(dataUrl: string, label: string) {
  const issues: string[] = [];
  const sizeMatch = dataUrl.match(/base64,(.*)$/);
  const approxBytes = sizeMatch ? (sizeMatch[1].length * 3) / 4 : 0;

  if (approxBytes < 8_000) {
    issues.push("The file looks very small — it may be blank or too low quality to read.");
  }
  if (!/^data:(image\/(png|jpe?g|webp)|application\/pdf)/.test(dataUrl)) {
    issues.push("Unsupported file type — please upload a JPG, PNG, or PDF.");
  }
  return {
    ok: issues.length === 0,
    issues,
    summary:
      issues.length === 0
        ? `"${label}" was received. (Basic check only — connect an OPENAI_API_KEY for full AI document verification.)`
        : `We found a possible issue with "${label}".`
  };
}

export async function POST(req: Request) {
  const { dataUrl, label } = await req.json();

  try {
    const openai = getOpenAI();
    const isImage = /^data:image\//.test(dataUrl);
    if (!isImage) {
      // Vision check only supported for images in this demo; PDFs get a basic pass-through.
      return NextResponse.json({ ok: true, issues: [], summary: `"${label}" received. PDF files are accepted as-is in this demo.` });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            'You check citizen-uploaded documents for an Indian transport-services portal. Given an image and the expected document label, judge: (1) is it readable/not blurry, (2) does it plausibly look like the expected document type, (3) any visible expiry date, if present, is not clearly in the past. Respond ONLY with strict JSON: {"ok": boolean, "issues": string[], "summary": "one short friendly sentence"}. Keep issues short and plain-language. Do not make definitive legal judgments — just flag things a human reviewer should double check.'
        },
        {
          role: "user",
          content: [
            { type: "text", text: `Expected document: "${label}". Please check this upload.` },
            { type: "image_url", image_url: { url: dataUrl } }
          ] as any
        }
      ],
      temperature: 0.2,
      max_tokens: 250
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return NextResponse.json({ ok: !!parsed.ok, issues: parsed.issues ?? [], summary: parsed.summary ?? "" });
  } catch {
    return NextResponse.json(heuristicCheck(dataUrl, label));
  }
}
