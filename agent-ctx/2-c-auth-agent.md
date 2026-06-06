# Task 2-c: Implement Real Authentication

## Summary
Converted all fake login/signup/forgot-password forms into fully functional authentication flows using NextAuth.js v4.

## Files Created
1. **`/src/components/providers/AuthProvider.tsx`** — Client component wrapping `SessionProvider` from `next-auth/react`
2. **`/src/hooks/use-auth.ts`** — Custom `useAuth` hook exposing `session`, `status`, `isAuthenticated`, `isLoading`, `user`, `signIn`, `signOut`
3. **`/src/app/api/auth/register/route.ts`** — POST endpoint for user registration:
   - Validates required fields (email, password)
   - Checks password length >= 8
   - Checks for duplicate email/username
   - Hashes password with bcryptjs (12 rounds)
   - Creates User + UserSettings in DB
   - Returns 201 on success
4. **`/src/app/api/auth/forgot-password/route.ts`** — POST endpoint for password reset:
   - Accepts email, always returns success (prevents email enumeration)
   - Logs reset request (real email sending can be added later)

## Files Modified
1. **`/src/app/layout.tsx`** — Added `AuthProvider` wrapper around `{children}`
2. **`/src/app/login/page.tsx`**:
   - Added imports: `useRouter`, `signIn`, `useSession` from `next-auth/react`, `Loader2`, `useToast`
   - Added state: `isLoading`, `authError`
   - Added `useEffect` to redirect to `/dashboard` if already authenticated
   - Added `handlePasswordSubmit` function calling `signIn('credentials', { email, password, redirect: false })`
   - Submit button now has loading spinner + disabled state
   - Error messages display from NextAuth (CredentialsSignin → "Invalid email or password")
   - Google button calls `signIn('google', { callbackUrl: '/dashboard' })`
   - GitHub button calls `signIn('github', { callbackUrl: '/dashboard' })`
   - Apple button shows toast "Coming soon"
   - "Continue as guest" link unchanged
3. **`/src/app/signup/page.tsx`**:
   - Added imports: `useRouter`, `signIn` from `next-auth/react`, `Loader2`, `useToast`
   - Added state: `isLoading`, `authError`
   - Added `handleSignup` function:
     - Validates all required fields, password match, terms agreement, age verification
     - Calls POST `/api/auth/register` with all form data
     - On success, calls `signIn('credentials', { email, password, redirect: false })`
     - On auto-login success → redirect to `/dashboard`
     - On auto-login failure → toast + redirect to `/login`
   - Create Account button now has loading spinner + disabled state
   - Error messages display for registration failures
   - Google/GitHub social buttons use `signIn` with callbackUrl
   - Apple button shows toast "Coming soon"
4. **`/src/app/forgot-password/page.tsx`**:
   - Added import: `Loader2`
   - Added state: `isLoading`, `apiError`
   - `handleEmailSubmit` now calls POST `/api/auth/forgot-password`
   - Submit button has loading spinner + disabled state
   - Error messages display for API failures

## Visual Design
- ALL visual design preserved exactly: same layout, animations, glass-card styling, colors, icons
- Only form submission logic was changed
- Error messages use `motion.div` with red-50 background and Shield/AlertTriangle icon (matching existing design patterns)
- Loading states use `Loader2` spinner icon from lucide-react with `animate-spin`

## Verification
- `bun run lint` passes with zero errors
- `prisma db push` confirms database is in sync
- Dev server running successfully on port 3000
