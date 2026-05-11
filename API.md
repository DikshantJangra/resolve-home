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
  email: string
  phone: string
  image: string        // profile image URL
  role: "user" | "admin" | "worker"
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Services — `Services` (Public)

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `GET`  | `/api/categories` | List all categories | ❌ |
| `GET`  | `/api/services` | List all services (filter by `?categoryId=`) | ❌ |
| `GET`  | `/api/categories/:categoryId/services` | Services by category | ❌ |

---

## Bookings — `Bookings`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `POST` | `/api/bookings` | Create booking | ✅ |
| `GET`  | `/api/bookings` | Get own bookings | ✅ |
| `GET`  | `/api/bookings/available-engineers` | Get available engineers for a booking | ✅ |
| `PUT`  | `/api/bookings/:id/select-engineer` | Select engineer for booking | ✅ |
| `POST` | `/api/bookings/:id/review` | Review completed booking | ✅ |
| `PUT`  | `/api/bookings/:id/cancel` | Cancel a booking | ✅ |

### `POST /api/bookings`
```json
{
  "serviceId": "string",
  "priority": "emergency" | "standard",
  "scheduledDate?": "YYYY-MM-DD",
  "scheduledTime?": "HH:MM",
  "issueDetails": "string",
  "photos?": ["string (URL)"],
  "location": { "state": "string", "city": "string", "streetAddress": "string", "nearestLandmark": "string", "latitude?": number, "longitude?": number }
}
```

---

## Wallet — `Wallet`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `GET`  | `/api/wallet` | Get wallet details + balance | ✅ |
| `GET`  | `/api/wallet/statistics` | Get wallet stats | ✅ |
| `GET`  | `/api/wallet/transactions` | Get transaction history | ✅ |
| `POST` | `/api/wallet/deposit/initialize` | Initialize deposit (Paystack) | ✅ |
| `GET`  | `/api/wallet/deposit/verify/:ref` | Verify deposit | ✅ |

---

## Quotation — `Quotation`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `POST` | `/api/quotations` | Create quotation (Engineer) | ✅ |
| `GET`  | `/api/quotations/booking/:bookingId` | Get quotation for booking | ✅ |
| `PUT`  | `/api/quotations/:id/approve` | Approve quotation (Customer) | ✅ |
| `PUT`  | `/api/quotations/:id/reject` | Reject quotation (Customer) | ✅ |
| `PUT`  | `/api/quotations/:id/revise` | Revise quotation (Engineer) | ✅ |

---

## Chat — `Chat`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `GET`  | `/api/chats` | Get all chats | ✅ |
| `GET`  | `/api/chats/:chatId/messages` | Get chat messages | ✅ |
| `PUT`  | `/api/chats/:chatId/read` | Mark messages as read | ✅ |

### Socket.IO Events
- `join_chat`: (chatId)
- `send_message`: ({ chatId, message })
- `receive_message`: (message)
- `typing` / `stop_typing`: ({ chatId })
- `user_typing` / `user_stopped_typing`: ({ chatId, userId })

---

## Admin — Management

> All admin routes require `role: admin`.

- **Users:** `/api/admin/users` (GET, POST, GET :id, PUT :id, POST :id/ban, GET /stats)
- **Categories:** `/api/admin/categories` (GET, POST, GET :id, PUT :id, DELETE :id)
- **Services:** `/api/admin/services` (GET, POST, GET :id, PUT :id, DELETE :id)
- **Engineers:** `/api/admin/engineers` (GET, POST, GET :id, PUT :id, DELETE :id, GET /stats)
- **Bookings:** `/api/admin/bookings` (GET, GET :id, PUT :id/status, PUT :id/engineers, GET /stats)
- **Stats:** `/api/admin/stats` (GET)
- **Complaints:** `/api/admin/complaints` (GET, GET :id, PUT :id/respond, GET /stats)
