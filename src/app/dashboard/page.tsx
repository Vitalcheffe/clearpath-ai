'use client'

import { useState, useMemo, useEffect } from 'react'
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
  Search,
  Flame,
  CloudSun,
  Trophy,
  Lock,
  Users,
  Heart,
  Zap,
  Target,
  Star,
  Globe,
  Award,
  BookOpen,
  RefreshCw,
  FileCheck,
  FileClock,
  ClipboardList,
  Megaphone,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  CircleDot,
  CircleCheck,
  Circle,
  ArrowUpRight,
  Timer,
  Info,
  Loader2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/use-auth'

// ─── CATEGORY COLOR MAP ─────────────────────────────────
const categoryColorMap: Record<string, { colorHex: string; bgColor: string }> = {
  Housing: { colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.08)' },
  'Food Assistance': { colorHex: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)' },
  Food: { colorHex: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)' },
  'Mental Health': { colorHex: '#8b5cf6', bgColor: 'rgba(139,92,246,0.08)' },
  'Legal Aid': { colorHex: '#06b6d4', bgColor: 'rgba(6,182,212,0.08)' },
  Legal: { colorHex: '#06b6d4', bgColor: 'rgba(6,182,212,0.08)' },
  Employment: { colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.08)' },
  Crisis: { colorHex: '#ef4444', bgColor: 'rgba(239,68,68,0.08)' },
  Senior: { colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.08)' },
}

function getCategoryColors(category: string | null): { colorHex: string; bgColor: string } {
  if (!category) return { colorHex: '#6b7280', bgColor: 'rgba(107,114,128,0.08)' }
  return categoryColorMap[category] || { colorHex: '#6b7280', bgColor: 'rgba(107,114,128,0.08)' }
}

function getCategoryIcon(category: string): typeof HomeIcon {
  const map: Record<string, typeof HomeIcon> = {
    Housing: HomeIcon,
    'Food Assistance': Sparkles,
    Food: Sparkles,
    'Mental Health': Shield,
    'Legal Aid': BookOpen,
    Legal: BookOpen,
    Employment: Zap,
    Crisis: Shield,
    Senior: Activity,
  }
  return map[category] || HomeIcon
}

// ─── RESOURCE STATUS TRACKER DATA ───────────────────────
// Computed dynamically inside the component from savedResourcesData and conversationsData

// ─── ACHIEVEMENTS DATA ──────────────────────────────────
// Computed dynamically inside the component from statsData and conversationsData

// ─── RECENT RESOURCE UPDATES DATA ───────────────────────
// Static informational content — not derived from user data
const recentResourceUpdates = [
  {
    id: '1',
    title: 'SNAP eligibility requirements changed',
    description: 'Income thresholds updated for 2026. Check if you now qualify for additional benefits.',
    category: 'Food Assistance',
    categoryColorHex: '#f59e0b',
    timeAgo: '2 hours ago',
    icon: Sparkles,
  },
  {
    id: '2',
    title: 'New housing program available in your area',
    description: 'Rapid Re-Housing Initiative now covers your ZIP code. Apply before July 15.',
    category: 'Housing',
    categoryColorHex: '#3b82f6',
    timeAgo: '1 day ago',
    icon: HomeIcon,
  },
  {
    id: '3',
    title: 'Crisis hotline hours updated',
    description: '988 Suicide & Crisis Lifeline now offers 24/7 chat support in Spanish.',
    category: 'Mental Health',
    categoryColorHex: '#8b5cf6',
    timeAgo: '3 days ago',
    icon: Phone,
  },
]

// ─── COMMUNITY FEED DATA ────────────────────────────────
// Static informational content — not derived from user data
const communityFeed = [
  { id: '1', text: '47 people found housing help this week', icon: HomeIcon, colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.06)' },
  { id: '2', text: '12 crisis interventions successfully connected', icon: Shield, colorHex: '#ef4444', bgColor: 'rgba(239,68,68,0.06)' },
  { id: '3', text: 'New resource: Youth Employment Program added', icon: Sparkles, colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.06)' },
  { id: '4', text: '89 resources verified and updated this month', icon: CircleCheck, colorHex: '#8b5cf6', bgColor: 'rgba(139,92,246,0.06)' },
  { id: '5', text: '23 people connected with legal aid this week', icon: BookOpen, colorHex: '#06b6d4', bgColor: 'rgba(6,182,212,0.06)' },
]

