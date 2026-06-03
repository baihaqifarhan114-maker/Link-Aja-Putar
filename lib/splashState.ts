/**
 * Flag modul-level — hidup selama sesi SPA, reset otomatis saat refresh penuh.
 * Tidak perlu sessionStorage: module JS di-re-evaluate setiap page refresh.
 */
let _shown = false;
export const hasShownSplash = () => _shown;
export const markSplashShown = () => { _shown = true; };
export const resetSplash = () => { _shown = false; };
