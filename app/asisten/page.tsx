"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { AiPocket, AiResponse, AiSource, AiTxn } from "@/lib/ai";
import { AppHeader } from "@/components/AppHeader";

type Msg = { role: "user" | "assistant"; content: string; source?: AiSource };

const QUICK = [
  "Bagaimana sebaiknya aku atur alokasi tunjangan?",
  "Aku boros di kantong mana?",
  "Saran biar hemat transport & BBM",
  "Apa langkah keuangan selanjutnya buatku?",
];

const INTRO =
  "Halo! Aku Asisten Alokasi. Aku bisa bantu atur kantongmu, lihat ke mana uang paling banyak keluar, dan kasih langkah berikutnya. Kalau ada yang kurang jelas, aku juga bakal tanya balik ya. Coba tanya, atau pilih salah satu di bawah 👇";

// Bersihkan sisa format markdown (mis. **tebal**, *miring*, # judul) agar tidak muncul mentah di chat.
const clean = (s: string) =>
  s
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .trim();

export default function Asisten() {
  const router = useRouter();
  const pockets = useAppStore((s) => s.pockets);
  const transactions = useAppStore((s) => s.transactions);

  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: INTRO },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);

    const aiPockets: AiPocket[] = pockets.map((p) => ({
      id: p.id,
      name: p.name,
      balance: p.balance,
      allocationPct: p.allocationPct,
    }));
    const aiTxns: AiTxn[] = transactions.slice(0, 40).map((t) => ({
      title: t.title,
      category: t.category,
      amount: t.amount,
      ts: t.ts,
      pocketId: t.pocketId,
    }));

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, pockets: aiPockets, transactions: aiTxns }),
      });
      const data = (await res.json()) as AiResponse;
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.answer, source: data.source },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Maaf, aku lagi nggak bisa menjawab. Coba lagi sebentar ya.",
          source: "lokal",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader mode="page" title="Asisten Alokasi" onBack={() => router.push("/beranda")} />

      <div ref={scrollRef} className="no-scrollbar mx-auto w-full max-w-2xl flex-1 space-y-3 overflow-y-auto px-5 pb-4 pt-3">
        {/* Banner AI */}
        <div className="flex items-center gap-2.5 rounded-2xl p-3 text-white shadow-float" style={{ background: "var(--laja-gradient)" }}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/20">
            <Sparkles size={18} />
          </span>
          <div>
            <p className="text-[13px] font-extrabold leading-tight">Asisten Alokasi (AI)</p>
            <p className="text-[11px] text-white/85">Saran personal dari kantong & transaksimu</p>
          </div>
        </div>

        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                m.role === "user"
                  ? "max-w-[82%] rounded-2xl rounded-br-md px-3.5 py-2.5 text-[13px] font-medium text-white"
                  : "max-w-[88%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-ink shadow-card"
              }
              style={m.role === "user" ? { background: "var(--laja-gradient)" } : undefined}
            >
              <p className="whitespace-pre-line">{clean(m.content)}</p>
              {m.role === "assistant" && m.source && (
                <span
                  className={
                    "mt-1.5 inline-block rounded-full px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wide " +
                    (m.source === "ai"
                      ? "bg-laja-magenta/10 text-laja-magenta"
                      : "bg-bg text-muted")
                  }
                >
                  {m.source === "ai" ? "✦ AI" : "mode lokal"}
                </span>
              )}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white px-3.5 py-3 shadow-card">
              {[0, 1, 2].map((d) => (
                <motion.span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-laja-magenta"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                />
              ))}
            </div>
          </div>
        )}

        {messages.length <= 1 && !loading && (
          <div className="space-y-2 pt-1">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="press flex w-full items-center gap-2 rounded-2xl bg-white px-3.5 py-3 text-left text-[12.5px] font-semibold text-ink surface-line"
              >
                <Sparkles size={14} className="shrink-0 text-laja-magenta" />
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 mx-auto w-full max-w-2xl border-t border-line bg-bg/90 px-4 py-3 backdrop-blur">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tanya soal alokasi atau keuanganmu…"
            className="flex-1 rounded-2xl bg-white px-4 py-3 text-[13px] text-ink shadow-card outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Kirim"
            className="press grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-float disabled:opacity-40"
            style={{ background: "var(--laja-gradient)" }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
