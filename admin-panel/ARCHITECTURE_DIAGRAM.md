# Admin & Super Admin Panel - Architecture & API Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js/React)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Login Page ──────────────────────┐                              │
│                                  │                              │
│  ┌──────────────────────────────┐ │                              │
│  │   Admin Dashboard            │ │                              │
│  │  ├─ Dashboard                │ │                              │
│  │  ├─ Manage Services          │ │                              │
│  │  ├─ Manage Bookings          │ │                              │
│  │  ├─ Manage Staff             │ │                              │
│  │  └─ Modify Service Price     │ │                              │
│  └──────────────────────────────┘ │                              │
│                                    │                              │
│  ┌──────────────────────────────┐ │                              │
│  │  Super Admin Dashboard       │ │                              │
│  │  ├─ Dashboard                │ │                              │
│  │  ├─ Manage Admins            │ │                              │
│  │  └─ All Bookings             │ │                              │
│  └──────────────────────────────┘ │                              │
│                                    │                              │
│  API Layer (api.js) ──────────────┘                              │
│  - Handles authentication                                        │
│  - Manages API calls                                             │
│  - Token management                                              │
│                                                                   │
└──────────────────┬──────────────────────────────────────────────┘
                   │ HTTP/HTTPS
                   │ (Token + UID headers)
┌──────────────────▼──────────────────────────────────────────────┐
│              BACKEND API (Express.js/Node.js)                    │
│                    PORT: 5000                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Routes:                          Controllers:                   │
│  ├─ /auth                         ├─ authController             │
│  │  ├─ POST /login               │  ├─ Login                   │
│  │  ├─ POST /register            │  ├─ Register                │
│  │  ├─ GET /profile              │  └─ Profile                 │
│  │  └─ PUT /profile              │                              │
│  │                                │                              │
│  ├─ /admin                         ├─ adminController           │
│  │  ├─ GET /statistics           │  ├─ getStatistics           │
│  │  ├─ GET /users                │  ├─ getUsers                │
│  │  ├─ GET /bookings             │  ├─ getBookings             │
│  │  ├─ POST /services            │  ├─ createService           │
│  │  ├─ PUT /services             │  ├─ updateService           │
│  │  ├─ DELETE /services          │  ├─ deleteService           │
│  │  ├─ POST /stations            │  ├─ createStation           │
│  │  └─ POST /station-services    │  └─ addServiceToStation     │
│  │                                │                              │
│  ├─ /services                      ├─ serviceController        │
│  │  ├─ GET /                     │  ├─ getAll                  │
│  │  ├─ GET /:id                  │  ├─ getById                 │
│  │  └─ GET /station/:id          │  └─ getByStation            │
│  │                                │                              │
│  ├─ /stations                      ├─ stationController        │
│  │  ├─ GET /                     │  ├─ getAll                  │
│  │  └─ GET /:id                  │  └─ getById                 │
│  │                                │                              │
│  ├─ /bookings                      ├─ bookingController        │
│  │  ├─ POST /                    │  ├─ createBooking           │
│  │  ├─ GET /                     │  ├─ getUserBookings         │
│  │  ├─ GET /:id                  │  ├─ getBookingDetails       │
│  │  └─ PATCH /:id/status         │  └─ updateStatus            │
│  │                                │                              │
│  ├─ /users                         ├─ userController           │
│  │  ├─ GET /                     │  ├─ getAll                  │
│  │  ├─ GET /:id                  │  ├─ getById                 │
│  │  ├─ PUT /:id/role             │  ├─ updateRole              │
│  │  └─ PUT /:id/status           │  └─ updateStatus            │
│  │                                │                              │
│  Middleware:                                                     │
│  ├─ auth.js (authenticate, isAdmin)                             │
│  └─ role.js (allowRoles)                                        │
│                                                                   │
└──────────────────┬──────────────────────────────────────────────┘
                   │ MySQL Query
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│                  DATABASE (MySQL)                                │
│         car_service_station_database                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Tables:                                                         │
│  ├─ users (id, firstName, lastName, email, password,            │
│  │         phone, role, isActive, createdAt)                    │
│  │                                                               │
│  ├─ services (id, name, description, basePrice,                 │
│  │           estimatedDuration, isActive, createdAt)            │
│  │                                                               │
│  ├─ stations (id, name, address, phone, email,                  │
│  │           operatingHours, isActive, createdAt)               │
│  │                                                               │
│  ├─ station_service_prices (id, stationId, serviceId,           │
│  │                         price, createdAt)                    │
│  │                                                               │
│  └─ bookings (id, userId, serviceId, stationId,                 │
│              scheduledDate, vehicleDetails, totalPrice,         │
│              status, createdAt)                                 │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Admin Panel Flow Diagram

