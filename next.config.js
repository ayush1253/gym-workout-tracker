// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  scope: '/',
  sw: 'sw.js',
});

module.exports = withPWA({
  // ...other Next.js config options
});