# MedFMS - Task List and Production Environment Info
**Generated: 2025-11-13**

---

## Current Task List

### ✅ Completed Tasks

1. **Create warehouse request workflow similar to maintenance requests**
   - Implemented database schema for warehouse transfer requests
   - Created status workflow (pending → approved → in_transit → completed)
   - Added priority levels and approval workflow

2. **Modify warehouse request form with source/destination warehouse dropdowns**
   - Added warehouse selection dropdowns
   - Implemented validation for source ≠ destination

3. **Add product dropdown to warehouse request form populated from inventory list**
   - Integrated material selection from inventory
   - Added material details display

4. **Add expiration date field to warehouse products**
   - Added `expirationDate` field to materials schema
   - Implemented expiration tracking

5. **Add new unit labels to warehouse (pills/pastile, vials/fiole, etc.)**
   - Created `materialUnits` table
   - Added support for custom unit labels
   - Implemented unit abbreviations

6. **Create API routes for warehouse transfer requests**
   - GET /api/materials/transfer-requests (list with filters)
   - GET /api/materials/transfer-requests/:id (detail)
   - POST /api/materials/transfer-requests (create)
   - PUT /api/materials/transfer-requests/:id (update)
   - PUT /api/materials/transfer-requests/:id/approve
   - PUT /api/materials/transfer-requests/:id/reject
   - PUT /api/materials/transfer-requests/:id/transfer
   - PUT /api/materials/transfer-requests/:id/complete
   - PUT /api/materials/transfer-requests/:id/cancel

7. **Create API routes for material units CRUD**
   - GET /api/materials/units (list all units)
   - POST /api/materials/units (create unit)
   - PUT /api/materials/units/:id (update unit)

8. **Test backend server compilation**
   - Verified TypeScript compilation
   - Fixed import paths
   - Resolved Drizzle ORM issues

9. **Add transfer request API methods to api.ts**
   - Implemented `getTransferRequests(params)`
   - Added proper query parameter handling
   - Fixed search parameter support

10. **Create transfer requests list page**
    - Built DataTable component integration
    - Implemented status badges with color coding
    - Added priority display
    - Implemented search and pagination

11. **Create transfer request detail/edit page**
    - Created detail view with full information
    - Added edit functionality
    - Implemented status updates

12. **Create transfer request approval page**
    - Built approval workflow UI
    - Added approve/reject actions
    - Implemented approval notes

13. **Create admin CRUD page for warehouse material units**
    - Built admin page for managing material units
    - Implemented create, update operations
    - Added unit name and abbreviation fields
    - Integrated with navigation

14. **Implement all warehouse reports**
    - Created backend API endpoints for all 4 reports
    - Added frontend API methods
    - Implemented comprehensive translations (English & Romanian)
    - Created warehouse stock report page
    - Created warehouse pricing report page
    - Created warehouse transfer report page
    - Created product expiration alert report page
    - Built warehouse reports index page
    - Added navigation integration to dashboard

15. **Vehicle inventory subsection**
    - Comprehensive database schema with categories, items, assignments, inspections, and dispensing
    - Full backend API with CRUD operations for all inventory entities
    - Frontend API methods implemented
    - VehicleInventoryManager component (32KB) with full functionality
    - Integrated into vehicle detail page
    - Expiration tracking for medical supplies
    - Inspection and certification tracking
    - Patient dispensing records

16. **ANMDM authorization section**
    - Authorization fields (number, type, issuing authority)
    - Issue and expiry date tracking
    - Color-coded expiration alerts (expired, expiring soon, valid)
    - Integrated into vehicle detail page
    - Comprehensive translations

---

### 🔄 Pending Tasks

#### Document Management
- **Improve document upload component with preview on load**
  - Add thumbnail preview
  - Display uploaded documents
  - Implement document viewer
  - Support multiple file types

- **Add multiple file upload support to document upload component**
  - Drag and drop multiple files
  - Progress indicators
  - Batch upload
  - File size validation

#### Form Improvements
- **Fix all forms to load existing values in dropdown initial state**
  - Ensure dropdowns show selected values on edit
  - Implement proper state initialization
  - Fix all affected forms

- **Implement granular form updates without losing other attributes**
  - PATCH instead of PUT for updates
  - Preserve unchanged fields
  - Implement partial updates
  - Add optimistic UI updates

#### Vehicle Reports
- **Create report for vehicles that fueled on Sundays**
  - Filter fuel transactions by Sunday
  - Generate report with vehicle details
  - Add export functionality

- **Create daily vehicle report (km, fuel, avg consumption per 100km)**
  - Daily statistics per vehicle
  - Fuel consumption calculations
  - Distance tracking
  - Efficiency metrics

- **Add comparison view to daily vehicle report**
  - Compare with previous day
  - Compare with previous week
  - Compare with previous month
  - Trend visualization

---

## Production Environment Connection Details

### 🌐 Production Server Information

**Server IP**: `34.133.239.3`
**Server Type**: Google Cloud Platform (GCP) VM
**Operating System**: Ubuntu 22.04 LTS
**Machine Type**: e2-medium (2 vCPU, 4GB RAM)
**Disk**: 20GB SSD

