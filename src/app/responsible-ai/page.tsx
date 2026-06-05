'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Eye,
  AlertTriangle,
  Check,
  X,
  Layers,
  Navigation,
  HelpCircle,
  Lock,
  Heart,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  BookOpen,
  Scale,
  Users,
  Fingerprint,
  Globe,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

// ─── ANIMATION VARIANTS ──────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
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
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

// ─── PRINCIPLES DATA ─────────────────────────────────────
const principles = [
  {
    icon: Eye,
    title: 'Confidence scores are ALWAYS visible',
    description:
      'Every single result shows a calibrated confidence percentage. Not a vague "match found" — a specific number derived from the BART-large-MNLI zero-shot classification scores, dampened for known over-classification categories. When we say 73% match, we mean it. When we say 45%, that is our honest assessment. Users deserve to know how much weight to give a recommendation before they invest their time pursuing it.',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.06)',
  },
  {
    icon: ShieldCheck,
    title: 'Crisis detection is ALWAYS hardcoded',
    description:
      'We never trust AI to detect crisis signals. Our crisis layer uses exact-match and regex patterns against a curated keyword list covering suicidal ideation, self-harm, domestic violence, and substance abuse emergencies. When a crisis keyword is detected, the AI is bypassed entirely — no classification, no confidence scoring, no hallucinated advice. Immediate connection to 988 Suicide & Crisis Lifeline and 211.org. Reliability over elegance when lives are at stake.',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.06)',
  },
  {
    icon: Users,
    title: 'Human escalation at <70% confidence',
    description:
      'When our model confidence drops below 70%, we do not try to be clever. We ask clarification questions. When it drops below 50%, we escalate to a human navigator at 211.org. This threshold is not arbitrary — it reflects the point at which zero-shot classification accuracy degrades meaningfully for community resource categorization. A confident wrong answer is more dangerous than no answer at all, especially for someone seeking help with food, housing, or mental health.',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.06)',
  },
  {
    icon: Navigation,
    title: 'We NEVER auto-contact services on behalf of users',
    description:
      'ClearPath AI will never dial a phone number, submit an application, or send a message on behalf of a user without explicit consent. We provide information and connections; the user takes action. This is a deliberate architectural boundary. Auto-contacting services could lead to unintended commitments, privacy violations, or inappropriate service engagement. We are a navigator, not an agent — we show the path, but the user walks it.',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.06)',
  },
  {
    icon: Lock,
    title: 'We NEVER store PII without consent',
    description:
      'No account creation required. No email, no password, no personal information stored. Session data is purged when the browser closes. No Google Analytics, no Facebook Pixel, no third-party tracking. The only data that leaves our system is the classification API call to HuggingFace, which processes text without storing it. Users seeking help for domestic violence or substance abuse often do so from shared devices — they deserve absolute privacy by default.',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.06)',
  },
  {
    icon: BookOpen,
    title: 'Known limitations are ALWAYS documented',
    description:
      'We explicitly list every known failure mode: misclassification of ambiguous queries, over-classification into mental health, missed crisis signals from non-standard phrasing, model API downtime, and confidence miscalibration. We do not hide behind vague disclaimers — we name specific risks, assess their likelihood and impact, and detail the mitigation for each. A team that cannot articulate its system\'s limitations has not thought deeply enough about responsible deployment.',
    color: '#06b6d4',
    bg: 'rgba(6,182,212,0.06)',
  },
]

