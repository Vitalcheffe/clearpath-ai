'use client'

import { useState } from 'react'
import Link from 'next/link'
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
} from 'lucide-react'
import Navbar from '@/components/Navbar'

// ─── TYPES ──────────────────────────────────────────────
type SectionKey = 'general' | 'privacy' | 'notifications' | 'accessibility' | 'data'

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
  { key: 'notifications', label: 'Notifications', icon: Bell, description: 'Email, resource updates, and weekly summary' },
  { key: 'accessibility', label: 'Accessibility', icon: Eye, description: 'Display, motion, and screen reader options' },
  { key: 'data', label: 'Data & Storage', icon: Database, description: 'Storage info, export, and cache management' },
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

// ─── MAIN SETTINGS PAGE ────────────────────────────────
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionKey>('general')

  // General state
  const [language, setLanguage] = useState('English')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [zipCode, setZipCode] = useState('')
  const [confidenceThreshold, setConfidenceThreshold] = useState(70)

  // Privacy state
  const [dataRetention, setDataRetention] = useState(true)
  const [shareUsage, setShareUsage] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
                              onChange={(e) => setLanguage(e.target.value)}
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
                                onClick={() => setTheme('light')}
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
                                onClick={() => setTheme('dark')}
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
                              onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                              placeholder="e.g. 10001"
                              maxLength={5}
                              className="w-28 bg-white border border-gray-200 rounded-xl px-4 py-2 text-[13px] font-medium text-gray-900 placeholder:text-gray-400 shadow-sm hover:border-gray-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all"
                            />
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
                                  onClick={() => setConfidenceThreshold(50)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                    confidenceThreshold <= 50
                                      ? 'bg-amber-50 text-amber-600 border border-amber-200/60'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  Low
                                </button>
                                <button
                                  onClick={() => setConfidenceThreshold(70)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                    confidenceThreshold > 50 && confidenceThreshold <= 70
                                      ? 'bg-blue-50 text-blue-600 border border-blue-200/60'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  Medium
                                </button>
                                <button
                                  onClick={() => setConfidenceThreshold(90)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                    confidenceThreshold > 70
                                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  High
                                </button>
                              </div>
                              <span
                                className="text-[12px] font-bold"
                                style={{ color: confidenceColor }}
                              >
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
                          {/* Data Retention */}
                          <SettingRow
                            icon={Lock}
                            iconColor="#3b82f6"
                            iconBg="rgba(59,130,246,0.06)"
                            title="Don't store any conversation data"
                            description="When enabled, your conversations are never stored on our servers. This is on by default to protect your privacy."
                          >
                            <ToggleSwitch checked={dataRetention} onChange={setDataRetention} />
                          </SettingRow>

                          {/* Crisis Detection */}
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

                          {/* Share Usage Data */}
                          <SettingRow
                            icon={Layers}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="Share usage data for improvement"
                            description="Help us improve ClearPath AI by sharing anonymized usage patterns. No personal data is ever shared."
                          >
                            <ToggleSwitch checked={shareUsage} onChange={setShareUsage} />
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

                              {/* Confirmation overlay */}
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
                            <ToggleSwitch checked={emailNotifs} onChange={setEmailNotifs} />
                          </SettingRow>

                          <SettingRow
                            icon={Layers}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Resource updates"
                            description="Get notified when saved resources have changes or new information"
                          >
                            <ToggleSwitch checked={resourceUpdates} onChange={setResourceUpdates} />
                          </SettingRow>

                          <SettingRow
                            icon={Globe}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="New features"
                            description="Be the first to know about new features and improvements to ClearPath AI"
                          >
                            <ToggleSwitch checked={newFeatures} onChange={setNewFeatures} />
                          </SettingRow>

                          <SettingRow
                            icon={Settings}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="Weekly summary"
                            description="Receive a weekly digest of your activity and helpful resources"
                          >
                            <ToggleSwitch checked={weeklySummary} onChange={setWeeklySummary} />
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
                            <ToggleSwitch checked={largeText} onChange={setLargeText} />
                          </SettingRow>

                          <SettingRow
                            icon={Sun}
                            iconColor="#f59e0b"
                            iconBg="rgba(245,158,11,0.06)"
                            title="High contrast mode"
                            description="Increase color contrast for better visual distinction between elements"
                          >
                            <ToggleSwitch checked={highContrast} onChange={setHighContrast} />
                          </SettingRow>

                          <SettingRow
                            icon={User}
                            iconColor="#10b981"
                            iconBg="rgba(16,185,129,0.06)"
                            title="Screen reader optimization"
                            description="Enhance the interface for screen readers with additional ARIA labels and descriptions"
                          >
                            <ToggleSwitch checked={screenReader} onChange={setScreenReader} />
                          </SettingRow>

                          <SettingRow
                            icon={Layers}
                            iconColor="#8b5cf6"
                            iconBg="rgba(139,92,246,0.06)"
                            title="Reduced motion"
                            description="Minimize animations and transitions throughout the interface"
                          >
                            <ToggleSwitch checked={reducedMotion} onChange={setReducedMotion} />
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
                            </div>
                          </motion.div>

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
