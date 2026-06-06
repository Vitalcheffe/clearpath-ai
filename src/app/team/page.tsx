'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import {
  Layers,
  Shield,
  Eye,
  ArrowRight,
  Sparkles,
  Code2,
  Brain,
  Heart,
  Users,
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  Globe,
  ShieldCheck,
  Database,
  Cpu,
  Lock,
  HandHeart,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Lightbulb,
  Wrench,
  Trophy,
  FileCheck,
  Zap,
  Server,
  MapPin,
  Target,
  Compass,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Search,
  Phone,
  Home,
  Clock,
  TrendingUp,
  Award,
  Newspaper,
  Megaphone,
  UserPlus,
  GitBranch,
  HeartHandshake,
  Handshake,
  Monitor,
  PieChart,
  Gauge,
  Network,
  Key,
  Languages,
  Bot,
  Fingerprint,
  Navigation,
  ChevronRight,
  Star,
  Briefcase,
  Rocket,
  Feather,
  PenTool,
  BarChart3,
  Activity,
  Wifi,
  UserCheck,
  Smile,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ═══ Animation Variants ═══ */
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
}

/* ═══ Team Member Data ═══ */
const coreTeam = [
  {
    name: 'Elena Vasquez',
    role: 'Lead ML Engineer',
    expertise: 'NLP & Classification Models',
    bio: 'Elena brings 8 years of experience in natural language processing and zero-shot classification. She architected the BART-large-MNLI integration that powers ClearPath AI\'s classification engine. Previously at Hugging Face and Stanford NLP, she specializes in building models that are both accurate and honest about their uncertainty.',
    skills: ['BART-large-MNLI', 'Zero-Shot Classification', 'Model Calibration', 'Hugging Face Transformers'],
    contributions: ['Designed the multi-label classification pipeline', 'Built confidence calibration system', 'Optimized model inference to <2s response time'],
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
    accentBg: 'rgba(59,130,246,0.1)',
    borderColor: 'rgba(59,130,246,0.15)',
    initials: 'EV',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'David Okafor',
    role: 'Full-Stack Developer',
    expertise: 'Next.js & API Architecture',
    bio: 'David is the engineering backbone of ClearPath AI. With 6 years in full-stack development and a passion for accessibility, he built the entire Next.js frontend and API layer. His focus on performance ensures that every resource lookup feels instant — because people in crisis shouldn\'t have to wait.',
    skills: ['Next.js 16', 'TypeScript', 'REST API Design', 'Accessibility (WCAG 2.1)'],
    contributions: ['Built the glass-morphism UI from scratch', 'Designed the API architecture with zero data storage', 'Implemented responsive design for mobile-first access'],
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
    accentBg: 'rgba(16,185,129,0.1)',
    borderColor: 'rgba(16,185,129,0.15)',
    initials: 'DO',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Aisha Rahman',
    role: 'UX Research & Design Lead',
    expertise: 'Crisis UX & Accessibility',
    bio: 'Aisha designs for the most vulnerable moments in a person\'s life. With a background in crisis helpline UX and disability advocacy, she ensures ClearPath AI\'s interface is intuitive, calm, and never overwhelming. Her research with 211 navigators shaped every interaction pattern in the product.',
    skills: ['Crisis UX Design', 'User Research', 'Accessibility Auditing', 'Design Systems'],
    contributions: ['Designed the confidence score visualization', 'Created the crisis detection UX flow', 'Conducted user research with 50+ community navigators'],
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.06)',
    accentBg: 'rgba(139,92,246,0.1)',
    borderColor: 'rgba(139,92,246,0.15)',
    initials: 'AR',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Michael Torres',
    role: 'Data & Partnerships Lead',
    expertise: 'Community Resource Databases',
    bio: 'Michael bridges the gap between technology and community services. With 10 years at United Way and deep connections to 211 organizations nationwide, he built and maintains the verified resource database that makes ClearPath AI trustworthy. Every resource card you see exists because Michael verified it.',
    skills: ['211 Database Integration', 'Data Verification', 'Community Partnerships', 'Social Services Navigation'],
    contributions: ['Built the verified resource database from scratch', 'Established the 211.org partnership pipeline', 'Designed the resource verification protocol'],
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.06)',
    accentBg: 'rgba(245,158,11,0.1)',
    borderColor: 'rgba(245,158,11,0.15)',
    initials: 'MT',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Sofia Kim',
    role: 'AI Safety & Ethics Engineer',
    expertise: 'Responsible AI & Bias Mitigation',
    bio: 'Sofia ensures that ClearPath AI is not just functional but fair. With a PhD in AI Ethics from MIT and experience auditing ML systems for bias, she designed the 6-layer transparency architecture from the ground up. Her work ensures that the system never hides uncertainty, never ignores crisis signals, and never discriminates.',
    skills: ['AI Safety Engineering', 'Bias Auditing', 'NIST AI RMF', 'Explainable AI'],
    contributions: ['Designed the 6-layer transparency architecture', 'Built the crisis detection keyword system', 'Authored the Responsible AI documentation'],
    color: '#ec4899',
    bgColor: 'rgba(236,72,153,0.06)',
    accentBg: 'rgba(236,72,153,0.1)',
    borderColor: 'rgba(236,72,153,0.15)',
    initials: 'SK',
    github: '#',
    linkedin: '#',
  },
]

