'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface ChatStep {
  userText: string
  categories: Category[]
  followUp: { id: string; label: string }[]
  confidenceChange?: { before: number; after: number; label: string }
  isCrisis?: boolean
  crisisLines?: { name: string; action: string; call?: string }[]
  isClarify?: boolean
  clarifyOptions?: { label: string; nextId: string }[]
  clarifyReason?: string
  clarifyConfidence?: number
  statusBadge?: 'crisis' | 'clarify' | 'verified' | 'upgrade'
  upgradeInfo?: { from: number; to: number; category: string }
}

// ─── DATA ────────────────────────────────────────────────
const chatSteps: Record<string, ChatStep> = {
  job: {
    userText: "I lost my job and can't pay rent. My kids need food.",
    statusBadge: 'verified',
    categories: [
      { label: 'Housing Assistance', confidence: 87, resources: [{ name: 'Section 8 Emergency Transfer', detail: '2 locations near you. Application takes ~15 min.', verified: 'May 2026' }, { name: 'Emergency Rental Assistance', detail: 'Up to 12 months rent support', verified: 'May 2026' }], why: "Can't pay rent — immediate housing risk", also: 'Section 8, Emergency shelters, LIHEAP' },
      { label: 'Food Assistance', confidence: 82, resources: [{ name: 'Community Food Bank', detail: 'Next distribution: Thursday 9AM. No ID required.', verified: 'May 2026', distance: '1.2 mi' }, { name: 'SNAP Benefits', detail: 'Monthly EBT card for groceries', verified: 'May 2026' }], why: 'Kids need food — high urgency', also: 'WIC, School meal programs' },
      { label: 'Employment Services', confidence: 64, resources: [{ name: 'Workforce Center', detail: 'Job placement + training. Walk-ins welcome Mon-Fri.', verified: 'May 2026', distance: '2.4 mi' }], why: 'Job loss mentioned — employment pathway', also: 'Job Corps, Rapid Re-employment', warning: '64% confidence — consider clarifying work background' }
    ],
    followUp: [{ id: 'job-snap', label: 'Do I qualify for SNAP?' }, { id: 'job-utilities', label: 'I also need utility help' }, { id: 'job-apply', label: 'Can someone help me apply?' }]
  },
  'job-snap': {
    userText: 'Do I qualify for SNAP?',
    statusBadge: 'verified',
    categories: [
      { label: 'SNAP Eligibility', confidence: 94, resources: [{ name: 'SNAP Pre-Screener', detail: 'Check eligibility in 5 minutes', verified: 'May 2026' }, { name: '211 Navigator', detail: 'Live eligibility verification', verified: 'May 2026' }], why: 'Asked about SNAP qualification', also: 'WIC, School meals, TANF' }
    ],
    followUp: [{ id: 'job-apply', label: 'Help me apply' }, { id: 'job-utilities', label: 'I need utility help too' }]
  },
  'job-utilities': {
    userText: 'I also need help with utilities.',
    statusBadge: 'verified',
    categories: [
      { label: 'Utility Assistance', confidence: 89, resources: [{ name: 'LIHEAP', detail: 'Heating and cooling bill assistance', verified: 'May 2026' }, { name: 'Utility Disconnection Protection', detail: 'Prevents shutoff during hardship', verified: 'May 2026' }], why: 'Mentioned utility need', also: 'Weatherization program' }
    ],
    followUp: [{ id: 'job-apply', label: 'Help me apply for everything' }]
  },
  'job-apply': {
    userText: 'Can someone help me apply?',
    statusBadge: 'verified',
    categories: [
      { label: 'Application Assistance', confidence: 96, resources: [{ name: '211 Navigator', detail: 'Live help applying for benefits', verified: 'May 2026' }, { name: 'Benefits Enrollment Center', detail: 'In-person application support', verified: 'May 2026', distance: '1.8 mi' }], why: 'Requested application help', also: 'Online application, Document prep' }
    ],
    followUp: []
  },
  stress: {
    userText: "I need help with my situation",
    statusBadge: 'clarify',
    isClarify: true,
    clarifyConfidence: 43,
    clarifyReason: 'Your request scored below 50% across all categories — too ambiguous for reliable matching',
    clarifyOptions: [
      { label: 'Housing or shelter', nextId: 'stress-housing' },
      { label: 'Food or basic necessities', nextId: 'stress-food' },
      { label: 'Health or mental health support', nextId: 'stress-emotions' },
      { label: 'Legal assistance or immigration', nextId: 'stress-legal' }
    ],
    categories: [],
    followUp: []
  },
  'stress-housing': {
    userText: 'I need housing help',
    statusBadge: 'upgrade',
    upgradeInfo: { from: 43, to: 83, category: 'Housing Assistance' },
    categories: [
      { label: 'Housing Assistance', confidence: 83, resources: [{ name: 'Emergency Shelter Network', detail: '4 locations with availability. Walk-ins accepted until 8 PM.', verified: 'May 2026' }, { name: 'Section 8 Emergency Transfer', detail: 'Application takes ~15 min', verified: 'May 2026' }], why: 'Clarified housing need', also: 'Rapid rehousing, Transitional housing' }
    ],
    followUp: [{ id: 'job-utilities', label: 'I need utility help too' }, { id: 'job-apply', label: 'Help me apply' }]
  },
  'stress-food': {
    userText: 'I need food help',
    statusBadge: 'upgrade',
    upgradeInfo: { from: 43, to: 79, category: 'Food Assistance' },
    categories: [
      { label: 'Food Assistance', confidence: 79, resources: [{ name: 'SNAP Benefits Enrollment', detail: 'You may qualify for $250/month. Apply online in 10 min.', verified: 'May 2026' }, { name: 'Community Food Bank', detail: 'No ID required. Next distribution: Thursday 9AM.', verified: 'May 2026', distance: '1.2 mi' }], why: 'Clarified food need', also: 'WIC, School meal programs' }
    ],
    followUp: [{ id: 'job-snap', label: 'Do I qualify for SNAP?' }, { id: 'job-apply', label: 'Help me apply' }]
  },
  'stress-emotions': {
    userText: "It's about my emotions. I've been like this for months.",
    statusBadge: 'upgrade',
    upgradeInfo: { from: 43, to: 83, category: 'Mental Health' },
    categories: [
      { label: 'Mental Health Counseling', confidence: 83, resources: [{ name: 'Community Counseling Center', detail: 'Sliding scale — $0 if uninsured', verified: 'May 2026', distance: '1.5 mi' }, { name: 'NAMI Support Group', detail: 'Free, weekly, no registration', verified: 'May 2026' }], why: 'Emotional stress over months', also: 'Crisis counseling, Peer support' }
    ],
    followUp: [{ id: 'stress-appt', label: 'How do I make an appointment?' }, { id: 'stress-group', label: 'Is there a support group nearby?' }, { id: 'crisis', label: 'I think I might be in crisis' }]
  },
  'stress-legal': {
    userText: 'I need legal help',
    statusBadge: 'upgrade',
    upgradeInfo: { from: 43, to: 81, category: 'Legal Aid' },
    categories: [
      { label: 'Legal Aid', confidence: 81, resources: [{ name: 'Legal Aid Society', detail: 'Free consultations for housing, immigration, and benefits cases.', verified: 'May 2026' }], why: 'Clarified legal need', also: 'Immigration services, Tenant rights' }
    ],
    followUp: [{ id: 'job-apply', label: 'Help me apply' }]
  },
  'stress-appt': {
    userText: 'How do I make an appointment?',
    statusBadge: 'verified',
    categories: [
      { label: 'Appointment Booking', confidence: 92, resources: [{ name: 'Community Counseling Center', detail: 'Walk-in or call ahead — (555) 123-4567', verified: 'May 2026', distance: '1.5 mi' }], why: 'Requested appointment', also: 'Telehealth options, Evening hours' }
    ],
    followUp: []
  },
  'stress-group': {
    userText: 'Is there a support group nearby?',
    statusBadge: 'verified',
    categories: [
      { label: 'Support Groups', confidence: 88, resources: [{ name: 'NAMI Connection', detail: 'Tuesdays 6pm, free, no registration', verified: 'May 2026', distance: '1.5 mi' }, { name: 'DBSA Depression Support', detail: 'Thursdays 7pm, free', verified: 'May 2026', distance: '2.1 mi' }], why: 'Requested support group', also: 'Online support groups, Peer warmline' }
    ],
    followUp: []
  },
  crisis: {
    userText: "I can't take this anymore. I want it all to end.",
    isCrisis: true,
    statusBadge: 'crisis',
    crisisLines: [
      { name: 'Suicide & Crisis Lifeline', action: 'Free. Confidential. 24/7.', call: '988' },
      { name: 'Crisis Text Line', action: 'Text HOME to 741741', call: 'Text' },
      { name: 'Local Crisis Center', action: 'Talk to a real person now', call: '211' }
    ],
    categories: [],
    followUp: [{ id: 'crisis-talk', label: 'I want to talk to someone' }, { id: 'crisis-scared', label: "I need help but I'm scared" }]
  },
  'crisis-talk': {
    userText: 'I want to talk to someone.',
    isCrisis: true,
    statusBadge: 'crisis',
    crisisLines: [
      { name: '988 Suicide & Crisis Lifeline', action: 'Confidential, free, 24/7', call: '988' },
      { name: '211 Navigator', action: 'Real person, right now', call: '211' }
    ],
    categories: [],
    followUp: []
  },
  'crisis-scared': {
    userText: 'I need help but I\'m scared.',
    isCrisis: true,
    statusBadge: 'crisis',
    crisisLines: [
      { name: 'Crisis Text Line', action: 'Text HOME to 741741 — No phone call needed', call: 'Text' },
      { name: '988 Lifeline', action: 'You can just text, not call', call: '988' }
    ],
    categories: [],
    followUp: []
  },
  senior: {
    userText: "I'm 78 and need help getting groceries delivered",
    statusBadge: 'verified',
    categories: [
      { label: 'Senior Grocery Delivery', confidence: 94, resources: [{ name: 'Meals on Wheels', detail: 'Free grocery delivery for seniors 60+. Call (555) 234-5678 to enroll. No internet needed.', verified: 'May 2026' }], why: 'Age 78 + specific need (grocery delivery) = clear match', also: 'SNAP Online, Congregate meals' },
      { label: 'SNAP Online Purchasing', confidence: 78, resources: [{ name: 'EBT Online', detail: 'Use SNAP benefits on Amazon, Walmart, and Instacart for home delivery.', verified: 'May 2026' }], why: 'SNAP benefits can be used online', also: 'Senior food boxes, Farmer\u2019s market vouchers' }
    ],
    followUp: [{ id: 'senior-call', label: 'Call Meals on Wheels' }, { id: 'senior-snap', label: 'How to apply for SNAP' }, { id: 'senior-more', label: 'Other senior services' }]
  },
  'senior-call': {
    userText: 'I want to call Meals on Wheels',
    statusBadge: 'verified',
    categories: [
      { label: 'Meals on Wheels Contact', confidence: 97, resources: [{ name: 'Meals on Wheels Local Office', detail: 'Call (555) 234-5678 — Mon-Fri 8AM-5PM. They will take your info over the phone.', verified: 'May 2026' }], why: 'Requested direct contact', also: 'Home-delivered meals, Wellness checks' }
    ],
    followUp: []
  },
  'senior-snap': {
    userText: 'How do I apply for SNAP?',
    statusBadge: 'verified',
    categories: [
      { label: 'SNAP Application', confidence: 91, resources: [{ name: 'SNAP Online Application', detail: 'Apply at benefits.gov — takes about 10 minutes', verified: 'May 2026' }, { name: '211 Navigator', detail: 'Someone can help you apply over the phone', verified: 'May 2026' }], why: 'Asked about SNAP application', also: 'Medicare Savings Program, Extra Help (LIS)' }
    ],
    followUp: []
  },
  'senior-more': {
    userText: 'What other services are available for seniors?',
    statusBadge: 'verified',
    categories: [
      { label: 'Senior Services', confidence: 86, resources: [{ name: 'Area Agency on Aging', detail: 'Transportation, home repairs, legal aid, and social activities', verified: 'May 2026' }, { name: 'Medicare Counseling', detail: 'Free help understanding your coverage options', verified: 'May 2026' }], why: 'Requested additional senior services', also: 'Property tax relief, SSI benefits' }
    ],
    followUp: []
  },
  veteran: {
    userText: "I'm a veteran dealing with PTSD and housing issues",
    statusBadge: 'verified',
    categories: [
      { label: 'Veteran Housing (VASH)', confidence: 91, resources: [{ name: 'VA Supportive Housing', detail: 'HUD-VASH vouchers for veterans. Case manager assigned.', verified: 'May 2026' }], why: 'Veteran status + housing instability = VASH priority', also: 'SRO, Shared housing, Rapid rehousing' },
      { label: 'PTSD Treatment', confidence: 89, resources: [{ name: 'VA PTSD Program', detail: 'Evidence-based therapy. No copay for combat veterans. Telehealth available.', verified: 'May 2026' }, { name: 'Vet Center Counseling', detail: 'No VA enrollment needed. Walk-ins welcome.', verified: 'May 2026', distance: '3.1 mi' }], why: 'PTSD mentioned — veteran-specific programs prioritized', also: 'Veterans Crisis Line: 988 Press 1' },
      { label: 'Veteran Crisis Line', confidence: 85, resources: [{ name: '988, Press 1', detail: 'Veterans Crisis Line. Call, text 838255, or chat at veteranscrisisline.net.', verified: 'May 2026' }], why: 'PTSD + housing instability are risk factors — proactive inclusion', also: 'VA urgent care, Telehealth' },
      { label: 'Veteran Employment', confidence: 62, resources: [{ name: 'Vocational Rehabilitation', detail: 'Job training + placement for veterans with service-connected disabilities.', verified: 'May 2026' }], why: 'You didn\u2019t mention work needs, but VR services available', also: 'GI Bill, Hire Heroes USA', warning: '62% confidence — employment need not explicitly stated' }
    ],
    followUp: [{ id: 'veteran-enroll', label: 'How do I enroll in VA healthcare?' }, { id: 'veteran-ptsd-now', label: 'Can I get PTSD help right away?' }, { id: 'veteran-housing', label: 'I need emergency housing tonight' }]
  },
  'veteran-enroll': {
    userText: 'How do I enroll in VA healthcare?',
    statusBadge: 'verified',
    categories: [
      { label: 'VA Enrollment', confidence: 94, resources: [{ name: 'VA Benefits Intake Center', detail: 'One-stop enrollment for all services', verified: 'May 2026', distance: '4.2 mi' }, { name: 'Online Enrollment', detail: 'va.gov/health-care/apply', verified: 'May 2026' }], why: 'Asked about enrollment', also: 'Disability comp, GI Bill, Home loan' }
    ],
    followUp: [{ id: 'veteran-ptsd-now', label: 'Can I get PTSD help right away?' }]
  },
  'veteran-ptsd-now': {
    userText: 'Can I get PTSD help right away?',
    statusBadge: 'verified',
    categories: [
      { label: 'Immediate PTSD Support', confidence: 90, resources: [{ name: 'Vet Center', detail: 'Walk-in, same-day counseling', verified: 'May 2026', distance: '3.1 mi' }, { name: 'Veterans Crisis Line', detail: '988 then Press 1 — 24/7', verified: 'May 2026' }], why: 'Requested immediate help', also: 'VA urgent care, Telehealth' }
    ],
    followUp: []
  },
  'veteran-housing': {
    userText: 'I need emergency housing tonight.',
    statusBadge: 'verified',
    categories: [
      { label: 'Emergency Shelter', confidence: 92, resources: [{ name: 'VA Emergency Shelter', detail: 'Same-day placement for veterans', verified: 'May 2026' }, { name: '211 Emergency Housing', detail: 'Call 211 for immediate placement', verified: 'May 2026' }], why: 'Emergency housing need stated', also: 'Transitional housing, Rapid rehousing' }
    ],
    followUp: []
  }
}

