# Resolve Home — Backend API Reference

> **Source of truth** — fetched from `https://resolvhome.onrender.com/openapi.json`  
> **Base URL (prod):** `https://resolvhome.onrender.com`  
> **Base URL (dev):** `http://localhost:3000`  
> **Auth:** Bearer token (JWT) — stored in `localStorage` as `auth_token`

---

## Auth — `Authentication`

| Method | Endpoint | Summary | Auth Required |
|--------|----------|---------|:---:|
| `POST` | `/api/signup-with-role` | Register with email, password, name, role | ❌ |
| `POST` | `/api/auth/sign-in/email` | Sign in with email & password | ❌ |
| `POST` | `/api/auth/sign-in/social` | Sign in with Google OAuth | ❌ |
| `POST` | `/api/auth/verify-email` | Verify email via token | ❌ |
| `POST` | `/api/auth/forget-password` | Request password reset email | ❌ |
| `POST` | `/api/auth/reset-password` | Reset password with token | ❌ |
| `POST` | `/api/auth/sign-out` | Sign out current session | ❌ |
| `GET`  | `/api/auth/get-session` | Get current session + user | ✅ |

### `POST /api/signup-with-role`
```json
// Request
{ "email": "string", "password": "string (min 8)", "name": "string", "phone?": "string", "role?": "user|admin|worker" }
// Response 201
{ "success": true, "message": "User created successfully. Verification email sent." }
```

### `POST /api/auth/sign-in/email`
```json
// Request
{ "email": "string", "password": "string (min 8)" }
// Response 200
{ "success": true, "data": { "user": {}, "session": {}, "token": "string" } }
```

### `POST /api/auth/sign-in/social`
```json
// Request
{ "provider": "google", "callbackURL?": "/dashboard", "disableRedirect?": true }
// Response 200 (disableRedirect: true)
{ "url": "https://accounts.google.com/...", "redirect": false }
// Response 302 (disableRedirect: false) — redirects to Google OAuth
```

### `POST /api/auth/forget-password`
```json
{ "email": "string" }
// 200: { "success": true, "message": "Password reset email sent" }
```

### `POST /api/auth/reset-password`
```json
{ "token": "string", "password": "string (min 8)" }
```

### `GET /api/auth/get-session`
```json
// Response 200
{ "success": true, "data": { "user": {}, "session": {} } }
// 401 if not authenticated
```

---

## User — `User`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `GET`  | `/api/user/profile` | Get own profile | ✅ |
| `PUT`  | `/api/user/profile` | Update own profile | ✅ |
| `PUT`  | `/api/user/password` | Change password | ✅ |

### User Profile Shape
```ts
{
  id: string
  name: string
  email: string        // read-only, cannot be changed
  phone: string
  address: string
  image: string        // profile image URL (upload via /api/upload first)
  role: "user" | "admin" | "worker"
  emailVerified: boolean
  createdAt: string    // ISO date
  updatedAt: string
}
```

### `PUT /api/user/profile`
```json
// Request (name required, rest optional)
{ "name": "string", "phone?": "string", "address?": "string", "image?": "string (URL)" }
```

### `PUT /api/user/password`
```json
{ "currentPassword": "string", "newPassword": "string (min 8)" }
```

---

## Services — `Services` (Public)

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `GET`  | `/api/services` | List all services (filter by `?categoryId=`) | ❌ |
| `GET`  | `/api/services/:id` | Get single service | ❌ |
| `GET`  | `/api/categories/:categoryId/services` | Services by category | ❌ |

### Service Shape
```ts
{
  id: string
  name: string
  description: string
  price: number
  categoryId: string
  duration: number     // minutes
  image: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Bookings — `Bookings`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `POST` | `/api/bookings` | Create booking | ✅ |
| `GET`  | `/api/bookings` | Get own bookings (paginated, filter by status) | ✅ |
| `PUT`  | `/api/bookings/:id/cancel` | Cancel a booking | ✅ |

### `POST /api/bookings`
```json
// Request
{
  "serviceId": "string",
  "scheduledDate": "YYYY-MM-DD",
  "scheduledTime": "HH:MM",
  "notes?": "string"
}
// ⚠️ Requires complete profile: name, email, phone, address
// ⚠️ Date must be in the future
```

### Booking Status Enum
```
pending → confirmed → in-progress → completed
                  ↘ cancelled (only from pending or confirmed)