// ─── PRO TIPS DATA (EXPANDED) ───────────────────────────
const proTips = [
  {
    title: 'Be specific about your situation',
    description: 'The more detail you provide, the better we can classify your needs and find the right resources. Include your location, household size, and income range when possible.',
    example: "Try: 'I lost my job and need help with rent and food for my family of 4 in Chicago'",
    href: '/app?scenario=job',
    icon: Target,
    colorHex: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
  },
  {
    title: 'Always check confidence scores',
    description: 'Higher confidence means a better match between your needs and the resources suggested. If confidence is below 70%, the AI recommends you talk to a human navigator for verification.',
    example: "Look for the confidence ring next to each resource — green means high confidence (80%+)",
    href: '/app?scenario=stress',
    icon: Eye,
    colorHex: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
  },
  {
    title: 'Use the "Why" explanation',
    description: 'Every resource suggestion comes with a "Why" tab that explains how the AI matched your needs. Understanding this helps you make informed decisions about which resources to pursue.',
    example: "Click 'Why this resource?' to see the reasoning behind each suggestion",
    href: '/app?scenario=senior',
    icon: HelpCircle,
    colorHex: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.06)',
  },
  {
    title: 'Talk to a human navigator anytime',
    description: 'When in doubt, a real person is always one click away. 211 navigators are available 24/7 and can provide personalized guidance that goes beyond what AI can offer.',
    example: "Click the 'Talk to a Navigator' button at any point during your conversation",
    href: '/app?scenario=crisis',
    icon: Users,
    colorHex: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.06)',
  },
  {
    title: 'Save resources for later',
    description: 'Found a useful resource but not ready to apply? Save it to your profile and come back anytime. You can track application status and get notified of updates.',
    example: "Click the bookmark icon on any resource card to save it to your profile",
    href: '/app',
    icon: Bookmark,
    colorHex: '#ef4444',
    bgColor: 'rgba(239,68,68,0.06)',
  },
  {
    title: 'Rephrase if confidence is low',
    description: 'If the AI gives you a low confidence score, try rephrasing your question with different words or adding more context. The classification model works best with clear, descriptive input.',
    example: "Instead of 'I need help', try 'I need emergency housing assistance for my family'",
    href: '/app?scenario=stress',
    icon: RefreshCw,
    colorHex: '#06b6d4',
    bgColor: 'rgba(6,182,212,0.06)',
  },
]

// ─── UPCOMING EVENTS DATA ───────────────────────────────
// Static informational content — not derived from user data
const upcomingEvents = [
  {
    id: '1',
    title: 'Navigating Housing Resources Webinar',
    date: 'June 28, 2026',
    time: '2:00 PM EST',
    description: 'Learn how to find and apply for housing assistance programs in your area. Live Q&A with community navigators.',
    type: 'Webinar',
    typeColorHex: '#3b82f6',
    typeBgColor: 'rgba(59,130,246,0.08)',
    icon: Globe,
  },
  {
    id: '2',
    title: 'Community Navigator Office Hours',
    date: 'July 2, 2026',
    time: '10:00 AM – 12:00 PM EST',
    description: 'Drop-in session to get personalized help from trained 211 navigators. First come, first served.',
    type: 'Office Hours',
    typeColorHex: '#10b981',
    typeBgColor: 'rgba(16,185,129,0.08)',
    icon: Users,
  },
  {
    id: '3',
    title: 'USAII Hackathon Demo Session',
    date: 'July 5, 2026',
    time: '3:00 PM EST',
    description: 'See ClearPath AI in action! Live demo of calibrated transparency and crisis detection features.',
    type: 'Demo',
    typeColorHex: '#8b5cf6',
    typeBgColor: 'rgba(139,92,246,0.08)',
    icon: Zap,
  },
  {
    id: '4',
    title: 'Mental Health Resource Workshop',
    date: 'July 10, 2026',
    time: '1:00 PM EST',
    description: 'Understanding crisis support options and how AI assists with mental health resource navigation.',
    type: 'Workshop',
    typeColorHex: '#f59e0b',
    typeBgColor: 'rgba(245,158,11,0.08)',
    icon: Heart,
  },
]

// ─── QUICK TIPS DATA (LEGACY — kept for section below pro tips) ─
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

// ─── SUGGESTED SEARCH QUERIES ───────────────────────────
const suggestedSearches = [
  { label: 'Housing assistance', href: '/app?scenario=job' },
  { label: 'Food stamps', href: '/app?scenario=job' },
  { label: 'Mental health crisis', href: '/app?scenario=crisis' },
  { label: 'Senior services', href: '/app?scenario=senior' },
  { label: 'Legal aid', href: '/app?scenario=stress' },
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

function getWeatherIcon(): { icon: typeof CloudSun; label: string } {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 18) return { icon: CloudSun, label: 'Partly cloudy, 72°F' }
  return { icon: CloudSun, label: 'Clear night, 65°F' }
}

// ─── TIME AGO HELPER ────────────────────────────────────
function timeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? 'Last week' : `${weeks} weeks ago`
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] } },
}

// ─── API TYPES ──────────────────────────────────────────
interface StatsData {
  conversations: number
  resourcesFound: number
  avgConfidence: number
  streak: number
  totalConversations: number
  totalResources: number
  crisisCount: number
  categoryBreakdown: { category: string; count: number; percentage: number }[]
  weeklyActivity: { date: string; day: string; count: number }[]
  monthlyTrend: { week: string; startDate: string; count: number }[]
}

interface ConversationData {
  id: string
  title: string
  preview: string
  category: string | null
  categoryColor: string | null
  confidence: number
  isCrisis: boolean
  createdAt: string
}

interface SavedResourceData {
  id: string
  title: string
  category: string
  categoryColor: string
  confidence: number
  verifiedDate: string | null
  action: string | null
  detail: string | null
  createdAt: string
}

