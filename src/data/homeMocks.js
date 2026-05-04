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
// Estructura espejo de AtraccionDto del backend (sin imagenUrl real aquí)
export const EXPERIENCES = [
  {
    id: 1,
    nombre: 'Phantom GT',
    descripcion: 'Circuito profesional GT3 · 4.2km',
    tamano: 'GRANDE',
    record: '87.234s',
  },
  {
    id: 2,
    nombre: 'Apex Simulator',
    descripcion: 'F1 motion 6DOF · VR',
    tamano: 'MEDIANA',
    record: '91.002s',
  },
  {
    id: 3,
    nombre: 'Drift King',
    descripcion: 'BMW M3 + MX-5 · Drift',
    tamano: 'GRANDE',
    record: '102.441s',
  },
  {
    id: 4,
    nombre: 'Neon Karting',
    descripcion: 'Karting cubierto · LED reactivo',
    tamano: 'PEQUENA',
    record: '45.890s',
  },
]

// === RANKING DEL MES ===
// Top 5 pilotos por atracción seleccionada
// Estructura espejo de RankingEntryDto del backend
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