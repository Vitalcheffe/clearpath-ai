'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Settings, Shield, ArrowRight, Globe, Bell, Eye, Lock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/hooks/use-auth'

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const settingSections = [
  {
    title: 'General',
    icon: Globe,
    iconColor: '#3b82f6',
    items: [
      { label: 'Language', value: 'English' },
      { label: 'Distance unit', value: 'Miles' },
      { label: 'Default category', value: 'All' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    iconColor: '#f59e0b',
    items: [
      { label: 'Email notifications', value: 'Enabled' },
      { label: 'Resource updates', value: 'Enabled' },
      { label: 'New features', value: 'Disabled' },
    ],
  },
  {
    title: 'Privacy',
    icon: Eye,
    iconColor: '#10b981',
    items: [
      { label: 'Data retention', value: 'Enabled' },
      { label: 'Block third-party cookies', value: 'Enabled' },
      { label: 'Share usage data', value: 'Disabled' },
    ],
  },
  {
    title: 'Security',
    icon: Lock,
    iconColor: '#8b5cf6',
    items: [
      { label: 'Two-factor authentication', value: 'Disabled' },
      { label: 'Session timeout', value: '30 minutes' },
    ],
  },
]

export default function SettingsPage() {
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
            <p className="text-sm text-gray-500 mb-6">Please sign in to manage your settings.</p>
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
              <Settings className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
            </div>

            <div className="space-y-6">
              {settingSections.map((section) => (
                <div key={section.title} className="glass-card rounded-2xl p-6 shadow-premium">
                  <div className="flex items-center gap-3 mb-4">
                    <section.icon className="w-5 h-5" style={{ color: section.iconColor }} />
                    <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
                  </div>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-500">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
