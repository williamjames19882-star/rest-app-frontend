# Centralized Routes Configuration

## Overview

All routes are now managed in a single configuration file: `src/config/routes.js`

## Benefits

✅ **Single Source of Truth**: All routes in one place  
✅ **Easy to Update**: Change routes without touching components  
✅ **Type Safety**: Route paths exported as constants  
✅ **Consistency**: Navigation items automatically match routes  
✅ **Maintainable**: Easier to add/modify routes  

## File Structure

```
src/
  config/
    routes.js          # All route configurations
    README.md         # Detailed documentation
  App.jsx             # Uses routes config
  components/
    Navbar.jsx        # Uses route constants
```

## How It Works

### 1. Routes Configuration (`routes.js`)

Routes are organized by access level:

```javascript
export const routes = {
  public: [        // No authentication required
    { path: '/', element: <Home /> },
    { path: '/menu', element: <Menu /> },
  ],
  
  protected: [     // Requires authentication
    { path: '/book-table', element: <BookTable /> },
    { path: '/my-reservations', element: <MyReservations /> },
  ],
  
  admin: [         // Requires admin role
    { path: '/admin', element: <AdminDashboard /> },
  ],
};
```

### 2. Route Path Constants

All routes have constants to prevent typos:

```javascript
export const ROUTE_PATHS = {
  HOME: '/',
  MENU: '/menu',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BOOK_TABLE: '/book-table',
  MY_RESERVATIONS: '/my-reservations',
  ADMIN: '/admin',
};
```

### 3. Navigation Items

Navigation items organized by access level:

```javascript
export const navigationItems = {
  public: [
    { label: 'Home', path: ROUTE_PATHS.HOME },
    { label: 'Menu', path: ROUTE_PATHS.MENU },
  ],
  
  authenticated: [
    { label: 'Book Table', path: ROUTE_PATHS.BOOK_TABLE },
    { label: 'My Reservations', path: ROUTE_PATHS.MY_RESERVATIONS },
  ],
  
  admin: [
    { label: 'Admin', path: ROUTE_PATHS.ADMIN },
  ],
};
```

### 4. App.jsx Uses Routes

Routes are automatically mapped to components:

```javascript
import { routes } from './config/routes';

// Public routes
{routes.public.map((route) => (
  <Route key={route.path} path={route.path} element={route.element} />
))}

// Protected routes
{routes.protected.map((route) => (
  <Route 
    key={route.path} 
    path={route.path} 
    element={<PrivateRoute>{route.element}</PrivateRoute>} 
  />
))}

// Admin routes
{routes.admin.map((route) => (
  <Route 
    key={route.path} 
    path={route.path} 
    element={<AdminRoute>{route.element}</AdminRoute>} 
  />
))}
```

### 5. Navbar Uses Constants

Navigation uses route constants:

```javascript
import { navigationItems, ROUTE_PATHS } from '../config/routes';

// Desktop navigation
{navigationItems.public.map((item) => (
  <Link to={item.path}>{item.label}</Link>
))}

// Mobile navigation
<Link to={ROUTE_PATHS.HOME}>Home</Link>
```

## Adding a New Route

### Step 1: Create Component

```javascript
// src/pages/Contact.jsx
const Contact = () => <div>Contact Page</div>;
export default Contact;
```

### Step 2: Update routes.js

```javascript
import Contact from '../pages/Contact';

export const routes = {
  public: [
    // ... existing routes
    {
      path: '/contact',
      element: <Contact />,
      exact: true,
    },
  ],
};

export const ROUTE_PATHS = {
  // ... existing paths
  CONTACT: '/contact',
};

export const navigationItems = {
  public: [
    // ... existing items
    { label: 'Contact', path: ROUTE_PATHS.CONTACT },
  ],
};
```

That's it! The route is automatically:
- ✅ Added to the router
- ✅ Available in navigation
- ✅ Protected if it's in protected/admin section

## Current Routes

### Public Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/` | Home | Home page |
| `/menu` | Menu | Browse menu |
| `/login` | Login | Login page |
| `/signup` | Signup | Signup page |

### Protected Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/book-table` | BookTable | Book a table |
| `/my-reservations` | MyReservations | View reservations |

### Admin Routes
| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | AdminDashboard | Admin dashboard |

## Best Practices

### ✅ DO

```javascript
// Use route constants
import { ROUTE_PATHS } from '../config/routes';
navigate(ROUTE_PATHS.HOME);

// Use navigation items
import { navigationItems } from '../config/routes';
{navigationItems.public.map((item) => <Link to={item.path}>{item.label}</Link>)}
```

### ❌ DON'T

```javascript
// Hardcode paths
navigate('/home');  // ❌

// Duplicate navigation
const items = [{ path: '/', label: 'Home' }];  // ❌
```

## Migration Complete

All routes are now managed in:
- `src/config/routes.js` - Route configuration
- `src/App.jsx` - Route rendering (uses config)
- `src/components/Navbar.jsx` - Navigation (uses config)

No more scattered route definitions! 🎉

## Documentation

- `src/config/routes.js` - Complete route configuration
- `src/config/README.md` - Detailed usage guide

