# Restaurant App Frontend

This is a Create React App project with Tailwind CSS.

## Prerequisites

- Node.js 14.0 or higher (Node.js 16+ recommended)
- npm or yarn

### Check Your Node Version
```bash
node --version
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The app will automatically open at http://localhost:3000

The page will reload if you make edits.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm test`

Launches the test runner in the interactive watch mode.

## Features

- **Home Page**: Welcome page with overview
- **Login/Signup**: User authentication with role support
- **Menu**: Browse restaurant menu with filtering by category
- **Book Table**: Make table reservations (authenticated users)
- **My Reservations**: View your booking history
- **Admin Dashboard**: Manage users, reservations, and menu (admin only)

## Technologies

- React 18
- React Router v6
- Create React App
- Tailwind CSS
- Axios

## API Proxy

The app is configured to proxy API requests to `http://localhost:5000` (backend server).

## Troubleshooting

If you get errors about missing dependencies, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