// ─── RISKS DATA ──────────────────────────────────────────
const risks = [
  {
    risk: 'AI may classify a complex multi-need situation as a single category',
    mitigation:
      'Multi-label classification returns top 3 categories with individual confidence scores. A single mother asking about "food and shelter" will see both food assistance and housing resources, not just one. The "What Else" component surfaces alternatives the user didn\'t think to ask about.',
    severity: 'high',
    icon: Layers,
  },
  {
    risk: 'Crisis keywords could be missed by typo or non-English input',
    mitigation:
      'Hardcoded keyword list is continuously expanded through community feedback. Fuzzy matching catches common typos ("suicde", "kill myslf"). We always offer a human navigator option — even if crisis detection doesn\'t trigger, the user can reach a trained professional at any point. Non-English support is a documented limitation we acknowledge honestly.',
    severity: 'critical',
    icon: AlertTriangle,
  },
  {
    risk: 'Confidence scores could give false reassurance',
    mitigation:
      'Confidence ≠ accuracy, and we make this explicit in every result. A 75% confidence means "our model is 75% confident this is the right category" — not "this is 75% likely to be the right resource." We always show "Why" (explanation), "What Else" (alternatives), and "How Confident" (calibrated score with caveats) together, so confidence is never interpreted in isolation.',
    severity: 'high',
    icon: HelpCircle,
  },
  {
    risk: 'Resource data could be outdated',
    mitigation:
      'Every resource card shows a "Last verified" date. "Call to confirm" is always displayed alongside every resource. We curate from verified sources (211.org, government databases, verified nonprofits) rather than scraping the web, which would introduce outdated information, unverified organizations, and SEO-gamed results from predatory services.',
    severity: 'medium',
    icon: Globe,
  },
  {
    risk: 'Bias in training data',
    mitigation:
      'BART-large-MNLI is a zero-shot model — it is not fine-tuned on any biased community resource data. It classifies against our curated label set without having seen biased training examples for this domain. We further mitigate with confidence calibration that dampens scores for known over-classification categories (e.g., "mental health" when users mention stress), and clarification questions that specifically address severity.',
    severity: 'high',
    icon: Scale,
  },
]

// ─── LIMITATIONS DATA ────────────────────────────────────
const limitations = [
  {
    title: 'We can\'t verify real-time resource availability',
    description:
      'A food bank listed as open may have changed hours. A shelter may be at capacity tonight. We show "Last verified" dates and encourage users to call ahead, but we cannot confirm real-time availability. In a production system, this would require API integrations with each resource provider — an effort beyond our hackathon scope but architecturally planned.',
    icon: Globe,
  },
  {
    title: 'We can\'t guarantee accuracy of third-party data',
    description:
      'Our resource database is curated from verified sources, but those sources can contain errors. A government database may list incorrect eligibility requirements. A nonprofit\'s listed phone number may be outdated. We mitigate this by showing data provenance and encouraging verification, but we cannot independently verify every data point. This is why "call to confirm" is always visible.',
    icon: AlertTriangle,
  },
  {
    title: 'We can\'t detect crisis in all languages',
    description:
      'Our hardcoded crisis keyword list covers English-language crisis expressions. We acknowledge that non-English speakers, code-switchers, and users of African American English (AAE) may not be served by our current keyword list. This is a documented, honest limitation. We mitigate by always offering human navigator access and by expanding our keyword list through community feedback.',
    icon: Fingerprint,
  },
  {
    title: 'We can\'t replace professional judgment',
    description:
      'ClearPath AI is a navigator, not a counselor, social worker, or healthcare provider. We help people find resources — we do not diagnose, prescribe, or make decisions. When a user\'s situation requires professional expertise, we connect them to a trained 211 navigator who can provide it. Our confidence scores and human escalation thresholds are designed to route complex cases to humans, not to replace them.',
    icon: Heart,
  },
]

// ─── OVERSIGHT PROTOCOL DATA ─────────────────────────────
const oversightSteps = [
  {
    condition: 'Confidence < 70%',
    action: 'Clarification Questions',
    description:
      'The system asks targeted follow-up questions to resolve ambiguity. "Are you looking for emergency shelter tonight, or longer-term housing assistance?" This gives the user a chance to add detail and the model more context, often raising confidence above the threshold.',
    color: '#f59e0b',
    icon: HelpCircle,
  },
  {
    condition: 'Confidence < 50%',
    action: 'Human Escalation',
    description:
      'The system offers immediate connection to a 211.org navigator. Not buried in a footer — prominently displayed as the recommended next step. The navigator receives a structured summary of the query context, not raw text, enabling efficient human support.',
    color: '#ef4444',
    icon: Users,
  },
  {
    condition: 'Crisis detected',
    action: 'AI Bypassed Entirely',
    description:
      'The AI classification layer is completely skipped. No classification, no confidence scoring, no resource matching. The user sees immediate crisis resources: 988 Suicide & Crisis Lifeline, local crisis centers, emergency services, and one-click connection to a trained crisis counselor. No AI-generated advice is ever provided in crisis situations.',
    color: '#dc2626',
    icon: ShieldCheck,
  },
  {
    condition: 'User requests human',
    action: 'Immediate Connection',
    description:
      'A "Talk to a Navigator" button is available at every stage of the interaction — on every result card, in the clarification panel, and in the crisis response. The user can always choose to talk to a person. This is not a fallback; it is a first-class option available at all times.',
    color: '#3b82f6',
    icon: Navigation,
  },
]

