# Task: Replace mock data in /app page with real /api/classify API calls

## Summary
Successfully replaced mock data and hardcoded responses in `/app/page.tsx` with real `/api/classify` API integration. The page now fully relies on the real classification API with proper conversation tracking, full-screen crisis overlay, and guest mode support.

## Changes Made

### 1. Added `useSession` import for guest mode awareness (line 6)
- Added `import { useSession } from 'next-auth/react'`
- Added `const { data: session } = useSession()` in the main component
- Updated profile button to show user initials when logged in, User icon when guest

### 2. Added `conversationId` to `ClassifyResponse` type (line 83)
- Added `conversationId?: string` to the ClassifyResponse interface
- This allows tracking the conversation ID returned by `/api/classify`

### 3. Updated confidence color thresholds (lines 179-203)
- Changed from 4-tier (80/70/50) to 3-tier per spec:
  - Green (`#10b981`): >70% confidence
  - Yellow/Amber (`#f59e0b`): 40-70% confidence
  - Red (`#ef4444`): <40% confidence
- Updated all 5 utility functions: `getConfidenceColor`, `getConfidenceBg`, `getConfidenceGlow`, `getConfidenceLabel`, `getConfidenceRingBg`

### 4. Removed `createConversationAndSave` function
- The `/api/classify` route already saves conversations to the DB and returns a `conversationId`
- Removed the duplicate conversation creation that was calling `/api/conversations` separately
- The API handles all DB persistence; the client just tracks the returned ID

### 5. Updated `handleSend` function (lines 1520-1662)
- Now sends `conversationId` in the request body if we have one (for continuing conversations)
- Tracks `conversationId` from the API response: `currentConvIdRef.current = data.conversationId`
- Sets `activeConversationId` state from the API response
- Triggers full-screen crisis overlay when `data.isCrisis === true`
- Refreshes sidebar conversations list after successful classification
- Updated error messages to: "Something went wrong. You can still search resources or talk to a navigator."

### 6. Added full-screen crisis overlay (lines 1785-1846)
- New state variables: `showCrisisOverlay`, `crisisOverlayLines`
- Full-screen overlay with `z-[100]`, backdrop blur, and dark overlay
- Reuses the existing `CrisisBlock` component for the crisis lines display
- Added "I've reached out for help" acknowledge button (dismisses overlay)
- Added "Talk to a Navigator" button (always visible, also dismisses)
- Animated entrance with Framer Motion spring transitions
- Overlay is dismissed by clicking either action button
- Crisis overlay state is cleared on reset

### 7. Updated sidebar conversation color thresholds (lines 1104-1105)
- Changed from `>=80`/`>=50` to `>70`/`>=40` to match new color scheme
- Confidence dots and badges in sidebar now use green/amber/red scheme

### 8. Profile button now reflects auth state (lines 2027-2035)
- Shows user initials when authenticated (e.g., "JD" for John Doe)
- Shows User icon when in guest mode

## What Was NOT Changed (Preserved)
- All CSS classes, Tailwind styles, glass-card, mesh-gradient-bg, shadow-premium styling
- All Framer Motion animations and transitions
- All component structure and layout
- Resource database (`resourceDb`), `whyMap`, `alsoMap` - these enrich the API response
- `enrichCategories` function - still adds resources/why/also/warning from local maps
- Clarification flow - still uses `ClarifyPanel` component
- `CategoryCard` component - unchanged visual design
- `CrisisBlock` component - reused inside the full-screen overlay
- Sidebar, HowItWorksModal, DemoScenariosModal - unchanged
- The `<70%` warning threshold in `enrichCategories` and transparency items (functional, not color)

## How It Works Now
1. User types text → POST to `/api/classify` with `{ text, conversationId? }`
2. API returns: `{ isCrisis, categories, needsClarification, clarificationMessage, crisisLines, conversationId, model }`
3. Client tracks `conversationId` for subsequent messages
4. If crisis: full-screen overlay with crisis lines + action buttons
5. If clarification needed: show clarification panel with options
6. If classified: show enriched category cards with resources
7. API saves everything to DB; client just refreshes sidebar

## Lint Status
- `npx eslint src/app/app/page.tsx` — passes with no errors
- Dev server log shows no compilation errors
