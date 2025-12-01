# Authentication Feature Implementation Plan

## Overview

This document outlines the comprehensive multi-phase implementation plan for the authentication system in PizzaSpace web application.

**Spec Reference:** `@spec/auth_spec.md`, `@spec/auth_api.md`

---

## Sprint Overview

| Sprint | Phases | Duration Focus | Parallelization |
|--------|--------|----------------|-----------------|
| **Sprint 1** | Phase 1 + Phase 2 | Foundation + Store | Subphases run parallel |
| **Sprint 2** | Phase 3 + Phase 4 | API Layer + UI Components | Subphases run parallel |
| **Sprint 3** | Phase 5 + Phase 6 | Pages + Protection | Sequential |
| **Sprint 4** | Phase 7 | Testing & Polish | Sequential |

---

## Phase 1: Types & Foundation

### 1.1 User Types Enhancement
| Property | Value |
|----------|-------|
| **Agent** | `general-purpose` |
| **MCPs** | - |
| **Files** | `types/user.ts`, `types/index.ts` |
| **Parallel** | Yes (with 1.2) |

**Tasks:**
- [ ] Add `LoginUserPayload` export to `types/index.ts`
- [ ] Verify all user types are correctly defined
- [ ] Add any missing auth-related types

### 1.2 Auth Types Creation
| Property | Value |
|----------|-------|
| **Agent** | `general-purpose` |
| **MCPs** | - |
| **Files** | `types/auth.ts` |
| **Parallel** | Yes (with 1.1) |

**Tasks:**
- [ ] Create `AuthState` interface for store
- [ ] Create `AuthActions` interface for store methods
- [ ] Create token storage type definitions

---

## Phase 2: State Management (Zustand Store)

### 2.1 Auth Store Implementation
| Property | Value |
|----------|-------|
| **Agent** | `nextjs-component-architect` |
| **MCPs** | - |
| **Files** | `store/auth-store.ts` |
| **Parallel** | No |

**Tasks:**
- [ ] Create Zustand store with persist middleware
- [ ] Implement state: `user`, `token`, `isLoading`, `isAuthenticated`
- [ ] Implement actions: `setUser`, `setToken`, `logout`, `clearAuth`
- [ ] Add token persistence using localStorage
- [ ] Add hydration handling for SSR

### 2.2 Auth Provider Context
| Property | Value |
|----------|-------|
| **Agent** | `nextjs-component-architect` |
| **MCPs** | - |
| **Files** | `lib/contexts/auth-context.tsx`, `components/providers/auth-provider.tsx` |
| **Parallel** | Yes (after 2.1) |

**Tasks:**
- [ ] Create AuthContext for React context integration
- [ ] Create AuthProvider component
- [ ] Implement useAuth hook for easy access
- [ ] Handle hydration mismatch prevention

---

## Phase 3: API Layer

### 3.1 API Client Token Interceptor
| Property | Value |
|----------|-------|
| **Agent** | `general-purpose` |
| **MCPs** | - |
| **Files** | `lib/api/client.ts` |
| **Parallel** | Yes (with 3.2) |

**Tasks:**
- [ ] Add request interceptor to attach Authorization header
- [ ] Add response interceptor for 401 handling
- [ ] Implement token refresh logic (if applicable)
- [ ] Handle token expiry scenarios

### 3.2 Auth API Functions
| Property | Value |
|----------|-------|
| **Agent** | `general-purpose` |
| **MCPs** | - |
| **Files** | `lib/api/auth.ts`, `lib/api/index.ts` |
| **Parallel** | Yes (with 3.1) |

**Tasks:**
- [ ] Implement `loginUser(payload: LoginUserPayload)` function
- [ ] Implement `registerUser(payload: RegisterUserPayload)` function
- [ ] Implement `getProfile()` function
- [ ] Export from `lib/api/index.ts`
- [ ] Follow existing API pattern from `products.ts`

---

## Phase 4: UI Components

### 4.1 Form Components Research
| Property | Value |
|----------|-------|
| **Agent** | `shadcn-component-researcher` |
| **MCPs** | `mcp__shadcn__*`, `mcp__21st-dev__*` |
| **Files** | - |
| **Parallel** | Yes (start of Phase 4) |