// ─── 6-LAYER ARCHITECTURE DATA ───────────────────────────
const architectureLayers = [
  {
    layer: 1,
    name: 'User Input',
    icon: Fingerprint,
    responsibleFunction: 'Input sanitization & consent gate',
    description:
      'Before any processing, user input is sanitized for injection attacks. Location sharing is opt-in, not required. No personal identifiers (name, email, SSN) are ever collected. This layer enforces data minimization by design — we only process what is strictly necessary for resource classification.',
    color: '#3b82f6',
  },
  {
    layer: 2,
    name: 'Crisis Detection',
    icon: Shield,
    responsibleFunction: 'Deterministic safety override',
    description:
      'Hardcoded keyword scanner using exact-match and regex patterns. This is NOT AI-powered — it is a deterministic safety gate that operates with absolute certainty. When crisis keywords are detected, this layer short-circuits the entire pipeline and triggers the Crisis Response Protocol. It sits before the AI layer intentionally: safety must never depend on AI judgment.',
    color: '#ef4444',
  },
  {
    layer: 3,
    name: 'AI Classification',
    icon: Sparkles,
    responsibleFunction: 'Zero-shot categorization with provenance',
    description:
      'BART-large-MNLI performs zero-shot classification against our curated label set. Every result includes model provenance: the specific model version, the classification pipeline used, and the raw scores before calibration. This layer is fully auditable — every decision can be traced to a specific model output.',
    color: '#8b5cf6',
  },
  {
    layer: 4,
    name: 'Confidence Calibration',
    icon: Eye,
    responsibleFunction: 'Honest uncertainty quantification',
    description:
      'Raw model scores are calibrated using known dampening factors. The model over-classifies into "mental health" when users mention stress — so confidence for that category is dampened. This is not a weakness; it is an honest adjustment. Calibrated confidence drives downstream decisions: clarification questions, human escalation, and result display ordering.',
    color: '#f59e0b',
  },
  {
    layer: 5,
    name: 'Result Display',
    icon: BookOpen,
    responsibleFunction: 'Calibrated transparency to user',
    description:
      'Every result shows three components: "Why This Result" (plain-language explanation of the match), "What Else" (top-3 alternatives with their confidence scores), and "How Confident" (calibrated percentage with caveats). This is the opposite of the prevailing AI design philosophy that optimizes for appearing competent — we optimize for being honest.',
    color: '#10b981',
  },
  {
    layer: 6,
    name: 'Human Escalation',
    icon: Users,
    responsibleFunction: 'Safety net that never goes away',
    description:
      'The final layer is always-active human oversight. 211.org integration provides phone, chat, and referral connections to trained community navigators. The "Talk to a Navigator" button is visible at every stage. User feedback (thumbs up/down) is collected anonymously and used for recalibration, not retraining. This layer ensures that AI serves humans, not the other way around.',
    color: '#06b6d4',
  },
]

// ─── COMPARISON DATA ─────────────────────────────────────
const comparisonRows = [
  {
    dimension: 'Hallucination risk',
    genericAI: 'High — generative models can invent nonexistent programs, offices, or phone numbers',
    clearPath: 'Near-zero — classification only against a curated, verified 211 resource database',
    genericIcon: X,
    clearPathIcon: Check,
  },
  {
    dimension: 'Confidence visibility',
    genericAI: 'None — ChatGPT presents all answers with equal confidence regardless of certainty',
    clearPath: 'Always visible — calibrated percentage on every result with "Why" and "What Else" context',
    genericIcon: X,
    clearPathIcon: Check,
  },
  {
    dimension: 'Crisis handling',
    genericAI: 'AI-dependent — relies on model judgment to detect and respond to crisis signals',
    clearPath: 'Hardcoded — deterministic keyword scanner bypasses AI entirely, immediate 988/211 connection',
    genericIcon: X,
    clearPathIcon: Check,
  },
  {
    dimension: 'Data storage',
    genericAI: 'Conversations stored for model training, subject to data retention policies',
    clearPath: 'Session-only — all data purged on session end, no accounts, no PII, no third-party analytics',
    genericIcon: X,
    clearPathIcon: Check,
  },
  {
    dimension: 'Human escalation',
    genericAI: 'Buried in settings — "contact support" link with no context or urgency awareness',
    clearPath: 'Architectural — automatic at <70% confidence, always-available navigator button, 211.org integration',
    genericIcon: X,
    clearPathIcon: Check,
  },
  {
    dimension: 'Resource verification',
    genericAI: 'None — generates answers from training data with no source verification',
    clearPath: 'Curated database — verified sources only, "Last verified" dates, "Call to confirm" always shown',
    genericIcon: X,
    clearPathIcon: Check,
  },
  {
    dimension: 'Known limitations',
    genericAI: 'Vague disclaimers — "may make mistakes" with no specificity about what could go wrong',
    clearPath: 'Explicitly documented — every failure mode named, assessed, and mitigated in public documentation',
    genericIcon: X,
    clearPathIcon: Check,
  },
]

