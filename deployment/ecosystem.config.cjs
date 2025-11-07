module.exports = {
  apps: [
    {
      name: 'medfms-backend',
      script: 'npx',
      args: 'tsx ./app/backend/src/index.ts',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DATABASE_PATH: '/var/www/medfms/data/db/database.sqlite'
      },
      error_file: '/var/log/medfms/backend-error.log',
      out_file: '/var/log/medfms/backend-out.log',
      log_file: '/var/log/medfms/backend-combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000
    },
    {
      name: 'medfms-frontend',
      script: 'node',
      args: './app/frontend/build/index.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 5173,
        ORIGIN: process.env.DOMAIN ? `https://${process.env.DOMAIN}` : 'http://localhost:5173'
      },
      error_file: '/var/log/medfms/frontend-error.log',
      out_file: '/var/log/medfms/frontend-out.log',
      log_file: '/var/log/medfms/frontend-combined.log',
      time: true,
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 3000
    }
  ],

  deploy: {
    production: {
      user: 'deploy',
      host: process.env.DEPLOY_HOST || 'production.server.com',
      ref: 'origin/main',
      repo: process.env.REPO_URL || 'https://github.com/mieitza/MedFMS.git',
      path: '/var/www/medfms',
      'post-deploy': 'cd /var/www/medfms && ./deployment/deploy.sh',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};
