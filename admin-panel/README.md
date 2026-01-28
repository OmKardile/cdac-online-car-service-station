# Admin Panel - Car Service Station Management

A comprehensive Next.js-based admin dashboard for managing car service stations, services, bookings, staff, and admins.

## Features

### Admin (Service Station Manager)
- **Dashboard** - Real-time statistics (users, bookings, revenue)
- **Manage Services** - Create, Edit, Delete services with pricing
- **Manage Bookings** - View all bookings with status management (pending → confirmed → in_progress → completed → cancelled)
- **Manage Staff** - View users, assign roles, activate/deactivate staff

### Super Admin (Owner)
- **Dashboard** - System-wide analytics and statistics
- **Manage Admins** - View all users, assign/remove admin roles, filter by role
- **All Bookings** - View and manage bookings across all stations
- **Analytics** - Track revenue, user count, booking statistics

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Express.js (MySQL)
- **Authentication**: JWT tokens with role-based access control
- **Database**: MySQL

## Prerequisites

- Node.js (v18+)
- npm or yarn
- Running Backend Server (Express on localhost:5000)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (if needed)

The API base URL is configured in `src/utils/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

If your backend runs on a different port, update this URL.

---

## Backend Changes & Configuration

### Changes Made to Express Backend

The following modifications were made to enable frontend-backend integration:

#### **Change 1: Added CORS Middleware**

**File:** `Backend/Server/server.js`

**Description:** Enabled Cross-Origin Resource Sharing to allow frontend requests

**Before:**
```javascript
const express = require('express')
const app = express()

app.use(express.json())
app.use('/api', require('./routes'))

app.listen(5000, () => {
  console.log('Server running on port 5000')
})
```

**After:**
```javascript
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', require('./routes'))

app.listen(5000, () => {
  console.log('Server running on port 5000')
})
```

**Why This Was Necessary:**
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:5000`
- Browsers enforce Same-Origin Policy blocking cross-origin requests
- Without CORS, API calls fail with "Failed to fetch" error
- CORS middleware enables the backend to accept requests from different origins

#### **Change 2: Installed CORS Package**

**Command:**
```bash
cd Backend/Server
npm install cors
```

**Details:**
- **Package:** cors
- **Purpose:** Express middleware for handling Cross-Origin Resource Sharing
- **Status:** ✅ Successfully installed in Backend/Server/package.json

---

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
admin-panel/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/          # Admin dashboard with stats
│   │   │   ├── services/           # Service management
│   │   │   ├── bookings/           # Booking management
│   │   │   ├── staff/              # Staff management
│   │   │   └── layout.js           # Admin layout
│   │   ├── super-admin/
│   │   │   ├── dashboard/          # Super admin dashboard
│   │   │   ├── manage-admins/      # Admin role management
│   │   │   ├── bookings/           # All bookings across stations
│   │   │   └── layout.js           # Super admin layout
│   │   ├── login/
│   │   │   └── page.js             # Login page
│   │   ├── layout.js               # Root layout
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── AdminSidebar.js         # Admin navigation
│   │   ├── SuperAdminSidebar.js    # Super admin navigation
│   │   └── Topbar.js               # Top navigation with logout
│   └── utils/
│       ├── api.js                  # API client functions
│       └── useAuth.js              # Authentication hook
└── package.json
```

## Authentication

### Login Credentials

**Admin User:**
```
Email: admin@example.com
Password: password
```

**Super Admin User:**
```
Email: superadmin@example.com
Password: password
```

### How Authentication Works

1. User logs in with email and password
2. Backend validates credentials and returns JWT token
3. Token is stored in localStorage
4. Token is sent with every API request via Authorization header
5. User role is stored for route protection

## API Integration Guide

### Base API URL
```
http://localhost:5000/api
```

### API Endpoints Used

#### Authentication
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile

#### Admin Operations
- `GET /admin/statistics` - Dashboard statistics
- `GET /admin/users` - Get all users
- `GET /admin/bookings` - Get all bookings
- `POST /admin/services` - Create service
- `PUT /admin/services` - Update service
- `DELETE /admin/services` - Delete service
- `POST /admin/station-services` - Add service to station

#### User Management
- `GET /users` - Get all users
- `PUT /users/:id/role` - Update user role
- `PUT /users/:id/status` - Activate/Deactivate user

#### Booking Management
- `GET /bookings/:id` - Get booking details
- `PATCH /bookings/:id/status` - Update booking status

#### Services & Stations
- `GET /services` - Get all services
- `GET /services/:id` - Get service details
- `GET /services/station/:stationId` - Get station services
- `GET /stations` - Get all stations

---

## Cross-Checking Frontend & Backend Integration

### Step 1: Verify Backend is Running

Open terminal and check if the backend server is running:

```bash
# Backend should be running on port 5000
curl http://localhost:5000/api/admin/statistics
```

Expected Response (Success):
```json
{
  "status": "success",
  "data": {
    "users": 3,
    "bookings": 0,
    "revenue": 0
  }
}
```

### Step 2: Check CORS Configuration

The backend must have CORS enabled. Verify in `Backend/Server/server.js`:

```javascript
const cors = require('cors');
app.use(cors());
```

### Step 3: Test Login Endpoint in Postman

#### 1. **Test Login API**

**Method:** POST  
**URL:** `http://localhost:5000/api/auth/login`  
**Body (JSON):**
```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Expected Success Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "email": "admin@example.com",
    "role": "admin",
    "uid": 2
  }
}
```