// ─── COMMITMENT CHECKLIST ────────────────────────────────
const commitments = [
  { text: 'All AI decisions are explainable', status: 'Implemented', evidence: '"Why This Result" display for every recommendation' },
  { text: 'Confidence scores are displayed', status: 'Implemented', evidence: '"How Confident" percentage on every result' },
  { text: 'Crisis detection is deterministic', status: 'Implemented', evidence: 'Hardcoded keyword scanner, no AI dependency' },
  { text: 'Human escalation is available', status: 'Implemented', evidence: '211.org integration + confidence threshold trigger' },
  { text: 'No PII is collected or stored', status: 'Implemented', evidence: 'Session-based only, no accounts, no persistent storage' },
  { text: 'Known failure modes are documented', status: 'Implemented', evidence: 'Full failure mode table in documentation' },
  { text: 'Bias risks are identified and mitigated', status: 'Implemented', evidence: '5 identified bias types with specific mitigations' },
  { text: 'Code is open-source and auditable', status: 'Planned', evidence: 'GitHub repository with full documentation' },
  { text: 'Resource database is curated, not scraped', status: 'Implemented', evidence: 'Verified sources only — 211.org, government databases' },
  { text: 'User feedback improves the system', status: 'Planned', evidence: 'Anonymous feedback mechanism in post-hackathon version' },
]

