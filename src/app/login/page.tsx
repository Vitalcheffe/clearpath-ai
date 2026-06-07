'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Shield, Navigation,
  Heart, Fingerprint, KeyRound, User, ChevronDown, ChevronUp, Zap, Globe,
  LockKeyhole, Sparkles, Clock, MessageSquare, Loader2
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const [showWhyAccount, setShowWhyAccount] = useState(false)
  const [loginMethod, setLoginMethod] = useState<'password' | 'magic' | 'otp'>('password')
  const [encryptedPulse, setEncryptedPulse] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setEncryptedPulse(prev => !prev)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setIsLoading(true)
    setAuthError('')
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setAuthError(result.error === 'CredentialsSignin' ? 'Invalid email or password' : result.error)
        setIsLoading(false)
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch {
      setAuthError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

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

  const benefitCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, delay: 0.3 + i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  }

  const benefits = [
    { icon: Shield, text: 'Crisis detection always active', color: 'bg-red-400/20' },
    { icon: Eye, text: 'Honest confidence scores', color: 'bg-blue-400/20' },
    { icon: Navigation, text: 'Human escalation at <70%', color: 'bg-amber-400/20' },
    { icon: Lock, text: 'Privacy by design', color: 'bg-emerald-400/20' },
    { icon: Heart, text: 'Community impact tracking', color: 'bg-pink-400/20' },
    { icon: Fingerprint, text: 'End-to-end encrypted sessions', color: 'bg-violet-400/20' },
  ]

  const avatarColors = [
    'bg-emerald-400/70', 'bg-blue-400/70', 'bg-amber-400/70',
    'bg-rose-400/70', 'bg-violet-400/70', 'bg-cyan-400/70',
  ]

  const avatarInitials = ['A', 'S', 'M', 'J', 'R', 'K']

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
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-emerald-400/5 blur-2xl subtle-float" />
          <div className="absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-violet-400/5 blur-2xl subtle-float" style={{ animationDelay: '1s' }} />

          {/* Animated illustration area */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] opacity-[0.04]">
            <div className="absolute inset-0 rounded-full border-2 border-white" />
            <div className="absolute inset-8 rounded-full border border-white" />
            <div className="absolute inset-16 rounded-full border border-white/60" />
            <div className="absolute inset-[88px] rounded-full bg-white/30" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/40" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-4"
            >
              <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 rounded-full bg-emerald-300/30" />
            </motion.div>
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="text-[17px] font-bold tracking-tight text-white">ClearPath AI</span>
            </div>

            {/* Tagline */}
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[26px] xl:text-[30px] font-bold leading-snug text-white mb-3"
            >
              When it matters most, honesty is the safest answer.
            </motion.h2>
            <p className="text-[14px] text-white/50 mb-10 leading-relaxed">
              AI-powered crisis resource navigation with built-in safety guardrails and human oversight.
            </p>

            {/* Benefit cards — 6 total */}
            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.text}
                  custom={i}
                  variants={benefitCardVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15 card-shine relative overflow-hidden"
                >
                  <div className={`w-9 h-9 rounded-lg ${benefit.color} flex items-center justify-center shrink-0`}>
                    <benefit.icon className="w-4.5 h-4.5 text-white/80" strokeWidth={1.8} />
                  </div>
                  <span className="text-[14px] font-medium text-white/90">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom section: testimonial + trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 mt-10"
          >
            {/* Testimonial quote */}
            <div className="px-5 py-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 mb-6">
              <p className="text-[14px] text-white/70 italic leading-relaxed mb-3">
                &ldquo;ClearPath helped me find emergency housing in under 5 minutes. The confidence scores made me trust the results immediately.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/30 flex items-center justify-center text-[12px] font-bold text-white">
                  M
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white/80">Maria G.</p>
                  <p className="text-[11px] text-white/40">Community Advocate</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/10 mb-6" />

            {/* Trusted by + real avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {avatarColors.map((color, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${color} border-2 border-indigo-900 flex items-center justify-center text-[9px] font-bold text-white/90`}
                  >
                    {avatarInitials[i]}
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-white/50 font-medium">
                Trusted by <span className="text-white/80 font-semibold">community</span> navigators
              </p>
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
          <div className="w-full max-w-[440px] my-auto">
            {/* Logo for mobile */}
            <div className="text-center mb-8 lg:hidden">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center mx-auto shadow-premium-xl mb-5"
              >
                <Layers className="w-6 h-6 text-white" />
              </motion.div>
              <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">Welcome back</h1>
              <p className="text-[15px] text-gray-500 mt-2">Log in to ClearPath AI</p>
            </div>

            {/* Desktop heading */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">Welcome back</h1>
              <p className="text-[15px] text-gray-500 mt-2">Log in to ClearPath AI</p>
            </div>

            {/* Encrypted session indicator */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="flex items-center justify-center gap-2 mb-5"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
                <motion.div
                  animate={{ scale: encryptedPulse ? 1 : 0.85 }}
                  transition={{ duration: 0.5 }}
                >
                  <LockKeyhole className="w-3 h-3 text-emerald-600" />
                </motion.div>
                <span className="text-[11px] font-semibold text-emerald-700">Your session is encrypted</span>
                <motion.div
                  animate={{ opacity: encryptedPulse ? 1 : 0.4 }}
                  transition={{ duration: 0.5 }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                />
              </div>
            </motion.div>

            {/* Form Card */}
            <div className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40 relative overflow-hidden">
              {/* Animated security shield background */}
              <div className="absolute -right-6 -top-6 w-32 h-32 opacity-[0.03]">
                <Shield className="w-32 h-32 text-gray-900" />
              </div>

              {/* Login method tabs */}
              <div className="flex gap-1 p-1 bg-gray-100/60 rounded-xl mb-6">
                {[
                  { key: 'password' as const, label: 'Password', icon: Lock },
                  { key: 'magic' as const, label: 'Magic Link', icon: Sparkles, comingSoon: true },
                  { key: 'otp' as const, label: 'Passcode', icon: KeyRound, comingSoon: true },
                ].map((method) => (
                  <button
                    key={method.key}
                    onClick={() => setLoginMethod(method.key)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all ${
                      loginMethod === method.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <method.icon className="w-3.5 h-3.5" />
                    {method.label}
                    {'comingSoon' in method && (
                      <span className="ml-0.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-amber-100 text-amber-700 border border-amber-200">Soon</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Email — always shown */}
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

                {/* Password method */}
                <AnimatePresence mode="wait">
                  {loginMethod === 'password' && (
                    <motion.div
                      key="password-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      {/* Password */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Password</label>
                          <Link href="/forgot-password" className="text-[12px] font-medium text-blue-600 hover:text-blue-500 transition-colors">Forgot password?</Link>
                        </div>
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
                      </div>

                      {/* Remember me */}
                      <div className="flex items-center gap-3 pt-1">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={rememberMe}
                          onClick={() => setRememberMe(!rememberMe)}
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all duration-200 ${
                            rememberMe 
                              ? 'bg-blue-600 border-blue-600' 
                              : 'border-gray-300 bg-white hover:border-gray-400'
                          }`}
                        >
                          {rememberMe && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <label className="text-[13px] text-gray-600 font-medium cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
                          Remember me
                        </label>
                      </div>

                      {/* Error message */}
                      {authError && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-100 mt-2"
                        >
                          <Shield className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-[13px] text-red-600 font-medium">{authError}</span>
                        </motion.div>
                      )}

                      {/* Submit */}
                      <motion.button
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        onClick={handlePasswordSubmit}
                        disabled={isLoading || !email || !password}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold text-white rounded-xl transition-all mt-2 ${
                          isLoading || !email || !password
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          <>
                            Log in
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}

                  {/* Magic link method */}
                  {loginMethod === 'magic' && (
                    <motion.div
                      key="magic-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100/60">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                          <p className="text-[13px] text-blue-700/80 leading-relaxed">
                            We&apos;ll send a magic link to your email. Click it and you&apos;re signed in — no password required.
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 transition-all mt-2 cursor-not-allowed opacity-50"
                      >
                        Send magic link
                        <Sparkles className="w-4 h-4" />
                      </motion.button>
                      <p className="text-[12px] text-gray-400 text-center mt-2">This login method is coming soon. Use password login for now.</p>
                    </motion.div>
                  )}

                  {/* OTP method */}
                  {loginMethod === 'otp' && (
                    <motion.div
                      key="otp-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-100/60">
                        <div className="flex items-start gap-3">
                          <KeyRound className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                          <p className="text-[13px] text-violet-700/80 leading-relaxed">
                            We&apos;ll send a 6-digit one-time passcode to your email. Enter it below to sign in securely.
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">One-time passcode</label>
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white/60">
                          <KeyRound className="w-4 h-4 text-gray-400 shrink-0" />
                          <input
                            type="text"
                            placeholder="000000"
                            maxLength={6}
                            className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-300 outline-none font-medium tracking-[0.3em] text-center"
                          />
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20 transition-all mt-2 cursor-not-allowed opacity-50"
                      >
                        Send passcode
                        <KeyRound className="w-4 h-4" />
                      </motion.button>
                      <p className="text-[12px] text-gray-400 text-center mt-2">This login method is coming soon. Use password login for now.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200/60" />
                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">or</span>
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
                  Continue as guest
                </Link>
              </div>
            </div>

            {/* Why create an account? expandable section */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="mt-5"
            >
              <button
                onClick={() => setShowWhyAccount(!showWhyAccount)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-100 bg-white/40 hover:bg-white/60 transition-all text-left"
              >
                <span className="text-[13px] font-semibold text-gray-600">Why create an account?</span>
                {showWhyAccount ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>
              <AnimatePresence>
                {showWhyAccount && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pt-3 pb-1 space-y-2.5">
                      {[
                        { icon: Clock, text: 'Save your conversation history across sessions' },
                        { icon: Navigation, text: 'Get personalized resource recommendations' },
                        { icon: ShieldCheck, text: 'Crisis detection follows you wherever you go' },
                        { icon: Globe, text: 'Access your saved resources from any device' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5">
                          <item.icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="text-[12px] text-gray-600 leading-relaxed">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Security Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-6"
            >
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Lock, label: 'End-to-end encryption', color: 'text-blue-500 bg-blue-50' },
                  { icon: ShieldCheck, label: 'Privacy-first design', color: 'text-emerald-500 bg-emerald-50' },
                  { icon: Shield, label: 'Crisis detection always active', color: 'text-red-500 bg-red-50' },
                  { icon: Heart, label: 'COPPA conscious', color: 'text-pink-500 bg-pink-50' },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/60 border border-gray-100/60">
                    <div className={`w-6 h-6 rounded-md ${badge.color} flex items-center justify-center shrink-0`}>
                      <badge.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 leading-tight">{badge.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="mt-5"
            >
              <div className="px-5 py-5 rounded-xl border border-gray-100/60 bg-white/40">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Recent Activity</span>
                </div>
                <div className="flex flex-col items-center py-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-gray-300" />
                  </div>
                  <p className="text-[13px] text-gray-400 font-medium">Your recent conversations will appear here after login</p>
                </div>
              </div>
            </motion.div>

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

            {/* Sign up link */}
            <p className="text-center text-[13px] text-gray-400 mt-6 pb-4">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-500 transition-colors">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
