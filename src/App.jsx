function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        {/* Logo principal en Saira */}
        <h1 className="font-display font-extrabold text-8xl text-text tracking-tight leading-none">
          DRIVE <span className="text-primary">ARENA</span>
        </h1>

        {/* Línea separadora roja con glow */}
        <div className="mt-4 h-[2px] w-32 mx-auto bg-primary shadow-[0_0_10px_var(--color-primary-glow)]" />

        {/* Subtitulo en JetBrains Mono */}
        <p className="font-mono text-text-muted mt-6 text-xs tracking-[0.3em] uppercase">
          // SYSTEM_BOOT :: STATUS OK
        </p>

        {/* Versión */}
        <p className="font-mono text-text-dim mt-2 text-[10px] tracking-widest">
          v0.1.0 — DEV BUILD
        </p>

        {/* Status indicator estilo header de mockups */}
        <div className="mt-12 flex items-center justify-center gap-2 font-mono text-[10px] tracking-widest text-text-muted">
          <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_var(--color-success)]" />
          <span>SISTEMA OPERATIVO · NODO BCN-01</span>
        </div>
      </div>
    </div>
  )
}

export default App