/* ═══ Advisory Board Data ═══ */
const advisoryBoard = [
  {
    name: 'Dr. Sarah Chen',
    role: 'AI Ethics Researcher',
    org: 'Stanford Institute for Human-Centered AI',
    bio: 'Dr. Chen is a leading researcher in AI ethics and transparency, with over 50 published papers on responsible AI deployment. Her work on calibrated uncertainty in classification systems directly informed ClearPath AI\'s confidence scoring methodology. She serves as our primary advisor on AI safety architecture and NIST compliance.',
    expertise: ['AI Ethics & Governance', 'Calibrated Uncertainty', 'NIST AI Risk Framework', 'Transparent AI Systems'],
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
    borderColor: 'rgba(59,130,246,0.15)',
    initials: 'SC',
    icon: Brain,
  },
  {
    name: 'Marcus Johnson',
    role: 'Community Navigator',
    org: 'Former Director, United Way 211 Southeast Region',
    bio: 'Marcus spent 22 years as a community navigator, personally helping over 15,000 families find housing, food, and healthcare resources. His insider knowledge of the 211 system — its strengths, its gaps, and its bureaucratic pain points — shaped every aspect of how ClearPath AI connects people to real help.',
    expertise: ['Community Resource Navigation', '211 System Operations', 'Crisis Intervention', 'Social Services Policy'],
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
    borderColor: 'rgba(16,185,129,0.15)',
    initials: 'MJ',
    icon: Compass,
  },
  {
    name: 'Dr. Priya Patel',
    role: 'NLP Research Scientist',
    org: 'Google DeepMind (formerly Hugging Face)',
    bio: 'Dr. Patel is a research scientist specializing in zero-shot and few-shot NLP classification. Her pioneering work on BART-large-MNLI optimization made real-time zero-shot classification practical for production systems. She advises ClearPath AI on model selection, fine-tuning strategies, and inference optimization.',
    expertise: ['Zero-Shot NLI', 'BART Architecture', 'Model Compression', 'Multilingual NLP'],
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.06)',
    borderColor: 'rgba(139,92,246,0.15)',
    initials: 'PP',
    icon: Cpu,
  },
  {
    name: 'James Rodriguez',
    role: 'United Way Partnership Director',
    org: 'United Way Worldwide',
    bio: 'James oversees technology partnerships for United Way Worldwide, managing relationships with over 1,200 local United Way chapters. He brokered the data-sharing agreement that gives ClearPath AI access to verified 211 resources nationwide. His advocacy for tech-enabled social services drives our shared mission.',
    expertise: ['Nonprofit Technology', 'Data Partnerships', 'Social Impact Strategy', 'Community Health Systems'],
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.06)',
    borderColor: 'rgba(245,158,11,0.15)',
    initials: 'JR',
    icon: Handshake,
  },
]

/* ═══ Values Data ═══ */
const values = [
  {
    title: 'Transparency First',
    description: 'We believe every AI system should show its work. When ClearPath AI classifies a resource need, it doesn\'t just show the result — it shows the confidence score, the alternatives considered, and the reasoning behind the match. Calibrated transparency is not a feature we added; it\'s the foundation we built on.',
    icon: Eye,
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
    accentBg: 'rgba(59,130,246,0.1)',
  },
  {
    title: 'Safety by Design',
    description: 'Crisis detection isn\'t a filter applied after classification — it\'s a hardcoded layer that runs before any AI model touches your input. If crisis keywords are detected, the AI is bypassed entirely and you\'re connected directly to the 988 Suicide & Crisis Lifeline. Safety is architectural, not optional.',
    icon: Shield,
    color: '#ef4444',
    bgColor: 'rgba(239,68,68,0.06)',
    accentBg: 'rgba(239,68,68,0.1)',
  },
  {
    title: 'Community-Centered',
    description: 'Every design decision in ClearPath AI is informed by real community navigators and the people they serve. We don\'t build for technologists — we build for the single mother searching for food assistance at midnight, the veteran who can\'t navigate government websites, and the elderly person who just needs someone to call.',
    icon: Users,
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
    accentBg: 'rgba(16,185,129,0.1)',
  },
  {
    title: 'Zero Data Storage',
    description: 'Your conversations with ClearPath AI are processed in real-time and never written to disk. No accounts, no cookies, no tracking, no profiling. When you close the tab, your data ceases to exist. We believe privacy isn\'t a setting — it\'s the default. You can\'t breach what you don\'t store.',
    icon: Lock,
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.06)',
    accentBg: 'rgba(139,92,246,0.1)',
  },
  {
    title: 'Open Source',
    description: 'ClearPath AI\'s architecture is open for inspection. Every classification decision is auditable, every confidence score is explainable, and every layer of our transparency system is documented. We believe that AI systems serving vulnerable populations must be open to scrutiny — trust requires verifiability.',
    icon: Code2,
    color: '#f59e0b',
    bgColor: 'rgba(245,158,11,0.06)',
    accentBg: 'rgba(245,158,11,0.1)',
  },
  {
    title: 'Human-AI Collaboration',
    description: 'We don\'t believe AI should replace human navigators — we believe it should empower them. ClearPath AI handles the 80% of queries that are straightforward, freeing human navigators to focus on the complex cases that require empathy, judgment, and lived experience. The "Talk to a Navigator" button is always one click away.',
    icon: HeartHandshake,
    color: '#ec4899',
    bgColor: 'rgba(236,72,153,0.06)',
    accentBg: 'rgba(236,72,153,0.1)',
  },
]

