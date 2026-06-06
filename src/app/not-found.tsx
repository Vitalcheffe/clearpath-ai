'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  MessageCircle,
  LayoutDashboard,
  BookOpen,
  Search,
  ArrowRight,
  AlertTriangle,
  Phone,
  Shield,
  Layers,
  Eye,
  Sparkles,
  Fingerprint,
  ChevronRight,
  Globe2,
  HelpCircle,
  X,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// ─── HELPFUL LINKS DATA ──────────────────────────────────
const helpfulLinks = [
  {
    title: 'Home',
    description: 'Start fresh from the homepage',
    href: '/',
    icon: Home,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.06)',
    borderColor: 'rgba(59, 130, 246, 0.12)',
  },
  {
    title: 'Chat',
    description: 'Talk to ClearPath AI directly',
    href: '/app',
    icon: MessageCircle,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.06)',
    borderColor: 'rgba(16, 185, 129, 0.12)',
  },
  {
    title: 'Dashboard',
    description: 'View your resource dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.06)',
    borderColor: 'rgba(139, 92, 246, 0.12)',
  },
  {
    title: 'Resources',
    description: 'Browse verified community resources',
    href: '/#how-it-works',
    icon: BookOpen,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.06)',
    borderColor: 'rgba(245, 158, 11, 0.12)',
  },
]

// ─── SUGGESTED PAGES ─────────────────────────────────────
const suggestedPages = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'About', href: '/about' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Responsible AI', href: '/responsible-ai' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Contact', href: '/contact' },
  { label: 'Verification', href: '/verification' },
]

// ─── ANIMATION VARIANTS ──────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// ─── ANIMATED 404 NUMBER ─────────────────────────────────
function Animated404() {
  const digits = ['4', '0', '4']

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      {digits.map((digit, idx) => (
        <motion.span
          key={idx}
          initial={{ opacity: 0, y: -40, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.15 * idx,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="relative text-[80px] sm:text-[120px] md:text-[160px] font-extrabold leading-none select-none"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #3b82f6 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradient-text 4s ease-in-out infinite',
          }}
        >
          {digit}
          {/* Subtle shadow behind each digit */}
          <span
            className="absolute inset-0 blur-2xl opacity-20 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #10b981)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            aria-hidden="true"
          >
            {digit}
          </span>
        </motion.span>
      ))}
    </div>
  )
}