**Expected Error Response (Invalid Email):**
```json
{
  "status": false,
  "message": "Invalid Email"
}
```

---

### Step 4: Test Protected Endpoints with Token

#### 2. **Test Admin Statistics**

**Method:** GET  
**URL:** `http://localhost:5000/api/admin/statistics`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
uid: 2
Content-Type: application/json
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "users": 3,
    "bookings": 0,
    "revenue": "0.00"
  }
}
```

#### 3. **Test Get All Users**

**Method:** GET  
**URL:** `http://localhost:5000/api/admin/users`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
uid: 2
Content-Type: application/json
```

**Expected Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Client",
      "email": "client@example.com",
      "role": "client"
    },
    {
      "id": 2,
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@example.com",
      "role": "admin"
    }
  ]
}
```

#### 4. **Test Get All Bookings**

**Method:** GET  
**URL:** `http://localhost:5000/api/admin/bookings`  
**Headers:**
```
Authorization: Bearer <your_jwt_token>
uid: 2
Content-Type: application/json
```

**Expected Response:**
```json
{
  "status": "success",
  "data": []
}
```

#### 5. **Test Get All Services**

**Method:** GET  
**URL:** `http://localhost:5000/api/services`  
**Headers:**
```
Content-Type: application/json
```

**Expected Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Oil Change",
      "description": "Complete oil and filter change with premium synthetic oil",
      "basePrice": "49.99",
      "estimatedDuration": 30,
      "isActive": 1,
      "createdAt": "2024-01-28T10:00:00.000Z",
      "updatedAt": "2024-01-28T10:00:00.000Z"
    }
  ]
}
```

---

### Step 5: Test Frontend Integration

#### 1. **Test Login in Frontend**

1. Open `http://localhost:3000`
2. You should be redirected to `/login` page
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `password`
4. Click "Login"

**Expected Behavior:**
- No "Failed to fetch" error
- Redirect to `/admin/dashboard` or `/super-admin/dashboard` based on role
- Token stored in localStorage

**Verify in Browser DevTools:**
```javascript
// Open Browser Console and check:
localStorage.getItem('token')      // Should show JWT token
localStorage.getItem('role')       // Should show 'admin' or 'superadmin'
localStorage.getItem('email')      // Should show email
```

#### 2. **Test Admin Dashboard**

1. After login, navigate to `/admin/dashboard`
2. Should display:
   - Total Users card
   - Total Bookings card
   - Total Revenue card
3. Check Network tab in DevTools:
   - Request to `http://localhost:5000/api/admin/statistics`
   - Status: 200
   - Response matches Postman test result

**Compare with Postman Response:**
- Frontend receives same data as Postman
- Revenue value formatted correctly (e.g., "$0.00")
- No "toFixed is not a function" errors

#### 3. **Test Services Management**

1. Click "Manage Services" in sidebar
2. Should load and display services table
3. Try to add a new service:
   - Click "Add Service"
   - Fill in form:
     ```
     Name: Test Service
     Description: Test Description
     Price: 99.99
     Duration: 45
     ```
   - Click "Create"
4. Check Network tab:
   - POST request to `/admin/services`
   - Status: 200
   - Service appears in table

**Compare with Postman:**
- Frontend response matches Postman POST response
- Service ID returned correctly
- Service list refreshes automatically

#### 4. **Test Bookings Update**

1. Click "Manage Bookings"
2. Select a booking status from dropdown
3. Change status (e.g., pending → confirmed)
4. Check Network tab:
   - PATCH request to `/bookings/{id}/status`
   - Status: 200
   - Table updates without page reload

**Compare with Postman:**
- Frontend handles response same as Postman
- Status updates correctly in database

#### 5. **Test Logout**

1. Click "Logout" button in top-right
2. Should clear localStorage
3. Should redirect to `/login`

**Verify logout cleared storage:**
```javascript
localStorage.getItem('token')  // Should return null
localStorage.getItem('role')   // Should return null
```

---

## API Response Cross-Check Checklist