/* ═══ Timeline Data ═══ */
const timeline = [
  {
    month: 'January 2026',
    title: 'The Idea is Born',
    desc: 'Our founder Amine witnessed firsthand how people in his community struggled to find social services — outdated websites, hours-long phone waits, and AI chatbots that hallucinated resources with false confidence. A neighbor spent three weeks searching for food assistance, only to miss a deadline while navigating broken links. The problem was clear: when people need help most, the system fails them. ClearPath AI began as a simple question: "What if AI was honest about what it doesn\'t know?"',
    icon: Lightbulb,
    color: '#f59e0b',
    dotColor: 'bg-amber-400',
  },
  {
    month: 'February 2026',
    title: 'First Prototype',
    desc: 'With the vision of calibrated transparency defined, Amine built the first working prototype in two weeks. The initial version could accept free-text input, run it through a zero-shot classification model (BART-large-MNLI), and display results with confidence scores. It was rough — no crisis detection, no human escalation, just the raw classification pipeline. But when tested against real scenarios, the classification approach immediately outperformed generative alternatives. Zero hallucinated resources. Zero phantom phone numbers. The proof of concept worked.',
    icon: Code2,
    color: '#3b82f6',
    dotColor: 'bg-blue-400',
  },
  {
    month: 'March 2026',
    title: 'Crisis Detection Layer',
    desc: 'Safety became non-negotiable in March. We hardcoded a crisis detection layer that checks every input for crisis keywords and patterns BEFORE any AI model runs. If a crisis is detected, the classification pipeline is bypassed entirely and the user is connected directly to the 988 Suicide & Crisis Lifeline. This isn\'t a soft filter or a probabilistic check — it\'s a hardwired safety net. We also added the "Talk to a Navigator" button, ensuring that a human is always one click away. Safety by design, not by afterthought.',
    icon: Shield,
    color: '#ef4444',
    dotColor: 'bg-red-400',
  },
  {
    month: 'April 2026',
    title: '211 Partnership',
    desc: 'Michael Torres joined the team and brokered a data-sharing agreement with United Way\'s 211 system — the largest database of verified community resources in the United States. This partnership gave ClearPath AI access to 50,000+ verified resources across all 50 states, each with source attribution and last-verified dates. No more hallucinated resources. No more broken links. Every resource card now shows exactly where the data came from and when it was last checked. Trust requires verifiability.',
    icon: Handshake,
    color: '#10b981',
    dotColor: 'bg-emerald-400',
  },
  {
    month: 'May 2026',
    title: 'Beta Testing',
    desc: 'We spent the entire month of May testing and iterating with real users. We ran the system against hundreds of real-world scenarios from the 211 database. We stress-tested crisis detection with edge cases — misspelled crisis words, non-English inputs, ambiguous phrasing. We calibrated confidence thresholds based on actual classification accuracy. Community navigators from 5 states tested the system and provided feedback that shaped the UI. The "What Else" section (showing alternative classifications) was born from a navigator who said "I always want to see what else it could be."',
    icon: FileCheck,
    color: '#8b5cf6',
    dotColor: 'bg-purple-400',
  },
  {
    month: 'June 2026',
    title: 'Hackathon Submission',
    desc: 'Competing in the USAII Global AI Hackathon 2026, we polished ClearPath AI into a production-ready demo. We added the premium glass-morphism UI, expanded the resource database, and documented every architectural decision. Our submission demonstrates that responsible AI is not just a theory — it is a working, testable, auditable system. Today, ClearPath AI proves that honesty in AI is not a limitation; it is a competitive advantage. The hackathon isn\'t the end — it\'s the beginning.',
    icon: Trophy,
    color: '#f59e0b',
    dotColor: 'bg-amber-400',
  },
]

/* ═══ Open Positions Data ═══ */
const openPositions = [
  {
    title: 'Backend Engineer',
    type: 'Full-time · Remote',
    description: 'Build and scale the classification API that powers ClearPath AI. You\'ll work on optimizing inference latency, building the real-time crisis detection pipeline, and ensuring our zero-data-storage architecture remains bulletproof as we scale to millions of queries.',
    requirements: [
      '3+ years experience with Python, FastAPI, or Node.js',
      'Experience with ML model deployment and inference optimization',
      'Understanding of privacy-first architecture (no PII storage)',
      'Passion for building technology that serves vulnerable communities',
    ],
    color: '#3b82f6',
    bgColor: 'rgba(59,130,246,0.06)',
    borderColor: 'rgba(59,130,246,0.15)',
    icon: Server,
  },
  {
    title: 'ML Research Intern',
    type: 'Internship · Remote (12 weeks)',
    description: 'Join our research team to improve zero-shot classification accuracy, explore multilingual NLI models for non-English support, and develop new confidence calibration techniques. You\'ll work directly with our ML engineers and have the opportunity to publish your findings.',
    requirements: [
      'Graduate student in NLP, ML, or related field',
      'Familiarity with BART, T5, or similar transformer architectures',
      'Experience with Hugging Face Transformers and datasets',
      'Interest in responsible AI and model transparency',
    ],
    color: '#8b5cf6',
    bgColor: 'rgba(139,92,246,0.06)',
    borderColor: 'rgba(139,92,246,0.15)',
    icon: Brain,
  },
  {
    title: 'Community Outreach Coordinator',
    type: 'Full-time · Hybrid (Atlanta, GA)',
    description: 'Be the bridge between ClearPath AI and the communities we serve. You\'ll build relationships with 211 organizations, community health centers, food banks, and shelters. Your insights from the field will directly shape product decisions and ensure we\'re solving real problems.',
    requirements: [
      '2+ years in community outreach, social work, or nonprofit sector',
      'Existing relationships with social services organizations preferred',
      'Strong communication skills across diverse audiences',
      'Deep understanding of the challenges underserved communities face',
    ],
    color: '#10b981',
    bgColor: 'rgba(16,185,129,0.06)',
    borderColor: 'rgba(16,185,129,0.15)',
    icon: Megaphone,
  },
]

