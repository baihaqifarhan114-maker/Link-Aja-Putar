/** Tipe domain LinkAja SIAP. */

export type PocketId = "utama" | "bensin" | "transit" | "tagihan" | "dapur";

export type Pocket = {
  id: PocketId;
  name: string;
  /** kunci ikon (lihat components/pocketMeta) */
  icon: string;
  balance: number;
  /** persentase alokasi auto-split (0..40); utama = sisanya (display only) */
  allocationPct: number;
  /** true untuk Kantong Utama yang tumbuh otomatis (reksa dana pasar uang) */
  isGrowing: boolean;
};

export type TxnCategory =
  | "income"
  | "topup"
  | "transfer"
  | "qris"
  | "transit"
  | "berkah"
  | "growth"
  | "bensin"
  | "tagihan"
  | "dapur"
  | "belanja";

export type Txn = {
  id: string;
  ts: number;
  title: string;
  category: TxnCategory;
  /** + uang masuk, - uang keluar */
  amount: number;
  pocketId?: PocketId;
  merchant?: string;
};

export type BerkahEvent = {
  id: string;
  ts: number;
  amount: number;
  fromPocket: PocketId;
  toPocket: PocketId;
};
