'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Layers,
  Shield,
  Eye,
  Navigation,
  ArrowRight,
  Sparkles,
  Lock,
  Heart,
  MapPin,
  Code2,
  Palette,
  Globe,
  Zap,
  Cpu,
  Wind,
  Database,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 mb-8">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Built for USAII Global AI Hackathon 2026
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
                About ClearPath AI
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                We believe that when people are in crisis, they deserve honest answers — not confident-sounding hallucinations.
                ClearPath AI is built on a simple principle: <span className="font-semibold text-gray-700">classified, not generated.</span>
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16 bg-white/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-8 md:p-12 shadow-premium space-y-6"
            >
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Our Mission</h2>
              <p className="text-[15px] text-gray-500 leading-relaxed">
                Every year, millions of people search for community resources — housing, food, mental health support, legal aid.
                Most never find what they need. Search engines return millions of irrelevant results. AI chatbots hallucinate
                resources that don&apos;t exist. And the people who need help the most can&apos;t wait 72 hours for a callback.
              </p>
              <p className="text-[15px] text-gray-500 leading-relaxed">
                ClearPath AI addresses this with a 6-layer architecture designed around calibrated transparency.
                Instead of hiding uncertainty behind confident-sounding answers, we show you exactly what we know,
                what we don&apos;t, and how confident we are. And when we&apos;re not sure, we ask — we never guess.
              </p>
              <div className="pt-4">
                <Link
                  href="/app"
                  className="inline-flex items-center gap-2 text-[14px] font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Try the demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">What we stand for</h2>
              <p className="text-[15px] text-gray-500 mt-3">The principles that guide every decision we make</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  icon: Shield,
                  title: 'Safety First',
                  desc: 'Crisis detection happens before any AI processing. When someone is in danger, we bypass AI entirely and connect them directly with crisis lines.',
                  color: '#ef4444',
                },
                {
                  icon: Eye,
                  title: 'Full Transparency',
                  desc: 'Every result shows WHY we suggested it, WHAT ELSE we considered, and HOW CONFIDENT we are. No black boxes.',
                  color: '#10b981',
                },
                {
                  icon: Navigation,
                  title: 'Human Escalation',
                  desc: '"Talk to a Navigator" is always one click away. Real people at 211.org are ready to help 24/7.',
                  color: '#3b82f6',
                },
                {
                  icon: Sparkles,
                  title: 'Calibrated Honesty',
                  desc: "We'd rather say \"I'm not sure\" than give you a confident wrong answer. Our confidence scores are the first thing you see.",
                  color: '#f59e0b',
                },
                {
                  icon: Lock,
                  title: 'Privacy by Design',
                  desc: 'Nothing is stored. Nothing is logged. Your searches are never used to train models. Period.',
                  color: '#6366f1',
                },
                {
                  icon: Heart,
                  title: 'Community First',
                  desc: "We don't replace 211.org — we build on top of it. Real navigators, real resources, real people.",
                  color: '#ec4899',
                },
              ].map((value) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    variants={fadeInUp}
                    className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${value.color}10` }}>
                      <Icon className="w-5 h-5" style={{ color: value.color }} />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 tracking-tight mb-2">{value.title}</h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{value.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-white/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Built by students who care</h2>
              <p className="text-[15px] text-gray-500 mt-3">Small team, big mission</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid sm:grid-cols-2 gap-6"
            >
              {[
                {
                  name: 'Amine Harch El Korane',
                  initials: 'AK',
                  role: 'Project Founder & Product Design',
                  location: 'Morocco',
                  bio: 'High school student passionate about leveraging AI to solve real-world social challenges. Leads product strategy and design with a focus on honest, accessible technology.',
                  gradient: 'from-emerald-500 to-teal-600',
                  icon: Palette,
                },
                {
                  name: 'Harshit Singh',
                  initials: 'HS',
                  role: 'Full-Stack Developer & Technical Architecture',
                  location: 'India',
                  bio: 'Full-stack developer focused on building scalable, user-centered applications. Architects the technical infrastructure that makes ClearPath AI reliable and fast.',
                  gradient: 'from-blue-500 to-indigo-600',
                  icon: Code2,
                },
              ].map((member) => {
                const Icon = member.icon
                return (
                  <motion.div
                    key={member.name}
                    variants={fadeInUp}
                    className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                        <span className="text-[18px] font-bold text-white">{member.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-gray-900 tracking-tight">{member.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Icon className="w-3 h-3 text-gray-400" />
                          <span className="text-[12px] text-gray-500 font-medium">{member.role}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span className="text-[12px] text-gray-400">{member.location}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed mt-4">{member.bio}</p>
                  </motion.div>
                )
              })}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mt-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-amber-50/80 text-amber-700 border border-amber-100/60">
                <Globe className="w-3.5 h-3.5" />
                Competing in the USAII Global AI Hackathon 2026, Community track
              </div>
            </motion.div>
          </div>
        </section>

        {/* Technology */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Built with proven technology</h2>
              <p className="text-[15px] text-gray-500 mt-3">Every component chosen for reliability and transparency</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {[
                { name: 'Next.js 16', desc: 'Frontend framework', icon: Zap, color: '#000000' },
                { name: 'BART-large-MNLI', desc: 'Zero-shot classification', icon: Cpu, color: '#6366f1' },
                { name: 'React 19', desc: 'UI components', icon: Code2, color: '#3b82f6' },
                { name: 'Tailwind CSS v4', desc: 'Styling', icon: Wind, color: '#06b6d4' },
                { name: 'Framer Motion', desc: 'Animations', icon: Sparkles, color: '#a855f7' },
                { name: 'United Way 211', desc: 'Verified resource data', icon: Database, color: '#10b981' },
              ].map((tech) => {
                const Icon = tech.icon
                return (
                  <motion.div
                    key={tech.name}
                    variants={fadeInUp}
                    className="glass-card rounded-xl p-4 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 text-center"
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${tech.color}0d` }}>
                      <Icon className="w-5 h-5" style={{ color: tech.color }} />
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-900 tracking-tight">{tech.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{tech.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-8 md:p-12 shadow-premium-lg text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center mx-auto shadow-premium-xl mb-6">
                <Layers className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Ready to try honest AI?</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
                Experience AI that shows its work, admits uncertainty, and always puts your safety first.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                <Link
                  href="/app"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                >
                  Try the Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#how-it-works"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-semibold text-gray-700 rounded-xl border border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  Learn How It Works
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto sidebar-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[13px] font-bold tracking-tight text-white">ClearPath AI</span>
            </div>
            <p className="text-[12px] text-gray-500">&copy; 2026 ClearPath AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
