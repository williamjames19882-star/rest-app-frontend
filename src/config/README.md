# Routes Configuration

## Overview

All application routes are centrally managed in `routes.js`. This provides:

- **Centralized Configuration**: All routes in one file
- **Type Safety**: Route paths exported as constants
- **Easy Management**: Add/modify routes in one place
- **Consistency**: Navigation items match routes

## File Structure

```
src/
  config/
    routes.js       # Route configuration
    README.md      # This file
  components/
  pages/
```

## Usage

### In Components

```javascript
import { ROUTE_PATHS } from '../config/routes';

// Use route paths
<Link to={ROUTE_PATHS.HOME}>Home</Link>
<Link to={ROUTE_PATHS.ADMIN}>Admin</Link>
```

### In Navigation

```javascript
import { navigationItems } from '../config/routes';

// Iterate over navigation items
{navigationItems.public.map((item) => (
  <Link key={item.path} to={item.path}>
    {item.label}
  </Link>
))}
```

## Adding New Routes

### 1. Create the Page Component

```javascript
// src/pages/NewPage.jsx
const NewPage = () => {
  return <div>New Page</div>;
};
export default NewPage;
```

### 2. Update routes.js

```javascript
import NewPage from '../pages/NewPage';

export const routes = {
  public: [
    // ... existing routes
    {
      path: '/new-page',
      element: <NewPage />,
      exact: true,
    },
  ],
};

export const ROUTE_PATHS = {
  // ... existing paths
  NEW_PAGE: '/new-page',
};
```

### 3. Update navigationItems (if needed)

```javascript
export const navigationItems = {
  public: [
    // ... existing items
    { label: 'New Page', path: ROUTE_PATHS.NEW_PAGE },
  ],
};
```

## Route Types

### Public Routes
Accessible to everyone (no authentication required)

```javascript
{
  path: '/',
  element: <Home />,
  exact: true,
}
```

### Protected Routes
Require authentication (wrapped in `<PrivateRoute>`)

```javascript
{
  path: '/book-table',
  element: <BookTable />,
  exact: true,
}
```

### Admin Routes
Require authentication + admin role (wrapped in `<AdminRoute>`)

```javascript
{
  path: '/admin',
  element: <AdminDashboard />,
  exact: true,
}
```

## Route Paths Constants

Always use `ROUTE_PATHS` constants for navigation:

```javascript
// ✅ Good
import { ROUTE_PATHS } from '../config/routes';
navigate(ROUTE_PATHS.HOME);

// ❌ Bad
navigate('/home');
```

Benefits:
- Prevents typos
- Single source of truth
- Easy refactoring
- IDE autocomplete

## Navigation Items

Navigation items are grouped by access level:

- **public**: Visible to everyone
- **authenticated**: Visible to logged-in users
- **admin**: Visible to admin users only

These items automatically sync with route configuration.

## Best Practices

1. **Use Route Constants**: Always use `ROUTE_PATHS` for navigation
2. **Keep Routes Centralized**: Don't hardcode paths in components
3. **Match Structure**: Keep route paths and navigation items in sync
4. **Descriptive Names**: Use clear, descriptive route path constants
5. **Group by Type**: Organize routes by access level (public, protected, admin)

## Example: Complete New Feature

```javascript
// 1. Create page
// src/pages/NewFeature.jsx
const NewFeature = () => <div>New Feature</div>;
export default NewFeature;

// 2. Add to routes.js
import NewFeature from '../pages/NewFeature';

export const routes = {
  protected: [
    // ... existing
    { path: '/new-feature', element: <NewFeature />, exact: true },
  ],
};

export const ROUTE_PATHS = {
  // ... existing
  NEW_FEATURE: '/new-feature',
};

export const navigationItems = {
  authenticated: [
    // ... existing
    { label: 'New Feature', path: ROUTE_PATHS.NEW_FEATURE },
  ],
};

// 3. Use in components
import { ROUTE_PATHS } from '../config/routes';

<Link to={ROUTE_PATHS.NEW_FEATURE}>New Feature</Link>
```

## Current Routes

### Public Routes
- `/` - Home
- `/menu` - Menu
- `/login` - Login
- `/signup` - Signup

### Protected Routes
- `/book-table` - Book Table
- `/my-reservations` - My Reservations

### Admin Routes
- `/admin` - Admin Dashboard

## Documentation

See `routes.js` for complete route configuration.

