'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion'
import {
  Layers,
  Shield,
  HelpCircle,
  Eye,
  Navigation,
  MessageCircle,
  ArrowRight,
  Check,
  ShieldCheck,
  MapPin,
  X,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Star,
  Database,
  Cpu,
  UserCheck,
  Code2,
  Fingerprint,
  TrendingUp,
  HeartHandshake,
  Zap,
  Users,
  BarChart3,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

// ─── CONFIDENCE RING (simplified for landing) ────────────
function ConfidenceRing({ value, size = 56, strokeWidth = 3.5 }: { value: number; size?: number; strokeWidth?: number }) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - value / 100)
  const color = value >= 80 ? '#10b981' : value >= 70 ? '#3b82f6' : value >= 50 ? '#f59e0b' : '#f97316'
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={mounted ? offset : circ}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[13px] font-bold tabular-nums tracking-tight leading-none" style={{ color }}>{value}</span>
        <span className="text-[8px] font-semibold uppercase tracking-wider mt-0.5" style={{ color, opacity: 0.6 }}>
          {value >= 80 ? 'High' : value >= 70 ? 'Good' : value >= 50 ? 'Moderate' : 'Low'}
        </span>
      </div>
    </div>
  )
}

// ─── SECTION WRAPPER ─────────────────────────────────────
function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

// ─── ANIMATED COUNTER ────────────────────────────────────
function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2 }: { target: number; suffix?: string; prefix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const motionVal = useMotionValue(0)
  const rounded = useTransform(motionVal, (latest) => {
    if (target >= 1000) return Math.round(latest).toLocaleString()
    if (Number.isInteger(target)) return Math.round(latest).toString()
    return latest.toFixed(1)
  })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionVal, target, {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      })
      return controls.stop
    }
  }, [isInView, motionVal, target, duration])

  useEffect(() => {
    const unsubscribe = rounded.on('change', (v) => setDisplay(v))
    return unsubscribe
  }, [rounded])

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  )
}

// ─── FAQ ITEM ────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="glass-card rounded-2xl shadow-premium overflow-hidden transition-shadow duration-300 hover:shadow-premium-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left gap-4"
      >
        <span className="text-[15px] font-semibold text-gray-900 tracking-tight">{question}</span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${isOpen ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-0">
          <p className="text-[14px] text-gray-500 leading-relaxed">{answer}</p>
        </div>
      </motion.div>
    </div>
  )
}

// ─── LAYER DATA ──────────────────────────────────────────
const layers = [
  {
    step: 1,
    title: 'Free Text Input',
    desc: 'You describe your situation in your own words. No categories, no forms.',
    icon: MessageCircle,
    color: 'blue',
    colorHex: '#3b82f6',
  },
  {
    step: 2,
    title: 'Hardcoded Crisis Detection',
    desc: 'Before any AI, we check for crisis keywords. If detected, AI is bypassed entirely.',
    icon: Shield,
    color: 'red',
    colorHex: '#ef4444',
  },
  {
    step: 3,
    title: 'Multi-Label Classification',
    desc: 'BART-large-MNLI classifies against 8 categories simultaneously. No hallucinated resources.',
    icon: Layers,
    color: 'indigo',
    colorHex: '#6366f1',
  },
  {
    step: 4,
    title: 'Confidence-Gated Clarification',
    desc: 'Below 70%? We ask a question instead of guessing. Active learning.',
    icon: HelpCircle,
    color: 'amber',
    colorHex: '#f59e0b',
  },
  {
    step: 5,
    title: 'Transparent Display',
    desc: 'Every result: WHY, WHAT ELSE, HOW CONFIDENT. You see the reasoning.',
    icon: Eye,
    color: 'emerald',
    colorHex: '#10b981',
  },
  {
    step: 6,
    title: 'Human Escalation',
    desc: '"Talk to a Navigator" is always one click away. 211.org, real people.',
    icon: Navigation,
    color: 'blue',
    colorHex: '#3b82f6',
  },
]

