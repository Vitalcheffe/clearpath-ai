'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check,
  X,
  ArrowRight,
  Shield,
  Lock,
  Heart,
  Layers,
  Zap,
  Building2,
  Star,
  Crown,
  ChevronDown,
  Globe,
  Quote,
  BadgeCheck,
  CreditCard,
  XCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

// ─── PRICING TIERS ───────────────────────────────────────
const tiersBase = [
  {
    name: 'Free',
    priceMonthly: '$0',
    priceAnnual: '$0',
    period: '/month',
    description: 'For everyone who needs help finding the right resources.',
    badge: 'Current plan',
    badgeColor: 'bg-blue-50 text-blue-600 border-blue-100/60',
    icon: Layers,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    borderColor: '',
    scale: false,
    features: [
      { text: 'Unlimited resource searches', included: true },
      { text: 'Crisis detection (always active)', included: true },
      { text: 'Confidence scores on every result', included: true },
      { text: '211 human navigator access', included: true },
      { text: 'Community support', included: true },
      { text: 'Priority classification speed', included: false },
      { text: 'Saved conversation history', included: false },
      { text: 'Advanced clarification engine', included: false },
      { text: 'Resource eligibility pre-check', included: false },
      { text: 'Email support', included: false },
    ],
    cta: 'Current Plan',
    ctaDisabled: true,
    ctaVariant: 'disabled' as const,
  },
  {
    name: 'Pro',
    priceMonthly: '$12',
    priceAnnual: '$9',
    period: '/month',
    description: 'For power users who need faster, deeper resource navigation.',
    badge: 'Most Popular',
    badgeColor: 'bg-emerald-50 text-emerald-600 border-emerald-100/60',
    icon: Zap,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    borderColor: 'border-2 border-blue-200',
    scale: true,
    features: [
      { text: 'Unlimited resource searches', included: true },
      { text: 'Crisis detection (always active)', included: true },
      { text: 'Confidence scores on every result', included: true },
      { text: '211 human navigator access', included: true },
      { text: 'Community support', included: true },
      { text: 'Priority classification speed', included: true },
      { text: 'Saved conversation history', included: true },
      { text: 'Advanced clarification engine', included: true },
      { text: 'Resource eligibility pre-check', included: true },
      { text: 'Email support', included: true },
    ],
    cta: 'Upgrade to Pro',
    ctaDisabled: false,
    ctaVariant: 'primary' as const,
  },
  {
    name: 'Enterprise',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    period: '',
    description: 'For organizations that need tailored AI resource navigation.',
    badge: 'Contact us',
    badgeColor: 'bg-gray-50 text-gray-600 border-gray-200/60',
    icon: Building2,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-500',
    borderColor: '',
    scale: false,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'API access', included: true },
      { text: 'Custom resource databases', included: true },
      { text: 'White-label options', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'Priority classification speed', included: true },
      { text: 'Saved conversation history', included: true },
      { text: 'Advanced clarification engine', included: true },
      { text: 'Resource eligibility pre-check', included: true },
    ],
    cta: 'Contact Sales',
    ctaDisabled: false,
    ctaVariant: 'secondary' as const,
  },
]

