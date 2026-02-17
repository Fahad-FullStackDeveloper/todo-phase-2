# Feature: JWT Authentication

**Feature ID:** BF-01, BF-02, BF-03  
**Status:** `draft`  
**Constitution Principles:**
- Principle 1: Spec-Driven Development
- Principle 3: JWT Authentication & User Isolation
- Principle 4: Neon Serverless PostgreSQL Data Layer
- Principle 5: Premium SaaS UX Standards

---

## Overview

JWT Authentication provides secure user authentication and authorization for the TodoFlow application. This specification covers the complete authentication flow including user signup, signin, signout, token refresh, and protected route enforcement. The implementation uses Better Auth compatible JWT tokens with stateless verification, ensuring scalability and security.

This specification ensures enterprise-grade security while maintaining a seamless user experience that balances security with usability.

---

## User Stories

| ID | Story | Priority |
|----|-------|----------|
| US-AU-01 | As a new user, I can sign up with my email and password so that I can create an account | Must Have |
| US-AU-02 | As an existing user, I can sign in with my credentials so that I can access my tasks | Must Have |
| US-AU-03 | As a user, I can sign out so that my session is securely terminated | Must Have |
| US-AU-04 | As a user, I can stay signed in across browser sessions so that I don't need to log in every time | Must Have |
| US-AU-05 | As a user, my authentication token is automatically refreshed so that I don't get logged out unexpectedly | Should Have |
| US-AU-06 | As a user, I can see my profile information after signing in so that I can verify my account | Should Have |
| US-AU-07 | As a user, I am redirected to appropriate pages after auth actions so that the flow feels seamless | Must Have |
| US-AU-08 | As a user, I receive clear error messages for auth failures so that I can resolve issues | Must Have |

---

## Acceptance Criteria

### User Signup (US-AU-01)

- [ ] Signup form accessible from landing page and /auth/signup route
- [ ] Email field: required, valid email format, unique constraint enforced
- [ ] Password field: required, minimum 8 characters, strength indicator shown
- [ ] Password requirements displayed: 8+ chars, at least 1 uppercase, 1 lowercase, 1 number
- [ ] Name field: optional, 1-100 characters
- [ ] Submit button disabled until form is valid
- [ ] Loading state shown during signup request
- [ ] Successful signup: JWT token issued, user redirected to dashboard
- [ ] Email already registered: clear error message "This email is already registered"
- [ ] Weak password: real-time strength feedback with specific requirements
- [ ] Network error: user-friendly message with retry option
- [ ] Signup triggers welcome email (future enhancement, noted for Phase 3)

### User Signin (US-AU-02)

- [ ] Signin form accessible from landing page and /auth/signin route
- [ ] Email field: required, valid email format
- [ ] Password field: required, password type with show/hide toggle
- [ ] "Remember me" checkbox: extends token expiration when checked
- [ ] "Forgot password?" link (future enhancement, Phase 3)
- [ ] Submit button disabled until form is valid
- [ ] Loading state shown during signin request
- [ ] Successful signin: JWT token issued, stored securely, redirected to dashboard
- [ ] Invalid credentials: generic error "Invalid email or password" (security best practice)
- [ ] Account not found: same error as invalid credentials (prevent enumeration)
- [ ] Too many failed attempts: rate limit message after 5 failures in 15 minutes
- [ ] Redirect to intended destination if user was redirected to auth

### User Signout (US-AU-03)

- [ ] Signout accessible from user menu in header/navigation
- [ ] Signout action requires single click (no confirmation needed)
- [ ] Token invalidated on server (added to blocklist/invalidated via refresh token revocation)
- [ ] Local storage/session storage cleared of auth tokens
- [ ] User redirected to landing page or signin page
- [ ] TanStack Query cache cleared of user-specific data
- [ ] Signout successful even if server call fails (client-side cleanup)
- [ ] Multiple tabs: signout in one tab signs out all tabs (via storage event)

### Persistent Sessions (US-AU-04)

- [ ] "Remember me" option extends token expiration to 30 days
- [ ] Without "remember me": token expires in 7 days
- [ ] Refresh token stored in httpOnly cookie (more secure than localStorage)
- [ ] Access token stored in memory (React state/context)
- [ ] Token persists across browser restarts when "remember me" selected
- [ ] Clear auth data on explicit signout regardless of remember setting
- [ ] Session validity checked on app load
- [ ] Expired session redirects to signin with "Session expired" message