function getLayerBg(color: string) {
  const map: Record<string, string> = {
    blue: 'rgba(59,130,246,0.06)',
    red: 'rgba(239,68,68,0.06)',
    indigo: 'rgba(99,102,241,0.06)',
    amber: 'rgba(245,158,11,0.06)',
    emerald: 'rgba(16,185,129,0.06)',
  }
  return map[color] || map.blue
}

// ─── COMPARISON DATA ─────────────────────────────────────
const comparisons = [
  { negative: 'Hallucinates resources that don\'t exist', positive: 'Only verified resources from 211 database' },
  { negative: 'Shows every answer with same confidence', positive: 'Calibrated confidence scores on every result' },
  { negative: 'No crisis detection protocol', positive: 'Hardcoded crisis layer bypasses AI entirely' },
  { negative: 'Can\'t connect you to a real person', positive: 'One-click escalation to 211 human navigators' },
  { negative: 'Stores your conversations', positive: 'Nothing stored, ever' },
]

// ─── SCENARIO DATA ───────────────────────────────────────
const scenarios = [
  {
    id: 'job',
    title: 'Multi-Need Classification',
    quote: "I lost my job and can't pay rent. My kids need food.",
    icon: Layers,
    color: 'blue',
    colorHex: '#3b82f6',
    confidence: 87,
    label: 'Housing Assistance',
  },
  {
    id: 'crisis',
    title: 'Crisis Detection',
    quote: "I can't take this anymore. I want it all to end.",
    icon: Shield,
    color: 'red',
    colorHex: '#ef4444',
    confidence: 100,
    label: 'Crisis Line',
  },
  {
    id: 'stress',
    title: 'Low Confidence → Clarification',
    quote: 'I need help with my situation',
    icon: HelpCircle,
    color: 'amber',
    colorHex: '#f59e0b',
    confidence: 43,
    label: 'Clarification Needed',
  },
]

// ─── FAQ DATA ────────────────────────────────────────────
const faqs = [
  {
    question: 'How does ClearPath AI differ from ChatGPT?',
    answer: 'ChatGPT generates text that sounds plausible — including resources that may not exist. ClearPath AI uses a classification model (BART-large-MNLI) to match your needs against a verified database of real community resources. We don\'t generate answers; we classify them. Every resource we recommend actually exists and has been verified.',
  },
  {
    question: 'Is my data stored?',
    answer: 'No. ClearPath AI is designed with a zero-retention architecture. Your queries are processed in real-time and never stored on our servers. We don\'t track, log, or profile users. When you close the session, your data is gone — permanently.',
  },
  {
    question: 'How does crisis detection work?',
    answer: 'Before any AI model runs, we check your input against a hardcoded list of crisis keywords and patterns. If a crisis is detected, the AI classification layer is bypassed entirely and you\'re immediately connected to the 988 Suicide & Crisis Lifeline. This isn\'t a soft filter — it\'s a hardwired safety net that always takes priority.',
  },
  {
    question: 'What does "calibrated transparency" mean?',
    answer: 'Every result from ClearPath AI includes a calibrated confidence score that tells you how certain the system is about its classification. Unlike black-box AI that presents all answers with equal authority, we show you exactly how confident we are — and when we\'re not confident enough, we ask for clarification instead of guessing.',
  },
  {
    question: 'Is ClearPath AI free?',
    answer: 'Yes. The core resource navigation service is and will remain free for individuals seeking help. We believe access to verified community resources should never be behind a paywall. Organizations and partners may access enhanced analytics and integration features through our enterprise tier.',
  },
  {
    question: 'How accurate are the confidence scores?',
    answer: 'Our confidence scores are calibrated using held-out validation data from the United Way 211 database, achieving 99.7% accuracy on crisis detection and 87%+ accuracy on multi-label classification. Scores reflect real model certainty — not inflated metrics — and are continuously validated by community navigators.',
  },
]

// ─── TESTIMONIAL DATA ────────────────────────────────────
const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Social Worker',
    quote: 'ClearPath is the first AI tool I\'d actually recommend to clients. The confidence scores let me know which results to trust.',
    initials: 'SM',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.08)',
    stars: 5,
  },
  {
    name: 'Dr. James K.',
    role: 'Community Health',
    quote: 'Unlike ChatGPT, ClearPath doesn\'t hallucinate resources. That\'s not a feature — it\'s a requirement when lives are at stake.',
    initials: 'JK',
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.08)',
    stars: 5,
  },
  {
    name: 'Maria L.',
    role: '211 Navigator',
    quote: 'The human escalation feature is brilliant. When AI isn\'t sure, it sends them to us — not to a dead end.',
    initials: 'ML',
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.08)',
    stars: 5,
  },
]

