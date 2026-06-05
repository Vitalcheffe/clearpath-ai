'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

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
  { id: 'job', label: 'Multi-Need', description: "I lost my job and can't pay rent. My kids need food." },
  { id: 'crisis', label: 'Crisis', description: "I can't take this anymore. I want it all to end." },
  { id: 'stress', label: 'Low Confidence', description: 'I need help with my situation' },
  { id: 'senior', label: 'Senior', description: "I'm 78 and need help getting groceries delivered" },
  { id: 'veteran', label: 'Complex', description: "I'm a veteran dealing with PTSD and housing issues" }
]

// ─── COMPONENTS ──────────────────────────────────────────

function ConfidenceBar({ value, animated = false }: { value: number; animated?: boolean }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 70 ? 'bg-sky-500' : value >= 50 ? 'bg-amber-500' : 'bg-orange-500'
  const textColor = value >= 80 ? 'text-emerald-600' : value >= 70 ? 'text-sky-600' : value >= 50 ? 'text-amber-600' : 'text-orange-600'
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-[3px] bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: animated ? `${value}%` : '0%' }}
        />
      </div>
      <span className={`text-[11px] font-bold tabular-nums tracking-tight ${textColor}`}>{value}%</span>
    </div>
  )
}

function StatusBadge({ type, text }: { type: 'crisis' | 'clarify' | 'verified' | 'upgrade'; text: string }) {
  const styles = {
    crisis: 'bg-red-50 text-red-700 border-red-200',
    clarify: 'bg-amber-50 text-amber-700 border-amber-200',
    verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    upgrade: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  const dotStyles = {
    crisis: 'bg-red-500 animate-pulse',
    clarify: 'bg-amber-500',
    verified: 'bg-emerald-500',
    upgrade: 'bg-emerald-500'
  }
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${styles[type]} mb-3`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[type]}`} />
      {text}
    </div>
  )
}

