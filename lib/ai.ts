/**
 * Asisten Alokasi — lapisan AI LinkAja PUTAR.
 *
 * Dipakai bersama oleh server (app/api/ai/route.ts) dan klien.
 * Strategi: bila OPENROUTER_API_KEY tersedia, route memanggil model AI sungguhan
 * (OpenRouter, model gratis). Bila tidak / gagal, dipakai `localAdvice` —
 * heuristik berbasis aturan yang tetap memberi saran personal, sehingga
 * fitur AI tidak pernah "mati" saat dipresentasikan.
 */

export type AiPocket = {
  id: string;
  name: string;
  balance: number;
  allocationPct: number;
};

export type AiTxn = {
  title: string;
  category: string;
  amount: number;
  ts: number;
  pocketId?: string;
};

export type AiRequest = {
  question: string;
  pockets?: AiPocket[];
  transactions?: AiTxn[];
};

export type AiSource = "ai" | "lokal";

export type AiResponse = {
  answer: string;
  source: AiSource;
};

export const SYSTEM_PROMPT = `Kamu "Asisten Alokasi", asisten keuangan ramah dari aplikasi LinkAja PUTAR (dompet digital Indonesia).
Konsep produk: penghasilan/tunjangan masuk -> otomatis terbagi ke "kantong" tujuan (Bensin, Transit, Tagihan, Dapur, Utama) -> saldo mengendap tumbuh lewat reksa dana pasar uang -> dipakai berputar di transit, SPBU Pertamina, dan tagihan.

Tugasmu:
- Bantu pengguna mengatur alokasi kantong dan kebiasaan belanja harian.
- Beri saran hemat dan "langkah berikutnya" yang konkret lintas kebutuhan (mis. transit -> isi BBM -> bayar tagihan).
- Gunakan data kantong & transaksi yang diberikan untuk membuat saran personal.

Aturan penting:
- Bahasa Indonesia santai tapi sopan, ringkas. Maksimal sekitar 5 kalimat atau 3-4 poin pendek.
- JANGAN memberi nasihat investasi spesifik (saham/produk tertentu) atau menjanjikan imbal hasil pasti. Untuk pertumbuhan saldo, cukup jelaskan konsep reksa dana pasar uang secara umum.
- Jangan menyinggung agama, suku, atau ras. Netral.
- Fokus actionable, hindari basa-basi panjang.`;

/** Ringkas konteks finansial pengguna jadi teks untuk model. */
export function buildUserContext(req: AiRequest): string {
  const lines: string[] = [];
  if (req.pockets?.length) {
    lines.push("Kantong pengguna saat ini:");
    for (const p of req.pockets) {
      lines.push(
        `- ${p.name}: saldo Rp${p.balance.toLocaleString("id-ID")}` +
          (p.id === "utama" ? "" : `, alokasi ${p.allocationPct}%`),
      );
    }
  }
  const spend = spendByPocket(req.transactions ?? []);
  if (Object.keys(spend).length) {
    lines.push("", "Pengeluaran ~30 hari terakhir per kantong:");
    for (const [k, v] of Object.entries(spend).sort((a, b) => b[1] - a[1])) {
      lines.push(`- ${k}: Rp${v.toLocaleString("id-ID")}`);
    }
  }
  lines.push("", `Pertanyaan pengguna: ${req.question || "(beri ringkasan kondisi keuangan & 1 saran utama)"}`);
  return lines.join("\n");
}

function spendByPocket(txns: AiTxn[]): Record<string, number> {
  const now = Date.now();
  const span = 30 * 24 * 3600 * 1000;
  const out: Record<string, number> = {};
  for (const t of txns) {
    if (t.amount < 0 && now - t.ts <= span) {
      const k = labelPocket(t.pocketId ?? t.category);
      out[k] = (out[k] ?? 0) + Math.abs(t.amount);
    }
  }
  return out;
}

function labelPocket(id: string): string {
  const map: Record<string, string> = {
    utama: "Utama",
    bensin: "Bensin",
    transit: "Transit",
    tagihan: "Tagihan",
    dapur: "Dapur",
    qris: "Belanja QRIS",
    transfer: "Transfer",
  };
  return map[id] ?? id;
}

const rp = (n: number) => `Rp${Math.round(n).toLocaleString("id-ID")}`;

/**
 * Fallback cerdas berbasis aturan. Selalu memberi jawaban yang relevan
 * dari data pengguna, tanpa memanggil layanan eksternal.
 */
export function localAdvice(req: AiRequest): string {
  const pockets = req.pockets ?? [];
  const spend = spendByPocket(req.transactions ?? []);
  const entries = Object.entries(spend).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const q = (req.question || "").toLowerCase();

  const tips: string[] = [];

  if (entries.length) {
    const [topCat, topVal] = entries[0];
    const pct = total > 0 ? Math.round((topVal / total) * 100) : 0;
    tips.push(
      `Pengeluaran terbesarmu 30 hari terakhir ada di kantong **${topCat}** (${rp(topVal)}, ~${pct}% dari total). Coba pasang batas mingguan di kantong ini.`,
    );
  }

  const transit = pockets.find((p) => p.id === "transit");
  const bensin = pockets.find((p) => p.id === "bensin");
  if (transit && transit.balance < 20000) {
    tips.push(
      `Saldo kantong Transit tinggal ${rp(transit.balance)} — isi dulu biar besok pagi tinggal tap, nggak perlu mikir.`,
    );
  }
  if (bensin && bensin.balance > 200000) {
    tips.push(
      `Kantong Bensin cukup tebal (${rp(bensin.balance)}). Sisanya bisa kamu biarkan di Kantong Utama supaya tumbuh otomatis lewat reksa dana pasar uang.`,
    );
  }

  if (q.includes("hemat") || q.includes("boros")) {
    tips.push(
      "Trik cepat: aktifkan bagi otomatis saat tunjangan masuk, jadi dana kebutuhan wajib langsung 'terkunci' sebelum sempat terpakai untuk hal lain.",
    );
  }
  if (q.includes("selanjut") || q.includes("langkah") || q.includes("next")) {
    tips.push(
      "Langkah berikutnya untukmu: tap transit pagi ini → isi BBM di Pertamina dari kantong Bensin → bayar 1 tagihan rutin. Tiga langkah ini membentuk kebiasaan harian.",
    );
  }

  if (!tips.length) {
    tips.push(
      "Mulai dari membagi tunjangan ke kantong kebutuhan (Transit, Bensin, Tagihan), lalu biarkan sisa di Kantong Utama tumbuh otomatis. Aku bisa bantu hitung alokasinya kalau kamu sebutkan nominalnya.",
    );
  }

  return tips.slice(0, 4).map((t) => `• ${t}`).join("\n");
}
