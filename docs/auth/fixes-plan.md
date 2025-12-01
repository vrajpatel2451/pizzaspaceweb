# Authentication Flow Fixes - Comprehensive Plan

## Executive Summary

This document outlines a multi-phase, sprint-organized plan to fix critical authentication issues in the Pizza Space application. Each phase includes specific agent assignments, deliverables, and mandatory E2E testing requirements.

---

## Problem Analysis

### Current State Issues

#### 1. RedirectTo Parameter Flow (CRITICAL)
- **Location**: `middleware.ts`, `login-form.tsx`, `register-form.tsx`, `login/page.tsx`, `register/page.tsx`
- **Issue**: Middleware uses `?redirect=` param, but:
  - Login page does NOT read the `redirect` param and passes static `redirectTo="/"`
  - Login "Sign up" link does NOT carry forward the `redirect` param to `/register`
  - Register form redirects to `/login` statically, not to the original protected route
- **Impact**: Users lose their destination after sign-up flow

#### 2. Cookie/Token Synchronization (CRITICAL)
- **Location**: `store/auth-store.ts`, `lib/api/auth.ts`, `middleware.ts`
- **Issue**:
  - Auth store only uses `localStorage` (client-side only)
  - Middleware checks for `pizzaspace_auth_token` cookie
  - Cookie is NEVER set - no code sets `pizzaspace_auth_token` cookie
  - `isAuthenticated` in store is never reflected server-side
- **Impact**: Middleware always sees user as unauthenticated, causing infinite redirect loops

#### 3. UI/UX Issues
- **Location**: `login-form.tsx`, `register-form.tsx`, `login/page.tsx`, `register/page.tsx`
- **Issues**:
  - "Or continue with" divider present (not needed)
  - Basic/simple heading styles vs. premium design in homepage/menu
  - Missing brand badge, decorative elements, gradient accents
- **Impact**: Inconsistent brand experience

---

## Sprint Organization

### Sprint 1: Core Functionality Fixes (Highest Priority)
**Duration**: 2-3 days
**Goal**: Fix authentication flow to be fully functional

### Sprint 2: UI/UX Enhancements
**Duration**: 1-2 days
**Goal**: Premium, eye-catching design matching homepage/menu standards

### Sprint 3: Testing & Validation
**Duration**: 1 day
**Goal**: Comprehensive E2E testing to validate entire flow

---

## Detailed Phase Breakdown

---

# SPRINT 1: Core Functionality Fixes

## Phase 1.1: Token/Cookie Management System

### Objective
Create unified token management that synchronizes between client (Zustand/localStorage) and server (HTTP-only cookies).

### Agent Assignment
**Primary**: `nextjs-forms-expert` (Server Actions, cookies)
**Secondary**: `nextjs-component-architect` (state management patterns)

### Tasks

#### 1.1.1 Create Server Actions for Token Management
**File**: `lib/actions/auth-actions.ts`

```typescript
// Server Actions to set/clear HTTP-only cookies
'use server'

import { cookies } from 'next/headers';

const TOKEN_COOKIE_NAME = 'pizzaspace_auth_token';
const TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function setAuthCookie(token: string, rememberMe: boolean = false) {
  const cookieStore = await cookies();
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: rememberMe ? TOKEN_MAX_AGE : undefined, // Session cookie if not remembered
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE_NAME);
}

export async function getAuthCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value || null;
}
```

#### 1.1.2 Update Auth Store to Use Server Actions
**File**: `store/auth-store.ts`

- Add async `loginWithCookie` method that calls server action
- Add async `logoutWithCookie` method that calls server action
- Keep localStorage for user data, but sync token to cookie

#### 1.1.3 Update Login Form
**File**: `components/auth/login-form.tsx`

- After successful API login, call `setAuthCookie(token, rememberMe)`
- Use `router.refresh()` after setting cookie to trigger middleware re-evaluation

#### 1.1.4 Update Register Form
**File**: `components/auth/register-form.tsx`

- After successful registration, call `setAuthCookie(token)`
- Auto-login user after registration (no redirect to login needed)

