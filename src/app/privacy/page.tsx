'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Layers,
  Shield,
  Eye,
  Database,
  Cpu,
  Lock,
  Users,
  Baby,
  Server,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const sections = [
  { id: 'introduction', number: 1, title: 'Introduction', icon: Shield },
  { id: 'information-collected', number: 2, title: 'Information We Collect', icon: Eye },
  { id: 'how-we-use', number: 3, title: 'How We Use Information', icon: Cpu },
  { id: 'data-storage', number: 4, title: 'Data Storage', icon: Database },
  { id: 'crisis-detection', number: 5, title: 'Crisis Detection Data', icon: AlertTriangle },
  { id: 'third-party', number: 6, title: 'Third-Party Services', icon: Server },
  { id: 'your-rights', number: 7, title: 'Your Rights', icon: Users },
  { id: 'childrens-privacy', number: 8, title: "Children's Privacy", icon: Baby },
  { id: 'security', number: 9, title: 'Security Measures', icon: Lock },
  { id: 'contact', number: 10, title: 'Contact Us', icon: Mail },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 mb-6"
              >
                <Shield className="w-3.5 h-3.5" />
                Your privacy matters
              </motion.div>
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight"
              >
                Privacy Policy
              </motion.h1>
              <motion.p
                variants={fadeInUp}
                className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed"
              >
                Last updated: June 2026
              </motion.p>
              <motion.p
                variants={fadeInUp}
                className="text-[15px] text-gray-400 mt-2 max-w-xl mx-auto"
              >
                ClearPath AI respects your privacy. This policy explains what data we collect,
                how we use it, and the steps we take to protect it.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="pb-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 tracking-tight">Table of Contents</h2>
              </div>
              <nav className="grid sm:grid-cols-2 gap-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-all group"
                    >
                      <span className="w-7 h-7 rounded-lg bg-gray-100 group-hover:bg-blue-50 flex items-center justify-center text-[11px] font-bold text-gray-400 group-hover:text-blue-600 transition-colors shrink-0">
                        {section.number}
                      </span>
                      <Icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0" />
                      <span>{section.title}</span>
                    </a>
                  )
                })}
              </nav>
            </motion.div>
          </div>
        </section>

        {/* Section 1: Introduction */}
        <section id="introduction" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase">Section 1</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Introduction</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                <p>
                  ClearPath AI respects your privacy and is committed to protecting your personal information.
                  This Privacy Policy describes how we handle data when you use our AI-powered community resource
                  navigator.
                </p>
                <p>
                  We built ClearPath AI with a <span className="font-semibold text-gray-700">privacy-first approach</span>.
                  Unlike many AI services, we do not store your conversations, we do not train models on your data,
                  and we do not share your information with advertisers. Our architecture was designed from the ground
                  up to minimize data collection and maximize your control.
                </p>
                <p>
                  By using ClearPath AI, you agree to the practices described in this policy. If you have any
                  questions, please contact us at{' '}
                  <a href="mailto:team@clearpath-ai.org" className="text-blue-600 hover:text-blue-500 font-medium transition-colors">
                    team@clearpath-ai.org
                  </a>.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 2: Information We Collect */}
        <section id="information-collected" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">Section 2</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Information We Collect</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                <p>
                  We collect <span className="font-semibold text-gray-700">the absolute minimum</span> amount of
                  data necessary to provide our service. Here&apos;s what we process:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 text-[14px]">What you type</p>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        Your search queries and conversation inputs are processed in-memory only to classify
                        your needs and find relevant resources. Nothing is written to disk.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 text-[14px]">Classification results</p>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        The AI-generated category labels and confidence scores are generated in real-time
                        and displayed to you. They are not stored after your session ends.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-amber-50/60 border border-amber-100/60">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[13px] text-amber-700">
                      <span className="font-semibold">What we do NOT collect:</span> Personal identifiers,
                      location data, browsing history, device information, cookies for tracking, or any
                      data for advertising purposes.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 3: How We Use Information */}
        <section id="how-we-use" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-violet-600 tracking-wider uppercase">Section 3</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">How We Use Information</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                <p>
                  Your input is used for exactly <span className="font-semibold text-gray-700">one purpose</span>:
                  to classify your needs and find the most relevant community resources for you.
                </p>
                <ul className="space-y-2.5">
                  {[
                    'Classify your query into categories like housing, food assistance, mental health, legal aid, etc.',
                    'Calculate confidence scores so you know how certain the AI is about each result',
                    'Detect crisis situations so we can prioritize emergency resources and hotlines',
                    'Present resource recommendations from verified databases like 211.org',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      </span>
                      <span className="text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[14px]">
                  We <span className="font-semibold text-gray-700">never</span> use your data for:
                </p>
                <ul className="space-y-2">
                  {[
                    'Training machine learning models',
                    'Targeted advertising or marketing',
                    'Selling or sharing with third parties',
                    'Building user profiles or behavioral tracking',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                      </span>
                      <span className="text-[14px] text-gray-400 line-through decoration-red-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 4: Data Storage — Emphasized */}
        <section id="data-storage" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium-lg border-2 border-emerald-100/60 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Database className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 tracking-wider uppercase">Section 4</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Data Storage</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <p className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                    We do NOT store your conversation data. Period.
                  </p>
                </div>
                <p>
                  ClearPath AI uses an <span className="font-semibold text-gray-700">in-memory processing architecture</span>.
                  This means:
                </p>
                <ul className="space-y-2.5">
                  {[
                    'Your inputs are processed in RAM and never written to persistent storage',
                    'No database stores your conversations, queries, or results',
                    'When you close the browser tab or navigate away, all session data is gone',
                    'There is no way for anyone — including us — to retrieve past conversations',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span className="text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50/60 border border-gray-100 mt-4">
                  <Lock className="w-4 h-4 text-gray-400" />
                  <span className="text-[13px] text-gray-400">
                    Zero storage = zero risk of data breaches involving your conversations
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 5: Crisis Detection Data */}
        <section id="crisis-detection" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-orange-400 to-red-400" />
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-red-600 tracking-wider uppercase">Section 5</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Crisis Detection Data</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                <p>
                  ClearPath AI includes a crisis detection layer that identifies when someone may be in danger.
                  This is a <span className="font-semibold text-gray-700">safety-critical feature</span> designed
                  to connect people in crisis with immediate help.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50/30 border border-red-100/60">
                    <Shield className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 text-[14px]">Crisis keywords are processed locally</p>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        Detection happens entirely in-memory. Crisis-related keywords trigger immediate
                        resource recommendations (988 Suicide & Crisis Lifeline, 911, etc.) without
                        any data being logged or stored.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50/30 border border-red-100/60">
                    <Eye className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-800 text-[14px]">Never logged, never stored</p>
                      <p className="text-[13px] text-gray-400 mt-0.5">
                        We never record which crisis keywords were detected, when they were detected,
                        or who triggered them. The detection result is used only to display emergency
                        resources and then it&apos;s gone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 6: Third-Party Services */}
        <section id="third-party" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-600 tracking-wider uppercase">Section 6</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Third-Party Services</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                <p>
                  ClearPath AI integrates with the following third-party services to deliver its functionality:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-violet-500" />
                      <h4 className="font-bold text-gray-900 text-[14px]">Hugging Face API</h4>
                    </div>
                    <p className="text-[13px] text-gray-400 leading-relaxed">
                      Used for AI classification (BART-large-MNLI). Your query is sent to the API
                      for classification, and only the category label and confidence score are returned.
                      Hugging Face&apos;s own privacy policy applies to data in transit.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-emerald-500" />
                      <h4 className="font-bold text-gray-900 text-[14px]">211.org</h4>
                    </div>
                    <p className="text-[13px] text-gray-400 leading-relaxed">
                      Used for verified community resource data. We query 211.org&apos;s database for
                      resource listings. No personal information is sent to 211.org — only category
                      and location filters.
                    </p>
                  </div>
                </div>
                <p className="mt-2">
                  We do not integrate with any advertising networks, analytics platforms that track
                  users, or data brokers. Period.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 7: Your Rights */}
        <section id="your-rights" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-600 tracking-wider uppercase">Section 7</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Your Rights</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                <p>
                  You have the following rights regarding your data:
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: 'Right to Know',
                      desc: 'You have the right to know what data we process. Since we don\'t store anything, the answer is simple: we only process what you type, in real-time, and nothing persists.',
                    },
                    {
                      title: 'Right to Delete',
                      desc: 'You have the right to request deletion of your data. Since we don\'t store any conversation data, there\'s nothing to delete — but if you ever have concerns, contact us and we\'ll confirm.',
                    },
                    {
                      title: 'Right to Opt Out',
                      desc: 'You can stop using the service at any time. Since no data persists after your session, opting out is as simple as closing the browser tab.',
                    },
                  ].map((right, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-amber-700">{i + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-[14px]">{right.title}</p>
                        <p className="text-[13px] text-gray-400 mt-0.5">{right.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 8: Children's Privacy */}
        <section id="childrens-privacy" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
                  <Baby className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-pink-600 tracking-wider uppercase">Section 8</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Children&apos;s Privacy</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                <p>
                  ClearPath AI is <span className="font-semibold text-gray-700">COPPA compliant</span> and designed
                  for users of all ages, including children and teenagers who may need community resources.
                </p>
                <ul className="space-y-2.5">
                  {[
                    'We do not knowingly collect personal information from children under 13',
                    'No account creation is required — no names, emails, or birthdays are collected',
                    'Our in-memory processing means no children\'s data is ever stored',
                    'Crisis detection works the same way for all users, including children, ensuring immediate access to help',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-pink-500 mt-0.5 shrink-0" />
                      <span className="text-[14px]">{item}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  If you are a parent or guardian and believe your child has interacted with our service
                  and have concerns, please contact us. Since we store no data, there is nothing to
                  remove — but we take all concerns seriously.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 9: Security Measures */}
        <section id="security" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-teal-600 tracking-wider uppercase">Section 9</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Security Measures</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed pl-0 md:pl-14">
                <p>
                  We take security seriously. Our architecture was designed to minimize risk:
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    {
                      icon: Cpu,
                      title: 'In-Memory Processing',
                      desc: 'All data processed in RAM, never persisted to disk',
                      color: '#10b981',
                    },
                    {
                      icon: Database,
                      title: 'No Database',
                      desc: 'Zero persistent storage means zero attack surface for data theft',
                      color: '#3b82f6',
                    },
                    {
                      icon: Lock,
                      title: 'HTTPS Encryption',
                      desc: 'All data in transit is encrypted using TLS 1.3',
                      color: '#6366f1',
                    },
                  ].map((measure) => {
                    const Icon = measure.icon
                    return (
                      <div key={measure.title} className="p-4 rounded-xl bg-gray-50/60 border border-gray-100 text-center">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${measure.color}0d` }}>
                          <Icon className="w-4 h-4" style={{ color: measure.color }} />
                        </div>
                        <p className="font-semibold text-gray-800 text-[13px]">{measure.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{measure.desc}</p>
                      </div>
                    )
                  })}
                </div>
                <p>
                  While no system is 100% secure, our approach of not storing data eliminates entire
                  categories of security risks. You can&apos;t breach what doesn&apos;t exist.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Section 10: Contact */}
        <section id="contact" className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-6 md:p-8 shadow-premium-lg text-center"
            >
              <div className="flex items-start gap-4 mb-4 justify-center">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">Section 10</span>
                  <h2 className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">Contact Us</h2>
                </div>
              </div>
              <div className="space-y-4 text-[15px] text-gray-500 leading-relaxed max-w-lg mx-auto">
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy
                  or your data, please reach out:
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-50/60 border border-blue-100">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <a
                    href="mailto:team@clearpath-ai.org"
                    className="text-[14px] font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    team@clearpath-ai.org
                  </a>
                </div>
                <p className="text-[13px] text-gray-400 mt-4">
                  We aim to respond to all privacy-related inquiries within 48 hours.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
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
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Privacy is a feature, not a trade-off</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
                Experience AI that respects your privacy by default. No data stored, no compromises.
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
                  href="/terms"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-[14px] font-semibold text-gray-700 rounded-xl border border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  Terms of Service
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
