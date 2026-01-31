# API Testing Guide - Admin & Super Admin Panel

## Prerequisites

**Database:** `car_service_station_database`  
**Backend Server:** `http://localhost:5000`  
**Frontend:** `http://localhost:3000`

### Database Credentials
- **Host:** localhost
- **User:** w3-93109
- **Password:** omkarkar
- **Database:** car_service_station_database

---

## 🚀 QUICK START

### 1. Start Backend Server
```bash
cd Backend/Server
npm install
node server.js
```
Expected output: `Server running on port 5000`

### 2. Start Frontend
```bash
cd admin-panel
npm install
npm run dev
```
Expected output: `ready - started server on 0.0.0.0:3000`

---

## 📝 API TESTING CHECKLIST

### ✅ WORKING APIS (VERIFIED IN BACKEND)

#### 1. **Login API** ✅
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password"
}
```

**Expected Response:**
```json
{
  "status": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Save the token for subsequent requests**

---

#### 2. **Get Dashboard Statistics** ✅
```
GET http://localhost:5000/api/admin/statistics
```

**Expected Response:**
```json
{
  "status": true,
  "data": {
    "users": 15,
    "bookings": 42,
    "revenue": 2150.50
  }
}
```

---

#### 3. **Get All Services** ✅
```
GET http://localhost:5000/api/services
```

**Expected Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Oil Change",
      "description": "Regular engine oil change",
      "basePrice": 50.00,
      "estimatedDuration": 30,
      "isActive": 1
    }
  ]
}
```

---

#### 4. **Get All Stations** ✅
```
GET http://localhost:5000/api/stations
```

**Expected Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Downtown Service Station",
      "address": "123 Main Street",
      "phone": "555-1234",
      "email": "downtown@example.com",
      "operatingHours": "09:00-18:00",
      "isActive": 1
    }
  ]
}
```

---

#### 5. **Get Station Services** ✅
```
GET http://localhost:5000/api/services/station/1
```

**Expected Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Oil Change",
      "description": "Regular engine oil change",
      "basePrice": 50.00,
      "estimatedDuration": 30,
      "price": 55.00
    }
  ]
}
```

---

#### 6. **Get All Users (Staff/Admins)** ✅
```
GET http://localhost:5000/api/admin/users
```

**Expected Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    }
  ]
}
```

---

#### 7. **Get All Bookings** ✅
```
GET http://localhost:5000/api/admin/bookings
```

**Expected Response:**
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "userId": 5,
      "serviceId": 1,
      "stationId": 1,
      "scheduledDate": "2024-02-15T10:00:00",
      "totalPrice": 55.00,
      "status": "pending"
    }
  ]
}
```

---

### 🟡 APIS TO TEST (Create/Update/Delete)

#### 1. **Create Service** (Requires Auth)
```
POST http://localhost:5000/api/admin/services
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Wheel Alignment",
  "description": "4-wheel alignment service",
  "basePrice": 80.00,
  "estimatedDuration": 45
}
```

---

#### 2. **Update Service** (Requires Auth)
```
PUT http://localhost:5000/api/admin/services
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "id": 1,
  "name": "Oil Change Premium",
  "description": "Premium oil change service",
  "basePrice": 65.00,
  "estimatedDuration": 35
}
```

**Current Backend Issue:** Only updates `basePrice`, not full details

---

#### 3. **Delete Service** (Requires Auth)
```
DELETE http://localhost:5000/api/admin/services
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "id": 1
}
```

---

#### 4. **Update Booking Status** (Requires Auth)
```
PATCH http://localhost:5000/api/bookings/1/status
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "status": "confirmed"
}
```

**Valid Statuses:** pending, confirmed, in_progress, completed, cancelled

---

#### 5. **Update User Role** (Requires Auth)
```
PUT http://localhost:5000/api/users/2/role
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "role": "admin"
}
```

**Valid Roles:** client, admin, superadmin

---

#### 6. **Update User Status** (Activate/Deactivate) (Requires Auth)
```
PUT http://localhost:5000/api/users/2/status
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "isActive": false
}
```

---

## 🧪 FRONTEND TEST SCENARIOS

### Test 1: Complete Admin Login & Dashboard Flow
1. Navigate to `http://localhost:3000/login`
2. Enter credentials: `admin@example.com` / `password`
3. Should redirect to `/admin/dashboard`
4. Dashboard should show: Users count, Bookings count, Revenue
5. **Expected Status:** ✅ WORKING

---

### Test 2: Admin - Manage Services
1. Click "Manage Services" in sidebar
2. Should fetch and display list of services
3. Click "Add Service" and create a new service
4. Should see it added to the table
5. Edit a service - should update
6. Delete a service - should remove
7. **Expected Status:** ⚠️ TEST REQUIRED

---

### Test 3: Admin - Manage Bookings
1. Click "Manage Bookings" in sidebar
2. Should display all bookings in a table
3. Change booking status using dropdown
4. Status should update in the table
5. **Expected Status:** ⚠️ TEST REQUIRED

---

### Test 4: Admin - Manage Staff
1. Click "Manage Staff" in sidebar
2. Should display all users with roles and status
3. Change a user's role to "admin"
4. Should update in the table
5. Deactivate a user - user becomes inactive
6. Activate a user - user becomes active
7. **Expected Status:** ⚠️ TEST REQUIRED

