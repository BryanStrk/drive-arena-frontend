import {
  ASSETS_EXPERIENCES,
  ASSETS_LODGES,
  ASSETS_PACKS,
} from './cloudinaryAssets'

/**
 * Mock data del Home público.
 * Estructura espejo de los DTOs del backend para facilitar la migración
 * cuando se conecten los endpoints reales.
 */

// === STATS DEL RESORT ===
export const RESORT_STATS = [
  { value: '04', label: 'Circuitos Activos' },
  { value: '02', label: 'Lodges Premium' },
  { value: '15+', label: 'Pilotos Ranking' },
  { value: '24/7', label: 'Resort Abierto' },
]

// === EXPERIENCIAS / ATRACCIONES ===
export const EXPERIENCES = [
  {
    id: 1,
    nombre: 'Phantom GT',
    descripcion: 'Circuito profesional GT3 · 4.2km',
    tamano: 'GRANDE',
    record: '87.234s',
    image: ASSETS_EXPERIENCES.phantomGt,
  },
  {
    id: 2,
    nombre: 'Apex Simulator',
    descripcion: 'F1 motion 6DOF · VR',
    tamano: 'MEDIANA',
    record: '91.002s',
    image: ASSETS_EXPERIENCES.apexSimulator,
  },
  {
    id: 3,
    nombre: 'Drift King',
    descripcion: 'BMW M3 + MX-5 · Drift',
    tamano: 'GRANDE',
    record: '102.441s',
    image: ASSETS_EXPERIENCES.driftKing,
  },
  {
    id: 4,
    nombre: 'Neon Karting',
    descripcion: 'Karting cubierto · LED reactivo',
    tamano: 'PEQUENA',
    record: '45.890s',
    image: ASSETS_EXPERIENCES.neonKarting,
  },
]

// === RANKING DEL MES ===
export const MONTHLY_RANKINGS = [
  {
    attractionId: 1,
    attractionName: 'Phantom GT',
    entries: [
      { position: 1, name: 'Marco V.', time: '87.234s', date: '20.04.2026' },
      { position: 2, name: 'Sofia H.', time: '88.102s' },
      { position: 3, name: 'Lucas R.', time: '88.450s' },
      { position: 4, name: 'Alba M.', time: '89.001s' },
      { position: 5, name: 'Diego P.', time: '89.220s' },
    ],
  },
  {
    attractionId: 3,
    attractionName: 'Drift King',
    entries: [
      { position: 1, name: 'Sofia H.', time: '92.115s', date: '19.04.2026' },
      { position: 2, name: 'Marco V.', time: '93.002s' },
      { position: 3, name: 'Alba M.', time: '93.450s' },
      { position: 4, name: 'Diego P.', time: '94.001s' },
      { position: 5, name: 'Lucas R.', time: '94.220s' },
    ],
  },
  {
    attractionId: 4,
    attractionName: 'Neon Karting',
    entries: [
      { position: 1, name: 'Lucas R.', time: '45.123s', date: '22.04.2026' },
      { position: 2, name: 'Alba M.', time: '45.890s' },
      { position: 3, name: 'Sofia H.', time: '46.102s' },
      { position: 4, name: 'Marco V.', time: '46.450s' },
      { position: 5, name: 'Diego P.', time: '46.800s' },
    ],
  },
]

// === PACKS EN OFERTA ===
export const OFFER_PACKS = [
  {
    id: 1,
    title: 'Pack GP Championship',
    description:
      'Fin de semana completo. Lodge Premium + Pases ilimitados a todos los circuitos + Pensión completa.',
    originalPrice: 480,
    currentPrice: 336,
    discountPercentage: 30,
    availability: '1 Jun - 31 Ago',
    image: ASSETS_PACKS.gpChampionship,
  },
  {
    id: 2,
    title: 'Pack Piloto Privado',
    description:
      'Inmersión técnica. Lodge Estándar + Sesiones privadas Phantom GT con telemetría + Media pensión.',
    originalPrice: 380,
    currentPrice: 285,
    discountPercentage: 25,
    availability: 'Todo el año',
    image: ASSETS_PACKS.pilotoPrivado,
  },
]

// === LODGES DEL RESORT ===
export const RESORT_LODGES = [
  {
    id: 1,
    nombre: 'Apex Lodge',
    descripcion:
      'Suite panorámica con vistas directas al circuito principal. Decoración inspirada en escuderías clásicas y terraza privada.',
    category: 'VIP Paddock',
    categoryVariant: 'primary',
    priceMedia: 180,
    priceFull: 240,
    image: ASSETS_LODGES.apexLodge,
  },
  {
    id: 2,
    nombre: 'Pit Stop Lodge',
    descripcion:
      'Amplio espacio para grupos y familias. Zona de juegos integrada, acceso directo a Neon Karting y garaje temático.',
    category: 'Familiar',
    categoryVariant: 'default',
    priceMedia: 140,
    priceFull: 190,
    image: ASSETS_LODGES.pitStopLodge,
  },
]

// === UBICACIÓN DEL RESORT ===
export const RESORT_LOCATION = {
  name: 'Drive Arena Resort',
  coords: '40.4168° N, 3.7038° W',
  address:
    'Autovía A-1, Km 45.\n' +
    'Salida Parque Tecnológico del Motor.\n' +
    '28750 San Agustín del Guadalix, Madrid.',
  transport: [
    'A 30 min del Aeropuerto MAD',
    'Parking gratuito clientes (1000 plazas)',
    'Cargadores EV disponibles (Tesla/Gen)',
  ],
}
