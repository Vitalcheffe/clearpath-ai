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
  XCircle,
  Info,
  Play,
  Send,
  Webhook,
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
  MousePointerClick,
  ToggleLeft,
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
  { id: 'sdks', label: 'SDKs', icon: Code2 },
  { id: 'webhooks', label: 'Webhooks', icon: Webhook },
  { id: 'changelog', label: 'Changelog', icon: FileText },
  { id: 'playground', label: 'Playground', icon: Play },
  { id: 'faq', label: 'FAQ', icon: MessageSquare },
]

// ═══════════════════════════════════════════════════════════
// ENDPOINT DATA
// ═══════════════════════════════════════════════════════════
const endpoints = [
  {
    method: 'POST' as const,
    path: '/api/classify',
    title: 'Classify a Query',
    description: 'The primary endpoint for classifying user queries against our 8-category system powered by BART-large-MNLI zero-shot classification. Returns confidence scores, reasoning, and matched resources.',
    requestExample: `{
  "query": "I lost my job and can't pay rent, my kids need food",
  "location": "30318",
  "options": {
    "multi_label": true,
    "confidence_threshold": 0.7,
    "include_resources": true,
    "max_results": 5
  }
}`,
    responseExample: `{
  "success": true,
  "data": {
    "query_id": "qry_a8f3c2d1e4b5",
    "classifications": [
      {
        "category": "Housing Assistance",
        "confidence": 0.87,
        "calibrated": true,
        "reasoning": "Query mentions inability to pay rent — immediate housing risk identified",
        "alternatives": [
          { "category": "Food Assistance", "confidence": 0.72 },
          { "category": "Employment Services", "confidence": 0.65 },
          { "category": "General Financial Aid", "confidence": 0.31 }
        ],
        "resources": [
          {
            "id": "res_2847",
            "name": "Emergency Rental Assistance Program",
            "provider": "HUD / Local Housing Authority",
            "description": "Federal rental assistance for families facing eviction",
            "eligibility": "Income below 50% AMI, eviction notice required",
            "contact": "1-800-569-4287",
            "last_verified": "2026-05-18",
            "verification_status": "verified",
            "url": "https://www.hud.gov/rental-assistance"
          },
          {
            "id": "res_3091",
            "name": "Section 8 Emergency Transfer",
            "provider": "Local Public Housing Agency",
            "description": "Emergency housing voucher transfer for crisis situations",
            "eligibility": "Current Section 8 recipient, documented emergency",
            "contact": "Contact local PHA",
            "last_verified": "2026-06-01",
            "verification_status": "verified",
            "url": "https://www.hud.gov/topics/housing_choice_voucher_program_section_8"
          }
        ]
      },
      {
        "category": "Food Assistance",
        "confidence": 0.72,
        "calibrated": true,
        "reasoning": "Query mentions children needing food — SNAP/WIC eligibility likely",
        "alternatives": [
          { "category": "Housing Assistance", "confidence": 0.87 },
          { "category": "Employment Services", "confidence": 0.65 }
        ],
        "resources": [
          {
            "id": "res_4102",
            "name": "SNAP Benefits Application",
            "provider": "USDA / State DHS",
            "description": "Supplemental Nutrition Assistance Program for low-income families",
            "eligibility": "Income below 130% of federal poverty level",
            "contact": "1-800-221-5689",
            "last_verified": "2026-05-22",
            "verification_status": "verified",
            "url": "https://www.fns.usda.gov/snap"
          }
        ]
      }
    ],
    "crisis_detected": false,
    "clarification_needed": false,
    "processing_time_ms": 1247,
    "model": "BART-large-MNLI",
    "model_version": "v2.4.1"
  },
  "meta": {
    "request_id": "req_7k2m9n4p1q8r",
    "timestamp": "2026-06-05T14:32:18.429Z",
    "api_version": "v1"
  }
}`,
    parameters: [
      { name: 'query', type: 'string', required: true, description: 'The natural language query to classify. Minimum 3 characters, maximum 2000 characters.' },
      { name: 'location', type: 'string', required: false, description: 'ZIP code, city, or state for location-aware resource matching. Defaults to national results.' },
      { name: 'options.multi_label', type: 'boolean', required: false, description: 'Return multiple category matches. Default: true.' },
      { name: 'options.confidence_threshold', type: 'number', required: false, description: 'Minimum confidence score (0-1) to return. Default: 0.7. Range: 0.0 - 1.0.' },
      { name: 'options.include_resources', type: 'boolean', required: false, description: 'Include matched resources in the response. Default: true.' },
      { name: 'options.max_results', type: 'integer', required: false, description: 'Maximum number of resources per category. Default: 5. Range: 1 - 20.' },
    ],
  },
  {
    method: 'GET' as const,
    path: '/api/resources',
    title: 'Retrieve Verified Resources',
    description: 'Query the verified resource database directly. Filter by category, location, eligibility, or verification status. All resources are sourced from verified partners like 211.org and government databases.',
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
        "eligibility": "Income below 50% AMI, eviction notice required",
        "contact": "1-800-569-4287",
        "location": "National",
        "last_verified": "2026-05-18",
        "verification_status": "verified",
        "url": "https://www.hud.gov/rental-assistance"
      },
      {
        "id": "res_4102",
        "name": "SNAP Benefits Application",
        "category": "Food Assistance",
        "provider": "USDA / State DHS",
        "description": "Supplemental Nutrition Assistance Program",
        "eligibility": "Income below 130% of federal poverty level",
        "contact": "1-800-221-5689",
        "location": "National",
        "last_verified": "2026-05-22",
        "verification_status": "verified",
        "url": "https://www.fns.usda.gov/snap"
      }
    ],
    "total": 2847,
    "page": 1,
    "per_page": 20,
    "total_pages": 143
  },
  "meta": {
    "request_id": "req_3b7k2m9n4p1q",
    "timestamp": "2026-06-05T14:35:42.118Z",
    "api_version": "v1"
  }
}`,
    parameters: [
      { name: 'category', type: 'string', required: false, description: 'Filter by category. One of: housing, food, mental_health, employment, legal, healthcare, crisis, senior.' },
      { name: 'location', type: 'string', required: false, description: 'ZIP code, city, or state for location filtering.' },
      { name: 'verification_status', type: 'string', required: false, description: 'Filter by verification status. One of: verified, pending, expired.' },
      { name: 'page', type: 'integer', required: false, description: 'Page number for pagination. Default: 1.' },
      { name: 'per_page', type: 'integer', required: false, description: 'Results per page. Default: 20. Max: 100.' },
      { name: 'sort', type: 'string', required: false, description: 'Sort order. One of: relevance, verified_date, name. Default: relevance.' },
    ],
  },
  {
    method: 'POST' as const,
    path: '/api/verify',
    title: 'Verify a Resource',
    description: 'Submit a resource for verification review. Our team of community navigators reviews submissions within 48 hours. Verified resources appear in the public database after passing quality checks.',
    requestExample: `{
  "resource": {
    "name": "Community Food Bank of Metro Atlanta",
    "category": "Food Assistance",
    "provider": "Atlanta Community Food Bank",
    "description": "Free food distribution for families and individuals in the metro Atlanta area",
    "eligibility": "No documentation required, walk-ins welcome",
    "contact": "404-892-3333",
    "address": "732 Joseph E Lowery Blvd NW, Atlanta, GA 30318",
    "url": "https://www.acfb.org",
    "hours": "Mon-Fri 9am-5pm, Sat 10am-2pm",
    "source": "211.org listing"
  },
  "submitter": {
    "name": "Jane Smith",
    "role": "community_navigator",
    "organization": "United Way of Greater Atlanta"
  }
}`,
    responseExample: `{
  "success": true,
  "data": {
    "verification_id": "ver_5m8n2k9p3q7r",
    "status": "pending_review",
    "estimated_review_time": "48 hours",
    "submitted_at": "2026-06-05T14:40:00.000Z",
    "resource": {
      "name": "Community Food Bank of Metro Atlanta",
      "category": "Food Assistance",
      "provider": "Atlanta Community Food Bank"
    }
  },
  "meta": {
    "request_id": "req_9n4p1q8r3b7k",
    "timestamp": "2026-06-05T14:40:00.429Z",
    "api_version": "v1"
  }
}`,
    parameters: [
      { name: 'resource.name', type: 'string', required: true, description: 'Name of the resource or program.' },
      { name: 'resource.category', type: 'string', required: true, description: 'Primary category. One of: housing, food, mental_health, employment, legal, healthcare, crisis, senior.' },
      { name: 'resource.provider', type: 'string', required: true, description: 'Organization that provides this resource.' },
      { name: 'resource.description', type: 'string', required: true, description: 'Clear description of what the resource offers.' },
      { name: 'resource.contact', type: 'string', required: true, description: 'Phone number, email, or contact method.' },
      { name: 'resource.address', type: 'string', required: false, description: 'Physical address if applicable.' },
      { name: 'resource.url', type: 'string', required: false, description: 'Website URL for the resource.' },
      { name: 'submitter.name', type: 'string', required: true, description: 'Name of the person submitting the resource.' },
      { name: 'submitter.role', type: 'string', required: true, description: 'Role of submitter. One of: community_navigator, social_worker, organization, individual.' },
    ],
  },
  {
    method: 'GET' as const,
    path: '/api/categories',
    title: 'List All Categories',
    description: 'Retrieve the full list of classification categories with descriptions, resource counts, and subcategories. Use this to dynamically build category selection UIs or validate category parameters.',
    requestExample: null,
    responseExample: `{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "housing",
        "name": "Housing Assistance",
        "description": "Emergency shelter, rental help, Section 8, transitional housing",
        "resource_count": 423,
        "subcategories": ["Emergency Shelter", "Rental Assistance", "Section 8 Vouchers", "Transitional Housing", "Homelessness Prevention"],
        "icon": "home",
        "color": "#3b82f6"
      },
      {
        "id": "food",
        "name": "Food Assistance",
        "description": "SNAP, food banks, meal programs, WIC, school meals",
        "resource_count": 387,
        "subcategories": ["SNAP Benefits", "Food Banks", "Meal Programs", "WIC", "School Meals"],
        "icon": "utensils",
        "color": "#10b981"
      },
      {
        "id": "mental_health",
        "name": "Mental Health",
        "description": "Counseling, crisis lines, support groups, therapy",
        "resource_count": 298,
        "subcategories": ["Counseling", "Crisis Lines", "Support Groups", "Therapy", "Substance Use"],
        "icon": "heart",
        "color": "#8b5cf6"
      },
      {
        "id": "employment",
        "name": "Employment Services",
        "description": "Job training, career services, unemployment benefits",
        "resource_count": 256,
        "subcategories": ["Job Training", "Career Services", "Unemployment", "Resume Help", "Workforce Development"],
        "icon": "briefcase",
        "color": "#f59e0b"
      },
      {
        "id": "legal",
        "name": "Legal Aid",
        "description": "Immigration, tenant rights, public defender, civil legal",
        "resource_count": 198,
        "subcategories": ["Immigration", "Tenant Rights", "Public Defender", "Civil Legal", "Family Law"],
        "icon": "scale",
        "color": "#ef4444"
      },
      {
        "id": "healthcare",
        "name": "Healthcare",
        "description": "Community clinics, prescription assistance, Medicaid",
        "resource_count": 342,
        "subcategories": ["Community Clinics", "Prescription Assistance", "Medicaid", "Dental Care", "Vision Care"],
        "icon": "stethoscope",
        "color": "#06b6d4"
      },
      {
        "id": "crisis",
        "name": "Crisis Support",
        "description": "988, domestic violence, substance abuse emergencies",
        "resource_count": 167,
        "subcategories": ["988 Lifeline", "Domestic Violence", "Substance Abuse", "Sexual Assault", "Runaway Youth"],
        "icon": "shield",
        "color": "#dc2626"
      },
      {
        "id": "senior",
        "name": "Senior Services",
        "description": "Meals on Wheels, Medicare help, senior centers",
        "resource_count": 215,
        "subcategories": ["Meals on Wheels", "Medicare", "Senior Centers", "In-Home Care", "Transportation"],
        "icon": "users",
        "color": "#64748b"
      }
    ],
    "total_categories": 8,
    "total_resources": 2286
  },
  "meta": {
    "request_id": "req_2m9n4p1q8r3b",
    "timestamp": "2026-06-05T14:45:12.334Z",
    "api_version": "v1"
  }
}`,
    parameters: [
      { name: 'include_subcategories', type: 'boolean', required: false, description: 'Include subcategories in the response. Default: true.' },
      { name: 'include_counts', type: 'boolean', required: false, description: 'Include resource counts per category. Default: true.' },
    ],
  },
  {
    method: 'POST' as const,
    path: '/api/feedback',
    title: 'Submit User Feedback',
    description: 'Submit feedback about classification accuracy, resource quality, or general experience. Feedback is used to calibrate confidence scores and improve the classification engine over time. All feedback is anonymized.',
    requestExample: `{
  "query_id": "qry_a8f3c2d1e4b5",
  "feedback_type": "classification_inaccurate",
  "rating": 3,
  "comment": "The housing resources were helpful but I also needed utility assistance which wasn't included in the results",
  "suggested_category": "Utility Assistance",
  "details": {
    "expected_categories": ["Housing Assistance", "Food Assistance", "Utility Assistance"],
    "actual_categories": ["Housing Assistance", "Food Assistance", "Employment Services"],
    "resource_helpful": true,
    "would_contact_navigator": false
  }
}`,
    responseExample: `{
  "success": true,
  "data": {
    "feedback_id": "fbk_3q7r5m8n2k9p",
    "status": "received",
    "message": "Thank you for your feedback. It will be reviewed by our team and used to improve classification accuracy.",
    "will_update_model": true,
    "reviewed_within": "7 business days"
  },
  "meta": {
    "request_id": "req_8r3b7k2m9n4p",
    "timestamp": "2026-06-05T14:50:22.789Z",
    "api_version": "v1"
  }
}`,
    parameters: [
      { name: 'query_id', type: 'string', required: true, description: 'The query ID from the original classification response.' },
      { name: 'feedback_type', type: 'string', required: true, description: 'Type of feedback. One of: classification_accurate, classification_inaccurate, resource_helpful, resource_outdated, resource_incorrect, general.' },
      { name: 'rating', type: 'integer', required: false, description: 'Rating from 1-5. 1 = very poor, 5 = excellent.' },
      { name: 'comment', type: 'string', required: false, description: 'Free-text feedback. Max 2000 characters.' },
      { name: 'suggested_category', type: 'string', required: false, description: 'Suggested category that was missed or incorrect.' },
      { name: 'details', type: 'object', required: false, description: 'Structured feedback details. All fields optional.' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════
// RATE LIMIT DATA
// ═══════════════════════════════════════════════════════════
const rateLimitTiers = [
  {
    name: 'Free',
    price: '$0/mo',
    icon: Layers,
    iconBg: 'bg-gray-50',
    iconColor: 'text-gray-500',
    limits: [
      { label: 'Requests per minute', value: '10' },
      { label: 'Requests per day', value: '500' },
      { label: 'Requests per month', value: '10,000' },
      { label: 'Concurrent requests', value: '2' },
      { label: 'Max query length', value: '500 chars' },
      { label: 'Resource results per query', value: '3' },
    ],
    features: ['Standard classification speed', '8 core categories', 'Basic resource matching'],
  },
  {
    name: 'Pro',
    price: '$12/mo',
    icon: Zap,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    popular: true,
    limits: [
      { label: 'Requests per minute', value: '60' },
      { label: 'Requests per day', value: '5,000' },
      { label: 'Requests per month', value: '100,000' },
      { label: 'Concurrent requests', value: '10' },
      { label: 'Max query length', value: '2,000 chars' },
      { label: 'Resource results per query', value: '10' },
    ],
    features: ['2x priority speed', 'Multi-label classification', 'Advanced clarification engine', 'Eligibility pre-check', 'Saved history API'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    icon: Shield,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    limits: [
      { label: 'Requests per minute', value: '200' },
      { label: 'Requests per day', value: 'Unlimited' },
      { label: 'Requests per month', value: 'Unlimited' },
      { label: 'Concurrent requests', value: '50' },
      { label: 'Max query length', value: '5,000 chars' },
      { label: 'Resource results per query', value: '20' },
    ],
    features: ['4x dedicated speed', 'Custom categories & taxonomy', 'Webhook support', 'SLA guarantee (99.9%)', 'Custom resource databases', 'White-label options'],
  },
]

// ═══════════════════════════════════════════════════════════
// CHANGELOG DATA
// ═══════════════════════════════════════════════════════════
const changelogEntries = [
  {
    version: 'v1.4.0',
    date: 'June 2, 2026',
    type: 'feature',
    title: 'Multi-turn Clarification API',
    changes: [
      'Added clarification question support in /api/classify responses when confidence is below threshold',
      'New clarification_id field enables multi-turn conversations for ambiguous queries',
      'Added suggested_responses array to help users provide structured answers',
      'Updated confidence_threshold parameter to accept custom values per request',
    ],
  },
  {
    version: 'v1.3.2',
    date: 'May 20, 2026',
    type: 'improvement',
    title: 'Calibration Engine v2.4',
    changes: [
      'Improved confidence score calibration — scores now match true accuracy within ±3%',
      'Fixed over-classification bias toward Mental Health category for stress-related queries',
      'Reduced median processing time from 1.8s to 1.2s through API call optimization',
      'Added model_version field to all classification responses',
    ],
  },
  {
    version: 'v1.3.0',
    date: 'May 5, 2026',
    type: 'feature',
    title: 'Feedback API & Resource Verification',
    changes: [
      'New POST /api/feedback endpoint for classification accuracy feedback',
      'New POST /api/verify endpoint for community resource submissions',
      'Added verification_status field to resource objects',
      'Webhook support for verification status change notifications',
    ],
  },
  {
    version: 'v1.2.1',
    date: 'April 18, 2026',
    type: 'fix',
    title: 'Location Filtering Fix',
    changes: [
      'Fixed ZIP code lookup returning incorrect state boundaries for border areas',
      'Improved location ranking to prioritize resources within 25 miles',
      'Added support for city + state format in location parameter',
    ],
  },
  {
    version: 'v1.2.0',
    date: 'April 1, 2026',
    type: 'feature',
    title: 'Resource Database Expansion',
    changes: [
      'Expanded verified resource database from 1,200 to 2,286 resources',
      'Added Senior Services as 8th classification category',
      'New GET /api/categories endpoint with subcategory support',
      'Added last_verified timestamps and "Call to confirm" notices for resources older than 30 days',
    ],
  },
  {
    version: 'v1.1.0',
    date: 'March 15, 2026',
    type: 'feature',
    title: 'SDK Release & Pagination',
    changes: [
      'Released official JavaScript SDK (@clearpath-ai/sdk-js v1.1.0)',
      'Released official Python SDK (clearpath-ai v1.1.0)',
      'Added pagination to GET /api/resources with page, per_page, and total_pages',
      'Added sort parameter with relevance, verified_date, and name options',
    ],
  },
  {
    version: 'v1.0.0',
    date: 'March 1, 2026',
    type: 'release',
    title: 'Initial Public API Release',
    changes: [
      'POST /api/classify endpoint with BART-large-MNLI zero-shot classification',
      'GET /api/resources endpoint with category and location filtering',
      '7 classification categories: Housing, Food, Mental Health, Employment, Legal, Healthcare, Crisis',
      'API key authentication via Bearer token',
      'Standard rate limits: 10 req/min (Free), 60 req/min (Pro)',
    ],
  },
]

// ═══════════════════════════════════════════════════════════
// WEBHOOK EVENTS DATA
// ═══════════════════════════════════════════════════════════
const webhookEvents = [
  {
    event: 'classification.completed',
    description: 'Fired when a classification request finishes processing. Includes full results and confidence scores.',
    payload: `{
  "event": "classification.completed",
  "timestamp": "2026-06-05T14:32:18.429Z",
  "data": {
    "query_id": "qry_a8f3c2d1e4b5",
    "categories": ["Housing Assistance", "Food Assistance"],
    "top_confidence": 0.87,
    "crisis_detected": false
  }
}`,
  },
  {
    event: 'resource.verified',
    description: 'Fired when a submitted resource passes verification review and is added to the public database.',
    payload: `{
  "event": "resource.verified",
  "timestamp": "2026-06-05T16:00:00.000Z",
  "data": {
    "verification_id": "ver_5m8n2k9p3q7r",
    "resource_id": "res_4521",
    "name": "Community Food Bank of Metro Atlanta",
    "category": "Food Assistance"
  }
}`,
  },
  {
    event: 'resource.expired',
    description: 'Fired when a resource verification expires (30+ days since last verification). Resources receive a "Call to confirm" notice.',
    payload: `{
  "event": "resource.expired",
  "timestamp": "2026-06-05T09:00:00.000Z",
  "data": {
    "resource_id": "res_1205",
    "name": " Downtown Job Center",
    "category": "Employment Services",
    "last_verified": "2026-05-04",
    "status": "call_to_confirm"
  }
}`,
  },
  {
    event: 'feedback.received',
    description: 'Fired when user feedback is submitted for a classification. Useful for monitoring classification quality.',
    payload: `{
  "event": "feedback.received",
  "timestamp": "2026-06-05T14:50:22.789Z",
  "data": {
    "feedback_id": "fbk_3q7r5m8n2k9p",
    "query_id": "qry_a8f3c2d1e4b5",
    "feedback_type": "classification_inaccurate",
    "rating": 3
  }
}`,
  },
  {
    event: 'rate_limit.warning',
    description: 'Fired when API usage reaches 80% of the rate limit. Useful for proactive monitoring.',
    payload: `{
  "event": "rate_limit.warning",
  "timestamp": "2026-06-05T13:45:00.000Z",
  "data": {
    "tier": "pro",
    "usage_percent": 80,
    "requests_remaining": 20000,
    "reset_at": "2026-07-01T00:00:00.000Z"
  }
}`,
  },
]

// ═══════════════════════════════════════════════════════════
// FAQ DATA
// ═══════════════════════════════════════════════════════════
const apiFAQs = [
  {
    question: 'How do I get an API key?',
    answer: 'Sign up for a free ClearPath AI account and navigate to your Dashboard. Under the API Keys section, click "Generate New Key." Your key will be displayed once — store it securely. Free tier keys support up to 10,000 requests per month. For higher limits, upgrade to Pro or contact sales for Enterprise access.',
  },
  {
    question: 'What happens when I exceed my rate limit?',
    answer: 'When you exceed your rate limit, the API returns a 429 Too Many Requests response with a Retry-After header indicating when you can make your next request. We implement a sliding window algorithm, so you don\'t need to wait for a full reset — just the time specified in the header. Pro and Enterprise users can configure burst allowances for temporary spikes.',
  },
  {
    question: 'Is the API suitable for production use?',
    answer: 'Yes. The ClearPath AI API is designed for production workloads with 99.9% uptime SLA (Enterprise), automatic failover, and global edge caching. Our classification engine processes over 50,000 queries per day with a median response time under 1.5 seconds. However, remember that the API is a classification tool — it should complement, not replace, human judgment in resource navigation.',
  },
  {
    question: 'Can I use the API for batch processing?',
    answer: 'Batch processing is supported on Pro and Enterprise plans. You can send up to 100 queries per batch request to POST /api/classify/batch (Enterprise only). For Pro users, we recommend implementing a queue with appropriate delays between requests to stay within rate limits. Contact our team for custom batch processing solutions.',
  },
  {
    question: 'How does the classification engine handle ambiguous queries?',
    answer: 'When confidence scores fall below the threshold (default 70%), the API returns a clarification_needed flag with suggested clarification questions. You can present these to your users for multi-turn refinement. The clarification_id parameter lets you continue the conversation while maintaining context. This is our "ask, don\'t guess" philosophy in API form.',
  },
  {
    question: 'What data does the API log?',
    answer: 'We log minimal metadata for each request: timestamp, API key hash (not the key itself), response status, and processing time. We do NOT log query text, classification results, or any personally identifiable information. Our zero-retention policy means your users\' queries are processed and immediately discarded. See our Privacy Policy for full details.',
  },
  {
    question: 'Can I customize the classification categories?',
    answer: 'Custom categories are available on the Enterprise plan. You can define up to 20 custom categories that replace or extend our standard 8-category taxonomy. Custom categories work with the same zero-shot classification engine — just provide your category names and descriptions, and we\'ll configure them within 24 hours. Contact your account manager for setup.',
  },
  {
    question: 'How do I handle errors gracefully?',
    answer: 'All errors follow a consistent JSON structure with error code, message, and suggested action. Implement exponential backoff for 429 and 503 errors (retry after the time in Retry-After header). For 401/403 errors, check your API key. For 422 errors, validate your request body against the schema. We recommend wrapping API calls in try/catch blocks and providing fallback UI for your users.',
  },
  {
    question: 'Is there a sandbox environment for testing?',
    answer: 'Yes! Every API key has access to our sandbox environment at api-sandbox.clearpath-ai.org. The sandbox returns mock data that matches our production response format exactly, but doesn\'t consume your rate limit. Use the sandbox to build and test your integration before going live. No additional configuration needed — just point your base URL to the sandbox.',
  },
  {
    question: 'What is the SLA for the API?',
    answer: 'Free and Pro plans have a best-effort SLA with no guaranteed uptime (historically 99.5%+). Enterprise plans include a 99.9% uptime SLA with priority incident response (4-hour resolution target for P1 issues). We publish real-time status at status.clearpath-ai.org and notify via webhooks for any degradation. All plans include crisis detection — this layer is architecturally separate and has never experienced downtime.',
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
              API v1.4.0 — Developer Documentation
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
            Build with ClearPath AI&apos;s classification engine. Classify queries against 8 verified categories,
            retrieve resources, and integrate calibrated transparency into your applications.
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
              { icon: Database, text: '2,286+ verified resources', color: '#10b981' },
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
                            Sign up at <InlineCode>clearpath-ai.org</InlineCode> and navigate to Dashboard → API Keys. Click &ldquo;Generate New Key&rdquo; to create your first key. Store it securely — it won&apos;t be shown again.
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
                            Classify a query against our 8 categories with a single POST request. Include your API key in the Authorization header and your query in the request body.
                          </p>
                          <CodeBlock
                            code={`curl -X POST https://api.clearpath-ai.org/v1/classify \\
  -H "Authorization: Bearer cpk_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "I need help paying my electricity bill",
    "location": "30318",
    "options": {
      "multi_label": true,
      "confidence_threshold": 0.7,
      "include_resources": true
    }
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
const response = await fetch('https://api.clearpath-ai.org/v1/classify', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer cpk_live_your_api_key_here',
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

                    {/* Step 4 */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-blue-600 to-blue-700 flex items-center justify-center text-white text-[13px] font-bold shrink-0">4</div>
                        <div className="flex-1 space-y-3">
                          <h3 className="text-[15px] font-bold text-gray-900">Install the SDK (Optional)</h3>
                          <p className="text-[14px] text-gray-600 leading-relaxed">
                            For a better developer experience, use our official SDKs. They handle authentication, retries, and type safety out of the box.
                          </p>
                          <div className="grid md:grid-cols-2 gap-4">
                            <CodeBlock
                              code={`npm install @clearpath-ai/sdk-js`}
                              language="bash"
                              filename="JavaScript SDK"
                            />
                            <CodeBlock
                              code={`pip install clearpath-ai`}
                              language="bash"
                              filename="Python SDK"
                            />
                          </div>
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
                        All API requests require authentication via a Bearer token in the <InlineCode>Authorization</InlineCode> header.
                        API keys are prefixed with <InlineCode>cpk_live_</InlineCode> (production) or <InlineCode>cpk_test_</InlineCode> (sandbox).
                        Keys can be managed from your Dashboard under the API Keys section.
                      </p>
                      <CodeBlock
                        code={`# Include your API key in every request
curl -X GET https://api.clearpath-ai.org/v1/resources \\
  -H "Authorization: Bearer cpk_live_abc123def456ghi789" \\
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
                          <h3 className="text-[15px] font-bold text-gray-900">Production Keys</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[13px] text-gray-600 leading-relaxed">Prefix: <InlineCode>cpk_live_</InlineCode></p>
                          <p className="text-[13px] text-gray-600 leading-relaxed">Use for production applications consuming real API quota.</p>
                          <p className="text-[13px] text-gray-600 leading-relaxed">Returns real classification results and verified resources.</p>
                        </div>
                      </div>

                      <div className="glass-card rounded-2xl p-6 shadow-premium">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <BeakerIcon className="w-4 h-4 text-blue-500" />
                          </div>
                          <h3 className="text-[15px] font-bold text-gray-900">Sandbox Keys</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[13px] text-gray-600 leading-relaxed">Prefix: <InlineCode>cpk_test_</InlineCode></p>
                          <p className="text-[13px] text-gray-600 leading-relaxed">Use for development and testing. Returns mock data.</p>
                          <p className="text-[13px] text-gray-600 leading-relaxed">Does not consume your API rate limit.</p>
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
                          'Never expose your API key in client-side code, public repositories, or browser DevTools.',
                          'Use environment variables (e.g., CLEARPATH_API_KEY) to store keys server-side.',
                          'Rotate your API keys regularly — you can regenerate keys from your Dashboard without downtime.',
                          'Use sandbox keys (cpk_test_) for all development and testing.',
                          'Set up key restrictions in your Dashboard to limit keys by IP address or domain.',
                          'Monitor your usage dashboard for unexpected spikes that may indicate key compromise.',
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
                          https://api.clearpath-ai.org/v1
                        </code>
                        <span className="text-[12px] text-gray-400">|</span>
                        <span className="text-[13px] font-semibold text-gray-500">Sandbox:</span>
                        <code className="px-3 py-1.5 rounded-lg bg-gray-900 text-blue-400 text-[13px] font-mono">
                          https://api-sandbox.clearpath-ai.org/v1
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
                        Endpoints that return lists support cursor-based pagination. Include <InlineCode>page</InlineCode> and <InlineCode>per_page</InlineCode>
                        parameters in your request. The response includes total count and page metadata.
                      </p>
                      <CodeBlock
                        code={`// Request: GET /api/resources?category=housing&page=2&per_page=20

{
  "success": true,
  "data": {
    "resources": [...],     // Array of 20 resources
    "total": 423,           // Total matching resources
    "page": 2,              // Current page number
    "per_page": 20,         // Results per page
    "total_pages": 22,      // Total number of pages
    "has_next": true,       // More pages available
    "has_prev": true        // Previous page exists
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
                    <p className="text-[14px] text-gray-600 leading-relaxed">
                      Rate limits are applied per API key using a sliding window algorithm. Limits vary by plan tier.
                      When you approach your limit, the API returns a <InlineCode>429 Too Many Requests</InlineCode> response
                      with a <InlineCode>Retry-After</InlineCode> header.
                    </p>

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
                            title: 'Batch Where Possible',
                            desc: 'Use the batch endpoint (Enterprise) or group similar queries to reduce total API calls.',
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

              {/* ─── SDK SECTION ─── */}
              <section id="sdks" className="py-20 md:py-28 border-t border-gray-100/60">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <Code2 className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">SDKs</h2>
                      <p className="text-[14px] text-gray-500">Official client libraries for JavaScript and Python</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-8">
                    {/* JavaScript SDK */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                          <span className="text-[14px] font-bold text-yellow-600">JS</span>
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-900">JavaScript SDK</h3>
                          <p className="text-[12px] text-gray-500">@clearpath-ai/sdk-js v1.4.0</p>
                        </div>
                        <code className="ml-auto px-3 py-1 rounded-lg bg-gray-900 text-emerald-400 text-[12px] font-mono">
                          npm install @clearpath-ai/sdk-js
                        </code>
                      </div>

                      <CodeBlock
                        code={`import { ClearPathAI } from '@clearpath-ai/sdk-js';

// Initialize the client
const client = new ClearPathAI({
  apiKey: process.env.CLEARPATH_API_KEY,
  // Optional: use sandbox for testing
  // baseURL: 'https://api-sandbox.clearpath-ai.org/v1',
});

// Classify a query
const result = await client.classify({
  query: 'I lost my job and can\'t pay rent, my kids need food',
  location: '30318',
  options: {
    multiLabel: true,
    confidenceThreshold: 0.7,
    includeResources: true,
    maxResults: 5,
  },
});

// Always check for crisis detection first
if (result.data.crisisDetected) {
  console.error('Crisis detected:', result.data.crisisResponse);
  // Display crisis resources immediately
  return;
}

// Access classifications with full type safety
result.data.classifications.forEach((cls) => {
  console.log(\`\${cls.category}: \${Math.round(cls.confidence * 100)}%\`);
  console.log(\`  Reasoning: \${cls.reasoning}\`);
  console.log(\`  Alternatives: \${cls.alternatives.map(a => a.category).join(', ')}\`);

  // Access matched resources
  cls.resources?.forEach((resource) => {
    console.log(\`  - \${resource.name} (\${resource.provider})\`);
    console.log(\`    Verified: \${resource.lastVerified}\`);
  });
});

// Retrieve resources by category
const resources = await client.resources.list({
  category: 'housing',
  location: '30318',
  page: 1,
  perPage: 20,
});

// Submit feedback
await client.feedback.submit({
  queryId: result.data.queryId,
  feedbackType: 'classification_accurate',
  rating: 5,
  comment: 'Results were very helpful and accurate!',
});`}
                        language="javascript"
                        filename="JavaScript SDK Usage"
                      />
                    </div>

                    {/* Python SDK */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <span className="text-[14px] font-bold text-blue-600">Py</span>
                        </div>
                        <div>
                          <h3 className="text-[15px] font-bold text-gray-900">Python SDK</h3>
                          <p className="text-[12px] text-gray-500">clearpath-ai v1.4.0</p>
                        </div>
                        <code className="ml-auto px-3 py-1 rounded-lg bg-gray-900 text-emerald-400 text-[12px] font-mono">
                          pip install clearpath-ai
                        </code>
                      </div>

                      <CodeBlock
                        code={`import os
from clearpath_ai import ClearPathAI

# Initialize the client
client = ClearPathAI(
    api_key=os.environ.get("CLEARPATH_API_KEY"),
    # Optional: use sandbox for testing
    # base_url="https://api-sandbox.clearpath-ai.org/v1",
)

# Classify a query
result = client.classify(
    query="I lost my job and can't pay rent, my kids need food",
    location="30318",
    multi_label=True,
    confidence_threshold=0.7,
    include_resources=True,
    max_results=5,
)

# Always check for crisis detection first
if result.data.crisis_detected:
    print(f"Crisis detected: {result.data.crisis_response}")
    # Display crisis resources immediately
    exit()

# Access classifications with full type safety
for cls in result.data.classifications:
    print(f"{cls.category}: {round(cls.confidence * 100)}%")
    print(f"  Reasoning: {cls.reasoning}")
    print(f"  Alternatives: {', '.join(a.category for a in cls.alternatives)}")

    # Access matched resources
    for resource in (cls.resources or []):
        print(f"  - {resource.name} ({resource.provider})")
        print(f"    Verified: {resource.last_verified}")

# Retrieve resources by category
resources = client.resources.list(
    category="housing",
    location="30318",
    page=1,
    per_page=20,
)

# Submit feedback
client.feedback.submit(
    query_id=result.data.query_id,
    feedback_type="classification_accurate",
    rating=5,
    comment="Results were very helpful and accurate!",
)

# Context manager support (auto-closes connections)
with ClearPathAI(api_key=os.environ["CLEARPATH_API_KEY"]) as client:
    result = client.classify(query="I need help with my electricity bill")
    print(f"Top category: {result.data.classifications[0].category}")`}
                        language="python"
                        filename="Python SDK Usage"
                      />
                    </div>

                    {/* SDK features comparison */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4">SDK Features</h3>
                      <div className="overflow-x-auto rounded-xl border border-gray-100/60">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-gray-50/80">
                              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Feature</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">JavaScript</th>
                              <th className="px-4 py-3 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Python</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {[
                              { feature: 'TypeScript types', js: true, py: true },
                              { feature: 'Automatic retries', js: true, py: true },
                              { feature: 'Rate limit handling', js: true, py: true },
                              { feature: 'Crisis detection helpers', js: true, py: true },
                              { feature: 'Streaming support', js: true, py: false },
                              { feature: 'Context manager', js: false, py: true },
                              { feature: 'Webhook verification', js: true, py: true },
                              { feature: 'Request timeout config', js: true, py: true },
                              { feature: 'Tree-shakeable', js: true, py: false },
                            ].map((row) => (
                              <tr key={row.feature} className="hover:bg-gray-50/40 transition-colors">
                                <td className="px-4 py-3 text-[13px] font-medium text-gray-900">{row.feature}</td>
                                <td className="px-4 py-3">
                                  {row.js ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
                                </td>
                                <td className="px-4 py-3">
                                  {row.py ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </section>

              {/* ─── WEBHOOKS SECTION ─── */}
              <section id="webhooks" className="py-20 md:py-28 border-t border-gray-100/60">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  variants={staggerContainer}
                >
                  <motion.div variants={staggerItem} className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                      <Webhook className="w-5 h-5 text-pink-500" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">Webhooks</h2>
                      <p className="text-[14px] text-gray-500">Real-time event notifications</p>
                    </div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-8">
                    <p className="text-[14px] text-gray-600 leading-relaxed">
                      Webhooks let you receive real-time notifications when events occur in your ClearPath AI account.
                      Configure webhook endpoints in your Dashboard, and we&apos;ll send HTTP POST requests to your server whenever
                      an event fires. Webhooks are available on Pro and Enterprise plans.
                    </p>

                    {/* Setup instructions */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium">
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4">Setup Instructions</h3>
                      <CodeBlock
                        code={`// 1. Create a webhook endpoint on your server
app.post('/webhooks/clearpath', (req, res) => {
  // 2. Verify the webhook signature
  const signature = req.headers['x-clearpath-signature'];
  const payload = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', process.env.CLEARPATH_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).send('Invalid signature');
  }

  // 3. Process the event
  const { event, data } = req.body;

  switch (event) {
    case 'classification.completed':
      handleClassificationComplete(data);
      break;
    case 'resource.verified':
      handleResourceVerified(data);
      break;
    case 'resource.expired':
      handleResourceExpired(data);
      break;
    case 'feedback.received':
      handleFeedbackReceived(data);
      break;
    case 'rate_limit.warning':
      handleRateLimitWarning(data);
      break;
    default:
      console.log('Unknown event:', event);
  }

  // 4. Always respond with 200 OK
  res.status(200).send('OK');
});`}
                        language="javascript"
                        filename="Webhook Handler (Express.js)"
                      />
                    </div>

                    {/* Webhook events */}
                    <div>
                      <h3 className="text-[15px] font-bold text-gray-900 mb-4">Available Events</h3>
                      <div className="space-y-4">
                        {webhookEvents.map((webhook) => (
                          <div key={webhook.event} className="glass-card rounded-2xl p-6 shadow-premium">
                            <div className="flex items-center gap-3 mb-3">
                              <code className="px-3 py-1 rounded-lg bg-gray-900 text-emerald-400 text-[12px] font-mono">
                                {webhook.event}
                              </code>
                            </div>
                            <p className="text-[13px] text-gray-600 leading-relaxed mb-4">{webhook.description}</p>
                            <CodeBlock code={webhook.payload} language="json" filename="Payload" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Webhook security */}
                    <div className="glass-card rounded-2xl p-6 shadow-premium border-l-4 border-l-pink-400">
                      <div className="flex items-center gap-2 mb-4">
                        <Shield className="w-5 h-5 text-pink-500" />
                        <h3 className="text-[15px] font-bold text-gray-900">Webhook Security</h3>
                      </div>
                      <ul className="space-y-2">
                        {[
                          'All webhooks are sent over HTTPS with TLS 1.2+ encryption.',
                          'Each webhook includes an X-Clearpath-Signature header (HMAC-SHA256) for verification.',
                          'Webhook secrets are unique per endpoint and can be rotated from your Dashboard.',
                          'Failed deliveries are retried up to 5 times with exponential backoff (1min, 5min, 30min, 2hr, 12hr).',
                          'You can view delivery history and retry individual webhooks from your Dashboard.',
                          'IP whitelisting is available for Enterprise customers — contact support to configure.',
                        ].map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                            <span className="text-[13px] text-gray-600 leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
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
                        Start building with ClearPath AI&apos;s classification engine today. Free tier includes 10,000
                        requests per month — no credit card required. Crisis detection is always on.
                      </p>

                      <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                          href="/dashboard"
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
                          { icon: Lock, text: 'Zero data stored', color: '#3b82f6' },
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
              <span className="text-[11px] text-gray-400">API v1.4.0</span>
              <span className="text-[11px] text-gray-300">|</span>
              <a href="https://status.clearpath-ai.org" target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Status
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
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

// ═══════════════════════════════════════════════════════════
// HELPER ICON COMPONENT (for Sandbox keys)
// ═══════════════════════════════════════════════════════════
function BeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4.5 3h15" />
      <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
      <path d="M6 14h12" />
    </svg>
  )
}
