import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Wrench, CircleDashed, PlayCircle, CheckCircle2 } from 'lucide-react'
import { mantenimientosApi } from '@/api/mantenimientos'

const ESTADOS = [
  {
    key: 'PENDIENTE',
    label: 'Pendiente',
    Icon: CircleDashed,
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-400/10',
    borderClass: 'border-amber-400/30',
  },
  {
    key: 'EN_CURSO',
    label: 'En Curso',
    Icon: PlayCircle,
    colorClass: 'text-blue-400',
    bgClass: 'bg-blue-400/10',
    borderClass: 'border-blue-400/30',
  },
  {
    key: 'COMPLETADO',
    label: 'Completado',
    Icon: CheckCircle2,
    colorClass: 'text-emerald-400',
    bgClass: 'bg-emerald-400/10',
    borderClass: 'border-emerald-400/30',
  },
]

export default function MantenimientosWidget() {
  const [counts, setCounts] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mantenimientosApi.list()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.content ?? [])
        const c = {}
        ESTADOS.forEach(({ key }) => {
          c[key] = list.filter((m) => m.estado === key).length
        })
        setCounts(c)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-surface-1 border border-border-strong rounded-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
            <Wrench size={16} />
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-text-muted">Operativa</p>
            <h3 className="font-display text-lg uppercase tracking-wide text-text">Mantenimientos</h3>
          </div>
        </div>
        <Link
          to="/dashboard/mantenimiento"
          className="font-mono text-[10px] tracking-widest uppercase text-primary hover:text-text transition-colors"
        >
          Ver todos →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ESTADOS.map(({ key, label, Icon, colorClass, bgClass, borderClass }) => (
          <div
            key={key}
            className={`flex flex-col items-center gap-2 rounded-inner border p-4 ${bgClass} ${borderClass}`}
          >
            <Icon size={20} className={colorClass} />
            {loading
              ? <div className="h-7 w-10 rounded bg-surface-2 animate-pulse" />
              : <span className={`font-display text-2xl font-bold ${colorClass}`}>{counts[key] ?? 0}</span>}
            <span className={`font-mono text-[9px] tracking-widest uppercase ${colorClass} opacity-80`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