// ─── FAQ DATA ────────────────────────────────────────────
const faqs = [
  {
    question: 'Is ClearPath AI free to use?',
    answer:
      'Yes, ClearPath AI is completely free for individuals. Our core mission is making community resources accessible to everyone. The Free tier gives you unlimited searches, crisis detection, confidence scores, and access to 211 human navigators — forever. Pro and Enterprise plans are for power users and organizations who need advanced features.',
  },
  {
    question: 'What makes ClearPath different from ChatGPT?',
    answer:
      'Unlike generic AI chatbots, ClearPath AI never hallucinates resources. We classify against a verified 211 database using BART-large-MNLI, show calibrated confidence scores on every result, and bypass AI entirely when crisis keywords are detected. Every result shows WHY it was recommended, WHAT ELSE was considered, and HOW CONFIDENT we are.',
  },
  {
    question: 'How does crisis detection work?',
    answer:
      'Before any AI processing, we check every input against hardcoded crisis keywords. If detected, the AI layer is bypassed entirely and you\'re immediately connected to crisis resources like the 988 Suicide & Crisis Lifeline. This isn\'t a probability — it\'s a deterministic safety layer that always activates, even on the Free plan.',
  },
  {
    question: 'Is my data stored?',
    answer:
      'No. ClearPath AI does not store any conversation data, ever. Your searches and conversations are processed in real-time and immediately discarded. We believe that people seeking community resources deserve absolute privacy. This is true across all plans — Free, Pro, and Enterprise.',
  },
  {
    question: 'What happens if I exceed the free tier limits?',
    answer:
      'The Free tier has no search limits — you get unlimited resource searches, crisis detection, confidence scores, and 211 navigator access forever. The Free tier doesn\'t limit how many searches you make. Upgrading to Pro unlocks advanced features like priority speed, saved history, advanced clarification, and eligibility pre-check — not more searches.',
  },
  {
    question: 'Can I switch between plans?',
    answer:
      'Absolutely. You can upgrade or downgrade your plan at any time from your account settings. When upgrading, you\'ll get immediate access to Pro features and be charged a prorated amount for the remainder of your billing cycle. When downgrading, your Pro features remain active until the end of your current billing period.',
  },
  {
    question: 'Do you offer discounts for nonprofits?',
    answer:
      'Yes! We offer a 50% discount on the Pro plan for verified nonprofit organizations. We believe in supporting the people who support communities. Contact our team with proof of your nonprofit status, and we\'ll apply the discount to your account within 24 hours. Enterprise plans for nonprofits also receive special pricing.',
  },
]

// ─── DETAILED COMPARISON TABLE DATA ──────────────────────
const comparisonSections = [
  {
    title: 'Core Features',
    rows: [
      { feature: 'Resource searches', free: 'Unlimited', pro: 'Unlimited', enterprise: 'Unlimited' },
      { feature: 'Crisis detection', free: 'Always on', pro: 'Always on', enterprise: 'Always on' },
      { feature: 'Confidence scores', free: '✓', pro: '✓', enterprise: '✓' },
      { feature: '211 human navigator', free: '✓', pro: '✓', enterprise: '✓' },
    ],
  },
  {
    title: 'Advanced Features',
    rows: [
      { feature: 'Priority speed', free: '—', pro: '✓', enterprise: '✓' },
      { feature: 'Saved history', free: '—', pro: '✓', enterprise: '✓' },
      { feature: 'Advanced clarification', free: '—', pro: '✓', enterprise: '✓' },
      { feature: 'Eligibility pre-check', free: '—', pro: '✓', enterprise: '✓' },
    ],
  },
  {
    title: 'Enterprise Features',
    rows: [
      { feature: 'API access', free: '—', pro: '—', enterprise: '✓' },
      { feature: 'Custom databases', free: '—', pro: '—', enterprise: '✓' },
      { feature: 'White-label', free: '—', pro: '—', enterprise: '✓' },
      { feature: 'Account manager', free: '—', pro: '—', enterprise: '✓' },
      { feature: 'SLA guarantee', free: '—', pro: '—', enterprise: '✓' },
    ],
  },
]

// ─── TESTIMONIALS DATA ───────────────────────────────────
const testimonials = [
  {
    initials: 'MR',
    name: 'Maria Rodriguez',
    role: 'Nonprofit Director',
    quote: 'The free tier gives us everything we need. Crisis detection alone is worth it.',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    initials: 'JK',
    name: 'James Kim',
    role: 'Social Worker',
    quote: "Pro's saved history means I can follow up with clients across sessions.",
    color: 'bg-blue-100 text-blue-700',
  },
  {
    initials: 'SP',
    name: 'Sarah Patel',
    role: 'Enterprise User',
    quote: 'The API integration lets us embed ClearPath directly into our intake workflow.',
    color: 'bg-amber-100 text-amber-700',
  },
]

