'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Shield,
  HelpCircle,
  Eye,
  Navigation,
  MessageCircle,
  ArrowRight,
  Clock,
  Sparkles,
  TrendingUp,
  Check,
  ShieldCheck,
  Activity,
  HomeIcon,
  Plus,
  Lightbulb,
  Bookmark,
  MapPin,
  Calendar,
  BarChart3,
  Tag,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

// ─── MOCK DATA ──────────────────────────────────────────
const recentConversations = [
  { id: '1', title: 'Job loss and rent help', timestamp: '2 hours ago', confidence: 87, preview: "I lost my job and can't pay rent...", scenario: 'job' },
  { id: '2', title: 'Crisis support', timestamp: 'Yesterday', confidence: 100, preview: "I can't take this anymore...", scenario: 'crisis' },
  { id: '3', title: 'Housing clarification', timestamp: '2 days ago', confidence: 43, preview: 'I need help with my situation', scenario: 'stress' },
  { id: '4', title: 'Senior grocery delivery', timestamp: '3 days ago', confidence: 94, preview: "I'm 78 and need help...", scenario: 'senior' },
  { id: '5', title: 'Veteran PTSD support', timestamp: 'Last week', confidence: 91, preview: "I'm a veteran dealing with PTSD...", scenario: 'job' },
]

// ─── WEEKLY ACTIVITY DATA ───────────────────────────────
const weeklyActivity = [
  { day: 'Mon', value: 4 },
  { day: 'Tue', value: 7 },
  { day: 'Wed', value: 3 },
  { day: 'Thu', value: 8 },
  { day: 'Fri', value: 5 },
  { day: 'Sat', value: 2 },
  { day: 'Sun', value: 6 },
]

// ─── CATEGORY BREAKDOWN DATA ────────────────────────────
const categoryBreakdown = [
  { label: 'Housing', percentage: 38, colorHex: '#3b82f6', bgClass: 'bg-blue-500' },
  { label: 'Food Assistance', percentage: 22, colorHex: '#f59e0b', bgClass: 'bg-amber-500' },
  { label: 'Mental Health', percentage: 18, colorHex: '#8b5cf6', bgClass: 'bg-violet-500' },
  { label: 'Legal Aid', percentage: 12, colorHex: '#06b6d4', bgClass: 'bg-cyan-500' },
  { label: 'Employment', percentage: 10, colorHex: '#10b981', bgClass: 'bg-emerald-500' },
]

// ─── SAVED RESOURCES DATA ───────────────────────────────
const savedResources = [
  {
    id: '1',
    title: 'Section 8 Emergency Transfer',
    category: 'Housing',
    categoryColorHex: '#3b82f6',
    categoryBg: 'rgba(59,130,246,0.08)',
    status: '2 locations',
    verifiedDate: 'May 2026',
    icon: HomeIcon,
  },
  {
    id: '2',
    title: 'SNAP Benefits Application',
    category: 'Food',
    categoryColorHex: '#f59e0b',
    categoryBg: 'rgba(245,158,11,0.08)',
    status: 'Apply online',
    verifiedDate: 'June 2026',
    icon: Sparkles,
  },
  {
    id: '3',
    title: 'Veteran PTSD Counseling',
    category: 'Mental Health',
    categoryColorHex: '#8b5cf6',
    categoryBg: 'rgba(139,92,246,0.08)',
    status: '3 locations',
    verifiedDate: 'April 2026',
    icon: Shield,
  },
]

// ─── QUICK TIPS DATA ────────────────────────────────────
const quickTips = [
  {
    title: 'Be specific',
    description: "The more detail you provide, the better we can classify your needs. Try: 'I lost my job and need help with rent and food.'",
  },
  {
    title: 'Check confidence scores',
    description: 'Higher confidence means a better match. If confidence is low, try rephrasing or use the clarification questions.',
  },
  {
    title: 'Talk to a navigator',
    description: 'When in doubt, a real person is always one click away. 211 navigators are available 24/7.',
  },
]

// ─── CONFIDENCE HELPERS ─────────────────────────────────
function getConfidenceColor(value: number): string {
  if (value >= 80) return '#10b981'
  if (value >= 70) return '#3b82f6'
  if (value >= 50) return '#f59e0b'
  return '#f97316'
}

