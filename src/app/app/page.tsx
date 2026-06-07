'use client'

import { useState, useRef, useEffect, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  Layers,
  Shield,
  HelpCircle,
  Heart,
  Star,
  Check,
  Phone,
  ChevronDown,
  RotateCcw,
  Lock,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Send,
  Sparkles,
  TrendingUp,
  Eye,
  Navigation,
  Zap,
  Activity,
  Scan,
  Menu,
  X,
  Plus,
  MessageSquare,
  Clock,
  Info,
  PanelLeftClose,
  PanelLeft,
  Play,
  HomeIcon,
  Paperclip,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share2,
  Download,
  Settings,
  User,
  CheckCircle,
  ChevronUp,
} from 'lucide-react'

// ─── TYPES ───────────────────────────────────────────────
interface Resource {
  name: string
  detail: string
  verified?: string
  distance?: string
}

interface Category {
  label: string
  confidence: number
  resources: Resource[]
  why: string
  also?: string
  warning?: string
}

interface CrisisLine {
  name: string
  action: string
  call?: string
}

interface ClassifyResponse {
  isCrisis: boolean
  categories: Category[]
  needsClarification: boolean
  clarificationMessage: string | null
  crisisLines?: CrisisLine[]
  note?: string
  model: string
  hasLocation?: boolean
  outsideServiceArea?: boolean
  serviceArea?: string
}

interface ConversationHistory {
  id: string
  title: string
  preview: string
  timestamp: string
  category?: string | null
  categoryColor?: string | null
  confidence: number
  isCrisis: boolean
  createdAt: string
}

// ─── STARTERS ────────────────────────────────────────────
const starters = [
  { id: 'job', label: 'Multi-Need', description: "I lost my job and can't pay rent. My kids need food.", icon: 'layers' },
  { id: 'crisis', label: 'Crisis', description: "I can't take this anymore. I want it all to end.", icon: 'shield' },
  { id: 'stress', label: 'Low Confidence', description: 'I need help with my situation', icon: 'help' },
  { id: 'senior', label: 'Senior', description: "I'm 78 and need help getting groceries delivered", icon: 'heart' },
  { id: 'veteran', label: 'Complex', description: "I'm a veteran dealing with PTSD and housing issues", icon: 'star' }
]

// ─── RESOURCE DATABASE (fetched from API) ──────────────────

const whyMap: Record<string, string> = {
  'Housing Assistance': 'Housing or shelter need identified',
  'Food Assistance': 'Food or basic necessities need identified',
  'Mental Health': 'Mental or emotional health concern identified',
  'Employment Services': 'Employment or job training need identified',
  'Legal Aid': 'Legal assistance need identified',
  'Healthcare': 'Health or medical need identified',
  'Substance Abuse': 'Substance use concern identified',
  'Senior Services': 'Senior-specific need identified',
}

const alsoMap: Record<string, string> = {
  'Housing Assistance': 'Section 8, Emergency shelters, LIHEAP, Rapid rehousing',
  'Food Assistance': 'WIC, School meal programs, SNAP Online',
  'Mental Health': 'Crisis counseling, Peer support, Telehealth',
  'Employment Services': 'Job Corps, Rapid Re-employment, GI Bill',
  'Legal Aid': 'Immigration services, Tenant rights',
  'Healthcare': 'Telehealth options, Community clinics',
  'Substance Abuse': 'Recovery support groups, Sober living',
  'Senior Services': 'SNAP Online, Congregate meals, Medicare counseling',
}

function enrichCategories(rawCategories: Category[], resourcesMap: Record<string, Resource[]> = {}): Category[] {
  return rawCategories.map(c => ({
    ...c,
    // If API already provided resources, use them; otherwise fall back to resourcesMap
    resources: c.resources && c.resources.length > 0 ? c.resources : (resourcesMap[c.label] || []),
    why: c.why || whyMap[c.label] || `Matched to ${c.label} category`,
    also: c.also || alsoMap[c.label],
    warning: c.warning || (c.confidence < 70 ? `${c.confidence}% confidence — consider providing more detail for better matches` : undefined),
  }))
}

// ─── UTILITIES ───────────────────────────────────────────
function getConfidenceColor(v: number): string {
  if (v > 70) return '#10b981'
  if (v >= 40) return '#f59e0b'
  return '#ef4444'
}
function getConfidenceBg(v: number): string {
  if (v > 70) return 'rgba(16,185,129,0.06)'
  if (v >= 40) return 'rgba(245,158,11,0.06)'
  return 'rgba(239,68,68,0.06)'
}
function getConfidenceGlow(v: number): string {
  if (v > 70) return '0 0 16px rgba(16,185,129,0.25)'
  if (v >= 40) return '0 0 16px rgba(245,158,11,0.25)'
  return '0 0 16px rgba(239,68,68,0.25)'
}
function getConfidenceLabel(v: number): string {
  if (v > 70) return 'High'
  if (v >= 40) return 'Moderate'
  return 'Low'
}
function getConfidenceRingBg(v: number): string {
  if (v > 70) return 'rgba(16,185,129,0.08)'
  if (v >= 40) return 'rgba(245,158,11,0.08)'
  return 'rgba(239,68,68,0.08)'
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin} min ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} hr ago`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay} days ago`
  return date.toLocaleDateString()
}