### Deliverables
- [ ] `lib/actions/auth-actions.ts` - Server actions for cookie management
- [ ] Updated `store/auth-store.ts` with cookie sync methods
- [ ] Updated login form with cookie setting
- [ ] Updated register form with auto-login

### E2E Test: Phase 1.1
```
Test: "Token persists across page refresh"
1. Login with valid credentials
2. Verify cookie is set (check browser devtools)
3. Refresh page
4. Verify user is still authenticated (no redirect to login)
5. Navigate to /profile
6. Verify access granted (no redirect)
```

---

## Phase 1.2: RedirectTo Parameter Flow

### Objective
Ensure `redirectTo` parameter flows correctly through the entire auth journey:
Protected Route -> Login -> Register -> Original Route

### Agent Assignment
**Primary**: `nextjs-forms-expert` (form handling, navigation)
**Secondary**: `nextjs-component-architect` (props/state flow)

### Tasks

#### 1.2.1 Update Login Page to Read URL Params
**File**: `app/(auth)/login/page.tsx`

```typescript
// Change to receive and pass searchParams
interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect || '/';

  return (
    // ...
    <LoginForm redirectTo={redirectTo} />
    // ...
  );
}
```

#### 1.2.2 Update Login Form Sign-up Link
**File**: `components/auth/login-form.tsx`

- Accept `redirectTo` prop
- Pass `redirectTo` to "Sign up" link: `/register?redirect=${encodeURIComponent(redirectTo)}`

#### 1.2.3 Update Register Page to Read URL Params
**File**: `app/(auth)/register/page.tsx`

```typescript
interface RegisterPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirect || '/';

  return (
    // ...
    <RegisterForm redirectTo={redirectTo} />
    // ...
  );
}
```

#### 1.2.4 Update Register Form Redirect Logic
**File**: `components/auth/register-form.tsx`

- After successful registration + auto-login, redirect to `redirectTo` (not `/login`)
- Update "Sign in" link to preserve redirect param: `/login?redirect=${encodeURIComponent(redirectTo)}`

#### 1.2.5 Update Middleware (Optional Enhancement)
**File**: `middleware.ts`

- Ensure redirect param name is consistent (`redirect` everywhere)
- Consider encoding special characters in redirect URLs

### Deliverables
- [ ] Updated `login/page.tsx` with searchParams handling
- [ ] Updated `login-form.tsx` with redirect-aware sign-up link
- [ ] Updated `register/page.tsx` with searchParams handling
- [ ] Updated `register-form.tsx` with proper redirect after registration

### E2E Test: Phase 1.2
```
Test: "Redirect flow preserves destination through registration"
1. Navigate to /profile (protected route)
2. Verify redirect to /login?redirect=/profile
3. Click "Sign up" link
4. Verify URL is /register?redirect=/profile
5. Complete registration form
6. Submit registration
7. Verify redirect to /profile (NOT /login)
8. Verify user data is displayed on profile page
```

---

## Phase 1.3: Auth State Hydration & Protection

### Objective
Ensure auth state is properly hydrated on client and protected routes work correctly after authentication.

### Agent Assignment
**Primary**: `nextjs-component-architect` (client/server boundaries)
**Secondary**: `nextjs-forms-expert` (state handling)

### Tasks

#### 1.3.1 Create Auth Provider Component
**File**: `components/providers/auth-provider.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  // Optionally: Sync client state with server cookie on mount
  // This handles edge cases where localStorage and cookie get out of sync

  if (!isHydrated) {
    return null; // or loading spinner
  }

  return <>{children}</>;
}
```

#### 1.3.2 Add Logout Functionality
**File**: `components/auth/logout-button.tsx`

- Create logout button that calls `clearAuthCookie` server action
- Clears Zustand store
- Redirects to home

#### 1.3.3 Update Profile/Protected Pages
- Ensure they use the auth provider
- Add proper loading states during hydration

### Deliverables
- [ ] `components/providers/auth-provider.tsx`
- [ ] `components/auth/logout-button.tsx`
- [ ] Updated protected page components

### E2E Test: Phase 1.3
```
Test: "Complete auth lifecycle"
1. Start as unauthenticated user
2. Navigate to /profile -> redirected to /login
3. Complete login
4. Verify /profile accessible
5. Click logout
6. Navigate to /profile -> redirected to /login
7. Verify cookie is cleared
```

