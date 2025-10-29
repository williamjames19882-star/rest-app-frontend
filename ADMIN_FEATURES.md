# Admin Features - Frontend Implementation

## Overview

The frontend now supports role-based authentication with admin privileges.

## What Was Updated

### 1. AuthContext (`src/context/AuthContext.jsx`)
- ✅ Added `role` state management
- ✅ Added `isAdmin` computed property
- ✅ Updated `login()` to accept role
- ✅ Role persists in localStorage

### 2. Login & Signup Pages
- ✅ Updated to pass role to login function
- ✅ Role is now stored and used for authorization

### 3. API Service (`src/api/api.js`)
- ✅ Added `adminAPI` with all admin endpoints:
  - `getAllUsers()` - Get all users
  - `getAllReservations()` - Get all reservations
  - `getStats()` - Get dashboard statistics
  - `createMenuItem()` - Create menu item (with file upload)
  - `updateMenuItem()` - Update menu item (with file upload)
  - `deleteMenuItem()` - Delete menu item
  - `updateReservationStatus()` - Update reservation status

### 4. Navbar (`src/components/Navbar.jsx`)
- ✅ Shows "Admin" link for admin users
- ✅ Admin link appears in yellow (bg-yellow-600)
- ✅ Only visible to authenticated admin users

### 5. App.jsx - Routing
- ✅ Added `AdminRoute` component (checks token + admin role)
- ✅ Added `/admin` route for dashboard
- ✅ Admin routes redirect to login if not authenticated
- ✅ Admin routes redirect to home if not admin

### 6. AdminDashboard Page (`src/pages/AdminDashboard.jsx`)
- ✅ Dashboard with statistics cards:
  - Total Users
  - Total Reservations
  - Menu Items
  - Estimated Revenue
- ✅ Quick action buttons:
  - View All Reservations
  - Manage Menu
  - View Users
- ✅ Access control (redirects non-admin users)

## How It Works

### Login Flow

1. User logs in
2. Backend returns JWT with role
3. Frontend stores token + role in localStorage
4. AuthContext updates with role and isAdmin status

### Navigation

- **Regular User**: Sees Home, Menu, Book Table, My Reservations
- **Admin User**: Sees all regular links + "Admin" link

### Admin Access

When admin clicks "Admin" link:
1. `AdminRoute` checks if user is authenticated
2. Checks if user is admin
3. Redirects to login if not authenticated
4. Redirects to home if authenticated but not admin
5. Shows dashboard if authenticated admin

## Usage Examples

### Check if User is Admin

```javascript
const { isAdmin, role } = useAuth();

if (isAdmin) {
  // Show admin features
  console.log('User is admin with role:', role);
}
```

### Making Admin API Calls

```javascript
import { adminAPI } from '../api/api';

// Get all users
const users = await adminAPI.getAllUsers();

// Get statistics
const stats = await adminAPI.getStats();

// Create menu item with image
const formData = new FormData();
formData.append('name', 'New Pizza');
formData.append('price', '15.99');
formData.append('category', 'Pizza');
formData.append('image', fileInput.files[0]);

await adminAPI.createMenuItem(formData);
```

## Next Steps (Optional Enhancements)

### Future Pages to Create:

1. **Admin Reservations Page** (`/admin/reservations`)
   - Show all reservations
   - Filter by date/status
   - Update status

2. **Admin Menu Management** (`/admin/menu`)
   - Create/edit/delete menu items
   - Upload images via Cloudinary
   - Manage categories

3. **Admin Users Page** (`/admin/users`)
   - View all users
   - Edit user roles
   - View user activity

## Testing

1. Login as regular user - Admin link should NOT appear
2. Login as admin - Admin link should appear in yellow
3. Click Admin link - Should see dashboard
4. Logout and try to access /admin directly - Should redirect to login

## Security Notes

⚠️ **Important**:
- Admin checks are done server-side (backend)
- Frontend checks are for UX only
- All admin API endpoints verify JWT token + role
- Never trust client-side role checks

## Files Modified

- ✅ `src/context/AuthContext.jsx` - Added role management
- ✅ `src/pages/Login.jsx` - Store role on login
- ✅ `src/pages/Signup.jsx` - Store role on signup
- ✅ `src/api/api.js` - Added adminAPI endpoints
- ✅ `src/components/Navbar.jsx` - Show admin link
- ✅ `src/App.jsx` - Added admin route
- ✅ `src/pages/AdminDashboard.jsx` - New admin dashboard

## Admin Dashboard Features

- **Statistics Cards**: Users, Reservations, Menu Items, Revenue
- **Quick Actions**: Links to manage reservations, menu, and users
- **Real-time Data**: Fetches latest statistics
- **Access Control**: Only accessible to admin users

## API Integration

The admin dashboard calls:
```javascript
GET /api/admin/stats
```

Returns:
```json
{
  "users": 50,
  "reservations": 120,
  "menuItems": 15,
  "estimatedRevenue": 5000.00
}
```

