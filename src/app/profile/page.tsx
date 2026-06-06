'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Edit3,
  LogOut,
  Clock,
  Layers,
  Shield,
  AlertTriangle,
  Trash2,
  ChevronRight,
  Calendar,
  Check,
  Bookmark,
  Home,
  Utensils,
  Heart,
  Briefcase,
  BarChart3,
  Bell,
  Zap,
  Star,
  ArrowRight,
  Crown,
  Sparkles,
  Search,
  Key,
  Smartphone,
  Download,
  Eye,
  Lock,
  Link2,
  Copy,
  Users,
  Volume2,
  Monitor,
  Type,
  X,
  BadgeCheck,
  Gift,
  ChevronDown,
  FileText,
  Globe2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

// ─── MOCK DATA ──────────────────────────────────────────
const activityTimeline = [
  {
    id: '1',
    text: 'Searched for housing assistance',
    time: '2 hours ago',
    icon: Layers,
    colorHex: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
  },
  {
    id: '2',
    text: 'Found 3 legal aid resources',
    time: 'Yesterday',
    icon: Shield,
    colorHex: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
  },
  {
    id: '3',
    text: 'Connected with crisis line',
    time: '2 days ago',
    icon: AlertTriangle,
    colorHex: '#ef4444',
    bgColor: 'rgba(239,68,68,0.06)',
  },
  {
    id: '4',
    text: 'Updated profile settings',
    time: '3 days ago',
    icon: User,
    colorHex: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.06)',
  },
]

const accountStats = [
  {
    label: 'Conversations',
    value: '24',
    icon: Layers,
    colorHex: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
  },
  {
    label: 'Resources found',
    value: '47',
    icon: Shield,
    colorHex: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
  },
  {
    label: 'Member for',
    value: '7 days',
    icon: Calendar,
    colorHex: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.06)',
  },
]

const savedResources = [
  {
    id: '1',
    title: 'Section 8 Emergency Transfer',
    category: 'Housing',
    categoryIcon: Home,
    categoryColor: '#3b82f6',
    categoryBg: 'rgba(59,130,246,0.06)',
    confidence: 87,
    verifiedDate: 'May 2026',
    action: '2 locations near you',
    actionIcon: MapPin,
  },
  {
    id: '2',
    title: 'SNAP Benefits Application',
    category: 'Food',
    categoryIcon: Utensils,
    categoryColor: '#10b981',
    categoryBg: 'rgba(16,185,129,0.06)',
    confidence: 94,
    verifiedDate: 'June 2026',
    action: 'Apply online',
    actionIcon: Zap,
  },
  {
    id: '3',
    title: '988 Crisis Lifeline',
    category: 'Crisis',
    categoryIcon: Heart,
    categoryColor: '#ef4444',
    categoryBg: 'rgba(239,68,68,0.06)',
    confidence: 100,
    verifiedDate: 'Available 24/7',
    action: 'Phone & chat',
    actionIcon: Phone,
  },
  {
    id: '4',
    title: 'Veteran Employment Program',
    category: 'Employment',
    categoryIcon: Briefcase,
    categoryColor: '#f59e0b',
    categoryBg: 'rgba(245,158,11,0.06)',
    confidence: 78,
    verifiedDate: 'April 2026',
    action: 'Job training',
    actionIcon: Star,
  },
]

const searchCategories = [
  { label: 'Housing', percent: 38, color: '#3b82f6' },
  { label: 'Food', percent: 22, color: '#10b981' },
  { label: 'Mental Health', percent: 18, color: '#8b5cf6' },
]

const resourceFilterTabs = [
  { label: 'All', value: 'all' },
  { label: 'Housing', value: 'Housing' },
  { label: 'Food', value: 'Food' },
  { label: 'Mental Health', value: 'Mental Health' },
  { label: 'Crisis', value: 'Crisis' },
  { label: 'Employment', value: 'Employment' },
  { label: 'Legal', value: 'Legal' },
]