---

### Test 5: Super Admin - Dashboard
1. Login as super admin
2. Navigate to super admin dashboard
3. Should show same statistics as admin
4. **Expected Status:** ⚠️ TEST REQUIRED

---

### Test 6: Super Admin - Manage Admins
1. Click "Manage Admins" in sidebar
2. Should display all users
3. Filter by role (all, client, admin, superadmin)
4. Change user roles
5. **Expected Status:** ⚠️ TEST REQUIRED

---

### Test 7: Super Admin - All Bookings
1. Click "All Bookings" in sidebar
2. Should display all bookings
3. Update booking status
4. Should match Admin bookings page functionality
5. **Expected Status:** ⚠️ TEST REQUIRED

---

### Test 8: Logout Functionality
1. Click "Logout" button in top-right
2. Should clear localStorage
3. Should redirect to `/login`
4. **Expected Status:** ✅ WORKING

---

## 🔧 TESTING WITH POSTMAN

### Setup Postman Collection

1. **Create Environment Variables:**
   - `base_url` = `http://localhost:5000/api`
   - `token` = (will be set after login)

2. **Test Login Request:**
   ```
   POST {{base_url}}/auth/login
   Body: 
   {
     "email": "admin@example.com",
     "password": "password"
   }
   ```
   
   **In Tests tab, add:**
   ```javascript
   if (pm.response.code === 200) {
     var jsonData = pm.response.json();
     pm.environment.set("token", jsonData.data.token);
   }
   ```

3. **Use Token in Other Requests:**
   - Header: `Authorization: Bearer {{token}}`

---

## 🚨 KNOWN ISSUES & FIXES NEEDED

### Issue 1: GET /api/services in Services Page
**Status:** ✅ ACTUALLY WORKING (Route exists)
**What was wrong:** Initial analysis missed the route
**Fix:** No fix needed - API exists and works

---

### Issue 2: Modify Service Price Page
**Status:** ⚠️ NOT FUNCTIONAL
**Problem:** Uses hardcoded data, not connected to APIs
**Frontend File:** [modify-service-price/page.js](admin-panel/src/app/admin/modify-service-price/page.js)
**Recommendation:** Either remove this page or implement it properly

---

### Issue 3: Update Service Backend
**Status:** ⚠️ PARTIAL IMPLEMENTATION
**Problem:** Backend only updates `basePrice`, not other fields
**Current Code:** Only handles `basePrice` update
**Frontend Sends:** Full service object with name, description, etc.
**Fix Needed:** Update adminController.js `updateService` to handle all fields

**Current Backend (Line ~55 in adminController.js):**
```javascript
exports.updateService = (req, res) => {
  const { id, basePrice } = req.body
  // Only updates basePrice
}
```

**Should be:**
```javascript
exports.updateService = (req, res) => {
  const { id, name, description, basePrice, estimatedDuration } = req.body
  const sql = `
    UPDATE services 
    SET name=?, description=?, basePrice=?, estimatedDuration=?
    WHERE id=?
  `
  // Update all fields
}
```

---

### Issue 4: Missing Auth Middleware on GET Endpoints
**Status:** ⚠️ SECURITY ISSUE
**Problem:** GET endpoints for admin data don't require authentication
**Examples:** 
- `GET /api/admin/statistics`
- `GET /api/admin/users`
- `GET /api/admin/bookings`

**Recommendation:** Add `authenticate` middleware to these routes

---

## 📊 TEST EXECUTION RESULTS TEMPLATE

Fill this in as you test each API:

```
API: [NAME]
Endpoint: [URL]
Method: [POST/GET/PUT/DELETE/PATCH]
Auth Required: [YES/NO]

Test Date: [DATE]
Status: [✅ WORKING / ⚠️ PARTIAL / ❌ BROKEN]
Response Code: [200/400/401/500]

Expected Response: [OK/FAILED]
Actual Response: [PASTE RESPONSE]

Issues Found:
- [ISSUE 1]
- [ISSUE 2]

Fix Applied: [YES/NO]
Fix Description: [DESCRIPTION]
```

---

## 🎯 NEXT STEPS

1. **Run Backend** - Ensure MySQL is running and server starts
2. **Test Login API** - Verify authentication works
3. **Test Each Page** - Go through test scenarios above
4. **Document Issues** - Note what works and what doesn't
5. **Apply Fixes** - Fix any broken APIs
6. **Retest Everything** - Ensure all fixes work

---

## 📞 DEBUGGING TIPS

### Common Errors:

**"Cannot GET /api/services"**
- Route doesn't exist (Check if all routes are properly exported)
- Server not running
- Incorrect endpoint URL

**"Invalid token"**
- Token not passed in Authorization header
- Token has expired
- Secret key mismatch

**"Database connection failed"**
- MySQL not running
- Credentials in db.js are wrong
- Database doesn't exist

**"No token provided"**
- Missing Authorization header on protected endpoints
- Token wasn't saved from login response

### Browser Console Debugging:
1. Open DevTools (F12)
2. Go to Network tab
3. Watch API requests/responses
4. Check localStorage for token storage

### Backend Console Debugging:
1. Add console.logs in middleware/controllers
2. Check for SQL errors
3. Verify JWT verification is working

---
