# MedFMS - Automated Deployment Guide for GCP

This guide provides step-by-step instructions for deploying MedFMS on a Google Cloud Platform VM.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Instructions](#detailed-setup-instructions)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Post-Deployment](#post-deployment)
- [Maintenance](#maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### 1. GCP Account and VM Setup

- A Google Cloud Platform account
- A VM instance with:
  - **OS**: Ubuntu 22.04 LTS or later
  - **Machine Type**: e2-medium (2 vCPU, 4GB RAM) minimum
  - **Disk**: 20GB SSD minimum
  - **Firewall Rules**: Allow HTTP (80), HTTPS (443), and SSH (22)

### 2. Domain Name

- A registered domain name
- DNS A record pointing to your VM's external IP address

### 3. Email Address

- Required for SSL certificate registration with Let's Encrypt

## Quick Start

For experienced users, here's the TL;DR version:

```bash
# On your local machine
git clone https://github.com/mieitza/MedFMS.git
cd MedFMS/deployment

# Copy .env.example to .env.production and edit with your values
cp .env.example .env.production
nano .env.production

# SSH to your GCP VM
ssh username@your-vm-ip

# Upload deployment files to VM
scp -r deployment username@your-vm-ip:~/

# On the VM
cd ~/deployment
sudo chmod +x setup-vm.sh deploy.sh
sudo ./setup-vm.sh

# Configure environment
nano .env.production

# Deploy
./deploy.sh
```

## Detailed Setup Instructions

### Step 1: Create GCP VM Instance

1. **Go to GCP Console** → Compute Engine → VM Instances → Create Instance

2. **Configure the instance:**
   ```
   Name: medfms-production
   Region: Choose closest to your users (e.g., europe-west3 for Romania)
   Zone: Any available zone
   Machine Type: e2-medium (2 vCPU, 4GB RAM)
   Boot Disk: Ubuntu 22.04 LTS, 20GB SSD
   Firewall: Allow HTTP and HTTPS traffic
   ```

3. **Create** and note the external IP address

### Step 2: Configure DNS

1. Go to your domain registrar's DNS settings
2. Create an A record:
   ```
   Type: A
   Name: @ (or your subdomain, e.g., medfms)
   Value: [Your VM's External IP]
   TTL: 3600
   ```
3. Wait for DNS propagation (usually 5-60 minutes)

### Step 3: Prepare Deployment Files

On your local machine:

```bash
# Clone the repository
git clone https://github.com/mieitza/MedFMS.git
cd MedFMS/deployment

# Create production environment file
cp .env.example .env.production

# Edit the file with your settings
nano .env.production
```

**Required changes in `.env.production`:**

```bash
# Your domain and email
DOMAIN=medfms.yourdomain.com
EMAIL=admin@yourdomain.com

# Generate secure secrets
JWT_SECRET=$(openssl rand -base64 64)
SESSION_SECRET=$(openssl rand -base64 32)

# Update paths if needed
DATABASE_PATH=/var/www/medfms/data/db/database.sqlite
```

### Step 4: Upload to VM

```bash
# From your local machine, in the deployment directory
scp -r ../deployment username@your-vm-ip:~/deployment/

# Or use rsync for better performance
rsync -avz ../deployment/ username@your-vm-ip:~/deployment/
```

### Step 5: Initial VM Setup

SSH into your VM and run the setup script:

```bash
# SSH to VM
ssh username@your-vm-ip

# Make scripts executable
cd ~/deployment
chmod +x setup-vm.sh deploy.sh

# Run VM setup (as root)
sudo ./setup-vm.sh
```

This script will:
- ✓ Update system packages
- ✓ Install Node.js 20.x
- ✓ Install PM2 process manager
- ✓ Configure firewall (ufw)
- ✓ Install and configure nginx
- ✓ Install certbot for SSL
- ✓ Create necessary directories
- ✓ Set up log rotation
- ✓ Configure system optimizations

**Duration:** 5-10 minutes

### Step 6: Configure Environment

```bash
# Edit the production environment file
nano ~/deployment/.env.production

# Verify all required values are set
# At minimum, ensure these are configured:
# - DOMAIN
# - EMAIL
# - JWT_SECRET
# - SESSION_SECRET
```

### Step 7: Deploy Application

```bash
# Run deployment script
cd ~/deployment
./deploy.sh
```

This script will:
- ✓ Clone the repository
- ✓ Install dependencies
- ✓ Build backend and frontend
- ✓ Configure database
- ✓ Start services with PM2
- ✓ Configure nginx with SSL
- ✓ Run health checks

**Duration:** 10-15 minutes

## Configuration

### Environment Variables

All configuration is in `deployment/.env.production`. Key variables:

#### Required Settings
```bash
DOMAIN=medfms.yourdomain.com          # Your domain
EMAIL=admin@yourdomain.com             # Your email (for SSL)
JWT_SECRET=<64-char-random-string>     # Auth token secret
SESSION_SECRET=<32-char-random-string> # Session secret
```

#### Database Settings
```bash
DATABASE_PATH=/var/www/medfms/data/db/database.sqlite
DATABASE_BACKUP_ENABLED=true
DATABASE_BACKUP_RETENTION_DAYS=30
```

#### Security Settings
```bash
BCRYPT_ROUNDS=12                       # Password hash rounds
JWT_EXPIRATION=7d                      # Token expiration
CORS_ORIGIN=https://medfms.yourdomain.com
```

#### Rate Limiting
```bash
RATE_LIMIT_MAX_REQUESTS=1000          # API rate limit
LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5       # Login attempts
```

### Nginx Configuration

The nginx configuration (`deployment/nginx.conf`) includes:
- ✓ HTTP to HTTPS redirect
- ✓ SSL/TLS configuration
- ✓ Rate limiting for API and login
- ✓ Reverse proxy for backend and frontend
- ✓ Security headers
- ✓ Gzip compression
- ✓ Static asset caching

### PM2 Configuration

PM2 manages two processes:
1. **medfms-backend** - Express API server (port 3000)
2. **medfms-frontend** - SvelteKit app (port 5173)

Configuration is in `deployment/ecosystem.config.cjs`.

## Deployment

### Initial Deployment

```bash
cd ~/deployment
./deploy.sh
```

### Updating the Application

To deploy updates:

```bash
cd /var/www/medfms
git pull origin main
./deployment/deploy.sh
```

Or create an update script:

```bash
#!/bin/bash
# save as ~/update-medfms.sh
cd /var/www/medfms
git pull origin main
./deployment/deploy.sh
pm2 save
```

### Automated Deployments

For automated deployments via GitHub Actions, add this to your repository:

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GCP VM
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VM_HOST }}
          username: ${{ secrets.VM_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/medfms
            git pull origin main
            ./deployment/deploy.sh
```

## Post-Deployment

### Verify Installation

1. **Check PM2 status:**
   ```bash
   pm2 status
   ```
   Both medfms-backend and medfms-frontend should be online.

2. **Check logs:**
   ```bash
   pm2 logs
   ```

3. **Test the application:**
   ```bash
   # Backend health check
   curl http://localhost:3000/api/health

   # Frontend check
   curl http://localhost:5173

   # Full stack check
   curl https://medfms.yourdomain.com
   ```

4. **Check SSL certificate:**
   ```bash
   sudo certbot certificates
   ```

### Initial Application Setup

1. **Access the application:**
   Open https://medfms.yourdomain.com in your browser

2. **Create admin user:**
   The first user created will be the administrator

3. **Import initial data:**
   Use the UTA import feature to upload fuel transaction data

### Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs medfms-backend
pm2 logs medfms-frontend

# View nginx logs
sudo tail -f /var/log/nginx/medfms-access.log
sudo tail -f /var/log/nginx/medfms-error.log

# View application logs
tail -f /var/log/medfms/backend-out.log
tail -f /var/log/medfms/frontend-out.log
```

## Maintenance

### Database Backups

Automatic backups are stored in `/var/backups/medfms/`.

**Manual backup:**
```bash
BACKUP_FILE="/var/backups/medfms/manual_$(date +%Y%m%d_%H%M%S).sqlite"
cp /var/www/medfms/data/db/database.sqlite "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"
```

**Restore from backup:**
```bash
pm2 stop all
cp /var/backups/medfms/backup_file.sqlite /var/www/medfms/data/db/database.sqlite
pm2 restart all
```

### SSL Certificate Renewal

Certbot automatically renews certificates. To manually renew:

```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Updating System Packages

```bash
sudo apt update
sudo apt upgrade -y
sudo reboot
```

### Updating Node.js

```bash
# Install new version
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs

# Rebuild application
cd /var/www/medfms
./deployment/deploy.sh
```

### Log Rotation

Logs are automatically rotated daily. Configuration in `/etc/logrotate.d/medfms`.

**Manual rotation:**
```bash
sudo logrotate -f /etc/logrotate.d/medfms
pm2 reloadLogs
```

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs --lines 100

# Check PM2 status
pm2 status

# Restart services
pm2 restart all

# Check for port conflicts
sudo netstat -tlnp | grep -E '3000|5173'
```

### Database Connection Issues

```bash
# Check database file permissions
ls -la /var/www/medfms/data/db/

# Fix permissions
sudo chown -R $USER:$USER /var/www/medfms/data/

# Check database integrity
sqlite3 /var/www/medfms/data/db/database.sqlite "PRAGMA integrity_check;"
```

### SSL Certificate Issues

```bash
# Test certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew --dry-run

# Fix certificate
sudo certbot --nginx -d medfms.yourdomain.com
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check nginx status
sudo systemctl status nginx

# Restart nginx
sudo systemctl restart nginx

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

### Performance Issues

```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check PM2 processes
pm2 monit

# Increase PM2 instances (if needed)
pm2 scale medfms-backend 2
```

### Port Already in Use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill process
sudo kill -9 <PID>

# Restart application
pm2 restart all
```

### Common Error Messages

**"EADDRINUSE: address already in use"**
- Another process is using the port
- Solution: Kill the process or change the port in configuration

**"Permission denied"**
- File permission issues
- Solution: `sudo chown -R $USER:$USER /var/www/medfms`

**"Cannot find module"**
- Missing dependencies
- Solution: `cd /var/www/medfms && npm install`

**"502 Bad Gateway"**
- Backend is not responding
- Solution: Check PM2 logs and restart backend

## Useful Commands

### PM2 Commands
```bash
pm2 status              # Show all processes status
pm2 logs                # Show logs for all processes
pm2 logs medfms-backend # Show backend logs only
pm2 monit               # Real-time monitoring
pm2 restart all         # Restart all processes
pm2 stop all            # Stop all processes
pm2 start all           # Start all processes
pm2 delete all          # Remove all processes
pm2 save                # Save current process list
pm2 resurrect           # Restore saved processes
pm2 reload all          # Zero-downtime reload
```

### System Commands
```bash
# Check system resources
htop                    # Interactive process viewer
df -h                   # Disk space usage
free -h                 # Memory usage
netstat -tlnp           # Active ports

# Check logs
journalctl -xe          # System logs
sudo tail -f /var/log/syslog  # System log

# Service management
sudo systemctl status nginx    # Nginx status
sudo systemctl restart nginx   # Restart nginx
```

### Database Commands
```bash
# SQLite commands
sqlite3 /var/www/medfms/data/db/database.sqlite

# Inside sqlite3:
.tables                 # List all tables
.schema users           # Show table structure
SELECT * FROM users;    # Query data
.exit                   # Exit sqlite3
```

## Support and Contributing

### Getting Help

- GitHub Issues: https://github.com/mieitza/MedFMS/issues
- Documentation: https://github.com/mieitza/MedFMS

### Security Issues

For security vulnerabilities, please email admin@yourdomain.com directly.

## License

Copyright (c) 2025 MedFMS. All rights reserved.