const connectedAccounts = [
  {
    id: 'google',
    name: 'Google',
    icon: Globe2,
    connected: true,
    email: 'alex@gmail.com',
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: FileText,
    connected: false,
    email: '',
    color: '#6b7280',
    bgColor: 'rgba(107,114,128,0.06)',
  },
]

const activeSessions = [
  { id: '1', device: 'Chrome on macOS', location: 'New York, US', time: 'Current session', current: true },
  { id: '2', device: 'Safari on iPhone', location: 'New York, US', time: '2 hours ago', current: false },
]

const planFeatures = [
  { feature: 'Conversations per day', free: '5', pro: 'Unlimited' },
  { feature: 'Resource access', free: 'Basic', pro: 'Full database' },
  { feature: 'Crisis detection', free: 'Always on', pro: 'Always on' },
  { feature: 'Confidence visibility', free: 'Partial', pro: 'Full transparency' },
  { feature: 'Priority support', free: 'No', pro: 'Yes' },
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
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// ─── CONFIDENCE COLOR HELPER ────────────────────────────
function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return '#10b981'
  if (confidence >= 75) return '#3b82f6'
  if (confidence >= 60) return '#f59e0b'
  return '#ef4444'
}

function getConfidenceBg(confidence: number): string {
  if (confidence >= 90) return 'rgba(16,185,129,0.06)'
  if (confidence >= 75) return 'rgba(59,130,246,0.06)'
  if (confidence >= 60) return 'rgba(245,158,11,0.06)'
  return 'rgba(239,68,68,0.06)'
}

// ─── FORM FIELD COMPONENT ───────────────────────────────
function FormField({
  label,
  icon: Icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  optional = false,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  optional?: boolean
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        {label}
        {optional && <span className="text-[11px] font-normal text-gray-400">(optional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-[14px] text-gray-900 bg-white/60 border border-gray-200/60 outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-blue-300/60 focus:bg-white/80 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.06),0_2px_8px_rgba(0,0,0,0.04)]"
      />
    </div>
  )
}

