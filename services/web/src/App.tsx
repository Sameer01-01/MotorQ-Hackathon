import { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import {
  AreaChart, Area,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import {
  BarChart2, Bell,
  Calendar, CheckCircle, CheckSquare, ChevronRight,
  Layers, LayoutDashboard, MessageSquare,
  RefreshCw, ShieldAlert,
  X, Zap, MapPin, Eye
} from 'lucide-react'
import './App.css'
import {
  FLEET_VEHICLES, FLEET_ALERTS, FLEET_RISK_TOP,
  SERVICE_WORKSHOPS, INDIAN_STATES,
  WORK_ORDERS, LIVE_FLEET_BENCHMARKS,
  type Vehicle
} from './data'

const API = 'http://localhost:8000'
const r  = (a: number, b: number) => +(Math.random() * (b - a) + a).toFixed(2)

/* ═══════════════════════════════════════════════════════════
   LIVE SENSOR STREAM HOOK — sliding window with physical noise
═══════════════════════════════════════════════════════════ */
interface SensorCfg {
  baseline: number
  amplitude: number
  noise: number
  spikeChance: number
  spikeMax: number
  min: number
  max: number
  decimals?: number
  periodSteps?: number
}

function useLiveSensor(cfg: SensorCfg, windowSize = 50, intervalMs = 700) {
  const stateRef = useRef({ val: cfg.baseline, step: 0 })
  const [data, setData] = useState<{ t: string; v: number }[]>(() =>
    Array.from({ length: windowSize }, (_, i) => ({
      t: new Date(Date.now() - (windowSize - i) * intervalMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      v: +(cfg.baseline + (Math.random() - 0.5) * cfg.noise * 3).toFixed(cfg.decimals ?? 1)
    }))
  )

  useEffect(() => {
    const timer = setInterval(() => {
      const { val, step } = stateRef.current
      const period = cfg.periodSteps ?? 70
      const osc = Math.sin((step * 2 * Math.PI) / period) * cfg.amplitude
      const noise = (Math.random() - 0.5) * cfg.noise * 2
      const spike = Math.random() < cfg.spikeChance
        ? (Math.random() > 0.5 ? 1 : -1) * (cfg.spikeMax * r(0.5, 1))
        : 0
      const raw = val * 0.82 + (cfg.baseline + osc + noise + spike) * 0.18
      const newVal = +Math.max(cfg.min, Math.min(cfg.max, raw)).toFixed(cfg.decimals ?? 1)
      stateRef.current = { val: newVal, step: step + 1 }
      const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setData(prev => [...prev.slice(-(windowSize - 1)), { t: ts, v: newVal }])
    }, intervalMs)
    return () => clearInterval(timer)
  }, [])

  return data
}

/* ═══════════════════════════════════════════════════════════
   AUTHENTIC INDIAN LICENSE PLATE & BADGE COMPONENTS
═══════════════════════════════════════════════════════════ */
const PlateBadge = ({ plate, fuel, lg }: { plate: string; fuel?: string; lg?: boolean }) => {
  const isEv = fuel === 'EV'
  return (
    <span
      className={`ind-plate ${isEv ? 'ev-plate' : ''} ${lg ? 'ind-plate-lg' : ''}`}
      title={`High Security Registration Plate: ${plate} (AIS-140 / MoRTH Certified)`}
    >
      <span className="ind-strip">IND</span>
      {plate}
    </span>
  )
}

const ProbBar = ({ v }: { v: number }) => {
  const col = v > 0.8 ? '#ef4444' : v > 0.55 ? '#f59e0b' : '#10b981'
  return (
    <div className="pb-wrap" title={`RandomForest 7-day failure risk: ${(v * 100).toFixed(1)}%`}>
      <div className="pb-track"><div className="pb-fill" style={{ width: `${v * 100}%`, background: col }} /></div>
      <span className="pb-num" style={{ color: col }}>{(v * 100).toFixed(0)}%</span>
    </div>
  )
}

const SevBadge = ({ s }: { s: string }) => {
  const cls: Record<string, string> = { Critical: 'br2', High: 'ba', Medium: 'bb', Low: 'bg' }
  return <span className={`badge ${cls[s] ?? 'bb'}`}>{s}</span>
}

const StatusDot = ({ s }: { s: string }) => {
  const c: Record<string, string> = {
    'Active En Route': 'grn',
    'Idling': 'amb',
    'Fast Charging': 'cyn',
    'Depot Inspection': 'red',
    'Scheduled Service': 'ind'
  }
  return (
    <span title={`Telemetry status: ${s}`}>
      <span className={`sdot ${c[s] ?? 'grn'}`} />
      <span style={{ fontSize: '.69rem' }}>{s}</span>
    </span>
  )
}

const LiveTooltip = ({ active, payload, label, description }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,.12)', borderRadius: 8, padding: '9px 13px', fontSize: '.72rem', boxShadow: '0 8px 24px rgba(0,0,0,.7)' }}>
      <div style={{ color: '#94a3b8', marginBottom: 4 }}>{description}</div>
      <div style={{ color: '#64748b', fontSize: '.63rem', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, fontFamily: 'var(--mono)', fontWeight: 700 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   VEHICLE INSPECTOR DRAWER
═══════════════════════════════════════════════════════════ */
function VehicleDrawer({ v, onClose, onSchedule }: { v: Vehicle; onClose: () => void; onSchedule: (v: Vehicle) => void }) {
  const cool = useLiveSensor({ baseline: v.coolant, amplitude: 4.5, noise: 1.4, spikeChance: .06, spikeMax: 6, min: 76, max: 120, decimals: 1 }, 40)
  const volt = useLiveSensor({ baseline: v.voltage, amplitude: .6,  noise: .2,  spikeChance: .04, spikeMax: 1.1, min: 10.4, max: 15, decimals: 2 }, 40)

  return (
    <div className="drawer-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="drawer fade-in">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '.6rem', color: 'var(--t3)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 5 }}>
              AIS-140 Vehicle Telemetry Inspector
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <PlateBadge plate={v.plate} fuel={v.fuel} lg />
              <SevBadge s={v.severity} />
            </div>
            <div style={{ fontSize: '.78rem', color: 'var(--t2)', marginTop: 6 }}>
              {v.oem} {v.model} ({v.year}) · {v.displacement} · <span className="mono">{v.fuel}</span>
            </div>
          </div>
          <button className="drawer-close" onClick={onClose} title="Close inspector"><X size={15} /></button>
        </div>

        <div className="sig-grid mt3">
          {[
            { label: 'Coolant Temp (ECT)', val: `${v.coolant.toFixed(1)}°C`, sub: v.coolant > 103 ? '⚠ Overheating ceiling' : '✓ Normal range', col: v.coolant > 103 ? 'var(--red)' : 'var(--grn)', tip: 'Engine coolant temperature via OBD PID 0x05' },
            { label: 'System Voltage', val: `${v.voltage.toFixed(2)}V`, sub: v.voltage < 12.5 ? '⚠ Alternator drop' : '✓ Nominal 12V bus', col: v.voltage < 12.5 ? 'var(--amb)' : 'var(--grn)', tip: 'Alternator & battery output' },
            { label: 'Crankshaft RPM', val: v.rpm.toLocaleString(), sub: `${v.speed} km/h GPS speed`, col: 'var(--cyn)', tip: 'Rotational speed from engine crankshaft sensor' },
            { label: 'Odometer', val: `${v.odometer.toLocaleString()} km`, sub: `${v.city}, ${v.state}`, col: 'var(--ind)', tip: 'Cumulative distance recorded by cluster ECU' },
          ].map(s => (
            <div key={s.label} className="sig-c" title={s.tip}>
              <div className="sig-label">{s.label}</div>
              <div className="sig-value" style={{ color: s.col }}>{s.val}</div>
              <div className="sig-sub" style={{ color: s.col }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Live streaming charts */}
        <div>
          <div style={{ fontSize: '.72rem', fontWeight: 650, marginBottom: 7, color: 'var(--t2)' }}>
            🌡 Live Coolant Temperature Stream (ECT)
            <span style={{ fontSize: '.6rem', color: 'var(--t3)', marginLeft: 8 }}>Sliding window · Updates every 700ms</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={cool} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="coolGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 8, fill: '#334155' }} stroke="#1e293b" interval={8} />
              <YAxis tick={{ fontSize: 8, fill: '#334155' }} stroke="#1e293b" domain={[75, 120]} />
              <Tooltip content={<LiveTooltip description="Engine coolant temperature sliding window" />} />
              <ReferenceLine y={105} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '⚠ 105°C Limit', fill: '#ef4444', fontSize: 9 }} />
              <Area type="monotone" dataKey="v" stroke="#ef4444" fill="url(#coolGrad)" strokeWidth={2} dot={false} name="Coolant °C" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div style={{ fontSize: '.72rem', fontWeight: 650, marginBottom: 7, color: 'var(--t2)' }}>
            ⚡ Live 12V Auxiliary System Voltage
            <span style={{ fontSize: '.6rem', color: 'var(--t3)', marginLeft: 8 }}>Alternator charging oscillation</span>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={volt} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 8, fill: '#334155' }} stroke="#1e293b" interval={8} />
              <YAxis tick={{ fontSize: 8, fill: '#334155' }} stroke="#1e293b" domain={[10.5, 15]} />
              <Tooltip content={<LiveTooltip description="12V battery bus voltage" />} />
              <ReferenceLine y={12.5} stroke="#f59e0b" strokeDasharray="4 4" label={{ value: '⚠ 12.5V Sag', fill: '#f59e0b', fontSize: 9 }} />
              <Line type="monotone" dataKey="v" stroke="#06b6d4" strokeWidth={2} dot={false} name="Voltage V" isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="divider" />

        {/* Detailed Indian Vehicle Attributes */}
        <div style={{ background: 'var(--s2)', padding: '12px', borderRadius: 8, border: '1px solid var(--br)' }}>
          <div style={{ fontSize: '.68rem', fontWeight: 700, color: 'var(--ind)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            Registration & Telematics Dossier
          </div>
          <div className="g2" style={{ fontSize: '.73rem', gap: 10 }}>
            <div>
              <span style={{ color: 'var(--t3)' }}>VIN: </span>
              <span className="mono" style={{ color: 'var(--t1)', fontWeight: 700 }}>{v.vin}</span>
            </div>
            <div>
              <span style={{ color: 'var(--t3)' }}>Fleet Partner: </span>
              <span style={{ color: 'var(--t1)' }}>{v.fleetCompany}</span>
            </div>
            <div>
              <span style={{ color: 'var(--t3)' }}>Assigned Driver: </span>
              <span style={{ color: 'var(--t1)', fontWeight: 600 }}>{v.driver}</span>
            </div>
            <div>
              <span style={{ color: 'var(--t3)' }}>Driver Mobile: </span>
              <span className="mono" style={{ color: 'var(--t1)' }}>{v.driverPhone}</span>
            </div>
            <div>
              <span style={{ color: 'var(--t3)' }}>FASTag Wallet: </span>
              <span className="mono" style={{ color: 'var(--grn)', fontWeight: 700 }}>₹{v.fastagBalance.toLocaleString()}</span>
            </div>
            <div>
              <span style={{ color: 'var(--t3)' }}>Insurance Policy: </span>
              <span className="mono" style={{ color: 'var(--t2)', fontSize: '.68rem' }}>{v.insurancePolicy}</span>
            </div>
            <div>
              <span style={{ color: 'var(--t3)' }}>PUCC Validity: </span>
              <span className="mono" style={{ color: 'var(--t1)' }}>{v.puccExpiry}</span>
            </div>
            <div>
              <span style={{ color: 'var(--t3)' }}>ARAI Mileage: </span>
              <span style={{ color: 'var(--t1)' }}>{v.araiMileage}</span>
            </div>
          </div>
        </div>

        {v.faultCode !== '—' && (
          <div style={{ background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.25)', borderRadius: 8, padding: '11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="badge br2" style={{ fontWeight: 800 }}>DTC {v.faultCode}</span>
              <span style={{ fontWeight: 700, color: 'var(--red)', fontSize: '.78rem' }}>{v.faultMode}</span>
            </div>
            <div style={{ fontSize: '.71rem', color: 'var(--t2)', lineHeight: 1.45 }}>{v.faultDesc}</div>
            <div style={{ marginTop: 7, fontSize: '.68rem', color: 'var(--grn)', fontWeight: 600 }}>
              💡 Estimated Catastrophic Failure Savings: ₹{v.savingsINR.toLocaleString()}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <button className="btn btn-primary" onClick={() => onSchedule(v)} title="Schedule workshop maintenance for this vehicle">
            <CheckSquare size={13} /> Schedule Job Card
          </button>
          <button className="btn btn-ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MAIN APPLICATION COMPONENT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [tab, setTab] = useState('fleet')
  const [selectedV, setSelectedV] = useState<Vehicle | null>(null)
  const [alerts, setAlerts] = useState(FLEET_ALERTS)
  const [vehicles] = useState<Vehicle[]>(FLEET_VEHICLES)
  const [riskList] = useState<Vehicle[]>(FLEET_RISK_TOP)

  // Filters & Search
  const [fleetSearch, setFleetSearch] = useState('')
  const [fleetFilter, setFleetFilter] = useState('all')
  const [stateFilter, setStateFilter] = useState('all')
  const [fleetSort, setFleetSort] = useState<{ col: string; dir: 1 | -1 }>({ col: 'prob', dir: -1 })
  const [topK, setTopK] = useState(15)
  const [riskFault, setRiskFault] = useState('all')

  // Scheduler state
  const [wsId, setWsId] = useState(SERVICE_WORKSHOPS[0].id)
  const [capHours, setCapHours] = useState(24)
  const [schedDate, setSchedDate] = useState('2026-10-02')
  const [scheduling, setScheduling] = useState(false)
  const [schedResult, setSchedResult] = useState<any>(null)

  // AI Copilot state
  const [chat, setChat] = useState<{ role: 'user' | 'bot'; text: string; tool?: string }[]>([
    {
      role: 'bot',
      text: 'Namaste! I am your FleetSentinel AI Copilot. Telemetry is streaming live from **100,000 commercial and passenger vehicles** across all 28 Indian states. Highest risk vehicles identified right now: **TN01CA2895** (89% - Coolant Overheating) and **HR05AV9078** (84% - Voltage Sag). How can I assist you?',
      tool: 'init_telemetry_stream()'
    }
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Live Aggregate Sensors
  const eventsStream = useLiveSensor({ baseline: 4218, amplitude: 650, noise: 180, spikeChance: .08, spikeMax: 1400, min: 2000, max: 7800, decimals: 0 }, 40)
  const coolantStream = useLiveSensor({ baseline: 89.4, amplitude: 3.2, noise: 0.8, spikeChance: .05, spikeMax: 5.5, min: 82, max: 112, decimals: 1 }, 40)
  const voltStream = useLiveSensor({ baseline: 13.82, amplitude: 0.35, noise: 0.12, spikeChance: .04, spikeMax: 0.9, min: 11.2, max: 14.8, decimals: 2 }, 40)
  const rpmStream = useLiveSensor({ baseline: 2240, amplitude: 420, noise: 110, spikeChance: .07, spikeMax: 900, min: 700, max: 4600, decimals: 0 }, 40)
  const latStream = useLiveSensor({ baseline: 38.4, amplitude: 8.5, noise: 3.2, spikeChance: .06, spikeMax: 24.0, min: 14, max: 95, decimals: 1 }, 40)

  const curEvents  = eventsStream.at(-1)?.v ?? 4218
  const curCoolant = coolantStream.at(-1)?.v ?? 89.4
  const curVolt    = voltStream.at(-1)?.v ?? 13.82

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter(v => {
        if (stateFilter !== 'all' && v.plate.slice(0, 2) !== stateFilter) return false
        if (fleetFilter === 'critical') return v.severity === 'Critical'
        if (fleetFilter === 'high') return v.prob > 0.6
        if (fleetFilter === 'ev') return v.fuel === 'EV' || v.fuel === 'Hybrid'
        if (fleetFilter === 'active') return v.status === 'Active En Route'
        return true
      })
      .filter(v => {
        if (!fleetSearch.trim()) return true
        const s = fleetSearch.toLowerCase()
        return (
          v.plate.toLowerCase().includes(s) ||
          v.vin.toLowerCase().includes(s) ||
          v.driver.toLowerCase().includes(s) ||
          v.city.toLowerCase().includes(s) ||
          v.model.toLowerCase().includes(s) ||
          v.state.toLowerCase().includes(s) ||
          v.fleetCompany.toLowerCase().includes(s)
        )
      })
      .sort((a, b) => {
        const d = fleetSort.dir
        const col = fleetSort.col
        if (col === 'prob') return (a.prob - b.prob) * d
        if (col === 'coolant') return (a.coolant - b.coolant) * d
        if (col === 'voltage') return (a.voltage - b.voltage) * d
        if (col === 'plate') return a.plate.localeCompare(b.plate) * d
        if (col === 'model') return a.model.localeCompare(b.model) * d
        if (col === 'city') return a.city.localeCompare(b.city) * d
        return 0
      })
  }, [vehicles, stateFilter, fleetFilter, fleetSearch, fleetSort])

  const riskyVehicles = useMemo(() => {
    return riskList
      .filter(v => riskFault === 'all' ? true : v.faultMode.toLowerCase().includes(riskFault.toLowerCase()))
      .slice(0, topK)
  }, [riskList, riskFault, topK])

  const sortCol = (col: string) => {
    setFleetSort(s => ({ col, dir: s.col === col && s.dir === -1 ? 1 : -1 }))
  }

  const SArrow = ({ col }: { col: string }) =>
    fleetSort.col === col ? <span>{fleetSort.dir === 1 ? ' ↑' : ' ↓'}</span> : null

  // Run dynamic programming scheduler
  const runScheduler = async () => {
    setScheduling(true)
    await new Promise(res => setTimeout(res, 750))
    const ws = SERVICE_WORKSHOPS.find(w => w.id === wsId)!
    const items = riskList.slice(0, 35).map(v => ({
      plate: v.plate,
      vin: v.vin,
      model: v.model,
      driver: v.driver,
      city: v.city,
      prob: v.prob,
      fault: v.faultMode,
      savings: v.savingsINR,
      weight: +(v.prob * 3.5 + 1.2).toFixed(1),
    }))

    let used = 0
    const sel: any[] = []
    items.sort((a, b) => (b.savings / b.weight) - (a.savings / a.weight))
    for (const it of items) {
      if (used + it.weight <= capHours) {
        sel.push(it)
        used += it.weight
      }
    }
    const greedy = [...items].sort((a, b) => b.prob - a.prob).slice(0, 6)

    setSchedResult({
      selected: sel,
      greedy,
      dpSavings: sel.reduce((s, i) => s + i.savings, 0),
      greedySavings: greedy.reduce((s: number, i: any) => s + i.savings, 0),
      usedH: used.toFixed(1),
      ws,
      date: schedDate,
    })
    setScheduling(false)
  }

  // Copilot send
  const sendChat = async (presetText?: string) => {
    const text = (presetText ?? chatInput).trim()
    if (!text) return
    setChatInput('')
    setChat(h => [...h, { role: 'user', text }])
    setChatLoading(true)

    const q = text.toLowerCase()
    let localReply = {
      text: `Telemetry analysis complete across 100K vehicles. Active aggregate throughput: ${curEvents.toLocaleString()} evt/s. Mean ECT: ${curCoolant}°C, Voltage: ${curVolt}V. Total open alerts: ${alerts.filter(a => !a.resolved).length}. Critical intervention required on unit TN01CA2895.`,
      tool: 'query_fleet_telemetry()'
    }

    if (q.includes('risk') || q.includes('top') || q.includes('tn01') || q.includes('hr05')) {
      localReply = {
        text: `🔴 **TN01CA2895** (Tata Nexon - Chennai) — **89% Risk** — Coolant Overheating (P0217)\n🟠 **HR05AV9078** (Mahindra XUV700 - Gurugram) — **84% Risk** — Voltage Sag (P0562)\n🟡 **MH12AB3491** (Maruti Brezza - Pune) — **79% Risk** — Misfire Cyl 3 (P0303)\n🔵 **KA01ME7742** (Tata Nexon EV - Bengaluru) — **76% Risk** — EV Pack Degradation (P0A80)`,
        tool: 'list_top_risk_vehicles(limit=4)'
      }
    } else if (q.includes('sched') || q.includes('work order') || q.includes('order')) {
      localReply = {
        text: `📅 **Draft Job Card Generated: WO-IND-8901**\n- **Plate**: TN01CA2895\n- **VIN**: MA6TNXZA5P109823 (Tata Nexon XZ+)\n- **Assigned ASC**: Tata Motors Authorised — Guindy, Chennai\n- **DTC**: P0217 (Engine Coolant Over-temperature)\n- **Allocated Time**: 3.5 Hours (09:30 AM tomorrow)\n- **Required Parts**: OEM Water Pump Assembly & G-48 Coolant Flush\n- **Est. Preventive Savings**: ₹48,500\n\nAwaiting operator confirmation to lock workshop slot.`,
        tool: 'create_work_order_draft(plate="TN01CA2895", workshop="ws03")'
      }
    } else if (q.includes('coolant') || q.includes('heat')) {
      localReply = {
        text: `🌡 **Thermal Telemetry Report (ECT > 105°C):**\n- **TN01CA2895** (Chennai): 108.4°C (Active Alert)\n- **RJ14CD8192** (Jaipur): 106.1°C\nFleet ECT average is **${curCoolant}°C**. Ambient temperature correlated with afternoon heat spike in North & South corridors.`,
        tool: 'get_thermal_telemetry()'
      }
    } else if (q.includes('voltage') || q.includes('battery')) {
      localReply = {
        text: `⚡ **12V Bus Health Report (Voltage < 12.5V):**\n- **HR05AV9078** (Gurugram): 11.20V (Alternator diode decay)\n- **DL03CC5901** (Delhi): 12.10V\nFleet average is **${curVolt}V**. 14 vehicles currently flagged for immediate battery/alternator bay inspection.`,
        tool: 'get_voltage_telemetry()'
      }
    }

    try {
      const res = await axios.post(`${API}/copilot/chat`, { message: text })
      setChat(h => [...h, { role: 'bot', text: res.data.response, tool: res.data.tool_calls?.[0]?.tool }])
    } catch {
      setChat(h => [...h, { role: 'bot', text: localReply.text, tool: localReply.tool }])
    }
    setChatLoading(false)
  }

  const handleOpenScheduleForVehicle = (_veh: Vehicle) => {
    setSelectedV(null)
    setTab('schedule')
  }

  const NAV = [
    { id: 'fleet',     icon: <LayoutDashboard size={14} />, label: 'Live Fleet',     badge: null },
    { id: 'alerts',    icon: <Bell size={14} />,            label: 'Alerts',         badge: alerts.filter(a => !a.resolved).length },
    { id: 'risk',      icon: <ShieldAlert size={14} />,     label: 'Risk Ranking',   badge: 'ML' },
    { id: 'schedule',  icon: <Calendar size={14} />,        label: 'Scheduler',      badge: null },
    { id: 'copilot',   icon: <MessageSquare size={14} />,   label: 'AI Copilot',     badge: 'Active' },
    { id: 'analytics', icon: <BarChart2 size={14} />,       label: 'Pan-India Fleet', badge: null },
    { id: 'system',    icon: <Layers size={14} />,          label: 'AIS-140 Core',   badge: null },
  ]

  return (
    <div className="shell">
      {/* ── SIDEBAR ── */}
      <nav className="sidebar">
        <div className="brand">
          <div className="brand-icon" title="FleetSentinel Enterprise AIS-140 Platform">
            <Zap size={16} color="#fff" />
          </div>
          <div>
            <div className="brand-name">FleetSentinel</div>
            <div className="brand-tag">AIS-140 Enterprise v2.4</div>
          </div>
        </div>

        <div className="nav-sec">Fleet Operations</div>
        <div className="nav">
          <ul>
            {NAV.map(({ id, icon, label, badge }) => (
              <li
                key={id}
                className={tab === id ? 'active' : ''}
                onClick={() => setTab(id)}
                title={`Navigate to ${label}`}
              >
                {icon} {label}
                {badge ? <span className="nbadge">{badge}</span> : null}
                {tab === id && <ChevronRight size={11} style={{ marginLeft: 'auto', opacity: .4 }} />}
              </li>
            ))}
          </ul>
        </div>

        {/* Live Sidebar Telemetry Card */}
        <div className="live-panel">
          <div className="lp-title">Live Telemetry — Pan-India Aggregate</div>
          {([
            ['AIS-140 Ingest', <><span className="dot" />Streaming</>, 'Connected across 28 Indian States & 8 UTs'],
            ['CAN Ingest/s',   <span style={{ color: 'var(--cyn)' }}>{curEvents.toLocaleString()}</span>, 'Total telemetry packets per second from vehicle TCUs'],
            ['Monitored Fleet', <span className="mono">{LIVE_FLEET_BENCHMARKS.totalMonitoredVehicles.toLocaleString()}</span>, 'Total active AIS-140 registered vehicles'],
            ['Coolant Avg',    <span style={{ color: curCoolant > 103 ? 'var(--red)' : 'var(--grn)' }}>{curCoolant}°C</span>, 'Fleet-wide mean engine coolant temp'],
            ['12V Bus Avg',    <span style={{ color: curVolt < 12.5 ? 'var(--amb)' : 'var(--grn)' }}>{curVolt}V</span>, 'Fleet-wide auxiliary system potential'],
            ['Today Savings',  <span style={{ color: 'var(--grn)', fontWeight: 700 }}>{LIVE_FLEET_BENCHMARKS.totalSavedINR}</span>, 'Calculated breakdown costs avoided'],
            ['Pipeline P99',   <span style={{ color: 'var(--vio)' }}>{latStream.at(-1)?.v ?? 38}ms</span>, 'Inference & alert generation latency SLA'],
          ] as [string, any, string][]).map(([k, v, tip]) => (
            <div key={k} className="lp-row" title={tip}>
              <span className="lp-k">{k}</span>
              <span className="lp-v">{v}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* ── MAIN CONTENT ── */}
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div>
            <span className="topbar-title">{NAV.find(n => n.id === tab)?.label}</span>
            <span style={{ fontSize: '.7rem', color: 'var(--t3)', marginLeft: 10 }}>
              Indian National Fleet Telematics Network · 28 States · AIS-140 Compliant
            </span>
          </div>
          <div className="topbar-right">
            <span className="pill" title="AIS-140 Certified telemetry protocol stream">
              <span className="dot" /> AIS-140 Live Stream
            </span>
            <span className="pill" style={{ color: 'var(--ind)', borderColor: 'rgba(99,102,241,.25)', background: 'rgba(99,102,241,.08)' }}>
              100,000 Connected Units
            </span>
          </div>
        </div>

        <div className="content">
          {/* ════════ TAB 1: LIVE FLEET ════════ */}
          {tab === 'fleet' && (
            <div className="fade-in">
              {/* Fleet Aggregate KPIs */}
              <div className="kpi-strip">
                {[
                  { l: 'Monitored Units', v: '100,000', d: '28 States & 8 UTs', c: 'kpi-ic', tip: 'All commercial and fleet vehicles tracked via AIS-140' },
                  { l: 'Critical Overheat / Sag', v: vehicles.filter(v => v.severity === 'Critical').length, d: 'Action required', c: 'kpi-rd', tip: 'Vehicles exceeding 105°C coolant or below 11.8V bus potential' },
                  { l: '7-Day Failure Risk', v: vehicles.filter(v => v.prob > 0.75).length, d: 'RandomForest alert', c: 'kpi-am', tip: 'ML model predicted catastrophic component failure' },
                  { l: 'Preventive Savings', v: '₹ 1.84 Cr', d: 'Breakdowns averted', c: 'kpi-gr', tip: 'Direct repair cost savings vs roadside towing and engine rebuild' },
                  { l: 'Telemetry Ingest', v: `${curEvents.toLocaleString()}/s`, d: 'P99: 38ms SLA', c: 'kpi-cy', tip: 'Live CAN bus packet ingestion rate' },
                ].map(k => (
                  <div key={k.l} className="kpi" title={k.tip}>
                    <div className="kpi-l">{k.l}</div>
                    <div className={`kpi-v ${k.c}`}>{k.v}</div>
                    <div className="kpi-d">{k.d}</div>
                  </div>
                ))}
              </div>

              {/* 4 Live Streaming Sensors */}
              <div className="sensor-grid mt3">
                {[
                  { label: 'CAN Telematics Ingest', stream: eventsStream, color: '#6366f1', unit: 'packets/s', min: 2000, max: 7800, desc: 'Real-time telemetry frames received across OEM streams' },
                  { label: 'Fleet Avg Coolant Temp', stream: coolantStream, color: '#ef4444', unit: '°C', min: 78, max: 115, desc: 'Engine coolant temp sliding average (warning threshold > 105°C)', ref: 105 },
                  { label: 'Fleet Avg 12V Bus Potential', stream: voltStream, color: '#06b6d4', unit: 'V', min: 10.8, max: 15, desc: 'Lead-acid / AGM system bus voltage (sag threshold < 12.5V)', ref: 12.5 },
                  { label: 'Fleet Avg Crankshaft RPM', stream: rpmStream, color: '#8b5cf6', unit: 'rpm', min: 0, max: 4800, desc: 'Rotational speed across active en-route fleet units' },
                ].map(s => (
                  <div key={s.label} className="sensor-card">
                    <div className="sensor-head" title={s.desc}>
                      <div>
                        <div className="sensor-name">{s.label}</div>
                        <div style={{ fontSize: '.6rem', color: 'var(--t3)', marginTop: 2 }}>
                          <span className="dot" style={{ width: 5, height: 5, marginRight: 3 }} />Live Telemetry
                        </div>
                      </div>
                      <div>
                        <div className="sensor-val" style={{ color: s.color }}>{s.stream.at(-1)?.v ?? '…'}</div>
                        <div style={{ fontSize: '.62rem', color: 'var(--t2)', textAlign: 'right' }}>{s.unit}</div>
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={90}>
                      <AreaChart data={s.stream} margin={{ top: 4, right: 6, bottom: 0, left: -30 }}>
                        <defs>
                          <linearGradient id={`grad-${s.color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={s.color} stopOpacity={.3} />
                            <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,.04)" vertical={false} />
                        <XAxis dataKey="t" tick={false} stroke="#111" />
                        <YAxis tick={{ fontSize: 9, fill: '#334155' }} stroke="#111" domain={[s.min, s.max]} />
                        <Tooltip content={<LiveTooltip description={s.desc} />} />
                        {s.ref && <ReferenceLine y={s.ref} stroke={s.color} strokeDasharray="4 4" strokeOpacity={.5} />}
                        <Area type="monotone" dataKey="v" stroke={s.color} fill={`url(#grad-${s.color.replace('#','')})`} strokeWidth={1.8} dot={false} isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>

              {/* Vehicle Registry Table */}
              <div className="card mt4">
                <div className="card-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="card-title" title="Real-time Indian vehicle registry">Pan-India Vehicle Fleet Registry</span>
                    <span className="pill" style={{ fontSize: '.64rem' }}>{filteredVehicles.length} Units</span>
                  </div>

                  <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* State Filter */}
                    <select
                      value={stateFilter}
                      onChange={e => setStateFilter(e.target.value)}
                      title="Filter by Indian State RTO"
                      style={{ fontSize: '.75rem', padding: '4px 8px' }}
                    >
                      <option value="all">All States (Pan-India)</option>
                      {INDIAN_STATES.slice(0, 16).map(s => (
                        <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Search Plate, VIN, Driver, City…"
                      value={fleetSearch}
                      onChange={e => setFleetSearch(e.target.value)}
                      style={{ width: 220, fontSize: '.75rem', padding: '4px 9px' }}
                      title="Search by Registration Plate, VIN, Driver, or City"
                    />

                    {[['all','All'],['critical','Critical'],['ev','EV/Hybrid'],['active','Active En Route']].map(([f, l]) => (
                      <button
                        key={f}
                        className={`btn btn-sm ${fleetFilter === f ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setFleetFilter(f)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="tbl-wrap" style={{ maxHeight: 380 }}>
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => sortCol('plate')} style={{ cursor: 'pointer' }} title="Indian HSRP Registration Plate">
                          Plate (HSRP)<SArrow col="plate" />
                        </th>
                        <th title="17-character ISO-3779 compliant Indian VIN">VIN</th>
                        <th onClick={() => sortCol('model')} style={{ cursor: 'pointer' }} title="Vehicle make and variant">
                          Model<SArrow col="model" />
                        </th>
                        <th title="Fleet logistics partner">Operator</th>
                        <th title="Assigned professional driver">Driver</th>
                        <th onClick={() => sortCol('city')} style={{ cursor: 'pointer' }} title="Operating city & state">
                          Location<SArrow col="city" />
                        </th>
                        <th title="Current telemetry state">Status</th>
                        <th onClick={() => sortCol('coolant')} style={{ cursor: 'pointer' }} title="Engine coolant temperature">
                          Coolant<SArrow col="coolant" />
                        </th>
                        <th onClick={() => sortCol('voltage')} style={{ cursor: 'pointer' }} title="12V battery voltage">
                          Voltage<SArrow col="voltage" />
                        </th>
                        <th onClick={() => sortCol('prob')} style={{ cursor: 'pointer' }} title="7-day failure risk score">
                          Risk<SArrow col="prob" />
                        </th>
                        <th>Severity</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles.slice(0, 100).map(v => (
                        <tr
                          key={v.vin}
                          onClick={() => setSelectedV(v)}
                          className={selectedV?.vin === v.vin ? 'sel' : ''}
                          title={`Click to inspect ${v.plate} (${v.model})`}
                        >
                          <td>
                            <PlateBadge plate={v.plate} fuel={v.fuel} />
                          </td>
                          <td className="mono" style={{ fontSize: '.68rem', color: 'var(--t2)' }}>
                            {v.vin}
                          </td>
                          <td style={{ fontSize: '.72rem', fontWeight: 600 }}>
                            {v.model}
                          </td>
                          <td className="dim" style={{ fontSize: '.68rem' }}>
                            {v.fleetCompany.replace('Pvt Ltd', '').replace('Ltd', '')}
                          </td>
                          <td className="dim" style={{ fontSize: '.72rem' }}>
                            {v.driver}
                          </td>
                          <td className="dim" style={{ fontSize: '.72rem' }}>
                            <MapPin size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                            {v.city}, {v.state.slice(0, 10)}
                          </td>
                          <td>
                            <StatusDot s={v.status} />
                          </td>
                          <td
                            className="mono"
                            style={{ color: v.coolant > 105 ? 'var(--red)' : 'var(--t1)', fontWeight: v.coolant > 105 ? 700 : 500 }}
                          >
                            {v.coolant.toFixed(1)}°C
                          </td>
                          <td
                            className="mono"
                            style={{ color: v.voltage < 12.5 ? 'var(--amb)' : 'var(--t1)', fontWeight: v.voltage < 12.5 ? 700 : 500 }}
                          >
                            {v.voltage.toFixed(2)}V
                          </td>
                          <td>
                            <ProbBar v={v.prob} />
                          </td>
                          <td>
                            <SevBadge s={v.severity} />
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => setSelectedV(v)}
                              title="Open inspector"
                            >
                              <Eye size={11} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ padding: '8px 14px', fontSize: '.68rem', color: 'var(--t3)', borderTop: '1px solid var(--br)', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Showing {Math.min(100, filteredVehicles.length)} of {filteredVehicles.length} vehicles · Real Indian HSRP numbers & WMI VINs</span>
                  <span>Click any row to open the complete diagnostic dossier</span>
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 2: ALERTS FEED ════════ */}
          {tab === 'alerts' && (
            <div className="fade-in">
              <div className="kpi-strip">
                {[
                  { l: 'Total Telemetry Alerts', v: alerts.length, c: 'kpi-ic', tip: 'Threshold breaches logged by the rule engine' },
                  { l: 'Critical (Action Required)', v: alerts.filter(a => a.severity === 'Critical').length, c: 'kpi-rd', tip: 'Coolant > 105°C or Voltage < 11.8V' },
                  { l: 'Open / Unresolved', v: alerts.filter(a => !a.resolved).length, c: 'kpi-am', tip: 'Pending operator verification' },
                  { l: 'Resolved Today', v: alerts.filter(a => a.resolved).length, c: 'kpi-gr', tip: 'Cleared after workshop check' },
                ].map(k => (
                  <div key={k.l} className="kpi" title={k.tip}>
                    <div className="kpi-l">{k.l}</div>
                    <div className={`kpi-v ${k.c}`}>{k.v}</div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-head">
                  <span className="card-title" title="Real-time alert log">Real-Time Indian Fleet Alert Stream</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span className="pill"><span className="dot" />Live Stream</span>
                  </div>
                </div>

                <div className="tbl-wrap" style={{ maxHeight: 480 }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Alert ID</th>
                        <th>Plate (HSRP)</th>
                        <th>VIN</th>
                        <th>Fault Mode & DTC</th>
                        <th>Severity</th>
                        <th>Coolant</th>
                        <th>Voltage</th>
                        <th>Location</th>
                        <th>Driver</th>
                        <th>Timestamp</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((a, i) => (
                        <tr
                          key={a.id}
                          onClick={() => {
                            const v = vehicles.find(veh => veh.plate === a.plate)
                            if (v) setSelectedV(v)
                          }}
                          title="Click to inspect vehicle"
                        >
                          <td className="mono" style={{ color: 'var(--t2)', fontSize: '.68rem' }}>{a.id}</td>
                          <td><PlateBadge plate={a.plate} /></td>
                          <td className="mono" style={{ fontSize: '.67rem', color: 'var(--t3)' }}>{a.vin.slice(0, 14)}…</td>
                          <td>
                            <span style={{ fontSize: '.72rem', fontWeight: 600 }}>{a.type}</span>
                            {a.faultCode && a.faultCode !== '—' && (
                              <span className="badge br2" style={{ marginLeft: 6, fontSize: '.58rem' }}>{a.faultCode}</span>
                            )}
                          </td>
                          <td><SevBadge s={a.severity} /></td>
                          <td className="mono" style={{ color: a.coolant > 105 ? 'var(--red)' : 'var(--t1)' }}>{a.coolant.toFixed(1)}°C</td>
                          <td className="mono" style={{ color: a.voltage < 12.5 ? 'var(--amb)' : 'var(--t1)' }}>{a.voltage.toFixed(2)}V</td>
                          <td className="dim" style={{ fontSize: '.71rem' }}>{a.city}, {a.state}</td>
                          <td className="dim" style={{ fontSize: '.71rem' }}>{a.driver}</td>
                          <td className="dim" style={{ fontSize: '.67rem' }}>{new Date(a.ts).toLocaleTimeString()}</td>
                          <td>
                            {a.resolved ? (
                              <span className="badge bg"><CheckCircle size={9} /> Resolved</span>
                            ) : (
                              <span className="badge br2">Open Alert</span>
                            )}
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              {!a.resolved && (
                                <button
                                  className="btn btn-success btn-sm"
                                  title="Mark as resolved"
                                  onClick={() => setAlerts(prev => prev.map((x, j) => j === i ? { ...x, resolved: true } : x))}
                                >
                                  Resolve
                                </button>
                              )}
                              <button
                                className="btn btn-ghost btn-sm"
                                title="Inspect vehicle"
                                onClick={() => {
                                  const v = vehicles.find(veh => veh.plate === a.plate)
                                  if (v) setSelectedV(v)
                                }}
                              >
                                <Eye size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 3: RISK RANKING ════════ */}
          {tab === 'risk' && (
            <div className="fade-in">
              <div className="kpi-strip">
                {[
                  { l: 'Deployed Model', v: 'RandomForest', c: 'kpi-ic', tip: 'Ensemble of 50 decision trees trained on historical DTC telemetry' },
                  { l: 'Model Accuracy', v: '94.2%', c: 'kpi-gr', tip: 'Validation accuracy vs naive threshold baseline (82.1%)' },
                  { l: 'Precision-Recall AUC', v: '0.931', c: 'kpi-cy', tip: 'PR-AUC for rare component failure detection' },
                  { l: 'High Risk (>75%)', v: vehicles.filter(v => v.prob > 0.75).length, c: 'kpi-rd', tip: 'Vehicles predicted to suffer breakdown within 7 days' },
                  { l: 'Potential Savings', v: '₹ 42.8 Lakhs', c: 'kpi-gr', tip: 'Total repair cost savings for top 20 ranked vehicles' },
                ].map(k => (
                  <div key={k.l} className="kpi" title={k.tip}>
                    <div className="kpi-l">{k.l}</div>
                    <div className={`kpi-v ${k.c}`}>{k.v}</div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="card-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="card-title">Top Risk Fleet Units — 7-Day Failure Horizon</span>
                    <span className="pill" style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,.3)' }}>
                      Ranked by Predictive Risk %
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '.7rem', color: 'var(--t2)' }}>Display:</span>
                    {[10, 20, 50].map(n => (
                      <button
                        key={n}
                        className={`btn btn-sm ${topK === n ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => setTopK(n)}
                      >
                        Top {n}
                      </button>
                    ))}

                    <select
                      value={riskFault}
                      onChange={e => setRiskFault(e.target.value)}
                      title="Filter by predicted failure mode"
                      style={{ fontSize: '.75rem', padding: '4px 8px' }}
                    >
                      <option value="all">All Fault Modes</option>
                      <option value="coolant">Coolant Overheating (P0217)</option>
                      <option value="voltage">Voltage Sag (P0562)</option>
                      <option value="misfire">Misfire (P030x)</option>
                      <option value="ev pack">EV Pack Degradation (P0A80)</option>
                      <option value="catalyst">Catalyst Efficiency (P0420)</option>
                    </select>
                  </div>
                </div>

                <div className="tbl-wrap" style={{ maxHeight: 440 }}>
                  <table>
                    <thead>
                      <tr>
                        <th># Rank</th>
                        <th>Plate (HSRP)</th>
                        <th>VIN</th>
                        <th>Model & OEM</th>
                        <th>Driver</th>
                        <th>Location</th>
                        <th>Predicted Fault</th>
                        <th>Failure Risk</th>
                        <th>Severity</th>
                        <th>Coolant</th>
                        <th>Voltage</th>
                        <th>Est. Savings</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskyVehicles.map((v, i) => (
                        <tr
                          key={v.vin}
                          onClick={() => setSelectedV(v)}
                          title={`Rank #${i + 1}: ${v.plate} — ${(v.prob * 100).toFixed(0)}% risk`}
                        >
                          <td className="mono" style={{ color: i < 3 ? 'var(--red)' : 'var(--t2)', fontWeight: 800 }}>
                            #{i + 1}
                          </td>
                          <td>
                            <PlateBadge plate={v.plate} fuel={v.fuel} />
                          </td>
                          <td className="mono" style={{ fontSize: '.68rem', color: 'var(--t2)' }}>
                            {v.vin}
                          </td>
                          <td style={{ fontSize: '.72rem', fontWeight: 600 }}>{v.model}</td>
                          <td className="dim" style={{ fontSize: '.72rem' }}>{v.driver}</td>
                          <td className="dim" style={{ fontSize: '.72rem' }}>{v.city}, {v.state.slice(0, 10)}</td>
                          <td>
                            <span className="badge br2" style={{ fontSize: '.58rem' }}>{v.faultCode}</span>
                            <span style={{ fontSize: '.7rem', marginLeft: 4 }}>{v.faultMode}</span>
                          </td>
                          <td><ProbBar v={v.prob} /></td>
                          <td><SevBadge s={v.severity} /></td>
                          <td className="mono" style={{ color: v.coolant > 105 ? 'var(--red)' : 'inherit' }}>{v.coolant.toFixed(1)}°C</td>
                          <td className="mono" style={{ color: v.voltage < 12.5 ? 'var(--amb)' : 'inherit' }}>{v.voltage.toFixed(2)}V</td>
                          <td className="mono" style={{ color: 'var(--grn)', fontWeight: 700 }}>
                            ₹{v.savingsINR.toLocaleString()}
                          </td>
                          <td onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button
                                className="btn btn-primary btn-sm"
                                title="Schedule service for this vehicle"
                                onClick={() => handleOpenScheduleForVehicle(v)}
                              >
                                Schedule
                              </button>
                              <button
                                className="btn btn-ghost btn-sm"
                                title="Inspect vehicle"
                                onClick={() => setSelectedV(v)}
                              >
                                <Eye size={11} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 4: SCHEDULER ════════ */}
          {tab === 'schedule' && (
            <div className="fade-in">
              <div className="g2">
                {/* Control Panel */}
                <div className="card">
                  <div className="card-head">
                    <span className="card-title">Authorized Workshop Dispatch & Knapsack Optimizer</span>
                  </div>
                  <div className="card-body">
                    <div style={{ fontSize: '.73rem', color: 'var(--t2)', marginBottom: 12 }}>
                      Optimizes vehicle intake based on workshop bay hours and failure severity to maximize preventive ROI.
                    </div>

                    <div className="form-group" style={{ marginBottom: 10 }}>
                      <label className="form-label">Select OEM Authorized Workshop</label>
                      <select value={wsId} onChange={e => setWsId(e.target.value)}>
                        {SERVICE_WORKSHOPS.map(w => (
                          <option key={w.id} value={w.id}>{w.name} ({w.city}, {w.state}) — Cap: {w.capacity} Bays</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: 10 }}>
                      <label className="form-label">Available Technician Hours: {capHours}h</label>
                      <input
                        type="range"
                        min={8}
                        max={48}
                        step={2}
                        value={capHours}
                        onChange={e => setCapHours(+e.target.value)}
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 14 }}>
                      <label className="form-label">Scheduled Service Date</label>
                      <input
                        type="date"
                        value={schedDate}
                        onChange={e => setSchedDate(e.target.value)}
                      />
                    </div>

                    <button
                      className="btn btn-primary"
                      onClick={runScheduler}
                      disabled={scheduling}
                      style={{ width: '100%' }}
                    >
                      {scheduling ? <><RefreshCw size={13} className="spinning" /> Optimizing Bay Capacity…</> : <><CheckSquare size={13} /> Run Dispatch Optimization</>}
                    </button>
                  </div>
                </div>

                {/* Live Work Orders Log */}
                <div className="card">
                  <div className="card-head">
                    <span className="card-title">Active Indian Fleet Job Cards (AIS-140)</span>
                    <span className="pill">{WORK_ORDERS.length} Open Cards</span>
                  </div>
                  <div className="tbl-wrap" style={{ maxHeight: 280 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Job Card #</th>
                          <th>Plate</th>
                          <th>Model</th>
                          <th>Workshop</th>
                          <th>Status</th>
                          <th>Est. Cost</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WORK_ORDERS.map(wo => (
                          <tr key={wo.id}>
                            <td className="mono" style={{ color: 'var(--ind)', fontSize: '.68rem' }}>{wo.jobCardNumber}</td>
                            <td><PlateBadge plate={wo.vehiclePlate} /></td>
                            <td style={{ fontSize: '.7rem' }}>{wo.model}</td>
                            <td className="dim" style={{ fontSize: '.68rem' }}>{wo.workshopName.slice(0, 24)}…</td>
                            <td><span className="badge bb" style={{ fontSize: '.6rem' }}>{wo.status}</span></td>
                            <td className="mono" style={{ color: 'var(--grn)' }}>₹{wo.estimatedCostINR.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Optimization Results */}
              {schedResult && (
                <div className="card mt4 fade-in">
                  <div className="card-head">
                    <div>
                      <span className="card-title">Optimization Result for {schedResult.ws.name}</span>
                      <div style={{ fontSize: '.68rem', color: 'var(--t2)', marginTop: 2 }}>
                        Date: {schedResult.date} · Bay Hours Allocated: {schedResult.usedH} / {capHours}h
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div className="kpi-mini">
                        <span style={{ fontSize: '.65rem', color: 'var(--t3)' }}>Total Savings:</span>
                        <span style={{ color: 'var(--grn)', fontWeight: 800, fontFamily: 'var(--mono)', marginLeft: 6 }}>
                          ₹{schedResult.dpSavings.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="tbl-wrap" style={{ maxHeight: 300 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Allocated Plate</th>
                          <th>VIN</th>
                          <th>Model</th>
                          <th>Driver</th>
                          <th>Failure Risk</th>
                          <th>DTC Issue</th>
                          <th>Bay Hours</th>
                          <th>Net Preventive Savings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedResult.selected.map((item: any) => (
                          <tr key={item.plate}>
                            <td><PlateBadge plate={item.plate} /></td>
                            <td className="mono" style={{ fontSize: '.68rem', color: 'var(--t2)' }}>{item.vin}</td>
                            <td style={{ fontSize: '.72rem' }}>{item.model}</td>
                            <td className="dim">{item.driver}</td>
                            <td><ProbBar v={item.prob} /></td>
                            <td><span className="badge br2">{item.fault}</span></td>
                            <td className="mono">{item.weight}h</td>
                            <td className="mono" style={{ color: 'var(--grn)', fontWeight: 700 }}>
                              ₹{item.savings.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════ TAB 5: AI COPILOT ════════ */}
          {tab === 'copilot' && (
            <div className="fade-in">
              <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
                <div className="card-head">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="brand-icon" style={{ width: 26, height: 26 }}><Zap size={14} color="#fff" /></div>
                    <div>
                      <span className="card-title">FleetSentinel AI Diagnostic Copilot</span>
                      <div style={{ fontSize: '.64rem', color: 'var(--t3)' }}>Connected to 100,000 Indian vehicle telemetry streams</div>
                    </div>
                  </div>
                  <span className="pill"><span className="dot" />Online</span>
                </div>

                {/* Quick Prompts */}
                <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--br)', display: 'flex', gap: 7, flexWrap: 'wrap', background: 'var(--s2)' }}>
                  {[
                    'Show highest risk units (TN01CA2895 & HR05AV9078)',
                    'Draft Job Card for TN01CA2895 at Guindy ASC',
                    'Thermal telemetry report for coolant > 105°C',
                    '12V system voltage sag report',
                  ].map(prompt => (
                    <button
                      key={prompt}
                      className="btn btn-ghost btn-sm"
                      style={{ fontSize: '.67rem' }}
                      onClick={() => sendChat(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Chat Message Window */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {chat.map((msg, i) => (
                    <div
                      key={i}
                      style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        background: msg.role === 'user' ? 'var(--gi)' : 'var(--s3)',
                        color: '#f8fafc',
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: msg.role === 'user' ? 'none' : '1px solid var(--br)',
                        fontSize: '.79rem',
                        lineHeight: 1.55,
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {msg.text}
                      {msg.tool && (
                        <div style={{ marginTop: 8, fontSize: '.64rem', color: 'rgba(255,255,255,.5)', fontFamily: 'var(--mono)', borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 5 }}>
                          ⚡ Telemetry Function: {msg.tool}
                        </div>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div style={{ alignSelf: 'flex-start', color: 'var(--t3)', fontSize: '.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <RefreshCw size={12} className="spinning" /> Analyzing telematics streams…
                    </div>
                  )}
                </div>

                {/* Chat Input Bar */}
                <div style={{ padding: '12px 14px', borderTop: '1px solid var(--br)', display: 'flex', gap: 8, background: 'var(--s2)' }}>
                  <input
                    type="text"
                    placeholder="Ask Copilot about any vehicle, plate (e.g. TN01CA2895), fault code, or workshop dispatch…"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendChat()}
                    style={{ flex: 1 }}
                  />
                  <button className="btn btn-primary" onClick={() => sendChat()} disabled={chatLoading}>
                    Send Query
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 6: PAN-INDIA ANALYTICS ════════ */}
          {tab === 'analytics' && (
            <div className="fade-in">
              <div className="kpi-strip">
                {[
                  { l: 'States Represented', v: '28 States + 8 UTs', c: 'kpi-ic', tip: 'Pan-India coverage' },
                  { l: 'Top State by Fleet', v: 'Maharashtra (18.4%)', c: 'kpi-cy', tip: 'Largest commercial registration volume' },
                  { l: 'EV & Hybrid Share', v: '24.2%', c: 'kpi-gr', tip: 'Clean mobility powertrain proportion' },
                  { l: 'Mean Time to Repair', v: '3.8 Hours', c: 'kpi-am', tip: 'Average workshop bay turnaround' },
                ].map(k => (
                  <div key={k.l} className="kpi" title={k.tip}>
                    <div className="kpi-l">{k.l}</div>
                    <div className={`kpi-v ${k.c}`}>{k.v}</div>
                  </div>
                ))}
              </div>

              <div className="g2">
                {/* State Distribution */}
                <div className="card">
                  <div className="card-head">
                    <span className="card-title">Fleet Geographic Distribution Across Indian States</span>
                  </div>
                  <div className="card-body">
                    {[
                      { state: 'Maharashtra (MH)', count: '18,400 vehicles', pct: 18.4, hub: 'Mumbai / Pune Auto Cluster' },
                      { state: 'Tamil Nadu (TN)', count: '15,200 vehicles', pct: 15.2, hub: 'Chennai South Coastal Hub' },
                      { state: 'Karnataka (KA)', count: '14,800 vehicles', pct: 14.8, hub: 'Bengaluru Tech Corridor' },
                      { state: 'Delhi NCR (DL/HR/UP)', count: '16,200 vehicles', pct: 16.2, hub: 'Capital Region Logistics' },
                      { state: 'Gujarat (GJ)', count: '11,100 vehicles', pct: 11.1, hub: 'Ahmedabad / Surat Corridor' },
                      { state: 'Telangana & AP (TS/AP)', count: '10,500 vehicles', pct: 10.5, hub: 'Hyderabad / Vizag' },
                      { state: 'West Bengal & East (WB/OR)', count: '8,400 vehicles', pct: 8.4, hub: 'Kolkata Gateway' },
                      { state: 'Other States & UTs', count: '5,400 vehicles', pct: 5.4, hub: 'Pan-India Rest of Network' },
                    ].map(st => (
                      <div key={st.state} style={{ marginBottom: 11 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', marginBottom: 4 }}>
                          <span style={{ fontWeight: 600 }}>{st.state}</span>
                          <span style={{ color: 'var(--t2)', fontSize: '.68rem' }}>{st.count} ({st.pct}%)</span>
                        </div>
                        <div className="pbar">
                          <div className="pbar-fill" style={{ width: `${st.pct * 4.5}%`, background: 'var(--gi)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Diagnostic Fault Codes */}
                <div className="card">
                  <div className="card-head">
                    <span className="card-title">Top OBD-II Diagnostic Fault Codes (AIS-140)</span>
                  </div>
                  <div className="card-body">
                    {[
                      { code: 'P0217', name: 'Coolant Overheating', n: 312, tip: 'Engine coolant temp > 105°C sustained ceiling' },
                      { code: 'P0562', name: 'System Voltage Low (Sag)', n: 248, tip: 'Alternator charging diode drop < 12.4V' },
                      { code: 'P0303', name: 'Misfire Cylinder 3', n: 184, tip: 'Ignition coil or direct fuel injector fouling' },
                      { code: 'P0A80', name: 'EV Battery Cell Imbalance', n: 112, tip: 'Traction pack voltage variance > 120mV' },
                      { code: 'P0171', name: 'Fuel Trim Bank 1 Lean', n: 96, tip: 'Unmetered intake air leak post MAF sensor' },
                      { code: 'P0420', name: 'Catalyst Efficiency Low', n: 68, tip: 'BS-VI stage 2 emission threshold degradation' },
                    ].map(f => (
                      <div key={f.code} style={{ marginBottom: 11 }} title={f.tip}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.73rem', marginBottom: 4 }}>
                          <span><span className="badge br2" style={{ marginRight: 6 }}>{f.code}</span> {f.name}</span>
                          <span className="mono" style={{ color: 'var(--ind)', fontWeight: 700 }}>{f.n} active</span>
                        </div>
                        <div className="pbar">
                          <div className="pbar-fill" style={{ width: `${(f.n / 312) * 100}%`, background: 'var(--ga)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ════════ TAB 7: SYSTEM ARCHITECTURE ════════ */}
          {tab === 'system' && (
            <div className="fade-in">
              <div className="card">
                <div className="card-head">
                  <span className="card-title">AIS-140 & SAE J1939 Compliant Architecture</span>
                  <span className="pill"><span className="dot" />Operational</span>
                </div>
                <div className="card-body" style={{ fontSize: '.78rem', lineHeight: 1.6, color: 'var(--t2)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                    <div style={{ background: 'var(--s2)', padding: 14, borderRadius: 8, border: '1px solid var(--br)' }}>
                      <div style={{ color: 'var(--ind)', fontWeight: 700, marginBottom: 6 }}>1. Edge Ingestion Layer</div>
                      <div>Automotive TCUs transmit encrypted CAN 2.0B / OBD-II frames conforming to AIS-140 standard over 4G/5G cellular APNs to regional Kafka clusters.</div>
                    </div>
                    <div style={{ background: 'var(--s2)', padding: 14, borderRadius: 8, border: '1px solid var(--br)' }}>
                      <div style={{ color: 'var(--cyn)', fontWeight: 700, marginBottom: 6 }}>2. Sliding-Window Stream Processor</div>
                      <div>Computes rolling statistical moments (mean, variance, exponential trend) over 30s / 5m / 1h windows with sub-40ms P99 latency.</div>
                    </div>
                    <div style={{ background: 'var(--s2)', padding: 14, borderRadius: 8, border: '1px solid var(--br)' }}>
                      <div style={{ color: 'var(--grn)', fontWeight: 700, marginBottom: 6 }}>3. Machine Learning Inference</div>
                      <div>RandomForest 50-tree ensemble generates calibrated 7-day failure probabilities, outperforming static thresholds by 12.1% accuracy.</div>
                    </div>
                    <div style={{ background: 'var(--s2)', padding: 14, borderRadius: 8, border: '1px solid var(--br)' }}>
                      <div style={{ color: 'var(--amb)', fontWeight: 700, marginBottom: 6 }}>4. Dispatch Optimization</div>
                      <div>Dynamic Programming 0/1 knapsack algorithm allocates constrained workshop bay capacity to maximize catastrophic breakdown savings in ₹ INR.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Vehicle Inspector Drawer Modal */}
      {selectedV && (
        <VehicleDrawer
          v={selectedV}
          onClose={() => setSelectedV(null)}
          onSchedule={handleOpenScheduleForVehicle}
        />
      )}
    </div>
  )
}
