"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrainFront } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { STATIONS, TRANSIT_FARE } from "@/lib/constants";
import { formatRupiah } from "@/lib/format";
import { AppHeader } from "@/components/AppHeader";
import { useToast } from "@/components/Toast";
import { cx } from "@/lib/cx";

function Gate({ open }: { open: boolean }) {
  return (
    <div className="relative mx-auto h-28 w-full max-w-[300px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#11151c] to-[#0b0b0f]">
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 bg-white/10" />
      <motion.div
        className="absolute left-0 top-0 h-full w-1/2 border-r-2 border-white/20 bg-[#1b2230]"
        animate={{ x: open ? "-100%" : "0%" }}
        transition={{ type: "spring", damping: 22, stiffness: 160 }}
      />
      <motion.div
        className="absolute right-0 top-0 h-full w-1/2 border-l-2 border-white/20 bg-[#1b2230]"
        animate={{ x: open ? "100%" : "0%" }}
        transition={{ type: "spring", damping: 22, stiffness: 160 }}
      />
      <div className="absolute inset-0 grid place-items-center">
        <TrainFront size={30} className={open ? "text-halal" : "text-white/30"} />
      </div>
    </div>
  );
}

function TapButton({
  label,
  sub,
  onClick,
  variant = "in",
}: {
  label: string;
  sub: string;
  onClick: () => void;
  variant?: "in" | "out";
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative grid h-44 w-44 place-items-center rounded-full text-white shadow-float"
      style={{
        background:
          variant === "in" ? "var(--laja-gradient)" : "var(--laja-gradient-soft)",
      }}
    >
      <span className="absolute inset-0 rounded-full ring-8 ring-white/10" />
      <div className="flex flex-col items-center gap-1">
        <TrainFront size={30} />
        <span className="text-[18px] font-extrabold tracking-wide">{label}</span>
        <span className="text-[11px] text-white/85">{sub}</span>
      </div>
    </motion.button>
  );
}

export default function Transit() {
  const router = useRouter();
  const toast = useToast();
  const transit = useAppStore((s) => s.transit);
  const transitTapIn = useAppStore((s) => s.transitTapIn);
  const transitTapOut = useAppStore((s) => s.transitTapOut);
  const transitPocket = useAppStore((s) => s.pockets.find((p) => p.id === "transit"));

  const [station, setStation] = useState(STATIONS[0]);
  const [gate, setGate] = useState(false);

  const doTapIn = () => {
    setGate(true);
    transitTapIn(station);
    window.setTimeout(() => {
      setGate(false);
      toast.show({ message: `Tap-in berhasil di ${station}`, variant: "success" });
    }, 950);
  };

  const doTapOut = () => {
    const res = transitTapOut();
    if (!res.ok) {
      toast.show({
        message: "Saldo Transit & Utama tidak cukup",
        variant: "error",
        action: { label: "Top Up", onClick: () => router.push("/topup") },
      });
      return;
    }
    setGate(true);
    window.setTimeout(() => {
      setGate(false);
      if (res.reward && res.reward > 0) {
        router.push("/siklus");
      } else {
        toast.show({
          message: `Tap-out berhasil · tarif ${formatRupiah(res.fare)}`,
          variant: "success",
        });
      }
    }, 950);
  };

  return (
    <div className="flex min-h-full flex-col">
      <AppHeader mode="page" title="Transit KRL / MRT" onBack={() => router.back()} />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-8 pt-2">
        <Gate open={gate} />

        <div className="mt-6 flex flex-1 flex-col">
          {!transit.tappedIn ? (
            <>
              <p className="text-[13px] font-bold text-ink">Pilih stasiun</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {STATIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStation(s)}
                    className={cx(
                      "press rounded-full border px-3 py-1.5 text-[12px] font-semibold",
                      s === station
                        ? "border-transparent bg-laja-red text-white"
                        : "border-line bg-white text-ink-2",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex flex-1 items-center justify-center py-8">
                <TapButton label="TAP MASUK" sub={station} onClick={doTapIn} />
              </div>

              <p className="text-center text-[12px] text-muted">
                Tarif {formatRupiah(TRANSIT_FARE)} dibayar saat tap keluar dari
                Kantong Transit.
              </p>
            </>
          ) : (
            <>
              <div className="rounded-2xl bg-white p-4 shadow-card">
                <p className="text-[12px] font-semibold text-muted">
                  Sedang dalam perjalanan dari
                </p>
                <p className="text-[16px] font-extrabold text-ink">{transit.station}</p>
                <p className="mt-1 text-[12px] text-ink-2">
                  Saldo Transit: {formatRupiah(transitPocket?.balance ?? 0)}
                </p>
              </div>

              <div className="flex flex-1 items-center justify-center py-8">
                <TapButton
                  label="TAP KELUAR"
                  sub={`Tarif ${formatRupiah(TRANSIT_FARE)}`}
                  onClick={doTapOut}
                  variant="out"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