// ─── TOGGLE SWITCH COMPONENT ────────────────────────────
function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean
  onChange: (val: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full
        transition-colors duration-200 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${checked
          ? 'bg-gradient-to-b from-blue-500 to-blue-600 shadow-md shadow-blue-500/20'
          : 'bg-gray-200'
        }
      `}
    >
      <span
        className={`
          pointer-events-none inline-block rounded-full bg-white shadow-md
          transform transition-transform duration-200 ease-in-out
          ${checked ? 'translate-x-[22px]' : 'translate-x-[3px]'}
          mt-[3px]
        `}
        style={{
          width: '22px',
          height: '22px',
        }}
      />
    </button>
  )
}

// ─── MAIN PROFILE PAGE ─────────────────────────────────
export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [fullName, setFullName] = useState('Alex Korane')
  const [email, setEmail] = useState('alex@example.com')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [language, setLanguage] = useState('English')

  // Original values for cancel
  const [origName, setOrigName] = useState(fullName)
  const [origEmail, setOrigEmail] = useState(email)
  const [origPhone, setOrigPhone] = useState(phone)
  const [origLocation, setOrigLocation] = useState(location)
  const [origLanguage, setOrigLanguage] = useState(language)

  // Notification preferences state
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [resourceUpdates, setResourceUpdates] = useState(true)
  const [weeklySummary, setWeeklySummary] = useState(false)
  const [newFeatures, setNewFeatures] = useState(false)
  const [smsNotifs, setSmsNotifs] = useState(false)
  const [browserPush, setBrowserPush] = useState(false)
  const [weeklyDigestCustom, setWeeklyDigestCustom] = useState(true)

  // New states
  const [resourceFilter, setResourceFilter] = useState('all')
  const [resourceSearch, setResourceSearch] = useState('')
  const [resourceSort, setResourceSort] = useState<'recent' | 'confidence' | 'name'>('recent')
  const [twoFactor, setTwoFactor] = useState(false)
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal')
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [referralCopied, setReferralCopied] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const handleEdit = () => {
    setOrigName(fullName)
    setOrigEmail(email)
    setOrigPhone(phone)
    setOrigLocation(location)
    setOrigLanguage(language)
    setIsEditing(true)
    setSaved(false)
  }

  const handleCancel = () => {
    setFullName(origName)
    setEmail(origEmail)
    setPhone(origPhone)
    setLocation(origLocation)
    setLanguage(origLanguage)
    setIsEditing(false)
  }

  const handleSave = () => {
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleCopyReferral = () => {
    setReferralCopied(true)
    setTimeout(() => setReferralCopied(false), 2000)
  }

  // Get initials
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Filter saved resources
  const filteredResources = savedResources.filter((r) => {
    const matchesFilter = resourceFilter === 'all' || r.category === resourceFilter
    const matchesSearch = resourceSearch === '' || r.title.toLowerCase().includes(resourceSearch.toLowerCase()) || r.category.toLowerCase().includes(resourceSearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const sortedResources = [...filteredResources].sort((a, b) => {
    if (resourceSort === 'confidence') return b.confidence - a.confidence
    if (resourceSort === 'name') return a.title.localeCompare(b.title)
    return 0
  })

  // Privacy score calculation
  const privacyScore = 85

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══════════ ENHANCED PROFILE HEADER ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-3xl shadow-premium-lg relative overflow-hidden">
              {/* Cover / Banner Image Area */}
              <div
                className="h-28 sm:h-36 relative"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #8b5cf6 100%)',
                }}
              >
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.15), transparent 60%)' }} />
                {/* Decorative shapes */}
                <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-white/10" />
                <div className="absolute bottom-2 right-24 w-8 h-8 rounded-full bg-white/5" />
              </div>

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 relative">
                <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 -mt-10 sm:-mt-12">
                  {/* Avatar with gradient border */}
                  <div className="relative group">
                    {/* Gradient border ring */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-br from-blue-500 via-emerald-400 to-violet-500 shadow-lg shadow-blue-500/15">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="text-[22px] sm:text-[26px] font-extrabold tracking-tight bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
                          {initials}
                        </span>
                      </div>
                    </div>
                    {/* Camera overlay on hover */}
                    <button
                      className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
                      aria-label="Change avatar"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                    {/* Verified badge */}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>

                  {/* Name + info */}
                  <div className="flex-1 text-center sm:text-left sm:pb-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-gray-900">
                        {fullName}
                      </h1>
                      {/* Member tier badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50/80 text-emerald-600 border border-emerald-100/60">
                        <Crown className="w-3 h-3" />
                        Free
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-2">
                      <div className="flex items-center gap-1.5 text-[14px] text-gray-500">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {email}
                      </div>
                      <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-300" />
                      <div className="flex items-center gap-1.5 text-[14px] text-gray-500">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        Member since June 2026
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-center sm:justify-start gap-3 mt-5">
                      <button
                        onClick={handleEdit}
                        disabled={isEditing}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit profile
                      </button>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100/60 transition-all"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ ACCOUNT TIER SECTION ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.06, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              {/* Accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-violet-500" />

              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight text-gray-900">
                    Your Plan
                  </h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    Manage your subscription and features
                  </p>
                </div>
              </div>

              {/* Current plan card */}
              <div className="rounded-xl border border-emerald-100/60 bg-emerald-50/30 p-5 mb-5 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-emerald-100/80 text-emerald-700">
                      <Sparkles className="w-3.5 h-3.5" />
                      Free Plan
                    </span>
                  </div>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 transition-all active:scale-[0.97]"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Upgrade to Pro
                  </Link>
                </div>
                <p className="text-[12px] text-emerald-600/70">
                  You are on the Free plan. Upgrade to Pro for unlimited conversations, full database access, and priority support.
                </p>
              </div>

              {/* Feature comparison mini-table */}
              <div className="rounded-xl bg-white/50 border border-gray-100/60 overflow-hidden relative z-10">
                <div className="grid grid-cols-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100/60 px-4 py-3">
                  <span>Feature</span>
                  <span className="text-center">Free</span>
                  <span className="text-center text-blue-600">Pro</span>
                </div>
                {planFeatures.map((row, i) => (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-3 px-4 py-2.5 text-[12px] ${i < planFeatures.length - 1 ? 'border-b border-gray-50/80' : ''}`}
                  >
                    <span className="text-gray-600 font-medium">{row.feature}</span>
                    <span className="text-center text-gray-400">{row.free}</span>
                    <span className="text-center text-blue-600 font-semibold">{row.pro}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ═══════════ ACCOUNT STATS ═══════════ */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-3 gap-3 sm:gap-4 mb-8"
          >
            {accountStats.map((stat) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="glass-card glass-card-hover rounded-2xl p-4 sm:p-5 shadow-premium hover:shadow-premium-lg transition-all duration-300 relative overflow-hidden group text-center"
                >
                  <div
                    className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(circle, ${stat.colorHex}12, transparent 70%)` }}
                  />
                  <div className="relative z-10 space-y-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
                      style={{ backgroundColor: stat.bgColor }}
                    >
                      <Icon className="w-5 h-5" style={{ color: stat.colorHex }} />
                    </div>
                    <div>
                      <p className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-[11px] sm:text-[12px] font-medium text-gray-500 mt-1">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.section>

          {/* ═══════════ EXPANDED SAVED RESOURCES SECTION ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              <div
                className="absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12), rgba(59,130,246,0.06), transparent 70%)' }}
              />

              {/* Section header */}
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Bookmark className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-[17px] font-bold tracking-tight text-gray-900">
                        Saved Resources
                      </h2>
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100/80 text-[10px] font-bold text-emerald-700">
                        {savedResources.length}
                      </span>
                    </div>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      Resources you&apos;ve bookmarked for quick access
                    </p>
                  </div>
                </div>
                <Link
                  href="/history"
                  className="hidden sm:inline-flex items-center gap-1 text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
                >
                  View all
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Search bar */}
              <div className="relative mb-4 z-10">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/50 border border-gray-100/60">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search saved resources..."
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    className="flex-1 bg-transparent text-[13px] text-gray-900 placeholder:text-gray-400 outline-none font-medium"
                  />
                  {resourceSearch && (
                    <button onClick={() => setResourceSearch('')} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/60 transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter tabs */}
              <div className="flex items-center gap-1.5 flex-wrap mb-4 relative z-10">
                {resourceFilterTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setResourceFilter(tab.value)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 ${
                      resourceFilter === tab.value
                        ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-sm'
                        : 'bg-white/50 border border-gray-100/60 text-gray-500 hover:bg-white/80 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                {/* Sort dropdown */}
                <div className="ml-auto">
                  <select
                    value={resourceSort}
                    onChange={(e) => setResourceSort(e.target.value as 'recent' | 'confidence' | 'name')}
                    className="appearance-none bg-white/50 border border-gray-100/60 rounded-lg px-3 py-1.5 text-[11px] font-semibold text-gray-500 hover:bg-white/80 outline-none cursor-pointer"
                  >
                    <option value="recent">Recent</option>
                    <option value="confidence">Confidence</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>
              </div>

              {/* Resource cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
                {sortedResources.map((resource, i) => {
                  const CategoryIcon = resource.categoryIcon
                  const ActionIcon = resource.actionIcon
                  const confColor = getConfidenceColor(resource.confidence)
                  return (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="group rounded-xl border border-gray-100/60 bg-white/50 hover:bg-white/80 p-4 transition-all duration-300 hover:shadow-premium relative overflow-hidden"
                    >
                      <div
                        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `radial-gradient(circle, ${resource.categoryColor}10, transparent 70%)` }}
                      />
                      <div className="relative z-10 space-y-3">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: resource.categoryBg }}
                          >
                            <CategoryIcon className="w-4 h-4" style={{ color: resource.categoryColor }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-[13px] font-semibold text-gray-900 leading-tight truncate">
                              {resource.title}
                            </h3>
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider mt-1"
                              style={{
                                backgroundColor: resource.categoryBg,
                                color: resource.categoryColor,
                                border: `1px solid ${resource.categoryColor}15`,
                              }}
                            >
                              {resource.category}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Confidence</span>
                            <span className="text-[12px] font-bold" style={{ color: confColor }}>{resource.confidence}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: confColor }}
                              initial={{ width: 0 }}
                              animate={{ width: `${resource.confidence}%` }}
                              transition={{ duration: 0.8, delay: 0.4 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-gray-100/60">
                          <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: confColor }} />
                            <span className="text-[11px] text-gray-400 font-medium">{resource.verifiedDate}</span>
                          </div>
                          <button className="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors" style={{ color: resource.categoryColor }}>
                            <ActionIcon className="w-3 h-3" />
                            {resource.action}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {sortedResources.length === 0 && (
                <div className="text-center py-8 relative z-10">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-[13px] text-gray-400 font-medium">No resources match your filters</p>
                  <button onClick={() => { setResourceFilter('all'); setResourceSearch('') }} className="mt-2 text-[12px] font-semibold text-blue-600 hover:text-blue-700">
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </motion.section>

          {/* ═══════════ PROFILE DETAILS CARD ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900/5 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-gray-900">Profile Details</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">Manage your personal information</p>
                  </div>
                </div>
                <AnimatePresence>
                  {saved && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -4 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-100/60 text-[12px] font-semibold text-emerald-700"
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      Saved
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label="Full name" icon={User} value={fullName} onChange={setFullName} placeholder="Your full name" />
                  <FormField label="Email" icon={Mail} value={email} onChange={setEmail} type="email" placeholder="your@email.com" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField label="Phone" icon={Phone} value={phone} onChange={setPhone} type="tel" placeholder="+1 (555) 000-0000" optional />
                  <FormField label="Location / ZIP code" icon={MapPin} value={location} onChange={setLocation} placeholder="e.g. 10001" optional />
                </div>
                <FormField label="Preferred language" icon={Globe} value={language} onChange={setLanguage} placeholder="English" />
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-3 pt-3">
                        <button
                          onClick={handleSave}
                          className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Save changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100/60 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ USAGE ANALYTICS SECTION ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl shadow-premium relative overflow-hidden">
              <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-br from-blue-500/20 via-emerald-500/10 to-violet-500/20 pointer-events-none" style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude', WebkitMaskComposite: 'xor' }} />
              <div className="h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-violet-500" />
              <div className="p-6 sm:p-8 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-gray-900">Your Usage This Month</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">Activity overview for June 2026</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                  <div className="rounded-xl bg-blue-50/40 border border-blue-100/40 p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-blue-600">24</p>
                    <p className="text-[10px] sm:text-[11px] font-medium text-blue-500/70 mt-0.5">Conversations</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50/40 border border-emerald-100/40 p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-600">47</p>
                    <p className="text-[10px] sm:text-[11px] font-medium text-emerald-500/70 mt-0.5">Resources found</p>
                  </div>
                  <div className="rounded-xl bg-violet-50/40 border border-violet-100/40 p-3 sm:p-4 text-center">
                    <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-violet-600">84%</p>
                    <p className="text-[10px] sm:text-[11px] font-medium text-violet-500/70 mt-0.5">Avg confidence</p>
                  </div>
                </div>
                <div className="rounded-xl bg-white/50 border border-gray-100/60 p-4 sm:p-5">
                  <h3 className="text-[13px] font-semibold text-gray-700 mb-4">Most Searched Categories</h3>
                  <div className="space-y-3">
                    {searchCategories.map((cat, i) => (
                      <div key={cat.label} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-medium text-gray-600">{cat.label}</span>
                          <span className="text-[12px] font-bold" style={{ color: cat.color }}>{cat.percent}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.percent}%` }}
                            transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100/60 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-medium">Other categories</span>
                    <span className="text-[11px] font-semibold text-gray-500">22%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ ACTIVITY TIMELINE ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900/5 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-gray-900">Recent Activity</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">Your latest actions on ClearPath AI</p>
                  </div>
                </div>
                <Link href="/history" className="hidden sm:inline-flex items-center gap-1 text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                  View all
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-0">
                {activityTimeline.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="relative"
                    >
                      {i < activityTimeline.length - 1 && (
                        <div className="absolute left-[15px] top-[38px] bottom-0 w-px bg-gradient-to-b from-gray-200/80 to-gray-100/40" />
                      )}
                      <div className="flex items-start gap-4 py-3.5 group">
                        <div
                          className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 mt-0.5 relative z-10"
                          style={{ backgroundColor: item.bgColor }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: item.colorHex }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[14px] font-medium text-gray-800 truncate">{item.text}</p>
                            <span className="text-[11px] text-gray-400 whitespace-nowrap font-medium shrink-0">{item.time}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              <div className="sm:hidden mt-4 pt-4 border-t border-gray-100/60">
                <Link href="/history" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  View all activity
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ CONNECTED ACCOUNTS SECTION ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight text-gray-900">Connected Accounts</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Manage your linked third-party accounts</p>
                </div>
              </div>
              <div className="space-y-3 relative z-10">
                {connectedAccounts.map((account) => {
                  const AccountIcon = account.icon
                  return (
                    <div key={account.id} className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200 border border-gray-100/40">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: account.bgColor }}>
                          <AccountIcon className="w-4 h-4" style={{ color: account.color }} />
                        </div>
                        <div>
                          <h4 className="text-[13px] font-semibold text-gray-900">{account.name}</h4>
                          {account.connected ? (
                            <p className="text-[11px] text-emerald-500 font-medium">Connected as {account.email}</p>
                          ) : (
                            <p className="text-[11px] text-gray-400">Not connected</p>
                          )}
                        </div>
                      </div>
                      {account.connected ? (
                        <button className="px-3.5 py-1.5 text-[11px] font-semibold text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50/60 transition-all">
                          Disconnect
                        </button>
                      ) : (
                        <button className="px-3.5 py-1.5 text-[11px] font-semibold text-white bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all">
                          Connect
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.section>

          {/* ═══════════ SECURITY SETTINGS QUICK ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md shadow-red-500/20">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight text-gray-900">Security Settings</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Protect your account</p>
                </div>
              </div>
              <div className="space-y-1 relative z-10">
                {/* Change password */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.06)' }}>
                      <Key className="w-4 h-4" style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">Change password</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Update your account password</p>
                    </div>
                  </div>
                  <button className="px-3.5 py-1.5 text-[11px] font-semibold text-gray-600 bg-white border border-gray-200/60 rounded-lg hover:bg-gray-50 shadow-sm transition-all">
                    Change
                  </button>
                </div>

                {/* Two-factor auth */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.06)' }}>
                      <Smartphone className="w-4 h-4" style={{ color: '#10b981' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">Two-factor authentication</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={twoFactor} onChange={setTwoFactor} />
                </div>

                {/* Active sessions */}
                <div className="py-4 px-4">
                  <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Active Sessions</h4>
                  <div className="space-y-2">
                    {activeSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg bg-white/40 border border-gray-100/40">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-[12px] font-medium text-gray-700">{session.device}</p>
                            <p className="text-[10px] text-gray-400">{session.location} &middot; {session.time}</p>
                          </div>
                        </div>
                        {session.current ? (
                          <span className="text-[10px] font-bold text-emerald-600 px-2 py-0.5 rounded-md bg-emerald-50/60 border border-emerald-100/40">Current</span>
                        ) : (
                          <button className="text-[10px] font-semibold text-red-500 hover:text-red-600">Revoke</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ DATA & PRIVACY QUICK ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight text-gray-900">Data &amp; Privacy</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Control your data and privacy settings</p>
                </div>
              </div>

              <div className="space-y-1 relative z-10">
                {/* Privacy score */}
                <div className="py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-50/40 to-blue-50/40 border border-emerald-100/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <h4 className="text-[13px] font-semibold text-gray-900">Privacy Score</h4>
                    </div>
                    <span className="text-[20px] font-extrabold text-emerald-600">{privacyScore}%</span>
                  </div>
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${privacyScore}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                  </div>
                  <p className="text-[11px] text-emerald-600/70 mt-2">Your account has strong privacy protection. Enable 2FA to reach 100%.</p>
                </div>

                {/* Export data */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.06)' }}>
                      <Download className="w-4 h-4" style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">Export your data</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Download a copy of all your stored data</p>
                    </div>
                  </div>
                  <button className="px-3.5 py-1.5 text-[11px] font-semibold text-white bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg shadow-sm hover:shadow-md transition-all">
                    Export
                  </button>
                </div>

                {/* Delete account link */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-red-50/30 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50/60">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-red-600">Delete account</h4>
                      <p className="text-[11px] text-red-400 mt-0.5">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-red-300" />
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ REFERRAL SECTION ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15), transparent 70%)' }}
              />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight text-gray-900">Invite a Friend</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Share ClearPath AI with people who need it</p>
                </div>
              </div>

              {/* Referral link */}
              <div className="rounded-xl bg-white/50 border border-gray-100/60 p-4 mb-5 relative z-10">
                <p className="text-[12px] text-gray-500 font-medium mb-2">Your referral link</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2.5 rounded-lg bg-gray-50/80 border border-gray-100/60 text-[12px] text-gray-600 font-mono truncate">
                    clearpath-ai.org/ref/ALEX2026
                  </div>
                  <button
                    onClick={handleCopyReferral}
                    className={`inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all ${
                      referralCopied
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/60'
                        : 'bg-white border border-gray-200/60 text-gray-600 hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {referralCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {/* Referral stats */}
              <div className="grid grid-cols-3 gap-3 relative z-10">
                <div className="rounded-xl bg-blue-50/40 border border-blue-100/40 p-3 text-center">
                  <p className="text-xl font-extrabold text-blue-600">3</p>
                  <p className="text-[10px] font-medium text-blue-500/70">Invites sent</p>
                </div>
                <div className="rounded-xl bg-emerald-50/40 border border-emerald-100/40 p-3 text-center">
                  <p className="text-xl font-extrabold text-emerald-600">1</p>
                  <p className="text-[10px] font-medium text-emerald-500/70">Successful</p>
                </div>
                <div className="rounded-xl bg-amber-50/40 border border-amber-100/40 p-3 text-center">
                  <p className="text-xl font-extrabold text-amber-600">1</p>
                  <p className="text-[10px] font-medium text-amber-500/70">Pending</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ EXPANDED NOTIFICATION TOGGLES ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              <div
                className="absolute -top-16 -left-16 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)' }}
              />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-gray-900">Notification Settings</h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">Manage how you stay informed</p>
                  </div>
                </div>
                <Link href="/settings" className="hidden sm:inline-flex items-center gap-1 text-[12px] font-semibold text-gray-400 hover:text-gray-700 transition-colors">
                  View all
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-1 relative z-10">
                {/* Email notifications */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.06)' }}>
                      <Mail className="w-4 h-4" style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">Email notifications</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Receive important updates via email</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={emailNotifs} onChange={setEmailNotifs} />
                </div>

                {/* SMS notifications */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.06)' }}>
                      <Smartphone className="w-4 h-4" style={{ color: '#10b981' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">SMS notifications</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Get text alerts for critical updates</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={smsNotifs} onChange={setSmsNotifs} />
                </div>

                {/* Browser push */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.06)' }}>
                      <Monitor className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">Browser push notifications</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Receive desktop push notifications</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={browserPush} onChange={setBrowserPush} />
                </div>

                {/* Resource updates */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.06)' }}>
                      <Bookmark className="w-4 h-4" style={{ color: '#10b981' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">Resource updates</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Get notified when saved resources change</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={resourceUpdates} onChange={setResourceUpdates} />
                </div>

                {/* Weekly digest customization */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(245,158,11,0.06)' }}>
                      <Volume2 className="w-4 h-4" style={{ color: '#f59e0b' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">Weekly digest customization</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Customize what appears in your weekly email</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={weeklyDigestCustom} onChange={setWeeklyDigestCustom} />
                </div>

                {/* New features */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.06)' }}>
                      <Sparkles className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">New features</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Be the first to know about improvements</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={newFeatures} onChange={setNewFeatures} />
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ ACCESSIBILITY QUICK SETTINGS ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.44, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
                  <Type className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight text-gray-900">Accessibility</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Customize your display experience</p>
                </div>
              </div>

              <div className="space-y-1 relative z-10">
                {/* Font size */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.06)' }}>
                      <Type className="w-4 h-4" style={{ color: '#3b82f6' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">Font size</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Adjust text size throughout the app</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                    {(['normal', 'large', 'xl'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                          fontSize === size
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* High contrast */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.06)' }}>
                      <Eye className="w-4 h-4" style={{ color: '#10b981' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">High contrast</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Increase color contrast for better visibility</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={highContrast} onChange={setHighContrast} />
                </div>

                {/* Reduced motion */}
                <div className="flex items-center justify-between gap-4 py-4 px-4 rounded-xl hover:bg-white/40 transition-colors duration-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.06)' }}>
                      <Zap className="w-4 h-4" style={{ color: '#8b5cf6' }} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-semibold text-gray-900">Reduced motion</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">Minimize animations and transitions</p>
                    </div>
                  </div>
                  <ToggleSwitch checked={reducedMotion} onChange={setReducedMotion} />
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ ACCOUNT DELETION SECTION ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="rounded-2xl border-2 border-red-200/60 bg-red-50/20 p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 to-transparent pointer-events-none" />

              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold tracking-tight text-red-700">Danger Zone</h2>
                  <p className="text-[12px] text-red-400 mt-0.5">Irreversible and destructive actions</p>
                </div>
              </div>

              <div className="rounded-xl border border-red-200/60 bg-white/40 p-5 relative z-10">
                <h3 className="text-[14px] font-semibold text-red-700 mb-2">Delete your account</h3>
                <p className="text-[12px] text-red-500/70 mb-4 leading-relaxed">
                  This will permanently delete your account, all conversations, saved resources, and personal data.
                  This action <span className="font-bold">cannot be undone</span>.
                </p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all active:scale-[0.97]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete my account
                  </button>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    <div className="rounded-xl border border-red-200/60 bg-red-50/50 p-4">
                      <p className="text-[12px] text-red-600 font-medium mb-3">
                        Please type <span className="font-bold font-mono">DELETE</span> to confirm:
                      </p>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="w-full px-4 py-2.5 rounded-xl text-[13px] text-red-700 bg-white border border-red-200/60 outline-none placeholder:text-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-500/10"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        disabled={deleteConfirmText !== 'DELETE'}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-red-500 to-red-600 shadow-md shadow-red-500/20 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Permanently delete
                      </button>
                      <button
                        onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100/60 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>

        </div>
      </main>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="mt-auto border-t border-gray-100/60 bg-white/40 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
