/**
 * URLs centralizadas de imágenes alojadas en Cloudinary.
 * Cualquier cambio de assets se hace solo aquí, no por el código.
 *
 * Cloud name: dutmn3xde
 */

const CLOUDINARY_BASE = 'https://res.cloudinary.com/dutmn3xde/image/upload'

// === Branding ===
export const ASSETS_BRAND = {
  logo: `${CLOUDINARY_BASE}/v1777374497/logo-drive-arena_wxkvaq.png`,
  avatarDefault: `${CLOUDINARY_BASE}/v1777964150/avatar-default_rv2aer.jpg`,
}

// === Hero / Backgrounds ===
export const ASSETS_HERO = {
  home: `${CLOUDINARY_BASE}/v1777373699/hero-home_mvb26r.jpg`,
  loginBg: `${CLOUDINARY_BASE}/v1777373774/login-bg_p5byio.jpg`,
}

// === Experiences (atracciones/circuitos) ===
export const ASSETS_EXPERIENCES = {
  phantomGt: `${CLOUDINARY_BASE}/v1777373888/phantom-gt_kfppwo.jpg`,
  apexSimulator: `${CLOUDINARY_BASE}/v1777374072/apex-simulator_s4ohth.jpg`,
  driftKing: `${CLOUDINARY_BASE}/v1777373982/drift-king_rvxhw5.jpg`,
  neonKarting: `${CLOUDINARY_BASE}/v1777374122/neon-karting_gzaqy7.jpg`,
}

// === Lodges (alojamientos) ===
export const ASSETS_LODGES = {
  apexLodge: `${CLOUDINARY_BASE}/v1777373943/apex-lodge_zo8xr2.jpg`,
  pitStopLodge: `${CLOUDINARY_BASE}/v1777374181/pit-stop-lodge_ui0t1n.jpg`,
}

// === Packs (ofertas) ===
export const ASSETS_PACKS = {
  gpChampionship: `${CLOUDINARY_BASE}/v1777374222/pack-gp-championship_ai9sab.jpg`,
  pilotoPrivado: `${CLOUDINARY_BASE}/v1777374276/pack-piloto-privado_ula3f9.jpg`,
}