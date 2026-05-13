import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DayPicker } from 'react-day-picker'
import { format, parseISO, isValid } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, UserPlus, X } from 'lucide-react'
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
import Input from '@/components/Input'
import Button from '@/components/Button'
import { cn } from '@/lib/cn'

const PENSION_OPTS = [
  { value: 'SIN', label: 'Sin pensión' },
  { value: 'MEDIA', label: 'Media pensión' },
  { value: 'COMPLETA', label: 'Completa' },
]

const DEFAULT_VALUES = {
  clienteId: 0,
  hotelId: '',
  tarifaId: '',
  tipoPension: 'SIN',
  fechaEntrada: '',
  fechaSalida: '',
  numEntradas: 1,
}

export default function NuevaCompraPage() {
  // ── Catálogos ──────────────────────────────────────────────
  const [atracciones, setAtracciones] = useState([])
  const [tarifas, setTarifas] = useState([])
  const [hoteles, setHoteles] = useState([])
  const [atraccionId, setAtraccionId] = useState('')

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
  const [ticketMeta, setTicketMeta] = useState({ cliente: null, hotel: null, tarifa: null })

  // Seguimiento local del lodge seleccionado para controlar el disabled
  // de Circuito/Tarifa sin usar watch() (que el linter rechaza)
  const [hotelIdLocal, setHotelIdLocal] = useState('')

  // ── Form ───────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(nuevaCompraSchema),
    defaultValues: DEFAULT_VALUES,
  })


  // ── Carga de catálogos ─────────────────────────────────────
  useEffect(() => {
    atraccionesApi.list().then(setAtracciones).catch(() => toast.error('No se pudieron cargar los circuitos'))
    lodgesApi.list().then(setHoteles).catch(() => toast.error('No se pudieron cargar los lodges'))
  }, [])

  useEffect(() => {
    if (!atraccionId) return
    tarifasApi.list(atraccionId)
      .then(setTarifas)
      .catch(() => toast.error('No se pudieron cargar las tarifas'))
  }, [atraccionId])

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

  // ── Selección de cliente desde resultados ──────────────────
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

  // ── Crear cliente desde el modal ───────────────────────────
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

  // ── Date range ─────────────────────────────────────────────
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const parsedFrom = fechaEntrada && isValid(parseISO(fechaEntrada)) ? parseISO(fechaEntrada) : undefined
  const parsedTo = fechaSalida && isValid(parseISO(fechaSalida)) ? parseISO(fechaSalida) : undefined

  const handleDateSelect = (range) => {
    const entrada = range?.from ? format(range.from, 'yyyy-MM-dd') : ''
    const salida = range?.to ? format(range.to, 'yyyy-MM-dd') : ''
    setFechaEntrada(entrada)
    setFechaSalida(salida)
    setValue('fechaEntrada', entrada, { shouldValidate: true })
    setValue('fechaSalida', salida, { shouldValidate: true })
  }

  // ── Submit ─────────────────────────────────────────────────
  const onSubmit = async (data) => {
    try {
      const payload = {
        clienteId: data.clienteId,
        hotelId: data.hotelId ? Number(data.hotelId) : null,
        tipoPension: data.tipoPension,
        fechaEntrada: data.fechaEntrada,
        fechaSalida: data.fechaSalida,
        entradas: Array.from({ length: data.numEntradas }, () => ({
          tarifaId: Number(data.tarifaId),
          nombreAcompanante: '',
          apellidosAcompanante: '',
        })),
      }
      const compra = await crearCompra(payload)
      toast.success('Compra registrada correctamente')

      const hotelSeleccionado = hoteles.find((h) => h.id === Number(data.hotelId))
      const tarifaSeleccionada = tarifas.find((t) => t.id === Number(data.tarifaId))
      setTicketMeta({ cliente: clienteSeleccionado, hotel: hotelSeleccionado, tarifa: tarifaSeleccionada })
      setTicket(compra)

      reset(DEFAULT_VALUES)
      setClienteSeleccionado(null)
      setHotelIdLocal('')
      setAtraccionId('')
      setTarifas([])
      setFechaEntrada('')
      setFechaSalida('')
    } catch (err) {
      console.error('POST /api/compras error:', err.response?.data)
      toast.error(err.response?.data?.message ?? JSON.stringify(err.response?.data) ?? extractApiError(err))
    }
  }

  const handleCerrarTicket = () => setTicket(null)

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

          {/* ── CLIENTE ── */}
          <section className="bg-surface-1 border border-border-strong rounded-card p-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">
              ▌ Cliente
            </p>

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
                <button
                  type="button"
                  onClick={limpiarCliente}
                  className="text-text-muted hover:text-primary transition-colors"
                  aria-label="Cambiar cliente"
                >
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

                {/* Resultados */}
                {(resultados.length > 0 || buscando || (query.length >= 2 && !buscando)) && (
                  <div className="absolute z-10 mt-1 w-full bg-surface-1 border border-border-strong rounded-lg shadow-xl overflow-hidden">
                    {buscando && (
                      <p className="px-4 py-3 font-mono text-[11px] text-text-muted">Buscando...</p>
                    )}
                    {!buscando && resultados.length === 0 && query.length >= 2 && (
                      <div className="px-4 py-3">
                        <p className="font-sans text-sm text-text-muted mb-2">Sin resultados</p>
                        <button
                          type="button"
                          onClick={() => setModalClienteOpen(true)}
                          className="flex items-center gap-2 font-sans text-sm text-primary hover:underline"
                        >
                          <UserPlus size={14} />
                          Registrar nuevo cliente
                        </button>
                      </div>
                    )}
                    {resultados.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => seleccionarCliente(c)}
                        className="w-full text-left px-4 py-3 hover:bg-surface-2 transition-colors border-b border-border-strong last:border-0"
                      >
                        <p className="font-sans text-sm text-text">{c.nombre} {c.apellidos}</p>
                        <p className="font-mono text-[11px] text-text-muted">{c.dni} · {c.email}</p>
                      </button>
                    ))}
                  </div>
                )}

                {errors.clienteId && (
                  <p className="mt-2 font-mono text-[10px] text-danger flex items-center gap-1.5">
                    <span>▶</span> {errors.clienteId.message}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => setModalClienteOpen(true)}
                  className="mt-2 flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-text-muted hover:text-primary transition-colors"
                >
                  <UserPlus size={12} />
                  Registrar nuevo cliente
                </button>
              </div>
            )}
          </section>

          {/* ── LODGE + CIRCUITO + TARIFA ── */}
          <section className="bg-surface-1 border border-border-strong rounded-card p-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">
              ▌ Producto
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Lodge — opcional */}
              <div>
                <label className="block font-sans text-sm font-medium text-text mb-2">
                  Lodge
                </label>
                <select
                  {...register('hotelId')}
                  onChange={(e) => {
                    setValue('hotelId', e.target.value, { shouldValidate: true, shouldDirty: true })
                    setHotelIdLocal(e.target.value)
                  }}
                  className="w-full px-4 py-3 bg-surface-2 text-text border border-border-strong rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="">Sin alojamiento</option>
                  {hoteles.map((h) => (
                    <option key={h.id} value={h.id}>{h.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Circuito — independiente del lodge */}
              <div>
                <label className="block font-sans text-sm font-medium text-text mb-2">
                  Circuito
                </label>
                <select
                  value={atraccionId}
                  onChange={(e) => {
                    setAtraccionId(e.target.value)
                    setTarifas([])
                    setValue('tarifaId', '')
                  }}
                  className="w-full px-4 py-3 bg-surface-2 text-text border border-border-strong rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                >
                  <option value="">Seleccionar...</option>
                  {atracciones.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Tarifa — requiere circuito */}
              <div>
                <label className={cn(
                  'block font-sans text-sm font-medium mb-2',
                  atraccionId ? 'text-text' : 'text-text-dim'
                )}>
                  Tarifa <span className="text-primary">*</span>
                </label>
                <select
                  {...register('tarifaId')}
                  disabled={!atraccionId}
                  className={cn(
                    'w-full px-4 py-3 bg-surface-2 text-text border rounded-lg font-sans text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:opacity-40 disabled:cursor-not-allowed',
                    errors.tarifaId ? 'border-danger' : 'border-border-strong'
                  )}
                >
                  <option value="">
                    {atraccionId ? 'Seleccionar...' : 'Elige un circuito primero'}
                  </option>
                  {tarifas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre} {t.precio != null ? `· € ${t.precio}` : ''}
                    </option>
                  ))}
                </select>
                {errors.tarifaId && (
                  <p className="mt-2 font-mono text-[10px] text-danger">▶ {errors.tarifaId.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* ── PENSIÓN + ENTRADAS ── */}
          <section className="bg-surface-1 border border-border-strong rounded-card p-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-4">
              ▌ Detalles
            </p>
            <div className="grid gap-6 grid-cols-2">
              {/* Tipo pensión */}
              <div>
                <p className="font-sans text-sm font-medium text-text mb-3">
                  Tipo de pensión <span className="text-primary">*</span>
                </p>
                <div className="flex flex-col gap-2">
                  {PENSION_OPTS.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        value={value}
                        {...register('tipoPension')}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="font-sans text-sm text-text-muted group-hover:text-text transition-colors">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.tipoPension && (
                  <p className="mt-2 font-mono text-[10px] text-danger">▶ {errors.tipoPension.message}</p>
                )}
              </div>

              {/* Num entradas */}
              <div>
                <Input
                  label="Número de entradas"
                  required
                  type="number"
                  min={1}
                  max={20}
                  error={errors.numEntradas?.message}
                  {...register('numEntradas')}
                />
              </div>
            </div>
          </section>

          {/* ── FECHAS ── */}
          <section className="bg-surface-1 border border-border-strong rounded-card p-6">
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted mb-1">
              ▌ Fechas de estancia
            </p>
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

          {/* ── SUBMIT ── */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? 'Registrando...' : 'Registrar Compra'}
          </Button>
        </div>
      </form>

      {/* Modal nuevo cliente */}
      <ClienteFormModal
        isOpen={modalClienteOpen}
        onClose={() => setModalClienteOpen(false)}
        cliente={null}
        createCliente={handleCrearCliente}
        updateCliente={() => {}}
      />

      {/* Ticket de éxito */}
      <TicketModal
        compra={ticket}
        cliente={ticketMeta.cliente}
        hotel={ticketMeta.hotel}
        tarifa={ticketMeta.tarifa}
        onClose={handleCerrarTicket}
      />
    </div>
  )
}
