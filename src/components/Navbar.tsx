'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Layers, Menu, X, ChevronDown, Shield } from 'lucide-react'

interface NavbarProps {
  scrolled?: boolean
}

export default function Navbar({ scrolled: scrolledProp }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [internalScrolled, setInternalScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setInternalScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrolled = scrolledProp ?? internalScrolled

  const navLinks = [
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'About', href: '/about' },
    { label: 'Responsible AI', href: '/responsible-ai' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Scenarios', href: '/#scenarios' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 header-glass transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_1px_3px_rgba(0,0,0,0.05),0_4px_20px_rgba(0,0,0,0.03)]' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md shadow-gray-900/20 group-hover:shadow-lg group-hover:shadow-gray-900/30 transition-shadow">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="text-[15px] font-bold tracking-tight text-gray-900">
                ClearPath AI
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                Demo
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50/80 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              {navLinks.length > 3 && (
                <div className="relative group">
                  <button className="flex items-center gap-1 px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50/80 transition-all">
                    More
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100/60 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 z-50">
                    {navLinks.slice(3).map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="block px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                      >
                        {link.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 my-1" />
                    <Link href="/dashboard" className="block px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">Dashboard</Link>
                    <Link href="/history" className="block px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">History</Link>
                    <Link href="/settings" className="block px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">Settings</Link>
                    <Link href="/profile" className="block px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">Profile</Link>
                  </div>
                </div>
              )}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-2 text-[13px] font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50/80 transition-all"
              >
                Dashboard
              </Link>
              <Link
                href="/app"
                className="px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
              >
                Try ClearPath AI
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-white shadow-2xl md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <span className="text-[15px] font-bold tracking-tight text-gray-900">Menu</span>
                  <button
                    className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex flex-col p-4 gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="px-4 py-3 text-[14px] font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-2" />
                  <Link href="/dashboard" className="px-4 py-3 text-[14px] font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link href="/history" className="px-4 py-3 text-[14px] font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all" onClick={() => setMobileOpen(false)}>History</Link>
                  <Link href="/settings" className="px-4 py-3 text-[14px] font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all" onClick={() => setMobileOpen(false)}>Settings</Link>
                  <Link href="/profile" className="px-4 py-3 text-[14px] font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all" onClick={() => setMobileOpen(false)}>Profile</Link>
                  <div className="border-t border-gray-100 my-2" />
                  <Link href="/privacy" className="px-4 py-3 text-[13px] font-medium text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-all" onClick={() => setMobileOpen(false)}>Privacy</Link>
                  <Link href="/terms" className="px-4 py-3 text-[13px] font-medium text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-50 transition-all" onClick={() => setMobileOpen(false)}>Terms</Link>
                </nav>
                <div className="mt-auto p-4 border-t border-gray-100 space-y-3">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-3 text-[13px] font-medium text-gray-700 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/app"
                    className="block w-full text-center px-5 py-3 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 shadow-md shadow-blue-500/20 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    Try ClearPath AI
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