const starters = [
  { id: 'job', label: 'Multi-Need', description: "I lost my job and can't pay rent. My kids need food.", icon: 'layers' },
  { id: 'crisis', label: 'Crisis', description: "I can't take this anymore. I want it all to end.", icon: 'shield' },
  { id: 'stress', label: 'Low Confidence', description: 'I need help with my situation', icon: 'help' },
  { id: 'senior', label: 'Senior', description: "I'm 78 and need help getting groceries delivered", icon: 'heart' },
  { id: 'veteran', label: 'Complex', description: "I'm a veteran dealing with PTSD and housing issues", icon: 'star' }
]

// ─── UTILITIES ───────────────────────────────────────────
function getConfidenceColor(v: number): string {
  if (v >= 80) return '#10b981'
  if (v >= 70) return '#3b82f6'
  if (v >= 50) return '#f59e0b'
  return '#f97316'
}
function getConfidenceBg(v: number): string {
  if (v >= 80) return 'rgba(16,185,129,0.08)'
  if (v >= 70) return 'rgba(59,130,246,0.08)'
  if (v >= 50) return 'rgba(245,158,11,0.08)'
  return 'rgba(249,115,22,0.08)'
}
function getConfidenceGlow(v: number): string {
  if (v >= 80) return '0 0 12px rgba(16,185,129,0.3)'
  if (v >= 70) return '0 0 12px rgba(59,130,246,0.3)'
  if (v >= 50) return '0 0 12px rgba(245,158,11,0.3)'
  return '0 0 12px rgba(249,115,22,0.3)'
}
function getConfidenceLabel(v: number): string {
  if (v >= 80) return 'High'
  if (v >= 70) return 'Good'
  if (v >= 50) return 'Moderate'
  return 'Low'
}

