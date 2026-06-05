'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Layers,
  Shield,
  HelpCircle,
  Clock,
  ArrowRight,
  Filter,
  MessageSquare,
  X,
  ChevronDown,
  Calendar,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

// ─── TYPES ───────────────────────────────────────────────
interface Conversation {
  id: string
  title: string
  category: string
  categoryColor: string
  confidence: number
  isCrisis?: boolean
  preview: string
  timestamp: string
  group: string
}

// ─── MOCK DATA ───────────────────────────────────────────
const conversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Job loss and rent help',
    category: 'Housing',
    categoryColor: '#3b82f6',
    confidence: 87,
    preview: "I lost my job and can't pay rent. My kids need food.",
    timestamp: '2 hours ago',
    group: 'Today',
  },
  {
    id: 'conv-2',
    title: 'Crisis support needed',
    category: 'Crisis',
    categoryColor: '#ef4444',
    confidence: 100,
    isCrisis: true,
    preview: "I can't take this anymore. I want it all to end.",
    timestamp: '18 min ago',
    group: 'Today',
  },
  {
    id: 'conv-3',
    title: 'Housing clarification',
    category: 'Housing',
    categoryColor: '#3b82f6',
    confidence: 43,
    preview: 'I need help with my situation',
    timestamp: 'Yesterday',
    group: 'Yesterday',
  },
  {
    id: 'conv-4',
    title: 'Senior grocery delivery',
    category: 'Food',
    categoryColor: '#f59e0b',
    confidence: 94,
    preview: "I'm 78 and need help getting groceries delivered",
    timestamp: 'Yesterday',
    group: 'Yesterday',
  },
  {
    id: 'conv-5',
    title: 'Veteran PTSD support',
    category: 'Mental Health',
    categoryColor: '#8b5cf6',
    confidence: 91,
    preview: "I'm a veteran dealing with PTSD and housing issues",
    timestamp: '3 days ago',
    group: 'This Week',
  },
  {
    id: 'conv-6',
    title: 'SNAP eligibility check',
    category: 'Food',
    categoryColor: '#f59e0b',
    confidence: 94,
    preview: 'Do I qualify for SNAP benefits?',
    timestamp: '4 days ago',
    group: 'This Week',
  },
  {
    id: 'conv-7',
    title: 'Emergency housing tonight',
    category: 'Housing',
    categoryColor: '#3b82f6',
    confidence: 92,
    preview: 'I need emergency housing tonight.',
    timestamp: '5 days ago',
    group: 'This Week',
  },
  {
    id: 'conv-8',
    title: 'Mental health resources',
    category: 'Mental Health',
    categoryColor: '#8b5cf6',
    confidence: 83,
    preview: "It's about my emotions. I've been like this for months.",
    timestamp: '1 week ago',
    group: 'Earlier',
  },
  {
    id: 'conv-9',
    title: 'Utility assistance',
    category: 'Housing',
    categoryColor: '#3b82f6',
    confidence: 89,
    preview: 'I also need help with utilities.',
    timestamp: '2 weeks ago',
    group: 'Earlier',
  },
  {
    id: 'conv-10',
    title: 'Legal aid consultation',
    category: 'Legal',
    categoryColor: '#06b6d4',
    confidence: 81,
    preview: 'I need legal help with my eviction notice',
    timestamp: '2 weeks ago',
    group: 'Earlier',
  },
  {
    id: 'conv-11',
    title: 'Employment services inquiry',
    category: 'Employment',
    categoryColor: '#10b981',
    confidence: 68,
    preview: 'Are there job training programs near me?',
    timestamp: '3 weeks ago',
    group: 'Earlier',
  },
  {
    id: 'conv-12',
    title: 'Childcare support options',
    category: 'Housing',
    categoryColor: '#3b82f6',
    confidence: 72,
    preview: 'I need affordable childcare while I work',
    timestamp: '3 weeks ago',
    group: 'Earlier',
  },
  {
    id: 'conv-13',
    title: 'Disability benefits application',
    category: 'Legal',
    categoryColor: '#06b6d4',
    confidence: 78,
    preview: 'How do I apply for disability benefits?',
    timestamp: '1 month ago',
    group: 'Earlier',
  },
]

// ─── FILTER CATEGORIES ───────────────────────────────────
const filterCategories = [
  { label: 'All', value: 'all' },
  { label: 'Housing', value: 'Housing' },
  { label: 'Mental Health', value: 'Mental Health' },
  { label: 'Legal', value: 'Legal' },
  { label: 'Food', value: 'Food' },
  { label: 'Employment', value: 'Employment' },
  { label: 'Crisis', value: 'Crisis' },
]

// ─── CONFIDENCE HELPERS ──────────────────────────────────
function getConfidenceColor(v: number, isCrisis?: boolean): string {
  if (isCrisis) return '#ef4444'
  if (v >= 80) return '#10b981'
  if (v >= 70) return '#3b82f6'
  if (v >= 50) return '#f59e0b'
  return '#f97316'
}

