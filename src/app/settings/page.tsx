'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Settings,
  Shield,
  Bell,
  Eye,
  Database,
  Globe,
  Lock,
  Trash2,
  Download,
  Trash,
  Sun,
  Moon,
  MapPin,
  Sliders,
  ChevronRight,
  Layers,
  User,
  Check,
  Key,
  Smartphone,
  Monitor,
  Palette,
  Type,
  Zap,
  Code,
  Webhook,
  Bug,
  Clock,
  Wifi,
  Cookie,
  FileJson,
  FileText,
  FileDown,
  HardDrive,
  Volume2,
  RefreshCw,
  AlignLeft,
  AlignJustify,
  ArrowLeftRight,
  Timer,
  Mail,
  BadgeCheck,
  HelpCircle,
  Loader2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useAuth } from '@/hooks/use-auth'

// ─── TYPES ──────────────────────────────────────────────
type SectionKey = 'general' | 'privacy' | 'notifications' | 'accessibility' | 'appearance' | 'account' | 'data' | 'advanced'

interface SettingsSection {
  key: SectionKey
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

// ─── SECTIONS CONFIG ────────────────────────────────────
const sections: SettingsSection[] = [
  { key: 'general', label: 'General', icon: Settings, description: 'Language, theme, location, and confidence preferences' },
  { key: 'privacy', label: 'Privacy & Security', icon: Shield, description: 'Data retention, crisis detection, and usage sharing' },
  { key: 'account', label: 'Account', icon: User, description: 'Email, password, 2FA, and connected accounts' },
  { key: 'notifications', label: 'Notifications', icon: Bell, description: 'Email, resource updates, and weekly summary' },
  { key: 'accessibility', label: 'Accessibility', icon: Eye, description: 'Display, motion, and screen reader options' },
  { key: 'appearance', label: 'Appearance', icon: Palette, description: 'Font size, density, sidebar, and animations' },
  { key: 'data', label: 'Data & Storage', icon: Database, description: 'Storage info, export, and cache management' },
  { key: 'advanced', label: 'Advanced', icon: Code, description: 'Developer mode, API keys, and debug logging' },
]

// ─── ANIMATION VARIANTS ─────────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const contentVariants = {
  enter: { opacity: 0, x: 12 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] } },
  exit: { opacity: 0, x: -12, transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] } },
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
          pointer-events-none inline-block h-5.5 w-5.5 rounded-full bg-white shadow-md
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

// ─── SETTING ROW COMPONENT ──────────────────────────────
function SettingRow({
  icon: Icon,
  iconColor = '#3b82f6',
  iconBg = 'rgba(59,130,246,0.06)',
  title,
  description,
  children,
  locked = false,
  lockedLabel,
}: {
  icon: React.ComponentType<{ className?: string }>
  iconColor?: string
  iconBg?: string
  title: string
  description: string
  children: React.ReactNode
  locked?: boolean
  lockedLabel?: string
}) {
  return (
    <motion.div
      variants={staggerItem}
      className="flex items-start sm:items-center justify-between gap-4 py-4 px-5 rounded-xl hover:bg-white/40 transition-colors duration-200 group"
    >
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="w-[18px] h-[18px]" style={{ color: iconColor }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-[14px] font-semibold text-gray-900">{title}</h4>
            {locked && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                <Lock className="w-2.5 h-2.5" />
                {lockedLabel || 'Always on'}
              </span>
            )}
          </div>
          <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="shrink-0 mt-1 sm:mt-0">{children}</div>
    </motion.div>
  )
}

// ─── SKELETON COMPONENT ──────────────────────────────────
function SettingsSkeleton() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-7 w-36 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-[220px] shrink-0">
              <div className="glass-card rounded-2xl p-3 shadow-premium space-y-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 glass-card rounded-2xl shadow-premium p-6 space-y-4">
              <div className="flex items-center gap-3 pb-5 border-b border-gray-100/60">
                <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-56 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-4 px-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="w-12 h-7 bg-gray-200 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ─── MAIN SETTINGS PAGE ────────────────────────────────