### Token Refresh (US-AU-05)

- [ ] Access token expiration: 15 minutes (short-lived for security)
- [ ] Refresh token expiration: 7 days (or 30 days with remember me)
- [ ] Automatic token refresh triggered when access token expires
- [ ] Refresh happens transparently without user interruption
- [ ] Failed refresh (invalid refresh token) triggers signout and redirect to signin
- [ ] Refresh token rotation: new refresh token issued with each refresh
- [ ] Token refresh retry logic: 1 retry on network failure
- [ ] Multiple concurrent requests: single refresh call handles all queued requests

### Profile Display (US-AU-06)

- [ ] User profile accessible from header user menu
- [ ] Profile shows: name, email, account creation date
- [ ] Profile shows task statistics: total tasks, completion rate
- [ ] Edit profile option (future: change name, email, password)
- [ ] Signout option prominently displayed in profile menu
- [ ] Profile menu accessible via keyboard (arrow keys, Enter, Escape)

### Auth Redirects (US-AU-07)

- [ ] Unauthenticated user accessing protected route: redirect to signin
- [ ] After signin: redirect to intended destination or dashboard
- [ ] After signup: redirect to onboarding or dashboard
- [ ] After signout: redirect to landing page
- [ ] Authenticated user accessing signin/signup: redirect to dashboard
- [ ] Redirect preserves query parameters where appropriate
- [ ] Redirect URL validated to prevent open redirect vulnerabilities

### Error Messages (US-AU-08)

- [ ] Validation errors: inline field errors with clear descriptions
- [ ] Network errors: "Unable to connect. Please check your internet connection."
- [ ] Server errors: "Something went wrong. Please try again."
- [ ] Rate limit: "Too many attempts. Please try again in X minutes."
- [ ] Token expired: "Your session has expired. Please sign in again."
- [ ] Error messages are accessible to screen readers (ARIA live regions)
- [ ] Error toast notifications for non-field-specific errors

---

## Technical Requirements

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Create new user account |
| POST | `/api/auth/signin` | No | Authenticate user, issue tokens |
| POST | `/api/auth/signout` | Yes | Logout user, invalidate tokens |
| GET | `/api/auth/me` | Yes | Get current user profile |
| POST | `/api/auth/refresh` | Yes (refresh token) | Refresh access token |
| POST | `/api/auth/forgot-password` | No | Request password reset (Phase 3) |
| POST | `/api/auth/reset-password` | No | Reset password with token (Phase 3) |

### Request/Response Schemas

#### POST /api/auth/signup

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-02-17T10:30:00Z"
  },
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "dGhpcyBpcyBhIHJlZnJl...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

**Error Response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is already registered",
    "details": [
      { "field": "email", "message": "This email is already in use" }
    ]
  }
}
```

#### POST /api/auth/signin

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "remember_me": true
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "dGhpcyBpcyBhIHJlZnJl...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

#### POST /api/auth/signout

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Successfully signed out"
}
```

#### GET /api/auth/me

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Success Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-02-17T10:30:00Z"
  }
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

#### POST /api/auth/refresh

**Request Body:**
```json
{
  "refresh_token": "dGhpcyBpcyBhIHJlZnJl..."
}
```

**Success Response (200):**
```json
{
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "bmV3IHJlZnJlc2ggdG9r...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

### Database Models

#### Users Table (Managed by Better Auth)

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_signin_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);
```

#### Token Blocklist Table (for invalidated tokens)

```sql
CREATE TABLE token_blocklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_jti VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for quick lookups
CREATE INDEX idx_token_blocklist_jti ON token_blocklist(token_jti);
CREATE INDEX idx_token_blocklist_expires ON token_blocklist(expires_at);

-- Cleanup old tokens (scheduled job)
-- DELETE FROM token_blocklist WHERE expires_at < now() - INTERVAL '30 days';
```