function getConfidenceBg(v: number, isCrisis?: boolean): string {
  if (isCrisis) return 'rgba(239,68,68,0.08)'
  if (v >= 80) return 'rgba(16,185,129,0.08)'
  if (v >= 70) return 'rgba(59,130,246,0.08)'
  if (v >= 50) return 'rgba(245,158,11,0.08)'
  return 'rgba(249,115,22,0.08)'
}

function getConfidenceLabel(v: number, isCrisis?: boolean): string {
  if (isCrisis) return 'Crisis'
  if (v >= 80) return 'High'
  if (v >= 70) return 'Good'
  if (v >= 50) return 'Moderate'
  return 'Low'
}

function getConfidenceGlow(v: number, isCrisis?: boolean): string {
  if (isCrisis) return '0 0 12px rgba(239,68,68,0.2)'
  if (v >= 80) return '0 0 12px rgba(16,185,129,0.15)'
  if (v >= 70) return '0 0 12px rgba(59,130,246,0.15)'
  if (v >= 50) return '0 0 12px rgba(245,158,11,0.15)'
  return '0 0 12px rgba(249,115,22,0.15)'
}

// ─── ANIMATION VARIANTS ──────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// ─── CONFIDENCE DOT ──────────────────────────────────────
function ConfidenceDot({ value, isCrisis }: { value: number; isCrisis?: boolean }) {
  const color = getConfidenceColor(value, isCrisis)
  return (
    <div className="relative shrink-0">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
      />
      {isCrisis && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  )
}

// ─── CATEGORY BADGE ──────────────────────────────────────
function CategoryBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase"
      style={{
        backgroundColor: `${color}10`,
        color: color,
        border: `1px solid ${color}20`,
      }}
    >
      {label}
    </span>
  )
}

