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

  // Get initials
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ═══════════ PROFILE HEADER ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-premium-lg relative overflow-hidden">
              {/* Decorative glow */}
              <div
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15), rgba(16,185,129,0.08), transparent 70%)' }}
              />
              <div
                className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.12), transparent 70%)' }}
              />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Avatar with gradient border */}
                  <div className="relative group">
                    {/* Gradient border ring */}
                    <div className="w-20 h-20 rounded-full p-[3px] bg-gradient-to-br from-blue-500 via-emerald-400 to-violet-500 shadow-lg shadow-blue-500/15">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <span className="text-[22px] font-extrabold tracking-tight bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
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
                  </div>

                  {/* Name + info */}
                  <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-gray-900">
                      {fullName}
                    </h1>
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
                  {/* Decorative glow */}
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

          {/* ═══════════ PROFILE DETAILS CARD ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900/5 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-gray-900">
                      Profile Details
                    </h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      Manage your personal information
                    </p>
                  </div>
                </div>

                {/* Saved toast */}
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

              {/* Form fields */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Full name"
                    icon={User}
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Your full name"
                  />
                  <FormField
                    label="Email"
                    icon={Mail}
                    value={email}
                    onChange={setEmail}
                    type="email"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                    label="Phone"
                    icon={Phone}
                    value={phone}
                    onChange={setPhone}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    optional
                  />
                  <FormField
                    label="Location / ZIP code"
                    icon={MapPin}
                    value={location}
                    onChange={setLocation}
                    placeholder="e.g. 10001"
                    optional
                  />
                </div>
                <FormField
                  label="Preferred language"
                  icon={Globe}
                  value={language}
                  onChange={setLanguage}
                  placeholder="English"
                />

                {/* Action buttons when editing */}
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

          {/* ═══════════ ACTIVITY TIMELINE ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium relative overflow-hidden">
              {/* Section header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-900/5 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-gray-900">
                      Recent Activity
                    </h2>
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      Your latest actions on ClearPath AI
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

              {/* Timeline items */}
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
                      {/* Connector line */}
                      {i < activityTimeline.length - 1 && (
                        <div className="absolute left-[15px] top-[38px] bottom-0 w-px bg-gradient-to-b from-gray-200/80 to-gray-100/40" />
                      )}

                      <div className="flex items-start gap-4 py-3.5 group">
                        {/* Icon circle */}
                        <div
                          className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 mt-0.5 relative z-10"
                          style={{ backgroundColor: item.bgColor }}
                        >
                          <Icon className="w-3.5 h-3.5" style={{ color: item.colorHex }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[14px] font-medium text-gray-800 truncate">
                              {item.text}
                            </p>
                            <span className="text-[11px] text-gray-400 whitespace-nowrap font-medium shrink-0">
                              {item.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Mobile view all link */}
              <div className="sm:hidden mt-4 pt-4 border-t border-gray-100/60">
                <Link
                  href="/history"
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  View all activity
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ DANGER ZONE ═══════════ */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <div className="rounded-2xl border-2 border-red-200/60 bg-red-50/30 backdrop-blur-sm p-6 sm:p-8 relative overflow-hidden">
              {/* Decorative red glow */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.2), transparent 70%)' }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100/60 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-bold tracking-tight text-red-900">
                      Danger Zone
                    </h2>
                    <p className="text-[12px] text-red-400 mt-0.5">
                      Irreversible and destructive actions
                    </p>
                  </div>
                </div>

                <div className="bg-white/60 rounded-xl p-5 border border-red-100/60">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-red-400" />
                        <h3 className="text-[14px] font-semibold text-red-800">
                          Delete account
                        </h3>
                      </div>
                      <p className="text-[13px] text-red-500/70 leading-relaxed">
                        Once you delete your account, there is no going back. This action cannot be undone. All your data will be permanently removed.
                      </p>
                    </div>
                    <button
                      disabled
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl bg-red-400/50 cursor-not-allowed shrink-0"
                      title="Disabled for demo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete my account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ═══════════ FOOTER ═══════════ */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-t border-gray-100/60 bg-white/40 backdrop-blur-sm rounded-2xl mt-4"
          >
            <div className="px-6 py-5">
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
          </motion.footer>
        </div>
      </main>
    </div>
  )
}