**Tasks:**
- [ ] Research shadcn form components (Form, Input, Label)
- [ ] Research validation patterns (zod + react-hook-form)
- [ ] Identify animation patterns for auth forms
- [ ] Document component dependencies

### 4.2 Auth Form Components
| Property | Value |
|----------|-------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `mcp__shadcn__*`, `mcp__21st-dev__21st_magic_component_builder` |
| **Files** | `components/auth/login-form.tsx`, `components/auth/register-form.tsx` |
| **Parallel** | Yes (after 4.1, parallel with 4.3) |

**Tasks:**
- [ ] Create LoginForm component with:
  - Email input with validation
  - Password input with show/hide toggle
  - Remember me checkbox
  - Submit button with loading state
  - Error message display
  - Link to register page
- [ ] Create RegisterForm component with:
  - Name input
  - Email input with validation
  - Phone input with format validation
  - Password input with strength indicator
  - Confirm password input
  - Submit button with loading state
  - Link to login page

### 4.3 Auth UI Utilities
| Property | Value |
|----------|-------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `mcp__shadcn__*` |
| **Files** | `components/auth/auth-card.tsx`, `components/auth/social-login.tsx` |
| **Parallel** | Yes (after 4.1, parallel with 4.2) |

**Tasks:**
- [ ] Create AuthCard wrapper component (consistent styling)
- [ ] Create form field wrapper with error states
- [ ] Create password strength indicator
- [ ] Create social login buttons (optional, for future)

### 4.4 Premium UI Polish
| Property | Value |
|----------|-------|
| **Agent** | `premium-ux-designer` |
| **MCPs** | `mcp__21st-dev__21st_magic_component_refiner` |
| **Files** | `components/auth/*.tsx` |
| **Parallel** | No (after 4.2, 4.3) |

**Tasks:**
- [ ] Add micro-interactions and animations
- [ ] Implement loading states with skeleton
- [ ] Add success/error animations
- [ ] Ensure consistent premium feel

---

## Phase 5: Page Implementation

### 5.1 Login Page
| Property | Value |
|----------|-------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `mcp__shadcn__*`, `mcp__21st-dev__*` |
| **Files** | `app/(auth)/login/page.tsx`, `app/(auth)/layout.tsx` |
| **Parallel** | Yes (with 5.2) |

**Tasks:**
- [ ] Create auth route group `(auth)`
- [ ] Create auth layout without header/footer
- [ ] Implement login page with:
  - Branded header/logo
  - LoginForm integration
  - Background design/pattern
  - Redirect after success
  - Handle return URL from protected route

### 5.2 Register Page
| Property | Value |
|----------|-------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `mcp__shadcn__*`, `mcp__21st-dev__*` |
| **Files** | `app/(auth)/register/page.tsx` |
| **Parallel** | Yes (with 5.1) |

**Tasks:**
- [ ] Implement register page with:
  - Branded header/logo
  - RegisterForm integration
  - Background design consistent with login
  - Redirect to login after success
  - Terms acceptance checkbox

### 5.3 Profile Page
| Property | Value |
|----------|-------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `mcp__shadcn__*`, `mcp__21st-dev__*` |
| **Files** | `app/(protected)/profile/page.tsx`, `app/(protected)/layout.tsx` |
| **Parallel** | No (after 5.1, 5.2) |

**Tasks:**
- [ ] Create protected route group `(protected)`
- [ ] Create protected layout with auth check
- [ ] Implement profile page with:
  - User info display
  - Edit profile functionality
  - Logout button
  - Order history link (placeholder)

---

## Phase 6: Route Protection & App Integration

### 6.1 Auth Middleware/Guard
| Property | Value |
|----------|-------|
| **Agent** | `nextjs-component-architect` |
| **MCPs** | - |
| **Files** | `middleware.ts`, `components/auth/auth-guard.tsx` |
| **Parallel** | Yes (with 6.2) |

**Tasks:**
- [ ] Create Next.js middleware for route protection
- [ ] Define protected routes configuration
- [ ] Implement redirect to login with return URL
- [ ] Create AuthGuard client component for client-side protection

