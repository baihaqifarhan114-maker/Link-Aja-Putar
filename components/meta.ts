import {
  ArrowDownToLine,
  ArrowUpRight,
  Briefcase,
  Fuel,
  QrCode,
  ReceiptText,
  RefreshCw,
  ShoppingBag,
  Sprout,
  TrainFront,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { PocketId, TxnCategory } from "@/lib/types";

export type PocketMeta = {
  icon: LucideIcon;
  /** warna kuat ikon */
  fg: string;
  /** tint latar lembut */
  tint: string;
};

export const POCKET_META: Record<PocketId, PocketMeta> = {
  utama: { icon: Wallet, fg: "#E11B22", tint: "rgba(225,27,34,0.10)" },
  bensin: { icon: Fuel, fg: "#D97706", tint: "rgba(245,158,11,0.14)" },
  transit: { icon: TrainFront, fg: "#0284C7", tint: "rgba(2,132,199,0.12)" },
  tagihan: { icon: ReceiptText, fg: "#4F46E5", tint: "rgba(79,70,229,0.12)" },
  dapur: { icon: UtensilsCrossed, fg: "#0E8F52", tint: "rgba(14,143,82,0.12)" },
};

export type CategoryMeta = {
  icon: LucideIcon;
  fg: string;
  tint: string;
};

export const CATEGORY_META: Record<TxnCategory, CategoryMeta> = {
  income: { icon: Briefcase, fg: "#0E8F52", tint: "rgba(14,143,82,0.12)" },
  topup: { icon: ArrowDownToLine, fg: "#0284C7", tint: "rgba(2,132,199,0.12)" },
  transfer: { icon: ArrowUpRight, fg: "#5B5B5B", tint: "rgba(91,91,91,0.10)" },
  qris: { icon: QrCode, fg: "#E11B22", tint: "rgba(225,27,34,0.10)" },
  transit: { icon: TrainFront, fg: "#0284C7", tint: "rgba(2,132,199,0.12)" },
  berkah: { icon: RefreshCw, fg: "#C2185B", tint: "rgba(194,24,91,0.12)" },
  growth: { icon: Sprout, fg: "#0E8F52", tint: "rgba(14,143,82,0.12)" },
  bensin: { icon: Fuel, fg: "#D97706", tint: "rgba(245,158,11,0.14)" },
  tagihan: { icon: ReceiptText, fg: "#4F46E5", tint: "rgba(79,70,229,0.12)" },
  dapur: { icon: UtensilsCrossed, fg: "#0E8F52", tint: "rgba(14,143,82,0.12)" },
  belanja: { icon: ShoppingBag, fg: "#5B5B5B", tint: "rgba(91,91,91,0.10)" },
};
