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