---

# SPRINT 2: UI/UX Enhancements

## Phase 2.1: Premium Auth Page Design

### Objective
Transform auth pages to match the premium design language of homepage hero and menu page headers.

### Agent Assignment
**Primary**: `premium-ux-designer` (design system, visual hierarchy)
**Secondary**: `shadcn-implementation-builder` (component styling)
**Tertiary**: `nextjs-animation-specialist` (micro-interactions)

### Design Reference Analysis
From `hero-content.tsx` and `menu/page.tsx`, extract:
- Brand badge with pulsing dot
- Decorative gradient blobs
- Wavy underline SVG accents
- Staggered animations with Framer Motion
- Orange/amber accent colors
- Dark mode support

### Tasks

#### 2.1.1 Create Auth Page Section Header Component
**File**: `components/auth/auth-header.tsx`

Premium header with:
- Brand badge (like hero): "Pizza Space - Welcome"
- Animated headline with decorative underline
- Subheadline with muted text
- Decorative divider (dots and lines)

#### 2.1.2 Update Auth Layout with Premium Background
**File**: `app/(auth)/layout.tsx`

Add:
- Gradient background blobs (like menu page)
- Subtle grid pattern overlay
- Proper overflow handling

#### 2.1.3 Update Login Form UI
**File**: `components/auth/login-form.tsx`

Remove:
- "Or continue with" divider section

Add:
- Premium card styling with subtle shadow
- Hover/focus states with orange accent
- Loading states with branded spinner
- Success state animation

#### 2.1.4 Update Register Form UI
**File**: `components/auth/register-form.tsx`

Remove:
- "Already have an account?" divider styling

Add:
- Match login form premium styling
- Progress indicator for password strength with branded colors
- Animated success state

#### 2.1.5 Add Page-level Animations
Using Framer Motion:
- Staggered entrance for form elements
- Subtle hover effects on buttons
- Transition between login/register pages

### Deliverables
- [ ] `components/auth/auth-header.tsx` - Premium section header
- [ ] Updated `app/(auth)/layout.tsx` - Background decorations
- [ ] Updated `login-form.tsx` - Premium styling, removed "or continue with"
- [ ] Updated `register-form.tsx` - Matching premium styling
- [ ] Updated `login/page.tsx` - New layout structure
- [ ] Updated `register/page.tsx` - New layout structure

### Design Specifications

```css
/* Color Palette (from existing design) */
--primary: orange-500 (#f97316)
--primary-light: orange-100 (#ffedd5)
--accent-gradient: from-orange-50 via-white to-orange-50
--dark-gradient: from-gray-950 via-gray-900 to-gray-950

/* Badge Styling */
.auth-badge {
  @apply inline-flex items-center gap-2
         bg-orange-100 dark:bg-orange-500/10
         text-orange-600 dark:text-orange-400
         border border-orange-200 dark:border-orange-500/20
         px-4 py-1.5 rounded-full
         text-xs font-semibold tracking-wider uppercase;
}

/* Headline with Underline */
.auth-headline {
  @apply text-3xl sm:text-4xl lg:text-5xl font-bold
         text-slate-900 dark:text-white;
}
.auth-headline-accent {
  @apply text-orange-500 relative;
}
```

### E2E Test: Phase 2.1
```
Test: "UI matches design specifications"
1. Navigate to /login
2. Verify brand badge is present
3. Verify decorative underline on headline
4. Verify "Or continue with" is NOT present
5. Verify dark mode toggle works
6. Navigate to /register
7. Verify consistent styling with login
8. Take screenshots for visual comparison
```

---

## Phase 2.2: Responsive & Accessibility Polish

### Agent Assignment
**Primary**: `nextjs-responsive-design` (mobile-first)
**Secondary**: `nextjs-accessibility-expert` (WCAG compliance)

### Tasks

#### 2.2.1 Mobile Responsive Adjustments
- Auth card full-width on mobile
- Proper spacing and touch targets
- Input sizing for mobile keyboards

