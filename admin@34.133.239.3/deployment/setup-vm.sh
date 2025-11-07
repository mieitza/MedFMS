#!/bin/bash

################################################################################
# MedFMS - GCP VM Initial Setup Script
# This script sets up a fresh GCP VM with all required dependencies
################################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    log_error "Please run as root (use sudo)"
    exit 1
fi

log_info "Starting MedFMS VM Setup..."

# Update system
log_info "Updating system packages..."
apt-get update
apt-get upgrade -y

# Install essential packages
log_info "Installing essential packages..."
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    ufw \
    nginx \
    certbot \
    python3-certbot-nginx \
    sqlite3

# Install Node.js 20.x
log_info "Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
log_info "Node.js version: $(node --version)"
log_info "npm version: $(npm --version)"

# Install PM2 globally
log_info "Installing PM2 process manager..."
npm install -g pm2

# Setup PM2 to start on boot
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
log_info "PM2 startup configured"

# Configure firewall
log_info "Configuring firewall..."
ufw --force enable
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw status

# Create application directory
log_info "Creating application directory..."
mkdir -p /var/www/medfms
chown -R $SUDO_USER:$SUDO_USER /var/www/medfms

# Create logs directory
mkdir -p /var/log/medfms
chown -R $SUDO_USER:$SUDO_USER /var/log/medfms

# Create database directory
mkdir -p /var/lib/medfms/db
chown -R $SUDO_USER:$SUDO_USER /var/lib/medfms

# Setup backup directory
mkdir -p /var/backups/medfms
chown -R $SUDO_USER:$SUDO_USER /var/backups/medfms

# Increase file descriptor limits
log_info "Increasing file descriptor limits..."
cat >> /etc/security/limits.conf <<EOF
$SUDO_USER soft nofile 65536
$SUDO_USER hard nofile 65536
EOF

# Configure nginx (basic config, will be overwritten by deployment)
log_info "Setting up basic nginx configuration..."
rm -f /etc/nginx/sites-enabled/default

# Optimize system for Node.js
log_info "Optimizing system parameters..."
cat >> /etc/sysctl.conf <<EOF

# MedFMS optimizations
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.core.somaxconn = 1024
EOF
sysctl -p

# Setup log rotation
log_info "Configuring log rotation..."
cat > /etc/logrotate.d/medfms <<EOF
/var/log/medfms/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 $SUDO_USER $SUDO_USER
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Setup automatic security updates
log_info "Enabling automatic security updates..."
apt-get install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades

# Install monitoring tools
log_info "Installing monitoring tools..."
apt-get install -y htop iotop nethogs

log_info "==================================================="
log_info "VM Setup Complete!"
log_info "==================================================="
log_info ""
log_info "Next steps:"
log_info "1. Configure your domain DNS to point to this VM's IP"
log_info "2. Edit deployment/.env.production with your settings"
log_info "3. Run the deployment script: ./deploy.sh"
log_info ""
log_info "VM IP Address: $(hostname -I | awk '{print $1}')"
log_info "==================================================="