### JWT Token Structure

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "iat": 1708164600,
  "exp": 1708165500,
  "jti": "unique-token-id",
  "type": "access"
}
```

### Token Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| Access Token Expiration | 15 minutes (900 seconds) | Short-lived for security |
| Refresh Token Expiration | 7 days (604800 seconds) | Standard session |
| Refresh Token (Remember Me) | 30 days (2592000 seconds) | Extended session |
| Algorithm | HS256 | HMAC with SHA-256 |
| Secret Key | `BETTER_AUTH_SECRET` | Environment variable, 32+ chars |
| Issuer | `todoflow-app` | Token issuer identifier |
| Audience | `todoflow-api` | Token audience identifier |

### Password Hashing

- **Algorithm**: bcrypt
- **Salt Rounds**: 12 (balance of security and performance)
- **Implementation**: `passlib[bcrypt]` or `bcrypt` library

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password, rounds=12)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### Validation Rules

| Field | Type | Constraints | Error Message |
|-------|------|-------------|---------------|
| `email` | string | Required, valid email format, max 255 chars | "Valid email is required" |
| `password` | string | Required, min 8 chars, max 128 chars | "Password must be at least 8 characters" |
| `password` | string | Must contain uppercase, lowercase, number | "Password must include uppercase, lowercase, and number" |
| `name` | string | Optional, 1-100 chars, trimmed | "Name must be 1-100 characters" |
| `remember_me` | boolean | Optional, default false | - |

### Security Requirements

- **HTTPS Enforcement**: All auth endpoints require HTTPS in production
- **CORS Configuration**: Only allow requests from trusted origins
- **Rate Limiting**: 
  - Signup: 5 requests per hour per IP
  - Signin: 5 requests per 15 minutes per IP
  - Refresh: 10 requests per minute per user
- **Password Storage**: Never store plain text passwords
- **Token Storage**: httpOnly cookies for refresh tokens, memory for access tokens
- **CSRF Protection**: CSRF tokens for state-changing operations
- **XSS Prevention**: Content-Security-Policy headers, input sanitization

### Token Refresh Flow

```
1. Client makes API request with access token
2. Server responds with 401 (token expired)
3. Client intercepts 401, pauses original request
4. Client calls /api/auth/refresh with refresh token
5. Server validates refresh token, issues new access + refresh tokens
6. Client stores new tokens, retries original request
7. If refresh fails, client signs out user and redirects to signin
```

---

## UX Requirements

### Authentication Forms

#### Signup Form

```
┌─────────────────────────────────────────┐
│  Create Your Account                    │
├─────────────────────────────────────────┤
│                                         │
│  Name                                   │
│  ┌─────────────────────────────────┐   │
│  │ John Doe                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Email *                                │
│  ┌─────────────────────────────────┐   │
│  │ user@example.com                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Password *                             │
│  ┌─────────────────────────────────┐   │
│  │ ••••••••••••••••        [👁]    │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ●●●○○ Password Strength         │   │
│  │ ✓ 8+ characters                 │   │
│  │ ✓ Uppercase letter              │   │
│  │ ✓ Lowercase letter              │   │
│  │ ○ Number                        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Create Account             │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Already have an account? Sign in      │
└─────────────────────────────────────────┘
```

#### Signin Form

```
┌─────────────────────────────────────────┐
│  Welcome Back                           │
├─────────────────────────────────────────┤
│                                         │
│  Email *                                │
│  ┌─────────────────────────────────┐   │
│  │ user@example.com                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Password *                             │
│  ┌─────────────────────────────────┐   │
│  │ ••••••••••••••••        [👁]    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ☐ Remember me    Forgot password?     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Sign In                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Don't have an account? Sign up        │
└─────────────────────────────────────────┘
```

### Form States

- **Default**: Clean fields with placeholder text
- **Focused**: Border highlight, label animation
- **Valid**: Green checkmark indicator
- **Invalid**: Red border, error message below field
- **Loading**: Spinner in submit button, form disabled
- **Success**: Green checkmark, redirect after brief delay

### Loading States

- **Button Loading**: Spinner replaces button text, button disabled
- **Page Loading**: Skeleton loaders for auth page elements
- **Token Refresh**: Silent background operation, no UI indication

### Error Display

- **Inline Errors**: Red text below field with icon
- **Form-Level Errors**: Banner at top of form with error summary
- **Toast Notifications**: Non-blocking error toasts for network/server errors
- **Accessibility**: ARIA live regions announce errors to screen readers

### Redirect Behavior

- **Protected Route Access**: Store intended destination, redirect after signin
- **Post-Auth Redirect**: Smooth transition, preserve query params where appropriate
- **Session Expiry**: Clear message, redirect to signin with return URL

### User Menu (Authenticated)

```
┌─────────────────────────┐
│  👤 John Doe            │
│     user@example.com    │
├─────────────────────────┤
│  📊 Dashboard           │
│  ⚙️  Settings           │
│  ❓ Help                │
├─────────────────────────┤
│  🚪 Sign Out            │
└─────────────────────────┘
```

### Animations (Framer Motion)

```typescript
// Form transition
const formAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

