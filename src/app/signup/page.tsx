'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers, Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff, Check, CircleCheck,
  Shield, Navigation, Heart, Fingerprint, Globe, MapPin, ChevronDown, Sparkles,
  Clock, MessageSquare, Bell, Accessibility, Tag, Zap, Crown, Loader2
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useToast } from '@/hooks/use-toast'

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: '' }
  
  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' }
  if (score <= 2) return { score: 2, label: 'Fair', color: '#f97316' }
  if (score <= 3) return { score: 3, label: 'Good', color: '#f59e0b' }
  if (score <= 4) return { score: 4, label: 'Strong', color: '#22c55e' }
  return { score: 5, label: 'Very strong', color: '#10b981' }
}

function getCrackTime(password: string): string {
  if (!password) return ''
  let combinations = 0
  if (/[a-z]/.test(password)) combinations += 26
  if (/[A-Z]/.test(password)) combinations += 26
  if (/[0-9]/.test(password)) combinations += 10
  if (/[^A-Za-z0-9]/.test(password)) combinations += 32
  if (combinations === 0) return 'Instantly'
  const totalCombinations = Math.pow(combinations, password.length)
  const secondsToCrack = totalCombinations / 1e12
  if (secondsToCrack < 1) return 'Instantly'
  if (secondsToCrack < 60) return `${Math.round(secondsToCrack)} seconds`
  if (secondsToCrack < 3600) return `${Math.round(secondsToCrack / 60)} minutes`
  if (secondsToCrack < 86400) return `${Math.round(secondsToCrack / 3600)} hours`
  if (secondsToCrack < 86400 * 365) return `${Math.round(secondsToCrack / 86400)} days`
  if (secondsToCrack < 86400 * 365 * 100) return `${Math.round(secondsToCrack / (86400 * 365))} years`
  if (secondsToCrack < 86400 * 365 * 1e6) return `${Math.round(secondsToCrack / (86400 * 365 * 1000))} thousand years`
  return 'Millions of years'
}

const passwordRequirements = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

const interestCategories = [
  { id: 'housing', label: 'Housing', icon: '🏠' },
  { id: 'food', label: 'Food', icon: '🍎' },
  { id: 'mental-health', label: 'Mental Health', icon: '🧠' },
  { id: 'legal', label: 'Legal', icon: '⚖️' },
  { id: 'employment', label: 'Employment', icon: '💼' },
  { id: 'senior-services', label: 'Senior Services', icon: '👴' },
]

const hearAboutOptions = [
  'Search engine (Google, Bing)',
  'Social media',
  'Friend or family',
  'News article',
  'Community organization',
  'School or university',
  'Other',
]

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
  { value: 'zh', label: '中文' },
  { value: 'pt', label: 'Português' },
]

