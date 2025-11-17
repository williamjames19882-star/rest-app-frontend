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
import AdminBanners from '../pages/AdminBanners';
import AdminTransactions from '../pages/AdminTransactions';
import Contact from '../pages/Contact';
import AdminContactRequests from '../pages/AdminContactRequests';
import Gallery from '../pages/Gallery';
import About from '../pages/About';
import Cart from '../pages/Cart';
import TransactionHistory from '../pages/TransactionHistory';

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
      path: '/gallery',
      element: <Gallery />,
      exact: true,
    },
    {
      path: '/about',
      element: <About />,
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
    {
      path: '/cart',
      element: <Cart />,
      exact: true,
    },
    {
      path: '/book-table',
      element: <BookTable />,
      exact: true,
    },
  ],

  // Protected routes (requires authentication)
  protected: [
    {
      path: '/my-reservations',
      element: <MyReservations />,
      exact: true,
    },
    {
      path: '/transaction-history',
      element: <TransactionHistory />,
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
      path: '/admin/banners',
      element: <AdminBanners />,
      exact: true,
    },
    {
      path: '/admin/contact-requests',
      element: <AdminContactRequests />,
      exact: true,
    },
    {
      path: '/admin/transactions',
      element: <AdminTransactions />,
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
  GALLERY: '/gallery',
  ABOUT: '/about',
  CART: '/cart',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BOOK_TABLE: '/book-table',
  MY_RESERVATIONS: '/my-reservations',
  TRANSACTION_HISTORY: '/transaction-history',
  ADMIN: '/admin',
  ADMIN_RESERVATIONS: '/admin/reservations',
  ADMIN_MENU: '/admin/menu',
  ADMIN_USERS: '/admin/users',
  ADMIN_BANNERS: '/admin/banners',
  ADMIN_CONTACT_REQUESTS: '/admin/contact-requests',
  ADMIN_TRANSACTIONS: '/admin/transactions',
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
    { label: 'My Reservations', path: ROUTE_PATHS.MY_RESERVATIONS },
    { label: 'Transaction History', path: ROUTE_PATHS.TRANSACTION_HISTORY },
  ],
  
  admin: [
    { label: 'Dashboard', path: ROUTE_PATHS.ADMIN },
    { label: 'Reservations', path: ROUTE_PATHS.ADMIN_RESERVATIONS },
    { label: 'Banners', path: ROUTE_PATHS.ADMIN_BANNERS },
    { label: 'Transactions', path: ROUTE_PATHS.ADMIN_TRANSACTIONS },
    // { label: 'Menu', path: ROUTE_PATHS.ADMIN_MENU },
    // { label: 'Tables', path: ROUTE_PATHS.ADMIN_TABLES },
    { label: 'Contact Requests', path: ROUTE_PATHS.ADMIN_CONTACT_REQUESTS },
    // { label: 'Users', path: ROUTE_PATHS.ADMIN_USERS },
  ],
};

export default routes;

