"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Phone, RefreshCw, Sprout, Layers } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { BrandLogo } from "@/components/BrandLogo";
import { PrimaryButton } from "@/components/PrimaryButton";

type Tab = "google" | "phone";

export default function Login() {
  const router = useRouter();
  const login = useAppStore((s) => s.login);
  const isLoggedIn = useAppStore((s) => s.isLoggedIn);

  // Redirect bila sudah login
  useEffect(() => {
    if (isLoggedIn) router.replace("/beranda");
  }, [isLoggedIn, router]);

  const [tab, setTab] = useState<Tab>("google");

  // State Google flow
  const [gName, setGName] = useState("");
  const [gPhone, setGPhone] = useState("");

  // State Phone flow
  const [phone, setPhone] = useState("");
  const [phoneName, setPhoneName] = useState("");

  const doGoogleLogin = () => {
    if (!gName.trim()) return;
    login(gName, gPhone || "-");
    router.replace("/beranda");
  };

  const doPhoneLogin = () => {
    if (phone.length < 10) return;
    login(phoneName.trim() || phone, phone);
    router.replace("/beranda");
  };

  return (
    <div className="flex min-h-[100dvh] w-full">
      {/* ── Panel kiri (brand) — desktop only ── */}
      <div
        className="relative hidden flex-1 flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{ background: "var(--laja-gradient)" }}
      >
        {/* dekoratif circles */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-48 left-8 h-32 w-32 rounded-full bg-white/10" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <BrandLogo size={48} rounded={12} />
          <span className="text-[22px] font-extrabold text-white">LinkAja PUTAR</span>
        </div>

        {/* Headline utama */}
        <div className="relative">
          <p className="text-[13px] font-bold uppercase tracking-widest text-white/70">
            Fitur terbaru
          </p>
          <h1 className="mt-2 text-[56px] font-extrabold leading-[1.0] tracking-tight text-white">
            KEUANGAN<br />LEBIH<br />TERATUR.
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/80">
            Kantong otomatis, siklus manfaat, dan saldo yang tumbuh otomatis —
            semua dalam satu aplikasi.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: Layers, t: "Kantong Otomatis", d: "Tunjangan & penghasilan masuk langsung terbagi ke kebutuhanmu." },
              { icon: RefreshCw, t: "Siklus Manfaat", d: "Tiap transaksi mengisi kantong kebutuhan berikutnya." },
              { icon: Sprout, t: "Tumbuh Otomatis", d: "Saldo berkembang otomatis 5,5%/th lewat reksa dana." },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.t} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15">
                    <Icon size={17} className="text-white" />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-white">{f.t}</p>
                    <p className="text-[11.5px] text-white/70">{f.d}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-[11.5px] text-white/50">
          BCC StudentsxCEOs 15 — GGMU
        </p>
      </div>

      {/* ── Panel kanan (form) ── */}
      <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-10 lg:w-[460px] lg:shrink-0 lg:px-12">
        {/* Logo mobile */}
        <div className="mb-8 flex flex-col items-center gap-3 lg:hidden">
          <BrandLogo size={72} rounded={18} />
        </div>

        {/* Logo desktop (small) */}
        <div className="mb-8 hidden w-full lg:block">
          <BrandLogo size={56} rounded={14} />
        </div>

        <div className="w-full max-w-[360px]">
          <h2 className="text-[26px] font-extrabold text-ink">Selamat datang</h2>
          <p className="mt-1 text-[13.5px] text-ink-2">
            Masuk atau buat akun LinkAja PUTAR kamu.
          </p>

          {/* Tab switch */}
          <div className="mt-6 flex rounded-xl bg-bg p-1">
            {(["google", "phone"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="flex-1 rounded-lg py-2 text-[13px] font-bold transition-all"
                style={
                  tab === t
                    ? { background: "var(--laja-gradient)", color: "#fff" }
                    : { color: "var(--ink-2)" }
                }
              >
                {t === "google" ? "Google" : "Nomor HP"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === "google" ? (
              <motion.div
                key="google"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="mt-5 space-y-4"
              >
                <p className="text-[12.5px] text-ink-2">
                  Masuk menggunakan akun Google kamu. Nama yang dipakai di
                  LinkAja PUTAR sesuai profil Google.
                </p>

                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-ink">
                    Nama lengkap
                  </label>
                  <input
                    value={gName}
                    onChange={(e) => setGName(e.target.value)}
                    placeholder="Nama lengkap kamu"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted focus:border-laja-red"
                    aria-label="Nama lengkap"
                    autoComplete="name"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-ink">
                    Nomor HP <span className="font-normal text-muted">(opsional)</span>
                  </label>
                  <input
                    value={gPhone}
                    onChange={(e) => setGPhone(e.target.value)}
                    placeholder="08xx xxxx xxxx"
                    type="tel"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted focus:border-laja-red"
                    aria-label="Nomor HP"
                    autoComplete="tel"
                  />
                </div>

                {/* Google button */}
                <button
                  type="button"
                  onClick={doGoogleLogin}
                  disabled={!gName.trim()}
                  className="flex w-full items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-[14px] font-bold text-ink shadow-sm transition-opacity hover:bg-bg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {/* Google G logo */}
                  <svg viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
                    <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.4 3.1 29.5 1 24 1 14.6 1 6.7 6.7 3.3 14.8l7 5.4C12 14.2 17.5 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 7.1-10.2 7.1-17.1z" />
                    <path fill="#FBBC05" d="M10.3 28.5c-.6-1.5-.9-3.1-.9-4.8s.3-3.3.9-4.8L3.3 13.5C1.2 17.1 0 21.4 0 25.7c0 4.2 1.2 8.1 3.3 11.4l7-5.6z" />
                    <path fill="#34A853" d="M24 47c5.4 0 9.9-1.8 13.2-4.8l-7.6-5.9c-2 1.3-4.5 2.1-5.6 2.1-6.5 0-12-4.7-13.7-11l-7 5.4C6.7 40.9 14.6 47 24 47z" />
                  </svg>
                  <span className="flex-1 text-left">
                    {gName.trim() ? `Masuk sebagai ${gName.trim()}` : "Lanjutkan dengan Google"}
                  </span>
                  <ChevronRight size={18} className="text-muted" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
                className="mt-5 space-y-4"
              >
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-ink">
                    Nama lengkap
                  </label>
                  <input
                    value={phoneName}
                    onChange={(e) => setPhoneName(e.target.value)}
                    placeholder="Nama lengkap kamu"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted focus:border-laja-red"
                    aria-label="Nama lengkap"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-bold text-ink">
                    Nomor HP
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="08xx xxxx xxxx"
                    type="tel"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-line bg-white px-4 py-3 text-[14px] font-semibold text-ink outline-none placeholder:font-normal placeholder:text-muted focus:border-laja-red"
                    aria-label="Nomor HP"
                  />
                </div>

                <PrimaryButton
                  onClick={doPhoneLogin}
                  disabled={phone.length < 10}
                >
                  <span className="flex items-center gap-2">
                    <Phone size={16} /> Masuk
                  </span>
                </PrimaryButton>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-6 text-center text-[11.5px] leading-relaxed text-muted">
            Dengan masuk, kamu menyetujui{" "}
            <span className="font-semibold text-ink-2">Syarat & Ketentuan</span> serta{" "}
            <span className="font-semibold text-ink-2">Kebijakan Privasi</span> LinkAja.
          </p>
        </div>
      </div>
    </div>
  );
}