export default function SignupPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [username, setUsername] = useState('')
  const [location, setLocation] = useState('')
  const [language, setLanguage] = useState('en')
  const [hearAbout, setHearAbout] = useState('')
  const [ageVerified, setAgeVerified] = useState(false)
  const [interests, setInterests] = useState<string[]>([])
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(false)
  const [accessLargeText, setAccessLargeText] = useState(false)
  const [accessHighContrast, setAccessHighContrast] = useState(false)
  const [accessScreenReader, setAccessScreenReader] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const strength = useMemo(() => getPasswordStrength(password), [password])
  const crackTime = useMemo(() => getCrackTime(password), [password])

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const leftPanelVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const rightPanelVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 },
    },
  }

  const benefitItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.3 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  }

  const signupBenefits = [
    'Unlimited free resource searches',
    'Confidence scores on every result',
    '211 human navigator access 24/7',
    'Privacy-first — your data stays yours',
    'Crisis detection always active',
    'Community impact tracking',
  ]

  const toggleInterest = (id: string) => {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleSignup = async () => {
    // Validate
    if (!name || !email || !password || !confirmPassword) {
      setAuthError('Please fill in all required fields')
      return
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address')
      return
    }
    if (password !== confirmPassword) {
      setAuthError('Passwords don\'t match')
      return
    }
    if (password.length < 8) {
      setAuthError('Password must be at least 8 characters')
      return
    }
    if (!agreed) {
      setAuthError('You must agree to the Terms of Service and Privacy Policy')
      return
    }
    if (!ageVerified) {
      setAuthError('You must confirm you are 13 years or older')
      return
    }

    setIsLoading(true)
    setAuthError('')

    try {
      // Register the user
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          username,
          location,
          language,
          hearAbout,
          interests,
        }),
      })

      const registerData = await registerRes.json()

      if (!registerRes.ok) {
        setAuthError(registerData.error || 'Registration failed. Please try again.')
        setIsLoading(false)
        return
      }

      // Sign in with credentials
      const signInResult = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        // Registration succeeded but auto-login failed — redirect to login
        toast({ title: 'Account created!', description: 'Please log in with your new credentials.' })
        router.push('/login')
      } else if (signInResult?.ok) {
        router.push('/dashboard')
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 flex pt-16">
        {/* LEFT PANEL — hidden on mobile */}
        <motion.div
          variants={leftPanelVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex w-[45%] relative overflow-hidden flex-col justify-between p-10 xl:p-14"
          style={{
            background: 'linear-gradient(135deg, #1e3a5f 0%, #312e81 50%, #4338ca 100%)',
          }}
        >
          {/* Decorative animated gradient orbs */}
          <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-white/5 blur-3xl animate-pulse" />
          <div className="absolute bottom-[-60px] left-[-60px] w-96 h-96 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-blue-300/5 blur-2xl" />
          <div className="absolute top-1/4 right-1/4 w-36 h-36 rounded-full bg-emerald-400/5 blur-2xl subtle-float" />
          <div className="absolute bottom-1/3 right-1/5 w-44 h-44 rounded-full bg-pink-400/5 blur-2xl subtle-float" style={{ animationDelay: '1.2s' }} />

          {/* Animated illustration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] opacity-[0.04]">
            <div className="absolute inset-0 rounded-full border-2 border-white" />
            <div className="absolute inset-10 rounded-full border border-white" />
            <div className="absolute inset-20 rounded-full border border-white/50" />
            <div className="absolute inset-[80px] rounded-full bg-white/20" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/30" />
              <div className="absolute bottom-2 left-1/4 w-1.5 h-1.5 rounded-full bg-emerald-300/20" />
            </motion.div>
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-[17px] font-bold tracking-tight text-white">ClearPath AI</span>
            </div>

            {/* Join counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm mb-6"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-[13px] text-white/80 font-medium">
                Built for <span className="text-white font-bold">community impact</span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[26px] xl:text-[30px] font-bold leading-snug text-white mb-3"
            >
              Join the honest AI movement
            </motion.h2>
            <p className="text-[14px] text-white/50 mb-10 leading-relaxed">
              Access life-saving resources with confidence scores, crisis detection, and human support — all in one place.
            </p>

            {/* Benefit items — 6 total */}
            <div className="space-y-3">
              {signupBenefits.map((text, i) => (
                <motion.div
                  key={text}
                  custom={i}
                  variants={benefitItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15 card-shine relative overflow-hidden"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center shrink-0">
                    <CircleCheck className="w-4.5 h-4.5 text-emerald-300" strokeWidth={2} />
                  </div>
                  <span className="text-[14px] font-medium text-white/90">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom section: testimonial + free badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 mt-10"
          >
            {/* Testimonial quote — expanded */}
            <div className="px-5 py-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 mb-5">
              <p className="text-[14px] text-white/70 italic leading-relaxed mb-3">
                &ldquo;ClearPath is the first AI tool I&apos;d actually recommend to clients. The transparency in confidence scores and the built-in crisis detection make it trustworthy in ways other tools simply aren&apos;t.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/30 flex items-center justify-center text-[12px] font-bold text-white">
                  S
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white/80">Sarah M.</p>
                  <p className="text-[11px] text-white/40">Licensed Social Worker · 12 years experience</p>
                </div>
              </div>
            </div>

            {/* Free forever badge */}
            <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20">
              <Crown className="w-4 h-4 text-emerald-300" />
              <span className="text-[13px] font-semibold text-emerald-200">Free forever. No credit card required.</span>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL — form area */}
        <motion.div
          variants={rightPanelVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 lg:w-[55%] flex flex-col items-center justify-start px-4 sm:px-6 lg:px-12 py-8 overflow-y-auto"
        >
          <div className="w-full max-w-[480px] my-auto">
            {/* Logo for mobile */}
            <div className="text-center mb-6 lg:hidden">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center mx-auto shadow-premium-xl mb-5"
              >
                <Layers className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">Create your account</h1>
              <p className="text-[15px] text-gray-500 mt-2">Get started with ClearPath AI</p>
            </div>

            {/* Desktop heading */}
            <div className="hidden lg:block mb-6">
              <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">Create your account</h1>
              <p className="text-[15px] text-gray-500 mt-2">Get started with ClearPath AI</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
                  step === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'
                }`}>
                  {step === 1 ? '1' : <Check className="w-3.5 h-3.5" />}
                </div>
                <span className={`text-[13px] font-semibold ${step === 1 ? 'text-gray-900' : 'text-gray-400'}`}>Account</span>
              </div>
              <div className={`flex-1 h-0.5 rounded-full ${step === 2 ? 'bg-emerald-400' : 'bg-gray-200'}`} />
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold ${
                  step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  2
                </div>
                <span className={`text-[13px] font-semibold ${step === 2 ? 'text-gray-900' : 'text-gray-400'}`}>Preferences</span>
              </div>
            </div>

            {/* Form Card */}
            <div className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40 relative overflow-hidden">
              {/* Animated security shield background */}
              <div className="absolute -right-8 -top-8 w-36 h-36 opacity-[0.03]">
                <Shield className="w-36 h-36 text-gray-900" />
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Full name</label>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          focused === 'name' 
                            ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white' 
                            : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}>
                          <User className={`w-4 h-4 shrink-0 ${focused === 'name' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <input
                            type="text"
                            placeholder="Amine Harch El Korane"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onFocus={() => setFocused('name')}
                            onBlur={() => setFocused(null)}
                            className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-300 outline-none font-medium"
                          />
                        </div>
                      </div>

                      {/* Username / Nickname */}
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Username <span className="text-gray-400 normal-case font-normal">(nickname)</span></label>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          focused === 'username' 
                            ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white' 
                            : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}>
                          <Tag className={`w-4 h-4 shrink-0 ${focused === 'username' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocused('username')}
                            onBlur={() => setFocused(null)}
                            className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-300 outline-none font-medium"
                          />
                        </div>
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Email</label>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          focused === 'email' 
                            ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white' 
                            : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}>
                          <Mail className={`w-4 h-4 shrink-0 ${focused === 'email' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onFocus={() => setFocused('email')}
                            onBlur={() => setFocused(null)}
                            className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-300 outline-none font-medium"
                          />
                        </div>
                      </div>

                      {/* Location / ZIP code */}
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Location / ZIP code <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          focused === 'location' 
                            ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white' 
                            : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}>
                          <MapPin className={`w-4 h-4 shrink-0 ${focused === 'location' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <input
                            type="text"
                            placeholder="e.g. 10001 or New York, NY"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onFocus={() => setFocused('location')}
                            onBlur={() => setFocused(null)}
                            className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-300 outline-none font-medium"
                          />
                        </div>
                      </div>

                      {/* Preferred Language */}
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Preferred language</label>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          focused === 'language'
                            ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white'
                            : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}>
                          <Globe className={`w-4 h-4 shrink-0 ${focused === 'language' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            onFocus={() => setFocused('language')}
                            onBlur={() => setFocused(null)}
                            className="flex-1 bg-transparent text-[14px] text-gray-900 outline-none font-medium appearance-none cursor-pointer"
                          >
                            {languageOptions.map((lang) => (
                              <option key={lang.value} value={lang.value}>{lang.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                        </div>
                      </div>

                      {/* How did you hear about us? */}
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">How did you hear about us?</label>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          focused === 'hearAbout'
                            ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white'
                            : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}>
                          <MessageSquare className={`w-4 h-4 shrink-0 ${focused === 'hearAbout' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <select
                            value={hearAbout}
                            onChange={(e) => setHearAbout(e.target.value)}
                            onFocus={() => setFocused('hearAbout')}
                            onBlur={() => setFocused(null)}
                            className="flex-1 bg-transparent text-[14px] text-gray-900 outline-none font-medium appearance-none cursor-pointer"
                          >
                            <option value="">Select an option</option>
                            {hearAboutOptions.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Password</label>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          focused === 'password' 
                            ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white' 
                            : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}>
                          <Lock className={`w-4 h-4 shrink-0 ${focused === 'password' ? 'text-blue-500' : 'text-gray-400'}`} />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocused('password')}
                            onBlur={() => setFocused(null)}
                            className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-300 outline-none font-medium"
                          />
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {/* Password Strength Indicator */}
                        {password.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2 pt-1"
                          >
                            <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className="h-1 flex-1 rounded-full transition-all duration-300"
                                  style={{
                                    backgroundColor: strength.score >= level ? strength.color : '#e5e7eb',
                                  }}
                                />
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-medium" style={{ color: strength.color }}>
                                {strength.label}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                Est. crack time: {crackTime}
                              </p>
                            </div>
                            {/* Requirements checklist */}
                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              {passwordRequirements.map((req) => (
                                <div key={req.label} className="flex items-center gap-1.5">
                                  <motion.div
                                    initial={false}
                                    animate={{ scale: req.test(password) ? 1 : 0.8 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                                      req.test(password) ? 'bg-emerald-500' : 'bg-gray-200'
                                    }`}
                                  >
                                    {req.test(password) && (
                                      <Check className="w-2 h-2 text-white" />
                                    )}
                                  </motion.div>
                                  <span className={`text-[11px] font-medium ${
                                    req.test(password) ? 'text-emerald-600' : 'text-gray-400'
                                  }`}>
                                    {req.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Confirm password</label>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                          focused === 'confirmPassword' 
                            ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white' 
                            : confirmPassword && confirmPassword !== password
                              ? 'border-red-200 bg-white/60'
                              : 'border-gray-200 bg-white/60 hover:border-gray-300'
                        }`}>
                          <Lock className={`w-4 h-4 shrink-0 ${
                            focused === 'confirmPassword' 
                              ? 'text-blue-500' 
                              : confirmPassword && confirmPassword !== password 
                                ? 'text-red-400' 
                                : 'text-gray-400'
                          }`} />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onFocus={() => setFocused('confirmPassword')}
                            onBlur={() => setFocused(null)}
                            className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-300 outline-none font-medium"
                          />
                          {confirmPassword && confirmPassword === password && (
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          )}
                          <button 
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {confirmPassword && confirmPassword !== password && (
                          <p className="text-[11px] text-red-500 font-medium">Passwords don&apos;t match</p>
                        )}
                      </div>

                      {/* Terms Checkbox */}
                      <div className="flex items-start gap-3 pt-1">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={agreed}
                          onClick={() => setAgreed(!agreed)}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all duration-200 ${
                            agreed 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}
                        >
                          {agreed && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <p className="text-[12px] text-gray-500 leading-relaxed">
                          I agree to the{' '}
                          <Link href="/terms" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">Terms of Service</Link>
                          {' '}and{' '}
                          <Link href="/privacy" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">Privacy Policy</Link>
                          , including the data processing terms
                        </p>
                      </div>

                      {/* Age Verification Checkbox */}
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={ageVerified}
                          onClick={() => setAgeVerified(!ageVerified)}
                          className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all duration-200 ${
                            ageVerified 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}
                        >
                          {ageVerified && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <p className="text-[12px] text-gray-500 leading-relaxed">
                          I am <span className="font-semibold text-gray-700">13 years or older</span>
                        </p>
                      </div>

                      {/* Next Step Button */}
                      <motion.button
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        onClick={() => setStep(2)}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold text-white rounded-xl transition-all mt-2 ${
                          agreed && ageVerified
                            ? 'bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                        disabled={!agreed || !ageVerified}
                      >
                        Next: Set preferences
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-gray-200/60" />
                      <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">or sign up with</span>
                      <div className="flex-1 h-px bg-gray-200/60" />
                    </div>

                    {/* Social login buttons */}
                    <div className="space-y-3">
                      <button
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all text-[13px] font-medium text-gray-700"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Continue with Google
                      </button>
                      <button
                        onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all text-[13px] font-medium text-gray-700"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21.5c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
                        Continue with GitHub
                      </button>
                      <button
                        onClick={() => toast({ title: 'Coming soon', description: 'Apple login will be available soon.' })}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all text-[13px] font-medium text-gray-700"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                        Continue with Apple
                      </button>
                    </div>

                    {/* Continue as guest */}
                    <div className="mt-4">
                      <Link
                        href="/app"
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-gray-200 bg-white/30 hover:bg-white/60 hover:border-gray-300 transition-all text-[13px] font-medium text-gray-500 hover:text-gray-700"
                      >
                        <User className="w-4 h-4" />
                        Continue as guest — no account needed
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-5">
                      {/* Interest Categories */}
                      <div>
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider mb-3 block">
                          What are you looking for help with?
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {interestCategories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => toggleInterest(cat.id)}
                              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all text-left ${
                                interests.includes(cat.id)
                                  ? 'border-blue-300 bg-blue-50/60 shadow-[0_0_0_3px_rgba(59,130,246,0.08)]'
                                  : 'border-gray-200 bg-white/60 hover:border-gray-300'
                              }`}
                            >
                              <span className="text-[16px]">{cat.icon}</span>
                              <span className={`text-[13px] font-medium ${
                                interests.includes(cat.id) ? 'text-blue-700' : 'text-gray-700'
                              }`}>
                                {cat.label}
                              </span>
                              {interests.includes(cat.id) && (
                                <Check className="w-3.5 h-3.5 text-blue-500 ml-auto shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notification Preferences */}
                      <div>
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider mb-3 block">
                          Notification preferences
                        </label>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white/60">
                            <div className="flex items-center gap-2.5">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-[13px] font-medium text-gray-700">Email notifications</span>
                            </div>
                            <button
                              onClick={() => setNotifEmail(!notifEmail)}
                              className={`w-10 h-5.5 rounded-full transition-all duration-200 relative ${
                                notifEmail ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                              style={{ width: '40px', height: '22px' }}
                            >
                              <motion.div
                                animate={{ x: notifEmail ? 20 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
                              />
                            </button>
                          </div>
                          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white/60">
                            <div className="flex items-center gap-2.5">
                              <Bell className="w-4 h-4 text-gray-400" />
                              <span className="text-[13px] font-medium text-gray-700">Push notifications</span>
                            </div>
                            <button
                              onClick={() => setNotifPush(!notifPush)}
                              className={`w-10 h-5.5 rounded-full transition-all duration-200 relative ${
                                notifPush ? 'bg-blue-600' : 'bg-gray-300'
                              }`}
                              style={{ width: '40px', height: '22px' }}
                            >
                              <motion.div
                                animate={{ x: notifPush ? 20 : 2 }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Accessibility Needs */}
                      <div>
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider mb-3 block">
                          <Accessibility className="w-3.5 h-3.5 inline mr-1.5" />
                          Accessibility needs <span className="text-gray-400 normal-case font-normal">(optional)</span>
                        </label>
                        <div className="space-y-2.5">
                          {[
                            { label: 'Large text', state: accessLargeText, setter: setAccessLargeText },
                            { label: 'High contrast mode', state: accessHighContrast, setter: setAccessHighContrast },
                            { label: 'Screen reader optimization', state: accessScreenReader, setter: setAccessScreenReader },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white/60">
                              <span className="text-[13px] font-medium text-gray-700">{item.label}</span>
                              <button
                                onClick={() => item.setter(!item.state)}
                                className={`w-10 h-5.5 rounded-full transition-all duration-200 relative ${
                                  item.state ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                                style={{ width: '40px', height: '22px' }}
                              >
                                <motion.div
                                  animate={{ x: item.state ? 20 : 2 }}
                                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                  className="absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm"
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Error message */}
                      {authError && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100"
                        >
                          <Shield className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-[13px] text-red-600 font-medium">{authError}</span>
                        </motion.div>
                      )}

                      {/* Create Account Button */}
                      <motion.button
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        onClick={handleSignup}
                        disabled={isLoading}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold text-white rounded-xl transition-all mt-2 ${
                          isLoading
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create account
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>

                      {/* Back */}
                      <button
                        onClick={() => setStep(1)}
                        className="w-full text-center text-[13px] text-gray-500 font-medium hover:text-gray-700 transition-colors"
                      >
                        ← Back to account details
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Privacy by design
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Lock className="w-3.5 h-3.5 text-blue-500" />
                End-to-end encrypted
              </div>
            </div>

            {/* Login link */}
            <p className="text-center text-[13px] text-gray-400 mt-6 pb-4">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-500 transition-colors">Log in</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