// ─── CONFIDENCE RING ─────────────────────────────────────
function ConfidenceRing({ value, size = 56, strokeWidth = 3.5, animated = true, delay = 0, showPulse = false }: {
  value: number; size?: number; strokeWidth?: number; animated?: boolean; delay?: number; showPulse?: boolean
}) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  const color = getConfidenceColor(value)
  const [mounted, setMounted] = useState(false)
  const [hasPulsed, setHasPulsed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100 + delay)
    return () => clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (showPulse && mounted) {
      const t = setTimeout(() => setHasPulsed(true), 1200 + delay)
      return () => clearTimeout(t)
    }
  }, [showPulse, mounted, delay])

  const label = getConfidenceLabel(value)

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={`absolute inset-[-6px] rounded-full transition-opacity duration-700 ${mounted && showPulse ? 'opacity-100' : 'opacity-0'}`}
        style={{
          background: `radial-gradient(circle, ${getConfidenceRingBg(value).replace('0.08', '0.15')}, transparent 70%)`,
        }}
      />
      <svg width={size} height={size} className="-rotate-90 relative">
        <defs>
          <linearGradient id={`ring-grad-${value}-${delay}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={`url(#ring-grad-${value}-${delay})`} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={mounted ? offset : circ}
          style={{
            transition: animated ? 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease' : 'none',
            filter: mounted ? `drop-shadow(${getConfidenceGlow(value)})` : 'none',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-bold tabular-nums tracking-tight leading-none" style={{ color }}>{value}</span>
        <span className="text-[8px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: color, opacity: 0.6 }}>{label}</span>
      </div>
      {showPulse && mounted && !hasPulsed && (
        <div
          className="absolute inset-0 rounded-full confidence-ring-pulse"
          style={{ '--pulse-color': color.replace(')', ',0.3)').replace('rgb', 'rgba') } as React.CSSProperties}
        />
      )}
    </div>
  )
}

// ─── 6-LAYER PROCESSING INDICATOR ────────────────────────
const pipelineSteps = [
  { label: 'Input', icon: <MessageCircle className="w-3 h-3" /> },
  { label: 'Crisis', icon: <Shield className="w-3 h-3" /> },
  { label: 'Classify', icon: <Layers className="w-3 h-3" /> },
  { label: 'Confidence', icon: <Activity className="w-3 h-3" /> },
  { label: 'Display', icon: <Eye className="w-3 h-3" /> },
  { label: 'Escalate', icon: <Zap className="w-3 h-3" /> },
]

function ProcessingPipeline() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % (pipelineSteps.length + 2))
    }, 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-3 items-start"
    >
      {/* AI Avatar */}
      <div className="w-10 h-10 rounded-2xl ai-avatar-orb flex items-center justify-center shrink-0 shadow-lg shadow-gray-900/20">
        <Layers className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="glass-card rounded-2xl p-4 border border-gray-100/40">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">6-Layer Processing Pipeline</p>
          <div className="flex items-center gap-0">
            {pipelineSteps.map((step, i) => (
              <div key={i} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0.3, scale: 0.9 }}
                  animate={{
                    opacity: activeStep >= i ? 1 : 0.3,
                    scale: activeStep >= i ? 1 : 0.9,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-colors duration-200 ${
                    activeStep === i
                      ? 'bg-gray-900 text-white shadow-md shadow-gray-900/20'
                      : activeStep > i
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40'
                        : 'bg-gray-50 text-gray-400 border border-gray-100/60'
                  }`}
                >
                  {step.icon}
                  <span className="hidden sm:inline">{step.label}</span>
                </motion.div>
                {i < pipelineSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: activeStep > i ? 0.8 : 0.2 }}
                    className="mx-0.5"
                  >
                    <ArrowRight className="w-3 h-3 text-gray-300" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Typing dots below pipeline */}
        <div className="flex items-center gap-1.5 mt-3 px-1">
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot-1" />
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot-2" />
          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full typing-dot-3" />
          <span className="text-[11px] text-gray-400 ml-1.5 font-medium">Processing your request…</span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── STATUS PILL ──────────────────────────────────────────
function StatusPill({ type, text }: { type: 'crisis' | 'clarify' | 'verified' | 'upgrade'; text: string }) {
  const config: Record<string, { bg: string; text: string; border: string; dot: string; icon: ReactNode; glow: string }> = {
    crisis: { bg: 'bg-red-50/80', text: 'text-red-700', border: 'border-red-200/60', dot: 'bg-red-500', icon: <AlertTriangle className="w-3 h-3" />, glow: '0 0 12px rgba(239,68,68,0.2)' },
    clarify: { bg: 'bg-amber-50/80', text: 'text-amber-700', border: 'border-amber-200/60', dot: 'bg-amber-500', icon: <HelpCircle className="w-3 h-3" />, glow: '0 0 12px rgba(245,158,11,0.2)' },
    verified: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200/60', dot: 'bg-emerald-500', icon: <ShieldCheck className="w-3 h-3" />, glow: '0 0 12px rgba(16,185,129,0.2)' },
    upgrade: { bg: 'bg-emerald-50/80', text: 'text-emerald-700', border: 'border-emerald-200/60', dot: 'bg-emerald-500', icon: <TrendingUp className="w-3 h-3" />, glow: '0 0 12px rgba(16,185,129,0.2)' }
  }
  const c = config[type]
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] font-semibold border ${c.bg} ${c.text} ${c.border} mb-4 backdrop-blur-sm relative overflow-hidden`}
      style={{ boxShadow: c.glow }}
    >
      {/* Shimmer overlay for verified/upgrade */}
      {(type === 'verified' || type === 'upgrade') && (
        <div className="absolute inset-0 badge-shimmer pointer-events-none" />
      )}
      {c.icon}
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${type === 'crisis' ? 'animate-pulse' : ''}`} />
      {text}
    </motion.div>
  )
}

// ─── CATEGORY CARD ───────────────────────────────────────
function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const low = cat.confidence < 70
  const color = getConfidenceColor(cat.confidence)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, delay: index * 0.1 }}
      onClick={() => setOpen(!open)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden ${
        low
          ? 'bg-gradient-to-b from-amber-50/30 via-white to-white'
          : 'bg-white/60 backdrop-blur-md'
      }`}
      style={{
        border: `1px solid ${hovered ? color + '40' : low ? 'rgba(245,158,11,0.15)' : 'rgba(0,0,0,0.04)'}`,
        boxShadow: hovered
          ? `0 8px 40px -8px ${color}15, 0 2px 12px rgba(0,0,0,0.04), inset 0 0 0 1px ${color}10`
          : '0 2px 8px rgba(0,0,0,0.02), 0 8px 32px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(0,0,0,0.02)',
        transform: hovered ? 'translateY(-2px) scale(1.005)' : 'translateY(0) scale(1)',
      }}
    >
      {/* Card shine sweep on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 card-shine" />

      <div className="p-6 relative">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-1.5 h-5 rounded-full" style={{ backgroundColor: color }} />
              <h4 className="text-[15px] font-semibold text-gray-900 leading-tight tracking-tight">{cat.label}</h4>
            </div>
            <p className="text-[12px] text-gray-400 leading-relaxed pl-4">{cat.why}</p>
          </div>
          <ConfidenceRing value={cat.confidence} size={56} strokeWidth={3.5} delay={index * 120} showPulse />
        </div>

        {/* Warning */}
        {cat.warning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.3 + index * 0.05 }}
            className="flex items-start gap-2 text-[12px] text-amber-700 mb-4 leading-relaxed bg-amber-50/50 rounded-xl px-3.5 py-2.5 border border-amber-100/40"
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
            {cat.warning}
          </motion.div>
        )}

        {/* Resources */}
        {cat.resources.length > 0 && (
          <div className="space-y-3">
            {cat.resources.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.08 + i * 0.06 }}
                className="flex items-start gap-3 group/resource"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover/resource:scale-110"
                  style={{ backgroundColor: getConfidenceBg(cat.confidence), borderLeft: `2px solid ${color}`, borderRadius: '4px 4px 4px 4px' }}
                >
                  <Check className="w-3 h-3" style={{ color }} strokeWidth={3} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-medium text-gray-800 leading-tight group-hover/resource:text-gray-900 transition-colors">{r.name}</p>
                    <ArrowRight className="w-3 h-3 text-gray-300 opacity-0 -translate-x-1 group-hover/resource:opacity-100 group-hover/resource:translate-x-0 transition-all duration-200" />
                  </div>
                  <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{r.detail}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-100/40 relative overflow-hidden">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Verified {r.verified}
                        <div className="absolute inset-0 badge-shimmer pointer-events-none" />
                      </span>
                    )}
                    {r.distance && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-semibold bg-blue-50/60 px-2 py-0.5 rounded-md border border-blue-100/40">
                        <MapPin className="w-2.5 h-2.5" />
                        {r.distance}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Expandable: Also considered */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-gray-100/60">
                {cat.also && (
                  <p className="text-[12px] text-gray-400 leading-relaxed">
                    <span className="text-gray-500 font-semibold">Also considered: </span>{cat.also}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expand hint */}
        {cat.also && !open && (
          <div className="mt-3 flex items-center gap-1 text-[11px] text-gray-300 group-hover:text-gray-400 transition-colors">
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <ChevronDown className="w-3 h-3" />
            </motion.div>
            <span>More details</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── CRISIS OVERLAY ───────────────────────────────────────
function CrisisBlock({ lines }: { lines: CrisisLine[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="rounded-2xl border border-red-200/40 bg-white overflow-hidden relative"
      style={{ boxShadow: '0 8px 48px -12px rgba(239,68,68,0.18), 0 0 0 1px rgba(239,68,68,0.06)' }}
    >
      {/* Red vignette glow */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{ boxShadow: 'inset 0 0 60px rgba(239,68,68,0.06)' }} />

      {/* Red header */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-rose-500 px-6 py-6 overflow-hidden">
        {/* Animated pulse pattern */}
        <div className="absolute inset-0 crisis-header-pulse opacity-20" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3), transparent 50%)' }} />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center crisis-pulse">
            <Shield className="w-5.5 h-5.5 text-white heartbeat-icon" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-white tracking-tight leading-tight">You are not alone.</p>
            <p className="text-[12px] text-red-100/80 mt-1 font-medium">Crisis keyword detected — AI classification bypassed</p>
          </div>
        </div>
      </div>

      {/* Crisis lines */}
      <div className="p-5 space-y-3">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 400, damping: 30 }}
            className="flex items-center gap-4 bg-red-50/30 rounded-xl p-4 border border-red-100/30 hover:bg-red-50/50 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100/60 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-900 leading-tight">{l.name}</p>
              <p className="text-[12px] text-gray-500 mt-0.5">{l.action}</p>
            </div>
            {l.call && (
              <button className="bg-gradient-to-b from-red-500 to-red-600 text-white text-[13px] font-bold px-6 py-3 rounded-xl shrink-0 hover:from-red-600 hover:to-red-700 transition-all shadow-md shadow-red-500/25 active:scale-95 hover:shadow-lg hover:shadow-red-500/30">
                {l.call}
              </button>
            )}
          </motion.div>
        ))}
        <div className="flex items-center justify-center gap-2 pt-3 pb-1">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Lock className="w-3.5 h-3.5 text-gray-300" />
          </motion.div>
          <p className="text-[11px] text-gray-400 font-medium">Nothing was stored or logged</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── CLARIFY PANEL ────────────────────────────────────────
function ClarifyPanel({ confidence, clarificationMessage, onClarify }: {
  confidence: number; clarificationMessage: string | null; onClarify: (text: string) => void
}) {
  const clarifyOptions = [
    'Housing or shelter',
    'Food or basic necessities',
    'Health or mental health support',
    'Legal assistance or immigration',
    'Employment or job training',
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="glass-card rounded-2xl p-6 border border-amber-100/30 relative overflow-hidden"
      style={{ boxShadow: '0 0 40px rgba(245,158,11,0.06), 0 4px 16px rgba(0,0,0,0.04)' }}
    >
      {/* Scanning animation overlay */}
      <div className="absolute inset-0 pointer-events-none scanning-line" />

      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <ConfidenceRing value={confidence} size={56} strokeWidth={4} showPulse />
          {/* Amber pulse glow */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-[-8px] rounded-full border-2 border-amber-400/20"
          />
        </div>
        <div>
          <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">AI Confidence: {confidence}%</p>
          <p className="text-[16px] font-semibold text-gray-900 leading-snug mt-1.5">Which best describes what you need?</p>
          {clarificationMessage && (
            <p className="text-[12px] text-gray-400 mt-1">{clarificationMessage}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2.5">
        {clarifyOptions.map((opt, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.07, type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => onClarify(opt)}
            className="w-full text-left bg-white/90 border border-gray-100 rounded-xl px-5 py-3.5 text-[14px] font-medium text-gray-700 active:scale-[0.98] transition-all duration-200 hover:scale-[1.005] flex items-center justify-between group relative overflow-hidden gradient-border-hover"
            style={{
              boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
            }}
          >
            <span>{opt}</span>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

// ─── TRANSPARENCY SECTION ─────────────────────────────────
function TransparencyPanel({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors group"
      >
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
        <Eye className="w-3.5 h-3.5" />
        Why these results?
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2.5 mt-3 pt-4 border-t border-gray-100/60">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2.5 items-start text-[12px] text-gray-500 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0 mt-[7px]" />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── SUGGESTION CARD ──────────────────────────────────────
function SuggestionCard({ s, index, onSelect }: {
  s: typeof starters[0]; index: number; onSelect: (id: string, label: string) => void
}) {
  const iconMap: Record<string, { icon: ReactNode; gradient: string; color: string; glowColor: string }> = {
    layers: { icon: <Layers className="w-5 h-5" />, gradient: 'from-blue-500/10 to-indigo-500/10', color: 'text-blue-600', glowColor: 'rgba(59,130,246,0.15)' },
    shield: { icon: <Shield className="w-5 h-5" />, gradient: 'from-red-500/10 to-rose-500/10', color: 'text-red-600', glowColor: 'rgba(239,68,68,0.15)' },
    help: { icon: <HelpCircle className="w-5 h-5" />, gradient: 'from-amber-500/10 to-orange-500/10', color: 'text-amber-600', glowColor: 'rgba(245,158,11,0.15)' },
    heart: { icon: <Heart className="w-5 h-5" />, gradient: 'from-pink-500/10 to-rose-500/10', color: 'text-pink-600', glowColor: 'rgba(236,72,153,0.15)' },
    star: { icon: <Star className="w-5 h-5" />, gradient: 'from-emerald-500/10 to-teal-500/10', color: 'text-emerald-600', glowColor: 'rgba(16,185,129,0.15)' },
  }
  const { icon, gradient, color, glowColor } = iconMap[s.icon] || iconMap.help

  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25, delay: index * 0.08 }}
      onClick={() => onSelect(s.id, s.label)}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.995 }}
      className="w-full text-left glass-card rounded-2xl px-5 py-5 border border-gray-100/40 group relative overflow-hidden"
      style={{
        boxShadow: '0 2px 8px rgba(0,0,0,0.02), 0 8px 32px rgba(0,0,0,0.04)',
      }}
    >
      {/* Hover gradient border effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          boxShadow: `0 0 0 1px ${glowColor}, 0 8px 32px -4px ${glowColor}`,
        }}
      />
      {/* Shine sweep on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 card-shine" />

      <div className="flex items-center gap-3.5 mb-2.5 relative">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center ${color} group-hover:scale-110 transition-transform duration-300`} style={{ boxShadow: `0 4px 12px ${glowColor}` }}>
          {icon}
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</p>
        </div>
      </div>
      <p className="text-[14px] text-gray-700 font-medium leading-relaxed pl-[52px] relative">&ldquo;{s.description}&rdquo;</p>
    </motion.button>
  )
}

// ─── UPGRADE ANIMATION ────────────────────────────────────
function UpgradeAnimation({ from, to, category }: { from: number; to: number; category: string }) {
  const [showParticles, setShowParticles] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowParticles(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.15 }}
      className="flex items-center gap-5 mb-4 p-5 bg-gradient-to-r from-emerald-50/40 via-white to-blue-50/30 rounded-2xl border border-emerald-100/20 relative overflow-hidden"
      style={{ boxShadow: '0 0 40px rgba(16,185,129,0.06), 0 4px 16px rgba(0,0,0,0.03)' }}
    >
      {/* Particle burst effect */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0.8, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0.8, 0.5, 0],
                x: Math.cos((i / 8) * Math.PI * 2) * 40,
                y: Math.sin((i / 8) * Math.PI * 2) * 40,
              }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
              className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ left: '15%', top: '50%' }}
            />
          ))}
        </div>
      )}

      {/* Old ring fading, new ring appearing */}
      <div className="relative shrink-0">
        <motion.div
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: 0.5, opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <ConfidenceRing value={from} size={56} strokeWidth={3.5} animated={false} />
        </motion.div>

        {/* Animated arrow between rings */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-10"
        >
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowRight className="w-4 h-4 text-emerald-500" />
          </motion.div>
        </motion.div>

        <div className="ring-morph">
          <ConfidenceRing value={to} size={60} strokeWidth={4} delay={300} showPulse />
        </div>
      </div>
      <div className="relative">
        <p className="text-[15px] font-bold text-gray-900 tracking-tight">{category}</p>
        <p className="text-[13px] text-gray-500 mt-1">
          <span className="line-through text-gray-300 mr-1.5 text-[12px]">{from}%</span>
          <span className="font-bold text-[16px]" style={{ color: getConfidenceColor(to) }}>{to}%</span>
          <span className="text-gray-400 ml-1.5 text-[12px]">after clarification</span>
        </p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <p className="text-[12px] text-emerald-600 font-bold">+{to - from}% confidence boost</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── FLOATING PARTICLES ──────────────────────────────────
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gray-200/60"
          initial={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── HOW IT WORKS MODAL ───────────────────────────────────
function HowItWorksModal({ onClose }: { onClose: () => void }) {
  const layers = [
    { step: 1, name: 'Free Text Input', description: 'You describe your situation in your own words. No categories, no forms, no keywords. Just tell us what you need.', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
    { step: 2, name: 'Hardcoded Crisis Detection', description: 'Before any AI runs, we check for crisis keywords (suicide, self-harm, abuse). If detected, AI is bypassed entirely and you get immediate crisis resources. Zero AI hallucination risk.', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
    { step: 3, name: 'Multi-Label Classification', description: 'BART-large-MNLI zero-shot model classifies your text against 8 service categories simultaneously. Returns a percentage score for each — no hallucinated resources, only verified ones.', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
    { step: 4, name: 'Confidence-Gated Clarification', description: 'If the top score is below 70%, we ask a clarification question instead of guessing. This is active learning — your answer refines the classification. One question can boost confidence by 30-40%.', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
    { step: 5, name: 'Transparent Display', description: 'Every result shows WHY it was matched, WHAT ELSE was considered, and HOW CONFIDENT we are. You see the reasoning, not just the answer.', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
    { step: 6, name: 'Human Escalation', description: 'Talk to a Navigator is always one click away. Connect to 211.org human navigators who can verify eligibility and walk you through applications in real time.', color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-overlay-animate" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.05 }}
        className="relative bg-white rounded-3xl max-w-[560px] w-full max-h-[85vh] overflow-y-auto shadow-premium-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[24px] font-bold text-gray-900 tracking-tight leading-tight">How ClearPath AI Works</h2>
            <p className="text-[14px] text-gray-400 mt-1.5 font-medium">6-Layer Architecture for Honest Confidence</p>
          </div>

          {/* Layers Timeline */}
          <div className="space-y-0">
            {layers.map((layer, i) => (
              <div key={i} className={`flex gap-4 ${i < layers.length - 1 ? 'step-connector' : ''}`}>
                <div className="shrink-0 flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${layer.color}, ${layer.color}dd)`,
                      boxShadow: `0 2px 8px ${layer.color}30`,
                    }}
                  >
                    {layer.step}
                  </div>
                </div>
                <div className={`pb-6 flex-1 min-w-0 ${i < layers.length - 1 ? '' : 'pb-0'}`}>
                  <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">{layer.name}</h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed mt-1">{layer.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100/60">
            <button
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-[14px] font-semibold hover:from-gray-800 hover:to-gray-700 transition-all shadow-md shadow-gray-900/15 active:scale-[0.98]"
            >
              Try it yourself
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── DEMO SCENARIOS MODAL ─────────────────────────────────
function DemoScenariosModal({ onClose, onSelectScenario }: {
  onClose: () => void
  onSelectScenario: (id: string, label: string) => void
}) {
  const scenarios = [
    {
      id: 'job',
      label: "I lost my job and can't pay rent. My kids need food.",
      title: 'Multi-Need Classification',
      description: 'Shows multi-label classification with honest confidence scores',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.06)',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: 'crisis',
      label: "I can't take this anymore. I want it all to end.",
      title: 'Crisis Detection',
      description: 'Shows hardcoded crisis detection bypassing AI classification',
      color: '#ef4444',
      bg: 'rgba(239,68,68,0.06)',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'stress',
      label: 'I need help with my situation',
      title: 'Low Confidence → Clarification',
      description: 'Shows confidence-gated clarification with active learning',
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.06)',
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm modal-overlay-animate" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.05 }}
        className="relative bg-white rounded-3xl max-w-[560px] w-full max-h-[85vh] overflow-y-auto shadow-premium-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[24px] font-bold text-gray-900 tracking-tight leading-tight">Demo Scenarios</h2>
            <p className="text-[14px] text-gray-400 mt-1.5 font-medium">Explore how ClearPath AI handles different situations</p>
          </div>

          {/* Scenario Cards */}
          <div className="space-y-3">
            {scenarios.map((scenario, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07, type: 'spring', stiffness: 400, damping: 28 }}
                onClick={() => onSelectScenario(scenario.id, scenario.label)}
                className="w-full text-left glass-card rounded-2xl p-5 border border-gray-100/40 group relative overflow-hidden gradient-border-hover"
                style={{
                  boxShadow: `0 2px 8px rgba(0,0,0,0.02), 0 4px 16px ${scenario.bg}`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{
                      backgroundColor: scenario.bg,
                      color: scenario.color,
                      boxShadow: `0 2px 8px ${scenario.color}15`,
                    }}
                  >
                    {scenario.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold text-gray-900 leading-tight">{scenario.title}</h3>
                    <p className="text-[13px] text-gray-700 mt-1 font-medium leading-relaxed">&ldquo;{scenario.label}&rdquo;</p>
                    <p className="text-[12px] text-gray-400 mt-1.5">{scenario.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── SIDEBAR ──────────────────────────────────────────────
function Sidebar({
  isOpen,
  onToggle,
  activeConversationId,
  onConversationSelect,
  onNewSearch,
  onNavHowItWorks,
  onNavDemoScenarios,
  onNavHome,
  activeNav,
  conversations,
  isLoadingConversations,
}: {
  isOpen: boolean
  onToggle: () => void
  activeConversationId: string | null
  onConversationSelect: (conv: ConversationHistory) => void
  onNewSearch: () => void
  onNavHowItWorks: () => void
  onNavDemoScenarios: () => void
  onNavHome: () => void
  activeNav: 'home' | 'how-it-works' | 'demo-scenarios' | null
  conversations: ConversationHistory[]
  isLoadingConversations: boolean
}) {
  // Group conversations by time period
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)

  const todayConvs = conversations.filter(c => new Date(c.createdAt) >= today)
  const previousConvs = conversations.filter(c => {
    const d = new Date(c.createdAt)
    return d < today && d >= yesterday
  })
  const olderConvs = conversations.filter(c => new Date(c.createdAt) < yesterday)

  const renderConvItem = (conv: ConversationHistory) => {
    const confDot = conv.isCrisis ? 'bg-red-500' : (conv.confidence > 70 ? 'bg-emerald-500' : conv.confidence >= 40 ? 'bg-amber-500' : 'bg-red-500')
    const confBadge = conv.isCrisis ? 'bg-red-500/20 text-red-300' : conv.confidence > 70 ? 'bg-emerald-500/20 text-emerald-300' : conv.confidence >= 40 ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'
    const confValue = conv.isCrisis ? '!' : String(conv.confidence)

    return (
      <motion.button
        key={conv.id}
        onClick={() => onConversationSelect(conv)}
        whileHover={{ x: 2 }}
        className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group sidebar-item-hover ${
          activeConversationId === conv.id
            ? 'sidebar-item-active'
            : ''
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full shrink-0 ${confDot}`} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className={`text-[13px] font-medium truncate ${
                activeConversationId === conv.id ? 'text-white' : 'text-gray-300 group-hover:text-white'
              }`}>{conv.title}</p>
              <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded ${confBadge}`}>
                {confValue}
              </span>
            </div>
            <p className="text-[11px] text-gray-600 truncate mt-0.5">{conv.preview}</p>
          </div>
          <span className="text-[10px] text-gray-600 shrink-0">{conv.timestamp}</span>
        </div>
      </motion.button>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 280 : 0,
          minWidth: isOpen ? 280 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className={`sidebar-dark sidebar-transition flex-shrink-0 overflow-hidden relative z-40 ${
          isOpen ? '' : 'pointer-events-none'
        } md:relative md:z-auto fixed md:static inset-y-0 left-0`}
        style={{
          boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        <div className="w-[280px] h-full flex flex-col">
          {/* Header */}
          <div className="shrink-0 px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg shadow-black/20">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-[14px] font-bold text-white tracking-tight">ClearPath AI</span>
              </div>
              <button
                onClick={onToggle}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* New Search button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewSearch}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-white/10 text-white/80 hover:text-white hover:bg-white/[0.06] transition-all duration-200 text-[13px] font-medium sidebar-new-btn"
              style={{
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <Plus className="w-4 h-4" />
              New Search
            </motion.button>
          </div>

          {/* Navigation Section */}
          <div className="shrink-0 px-3 pb-2">
            <div className="space-y-0.5">
              <button
                onClick={onNavHome}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group sidebar-item-hover flex items-center gap-2.5 text-[13px] font-medium ${
                  activeNav === 'home'
                    ? 'sidebar-item-active text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <HomeIcon className="w-4 h-4 shrink-0" />
                Home
                {activeNav === 'home' && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 nav-active-indicator" />
                )}
              </button>
              <button
                onClick={onNavHowItWorks}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group sidebar-item-hover flex items-center gap-2.5 text-[13px] font-medium ${
                  activeNav === 'how-it-works'
                    ? 'sidebar-item-active text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4 shrink-0" />
                How It Works
                {activeNav === 'how-it-works' && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 nav-active-indicator" />
                )}
              </button>
              <button
                onClick={onNavDemoScenarios}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 group sidebar-item-hover flex items-center gap-2.5 text-[13px] font-medium ${
                  activeNav === 'demo-scenarios'
                    ? 'sidebar-item-active text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Play className="w-4 h-4 shrink-0" />
                Demo Scenarios
                {activeNav === 'demo-scenarios' && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 nav-active-indicator" />
                )}
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto sidebar-scrollbar px-3 pb-3">
            {isLoadingConversations ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-gray-600 border-t-gray-300 rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-[12px] text-gray-600">No conversations yet</p>
              </div>
            ) : (
              <>
                {/* Today */}
                {todayConvs.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Today</span>
                    </div>
                    <div className="space-y-0.5">
                      {todayConvs.map(renderConvItem)}
                    </div>
                  </div>
                )}

                {/* Previous */}
                {previousConvs.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Yesterday</span>
                    </div>
                    <div className="space-y-0.5">
                      {previousConvs.map(renderConvItem)}
                    </div>
                  </div>
                )}

                {/* Older */}
                {olderConvs.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 px-2 mb-2">
                      <Clock className="w-3 h-3 text-gray-500" />
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Earlier</span>
                    </div>
                    <div className="space-y-0.5">
                      {olderConvs.map(renderConvItem)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="shrink-0 px-4 py-3 border-t border-white/[0.06]">
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.04] transition-all duration-200 text-[12px] font-medium">
              <Info className="w-3.5 h-3.5" />
              About ClearPath AI
            </button>
            {/* Model Status Badge */}
            <div className="flex items-center justify-center mt-2">
              <span className="inline-flex items-center gap-1.5 text-[10px] text-gray-500 font-semibold px-2.5 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/30" />
                <span className="text-gray-400">BART-large-MNLI</span>
              </span>
            </div>
            <p className="text-center text-[9px] text-gray-600 mt-1 font-medium">Zero-shot · Online</p>
          </div>
        </div>
      </motion.aside>
    </>
  )
}

// ─── MESSAGE ACTION BUTTONS ───────────────────────────────
function MessageActionButtons({ messageIndex, onCopy, onFeedback, onViewDetails, showDetails }: {
  messageIndex: number
  onCopy: (idx: number) => void
  onFeedback: (idx: number, _type: 'up' | 'down') => void
  onViewDetails: (idx: number) => void
  showDetails: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  const handleCopy = () => {
    onCopy(messageIndex)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(feedback === type ? null : type)
    onFeedback(messageIndex, type)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="flex items-center gap-1 mt-3 -ml-1"
    >
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200"
      >
        {copied ? (
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <button
        onClick={() => handleFeedback('up')}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
          feedback === 'up'
            ? 'text-emerald-600 bg-emerald-50/80'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/80'
        }`}
      >
        <ThumbsUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => handleFeedback('down')}
        className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
          feedback === 'down'
            ? 'text-amber-600 bg-amber-50/80'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/80'
        }`}
      >
        <ThumbsDown className="w-3.5 h-3.5" />
      </button>
      <div className="w-px h-4 bg-gray-200/60 mx-1" />
      <button
        onClick={() => onViewDetails(messageIndex)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 ${
          showDetails
            ? 'text-blue-600 bg-blue-50/80'
            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/80'
        }`}
      >
        <Eye className="w-3.5 h-3.5" />
        {showDetails ? 'Hide details' : 'View details'}
      </button>
    </motion.div>
  )
}

// ─── TRANSPARENCY ITEMS HELPER ───────────────────────────
function getTransparencyItems(result: {
  isCrisis: boolean
  categories: Category[]
  needsClarification: boolean
  model: string
  isUpgrade?: boolean
  upgradeFrom?: number
  upgradeTo?: number
  upgradeCategory?: string
}): string[] {
  if (result.isCrisis) return [
    'Crisis keywords detected by hardcoded safety layer — not AI',
    'AI models can misclassify crisis situations, so this check runs first and bypasses all AI processing',
    'Your safety is always prioritized over resource matching'
  ]
  if (result.needsClarification) return [
    'Your request scored below 50% across all categories — too ambiguous for reliable matching',
    'One clarification question can boost confidence by 30-40%, ensuring you get accurate resources',
    'This is active learning — the model uses your answer to refine its classification'
  ]

  const items: string[] = []
  if (result.isUpgrade && result.upgradeFrom !== undefined && result.upgradeTo !== undefined && result.upgradeCategory) {
    items.push(`Clarification narrowed classification from ambiguous to ${result.upgradeCategory} — confidence jumped from ${result.upgradeFrom}% to ${result.upgradeTo}%`)
    items.push('The model combined your original text + clarification to re-score all categories')
  } else {
    items.push(`Classified by ${result.model || 'BART-large-MNLI'} zero-shot model against 8 service categories`)
  }
  items.push('Resources sourced from United Way 211 verified database')
  if (result.categories.some(c => c.confidence < 70)) {
    items.push(`${result.categories.filter(c => c.confidence < 70).map(c => c.label).join(', ')} below 70% threshold — consider providing more detail for better matches`)
  }
  return items
}

// ─── MAIN ─────────────────────────────────────────────────
export default function Home() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'ai'
    text: string
    isCrisis?: boolean
    crisisLines?: CrisisLine[]
    categories?: Category[]
    statusBadge?: 'crisis' | 'clarify' | 'verified' | 'upgrade'
    upgradeInfo?: { from: number; to: number; category: string }
    isClarify?: boolean
    clarifyConfidence?: number
    clarifyReason?: string
    transparencyItems?: string[]
    model?: string
    outsideServiceArea?: boolean
    serviceArea?: string
  }>>([])
  const [suggestions, setSuggestions] = useState<Array<{ id: string; label: string; description?: string; icon?: string }>>(starters)
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  // Conversations not tracked — stateless chat
  const [conversations, setConversations] = useState<ConversationHistory[]>([])
  const [isLoadingConversations, setIsLoadingConversations] = useState(false)
  const [showHowItWorks, setShowHowItWorks] = useState(false)
  const [showDemoScenarios, setShowDemoScenarios] = useState(false)
  const [activeNav, setActiveNav] = useState<'home' | 'how-it-works' | 'demo-scenarios' | null>(null)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [inputText, setInputText] = useState('')
  const [expandedTransparency, setExpandedTransparency] = useState<Set<number>>(new Set())
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ─── Geolocation: real distances, no fake data ───
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle')

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied')
      return
    }
    setLocationStatus('requesting')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
        setLocationStatus('granted')
      },
      () => {
        // User denied or error — fall back to showing addresses only
        setLocationStatus('denied')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 } // Cache for 5 min
    )
  }, [])

  // Track the previous confidence for upgrade detection
  const previousConfidenceRef = useRef<number | null>(null)

  // Full-screen crisis overlay state
  const [showCrisisOverlay, setShowCrisisOverlay] = useState(false)
  const [crisisOverlayLines, setCrisisOverlayLines] = useState<CrisisLine[]>([])

  // Resources now come directly from the classify API response — no separate fetch needed
  // No conversation tracking — stateless chat

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
    }, 80)
  }, [])

  // Main handler: send user text to /api/classify
  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return

    const userText = text.trim()
    setInputText('')

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: userText }])
    setSuggestions([])
    setIsTyping(true)

    try {
      // Build request body — include conversationId and location if available
      const requestBody: Record<string, string | number> = { text: userText }
      // No conversationId — stateless
      if (userLocation) {
        requestBody.lat = userLocation.lat
        requestBody.lng = userLocation.lng
      }

      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })

      if (!res.ok) {
        setIsTyping(false)
        setMessages(prev => [...prev, {
          role: 'ai',
          text: 'Something went wrong. You can still search resources or talk to a navigator.',
          statusBadge: 'clarify',
          isClarify: true,
          clarifyConfidence: 0,
          transparencyItems: ['An error occurred while processing your request. Please try again.'],
          outsideServiceArea: false,
          serviceArea: undefined,
        }])
        return
      }

      const data: ClassifyResponse = await res.json()

      // Enrich categories with why, also, warning (resources come from API)
      const enrichedCategories = enrichCategories(data.categories)

      // Determine status badge and type
      let statusBadge: 'crisis' | 'clarify' | 'verified' | 'upgrade' | undefined
      let isCrisis = false
      let crisisLines: CrisisLine[] | undefined
      let isClarify = false
      let clarifyConfidence: number | undefined
      let clarifyReason: string | null | undefined
      let upgradeInfo: { from: number; to: number; category: string } | undefined

      if (data.isCrisis) {
        statusBadge = 'crisis'
        isCrisis = true
        crisisLines = data.crisisLines || [
          { name: '988 Suicide & Crisis Lifeline', action: 'Free. Confidential. 24/7.', call: '988' },
          { name: 'Crisis Text Line', action: 'Text HOME to 741741', call: 'Text' },
          { name: 'Local Crisis Center', action: 'Talk to a real person now', call: '211' },
        ]
        // Show full-screen crisis overlay
        setCrisisOverlayLines(crisisLines)
        setShowCrisisOverlay(true)
      } else if (data.needsClarification) {
        statusBadge = 'clarify'
        isClarify = true
        clarifyConfidence = enrichedCategories[0]?.confidence || 0
        clarifyReason = data.clarificationMessage
      } else if (previousConfidenceRef.current !== null && enrichedCategories[0] && enrichedCategories[0].confidence > previousConfidenceRef.current) {
        statusBadge = 'upgrade'
        upgradeInfo = {
          from: previousConfidenceRef.current,
          to: enrichedCategories[0].confidence,
          category: enrichedCategories[0].label,
        }
      } else {
        statusBadge = 'verified'
      }

      // Track confidence for upgrade detection on next message
      if (enrichedCategories.length > 0) {
        previousConfidenceRef.current = enrichedCategories[0].confidence
      }

      // Build transparency items
      const transparencyItems = getTransparencyItems({
        isCrisis,
        categories: enrichedCategories,
        needsClarification: data.needsClarification,
        model: data.model,
        isUpgrade: statusBadge === 'upgrade',
        upgradeFrom: upgradeInfo?.from,
        upgradeTo: upgradeInfo?.to,
        upgradeCategory: upgradeInfo?.category,
      })

      setIsTyping(false)
      const aiMsg: typeof messages[number] = {
        role: 'ai',
        text: '',
        isCrisis,
        crisisLines,
        categories: enrichedCategories,
        statusBadge,
        upgradeInfo,
        isClarify,
        clarifyConfidence,
        clarifyReason: clarifyReason ?? undefined,
        transparencyItems,
        model: data.model,
        outsideServiceArea: data.outsideServiceArea,
        serviceArea: data.serviceArea,
      }
      setMessages(prev => [...prev, aiMsg])

      // Set follow-up suggestions
      if (!isCrisis && !isClarify && enrichedCategories.length > 0) {
        const followUps = enrichedCategories.slice(0, 3).map((cat, i) => ({
          id: `followup-${i}`,
          label: `Tell me more about ${cat.label}`,
        }))
        setSuggestions(followUps)
      } else {
        setSuggestions([])
      }

    } catch {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        role: 'ai',
        text: 'Something went wrong. You can still search resources or talk to a navigator.',
        statusBadge: 'clarify',
        isClarify: true,
        clarifyConfidence: 0,
        transparencyItems: ['A network error occurred. Please check your connection and try again.'],
        outsideServiceArea: false,
        serviceArea: undefined,
      }])
    }
  }, [isTyping])

  // Handle starter card selection — pre-fill and submit
  const handleSelectStarter = useCallback((id: string, _label: string) => {
    const starter = starters.find(s => s.id === id)
    if (starter) {
      handleSend(starter.description)
    }
  }, [handleSend])

  // Handle clarification selection
  const handleClarifySelect = useCallback((optionText: string) => {
    handleSend(optionText)
  }, [handleSend])

  // Handle follow-up suggestion click
  const handleFollowUpClick = useCallback((id: string, label: string) => {
    handleSend(label)
  }, [handleSend])

  // Handle textarea submit
  const handleSubmit = useCallback(() => {
    if (inputText.trim()) {
      handleSend(inputText)
    }
  }, [inputText, handleSend])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, suggestions, scrollToBottom])

  // Track scroll for header shadow
  useEffect(() => {
    const el = chatRef.current
    if (!el) return
    const handleScroll = () => {
      setHeaderScrolled(el.scrollTop > 10)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const reset = () => {
    setMessages([])
    setSuggestions(starters)
    setActiveConversationId(null)
    // Reset state for new session
    previousConfidenceRef.current = null
    setInputText('')
    setShowCrisisOverlay(false)
    setCrisisOverlayLines([])
  }

  const handleNavHome = () => {
    reset()
    setActiveNav(null)
  }

  const handleNavHowItWorks = () => {
    setActiveNav('how-it-works')
    setShowHowItWorks(true)
  }

  const handleNavDemoScenarios = () => {
    setActiveNav('demo-scenarios')
    setShowDemoScenarios(true)
  }

  const handleConversationSelect = useCallback((conv: ConversationHistory) => {
    setActiveConversationId(conv.id)
    // For now, just set the conversation as active — full message history loading
    // would require a GET /api/conversations/[id] endpoint
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [])

  const hasMessages = messages.length > 0

  const handleCopyMessage = useCallback((idx: number) => {
    const msg = messages[idx]
    if (!msg) return
    const textToCopy = msg.categories
      ? msg.categories.map(c => `${c.label} (${c.confidence}%): ${c.resources.map(r => r.name).join(', ')}`).join('\n')
      : msg.text
    navigator.clipboard.writeText(textToCopy).catch(() => {})
  }, [messages])

  const handleFeedback = useCallback((_idx: number, _type: 'up' | 'down') => {
    // UI only — feedback not stored per privacy policy
  }, [])

  const handleViewDetails = useCallback((idx: number) => {
    setExpandedTransparency(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }, [])

  const handleTextareaInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 mesh-gradient-bg" />
      {/* Noise texture overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* ─── FULL-SCREEN CRISIS OVERLAY ─── */}
      <AnimatePresence>
        {showCrisisOverlay && (
          <motion.div
            key="crisis-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25, delay: 0.1 }}
              className="relative w-full max-w-lg z-10"
            >
              <CrisisBlock lines={crisisOverlayLines} />

              {/* Action buttons below crisis block */}
              <div className="mt-5 space-y-3">
                {/* "I've reached out for help" acknowledge button */}
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => setShowCrisisOverlay(false)}
                  className="w-full py-4 rounded-2xl bg-white text-gray-900 text-[15px] font-bold hover:bg-gray-50 transition-colors shadow-lg border border-gray-100/60 active:scale-[0.98]"
                >
                  <span className="flex items-center justify-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    I&apos;ve reached out for help
                  </span>
                </motion.button>

                {/* "Talk to a Navigator" button */}
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={() => setShowCrisisOverlay(false)}
                  className="w-full py-4 rounded-2xl text-white text-[15px] font-bold transition-all active:scale-[0.98] relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
                    boxShadow: '0 4px 20px rgba(37,99,235,0.3)',
                  }}
                >
                  <span className="flex items-center justify-center gap-2.5 relative z-10">
                    <Navigation className="w-5 h-5" />
                    Talk to a Navigator
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── SIDEBAR ─── */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeConversationId={activeConversationId}
        onConversationSelect={handleConversationSelect}
        onNewSearch={reset}
        onNavHowItWorks={handleNavHowItWorks}
        onNavDemoScenarios={handleNavDemoScenarios}
        onNavHome={handleNavHome}
        activeNav={activeNav}
        conversations={conversations}
        isLoadingConversations={isLoadingConversations}
      />

      {/* How It Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <HowItWorksModal onClose={() => { setShowHowItWorks(false); setActiveNav(null) }} />
        )}
      </AnimatePresence>

      {/* Demo Scenarios Modal */}
      <AnimatePresence>
        {showDemoScenarios && (
          <DemoScenariosModal
            onClose={() => { setShowDemoScenarios(false); setActiveNav(null) }}
            onSelectScenario={(id, _label) => {
              setShowDemoScenarios(false)
              setActiveNav(null)
              const starter = starters.find(s => s.id === id)
              if (starter) {
                handleSend(starter.description)
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── MAIN AREA ─── */}
      <div className="flex-1 flex flex-col min-w-0 relative">
      {/* ─── HEADER ─── */}
      <div
        className={`shrink-0 border-b z-10 transition-all duration-500 header-glass ${
          headerScrolled ? 'border-gray-200/40 shadow-[0_1px_12px_rgba(0,0,0,0.06)]' : 'border-gray-100/20'
        }`}
      >
        <div className="max-w-[820px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sidebar toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100/80 transition-colors text-gray-400 hover:text-gray-600"
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
            </motion.button>

            {/* Model Selector */}
            <div className="relative">
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-100/80 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg ai-avatar-orb flex items-center justify-center shadow-sm shadow-gray-900/15">
                  <Layers className="w-3 h-3 text-white" />
                </div>
                <span className="text-[13px] font-bold text-gray-900 tracking-tight hidden sm:inline">ClearPath AI v1.0</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${showModelSelector ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {showModelSelector && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-xl border border-gray-100/60 shadow-lg shadow-gray-900/8 z-50 overflow-hidden"
                    onClick={() => setShowModelSelector(false)}
                  >
                    <div className="p-2">
                      <div className="px-3 py-2.5 rounded-lg bg-gray-50/80 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg ai-avatar-orb flex items-center justify-center shrink-0 shadow-sm shadow-gray-900/15 mt-0.5">
                          <Layers className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-gray-900">ClearPath AI v1.0</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">BART-large-MNLI · Zero-shot classification</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] text-emerald-600 font-semibold">Online</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-1.5 px-3 py-2.5 rounded-lg hover:bg-gray-50/60 transition-colors opacity-50 cursor-not-allowed">
                        <p className="text-[13px] font-medium text-gray-400">ClearPath AI v1.1</p>
                        <p className="text-[11px] text-gray-300 mt-0.5">Multi-modal support · Coming soon</p>
                      </div>
                      <div className="mt-1.5 px-3 py-2.5 rounded-lg hover:bg-gray-50/60 transition-colors opacity-50 cursor-not-allowed">
                        <p className="text-[13px] font-medium text-gray-400">ClearPath AI Pro</p>
                        <p className="text-[11px] text-gray-300 mt-0.5">Fine-tuned model · Priority access</p>
                      </div>
                    </div>
                    <div className="px-3 py-2 border-t border-gray-100/40">
                      <p className="text-[10px] text-gray-400 font-medium">8 service categories · 6-layer pipeline · Hardcoded crisis detection</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <span className="text-[10px] font-semibold text-amber-600 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/40">LIVE</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Share button */}
            <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100/80 transition-colors text-gray-400 hover:text-gray-600">
              <Share2 className="w-4 h-4" />
            </button>

            {/* Export dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100/80 transition-colors text-gray-400 hover:text-gray-600"
              >
                <Download className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1.5 w-44 bg-white rounded-xl border border-gray-100/60 shadow-lg shadow-gray-900/8 z-50 overflow-hidden"
                    onClick={() => setShowExportMenu(false)}
                  >
                    <div className="p-1.5">
                      <button className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50/80 transition-colors flex items-center gap-2.5">
                        <Download className="w-3.5 h-3.5 text-gray-400" />
                        Export as PDF
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50/80 transition-colors flex items-center gap-2.5">
                        <Download className="w-3.5 h-3.5 text-gray-400" />
                        Export as Text
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50/80 transition-colors flex items-center gap-2.5">
                        <Download className="w-3.5 h-3.5 text-gray-400" />
                        Export as JSON
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* New conversation */}
            {hasMessages && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={reset}
                className="h-8 px-2.5 flex items-center gap-1.5 rounded-lg hover:bg-gray-100/80 transition-colors text-gray-400 hover:text-gray-600"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[12px] font-medium hidden sm:inline">New</span>
              </motion.button>
            )}

            <div className="w-px h-5 bg-gray-200/60 mx-0.5 hidden sm:block" />

            {/* Settings */}
            <Link href="/settings" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100/80 transition-colors text-gray-400 hover:text-gray-600">
              <Settings className="w-4 h-4" />
            </Link>

            {/* Profile */}
            <Link href="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-gray-900/10 hover:shadow-md hover:shadow-gray-900/15 transition-shadow">
              {session?.user?.name ? (
                <span className="text-[11px] font-bold">
                  {session.user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              ) : (
                <User className="w-4 h-4" />
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ─── CHAT AREA ─── */}
      <div ref={chatRef} className="flex-1 overflow-y-auto scroll-smooth relative">
        <div className="max-w-[820px] mx-auto px-6 relative">

          {/* ─── Service Area Banner ─── */}
          <div className="pt-3">
            <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50/60 border border-blue-100/40 backdrop-blur-sm">
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-[12px] text-blue-700 font-medium">ClearPath AI currently serves the <span className="font-bold">Houston, TX metro area</span></span>
              <span className="text-[11px] text-blue-400 font-medium ml-1">— Expanding soon</span>
              {locationStatus === 'idle' && (
                <button
                  onClick={requestLocation}
                  className="ml-2 inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold text-blue-600 bg-blue-100/60 rounded-md hover:bg-blue-100 transition-colors"
                >
                  📍 Use my location
                </button>
              )}
              {locationStatus === 'requesting' && (
                <span className="ml-2 text-[10px] text-blue-400 animate-pulse">Locating...</span>
              )}
              {locationStatus === 'granted' && (
                <span className="ml-2 text-[10px] text-emerald-500 font-semibold">✓ Location shared</span>
              )}
              {locationStatus === 'denied' && (
                <span className="ml-2 text-[10px] text-gray-400">Location unavailable</span>
              )}
            </div>
          </div>

          {/* Empty state — Premium Welcome */}
          <AnimatePresence mode="wait">
            {!hasMessages && !isTyping && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                className="pt-[8vh] pb-8 text-center relative"
              >
                {/* Floating particles */}
                <FloatingParticles />

                {/* Animated gradient orb behind logo */}
                <div className="relative w-28 h-28 mx-auto mb-8">
                  {/* Outer glow ring */}
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                    className="absolute inset-[-20px] rounded-full orb-glow-outer"
                  />
                  {/* Inner pulsing glow */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    className="absolute inset-[-12px] rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, rgba(59,130,246,0.08) 40%, transparent 70%)',
                    }}
                  />
                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
                    className="w-28 h-28 rounded-[28px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center mx-auto shadow-premium-xl subtle-float relative z-10"
                    style={{
                      background: 'linear-gradient(135deg, #111827, #1f2937, #111827)',
                    }}
                  >
                    <Layers className="w-11 h-11 text-white" />
                  </motion.div>
                </div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-[48px] font-extrabold text-gray-900 tracking-[-0.035em] leading-[1.05]"
                >
                  How can I help?
                </motion.h1>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.6 }}
                  className="text-[16px] text-gray-400 mt-4 max-w-[380px] mx-auto leading-relaxed font-medium"
                >
                  I connect you with verified community resources.
                  <br />
                  <span className="text-gray-500">Honest confidence, not guesswork.</span>
                </motion.p>

                {/* Feature badges — glass morphism */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex items-center justify-center gap-4 mt-7"
                >
                  {[
                    { icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />, label: 'Verified', color: 'rgba(16,185,129,0.08)' },
                    { icon: <Eye className="w-4 h-4 text-blue-500" />, label: 'Transparent', color: 'rgba(59,130,246,0.08)' },
                    { icon: <Sparkles className="w-4 h-4 text-amber-500" />, label: 'Classified', color: 'rgba(245,158,11,0.08)' },
                  ].map((badge, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.08 }}
                      className="flex items-center gap-2 text-[12px] text-gray-500 font-semibold px-4 py-2 rounded-full border border-gray-100/40 backdrop-blur-md"
                      style={{
                        background: `rgba(255,255,255,0.5)`,
                        boxShadow: `0 2px 8px ${badge.color}, inset 0 0 0 1px rgba(255,255,255,0.3)`,
                      }}
                    >
                      {badge.icon}
                      {badge.label}
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className={`space-y-6 ${hasMessages ? 'pt-6 pb-6' : 'pt-4 pb-4'}`}>
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                >
                  {msg.role === 'user' ? (
                    /* ─── User Message ─── */
                    <div className="flex justify-end">
                      <div className="max-w-[85%] relative overflow-hidden rounded-2xl rounded-br-sm px-5 py-3.5" style={{
                        background: 'linear-gradient(135deg, #2563EB, #1d4ed8)',
                        boxShadow: '0 4px 16px rgba(37,99,235,0.2), 0 1px 3px rgba(37,99,235,0.1)',
                      }}>
                        {/* Subtle shine effect */}
                        <div className="absolute inset-0 pointer-events-none user-bubble-shine" />
                        <p className="text-[14px] leading-relaxed text-white font-medium relative">{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    /* ─── AI Message ─── */
                    <div className="flex gap-3 items-start">
                      {/* AI Avatar */}
                      <div className="w-10 h-10 rounded-2xl ai-avatar-orb flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-gray-900/15">
                        <Layers className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* Status badge */}
                        {msg.statusBadge === 'crisis' && <StatusPill type="crisis" text="Crisis detected — AI classification bypassed" />}
                        {msg.statusBadge === 'clarify' && <StatusPill type="clarify" text="Confidence too low — clarification needed" />}
                        {msg.statusBadge === 'verified' && msg.categories && msg.categories.length > 0 && (
                          <StatusPill type="verified" text={`${msg.categories.length} verified resource${msg.categories.length > 1 ? 's' : ''} found`} />
                        )}
                        {msg.statusBadge === 'upgrade' && msg.upgradeInfo && (
                          <StatusPill type="upgrade" text={`Confidence upgraded: ${msg.upgradeInfo.from}% → ${msg.upgradeInfo.to}%`} />
                        )}

                        {/* Confidence upgrade animation */}
                        {msg.upgradeInfo && (
                          <UpgradeAnimation
                            from={msg.upgradeInfo.from}
                            to={msg.upgradeInfo.to}
                            category={msg.upgradeInfo.category}
                          />
                        )}

                        {/* Crisis */}
                        {msg.isCrisis && msg.crisisLines && (
                          <>
                            <p className="text-[14px] text-gray-700 leading-relaxed mb-4 font-medium">I hear you, and I want to make sure you&apos;re safe right now. You don&apos;t have to go through this alone.</p>
                            <CrisisBlock lines={msg.crisisLines} />
                            <TransparencyPanel items={msg.transparencyItems || [
                              'Crisis keywords detected by hardcoded safety layer — not AI',
                              'AI models can misclassify crisis situations, so this check runs first and bypasses all AI processing',
                              'Your safety is always prioritized over resource matching'
                            ]} />
                          </>
                        )}

                        {/* Clarification */}
                        {msg.isClarify && (
                          <>
                            <p className="text-[14px] text-gray-700 leading-relaxed mb-4 font-medium">I want to help, but I need to understand your situation better to find the right resources.</p>
                            <ClarifyPanel
                              confidence={msg.clarifyConfidence || 0}
                              clarificationMessage={msg.clarifyReason || null}
                              onClarify={handleClarifySelect}
                            />
                            <TransparencyPanel items={msg.transparencyItems || [
                              'Your request scored below 50% across all categories — too ambiguous for reliable matching',
                              'One clarification question can boost confidence by 30-40%, ensuring you get accurate resources',
                              'This is active learning — the model uses your answer to refine its classification'
                            ]} />
                          </>
                        )}

                        {/* Outside service area warning */}
                        {msg.outsideServiceArea && !msg.isCrisis && (
                          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-50/60 border border-amber-100/40 mb-3">
                            <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[12px] text-amber-800 font-semibold leading-snug">You appear to be outside our service area ({msg.serviceArea || 'Houston, TX'}).</p>
                              <p className="text-[11px] text-amber-600 mt-1 leading-relaxed">These resources are located in Houston but may still be helpful as reference. We&apos;re expanding to more areas soon.</p>
                            </div>
                          </div>
                        )}

                        {/* Categories */}
                        {msg.categories && msg.categories.length > 0 && !msg.isCrisis && !msg.isClarify && (
                          <div className="space-y-3">
                            {msg.categories.map((cat, j) => <CategoryCard key={j} cat={cat} index={j} />)}
                          </div>
                        )}

                        {/* Transparency for regular results */}
                        {msg.categories && msg.categories.length > 0 && !msg.isCrisis && !msg.isClarify && msg.transparencyItems && (
                          <TransparencyPanel items={msg.transparencyItems} />
                        )}

                        {/* Expanded transparency panel from action buttons */}
                        {expandedTransparency.has(i) && msg.transparencyItems && !msg.isCrisis && !msg.isClarify && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 p-4 rounded-xl bg-gray-50/60 border border-gray-100/40">
                              <div className="flex items-center gap-2 mb-3">
                                <Eye className="w-3.5 h-3.5 text-blue-500" />
                                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Transparency Details</p>
                              </div>
                              <div className="space-y-2">
                                {msg.transparencyItems.map((item, idx) => (
                                  <div key={idx} className="flex gap-2 text-[12px] text-gray-500 leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0 mt-[7px]" />
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Message Action Buttons */}
                        <MessageActionButtons
                          messageIndex={i}
                          onCopy={handleCopyMessage}
                          onFeedback={handleFeedback}
                          onViewDetails={handleViewDetails}
                          showDetails={expandedTransparency.has(i)}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* 6-Layer Processing Pipeline */}
            <AnimatePresence>
              {isTyping && <ProcessingPipeline />}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className={`space-y-2 ${hasMessages ? 'pb-6' : 'pb-4'}`}>
              {suggestions.map((s, i) => {
                if ('icon' in s && s.icon) {
                  return <SuggestionCard key={i} s={s as typeof starters[0]} index={i} onSelect={handleSelectStarter} />
                }
                // Follow-up chips — premium style
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28, delay: i * 0.06 }}
                    onClick={() => handleFollowUpClick(s.id, s.label)}
                    whileHover={{ scale: 1.005, y: -1 }}
                    whileTap={{ scale: 0.995 }}
                    className="w-full text-left glass-card rounded-xl px-5 py-3.5 text-[13px] font-medium text-gray-700 border border-gray-100/40 flex items-center justify-between group relative overflow-hidden gradient-border-hover"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.02)' }}
                  >
                    <span>{s.label}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── FLOATING NAVIGATOR BUTTON ─── */}
      {hasMessages && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.5 }}
          className="fixed bottom-24 right-6 z-20"
        >
          <button className="flex items-center gap-2.5 text-white text-[13px] font-bold px-6 py-3.5 rounded-2xl navigator-btn-glow hover:shadow-xl active:scale-95 transition-transform relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 navigator-gradient-bg" />
            <span className="relative flex items-center gap-2.5">
              <Navigation className="w-4 h-4" />
              Talk to a Navigator
            </span>
          </button>
        </motion.div>
      )}

      {/* ─── INPUT BAR ─── */}
      <div className="shrink-0 border-t border-gray-100/40 relative z-10 input-bar-glass">
        <div className="max-w-[820px] mx-auto px-4 sm:px-6 py-3">
          <div className="glass-card rounded-2xl border border-gray-100/30 focus-within:border-gray-200/60 transition-all duration-300 relative overflow-hidden input-focus-ring">
            <div className="flex items-end gap-2 px-4 pt-3 pb-2">
              {/* Attach button */}
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition-all duration-200 shrink-0 mb-0.5">
                <Paperclip className="w-4 h-4" />
              </button>
              {/* Auto-resize textarea */}
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder={hasMessages ? 'Ask a follow-up question...' : 'Describe what you need help with...'}
                className="flex-1 bg-transparent text-[14px] outline-none text-gray-900 placeholder:text-gray-300 font-medium resize-none min-h-[24px] max-h-[120px] leading-relaxed"
                rows={1}
              />
              {/* Send button */}
              <button
                onClick={handleSubmit}
                disabled={!inputText.trim() || isTyping}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center shrink-0 shadow-sm shadow-gray-900/10 cursor-pointer hover:shadow-md hover:shadow-gray-900/15 transition-shadow mb-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            {/* Bottom row: hints + char count */}
            <div className="flex items-center justify-between px-4 pb-2.5">
              <p className="text-[10px] text-gray-300 font-medium">
                <kbd className="px-1 py-0.5 rounded bg-gray-100/60 text-gray-400 text-[9px] font-semibold">Shift</kbd>
                {' + '}
                <kbd className="px-1 py-0.5 rounded bg-gray-100/60 text-gray-400 text-[9px] font-semibold">Enter</kbd>
                {' for new line'}
              </p>
              <p className={`text-[10px] font-medium transition-colors duration-200 ${
                inputText.length > 450 ? 'text-amber-500' : inputText.length > 0 ? 'text-gray-300' : 'text-gray-200'
              }`}>
                {inputText.length > 0 ? `${inputText.length}/500` : ''}
              </p>
            </div>
          </div>

          {/* Suggested follow-up chips */}
          {!hasMessages && (
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {[
                'I need housing help',
                'Mental health support',
                'Food assistance',
                'Legal aid',
                'Senior services',
              ].map((chip, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.05, duration: 0.3 }}
                  onClick={() => handleSend(chip)}
                  className="px-3.5 py-1.5 rounded-full text-[12px] font-medium text-gray-500 bg-white/60 border border-gray-100/40 hover:text-gray-700 hover:bg-white/80 hover:border-gray-200/60 transition-all duration-200 backdrop-blur-sm"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
                >
                  {chip}
                </motion.button>
              ))}
            </div>
          )}

          <p className="text-[11px] text-gray-300 text-center mt-2.5 flex items-center justify-center gap-2 font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/30" />
            ClearPath AI · Live Mode — Verified resources · Honest confidence · BART-large-MNLI
          </p>
        </div>
      </div>
      </div>{/* end main area wrapper */}
    </div>
  )
}