// ─── RESPONSIBLE AI PAGE ─────────────────────────────────
export default function ResponsibleAIPage() {
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null)

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      {/* ═══════════ HERO ═══════════ */}
      <section className="pt-28 pb-12 md:pt-40 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-red-50/80 text-red-700 border border-red-100/60 backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5" />
              INFORMS Scoring: Responsible AI 15%
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mt-8 leading-[1.1]"
          >
            Responsible AI is not a feature.{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%]">
              It&apos;s the architecture.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-500 mt-8 max-w-3xl mx-auto leading-relaxed"
          >
            ClearPath AI is built on a single conviction:{' '}
            <span className="font-semibold text-gray-700">
              a confident wrong answer is more dangerous than no answer at all.
            </span>{' '}
            When vulnerable people seek help with food, housing, or mental health, an AI that
            confidently directs them to a non-existent program doesn&apos;t just waste time — it
            erodes trust in the entire help-seeking process. Our Responsible AI Framework is not an
            afterthought. It is the architectural foundation of the system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: Eye, label: 'Transparency', color: '#3b82f6' },
              { icon: Shield, label: 'Safety', color: '#ef4444' },
              { icon: Lock, label: 'Privacy', color: '#8b5cf6' },
              { icon: Scale, label: 'Fairness', color: '#f59e0b' },
              { icon: BookOpen, label: 'Accountability', color: '#10b981' },
              { icon: Users, label: 'Human Oversight', color: '#06b6d4' },
            ].map((dim) => {
              const DIcon = dim.icon
              return (
                <span
                  key={dim.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border backdrop-blur-sm"
                  style={{
                    backgroundColor: `${dim.color}08`,
                    borderColor: `${dim.color}18`,
                    color: dim.color,
                  }}
                >
                  <DIcon className="w-3 h-3" />
                  {dim.label}
                </span>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ 6 NON-NEGOTIABLE PRINCIPLES ═══════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-amber-50/80 text-amber-700 border border-amber-100/60 backdrop-blur-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                Our 6 Non-Negotiable Principles
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mt-6"
            >
              What we will{' '}
              <span className="text-red-500">never</span> compromise on
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[16px] text-gray-500 mt-4 max-w-2xl mx-auto">
              These are not aspirational guidelines. They are architectural constraints baked into every
              layer of the system — enforced in code, not just in documentation.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {principles.map((principle) => {
              const PIcon = principle.icon
              return (
                <motion.div
                  key={principle.title}
                  variants={staggerItem}
                  className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden card-shine gradient-border"
                >
                  <div className="relative z-10 space-y-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: principle.bg }}
                    >
                      <PIcon className="w-5 h-5" style={{ color: principle.color }} />
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug">
                      {principle.title}
                    </h3>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{principle.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ WHAT COULD GO WRONG ═══════════ */}
      <section className="py-16 md:py-24 bg-white/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-orange-50/80 text-orange-700 border border-orange-100/60 backdrop-blur-sm">
                <AlertTriangle className="w-3.5 h-3.5" />
                Honest Risk Assessment
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mt-6"
            >
              What could go wrong
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[16px] text-gray-500 mt-4 max-w-2xl mx-auto">
              Every AI system has failure modes. The responsible approach is not to pretend they don&apos;t
              exist — it&apos;s to name them, assess them, and build mitigations for each one. Here are the
              five risks we take most seriously, and exactly how we address them.
            </motion.p>
          </motion.div>

          <div className="space-y-4">
            {risks.map((risk, i) => {
              const RIcon = risk.icon
              const severityColor =
                risk.severity === 'critical'
                  ? '#dc2626'
                  : risk.severity === 'high'
                  ? '#ef4444'
                  : '#f59e0b'

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="glass-card rounded-2xl shadow-premium overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedRisk(expandedRisk === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/40 transition-colors"
                    aria-expanded={expandedRisk === i}
                  >
                    <div className="flex items-start gap-4 pr-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: `${severityColor}10` }}
                      >
                        <RIcon className="w-4.5 h-4.5" style={{ color: severityColor }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[14px] font-semibold text-gray-900">
                            Risk {i + 1}
                          </span>
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${severityColor}10`,
                              color: severityColor,
                            }}
                          >
                            {risk.severity}
                          </span>
                        </div>
                        <p className="text-[14px] text-gray-700 mt-1 font-medium">{risk.risk}</p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: expandedRisk === i ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </motion.div>
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedRisk === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="border-t border-gray-100/60 pt-4">
                            <div className="flex items-start gap-2">
                              <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                              </div>
                              <div>
                                <span className="text-[12px] font-bold uppercase tracking-wider text-emerald-600">
                                  Mitigation
                                </span>
                                <p className="text-[14px] text-gray-500 leading-relaxed mt-1">
                                  {risk.mitigation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ WHAT WE COULDN'T FIX ═══════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-gray-100/80 text-gray-600 border border-gray-200/60 backdrop-blur-sm">
                <X className="w-3.5 h-3.5" />
                Radical Honesty
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mt-6"
            >
              What we couldn&apos;t fix
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[16px] text-gray-500 mt-4 max-w-3xl mx-auto">
              These limitations are not weaknesses in our Responsible AI framework — they are strengths.
              A team that cannot articulate its system&apos;s limitations has not thought deeply enough about
              responsible deployment. We believe honesty about what we cannot do is as important as
              demonstrating what we can.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {limitations.map((limitation) => {
              const LIcon = limitation.icon
              return (
                <motion.div
                  key={limitation.title}
                  variants={staggerItem}
                  className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden"
                  style={{
                    borderLeft: '3px solid rgba(239,68,68,0.3)',
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                        <LIcon className="w-4.5 h-4.5 text-red-400" />
                      </div>
                      <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug mt-1.5">
                        {limitation.title}
                      </h3>
                    </div>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{limitation.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ HUMAN OVERSIGHT PROTOCOL ═══════════ */}
      <section className="py-16 md:py-24 bg-white/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-blue-50/80 text-blue-700 border border-blue-100/60 backdrop-blur-sm">
                <Users className="w-3.5 h-3.5" />
                Human Oversight Protocol
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mt-6"
            >
              When AI steps back,{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%]">
                humans step in
              </span>
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[16px] text-gray-500 mt-4 max-w-2xl mx-auto">
              Human oversight in ClearPath AI is not a &quot;contact us&quot; link buried in a footer. It is an
              integral, automatic part of the system flow that activates in four defined conditions.
              This protocol ensures AI serves humans — never the other way around.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {oversightSteps.map((step, i) => {
              const SIcon = step.icon
              return (
                <motion.div
                  key={step.condition}
                  variants={staggerItem}
                  className="glass-card rounded-2xl p-6 md:p-8 shadow-premium relative overflow-hidden"
                >
                  {/* Colored left accent */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{ backgroundColor: step.color }}
                  />

                  <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
                    <div className="flex items-start gap-4 md:w-2/5">
                      <div className="flex flex-col items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${step.color}10` }}
                        >
                          <SIcon className="w-5 h-5" style={{ color: step.color }} />
                        </div>
                        <span className="text-[11px] font-bold text-gray-300">STEP {i + 1}</span>
                      </div>
                      <div>
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-bold"
                          style={{
                            backgroundColor: `${step.color}10`,
                            color: step.color,
                          }}
                        >
                          {step.condition}
                        </span>
                        <h3 className="text-[16px] font-bold text-gray-900 tracking-tight mt-2">
                          {step.action}
                        </h3>
                      </div>
                    </div>
                    <div className="md:w-3/5">
                      <p className="text-[14px] text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ ARCHITECTURE OF HONESTY (6-LAYER DIAGRAM) ═══════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-violet-50/80 text-violet-700 border border-violet-100/60 backdrop-blur-sm">
                <Layers className="w-3.5 h-3.5" />
                Architecture of Honesty
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mt-6"
            >
              Our 6-layer safety architecture
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[16px] text-gray-500 mt-4 max-w-3xl mx-auto">
              Each layer serves a specific responsible AI function. Together, they form a pipeline
              where safety is enforced at every stage — from input to human escalation. This is
              not a feature bolted on after the fact; it is the architecture itself.
            </motion.p>
          </motion.div>

          {/* Visual Layer Diagram */}
          <div className="space-y-4">
            {architectureLayers.map((layer, i) => {
              const AIcon = layer.icon
              return (
                <motion.div
                  key={layer.layer}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-6 md:p-8 shadow-premium hover:shadow-premium-lg transition-shadow duration-300 relative overflow-hidden card-shine"
                >
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-start gap-6">
                    {/* Layer number + icon */}
                    <div className="flex items-center gap-4 lg:w-56 shrink-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
                        style={{
                          background: `linear-gradient(135deg, ${layer.color}15, ${layer.color}08)`,
                          border: `1px solid ${layer.color}20`,
                        }}
                      >
                        <AIcon className="w-6 h-6" style={{ color: layer.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[11px] font-bold uppercase tracking-widest"
                            style={{ color: layer.color }}
                          >
                            Layer {layer.layer}
                          </span>
                          {i < architectureLayers.length - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 hidden lg:block" />
                          )}
                        </div>
                        <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">
                          {layer.name}
                        </h3>
                      </div>
                    </div>

                    {/* Responsible AI function badge */}
                    <div className="lg:w-52 shrink-0">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                        style={{
                          backgroundColor: `${layer.color}08`,
                          color: layer.color,
                          border: `1px solid ${layer.color}15`,
                        }}
                      >
                        <Shield className="w-3 h-3" />
                        {layer.responsibleFunction}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="lg:flex-1">
                      <p className="text-[13px] text-gray-500 leading-relaxed">{layer.description}</p>
                    </div>
                  </div>

                  {/* Flow arrow between layers */}
                  {i < architectureLayers.length - 1 && (
                    <div className="flex justify-center mt-2 lg:hidden">
                      <ArrowRight className="w-4 h-4 text-gray-300 rotate-90" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Pipeline visualization */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 glass-card rounded-2xl p-6 md:p-8 shadow-premium"
          >
            <div className="text-center mb-6">
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                Data Flow Pipeline
              </span>
            </div>
            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
              {architectureLayers.map((layer, i) => (
                <div key={layer.layer} className="flex items-center">
                  <div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold"
                    style={{
                      backgroundColor: `${layer.color}10`,
                      color: layer.color,
                    }}
                  >
                    <span className="hidden sm:inline">L{layer.layer}:</span> {layer.name}
                  </div>
                  {i < architectureLayers.length - 1 && (
                    <ArrowRight className="w-3 h-3 text-gray-300 mx-1" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ COMPARISON TABLE ═══════════ */}
      <section className="py-16 md:py-24 bg-white/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-red-50/80 text-red-700 border border-red-100/60 backdrop-blur-sm">
                <Scale className="w-3.5 h-3.5" />
                Comparison
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 mt-6"
            >
              Generic AI vs. ClearPath AI
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[16px] text-gray-500 mt-4 max-w-2xl mx-auto">
              When you&apos;re navigating someone to food, shelter, or crisis support, the difference between
              a generic chatbot and a responsibly-designed navigator isn&apos;t academic — it&apos;s life-critical.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl shadow-premium overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-[1fr_1fr_1fr] bg-gray-50/60 border-b border-gray-100/60">
              <div className="p-4 md:p-6">
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                  Dimension
                </span>
              </div>
              <div className="p-4 md:p-6 border-l border-gray-100/60">
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                  Generic AI (e.g. ChatGPT)
                </span>
              </div>
              <div className="p-4 md:p-6 border-l border-gray-100/60">
                <span className="text-[12px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3 h-3" />
                  ClearPath AI
                </span>
              </div>
            </div>

            {/* Table rows */}
            {comparisonRows.map((row, i) => {
              const GIcon = row.genericIcon
              const CIcon = row.clearPathIcon
              return (
                <motion.div
                  key={row.dimension}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="grid grid-cols-[1fr_1fr_1fr] border-b border-gray-50/60 last:border-b-0 hover:bg-white/40 transition-colors"
                >
                  <div className="p-4 md:p-6 flex items-start">
                    <span className="text-[13px] font-semibold text-gray-900">{row.dimension}</span>
                  </div>
                  <div className="p-4 md:p-6 border-l border-gray-100/30 flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                      <GIcon className="w-3 h-3 text-red-400" strokeWidth={3} />
                    </div>
                    <span className="text-[12px] text-gray-500 leading-relaxed">{row.genericAI}</span>
                  </div>
                  <div className="p-4 md:p-6 border-l border-gray-100/30 flex items-start gap-2 comparison-positive rounded-r-lg">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <CIcon className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                    </div>
                    <span className="text-[12px] text-gray-700 leading-relaxed font-medium">
                      {row.clearPath}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ COMMITMENT CHECKLIST ═══════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-emerald-50/80 text-emerald-700 border border-emerald-100/60 backdrop-blur-sm">
                <Check className="w-3.5 h-3.5" />
                Commitment Checklist
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mt-6"
            >
              What we&apos;ve committed to — and where we stand
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[16px] text-gray-500 mt-4 max-w-2xl mx-auto">
              Every claim below is demonstrable in our working prototype. Where a feature is planned
              rather than implemented, we say so honestly. No vague promises.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl shadow-premium overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/60 border-b border-gray-100/60">
                    <th className="text-left p-4 md:p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                      Commitment
                    </th>
                    <th className="text-left p-4 md:p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left p-4 md:p-5 text-[12px] font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">
                      Evidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {commitments.map((commitment, i) => (
                    <motion.tr
                      key={commitment.text}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="border-b border-gray-50/60 last:border-b-0 hover:bg-white/40 transition-colors"
                    >
                      <td className="p-4 md:p-5">
                        <span className="text-[13px] font-medium text-gray-900">{commitment.text}</span>
                      </td>
                      <td className="p-4 md:p-5">
                        {commitment.status === 'Implemented' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100/60">
                            <Check className="w-3 h-3" />
                            {commitment.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100/60">
                            <Sparkles className="w-3 h-3" />
                            {commitment.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 md:p-5 hidden md:table-cell">
                        <span className="text-[12px] text-gray-500">{commitment.evidence}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ NIST AI RMF ALIGNMENT ═══════════ */}
      <section className="py-16 md:py-24 bg-white/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-blue-50/80 text-blue-700 border border-blue-100/60 backdrop-blur-sm">
                <BookOpen className="w-3.5 h-3.5" />
                NIST AI Risk Management Framework
              </span>
            </motion.div>
            <motion.h2
              variants={staggerItem}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 mt-6"
            >
              Aligned with industry standards
            </motion.h2>
            <motion.p variants={staggerItem} className="text-[16px] text-gray-500 mt-4 max-w-2xl mx-auto">
              Our framework maps directly to the NIST AI Risk Management Framework, ensuring our
              responsible AI practices meet recognized standards for validity, safety, security,
              resilience, accountability, transparency, fairness, and privacy.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {[
              {
                principle: 'Validity & Reliability',
                implementation: 'Confidence calibration + human verification for low-confidence results',
                icon: Check,
                color: '#10b981',
              },
              {
                principle: 'Safety',
                implementation: 'Hardcoded crisis detection + human escalation + no autonomous action',
                icon: Shield,
                color: '#ef4444',
              },
              {
                principle: 'Transparency',
                implementation: '"Why / What Else / How Confident" display for every single result',
                icon: Eye,
                color: '#3b82f6',
              },
              {
                principle: 'Fairness',
                implementation: 'Bias identification + confidence calibration + clarification questions',
                icon: Scale,
                color: '#f59e0b',
              },
              {
                principle: 'Security',
                implementation: 'Input sanitization + rate limiting + no persistent data storage',
                icon: Lock,
                color: '#8b5cf6',
              },
              {
                principle: 'Resilience',
                implementation: 'Fallback to resource directory + 211.org when AI is unavailable',
                icon: Layers,
                color: '#06b6d4',
              },
              {
                principle: 'Accountability',
                implementation: 'Decision logging + open-source code + full model provenance',
                icon: BookOpen,
                color: '#6366f1',
              },
              {
                principle: 'Privacy',
                implementation: 'Session-based only + no PII + opt-in location + no third-party analytics',
                icon: Fingerprint,
                color: '#ec4899',
              },
            ].map((item) => {
              const NIcon = item.icon
              return (
                <motion.div
                  key={item.principle}
                  variants={staggerItem}
                  className="glass-card rounded-xl p-5 shadow-premium hover:shadow-premium-lg transition-shadow duration-300"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <NIcon className="w-4 h-4" style={{ color: item.color }} />
                  </div>
                  <h4 className="text-[13px] font-bold text-gray-900 tracking-tight">
                    {item.principle}
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1.5">
                    {item.implementation}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════════ COMMITMENT STATEMENT ═══════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            {/* Background glow */}
            <div
              className="absolute -inset-4 rounded-3xl opacity-30 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 20%, rgba(16,185,129,0.08), transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.06), transparent 50%)',
              }}
            />

            <div className="relative glass-card rounded-3xl p-8 md:p-14 shadow-premium-xl text-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 mb-8">
                <Heart className="w-7 h-7 text-white" />
              </div>

              {/* Quote */}
              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                When it matters most,{' '}
                <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%]">
                  honesty is the safest answer.
                </span>
              </blockquote>

              <p className="text-[16px] text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                We built ClearPath AI for the moments when someone needs help and can&apos;t afford a wrong
                answer. Every architectural decision — from hardcoded crisis detection to calibrated
                confidence scores to always-available human escalation — reflects our commitment to
                putting people before performance metrics. This is not a compliance checkbox. This is our
                manifesto. And we stand behind it.
              </p>

              {/* Divider */}
              <div className="mt-10 mb-8 flex items-center justify-center gap-4">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-gray-200" />
                <Shield className="w-4 h-4 text-gray-300" />
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-gray-200" />
              </div>

              {/* Signatures */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-blue-500/20">
                    <span className="text-[16px] font-bold text-white">AK</span>
                  </div>
                  <p className="text-[14px] font-bold text-gray-900">Alex Korane</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">Co-Founder & Engineer</p>
                </div>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/20">
                    <span className="text-[16px] font-bold text-white">RV</span>
                  </div>
                  <p className="text-[14px] font-bold text-gray-900">Rohan Vaidya</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">Co-Founder & Engineer</p>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 mt-8">
                USAII Global AI Hackathon 2026 — ClearPath AI Team
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="mt-auto sidebar-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <span className="text-[15px] font-bold tracking-tight text-white">ClearPath AI</span>
              </div>
              <p className="text-[13px] text-gray-400 leading-relaxed">
                When it matters most, honesty is the safest answer.
              </p>
              <p className="text-[11px] text-gray-500 font-medium">
                Built for USAII Global AI Hackathon 2026
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Product</h4>
              <nav className="space-y-3">
                <Link href="/#how-it-works" className="block text-[14px] text-gray-400 hover:text-white transition-colors">How It Works</Link>
                <Link href="/pricing" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Pricing</Link>
                <Link href="/app" className="block text-[14px] text-gray-400 hover:text-white transition-colors">Demo</Link>
              </nav>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Company</h4>
              <nav className="space-y-3">
                <Link href="/about" className="block text-[14px] text-gray-400 hover:text-white transition-colors">About</Link>
                <Link href="/responsible-ai" className="block text-[14px] text-white font-medium">Responsible AI</Link>
                <span className="block text-[14px] text-gray-400 hover:text-white transition-colors cursor-default">Team</span>
              </nav>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-[12px] font-bold uppercase tracking-wider text-gray-400">Legal</h4>
              <nav className="space-y-3">
                <span className="block text-[14px] text-gray-600 cursor-default">Privacy <span className="text-[10px] text-gray-700 bg-gray-800 px-1.5 py-0.5 rounded-md ml-1">Coming soon</span></span>
                <span className="block text-[14px] text-gray-600 cursor-default">Terms <span className="text-[10px] text-gray-700 bg-gray-800 px-1.5 py-0.5 rounded-md ml-1">Coming soon</span></span>
              </nav>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-[12px] text-gray-500 text-center">
              &copy; 2026 ClearPath AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
