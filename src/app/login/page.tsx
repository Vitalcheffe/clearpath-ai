'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Layers, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Shield, Navigation } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

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
    { icon: Shield, text: 'Crisis detection always active' },
    { icon: Eye, text: 'Calibrated confidence scores' },
    { icon: Navigation, text: 'Human escalation at <70%' },
    { icon: Lock, text: 'No data stored, ever' },
  ]

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
          {/* Decorative blurred circles */}
          <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-[-60px] left-[-60px] w-80 h-80 rounded-full bg-indigo-400/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-blue-300/5 blur-2xl" />

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

            {/* Benefit cards */}
            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.text}
                  custom={i}
                  variants={benefitCardVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <benefit.icon className="w-4.5 h-4.5 text-white/80" strokeWidth={1.8} />
                  </div>
                  <span className="text-[14px] font-medium text-white/90">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 mt-10"
          >
            <div className="h-px bg-white/10 mb-6" />
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  'bg-emerald-400/70',
                  'bg-blue-400/70',
                  'bg-amber-400/70',
                  'bg-rose-400/70',
                ].map((color, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${color} border-2 border-indigo-900`}
                  />
                ))}
              </div>
              <p className="text-[13px] text-white/50 font-medium">
                Trusted by <span className="text-white/80 font-semibold">50,000+</span> users
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL — form area */}
        <motion.div
          variants={rightPanelVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 lg:w-[55%] flex items-center justify-center px-4 sm:px-6 lg:px-12 py-8"
        >
          <div className="w-full max-w-[440px]">
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

            {/* Form Card */}
            <div className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40">
              <div className="space-y-4">
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

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all mt-2"
                >
                  Log in
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200/60" />
                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-gray-200/60" />
              </div>

              {/* Social login buttons */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all text-[13px] font-medium text-gray-700">
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
                <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all text-[13px] font-medium text-gray-700">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21.5c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/></svg>
                  Continue with GitHub
                </button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                No data stored
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                <Lock className="w-3.5 h-3.5 text-blue-500" />
                End-to-end encrypted
              </div>
            </div>

            {/* Sign up link */}
            <p className="text-center text-[13px] text-gray-400 mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-500 transition-colors">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