function getConfidenceLabel(value: number): string {
  if (value >= 80) return 'High'
  if (value >= 70) return 'Good'
  if (value >= 50) return 'Moderate'
  return 'Low'
}

function getConfidenceBg(value: number): string {
  if (value >= 80) return 'rgba(16,185,129,0.08)'
  if (value >= 70) return 'rgba(59,130,246,0.08)'
  if (value >= 50) return 'rgba(245,158,11,0.08)'
  return 'rgba(249,115,22,0.08)'
}

// ─── GREETING LOGIC ─────────────────────────────────────
function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

// ─── QUICK ACTIONS DATA ─────────────────────────────────
const quickActions = [
  {
    title: 'Find housing help',
    description: 'Rent, shelter, and housing assistance resources',
    icon: HomeIcon,
    href: '/app?scenario=job',
    colorHex: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
  },
  {
    title: 'Mental health support',
    description: 'Crisis lines, counseling, and emotional support',
    icon: Shield,
    href: '/app?scenario=crisis',
    colorHex: '#ef4444',
    bgColor: 'rgba(239,68,68,0.06)',
  },
  {
    title: 'Check my situation',
    description: 'Not sure what you need? We\'ll help clarify',
    icon: HelpCircle,
    href: '/app?scenario=stress',
    colorHex: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.06)',
  },
  {
    title: 'Senior services',
    description: 'Grocery delivery, care, and senior programs',
    icon: Activity,
    href: '/app?scenario=senior',
    colorHex: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
  },
]

// ─── 6-LAYER ARCHITECTURE ───────────────────────────────
const architectureLayers = [
  { step: 1, title: 'Free Text Input', icon: MessageCircle, colorHex: '#3b82f6' },
  { step: 2, title: 'Crisis Detection', icon: Shield, colorHex: '#ef4444' },
  { step: 3, title: 'Classification', icon: Layers, colorHex: '#6366f1' },
  { step: 4, title: 'Confidence Gate', icon: HelpCircle, colorHex: '#f59e0b' },
  { step: 5, title: 'Transparent Display', icon: Eye, colorHex: '#10b981' },
  { step: 6, title: 'Human Escalation', icon: Navigation, colorHex: '#3b82f6' },
]

// ─── ANIMATION VARIANTS ─────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// ─── STATS DATA ─────────────────────────────────────────
const stats = [
  { label: 'Total conversations', value: '24', icon: MessageCircle, colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.06)', change: '+3 this week' },
  { label: 'Resources found', value: '47', icon: Sparkles, colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.06)', change: '+8 this week' },
  { label: 'Average confidence', value: '84%', icon: TrendingUp, colorHex: '#8b5cf6', bgColor: 'rgba(139,92,246,0.06)', change: 'Above threshold' },
]