// ─── ANIMATION VARIANTS ──────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// ─── FAQ ITEM ────────────────────────────────────────────
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card rounded-2xl shadow-premium overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/40 transition-colors"
        aria-expanded={open}
      >
        <span className="text-[15px] font-semibold text-gray-900 pr-4">{question}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="px-6 pb-6 pt-0">
              <div className="border-t border-gray-100/60 pt-4">
                <p className="text-[14px] text-gray-500 leading-relaxed">{answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── PRICING PAGE ────────────────────────────────────────
export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      {/* ═══════════ HERO / HEADER ═══════════ */}
      <section className="pt-28 pb-8 md:pt-36 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5" />
              Simple, transparent pricing
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mt-6 leading-[1.1]"
          >
            The right help, at the{' '}
            <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%]">
              right price.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Start free forever. Upgrade when you need more speed, history, and advanced features.
            <span className="font-semibold text-gray-700"> Crisis detection is always on.</span>
          </motion.p>
        </div>
      </section>

      {/* ═══════════ BILLING TOGGLE + PRICING CARDS ═══════════ */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Billing Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-10"
          >
            <span
              className={`text-[14px] font-semibold transition-colors duration-300 ${
                !isAnnual ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
              style={{
                backgroundColor: isAnnual ? '#10b981' : '#e5e7eb',
              }}
              aria-label={`Switch to ${isAnnual ? 'monthly' : 'annual'} billing`}
              role="switch"
              aria-checked={isAnnual}
            >
              <motion.div
                className="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md"
                animate={{ x: isAnnual ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
            <span
              className={`text-[14px] font-semibold transition-colors duration-300 ${
                isAnnual ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              Annual
            </span>
            <AnimatePresence>
              {isAnnual && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -8 }}
                  transition={{ duration: 0.25 }}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60"
                >
                  <Sparkles className="w-3 h-3" />
                  Save 20%
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start max-w-6xl mx-auto"
          >
            {tiersBase.map((tier, i) => {
              const Icon = tier.icon
              const isPro = tier.scale
              const displayPrice = isAnnual ? tier.priceAnnual : tier.priceMonthly

              return (
                <motion.div
                  key={tier.name}
                  variants={staggerItem}
                  className={`relative ${isPro ? 'lg:-mt-4 lg:mb-4' : ''}`}
                >
                  {/* Pro card glow effect */}
                  {isPro && (
                    <div
                      className="absolute -inset-px rounded-3xl opacity-40 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(16,185,129,0.1), rgba(59,130,246,0.08))',
                      }}
                    />
                  )}

                  <div
                    className={`relative glass-card rounded-3xl p-8 overflow-hidden transition-all duration-300 ${
                      isPro
                        ? `shadow-premium-xl ${tier.borderColor}`
                        : 'shadow-premium hover:shadow-premium-lg'
                    }`}
                  >
                    {/* Pro gradient accent top */}
                    {isPro && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500" />
                    )}

                    {/* Enterprise gradient accent */}
                    {tier.name === 'Enterprise' && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300" />
                    )}

                    {/* Background glow */}
                    {isPro && (
                      <div
                        className="absolute -top-24 -right-24 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)',
                        }}
                      />
                    )}

                    <div className="relative z-10 space-y-6">
                      {/* Badge + Icon row */}
                      <div className="flex items-center justify-between">
                        <div className={`w-11 h-11 rounded-xl ${tier.iconBg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${tier.iconColor}`} />
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm ${tier.badgeColor}`}
                        >
                          {tier.name === 'Pro' && <Crown className="w-3 h-3" />}
                          {tier.name === 'Enterprise' && <Globe className="w-3 h-3" />}
                          {tier.badge}
                        </span>
                      </div>

                      {/* Tier name */}
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">{tier.name}</h3>
                        <p className="text-[14px] text-gray-500 mt-1.5 leading-relaxed">{tier.description}</p>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1 h-[60px]">
                        {displayPrice !== 'Custom' ? (
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={displayPrice}
                              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                              className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%]"
                            >
                              {displayPrice}
                            </motion.span>
                          </AnimatePresence>
                        ) : (
                          <span className="text-5xl font-extrabold bg-gradient-to-r from-gray-500 via-gray-600 to-gray-500 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%]">
                            Custom
                          </span>
                        )}
                        {tier.period && (
                          <span className="text-[15px] text-gray-400 font-medium">{tier.period}</span>
                        )}
                        {isAnnual && tier.name === 'Pro' && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[12px] text-gray-400 font-medium line-through ml-1"
                          >
                            $12
                          </motion.span>
                        )}
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={tier.ctaDisabled ? '#' : tier.name === 'Enterprise' ? '/about' : '/app'}
                        className={`block w-full text-center px-6 py-3.5 rounded-2xl text-[14px] font-semibold transition-all active:scale-[0.97] ${
                          tier.ctaVariant === 'disabled'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200/60'
                            : tier.ctaVariant === 'primary'
                            ? 'bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                            : 'bg-gray-900 hover:bg-gray-800 text-white shadow-md shadow-gray-900/20 hover:shadow-lg hover:shadow-gray-900/30'
                        }`}
                        onClick={(e) => tier.ctaDisabled && e.preventDefault()}
                        aria-disabled={tier.ctaDisabled}
                      >
                        <span className="flex items-center justify-center gap-2">
                          {tier.cta}
                          {!tier.ctaDisabled && <ArrowRight className="w-4 h-4" />}
                        </span>
                      </Link>

                      {/* Divider */}
                      <div className="border-t border-gray-100/60" />

                      {/* Features list */}
                      <div className="space-y-3.5">
                        {tier.features.map((feature) => (
                          <div key={feature.text} className="flex items-start gap-3">
                            {feature.included ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                                <span className="text-[10px] text-gray-300 font-bold">—</span>
                              </div>
                            )}
                            <span
                              className={`text-[13px] leading-snug ${
                                feature.included ? 'text-gray-700' : 'text-gray-400'
                              }`}
                            >
                              {feature.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FEATURE COMPARISON HIGHLIGHT ═══════════ */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl p-8 md:p-12 shadow-premium relative overflow-hidden"
          >
            {/* Background accent */}
            <div
              className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full opacity-10 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)',
              }}
            />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                  Why people upgrade to Pro
                </h2>
                <p className="text-[15px] text-gray-500 mt-3 max-w-xl mx-auto">
                  Advanced features for those who rely on ClearPath AI every day.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: Zap,
                    title: 'Priority Speed',
                    desc: 'Classifications complete faster with priority queue access — critical when every second counts.',
                    color: '#3b82f6',
                  },
                  {
                    icon: Layers,
                    title: 'Advanced Clarification',
                    desc: 'Deeper multi-turn clarification engine that asks smarter follow-up questions for complex needs.',
                    color: '#10b981',
                  },
                  {
                    icon: Shield,
                    title: 'Eligibility Pre-Check',
                    desc: 'Know if you qualify before applying. Saves hours on ineligible resource applications.',
                    color: '#f59e0b',
                  },
                ].map((item) => {
                  const FIcon = item.icon
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="text-center space-y-4"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
                        style={{ backgroundColor: `${item.color}10` }}
                      >
                        <FIcon className="w-5 h-5" style={{ color: item.color }} />
                      </div>
                      <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{item.title}</h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed">{item.desc}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ DETAILED FEATURE COMPARISON TABLE ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                Compare every feature
              </h2>
              <p className="text-[15px] text-gray-500 mt-3 max-w-xl mx-auto">
                A detailed breakdown of what&apos;s included in each plan.
              </p>
            </div>

            <div className="glass-card rounded-3xl shadow-premium overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-0 border-b border-gray-100/60 bg-white/60">
                <div className="p-5 md:p-6">
                  <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">Features</span>
                </div>
                <div className="p-5 md:p-6 text-center">
                  <span className="text-[14px] font-bold text-gray-900">Free</span>
                </div>
                <div className="p-5 md:p-6 text-center relative">
                  <span className="text-[14px] font-bold text-blue-600">Pro</span>
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500" />
                </div>
                <div className="p-5 md:p-6 text-center">
                  <span className="text-[14px] font-bold text-gray-900">Enterprise</span>
                </div>
              </div>

              {/* Table Body */}
              {comparisonSections.map((section, sIdx) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: sIdx * 0.1 }}
                >
                  {/* Section Header */}
                  <div className="grid grid-cols-4 gap-0 bg-gray-50/80 border-b border-gray-100/40">
                    <div className="col-span-4 px-5 md:px-6 py-3">
                      <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">
                        {section.title}
                      </span>
                    </div>
                  </div>

                  {/* Section Rows */}
                  {section.rows.map((row, rIdx) => (
                    <div
                      key={row.feature}
                      className={`grid grid-cols-4 gap-0 border-b border-gray-50/80 hover:bg-white/60 transition-colors ${
                        rIdx === section.rows.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <div className="p-4 md:p-5 flex items-center">
                        <span className="text-[13px] font-medium text-gray-700">{row.feature}</span>
                      </div>
                      <div className="p-4 md:p-5 flex items-center justify-center">
                        {row.free === '✓' ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                          </div>
                        ) : row.free === '—' ? (
                          <span className="text-[14px] text-gray-300">—</span>
                        ) : (
                          <span className="text-[13px] font-medium text-gray-600">{row.free}</span>
                        )}
                      </div>
                      <div className="p-4 md:p-5 flex items-center justify-center bg-blue-50/20">
                        {row.pro === '✓' ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                          </div>
                        ) : row.pro === '—' ? (
                          <span className="text-[14px] text-gray-300">—</span>
                        ) : (
                          <span className="text-[13px] font-medium text-gray-600">{row.pro}</span>
                        )}
                      </div>
                      <div className="p-4 md:p-5 flex items-center justify-center">
                        {row.enterprise === '✓' ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                            <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                          </div>
                        ) : row.enterprise === '—' ? (
                          <span className="text-[14px] text-gray-300">—</span>
                        ) : (
                          <span className="text-[13px] font-medium text-gray-600">{row.enterprise}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FAQ ═══════════ */}
      <section className="py-12 md:py-20 bg-white/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900"
            >
              Frequently asked questions
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[16px] text-gray-500 mt-4">
              Everything you need to know about ClearPath AI.
            </motion.p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              Trusted by people who{' '}
              <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%]">
                make a difference
              </span>
            </h2>
            <p className="text-[15px] text-gray-500 mt-3 max-w-xl mx-auto">
              Hear from the social workers, nonprofit leaders, and organizations using ClearPath AI.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="glass-card rounded-3xl p-6 md:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden"
              >
                {/* Decorative quote */}
                <div className="absolute top-4 right-4 opacity-[0.06] pointer-events-none">
                  <Quote className="w-16 h-16" />
                </div>

                <div className="relative z-10 space-y-5">
                  {/* Quote text */}
                  <p className="text-[15px] text-gray-700 leading-relaxed font-medium">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Divider */}
                  <div className="border-t border-gray-100/60" />

                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full ${testimonial.color} flex items-center justify-center shrink-0`}
                    >
                      <span className="text-[12px] font-bold">{testimonial.initials}</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-gray-900 tracking-tight">
                        {testimonial.name}
                      </p>
                      <p className="text-[12px] text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ MONEY-BACK GUARANTEE ═══════════ */}
      <section className="py-12 md:py-20 bg-white/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl shadow-premium p-8 md:p-12 relative overflow-hidden"
          >
            {/* Background accent */}
            <div
              className="absolute -top-20 -left-20 w-60 h-60 rounded-full opacity-10 pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(16,185,129,0.3), transparent 70%)',
              }}
            />

            <div className="relative z-10 text-center space-y-6">
              {/* Shield Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto"
              >
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <ShieldCheck className="w-10 h-10 text-emerald-600" />
                </div>
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                  30-Day Money-Back Guarantee
                </h2>
                <p className="text-[15px] text-gray-500 max-w-lg mx-auto leading-relaxed">
                  If ClearPath Pro doesn&apos;t meet your expectations within the first 30 days, we&apos;ll
                  refund your payment — no questions asked.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-4">
                {[
                  { icon: CreditCard, text: 'No credit card required to start', color: '#3b82f6' },
                  { icon: XCircle, text: 'Cancel anytime', color: '#ef4444' },
                  { icon: BadgeCheck, text: 'Zero risk', color: '#10b981' },
                ].map((badge) => {
                  const BIcon = badge.icon
                  return (
                    <motion.div
                      key={badge.text}
                      initial={{ opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                      className="flex items-center gap-2.5"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${badge.color}10` }}
                      >
                        <BIcon className="w-4 h-4" style={{ color: badge.color }} />
                      </div>
                      <span className="text-[13px] font-semibold text-gray-700">{badge.text}</span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ TRUST BANNER ═══════════ */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-3xl shadow-premium p-8 md:p-10"
          >
            <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  icon: Lock,
                  title: 'No data stored. Ever.',
                  desc: 'Your conversations are processed in real-time and immediately discarded. Zero retention.',
                  color: '#3b82f6',
                  bg: 'rgba(59,130,246,0.06)',
                },
                {
                  icon: Shield,
                  title: 'Crisis detection always active',
                  desc: 'Hardcoded safety layer that bypasses AI entirely. Active on every plan, no exceptions.',
                  color: '#ef4444',
                  bg: 'rgba(239,68,68,0.06)',
                },
                {
                  icon: Heart,
                  title: 'Built for the community',
                  desc: 'Free forever for individuals. Making resources accessible is our mission, not our upsell.',
                  color: '#10b981',
                  bg: 'rgba(16,185,129,0.06)',
                },
              ].map((item) => {
                const TIcon = item.icon
                return (
                  <div key={item.title} className="flex flex-col items-center text-center space-y-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: item.bg }}
                    >
                      <TIcon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{item.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed max-w-xs">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
              style={{
                background: 'linear-gradient(135deg, #2563EB 0%, #1e40af 40%, #312e81 100%)',
              }}
            >
              {/* Decorative glows */}
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2), transparent 60%)' }}
              />
              <div
                className="absolute bottom-0 left-0 w-60 h-60 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.3), transparent 60%)' }}
              />

              <div className="relative z-10 space-y-8">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  Start navigating with confidence
                </h2>
                <p className="text-[16px] sm:text-lg text-white/70 max-w-xl mx-auto">
                  Free forever. No credit card required. Crisis detection always on.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-blue-700 rounded-2xl bg-white hover:bg-gray-50 shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all active:scale-[0.97]"
                  >
                    Try the Demo
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-white/90 rounded-2xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="mt-auto sidebar-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-bold tracking-tight text-white">ClearPath AI</span>
              </div>
              <p className="text-[13px] text-gray-400 leading-relaxed">
                When it matters most, honesty is the safest answer.
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                Built for USAII Global AI Hackathon 2026
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Product</h4>
              <nav className="space-y-3">
                <Link href="/#how-it-works" className="block text-[14px] text-gray-400 hover:text-white transition-colors">How It Works</Link>
                <Link href="/pricing" className="block text-[14px] text-white font-medium">Pricing</Link>
                <Link href="/app" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Demo</Link>
              </nav>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Company</h4>
              <nav className="space-y-3">
                <Link href="/about" className="block text-[14px] text-gray-400 hover:text-white transition-colors">About</Link>
                <span className="block text-[14px] text-gray-400 hover:text-white transition-colors cursor-default">Responsible AI</span>
                <span className="block text-[14px] text-gray-400 hover:text-white transition-colors cursor-default">Team</span>
              </nav>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Legal</h4>
              <nav className="space-y-3">
                <span className="block text-[14px] text-gray-600 cursor-default">Privacy <span className="text-[10px] text-gray-700 bg-gray-800 px-1.5 py-0.5 rounded-md ml-1">Coming soon</span></span>
                <span className="block text-[14px] text-gray-600 cursor-default">Terms <span className="text-[10px] text-gray-700 bg-gray-800 px-1.5 py-0.5 rounded-md ml-1">Coming soon</span></span>
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-[12px] text-gray-500 text-center">
              &copy; 2026 ClearPath AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
