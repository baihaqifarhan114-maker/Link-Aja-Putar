"use client";

import { useState } from "react";

type Props = {
  size?: number;
  rounded?: number;
  className?: string;
};

/**
 * Logo LinkAja. Memakai aset resmi di `public/linkaja-logo.png` bila ada;
 * jika belum, tampil fallback wordmark yang tetap on-brand.
 */
export function BrandLogo({ size = 112, rounded = 24, className }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: rounded,
          background: "var(--laja-red)",
          display: "grid",
          placeItems: "center",
        }}
        aria-label="LinkAja"
        role="img"
      >
        <div className="flex flex-col items-center leading-[0.82]">
          <span
            className="font-extrabold italic text-white"
            style={{ fontSize: size * 0.29 }}
          >
            Link
          </span>
          <span
            className="font-extrabold italic text-white"
            style={{ fontSize: size * 0.29 }}
          >
            Aja!
          </span>
          <span
            className="mt-1 block rounded-full bg-white/90"
            style={{ height: Math.max(2, size * 0.03), width: size * 0.42 }}
          />
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/linkaja-logo.png"
      alt="LinkAja"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, borderRadius: rounded, objectFit: "contain" }}
      onError={() => setErrored(true)}
    />
  );
}