// ─── MAIN DASHBOARD PAGE ────────────────────────────────
export default function DashboardPage() {
  const greeting = useMemo(() => getGreeting(), [])
  const [archOpen, setArchOpen] = useState(false)

  const maxActivityValue = useMemo(() => Math.max(...weeklyActivity.map(d => d.value)), [])
  const totalWeeklyConversations = useMemo(() => weeklyActivity.reduce((sum, d) => sum + d.value, 0), [])

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══════════ WELCOME SECTION ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="pt-8 pb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* User avatar */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md shadow-gray-900/15">
                    <span className="text-[15px] font-bold text-white">A</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                      {greeting}, Alex
                    </h1>
                    <p className="text-[15px] text-gray-500 mt-0.5">
                      How can we help you today?
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
                >
                  <Plus className="w-4 h-4" />
                  New conversation
                </Link>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ STATS ROW ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="glass-card glass-card-hover rounded-2xl p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 relative overflow-hidden group"
                >
                  {/* Decorative glow */}
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${stat.colorHex}12, transparent 70%)` }}
                  />

                  <div className="flex items-start justify-between relative z-10">
                    <div className="space-y-3">
                      <p className="text-[13px] font-medium text-gray-500">{stat.label}</p>
                      <p className="text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</p>
                      <p className="text-[12px] font-medium" style={{ color: stat.colorHex }}>{stat.change}</p>
                    </div>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.colorHex }} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.section>

          {/* ═══════════ WEEKLY ACTIVITY CHART ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="glass-card rounded-2xl p-6 shadow-premium relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/8 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold tracking-tight text-gray-900">This Week&apos;s Activity</h2>
                    <p className="text-[13px] text-gray-500 mt-0.5">{totalWeeklyConversations} conversations this week</p>
                  </div>
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end justify-between gap-2 sm:gap-4 h-44 sm:h-52 px-2">
                {weeklyActivity.map((item, i) => {
                  const heightPercent = (item.value / maxActivityValue) * 100
                  return (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      {/* Value label */}
                      <span className="text-[11px] font-bold text-gray-500">{item.value}</span>

                      {/* Bar */}
                      <div className="w-full flex justify-center" style={{ height: '140px' }}>
                        <div className="relative w-full max-w-[44px] h-full flex items-end">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="w-full rounded-t-lg"
                            style={{
                              background: 'linear-gradient(to top, #3b82f6, #60a5fa)',
                              minHeight: '4px',
                            }}
                          />
                        </div>
                      </div>

                      {/* Day label */}
                      <span className="text-[12px] font-semibold text-gray-400">{item.day}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </motion.section>

          {/* ═══════════ QUICK ACTIONS ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.h2
              variants={staggerItem}
              className="text-[18px] font-bold tracking-tight text-gray-900 mb-5"
            >
              Quick actions
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <motion.div key={action.title} variants={staggerItem}>
                    <Link
                      href={action.href}
                      className="block glass-card glass-card-hover rounded-2xl p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 group relative overflow-hidden card-shine gradient-border"
                    >
                      <div className="space-y-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: action.bgColor }}
                        >
                          <Icon className="w-5 h-5" style={{ color: action.colorHex }} />
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{action.title}</h3>
                          <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{action.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
                          Get started
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* ═══════════ CATEGORY BREAKDOWN ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="glass-card rounded-2xl p-6 shadow-premium"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-violet-500/8 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Resource Categories</h2>
                  <p className="text-[13px] text-gray-500 mt-0.5">Distribution across conversation topics</p>
                </div>
              </div>

              {/* Horizontal bars */}
              <div className="space-y-4">
                {categoryBreakdown.map((cat, i) => (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-gray-700">{cat.label}</span>
                      <span className="text-[14px] font-bold" style={{ color: cat.colorHex }}>{cat.percentage}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100/80 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.percentage}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.colorHex }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.section>

          {/* ═══════════ RECENT CONVERSATIONS ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="flex items-center justify-between mb-5"
            >
              <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Recent conversations</h2>
              <Link
                href="/history"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <div className="glass-card rounded-2xl shadow-premium overflow-hidden">
              <div className="divide-y divide-gray-100/60">
                {recentConversations.map((conv, i) => {
                  const confColor = getConfidenceColor(conv.confidence)
                  const confLabel = getConfidenceLabel(conv.confidence)
                  const confBg = getConfidenceBg(conv.confidence)
                  const scenarioMap: Record<string, string> = {
                    job: '/app?scenario=job',
                    crisis: '/app?scenario=crisis',
                    stress: '/app?scenario=stress',
                    senior: '/app?scenario=senior',
                  }

                  return (
                    <motion.div
                      key={conv.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <Link
                        href={scenarioMap[conv.scenario] || '/app'}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-white/60 transition-colors group"
                      >
                        {/* Confidence dot */}
                        <div className="relative shrink-0">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: confColor }}
                          />
                          <div
                            className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-30"
                            style={{ backgroundColor: confColor }}
                          />
                        </div>

                        {/* Title + preview */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <h4 className="text-[14px] font-semibold text-gray-900 truncate">{conv.title}</h4>
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0"
                              style={{ backgroundColor: confBg, color: confColor }}
                            >
                              {conv.confidence}% {confLabel}
                            </span>
                          </div>
                          <p className="text-[13px] text-gray-400 truncate mt-0.5">{conv.preview}</p>
                        </div>

                        {/* Timestamp + arrow */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {conv.timestamp}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* View all link at bottom */}
              <div className="px-5 py-3 bg-gray-50/40 border-t border-gray-100/60">
                <Link
                  href="/history"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View all conversations
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ SAVED RESOURCES ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="flex items-center justify-between mb-5"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-gray-700" />
                <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Saved Resources</h2>
              </div>
              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors"
              >
                View all
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedResources.map((resource, i) => {
                const Icon = resource.icon
                return (
                  <motion.div
                    key={resource.id}
                    variants={staggerItem}
                  >
                    <Link
                      href="/app"
                      className="block glass-card glass-card-hover rounded-2xl p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="space-y-4">
                        {/* Icon + category badge */}
                        <div className="flex items-start justify-between">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: resource.categoryBg }}
                          >
                            <Icon className="w-5 h-5" style={{ color: resource.categoryColorHex }} />
                          </div>
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: resource.categoryBg, color: resource.categoryColorHex }}
                          >
                            {resource.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug">
                          {resource.title}
                        </h3>

                        {/* Status + verification */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                            <MapPin className="w-3.5 h-3.5" />
                            {resource.status}
                          </div>
                          <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            Verified {resource.verifiedDate}
                          </div>
                        </div>

                        {/* Arrow indicator */}
                        <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-400 group-hover:text-gray-700 transition-colors pt-1">
                          View resource
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* ═══════════ 6-LAYER ARCHITECTURE SUMMARY (COLLAPSIBLE) ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10"
          >
            <button
              onClick={() => setArchOpen(!archOpen)}
              className="w-full glass-card glass-card-hover rounded-2xl p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-900/5 flex items-center justify-center">
                    <Layers className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold tracking-tight text-gray-900">6-Layer Architecture</h2>
                    <p className="text-[13px] text-gray-500 mt-0.5">Calibrated transparency at every step</p>
                  </div>
                </div>

                <motion.div
                  animate={{ rotate: archOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-400">
                    <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {archOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="overflow-hidden"
                >
                  <div className="pt-4">
                    {/* Pipeline visualization */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      {/* Horizontal pipeline */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {architectureLayers.map((layer, i) => {
                          const Icon = layer.icon
                          return (
                            <div key={layer.step} className="flex items-center shrink-0">
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.08 }}
                                className="flex flex-col items-center gap-2"
                              >
                                <div
                                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                                  style={{ backgroundColor: `${layer.colorHex}10` }}
                                >
                                  <Icon className="w-5 h-5" style={{ color: layer.colorHex }} />
                                </div>
                                <span className="text-[10px] font-semibold text-gray-600 text-center leading-tight max-w-[72px]">
                                  {layer.title}
                                </span>
                                <span className="text-[9px] text-gray-400 font-medium">Layer {layer.step}</span>
                              </motion.div>
                              {i < architectureLayers.length - 1 && (
                                <div className="flex items-center px-1.5 -mt-4">
                                  <ArrowRight className="w-4 h-4 text-gray-300" />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* Description + link */}
                      <div className="mt-6 pt-5 border-t border-gray-100/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          Each layer adds safety, transparency, and calibrated confidence — from free-text input to human escalation.
                        </p>
                        <Link
                          href="/about"
                          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors shrink-0"
                        >
                          Learn more about our architecture
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* ═══════════ QUICK TIPS ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-2.5 mb-5"
            >
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Quick Tips</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickTips.map((tip, i) => (
                <motion.div
                  key={tip.title}
                  variants={staggerItem}
                  className="glass-card glass-card-hover rounded-2xl p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/8 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{tip.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{tip.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ═══════════ FOOTER SPACER + SAFETY BADGE ═══════════ */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pb-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/60 border border-emerald-100/40">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[12px] font-semibold text-emerald-700">No data stored</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/60 border border-blue-100/40">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-[12px] font-semibold text-blue-700">Crisis detection active</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50/60 border border-violet-100/40">
                <Navigation className="w-4 h-4 text-violet-600" />
                <span className="text-[12px] font-semibold text-violet-700">Human escalation ready</span>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
