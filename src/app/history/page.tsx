'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  Download,
  Trash2,
  Share2,
  Play,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  BarChart3,
  TrendingUp,
  Bookmark,
  Sliders,
  Loader2,
  LogIn,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/use-auth'

// ─── TYPES ───────────────────────────────────────────────
interface ApiConversation {
  id: string
  title: string
  preview: string
  category: string | null
  categoryColor: string | null
  confidence: number
  isCrisis: boolean
  topResource?: string | null
  createdAt: string
  updatedAt: string
}

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
  topResource?: string
  createdAt: string
}

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

const confidenceFilters = [
  { label: 'All', value: 'all' },
  { label: 'High (80%+)', value: 'high' },
  { label: 'Medium (50-79%)', value: 'medium' },
  { label: 'Low (<50%)', value: 'low' },
]

const recentSearches = ['housing assistance', 'food stamps', 'crisis support', 'legal aid']

// ─── DATE GROUPING HELPERS ───────────────────────────────
function getDateGroup(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)
  const weekAgo = new Date(today.getTime() - 7 * 86400000)

  if (date >= today) return 'Today'
  if (date >= yesterday) return 'Yesterday'
  if (date >= weekAgo) return 'This Week'
  return 'Earlier'
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)

  if (date >= today) {
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  }

  if (date >= yesterday) return 'Yesterday'

  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`
}

function mapApiConversation(api: ApiConversation): Conversation {
  return {
    id: api.id,
    title: api.title,
    category: api.category || 'General',
    categoryColor: api.categoryColor || '#6b7280',
    confidence: api.confidence,
    isCrisis: api.isCrisis,
    preview: api.preview,
    timestamp: formatTimestamp(api.createdAt),
    group: getDateGroup(api.createdAt),
    topResource: api.topResource || undefined,
    createdAt: api.createdAt,
  }
}

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

// ─── LOADING SKELETON ────────────────────────────────────
function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="mb-10">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200/60 animate-pulse" />
                <div>
                  <div className="h-7 w-56 bg-gray-200/60 rounded-lg animate-pulse mb-1" />
                  <div className="h-4 w-40 bg-gray-100/60 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
            {/* Search bar skeleton */}
            <div className="h-13 bg-gray-100/40 rounded-2xl animate-pulse mb-5" />
            {/* Filter skeleton */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-9 w-20 bg-gray-100/40 rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
          {/* Stats skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card rounded-xl p-4 text-center">
                <div className="w-8 h-8 rounded-lg bg-gray-100/60 mx-auto mb-2 animate-pulse" />
                <div className="h-6 w-12 bg-gray-100/60 mx-auto rounded animate-pulse mb-1" />
                <div className="h-3 w-16 bg-gray-50/60 mx-auto rounded animate-pulse" />
              </div>
            ))}
          </div>
          {/* Conversation skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="glass-card rounded-2xl p-5 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-gray-200/60" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-48 bg-gray-100/60 rounded" />
                    <div className="h-3 w-72 bg-gray-50/60 rounded" />
                  </div>
                  <div className="h-6 w-14 bg-gray-100/60 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

// ─── MAIN PAGE ───────────────────────────────────────────
export default function HistoryPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState<string | null>(null)
  const [deletingIds, setDeletingIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [confidenceFilter, setConfidenceFilter] = useState('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [selectedConversations, setSelectedConversations] = useState<string[]>([])
  const [showRecentSearches, setShowRecentSearches] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const itemsPerPage = 20
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounce search input
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
    }, 300)
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current) }
  }, [searchQuery])

  // Fetch conversations from API with search/category/pagination params
  const fetchConversations = useCallback(async () => {
    try {
      setDataLoading(true)
      setDataError(null)
      const params = new URLSearchParams()
      if (user?.id) params.set('userId', user.id)
      if (debouncedSearch) params.set('search', debouncedSearch)
      if (activeFilter && activeFilter !== 'all') params.set('category', activeFilter)
      const skip = (currentPage - 1) * itemsPerPage
      params.set('skip', String(skip))
      params.set('take', String(itemsPerPage))
      const res = await fetch(`/api/conversations?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        const apiData: ApiConversation[] = Array.isArray(json) ? json : (json.conversations || [])
        const total = json.total ?? apiData.length
        setConversations(apiData.map(mapApiConversation))
        setTotalCount(total)
      } else {
        setDataError('Failed to load conversations')
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err)
      setDataError('Failed to load conversations')
    } finally {
      setDataLoading(false)
    }
  }, [user?.id, debouncedSearch, activeFilter, currentPage])

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations()
    } else if (!authLoading) {
      setDataLoading(false)
    }
  }, [isAuthenticated, authLoading, fetchConversations])

  // Delete a single conversation
  const handleDelete = async (id: string) => {
    try {
      setDeletingIds((prev) => [...prev, id])
      const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' })
      if (res.ok) {
        // Refetch to keep pagination in sync
        fetchConversations()
        setSelectedConversations((prev) => prev.filter((sid) => sid !== id))
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err)
    } finally {
      setDeletingIds((prev) => prev.filter((d) => d !== id))
    }
  }

  // Delete selected conversations
  const handleDeleteSelected = async () => {
    const idsToDelete = [...selectedConversations]
    try {
      setDeletingIds((prev) => [...prev, ...idsToDelete])
      await Promise.all(
        idsToDelete.map((id) =>
          fetch(`/api/conversations/${id}`, { method: 'DELETE' })
        )
      )
      setSelectedConversations([])
      // Refetch to keep pagination in sync
      fetchConversations()
    } catch (err) {
      console.error('Failed to delete selected conversations:', err)
    } finally {
      setDeletingIds((prev) => prev.filter((d) => !idsToDelete.includes(d)))
    }
  }

  // ─── Auth gate ───
  if (authLoading || dataLoading) {
    return <LoadingSkeleton />
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col mesh-gradient-bg">
        <Navbar />
        <main className="flex-1 pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center justify-center py-24 px-6"
            >
              <div className="relative mb-8">
                <div
                  className="w-28 h-28 rounded-3xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.06))',
                    border: '1px solid rgba(59,130,246,0.1)',
                  }}
                >
                  <LogIn className="w-12 h-12 text-gray-300" />
                </div>
                <div className="absolute inset-[-12px] rounded-3xl border border-gray-100/60" style={{ animation: 'subtle-float 4s ease-in-out infinite' }} />
              </div>
              <h3 className="text-[20px] font-bold text-gray-900 tracking-tight mb-2">
                Sign in to view your history
              </h3>
              <p className="text-[14px] text-gray-400 text-center max-w-sm leading-relaxed mb-8">
                Your conversation history is tied to your account. Sign in to see past conversations, resources, and confidence scores.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 text-[14px] font-semibold text-white rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
              >
                <LogIn className="w-4 h-4" />
                Sign in
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </main>
        {/* Footer */}
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

  // Filter conversations - only confidence filter is client-side now
  // Search and category filtering are handled by the API
  const filteredConversations = conversations.filter((conv) => {
    const matchesConfidence =
      confidenceFilter === 'all' ||
      (confidenceFilter === 'high' && conv.confidence >= 80) ||
      (confidenceFilter === 'medium' && conv.confidence >= 50 && conv.confidence < 80) ||
      (confidenceFilter === 'low' && conv.confidence < 50)

    return matchesConfidence
  })

  // Pagination - use server-side total count
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage))

  // Group conversations
  const groupedConversations: Record<string, Conversation[]> = {}
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Earlier']

  filteredConversations.forEach((conv) => {
    if (!groupedConversations[conv.group]) {
      groupedConversations[conv.group] = []
    }
    groupedConversations[conv.group].push(conv)
  })

  // Stats - computed from the current page of conversations
  const totalConversations = totalCount
  const avgConfidence = conversations.length > 0
    ? Math.round(conversations.reduce((sum, c) => sum + c.confidence, 0) / conversations.length)
    : 0
  const crisisCount = conversations.filter((c) => c.isCrisis).length
  const thisWeekCount = conversations.filter(
    (c) => c.group === 'Today' || c.group === 'Yesterday' || c.group === 'This Week'
  ).length
  // Compute most searched category
  const categoryCounts: Record<string, number> = {}
  conversations.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1
  })
  const mostSearchedCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'

  // Bulk actions
  const toggleSelect = (id: string) => {
    setSelectedConversations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedConversations.length === filteredConversations.length) {
      setSelectedConversations([])
    } else {
      setSelectedConversations(filteredConversations.map((c) => c.id))
    }
  }

  // Is empty (no conversations at all)
  const isEmpty = conversations.length === 0 && !debouncedSearch && activeFilter === 'all'

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ═══════════ ENHANCED HEADER ═══════════ */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            {/* Title row with action buttons */}
            <motion.div variants={fadeInUp} className="mb-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
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

                {/* Export and Clear buttons */}
                <div className="hidden sm:flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-white/60 border border-gray-200/60 text-gray-600 hover:bg-white/80 hover:border-gray-300/60 transition-all">
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                  <button
                    onClick={() => {
                      if (conversations.length > 0) handleDeleteSelected()
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-white/60 border border-red-100/60 text-red-500 hover:bg-red-50/40 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div variants={fadeInUp} className="mb-5">
              <div className="relative">
                <div
                  className="glass-card rounded-2xl transition-all duration-300 input-focus-ring"
                  style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.02)' }}
                >
                  <div className="flex items-center gap-3 px-5 py-3.5">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setShowRecentSearches(true)}
                      onBlur={() => setTimeout(() => setShowRecentSearches(false), 200)}
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

                {/* Recent searches dropdown */}
                <AnimatePresence>
                  {showRecentSearches && !searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl shadow-premium-lg z-20 p-2"
                    >
                      <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Recent searches</p>
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onMouseDown={() => setSearchQuery(term)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-gray-600 hover:bg-white/60 transition-all text-left"
                        >
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          {term}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Filter Buttons + Advanced Filters Toggle */}
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="sm:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-[12px] font-semibold bg-white/60 border border-gray-200/60 text-gray-600 hover:bg-white/80 transition-all"
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Desktop filters */}
                <div className="hidden sm:flex items-center gap-2 flex-wrap">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => { setActiveFilter(cat.value); setCurrentPage(1) }}
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

                {/* Advanced filters toggle */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
                    showAdvancedFilters
                      ? 'bg-blue-50/80 text-blue-600 border border-blue-200/60'
                      : 'bg-white/60 border border-gray-200/60 text-gray-600 hover:bg-white/80'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Advanced
                </button>
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
                          onClick={() => { setActiveFilter(cat.value); setFilterOpen(false); setCurrentPage(1) }}
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

              {/* Advanced filters panel */}
              <AnimatePresence>
                {showAdvancedFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="glass-card rounded-xl p-4 mt-3 space-y-3">
                      {/* Confidence level filter */}
                      <div>
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Confidence Level</label>
                        <div className="flex items-center gap-2 flex-wrap">
                          {confidenceFilters.map((cf) => (
                            <button
                              key={cf.value}
                              onClick={() => { setConfidenceFilter(cf.value); setCurrentPage(1) }}
                              className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                                confidenceFilter === cf.value
                                  ? 'bg-blue-50/80 text-blue-600 border border-blue-200/60'
                                  : 'bg-white/50 border border-gray-100/60 text-gray-500 hover:bg-white/80'
                              }`}
                            >
                              {cf.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date range (simplified) */}
                      <div>
                        <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Date Range</label>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-50/80 text-blue-600 border border-blue-200/60">
                            <Calendar className="w-3 h-3" />
                            All time
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/50 border border-gray-100/60 text-gray-500 hover:bg-white/80">
                            Today
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/50 border border-gray-100/60 text-gray-500 hover:bg-white/80">
                            This week
                          </button>
                          <button className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white/50 border border-gray-100/60 text-gray-500 hover:bg-white/80">
                            This month
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* ═══════════ ERROR STATE ═══════════ */}
          {dataError && !dataLoading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="glass-card rounded-2xl p-6 shadow-premium text-center border border-red-100/60">
                <div className="w-12 h-12 rounded-xl bg-red-50/80 flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">Failed to load conversations</h3>
                <p className="text-[13px] text-gray-500 mb-4">{dataError}</p>
                <button
                  onClick={() => fetchConversations()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 transition-all"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════ STATS SUMMARY CARDS ═══════════ */}
          {!isEmpty && !dataError && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="glass-card rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-blue-50/80 flex items-center justify-center mx-auto mb-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-xl font-extrabold tracking-tight text-gray-900">{totalConversations}</p>
                  <p className="text-[10px] font-medium text-gray-400 mt-0.5">Conversations</p>
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50/80 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xl font-extrabold tracking-tight text-gray-900">{avgConfidence}%</p>
                  <p className="text-[10px] font-medium text-gray-400 mt-0.5">Avg confidence</p>
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-violet-50/80 flex items-center justify-center mx-auto mb-2">
                    <BarChart3 className="w-4 h-4 text-violet-600" />
                  </div>
                  <p className="text-xl font-extrabold tracking-tight text-gray-900">{mostSearchedCategory}</p>
                  <p className="text-[10px] font-medium text-gray-400 mt-0.5">Top category</p>
                </div>
                <div className="glass-card rounded-xl p-4 text-center">
                  <div className="w-8 h-8 rounded-lg bg-red-50/80 flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-xl font-extrabold tracking-tight text-gray-900">{crisisCount}</p>
                  <p className="text-[10px] font-medium text-gray-400 mt-0.5">Crisis interventions</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ EMPTY STATE (no conversations at all) ═══════════ */}
          {isEmpty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center justify-center py-20 px-6"
            >
              <div className="relative mb-8">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(16,185,129,0.06))',
                    border: '1px solid rgba(59,130,246,0.1)',
                  }}
                >
                  <MessageSquare className="w-10 h-10 text-gray-300" />
                </div>
                <div className="absolute inset-[-12px] rounded-3xl border border-gray-100/60" style={{ animation: 'subtle-float 4s ease-in-out infinite' }} />
              </div>
              <h3 className="text-[18px] font-bold text-gray-900 tracking-tight mb-2">No conversations yet</h3>
              <p className="text-[14px] text-gray-400 text-center max-w-sm leading-relaxed">
                Start your first conversation with ClearPath AI to get personalized resource recommendations.
              </p>
              <Link
                href="/app"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
              >
                <MessageSquare className="w-4 h-4" />
                Start your first conversation
              </Link>
            </motion.div>
          )}

          {/* ═══════════ BULK ACTIONS BAR ═══════════ */}
          <AnimatePresence>
            {selectedConversations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6"
              >
                <div className="glass-card rounded-xl px-5 py-3 flex items-center justify-between shadow-premium">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-semibold text-gray-700">
                      {selectedConversations.length} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-50/80 text-blue-600 border border-blue-100/60 hover:bg-blue-50 transition-all">
                      <Download className="w-3 h-3" />
                      Export selected
                    </button>
                    <button
                      onClick={handleDeleteSelected}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-50/80 text-red-500 border border-red-100/60 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete selected
                    </button>
                    <button
                      onClick={() => setSelectedConversations([])}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-500 hover:bg-gray-100/60 transition-all"
                    >
                      <X className="w-3 h-3" />
                      Clear
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════ SELECT ALL BAR ═══════════ */}
          {!isEmpty && filteredConversations.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={toggleSelectAll}
                className="inline-flex items-center gap-2 text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                {selectedConversations.length === filteredConversations.length ? (
                  <CheckSquare className="w-4 h-4 text-blue-500" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
                Select all
              </button>
              <div className="flex-1" />
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Clock className="w-3 h-3" />
                This week: {thisWeekCount}
              </div>
            </div>
          )}

          {/* ═══════════ CONVERSATION LIST ═══════════ */}
          {!isEmpty && filteredConversations.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col items-center justify-center py-20 px-6"
            >
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
                <div className="absolute inset-[-12px] rounded-3xl border border-gray-100/60" style={{ animation: 'subtle-float 4s ease-in-out infinite' }} />
              </div>
              <h3 className="text-[18px] font-bold text-gray-900 tracking-tight mb-2">No conversations found</h3>
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
          ) : !isEmpty && (
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
                      {items.map((conv) => {
                        const color = getConfidenceColor(conv.confidence, conv.isCrisis)
                        const isSelected = selectedConversations.includes(conv.id)
                        const isDeleting = deletingIds.includes(conv.id)
                        return (
                          <motion.div
                            key={conv.id}
                            variants={staggerItem}
                            className="relative"
                          >
                            <div
                              className="block relative overflow-hidden rounded-2xl transition-all duration-300 group"
                              style={{
                                background: isDeleting
                                  ? 'rgba(239,68,68,0.06)'
                                  : isSelected
                                  ? 'rgba(59,130,246,0.06)'
                                  : 'rgba(255, 255, 255, 0.65)',
                                backdropFilter: 'blur(20px) saturate(1.2)',
                                WebkitBackdropFilter: 'blur(20px) saturate(1.2)',
                                border: `1px solid ${isDeleting ? 'rgba(239,68,68,0.2)' : isSelected ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.5)'}`,
                                boxShadow: isDeleting
                                  ? '0 4px 16px -4px rgba(239,68,68,0.1)'
                                  : isSelected
                                  ? '0 4px 16px -4px rgba(59,130,246,0.1)'
                                  : '0 1px 3px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.04)',
                                opacity: isDeleting ? 0.6 : 1,
                              }}
                            >
                              {/* Left accent bar */}
                              <div
                                className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                                style={{ backgroundColor: isDeleting ? '#ef4444' : color, opacity: isSelected || isDeleting ? 1 : 0.5 }}
                              />

                              <div className="flex items-center gap-4 p-4 sm:p-5 pl-5 sm:pl-6">
                                {/* Selection checkbox */}
                                <button
                                  onClick={() => toggleSelect(conv.id)}
                                  className="shrink-0 hidden sm:flex"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-4 h-4 text-blue-500" />
                                  ) : (
                                    <Square className="w-4 h-4 text-gray-300 hover:text-gray-500 transition-colors" />
                                  )}
                                </button>

                                {/* Confidence dot */}
                                <div className="hidden sm:flex">
                                  <ConfidenceDot value={conv.confidence} isCrisis={conv.isCrisis} />
                                </div>

                                {/* Main content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2.5 mb-1.5">
                                    <div className="sm:hidden">
                                      <ConfidenceDot value={conv.confidence} isCrisis={conv.isCrisis} />
                                    </div>
                                    <h3 className="text-[14px] sm:text-[15px] font-semibold text-gray-900 tracking-tight truncate">
                                      {conv.title}
                                    </h3>
                                    <CategoryBadge label={conv.category} color={conv.categoryColor} />
                                  </div>
                                  <p className="text-[12px] sm:text-[13px] text-gray-400 leading-relaxed truncate pl-0 sm:pl-0">
                                    {conv.preview}
                                  </p>
                                  {/* Top resource preview */}
                                  {conv.topResource && (
                                    <div className="flex items-center gap-1.5 mt-2">
                                      <Bookmark className="w-3 h-3 text-emerald-400" />
                                      <span className="text-[11px] text-emerald-600 font-medium truncate">
                                        {conv.topResource}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Right side */}
                                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                                  {/* Confidence badge */}
                                  <div className="hidden md:flex items-center gap-2">
                                    <div
                                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold tabular-nums"
                                      style={{
                                        backgroundColor: getConfidenceBg(conv.confidence, conv.isCrisis),
                                        color: color,
                                        border: `1px solid ${color}15`,
                                      }}
                                    >
                                      {conv.isCrisis ? <AlertTriangle className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                                      {conv.isCrisis ? 'Crisis' : `${conv.confidence}%`}
                                    </div>
                                  </div>

                                  {/* Timestamp */}
                                  <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-gray-400 font-medium whitespace-nowrap">
                                    <Clock className="w-3 h-3" />
                                    <span>{conv.timestamp}</span>
                                  </div>

                                  {/* Action buttons */}
                                  <div className="hidden sm:flex items-center gap-1">
                                    <button
                                      className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50/60 transition-all"
                                      title="Continue conversation"
                                    >
                                      <Play className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      className="p-1.5 rounded-lg text-gray-300 hover:text-emerald-500 hover:bg-emerald-50/60 transition-all"
                                      title="Share"
                                    >
                                      <Share2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(conv.id)}
                                      disabled={isDeleting}
                                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50/60 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                      title="Delete"
                                    >
                                      {isDeleting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </div>

                                  {/* Arrow */}
                                  <Link href="/app">
                                    <motion.div
                                      whileHover={{ x: 4 }}
                                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    >
                                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors duration-200" />
                                    </motion.div>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </motion.div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ═══════════ PAGINATION ═══════════ */}
          {!isEmpty && !dataError && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center justify-center gap-2"
            >
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[12px] font-semibold bg-white/60 border border-gray-200/60 text-gray-600 hover:bg-white/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                // Show pages around the current page
                let page: number
                if (totalPages <= 7) {
                  page = i + 1
                } else if (currentPage <= 4) {
                  page = i + 1
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + i
                } else {
                  page = currentPage - 3 + i
                }
                return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-[12px] font-semibold transition-all duration-200 ${
                    currentPage === page
                      ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-md'
                      : 'bg-white/60 border border-gray-200/60 text-gray-600 hover:bg-white/80'
                  }`}
                >
                  {page}
                </button>
              )
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-[12px] font-semibold bg-white/60 border border-gray-200/60 text-gray-600 hover:bg-white/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRightIcon className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* ═══════════ CONFIDENCE BREAKDOWN ═══════════ */}
          {!isEmpty && filteredConversations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <div className="glass-card rounded-2xl p-6 shadow-premium relative overflow-hidden">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold tracking-tight text-gray-900">Confidence Breakdown</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">How your conversations scored</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'High (80%+)', count: conversations.filter((c) => c.confidence >= 80).length, color: '#10b981', bg: 'rgba(16,185,129,0.06)' },
                    { label: 'Good (70-79%)', count: conversations.filter((c) => c.confidence >= 70 && c.confidence < 80).length, color: '#3b82f6', bg: 'rgba(59,130,246,0.06)' },
                    { label: 'Moderate (50-69%)', count: conversations.filter((c) => c.confidence >= 50 && c.confidence < 70).length, color: '#f59e0b', bg: 'rgba(245,158,11,0.06)' },
                    { label: 'Low (<50%)', count: conversations.filter((c) => c.confidence < 50).length, color: '#f97316', bg: 'rgba(249,115,22,0.06)' },
                  ].map((tier) => (
                    <div key={tier.label} className="rounded-xl p-3 text-center border border-gray-100/40" style={{ backgroundColor: tier.bg }}>
                      <p className="text-lg font-extrabold" style={{ color: tier.color }}>{tier.count}</p>
                      <p className="text-[9px] font-semibold text-gray-500 mt-1 leading-tight">{tier.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ QUICK TIPS ═══════════ */}
          {!isEmpty && filteredConversations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="mt-8"
            >
              <div className="glass-card rounded-2xl p-6 shadow-premium relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-[14px] font-bold tracking-tight text-gray-900">Tips for Better Results</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl bg-blue-50/30 border border-blue-100/30 p-4">
                    <p className="text-[12px] font-semibold text-blue-700 mb-1">Be specific</p>
                    <p className="text-[11px] text-blue-500/70 leading-relaxed">Include your location, household size, and income level for more targeted resources.</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50/30 border border-emerald-100/30 p-4">
                    <p className="text-[12px] font-semibold text-emerald-700 mb-1">Ask follow-ups</p>
                    <p className="text-[11px] text-emerald-500/70 leading-relaxed">Use &quot;What else?&quot; and &quot;Why?&quot; buttons to explore more options and understand results.</p>
                  </div>
                  <div className="rounded-xl bg-violet-50/30 border border-violet-100/30 p-4">
                    <p className="text-[12px] font-semibold text-violet-700 mb-1">Check confidence</p>
                    <p className="text-[11px] text-violet-500/70 leading-relaxed">Higher confidence scores mean more reliable matches. Always verify low-confidence results.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════ BOTTOM CTA ═══════════ */}
          {!isEmpty && filteredConversations.length > 0 && (
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

      {/* ═══════════ SAFETY BANNER ═══════════ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="glass-card rounded-2xl p-5"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/60 border border-emerald-100/40">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-[12px] font-semibold text-emerald-700">Crisis detection always active</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/60 border border-blue-100/40">
              <Layers className="w-4 h-4 text-blue-600" />
              <span className="text-[12px] font-semibold text-blue-700">6-layer transparency</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50/60 border border-violet-100/40">
              <Shield className="w-4 h-4 text-violet-600" />
              <span className="text-[12px] font-semibold text-violet-700">No data stored</span>
            </div>
          </div>
        </motion.div>
      </div>

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