// ─── CONVERSATION CARD ───────────────────────────────────
function ConversationCard({ conversation, index }: { conversation: Conversation; index: number }) {
  const [hovered, setHovered] = useState(false)
  const color = getConfidenceColor(conversation.confidence, conversation.isCrisis)

  return (
    <motion.div
      variants={staggerItem}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      <Link
        href="/app"
        className="block relative overflow-hidden rounded-2xl transition-all duration-300 group"
        style={{
          background: hovered
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(20px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
          border: `1px solid ${hovered ? color + '30' : 'rgba(255,255,255,0.5)'}`,
          boxShadow: hovered
            ? `0 8px 32px -8px rgba(0,0,0,0.08), 0 0 0 1px ${color}10, ${getConfidenceGlow(conversation.confidence, conversation.isCrisis)}`
            : '0 1px 3px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        }}
      >
        {/* Card shine sweep on hover */}
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 card-shine" />

        {/* Left accent bar */}
        <div
          className="absolute top-0 left-0 w-1 h-full rounded-l-2xl transition-all duration-300"
          style={{
            backgroundColor: color,
            opacity: hovered ? 1 : 0.5,
          }}
        />

        <div className="flex items-center gap-4 p-4 sm:p-5 pl-5 sm:pl-6">
          {/* Confidence dot */}
          <div className="hidden sm:flex">
            <ConfidenceDot value={conversation.confidence} isCrisis={conversation.isCrisis} />
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-1.5">
              {/* Mobile confidence dot */}
              <div className="sm:hidden">
                <ConfidenceDot value={conversation.confidence} isCrisis={conversation.isCrisis} />
              </div>
              <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 tracking-tight truncate">
                {conversation.title}
              </h3>
              <CategoryBadge label={conversation.category} color={conversation.categoryColor} />
            </div>
            <p className="text-[12px] sm:text-[13px] text-gray-400 leading-relaxed truncate pl-0 sm:pl-0">
              {conversation.preview}
            </p>
          </div>

          {/* Right side: confidence + time + arrow */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Confidence badge */}
            <div className="hidden md:flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold tabular-nums"
                style={{
                  backgroundColor: getConfidenceBg(conversation.confidence, conversation.isCrisis),
                  color: color,
                  border: `1px solid ${color}15`,
                }}
              >
                {conversation.isCrisis ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : (
                  <ShieldCheck className="w-3 h-3" />
                )}
                {conversation.isCrisis ? 'Crisis' : `${conversation.confidence}%`}
              </div>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-gray-400 font-medium whitespace-nowrap">
              <Clock className="w-3 h-3" />
              <span>{conversation.timestamp}</span>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: hovered ? 4 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <ArrowRight
                className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors duration-200"
              />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── EMPTY STATE ─────────────────────────────────────────
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col items-center justify-center py-20 px-6"
    >
      {/* Illustration */}
      <div className="relative mb-8">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.06))',
            border: '1px solid rgba(59,130,246,0.1)',
          }}
        >
          <Search className="w-10 h-10 text-gray-300" />
        </div>
        {/* Decorative rings */}
        <div
          className="absolute inset-[-12px] rounded-3xl border border-gray-100/60"
          style={{ animation: 'subtle-float 4s ease-in-out infinite' }}
        />
        <div
          className="absolute inset-[-24px] rounded-3xl border border-gray-50/40"
          style={{ animation: 'subtle-float 4s ease-in-out infinite 0.5s' }}
        />
      </div>

      <h3 className="text-[18px] font-bold text-gray-900 tracking-tight mb-2">
        No conversations found
      </h3>
      <p className="text-[14px] text-gray-400 text-center max-w-sm leading-relaxed">
        Try a different search term or clear your filters to see all conversations.
      </p>

      <Link
        href="/app"
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
      >
        <MessageSquare className="w-4 h-4" />
        Start a new conversation
      </Link>
    </motion.div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────
export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      searchQuery === '' ||
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      activeFilter === 'all' || conv.category === activeFilter

    return matchesSearch && matchesFilter
  })

  // Group conversations
  const groupedConversations: Record<string, Conversation[]> = {}
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Earlier']

  filteredConversations.forEach((conv) => {
    if (!groupedConversations[conv.group]) {
      groupedConversations[conv.group] = []
    }
    groupedConversations[conv.group].push(conv)
  })

  // Stats
  const totalConversations = conversations.length
  const totalResources = 47
  const thisWeekCount = conversations.filter(
    (c) => c.group === 'Today' || c.group === 'Yesterday' || c.group === 'This Week'
  ).length

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ═══════════ HEADER ═══════════ */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            {/* Title */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md shadow-gray-900/20">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                    Conversation History
                  </h1>
                  <p className="text-[13px] text-gray-400 mt-0.5">
                    Your past conversations with ClearPath AI
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div variants={fadeInUp} className="mb-5">
              <div
                className="relative glass-card rounded-2xl transition-all duration-300 input-focus-ring"
                style={{
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)',
                }}
              >
                <div className="flex items-center gap-3 px-5 py-3.5">
                  <Search className="w-5 h-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-400 outline-none font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 transition-all"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Filter Buttons */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="sm:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-white/60 border border-gray-200/60 text-gray-600 hover:bg-white/80 transition-all"
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                  <ChevronDown
                    className={`w-3 h-3 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Desktop filters */}
                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setActiveFilter(cat.value)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
                        activeFilter === cat.value
                          ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/20'
                          : 'bg-white/60 border border-gray-200/60 text-gray-600 hover:bg-white/80 hover:border-gray-300/60'
                      }`}
                    >
                      {cat.value === 'Crisis' && <AlertTriangle className="w-3 h-3" />}
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Mobile filter dropdown */}
                <AnimatePresence>
                  {filterOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="sm:hidden w-full overflow-hidden"
                    >
                      <div className="flex items-center gap-2 flex-wrap pt-2">
                        {filterCategories.map((cat) => (
                          <button
                            key={cat.value}
                            onClick={() => {
                              setActiveFilter(cat.value)
                              setFilterOpen(false)
                            }}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
                              activeFilter === cat.value
                                ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-md shadow-gray-900/20'
                                : 'bg-white/60 border border-gray-200/60 text-gray-600 hover:bg-white/80'
                            }`}
                          >
                            {cat.value === 'Crisis' && <AlertTriangle className="w-3 h-3" />}
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* ═══════════ STATS BAR ═══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50/80 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <span className="text-[13px] font-semibold text-gray-700">
                  {totalConversations} conversations
                </span>
              </div>
              <div className="w-px h-4 bg-gray-200/60" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50/80 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-[13px] font-semibold text-gray-700">
                  {totalResources} resources found
                </span>
              </div>
              <div className="w-px h-4 bg-gray-200/60" />
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50/80 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <span className="text-[13px] font-semibold text-gray-700">
                  This week: {thisWeekCount}
                </span>
              </div>
            </div>
          </motion.div>

          {/* ═══════════ CONVERSATION LIST ═══════════ */}
          {filteredConversations.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {groupOrder.map((group) => {
                const items = groupedConversations[group]
                if (!items || items.length === 0) return null

                return (
                  <div key={group}>
                    {/* Group header */}
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center gap-3 mb-4"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">
                          {group}
                        </h2>
                      </div>
                      <div className="flex-1 h-px bg-gray-100/80" />
                      <span className="text-[11px] font-semibold text-gray-400 tabular-nums">
                        {items.length} {items.length === 1 ? 'conversation' : 'conversations'}
                      </span>
                    </motion.div>

                    {/* Conversation items */}
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer}
                      className="space-y-2"
                    >
                      {items.map((conv, i) => (
                        <ConversationCard
                          key={conv.id}
                          conversation={conv}
                          index={i}
                        />
                      ))}
                    </motion.div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ═══════════ BOTTOM CTA ═══════════ */}
          {filteredConversations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-16 text-center"
            >
              <Link
                href="/app"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-[14px] font-semibold text-white rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
              >
                <MessageSquare className="w-4 h-4" />
                Start New Conversation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="mt-auto border-t border-gray-100/60 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <Layers className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] font-bold text-gray-700">ClearPath AI</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-emerald-50/80 text-emerald-600 border border-emerald-100/60">
                Demo
              </span>
            </div>
            <p className="text-[12px] text-gray-400 font-medium">
              Built for USAII Global AI Hackathon 2026 &middot; No data stored, ever
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
