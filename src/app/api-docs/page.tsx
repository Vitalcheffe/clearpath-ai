'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Layers,
  Code2,
  Key,
  Zap,
  Shield,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Copy,
  Check,
  ArrowRight,
  Terminal,
  Globe,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Info,
  Play,
  Send,
  FileText,
  Sparkles,
  Lock,
  Users,
  BarChart3,
  RefreshCw,
  Server,
  Activity,
  Cpu,
  Database,
  Hash,
  Rocket,
  MessageSquare,
  Braces,
  ArrowUpRight,
  ExternalLink,
  Gauge,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// ═══════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════
// SECTION WRAPPER
// ═══════════════════════════════════════════════════════════
function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════
// CODE BLOCK COMPONENT
// ═══════════════════════════════════════════════════════════
function CodeBlock({ code, language = 'json', filename }: { code: string; language?: string; filename?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl overflow-hidden shadow-premium border border-gray-800/50">
      {filename && (
        <div className="bg-gray-800 px-4 py-2.5 flex items-center justify-between border-b border-gray-700/50">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            <span className="text-[12px] font-mono text-gray-400 ml-2">{filename}</span>
          </div>
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{language}</span>
        </div>
      )}
      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-5 overflow-x-auto text-[13px] leading-relaxed font-mono">
          <code>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 p-2 rounded-lg bg-gray-700/60 hover:bg-gray-600/80 text-gray-300 hover:text-white transition-all"
          aria-label="Copy code"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// INLINE CODE COMPONENT
// ═══════════════════════════════════════════════════════════
function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="px-1.5 py-0.5 rounded-md bg-gray-100 text-[13px] font-mono text-gray-800 border border-gray-200/60">
      {children}
    </code>
  )
}

