import { ASSETS_EXPERIENCES } from "./cloudinaryAssets";

/**
 * Mock data del flujo de reserva pública.
 * Estructura espejo de los DTOs del backend (`/atracciones`, `/tarifas`, `/hotels`).
 */

// === ATRACCIONES CON SUS TARIFAS ===
export const ATRACCIONES_PUBLIC = [
  {
    id: 1,
    nombre: "Phantom GT",
    descripcion: "Circuito profesional GT3 · 4.2km",
    duracionMinutos: 45,
    image: ASSETS_EXPERIENCES.phantomGt,
    tarifas: [
      { id: 11, nombre: "Single Lap", sesiones: 1, precio: 85 },
      { id: 12, nombre: "Triple Lap", sesiones: 3, precio: 220 },
      { id: 13, nombre: "Premium Pack", sesiones: 5, precio: 350 },
    ],
  },
  {
    id: 2,
    nombre: "Apex Simulator",
    descripcion: "F1 motion 6DOF · VR",
    duracionMinutos: 30,
    image: ASSETS_EXPERIENCES.apexSimulator,
    tarifas: [
      { id: 21, nombre: "Sesión Estándar", sesiones: 1, precio: 60 },
      { id: 22, nombre: "Pack Triple", sesiones: 3, precio: 150 },
    ],
  },
  {
    id: 3,
    nombre: "Drift King",
    descripcion: "BMW M3 + MX-5 · Drift",
    duracionMinutos: 60,
    image: ASSETS_EXPERIENCES.driftKing,
    tarifas: [
      { id: 31, nombre: "Iniciación", sesiones: 1, precio: 120 },
      { id: 32, nombre: "Maestría", sesiones: 3, precio: 320 },
    ],
  },
  {
    id: 4,
    nombre: "Neon Karting",
    descripcion: "Karting cubierto · LED reactivo",
    duracionMinutos: 20,
    image: ASSETS_EXPERIENCES.neonKarting,
    tarifas: [
      { id: 41, nombre: "Carrera Única", sesiones: 1, precio: 35 },
      { id: 42, nombre: "Pack Carreras", sesiones: 3, precio: 90 },
      { id: 43, nombre: "Día Completo", sesiones: 8, precio: 220 },
    ],
  },
];

// === LODGES DISPONIBLES ===
export const LODGES_PUBLIC = [
  {
    id: 1,
    nombre: "Apex Lodge",
    descripcion:
      "Suite panorámica con vistas directas al circuito principal. Decoración inspirada en escuderías clásicas y terraza privada.",
    capacidad: 2,
    priceMedia: 180,
    priceFull: 240,
  },
  {
    id: 2,
    nombre: "Pit Stop Lodge",
    descripcion:
      "Amplio espacio para grupos y familias. Zona de juegos integrada, acceso directo a Neon Karting y garaje temático.",
    capacidad: 4,
    priceMedia: 140,
    priceFull: 190,
  },
];

// === LÍMITES DE NEGOCIO ===
export const PERSONAS_MIN = 1;
export const PERSONAS_MAX = 10;

// === ESTADO INICIAL DEL WIZARD ===
export const RESERVA_INITIAL_STATE = {
  pase: null, // { atraccion, tarifa }
  lodge: null, // { lodge, fechaEntrada, fechaSalida, regimen }
  cliente: null, // { nombre, apellidos, email, telefono, dni }
  personas: 1, // 1 (titular) hasta 10 (titular + 9 acompañantes)
  esPack: false,
  packId: null,
};
