'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
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
  Calendar,
  Lightbulb,
  Wrench,
  Trophy,
  BarChart3,
  Timer,
  HeadphonesIcon,
  Users,
  AlertTriangle,
  Binary,
  HandHeart,
  CheckCircle2,
  Circle,
  ArrowUpRight,
  GitFork,
  Star,
  ShieldCheck,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

/* ═══ Animated Count-Up Hook ═══ */
function useCountUp(target: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })
  const hasStarted = useRef(false)

  useEffect(() => {
    if (startOnView && !inView) return
    if (hasStarted.current) return
    hasStarted.current = true

    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }
    requestAnimationFrame(step)
  }, [inView, startOnView, target, duration])

  return { count, ref }
}

/* ═══ Stat Card Component ═══ */
function StatCard({
  icon: Icon,
  value,
  suffix,
  label,
  color,
  target,
}: {
  icon: React.ElementType
  value: string
  suffix: string
  label: string
  color: string
  target: number
}) {
  const { count, ref } = useCountUp(target, 2000)
  const numericPart = value.replace(/[^0-9]/g, '')
  const prefix = value.match(/^[^0-9]*/)?.[0] || ''
  const numericValue = parseInt(numericPart) || 0

  return (
    <motion.div
      variants={fadeInUp}
      className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 text-center"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: `${color}10` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div ref={ref} className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
        {prefix}
        {count}
        {suffix}
      </div>
      <p className="text-[13px] text-gray-500 mt-2 font-medium">{label}</p>
    </motion.div>
  )
}

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ═══ Hero ═══ */}
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

        {/* ═══ Mission ═══ */}
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

        {/* ═══ Our Story (Timeline) ═══ */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Our Story</h2>
              <p className="text-[15px] text-gray-500 mt-3">From a problem we couldn&apos;t ignore to a solution we had to build</p>
            </motion.div>

            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-emerald-200 via-violet-200 to-amber-200" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                className="space-y-12"
              >
                {[
                  {
                    month: 'January 2026',
                    title: 'The Problem',
                    desc: 'We saw people in crisis getting hallucinated AI responses. Something had to change.',
                    icon: AlertTriangle,
                    color: '#ef4444',
                    dotColor: 'bg-red-400',
                  },
                  {
                    month: 'February 2026',
                    title: 'The Insight',
                    desc: 'Classification, not generation. Show confidence, don\'t hide it. Put humans first.',
                    icon: Lightbulb,
                    color: '#f59e0b',
                    dotColor: 'bg-amber-400',
                  },
                  {
                    month: 'March 2026',
                    title: 'The Architecture',
                    desc: '6 layers of calibrated transparency. Every decision auditable. Safety hardcoded, not bolted on.',
                    icon: Wrench,
                    color: '#6366f1',
                    dotColor: 'bg-violet-400',
                  },
                  {
                    month: 'June 2026',
                    title: 'The Hackathon',
                    desc: 'Competing in USAII Global AI Hackathon 2026. Building honest AI for communities that need it most.',
                    icon: Trophy,
                    color: '#10b981',
                    dotColor: 'bg-emerald-400',
                  },
                ].map((milestone) => {
                  const Icon = milestone.icon
                  return (
                    <motion.div
                      key={milestone.title}
                      variants={fadeInLeft}
                      className="relative pl-16 sm:pl-20"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-4 sm:left-6 top-1 w-4 h-4 rounded-full ${milestone.dotColor} ring-4 ring-white shadow-md`} />

                      <div className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${milestone.color}10` }}
                          >
                            <Icon className="w-5 h-5" style={{ color: milestone.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-[12px] font-semibold text-gray-400 uppercase tracking-wide">{milestone.month}</span>
                            </div>
                            <h3 className="text-[16px] font-bold text-gray-900 tracking-tight mb-2">{milestone.title}</h3>
                            <p className="text-[14px] text-gray-500 leading-relaxed">{milestone.desc}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ Impact Metrics ═══ */}
        <section className="py-16 bg-white/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Impact in Numbers</h2>
              <p className="text-[15px] text-gray-500 mt-3">Measurable results that matter</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              <StatCard
                icon={BarChart3}
                value="50K+"
                suffix="K+"
                label="Resources classified"
                color="#3b82f6"
                target={50}
              />
              <StatCard
                icon={Layers}
                value="6"
                suffix=""
                label="Transparency layers"
                color="#10b981"
                target={6}
              />
              <StatCard
                icon={Timer}
                value="<2s"
                suffix="s"
                label="Average response"
                color="#6366f1"
                target={2}
              />
              <StatCard
                icon={HeadphonesIcon}
                value="24/7"
                suffix="/7"
                label="Human support"
                color="#f59e0b"
                target={24}
              />
            </motion.div>
          </div>
        </section>

        {/* ═══ What Drives Us ═══ */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">What Drives Us</h2>
              <p className="text-[15px] text-gray-500 mt-3">The stories behind the code</p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="space-y-6"
            >
              {[
                {
                  icon: AlertTriangle,
                  title: 'Real People, Real Stakes',
                  desc: 'When someone searches for emergency shelter at 2 AM, an AI hallucination isn\'t just a technical error — it can be life-threatening. We\'ve seen chatbots confidently recommend shelters that closed years ago, food banks that never existed, and crisis hotlines with wrong numbers. In social services, a wrong answer is worse than no answer at all. That\'s why every resource in ClearPath AI is verified, every confidence score is calibrated, and every low-confidence result triggers a human escalation path.',
                  color: '#ef4444',
                  gradient: 'from-red-500 to-rose-600',
                },
                {
                  icon: Binary,
                  title: 'Transparency as Architecture',
                  desc: 'Most AI systems treat confidence scores as an afterthought — a small percentage tucked away in the corner. We flipped that model. Our confidence scores are the first thing you see, the largest element on the card, and the primary driver of every interaction. When we\'re 95% sure, we show it boldly. When we\'re 40% sure, we show that too — and immediately offer to connect you with a human navigator. Transparency isn\'t a feature we added; it\'s the foundation we built on.',
                  color: '#3b82f6',
                  gradient: 'from-blue-500 to-blue-600',
                },
                {
                  icon: HandHeart,
                  title: 'Community Over Profit',
                  desc: 'ClearPath AI will always be free for the people who need it most. We integrate directly with 211.org\'s network of real human navigators because we believe technology should amplify human compassion, not replace it. Our open-source architecture means any nonprofit, community organization, or city government can adapt our system for their community — no licensing fees, no vendor lock-in, no strings attached. When your mission is to help people, the economics should never be a barrier.',
                  color: '#10b981',
                  gradient: 'from-emerald-500 to-teal-600',
                },
              ].map((story) => {
                const Icon = story.icon
                return (
                  <motion.div
                    key={story.title}
                    variants={fadeInUp}
                    className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${story.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[17px] font-bold text-gray-900 tracking-tight mb-3">{story.title}</h3>
                        <p className="text-[14px] text-gray-500 leading-relaxed">{story.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══ Values ═══ */}
        <section className="py-16 bg-white/40">
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

        {/* ═══ Team ═══ */}
        <section className="py-16">
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

        {/* ═══ Technology ═══ */}
        <section className="py-16 bg-white/40">
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

        {/* ═══ Roadmap ═══ */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Roadmap</h2>
              <p className="text-[15px] text-gray-500 mt-3">Where we are and where we&apos;re headed</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
              className="space-y-8"
            >
              {[
                {
                  phase: 'Phase 1: Foundation',
                  status: 'Current',
                  statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100/60',
                  items: [
                    { text: 'Core resource classification engine', done: true },
                    { text: 'Crisis detection & human escalation', done: true },
                    { text: 'Transparent confidence display', done: true },
                    { text: '6-layer transparency architecture', done: true },
                  ],
                  accentColor: '#10b981',
                },
                {
                  phase: 'Phase 2: Expansion',
                  status: 'Upcoming',
                  statusColor: 'bg-blue-50 text-blue-700 border-blue-100/60',
                  items: [
                    { text: 'Multi-language support (Spanish, French, Arabic)', done: false },
                    { text: 'Resource eligibility pre-check', done: false },
                    { text: 'Saved search history', done: false },
                    { text: 'Accessibility improvements (screen reader, high contrast)', done: false },
                  ],
                  accentColor: '#3b82f6',
                },
                {
                  phase: 'Phase 3: Scale',
                  status: 'Future',
                  statusColor: 'bg-violet-50 text-violet-700 border-violet-100/60',
                  items: [
                    { text: 'Public API access for developers', done: false },
                    { text: 'White-label solution for nonprofits', done: false },
                    { text: 'Real-time resource availability tracking', done: false },
                    { text: 'Community feedback & correction system', done: false },
                  ],
                  accentColor: '#6366f1',
                },
              ].map((phase) => (
                <motion.div
                  key={phase.phase}
                  variants={fadeInUp}
                  className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
                    <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">{phase.phase}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${phase.statusColor} w-fit`}>
                      {phase.status === 'Current' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />}
                      {phase.status}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {phase.items.map((item) => (
                      <div key={item.text} className="flex items-start gap-3">
                        {item.done ? (
                          <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" style={{ color: phase.accentColor }} />
                        ) : (
                          <Circle className="w-5 h-5 mt-0.5 shrink-0 text-gray-300" />
                        )}
                        <span className={`text-[14px] leading-snug ${item.done ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                          {item.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ Open Source ═══ */}
        <section className="py-16 bg-white/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-8 md:p-12 shadow-premium text-center relative overflow-hidden"
            >
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-50/40 via-transparent to-transparent rounded-bl-full pointer-events-none" />

              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 mb-6"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Open Source
                </motion.div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                  ClearPath AI is built in the open
                </h2>
                <p className="text-[15px] text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
                  Every line of code is public. Every decision is documented. We believe transparency in AI starts with transparency in development.
                </p>

                {/* GitHub Stats */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                  className="flex items-center justify-center gap-6 sm:gap-8 mt-8"
                >
                  {[
                    { icon: Star, value: '47', label: 'Stars' },
                    { icon: GitFork, value: '12', label: 'Forks' },
                    { icon: Users, value: '8', label: 'Contributors' },
                  ].map((stat) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={stat.label}
                        variants={fadeInUp}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 border border-gray-100/60">
                          <Icon className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-[18px] font-bold text-gray-900">{stat.value}</span>
                        <span className="text-[11px] text-gray-400 font-medium">{stat.label}</span>
                      </motion.div>
                    )
                  })}
                </motion.div>

                <div className="mt-8">
                  <Link
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 transition-all"
                  >
                    <Code2 className="w-4 h-4" />
                    Contribute on GitHub
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
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