export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const [activeSection, setActiveSection] = useState<SectionKey>('general')
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSaved, setPasswordSaved] = useState(false)

  // General state
  const [language, setLanguage] = useState('English')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [zipCode, setZipCode] = useState('')
  const [confidenceThreshold, setConfidenceThreshold] = useState(70)
  const [defaultCategory, setDefaultCategory] = useState('All')
  const [autoClarification, setAutoClarification] = useState(true)
  const [distanceUnit, setDistanceUnit] = useState<'miles' | 'km'>('miles')
  const [notificationSound, setNotificationSound] = useState(true)

  // Privacy state
  const [dataRetention, setDataRetention] = useState(true)
  const [shareUsage, setShareUsage] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState('30')
  const [ipMasking, setIpMasking] = useState(false)
  const [doNotTrack, setDoNotTrack] = useState(false)
  const [blockThirdPartyCookies, setBlockThirdPartyCookies] = useState(true)

  // Account state
  const [twoFactor, setTwoFactor] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)

  // Notifications state
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [resourceUpdates, setResourceUpdates] = useState(true)
  const [newFeatures, setNewFeatures] = useState(false)
  const [weeklySummary, setWeeklySummary] = useState(false)

  // Accessibility state
  const [largeText, setLargeText] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Appearance state
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal')
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable')
  const [sidebarPosition, setSidebarPosition] = useState<'left' | 'right'>('left')
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal')

  // Data state
  const [autoDelete, setAutoDelete] = useState<'never' | '30' | '90'>('never')
  const [downloadFormat, setDownloadFormat] = useState<'json' | 'csv' | 'pdf'>('json')

  // Advanced state
  const [developerMode, setDeveloperMode] = useState(false)
  const [debugLogging, setDebugLogging] = useState(false)

  // ─── Fetch settings on mount ──────────────────────────
  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user?.id) {
      router.push('/login')
      return
    }
    const fetchSettings = async () => {
      try {
        const res = await fetch(`/api/user/settings?userId=${user.id}`)
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setLanguage(data.language ?? 'English')
            setTheme((data.theme as 'light' | 'dark') ?? 'light')
            setZipCode(data.zipCode ?? '')
            setConfidenceThreshold(data.confidenceThreshold ?? 70)
            setDefaultCategory(data.defaultCategory ?? 'All')
            setAutoClarification(data.autoClarification ?? true)
            setDistanceUnit((data.distanceUnit as 'miles' | 'km') ?? 'miles')
            setNotificationSound(data.notificationSound ?? true)
            setDataRetention(data.dataRetention ?? true)
            setShareUsage(data.shareUsage ?? false)
            setSessionTimeout(data.sessionTimeout ?? '30')
            setIpMasking(data.ipMasking ?? false)
            setDoNotTrack(data.doNotTrack ?? false)
            setBlockThirdPartyCookies(data.blockThirdPartyCookies ?? true)
            setTwoFactor(data.twoFactor ?? false)
            setEmailNotifs(data.emailNotifs ?? true)
            setResourceUpdates(data.resourceUpdates ?? true)
            setNewFeatures(data.newFeatures ?? false)
            setWeeklySummary(data.weeklySummary ?? false)
            setLargeText(data.largeText ?? false)
            setHighContrast(data.highContrast ?? false)
            setScreenReader(data.screenReader ?? false)
            setReducedMotion(data.reducedMotion ?? false)
            setFontSize((data.fontSize as 'normal' | 'large' | 'xl') ?? 'normal')
            setDensity((data.density as 'compact' | 'comfortable' | 'spacious') ?? 'comfortable')
            setSidebarPosition((data.sidebarPosition as 'left' | 'right') ?? 'left')
            setAnimationSpeed((data.animationSpeed as 'slow' | 'normal' | 'fast') ?? 'normal')
            setAutoDelete((data.autoDelete as 'never' | '30' | '90') ?? 'never')
            setDownloadFormat((data.downloadFormat as 'json' | 'csv' | 'pdf') ?? 'json')
            setDeveloperMode(data.developerMode ?? false)
            setDebugLogging(data.debugLogging ?? false)
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err)
      } finally {
        setSettingsLoading(false)
      }
    }
    fetchSettings()
  }, [authLoading, isAuthenticated, user?.id, router])

  // ─── Persist settings changes ─────────────────────────
  const persistSetting = useCallback(async (updates: Record<string, unknown>) => {
    if (!user?.id) return
    setSaving(true)
    try {
      const res = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...updates }),
      })
      if (res.ok) {
        setLastSaved(true)
        setTimeout(() => setLastSaved(false), 2000)
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setSaving(false)
    }
  }, [user?.id])

  const debouncedPersist = useCallback((updates: Record<string, unknown>) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => persistSetting(updates), 500)
  }, [persistSetting])

  // Wrapped setters that also persist
  const updateLanguage = useCallback((v: string) => { setLanguage(v); debouncedPersist({ language: v }) }, [debouncedPersist])
  const updateTheme = useCallback((v: 'light' | 'dark') => { setTheme(v); debouncedPersist({ theme: v }) }, [debouncedPersist])
  const updateZipCode = useCallback((v: string) => { setZipCode(v); debouncedPersist({ zipCode: v }) }, [debouncedPersist])
  const updateConfidenceThreshold = useCallback((v: number) => { setConfidenceThreshold(v); debouncedPersist({ confidenceThreshold: v }) }, [debouncedPersist])
  const updateDefaultCategory = useCallback((v: string) => { setDefaultCategory(v); debouncedPersist({ defaultCategory: v }) }, [debouncedPersist])
  const updateAutoClarification = useCallback((v: boolean) => { setAutoClarification(v); persistSetting({ autoClarification: v }) }, [persistSetting])
  const updateDistanceUnit = useCallback((v: 'miles' | 'km') => { setDistanceUnit(v); debouncedPersist({ distanceUnit: v }) }, [debouncedPersist])
  const updateNotificationSound = useCallback((v: boolean) => { setNotificationSound(v); persistSetting({ notificationSound: v }) }, [persistSetting])
  const updateDataRetention = useCallback((v: boolean) => { setDataRetention(v); persistSetting({ dataRetention: v }) }, [persistSetting])
  const updateShareUsage = useCallback((v: boolean) => { setShareUsage(v); persistSetting({ shareUsage: v }) }, [persistSetting])
  const updateSessionTimeout = useCallback((v: string) => { setSessionTimeout(v); debouncedPersist({ sessionTimeout: v }) }, [debouncedPersist])
  const updateIpMasking = useCallback((v: boolean) => { setIpMasking(v); persistSetting({ ipMasking: v }) }, [persistSetting])
  const updateDoNotTrack = useCallback((v: boolean) => { setDoNotTrack(v); persistSetting({ doNotTrack: v }) }, [persistSetting])
  const updateBlockThirdPartyCookies = useCallback((v: boolean) => { setBlockThirdPartyCookies(v); persistSetting({ blockThirdPartyCookies: v }) }, [persistSetting])
  const updateTwoFactor = useCallback((v: boolean) => { setTwoFactor(v); persistSetting({ twoFactor: v }) }, [persistSetting])
  const updateEmailNotifs = useCallback((v: boolean) => { setEmailNotifs(v); persistSetting({ emailNotifs: v }) }, [persistSetting])
  const updateResourceUpdates = useCallback((v: boolean) => { setResourceUpdates(v); persistSetting({ resourceUpdates: v }) }, [persistSetting])
  const updateNewFeatures = useCallback((v: boolean) => { setNewFeatures(v); persistSetting({ newFeatures: v }) }, [persistSetting])
  const updateWeeklySummary = useCallback((v: boolean) => { setWeeklySummary(v); persistSetting({ weeklySummary: v }) }, [persistSetting])
  const updateLargeText = useCallback((v: boolean) => { setLargeText(v); persistSetting({ largeText: v }) }, [persistSetting])
  const updateHighContrast = useCallback((v: boolean) => { setHighContrast(v); persistSetting({ highContrast: v }) }, [persistSetting])
  const updateScreenReader = useCallback((v: boolean) => { setScreenReader(v); persistSetting({ screenReader: v }) }, [persistSetting])
  const updateReducedMotion = useCallback((v: boolean) => { setReducedMotion(v); persistSetting({ reducedMotion: v }) }, [persistSetting])
  const updateFontSize = useCallback((v: 'normal' | 'large' | 'xl') => { setFontSize(v); debouncedPersist({ fontSize: v }) }, [debouncedPersist])
  const updateDensity = useCallback((v: 'compact' | 'comfortable' | 'spacious') => { setDensity(v); debouncedPersist({ density: v }) }, [debouncedPersist])
  const updateSidebarPosition = useCallback((v: 'left' | 'right') => { setSidebarPosition(v); debouncedPersist({ sidebarPosition: v }) }, [debouncedPersist])
  const updateAnimationSpeed = useCallback((v: 'slow' | 'normal' | 'fast') => { setAnimationSpeed(v); debouncedPersist({ animationSpeed: v }) }, [debouncedPersist])
  const updateAutoDelete = useCallback((v: 'never' | '30' | '90') => { setAutoDelete(v); debouncedPersist({ autoDelete: v }) }, [debouncedPersist])
  const updateDownloadFormat = useCallback((v: 'json' | 'csv' | 'pdf') => { setDownloadFormat(v); debouncedPersist({ downloadFormat: v }) }, [debouncedPersist])
  const updateDeveloperMode = useCallback((v: boolean) => { setDeveloperMode(v); persistSetting({ developerMode: v }) }, [persistSetting])
  const updateDebugLogging = useCallback((v: boolean) => { setDebugLogging(v); persistSetting({ debugLogging: v }) }, [persistSetting])

  // Show skeleton while loading
  if (authLoading || settingsLoading) return <SettingsSkeleton />
  if (!isAuthenticated) return null

  const getConfidenceLabel = (val: number): string => {
    if (val <= 50) return 'Low'
    if (val <= 70) return 'Medium'
    return 'High'
  }

  const getConfidencePercent = (val: number): string => {
    if (val <= 50) return '50%'
    if (val <= 70) return '70%'
    return '90%'
  }

  const confidenceColor = confidenceThreshold <= 50
    ? '#f59e0b'
    : confidenceThreshold <= 70
      ? '#3b82f6'
      : '#10b981'

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══════════ HEADER ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="pt-8 pb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md shadow-gray-900/15">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                  Settings
                </h1>
                <p className="text-[14px] text-gray-500 mt-0.5">
                  Manage your preferences and privacy controls
                  {saving && (
                    <span className="inline-flex items-center gap-1.5 ml-3 text-[12px] text-blue-500">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Saving...
                    </span>
                  )}
                  {lastSaved && !saving && (
                    <span className="inline-flex items-center gap-1.5 ml-3 text-[12px] text-emerald-600">
                      <Check className="w-3 h-3" />
                      Saved
                    </span>
                  )}
                </p>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ LAYOUT: SIDEBAR + CONTENT ═══════════ */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* ──── LEFT SIDEBAR ──── */}
            <motion.div variants={staggerItem} className="md:w-[220px] shrink-0">
              <nav className="glass-card rounded-2xl p-3 shadow-premium">
                <div className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isActive = activeSection === section.key
                    return (
                      <button
                        key={section.key}
                        onClick={() => setActiveSection(section.key)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                          transition-all duration-200 group
                          ${isActive
                            ? 'bg-gradient-to-b from-blue-50 to-blue-50/60 shadow-sm shadow-blue-500/5'
                            : 'hover:bg-gray-50/80'
                          }
                        `}
                      >
                        <div
                          className={`
                            w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                            ${isActive
                              ? 'bg-gradient-to-b from-blue-500 to-blue-600 shadow-md shadow-blue-500/20'
                              : 'bg-gray-100 group-hover:bg-gray-200/60'
                            }
                          `}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                        </div>
                        <span
                          className={`text-[13px] font-semibold transition-colors duration-200 ${
                            isActive ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                          }`}
                        >
                          {section.label}
                        </span>
                        {isActive && (
                          <ChevronRight className="w-3.5 h-3.5 text-blue-500 ml-auto shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* User info at bottom */}
                <div className="mt-4 pt-4 border-t border-gray-100/60">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50/80 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200/60 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="text-[13px] font-semibold text-gray-600 group-hover:text-gray-900">
                      Back to Dashboard
                    </span>
                  </Link>
                </div>
              </nav>
            </motion.div>

            {/* ──── RIGHT CONTENT AREA ──── */}
            <motion.div variants={staggerItem} className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  variants={contentVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="glass-card rounded-2xl shadow-premium overflow-hidden"
                >
                  {/* Section header */}
                  <div className="px-6 py-5 border-b border-gray-100/60 bg-gradient-to-r from-white/60 to-transparent">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const section = sections.find((s) => s.key === activeSection)!
                        const SectionIcon = section.icon
                        return (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-blue-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                              <SectionIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h2 className="text-[17px] font-bold tracking-tight text-gray-900">
                                {section.label}
                              </h2>
                              <p className="text-[13px] text-gray-500 mt-0.5">
                                {section.description}
                              </p>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Section content */}
                  <div className="p-2">
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer}
                    >

                      {/* ══════════ GENERAL SECTION ══════════ */}
                      {activeSection === 'general' && (
                        <>
                          {/* Language */}
                          <SettingRow
                            icon={Globe}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Language"
                            description="Choose your preferred language for the interface"
                          >
                            <select
                              value={language}
                              onChange={(e) => updateLanguage(e.target.value)}
                              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 text-[13px] font-medium text-gray-900 pr-9 shadow-sm hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 10px center',
                              }}
                            >
                              <option>English</option>
                              <option>Spanish</option>
                              <option>French</option>
                              <option>Arabic</option>
                            </select>
                          </SettingRow>

                          {/* Theme */}
                          <SettingRow
                            icon={theme === 'light' ? Sun : Moon}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Theme"
                            description="Switch between light and dark mode"
                          >
                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                              <button
                                onClick={() => updateTheme('light')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                                  theme === 'light'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                <Sun className="w-3.5 h-3.5" />
                                Light
                              </button>
                              <button
                                onClick={() => updateTheme('dark')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all relative ${
                                  theme === 'dark'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                <Moon className="w-3.5 h-3.5" />
                                Dark
                                {theme === 'dark' && (
                                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100/60">
                                    Soon
                                  </span>
                                )}
                              </button>
                            </div>
                          </SettingRow>

                          {/* Default Category */}
                          <SettingRow
                            icon={Layers}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="Default category preference"
                            description="Pre-select a category when starting new conversations"
                          >
                            <select
                              value={defaultCategory}
                              onChange={(e) => updateDefaultCategory(e.target.value)}
                              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 text-[13px] font-medium text-gray-900 pr-9 shadow-sm hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 10px center',
                              }}
                            >
                              <option>All</option>
                              <option>Housing</option>
                              <option>Food</option>
                              <option>Mental Health</option>
                              <option>Legal</option>
                              <option>Employment</option>
                            </select>
                          </SettingRow>

                          {/* Auto-clarification */}
                          <SettingRow
                            icon={HelpCircle}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Auto-clarification"
                            description="Automatically ask follow-up questions when confidence is below threshold"
                          >
                            <ToggleSwitch checked={autoClarification} onChange={updateAutoClarification} />
                          </SettingRow>

                          {/* Default Location */}
                          <SettingRow
                            icon={MapPin}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Default location"
                            description="Set a default ZIP code for more accurate local resource recommendations"
                          >
                            <input
                              type="text"
                              value={zipCode}
                              onChange={(e) => updateZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                              placeholder="e.g. 10001"
                              maxLength={5}
                              className="w-28 bg-white border border-gray-200 rounded-xl px-4 py-2 text-[13px] font-medium text-gray-900 placeholder:text-gray-400 shadow-sm hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                            />
                          </SettingRow>

                          {/* Distance Unit */}
                          <SettingRow
                            icon={MapPin}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Resource distance unit"
                            description="Choose miles or kilometers for displaying resource distances"
                          >
                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                              <button
                                onClick={() => updateDistanceUnit('miles')}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                                  distanceUnit === 'miles' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                Miles
                              </button>
                              <button
                                onClick={() => updateDistanceUnit('km')}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                                  distanceUnit === 'km' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                km
                              </button>
                            </div>
                          </SettingRow>

                          {/* Notification Sound */}
                          <SettingRow
                            icon={Volume2}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Notification sound"
                            description="Play a sound when new notifications arrive"
                          >
                            <ToggleSwitch checked={notificationSound} onChange={updateNotificationSound} />
                          </SettingRow>

                          {/* Confidence Threshold */}
                          <SettingRow
                            icon={Sliders}
                            iconColor={confidenceColor}
                            iconBg={`${confidenceColor}10`}
                            title="Confidence threshold"
                            description="Minimum confidence level required before displaying resource results"
                          >
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateConfidenceThreshold(50)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                    confidenceThreshold <= 50
                                      ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  Low
                                </button>
                                <button
                                  onClick={() => updateConfidenceThreshold(70)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                    confidenceThreshold > 50 && confidenceThreshold <= 70
                                      ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  Medium
                                </button>
                                <button
                                  onClick={() => updateConfidenceThreshold(90)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                    confidenceThreshold > 70
                                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  High
                                </button>
                              </div>
                              <span className="text-[12px] font-bold" style={{ color: confidenceColor }}>
                                {getConfidencePercent(confidenceThreshold)} threshold
                              </span>
                            </div>
                          </SettingRow>

                          {/* Confidence slider visual */}
                          <motion.div variants={staggerItem} className="px-5 py-3">
                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div
                                className="absolute inset-y-0 left-0 rounded-full"
                                style={{ backgroundColor: confidenceColor }}
                                initial={{ width: '70%' }}
                                animate={{
                                  width: `${confidenceThreshold}%`,
                                  backgroundColor: confidenceColor,
                                }}
                                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                              />
                            </div>
                            <div className="flex justify-between mt-1.5">
                              <span className="text-[10px] font-medium text-gray-400">50% Low</span>
                              <span className="text-[10px] font-medium text-gray-400">70% Medium</span>
                              <span className="text-[10px] font-medium text-gray-400">90% High</span>
                            </div>
                          </motion.div>
                        </>
                      )}

                      {/* ══════════ PRIVACY & SECURITY SECTION ══════════ */}
                      {activeSection === 'privacy' && (
                        <>
                          <SettingRow
                            icon={Lock}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Don't store any conversation data"
                            description="When enabled, your conversations are never stored on our servers. This is on by default to protect your privacy."
                          >
                            <ToggleSwitch checked={dataRetention} onChange={updateDataRetention} />
                          </SettingRow>

                          <SettingRow
                            icon={Shield}
                            iconColor="#ef4444"
                            iconBg="rgba(239,68,68,0.06)"
                            title="Crisis detection always active"
                            description="Our crisis detection system runs on every message to ensure your safety. This cannot be disabled."
                            locked
                            lockedLabel="Always on"
                          >
                            <ToggleSwitch checked={true} onChange={() => {}} disabled />
                          </SettingRow>

                          <SettingRow
                            icon={Layers}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="Share usage data for improvement"
                            description="Help us improve ClearPath AI by sharing anonymized usage patterns. No personal data is ever shared."
                          >
                            <ToggleSwitch checked={shareUsage} onChange={updateShareUsage} />
                          </SettingRow>

                          {/* Session Timeout */}
                          <SettingRow
                            icon={Timer}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Session timeout"
                            description="Automatically log out after a period of inactivity"
                          >
                            <select
                              value={sessionTimeout}
                              onChange={(e) => updateSessionTimeout(e.target.value)}
                              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 text-[13px] font-medium text-gray-900 pr-9 shadow-sm hover:border-gray-300 focus:outline-none transition-all cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 10px center',
                              }}
                            >
                              <option value="15">15 minutes</option>
                              <option value="30">30 minutes</option>
                              <option value="60">1 hour</option>
                              <option value="never">Never</option>
                            </select>
                          </SettingRow>

                          {/* IP Masking */}
                          <SettingRow
                            icon={Wifi}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="IP masking"
                            description="Mask your IP address from analytics and logging systems"
                          >
                            <ToggleSwitch checked={ipMasking} onChange={updateIpMasking} />
                          </SettingRow>

                          {/* Do Not Track */}
                          <SettingRow
                            icon={Eye}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Do-not-track header"
                            description="Send DNT headers to all third-party services and analytics"
                          >
                            <ToggleSwitch checked={doNotTrack} onChange={updateDoNotTrack} />
                          </SettingRow>

                          {/* Block Third-Party Cookies */}
                          <SettingRow
                            icon={Cookie}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Block third-party cookies"
                            description="Prevent third-party services from setting tracking cookies in your browser"
                          >
                            <ToggleSwitch checked={blockThirdPartyCookies} onChange={updateBlockThirdPartyCookies} />
                          </SettingRow>

                          {/* Delete All Data */}
                          <motion.div variants={staggerItem} className="px-5 py-4">
                            <div className="rounded-xl border border-red-100/60 bg-red-50/30 p-5">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                    <Trash2 className="w-[18px] h-[18px] text-red-500" />
                                  </div>
                                  <div>
                                    <h4 className="text-[14px] font-semibold text-red-700">Delete all data</h4>
                                    <p className="text-[13px] text-red-500/70 mt-0.5 leading-relaxed">
                                      Permanently remove all your data from our servers. This action cannot be undone.
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => setShowDeleteConfirm(true)}
                                  className="shrink-0 px-4 py-2 text-[12px] font-bold text-white rounded-xl bg-gradient-to-b from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all active:scale-[0.97]"
                                >
                                  Delete all
                                </button>
                              </div>
                              <AnimatePresence>
                                {showDeleteConfirm && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mt-4 pt-4 border-t border-red-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                      <p className="text-[13px] font-medium text-red-600">
                                        Are you sure? This cannot be undone.
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => setShowDeleteConfirm(false)}
                                          className="px-3.5 py-1.5 text-[12px] font-semibold text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => setShowDeleteConfirm(false)}
                                          className="px-3.5 py-1.5 text-[12px] font-bold text-white rounded-lg bg-red-500 hover:bg-red-600 shadow-sm transition-all active:scale-[0.97]"
                                        >
                                          Confirm delete
                                        </button>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </motion.div>
                        </>
                      )}

                      {/* ══════════ ACCOUNT SECTION ══════════ */}
                      {activeSection === 'account' && (
                        <>
                          <SettingRow
                            icon={Mail}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Change email"
                            description="Update the email address associated with your account"
                          >
                            <button className="px-4 py-2 text-[12px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all">
                              Change
                            </button>
                          </SettingRow>

                          <SettingRow
                            icon={Key}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Change password"
                            description="Update your account password. We recommend using a strong, unique password."
                          >
                            <button
                              onClick={() => setShowPasswordChange(!showPasswordChange)}
                              className="px-4 py-2 text-[12px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all"
                            >
                              Change
                            </button>
                          </SettingRow>

                          {/* Password change form */}
                          <AnimatePresence>
                            {showPasswordChange && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden px-5"
                              >
                                <div className="py-4 space-y-3 rounded-xl bg-white/40 p-4 mb-2">
                                  {passwordSaved ? (
                                    <div className="flex items-center gap-3 py-3">
                                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-emerald-600" />
                                      </div>
                                      <p className="text-[13px] font-semibold text-emerald-700">Password updated successfully!</p>
                                    </div>
                                  ) : (
                                    <>
                                      <div>
                                        <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Current password</label>
                                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="w-full px-4 py-2.5 rounded-xl text-[13px] bg-white border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                                      </div>
                                      <div>
                                        <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">New password</label>
                                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full px-4 py-2.5 rounded-xl text-[13px] bg-white border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                                      </div>
                                      <div>
                                        <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Confirm new password</label>
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="w-full px-4 py-2.5 rounded-xl text-[13px] bg-white border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all" />
                                      </div>
                                      <div className="flex items-center gap-2 pt-2">
                                        <button
                                          onClick={async () => {
                                            if (!user?.id || !newPassword || newPassword !== confirmPassword) return
                                            setPasswordSaving(true)
                                            try {
                                              const res = await fetch('/api/user/profile', {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ userId: user.id, currentPassword, newPassword }),
                                              })
                                              if (res.ok) {
                                                setPasswordSaved(true)
                                                setCurrentPassword('')
                                                setNewPassword('')
                                                setConfirmPassword('')
                                                setTimeout(() => {
                                                  setPasswordSaved(false)
                                                  setShowPasswordChange(false)
                                                }, 2000)
                                              }
                                            } catch (err) {
                                              console.error('Failed to update password:', err)
                                            } finally {
                                              setPasswordSaving(false)
                                            }
                                          }}
                                          disabled={passwordSaving || !newPassword || newPassword !== confirmPassword}
                                          className="px-4 py-2 text-[12px] font-semibold text-white bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                          {passwordSaving ? 'Updating...' : 'Update password'}
                                        </button>
                                        <button onClick={() => { setShowPasswordChange(false); setCurrentPassword(''); setNewPassword(''); setConfirmPassword('') }} className="px-4 py-2 text-[12px] font-semibold text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100/60 transition-all">
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <SettingRow
                            icon={Smartphone}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="Two-factor authentication"
                            description="Add an extra layer of security by requiring a code from your authenticator app"
                          >
                            <ToggleSwitch checked={twoFactor} onChange={updateTwoFactor} />
                          </SettingRow>

                          <SettingRow
                            icon={Monitor}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Active sessions"
                            description="Manage devices currently signed in to your account"
                          >
                            <button className="px-4 py-2 text-[12px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all">
                              Manage
                            </button>
                          </SettingRow>

                          <SettingRow
                            icon={Globe}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Connected accounts"
                            description="Manage Google, GitHub, and other third-party account connections"
                          >
                            <Link href="/profile" className="px-4 py-2 text-[12px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all">
                              View
                            </Link>
                          </SettingRow>
                        </>
                      )}

                      {/* ══════════ NOTIFICATIONS SECTION ══════════ */}
                      {activeSection === 'notifications' && (
                        <>
                          <SettingRow
                            icon={Bell}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Email notifications"
                            description="Receive important updates and alerts via email"
                          >
                            <ToggleSwitch checked={emailNotifs} onChange={updateEmailNotifs} />
                          </SettingRow>

                          <SettingRow
                            icon={Layers}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Resource updates"
                            description="Get notified when saved resources have changes or new information"
                          >
                            <ToggleSwitch checked={resourceUpdates} onChange={updateResourceUpdates} />
                          </SettingRow>

                          <SettingRow
                            icon={Globe}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="New features"
                            description="Be the first to know about new features and improvements to ClearPath AI"
                          >
                            <ToggleSwitch checked={newFeatures} onChange={updateNewFeatures} />
                          </SettingRow>

                          <SettingRow
                            icon={Settings}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Weekly summary"
                            description="Receive a weekly digest of your activity and helpful resources"
                          >
                            <ToggleSwitch checked={weeklySummary} onChange={updateWeeklySummary} />
                          </SettingRow>
                        </>
                      )}

                      {/* ══════════ ACCESSIBILITY SECTION ══════════ */}
                      {activeSection === 'accessibility' && (
                        <>
                          <SettingRow
                            icon={Eye}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Large text"
                            description="Increase text size throughout the interface for better readability"
                          >
                            <ToggleSwitch checked={largeText} onChange={updateLargeText} />
                          </SettingRow>

                          <SettingRow
                            icon={Sun}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="High contrast mode"
                            description="Increase color contrast for better visual distinction between elements"
                          >
                            <ToggleSwitch checked={highContrast} onChange={updateHighContrast} />
                          </SettingRow>

                          <SettingRow
                            icon={User}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Screen reader optimization"
                            description="Enhance the interface for screen readers with additional ARIA labels and descriptions"
                          >
                            <ToggleSwitch checked={screenReader} onChange={updateScreenReader} />
                          </SettingRow>

                          <SettingRow
                            icon={Layers}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="Reduced motion"
                            description="Minimize animations and transitions throughout the interface"
                          >
                            <ToggleSwitch checked={reducedMotion} onChange={updateReducedMotion} />
                          </SettingRow>
                        </>
                      )}

                      {/* ══════════ APPEARANCE SECTION ══════════ */}
                      {activeSection === 'appearance' && (
                        <>
                          {/* Font Size */}
                          <SettingRow
                            icon={Type}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Font size"
                            description="Adjust the base font size throughout the application"
                          >
                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                              {(['normal', 'large', 'xl'] as const).map((size) => (
                                <button
                                  key={size}
                                  onClick={() => updateFontSize(size)}
                                  className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                                    fontSize === size ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                >
                                  {size === 'normal' ? 'Default' : size === 'large' ? 'Large' : 'Extra Large'}
                                </button>
                              ))}
                            </div>
                          </SettingRow>

                          {/* Density */}
                          <SettingRow
                            icon={AlignLeft}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Density setting"
                            description="Control the spacing and padding density of the interface"
                          >
                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                              {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                                <button
                                  key={d}
                                  onClick={() => updateDensity(d)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                                    density === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                >
                                  {d}
                                </button>
                              ))}
                            </div>
                          </SettingRow>

                          {/* Sidebar Position */}
                          <SettingRow
                            icon={ArrowLeftRight}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="Sidebar position"
                            description="Choose which side of the screen the navigation sidebar appears on"
                          >
                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                              <button
                                onClick={() => updateSidebarPosition('left')}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                                  sidebarPosition === 'left' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                Left
                              </button>
                              <button
                                onClick={() => updateSidebarPosition('right')}
                                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                                  sidebarPosition === 'right' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                              >
                                Right
                              </button>
                            </div>
                          </SettingRow>

                          {/* Animation Speed */}
                          <SettingRow
                            icon={Zap}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Animation speed"
                            description="Control the speed of transitions and animations throughout the app"
                          >
                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                              {(['slow', 'normal', 'fast'] as const).map((speed) => (
                                <button
                                  key={speed}
                                  onClick={() => updateAnimationSpeed(speed)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all ${
                                    animationSpeed === speed ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                >
                                  {speed}
                                </button>
                              ))}
                            </div>
                          </SettingRow>
                        </>
                      )}

                      {/* ══════════ DATA & STORAGE SECTION ══════════ */}
                      {activeSection === 'data' && (
                        <>
                          {/* Storage info */}
                          <motion.div variants={staggerItem} className="px-5 py-5">
                            <div className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-50/40 border border-gray-100/60 p-5">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                                  <Database className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                  <h4 className="text-[14px] font-semibold text-gray-900">Storage used</h4>
                                  <p className="text-[13px] text-gray-500 mt-0.5">0 MB — We don&apos;t store your data</p>
                                </div>
                              </div>
                              <div className="mt-4 h-2 bg-gray-200/60 rounded-full overflow-hidden">
                                <div className="h-full w-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
                              </div>
                              <div className="flex justify-between mt-1.5">
                                <span className="text-[10px] font-medium text-gray-400">0 MB used</span>
                                <span className="text-[10px] font-medium text-gray-400">No storage limit</span>
                              </div>

                              {/* Storage breakdown */}
                              <div className="mt-4 pt-4 border-t border-gray-100/60">
                                <h5 className="text-[12px] font-semibold text-gray-600 mb-3">Storage Breakdown</h5>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                                      <span className="text-[11px] text-gray-500">Conversations</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-gray-400">0 MB</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                      <span className="text-[11px] text-gray-500">Saved resources</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-gray-400">0 MB</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-violet-400" />
                                      <span className="text-[11px] text-gray-500">Cache</span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-gray-400">0 MB</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>

                          {/* Auto-delete */}
                          <SettingRow
                            icon={Clock}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="Auto-delete data"
                            description="Automatically delete your data after a specified period"
                          >
                            <select
                              value={autoDelete}
                              onChange={(e) => updateAutoDelete(e.target.value as 'never' | '30' | '90')}
                              className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 text-[13px] font-medium text-gray-900 pr-9 shadow-sm hover:border-gray-300 focus:outline-none transition-all cursor-pointer"
                              style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'right 10px center',
                              }}
                            >
                              <option value="never">Never</option>
                              <option value="30">After 30 days</option>
                              <option value="90">After 90 days</option>
                            </select>
                          </SettingRow>

                          {/* Download format */}
                          <SettingRow
                            icon={FileDown}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Download format"
                            description="Choose the format for exporting your data"
                          >
                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                              {(['json', 'csv', 'pdf'] as const).map((fmt) => (
                                <button
                                  key={fmt}
                                  onClick={() => updateDownloadFormat(fmt)}
                                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold uppercase transition-all ${
                                    downloadFormat === fmt ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                  }`}
                                >
                                  {fmt}
                                </button>
                              ))}
                            </div>
                          </SettingRow>

                          {/* Export Data */}
                          <SettingRow
                            icon={Download}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Export data"
                            description="Download a copy of all your stored data and conversations"
                          >
                            <button
                              disabled
                              className="flex items-center gap-2 px-4 py-2 text-[12px] font-bold text-gray-400 rounded-xl bg-gray-100 cursor-not-allowed"
                            >
                              <Download className="w-3.5 h-3.5" />
                              No data to export
                            </button>
                          </SettingRow>

                          {/* Clear Cache */}
                          <SettingRow
                            icon={Trash}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Clear cache"
                            description="Remove cached data and temporary files to free up space and resolve display issues"
                          >
                            <button
                              onClick={() => {}}
                              className="flex items-center gap-2 px-4 py-2 text-[12px] font-bold text-gray-700 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all active:scale-[0.97]"
                            >
                              <Trash className="w-3.5 h-3.5" />
                              Clear cache
                            </button>
                          </SettingRow>

                          {/* Privacy reassurance */}
                          <motion.div variants={staggerItem} className="px-5 py-4">
                            <div className="rounded-xl bg-emerald-50/40 border border-emerald-100/40 p-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-emerald-600" />
                              </div>
                              <p className="text-[12px] text-emerald-700 font-medium leading-relaxed">
                                Your privacy is protected. ClearPath AI does not store your conversation data by default.
                              </p>
                            </div>
                          </motion.div>
                        </>
                      )}

                      {/* ══════════ ADVANCED SECTION ══════════ */}
                      {activeSection === 'advanced' && (
                        <>
                          {/* Developer Mode */}
                          <SettingRow
                            icon={Code}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Developer mode"
                            description="Enable developer tools, API access, and debug information in the interface"
                          >
                            <ToggleSwitch checked={developerMode} onChange={updateDeveloperMode} />
                          </SettingRow>

                          {/* API Key Management */}
                          <motion.div variants={staggerItem} className="px-5 py-4">
                            <div className="rounded-xl bg-white/50 border border-gray-100/60 p-5">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                  <Key className="w-[18px] h-[18px] text-blue-500" />
                                </div>
                                <div>
                                  <h4 className="text-[14px] font-semibold text-gray-900">API Key Management</h4>
                                  <p className="text-[12px] text-gray-400 mt-0.5">Create and manage API keys for programmatic access</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50/80 border border-gray-100/40">
                                <div className="flex-1">
                                  <p className="text-[12px] font-mono text-gray-500">cpk_****_****_****_****_demo</p>
                                  <p className="text-[10px] text-gray-400 mt-0.5">Created: June 15, 2026</p>
                                </div>
                                <button className="px-3 py-1.5 text-[10px] font-semibold text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50/60 transition-all">
                                  Revoke
                                </button>
                              </div>
                              <button className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold text-blue-600 bg-blue-50/60 border border-blue-100/60 rounded-xl hover:bg-blue-50 transition-all">
                                <Key className="w-3.5 h-3.5" />
                                Generate new key
                              </button>
                            </div>
                          </motion.div>

                          {/* Webhook Configuration */}
                          <motion.div variants={staggerItem} className="px-5 py-2">
                            <div className="rounded-xl bg-white/50 border border-gray-100/60 p-5">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                                  <Webhook className="w-[18px] h-[18px] text-violet-500" />
                                </div>
                                <div>
                                  <h4 className="text-[14px] font-semibold text-gray-900">Webhook Configuration</h4>
                                  <p className="text-[12px] text-gray-400 mt-0.5">Configure webhooks for real-time event notifications</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Endpoint URL</label>
                                  <input
                                    type="url"
                                    placeholder="https://your-server.com/webhook"
                                    className="w-full px-4 py-2.5 rounded-xl text-[13px] bg-white border border-gray-200 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                  />
                                </div>
                                <div>
                                  <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Events</label>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {['Conversation created', 'Resource found', 'Crisis detected', 'Confidence low'].map((event) => (
                                      <span key={event} className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-gray-50 border border-gray-200/60 text-gray-600">
                                        {event}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <button className="px-4 py-2 text-[12px] font-semibold text-white bg-gradient-to-b from-violet-500 to-violet-600 rounded-xl shadow-sm hover:shadow-md transition-all">
                                  Save webhook
                                </button>
                              </div>
                            </div>
                          </motion.div>

                          {/* Debug Logging */}
                          <SettingRow
                            icon={Bug}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Debug logging"
                            description="Enable verbose logging to console for troubleshooting. This may impact performance."
                          >
                            <ToggleSwitch checked={debugLogging} onChange={updateDebugLogging} />
                          </SettingRow>

                          {/* Debug info card */}
                          <AnimatePresence>
                            {debugLogging && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden px-5"
                              >
                                <div className="py-4">
                                  <div className="rounded-xl bg-amber-50/40 border border-amber-100/40 p-4">
                                    <p className="text-[12px] text-amber-700 font-medium">
                                      Debug logging is enabled. Open your browser console to view detailed logs.
                                    </p>
                                    <div className="mt-2 text-[11px] font-mono text-amber-600/70 space-y-0.5">
                                      <p>Version: 1.0.0-demo</p>
                                      <p>Build: 2026.06.15</p>
                                      <p>Environment: development</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* ═══════════ FOOTER ═══════════ */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-8 pb-4"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/60 border border-emerald-100/40">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="text-[12px] font-semibold text-emerald-700">Privacy first</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/60 border border-blue-100/40">
                <Lock className="w-4 h-4 text-blue-600" />
                <span className="text-[12px] font-semibold text-blue-700">Encrypted</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50/60 border border-violet-100/40">
                <Eye className="w-4 h-4 text-violet-600" />
                <span className="text-[12px] font-semibold text-violet-700">Transparent</span>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  )
}
