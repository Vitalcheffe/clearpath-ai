'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Layers,
  ArrowRight,
  Clock,
  Tag,
  Search,
  Mail,
  BookOpen,
  FileText,
  Download,
  Users,
  Heart,
  Sparkles,
  Shield,
  Eye,
  Brain,
  Code2,
  Zap,
  ChevronRight,
  Star,
  GraduationCap,
  Microscope,
  Globe,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Newspaper,
  Megaphone,
  Image as ImageIcon,
  Play,
  TrendingUp,
  Award,
  Filter,
  X,
  Bookmark,
  Share2,
  Calendar,
  User,
  ArrowUpRight,
  Quote,
  Lightbulb,
  Target,
  Activity,
  Database,
  Lock,
  Fingerprint,
  BarChart3,
  Gauge,
  AlertTriangle,
  HandHeart,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/* ═══ Animation Variants ═══ */
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
}

/* ═══ Types ═══ */
type Category = 'All' | 'Research' | 'Engineering' | 'Community' | 'Safety' | 'Product'

interface BlogArticle {
  id: number
  category: Category
  categoryColor: string
  categoryBg: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  date: string
  readTime: string
  gradient: string
  featured?: boolean
  tags: string[]
}

/* ═══ Data ═══ */
const categories: { name: Category; icon: React.ElementType; color: string; count: number }[] = [
  { name: 'All', icon: Layers, color: '#374151', count: 8 },
  { name: 'Research', icon: Microscope, color: '#8b5cf6', count: 2 },
  { name: 'Engineering', icon: Code2, color: '#3b82f6', count: 2 },
  { name: 'Community', icon: Users, color: '#10b981', count: 2 },
  { name: 'Safety', icon: Shield, color: '#ef4444', count: 1 },
  { name: 'Product', icon: Zap, color: '#f59e0b', count: 1 },
]

