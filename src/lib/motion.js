/**
 * Variantes de animación reutilizables (framer-motion).
 *
 * Centralizadas para mantener consistencia en las listas y páginas:
 * - Entradas cortas y sutiles (sin rebotes agresivos).
 * - Sin animaciones infinitas (eso queda para indicadores live/loading).
 */

/** Contenedor de lista: orquesta el stagger de sus hijos. */
export const listContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
}

/** Item de lista: fade + leve subida. */
export const listItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
}

/** Fade-in suave del contenido principal de una página. */
export const pageFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: 'easeOut' },
}