```

### Booking Shape
```ts
{
  id: string
  customerId: string
  serviceId: string
  service: object      // populated
  engineerIds: string[]
  scheduledDate: string
  scheduledTime: string
  customerDetails: object
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled"
  notes: string
  totalPrice: number
  createdAt: string
  updatedAt: string
}
```

---

## File Upload — `File Upload`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `GET`  | `/api/upload/config` | Get Uppy config | ✅ |
| `POST` | `/api/upload` | Upload file(s) | ✅ |
| `DELETE` | `/api/upload` | Delete file(s) | ✅ |

### Query params for upload
- `type`: `image` (5MB) | `document` (10MB) | `any` (10MB)
- `multiple`: `true|false`
- `maxFiles`: integer (default 5)

### Upload Response
```json
{ "success": true, "data": { "file": { "url": "/uploads/filename.jpg", "filename": "...", "originalName": "...", "size": 102400, "mimeType": "image/jpeg" } } }
```

---

## Admin — User Management

> All admin routes require `role: admin` + Bearer token.

| Method | Endpoint | Summary |
|--------|----------|---------|
| `GET`  | `/api/admin/users` | List users (paginated) |
| `POST` | `/api/admin/users` | Create user |
| `GET`  | `/api/admin/users/:id` | Get user |
| `PUT`  | `/api/admin/users/:id` | Update user |
| `POST` | `/api/admin/users/:id/ban` | Ban/unban user |

---

## Admin — Category Management

| Method | Endpoint | Summary |
|--------|----------|---------|
| `GET`  | `/api/admin/categories` | List all categories |
| `POST` | `/api/admin/categories` | Create category |
| `GET`  | `/api/admin/categories/:id` | Get category |
| `PUT`  | `/api/admin/categories/:id` | Update category |
| `DELETE` | `/api/admin/categories/:id` | Delete category |

### Category Shape
```ts
{ id: string; name: string; description: string; icon: string; createdAt: string; updatedAt: string }
```

---

## Admin — Service Management

| Method | Endpoint | Summary |
|--------|----------|---------|
| `GET`  | `/api/admin/services` | List services (filter by `?categoryId=`) |
| `POST` | `/api/admin/services` | Create service |
| `GET`  | `/api/admin/services/:id` | Get service |
| `PUT`  | `/api/admin/services/:id` | Update service |
| `DELETE` | `/api/admin/services/:id` | Delete service |

---

## Admin — Engineer Management

| Method | Endpoint | Summary |
|--------|----------|---------|
| `GET`  | `/api/admin/engineers` | List engineers (paginated, `?includeInactive=true`) |
| `POST` | `/api/admin/engineers` | Create engineer |
| `GET`  | `/api/admin/engineers/:id` | Get engineer |
| `PUT`  | `/api/admin/engineers/:id` | Update engineer |
| `DELETE` | `/api/admin/engineers/:id` | Soft delete engineer |

### Engineer Shape
```ts
{
  id: string
  name: string
  email: string
  phone: string
  assignedServices: string[]   // array of service IDs
  image: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Admin — Booking Management

| Method | Endpoint | Summary |
|--------|----------|---------|
| `GET`  | `/api/admin/bookings` | All bookings (paginated, filter by status/serviceId/engineerId) |
| `GET`  | `/api/admin/bookings/:id` | Get booking (with populated service + engineers) |
| `PUT`  | `/api/admin/bookings/:id/status` | Update booking status |
| `PUT`  | `/api/admin/bookings/:id/engineers` | Assign engineers to booking |

### Assign Engineers
```json
// Request
{ "engineerIds": ["id1", "id2"] }
// 409 if any engineer already booked at that time
```

---

## Error Format (All Endpoints)
```json
{ "success": false, "error": "Human-readable error message" }
```

## Common HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient role) |
| 404 | Resource Not Found |
| 409 | Conflict (duplicate / scheduling clash) |
| 500 | Server Error |