---

### 🔐 SSH Connection

#### Connect to Production Server
```bash
ssh -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3
```

#### Alternative Connection (if username is different)
```bash
ssh -i /Users/mihai/.ssh/gcp_ssh_key username@34.133.239.3
```

---

### 📁 Production File Paths

```
/var/www/medfms/              # Application root directory
├── app/
│   ├── backend/              # Express.js API server
│   │   ├── src/
│   │   └── dist/             # Compiled JavaScript
│   └── frontend/             # SvelteKit application
│       ├── src/
│       └── build/            # Production build
├── data/
│   └── db/
│       └── database.sqlite   # Production database
├── deployment/               # Deployment scripts
│   ├── setup-vm.sh
│   ├── deploy.sh
│   ├── .env.production
│   └── ecosystem.config.cjs
└── node_modules/

/var/log/medfms/              # Application logs
├── backend-out.log
├── backend-error.log
├── frontend-out.log
└── frontend-error.log

/var/backups/medfms/          # Database backups
└── backup_*.sqlite
```

---

### 🔧 Production Services

#### PM2 Process Manager
PM2 manages two processes:

1. **medfms-backend** - Express API server (port 3000)
2. **medfms-frontend** - SvelteKit app (port 5173)

#### Common PM2 Commands
```bash
# View status of all services
pm2 status

# View logs (all services)
pm2 logs

# View backend logs only
pm2 logs medfms-backend

# View frontend logs only
pm2 logs medfms-frontend

# Real-time monitoring
pm2 monit

# Restart services
pm2 restart all
pm2 restart medfms-backend
pm2 restart medfms-frontend

# Stop services
pm2 stop all

# Start services
pm2 start all

# Save current process list
pm2 save

# Restore saved processes
pm2 resurrect
```

#### Nginx Web Server
```bash
# Check nginx status
sudo systemctl status nginx

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# View nginx logs
sudo tail -f /var/log/nginx/medfms-access.log
sudo tail -f /var/log/nginx/medfms-error.log
```

---

### 📊 Monitoring Production Logs

#### From Local Machine (SSH Remote Logs)

**Monitor backend logs:**
```bash
ssh -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3 'pm2 logs medfms-backend --raw --lines 50'
```

**Monitor error logs:**
```bash
ssh -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3 'tail -f /var/www/medfms/logs/error.log'
```

**Monitor combined logs:**
```bash
ssh -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3 'tail -f /var/www/medfms/logs/combined.log'
```

**Monitor systemd journal:**
```bash
ssh -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3 'journalctl -u medfms-backend -f -n 50'
```

#### On Production Server

```bash
# View PM2 logs
pm2 logs --lines 100

# View application logs
tail -f /var/log/medfms/backend-out.log
tail -f /var/log/medfms/backend-error.log

# View nginx logs
sudo tail -f /var/log/nginx/medfms-access.log
sudo tail -f /var/log/nginx/medfms-error.log
```

---

### 🚀 Deployment Workflow

#### Initial Deployment (One-Time Setup)

**On Local Machine:**
```bash
# Clone repository
cd ~
git clone https://github.com/mieitza/MedFMS.git
cd MedFMS/deployment

# Create production environment file
cp .env.example .env.production
nano .env.production
# Update DOMAIN, EMAIL, JWT_SECRET, SESSION_SECRET
```

**On Production Server:**
```bash
# SSH to server
ssh -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3

# Clone repository
cd ~
git clone https://github.com/mieitza/MedFMS.git
cd MedFMS/deployment

# Make scripts executable
chmod +x setup-vm.sh deploy.sh

# Run initial setup (installs Node.js, PM2, nginx, etc.)
sudo ./setup-vm.sh

# Configure environment
nano .env.production

# Deploy application
./deploy.sh
```

#### Deploying Updates

**Method 1: Manual Deployment**
```bash
# SSH to production server
ssh -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3

# Navigate to application directory
cd /var/www/medfms

# Pull latest changes
git pull origin main

# Run deployment script
./deployment/deploy.sh

# Save PM2 configuration
pm2 save
```

**Method 2: From Local Machine**
```bash
# Deploy via SSH (one command)
ssh -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3 'cd /var/www/medfms && git pull origin main && ./deployment/deploy.sh && pm2 save'
```

**Method 3: Create Update Script**
```bash
# On production server, create ~/update-medfms.sh:
#!/bin/bash
cd /var/www/medfms
git pull origin main
./deployment/deploy.sh
pm2 save
echo "Deployment completed successfully!"

# Make executable
chmod +x ~/update-medfms.sh

# Run updates
~/update-medfms.sh
```

---

### 💾 Database Management

#### Backup Database

**Manual Backup:**
```bash
# On production server
BACKUP_FILE="/var/backups/medfms/manual_$(date +%Y%m%d_%H%M%S).sqlite"
cp /var/www/medfms/data/db/database.sqlite "$BACKUP_FILE"
echo "Backup created: $BACKUP_FILE"
```

**Download Backup to Local Machine:**
```bash
# From local machine
scp -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3:/var/backups/medfms/backup_file.sqlite ~/backups/
```