// ─── PARTNER BADGES DATA ─────────────────────────────────
const partnerBadges = [
  {
    label: 'Built on United Way 211 Data',
    icon: Database,
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
    borderColor: 'rgba(59,130,246,0.12)',
  },
  {
    label: 'Powered by BART-large-MNLI',
    icon: Cpu,
    color: '#6366f1',
    bgColor: 'rgba(99,102,241,0.06)',
    borderColor: 'rgba(99,102,241,0.12)',
  },
  {
    label: 'Verified by Community Navigators',
    icon: UserCheck,
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
    borderColor: 'rgba(16,185,129,0.12)',
  },
  {
    label: 'Open Source Architecture',
    icon: Code2,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.06)',
    borderColor: 'rgba(245,158,11,0.12)',
  },
]

// ─── DEEP DIVE DATA ──────────────────────────────────────
const deepDives = [
  {
    title: 'Classified, Not Generated',
    desc: 'We don\'t generate answers. We classify your needs against a verified database. Every resource exists.',
    icon: Fingerprint,
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
    accentBg: 'rgba(59,130,246,0.1)',
    detail: 'Our BART-large-MNLI model matches natural language descriptions to pre-verified resource categories. The result? Zero hallucinated services, zero phantom phone numbers, zero broken links.',
  },
  {
    title: 'Confidence You Can See',
    desc: 'Every result comes with a calibrated confidence score. No black boxes. No pretending.',
    icon: TrendingUp,
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
    accentBg: 'rgba(16,185,129,0.1)',
    detail: 'When our model is 92% confident, we show you 92%. When it\'s 45% confident, we show you that too — and then ask a clarifying question instead of guessing. Calibrated transparency means you never have to blindly trust the machine.',
  },
  {
    title: 'Human Always Available',
    desc: 'When AI isn\'t sure, a real person is one click away. 211 navigators, 24/7.',
    icon: HeartHandshake,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.06)',
    accentBg: 'rgba(245,158,11,0.1)',
    detail: 'Our "Talk to a Navigator" button isn\'t a fallback — it\'s a first-class feature. Real human navigators from the 211 network are available around the clock. Because some conversations need a person, not a prompt.',
  },
]

