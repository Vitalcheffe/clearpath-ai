'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Mail, ArrowRight, Shield } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/use-auth'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col mesh-gradient-bg">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-16">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
            <p className="text-sm text-gray-500 mb-6">Please sign in to view your profile.</p>
            <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-md shadow-blue-500/20 transition-all">
              Sign in <ArrowRight className="w-4 h-4" />
            </Link>
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
        <div className="max-w-2xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-8">
              <User className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profile</h1>
            </div>

            <div className="glass-card rounded-2xl p-8 shadow-premium">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{user?.name || 'User'}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-sm text-gray-500">{user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Member since</span>
                  <span className="text-sm font-medium text-gray-900">Free plan</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Plan</span>
                  <span className="text-sm font-medium text-gray-900">Free</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <Link
                  href="/settings"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Edit Settings
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-blue-600 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-all"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