// ═══════════════════════════════════════════════════════════
// METHOD BADGE COMPONENT
// ═══════════════════════════════════════════════════════════
function MethodBadge({ method }: { method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    POST: 'bg-blue-50 text-blue-700 border-blue-200/60',
    PUT: 'bg-amber-50 text-amber-700 border-amber-200/60',
    DELETE: 'bg-red-50 text-red-700 border-red-200/60',
    PATCH: 'bg-violet-50 text-violet-700 border-violet-200/60',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wider border ${colors[method]}`}>
      {method}
    </span>
  )
}

// ═══════════════════════════════════════════════════════════
// FAQ ITEM COMPONENT
// ═══════════════════════════════════════════════════════════
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="glass-card rounded-2xl shadow-premium overflow-hidden transition-shadow duration-300 hover:shadow-premium-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left gap-4"
      >
        <span className="text-[15px] font-semibold text-gray-900 tracking-tight">{question}</span>
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${isOpen ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-gray-100/60 pt-4">
            <p className="text-[14px] text-gray-500 leading-relaxed">{answer}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// TABLE OF CONTENTS
// ═══════════════════════════════════════════════════════════
const tocSections = [
  { id: 'quick-start', label: 'Quick Start', icon: Rocket },
  { id: 'authentication', label: 'Authentication', icon: Key },
  { id: 'endpoints', label: 'Endpoints', icon: Terminal },
  { id: 'response-format', label: 'Response Format', icon: Braces },
  { id: 'rate-limits', label: 'Rate Limits', icon: Gauge },
  { id: 'changelog', label: 'Changelog', icon: FileText },
  { id: 'playground', label: 'Playground', icon: Play },
  { id: 'faq', label: 'FAQ', icon: MessageSquare },
]

// ═══════════════════════════════════════════════════════════
// ENDPOINT DATA
// ═══════════════════════════════════════════════════════════
const endpoints = [
  // ─── Classification ───
  {
    method: 'POST' as const,
    path: '/api/classify',
    title: 'Classify a Query',
    description: 'Classify user text against our category system powered by BART-large-MNLI zero-shot classification. Returns categories with confidence scores, reasoning, and crisis detection.',
    auth: true,
    requestExample: `{
  "query": "I lost my job and can't pay rent, my kids need food",
  "location": "30318"
}`,
    responseExample: `{
  "success": true,
  "data": {
    "query_id": "qry_a8f3c2d1e4b5",
    "classifications": [
      {
        "category": "Housing Assistance",
        "confidence": 0.87,
        "reasoning": "Query mentions inability to pay rent — immediate housing risk identified"
      },
      {
        "category": "Food Assistance",
        "confidence": 0.72,
        "reasoning": "Query mentions children needing food — SNAP/WIC eligibility likely"
      }
    ],
    "crisis_detected": false,
    "clarification_needed": false,
    "processing_time_ms": 1247
  }
}`,
    parameters: [
      { name: 'query', type: 'string', required: true, description: 'The natural language query to classify. Minimum 3 characters, maximum 2000 characters.' },
      { name: 'location', type: 'string', required: false, description: 'ZIP code, city, or state for location-aware resource matching. Defaults to national results.' },
    ],
  },
  // ─── Conversations ───
  {
    method: 'GET' as const,
    path: '/api/conversations',
    title: 'List Conversations',
    description: 'Retrieve a paginated list of conversations for a user. Supports filtering by category and full-text search.',
    auth: true,
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv_abc123",
        "title": "Housing and food assistance",
        "category": "Housing Assistance",
        "messageCount": 5,
        "createdAt": "2026-06-05T14:32:18.429Z",
        "updatedAt": "2026-06-05T15:10:00.000Z"
      }
    ],
    "total": 12,
    "skip": 0,
    "take": 20
  }
}`,
    parameters: [
      { name: 'userId', type: 'string', required: true, description: 'The user ID to fetch conversations for.' },
      { name: 'category', type: 'string', required: false, description: 'Filter by classification category (e.g., housing, food, mental_health).' },
      { name: 'search', type: 'string', required: false, description: 'Full-text search across conversation titles and messages.' },
      { name: 'skip', type: 'integer', required: false, description: 'Number of results to skip for pagination. Default: 0.' },
      { name: 'take', type: 'integer', required: false, description: 'Maximum number of results to return. Default: 20.' },
    ],
  },
  {
    method: 'GET' as const,
    path: '/api/conversations/[id]',
    title: 'Get Conversation',
    description: 'Retrieve a single conversation with all its messages.',
    auth: true,
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "id": "conv_abc123",
    "title": "Housing and food assistance",
    "category": "Housing Assistance",
    "userId": "user_456",
    "messages": [
      {
        "id": "msg_001",
        "role": "user",
        "content": "I lost my job and can't pay rent",
        "createdAt": "2026-06-05T14:32:18.429Z"
      },
      {
        "id": "msg_002",
        "role": "assistant",
        "content": "I understand you're facing housing challenges. Here are some resources that may help...",
        "createdAt": "2026-06-05T14:32:20.100Z"
      }
    ],
    "createdAt": "2026-06-05T14:32:18.429Z"
  }
}`,
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'The conversation ID (path parameter).' },
    ],
  },
  {
    method: 'DELETE' as const,
    path: '/api/conversations/[id]',
    title: 'Delete Conversation',
    description: 'Delete a conversation and all its messages permanently.',
    auth: true,
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "id": "conv_abc123",
    "deleted": true
  }
}`,
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'The conversation ID to delete (path parameter).' },
    ],
  },
  {
    method: 'POST' as const,
    path: '/api/conversations/[id]/messages',
    title: 'Add Message to Conversation',
    description: 'Add a new message to an existing conversation. The assistant will generate a response based on conversation context.',
    auth: true,
    requestExample: `{
  "content": "Can you also help me find food assistance programs?"
}`,
    responseExample: `{
  "success": true,
  "data": {
    "id": "msg_003",
    "role": "user",
    "content": "Can you also help me find food assistance programs?",
    "createdAt": "2026-06-05T15:10:00.000Z"
  }
}`,
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'The conversation ID (path parameter).' },
      { name: 'content', type: 'string', required: true, description: 'The message content. Maximum 5000 characters.' },
    ],
  },
  // ─── User ───
  {
    method: 'GET' as const,
    path: '/api/user/profile',
    title: 'Get User Profile',
    description: 'Retrieve the profile information for a user.',
    auth: true,
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "id": "user_456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "404-555-0123",
    "location": "Atlanta, GA",
    "createdAt": "2026-05-01T10:00:00.000Z"
  }
}`,
    parameters: [
      { name: 'userId', type: 'string', required: true, description: 'The user ID to fetch the profile for (query parameter).' },
    ],
  },
  {
    method: 'PUT' as const,
    path: '/api/user/profile',
    title: 'Update User Profile',
    description: 'Update the profile information for a user. Only included fields will be updated.',
    auth: true,
    requestExample: `{
  "userId": "user_456",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "404-555-9999",
  "location": "Atlanta, GA 30318"
}`,
    responseExample: `{
  "success": true,
  "data": {
    "id": "user_456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "404-555-9999",
    "location": "Atlanta, GA 30318",
    "updatedAt": "2026-06-05T16:00:00.000Z"
  }
}`,
    parameters: [
      { name: 'userId', type: 'string', required: true, description: 'The user ID to update.' },
      { name: 'name', type: 'string', required: false, description: 'Full name of the user.' },
      { name: 'email', type: 'string', required: false, description: 'Email address.' },
      { name: 'phone', type: 'string', required: false, description: 'Phone number.' },
      { name: 'location', type: 'string', required: false, description: 'Location (city, state, or ZIP).' },
    ],
  },
  {
    method: 'GET' as const,
    path: '/api/user/settings',
    title: 'Get User Settings',
    description: 'Retrieve the settings and preferences for a user.',
    auth: true,
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "userId": "user_456",
    "notifications": true,
    "crisisAlerts": true,
    "preferredLanguage": "en",
    "accessibilityMode": false,
    "darkMode": false,
    "locationSharing": true
  }
}`,
    parameters: [
      { name: 'userId', type: 'string', required: true, description: 'The user ID to fetch settings for (query parameter).' },
    ],
  },
  {
    method: 'PUT' as const,
    path: '/api/user/settings',
    title: 'Update User Settings',
    description: 'Update the settings and preferences for a user. Only included fields will be updated.',
    auth: true,
    requestExample: `{
  "userId": "user_456",
  "notifications": true,
  "crisisAlerts": true,
  "preferredLanguage": "en",
  "darkMode": true
}`,
    responseExample: `{
  "success": true,
  "data": {
    "userId": "user_456",
    "notifications": true,
    "crisisAlerts": true,
    "preferredLanguage": "en",
    "accessibilityMode": false,
    "darkMode": true,
    "locationSharing": true,
    "updatedAt": "2026-06-05T16:05:00.000Z"
  }
}`,
    parameters: [
      { name: 'userId', type: 'string', required: true, description: 'The user ID to update settings for.' },
      { name: 'notifications', type: 'boolean', required: false, description: 'Enable or disable notifications.' },
      { name: 'crisisAlerts', type: 'boolean', required: false, description: 'Enable or disable crisis alert popups.' },
      { name: 'preferredLanguage', type: 'string', required: false, description: 'Preferred language code (e.g., en, es).' },
      { name: 'accessibilityMode', type: 'boolean', required: false, description: 'Enable accessibility-enhanced UI.' },
      { name: 'darkMode', type: 'boolean', required: false, description: 'Enable dark mode theme.' },
      { name: 'locationSharing', type: 'boolean', required: false, description: 'Allow location sharing for better resource matching.' },
    ],
  },
  {
    method: 'GET' as const,
    path: '/api/user/stats',
    title: 'Get User Statistics',
    description: 'Retrieve usage statistics and summary data for a user.',
    auth: true,
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "userId": "user_456",
    "totalConversations": 12,
    "totalMessages": 47,
    "topCategories": [
      { "category": "Housing Assistance", "count": 5 },
      { "category": "Food Assistance", "count": 4 },
      { "category": "Employment Services", "count": 3 }
    ],
    "savedResources": 8,
    "accountAge": "36 days",
    "lastActive": "2026-06-05T15:10:00.000Z"
  }
}`,
    parameters: [
      { name: 'userId', type: 'string', required: true, description: 'The user ID to fetch statistics for (query parameter).' },
    ],
  },
  // ─── Saved Resources ───
  {
    method: 'GET' as const,
    path: '/api/saved-resources',
    title: 'List Saved Resources',
    description: 'Retrieve all resources saved/bookmarked by a user.',
    auth: true,
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "resources": [
      {
        "id": "saved_001",
        "title": "Emergency Rental Assistance Program",
        "category": "Housing Assistance",
        "provider": "HUD / Local Housing Authority",
        "savedAt": "2026-06-05T14:35:00.000Z"
      },
      {
        "id": "saved_002",
        "title": "SNAP Benefits Application",
        "category": "Food Assistance",
        "provider": "USDA / State DHS",
        "savedAt": "2026-06-04T10:20:00.000Z"
      }
    ],
    "total": 2
  }
}`,
    parameters: [
      { name: 'userId', type: 'string', required: true, description: 'The user ID to fetch saved resources for (query parameter).' },
    ],
  },
  {
    method: 'POST' as const,
    path: '/api/saved-resources',
    title: 'Save a Resource',
    description: 'Save/bookmark a resource to the user\'s saved resources list.',
    auth: true,
    requestExample: `{
  "userId": "user_456",
  "title": "Emergency Rental Assistance Program",
  "category": "Housing Assistance",
  "provider": "HUD / Local Housing Authority",
  "description": "Federal rental assistance for families facing eviction",
  "contact": "1-800-569-4287",
  "url": "https://www.hud.gov/rental-assistance"
}`,
    responseExample: `{
  "success": true,
  "data": {
    "id": "saved_003",
    "title": "Emergency Rental Assistance Program",
    "category": "Housing Assistance",
    "provider": "HUD / Local Housing Authority",
    "savedAt": "2026-06-05T16:30:00.000Z"
  }
}`,
    parameters: [
      { name: 'userId', type: 'string', required: true, description: 'The user ID saving the resource.' },
      { name: 'title', type: 'string', required: true, description: 'Title of the resource.' },
      { name: 'category', type: 'string', required: true, description: 'Category of the resource (e.g., housing, food, mental_health).' },
      { name: 'provider', type: 'string', required: false, description: 'Organization providing the resource.' },
      { name: 'description', type: 'string', required: false, description: 'Description of the resource.' },
      { name: 'contact', type: 'string', required: false, description: 'Contact information for the resource.' },
      { name: 'url', type: 'string', required: false, description: 'URL for more information.' },
    ],
  },
  {
    method: 'DELETE' as const,
    path: '/api/saved-resources/[id]',
    title: 'Remove Saved Resource',
    description: 'Remove a saved resource from the user\'s bookmarks.',
    auth: true,
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "id": "saved_001",
    "deleted": true
  }
}`,
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'The saved resource ID to remove (path parameter).' },
    ],
  },
  // ─── Auth ───
  {
    method: 'POST' as const,
    path: '/api/auth/register',
    title: 'Register Account',
    description: 'Create a new user account. Returns the created user object. After registration, use NextAuth.js sign-in to authenticate.',
    auth: false,
    requestExample: `{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "SecureP@ss123"
}`,
    responseExample: `{
  "success": true,
  "data": {
    "id": "user_456",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-06-05T14:00:00.000Z"
  }
}`,
    parameters: [
      { name: 'name', type: 'string', required: true, description: 'Full name of the user.' },
      { name: 'email', type: 'string', required: true, description: 'Valid email address for the account.' },
      { name: 'password', type: 'string', required: true, description: 'Password (minimum 8 characters, must include uppercase, lowercase, and number).' },
    ],
  },
  {
    method: 'POST' as const,
    path: '/api/auth/forgot-password',
    title: 'Request Password Reset',
    description: 'Send a password reset email to the specified address. The email contains a time-limited reset link.',
    auth: false,
    requestExample: `{
  "email": "jane@example.com"
}`,
    responseExample: `{
  "success": true,
  "data": {
    "message": "If an account with that email exists, a password reset link has been sent."
  }
}`,
    parameters: [
      { name: 'email', type: 'string', required: true, description: 'The email address associated with the account.' },
    ],
  },
  {
    method: 'GET' as const,
    path: '/api/auth/[...nextauth]',
    title: 'NextAuth.js Endpoints',
    description: 'NextAuth.js authentication endpoints including sign-in, sign-out, session management, and callback handling. These endpoints are managed by NextAuth.js and follow the standard NextAuth.js API.',
    auth: false,
    requestExample: null,
    responseExample: `// GET /api/auth/session
{
  "user": {
    "name": "Jane Doe",
    "email": "jane@example.com"
  },
  "expires": "2026-06-19T14:00:00.000Z"
}`,
    parameters: [
      { name: 'provider', type: 'string', required: false, description: 'OAuth provider slug (path parameter, e.g., credentials, google).' },
      { name: 'action', type: 'string', required: false, description: 'NextAuth action (path parameter: signin, signout, callback, session).' },
    ],
  },
  // ─── Public ───
  {
    method: 'GET' as const,
    path: '/api/community-resources',
    title: 'List Community Resources',
    description: 'Retrieve publicly available community resources. No authentication required. Filter by category or search by keyword.',
    auth: false,
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "resources": [
      {
        "id": "res_2847",
        "name": "Emergency Rental Assistance Program",
        "category": "Housing Assistance",
        "provider": "HUD / Local Housing Authority",
        "description": "Federal rental assistance for families facing eviction",
        "contact": "1-800-569-4287",
        "url": "https://www.hud.gov/rental-assistance"
      },
      {
        "id": "res_4102",
        "name": "SNAP Benefits Application",
        "category": "Food Assistance",
        "provider": "USDA / State DHS",
        "description": "Supplemental Nutrition Assistance Program for low-income families",
        "contact": "1-800-221-5689",
        "url": "https://www.fns.usda.gov/snap"
      }
    ],
    "total": 2847
  }
}`,
    parameters: [
      { name: 'category', type: 'string', required: false, description: 'Filter by category (e.g., housing, food, mental_health, employment, legal, healthcare, crisis, senior).' },
      { name: 'search', type: 'string', required: false, description: 'Full-text search across resource names and descriptions.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════
// RATE LIMIT DATA (TBD)
// ═══════════════════════════════════════════════════════════
const rateLimitTiers = [
  {
    name: 'Free',
    price: '$0/mo',
    icon: Layers,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-500',
    limits: [
      { label: 'Requests per minute', value: 'TBD' },
      { label: 'Requests per day', value: 'TBD' },
      { label: 'Requests per month', value: 'TBD' },
    ],
    features: ['Standard classification speed', 'Core categories', 'Basic resource matching'],
  },
  {
    name: 'Pro',
    price: 'TBD',
    icon: Zap,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    popular: true,
    limits: [
      { label: 'Requests per minute', value: 'TBD' },
      { label: 'Requests per day', value: 'TBD' },
      { label: 'Requests per month', value: 'TBD' },
    ],
    features: ['Priority speed', 'Multi-label classification', 'Advanced clarification engine', 'Saved history API'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    icon: Shield,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    limits: [
      { label: 'Requests per minute', value: 'TBD' },
      { label: 'Requests per day', value: 'TBD' },
      { label: 'Requests per month', value: 'TBD' },
    ],
    features: ['Dedicated speed', 'Custom categories', 'SLA guarantee', 'Custom resource databases'],
  },
]

// ═══════════════════════════════════════════════════════════
// CHANGELOG DATA
// ═══════════════════════════════════════════════════════════
const changelogEntries = [
  {
    version: 'v1.0.0',
    date: 'June 2026',
    type: 'release',
    title: 'Initial Release',
    changes: [
      'POST /api/classify — Classify user text with confidence scores and crisis detection',
      'Conversation management — Create, read, delete conversations and messages',
      'User profile and settings — Full profile and preferences management',
      'Saved resources — Bookmark and manage resource listings',
      'Authentication — Register, password reset, and NextAuth.js integration',
      'Community resources — Public resource directory with search and filtering',
    ],
  },
]

// ═══════════════════════════════════════════════════════════
// FAQ DATA
// ═══════════════════════════════════════════════════════════
const apiFAQs = [
  {
    question: 'How do I get an API key?',
    answer: 'Sign up for a free account and navigate to your Dashboard. Under the API Keys section, click "Generate New Key." Your key will be displayed once — store it securely. Rate limits are currently TBD during the initial release phase.',
  },
  {
    question: 'What happens when I exceed my rate limit?',
    answer: 'When you exceed your rate limit, the API returns a 429 Too Many Requests response with a Retry-After header indicating when you can make your next request. Implement exponential backoff for retry logic.',
  },
  {
    question: 'Is the API suitable for production use?',
    answer: 'The API is currently in its initial release (v1.0.0). It supports classification, conversation management, user profiles, saved resources, and community resources. Remember that the API is a classification tool — it should complement, not replace, human judgment in resource navigation.',
  },
  {
    question: 'How does the classification engine handle ambiguous queries?',
    answer: 'When confidence scores fall below the threshold, the API returns a clarification_needed flag. You can present these to your users for multi-turn refinement using the conversations API to maintain context.',
  },
  {
    question: 'What data does the API log?',
    answer: 'We log minimal metadata for each request: timestamp, response status, and processing time. We do NOT log query text, classification results, or any personally identifiable information. See our Privacy Policy for full details.',
  },
  {
    question: 'How do I handle errors gracefully?',
    answer: 'All errors follow a consistent JSON structure with error code, message, and suggested action. Implement exponential backoff for 429 and 503 errors (retry after the time in Retry-After header). For 401/403 errors, check your API key. For 422 errors, validate your request body against the schema. We recommend wrapping API calls in try/catch blocks and providing fallback UI for your users.',
  },
  {
    question: 'What authentication methods are supported?',
    answer: 'The API uses NextAuth.js for authentication. You can register via POST /api/auth/register, use the forgot-password flow via POST /api/auth/forgot-password, and authenticate through the standard NextAuth.js endpoints at /api/auth/[...nextauth]. Most endpoints require a valid session.',
  },
  {
    question: 'Can I access community resources without authentication?',
    answer: 'Yes! The GET /api/community-resources endpoint is publicly accessible and does not require authentication. You can filter by category and search by keyword. This is useful for building public-facing resource directories.',
  },
]

// ═══════════════════════════════════════════════════════════
// ERROR CODES DATA
// ═══════════════════════════════════════════════════════════
const errorCodes = [
  { code: 200, label: 'OK', description: 'Request succeeded. Classification results returned.' },
  { code: 400, label: 'Bad Request', description: 'Invalid request body or missing required parameters. Check the error message for details.' },
  { code: 401, label: 'Unauthorized', description: 'Missing or invalid API key. Ensure your Authorization header contains a valid Bearer token.' },
  { code: 403, label: 'Forbidden', description: 'Your API key does not have access to this endpoint. Check your plan and permissions.' },
  { code: 404, label: 'Not Found', description: 'The requested resource or endpoint does not exist. Check the URL path.' },
  { code: 422, label: 'Unprocessable Entity', description: 'Request body is valid JSON but fails validation. Check field types, ranges, and allowed values.' },
  { code: 429, label: 'Too Many Requests', description: 'Rate limit exceeded. Check the Retry-After header and X-RateLimit-Reset response headers.' },
  { code: 500, label: 'Internal Server Error', description: 'An unexpected error occurred on our side. Please retry. If persistent, contact support.' },
  { code: 503, label: 'Service Unavailable', description: 'The classification engine is temporarily offline. This is rare — retry after a few seconds.' },
]

// ═══════════════════════════════════════════════════════════
// SIDEBAR TOC COMPONENT
// ═══════════════════════════════════════════════════════════
function TableOfContents() {
  const [activeSection, setActiveSection] = useState('quick-start')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )

    tocSections.forEach((section) => {
      const el = document.getElementById(section.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="hidden xl:block sticky top-24 w-56 shrink-0 self-start" aria-label="Table of contents">
      <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">On This Page</div>
      <ul className="space-y-1">
        {tocSections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-600'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {section.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

// ═══════════════════════════════════════════════════════════
// PLAYGROUND COMPONENT
// ═══════════════════════════════════════════════════════════
function Playground() {
  const [query, setQuery] = useState('I need help paying my electricity bill')
  const [location, setLocation] = useState('30318')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  const mockResponses: Record<string, object> = {
    default: {
      success: true,
      data: {
        query_id: 'qry_demo_' + Math.random().toString(36).substring(2, 8),
        classifications: [
          {
            category: 'Housing Assistance',
            confidence: 0.91,
            calibrated: true,
            reasoning: 'Query mentions difficulty paying utility bills — utility/rental assistance identified',
            alternatives: [
              { category: 'General Financial Aid', confidence: 0.54 },
              { category: 'Food Assistance', confidence: 0.23 },
            ],
            resources: [
              {
                id: 'res_demo_1',
                name: 'LIHEAP (Low Income Home Energy Assistance)',
                provider: 'US Department of Health & Human Services',
                description: 'Federal assistance for home energy bills',
                eligibility: 'Income below 150% of federal poverty level',
                contact: '1-866-674-6327',
                last_verified: '2026-05-28',
                verification_status: 'verified',
              },
              {
                id: 'res_demo_2',
                name: 'Local Utility Hardship Program',
                provider: 'Georgia Power / Local Utility',
                description: 'Payment arrangements and hardship assistance for utility customers',
                eligibility: 'Active account with documented financial hardship',
                contact: '1-888-660-1361',
                last_verified: '2026-06-02',
                verification_status: 'verified',
              },
            ],
          },
        ],
        crisis_detected: false,
        clarification_needed: false,
        processing_time_ms: 892,
        model: 'BART-large-MNLI',
        model_version: 'v2.4.1',
      },
      meta: {
        request_id: 'req_demo_' + Math.random().toString(36).substring(2, 8),
        timestamp: new Date().toISOString(),
        api_version: 'v1',
      },
    },
    crisis: {
      success: true,
      data: {
        query_id: 'qry_crisis_' + Math.random().toString(36).substring(2, 8),
        crisis_detected: true,
        crisis_response: {
          type: 'suicidal_ideation',
          message: 'We detected that you may be in crisis. You are not alone — help is available right now.',
          resources: [
            {
              name: '988 Suicide & Crisis Lifeline',
              contact: 'Call or text 988 — available 24/7',
              description: 'Free, confidential support for people in distress',
            },
            {
              name: 'Crisis Text Line',
              contact: 'Text HOME to 741741',
              description: 'Text with a trained crisis counselor',
            },
          ],
        },
        classifications: [],
        clarification_needed: false,
        processing_time_ms: 12,
        note: 'AI classification was bypassed due to crisis detection. This is a hardcoded safety feature.',
      },
      meta: {
        request_id: 'req_crisis_' + Math.random().toString(36).substring(2, 8),
        timestamp: new Date().toISOString(),
        api_version: 'v1',
      },
    },
    low_confidence: {
      success: true,
      data: {
        query_id: 'qry_low_' + Math.random().toString(36).substring(2, 8),
        classifications: [
          {
            category: 'General Assistance',
            confidence: 0.43,
            calibrated: true,
            reasoning: 'Query is vague — multiple categories possible but none strongly indicated',
            alternatives: [
              { category: 'Mental Health', confidence: 0.38 },
              { category: 'Employment Services', confidence: 0.31 },
            ],
            resources: [],
          },
        ],
        crisis_detected: false,
        clarification_needed: true,
        clarification: {
          question: 'Could you tell us more about what kind of help you\'re looking for? For example, are you looking for help with housing, food, employment, or something else?',
          suggested_responses: ['Housing or rent help', 'Food assistance', 'Job or employment help', 'Mental health support', 'Something else'],
        },
        processing_time_ms: 1156,
        model: 'BART-large-MNLI',
        model_version: 'v2.4.1',
      },
      meta: {
        request_id: 'req_low_' + Math.random().toString(36).substring(2, 8),
        timestamp: new Date().toISOString(),
        api_version: 'v1',
      },
    },
  }

  const handleSubmit = () => {
    setLoading(true)
    setResponse(null)

    setTimeout(() => {
      const q = query.toLowerCase()
      let result = mockResponses.default

      if (q.includes('end it') || q.includes('suicide') || q.includes('kill myself') || q.includes('don\'t want to live') || q.includes('can\'t take this') || q.includes('want to die')) {
        result = mockResponses.crisis
      } else if (q.length < 20 || q.includes('help with my situation') || q.includes('i need help but')) {
        result = mockResponses.low_confidence
      }

      setResponse(JSON.stringify(result, null, 2))
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 shadow-premium-lg">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input side */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-5 h-5 text-gray-400" />
            <span className="text-[14px] font-semibold text-gray-900">Request</span>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Query</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200/60 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all resize-none"
              placeholder="Describe what you need help with..."
            />
          </div>

          <div>
            <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Location (ZIP)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200/60 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 transition-all"
              placeholder="e.g., 30318"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">Method</label>
            <MethodBadge method="POST" />
            <span className="text-[13px] font-mono text-gray-600">/api/classify</span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-[14px] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Classifying...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Request
              </>
            )}
          </button>

          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider self-center">Try:</span>
            {[
              'I need help paying my electricity bill',
              'I can\'t take this anymore',
              'I need help with my situation',
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuery(suggestion)}
                className="px-3 py-1.5 rounded-lg bg-gray-50 text-[12px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100/60"
              >
                {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Response side */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Braces className="w-5 h-5 text-gray-400" />
            <span className="text-[14px] font-semibold text-gray-900">Response</span>
            {response && (
              <span className="ml-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3" />
                200 OK
              </span>
            )}
          </div>

          {response ? (
            <pre className="bg-gray-900 text-gray-100 p-5 rounded-2xl overflow-x-auto overflow-y-auto max-h-[500px] text-[12px] leading-relaxed font-mono border border-gray-800/50">
              <code>{response}</code>
            </pre>
          ) : (
            <div className="bg-gray-50/60 rounded-2xl border border-gray-100/60 p-8 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-[14px] font-medium text-gray-400 text-center">Enter a query and click &ldquo;Send Request&rdquo; to see a mock API response</p>
              <p className="text-[12px] text-gray-300 mt-2 text-center">Try crisis keywords like &ldquo;end it all&rdquo; to see crisis detection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// ENDPOINT CARD COMPONENT
// ═══════════════════════════════════════════════════════════
function EndpointCard({ endpoint, index }: { endpoint: typeof endpoints[0]; index: number }) {
  const [expanded, setExpanded] = useState(index === 0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card rounded-3xl shadow-premium overflow-hidden hover:shadow-premium-lg transition-shadow duration-300"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-white/40 transition-colors"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <MethodBadge method={endpoint.method} />
          <span className="text-[15px] font-semibold text-gray-900 font-mono">{endpoint.path}</span>
          <span className="text-[14px] text-gray-500 hidden sm:inline">&mdash; {endpoint.title}</span>
          {endpoint.auth && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
              <Lock className="w-3 h-3" />
              Auth Required
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 ml-4"
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8 pt-2 space-y-8">
              {/* Description */}
              <p className="text-[14px] text-gray-600 leading-relaxed">{endpoint.description}</p>

              {/* Parameters table */}
              <div>
                <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  Parameters
                </h4>
                <div className="overflow-x-auto rounded-xl border border-gray-100/60">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/80">
                        <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Parameter</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Required</th>
                        <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {endpoint.parameters.map((param) => (
                        <tr key={param.name} className="hover:bg-gray-50/40 transition-colors">
                          <td className="px-4 py-3 text-[13px] font-mono font-semibold text-gray-900 whitespace-nowrap">{param.name}</td>
                          <td className="px-4 py-3 text-[12px] font-mono text-gray-500 whitespace-nowrap">{param.type}</td>
                          <td className="px-4 py-3">
                            {param.required ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100/60">Required</span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-500 border border-gray-100/60">Optional</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[13px] text-gray-600 leading-relaxed">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Request example */}
              {endpoint.requestExample && (
                <div>
                  <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-500" />
                    Request Example
                  </h4>
                  <CodeBlock code={endpoint.requestExample} language="json" filename={`${endpoint.method} ${endpoint.path}`} />
                </div>
              )}

              {/* Response example */}
              <div>
                <h4 className="text-[13px] font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Response Example
                </h4>
                <CodeBlock code={endpoint.responseExample} language="json" filename="200 OK" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE COMPONENT
// ═══════════════════════════════════════════════════════════
export default function ApiDocsPage() {
  return (
    <div className="min-h-screen flex flex-col mesh-gradient-bg">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-8 md:pt-36 md:pb-12 relative overflow-hidden">
        {/* Decorative background orbs */}
        <div
          className="absolute top-20 -left-40 w-80 h-80 rounded-full opacity-[0.04] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.4), transparent 60%)' }}
        />
        <div
          className="absolute bottom-0 -right-40 w-96 h-96 rounded-full opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4), transparent 60%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold bg-blue-50/80 text-blue-700 border border-blue-100/60 backdrop-blur-sm">
              <Code2 className="w-3.5 h-3.5" />
              API v1.0.0 — Developer Documentation
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mt-6 leading-[1.1]"
          >
            API{' '}
            <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 bg-clip-text text-transparent gradient-text-animate bg-[length:200%_200%]">
              Documentation
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-500 mt-6 max-w-2xl mx-auto leading-relaxed"
          >
            Build with our classification engine. Classify queries against verified categories,
            manage conversations, user profiles, saved resources, and integrate crisis detection into your applications.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-4 mt-8"
          >
            {[
              { icon: Cpu, text: 'BART-large-MNLI', color: '#6366f1' },
              { icon: Shield, text: 'Crisis detection', color: '#ef4444' },
              { icon: Database, text: 'Community resource database', color: '#10b981' },
              { icon: Clock, text: '<1.5s median response', color: '#f59e0b' },
            ].map((stat) => {
              const SIcon = stat.icon
              return (
                <div
                  key={stat.text}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 border border-gray-100/60 backdrop-blur-sm shadow-sm"
                >
                  <SIcon className="w-4 h-4" style={{ color: stat.color }} />
                  <span className="text-[12px] font-semibold text-gray-600">{stat.text}</span>
                </div>
              )
            })}
          </motion.div>

          {/* Quick nav buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-6"
          >
            <a
              href="#quick-start"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 text-white text-[13px] font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
            >
              <Rocket className="w-4 h-4" />
              Quick Start
            </a>
            <a
              href="#playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 border border-gray-200/60 text-gray-700 text-[13px] font-semibold hover:bg-white hover:shadow-md transition-all"
            >
              <Play className="w-4 h-4" />
              Try the Playground
            </a>
            <a
              href="#endpoints"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/80 border border-gray-200/60 text-gray-700 text-[13px] font-semibold hover:bg-white hover:shadow-md transition-all"
            >
              <Terminal className="w-4 h-4" />
              View Endpoints
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT WITH SIDEBAR
          ═══════════════════════════════════════════════════════ */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-10">
            {/* Sidebar TOC */}
            <TableOfContents />

            {/* Main content */}
            <main className="flex-1 min-w-0 space-y-0">

              {/* ─── QUICK START SECTION ─── */}
              <section id="quick-start" className="py-20 md:py-28">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Rocket className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Quick Start</h2>
                      <p className="text-[14px] text-gray-500">Get started in 5 minutes</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-6">
                    {/* Step 1 */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center text-white text-[13px] font-bold shrink-0">1</div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-[15px] font-bold text-gray-900">Get Your API Key</h3>
                          <p className="text-[14px] text-gray-600 leading-relaxed">
                            Sign up for a free account and navigate to Dashboard → API Keys. Click &ldquo;Generate New Key&rdquo; to create your first key. Store it securely — it won&apos;t be shown again.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center text-white text-[13px] font-bold shrink-0">2</div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-[15px] font-bold text-gray-900">Make Your First Request</h3>
                          <p className="text-[14px] text-gray-600 leading-relaxed">
                            Classify a query against our categories with a single POST request. Include your query in the request body.
                          </p>
                          <CodeBlock
                            code={`curl -X POST http://localhost:3000/api/classify \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "I need help paying my electricity bill",
    "location": "30318"
  }'`}
                            language="bash"
                            filename="Terminal"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center text-white text-[13px] font-bold shrink-0">3</div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-[15px] font-bold text-gray-900">Handle the Response</h3>
                          <p className="text-[14px] text-gray-600 leading-relaxed">
                            The API returns classification results with confidence scores, reasoning, and matched resources. Check <InlineCode>crisis_detected</InlineCode> first — if true, skip normal processing and display crisis resources immediately.
                          </p>
                          <CodeBlock
                            code={`// JavaScript example
const response = await fetch('http://localhost:3000/api/classify', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'I need help paying my electricity bill',
    location: '30318',
  }),
});

const result = await response.json();

// Always check for crisis detection first
if (result.data.crisis_detected) {
  // Display crisis resources immediately
  showCrisisResources(result.data.crisis_response);
  return;
}

// Display classifications with confidence scores
result.data.classifications.forEach((cls) => {
  console.log(\`\${cls.category}: \${(cls.confidence * 100).toFixed(0)}%\`);
  console.log(\`  Why: \${cls.reasoning}\`);
  console.log(\`  Alternatives: \${cls.alternatives.map(a => a.category).join(', ')}\`);
});`}
                            language="javascript"
                            filename="index.js"
                          />
                        </div>
                      </div>
                    </div>

                  </motion.div>
                </motion.div>
              </section>

              {/* ─── AUTHENTICATION SECTION ─── */}
              <section id="authentication" className="py-20 md:py-28 border-t border-gray-100/60">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Key className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Authentication</h2>
                      <p className="text-[14px] text-gray-500">Secure your API requests</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-6">
                    {/* API Key overview */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                        Most API requests require authentication via a session cookie established through NextAuth.js.
                        Register via <InlineCode>POST /api/auth/register</InlineCode> and sign in through the NextAuth.js endpoints.
                        Public endpoints like <InlineCode>GET /api/community-resources</InlineCode> do not require authentication.
                      </p>
                      <CodeBlock
                        code={`# Include session cookie in every authenticated request
curl -X GET http://localhost:3000/api/conversations?userId=user_456 \\
  -H "Cookie: next-auth.session-token=your_session_token" \\
  -H "Content-Type: application/json"`}
                        language="bash"
                        filename="Authorization Header"
                      />
                    </div>

                    {/* Key types */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="glass-card rounded-2xl p-6 shadow-premium">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </div>
                          <h3 className="text-[15px] font-bold text-gray-900">Authenticated Endpoints</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[13px] text-gray-600 leading-relaxed">Requires a valid NextAuth.js session.</p>
                          <p className="text-[13px] text-gray-600 leading-relaxed">Includes: conversations, user profile/settings, saved resources, classify.</p>
                          <p className="text-[13px] text-gray-600 leading-relaxed">Session is managed via HTTP-only cookies.</p>
                        </div>
                      </div>

                      <div className="glass-card rounded-2xl p-6 shadow-premium">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <Globe className="w-4 h-4 text-blue-500" />
                          </div>
                          <h3 className="text-[15px] font-bold text-gray-900">Public Endpoints</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[13px] text-gray-600 leading-relaxed">No authentication required.</p>
                          <p className="text-[13px] text-gray-600 leading-relaxed">Includes: community resources, auth register, forgot-password.</p>
                          <p className="text-[13px] text-gray-600 leading-relaxed">Safe to use in client-side code without sessions.</p>
                        </div>
                      </div>
                    </div>

                    {/* Security best practices */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium border-l-4 border-l-amber-400">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h3 className="text-[15px] font-bold text-gray-900">Security Best Practices</h3>
                      </div>
                      <ul className="space-y-3">
                        {[
                          'Never expose session tokens in client-side code or public repositories.',
                          'Use environment variables to store sensitive configuration server-side.',
                          'Rotate session secrets regularly — update NEXTAUTH_SECRET in your environment.',
                          'Always use HTTPS in production to protect session cookies.',
                          'Validate user input on both client and server to prevent injection attacks.',
                          'Implement rate limiting on authentication endpoints to prevent brute-force attacks.',
                        ].map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ChevronRight className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <span className="text-[13px] text-gray-600 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              </section>

              {/* ─── ENDPOINTS SECTION ─── */}
              <section id="endpoints" className="py-20 md:py-28 border-t border-gray-100/60">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                      <Terminal className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Endpoints</h2>
                      <p className="text-[14px] text-gray-500">Full API reference for every endpoint</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-6">
                    {/* Base URL callout */}
                    <div className="glass-card rounded-2xl p-5 shadow-premium">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[13px] font-semibold text-gray-500">Base URL:</span>
                        <code className="px-3 py-1.5 rounded-lg bg-gray-900 text-emerald-400 text-[13px] font-mono">
                          http://localhost:3000
                        </code>
                      </div>
                    </div>

                    {endpoints.map((endpoint, index) => (
                      <EndpointCard key={endpoint.path} endpoint={endpoint} index={index} />
                    ))}
                  </motion.div>
                </motion.div>
              </section>

              {/* ─── RESPONSE FORMAT SECTION ─── */}
              <section id="response-format" className="py-20 md:py-28 border-t border-gray-100/60">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                      <Braces className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Response Format</h2>
                      <p className="text-[14px] text-gray-500">Standard envelope, error codes, and pagination</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-8">
                    {/* Standard envelope */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4">Standard Response Envelope</h3>
                      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                        Every API response follows a consistent envelope structure. The <InlineCode>success</InlineCode> field indicates whether
                        the request completed successfully. Data is always nested under <InlineCode>data</InlineCode>, and metadata
                        (request ID, timestamp, API version) is under <InlineCode>meta</InlineCode>.
                      </p>
                      <CodeBlock
                        code={`{
  "success": true,
  "data": {
    // Response payload varies by endpoint
  },
  "meta": {
    "request_id": "req_7k2m9n4p1q8r",
    "timestamp": "2026-06-05T14:32:18.429Z",
    "api_version": "v1"
  }
}`}
                        language="json"
                        filename="Standard Envelope"
                      />
                    </div>

                    {/* Error response */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4">Error Response Format</h3>
                      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                        Errors follow the same envelope but include an <InlineCode>error</InlineCode> object with a machine-readable
                        code, human-readable message, and suggested action. The HTTP status code matches the error type.
                      </p>
                      <CodeBlock
                        code={`{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded the rate limit of 10 requests per minute.",
    "suggestion": "Wait 45 seconds before making another request. See the Retry-After header.",
    "details": {
      "limit": 10,
      "remaining": 0,
      "reset_at": "2026-06-05T14:33:00.000Z"
    }
  },
  "meta": {
    "request_id": "req_m3n7k2p9q4r8",
    "timestamp": "2026-06-05T14:32:15.123Z",
    "api_version": "v1"
  }
}`}
                        language="json"
                        filename="Error Response"
                      />
                    </div>

                    {/* Error codes table */}
                    <div>
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4">HTTP Status Codes</h3>
                      <div className="overflow-x-auto rounded-xl border border-gray-100/60">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-gray-50/80">
                              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Code</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Label</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {errorCodes.map((err) => (
                              <tr key={err.code} className="hover:bg-gray-50/40 transition-colors">
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-bold font-mono ${
                                    err.code < 300 ? 'bg-emerald-50 text-emerald-600' :
                                    err.code < 500 ? 'bg-amber-50 text-amber-600' :
                                    'bg-red-50 text-red-600'
                                  }`}>
                                    {err.code}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-[13px] font-semibold text-gray-900">{err.label}</td>
                                <td className="px-4 py-3 text-[13px] text-gray-600 leading-relaxed">{err.description}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4">Pagination</h3>
                      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                        Endpoints that return lists support pagination. Include <InlineCode>skip</InlineCode> and <InlineCode>take</InlineCode>
                        parameters in your request. The response includes total count and pagination metadata.
                      </p>
                      <CodeBlock
                        code={`// Request: GET /api/conversations?userId=user_456&skip=0&take=20

{
  "success": true,
  "data": {
    "conversations": [...],  // Array of conversations
    "total": 12,            // Total matching conversations
    "skip": 0,              // Results skipped
    "take": 20              // Results per page
  },
  "meta": { ... }
}`}
                        language="json"
                        filename="Pagination Response"
                      />
                    </div>

                    {/* Response headers */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4">Response Headers</h3>
                      <p className="text-[14px] text-gray-600 leading-relaxed mb-4">
                        Every API response includes headers for rate limit tracking and debugging.
                      </p>
                      <div className="overflow-x-auto rounded-xl border border-gray-100/60">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-gray-50/80">
                              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Header</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { header: 'X-RateLimit-Limit', desc: 'Maximum requests allowed in the current window.' },
                              { header: 'X-RateLimit-Remaining', desc: 'Requests remaining in the current window.' },
                              { header: 'X-RateLimit-Reset', desc: 'Unix timestamp when the rate limit window resets.' },
                              { header: 'X-Request-Id', desc: 'Unique identifier for this request. Include in support requests.' },
                              { header: 'Retry-After', desc: 'Seconds until you can retry (only on 429 responses).' },
                            ].map((h) => (
                              <tr key={h.header} className="hover:bg-gray-50/40 transition-colors">
                                <td className="px-4 py-3 text-[13px] font-mono font-semibold text-gray-900 whitespace-nowrap">{h.header}</td>
                                <td className="px-4 py-3 text-[13px] text-gray-600 leading-relaxed">{h.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </section>

              {/* ─── RATE LIMITS SECTION ─── */}
              <section id="rate-limits" className="py-20 md:py-28 border-t border-gray-100/60">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Rate Limits</h2>
                      <p className="text-[14px] text-gray-500">Tier-based request limits and best practices</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-6">
                    <div className="glass-card rounded-2xl p-6 shadow-premium border-l-4 border-l-orange-400">
                      <div className="flex items-center gap-2 mb-3">
                        <Info className="w-5 h-5 text-orange-500" />
                        <h3 className="text-[15px] font-bold text-gray-900">Rate Limits — To Be Determined</h3>
                      </div>
                      <p className="text-[14px] text-gray-600 leading-relaxed">
                        Rate limits are currently being finalized. The tiers below show planned structures with specific limits to be announced.
                        When you exceed your rate limit, the API will return a <InlineCode>429 Too Many Requests</InlineCode> response
                        with a <InlineCode>Retry-After</InlineCode> header.
                      </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                      {rateLimitTiers.map((tier) => {
                        const Icon = tier.icon
                        return (
                          <div key={tier.name} className={`glass-card rounded-2xl p-6 shadow-premium relative ${tier.popular ? 'ring-2 ring-blue-200' : ''}`}>
                            {tier.popular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200/60">
                                Most Popular
                              </div>
                            )}
                            <div className="flex items-center gap-3 mb-5">
                              <div className={`w-10 h-10 rounded-xl ${tier.iconBg} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${tier.iconColor}`} />
                              </div>
                              <div>
                                <h3 className="text-[15px] font-bold text-gray-900">{tier.name}</h3>
                                <p className="text-[13px] font-semibold text-gray-500">{tier.price}</p>
                              </div>
                            </div>

                            <div className="space-y-3 mb-5">
                              {tier.limits.map((limit) => (
                                <div key={limit.label} className="flex items-center justify-between">
                                  <span className="text-[12px] text-gray-500">{limit.label}</span>
                                  <span className="text-[12px] font-semibold text-gray-900">{limit.value}</span>
                                </div>
                              ))}
                            </div>

                            <div className="border-t border-gray-100/60 pt-4">
                              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Includes</p>
                              <ul className="space-y-1.5">
                                {tier.features.map((feature) => (
                                  <li key={feature} className="flex items-center gap-2">
                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span className="text-[12px] text-gray-600">{feature}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Rate limit best practices */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4">Rate Limit Best Practices</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          {
                            icon: RefreshCw,
                            title: 'Implement Exponential Backoff',
                            desc: 'When you receive a 429 response, wait the time specified in Retry-After, then retry. Double the wait time on each subsequent 429.',
                          },
                          {
                            icon: Activity,
                            title: 'Monitor Rate Limit Headers',
                            desc: 'Track X-RateLimit-Remaining and X-RateLimit-Reset headers to anticipate limits and avoid hitting them.',
                          },
                          {
                            icon: Clock,
                            title: 'Space Out Requests',
                            desc: 'Avoid sending many requests in rapid succession. Add small delays between API calls to stay within limits.',
                          },
                          {
                            icon: BarChart3,
                            title: 'Cache Classification Results',
                            desc: 'Cache identical queries client-side with a TTL of 1 hour. Classification results for the same query are deterministic within a model version.',
                          },
                        ].map((practice) => {
                          const PIcon = practice.icon
                          return (
                            <div key={practice.title} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50/50">
                              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
                                <PIcon className="w-4 h-4 text-gray-500" />
                              </div>
                              <div>
                                <h4 className="text-[13px] font-semibold text-gray-900">{practice.title}</h4>
                                <p className="text-[12px] text-gray-500 leading-relaxed mt-0.5">{practice.desc}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </section>

              {/* ─── CHANGELOG SECTION ─── */}
              <section id="changelog" className="py-20 md:py-28 border-t border-gray-100/60">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Changelog</h2>
                      <p className="text-[14px] text-gray-500">Version history and API updates</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-0">
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-gray-200 via-gray-100 to-transparent" />

                      {changelogEntries.map((entry, index) => {
                        const typeConfig: Record<string, { color: string; bg: string; icon: typeof Sparkles }> = {
                          feature: { color: 'text-blue-600', bg: 'bg-blue-50', icon: Sparkles },
                          improvement: { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: ArrowUpRight },
                          fix: { color: 'text-amber-600', bg: 'bg-amber-50', icon: RefreshCw },
                          release: { color: 'text-violet-600', bg: 'bg-violet-50', icon: Rocket },
                        }
                        const config = typeConfig[entry.type] || typeConfig.feature
                        const TypeIcon = config.icon

                        return (
                          <div key={entry.version} className="relative pl-14 pb-8 last:pb-0">
                            {/* Timeline dot */}
                            <div className={`absolute left-0 top-1.5 w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center`}>
                              <TypeIcon className={`w-5 h-5 ${config.color}`} />
                            </div>

                            <div className="glass-card rounded-2xl p-6 shadow-premium">
                              <div className="flex items-center gap-3 mb-3 flex-wrap">
                                <code className="px-2.5 py-1 rounded-lg bg-gray-900 text-white text-[12px] font-mono font-bold">
                                  {entry.version}
                                </code>
                                <span className="text-[12px] text-gray-400">{entry.date}</span>
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.color}`}>
                                  {entry.type}
                                </span>
                              </div>
                              <h3 className="text-[15px] font-bold text-gray-900 mb-3">{entry.title}</h3>
                              <ul className="space-y-2">
                                {entry.changes.map((change, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 mt-1 shrink-0" />
                                    <span className="text-[13px] text-gray-600 leading-relaxed">{change}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              </section>

              {/* ─── PLAYGROUND SECTION ─── */}
              <section id="playground" className="py-20 md:py-28 border-t border-gray-100/60">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                      <Play className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">API Playground</h2>
                      <p className="text-[14px] text-gray-500">Test the API with mock responses</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem}>
                    <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                      Try the classification API right in your browser. Enter a query to see a mock API response.
                      Try different query types: specific needs, vague requests, or crisis-related keywords.
                      This playground uses mock data — responses match the real API format but don&apos;t consume rate limits.
                    </p>
                    <Playground />
                  </motion.div>
                </motion.div>
              </section>

              {/* ─── FAQ SECTION ─── */}
              <section id="faq" className="py-20 md:py-28 border-t border-gray-100/60">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">FAQ</h2>
                      <p className="text-[14px] text-gray-500">Common API questions answered</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-3">
                    {apiFAQs.map((faq, index) => (
                      <FAQItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                  </motion.div>
                </motion.div>
              </section>

              {/* ─── CTA SECTION ─── */}
              <section className="py-20 md:py-28">
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <div className="glass-card rounded-3xl p-8 md:p-12 shadow-premium-xl text-center relative overflow-hidden">
                    {/* Background glow */}
                    <div
                      className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-[0.06] pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5), transparent 60%)' }}
                    />
                    <div
                      className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-[0.04] pointer-events-none"
                      style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.5), transparent 60%)' }}
                    />

                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                        <Key className="w-7 h-7 text-white" />
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 mb-3">
                        Get Your API Key
                      </h2>
                      <p className="text-[15px] text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
                        Start building with our classification engine today. Free tier available —
                        no credit card required. Crisis detection is always on.
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                          href="/app"
                          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold text-[14px] shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all active:scale-[0.97]"
                        >
                          <Rocket className="w-4 h-4" />
                          Get Free API Key
                        </Link>
                        <Link
                          href="/pricing"
                          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/80 border border-gray-200/60 text-gray-700 text-[14px] font-semibold hover:bg-white hover:shadow-md transition-all"
                        >
                          View Pricing
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                        {[
                          { icon: Shield, text: 'Crisis detection always on', color: '#ef4444' },
                          { icon: Lock, text: 'Privacy by design', color: '#3b82f6' },
                          { icon: Zap, text: '10K free requests/month', color: '#f59e0b' },
                          { icon: Users, text: '211 navigator access', color: '#10b981' },
                        ].map((badge) => {
                          const BIcon = badge.icon
                          return (
                            <div
                              key={badge.text}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-gray-100/60 backdrop-blur-sm"
                            >
                              <BIcon className="w-3.5 h-3.5" style={{ color: badge.color }} />
                              <span className="text-[11px] font-semibold text-gray-600">{badge.text}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </section>

            </main>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer className="border-t border-gray-100/60 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                <Layers className="w-3 h-3 text-white" />
              </div>
              <span className="text-[13px] font-semibold text-gray-900">ClearPath AI</span>
              <span className="text-[11px] text-gray-400">— Community Resource Navigator</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-gray-400">API v1.0.0</span>
              <span className="text-[11px] text-gray-300">|</span>
              <span className="text-[11px] text-gray-400">localhost:3000</span>
              <span className="text-[11px] text-gray-300">|</span>
              <span className="text-[11px] text-gray-400">USAII Global AI Hackathon 2026</span>
            </div>
          </div>
        </div>
      </footer>
      <Footer />
    </div>
  )
}


