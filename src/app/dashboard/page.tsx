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

// ─── MONTHLY TREND DATA ─────────────────────────────────
const monthlyTrend = [
  { week: 'W1', value: 18 },
  { week: 'W2', value: 22 },
  { week: 'W3', value: 31 },
  { week: 'W4', value: 35 },
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

// ─── CONFIDENCE DISTRIBUTION DATA ───────────────────────
const confidenceDistribution = [
  { label: 'High', range: '80–100%', count: 14, percentage: 58, colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.08)' },
  { label: 'Good', range: '70–79%', count: 5, percentage: 21, colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.08)' },
  { label: 'Moderate', range: '50–69%', count: 3, percentage: 13, colorHex: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)' },
  { label: 'Low', range: '<50%', count: 2, percentage: 8, colorHex: '#f97316', bgColor: 'rgba(249,115,22,0.08)' },
]

// ─── RESOURCE STATUS TRACKER DATA ───────────────────────
const resourceStatuses = [
  { label: 'Applied', count: 8, icon: CircleCheck, colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.08)', description: 'Resources you have applied to' },
  { label: 'In Progress', count: 5, icon: RefreshCw, colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.08)', description: 'Applications being processed' },
  { label: 'To Apply', count: 12, icon: ClipboardList, colorHex: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)', description: 'Resources saved for later' },
]

// ─── ACHIEVEMENTS DATA ──────────────────────────────────
const achievements = [
  {
    id: '1',
    name: 'First Conversation',
    description: 'Started your first conversation with ClearPath AI',
    icon: MessageCircle,
    colorHex: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.08)',
    earned: true,
    earnedDate: 'Jun 1, 2026',
  },
  {
    id: '2',
    name: 'Crisis Averted',
    description: 'Helped someone in crisis connect with the right support',
    icon: Shield,
    colorHex: '#ef4444',
    bgColor: 'rgba(239,68,68,0.08)',
    earned: true,
    earnedDate: 'Jun 3, 2026',
  },
  {
    id: '3',
    name: 'Resource Connector',
    description: 'Found 5 or more resources through conversations',
    icon: Zap,
    colorHex: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.08)',
    earned: true,
    earnedDate: 'Jun 5, 2026',
  },
  {
    id: '4',
    name: 'Community Champion',
    description: 'Completed 10 conversations to build your community knowledge',
    icon: Users,
    colorHex: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.08)',
    earned: true,
    earnedDate: 'Jun 8, 2026',
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

// ─── RECENT RESOURCE UPDATES DATA ───────────────────────
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
  { label: 'Day streak', value: '7', icon: Flame, colorHex: '#f97316', bgColor: 'rgba(249,115,22,0.06)', change: 'Personal best!' },
]

// ─── TRANSPARENCY SCORE DATA ────────────────────────────
const transparencyMetrics = [
  { label: 'Confidence score checks', percentage: 87, colorHex: '#10b981', bgColor: 'rgba(16,185,129,0.08)' },
  { label: '"Why" explanations read', percentage: 62, colorHex: '#3b82f6', bgColor: 'rgba(59,130,246,0.08)' },
  { label: '"What Else" alternatives viewed', percentage: 45, colorHex: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)' },
  { label: 'Crisis protocol awareness', percentage: 91, colorHex: '#8b5cf6', bgColor: 'rgba(139,92,246,0.08)' },
]