// ─── MOCK SEARCH BAR ─────────────────────────────────────
function MockSearchBar() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = suggestedPages.filter((page) =>
    page.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <motion.div
      variants={staggerItem}
      className="w-full max-w-lg mx-auto"
    >
      <div
        className={`relative glass-card rounded-2xl shadow-premium transition-all duration-300 ${
          focused ? 'shadow-premium-lg ring-2 ring-blue-500/20' : ''
        }`}
      >
        <div className="flex items-center px-5 py-4 gap-3">
          <Search
            className={`w-5 h-5 shrink-0 transition-colors duration-200 ${
              focused ? 'text-blue-500' : 'text-gray-400'
            }`}
          />
          <input
            type="text"
            placeholder="Search for a page..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => {
              setFocused(true)
              setShowSuggestions(true)
            }}
            onBlur={() => {
              setFocused(false)
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-400 outline-none"
            aria-label="Search pages"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Search suggestions dropdown */}
        <AnimatePresence>
          {showSuggestions && query.length > 0 && filteredSuggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 glass-card rounded-xl shadow-premium-lg overflow-hidden z-20"
            >
              {filteredSuggestions.map((page) => (
                <Link
                  key={page.label}
                  href={page.href}
                  className="flex items-center gap-2.5 px-5 py-3 text-[13px] text-gray-700 hover:text-gray-900 hover:bg-gray-50/80 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                  {page.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results */}
        <AnimatePresence>
          {showSuggestions && query.length > 0 && filteredSuggestions.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 right-0 mt-1 glass-card rounded-xl shadow-premium-lg p-4 z-20"
            >
              <p className="text-[13px] text-gray-500 text-center">
                No pages found for &ldquo;{query}&rdquo;
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── CRISIS RESOURCE BANNER ──────────────────────────────
function CrisisResource() {
  return (
    <motion.div
      variants={staggerItem}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="rounded-2xl border border-red-200/60 bg-gradient-to-r from-red-50/80 via-white to-red-50/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
              </span>
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-red-800">
                If you&apos;re in crisis
              </h3>
              <p className="text-[12px] text-red-600/70">
                You don&apos;t need to navigate this alone
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <a
              href="tel:988"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-bold text-white rounded-xl bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 transition-all"
            >
              <Phone className="w-4 h-4" />
              Call 988
            </a>
            <div className="text-[12px] text-red-700/60 font-medium">
              or text <span className="font-bold text-red-700">HOME</span> to{' '}
              <span className="font-bold text-red-700">741741</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── HELPFUL LINK CARD ───────────────────────────────────
function HelpfulLinkCard({
  link,
  index,
}: {
  link: (typeof helpfulLinks)[0]
  index: number
}) {
  const IconComp = link.icon

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group"
    >
      <Link
        href={link.href}
        className="block glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden"
      >
        {/* Subtle hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${link.bgColor}, transparent 70%)`,
          }}
        />

        <div className="relative space-y-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              backgroundColor: link.bgColor,
              border: `1px solid ${link.borderColor}`,
            }}
          >
            <IconComp
              className="w-5 h-5 transition-colors duration-300"
              style={{ color: link.color }}
            />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900 tracking-tight group-hover:text-gray-700 transition-colors">
              {link.title}
            </h3>
            <p className="text-[13px] text-gray-500 mt-1">{link.description}</p>
          </div>
          <div
            className="flex items-center gap-1 text-[12px] font-semibold transition-all duration-300 group-hover:gap-2"
            style={{ color: link.color }}
          >
            Go to {link.title}
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ─── FUN TRANSPARENCY ELEMENT ────────────────────────────
function FunTransparencyElement() {
  const [confidenceHovered, setConfidenceHovered] = useState(false)

  return (
    <motion.div variants={staggerItem} className="w-full max-w-md mx-auto">
      <motion.div
        onHoverStart={() => setConfidenceHovered(true)}
        onHoverEnd={() => setConfidenceHovered(false)}
        whileHover={{ scale: 1.01 }}
        className="glass-card rounded-2xl p-5 shadow-premium relative overflow-hidden cursor-default"
      >
        {/* Accent glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)' }}
        />

        <div className="relative flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center shrink-0">
            <Fingerprint className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h4 className="text-[14px] font-semibold text-gray-900">
              Even our 404 page is transparent about what it doesn&apos;t know
            </h4>
            <p className="text-[12px] text-gray-500 leading-relaxed">
              This page doesn&apos;t exist — and we&apos;re not going to pretend it does. That&apos;s the ClearPath way.
            </p>
            {/* Fake confidence bar */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Confidence that this page exists
                </span>
                <span
                  className="text-[11px] font-bold transition-colors duration-300"
                  style={{ color: confidenceHovered ? '#ef4444' : '#f59e0b' }}
                >
                  0%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: confidenceHovered
                      ? 'linear-gradient(90deg, #ef4444, #f97316)'
                      : 'linear-gradient(90deg, #f59e0b, #f97316)',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: confidenceHovered ? '1%' : '0%' }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <HelpCircle className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-400">
                  Below 70% threshold — asking for clarification instead of guessing
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── FLOATING PARTICLES (decorative) ─────────────────────
function FloatingParticles() {
  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: 15 + (i * 14) % 70,
    y: 20 + (i * 17) % 60,
    size: 4 + (i % 3) * 2,
    delay: i * 0.8,
    duration: 6 + (i % 3) * 2,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full opacity-20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.id % 2 === 0 ? '#3b82f6' : '#10b981',
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── MAIN 404 PAGE ───────────────────────────────────────
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg relative">
      <Navbar />

      {/* Decorative floating particles */}
      <FloatingParticles />

      {/* Ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(16,185,129,0.04) 40%, transparent 70%)',
        }}
      />

      <main className="flex-1 flex items-center justify-center pt-16 pb-12 px-4 sm:px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full max-w-4xl space-y-12"
        >
          {/* ═══ Animated 404 ═══ */}
          <motion.div variants={fadeInUp} className="text-center space-y-6">
            <Animated404 />

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-3"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                This page doesn&apos;t exist
              </h1>
              <p className="text-[15px] sm:text-[16px] text-gray-500 leading-relaxed max-w-lg mx-auto">
                But we can help you find what you need. Unlike some AI, we&apos;d rather be honest about
                what we <span className="font-semibold text-gray-700">don&apos;t</span> know than make
                something up.
              </p>
            </motion.div>
          </motion.div>

          {/* ═══ Mock Search ═══ */}
          <MockSearchBar />

          {/* ═══ Helpful Link Cards ═══ */}
          <div>
            <motion.div variants={staggerItem} className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h2 className="text-[14px] font-semibold text-gray-700">Where would you like to go?</h2>
              </div>
              <p className="text-[12px] text-gray-400">These pages definitely exist — 100% confidence</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {helpfulLinks.map((link, idx) => (
                <HelpfulLinkCard key={link.title} link={link} index={idx} />
              ))}
            </div>
          </div>

          {/* ═══ Suggested Pages ═══ */}
          <motion.div variants={staggerItem} className="text-center">
            <h3 className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Other pages you might be looking for
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {suggestedPages.map((page) => (
                <Link
                  key={page.label}
                  href={page.href}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-gray-600 hover:text-gray-900 bg-white/60 hover:bg-white border border-gray-200/60 hover:border-gray-300 rounded-lg transition-all duration-200"
                >
                  {page.label}
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* ═══ Crisis Resource ═══ */}
          <CrisisResource />

          {/* ═══ Fun Transparency Element ═══ */}
          <FunTransparencyElement />

          {/* ═══ Back to Home CTA ═══ */}
          <motion.div variants={staggerItem} className="text-center pt-2 pb-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-white rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
