"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

/** Bottom sheet spring + drag-to-dismiss + backdrop redup. Diposisikan dalam canvas. */
export function BottomSheet({ open, onClose, title, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[26px] bg-card px-5 pb-7 pt-3 shadow-[0_-10px_40px_rgba(0,0,0,0.18)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 340 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="mx-auto mb-3 h-1.5 w-11 rounded-full bg-line" />
            {title && (
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold text-ink">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Tutup"
                  className="press grid h-8 w-8 place-items-center rounded-full bg-bg text-ink-2"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="max-h-[68vh] overflow-y-auto no-scrollbar">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