// ─── SKELETON COMPONENTS ────────────────────────────────
function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`animate-pulse bg-gray-200/60 rounded-lg ${className || ''}`} style={style} />
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass-card rounded-2xl p-5 shadow-premium">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-6 shadow-premium mb-10">
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <div className="flex items-end justify-between gap-4 h-44">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1">
            <Skeleton className="h-3 w-4" />
            <Skeleton className={`w-full max-w-[44px] rounded-t-lg`} style={{ height: `${20 + Math.random() * 80}%` }} />
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="glass-card rounded-2xl shadow-premium overflow-hidden mb-10">
      <div className="divide-y divide-gray-100/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="h-2.5 w-2.5 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-36" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

function CardGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-5 shadow-premium">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <Skeleton className="h-5 w-16 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── MAIN DASHBOARD PAGE ────────────────────────────────
export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const greeting = useMemo(() => getGreeting(), [])
  const weatherInfo = useMemo(() => getWeatherIcon(), [])
  const [archOpen, setArchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [emailInput, setEmailInput] = useState('')

  // ── API data state ──
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [conversationsData, setConversationsData] = useState<ConversationData[]>([])
  const [savedResourcesData, setSavedResourcesData] = useState<SavedResourceData[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState<string | null>(null)

  // ── Fetch data on mount ──
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    const fetchData = async () => {
      setDataLoading(true)
      setDataError(null)
      try {
        const [statsRes, convRes, resourcesRes] = await Promise.all([
          fetch(`/api/user/stats?userId=${user.id}`),
          fetch(`/api/conversations?userId=${user.id}`),
          fetch(`/api/saved-resources?userId=${user.id}`),
        ])

        if (statsRes.ok) {
          setStatsData(await statsRes.json())
        }
        if (convRes.ok) {
          const convJson = await convRes.json()
          setConversationsData(Array.isArray(convJson) ? convJson : (convJson.conversations || []))
        }
        if (resourcesRes.ok) {
          setSavedResourcesData(await resourcesRes.json())
        }

        if (!statsRes.ok && !convRes.ok && !resourcesRes.ok) {
          setDataError('Failed to load dashboard data')
        }
      } catch {
        setDataError('Failed to load dashboard data')
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated, user?.id])

  // ── Transform API data to UI shapes ──

  const stats = useMemo(() => {
    if (!statsData) return []
    const totalConv = statsData.totalConversations
    return [
      { label: 'Total conversations', value: String(totalConv), icon: MessageCircle, colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.06)', change: totalConv > 0 ? `${statsData.crisisCount} crisis${statsData.crisisCount !== 1 ? 's' : ''} detected` : 'Start your first conversation' },
      { label: 'Resources found', value: String(statsData.totalResources), icon: Sparkles, colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.06)', change: statsData.totalResources > 0 ? 'Saved to your profile' : 'Explore resources' },
      { label: 'Average confidence', value: `${statsData.avgConfidence}%`, icon: TrendingUp, colorHex: '#8b5cf6', bgColor: 'rgba(139,92,246,0.06)', change: statsData.avgConfidence >= 70 ? 'Above threshold' : statsData.avgConfidence > 0 ? 'Below threshold' : 'No data yet' },
      { label: 'Day streak', value: String(statsData.streak || 0), icon: Flame, colorHex: '#f97316', bgColor: 'rgba(249,115,22,0.06)', change: statsData.streak > 0 ? `${statsData.streak}-day streak!` : 'Start a conversation' },
    ]
  }, [statsData])

  const weeklyActivity = useMemo(() => {
    if (!statsData?.weeklyActivity?.length) return []
    return statsData.weeklyActivity.map((d) => ({ day: d.day, value: d.count }))
  }, [statsData])

  const monthlyTrend = useMemo(() => {
    if (!statsData?.monthlyTrend?.length) return []
    return statsData.monthlyTrend.map((d) => ({ week: d.week.replace('Week ', 'W'), value: d.count }))
  }, [statsData])

  const categoryBreakdown = useMemo(() => {
    if (!statsData?.categoryBreakdown?.length) return []
    return statsData.categoryBreakdown.map((c) => {
      const colors = getCategoryColors(c.category)
      return { label: c.category, percentage: c.percentage, colorHex: colors.colorHex }
    })
  }, [statsData])

  const recentConversations = useMemo(() => {
    return conversationsData.slice(0, 5).map((c) => ({
      id: c.id,
      title: c.title,
      timestamp: timeAgo(c.createdAt),
      confidence: c.confidence,
      preview: c.preview,
      scenario: c.isCrisis ? 'crisis' : (c.category?.toLowerCase() || 'stress'),
      isCrisis: c.isCrisis,
      category: c.category,
      categoryColor: c.categoryColor,
    }))
  }, [conversationsData])

  const savedResources = useMemo(() => {
    return savedResourcesData.slice(0, 3).map((r) => {
      const catColors = getCategoryColors(r.category)
      const Icon = getCategoryIcon(r.category)
      return {
        id: r.id,
        title: r.title,
        category: r.category,
        categoryColorHex: catColors.colorHex,
        categoryBg: catColors.bgColor,
        status: r.action || r.detail || 'View details',
        verifiedDate: r.verifiedDate || 'Not verified',
        icon: Icon,
      }
    })
  }, [savedResourcesData])

  const confidenceDistribution = useMemo(() => {
    if (conversationsData.length === 0) return []
    const high = conversationsData.filter((c) => c.confidence >= 80).length
    const good = conversationsData.filter((c) => c.confidence >= 70 && c.confidence < 80).length
    const moderate = conversationsData.filter((c) => c.confidence >= 50 && c.confidence < 70).length
    const low = conversationsData.filter((c) => c.confidence < 50).length
    const total = conversationsData.length
    return [
      { label: 'High', range: '80\u2013100%', count: high, percentage: Math.round((high / total) * 100), colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.08)' },
      { label: 'Good', range: '70\u201379%', count: good, percentage: Math.round((good / total) * 100), colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.08)' },
      { label: 'Moderate', range: '50\u201369%', count: moderate, percentage: Math.round((moderate / total) * 100), colorHex: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)' },
      { label: 'Low', range: '<50%', count: low, percentage: Math.round((low / total) * 100), colorHex: '#f97316', bgColor: 'rgba(249,115,22,0.08)' },
    ]
  }, [conversationsData])

  const transparencyMetrics = useMemo(() => {
    if (!statsData) return []
    const totalConv = statsData.totalConversations
    const crisisCount = statsData.crisisCount
    return [
      { label: 'Confidence score checks', percentage: Math.min(87, 50 + totalConv * 3), colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.08)' },
      { label: '"Why" explanations read', percentage: Math.min(62, 30 + totalConv * 2), colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.08)' },
      { label: '"What Else" alternatives viewed', percentage: Math.min(45, 20 + totalConv * 2), colorHex: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)' },
      { label: 'Crisis protocol awareness', percentage: Math.min(91, 60 + crisisCount * 10), colorHex: '#8b5cf6', bgColor: 'rgba(139,92,246,0.08)' },
    ]
  }, [statsData])

  // ── Resource Status Tracker (computed from real data) ──
  const resourceStatuses = useMemo(() => {
    const totalSaved = savedResourcesData.length
    const appliedCount = savedResourcesData.filter(
      (r) => r.action && /applied/i.test(r.action)
    ).length
    const inProgressCount = savedResourcesData.filter(
      (r) => r.action && /progress|pending|processing|submitted/i.test(r.action)
    ).length
    const toApplyCount = totalSaved - appliedCount - inProgressCount
    return [
      { label: 'Applied', count: appliedCount, icon: CircleCheck, colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.08)', description: 'Resources you have applied to' },
      { label: 'In Progress', count: inProgressCount, icon: RefreshCw, colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.08)', description: 'Applications being processed' },
      { label: 'To Apply', count: toApplyCount, icon: ClipboardList, colorHex: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)', description: 'Resources saved for later' },
    ]
  }, [savedResourcesData])

  // ── Achievements (computed from real data) ──
  const achievements = useMemo(() => {
    const totalConv = statsData?.totalConversations ?? 0
    const crisisCount = statsData?.crisisCount ?? 0
    const totalResources = statsData?.totalResources ?? 0
    // Find the earliest conversation date for "First Conversation" earned date
    const firstConvDate = conversationsData.length > 0
      ? conversationsData.reduce((earliest, c) => {
          const d = new Date(c.createdAt)
          return d < earliest ? d : earliest
        }, new Date(conversationsData[0].createdAt))
      : null
    // Find the earliest crisis conversation date
    const firstCrisisDate = conversationsData.filter((c) => c.isCrisis).length > 0
      ? conversationsData.filter((c) => c.isCrisis).reduce((earliest, c) => {
          const d = new Date(c.createdAt)
          return d < earliest ? d : earliest
        }, new Date())
      : null
    const formatDate = (d: Date | null) =>
      d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null

    return [
      {
        id: '1',
        name: 'First Conversation',
        description: 'Started your first conversation with ClearPath AI',
        icon: MessageCircle,
        colorHex: '#3b82f6',
        bgColor: 'rgba(59,130,246,0.08)',
        earned: totalConv >= 1,
        earnedDate: totalConv >= 1 ? formatDate(firstConvDate) : null,
      },
      {
        id: '2',
        name: 'Crisis Averted',
        description: 'Helped someone in crisis connect with the right support',
        icon: Shield,
        colorHex: '#ef4444',
        bgColor: 'rgba(239,68,68,0.08)',
        earned: crisisCount >= 1,
        earnedDate: crisisCount >= 1 ? formatDate(firstCrisisDate) : null,
      },
      {
        id: '3',
        name: 'Resource Connector',
        description: 'Found 5 or more resources through conversations',
        icon: Zap,
        colorHex: '#f59e0b',
        bgColor: 'rgba(245,158,11,0.08)',
        earned: totalResources >= 5,
        earnedDate: totalResources >= 5 ? formatDate(firstConvDate) : null,
      },
      {
        id: '4',
        name: 'Community Champion',
        description: 'Completed 10 conversations to build your community knowledge',
        icon: Users,
        colorHex: '#8b5cf6',
        bgColor: 'rgba(139,92,246,0.08)',
        earned: totalConv >= 10,
        earnedDate: totalConv >= 10 ? formatDate(firstConvDate) : null,
      },
      {
        id: '5',
        name: 'Transparency Advocate',
        description: 'Viewed confidence details and "Why" explanations in conversations',
        icon: Eye,
        colorHex: '#10b981',
        bgColor: 'rgba(16,185,129,0.08)',
        earned: false,
        earnedDate: null,
      },
    ]
  }, [statsData, conversationsData])

  // ── Computed values ──
  const maxActivityValue = useMemo(() => Math.max(...weeklyActivity.map((d) => d.value), 1), [weeklyActivity])
  const totalWeeklyConversations = useMemo(() => weeklyActivity.reduce((sum, d) => sum + d.value, 0), [weeklyActivity])
  const maxMonthlyValue = useMemo(() => Math.max(...monthlyTrend.map((d) => d.value), 1), [monthlyTrend])
  const overallTransparencyScore = useMemo(() => {
    if (transparencyMetrics.length === 0) return 0
    const avg = transparencyMetrics.reduce((sum, m) => sum + m.percentage, 0) / transparencyMetrics.length
    return Math.round(avg)
  }, [transparencyMetrics])

  const WeatherIcon = weatherInfo.icon
  const userName = user?.name || 'there'
  const userInitial = userName.charAt(0).toUpperCase()

  // ── Not logged in state ──
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col mesh-gradient-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center space-y-6 p-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
              <Layers className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Sign in to see your dashboard
            </h1>
            <p className="text-[15px] text-gray-500 max-w-md mx-auto leading-relaxed">
              Track your conversations, resources, and transparency scores. Your personalized dashboard awaits.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
            >
              Sign in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </main>
      </div>
    )
  }

  // ── Auth loading state ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col mesh-gradient-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      <main className="flex-1 pt-20 pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══════════ ENHANCED WELCOME SECTION ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="pt-8 pb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {/* User avatar */}
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md shadow-gray-900/15">
                    <span className="text-[15px] font-bold text-white">{userInitial}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                      {greeting}, {userName}
                    </h1>
                    <p className="text-[15px] text-gray-500 mt-0.5">
                      How can we help you today?
                    </p>
                  </div>
                </div>

                {/* Welcome context row */}
                <div className="flex flex-wrap items-center gap-3 ml-14">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-100/60">
                    <WeatherIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[12px] font-medium text-amber-700">{weatherInfo.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50/80 border border-orange-100/60">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[12px] font-medium text-orange-700">{statsData ? `${statsData.streak || 0}-day streak` : '0-day streak'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100/60">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[12px] font-medium text-emerald-700">{statsData ? `${statsData.totalResources} resources` : '3 resources'} found this week</span>
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

          {/* ═══════════ QUICK SEARCH BAR ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-10"
          >
            <div className="glass-card rounded-2xl p-5 shadow-premium relative overflow-hidden">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-blue-500/8 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <Link
                    href={searchQuery ? `/app?q=${encodeURIComponent(searchQuery)}` : '/app'}
                    className="block"
                  >
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What do you need help with?"
                      className="w-full bg-transparent text-[15px] font-medium text-gray-900 placeholder:text-gray-400 outline-none"
                    />
                  </Link>
                </div>
                <Link
                  href={searchQuery ? `/app?q=${encodeURIComponent(searchQuery)}` : '/app'}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-sm shadow-blue-500/20 transition-all shrink-0"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </Link>
              </div>

              {/* Suggested queries */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-100/60">
                <span className="text-[12px] font-medium text-gray-400 mr-1">Try:</span>
                {suggestedSearches.map((query) => (
                  <Link
                    key={query.label}
                    href={query.href}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-medium text-gray-600 bg-gray-50/80 border border-gray-100/60 hover:bg-white hover:text-gray-900 hover:border-gray-200 transition-all"
                  >
                    {query.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ═══════════ ERROR STATE ═══════════ */}
          {dataError && !dataLoading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="glass-card rounded-2xl p-6 shadow-premium text-center border border-red-100/60">
                <div className="w-12 h-12 rounded-xl bg-red-50/80 flex items-center justify-center mx-auto mb-3">
                  <Info className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">Failed to load dashboard data</h3>
                <p className="text-[13px] text-gray-500 mb-4">{dataError}</p>
                <button
                  onClick={() => {
                    setDataError(null)
                    setDataLoading(true)
                    // Re-trigger fetch
                    if (user?.id) {
                      Promise.all([
                        fetch(`/api/user/stats?userId=${user.id}`),
                        fetch(`/api/conversations?userId=${user.id}`),
                        fetch(`/api/saved-resources?userId=${user.id}`),
                      ]).then(([statsRes2, convRes2, resourcesRes2]) => {
                        if (statsRes2.ok) statsRes2.json().then(setStatsData)
                        if (convRes2.ok) convRes2.json().then((d) => setConversationsData(Array.isArray(d) ? d : (d.conversations || [])))
                        if (resourcesRes2.ok) resourcesRes2.json().then(setSavedResourcesData)
                        setDataLoading(false)
                      }).catch(() => {
                        setDataError('Failed to load dashboard data')
                        setDataLoading(false)
                      })
                    }
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try again
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════ STATS ROW ═══════════ */}
          {dataLoading ? (
            <StatsSkeleton />
          ) : dataError ? null : (
            <motion.section
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
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
                      <div className="space-y-2">
                        <p className="text-[13px] font-medium text-gray-500">{stat.label}</p>
                        <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{stat.value}</p>
                        <p className="text-[12px] font-medium" style={{ color: stat.colorHex }}>{stat.change}</p>
                      </div>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: stat.bgColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: stat.colorHex }} />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.section>
          )}

          {/* ═══════════ ENHANCED WEEKLY ACTIVITY CHART ═══════════ */}
          {dataLoading ? (
            <ChartSkeleton />
          ) : weeklyActivity.length > 0 ? (
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100/60">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[12px] font-semibold text-emerald-700">15% more than last week</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50/80 border border-violet-100/60">
                      <Timer className="w-3.5 h-3.5 text-violet-500" />
                      <span className="text-[12px] font-semibold text-violet-700">Avg response: 1.2s</span>
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
                        <span className="text-[11px] font-bold text-gray-500">{item.value}</span>
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
                        <span className="text-[12px] font-semibold text-gray-400">{item.day}</span>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Monthly trend mini-chart */}
                {monthlyTrend.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-gray-100/60">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[13px] font-semibold text-gray-700">Monthly Trend</p>
                      <span className="text-[12px] text-gray-400">Last 4 weeks</span>
                    </div>
                    <div className="flex items-end gap-3 h-16">
                      {monthlyTrend.map((item, i) => {
                        const heightPercent = (item.value / maxMonthlyValue) * 100
                        return (
                          <motion.div
                            key={item.week}
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                            className="flex-1 flex flex-col items-center gap-1"
                            style={{ transformOrigin: 'bottom' }}
                          >
                            <div className="w-full h-14 flex items-end">
                              <div
                                className="w-full rounded-t-md"
                                style={{
                                  height: `${heightPercent}%`,
                                  background: 'linear-gradient(to top, #8b5cf6, #a78bfa)',
                                  minHeight: '4px',
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-gray-400">{item.week}</span>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.section>
          ) : null}

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

          {/* ═══════════ CONFIDENCE DISTRIBUTION CHART ═══════════ */}
          {!dataLoading && confidenceDistribution.length > 0 && (
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/8 flex items-center justify-center">
                    <Target className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Confidence Distribution</h2>
                    <p className="text-[13px] text-gray-500 mt-0.5">How your conversation confidence scores are distributed</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {confidenceDistribution.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="flex items-center gap-4"
                    >
                      {/* Label */}
                      <div className="w-24 shrink-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="inline-block w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span className="text-[14px] font-semibold text-gray-700">{item.label}</span>
                        </div>
                        <span className="text-[11px] text-gray-400 ml-5">{item.range}</span>
                      </div>

                      {/* Bar */}
                      <div className="flex-1">
                        <div className="w-full h-8 bg-gray-50/80 rounded-lg overflow-hidden relative">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="h-full rounded-lg flex items-center justify-end pr-3 relative overflow-hidden"
                            style={{ backgroundColor: item.colorHex }}
                          >
                            <span className="text-[12px] font-bold text-white drop-shadow-sm">{item.percentage}%</span>
                          </motion.div>
                        </div>
                      </div>

                      {/* Count */}
                      <div
                        className="w-16 text-right shrink-0 px-2.5 py-1 rounded-md text-[13px] font-bold"
                        style={{ backgroundColor: item.bgColor, color: item.colorHex }}
                      >
                        {item.count}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100/60">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-gray-400" />
                    <p className="text-[12px] text-gray-500">
                      Confidence scores reflect how certain the AI is about its classification. Higher is better — scores below 50% trigger human escalation.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          )}

          {/* ═══════════ CATEGORY BREAKDOWN ═══════════ */}
          {!dataLoading && categoryBreakdown.length > 0 && (
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
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-violet-500/8 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Resource Categories</h2>
                    <p className="text-[13px] text-gray-500 mt-0.5">Distribution across conversation topics</p>
                  </div>
                </div>

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
          )}

          {/* ═══════════ RECENT CONVERSATIONS ═══════════ */}
          {dataLoading ? (
            <ListSkeleton rows={5} />
          ) : recentConversations.length > 0 ? (
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
                      housing: '/app?scenario=job',
                      'food assistance': '/app?scenario=job',
                      'mental health': '/app?scenario=crisis',
                      'legal aid': '/app?scenario=stress',
                      legal: '/app?scenario=stress',
                      employment: '/app?scenario=job',
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
                            {conv.isCrisis && (
                              <div
                                className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-30"
                                style={{ backgroundColor: confColor }}
                              />
                            )}
                          </div>

                          {/* Title + preview */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <h4 className="text-[14px] font-semibold text-gray-900 truncate">{conv.title}</h4>
                              <span
                                className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0"
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
          ) : (
            /* Empty state for conversations */
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="glass-card rounded-2xl p-8 shadow-premium text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/8 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-[14px] text-gray-500 mb-5 max-w-sm mx-auto">Start a conversation to get personalized resource recommendations with confidence scores.</p>
                <Link
                  href="/app"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Start your first conversation
                </Link>
              </div>
            </motion.section>
          )}

          {/* ═══════════ SAVED RESOURCES ═══════════ */}
          {dataLoading ? (
            <CardGridSkeleton count={3} />
          ) : savedResources.length > 0 ? (
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
                          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug">
                            {resource.title}
                          </h3>
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
          ) : !dataLoading ? (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <Bookmark className="w-5 h-5 text-gray-700" />
                <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Saved Resources</h2>
              </div>
              <div className="glass-card rounded-2xl p-6 shadow-premium text-center">
                <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-[14px] text-gray-500">No saved resources yet. Start a conversation to discover and save resources.</p>
              </div>
            </motion.section>
          ) : null}

          {/* ═══════════ RESOURCE STATUS TRACKER ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-500/8 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Resource Status Tracker</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">Track your progress on saved resources</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {resourceStatuses.map((status, i) => {
                const Icon = status.icon
                return (
                  <motion.div
                    key={status.label}
                    variants={staggerItem}
                    className="glass-card glass-card-hover rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: status.bgColor }}
                        >
                          <Icon className="w-6 h-6" style={{ color: status.colorHex }} />
                        </div>
                        <span
                          className="text-3xl font-extrabold tracking-tight"
                          style={{ color: status.colorHex }}
                        >
                          {status.count}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{status.label}</h3>
                        <p className="text-[12px] text-gray-500 mt-1">{status.description}</p>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100/80 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((status.count / Math.max(savedResourcesData.length, 1)) * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: status.colorHex }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* ═══════════ ACHIEVEMENTS & MILESTONES ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/8 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Achievements &amp; Milestones</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">Your journey with ClearPath AI</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon
                return (
                  <motion.div
                    key={achievement.id}
                    variants={staggerItem}
                    className={`glass-card rounded-2xl p-5 shadow-premium transition-all duration-300 group relative overflow-hidden ${
                      achievement.earned ? 'glass-card-hover hover:shadow-premium-lg' : 'opacity-60'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: achievement.bgColor }}
                        >
                          {achievement.earned ? (
                            <Icon className="w-6 h-6" style={{ color: achievement.colorHex }} />
                          ) : (
                            <Lock className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        {achievement.earned ? (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50/80 border border-emerald-100/60">
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Earned</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-50/80 border border-gray-100/60">
                            <Lock className="w-3 h-3 text-gray-400" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Locked</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{achievement.name}</h3>
                        <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{achievement.description}</p>
                      </div>
                      {achievement.earned && achievement.earnedDate && (
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                          <Calendar className="w-3.5 h-3.5" />
                          Earned {achievement.earnedDate}
                        </div>
                      )}
                      {!achievement.earned && (
                        <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
                          <Star className="w-3.5 h-3.5" />
                          Keep using ClearPath AI to unlock
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* ═══════════ RECENT RESOURCE UPDATES ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-11 h-11 rounded-xl bg-orange-500/8 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Recent Resource Updates</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100/80 text-gray-500 border border-gray-200/60">Informational</span>
                </div>
                <p className="text-[13px] text-gray-500 mt-0.5">General resource updates — not personalized</p>
              </div>
            </motion.div>

            <div className="space-y-4">
              {recentResourceUpdates.map((update, i) => {
                const Icon = update.icon
                return (
                  <motion.div
                    key={update.id}
                    variants={staggerItem}
                    className="glass-card glass-card-hover rounded-2xl p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `rgba(${update.categoryColorHex === '#3b82f6' ? '59,130,246' : update.categoryColorHex === '#f59e0b' ? '245,158,11' : '139,92,246'},0.08)` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: update.categoryColorHex }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{update.title}</h3>
                            <p className="text-[13px] text-gray-500 mt-1 leading-relaxed">{update.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <span
                            className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `rgba(${update.categoryColorHex === '#3b82f6' ? '59,130,246' : update.categoryColorHex === '#f59e0b' ? '245,158,11' : '139,92,246'},0.08)`,
                              color: update.categoryColorHex,
                            }}
                          >
                            {update.category}
                          </span>
                          <span className="flex items-center gap-1.5 text-[12px] text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {update.timeAgo}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* ═══════════ COMMUNITY FEED ═══════════ */}
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-rose-500/8 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Community Impact</h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100/80 text-gray-500 border border-gray-200/60">Informational</span>
                  </div>
                  <p className="text-[13px] text-gray-500 mt-0.5">Example community activity — not live data</p>
                </div>
              </div>

              <div className="space-y-3">
                {communityFeed.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/60 transition-colors group"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: item.bgColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: item.colorHex }} />
                      </div>
                      <p className="text-[14px] font-medium text-gray-700 flex-1">{item.text}</p>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100/60">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <p className="text-[12px] text-gray-500">
                    All data is anonymized. No personal information is shared or stored.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* ═══════════ YOUR TRANSPARENCY SCORE ═══════════ */}
          {!dataLoading && transparencyMetrics.length > 0 && (
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
                {/* Decorative background glow */}
                <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-30 pointer-events-none"
                  style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)' }}
                />

                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-500/8 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Your Transparency Score</h2>
                        <p className="text-[13px] text-gray-500 mt-0.5">How well you engage with transparency features</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[12px] text-gray-400 font-medium">Overall Score</p>
                        <p className="text-3xl font-extrabold tracking-tight" style={{ color: overallTransparencyScore >= 70 ? '#10b981' : '#f59e0b' }}>
                          {overallTransparencyScore}%
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-full border-[3px] flex items-center justify-center"
                        style={{
                          borderColor: overallTransparencyScore >= 70 ? '#10b981' : '#f59e0b',
                        }}
                      >
                        <span className="text-[13px] font-bold" style={{ color: overallTransparencyScore >= 70 ? '#10b981' : '#f59e0b' }}>
                          {overallTransparencyScore >= 70 ? 'A' : 'B'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {transparencyMetrics.map((metric, i) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-medium text-gray-700">{metric.label}</span>
                          <span className="text-[14px] font-bold" style={{ color: metric.colorHex }}>{metric.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100/80 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.percentage}%` }}
                            transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: metric.colorHex }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100/60">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-[13px] text-gray-500 leading-relaxed">
                        {conversationsData.length > 0
                          ? `You check confidence scores ${transparencyMetrics[0]?.percentage}% of the time — great habit! Try reading \u201cWhy\u201d explanations more often to boost your transparency awareness and make more informed decisions about resources.`
                          : 'Start having conversations to build your transparency score. The more you engage with confidence scores and explanations, the higher your score will be.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.section>
          )}

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
                  <ChevronDown className="w-5 h-5 text-gray-400" />
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
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
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

          {/* ═══════════ PRO TIPS (EXPANDED) ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/8 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Pro Tips</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">Get the most out of ClearPath AI</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {proTips.map((tip) => {
                const Icon = tip.icon
                return (
                  <motion.div
                    key={tip.title}
                    variants={staggerItem}
                    className="glass-card glass-card-hover rounded-2xl p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 group relative overflow-hidden card-shine"
                  >
                    <div className="space-y-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: tip.bgColor }}
                      >
                        <Icon className="w-5 h-5" style={{ color: tip.colorHex }} />
                      </div>
                      <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{tip.title}</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{tip.description}</p>
                      <div className="bg-gray-50/60 rounded-lg p-3 border border-gray-100/40">
                        <p className="text-[12px] text-gray-600 leading-relaxed italic">{tip.example}</p>
                      </div>
                      <Link
                        href={tip.href}
                        className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-400 group-hover:text-gray-700 transition-colors"
                      >
                        Try this tip
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* ═══════════ QUICK TIPS (LEGACY) ═══════════ */}
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

          {/* ═══════════ UPCOMING EVENTS ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mb-10"
          >
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-11 h-11 rounded-xl bg-violet-500/8 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Upcoming Events</h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100/80 text-gray-500 border border-gray-200/60">Informational</span>
                </div>
                <p className="text-[13px] text-gray-500 mt-0.5">Sample community sessions and webinars</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => {
                const TypeIcon = event.icon
                return (
                  <motion.div
                    key={event.id}
                    variants={staggerItem}
                    className="glass-card glass-card-hover rounded-2xl p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: event.typeBgColor }}
                        >
                          <TypeIcon className="w-5 h-5" style={{ color: event.typeColorHex }} />
                        </div>
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: event.typeBgColor, color: event.typeColorHex }}
                        >
                          {event.type}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug">{event.title}</h3>
                        <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">{event.description}</p>
                      </div>
                      <div className="flex items-center gap-4 text-[12px] text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {event.time}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
                        Learn more
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>

          {/* ═══════════ SAFETY BADGES ═══════════ */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pb-8"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/60 border border-emerald-100/40">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-[12px] font-semibold text-emerald-700">Privacy by design</span>
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

        {/* ═══════════ EXPANDED FOOTER ═══════════ */}
        <footer className="sidebar-dark mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[15px] font-bold text-white">ClearPath AI</span>
                </div>
                <p className="text-[13px] text-gray-400 leading-relaxed">Calibrated transparency for community resource navigation. Built with responsibility at the core.</p>
              </div>

              {/* Product */}
              <div>
                <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">Product</h4>
                <div className="space-y-2.5">
                  <Link href="/app" className="block text-[13px] text-gray-400 hover:text-white transition-colors">Chat</Link>
                  <Link href="/dashboard" className="block text-[13px] text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                  <Link href="/history" className="block text-[13px] text-gray-400 hover:text-white transition-colors">History</Link>
                  <Link href="/pricing" className="block text-[13px] text-gray-400 hover:text-white transition-colors">Pricing</Link>
                </div>
              </div>

              {/* Company */}
              <div>
                <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">Company</h4>
                <div className="space-y-2.5">
                  <Link href="/about" className="block text-[13px] text-gray-400 hover:text-white transition-colors">About</Link>
                  <Link href="/responsible-ai" className="block text-[13px] text-gray-400 hover:text-white transition-colors">Responsible AI</Link>
                  <Link href="/privacy" className="block text-[13px] text-gray-400 hover:text-white transition-colors">Privacy</Link>
                  <Link href="/terms" className="block text-[13px] text-gray-400 hover:text-white transition-colors">Terms</Link>
                </div>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="text-[13px] font-bold text-white uppercase tracking-wider mb-4">Stay Updated</h4>
                <p className="text-[13px] text-gray-400 mb-3">Get updates on new features and resources.</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-[13px] text-white placeholder:text-gray-500 outline-none focus:border-white/30 transition-colors"
                  />
                  <button className="px-3 py-2 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg text-[12px] font-semibold text-white transition-all shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[12px] text-gray-500">&copy; 2026 ClearPath AI. All rights reserved.</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-md">Demo</span>
                <span className="text-[11px] text-gray-600">USAII Hackathon</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
