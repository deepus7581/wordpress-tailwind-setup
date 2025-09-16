#!/bin/bash

# WordPress Tailwind CSS Setup Script
# This script sets up Tailwind CSS for WordPress themes and plugins

echo "🎨 WordPress Tailwind CSS Setup"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in a WordPress root directory
if [ ! -f "wp-config.php" ] || [ ! -d "wp-content" ]; then
    print_error "This doesn't appear to be a WordPress root directory."
    print_info "Please run this script from your WordPress root folder (where wp-config.php is located)."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    print_info "Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "WordPress root directory detected"
print_status "Node.js and npm are available"

echo ""
echo "Welcome to WordPress Tailwind CSS Setup!"
echo "This will set up Tailwind CSS for your WordPress theme and plugin."
echo ""

# Run the Node.js setup script
if [ -f "scripts/setup.js" ]; then
    print_info "Running interactive setup..."
    node scripts/setup.js
else
    print_error "Setup script not found. Please ensure scripts/setup.js exists."
    exit 1
fi

echo ""
print_status "Setup completed successfully!"
print_info "You can now start developing with Tailwind CSS in your WordPress project."
