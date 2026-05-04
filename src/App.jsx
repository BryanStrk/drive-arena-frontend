function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        {/* Logo principal en Bebas Neue */}
        <h1 className="font-display text-8xl text-lime tracking-[0.15em] leading-none drop-shadow-[0_0_30px_var(--color-lime-glow)]">
          DRIVE ARENA
        </h1>

        {/* Línea separadora con efecto neón */}
        <div className="mt-4 h-[2px] w-32 mx-auto bg-lime shadow-[0_0_10px_var(--color-lime)]" />

        {/* Subtitulo en Roboto Mono */}
        <p className="font-mono text-text-muted mt-6 text-xs tracking-widest uppercase">
          // FRONTEND_BOOT :: STATUS OK
        </p>

        {/* Versión en font-mono */}
        <p className="font-mono text-text-muted/50 mt-2 text-[10px] tracking-widest">
          v0.1.0 — DEV
        </p>
      </div>
    </div>
  )
}

export default App