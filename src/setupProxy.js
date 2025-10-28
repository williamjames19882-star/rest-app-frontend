const { createProxyMiddleware } = require('http-proxy-middleware');

// Only proxy in development
module.exports = function(app) {
  if (process.env.NODE_ENV === 'development') {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:5000',
        changeOrigin: true,
      })
    );
  }
};

