'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers, Mail, ArrowRight, ArrowLeft, ShieldCheck, Lock, CheckCircle, Eye, EyeOff,
  Check, Shield, Clock, AlertTriangle, HelpCircle, RefreshCw, KeyRound, LogOut
} from 'lucide-react'
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

const passwordRequirements = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

const troubleshootingTips = [
  {
    title: "Can't find the email?",
    content: 'Check your spam or junk folder. The email comes from noreply@clearpath-ai.org. Add this address to your contacts to ensure delivery.',
  },
  {
    title: 'Link expired?',
    content: 'Reset links expire after 24 hours for security. Click "Resend email" below to get a fresh link.',
  },
  {
    title: 'Still having trouble?',
    content: 'Contact our support team at team@clearpath-ai.org. We typically respond within 24 hours.',
  },
]

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false)
  const [signOutAllDevices, setSignOutAllDevices] = useState(true)
  const [expandedTip, setExpandedTip] = useState<number | null>(null)
  const [captchaChecked, setCaptchaChecked] = useState(false)

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword])

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && captchaChecked) {
      setCurrentStep(2)
      setResendCountdown(60)
    }
  }

  const handleResend = () => {
    setResendCountdown(60)
  }

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword && confirmNewPassword && newPassword === confirmNewPassword) {
      setCurrentStep(4)
    }
  }

  const steps = [
    { number: 1, label: 'Enter Email' },
    { number: 2, label: 'Check Inbox' },
    { number: 3, label: 'Reset Password' },
    { number: 4, label: 'Success' },
  ]

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[460px]"
        >
          {/* Logo */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center mx-auto shadow-premium-xl mb-5"
            >
              <Layers className="w-6 h-6 text-white" />
            </motion.div>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-5">
              {steps.map((s, i) => (
                <div key={s.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${
                      currentStep > s.number
                        ? 'bg-emerald-500 text-white'
                        : currentStep === s.number
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      {currentStep > s.number ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        s.number
                      )}
                    </div>
                    <span className={`text-[9px] font-medium mt-1 ${
                      currentStep >= s.number ? 'text-gray-700' : 'text-gray-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-6 h-0.5 mx-1 mt-[-12px] rounded-full ${
                      currentStep > s.number ? 'bg-emerald-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <h1 className="text-[26px] font-extrabold tracking-tight text-gray-900">
              {currentStep === 1 && 'Reset password'}
              {currentStep === 2 && 'Check your email'}
              {currentStep === 3 && 'Create new password'}
              {currentStep === 4 && 'Password changed!'}
            </h1>
            <p className="text-[14px] text-gray-500 mt-2">
              {currentStep === 1 && "Enter your email and we'll send you a reset link"}
              {currentStep === 2 && `We sent a reset link to ${email}`}
              {currentStep === 3 && 'Choose a strong new password for your account'}
              {currentStep === 4 && 'Your password has been successfully changed'}
            </p>
          </div>

          {/* Card */}
          <AnimatePresence mode="wait">
            {/* STEP 1: Enter Email */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40"
              >
                <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                        required
                      />
                    </div>
                  </div>

                  {/* CAPTCHA placeholder */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Verification</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white/60">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={captchaChecked}
                        onClick={() => setCaptchaChecked(!captchaChecked)}
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border-2 transition-all duration-200 ${
                          captchaChecked 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        {captchaChecked && <Check className="w-3 h-3 text-white" />}
                      </button>
                      <span className="text-[13px] text-gray-600 font-medium">I&apos;m not a robot</span>
                      <div className="ml-auto flex flex-col items-end">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className="text-[8px] text-gray-400">reCAPTCHA</span>
                      </div>
                    </div>
                  </div>

                  {/* Security notices */}
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-amber-50/60 border border-amber-100/60">
                      <Clock className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-[11px] text-amber-700/80 leading-relaxed">This link expires in 24 hours for your security</span>
                    </div>
                    <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50/60 border border-gray-100/60">
                      <AlertTriangle className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                      <span className="text-[11px] text-gray-500 leading-relaxed">If you didn&apos;t request this, you can safely ignore this email</span>
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    disabled={!captchaChecked || !email}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold rounded-xl transition-all mt-2 ${
                      captchaChecked && email
                        ? 'text-white bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
                        : 'text-white/60 bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Send reset link
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>

                {/* Back to login */}
                <div className="mt-6 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to login
                  </Link>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Check Inbox */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Email sent illustration */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                    className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 18 }}
                    >
                      <Mail className="w-8 h-8 text-blue-500" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  >
                    <h2 className="text-[20px] font-bold text-gray-900 mb-2">Check your inbox</h2>
                    <p className="text-[14px] text-gray-500 leading-relaxed max-w-[300px]">
                      We&apos;ve sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>. Please check your inbox and spam folder.
                    </p>
                  </motion.div>

                  {/* Email illustration card */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="w-full mt-6 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                        <Mail className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-[12px] font-semibold text-gray-700 truncate">ClearPath AI</p>
                        <p className="text-[11px] text-gray-400 truncate">Password reset request</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Just now</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Resend with countdown */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.4 }}
                    className="w-full mt-5 space-y-3"
                  >
                    <button
                      onClick={handleResend}
                      disabled={resendCountdown > 0}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-semibold rounded-xl transition-all ${
                        resendCountdown > 0
                          ? 'text-gray-400 border border-gray-200 bg-gray-50/60 cursor-not-allowed'
                          : 'text-blue-600 border border-blue-200 bg-blue-50/60 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <RefreshCw className={`w-4 h-4 ${resendCountdown > 0 ? '' : ''}`} />
                      {resendCountdown > 0
                        ? `Resend email in ${resendCountdown}s`
                        : "Didn't receive it? Resend"
                      }
                    </button>

                    {/* Try another email */}
                    <button
                      onClick={() => { setCurrentStep(1); setEmail(''); setCaptchaChecked(false) }}
                      className="w-full text-center text-[13px] text-gray-500 font-medium hover:text-gray-700 transition-colors"
                    >
                      Try another email address
                    </button>

                    {/* Simulate clicking the link (demo) */}
                    <motion.button
                      whileHover={{ scale: 1.005 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => setCurrentStep(3)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                    >
                      I clicked the reset link
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </motion.div>

                  <div className="mt-4">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to login
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: New Password */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40"
              >
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">New password</label>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                      focused === 'newPassword'
                        ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white'
                        : 'border-gray-200 bg-white/60 hover:border-gray-300'
                    }`}>
                      <KeyRound className={`w-4 h-4 shrink-0 ${focused === 'newPassword' ? 'text-blue-500' : 'text-gray-400'}`} />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onFocus={() => setFocused('newPassword')}
                        onBlur={() => setFocused(null)}
                        className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-300 outline-none font-medium"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {/* Password Strength Meter */}
                    {newPassword.length > 0 && (
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
                        <p className="text-[11px] font-medium" style={{ color: strength.color }}>
                          {strength.label}
                        </p>
                        {/* Requirements checklist */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {passwordRequirements.map((req) => (
                            <div key={req.label} className="flex items-center gap-1.5">
                              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                                req.test(newPassword) ? 'bg-emerald-500' : 'bg-gray-200'
                              }`}>
                                {req.test(newPassword) && <Check className="w-2 h-2 text-white" />}
                              </div>
                              <span className={`text-[11px] font-medium ${
                                req.test(newPassword) ? 'text-emerald-600' : 'text-gray-400'
                              }`}>
                                {req.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-semibold text-gray-700 uppercase tracking-wider">Confirm new password</label>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                      focused === 'confirmNewPassword'
                        ? 'border-blue-300 shadow-[0_0_0_3px_rgba(59,130,246,0.08)] bg-white'
                        : confirmNewPassword && confirmNewPassword !== newPassword
                          ? 'border-red-200 bg-white/60'
                          : 'border-gray-200 bg-white/60 hover:border-gray-300'
                    }`}>
                      <Lock className={`w-4 h-4 shrink-0 ${
                        focused === 'confirmNewPassword'
                          ? 'text-blue-500'
                          : confirmNewPassword && confirmNewPassword !== newPassword
                            ? 'text-red-400'
                            : 'text-gray-400'
                      }`} />
                      <input
                        type={showConfirmNewPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        onFocus={() => setFocused('confirmNewPassword')}
                        onBlur={() => setFocused(null)}
                        className="flex-1 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-300 outline-none font-medium"
                        required
                      />
                      {confirmNewPassword && confirmNewPassword === newPassword && (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      <button
                        type="button"
                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmNewPassword && confirmNewPassword !== newPassword && (
                      <p className="text-[11px] text-red-500 font-medium">Passwords don&apos;t match</p>
                    )}
                  </div>

                  {/* Password requirements */}
                  <div className="p-3 rounded-xl bg-blue-50/40 border border-blue-100/40">
                    <div className="flex items-start gap-2.5">
                      <KeyRound className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                      <div className="text-[11px] text-blue-700/70 leading-relaxed">
                        <p className="font-semibold mb-1">Password requirements:</p>
                        <ul className="space-y-0.5 ml-0">
                          <li>• At least 8 characters long</li>
                          <li>• Contains an uppercase letter</li>
                          <li>• Contains a number</li>
                          <li>• Contains a special character (!@#$%)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Sign out of all devices checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={signOutAllDevices}
                      onClick={() => setSignOutAllDevices(!signOutAllDevices)}
                      className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all duration-200 ${
                        signOutAllDevices
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      {signOutAllDevices && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <div>
                      <p className="text-[13px] text-gray-700 font-medium">Sign out of all devices</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">This will log you out everywhere for security</p>
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    disabled={!newPassword || !confirmNewPassword || newPassword !== confirmPassword}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold rounded-xl transition-all mt-2 ${
                      newPassword && confirmNewPassword && newPassword === confirmNewPassword
                        ? 'text-white bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30'
                        : 'text-white/60 bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    Reset password
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: Success */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Animated success checkmark */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                    className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-5"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 18 }}
                    >
                      <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  >
                    <h2 className="text-[22px] font-bold text-gray-900 mb-2">Your password has been changed</h2>
                    <p className="text-[14px] text-gray-500 leading-relaxed max-w-[320px]">
                      Your password was successfully updated. You can now sign in with your new credentials.
                    </p>
                  </motion.div>

                  {/* Security confirmation details */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="w-full mt-6 space-y-2.5"
                  >
                    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-50/60 border border-emerald-100/60">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-[13px] text-emerald-700 font-medium">Password updated successfully</span>
                    </div>
                    {signOutAllDevices && (
                      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-blue-50/60 border border-blue-100/60">
                        <LogOut className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="text-[13px] text-blue-700 font-medium">Signed out of all devices</span>
                      </div>
                    )}
                  </motion.div>

                  {/* Sign in CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.4 }}
                    className="w-full mt-5 space-y-3"
                  >
                    <Link href="/login">
                      <motion.button
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                      >
                        Sign in now
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </Link>
                    {!signOutAllDevices && (
                      <button className="w-full text-center text-[13px] text-gray-500 font-medium hover:text-gray-700 transition-colors">
                        Sign in from all devices instead
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Troubleshooting Section */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-5"
          >
            <div className="px-5 py-4 rounded-xl border border-gray-100/60 bg-white/40">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <span className="text-[12px] font-semibold text-gray-600 uppercase tracking-wider">Troubleshooting</span>
              </div>
              <div className="space-y-1">
                {troubleshootingTips.map((tip, i) => (
                  <div key={i}>
                    <button
                      onClick={() => setExpandedTip(expandedTip === i ? null : i)}
                      className="w-full flex items-center justify-between py-2 text-left group"
                    >
                      <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{tip.title}</span>
                      <motion.div
                        animate={{ rotate: expandedTip === i ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-gray-400 -rotate-90" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedTip === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[12px] text-gray-500 leading-relaxed pb-2 pl-0">
                            {tip.content}
                          </p>
                          {i === 2 && (
                            <a
                              href="mailto:team@clearpath-ai.org"
                              className="inline-flex items-center gap-1 text-[12px] text-blue-600 font-medium hover:text-blue-500 transition-colors pb-2"
                            >
                              <Mail className="w-3 h-3" />
                              team@clearpath-ai.org
                            </a>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

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
        </motion.div>
      </main>
    </div>
  )
}
