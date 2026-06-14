'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { LayoutDashboard, MessageSquare, Bookmark, Settings, User, Clock, ArrowRight, Shield, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/use-auth'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const quickActions = [
  { label: 'New Search', href: '/app', icon: MessageSquare, color: '#3b82f6', bgColor: 'rgba(59, 130, 246, 0.06)', borderColor: 'rgba(59, 130, 246, 0.12)' },
  { label: 'Saved Resources', href: '/history', icon: Bookmark, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.06)', borderColor: 'rgba(16, 185, 129, 0.12)' },
  { label: 'Settings', href: '/settings', icon: Settings, color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.06)', borderColor: 'rgba(139, 92, 246, 0.12)' },
  { label: 'Profile', href: '/profile', icon: User, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.06)', borderColor: 'rgba(245, 158, 11, 0.12)' },
]

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col mesh-gradient-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col mesh-gradient-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16 pb-12 px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center max-w-md">
            <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-7 h-7 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">Sign in required</h1>
            <p className="text-sm text-gray-500 mb-8">Please sign in to access your dashboard.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 transition-all"
              >
                Sign in
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-700 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all"
              >
                Create account
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
            </div>
            <p className="text-sm text-gray-500">Welcome back{user?.name ? `, ${user.name}` : ''}. Find what you need quickly.</p>
          </motion.div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {quickActions.map((action, idx) => (
              <motion.div key={action.label} variants={staggerItem} initial="hidden" animate="visible" transition={{ delay: idx * 0.1 }}>
                <Link
                  href={action.href}
                  className="group block glass-card rounded-2xl p-5 shadow-premium hover:shadow-premium-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: action.bgColor, border: `1px solid ${action.borderColor}` }}
                    >
                      <action.icon className="w-5 h-5" style={{ color: action.color }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{action.label}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: action.color }}>
                    Go <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Getting started card */}
          <motion.div variants={staggerItem} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <div className="glass-card rounded-2xl p-8 shadow-premium">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100/60 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Getting started</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Use the chat to describe what you need help with. ClearPath AI will classify your needs, show confidence scores, and connect you with verified community resources in the Houston area.
                  </p>
                  <Link
                    href="/app"
                    className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Start a conversation <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent activity placeholder */}
          <motion.div variants={staggerItem} initial="hidden" animate="visible" transition={{ delay: 0.5 }} className="mt-6">
            <div className="glass-card rounded-2xl p-8 shadow-premium text-center">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-700 mb-1">No recent activity</h3>
              <p className="text-xs text-gray-400">Your conversation history and saved resources will appear here.</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
