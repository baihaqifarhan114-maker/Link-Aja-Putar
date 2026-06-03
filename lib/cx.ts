/** Gabung className kondisional tanpa dependensi eksternal. */
export function cx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
