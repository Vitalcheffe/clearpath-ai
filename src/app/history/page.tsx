'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, Shield, ArrowRight, MessageSquare } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/use-auth'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function HistoryPage() {
  const { isAuthenticated, isLoading } = useAuth()

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
            <p className="text-sm text-gray-500 mb-6">Please sign in to view your history.</p>
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
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">History</h1>
            </div>

            <div className="glass-card rounded-2xl p-12 shadow-premium text-center">
              <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <h2 className="text-base font-semibold text-gray-700 mb-2">No conversations yet</h2>
              <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
                Your conversation history and saved resources will appear here once you start chatting.
              </p>
              <Link
                href="/app"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 transition-all"
              >
                Start a conversation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