### Admin User Journey

```
1. AUTHENTICATION FLOW
   ┌─────────┐
   │  Login  │
   └────┬────┘
        │ POST /api/auth/login (email, password)
        ▼
   ┌────────────────────┐
   │ Backend Validates  │
   │ - Email exists?    │
   │ - Password correct?│
   │ - User active?     │
   └────┬───────────────┘
        │ ✅ Valid
        ▼
   ┌────────────────────┐
   │ JWT Token Created  │
   │ + UID + Role       │
   └────┬───────────────┘
        │
        ▼
   ┌────────────────────────────┐
   │ Store in localStorage      │
   │ - token                    │
   │ - role (admin/superadmin)  │
   │ - email                    │
   │ - uid (optional)           │
   └────┬───────────────────────┘
        │
        ▼
   ┌──────────────────┐
   │ Redirect to      │
   │ Admin Dashboard  │
   └──────────────────┘

2. DASHBOARD VIEW
   ┌──────────────────┐
   │ Load Statistics  │
   │ GET /admin/statistics
   └────┬─────────────┘
        │ Fetch Users, Bookings, Revenue
        ▼
   ┌──────────────────────┐
   │ Display Cards:       │
   │ - Total Users        │
   │ - Total Bookings     │
   │ - Total Revenue      │
   └──────────────────────┘

3. MANAGE SERVICES
   ┌──────────────────┐
   │ View Services    │
   │ GET /api/services
   └────┬─────────────┘
        │
        ▼
   ┌─────────────────────┐
   │ Display Services in │
   │ Table with Actions  │
   └────┬────────────────┘
        │
        ├─ Add Service  → POST /api/admin/services
        ├─ Edit Service → PUT /api/admin/services
        └─ Delete       → DELETE /api/admin/services

4. MANAGE BOOKINGS
   ┌──────────────────┐
   │ View Bookings    │
   │ GET /admin/bookings
   └────┬─────────────┘
        │
        ▼
   ┌────────────────────┐
   │ Display Bookings   │
   │ with Status Select │
   └────┬───────────────┘
        │
        └─ Change Status → PATCH /bookings/:id/status

5. MANAGE STAFF
   ┌──────────────────┐
   │ View All Users   │
   │ GET /admin/users
   └────┬─────────────┘
        │
        ▼
   ┌────────────────────┐
   │ Display Users with │
   │ Role & Status      │
   └────┬───────────────┘
        │
        ├─ Change Role   → PUT /api/users/:id/role
        └─ Toggle Status → PUT /api/users/:id/status
```

---

## Super Admin Panel Flow Diagram

### Super Admin User Journey

```
Same as Admin with these differences:

1. Login as Super Admin
   - Same flow, but role = "superadmin"
   - Redirect to /super-admin/dashboard instead of /admin/dashboard

2. Dashboard
   - Same statistics display
   - Same API: GET /api/admin/statistics

3. Manage Admins (UNIQUE TO SUPER ADMIN)
   ┌──────────────────┐
   │ View All Users   │
   │ GET /admin/users
   └────┬─────────────┘
        │
        ▼
   ┌────────────────────┐
   │ Filter by Role:    │
   │ - All              │
   │ - Client           │
   │ - Admin            │
   │ - SuperAdmin       │
   └────┬───────────────┘
        │
        └─ Change Role → PUT /api/users/:id/role
           Can change any user to admin/superadmin

4. All Bookings (SAME AS ADMIN)
   ┌──────────────────┐
   │ View All Bookings│
   │ GET /admin/bookings
   └────┬─────────────┘
        │
        └─ Change Status → PATCH /bookings/:id/status
```

---

## Data Flow Example: Create Service

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                             │
│  Admin fills form (name, description, price, duration)          │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                  FRONTEND (React/Next.js)                       │
│                                                                  │
│  Page: admin/services/page.js                                  │
│  - handleSubmit() triggered                                    │
│  - Call createService(formData)                                │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼ POST /api/admin/services
         │ Headers: {
         │   Authorization: Bearer TOKEN,
         │   uid: USER_ID,
         │   Content-Type: application/json
         │ }
         │ Body: {
         │   name, description, basePrice, estimatedDuration
         │ }
         │
