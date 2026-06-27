import { NextResponse } from "next/server";
import {
  SYSTEM_PROMPT,
  buildUserContext,
  localAdvice,
  type AiRequest,
  type AiResponse,
} from "@/lib/ai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Asisten Alokasi — endpoint AI (Google Gemini).
 * Set GEMINI_API_KEY di env (Vercel / .env.local). Opsional GEMINI_MODEL
 * (default: gemini-2.5-flash — cepat, thinking dimatikan untuk respons kilat).
 * Jika key tidak ada / panggilan gagal → fallback heuristik lokal (tetap menjawab).
 */
export async function POST(req: Request) {
  let body: AiRequest;
  try {
    body = (await req.json()) as AiRequest;
  } catch {
    return NextResponse.json({ answer: "Maaf, permintaan tidak terbaca.", source: "lokal" } satisfies AiResponse);
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return NextResponse.json({ answer: localAdvice(body), source: "lokal" } satisfies AiResponse);
  }

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: buildUserContext(body) }] }],
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 600,
            // Matikan "thinking" → respons lebih cepat (didukung gemini-2.5-flash).
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
    );
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    const parts: { text?: string }[] = data?.candidates?.[0]?.content?.parts ?? [];
    const answer = parts
      .map((p) => p?.text)
      .filter(Boolean)
      .join("")
      .trim();
    if (!answer) throw new Error("Jawaban kosong");

    return NextResponse.json({ answer, source: "ai" } satisfies AiResponse);
  } catch {
    // Degradasi anggun: jangan pernah gagal di depan juri.
    return NextResponse.json({ answer: localAdvice(body), source: "lokal" } satisfies AiResponse);
  }
}