**Automated Backups:**
- Location: `/var/backups/medfms/`
- Retention: 30 days (configurable in `.env.production`)

#### Restore Database

```bash
# On production server
pm2 stop all
cp /var/backups/medfms/backup_file.sqlite /var/www/medfms/data/db/database.sqlite
pm2 restart all
```

#### Database Commands

```bash
# Open SQLite database
sqlite3 /var/www/medfms/data/db/database.sqlite

# Inside sqlite3:
.tables                          # List all tables
.schema users                    # Show table structure
SELECT * FROM users;             # Query data
.exit                            # Exit sqlite3

# Check database integrity
sqlite3 /var/www/medfms/data/db/database.sqlite "PRAGMA integrity_check;"

# Check database file permissions
ls -la /var/www/medfms/data/db/
```

---

### 🔒 SSL Certificate Management

#### Check Certificate Status
```bash
sudo certbot certificates
```

#### Manual Certificate Renewal
```bash
sudo certbot renew
sudo systemctl reload nginx
```

#### Certificate Auto-Renewal
- Certbot automatically renews certificates via cron job
- Renewal happens 30 days before expiration

---

### 🔍 Troubleshooting Production Issues

#### Application Won't Start
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

#### Database Connection Issues
```bash
# Check database file permissions
ls -la /var/www/medfms/data/db/

# Fix permissions
sudo chown -R admin:admin /var/www/medfms/data/

# Check database integrity
sqlite3 /var/www/medfms/data/db/database.sqlite "PRAGMA integrity_check;"
```

#### 502 Bad Gateway Error
```bash
# Backend is not responding - check PM2
pm2 status
pm2 logs medfms-backend

# Restart backend
pm2 restart medfms-backend

# Check nginx configuration
sudo nginx -t
sudo systemctl status nginx
```

#### High Memory/CPU Usage
```bash
# Monitor system resources
htop

# Check PM2 processes
pm2 monit

# Check disk usage
df -h

# Check memory usage
free -h

# Restart services if needed
pm2 restart all
```

#### View Error Logs
```bash
# PM2 error logs
pm2 logs medfms-backend --err

# Application error logs
tail -f /var/log/medfms/backend-error.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -xe
```

---

### 📋 Health Checks

#### Backend Health Check
```bash
# From production server
curl http://localhost:3000/api/health

# From local machine
curl https://your-domain.com/api/health
```

#### Frontend Check
```bash
# From production server
curl http://localhost:5173

# From local machine
curl https://your-domain.com
```

#### Full Stack Check
```bash
# Check all services
pm2 status

# Check nginx
sudo systemctl status nginx

# Check SSL certificate
sudo certbot certificates

# Check disk space
df -h

# Check memory
free -h

# Check system load
uptime
```

---

### 🔐 Security Best Practices

1. **Keep SSH key secure**: `/Users/mihai/.ssh/gcp_ssh_key`
2. **Regular updates**: `sudo apt update && sudo apt upgrade`
3. **Monitor logs**: Check logs daily for suspicious activity
4. **Database backups**: Verify backups are running
5. **SSL certificate**: Ensure auto-renewal is working
6. **Firewall**: Only ports 22 (SSH), 80 (HTTP), 443 (HTTPS) should be open

---

### 📞 Support Resources

- **GitHub Repository**: https://github.com/mieitza/MedFMS
- **Deployment Documentation**: `/var/www/medfms/deployment/README.md`
- **Quick Start Guide**: `/var/www/medfms/deployment/QUICKSTART.md`

---

### 🎯 Production Environment Variables

Key environment variables in `/var/www/medfms/deployment/.env.production`:

```bash
# Domain and SSL
DOMAIN=medfms.yourdomain.com
EMAIL=admin@yourdomain.com

# Security
JWT_SECRET=<64-char-random-string>
SESSION_SECRET=<32-char-random-string>
BCRYPT_ROUNDS=12
JWT_EXPIRATION=7d

# Database
DATABASE_PATH=/var/www/medfms/data/db/database.sqlite
DATABASE_BACKUP_ENABLED=true
DATABASE_BACKUP_RETENTION_DAYS=30

# API
API_BASE_URL=https://medfms.yourdomain.com
CORS_ORIGIN=https://medfms.yourdomain.com

# Rate Limiting
RATE_LIMIT_MAX_REQUESTS=1000
LOGIN_RATE_LIMIT_MAX_ATTEMPTS=5

# Server
NODE_ENV=production
PORT=3000
```

---

**Document End**

---

## Quick Reference Card

### SSH Connection
```
ssh -i /Users/mihai/.ssh/gcp_ssh_key admin@34.133.239.3
```

### Common Operations
```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart app
pm2 restart all

# Deploy update
cd /var/www/medfms && git pull && ./deployment/deploy.sh

# Backup database
cp /var/www/medfms/data/db/database.sqlite /var/backups/medfms/backup_$(date +%Y%m%d).sqlite
```

### Important Paths
```
App: /var/www/medfms
DB: /var/www/medfms/data/db/database.sqlite
Logs: /var/log/medfms/
Backups: /var/backups/medfms/
```