// Password strength indicator
const strengthAnimation = {
  initial: { width: 0 },
  animate: { width: `${strength}%` },
  transition: { duration: 0.3 },
};

// Error shake animation
const errorShake = {
  x: [0, -10, 10, -10, 10, 0],
  transition: { duration: 0.4 },
};
```

### Keyboard Navigation

| Shortcut | Action | Context |
|----------|--------|---------|
| `Tab` | Move to next field | All forms |
| `Shift+Tab` | Move to previous field | All forms |
| `Enter` | Submit form | When focus in input |
| `Escape` | Close modal / Cancel | Modal open |
| `Space` | Toggle checkbox | Checkbox focused |

### Accessibility

- All form fields have associated labels
- Error messages linked to fields via `aria-describedby`
- Required fields indicated with `aria-required` and visual indicator
- Password show/hide toggle has `aria-label`
- Form submission announces success/error via ARIA live region
- Focus management on redirects and modal open/close
- Color contrast meets WCAG 2.1 AA

---

## Dependencies

| Feature | Dependency Type | Description |
|---------|-----------------|-------------|
| `task-management.md` | Consumer | Task endpoints require auth |
| `projects-kanban.md` | Consumer | Project endpoints require auth |
| `calendar-view.md` | Consumer | Calendar endpoints require auth |
| `analytics.md` | Consumer | Analytics endpoints require auth |

---

## Related Specifications

- `@specs/overview.md` - Project overview with API endpoint definitions
- `@specs/features/task-management.md` - Task management (auth consumer)
- `@specs/features/analytics.md` - Analytics dashboard (auth consumer)
- `@specs/database/schema.md` - Database schema including users table
- `fastapi-jwt-security` skill - JWT security patterns

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Signup Conversion Rate | >40% of visitors | Analytics tracking |
| Signin Success Rate | >98% | Successful auth / attempts |
| Token Refresh Success | >99% | Successful refresh / attempts |
| Session Duration | 7+ days average | Time between signins |
| Auth Page Load Time | <1s | Time to interactive |
| Password Reset Rate | <5% of users | Password reset requests |

---

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Signup with existing email | Clear error: "This email is already registered" |
| Signin with unverified email | Allow signin (email verification is Phase 3) |
| Token expired during API call | Automatic refresh, retry original request |
| Refresh token expired | Sign out user, redirect to signin with message |
| Multiple tabs signout | Storage event listener signs out all tabs |
| Network failure during auth | User-friendly error, retry option |
| Concurrent signin from different locations | Allow multiple sessions (no session limiting in Phase 2) |
| SQL injection attempt in email | Parameterized queries prevent injection |
| XSS attempt in name field | Input sanitization, output encoding |
| Brute force password attack | Rate limiting, account lockout after repeated failures |
| JWT token tampering | Signature verification rejects tampered tokens |
| Clock skew between client/server | Token validation includes clock skew tolerance (30 seconds) |

---

## Security Checklist

- [ ] HTTPS enforced in production
- [ ] Passwords hashed with bcrypt (12 rounds)
- [ ] JWT tokens signed with strong secret (32+ chars)
- [ ] Refresh tokens stored in httpOnly cookies
- [ ] Access tokens stored in memory only
- [ ] Rate limiting on all auth endpoints
- [ ] CORS configured for trusted origins only
- [ ] CSRF protection enabled
- [ ] Security headers configured (CSP, X-Frame-Options, etc.)
- [ ] Token blocklist for invalidated tokens
- [ ] Audit logging for auth events (signup, signin, signout)
- [ ] No sensitive data in error messages
- [ ] Input validation on all fields
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)

---

*This specification follows the principles of the Phase 2 Constitution. Implementation must align with documented requirements, technology stack, and UX standards.*
