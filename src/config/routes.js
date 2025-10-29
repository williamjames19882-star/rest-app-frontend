import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Menu from '../pages/Menu';
import BookTable from '../pages/BookTable';
import MyReservations from '../pages/MyReservations';
import AdminDashboard from '../pages/AdminDashboard';
import AdminReservations from '../pages/AdminReservations';
import AdminMenu from '../pages/AdminMenu';
import AdminUsers from '../pages/AdminUsers';
import AdminTables from '../pages/AdminTables';
import Contact from '../pages/Contact';
import AdminContactRequests from '../pages/AdminContactRequests';

// Route configuration
export const routes = {
  // Public routes
  public: [
    {
      path: '/',
      element: <Home />,
      exact: true,
    },
    {
      path: '/menu',
      element: <Menu />,
      exact: true,
    },
    {
      path: '/contact',
      element: <Contact />,
      exact: true,
    },
    {
      path: '/login',
      element: <Login />,
      exact: true,
    },
    {
      path: '/signup',
      element: <Signup />,
      exact: true,
    },
  ],

  // Protected routes (requires authentication)
  protected: [
    {
      path: '/book-table',
      element: <BookTable />,
      exact: true,
    },
    {
      path: '/my-reservations',
      element: <MyReservations />,
      exact: true,
    },
  ],

  // Admin routes (requires authentication + admin role)
  admin: [
    {
      path: '/admin',
      element: <AdminDashboard />,
      exact: true,
    },
    {
      path: '/admin/reservations',
      element: <AdminReservations />,
      exact: true,
    },
    {
      path: '/admin/menu',
      element: <AdminMenu />,
      exact: true,
    },
    {
      path: '/admin/users',
      element: <AdminUsers />,
      exact: true,
    },
    {
      path: '/admin/tables',
      element: <AdminTables />,
      exact: true,
    },
    {
      path: '/admin/contact-requests',
      element: <AdminContactRequests />,
      exact: true,
    },
  ],

  // Get all routes as a flat array
  getAllRoutes() {
    return [
      ...this.public,
      ...this.protected,
      ...this.admin,
    ];
  },
};

// Export route paths as constants
export const ROUTE_PATHS = {
  HOME: '/',
  MENU: '/menu',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BOOK_TABLE: '/book-table',
  MY_RESERVATIONS: '/my-reservations',
  ADMIN: '/admin',
  ADMIN_RESERVATIONS: '/admin/reservations',
  ADMIN_MENU: '/admin/menu',
  ADMIN_USERS: '/admin/users',
  ADMIN_TABLES: '/admin/tables',
  ADMIN_CONTACT_REQUESTS: '/admin/contact-requests',
  CONTACT: '/contact',
};

// Navigation items configuration
export const navigationItems = {
  public: [
    { label: 'Home', path: ROUTE_PATHS.HOME },
    { label: 'Menu', path: ROUTE_PATHS.MENU },
    { label: 'Contact', path: ROUTE_PATHS.CONTACT },
  ],
  
  authenticated: [
    { label: 'Book Table', path: ROUTE_PATHS.BOOK_TABLE },
    { label: 'My Reservations', path: ROUTE_PATHS.MY_RESERVATIONS },
  ],
  
  admin: [
    { label: 'Dashboard', path: ROUTE_PATHS.ADMIN },
    { label: 'Reservations', path: ROUTE_PATHS.ADMIN_RESERVATIONS },
    { label: 'Menu', path: ROUTE_PATHS.ADMIN_MENU },
    { label: 'Tables', path: ROUTE_PATHS.ADMIN_TABLES },
    { label: 'Contact Requests', path: ROUTE_PATHS.ADMIN_CONTACT_REQUESTS },
    { label: 'Users', path: ROUTE_PATHS.ADMIN_USERS },
  ],
};

export default routes;