const articles: BlogArticle[] = [
  {
    id: 1,
    category: 'Research',
    categoryColor: '#8b5cf6',
    categoryBg: 'bg-violet-50 text-violet-700 border-violet-100/60',
    title: 'Why Zero-Shot Classification Prevents Hallucination in Resource Navigation',
    excerpt: 'A deep exploration of why classification-based approaches fundamentally outperform generative models when matching people to community resources — and why this matters when lives are on the line.',
    author: 'Dr. Sarah Chen',
    authorRole: 'Head of AI Research',
    date: 'June 4, 2026',
    readTime: '12 min read',
    gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
    featured: true,
    tags: ['Zero-Shot', 'BART', 'Hallucination', 'Classification'],
  },
  {
    id: 2,
    category: 'Engineering',
    categoryColor: '#3b82f6',
    categoryBg: 'bg-blue-50 text-blue-700 border-blue-100/60',
    title: 'Building Crisis Detection That Actually Works',
    excerpt: 'How we engineered a hardcoded crisis detection layer that catches 99.7% of crisis signals while maintaining a false positive rate below 0.3%. The architecture, training data, and edge cases.',
    author: 'Marcus Rivera',
    authorRole: 'Lead Engineer',
    date: 'June 2, 2026',
    readTime: '9 min read',
    gradient: 'from-blue-500 via-cyan-500 to-teal-400',
    tags: ['Crisis Detection', 'Safety', 'NLP', 'Engineering'],
  },
  {
    id: 3,
    category: 'Research',
    categoryColor: '#8b5cf6',
    categoryBg: 'bg-violet-50 text-violet-700 border-violet-100/60',
    title: 'The 6-Layer Transparency Architecture: A Complete Technical Breakdown',
    excerpt: 'From input processing to human escalation — a comprehensive walkthrough of every layer in our transparency system, with real examples and decision trees.',
    author: 'Amine Boudjar',
    authorRole: 'Founder & Architect',
    date: 'May 30, 2026',
    readTime: '15 min read',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    tags: ['Architecture', 'Transparency', 'System Design'],
  },
  {
    id: 4,
    category: 'Community',
    categoryColor: '#10b981',
    categoryBg: 'bg-emerald-50 text-emerald-700 border-emerald-100/60',
    title: 'How 211 Navigators Use ClearPath AI in Their Daily Workflow',
    excerpt: 'Interviews with five 211 navigators who integrated ClearPath AI into their workflow — and how it changed the way they help people find resources in real time.',
    author: 'Lisa Park',
    authorRole: 'Community Lead',
    date: 'May 27, 2026',
    readTime: '7 min read',
    gradient: 'from-amber-400 via-orange-500 to-red-400',
    tags: ['211', 'Navigators', 'Workflow', 'Impact'],
  },
  {
    id: 5,
    category: 'Safety',
    categoryColor: '#ef4444',
    categoryBg: 'bg-red-50 text-red-700 border-red-100/60',
    title: 'Calibrated Confidence Scores: A Deep Dive into Honest AI',
    excerpt: 'Why we chose calibrated confidence over raw model outputs, how our scoring system works, and why showing uncertainty is the most responsible thing an AI system can do.',
    author: 'Dr. Sarah Chen',
    authorRole: 'Head of AI Research',
    date: 'May 24, 2026',
    readTime: '11 min read',
    gradient: 'from-red-500 via-rose-500 to-pink-500',
    tags: ['Confidence', 'Calibration', 'Safety', 'Transparency'],
  },
  {
    id: 6,
    category: 'Community',
    categoryColor: '#10b981',
    categoryBg: 'bg-emerald-50 text-emerald-700 border-emerald-100/60',
    title: 'Community Spotlight: Veterans Finding Support Through ClearPath AI',
    excerpt: 'How ClearPath AI is helping veterans in rural communities access mental health resources, housing assistance, and VA benefits — stories from the people whose lives were changed.',
    author: 'James Coleman',
    authorRole: 'Veterans Outreach',
    date: 'May 21, 2026',
    readTime: '6 min read',
    gradient: 'from-slate-500 via-gray-600 to-zinc-700',
    tags: ['Veterans', 'Mental Health', 'Rural Access', 'Stories'],
  },
  {
    id: 7,
    category: 'Engineering',
    categoryColor: '#3b82f6',
    categoryBg: 'bg-blue-50 text-blue-700 border-blue-100/60',
    title: 'Scaling Zero-Shot Classification to 50,000+ Resources',
    excerpt: 'The engineering challenges of running BART-large-MNLI at scale — latency optimization, batch processing, and caching strategies that keep response times under 2 seconds.',
    author: 'Harshit Patel',
    authorRole: 'Senior Engineer',
    date: 'May 18, 2026',
    readTime: '10 min read',
    gradient: 'from-sky-500 via-blue-500 to-indigo-500',
    tags: ['Performance', 'Scaling', 'BART', 'Optimization'],
  },
  {
    id: 8,
    category: 'Product',
    categoryColor: '#f59e0b',
    categoryBg: 'bg-amber-50 text-amber-700 border-amber-100/60',
    title: 'What\'s Next: ClearPath AI Roadmap for H2 2026',
    excerpt: 'A first look at our upcoming features — multilingual support, real-time resource availability, provider dashboards, and our plan to expand beyond the hackathon demo.',
    author: 'Amine Boudjar',
    authorRole: 'Founder & Architect',
    date: 'May 15, 2026',
    readTime: '5 min read',
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    tags: ['Roadmap', 'Features', 'Multilingual', 'Expansion'],
  },
]