Use this checklist to verify frontend and Postman match:

### ✅ Login Endpoint
- [ ] Postman: Returns token successfully
- [ ] Frontend: Token stored in localStorage
- [ ] Frontend: Redirects to dashboard
- [ ] Status: 200 OK

### ✅ Dashboard Statistics
- [ ] Postman: Returns users, bookings, revenue
- [ ] Frontend: Displays stats in cards
- [ ] Frontend: Revenue formatted as currency (e.g., "$0.00")
- [ ] Status: 200 OK

### ✅ Services List
- [ ] Postman: Returns all services with correct fields
- [ ] Frontend: Displays services in table
- [ ] Frontend: Can edit/delete services
- [ ] Status: 200 OK

### ✅ Bookings List
- [ ] Postman: Returns all bookings
- [ ] Frontend: Displays bookings in table
- [ ] Frontend: Status dropdown works
- [ ] Status: 200 OK

### ✅ Users List
- [ ] Postman: Returns all users
- [ ] Frontend: Displays users in staff table
- [ ] Frontend: Can change roles
- [ ] Status: 200 OK

---

## Troubleshooting

### Error: "Failed to fetch"
**Cause:** Backend not running or CORS not enabled  
**Solution:**
1. Ensure backend is running: `cd Backend/Server && node server.js`
2. Verify CORS middleware in server.js: `app.use(cors())`
3. Check API_BASE_URL in `src/utils/api.js` matches backend URL

### Error: "Invalid Email" / "Invalid Password"
**Cause:** Incorrect credentials  
**Solution:**
1. Verify you're using demo credentials from database
2. Check in Postman if credentials are valid
3. Check database `users` table

### Error: "toFixed is not a function"
**Cause:** Revenue data not properly converted to number  
**Solution:** Already fixed in updated dashboard code. Clear browser cache if persists.

### Error: "Cannot find module 'cors'"
**Cause:** cors package not installed in backend  
**Solution:**
```bash
cd Backend/Server
npm install cors
```

### CORS Error in Browser
**Message:** `Access to XMLHttpRequest blocked by CORS policy`  
**Cause:** Backend CORS not configured  
**Solution:** Add to `Backend/Server/server.js`:
```javascript
const cors = require('cors');
app.use(cors());
```

### Response Mismatch Between Postman and Frontend
**Cause:** API response format changed  
**Solution:**
1. Test same endpoint in Postman
2. Compare response JSON structure
3. Check if frontend is parsing response correctly
4. Verify response format in `src/utils/api.js`

---

## Browser DevTools Debugging

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Perform action (login, fetch data)
4. Check each request:
   - Status code should be 200
   - Response should match Postman test
   - Headers should include Authorization token (if required)

### Check localStorage
```javascript
// In Console tab
console.log(localStorage)
// Or check specific keys
console.log(localStorage.getItem('token'))
console.log(localStorage.getItem('role'))
console.log(localStorage.getItem('email'))
```

### Check Response Format
```javascript
// In Network tab, click on response and check:
// Should match Postman response exactly
{
  "status": "success",
  "data": { /* ... */ }
}
```

---

## Scripts

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Important Notes

1. **Default Backend URL**: `http://localhost:5000/api`
   - Change in `src/utils/api.js` if different
   
2. **Token Storage**: JWT tokens stored in localStorage (consider secure storage for production)

3. **Role-Based Access**: 
   - `admin` role → `/admin/dashboard`
   - `superadmin` role → `/super-admin/dashboard`

4. **Database Setup**: Ensure backend has initialized database with seed data:
   - Demo users created
   - Demo services created
   - Demo stations created

5. **API Response Format**: All responses should follow:
   ```json
   {
     "status": "success" or false,
     "data": { /* payload */ } or "message": "error"
   }
   ```

---

## Quick Start Guide

1. **Start Backend:**
   ```bash
   cd Backend/Server
   npm install
   node server.js
   ```

2. **Start Admin Panel:**
   ```bash
   npm install
   npm run dev
   ```

3. **Test in Postman:**
   - Test `/auth/login` endpoint
   - Verify response format
   - Copy token for protected endpoints

4. **Test in Frontend:**
   - Open http://localhost:3000
   - Login with credentials
   - Check DevTools Network tab
   - Compare responses with Postman

5. **Verify Integration:**
   - Dashboard loads with stats
   - Services can be created/edited/deleted
   - Bookings can be updated
   - Users/staff can be managed

---

## Support

For issues:
1. Check browser Console (F12 → Console)
2. Check Network tab for API failures
3. Compare Postman response with frontend response
4. Check backend logs in terminal
5. Verify CORS is enabled
6. See Troubleshooting section above

---

**Last Updated:** January 28, 2026  
**Version:** 1.0.0
