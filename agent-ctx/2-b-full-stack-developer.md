# Task 2-b: Rewrite Chat Page with Real API Integration

## Agent: full-stack-developer

## Summary
Replaced the completely fake chat page with real API integration while keeping the exact same visual design.

## What Was Done

### 1. Created `/api/conversations` Route
- **File**: `src/app/api/conversations/route.ts`
- GET handler: Lists conversations from DB, ordered by createdAt desc
- POST handler: Creates a new conversation with title, preview, category, confidence, isCrisis

### 2. Created `/api/conversations/[id]/messages` Route
- **File**: `src/app/api/conversations/[id]/messages/route.ts`
- POST handler: Adds a message (user or ai) to an existing conversation
- Verifies conversation exists before creating message
- Updates conversation's updatedAt timestamp

### 3. Rewrote `src/app/app/page.tsx` (2241 → ~2100 lines)
**Removed:**
- ALL hardcoded `chatSteps` data (~200 lines of pre-scripted conversations)
- Hardcoded `todayConversations` and `previousConversations` arrays
- `ChatStep` type interface (replaced with `ClassifyResponse`)
- `handleSelect` function that looked up `chatSteps[id]`
- `handleClarifySelect` that followed pre-scripted paths
- `getTransparencyItems(step: ChatStep)` that used hardcoded step data

**Added:**
- `ClassifyResponse` type matching `/api/classify` response format
- `ConversationHistory` type for sidebar conversations from API
- `resourceDb`, `whyMap`, `alsoMap` — resource enrichment data for category cards
- `enrichCategories()` function to add resources/why/also/warning to raw API categories
- `fetchConversations()` — fetches sidebar conversations from `GET /api/conversations`
- `handleSend(text)` — main handler that:
  1. Adds user message to UI
  2. Shows ProcessingPipeline animation
  3. Calls `POST /api/classify` with `{ text }`
  4. Parses response and determines statusBadge (crisis/clarify/verified/upgrade)
  5. Enriches categories with resource data
  6. Adds AI message to UI with appropriate components
  7. Saves conversation via `POST /api/conversations` and `POST /api/conversations/[id]/messages`
- `handleSelectStarter()` — now submits the starter text directly via `handleSend()` instead of looking up hardcoded data
- `handleClarifySelect()` — submits clarification text via `handleSend()`
- `handleFollowUpClick()` — submits follow-up suggestions via `handleSend()`
- Textarea now has `onKeyDown` handler for Enter to submit
- Send button is now clickable (was static div before)
- Badge changed from "DEMO" to "LIVE"
- Footer text changed from "Demo Mode" to "Live Mode"
- Suggested chips now use `handleSend()` instead of `setInputText()`
- Upgrade detection: tracks previous confidence to detect when clarification boosts it

**Kept Identically:**
- ConfidenceRing component (same styling, animations, pulse effect)
- ProcessingPipeline component (same 6-layer animation)
- StatusPill component (same crisis/clarify/verified/upgrade variants)
- CategoryCard component (same glass-card styling, resources, expand/collapse)
- CrisisBlock component (same red header, crisis lines, pulse animation)
- ClarifyPanel component (same amber styling, confidence ring, scanning animation)
- TransparencyPanel component (same expand/collapse, items display)
- SuggestionCard component (same icon mapping, glass-card, shine sweep)
- UpgradeAnimation component (same particle burst, ring morph)
- FloatingParticles component (same 20 floating dots)
- HowItWorksModal (same 6-layer architecture modal)
- DemoScenariosModal (same scenario cards)
- Sidebar component (updated to use API data instead of hardcoded arrays)
- MessageActionButtons (same copy/feedback/view details)
- All framer-motion animations
- All glass-card styling, mesh-gradient-bg, header-glass, input-bar-glass
- All CSS classes (card-shine, badge-shimmer, ai-avatar-orb, etc.)
- Same responsive design

### 4. Updated Prisma Schema
- Added `@@map("Conversation")` to Conversation model
- Added `@@map("Message")` to Message model
- This was needed because Turbopack was generating incorrect table name lookups

## API Endpoints Verified Working
- `GET /api/conversations` → 200 with conversation list
- `POST /api/conversations` → 200 with created conversation
- `POST /api/conversations/[id]/messages` → 200 with created message
- `POST /api/classify` → 200 with classification results (pre-existing)
- `POST /api/classify` with crisis keywords → 200 with crisis response

## Lint Status
✅ `bun run lint` passes cleanly with no errors
