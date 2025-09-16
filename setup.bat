@echo off
REM WordPress Tailwind CSS Setup Script for Windows
REM This script sets up Tailwind CSS for WordPress themes and plugins

echo 🎨 WordPress Tailwind CSS Setup v2.0
echo ====================================
echo ✨ NEW: Custom CSS paths ^& Anti-duplication system
echo.

REM Check if we're in a WordPress root directory
if not exist "wp-config.php" (
    echo ❌ This doesn't appear to be a WordPress root directory.
    echo ℹ️  Please run this script from your WordPress root folder (where wp-config.php is located).
    pause
    exit /b 1
)

if not exist "wp-content" (
    echo ❌ This doesn't appear to be a WordPress root directory.
    echo ℹ️  Please run this script from your WordPress root folder (where wp-config.php is located).
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo ℹ️  Visit: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ WordPress root directory detected
echo ✅ Node.js and npm are available
echo.
echo 🚀 Welcome to WordPress Tailwind CSS Setup v2.0!
echo Features:
echo   • 4 setup types: Both, Theme-only, Plugin-only, Shared CSS
echo   • Custom CSS output paths (e.g., css/style.css, dist/main.css)
echo   • Anti-duplication system for optimized CSS
echo   • Smart compilation with context-aware styling
echo   • Latest Tailwind CSS v3.4.12 with modern packages
echo.

REM Run the Node.js setup script
if exist "scripts\setup.js" (
    echo ℹ️  Running interactive setup...
    node scripts\setup.js
) else (
    echo ❌ Setup script not found. Please ensure scripts\setup.js exists.
    pause
    exit /b 1
)

echo.
echo ✅ Setup completed successfully!
echo ℹ️  You can now start developing with Tailwind CSS in your WordPress project.
echo.
pause
