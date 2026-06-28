/**
 * PM2 Ecosystem Configuration
 *
 * Start:     pm2 start ecosystem.config.cjs
 * Restart:   pm2 restart pixie-backend
 * Logs:      pm2 logs pixie-backend
 * Monitor:   pm2 monit
 * Stop all:  pm2 stop all
 *
 * Before starting, ensure you've built everything:
 *   npm run build
 *   npm run db:run:main
 *   npm run db:run:tenant
 */
module.exports = {
  apps: [
    {
      name: 'pixie-backend',
      cwd: './apps/backend',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
