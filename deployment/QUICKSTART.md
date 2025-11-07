# MedFMS - Quick Start Deployment Guide

## 🚀 Deploy in 15 Minutes

### Prerequisites
- GCP VM with Ubuntu 22.04 (e2-medium, 2 vCPU, 4GB RAM, 20GB SSD)
- Domain name with A record pointing to VM IP
- Email address for SSL certificate

### Step-by-Step

#### 1. On Your Local Machine

```bash
# Clone repository
git clone https://github.com/mieitza/MedFMS.git
cd MedFMS/deployment

# Create and edit production config
cp .env.example .env.production
nano .env.production

# Update these required values:
# DOMAIN=medfms.yourdomain.com
# EMAIL=admin@yourdomain.com
# JWT_SECRET=$(openssl rand -base64 64)
# SESSION_SECRET=$(openssl rand -base64 32)
```

#### 2. Connect to Your GCP VM

```bash
# SSH to your VM
ssh username@your-vm-external-ip
```

#### 3. On the VM - Initial Setup (One Time)

```bash
# Download deployment files
cd ~
git clone https://github.com/mieitza/MedFMS.git
cd MedFMS/deployment

# Make scripts executable
chmod +x setup-vm.sh deploy.sh

# Run VM setup (installs Node.js, PM2, nginx, etc.)
sudo ./setup-vm.sh
# ⏱️ Takes about 5-10 minutes
```

#### 4. Configure Your Environment

```bash
# Edit production environment file
nano .env.production

# Ensure all required values are set:
# - DOMAIN (your domain name)
# - EMAIL (your email for SSL)
# - JWT_SECRET (generate with: openssl rand -base64 64)
# - SESSION_SECRET (generate with: openssl rand -base64 32)
```

#### 5. Deploy Application

```bash
# Run deployment
./deploy.sh
# ⏱️ Takes about 10-15 minutes
```

#### 6. Verify Deployment

```bash
# Check services are running
pm2 status

# Check logs
pm2 logs

# Test the application
curl https://your-domain.com
```

### Done! 🎉

Access your application at: **https://your-domain.com**

## Default Login

After deployment, you'll need to create the first user (admin) through the UI.

## Quick Commands

```bash
# View logs
pm2 logs

# Restart services
pm2 restart all

# Update application
cd /var/www/medfms && ./deployment/deploy.sh

# Backup database
cp /var/www/medfms/data/db/database.sqlite ~/backup_$(date +%Y%m%d).sqlite
```

## Troubleshooting

### Application Not Starting
```bash
pm2 logs --lines 50
pm2 restart all
```

### SSL Certificate Issues
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Database Issues
```bash
# Check database file
ls -la /var/www/medfms/data/db/database.sqlite

# Fix permissions
sudo chown -R $USER:$USER /var/www/medfms/data/
```

## Need Help?

See the full documentation: [README.md](./README.md)

## Architecture

```
Internet → nginx (443) → SvelteKit Frontend (5173)
                      → Express Backend API (3000) → SQLite Database
```

## File Structure

```
/var/www/medfms/           # Application root
├── app/
│   ├── backend/           # Express API
│   └── frontend/          # SvelteKit app
├── data/
│   └── db/                # SQLite database
├── deployment/            # Deployment scripts
└── ecosystem.config.cjs   # PM2 configuration

/var/log/medfms/           # Application logs
/var/backups/medfms/       # Database backups
```