#### 2.2.2 Accessibility Audit
- Proper heading hierarchy
- ARIA labels on all interactive elements
- Focus management after form submission
- Error announcement for screen readers
- Color contrast verification

### Deliverables
- [ ] Responsive auth pages for all breakpoints
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation support
- [ ] Screen reader optimization

### E2E Test: Phase 2.2
```
Test: "Accessibility compliance"
1. Run automated accessibility audit (axe-core)
2. Verify all inputs have labels
3. Tab through entire login form
4. Submit with empty fields, verify error announced
5. Test with screen reader (VoiceOver/NVDA)
```

---

# SPRINT 3: Comprehensive E2E Testing

## Phase 3.1: E2E Test Suite Creation

### Agent Assignment
**Primary**: `nextjs-ui-reviewer` (code quality, test patterns)

### Test Scenarios

#### Test Suite: Authentication Flow

```typescript
// tests/e2e/auth.spec.ts

describe('Authentication Flow', () => {

  describe('Login', () => {
    it('should redirect unauthenticated users to login', async () => {
      // Navigate to protected route
      // Assert redirect to /login?redirect=<route>
    });

    it('should login successfully with valid credentials', async () => {
      // Fill login form
      // Submit
      // Assert redirect to home or specified redirect
      // Assert user menu shows logged-in state
    });

    it('should show error for invalid credentials', async () => {
      // Fill with bad credentials
      // Submit
      // Assert error message visible
      // Assert still on login page
    });

    it('should preserve redirect param when navigating to register', async () => {
      // Go to /login?redirect=/profile
      // Click "Sign up"
      // Assert URL is /register?redirect=/profile
    });
  });

  describe('Registration', () => {
    it('should register and auto-login user', async () => {
      // Fill registration form
      // Submit
      // Assert NO redirect to login
      // Assert user is logged in (cookie set)
      // Assert redirect to intended destination
    });

    it('should show validation errors', async () => {
      // Submit empty form
      // Assert validation messages
    });

    it('should show password strength indicator', async () => {
      // Type weak password
      // Assert "weak" indicator
      // Type strong password
      // Assert "strong" indicator
    });
  });

  describe('Protected Routes', () => {
    it('should allow access after login', async () => {
      // Login
      // Navigate to /profile
      // Assert page content visible
    });

    it('should maintain session across page refresh', async () => {
      // Login
      // Refresh page
      // Navigate to /profile
      // Assert still authenticated
    });

    it('should logout correctly', async () => {
      // Login
      // Click logout
      // Navigate to /profile
      // Assert redirect to login
    });
  });

  describe('Complete User Journey', () => {
    it('should complete full registration to protected route flow', async () => {
      // 1. Navigate to /profile (unauthenticated)
      // 2. Assert redirect to /login?redirect=/profile
      // 3. Click "Sign up"
      // 4. Assert on /register?redirect=/profile
      // 5. Fill registration form with unique email
      // 6. Submit
      // 7. Assert redirect to /profile (NOT /login)
      // 8. Assert profile page shows user data
      // 9. Refresh page
      // 10. Assert still on /profile with user data
      // 11. Click logout
      // 12. Assert redirect to home
      // 13. Navigate to /profile
      // 14. Assert redirect to /login
    });
  });
});
```

### Deliverables
- [ ] `tests/e2e/auth.spec.ts` - Complete E2E test suite
- [ ] Test fixtures for user data
- [ ] CI pipeline integration (if applicable)

---

## Phase 3.2: Manual Testing Checklist

### Pre-Release Verification

