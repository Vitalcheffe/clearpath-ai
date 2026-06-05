'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Layers, Mail, Lock, User, ArrowRight, ShieldCheck, Eye, EyeOff, Check, CircleCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'

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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const strength = useMemo(() => getPasswordStrength(password), [password])

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
    'Zero data storage — your privacy guaranteed',
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

            {/* Benefit items */}
            <div className="space-y-3">
              {signupBenefits.map((text, i) => (
                <motion.div
                  key={text}
                  custom={i}
                  variants={benefitItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 transition-all hover:bg-white/15"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center shrink-0">
                    <CircleCheck className="w-4.5 h-4.5 text-emerald-300" strokeWidth={2} />
                  </div>
                  <span className="text-[14px] font-medium text-white/90">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="relative z-10 mt-10"
          >
            <div className="h-px bg-white/10 mb-6" />
            <div className="px-5 py-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-[14px] text-white/70 italic leading-relaxed mb-3">
                &ldquo;ClearPath is the first AI tool I&apos;d actually recommend to clients.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-400/30 flex items-center justify-center text-[12px] font-bold text-white">
                  S
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white/80">Sarah M.</p>
                  <p className="text-[11px] text-white/40">Social Worker</p>
                </div>
              </div>
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
              <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">Create your account</h1>
              <p className="text-[15px] text-gray-500 mt-2">Get started with ClearPath AI</p>
            </div>

            {/* Desktop heading */}
            <div className="hidden lg:block mb-8">
              <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">Create your account</h1>
              <p className="text-[15px] text-gray-500 mt-2">Get started with ClearPath AI</p>
            </div>

            {/* Form Card */}
            <div className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40">
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
                      className="space-y-1.5 pt-1"
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
                      <p className="text-[11px] font-medium" style={{ color: strength.color }}>
                        {strength.label}
                      </p>
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
                    <button type="button" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">Terms of Service</button>
                    {' '}and{' '}
                    <button type="button" className="text-blue-600 font-medium hover:text-blue-500 transition-colors">Privacy Policy</button>
                  </p>
                </div>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold text-white rounded-xl transition-all mt-2 ${
                    agreed 
                      ? 'bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!agreed}
                >
                  Create account
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

            {/* Login link */}
            <p className="text-center text-[13px] text-gray-400 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-500 transition-colors">Log in</Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