### 6.2 App Bootstrap Integration
| Property | Value |
|----------|-------|
| **Agent** | `general-purpose` |
| **MCPs** | - |
| **Files** | `app/layout.tsx`, `components/providers/auth-provider.tsx` |
| **Parallel** | Yes (with 6.1) |

**Tasks:**
- [ ] Add AuthProvider to root layout
- [ ] Implement initial auth check on app load
- [ ] Fetch profile if token exists
- [ ] Handle loading state during auth check

### 6.3 Header Integration
| Property | Value |
|----------|-------|
| **Agent** | `general-purpose` |
| **MCPs** | - |
| **Files** | `components/layout/header.tsx` |
| **Parallel** | No (after 6.2) |

**Tasks:**
- [ ] Add user avatar/menu when logged in
- [ ] Add login/register buttons when logged out
- [ ] Implement dropdown menu with:
  - Profile link
  - Orders link (placeholder)
  - Logout option

---

## Phase 7: Testing, Accessibility & Polish

### 7.1 Form Validation & UX
| Property | Value |
|----------|-------|
| **Agent** | `nextjs-forms-expert` |
| **MCPs** | - |
| **Files** | `lib/validators/auth.ts`, `components/auth/*.tsx` |
| **Parallel** | Yes (with 7.2) |

**Tasks:**
- [ ] Create Zod schemas for login/register forms
- [ ] Implement proper error messages
- [ ] Add form reset after submission
- [ ] Handle network error states

### 7.2 Accessibility Audit
| Property | Value |
|----------|-------|
| **Agent** | `nextjs-accessibility-expert` |
| **MCPs** | - |
| **Files** | `components/auth/*.tsx`, `app/(auth)/*.tsx` |
| **Parallel** | Yes (with 7.1) |

**Tasks:**
- [ ] Ensure WCAG 2.1 AA compliance
- [ ] Add proper ARIA labels
- [ ] Test keyboard navigation
- [ ] Ensure screen reader compatibility
- [ ] Add focus management

### 7.3 Responsive Design
| Property | Value |
|----------|-------|
| **Agent** | `nextjs-responsive-design` |
| **MCPs** | - |
| **Files** | `components/auth/*.tsx`, `app/(auth)/*.tsx` |
| **Parallel** | No (after 7.1, 7.2) |

**Tasks:**
- [ ] Ensure mobile-first design
- [ ] Test on various screen sizes
- [ ] Optimize touch targets
- [ ] Handle mobile keyboard behavior

### 7.4 UI Review
| Property | Value |
|----------|-------|
| **Agent** | `nextjs-ui-reviewer` |
| **MCPs** | `mcp__next-devtools__browser_eval` |
| **Files** | All auth-related files |
| **Parallel** | No (final step) |

**Tasks:**
- [ ] Review component quality
- [ ] Check for best practices
- [ ] Verify error handling
- [ ] Test loading states
- [ ] Browser testing with Playwright

---

## Execution Matrix

### Sprint 1: Foundation (Phase 1 + Phase 2)

```
Parallel Group A:
  ├── [1.1] User Types Enhancement (general-purpose)
  └── [1.2] Auth Types Creation (general-purpose)

Sequential:
  └── [2.1] Auth Store Implementation (nextjs-component-architect)

Parallel Group B:
  └── [2.2] Auth Provider Context (nextjs-component-architect)
```

### Sprint 2: API + UI (Phase 3 + Phase 4)

```
Parallel Group A:
  ├── [3.1] API Client Token Interceptor (general-purpose)
  └── [3.2] Auth API Functions (general-purpose)

Sequential:
  └── [4.1] Form Components Research (shadcn-component-researcher)

Parallel Group B:
  ├── [4.2] Auth Form Components (shadcn-implementation-builder)
  └── [4.3] Auth UI Utilities (shadcn-implementation-builder)

Sequential:
  └── [4.4] Premium UI Polish (premium-ux-designer)
```

### Sprint 3: Pages + Protection (Phase 5 + Phase 6)

