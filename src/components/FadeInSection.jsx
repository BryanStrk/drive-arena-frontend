import { motion } from 'framer-motion'

/**
 * Wrapper que aplica una animación fade-in + slide-up cuando el contenido
 * entra en el viewport. Reutilizable para cualquier sección.
 *
 * Usa whileInView de framer-motion para detectar cuándo aparece.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {number} [props.delay=0] - Retraso en segundos antes de iniciar
 * @param {number} [props.duration=0.6] - Duración total de la animación
 * @param {number} [props.distance=24] - Distancia (px) que sube desde abajo
 * @param {string} [props.className]
 */
function FadeInSection({
  children,
  delay = 0,
  duration = 0.6,
  distance = 24,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default FadeInSection