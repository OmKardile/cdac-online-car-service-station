# Admin & Super Admin API Analysis

## Overview
This document outlines all API calls made by both Admin and Super Admin panels, categorized by functionality.

---

## 🔐 AUTHENTICATION APIs

### 1. Login API
**Endpoint:** `POST /api/auth/login`
**Frontend:** [Login Page](admin-panel/src/app/login/page.js)
**Function:** `loginUser(email, password)`
**Status:** ✅ IMPLEMENTED

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response Expected:**
```json
{
  "status": true,
  "data": {
    "token": "JWT_TOKEN",
    "email": "user@example.com",
    "role": "admin|superadmin",
    "uid": "user_id"
  }
}
```

**Backend Route:** [auth.js](Backend/Server/routes/auth.js)
**Backend Controller:** [authController.js](Backend/Server/controllers/authController.js)

---

### 2. Get Profile API
**Endpoint:** `GET /api/auth/profile`
**Frontend:** Not currently used
**Function:** `getProfile()`
**Status:** ✅ IMPLEMENTED

**Response Expected:**
```json
{
  "status": true,
  "data": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  }
}
```

---

## 📊 DASHBOARD APIs

### 1. Get Admin Statistics
**Endpoint:** `GET /api/admin/statistics`
**Used By:** 
- [Admin Dashboard](admin-panel/src/app/admin/dashboard/page.js)
- [Super Admin Dashboard](admin-panel/src/app/super-admin/dashboard/page.js)
**Function:** `getAdminStatistics()`
**Status:** ✅ IMPLEMENTED

**Response Expected:**
```json
{
  "status": true,
  "data": {
    "users": 25,
    "bookings": 150,
    "revenue": 5000.50
  }
}
```

**Backend Route:** [admin.js](Backend/Server/routes/admin.js)

---

## 📋 SERVICES MANAGEMENT (Admin Only)

### 1. Get All Services
**Endpoint:** `GET /api/services`
**Used By:** [Admin Services Page](admin-panel/src/app/admin/services/page.js)
**Function:** `getServices()`
**Status:** ⚠️ NEEDS IMPLEMENTATION

**Response Expected:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Oil Change",
      "description": "Regular oil change",
      "basePrice": 50.00,
      "estimatedDuration": 30
    }
  ]
}
```

**Note:** Backend route not found in services.js

---

### 2. Create Service
**Endpoint:** `POST /api/admin/services`
**Used By:** [Admin Services Page](admin-panel/src/app/admin/services/page.js)
**Function:** `createService(serviceData)`
**Status:** ✅ IMPLEMENTED

**Request:**
```json
{
  "name": "string",
  "description": "string",
  "basePrice": 100.00,
  "estimatedDuration": 45
}
```

**Backend Route:** [admin.js](Backend/Server/routes/admin.js)

---

### 3. Update Service
**Endpoint:** `PUT /api/admin/services`
**Used By:** [Admin Services Page](admin-panel/src/app/admin/services/page.js)
**Function:** `updateService(serviceData)`
**Status:** ✅ IMPLEMENTED

**Request:**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "basePrice": 100.00,
  "estimatedDuration": 45
}
```

**Backend Route:** [admin.js](Backend/Server/routes/admin.js)

---

### 4. Delete Service
**Endpoint:** `DELETE /api/admin/services`
**Used By:** [Admin Services Page](admin-panel/src/app/admin/services/page.js)
**Function:** `deleteService(serviceId)`
**Status:** ✅ IMPLEMENTED

**Request:**
```json
{
  "id": 1
}
```

**Backend Route:** [admin.js](Backend/Server/routes/admin.js)

---

## 🏥 STATIONS MANAGEMENT (Admin Only)

### 1. Get All Stations
**Endpoint:** `GET /api/stations`
**Used By:** Not currently used in UI
**Function:** `getStations()`
**Status:** ⚠️ NEEDS IMPLEMENTATION

**Response Expected:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Downtown Station",
      "address": "123 Main St",
      "phone": "555-1234",
      "email": "station@example.com",
      "operatingHours": "09:00-18:00"
    }
  ]
}
```

**Note:** Backend route not found

---

### 2. Create Station
**Endpoint:** `POST /api/admin/stations`
**Used By:** Not currently used in UI
**Function:** `createStation(stationData)`
**Status:** ✅ IMPLEMENTED

**Request:**
```json
{
  "name": "string",
  "address": "string",
  "phone": "string",
  "email": "string",
  "operatingHours": "string"
}
```

---

### 3. Add Service to Station
**Endpoint:** `POST /api/admin/station-services`
**Used By:** Not currently used in UI
**Function:** `addServiceToStation(stationServiceData)`
**Status:** ✅ IMPLEMENTED

**Request:**
```json
{
  "stationId": 1,
  "serviceId": 1,
  "price": 50.00
}
```

---

### 4. Get Station Services
**Endpoint:** `GET /api/services/station/:stationId`
**Used By:** Not currently used in UI
**Function:** `getStationServices(stationId)`
**Status:** ⚠️ NEEDS IMPLEMENTATION

**Response Expected:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "serviceId": 1,
      "stationId": 1,
      "price": 50.00
    }
  ]
}
```

---

## 📅 BOOKINGS MANAGEMENT (Admin & Super Admin)

### 1. Get All Bookings
**Endpoint:** `GET /api/admin/bookings`
**Used By:** 
- [Admin Bookings Page](admin-panel/src/app/admin/bookings/page.js)
- [Super Admin Bookings Page](admin-panel/src/app/super-admin/bookings/page.js)
**Function:** `getAllBookings()`
**Status:** ✅ IMPLEMENTED