```markdown
## Manual Testing Checklist

### Setup
- [ ] Fresh browser session (no existing cookies/localStorage)
- [ ] Test in Chrome, Firefox, Safari
- [ ] Test on mobile device

### Login Flow
- [ ] Navigate to /profile -> redirected to /login?redirect=/profile
- [ ] Enter invalid credentials -> see error message
- [ ] Enter valid credentials -> logged in, redirected to /profile
- [ ] Refresh page -> still authenticated
- [ ] Open new tab, go to /profile -> authenticated

### Registration Flow
- [ ] Navigate to /profile -> redirected to /login?redirect=/profile
- [ ] Click "Sign up" -> on /register?redirect=/profile
- [ ] Submit empty form -> see validation errors
- [ ] Fill valid data with weak password -> see strength indicator
- [ ] Fill valid data with strong password -> see strength indicator
- [ ] Submit -> auto-logged in, redirected to /profile
- [ ] Verify NO redirect to /login page

### Cookie Verification
- [ ] After login, check DevTools -> Application -> Cookies
- [ ] Verify `pizzaspace_auth_token` cookie exists
- [ ] Verify cookie is HttpOnly
- [ ] After logout, verify cookie is deleted

### UI/UX
- [ ] Brand badge visible on auth pages
- [ ] Decorative elements match homepage style
- [ ] NO "Or continue with" divider on login
- [ ] Dark mode works correctly
- [ ] Mobile layout looks good
- [ ] Loading states visible during submission

### Accessibility
- [ ] Can tab through all form fields
- [ ] Error messages are announced
- [ ] All inputs have visible labels
- [ ] Focus returns appropriately after submission
```

---

## Implementation Priority Order

```
SPRINT 1: Core Functionality (MUST DO FIRST)
  Phase 1.1: Token/Cookie Management
  Phase 1.2: RedirectTo Parameter Flow
  Phase 1.3: Auth State Hydration

SPRINT 2: UI/UX (After Sprint 1 complete)
  Phase 2.1: Premium Auth Page Design
  Phase 2.2: Responsive & Accessibility

SPRINT 3: Testing (Throughout, finalize at end)
  Phase 3.1: E2E Test Suite
  Phase 3.2: Manual Testing
```

---

## Agent-Task Mapping Summary

| Phase | Primary Agent | Secondary Agent | Key Deliverables |
|-------|---------------|-----------------|------------------|
| 1.1 | `nextjs-forms-expert` | `nextjs-component-architect` | Server actions, cookie sync |
| 1.2 | `nextjs-forms-expert` | `nextjs-component-architect` | URL param flow, navigation |
| 1.3 | `nextjs-component-architect` | `nextjs-forms-expert` | Auth provider, logout |
| 2.1 | `premium-ux-designer` | `shadcn-implementation-builder`, `nextjs-animation-specialist` | Premium UI components |
| 2.2 | `nextjs-responsive-design` | `nextjs-accessibility-expert` | Mobile, a11y |
| 3.1 | `nextjs-ui-reviewer` | - | E2E tests |
| 3.2 | Manual | - | Checklist verification |

---

## Critical Success Criteria

### Functional Requirements (MUST PASS)
1. User can register and immediately access protected routes (no login redirect)
2. `redirectTo` parameter flows through entire auth journey
3. Cookie is set on login/register, checked by middleware
4. Session persists across page refresh
5. Logout clears cookie and redirects properly

### UI Requirements (MUST PASS)
1. No "Or continue with" divider on login page
2. Premium styling matching homepage/menu design language
3. Dark mode fully functional
4. Mobile responsive

### Testing Requirements (MUST PASS)
1. All E2E tests pass
2. Manual checklist completed
3. Tested on Chrome, Firefox, Safari
4. Tested on mobile

---

## Files to Modify/Create

### New Files
- `lib/actions/auth-actions.ts`
- `components/providers/auth-provider.tsx`
- `components/auth/auth-header.tsx`
- `components/auth/logout-button.tsx`
- `tests/e2e/auth.spec.ts`

### Files to Modify
- `store/auth-store.ts`
- `middleware.ts` (minor, param consistency)
- `components/auth/login-form.tsx`
- `components/auth/register-form.tsx`
- `app/(auth)/login/page.tsx`
- `app/(auth)/register/page.tsx`
- `app/(auth)/layout.tsx`

---

## Rollback Plan

If issues arise post-deployment:
1. Revert cookie-based auth, return to localStorage-only
2. Revert UI changes separately from functional changes
3. Maintain feature flags for progressive rollout

---

## Sign-Off Requirements

Before marking complete:
- [ ] All E2E tests passing
- [ ] Manual testing checklist 100% complete
- [ ] Code review by team lead
- [ ] Visual QA sign-off on UI changes
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] Lighthouse accessibility score >= 90
