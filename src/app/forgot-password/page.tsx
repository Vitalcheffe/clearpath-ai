'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Mail, ArrowRight, ArrowLeft, ShieldCheck, Lock, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [focused, setFocused] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full max-w-[440px]"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center mx-auto shadow-premium-xl mb-5"
            >
              <Layers className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-gray-900">
              {submitted ? 'Check your email' : 'Reset password'}
            </h1>
            <p className="text-[15px] text-gray-500 mt-2">
              {submitted
                ? `We sent a reset link to ${email}`
                : 'Enter your email and we\'ll send you a reset link'}
            </p>
          </div>

          {/* Card */}
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40"
              >
                <form onSubmit={handleSubmit} className="space-y-4">
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

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.005 }}
                    whileTap={{ scale: 0.995 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all mt-2"
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
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="glass-card rounded-2xl p-8 shadow-premium-lg border border-gray-100/40"
              >
                {/* Success Illustration */}
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
                    className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 260, damping: 18 }}
                    >
                      <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                  >
                    <h2 className="text-[20px] font-bold text-gray-900 mb-2">Email sent!</h2>
                    <p className="text-[14px] text-gray-500 leading-relaxed max-w-[300px]">
                      We&apos;ve sent a password reset link to <span className="font-semibold text-gray-700">{email}</span>. Please check your inbox and spam folder.
                    </p>
                  </motion.div>

                  {/* Email illustration */}
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

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.65, duration: 0.4 }}
                    className="w-full mt-5"
                  >
                    <button
                      onClick={() => { setSubmitted(false); setEmail('') }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-semibold text-blue-600 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-50 hover:border-blue-300 transition-all"
                    >
                      Didn&apos;t receive it? Resend
                    </button>
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
          </AnimatePresence>

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
