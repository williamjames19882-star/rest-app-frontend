# Frontend Environment Setup

## Backend Configuration

The frontend is configured to connect to the backend in two modes:

### Development Mode
When running `npm start` (development), the app connects to:
- **Local backend**: `http://localhost:5000`
- Uses proxy middleware for API calls

### Production Mode  
When running `npm run build` or deployed, the app connects to:
- **Render backend**: `https://rest-app-backend.onrender.com`

## Configuration Files

### `src/api/api.js`
- Automatically detects environment
- Development: Uses `/api` (proxied to localhost:5000)
- Production: Uses `https://rest-app-backend.onrender.com/api`

### `src/setupProxy.js`
- Only active in development mode
- Proxies `/api` requests to `http://localhost:5000`

## Switching Between Local and Production Backend

### For Local Development
Just use the default setup:
```bash
npm start
```

### For Production Testing
To test with production backend locally:
1. Build the app: `npm run build`
2. Serve it: `npm run preview`
3. Or modify `api.js` temporarily to hardcode production URL

## Important Notes

⚠️ **CORS Configuration**: Make sure your backend at `rest-app-backend.onrender.com` has CORS enabled for your frontend domain.

Add this to your backend `server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

## Environment Variables (Optional)

If you want to use a `.env` file instead:

### Create `rest-app-frontend/.env.development`
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Create `rest-app-frontend/.env.production`
```
REACT_APP_API_URL=https://rest-app-backend.onrender.com/api
```

Then update `src/api/api.js`:
```javascript
const API_URL = process.env.REACT_APP_API_URL || '/api';
```

