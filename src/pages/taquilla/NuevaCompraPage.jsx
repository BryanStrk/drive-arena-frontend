import { useState, useEffect, useCallback } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DayPicker } from 'react-day-picker'
import { format, parseISO, isValid, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, UserPlus, X, Plus, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import 'react-day-picker/style.css'

import { nuevaCompraSchema } from '@/lib/schemas/nuevaCompraSchema'
import { clientesApi } from '@/api/clientes'
import { atraccionesApi } from '@/api/atracciones'
import { tarifasApi } from '@/api/tarifas'
import { lodgesApi } from '@/api/lodges'
import { crearCompra } from '@/api/compras'
import { extractApiError } from '@/utils/extractApiError'
import ClienteFormModal from '@/components/clientes/ClienteFormModal'
import TicketModal from '@/components/taquilla/TicketModal'
import Button from '@/components/Button'
import { cn } from '@/lib/cn'

const PENSION_OPTS = [
  { value: 'SIN',      label: 'Sin pensión'   },
  { value: 'MEDIA',    label: 'Media pensión' },
  { value: 'COMPLETA', label: 'Completa'      },
]

const TIPO_LABELS = { ADULTO: 'Adulto', NINO: 'Niño', PENSIONISTA: 'Pensionista' }
const formatTipo = (tipo) => TIPO_LABELS[tipo] ?? tipo

// Format price: strip trailing .00 decimals, keep real ones (80.50 → "80,5€")
const fmtPrice = (v) =>
  v != null
    ? `${Number(v).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}€`
    : null

const EMPTY_LINEA = { circuitoId: '', tarifaId: '', cantidad: 1 }
const EMPTY_META  = { circuitoId: '', tarifas: [], tarifaIdSelected: '', cantidadLocal: 1 }

const DEFAULT_VALUES = {
  clienteId:    0,
  hotelId:      '',
  tipoPension:  'SIN',
  fechaEntrada: '',
  fechaSalida:  '',
  lineas:       [EMPTY_LINEA],
}

export default function NuevaCompraPage() {
  // ── Catálogos ──────────────────────────────────────────────
  const [atracciones, setAtracciones] = useState([])
  const [hoteles, setHoteles] = useState([])

  // per-line: circuitoId + tarifas loaded for that line
  const [lineasMeta, setLineasMeta] = useState([EMPTY_META])

  // ── Buscador de clientes ───────────────────────────────────
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [modalClienteOpen, setModalClienteOpen] = useState(false)

  // ── Fechas (estado local sincronizado con el form) ─────────
  const [fechaEntrada, setFechaEntrada] = useState('')
  const [fechaSalida, setFechaSalida] = useState('')

  // ── Éxito ──────────────────────────────────────────────────
  const [ticket, setTicket] = useState(null)
  const [ticketMeta, setTicketMeta] = useState({ cliente: null, hotel: null })

  // ── Lodge + pensión local — controlan visibilidad y estimación ──
  const [hotelIdLocal, setHotelIdLocal] = useState('')
  const [pensionLocal, setPensionLocal] = useState('SIN')

  // ── Form ───────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(nuevaCompraSchema),
    defaultValues: DEFAULT_VALUES,
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'lineas' })

  // ── Carga de catálogos ─────────────────────────────────────
  useEffect(() => {
    atraccionesApi.list().then(setAtracciones).catch(() => toast.error('No se pudieron cargar los circuitos'))
    lodgesApi.list().then(setHoteles).catch(() => toast.error('No se pudieron cargar los lodges'))
  }, [])

  // ── Debounce buscador clientes (300ms) ─────────────────────
  useEffect(() => {
    if (!query.trim() || query.length < 2) return
    const t = setTimeout(async () => {
      setBuscando(true)
      try {
        const data = await clientesApi.buscar(query)
        setResultados(data)
      } catch {
        setResultados([])
      } finally {
        setBuscando(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // ── Selección de cliente ───────────────────────────────────
  const seleccionarCliente = useCallback((c) => {
    setClienteSeleccionado(c)
    setValue('clienteId', c.id, { shouldValidate: true })
    setQuery('')
    setResultados([])
  }, [setValue])

  const limpiarCliente = () => {
    setClienteSeleccionado(null)
    setValue('clienteId', 0)
  }

  const handleCrearCliente = async (payload) => {
    try {
      const nuevo = await clientesApi.create(payload)
      toast.success('Cliente registrado')
      seleccionarCliente(nuevo)
      setModalClienteOpen(false)
      return nuevo
    } catch (err) {
      toast.error(extractApiError(err))
      throw err
    }
  }

  // ── Circuito change per line ───────────────────────────────
  const handleCircuitoChange = (index, circuitoId) => {
    setValue(`lineas.${index}.circuitoId`, circuitoId)
    setValue(`lineas.${index}.tarifaId`, '')
    setLineasMeta((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], circuitoId, tarifas: [], tarifaIdSelected: '' }
      return next
    })
    if (!circuitoId) return
    tarifasApi.list(circuitoId)
      .then((tarifas) =>
        setLineasMeta((prev) => {
          const next = [...prev]
          next[index] = { ...next[index], circuitoId, tarifas }
          return next
        })
      )
      .catch(() => toast.error('No se pudieron cargar las tarifas'))
  }

  const handleAddLinea = () => {
    append(EMPTY_LINEA)
    setLineasMeta((prev) => [...prev, EMPTY_META])
  }

  const handleRemoveLinea = (index) => {
    remove(index)
    setLineasMeta((prev) => prev.filter((_, i) => i !== index))
  }

  // ── Date range ─────────────────────────────────────────────
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const parsedFrom = fechaEntrada && isValid(parseISO(fechaEntrada)) ? parseISO(fechaEntrada) : undefined
  const parsedTo   = fechaSalida  && isValid(parseISO(fechaSalida))  ? parseISO(fechaSalida)  : undefined

  const handleDateSelect = (range) => {
    const entrada = range?.from ? format(range.from, 'yyyy-MM-dd') : ''
    const salida  = range?.to   ? format(range.to,   'yyyy-MM-dd') : ''
    setFechaEntrada(entrada)
    setFechaSalida(salida)
    setValue('fechaEntrada', entrada, { shouldValidate: true })
    setValue('fechaSalida',  salida,  { shouldValidate: true })
  }

  // ── Submit ─────────────────────────────────────────────────
  const onSubmit = async (data) => {
    const hasLodge = Boolean(data.hotelId)
    if (hasLodge && (!data.fechaEntrada || !data.fechaSalida)) {
      toast.error('Selecciona las fechas de estancia')
      return
    }
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    try {
      const payload = {
        clienteId:    data.clienteId,
        hotelId:      data.hotelId ? Number(data.hotelId) : null,
        tipoPension:  hasLodge ? data.tipoPension : 'SIN',
        fechaEntrada: hasLodge ? data.fechaEntrada : todayStr,
        fechaSalida:  hasLodge ? data.fechaSalida  : todayStr,
        entradas: data.lineas.flatMap((l) =>
          Array.from({ length: l.cantidad }, () => ({
            tarifaId:            Number(l.tarifaId),
            nombreAcompanante:   '',
            apellidosAcompanante: '',
          }))
        ),
      }
      const compra = await crearCompra(payload)
      toast.success('Compra registrada correctamente')

      const hotelSeleccionado = hoteles.find((h) => h.id === Number(data.hotelId))
      setTicketMeta({ cliente: clienteSeleccionado, hotel: hotelSeleccionado })
      setTicket(compra)

      reset(DEFAULT_VALUES)
      setClienteSeleccionado(null)
      setHotelIdLocal('')
      setPensionLocal('SIN')
      setLineasMeta([EMPTY_META])
      setFechaEntrada('')
      setFechaSalida('')
    } catch (err) {
      console.error('POST /api/compras error:', err.response?.data)
      toast.error(err.response?.data?.message ?? JSON.stringify(err.response?.data) ?? extractApiError(err))
    }
  }

  return (
    <div className="min-h-full bg-bg p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-primary">
          ▌ Taquilla · Nueva Compra
        </p>
        <h1 className="mt-2 font-display font-extrabold text-4xl tracking-tight text-text">
          Nueva Compra
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="max-w-5xl w-full space-y-6">

          {/* ── 1. CLIENTE ── */}
          <section className="bg-surface-1 border border-border-strong rounded-card p-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">▌ Cliente</p>

            {clienteSeleccionado ? (
              <div className="flex items-center justify-between bg-surface-2 border border-border-strong rounded-lg px-4 py-3">
                <div>
                  <p className="font-sans text-sm font-semibold text-text">
                    {clienteSeleccionado.nombre} {clienteSeleccionado.apellidos}
                  </p>
                  <p className="font-mono text-[11px] text-text-muted">
                    {clienteSeleccionado.dni} · {clienteSeleccionado.email}
                  </p>
                </div>
                <button type="button" onClick={limpiarCliente} className="text-text-muted hover:text-primary transition-colors" aria-label="Cambiar cliente">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      if (!e.target.value.trim() || e.target.value.length < 2) setResultados([])
                    }}
                    placeholder="Buscar por nombre, email o DNI..."
                    className="w-full pl-9 pr-4 py-3 bg-surface-2 text-text placeholder:text-text-dim border border-border-strong rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  />
                </div>

                {(resultados.length > 0 || buscando || (query.length >= 2 && !buscando)) && (
                  <div className="absolute z-10 mt-1 w-full bg-surface-1 border border-border-strong rounded-lg shadow-xl overflow-hidden">
                    {buscando && <p className="px-4 py-3 font-mono text-[11px] text-text-muted">Buscando...</p>}
                    {!buscando && resultados.length === 0 && query.length >= 2 && (
                      <div className="px-4 py-3">
                        <p className="font-sans text-sm text-text-muted mb-2">Sin resultados</p>
                        <button type="button" onClick={() => setModalClienteOpen(true)} className="flex items-center gap-2 font-sans text-sm text-primary hover:underline">
                          <UserPlus size={14} /> Registrar nuevo cliente
                        </button>
                      </div>
                    )}
                    {resultados.map((c) => (
                      <button key={c.id} type="button" onClick={() => seleccionarCliente(c)} className="w-full text-left px-4 py-3 hover:bg-surface-2 transition-colors border-b border-border-strong last:border-0">
                        <p className="font-sans text-sm text-text">{c.nombre} {c.apellidos}</p>
                        <p className="font-mono text-[11px] text-text-muted">{c.dni} · {c.email}</p>
                      </button>
                    ))}
                  </div>
                )}

                {errors.clienteId && (
                  <p className="mt-2 font-mono text-[10px] text-danger flex items-center gap-1.5"><span>▶</span> {errors.clienteId.message}</p>
                )}
                <button type="button" onClick={() => setModalClienteOpen(true)} className="mt-2 flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-text-muted hover:text-primary transition-colors">
                  <UserPlus size={12} /> Registrar nuevo cliente
                </button>
              </div>
            )}
          </section>

          {/* ── 2. ALOJAMIENTO (opcional) ── */}
          <section className="bg-surface-1 border border-border-strong rounded-card p-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">▌ Alojamiento</p>
            <div>
              <label className="block font-sans text-sm font-medium text-text mb-2">Lodge</label>
              <select
                {...register('hotelId')}
                onChange={(e) => {
                  setValue('hotelId', e.target.value, { shouldValidate: true, shouldDirty: true })
                  setHotelIdLocal(e.target.value)
                  if (e.target.value) {
                    setValue('tipoPension', 'MEDIA')
                    setPensionLocal('MEDIA')
                  } else {
                    setValue('tipoPension', 'SIN')
                    setPensionLocal('SIN')
                  }
                }}
                className="w-full sm:w-72 px-4 py-3 bg-surface-2 text-text border border-border-strong rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              >
                <option value="">Sin alojamiento</option>
                {hoteles.map((h) => {
                  const mp = fmtPrice(h.precioMediaPension)
                  const pc = fmtPrice(h.precioPensionCompleta)
                  const prices = [mp && `MP ${mp}`, pc && `PC ${pc}`].filter(Boolean).join(' · ')
                  return (
                    <option key={h.id} value={h.id}>
                      {h.nombre}{prices ? ` · ${prices}` : ''}
                    </option>
                  )
                })}
              </select>
            </div>
          </section>

          {/* ── 3. ENTRADAS (lista dinámica) ── */}
          <section className="bg-surface-1 border border-border-strong rounded-card p-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">▌ Entradas</p>

            <div className="space-y-3">
              {fields.map((field, index) => {
                const meta = lineasMeta[index] ?? EMPTY_META
                const lineaErrors = errors.lineas?.[index]
                return (
                  <div key={field.id} className="bg-surface-2 border border-border-strong rounded-inner p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-text-muted">
                        Entrada {index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveLinea(index)}
                        disabled={fields.length === 1}
                        className="text-text-muted hover:text-danger transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Eliminar entrada"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {/* Circuito */}
                      <div>
                        <label className="block font-sans text-xs font-medium text-text mb-1.5">Circuito</label>
                        <select
                          value={meta.circuitoId}
                          onChange={(e) => handleCircuitoChange(index, e.target.value)}
                          className="w-full px-3 py-2.5 bg-surface-1 text-text border border-border-strong rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        >
                          <option value="">Seleccionar...</option>
                          {atracciones.map((a) => (
                            <option key={a.id} value={a.id}>{a.nombre}</option>
                          ))}
                        </select>
                      </div>

                      {/* Tarifa */}
                      <div>
                        <label className={cn('block font-sans text-xs font-medium mb-1.5', meta.circuitoId ? 'text-text' : 'text-text-dim')}>
                          Tarifa <span className="text-primary">*</span>
                        </label>
                        <select
                          {...register(`lineas.${index}.tarifaId`)}
                          disabled={!meta.circuitoId}
                          onChange={(e) => {
                            setValue(`lineas.${index}.tarifaId`, e.target.value, { shouldValidate: true })
                            setLineasMeta((prev) => {
                              const next = [...prev]
                              next[index] = { ...next[index], tarifaIdSelected: e.target.value }
                              return next
                            })
                          }}
                          className={cn(
                            'w-full px-3 py-2.5 bg-surface-1 text-text border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed',
                            lineaErrors?.tarifaId ? 'border-danger' : 'border-border-strong'
                          )}
                        >
                          <option value="">{meta.circuitoId ? 'Seleccionar...' : 'Elige un circuito primero'}</option>
                          {meta.tarifas.map((t) => (
                            <option key={t.id} value={t.id}>
                              {formatTipo(t.tipo)} · {t.precio != null ? `${t.precio}€` : '—'}
                            </option>
                          ))}
                        </select>
                        {lineaErrors?.tarifaId && (
                          <p className="mt-1 font-mono text-[10px] text-danger">▶ {lineaErrors.tarifaId.message}</p>
                        )}
                      </div>

                      {/* Cantidad */}
                      <div>
                        <label className="block font-sans text-xs font-medium text-text mb-1.5">
                          Cantidad <span className="text-primary">*</span>
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          {...register(`lineas.${index}.cantidad`)}
                          onChange={(e) => {
                            setValue(`lineas.${index}.cantidad`, e.target.value, { shouldValidate: true })
                            setLineasMeta((prev) => {
                              const next = [...prev]
                              next[index] = { ...next[index], cantidadLocal: parseInt(e.target.value, 10) || 0 }
                              return next
                            })
                          }}
                          className={cn(
                            'w-full px-3 py-2.5 bg-surface-1 text-text border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                            lineaErrors?.cantidad ? 'border-danger' : 'border-border-strong'
                          )}
                        />
                        {lineaErrors?.cantidad && (
                          <p className="mt-1 font-mono text-[10px] text-danger">▶ {lineaErrors.cantidad.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {typeof errors.lineas?.message === 'string' && (
              <p className="mt-3 font-mono text-[10px] text-danger">▶ {errors.lineas.message}</p>
            )}

            <button
              type="button"
              onClick={handleAddLinea}
              className="mt-4 flex items-center gap-2 font-mono text-[11px] tracking-wider text-text-muted hover:text-primary transition-colors"
            >
              <Plus size={14} /> Añadir entrada
            </button>
          </section>

          {/* ── 4. TIPO DE PENSIÓN (solo si hay lodge) ── */}
          {hotelIdLocal && (
            <section className="bg-surface-1 border border-border-strong rounded-card p-6">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">▌ Detalles</p>
              <div>
                <p className="font-sans text-sm font-medium text-text mb-3">
                  Tipo de pensión <span className="text-primary">*</span>
                </p>
                <div className="flex flex-col gap-2">
                  {PENSION_OPTS.filter((o) => o.value !== 'SIN').map(({ value, label }) => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        value={value}
                        {...register('tipoPension')}
                        onChange={(e) => {
                          setValue('tipoPension', e.target.value)
                          setPensionLocal(e.target.value)
                        }}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="font-sans text-sm text-text-muted group-hover:text-text transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
                {errors.tipoPension && (
                  <p className="mt-2 font-mono text-[10px] text-danger">▶ {errors.tipoPension.message}</p>
                )}
              </div>
            </section>
          )}

          {/* ── 5. FECHAS DE ESTANCIA (solo si hay lodge) ── */}
          {hotelIdLocal && (
            <section className="bg-surface-1 border border-border-strong rounded-card p-6">
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-1">▌ Fechas de estancia</p>
              {(errors.fechaEntrada || errors.fechaSalida) && (
                <p className="mb-3 font-mono text-[10px] text-danger">
                  ▶ {errors.fechaEntrada?.message || errors.fechaSalida?.message}
                </p>
              )}
              <div className="w-full overflow-x-auto">
                <DayPicker
                  mode="range"
                  selected={{ from: parsedFrom, to: parsedTo }}
                  onSelect={handleDateSelect}
                  disabled={{ before: today }}
                  locale={es}
                  weekStartsOn={1}
                  numberOfMonths={2}
                  showOutsideDays
                  captionLayout="label"
                />
              </div>
              {(fechaEntrada || fechaSalida) && (
                <p className="mt-2 font-mono text-[11px] text-text-muted">
                  {fechaEntrada && `Entrada: ${fechaEntrada}`}
                  {fechaEntrada && fechaSalida && ' · '}
                  {fechaSalida && `Salida: ${fechaSalida}`}
                </p>
              )}
            </section>
          )}

          {/* ── 6. RESUMEN DE PRECIO ── */}
          {(() => {
            const subtotalEntradas = lineasMeta.reduce((sum, meta) => {
              if (!meta.tarifaIdSelected || !meta.tarifas.length) return sum
              const tarifa = meta.tarifas.find((t) => t.id === Number(meta.tarifaIdSelected))
              if (tarifa?.precio == null) return sum
              return sum + Number(tarifa.precio) * (meta.cantidadLocal || 1)
            }, 0)
            if (subtotalEntradas === 0) return null

            const hotelObj = hoteles.find((h) => h.id === Number(hotelIdLocal))
            const pxn = hotelObj
              ? (pensionLocal === 'MEDIA' ? hotelObj.precioMediaPension : hotelObj.precioPensionCompleta)
              : null
            const noches = (fechaEntrada && fechaSalida)
              ? differenceInDays(parseISO(fechaSalida), parseISO(fechaEntrada))
              : 0
            const subtotalAloj = (pxn && noches > 0) ? Number(pxn) * noches : 0
            const total = subtotalEntradas + subtotalAloj

            return (
              <section className="bg-surface-1 border border-border-strong rounded-card p-6">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">▌ Resumen</p>
                <div className="space-y-2">
                  <div className="flex justify-between font-sans text-sm text-text-muted">
                    <span>Subtotal entradas</span>
                    <span className="font-mono">{fmtPrice(subtotalEntradas)}</span>
                  </div>
                  {subtotalAloj > 0 && (
                    <div className="flex justify-between font-sans text-sm text-text-muted">
                      <span>Alojamiento ({noches} {noches === 1 ? 'noche' : 'noches'} × {fmtPrice(pxn)})</span>
                      <span className="font-mono">{fmtPrice(subtotalAloj)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 mt-1 border-t border-border-strong">
                    <span className="font-display font-bold text-base text-text">Total estimado</span>
                    <span className="font-display font-bold text-base text-primary">{fmtPrice(total)}</span>
                  </div>
                </div>
              </section>
            )
          })()}

          {/* ── 7. SUBMIT ── */}
          <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? 'Registrando...' : 'Registrar Compra'}
          </Button>
        </div>
      </form>

      <ClienteFormModal
        isOpen={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        cliente={null}
        createCliente={handleCrearCliente}
        updateCliente={() => {}}
      />

      <TicketModal
        compra={ticket}
        cliente={ticketMeta.cliente}
        hotel={ticketMeta.hotel}
        onClose={() => setTicket(null)}
      />
    </div>
  )
}