**Response Expected:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "userId": 5,
      "serviceId": 1,
      "stationId": 1,
      "scheduledDate": "2024-02-15",
      "totalPrice": 50.00,
      "status": "pending"
    }
  ]
}
```

---

### 2. Get Booking Details
**Endpoint:** `GET /api/bookings/:bookingId`
**Used By:** Not currently used
**Function:** `getBookingDetails(bookingId)`
**Status:** ✅ IMPLEMENTED

**Response Expected:**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "userId": 5,
    "serviceId": 1,
    "stationId": 1,
    "scheduledDate": "2024-02-15",
    "vehicleDetails": "{...}",
    "totalPrice": 50.00,
    "status": "pending"
  }
}
```

---

### 3. Update Booking Status
**Endpoint:** `PATCH /api/bookings/:bookingId/status`
**Used By:** 
- [Admin Bookings Page](admin-panel/src/app/admin/bookings/page.js)
- [Super Admin Bookings Page](admin-panel/src/app/super-admin/bookings/page.js)
**Function:** `updateBookingStatus(bookingId, status)`
**Status:** ✅ IMPLEMENTED

**Request:**
```json
{
  "status": "pending|confirmed|in_progress|completed|cancelled"
}
```

---

## 👥 USER & STAFF MANAGEMENT

### 1. Get All Users
**Endpoint:** `GET /api/admin/users`
**Used By:** 
- [Admin Staff Page](admin-panel/src/app/admin/staff/page.js)
- [Super Admin Manage Admins](admin-panel/src/app/super-admin/manage-admins/page.js)
**Function:** `getAllUsers()`
**Status:** ✅ IMPLEMENTED

**Response Expected:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "role": "admin",
      "isActive": true
    }
  ]
}
```

---

### 2. Get User by ID
**Endpoint:** `GET /api/users/:userId`
**Used By:** Not currently used
**Function:** `getUserById(userId)`
**Status:** ✅ IMPLEMENTED

---

### 3. Update User Role
**Endpoint:** `PUT /api/users/:userId/role`
**Used By:** 
- [Admin Staff Page](admin-panel/src/app/admin/staff/page.js)
- [Super Admin Manage Admins](admin-panel/src/app/super-admin/manage-admins/page.js)
**Function:** `updateUserRole(userId, role)`
**Status:** ✅ IMPLEMENTED

**Request:**
```json
{
  "role": "client|admin|superadmin"
}
```

---

### 4. Update User Status (Activate/Deactivate)
**Endpoint:** `PUT /api/users/:userId/status`
**Used By:** [Admin Staff Page](admin-panel/src/app/admin/staff/page.js)
**Function:** `updateUserStatus(userId, isActive)`
**Status:** ✅ IMPLEMENTED

**Request:**
```json
{
  "isActive": true|false
}
```

---

## 📄 UNUSED PAGES

### Modify Service Price
**File:** [modify-service-price/page.js](admin-panel/src/app/admin/modify-service-price/page.js)
**Status:** ⚠️ NOT CONNECTED TO APIs
**Issue:** Uses hardcoded data instead of API calls

**Currently Used APIs:** None (hardcoded array)
**Should Use:** `getServices()`, `updateService()`, or a dedicated price update endpoint

---

## API ENDPOINT SUMMARY

| Endpoint | Method | Status | Used By | Issues |
|----------|--------|--------|---------|--------|
| `/auth/login` | POST | ✅ | Login | None |
| `/auth/profile` | GET | ✅ | (None) | Not used |
| `/admin/statistics` | GET | ✅ | Dashboard | None |
| `/admin/users` | GET | ✅ | Staff/Admins | None |
| `/admin/bookings` | GET | ✅ | Bookings | None |
| `/admin/services` | POST | ✅ | Services | None |
| `/admin/services` | PUT | ✅ | Services | None |
| `/admin/services` | DELETE | ✅ | Services | None |
| `/admin/stations` | POST | ✅ | (None) | Not implemented in UI |
| `/admin/station-services` | POST | ✅ | (None) | Not implemented in UI |
| `/services` | GET | ❌ | Services | **MISSING** |
| `/services/station/:id` | GET | ❌ | (None) | Missing backend route |
| `/stations` | GET | ❌ | (None) | Missing backend route |
| `/bookings/:id` | GET | ✅ | (None) | Not used in UI |
| `/bookings/:id/status` | PATCH | ✅ | Bookings | None |
| `/users/:id` | GET | ✅ | (None) | Not used |
| `/users/:id/role` | PUT | ✅ | Staff/Admins | None |
| `/users/:id/status` | PUT | ✅ | Staff | None |

---

## 🔴 CRITICAL ISSUES

1. **GET /api/services** - Missing backend route
   - Frontend calls this but backend has no route
   - Services page will fail to load

2. **Modify Service Price page** - Hardcoded data
   - Not connected to any API
   - Changes won't be saved
   - Should either be removed or implemented

3. **Missing GET /api/stations** - Backend route doesn't exist
   - Function exists in API layer but route is missing

4. **Missing GET /api/services/station/:id** - Backend route doesn't exist
   - No endpoint to get services for a specific station

---

## 🟡 RECOMMENDED ACTIONS

1. Create `GET /api/services` route in backend
2. Create `GET /api/stations` route in backend
3. Create `GET /api/services/station/:id` route in backend
4. Either remove or implement "Modify Service Price" page
5. Add error handling and validation to all API calls
6. Add loading states and error messages to all pages

---