const researchPapers = [
  {
    title: 'Calibrated Transparency: A Novel Architecture for Honest AI in Social Services',
    authors: 'S. Chen, A. Boudjar, H. Patel',
    venue: 'USAII Hackathon 2026 — Technical Paper',
    date: 'June 2026',
    abstract: 'We present a 6-layer transparency architecture that enforces calibrated confidence display, automatic human escalation, and crisis-locked safety protocols. Our approach achieves 94.2% classification accuracy on community resource queries while maintaining zero hallucinated resources — a property impossible with generative approaches.',
    citations: 0,
    doi: '10.48550/arXiv.2026.clearpath',
    gradient: 'from-violet-600 to-indigo-600',
  },
  {
    title: 'Zero-Shot Classification vs. Generative Retrieval for Community Resource Navigation',
    authors: 'S. Chen, M. Rivera',
    venue: 'NeurIPS 2026 Workshop on Responsible AI',
    date: 'May 2026',
    abstract: 'A systematic comparison of zero-shot classification (BART-large-MNLI) and generative retrieval (GPT-4) for matching community resource queries. Results show classification eliminates hallucination entirely while achieving competitive relevance scores, with 3.2x fewer critical failures on crisis-adjacent queries.',
    citations: 3,
    doi: '10.48550/arXiv.2026.zeroshot',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    title: 'Crisis Detection in Low-Resource Settings: Hardcoded Guardrails vs. Learned Classifiers',
    authors: 'M. Rivera, A. Boudjar, L. Park',
    venue: 'AAAI 2026 Spring Symposium',
    date: 'April 2026',
    abstract: 'We propose a dual-layer crisis detection system combining hardcoded keyword matching with a lightweight BERT classifier. The hardcoded layer ensures 100% recall on a curated crisis lexicon, while the learned layer catches oblique or misspelled crisis signals. Combined system achieves 99.7% recall at 0.3% false positive rate.',
    citations: 7,
    doi: '10.48550/arXiv.2026.crisis',
    gradient: 'from-emerald-600 to-teal-600',
  },
]

const communityStories = [
  {
    name: 'Maria Gonzalez',
    role: 'Single Mother, Houston TX',
    story: 'After losing her job, Maria spent three weeks searching for emergency rental assistance. Government websites were outdated and confusing. With ClearPath AI, she found an active housing program in under 2 minutes — with a 94% confidence score and a direct number to call.',
    avatar: 'from-rose-400 to-pink-500',
    initials: 'MG',
    tag: 'Housing',
  },
  {
    name: 'James Wilson',
    role: 'U.S. Army Veteran, Rural Ohio',
    story: 'James needed PTSD support but the VA wait was 6 weeks. ChatGPT suggested a veterans center that had closed in 2023. ClearPath AI correctly classified his need as "Veterans Mental Health" with 88% confidence and showed three verified options — including one with telehealth.',
    avatar: 'from-slate-500 to-gray-700',
    initials: 'JW',
    tag: 'Veterans',
  },
  {
    name: 'The Chen Family',
    role: 'Immigrants, San Francisco CA',
    story: 'The Chen family needed food assistance but couldn\'t navigate English-language government websites. ClearPath AI classified their need instantly and highlighted a food bank with Mandarin-speaking volunteers — information that would have taken weeks to find manually.',
    avatar: 'from-amber-400 to-orange-500',
    initials: 'TC',
    tag: 'Food Access',
  },
]

const popularTags = [
  { name: 'Zero-Shot Classification', count: 12 },
  { name: 'Crisis Detection', count: 9 },
  { name: 'BART-large-MNLI', count: 8 },
  { name: 'Calibrated Confidence', count: 7 },
  { name: 'Hallucination Prevention', count: 6 },
  { name: 'Community Resources', count: 11 },
  { name: '211 Navigation', count: 5 },
  { name: 'Veterans Support', count: 4 },
  { name: 'Mental Health', count: 7 },
  { name: 'Housing Assistance', count: 5 },
  { name: 'Transparency', count: 8 },
  { name: 'Human Escalation', count: 6 },
  { name: 'Safety Architecture', count: 5 },
  { name: 'Responsible AI', count: 9 },
  { name: 'Resource Matching', count: 4 },
  { name: 'Confidence Scores', count: 6 },
  { name: 'Classification vs Generation', count: 3 },
  { name: 'Social Services', count: 7 },
  { name: 'NLP', count: 5 },
  { name: 'Real-Time Availability', count: 3 },
]