```
Parallel Group A:
  ├── [5.1] Login Page (shadcn-implementation-builder)
  └── [5.2] Register Page (shadcn-implementation-builder)

Sequential:
  └── [5.3] Profile Page (shadcn-implementation-builder)

Parallel Group B:
  ├── [6.1] Auth Middleware/Guard (nextjs-component-architect)
  └── [6.2] App Bootstrap Integration (general-purpose)

Sequential:
  └── [6.3] Header Integration (general-purpose)
```

### Sprint 4: Polish (Phase 7)

```
Parallel Group A:
  ├── [7.1] Form Validation & UX (nextjs-forms-expert)
  └── [7.2] Accessibility Audit (nextjs-accessibility-expert)

Sequential:
  └── [7.3] Responsive Design (nextjs-responsive-design)
  └── [7.4] UI Review (nextjs-ui-reviewer)
```

---

## File Structure After Implementation

```
pizzaspace_web/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx          # Auth pages layout (no header/footer)
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── register/
│   │       └── page.tsx        # Register page
│   ├── (protected)/
│   │   ├── layout.tsx          # Protected pages layout (with auth check)
│   │   └── profile/
│   │       └── page.tsx        # Profile page
│   └── layout.tsx              # Root layout (with AuthProvider)
├── components/
│   ├── auth/
│   │   ├── login-form.tsx      # Login form component
│   │   ├── register-form.tsx   # Register form component
│   │   ├── auth-card.tsx       # Auth card wrapper
│   │   ├── auth-guard.tsx      # Client-side auth guard
│   │   └── index.ts            # Auth components barrel export
│   └── providers/
│       └── auth-provider.tsx   # Auth provider component
├── lib/
│   ├── api/
│   │   ├── auth.ts             # Auth API functions
│   │   ├── client.ts           # Updated with interceptors
│   │   └── index.ts            # Updated exports
│   ├── contexts/
│   │   └── auth-context.tsx    # Auth context
│   └── validators/
│       └── auth.ts             # Zod schemas for auth
├── store/
│   └── auth-store.ts           # Zustand auth store
├── types/
│   ├── auth.ts                 # Auth-specific types
│   ├── user.ts                 # User types (existing)
│   └── index.ts                # Updated exports
└── middleware.ts               # Next.js middleware for route protection
```

---

## Dependencies to Add

```bash
npm install zustand react-hook-form @hookform/resolvers zod
```

---

## MCP Tools Reference

| MCP | Purpose |
|-----|---------|
| `mcp__shadcn__search_items_in_registries` | Search for shadcn components |
| `mcp__shadcn__view_items_in_registries` | View component details |
| `mcp__shadcn__get_item_examples_from_registries` | Get usage examples |
| `mcp__shadcn__get_add_command_for_items` | Get install commands |
| `mcp__21st-dev__21st_magic_component_builder` | Build premium UI components |
| `mcp__21st-dev__21st_magic_component_inspiration` | Get UI inspiration |
| `mcp__21st-dev__21st_magic_component_refiner` | Refine/polish UI components |
| `mcp__next-devtools__browser_eval` | Browser testing |
| `mcp__playwright__*` | E2E testing |

---

## Approval Checkpoints

- [x] **Checkpoint 1:** After Sprint 1 - Review store implementation
- [x] **Checkpoint 2:** After Sprint 2 - Review UI components
- [x] **Checkpoint 3:** After Sprint 3 - Review pages and protection
- [x] **Checkpoint 4:** After Sprint 4 - Final review and sign-off

---

## Implementation Status: COMPLETE

**Completed:** December 1, 2025

All 4 sprints and 7 phases have been successfully implemented.

---

## Notes

1. **Token Storage:** Using localStorage with Zustand persist. Consider httpOnly cookies for production security.
2. **Route Protection:** Combination of middleware (server-side) and AuthGuard (client-side) for complete protection.
3. **Return URL:** Store intended destination when redirecting to login, redirect back after successful auth.
4. **Error Handling:** All API calls should handle network errors, 401s, and validation errors gracefully.
5. **Loading States:** Every async operation should have corresponding loading state in UI.
