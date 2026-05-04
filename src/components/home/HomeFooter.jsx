import { Camera, Volume2, Play } from 'lucide-react'

/**
 * Footer rico específico del Home público.
 * 4 columnas con marca + 3 grupos de links + iconos sociales.
 */
function HomeFooter() {
  return (
    <footer
      aria-label="Footer principal"
      className="border-t border-primary/40 px-6 py-12"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1 - Marca */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display font-extrabold text-2xl tracking-tight">
              DRIVE ARENA
            </h3>
            <p className="font-mono text-[10px] tracking-widest uppercase text-text-muted mt-3 leading-relaxed">
              © 2026 Drive Arena Resort
              <br />
              All Rights Reserved
            </p>
          </div>

          {/* Col 2 - Explorar */}
          <FooterColumn title="Explorar">
            <FooterLink href="#experiencias">Experiencias</FooterLink>
            <FooterLink href="#ranking">Ranking</FooterLink>
            <FooterLink href="#packs">Circuitos</FooterLink>
          </FooterColumn>

          {/* Col 3 - Contacto */}
          <FooterColumn title="Contacto">
            <FooterLink href="#">Contacto</FooterLink>
            <FooterLink href="#">Legal</FooterLink>
            <FooterLink href="#">Privacidad</FooterLink>
          </FooterColumn>

          {/* Col 4 - Social */}
          <FooterColumn title="Síguenos">
            <div className="flex gap-3 mt-1">
              <SocialIcon label="Instagram">
                <Camera className="w-4 h-4" />
              </SocialIcon>
              <SocialIcon label="Spotify">
                <Volume2 className="w-4 h-4" />
              </SocialIcon>
              <SocialIcon label="YouTube">
                <Play className="w-4 h-4" />
              </SocialIcon>
            </div>
          </FooterColumn>
        </div>
      </div>
    </footer>
  )
}

/* === Sub-componentes internos === */

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">
        {title}
      </h4>
      <ul className="space-y-2.5" role="list">
        {Array.isArray(children) ? (
          children.map((child, idx) => <li key={idx}>{child}</li>)
        ) : (
          <li>{children}</li>
        )}
      </ul>
    </div>
  )
}

function FooterLink({ href, children }) {
  return (
    <a
      href={href}
      className="font-sans text-sm text-text hover:text-primary transition-colors"
    >
      {children}
    </a>
  )
}

function SocialIcon({ label, children }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="w-9 h-9 flex items-center justify-center rounded-inner border border-border-strong text-text-muted hover:text-primary hover:border-primary transition-colors"
    >
      {children}
    </a>
  )
}

export default HomeFooter