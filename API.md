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

## User — `User Profile`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `GET`  | `/api/user/profile` | Get own profile (+ engineerProfile if worker) | ✅ |
| `PUT`  | `/api/user/profile` | Update name, phone, image | ✅ |
| `PUT`  | `/api/user/password` | Change password | ✅ |
| `GET`  | `/api/user/bio-address` | Get bio and home address | ✅ |
| `PUT`  | `/api/user/bio-address` | Update bio and home address | ✅ |

### User Profile Shape
```ts
{
  id: string
  name: string
  email: string          // read-only
  phone: string
  image: string
  bio: string
  homeAddress: { street, city, state, country, postalCode } | null
  role: "user" | "admin" | "worker"
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Notifications — `Notifications`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `GET`  | `/api/notifications` | Get notifications (paginated, `?unreadOnly=true`) | ✅ |
| `PUT`  | `/api/notifications/:id/read` | Mark one as read | ✅ |
| `PUT`  | `/api/notifications/read-all` | Mark all as read | ✅ |
| `GET`  | `/api/notifications/settings` | Get notification preferences | ✅ |
| `PUT`  | `/api/notifications/settings` | Update notification preferences | ✅ |

### Notification Shape
```ts
{
  id: string
  type: "booking_update" | "message" | "payment" | "complaint_response" | "review" | "system"
  title: string
  message: string
  relatedId: string | null
  relatedType: "booking" | "chat" | "payment" | "complaint" | null
  actionUrl: string | null   // e.g. "/bookings/123"
  isRead: boolean
  readAt: string | null
  createdAt: string
}
```

### Notification Settings Shape
```ts
{
  bookingUpdates: boolean
  messagesFromProfessionals: boolean
  pushNotifications: boolean
  smsAlerts: boolean
  weeklyEmailDigest: boolean
  promotionsAndOffers: boolean
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
| `GET`  | `/api/bookings` | Get own bookings (`?filter=all\|active\|upcoming\|completed\|cancelled`) | ✅ |
| `GET`  | `/api/bookings/available-engineers` | Get available engineers (`?bookingId=`) | ✅ |
| `PUT`  | `/api/bookings/:id/select-engineer` | Select engineer for booking | ✅ |
| `PUT`  | `/api/bookings/:id/accept` | Engineer accepts booking | ✅ |
| `PUT`  | `/api/bookings/:id/reject` | Engineer rejects booking | ✅ |
| `POST` | `/api/bookings/:id/review` | Review completed booking | ✅ |
| `PUT`  | `/api/bookings/:id/cancel` | Cancel a booking | ✅ |

### `POST /api/bookings`
```json
{
  "serviceId": "string",
  "priority": "emergency" | "standard",
  "scheduledDate?": "YYYY-MM-DD",   // standard only
  "scheduledTime?": "HH:MM",        // standard only
  "issueDetails": "string",
  "photos?": ["string (URL)"],       // max 3
  "location": { "state", "city", "streetAddress", "nearestLandmark", "latitude?", "longitude?" }
}
```

---

## Engineer — `Engineer`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `POST` | `/api/engineer/complete-profile` | Submit profile for verification | ✅ |
| `GET`  | `/api/engineer/dashboard` | Engineer dashboard stats | ✅ |
| `PUT`  | `/api/engineer/location` | Update GPS location | ✅ |
| `GET`  | `/api/engineer/bookings` | Get engineer bookings (`?filter=requests\|active\|upcoming\|completed\|cancelled`) | ✅ |
| `GET`  | `/api/engineer/bookings/:id` | Get booking details | ✅ |

---

## Wallet — `Wallet`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `GET`  | `/api/wallet` | Get wallet details + balance | ✅ |
| `GET`  | `/api/wallet/balance` | Get balance only | ✅ |
| `GET`  | `/api/wallet/statistics` | Get wallet stats | ✅ |
| `GET`  | `/api/wallet/transactions` | Get transaction history | ✅ |
| `POST` | `/api/wallet/top-up` | Top-up wallet — customers only (Paystack) | ✅ |
| `POST` | `/api/wallet/deposit/initialize` | Initialize deposit (Paystack) | ✅ |
| `GET`  | `/api/wallet/deposit/verify/:ref` | Verify deposit | ✅ |
| `GET`  | `/api/wallet/bank-account` | Get saved bank account | ✅ |
| `POST` | `/api/wallet/bank-account` | Add bank account | ✅ |
| `PUT`  | `/api/wallet/bank-account` | Update bank account | ✅ |
| `POST` | `/api/wallet/withdraw` | Withdraw — engineers only | ✅ |

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
| `GET`  | `/api/chats` | Get all chats (inbox) | ✅ |
| `GET`  | `/api/chats/:chatId/messages` | Get chat messages | ✅ |
| `PUT`  | `/api/chats/:chatId/read` | Mark messages as read | ✅ |

### Socket.IO Events
- `join_chat`: (chatId)
- `send_message`: ({ chatId, message, mediaType?, mediaUrl? })
- `receive_message`: (message)
- `typing` / `stop_typing`: ({ chatId })
- `user_typing` / `user_stopped_typing`: ({ chatId, userId })
- `user_online` / `user_offline`: ({ userId })

---

## Complaints — `Complaints`

| Method | Endpoint | Summary | Auth |
|--------|----------|---------|:---:|
| `POST` | `/api/complaints` | Submit complaint | ✅ |
| `GET`  | `/api/complaints` | Get own complaints | ✅ |
| `GET`  | `/api/complaints/:id` | Get complaint by ID | ✅ |

---

## Admin — Management

> All admin routes require `role: admin`.

- **Users:** `/api/admin/users` (GET, POST, GET :id, PUT :id, POST :id/ban)
- **Categories:** `/api/admin/categories` (GET, POST, GET :id, PUT :id, DELETE :id)
- **Services:** `/api/admin/services` (GET, POST, GET :id, PUT :id, DELETE :id)
- **Engineers:** `/api/admin/engineers` (GET, POST, GET :id, PUT :id, DELETE :id)
- **Engineer Verifications:** `/api/admin/engineer-verifications/pending` (GET), `/api/admin/engineer-verifications/:id/verify` (PUT)
- **Bookings:** `/api/admin/bookings` (GET, GET :id, PUT :id/status, PUT :id/engineers)
- **Complaints:** `/api/admin/complaints` (GET, PUT :id/respond)