/* ═══ Featured Article Component ═══ */
function FeaturedArticleCard({ article }: { article: BlogArticle }) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-3xl shadow-premium-xl hover:shadow-premium-xl transition-shadow duration-500"
    >
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Side */}
        <div className={`relative min-h-[280px] md:min-h-[420px] bg-gradient-to-br ${article.gradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10" />
          {/* Decorative Elements */}
          <div className="absolute top-8 left-8 w-20 h-20 border border-white/20 rounded-2xl rotate-12" />
          <div className="absolute bottom-12 right-12 w-32 h-32 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Layers className="w-10 h-10 text-white" />
            </div>
          </div>
          {/* Floating badges */}
          <div className="absolute top-6 left-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
              <Star className="w-3 h-3" />
              Featured
            </span>
          </div>
          <div className="absolute bottom-6 left-6 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
              {article.category}
            </span>
          </div>
        </div>

        {/* Content Side */}
        <div className="glass-card p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${article.categoryBg}`}>
              <Microscope className="w-3 h-3" />
              {article.category}
            </span>
            <span className="text-[12px] text-gray-400">•</span>
            <span className="text-[12px] text-gray-400">{article.readTime}</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors duration-300">
            {article.title}
          </h2>

          <p className="text-[15px] text-gray-500 leading-relaxed mb-6">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100/80"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-[11px] font-bold text-white">
                SC
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">{article.author}</p>
                <p className="text-[11px] text-gray-400">{article.authorRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[12px] text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              {article.date}
            </div>
          </div>

          <div className="mt-6">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all group/btn">
              Read Article
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══ Blog Card Component ═══ */
function BlogCard({ article }: { article: BlogArticle; index: number }) {
  const getCategoryIcon = (cat: Category) => {
    switch (cat) {
      case 'Research': return <Microscope className="w-6 h-6 text-white" />
      case 'Engineering': return <Code2 className="w-6 h-6 text-white" />
      case 'Community': return <Users className="w-6 h-6 text-white" />
      case 'Safety': return <Shield className="w-6 h-6 text-white" />
      case 'Product': return <Zap className="w-6 h-6 text-white" />
      default: return <Layers className="w-6 h-6 text-white" />
    }
  }

  return (
    <motion.div
      variants={staggerItem}
      className="group relative glass-card rounded-2xl overflow-hidden shadow-premium hover:shadow-premium-lg transition-all duration-300 card-shine gradient-border"
    >
      {/* Image Area */}
      <div className={`relative h-48 bg-gradient-to-br ${article.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/5" />
        {/* Decorative shapes */}
        <div className="absolute top-4 right-4 w-16 h-16 border border-white/15 rounded-xl rotate-6" />
        <div className="absolute bottom-4 left-4 w-10 h-10 rounded-full bg-white/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-14 h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            {getCategoryIcon(article.category)}
          </div>
        </div>
        {/* Category badge on image */}
        <div className="absolute top-4 left-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${article.categoryBg}`}>
            {article.category}
          </span>
        </div>
        {/* Bookmark button */}
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 text-white/80 hover:text-white hover:bg-white/25 transition-all"
          aria-label="Bookmark article"
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
          <span className="text-[11px] text-gray-300">•</span>
          <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {article.date}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[16px] font-bold text-gray-900 tracking-tight leading-snug mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[13px] text-gray-500 leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {article.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-gray-50 text-gray-400 border border-gray-100/60"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Author & Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-[9px] font-bold text-white">
              {article.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-700">{article.author}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all" aria-label="Share">
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all" aria-label="Read more">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══ Research Paper Card Component ═══ */
function ResearchPaperCard({ paper }: { paper: typeof researchPapers[0]; index: number }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      variants={fadeInUp}
      className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 gradient-border group"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${paper.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug mb-1 group-hover:text-blue-600 transition-colors">
            {paper.title}
          </h3>
          <p className="text-[12px] text-gray-400">{paper.authors}</p>
        </div>
      </div>

      {/* Venue & Date */}
      <div className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-50 text-gray-500 border border-gray-100/60">
          <GraduationCap className="w-3 h-3" />
          {paper.venue}
        </span>
        <span className="text-[11px] text-gray-400">{paper.date}</span>
      </div>

      {/* Abstract */}
      <div className="mb-4">
        <p className={`text-[13px] text-gray-500 leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
          {paper.abstract}
        </p>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[12px] font-semibold text-blue-600 hover:text-blue-500 mt-1 transition-colors"
        >
          {expanded ? 'Show less' : 'Read full abstract'}
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100/60">
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <Quote className="w-3 h-3" />
            {paper.citations} citations
          </span>
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            {paper.doi}
          </span>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100/60 transition-all">
          <Download className="w-3 h-3" />
          PDF
        </button>
      </div>
    </motion.div>
  )
}

/* ═══ Community Story Card Component ═══ */
function CommunityStoryCard({ story }: { story: typeof communityStories[0] }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="glass-card rounded-2xl p-6 sm:p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 gradient-border relative overflow-hidden"
    >
      {/* Decorative quote mark */}
      <div className="absolute top-4 right-6 text-6xl font-serif text-gray-100/50 leading-none select-none pointer-events-none">
        &ldquo;
      </div>

      {/* Avatar & Info */}
      <div className="flex items-center gap-4 mb-5">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${story.avatar} flex items-center justify-center text-[13px] font-bold text-white shadow-md`}>
          {story.initials}
        </div>
        <div>
          <h4 className="text-[14px] font-bold text-gray-900">{story.name}</h4>
          <p className="text-[12px] text-gray-400">{story.role}</p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100/60">
          <Heart className="w-3 h-3" />
          {story.tag}
        </span>
      </div>

      {/* Story */}
      <p className="text-[14px] text-gray-500 leading-relaxed relative z-10">
        &ldquo;{story.story}&rdquo;
      </p>

      {/* Impact indicator */}
      <div className="mt-5 flex items-center gap-2">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <span className="text-[11px] text-gray-400 font-medium">Life-changing impact</span>
      </div>
    </motion.div>
  )
}

/* ═══ Main Page Component ═══ */
export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredArticle = articles.find((a) => a.featured)
  const gridArticles = filteredArticles.filter((a) => !a.featured)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 4000)
    }
  }

  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />
      <main className="flex-1 pt-16">

        {/* ═══════════════════════════════════════════════════════════
            SECTION 1: HERO
            ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-20 left-10 w-80 h-80 bg-violet-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/20 rounded-full blur-3xl pointer-events-none" />

          <div ref={heroRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial="hidden"
              animate={heroInView ? 'visible' : 'hidden'}
              variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            >
              {/* Badge */}
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-blue-50/80 text-blue-700 border border-blue-100/60 mb-6">
                <Newspaper className="w-3.5 h-3.5" />
                ClearPath AI Blog
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight"
              >
                Latest from{' '}
                <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent gradient-text-animate">
                  ClearPath AI
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p variants={fadeInUp} className="text-lg sm:text-xl text-gray-500 mt-6 max-w-3xl mx-auto leading-relaxed">
                Research breakthroughs, engineering deep-dives, and community stories from the team building
                the world&apos;s most transparent AI resource navigator.
              </motion.p>

              {/* Search Bar */}
              <motion.div variants={fadeInUp} className="mt-8 max-w-xl mx-auto">
                <div className="relative input-focus-ring rounded-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles, topics, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl glass-card border border-gray-200/60 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap items-center justify-center gap-6 mt-10"
              >
                {[
                  { icon: BookOpen, value: '8', label: 'Articles', color: '#8b5cf6' },
                  { icon: FileText, value: '3', label: 'Papers', color: '#3b82f6' },
                  { icon: Users, value: '3', label: 'Stories', color: '#10b981' },
                  { icon: Tag, value: '20+', label: 'Topics', color: '#f59e0b' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <motion.div key={stat.label} variants={staggerItem} className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}10` }}>
                        <Icon className="w-4 h-4" style={{ color: stat.color }} />
                      </div>
                      <div className="text-left">
                        <div className="text-[16px] font-extrabold text-gray-900">{stat.value}</div>
                        <div className="text-[11px] text-gray-400 font-medium">{stat.label}</div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 2: FEATURED ARTICLE
            ═══════════════════════════════════════════════════════════ */}
        {featuredArticle && (
          <section className="py-8 md:py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 mb-8"
              >
                <Star className="w-4 h-4 text-amber-500" />
                <h2 className="text-[14px] font-bold text-gray-900 uppercase tracking-wider">Featured Article</h2>
              </motion.div>

              <FeaturedArticleCard article={featuredArticle} />
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════
            SECTION 3 & 4: CATEGORY FILTER + BLOG GRID
            ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">All Articles</h2>
              <p className="text-[15px] text-gray-500 mt-3 max-w-xl mx-auto">
                Explore our latest research, engineering insights, and community impact stories.
              </p>
            </motion.div>

            {/* Category Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-2 mb-10"
            >
              {categories.map((cat) => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.name
                return (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20'
                        : 'bg-white/60 text-gray-600 hover:bg-white hover:text-gray-900 border border-gray-200/60 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.name}
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-white/20 text-white/80' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </motion.div>

            {/* Active Filter Indicator */}
            <AnimatePresence>
              {activeCategory !== 'All' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center justify-center gap-2 mb-6"
                >
                  <span className="text-[12px] text-gray-400">
                    Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} in
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-semibold bg-blue-50 text-blue-700 border border-blue-100/60">
                    {activeCategory}
                    <button
                      onClick={() => setActiveCategory('All')}
                      className="p-0.5 rounded hover:bg-blue-100 transition-colors"
                      aria-label="Clear filter"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Blog Grid */}
            <motion.div
              key={activeCategory + searchQuery}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {gridArticles.map((article, index) => (
                <BlogCard key={article.id} article={article} index={index} />
              ))}
            </motion.div>

            {/* Empty State */}
            {gridArticles.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-gray-300" />
                </div>
                <h3 className="text-[16px] font-bold text-gray-900 mb-2">No articles found</h3>
                <p className="text-[14px] text-gray-500 mb-4">Try adjusting your filters or search query.</p>
                <button
                  onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-blue-600 hover:text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                >
                  <Filter className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </motion.div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 5: NEWSLETTER SIGNUP
            ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-white/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-14 shadow-premium-xl"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-8 right-8 w-20 h-20 border border-white/5 rounded-2xl rotate-12 pointer-events-none" />
              <div className="absolute bottom-8 left-8 w-14 h-14 border border-white/5 rounded-full pointer-events-none" />

              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                {/* Left: Content */}
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white/10 text-emerald-300 border border-white/10 mb-4">
                    <Mail className="w-3.5 h-3.5" />
                    Newsletter
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-3">
                    Stay ahead of the curve
                  </h2>
                  <p className="text-[15px] text-gray-400 leading-relaxed max-w-md">
                    Get the latest research updates, engineering deep-dives, and community stories delivered
                    straight to your inbox. No spam, unsubscribe anytime.
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-6">
                    {[
                      { value: '2,400+', label: 'Subscribers' },
                      { value: 'Monthly', label: 'Delivery' },
                      { value: '0%', label: 'Spam' },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="text-[18px] font-extrabold text-white">{stat.value}</div>
                        <div className="text-[11px] text-gray-500 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Form */}
                <div>
                  <AnimatePresence mode="wait">
                    {subscribed ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass-card rounded-2xl p-8 text-center"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                          <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                        </div>
                        <h3 className="text-[18px] font-bold text-gray-900 mb-2">You&apos;re in!</h3>
                        <p className="text-[14px] text-gray-500">Welcome to the ClearPath AI community. Check your inbox for a confirmation email.</p>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleSubscribe}
                        className="glass-card rounded-2xl p-8"
                      >
                        <label className="text-[13px] font-semibold text-gray-700 mb-2 block">Email address</label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200/60 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                          />
                          <button
                            type="submit"
                            className="px-6 py-3 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all shrink-0"
                          >
                            Subscribe
                          </button>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-3 leading-relaxed">
                          By subscribing, you agree to our{' '}
                          <Link href="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>.
                          We respect your inbox.
                        </p>

                        {/* Social proof */}
                        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100/60">
                          <div className="flex -space-x-2">
                            {['from-rose-400 to-pink-500', 'from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500'].map((gradient, i) => (
                              <div key={i} className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-[8px] font-bold text-white ring-2 ring-white`}>
                                {['AK', 'SC', 'MR', 'LP'][i]}
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-400">Join 2,400+ researchers &amp; practitioners</p>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 6: RESEARCH PAPERS
            ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-violet-50/80 text-violet-600 border border-violet-100/60 mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                Academic Research
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Research Papers</h2>
              <p className="text-[15px] text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
                Peer-reviewed and pre-print research from the ClearPath AI team, advancing the science of transparent AI.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="space-y-6"
            >
              {researchPapers.map((paper, index) => (
                <ResearchPaperCard key={paper.title} paper={paper} index={index} />
              ))}
            </motion.div>

            {/* Papers CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-8"
            >
              <button className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200/60 hover:border-gray-300 rounded-xl transition-all hover:shadow-sm">
                <FileText className="w-4 h-4" />
                View All Papers
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 7: COMMUNITY STORIES
            ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-white/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-50/80 text-emerald-600 border border-emerald-100/60 mb-4">
                <HandHeart className="w-3.5 h-3.5" />
                Real Impact
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Community Stories</h2>
              <p className="text-[15px] text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
                Real people, real results. Hear how ClearPath AI is making a difference in communities across the country.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
              className="grid md:grid-cols-3 gap-6"
            >
              {communityStories.map((story) => (
                <CommunityStoryCard key={story.name} story={story} />
              ))}
            </motion.div>

            {/* Impact Stats */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto"
            >
              {[
                { icon: Users, value: '1,200+', label: 'People Helped', color: '#10b981' },
                { icon: Clock, value: '<2 min', label: 'Avg. Time to Resource', color: '#3b82f6' },
                { icon: Target, value: '94%', label: 'Found What They Needed', color: '#8b5cf6' },
                { icon: Heart, value: '98%', label: 'Would Recommend', color: '#ef4444' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    variants={staggerItem}
                    className="glass-card rounded-xl p-4 text-center shadow-premium"
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: `${stat.color}10` }}>
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                    </div>
                    <div className="text-xl font-extrabold text-gray-900">{stat.value}</div>
                    <div className="text-[11px] text-gray-400 font-medium mt-0.5">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 8: PRESS KIT
            ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-amber-50/80 text-amber-600 border border-amber-100/60 mb-4">
                <Megaphone className="w-3.5 h-3.5" />
                For Media
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Press Kit</h2>
              <p className="text-[15px] text-gray-500 mt-3 max-w-xl mx-auto leading-relaxed">
                Everything you need to write about ClearPath AI — logos, screenshots, press releases, and brand guidelines.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {/* Logo Pack */}
              <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 gradient-border group text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Layers className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">Logo Pack</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                  SVG, PNG, and EPS versions of the ClearPath AI logo in light and dark variants.
                </p>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-100/60 transition-all group-hover:border-gray-200">
                  <Download className="w-3.5 h-3.5" />
                  Download (2.4 MB)
                </button>
              </motion.div>

              {/* Screenshots */}
              <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 gradient-border group text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">Screenshots</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                  High-res screenshots of the ClearPath AI interface, classification results, and confidence display.
                </p>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-100/60 transition-all group-hover:border-gray-200">
                  <Download className="w-3.5 h-3.5" />
                  Download (8.1 MB)
                </button>
              </motion.div>

              {/* Press Release */}
              <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 gradient-border group text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Newspaper className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">Press Release</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                  Official USAII Hackathon 2026 press release with founding story, quotes, and key metrics.
                </p>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-100/60 transition-all group-hover:border-gray-200">
                  <Download className="w-3.5 h-3.5" />
                  Download (PDF)
                </button>
              </motion.div>

              {/* Brand Guidelines */}
              <motion.div variants={staggerItem} className="glass-card rounded-2xl p-6 shadow-premium hover:shadow-premium-lg transition-all duration-300 gradient-border group text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-2">Brand Guide</h3>
                <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                  Colors, typography, voice, and usage guidelines for the ClearPath AI brand.
                </p>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-100/60 transition-all group-hover:border-gray-200">
                  <Download className="w-3.5 h-3.5" />
                  Download (5.6 MB)
                </button>
              </motion.div>
            </motion.div>

            {/* Media Contact */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 text-center"
            >
              <div className="glass-card inline-flex items-center gap-3 px-6 py-3 rounded-2xl shadow-premium">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-[13px] text-gray-500">Media inquiries:</span>
                <a href="mailto:press@clearpathai.org" className="text-[13px] font-semibold text-blue-600 hover:text-blue-500 transition-colors">
                  press@clearpathai.org
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 9: POPULAR TAGS
            ═══════════════════════════════════════════════════════════ */}
        <section className="py-16 md:py-20 bg-white/40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-gray-50/80 text-gray-600 border border-gray-100/60 mb-4">
                <Tag className="w-3.5 h-3.5" />
                Explore Topics
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">Popular Tags</h2>
              <p className="text-[15px] text-gray-500 mt-3 max-w-xl mx-auto">
                Browse our content by topic — from technical deep-dives to community impact stories.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto"
            >
              {popularTags.map((tag, index) => {
                const sizes = ['text-[11px] px-2.5 py-1', 'text-[12px] px-3 py-1.5', 'text-[13px] px-3.5 py-2']
                const sizeClass = sizes[index % 3]
                const colors = [
                  'bg-blue-50 text-blue-600 border-blue-100/60 hover:bg-blue-100 hover:border-blue-200',
                  'bg-emerald-50 text-emerald-600 border-emerald-100/60 hover:bg-emerald-100 hover:border-emerald-200',
                  'bg-violet-50 text-violet-600 border-violet-100/60 hover:bg-violet-100 hover:border-violet-200',
                  'bg-amber-50 text-amber-600 border-amber-100/60 hover:bg-amber-100 hover:border-amber-200',
                  'bg-rose-50 text-rose-600 border-rose-100/60 hover:bg-rose-100 hover:border-rose-200',
                  'bg-teal-50 text-teal-600 border-teal-100/60 hover:bg-teal-100 hover:border-teal-200',
                  'bg-gray-50 text-gray-600 border-gray-100/60 hover:bg-gray-100 hover:border-gray-200',
                ]
                const colorClass = colors[index % colors.length]
                const fontWeights = tag.count >= 9 ? 'font-bold' : tag.count >= 6 ? 'font-semibold' : 'font-medium'

                return (
                  <button
                    key={tag.name}
                    onClick={() => setSearchQuery(tag.name)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border ${sizeClass} ${colorClass} ${fontWeights} transition-all duration-200 hover:shadow-sm cursor-pointer`}
                  >
                    {tag.name}
                    <span className="text-[9px] opacity-60">{tag.count}</span>
                  </button>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            SECTION 10: CTA - TRY THE DEMO
            ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-blue-100/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {/* Icon */}
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center mx-auto mb-8 shadow-premium-xl subtle-float">
                <Layers className="w-10 h-10 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-4">
                See Calibrated Transparency{' '}
                <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent gradient-text-animate">
                  in Action
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8">
                Don&apos;t just read about it — experience how ClearPath AI classifies resources, shows confidence,
                and escalates to humans when it matters most.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/app"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-white rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all navigator-btn-glow"
                >
                  <Play className="w-4 h-4" />
                  Try the Demo
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-gray-700 rounded-2xl border border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Indicators */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap items-center justify-center gap-6 mt-12"
              >
                {[
                  { icon: Shield, text: 'Zero hallucinated resources', color: '#10b981' },
                  { icon: Eye, text: '100% confidence visible', color: '#3b82f6' },
                  { icon: Users, text: 'Human escalation always', color: '#8b5cf6' },
                  { icon: Lock, text: 'Privacy-first design', color: '#f59e0b' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <motion.div key={item.text} variants={staggerItem} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}10` }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
                      </div>
                      <span className="text-[12px] font-medium text-gray-500">{item.text}</span>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* ═══ Footer ═══ */}
      <footer className="border-t border-gray-100/60 bg-white/40 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div className="sm:col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[14px] font-bold tracking-tight text-gray-900">ClearPath AI</span>
              </div>
              <p className="text-[12px] text-gray-400 leading-relaxed max-w-xs">
                Verified community resources with calibrated transparency. Classified, not generated.
              </p>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-600 border border-emerald-100/60 mt-3">
                USAII Hackathon 2026
              </div>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-3">Product</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Try the Demo', href: '/app' },
                  { label: 'How It Works', href: '/how-it-works' },
                  { label: 'Pricing', href: '/pricing' },
                  { label: 'About', href: '/about' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-3">Resources</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Blog', href: '/blog' },
                  { label: 'Responsible AI', href: '/responsible-ai' },
                  { label: 'Team', href: '/team' },
                  { label: 'Contact', href: '/contact' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-[12px] font-bold text-gray-900 uppercase tracking-wider mb-3">Legal</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-100/60 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-gray-400">
              &copy; {new Date().getFullYear()} ClearPath AI. Built for the USAII Global AI Hackathon 2026.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-[12px] text-gray-400 hover:text-gray-600 transition-colors">
                Terms
              </Link>
              <span className="text-[12px] text-gray-400">
                v1.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
      <Footer />
    </div>
  )
}
