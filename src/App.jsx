import Button from '@/components/Button'
import Badge from '@/components/Badge'
import Card from '@/components/Card'
import SectionHeader from '@/components/SectionHeader'
import StatusBar from '@/components/StatusBar'

function App() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Status bar superior */}
      <StatusBar
        label="DESIGN SYSTEM PLAYGROUND · NODO BCN-01"
        right="v0.1.0 | 04.05.2026"
      />

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Hero del playground */}
        <header className="text-center">
          <h1 className="font-display font-extrabold text-7xl tracking-tight">
            DRIVE <span className="text-primary">ARENA</span>
          </h1>
          <p className="font-mono text-text-muted text-xs tracking-[0.3em] uppercase mt-3">
            // BASE_COMPONENTS :: PLAYGROUND
          </p>
        </header>

        {/* === SECTION: Buttons === */}
        <section>
          <SectionHeader
            eyebrow="01 · ACTIONS"
            title="BUTTONS"
            subtitle="4 variantes · 3 tamaños"
          />

          <div className="mt-6 space-y-6">
            {/* Variantes */}
            <Card>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-4">
                Variantes
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Reservar Pase</Button>
                <Button variant="secondary">Ver Circuitos</Button>
                <Button variant="ghost">Ver Todos ▶</Button>
                <Button variant="danger">Eliminar</Button>
              </div>
            </Card>

            {/* Tamaños */}
            <Card>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-4">
                Tamaños
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </Card>

            {/* Estados */}
            <Card>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-4">
                Estados
              </p>
              <div className="flex flex-wrap gap-3">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button fullWidth>Full Width</Button>
              </div>
            </Card>
          </div>
        </section>

        {/* === SECTION: Badges === */}
        <section>
          <SectionHeader
            eyebrow="02 · LABELS"
            title="BADGES"
            subtitle="6 variantes · con o sin dot"
          />

          <div className="mt-6 space-y-6">
            <Card>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-4">
                Variantes base
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Familiar</Badge>
                <Badge variant="primary">VIP Paddock</Badge>
                <Badge variant="outline">Grande</Badge>
                <Badge variant="success">Operativo</Badge>
                <Badge variant="warning">Revisión</Badge>
                <Badge variant="danger">Crítico</Badge>
              </div>
            </Card>

            <Card>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-4">
                Con status dot
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" dot>Sistema Operativo</Badge>
                <Badge variant="success" dot pulse>Live</Badge>
                <Badge variant="warning" dot>Mantenimiento</Badge>
                <Badge variant="danger" dot pulse>Error</Badge>
              </div>
            </Card>

            <Card>
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-4">
                Tamaños
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="xs" variant="primary">XS</Badge>
                <Badge size="sm" variant="primary">SM</Badge>
                <Badge size="md" variant="primary">MD</Badge>
              </div>
            </Card>
          </div>
        </section>

        {/* === SECTION: Cards === */}
        <section>
          <SectionHeader
            eyebrow="03 · CONTAINERS"
            title="CARDS"
            subtitle="3 variantes · composición libre"
          />

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="default">
              <Card.Header>
                <h3 className="font-display text-2xl">DEFAULT</h3>
                <Badge variant="primary">VIP</Badge>
              </Card.Header>
              <p className="text-text-muted text-sm">
                Card estándar con border. Uso general.
              </p>
              <Card.Divider />
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                bg-surface-1
              </p>
            </Card>

            <Card variant="elevated">
              <Card.Header>
                <h3 className="font-display text-2xl">ELEVATED</h3>
                <Badge variant="success" dot>ON</Badge>
              </Card.Header>
              <p className="text-text-muted text-sm">
                Card destacada sobre otros fondos.
              </p>
              <Card.Divider />
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                bg-surface-2
              </p>
            </Card>

            <Card variant="default" interactive>
              <Card.Header>
                <h3 className="font-display text-2xl">INTERACTIVE</h3>
                <Badge variant="outline">HOVER</Badge>
              </Card.Header>
              <p className="text-text-muted text-sm">
                Card clickable. Pasa el cursor por encima.
              </p>
              <Card.Divider />
              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                cursor-pointer
              </p>
            </Card>
          </div>
        </section>

        {/* === SECTION: Section Header === */}
        <section>
          <SectionHeader
            eyebrow="04 · HEADERS"
            title="SECTION HEADER"
            subtitle="Patrón reutilizable de cabecera"
            action={<Button variant="ghost">Ver Todos ▶</Button>}
          />

          <Card className="mt-6">
            <SectionHeader
              eyebrow="EJEMPLO · SIZE MD"
              title="HEADER PEQUEÑO"
              subtitle="Para sub-secciones internas"
              size="md"
              action={<Button variant="ghost" size="sm">Más ▶</Button>}
            />
          </Card>
        </section>

        {/* === SECTION: Color tokens === */}
        <section>
          <SectionHeader
            eyebrow="05 · TOKENS"
            title="COLOR SYSTEM"
            subtitle="Design System V1.0"
          />

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="primary" hex="#E0162B" className="bg-primary" />
            <ColorSwatch name="primary-dark" hex="#C01225" className="bg-primary-dark" />
            <ColorSwatch name="success" hex="#00C853" className="bg-success" />
            <ColorSwatch name="danger" hex="#FF3B30" className="bg-danger" />
            <ColorSwatch name="warning" hex="#FFB800" className="bg-warning" />
            <ColorSwatch name="surface-1" hex="#141414" className="bg-surface-1 border border-border-strong" />
            <ColorSwatch name="surface-2" hex="#1F1F1F" className="bg-surface-2 border border-border-strong" />
            <ColorSwatch name="bg" hex="#0A0A0A" className="bg-bg border border-border-strong" />
          </div>
        </section>
      </main>

      {/* Footer del playground */}
      <footer className="border-t border-border mt-16 py-6">
        <p className="text-center font-mono text-[10px] tracking-widest uppercase text-text-dim">
          // END_OF_PLAYGROUND
        </p>
      </footer>
    </div>
  )
}

/**
 * Swatch interno para mostrar colores con su HEX.
 */
function ColorSwatch({ name, hex, className }) {
  return (
    <div className="space-y-2">
      <div className={`h-20 rounded-card ${className}`} />
      <div className="font-mono text-[10px] uppercase tracking-wider">
        <p className="text-text">{name}</p>
        <p className="text-text-muted">{hex}</p>
      </div>
    </div>
  )
}

export default App