function CategoryCard({ cat, index }: { cat: Category; index: number }) {
  const [open, setOpen] = useState(false)
  const [animated, setAnimated] = useState(false)
  const low = cat.confidence < 70

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200 + index * 150)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 cursor-pointer hover:shadow-sm active:scale-[0.995] ${
        low
          ? 'border-amber-200/60 bg-gradient-to-b from-amber-50/30 to-white'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
      onClick={() => setOpen(!open)}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="min-w-0 flex-1">
            <h4 className="text-[13px] font-semibold text-gray-900 leading-tight tracking-tight">{cat.label}</h4>
            <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{cat.why}</p>
          </div>
          <div className="shrink-0 w-[72px]">
            <ConfidenceBar value={cat.confidence} animated={animated} />
          </div>
        </div>

        {cat.warning && (
          <div className="flex items-start gap-1.5 text-[9px] text-amber-700 mb-2.5 leading-relaxed bg-amber-50/50 rounded-lg px-2.5 py-1.5 border border-amber-100/50">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-px"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            {cat.warning}
          </div>
        )}

        {cat.resources.length > 0 && (
          <div className="space-y-2.5">
            {cat.resources.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-[18px] h-[18px] rounded-md bg-emerald-50 border border-emerald-100/60 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-gray-800 leading-tight">{r.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{r.detail}</p>
                  <div className="flex gap-2 mt-1">
                    {r.verified && <span className="text-[9px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100/50">Verified {r.verified}</span>}
                    {r.distance && <span className="text-[9px] text-sky-600 font-medium bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100/50">{r.distance}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {open && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {cat.also && <p className="text-[10px] text-gray-400 leading-relaxed"><span className="text-gray-500 font-medium">Also considered:</span> {cat.also}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

function CrisisBlock({ lines }: { lines: { name: string; action: string; call?: string }[] }) {
  return (
    <div className="rounded-2xl border border-red-200/50 bg-white overflow-hidden shadow-sm">
      <div className="bg-red-600 px-4 py-3.5">
        <div className="flex items-center gap-2 mb-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <p className="text-[13px] font-bold text-white tracking-tight">You are not alone.</p>
        </div>
        <p className="text-[10px] text-red-200 ml-[22px]">Crisis keyword detected — AI classification bypassed.</p>
      </div>
      <div className="p-3 space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="flex items-center gap-3 bg-red-50/50 rounded-xl p-3 border border-red-100/50">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-gray-900 leading-tight">{l.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{l.action}</p>
            </div>
            {l.call && (
              <button className="bg-red-600 text-white text-[10px] font-bold px-3 py-2 rounded-xl shrink-0 hover:bg-red-700 transition-colors shadow-sm">
                {l.call}
              </button>
            )}
          </div>
        ))}
        <p className="text-[9px] text-gray-400 text-center pt-1 flex items-center justify-center gap-1">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Nothing was stored or logged
        </p>
      </div>
    </div>
  )
}

function ClarifyCard({ confidence, options, onSelect }: { confidence: number; options: { label: string; nextId: string }[]; onSelect: (label: string, nextId: string) => void }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">AI Confidence: {confidence}%</p>
      <p className="text-[13px] font-medium text-gray-900 leading-snug mb-3">Which of these best describes what you need?</p>
      <div className="flex flex-col gap-1.5">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt.label, opt.nextId)}
            className="w-full text-left bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-gray-800 hover:border-gray-300 hover:shadow-sm active:scale-[0.98] transition-all duration-150"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function TransparencySection({ items }: { items: string[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mt-3 border-t border-gray-100 pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-600 transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
        Why these results?
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[300px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 items-start text-[11px] text-gray-500 leading-relaxed">
              <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0 mt-[6px]" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN ────────────────────────────────────────────────
export default function Home() {
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'ai'
    text: string
    stepId?: string
    isCrisis?: boolean
    crisisLines?: { name: string; action: string; call?: string }[]
    categories?: Category[]
    confidenceChange?: { before: number; after: number; label: string }
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
  const [activeClarify, setActiveClarify] = useState<string | null>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
    }, 50)
  }, [])

  const handleSelect = useCallback((id: string, label: string) => {
    const step = chatSteps[id]
    if (!step) return

    setMessages(prev => [...prev, { role: 'user', text: label, stepId: id }])
    setSuggestions([])
    setIsTyping(true)
    setActiveClarify(null)

    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, {
        role: 'ai',
        text: '',
        stepId: id,
        isCrisis: step.isCrisis,
        crisisLines: step.crisisLines,
        categories: step.categories,
        confidenceChange: step.confidenceChange,
        statusBadge: step.statusBadge,
        upgradeInfo: step.upgradeInfo,
        isClarify: step.isClarify,
        clarifyOptions: step.clarifyOptions,
        clarifyConfidence: step.clarifyConfidence,
        clarifyReason: step.clarifyReason,
        transparencyItems: getTransparencyItems(step)
      }])
      setSuggestions(step.followUp)
      if (step.isClarify) setActiveClarify(id)
    }, 800 + Math.random() * 400)
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
    setActiveClarify(null)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-100 bg-white">
        <div className="max-w-2xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <span className="text-[14px] font-semibold text-gray-900 tracking-tight">ClearPath AI</span>
          </div>
          {hasMessages && (
            <button onClick={reset} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-2xl mx-auto px-4">

          {/* Empty state */}
          {!hasMessages && !isTyping && (
            <div className="pt-[16vh] pb-8 text-center animate-[fadeUp_0.4s_ease]">
              <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-gray-900/10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">How can I help?</h1>
              <p className="text-[13px] text-gray-400 mt-2 max-w-[260px] mx-auto leading-relaxed">
                I connect you with verified community resources. Tell me what you need.
              </p>
            </div>
          )}

          {/* Messages */}
          <div className={`space-y-5 ${hasMessages ? 'pt-6 pb-6' : 'pt-4 pb-4'}`}>
            {messages.map((msg, i) => (
              <div key={i} className="animate-[fadeUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] bg-gray-100 rounded-2xl rounded-br-sm px-4 py-2.5">
                      <p className="text-[13px] leading-relaxed text-gray-900">{msg.text}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2.5 items-start">
                    {/* AI Avatar */}
                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Status badge */}
                      {msg.statusBadge === 'crisis' && <StatusBadge type="crisis" text="Crisis detected — AI classification bypassed" />}
                      {msg.statusBadge === 'clarify' && <StatusBadge type="clarify" text={`Confidence too low — clarification needed`} />}
                      {msg.statusBadge === 'verified' && msg.categories && msg.categories.length > 0 && <StatusBadge type="verified" text={`${msg.categories.length} verified resource${msg.categories.length > 1 ? 's' : ''} found`} />}
                      {msg.statusBadge === 'upgrade' && msg.upgradeInfo && <StatusBadge type="upgrade" text={`Confidence upgraded: ${msg.upgradeInfo.from}% → ${msg.upgradeInfo.to}%`} />}

                      {/* Crisis */}
                      {msg.isCrisis && msg.crisisLines && (
                        <>
                          <p className="text-[13px] text-gray-700 leading-relaxed mb-3">I hear you, and I want to make sure you&apos;re safe right now. You don&apos;t have to go through this alone.</p>
                          <CrisisBlock lines={msg.crisisLines} />
                          <TransparencySection items={[
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
                          <ClarifyCard
                            confidence={msg.clarifyConfidence || 0}
                            options={msg.clarifyOptions}
                            onSelect={handleClarifySelect}
                          />
                          <TransparencySection items={[
                            `Your request scored below 50% across all categories — too ambiguous for reliable matching`,
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
                        <TransparencySection items={getTransparencyItems(chatSteps[msg.stepId])} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing */}
            {isTyping && (
              <div className="flex gap-2.5 items-start animate-[fadeUp_0.2s_ease-out]">
                <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                <div className="flex items-center gap-1 py-2">
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '120ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '240ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className={`space-y-1.5 ${hasMessages ? 'pb-6' : 'pb-4'}`}>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(s.id, s.label)}
                  className="w-full text-left border border-gray-200 bg-white rounded-2xl px-4 py-3.5 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm active:scale-[0.995] transition-all duration-150 animate-[fadeUp_0.3s_cubic-bezier(0.16,1,0.3,1)]"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{s.label}</p>
                  <p className="text-[12px] text-gray-700 font-medium leading-snug">&ldquo;{s.description}&rdquo;</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input bar */}
      <div className="shrink-0 border-t border-gray-100 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-2.5">
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-all">
            <input
              type="text"
              placeholder={hasMessages ? 'Choose a response above' : 'Describe what you need...'}
              className="flex-1 bg-transparent text-[13px] outline-none text-gray-900 placeholder:text-gray-300"
              disabled
            />
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center shrink-0 opacity-40">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </div>
          </div>
          <p className="text-[10px] text-gray-300 text-center mt-1.5">ClearPath AI — Verified resources, calibrated confidence</p>
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