// ─── MAIN DASHBOARD PAGE ────────────────────────────────
export default function DashboardPage() {
  const greeting = useMemo(() => getGreeting(), [])
  const weatherInfo = useMemo(() => getWeatherIcon(), [])
  const [archOpen, setArchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [emailInput, setEmailInput] = useState('')

  const maxActivityValue = useMemo(() => Math.max(...weeklyActivity.map(d => d.value)), [])
  const totalWeeklyConversations = useMemo(() => weeklyActivity.reduce((sum, d) => sum + d.value, 0), [])
  const maxMonthlyValue = useMemo(() => Math.max(...monthlyTrend.map(d => d.value)), [])
  const overallTransparencyScore = useMemo(() => {
    const avg = transparencyMetrics.reduce((sum, m) => sum + m.percentage, 0) / transparencyMetrics.length
    return Math.round(avg)
  }, [])

  const WeatherIcon = weatherInfo.icon

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

                {/* Welcome context row */}
                <div className="flex flex-wrap items-center gap-3 ml-14">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50/80 border border-amber-100/60">
                    <WeatherIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[12px] font-medium text-amber-700">{weatherInfo.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50/80 border border-orange-100/60">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-[12px] font-medium text-orange-700">7-day streak</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100/60">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[12px] font-medium text-emerald-700">3 resources found this week</span>
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

          {/* ═══════════ STATS ROW ═══════════ */}
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

          {/* ═══════════ ENHANCED WEEKLY ACTIVITY CHART ═══════════ */}
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

          {/* ═══════════ CONFIDENCE DISTRIBUTION CHART ═══════════ */}
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
                          animate={{ width: `${(status.count / 25) * 100}%` }}
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
                <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Recent Resource Updates</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">Changes to resources you&apos;ve saved or viewed</p>
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
                  <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Community Impact</h2>
                  <p className="text-[13px] text-gray-500 mt-0.5">Anonymized community activity this week</p>
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
                      You check confidence scores 87% of the time — great habit! Try reading &ldquo;Why&rdquo; explanations more often to boost your transparency awareness and make more informed decisions about resources.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
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
                <h2 className="text-[18px] font-bold tracking-tight text-gray-900">Upcoming Events</h2>
                <p className="text-[13px] text-gray-500 mt-0.5">Community sessions and webinars</p>
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

        {/* ═══════════ EXPANDED FOOTER ═══════════ */}
        <footer className="sidebar-dark mt-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand column */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[15px] font-bold tracking-tight text-white">
                    ClearPath AI
                  </span>
                </div>
                <p className="text-[13px] text-gray-400 leading-relaxed">
                  Calibrated transparency for community resource navigation. Built for the USAII Global AI Hackathon 2026.
                </p>
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 w-fit">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">Demo</span>
                </div>
              </div>

              {/* Product links */}
              <div className="space-y-4">
                <h4 className="text-[13px] font-bold text-white uppercase tracking-wider">Product</h4>
                <nav className="flex flex-col gap-2.5">
                  <Link href="/app" className="text-[13px] text-gray-400 hover:text-white transition-colors">Try ClearPath AI</Link>
                  <Link href="/dashboard" className="text-[13px] text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                  <Link href="/history" className="text-[13px] text-gray-400 hover:text-white transition-colors">History</Link>
                  <Link href="/pricing" className="text-[13px] text-gray-400 hover:text-white transition-colors">Pricing</Link>
                  <Link href="/settings" className="text-[13px] text-gray-400 hover:text-white transition-colors">Settings</Link>
                </nav>
              </div>

              {/* Company links */}
              <div className="space-y-4">
                <h4 className="text-[13px] font-bold text-white uppercase tracking-wider">Company</h4>
                <nav className="flex flex-col gap-2.5">
                  <Link href="/about" className="text-[13px] text-gray-400 hover:text-white transition-colors">About</Link>
                  <Link href="/responsible-ai" className="text-[13px] text-gray-400 hover:text-white transition-colors">Responsible AI</Link>
                  <Link href="/privacy" className="text-[13px] text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
                  <Link href="/terms" className="text-[13px] text-gray-400 hover:text-white transition-colors">Terms of Service</Link>
                  <Link href="/profile" className="text-[13px] text-gray-400 hover:text-white transition-colors">Profile</Link>
                </nav>
              </div>

              {/* Newsletter + social */}
              <div className="space-y-4">
                <h4 className="text-[13px] font-bold text-white uppercase tracking-wider">Stay Updated</h4>
                <p className="text-[13px] text-gray-400 leading-relaxed">
                  Get notified about new features and community updates.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[13px] text-white placeholder:text-gray-500 outline-none focus:border-white/20 transition-colors"
                  />
                  <button className="px-3 py-2 rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 text-[13px] font-semibold text-white hover:from-blue-500 hover:to-blue-600 transition-all shadow-sm">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <Globe className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <Mail className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[12px] text-gray-500">
                © 2026 ClearPath AI. Built for the USAII Global AI Hackathon.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors">Privacy</Link>
                <Link href="/terms" className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors">Terms</Link>
                <Link href="/responsible-ai" className="text-[12px] text-gray-500 hover:text-gray-300 transition-colors">Responsible AI</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