// ─── CONFIDENCE RING ─────────────────────────────────────
function ConfidenceRing({ value, size = 48, strokeWidth = 3, animated = true, delay = 0 }: {
  value: number; size?: number; strokeWidth?: number; animated?: boolean; delay?: number
}) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  const color = getConfidenceColor(value)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100 + delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={mounted ? offset : circ}
          style={{
            transition: animated ? 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease' : 'none',
            filter: `drop-shadow(${getConfidenceGlow(value)})`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-bold tabular-nums tracking-tight" style={{ color }}>{value}</span>
      </div>
    </div>
  )
}

// ─── STATUS PILL ──────────────────────────────────────────
function StatusPill({ type, text }: { type: 'crisis' | 'clarify' | 'verified' | 'upgrade'; text: string }) {
  const config = {
    crisis: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200/80', dot: 'bg-red-500' },
    clarify: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/80', dot: 'bg-amber-500' },
    verified: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/80', dot: 'bg-emerald-500' },
    upgrade: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/80', dot: 'bg-emerald-500' }
  }
  const c = config[type]
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${c.bg} ${c.text} ${c.border} mb-3`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${type === 'crisis' ? 'animate-pulse' : ''}`} />
      {text}
    </motion.div>
  )
}

// ─── CATEGORY CARD ───────────────────────────────────────
function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const [open, setOpen] = useState(false)
  const low = cat.confidence < 70
  const color = getConfidenceColor(cat.confidence)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, delay: index * 0.08 }}
      onClick={() => setOpen(!open)}
      className={`rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.995] ${
        low
          ? 'border-amber-200/70 bg-gradient-to-b from-amber-50/20 to-white'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
      style={{ boxShadow: `inset 0 0 0 1px ${low ? 'rgba(245,158,11,0.06)' : 'rgba(0,0,0,0.02)'}` }}
    >
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-4 rounded-full" style={{ backgroundColor: color }} />
              <h4 className="text-[13px] font-semibold text-gray-900 leading-tight tracking-tight">{cat.label}</h4>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed pl-3">{cat.why}</p>
          </div>
          <ConfidenceRing value={cat.confidence} size={44} strokeWidth={2.5} delay={index * 120} />
        </div>

        {/* Warning */}
        {cat.warning && (
          <div className="flex items-start gap-1.5 text-[10px] text-amber-700 mb-3 leading-relaxed bg-amber-50/60 rounded-xl px-3 py-2 border border-amber-100/50">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {cat.warning}
          </div>
        )}

        {/* Resources */}
        {cat.resources.length > 0 && (
          <div className="space-y-2">
            {cat.resources.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 group">
                <div className="w-[18px] h-[18px] rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors" style={{ backgroundColor: getConfidenceBg(cat.confidence) }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-gray-800 leading-tight group-hover:text-gray-900 transition-colors">{r.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{r.detail}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {r.verified && (
                      <span className="text-[9px] text-emerald-600 font-medium bg-emerald-50/80 px-1.5 py-0.5 rounded-md border border-emerald-100/50">Verified {r.verified}</span>
                    )}
                    {r.distance && (
                      <span className="text-[9px] text-blue-600 font-medium bg-blue-50/80 px-1.5 py-0.5 rounded-md border border-blue-100/50">{r.distance}</span>
                    )}
                  </div>
                </div>
              </div>
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
              <div className="mt-3 pt-3 border-t border-gray-100/80">
                {cat.also && (
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    <span className="text-gray-500 font-medium">Also considered: </span>{cat.also}
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── CRISIS OVERLAY ───────────────────────────────────────
function CrisisBlock({ lines }: { lines: { name: string; action: string; call?: string }[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="rounded-2xl border border-red-200/50 bg-white overflow-hidden"
      style={{ boxShadow: '0 8px 40px -12px rgba(239,68,68,0.15), 0 0 0 1px rgba(239,68,68,0.08)' }}
    >
      {/* Red header */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 px-4 py-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p className="text-[14px] font-bold text-white tracking-tight">You are not alone.</p>
            <p className="text-[10px] text-red-200">Crisis keyword detected — AI classification bypassed</p>
          </div>
        </div>
      </div>

      {/* Crisis lines */}
      <div className="p-3 space-y-2">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 400, damping: 30 }}
            className="flex items-center gap-3 bg-red-50/40 rounded-xl p-3 border border-red-100/40"
          >
            <div className="w-10 h-10 rounded-full bg-red-100/80 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-gray-900 leading-tight">{l.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{l.action}</p>
            </div>
            {l.call && (
              <button className="bg-gradient-to-b from-red-500 to-red-600 text-white text-[11px] font-bold px-4 py-2.5 rounded-xl shrink-0 hover:from-red-600 hover:to-red-700 transition-all shadow-sm shadow-red-500/20 active:scale-95">
                {l.call}
              </button>
            )}
          </motion.div>
        ))}
        <div className="flex items-center justify-center gap-1.5 pt-1.5 pb-0.5">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-300"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <p className="text-[9px] text-gray-400">Nothing was stored or logged</p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── CLARIFY PANEL ────────────────────────────────────────
function ClarifyPanel({ confidence, options, onSelect }: {
  confidence: number; options: { label: string; nextId: string }[]; onSelect: (label: string, nextId: string) => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100/60"
    >
      <div className="flex items-center gap-3 mb-3">
        <ConfidenceRing value={confidence} size={40} strokeWidth={2.5} />
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">AI Confidence: {confidence}%</p>
          <p className="text-[13px] font-medium text-gray-900 leading-snug mt-0.5">Which best describes what you need?</p>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {options.map((opt, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.06, type: 'spring', stiffness: 400, damping: 30 }}
            onClick={() => onSelect(opt.label, opt.nextId)}
            className="w-full text-left bg-white border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-gray-800 hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-150"
          >
            {opt.label}
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
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
      >
        <motion.svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        ><polyline points="6 9 12 15 18 9"/></motion.svg>
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
            <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-gray-100/60">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-2 items-start text-[10px] text-gray-500 leading-relaxed"
                >
                  <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0 mt-[6px]" />
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

// ─── TYPING INDICATOR ─────────────────────────────────────
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex gap-2.5 items-start"
    >
      <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <div className="flex items-center gap-1 py-2.5 px-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-gray-300 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </motion.div>
  )
}

// ─── SUGGESTION CARD ──────────────────────────────────────
function SuggestionCard({ s, index, onSelect }: {
  s: typeof starters[0]; index: number; onSelect: (id: string, label: string) => void
}) {
  const icons: Record<string, JSX.Element> = {
    layers: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    shield: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    help: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    heart: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
    star: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28, delay: index * 0.06 }}
      onClick={() => onSelect(s.id, s.label)}
      className="w-full text-left border border-gray-100 bg-white rounded-2xl px-4 py-3.5 hover:bg-gray-50/80 hover:border-gray-200 hover:shadow-sm active:scale-[0.995] transition-all duration-200 group"
    >
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-5 h-5 flex items-center justify-center text-gray-400 group-hover:text-gray-600 transition-colors">
          {icons[s.icon] || icons.help}
        </div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{s.label}</p>
      </div>
      <p className="text-[12px] text-gray-700 font-medium leading-snug pl-[30px]">&ldquo;{s.description}&rdquo;</p>
    </motion.button>
  )
}

// ─── MAIN ─────────────────────────────────────────────────
export default function Home() {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'ai'
    text: string
    stepId?: string
    isCrisis?: boolean
    crisisLines?: { name: string; action: string; call?: string }[]
    categories?: Category[]
    statusBadge?: 'crisis' | 'clarify' | 'verified' | 'upgrade'
    upgradeInfo?: { from: number; to: number; category: string }
    isClarify?: boolean
    clarifyOptions?: { label: string; nextId: string }[]
    clarifyConfidence?: number
    clarifyReason?: string
    transparencyItems?: string[]
  }>>([])
  const [suggestions, setSuggestions] = useState(starters)
  const [isTyping, setIsTyping] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
    }, 80)
  }, [])

  const handleSelect = useCallback((id: string, label: string) => {
    const step = chatSteps[id]
    if (!step) return

    setMessages(prev => [...prev, { role: 'user', text: label, stepId: id }])
    setSuggestions([])
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        role: 'ai',
        text: '',
        stepId: id,
        isCrisis: step.isCrisis,
        crisisLines: step.crisisLines,
        categories: step.categories,
        statusBadge: step.statusBadge,
        upgradeInfo: step.upgradeInfo,
        isClarify: step.isClarify,
        clarifyOptions: step.clarifyOptions,
        clarifyConfidence: step.clarifyConfidence,
        clarifyReason: step.clarifyReason,
        transparencyItems: getTransparencyItems(step)
      }])
      setSuggestions(step.followUp.length > 0 ? step.followUp : [])
    }, 700 + Math.random() * 400)
  }, [])

  const handleClarifySelect = useCallback((label: string, nextId: string) => {
    handleSelect(nextId, label)
  }, [handleSelect])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, suggestions, scrollToBottom])

  const reset = () => {
    setMessages([])
    setSuggestions(starters)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-white via-white to-gray-50/30 overflow-hidden">
      {/* ─── HEADER ─── */}
      <div className="shrink-0 border-b border-gray-100/80 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center shadow-sm shadow-gray-900/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="text-[14px] font-semibold text-gray-900 tracking-tight">ClearPath AI</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/30" />
          </div>
          <div className="flex items-center gap-2">
            {hasMessages && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={reset}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* ─── CHAT AREA ─── */}
      <div ref={chatRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-2xl mx-auto px-4">

          {/* Empty state */}
          <AnimatePresence mode="wait">
            {!hasMessages && !isTyping && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="pt-[14vh] pb-8 text-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-gray-900/15"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[24px] font-bold text-gray-900 tracking-tight"
                >
                  How can I help?
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[13px] text-gray-400 mt-2 max-w-[280px] mx-auto leading-relaxed"
                >
                  I connect you with verified community resources. Calibrated confidence, not guesswork.
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className={`space-y-5 ${hasMessages ? 'pt-6 pb-6' : 'pt-4 pb-4'}`}>
            <AnimatePresence mode="popLayout">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-gray-100/90 rounded-2xl rounded-br-sm px-4 py-2.5">
                        <p className="text-[13px] leading-relaxed text-gray-900">{msg.text}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2.5 items-start">
                      {/* AI Avatar */}
                      <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center shrink-0 mt-0.5 shadow-sm shadow-gray-900/10">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
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

                        {/* Confidence upgrade ring animation */}
                        {msg.upgradeInfo && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25, delay: 0.2 }}
                            className="flex items-center gap-3 mb-3 p-3 bg-gradient-to-r from-emerald-50/60 to-blue-50/40 rounded-xl border border-emerald-100/40"
                          >
                            <ConfidenceRing value={msg.upgradeInfo.to} size={52} strokeWidth={3} delay={200} />
                            <div>
                              <p className="text-[11px] font-semibold text-gray-900">{msg.upgradeInfo.category}</p>
                              <p className="text-[10px] text-gray-500 mt-0.5">
                                <span className="line-through text-gray-300 mr-1">{msg.upgradeInfo.from}%</span>
                                <span className="font-semibold" style={{ color: getConfidenceColor(msg.upgradeInfo.to) }}>{msg.upgradeInfo.to}%</span>
                                <span className="text-gray-400 ml-1">after clarification</span>
                              </p>
                              <p className="text-[9px] text-emerald-600 font-medium mt-1">+{msg.upgradeInfo.to - msg.upgradeInfo.from}% confidence boost</p>
                            </div>
                          </motion.div>
                        )}

                        {/* Crisis */}
                        {msg.isCrisis && msg.crisisLines && (
                          <>
                            <p className="text-[13px] text-gray-700 leading-relaxed mb-3">I hear you, and I want to make sure you&apos;re safe right now. You don&apos;t have to go through this alone.</p>
                            <CrisisBlock lines={msg.crisisLines} />
                            <TransparencyPanel items={[
                              'Crisis keywords detected by hardcoded safety layer — not AI',
                              'AI models can misclassify crisis situations, so this check runs first and bypasses all AI processing',
                              'Your safety is always prioritized over resource matching'
                            ]} />
                          </>
                        )}

                        {/* Clarification */}
                        {msg.isClarify && msg.clarifyOptions && (
                          <>
                            <p className="text-[13px] text-gray-700 leading-relaxed mb-3">I want to help, but I need to understand your situation better to find the right resources.</p>
                            <ClarifyPanel
                              confidence={msg.clarifyConfidence || 0}
                              options={msg.clarifyOptions}
                              onSelect={handleClarifySelect}
                            />
                            <TransparencyPanel items={[
                              'Your request scored below 50% across all categories — too ambiguous for reliable matching',
                              'One clarification question can boost confidence by 30-40%, ensuring you get accurate resources',
                              'This is active learning — the model uses your answer to refine its classification'
                            ]} />
                          </>
                        )}

                        {/* Categories */}
                        {msg.categories && msg.categories.length > 0 && !msg.isCrisis && !msg.isClarify && (
                          <div className="space-y-2.5">
                            {msg.categories.map((cat, j) => <CategoryCard key={j} cat={cat} index={j} />)}
                          </div>
                        )}

                        {/* Transparency for regular results */}
                        {msg.categories && msg.categories.length > 0 && !msg.isCrisis && !msg.isClarify && msg.stepId && (
                          <TransparencyPanel items={getTransparencyItems(chatSteps[msg.stepId])} />
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing */}
            <AnimatePresence>
              {isTyping && <TypingIndicator />}
            </AnimatePresence>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className={`space-y-1.5 ${hasMessages ? 'pb-6' : 'pb-4'}`}>
              {suggestions.map((s, i) => {
                if ('icon' in s) {
                  return <SuggestionCard key={i} s={s as typeof starters[0]} index={i} onSelect={handleSelect} />
                }
                // Follow-up chips (smaller, simpler)
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28, delay: i * 0.05 }}
                    onClick={() => handleSelect(s.id, s.label)}
                    className="w-full text-left border border-gray-100 bg-white rounded-xl px-4 py-3 text-[12px] font-medium text-gray-700 hover:bg-gray-50/80 hover:border-gray-200 hover:shadow-sm active:scale-[0.995] transition-all duration-150"
                  >
                    {s.label}
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── INPUT BAR ─── */}
      <div className="shrink-0 border-t border-gray-100/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 bg-gray-50/80 rounded-2xl px-4 py-3 border border-gray-100/60 focus-within:border-gray-200 focus-within:bg-white transition-all">
            <input
              type="text"
              placeholder={hasMessages ? 'Choose a response above' : 'Describe what you need...'}
              className="flex-1 bg-transparent text-[13px] outline-none text-gray-900 placeholder:text-gray-300"
              disabled
            />
            <div className="w-8 h-8 rounded-full bg-gray-900/80 flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </div>
          </div>
          <p className="text-[10px] text-gray-300 text-center mt-1.5 flex items-center justify-center gap-1.5">
            <span className="inline-block w-1 h-1 rounded-full bg-emerald-400" />
            ClearPath AI — Verified resources · Calibrated confidence
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── HELPERS ─────────────────────────────────────────────
function getTransparencyItems(step: ChatStep): string[] {
  if (step.isCrisis) return [
    'Crisis keywords detected by hardcoded safety layer — not AI',
    'AI models can misclassify crisis situations, so this check runs first and bypasses all AI processing',
    'Your safety is always prioritized over resource matching'
  ]
  if (step.isClarify) return [
    'Your request scored below 50% across all categories — too ambiguous for reliable matching',
    'One clarification question can boost confidence by 30-40%, ensuring you get accurate resources',
    'This is active learning — the model uses your answer to refine its classification'
  ]

  const items: string[] = []
  if (step.upgradeInfo) {
    items.push(`Clarification narrowed classification from ambiguous to ${step.upgradeInfo.category} — confidence jumped from ${step.upgradeInfo.from}% to ${step.upgradeInfo.to}%`)
    items.push('The model combined your original text + clarification to re-score all categories')
  } else {
    items.push('Classified by BART-large-MNLI zero-shot model against 8 service categories')
  }
  items.push('Resources sourced from United Way 211 verified database')
  if (step.categories.some(c => c.confidence < 70)) {
    items.push(`${step.categories.filter(c => c.confidence < 70).map(c => c.label).join(', ')} below 70% threshold — consider providing more detail for better matches`)
  }
  return items
}