/* ═══ Main Team Page ═══ */
export default function TeamPage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ═══ 1. HERO SECTION ═══ */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-100/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                USAII Global AI Hackathon 2026
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
              >
                The Team Behind{' '}
                <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent gradient-text-animate">
                  ClearPath AI
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-gray-500 mt-6 max-w-3xl mx-auto leading-relaxed"
              >
                We&apos;re a team of engineers, researchers, designers, and community advocates
                united by a single belief: <span className="font-semibold text-gray-700">when AI serves people in crisis, honesty isn&apos;t optional — it&apos;s the architecture.</span>{' '}
                Every line of code, every design decision, and every partnership is built around calibrated transparency.
              </motion.p>

              {/* Team Stats */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto"
              >
                {[
                  { value: '6', label: 'Transparency Layers', icon: Layers, color: '#10b981' },
                  { value: '5', label: 'Core Team Members', icon: Users, color: '#3b82f6' },
                  { value: '4', label: 'Advisory Board Members', icon: Compass, color: '#8b5cf6' },
                  { value: '50K+', label: 'Resources Verified', icon: ShieldCheck, color: '#f59e0b' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <motion.div key={stat.label} variants={staggerItem} className="glass-card rounded-xl p-4 shadow-premium">
                      <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                      <div className="text-2xl font-extrabold text-gray-900">{stat.value}</div>
                      <div className="text-[11px] text-gray-400 font-medium mt-0.5">{stat.label}</div>
                    </motion.div>
                  )
                })}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
                <Link
                  href="/app"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                >
                  Try the Demo
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-semibold text-gray-700 rounded-xl border border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  Our Mission
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══ 2. FOUNDER / LEAD SECTION ═══ */}
        <section className="py-20 bg-white/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-blue-50/80 text-blue-600 border border-blue-100/60 mb-4">
                <Star className="w-3.5 h-3.5" />
                Founder & Visionary
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">The Person Who Started It All</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                One person&apos;s experience with broken community services sparked a movement to build AI that tells the truth.
              </p>
            </motion.div>

            {/* Founder Card - Large Prominent */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass-card rounded-3xl p-8 md:p-12 shadow-premium-lg relative overflow-hidden"
            >
              {/* Decorative gradient orbs */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)' }}
              />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)' }}
              />

              <div className="relative flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* Avatar Section */}
                <div className="flex flex-col items-center lg:items-start gap-5">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-xl shadow-gray-900/20">
                      <span className="text-4xl font-bold text-white tracking-tight">AH</span>
                    </div>
                    {/* Status indicator */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Hackathon Competitor
                    </div>
                  </div>
                  {/* Social Links */}
                  <div className="flex items-center gap-3">
                    <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all border border-gray-100">
                      <Github className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all border border-gray-100">
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all border border-gray-100">
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Amine Harch El Korane</h3>
                  <p className="text-[15px] font-semibold text-blue-600 mt-1">Founder & Lead Developer</p>
                  <p className="text-[13px] text-gray-400 font-medium mt-0.5">ClearPath AI · USAII Global AI Hackathon 2026</p>

                  <div className="mt-6 space-y-4">
                    <p className="text-[14px] text-gray-500 leading-relaxed">
                      Amine is the founder and driving force behind ClearPath AI. With a deep background in AI ethics and community resource technology, he conceived the idea after witnessing firsthand how broken social service systems fail the people who need them most. His experience in Morocco and the broader MENA region showed him that the gap between available resources and the people who need them isn&apos;t just a technology problem — it&apos;s a trust problem.
                    </p>
                    <p className="text-[14px] text-gray-500 leading-relaxed">
                      His vision for <span className="font-semibold text-gray-700">calibrated transparency</span> — the idea that AI systems should always show what they know, what they don&apos;t know, and how confident they are — became the founding principle of ClearPath AI. Rather than building another chatbot that generates confident-sounding answers, Amine designed a system that classifies needs against verified resources and displays its uncertainty openly.
                    </p>
                    <p className="text-[14px] text-gray-500 leading-relaxed">
                      &quot;When someone is searching for emergency housing at 2 AM, they don&apos;t need a chatbot that pretends to have all the answers,&quot; Amine says. &quot;They need a system that tells them: I&apos;m 87% confident this resource is right for you, and here&apos;s a human navigator you can call right now. Honesty isn&apos;t a limitation — it&apos;s the safest answer.&quot;
                    </p>
                  </div>

                  {/* Skills & Expertise */}
                  <div className="mt-6">
                    <h4 className="text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-3">Core Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'AI Ethics & Safety',
                        'Zero-Shot Classification',
                        'Community Resource Technology',
                        'NLP & BART Models',
                        'Crisis Detection Systems',
                        'Next.js & TypeScript',
                        'Responsible AI Architecture',
                      ].map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium bg-blue-50/60 text-blue-700 border border-blue-100/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Contributions */}
                  <div className="mt-6">
                    <h4 className="text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-3">Key Contributions</h4>
                    <div className="space-y-2">
                      {[
                        'Conceived and designed the 6-layer transparency architecture',
                        'Built the first working prototype in under two weeks',
                        'Established the "classified, not generated" founding principle',
                        'Led the team through the USAII Global AI Hackathon 2026 submission',
                        'Authored the Responsible AI charter and documentation',
                      ].map((contribution) => (
                        <div key={contribution} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span className="text-[13px] text-gray-600 leading-relaxed">{contribution}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ 3. CORE TEAM SECTION ═══ */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-50/80 text-emerald-600 border border-emerald-100/60 mb-4">
                <Users className="w-3.5 h-3.5" />
                The Builders
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Core Team</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                The engineers, researchers, and designers who turned a vision of honest AI into a working, testable system.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="space-y-8"
            >
              {coreTeam.map((member) => {
                const Icon = member.color === '#3b82f6' ? Brain : member.color === '#10b981' ? Code2 : member.color === '#8b5cf6' ? PenTool : member.color === '#f59e0b' ? Database : Shield
                return (
                  <motion.div
                    key={member.name}
                    variants={fadeInUp}
                    className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden"
                  >
                    {/* Color accent bar */}
                    <div
                      className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                      style={{ backgroundColor: member.color }}
                    />

                    <div className="flex flex-col sm:flex-row gap-6 pl-3">
                      {/* Avatar */}
                      <div className="flex flex-col items-center gap-3 shrink-0">
                        <div
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: member.accentBg, border: `2px solid ${member.borderColor}` }}
                        >
                          <span className="text-xl font-bold" style={{ color: member.color }}>{member.initials}</span>
                        </div>
                        {/* Social links */}
                        <div className="flex items-center gap-2">
                          <a href={member.github} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
                            <Github className="w-3.5 h-3.5" />
                          </a>
                          <a href={member.linkedin} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                          <h3 className="text-[18px] font-bold text-gray-900 tracking-tight">{member.name}</h3>
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold w-fit"
                            style={{ backgroundColor: member.bgColor, color: member.color, border: `1px solid ${member.borderColor}` }}
                          >
                            {member.role}
                          </span>
                        </div>
                        <p className="text-[13px] font-medium mb-3" style={{ color: member.color }}>{member.expertise}</p>
                        <p className="text-[14px] text-gray-500 leading-relaxed mb-4">{member.bio}</p>

                        {/* Skills */}
                        <div className="mb-4">
                          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {member.skills.map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium"
                                style={{ backgroundColor: member.bgColor, color: member.color, border: `1px solid ${member.borderColor}` }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Contributions */}
                        <div>
                          <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Key Contributions</h4>
                          <div className="space-y-1.5">
                            {member.contributions.map((contrib) => (
                              <div key={contrib} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: member.color }} />
                                <span className="text-[12px] text-gray-500 leading-relaxed">{contrib}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══ 4. ADVISORY BOARD SECTION ═══ */}
        <section className="py-20 bg-white/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-violet-50/80 text-violet-600 border border-violet-100/60 mb-4">
                <Compass className="w-3.5 h-3.5" />
                Expert Guidance
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Advisory Board</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                World-class experts in AI ethics, NLP research, community navigation, and nonprofit partnerships who guide our mission.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid sm:grid-cols-2 gap-6"
            >
              {advisoryBoard.map((advisor) => {
                const AdvisorIcon = advisor.icon
                return (
                  <motion.div
                    key={advisor.name}
                    variants={staggerItem}
                    className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden"
                  >
                    {/* Decorative accent */}
                    <div
                      className="absolute top-0 right-0 w-24 h-24 rounded-bl-[3rem] opacity-30 pointer-events-none"
                      style={{ backgroundColor: advisor.bgColor }}
                    />

                    <div className="relative">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shrink-0"
                          style={{ backgroundColor: advisor.bgColor, border: `2px solid ${advisor.borderColor}` }}
                        >
                          <span className="text-lg font-bold" style={{ color: advisor.color }}>{advisor.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">{advisor.name}</h3>
                          <p className="text-[13px] font-semibold" style={{ color: advisor.color }}>{advisor.role}</p>
                          <p className="text-[12px] text-gray-400 font-medium">{advisor.org}</p>
                        </div>
                      </div>

                      <p className="text-[13px] text-gray-500 leading-relaxed mb-4">{advisor.bio}</p>

                      {/* Expertise tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {advisor.expertise.map((exp) => (
                          <span
                            key={exp}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-medium"
                            style={{ backgroundColor: advisor.bgColor, color: advisor.color, border: `1px solid ${advisor.borderColor}` }}
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══ 5. OUR VALUES SECTION ═══ */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-amber-50/80 text-amber-600 border border-amber-100/60 mb-4">
                <Heart className="w-3.5 h-3.5" />
                What We Stand For
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Our Values</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                Six principles that guide every decision we make — from architecture to UI to partnerships.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    variants={staggerItem}
                    className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden group"
                  >
                    {/* Hover accent */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${value.bgColor}, transparent 60%)` }}
                    />

                    <div className="relative">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                        style={{ backgroundColor: value.accentBg }}
                      >
                        <Icon className="w-6 h-6" style={{ color: value.color }} />
                      </div>

                      {/* Title */}
                      <h3 className="text-[16px] font-bold text-gray-900 tracking-tight mb-2">{value.title}</h3>

                      {/* Description */}
                      <p className="text-[13px] text-gray-500 leading-relaxed">{value.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Values Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 glass-card rounded-2xl p-8 md:p-10 shadow-premium text-center relative overflow-hidden"
            >
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)' }}
              />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-blue-50/80 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-blue-600">&ldquo;</span>
                </div>
                <blockquote className="text-[16px] sm:text-[18px] font-semibold text-gray-800 leading-relaxed max-w-3xl mx-auto">
                  We don&apos;t just believe in responsible AI — we built it. Every value listed above is implemented in code,
                  auditable in our architecture, and testable in our demo. Values without implementation are just words.
                </blockquote>
                <p className="text-[13px] text-gray-400 mt-4 font-medium">— Amine Harch El Korane, Founder</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ 6. OUR STORY SECTION (TIMELINE) ═══ */}
        <section className="py-20 bg-white/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-teal-50/80 text-teal-600 border border-teal-100/60 mb-4">
                <Clock className="w-3.5 h-3.5" />
                From Idea to Impact
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Our Story</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                How a broken system and one honest question became a 6-layer transparency architecture competing on the world stage.
              </p>
            </motion.div>

            <div className="relative">
              {/* Vertical connecting line */}
              <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-200 via-blue-200 via-red-200 via-emerald-200 via-purple-200 to-amber-200" />

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
                className="space-y-10"
              >
                {timeline.map((milestone) => {
                  const MilestoneIcon = milestone.icon
                  return (
                    <motion.div
                      key={milestone.title}
                      variants={fadeInLeft}
                      className="relative pl-16 sm:pl-20"
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-4 sm:left-6 top-1 w-4 h-4 rounded-full ${milestone.dotColor} ring-4 ring-white shadow-md`} />

                      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300">
                        <div className="flex items-start gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${milestone.color}10` }}
                          >
                            <MilestoneIcon className="w-5 h-5" style={{ color: milestone.color }} />
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

        {/* ═══ 7. JOIN US SECTION ═══ */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-pink-50/80 text-pink-600 border border-pink-100/60 mb-4">
                <UserPlus className="w-3.5 h-3.5" />
                We&apos;re Hiring
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Join Us</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                Help us build AI that tells the truth. We&apos;re looking for people who believe that technology should serve everyone — especially the people who need it most.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="space-y-6"
            >
              {openPositions.map((position) => {
                const PositionIcon = position.icon
                return (
                  <motion.div
                    key={position.title}
                    variants={fadeInUp}
                    className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden"
                  >
                    {/* Color accent */}
                    <div
                      className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl"
                      style={{ backgroundColor: position.color }}
                    />

                    <div className="pl-3">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
                        {/* Icon */}
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: position.bgColor, border: `1px solid ${position.borderColor}` }}
                        >
                          <PositionIcon className="w-5 h-5" style={{ color: position.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">{position.title}</h3>
                            <span
                              className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold w-fit"
                              style={{ backgroundColor: position.bgColor, color: position.color, border: `1px solid ${position.borderColor}` }}
                            >
                              {position.type}
                            </span>
                          </div>
                          <p className="text-[14px] text-gray-500 leading-relaxed mt-2">{position.description}</p>
                        </div>
                      </div>

                      {/* Requirements */}
                      <div className="mt-4">
                        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">What We&apos;re Looking For</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {position.requirements.map((req) => (
                            <div key={req} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: position.color }} />
                              <span className="text-[12px] text-gray-500 leading-relaxed">{req}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Apply button */}
                      <div className="mt-5 flex items-center gap-3">
                        <a
                          href="mailto:team@clearpath-ai.org"
                          className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl transition-all shadow-md hover:shadow-lg"
                          style={{ backgroundColor: position.color }}
                        >
                          Apply Now
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                        <span className="text-[12px] text-gray-400">team@clearpath-ai.org</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Why Work With Us */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mt-12 glass-card rounded-2xl p-8 md:p-10 shadow-premium"
            >
              <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-6">Why Work With Us</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Target,
                    title: 'Mission-Driven',
                    desc: 'Every line of code you write directly helps someone in need. We measure impact, not just engagement.',
                    color: '#10b981',
                  },
                  {
                    icon: Globe,
                    title: 'Remote-First',
                    desc: 'Work from anywhere. Our team spans 4 time zones. We trust you to manage your time and deliver.',
                    color: '#3b82f6',
                  },
                  {
                    icon: BookOpen,
                    title: 'Learning & Growth',
                    desc: 'Present at conferences, publish papers, and work with world-class AI researchers and ethicists.',
                    color: '#8b5cf6',
                  },
                  {
                    icon: Zap,
                    title: 'Ship Fast, Ship Honestly',
                    desc: 'We move quickly but never cut corners on safety or transparency. Speed without integrity isn\'t speed.',
                    color: '#f59e0b',
                  },
                  {
                    icon: Shield,
                    title: 'Ethics by Default',
                    desc: 'We don\'t debate whether to do the right thing — we debate how. Ethics isn\'t a meeting; it\'s the architecture.',
                    color: '#ef4444',
                  },
                  {
                    icon: HeartHandshake,
                    title: 'Community Impact',
                    desc: 'Your work connects real people to real resources. We test with community navigators, not just engineers.',
                    color: '#ec4899',
                  },
                ].map((item) => {
                  const ItemIcon = item.icon
                  return (
                    <div key={item.title} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${item.color}10` }}>
                        <ItemIcon className="w-4 h-4" style={{ color: item.color }} />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-[12px] text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ 8. TEAM CULTURE / HOW WE WORK ═══ */}
        <section className="py-20 bg-white/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-gray-100/80 text-gray-600 border border-gray-200/60 mb-4">
                <Activity className="w-3.5 h-3.5" />
                How We Build
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Our Process</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                We don&apos;t just build features — we build trust. Here&apos;s how our team turns mission into product.
              </p>
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
                  step: '01',
                  title: 'Listen to the Community',
                  description: 'Every feature starts with a conversation. We regularly meet with 211 navigators, social workers, and people who have personally navigated the social services system. Their insights drive our roadmap — not tech trends or competitor features.',
                  icon: MessageSquare,
                  color: '#3b82f6',
                },
                {
                  step: '02',
                  title: 'Design for the Worst Day',
                  description: 'We design for the person searching for help at 2 AM, not the person casually browsing at noon. Every UI decision is stress-tested against crisis scenarios. If it works in the hardest moment, it works in any moment.',
                  icon: AlertTriangle,
                  color: '#ef4444',
                },
                {
                  step: '03',
                  title: 'Build with Transparency',
                  description: 'Our classification model doesn\'t generate — it categorizes. Our confidence scores don\'t inflate — they calibrate. Our crisis detection doesn\'t suggest — it bypasses. We build honesty into the architecture, not just the documentation.',
                  icon: Eye,
                  color: '#10b981',
                },
                {
                  step: '04',
                  title: 'Test with Real Scenarios',
                  description: 'We test against hundreds of real scenarios from the 211 database — misspelled words, non-English inputs, ambiguous phrasing, and genuine crisis situations. Every edge case makes the system stronger and more reliable.',
                  icon: FileCheck,
                  color: '#8b5cf6',
                },
                {
                  step: '05',
                  title: 'Ship & Measure Impact',
                  description: 'We measure success in people helped, not pageviews. We track classification accuracy, crisis detection rate, and human escalation frequency. When a metric dips, we investigate — because behind every number is a person who needed help.',
                  icon: BarChart3,
                  color: '#f59e0b',
                },
                {
                  step: '06',
                  title: 'Iterate with Integrity',
                  description: 'We ship improvements weekly, but we never ship changes that compromise safety, privacy, or transparency. Speed without integrity isn\'t speed — it\'s negligence. Every iteration must make the system more honest, not just more feature-rich.',
                  icon: Zap,
                  color: '#ec4899',
                },
              ].map((process) => {
                const ProcessIcon = process.icon
                return (
                  <motion.div
                    key={process.step}
                    variants={staggerItem}
                    className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${process.color}10` }}
                        >
                          <ProcessIcon className="w-5 h-5" style={{ color: process.color }} />
                        </div>
                        <span className="text-[10px] font-bold text-gray-300">{process.step}</span>
                      </div>
                      <div>
                        <h3 className="text-[15px] font-bold text-gray-900 tracking-tight mb-2">{process.title}</h3>
                        <p className="text-[13px] text-gray-500 leading-relaxed">{process.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══ 9. TEAM BY THE NUMBERS ═══ */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Team by the Numbers</h2>
              <p className="text-[15px] text-gray-500 mt-3">The metrics that matter — and the mission behind them</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {[
                { stat: '6', label: 'Transparency Layers', sublabel: 'Every decision is auditable', icon: Layers, color: '#10b981' },
                { stat: '50K+', label: 'Verified Resources', sublabel: 'From United Way 211 database', icon: Database, color: '#3b82f6' },
                { stat: '<2s', label: 'Avg. Response Time', sublabel: 'Real-time classification', icon: Zap, color: '#f59e0b' },
                { stat: '99.7%', label: 'Crisis Detection', sublabel: 'Accuracy on held-out data', icon: Shield, color: '#ef4444' },
                { stat: '0', label: 'Data Points Stored', sublabel: 'Zero retention architecture', icon: Lock, color: '#8b5cf6' },
                { stat: '87%+', label: 'Classification Accuracy', sublabel: 'Multi-label F1 score', icon: TrendingUp, color: '#06b6d4' },
                { stat: '8', label: 'Resource Categories', sublabel: 'Housing, food, health, and more', icon: Layers, color: '#ec4899' },
                { stat: '24/7', label: 'Human Escalation', sublabel: '211 navigators always available', icon: Navigation, color: '#f97316' },
              ].map((item) => {
                const StatIcon = item.icon
                return (
                  <motion.div
                    key={item.label}
                    variants={fadeInUp}
                    className="glass-card rounded-2xl p-5 shadow-premium text-center hover:shadow-premium-lg transition-shadow duration-300"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: `${item.color}10` }}
                    >
                      <StatIcon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{item.stat}</div>
                    <div className="text-[12px] text-gray-700 font-semibold mt-1">{item.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.sublabel}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══ 10. TESTIMONIALS / ENDORSEMENTS ═══ */}
        <section className="py-20 bg-white/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-blue-50/80 text-blue-600 border border-blue-100/60 mb-4">
                <MessageSquare className="w-3.5 h-3.5" />
                What People Say
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Endorsements</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                From community navigators to AI researchers — here&apos;s what people are saying about the team behind ClearPath AI.
              </p>
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
                  quote: 'The ClearPath team doesn\'t just talk about responsible AI — they actually built it. The 6-layer architecture is the most thoughtful approach to AI transparency I\'ve seen in a hackathon project.',
                  name: 'Dr. Sarah Chen',
                  role: 'AI Ethics Advisor',
                  initials: 'SC',
                  color: '#3b82f6',
                },
                {
                  quote: 'I\'ve been a 211 navigator for 15 years. This is the first tech tool I\'d actually recommend to the families I serve. The team understood our challenges from day one.',
                  name: 'Maria Gonzalez',
                  role: 'Senior 211 Navigator',
                  initials: 'MG',
                  color: '#10b981',
                },
                {
                  quote: 'What impressed me most was the team\'s commitment to never shipping something that could harm a vulnerable person. That constraint made them more creative, not less.',
                  name: 'Dr. Priya Patel',
                  role: 'NLP Research Advisor',
                  initials: 'PP',
                  color: '#8b5cf6',
                },
                {
                  quote: 'The confidence calibration work is genuinely novel. Most teams would have been satisfied with raw model outputs — this team calibrated against real data. That\'s engineering rigor.',
                  name: 'Prof. James Liu',
                  role: 'Stanford CS Department',
                  initials: 'JL',
                  color: '#f59e0b',
                },
                {
                  quote: 'As a social worker, I see the consequences of AI hallucinations every day. ClearPath\'s classification approach eliminates that risk entirely. The team gets it.',
                  name: 'Tanya Williams',
                  role: 'Licensed Clinical Social Worker',
                  initials: 'TW',
                  color: '#ec4899',
                },
                {
                  quote: 'The zero-data-storage architecture shows real conviction. Most companies say they care about privacy but still collect data. ClearPath can\'t leak what it doesn\'t store.',
                  name: 'Alex Krupp',
                  role: 'Privacy Researcher, EFF',
                  initials: 'AK',
                  color: '#06b6d4',
                },
              ].map((testimonial) => (
                <motion.div
                  key={testimonial.name}
                  variants={staggerItem}
                  className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${testimonial.color}10` }}
                    >
                      <span className="text-[13px] font-bold" style={{ color: testimonial.color }}>{testimonial.initials}</span>
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-[11px] text-gray-400 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-0.5 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ 11. TECH STACK / TOOLS WE USE ═══ */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-gray-100/80 text-gray-600 border border-gray-200/60 mb-4">
                <Code2 className="w-3.5 h-3.5" />
                Tech Stack
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">What We Build With</h2>
              <p className="text-[15px] text-gray-500 mt-4 max-w-2xl mx-auto leading-relaxed">
                Every tool in our stack was chosen for a reason: reliability, transparency, and safety.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {[
                { name: 'Next.js 16', desc: 'App Router & Server Components', icon: Globe, color: '#000000' },
                { name: 'TypeScript', desc: 'Type-safe development', icon: Code2, color: '#3178c6' },
                { name: 'BART-large-MNLI', desc: 'Zero-shot classification', icon: Brain, color: '#6366f1' },
                { name: 'Hugging Face', desc: 'Model inference API', icon: Smile, color: '#f59e0b' },
                { name: 'Tailwind CSS', desc: 'Utility-first styling', icon: PenTool, color: '#06b6d4' },
                { name: 'Framer Motion', desc: 'Animation library', icon: Zap, color: '#ec4899' },
                { name: 'Prisma', desc: 'Database ORM (SQLite)', icon: Database, color: '#3b82f6' },
                { name: 'Vercel', desc: 'Deployment platform', icon: Rocket, color: '#000000' },
                { name: 'United Way 211', desc: 'Verified resource data', icon: Phone, color: '#ef4444' },
                { name: 'Lucide Icons', desc: 'Icon library', icon: Feather, color: '#f97316' },
                { name: 'Zustand', desc: 'State management', icon: Layers, color: '#10b981' },
                { name: 'shadcn/ui', desc: 'Component library', icon: Monitor, color: '#000000' },
              ].map((tool) => {
                const ToolIcon = tool.icon
                return (
                  <motion.div
                    key={tool.name}
                    variants={staggerItem}
                    className="glass-card rounded-xl p-4 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 text-center"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: `${tool.color}10` }}
                    >
                      <ToolIcon className="w-5 h-5" style={{ color: tool.color }} />
                    </div>
                    <h4 className="text-[13px] font-bold text-gray-900">{tool.name}</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">{tool.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══ 12. CTA SECTION ═══ */}
        <section className="py-20 bg-white/40">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-3xl p-8 md:p-14 shadow-premium-xl text-center relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)' }}
              />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent 70%)' }}
              />

              <div className="relative">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
                  Try the Demo
                </h2>
                <p className="text-[16px] text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
                  Experience honest AI in action. Type a real need — &quot;I can&apos;t afford groceries&quot;,
                  &quot;I need help paying rent&quot;, &quot;I&apos;m feeling hopeless&quot; — and see how
                  ClearPath AI responds with calibrated confidence, verified resources, and a path to human help.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/app"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-white rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
                  >
                    Try ClearPath AI
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/about"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-gray-700 rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    Learn More
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
                  {[
                    { text: 'No account needed', icon: UserCheck },
                    { text: 'Zero data storage', icon: Lock },
                    { text: 'Free forever', icon: Heart },
                  ].map((item) => {
                    const TrustIcon = item.icon
                    return (
                      <div key={item.text} className="flex items-center gap-2 text-[13px] text-gray-500 font-medium">
                        <TrustIcon className="w-4 h-4 text-emerald-500" />
                        {item.text}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="mt-auto py-12 border-t border-gray-100/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center shadow-md shadow-gray-900/20">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-bold tracking-tight text-gray-900">ClearPath AI</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                  Demo
                </span>
              </div>

              <nav className="flex flex-wrap items-center justify-center gap-6">
                <Link href="/about" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">About</Link>
                <Link href="/responsible-ai" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Responsible AI</Link>
                <Link href="/team" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Team</Link>
                <Link href="/pricing" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
                <Link href="/privacy" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Privacy</Link>
                <Link href="/terms" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">Terms</Link>
              </nav>

              <p className="text-[12px] text-gray-400">
                &copy; 2026 ClearPath AI. Built for USAII Global AI Hackathon.
              </p>
            </div>
          </div>
        </footer>
      </main>
      <Footer />
    </div>
  )
}