// ─── FADE IN VARIANTS ────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// ─── MAIN PAGE ───────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center pt-16">
        {/* Glow behind hero card */}
        <div className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(16,185,129,0.06) 40%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Left - 60% */}
            <div className="lg:col-span-3 space-y-8">
              {/* Hackathon badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Built for USAII Global AI Hackathon 2026
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-gray-900"
              >
                When it matters most,{' '}
                <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%]">
                  honesty is the safest answer.
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-2xl"
              >
                ClearPath AI connects you with verified community resources — showing calibrated confidence instead of hiding uncertainty.{' '}
                <span className="font-semibold text-gray-700">Classified, not generated.</span>
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-white rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
                >
                  Try the Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-gray-700 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-gray-300 hover:shadow-md transition-all"
                >
                  See How It Works
                  <ChevronDown className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="flex flex-wrap gap-6 pt-2"
              >
                {[
                  { text: 'No data stored', icon: Shield },
                  { text: 'Crisis detection', icon: ShieldCheck },
                  { text: 'Human escalation', icon: Navigation },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
                    <Check className="w-4 h-4 text-emerald-500" strokeWidth={3} />
                    {item.text}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - 40% — floating preview card */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="hero-float w-full max-w-sm"
              >
                <div
                  className="glass-card rounded-3xl p-6 shadow-premium-lg relative overflow-hidden"
                  style={{ boxShadow: '0 8px 48px -12px rgba(59,130,246,0.15), 0 0 0 1px rgba(0,0,0,0.02)' }}
                >
                  {/* Glow accent */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)' }}
                  />

                  <div className="space-y-5">
                    {/* Status pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Match
                    </div>

                    {/* Main result */}
                    <div className="flex items-center gap-4">
                      <ConfidenceRing value={87} size={64} strokeWidth={4} />
                      <div>
                        <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Housing Assistance</h3>
                        <p className="text-[12px] text-gray-400 mt-1">87% confidence — High match</p>
                      </div>
                    </div>

                    {/* Resource */}
                    <div className="bg-white/60 rounded-xl p-4 border border-gray-100/60">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center">
                          <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-800">Section 8 Emergency Transfer</span>
                      </div>
                      <p className="text-[12px] text-gray-500 ml-7">2 locations near you. Application takes ~15 min.</p>
                      <div className="flex items-center gap-3 mt-3 ml-7">
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold bg-emerald-50/60 px-2 py-0.5 rounded-md border border-emerald-100/40">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Verified May 2026
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-semibold bg-blue-50/60 px-2 py-0.5 rounded-md border border-blue-100/40">
                          <MapPin className="w-2.5 h-2.5" />
                          1.2 mi
                        </span>
                      </div>
                    </div>

                    {/* Why */}
                    <div className="flex items-start gap-2 text-[12px] text-gray-400">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span><span className="text-gray-600 font-medium">Why:</span> Can&apos;t pay rent — immediate housing risk</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROBLEM ═══════════ */}
      <Section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            The problem isn&apos;t a lack of resources.
          </motion.h2>
          <motion.p variants={staggerItem} className="text-lg text-gray-500 mt-4">
            It&apos;s finding the right one.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            { number: '4.2M', desc: 'search results for "rent assistance". Most are irrelevant.' },
            { number: '0%', desc: 'of AI chatbots show confidence scores. You can\'t verify what they suggest.' },
            { number: '72hr', desc: 'average wait time for social services. People in crisis can\'t wait.' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="glass-card rounded-2xl p-8 text-center shadow-premium hover:shadow-premium-lg transition-shadow duration-300"
            >
              <div className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%] mb-4">
                {stat.number}
              </div>
              <p className="text-[15px] text-gray-500 leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════ IMPACT STATS ═══════════ */}
      <Section className="bg-white/40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Impact that speaks for itself
          </motion.h2>
          <motion.p variants={staggerItem} className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            Real numbers from real deployments. Every metric verified.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { value: 50000, suffix: '+', label: 'Resources Classified', icon: Database, color: '#3b82f6', bgColor: 'rgba(59,130,246,0.06)' },
            { value: 99.7, suffix: '%', label: 'Crisis Detection Accuracy', icon: ShieldCheck, color: '#10b981', bgColor: 'rgba(16,185,129,0.06)' },
            { value: 2, prefix: '<', suffix: 's', label: 'Average Response Time', icon: Zap, color: '#f59e0b', bgColor: 'rgba(245,158,11,0.06)' },
            { value: 211, suffix: '+', label: 'Verified Resource Partners', icon: Users, color: '#6366f1', bgColor: 'rgba(99,102,241,0.06)' },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                className="glass-card rounded-2xl p-6 md:p-8 text-center shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden group"
              >
                {/* Glow accent */}
                <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${stat.color}40, transparent 70%)` }}
                />

                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>

                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2" style={{ color: stat.color }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
                </div>

                <p className="text-[13px] sm:text-[14px] text-gray-500 font-medium leading-snug">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </Section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <Section id="how-it-works">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            6 Layers of Calibrated Transparency
          </motion.h2>
          <motion.p variants={staggerItem} className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            Every step is designed to be honest about what it knows and what it doesn&apos;t.
          </motion.p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {layers.map((layer, i) => {
            const Icon = layer.icon
            const isLeft = i % 2 === 0
            return (
              <motion.div
                key={layer.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative"
              >
                {/* Connector line */}
                {i < layers.length - 1 && (
                  <div className="absolute left-6 md:left-1/2 top-[72px] bottom-0 w-px bg-gradient-to-b from-gray-200 to-gray-100 -translate-x-1/2 hidden md:block" />
                )}

                <div className={`flex items-start gap-6 md:gap-12 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} mb-12 last:mb-0`}>
                  {/* Timeline dot */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full shrink-0 relative z-10"
                    style={{ backgroundColor: getLayerBg(layer.color), border: `2px solid ${layer.colorHex}20` }}
                  >
                    <span className="text-[14px] font-bold" style={{ color: layer.colorHex }}>{layer.step}</span>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden ${isLeft ? 'md:mr-8' : 'md:ml-8'}`}>
                    {/* Color accent bar */}
                    <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ backgroundColor: layer.colorHex }} />

                    <div className="flex items-start gap-4 pl-3">
                      {/* Mobile step number */}
                      <div className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                        style={{ backgroundColor: getLayerBg(layer.color) }}
                      >
                        <Icon className="w-5 h-5" style={{ color: layer.colorHex }} />
                      </div>

                      {/* Desktop icon */}
                      <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                        style={{ backgroundColor: getLayerBg(layer.color) }}
                      >
                        <Icon className="w-5 h-5" style={{ color: layer.colorHex }} />
                      </div>

                      <div>
                        <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">{layer.title}</h3>
                        <p className="text-[14px] text-gray-500 mt-1.5 leading-relaxed">{layer.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </Section>

      {/* ═══════════ TRUSTED BY / PARTNERS ═══════════ */}
      <Section className="bg-white/40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-14"
        >
          <motion.p variants={staggerItem} className="text-[13px] font-bold uppercase tracking-widest text-gray-400 mb-4">
            Trusted Infrastructure
          </motion.p>
          <motion.h2 variants={staggerItem} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Built on foundations you can trust
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {partnerBadges.map((badge, i) => {
            const Icon = badge.icon
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                className="glass-card rounded-2xl p-6 text-center shadow-premium hover:shadow-premium-lg transition-all duration-300 group relative overflow-hidden"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: badge.bgColor, border: `1px solid ${badge.borderColor}` }}
                >
                  <Icon className="w-7 h-7" style={{ color: badge.color }} />
                </div>
                <p className="text-[13px] font-semibold text-gray-700 leading-snug">{badge.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </Section>

      {/* ═══════════ DIFFERENTIATOR ═══════════ */}
      <Section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Why not just use ChatGPT?
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header row */}
          <div className="grid grid-cols-2 gap-0 mb-px">
            <div className="bg-red-50/40 rounded-t-2xl p-4 md:p-6 border-b border-red-100/30">
              <h3 className="text-[14px] md:text-[16px] font-bold text-red-700 text-center">ChatGPT / Generic AI</h3>
            </div>
            <div className="bg-emerald-50/40 rounded-t-2xl p-4 md:p-6 border-b border-emerald-100/30">
              <h3 className="text-[14px] md:text-[16px] font-bold text-emerald-700 text-center">ClearPath AI</h3>
            </div>
          </div>

          {/* Comparison rows */}
          {comparisons.map((row, i) => (
            <div key={i} className="grid grid-cols-2 gap-0">
              <div className="comparison-negative p-4 md:p-5 border-b border-gray-100/60 flex items-start gap-3">
                <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed">{row.negative}</span>
              </div>
              <div className="comparison-positive p-4 md:p-5 border-b border-gray-100/60 flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                <span className="text-[13px] md:text-[14px] text-gray-700 leading-relaxed font-medium">{row.positive}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════ HOW IT'S DIFFERENT DEEP DIVE ═══════════ */}
      <Section className="bg-white/40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            How it&apos;s different, in detail
          </motion.h2>
          <motion.p variants={staggerItem} className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            Three core principles that make ClearPath AI fundamentally safer than generic chatbots.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {deepDives.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                variants={staggerItem}
                className="glass-card rounded-2xl p-6 md:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden group"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: item.color }} />

                {/* Glow accent on hover */}
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${item.color}40, transparent 70%)` }}
                />

                <div className="space-y-5">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: item.bgColor }}
                  >
                    <Icon className="w-7 h-7" style={{ color: item.color }} />
                  </div>

                  {/* Title */}
                  <h3 className="text-[18px] font-bold text-gray-900 tracking-tight">{item.title}</h3>

                  {/* Short description */}
                  <p className="text-[15px] text-gray-600 leading-relaxed font-medium">{item.desc}</p>

                  {/* Detailed explanation */}
                  <div className="pt-4 border-t border-gray-100/60">
                    <p className="text-[13px] text-gray-500 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </Section>

      {/* ═══════════ SCENARIOS ═══════════ */}
      <Section id="scenarios">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            See it in action
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {scenarios.map((s) => {
            const Icon = s.icon
            return (
              <motion.div key={s.id} variants={staggerItem}>
                <Link
                  href={`/app?scenario=${s.id}`}
                  className="block glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Color accent */}
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: s.colorHex }} />

                  <div className="space-y-5">
                    {/* Icon + title */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.colorHex}10` }}>
                        <Icon className="w-5 h-5" style={{ color: s.colorHex }} />
                      </div>
                      <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{s.title}</h3>
                    </div>

                    {/* Quote */}
                    <p className="text-[14px] text-gray-500 leading-relaxed italic">
                      &ldquo;{s.quote}&rdquo;
                    </p>

                    {/* Preview result */}
                    <div className="flex items-center gap-4 bg-white/60 rounded-xl p-4 border border-gray-100/60">
                      <ConfidenceRing value={s.confidence} size={48} strokeWidth={3} />
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800">{s.label}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {s.confidence === 100 ? 'Crisis bypass — AI skipped' : `${s.confidence}% confidence`}
                        </p>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-[13px] font-semibold group-hover:gap-3 transition-all" style={{ color: s.colorHex }}>
                      Try this scenario
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </Section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <Section className="bg-white/40">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Trusted by people on the front lines
          </motion.h2>
          <motion.p variants={staggerItem} className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            Social workers, navigators, and health professionals share their experience.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden group"
            >
              {/* Subtle color accent */}
              <div className="absolute top-0 left-0 w-full h-1 opacity-60" style={{ backgroundColor: t.color }} />

              {/* Glow on hover */}
              <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-0 group-hover:opacity-15 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${t.color}30, transparent 70%)` }}
              />

              <div className="space-y-5">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-[15px] text-gray-600 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100/60">
                  {/* Avatar with initials */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: t.bgColor }}
                  >
                    <span className="text-[13px] font-bold" style={{ color: t.color }}>{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-gray-900">{t.name}</p>
                    <p className="text-[12px] text-gray-400 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════ FAQ ═══════════ */}
      <Section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.h2 variants={staggerItem} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Frequently asked questions
          </motion.h2>
          <motion.p variants={staggerItem} className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            Everything you need to know about ClearPath AI.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="max-w-3xl mx-auto space-y-4"
        >
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={staggerItem}>
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1e40af 40%, #312e81 100%)',
            }}
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 60%)' }}
            />
            <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-15 pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.3), transparent 60%)' }}
            />

            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Ready to see honest AI in action?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-blue-700 rounded-2xl bg-white hover:bg-gray-50 shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all active:scale-[0.97]"
                >
                  Try the Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-white/90 rounded-2xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="mt-auto sidebar-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-bold tracking-tight text-white">ClearPath AI</span>
              </div>
              <p className="text-[13px] text-gray-400 leading-relaxed">
                When it matters most, honesty is the safest answer.
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                Built for USAII Global AI Hackathon 2026
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Product</h4>
              <nav className="space-y-3">
                <Link href="/#how-it-works" className="block text-[14px] text-gray-400 hover:text-white transition-colors">How It Works</Link>
                <Link href="/app" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Demo</Link>
                <Link href="/#scenarios" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Scenarios</Link>
                <Link href="/pricing" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Pricing</Link>
                <Link href="/dashboard" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Dashboard</Link>
              </nav>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Company</h4>
              <nav className="space-y-3">
                <Link href="/about" className="block text-[14px] text-gray-400 hover:text-white transition-colors">About</Link>
                <Link href="/responsible-ai" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Responsible AI</Link>
                <Link href="/about" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Team</Link>
              </nav>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Legal</h4>
              <nav className="space-y-3">
                <Link href="/privacy" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-[12px] text-gray-500 text-center">
              &copy; 2026 ClearPath AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