┌────────▼────────────────────────────────────────────────────────┐
│                   BACKEND (Express/Node)                        │
│                                                                  │
│  Route: POST /admin/services                                   │
│  Middleware: authenticate, allowRoles(['admin'])               │
│  Controller: adminController.createService()                   │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│               SQL QUERY & DATABASE                              │
│                                                                  │
│  INSERT INTO services                                          │
│  (name, description, basePrice, estimatedDuration)            │
│  VALUES (?, ?, ?, ?)                                          │
│                                                                  │
│  Database: car_service_station_database                       │
│  Table: services                                               │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼ ✅ Success / ❌ Error
         │
┌────────▼────────────────────────────────────────────────────────┐
│                   RESPONSE BACK                                 │
│                                                                  │
│  {                                                             │
│    "status": true/false,                                      │
│    "data": { insertId: 5 } | error message                    │
│  }                                                             │
└────────┬────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│              FRONTEND UPDATES                                   │
│                                                                  │
│  if (result.status) {                                          │
│    - Clear form                                                │
│    - Refresh services list                                     │
│    - Show success message                                      │
│  } else {                                                       │
│    - Show error message                                        │
│  }                                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Call Summary Table

| Feature | Page | API Calls | Methods |
|---------|------|-----------|---------|
| **Dashboard** | `/admin/dashboard` | `getAdminStatistics()` | GET |
| **Services** | `/admin/services` | `getServices()`, `createService()`, `updateService()`, `deleteService()` | GET, POST, PUT, DELETE |
| **Bookings** | `/admin/bookings` | `getAllBookings()`, `updateBookingStatus()` | GET, PATCH |
| **Staff** | `/admin/staff` | `getAllUsers()`, `updateUserRole()`, `updateUserStatus()` | GET, PUT |
| **Super Admin Dashboard** | `/super-admin/dashboard` | `getAdminStatistics()` | GET |
| **Manage Admins** | `/super-admin/manage-admins` | `getAllUsers()`, `updateUserRole()` | GET, PUT |
| **Super Admin Bookings** | `/super-admin/bookings` | `getAllBookings()`, `updateBookingStatus()` | GET, PATCH |

---

## Authentication Flow Details

```
1. LOGIN REQUEST
   POST /api/auth/login
   Body: { email, password }
   
2. BACKEND PROCESSES
   ├─ Query: SELECT * FROM users WHERE email=? AND isActive=1
   ├─ Check: Email exists
   ├─ Check: bcrypt.compare(password, hashedPassword)
   ├─ Generate: JWT with payload { uid, role }
   └─ Return: token, email, role

3. FRONTEND STORES
   ├─ localStorage.token = JWT_TOKEN
   ├─ localStorage.role = "admin" | "superadmin"
   ├─ localStorage.email = user@example.com
   └─ localStorage.uid = user_id

4. SUBSEQUENT REQUESTS
   Each API call includes:
   ├─ Authorization: Bearer TOKEN (in headers)
   ├─ uid: USER_ID (in headers)
   └─ Content-Type: application/json

5. BACKEND VALIDATES
   Every request:
   ├─ Extracts token from Authorization header
   ├─ Verifies JWT using config.SECRET
   ├─ Decodes to get uid and role
   ├─ Sets req.headers.uid and req.headers.role
   └─ Proceeds to controller if valid, else returns error
```

---

## Current Status Matrix

| Component | Status | Notes |
|-----------|--------|-------|
| **Login/Auth** | ✅ Working | Complete implementation |
| **Dashboard** | ✅ Working | Shows correct statistics |
| **Services List** | ✅ Working | API exists and works |
| **Create Service** | ✅ Working | Full implementation |
| **Update Service** | ⚠️ Partial | Only updates basePrice, not full details |
| **Delete Service** | ✅ Working | Full implementation |
| **Bookings List** | ✅ Working | Full implementation |
| **Update Status** | ✅ Working | Full implementation |
| **Staff List** | ✅ Working | Full implementation |
| **Change Role** | ✅ Working | Full implementation |
| **Toggle Status** | ✅ Working | Full implementation |
| **Super Admin Roles** | ✅ Working | Same APIs, different access |
| **Modify Service Price** | ❌ Not Working | Hardcoded data, no APIs |

---
