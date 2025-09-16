#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎨 WordPress Tailwind CSS Setup v2.0');
console.log('====================================');
console.log('✨ Tailwind CSS v4.1.13 with latest packages\n');

// Setup type constants
const SETUP_TYPES = {
  BOTH: 'both',
  THEME_ONLY: 'theme-only',
  PLUGIN_ONLY: 'plugin-only',
  SHARED: 'shared'
};

// Function to create directory if it doesn't exist
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dirPath}`);
    return true;
  } else {
    console.log(`ℹ️  Directory already exists: ${dirPath}`);
    return false;
  }
}

// Function to check if directory exists
function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

// Function to validate folder name
function validateFolderName(name) {
  if (!name || name.trim() === '') {
    return 'Folder name cannot be empty';
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
    return 'Folder name can only contain letters, numbers, hyphens, and underscores';
  }
  if (name.length > 50) {
    return 'Folder name is too long (max 50 characters)';
  }
  return null;
}

// Function to update package.json with actual folder names and setup type
function updatePackageJson(setupType, pluginFolder, themeFolder, sharedCSSPath, pluginCSSPath = 'assets/css/main.css', themeCSSPath = 'assets/css/main.css') {
  const packagePath = './package.json';
  let packageContent = fs.readFileSync(packagePath, 'utf8');
  
  // Generate scripts based on setup type
  let scripts = {};
  
  switch (setupType) {
    case SETUP_TYPES.THEME_ONLY:
      scripts = {
        "build": `tailwindcss -i ./src/input.css -o ./wp-content/themes/${themeFolder}/${themeCSSPath} --watch`,
        "build:prod": `NODE_ENV=production tailwindcss -i ./src/input.css -o ./wp-content/themes/${themeFolder}/${themeCSSPath} --minify`,
        "watch": `npm run watch:theme`,
        "watch:theme": `tailwindcss -i ./src/input.css -o ./wp-content/themes/${themeFolder}/${themeCSSPath} --watch`,
        "dev": "npm run watch",
        "init": "node scripts/setup.js",
        "cleanup": "node scripts/cleanup.js"
      };
      break;
    
    case SETUP_TYPES.PLUGIN_ONLY:
      scripts = {
        "build": `tailwindcss -i ./src/input.css -o ./wp-content/plugins/${pluginFolder}/${pluginCSSPath} --watch`,
        "build:prod": `NODE_ENV=production tailwindcss -i ./src/input.css -o ./wp-content/plugins/${pluginFolder}/${pluginCSSPath} --minify`,
        "watch": `npm run watch:plugin`,
        "watch:plugin": `tailwindcss -i ./src/input.css -o ./wp-content/plugins/${pluginFolder}/${pluginCSSPath} --watch`,
        "dev": "npm run watch",
        "init": "node scripts/setup.js",
        "cleanup": "node scripts/cleanup.js"
      };
      break;
    
    case SETUP_TYPES.SHARED:
      scripts = {
        "build": `tailwindcss -i ./src/input.css -o ./${sharedCSSPath}/main.css --watch`,
        "build:prod": `NODE_ENV=production tailwindcss -i ./src/input.css -o ./${sharedCSSPath}/main.css --minify`,
        "watch": `tailwindcss -i ./src/input.css -o ./${sharedCSSPath}/main.css --watch`,
        "dev": "npm run watch",
        "init": "node scripts/setup.js",
        "cleanup": "node scripts/cleanup.js"
      };
      break;
    
    default: // BOTH
      scripts = {
        "build": `tailwindcss -i ./src/plugin.css -o ./wp-content/plugins/${pluginFolder}/${pluginCSSPath} --watch`,
        "build:prod": `NODE_ENV=production tailwindcss -i ./src/plugin.css -o ./wp-content/plugins/${pluginFolder}/${pluginCSSPath} --minify`,
        "build:theme": `tailwindcss -i ./src/theme.css -o ./wp-content/themes/${themeFolder}/${themeCSSPath} --watch`,
        "build:theme:prod": `NODE_ENV=production tailwindcss -i ./src/theme.css -o ./wp-content/themes/${themeFolder}/${themeCSSPath} --minify`,
        "watch": `concurrently \"npm run watch:plugin\" \"npm run watch:theme\"`,
        "watch:plugin": `tailwindcss -i ./src/plugin.css -o ./wp-content/plugins/${pluginFolder}/${pluginCSSPath} --watch`,
        "watch:theme": `tailwindcss -i ./src/theme.css -o ./wp-content/themes/${themeFolder}/${themeCSSPath} --watch`,
        "dev": "npm run watch",
        "init": "node scripts/setup.js",
        "cleanup": "node scripts/cleanup.js"
      };
  }
  
  // Parse and update package.json
  const packageObj = JSON.parse(packageContent);
  packageObj.scripts = scripts;
  
  // Add concurrently dependency only if needed (for BOTH setup type)
  if (setupType === SETUP_TYPES.BOTH) {
    if (!packageObj.devDependencies.concurrently) {
      packageObj.devDependencies.concurrently = '^8.2.2';
    }
  } else {
    // Remove concurrently if not needed
    if (packageObj.devDependencies.concurrently) {
      delete packageObj.devDependencies.concurrently;
    }
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageObj, null, 2));
  console.log('✅ Updated package.json with your configuration');
}

// Function to create PostCSS config
function createPostCSSConfig() {
  const postcssConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
  
  fs.writeFileSync('./postcss.config.js', postcssConfig);
  console.log('✅ Created postcss.config.js');
}

// Function to create .gitignore entries
function updateGitignore() {
  const gitignorePath = './.gitignore';
  const gitignoreEntries = [
    '',
    '# Tailwind CSS',
    'node_modules/',
    'wp-content/plugins/*/assets/css/main.css',
    'wp-content/themes/*/assets/css/main.css',
    '.DS_Store',
    '*.log'
  ];
  
  let gitignoreContent = '';
  if (fs.existsSync(gitignorePath)) {
    gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  }
  
  const newEntries = gitignoreEntries.filter(entry => !gitignoreContent.includes(entry));
  if (newEntries.length > 0) {
    fs.appendFileSync(gitignorePath, newEntries.join('\n'));
    console.log('✅ Updated .gitignore');
  }
}

// Function to install npm dependencies
function installDependencies() {
  console.log('\n📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    return false;
  }
}

// Function to create separate input sources for theme and plugin
function createInputSources(setupType, pluginFolder, themeFolder) {
  if (setupType !== SETUP_TYPES.BOTH) {
    return; // Only needed for both setup
  }
  
  // Create shared base CSS
  const sharedCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Shared WordPress-specific styles */
@layer base {
  /* WordPress admin bar compatibility */
  .admin-bar {
    @apply pt-8;
  }
  
  /* WordPress block editor compatibility */
  .wp-block {
    @apply max-w-none;
  }
}

@layer components {
  /* WordPress button styles */
  .wp-button {
    @apply bg-wp-blue text-white px-4 py-2 rounded hover:bg-wp-blue-dark transition-colors;
  }
  
  .wp-button-secondary {
    @apply bg-wp-gray text-wp-gray-dark px-4 py-2 rounded hover:bg-gray-200 transition-colors;
  }
  
  /* WordPress form styles */
  .wp-form {
    @apply space-y-4;
  }
  
  .wp-form input[type="text"],
  .wp-form input[type="email"],
  .wp-form input[type="password"],
  .wp-form textarea {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wp-blue focus:border-transparent;
  }
  
  .wp-form label {
    @apply block text-sm font-medium text-gray-700 mb-1;
  }
  
  /* WordPress post styles */
  .wp-post {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }
  
  .wp-post-title {
    @apply text-xl font-bold text-gray-900 mb-2;
  }
  
  .wp-post-content {
    @apply text-gray-700 leading-relaxed;
  }
  
  .wp-post-meta {
    @apply text-sm text-gray-500 mt-4;
  }
  
  /* WordPress navigation styles */
  .wp-nav {
    @apply flex space-x-4;
  }
  
  .wp-nav a {
    @apply text-gray-700 hover:text-wp-blue transition-colors;
  }
  
  .wp-nav .current-menu-item a {
    @apply text-wp-blue font-semibold;
  }
}

@layer utilities {
  /* WordPress-specific utilities */
  .wp-container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .wp-sidebar {
    @apply bg-gray-50 p-6 rounded-lg;
  }
  
  .wp-widget {
    @apply bg-white p-6 rounded-lg shadow-sm;
  }
  
  .wp-widget-title {
    @apply text-lg font-semibold text-gray-900 mb-4;
  }
}`;

  // Create shared base file
  fs.writeFileSync('./src/shared.css', sharedCSS);
  console.log('✅ Created shared CSS base: src/shared.css');
  
  // Create plugin-specific input
  const pluginInput = `@import './shared.css';

/* Plugin-specific styles */
@layer components {
  /* Add plugin-specific component styles here */
  .plugin-specific {
    @apply border border-blue-500 p-4 rounded;
  }
  
  /* Admin-specific styles */
  .wp-admin .plugin-admin {
    @apply bg-gray-100 p-4 rounded;
  }
}

@layer utilities {
  /* Add plugin-specific utility classes here */
  .plugin-util {
    @apply text-blue-600;
  }
}

/* Add any custom plugin CSS here */`;
  
  fs.writeFileSync('./src/plugin.css', pluginInput);
  console.log('✅ Created plugin input: src/plugin.css');
  
  // Create theme-specific input
  const themeInput = `@import './shared.css';

/* Theme-specific styles */
@layer components {
  /* Add theme-specific component styles here */
  .theme-specific {
    @apply bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg;
  }
  
  /* Frontend-specific styles */
  .site-header {
    @apply bg-white shadow-lg;
  }
  
  .site-footer {
    @apply bg-gray-800 text-white py-8;
  }
}

@layer utilities {
  /* Add theme-specific utility classes here */
  .theme-util {
    @apply text-purple-600;
  }
}

/* Add any custom theme CSS here */`;
  
  fs.writeFileSync('./src/theme.css', themeInput);
  console.log('✅ Created theme input: src/theme.css');
  
  console.log('\n🎨 CSS Structure Created:');
  console.log('  - src/shared.css   → Common WordPress styles');
  console.log('  - src/plugin.css   → Plugin-specific styles (imports shared)');
  console.log('  - src/theme.css    → Theme-specific styles (imports shared)');
  console.log('  - src/input.css    → Fallback for single setups');
}

// Function to create initial CSS files based on setup type
function createInitialCSS(setupType, pluginFolder, themeFolder, sharedCSSPath, pluginCSSPath = 'assets/css/main.css', themeCSSPath = 'assets/css/main.css') {
  const initialCSS = `/* Tailwind CSS - Generated by WordPress Tailwind Setup */
/* This file will be automatically updated when you run the watch command */

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Your custom styles can be added below */`;

  switch (setupType) {
    case SETUP_TYPES.THEME_ONLY:
      if (themeFolder) {
        const themeCSS = `./wp-content/themes/${themeFolder}/${themeCSSPath}`;
        fs.writeFileSync(themeCSS, initialCSS);
        console.log(`✅ Created initial CSS: ${themeCSS}`);
      }
      break;
    
    case SETUP_TYPES.PLUGIN_ONLY:
      if (pluginFolder) {
        const pluginCSS = `./wp-content/plugins/${pluginFolder}/${pluginCSSPath}`;
        fs.writeFileSync(pluginCSS, initialCSS);
        console.log(`✅ Created initial CSS: ${pluginCSS}`);
      }
      break;
    
    case SETUP_TYPES.SHARED:
      const sharedCSS = `${sharedCSSPath}/main.css`;
      fs.writeFileSync(sharedCSS, initialCSS);
      console.log(`✅ Created shared CSS: ${sharedCSS}`);
      break;
    
    default: // BOTH
      if (pluginFolder) {
        const pluginCSS = `./wp-content/plugins/${pluginFolder}/${pluginCSSPath}`;
        fs.writeFileSync(pluginCSS, initialCSS);
        console.log(`✅ Created initial CSS: ${pluginCSS}`);
      }
      if (themeFolder) {
        const themeCSS = `./wp-content/themes/${themeFolder}/${themeCSSPath}`;
        fs.writeFileSync(themeCSS, initialCSS);
        console.log(`✅ Created initial CSS: ${themeCSS}`);
      }
  }
}

// Function to create example files based on setup type
function createExampleFiles(setupType, pluginFolder, themeFolder, sharedCSSPath, pluginCSSPath = 'assets/css/main.css', themeCSSPath = 'assets/css/main.css') {
  const pluginExists = pluginFolder ? fs.existsSync(`./wp-content/plugins/${pluginFolder}/${pluginFolder}.php`) : false;
  const themeFunctionsExists = themeFolder ? fs.existsSync(`./wp-content/themes/${themeFolder}/functions.php`) : false;
  
  // Create example plugin file only if it doesn't exist and plugin setup is requested
  if (pluginFolder && !pluginExists && (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.PLUGIN_ONLY)) {
    const examplePlugin = `<?php
/**
 * Plugin Name: ${pluginFolder}
 * Description: A WordPress plugin with Tailwind CSS
 * Version: 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Enqueue Tailwind CSS
function ${pluginFolder}_enqueue_styles() {
    wp_enqueue_style(
        '${pluginFolder}-tailwind',
        plugin_dir_url(__FILE__) . '${pluginCSSPath}',
        array(),
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', '${pluginFolder}_enqueue_styles');

// Example admin page
function ${pluginFolder}_admin_menu() {
    add_options_page(
        '${pluginFolder} Settings',
        '${pluginFolder}',
        'manage_options',
        '${pluginFolder}-settings',
        '${pluginFolder}_admin_page'
    );
}
add_action('admin_menu', '${pluginFolder}_admin_menu');

function ${pluginFolder}_admin_page() {
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">${pluginFolder} Settings</h1>
        <div class="wp-container">
            <div class="bg-white p-6 rounded-lg shadow-md">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Welcome to ${pluginFolder}!</h2>
                <p class="text-gray-700 mb-4">This plugin is now set up with Tailwind CSS.</p>
                <button class="wp-button">Save Settings</button>
            </div>
        </div>
    </div>
    <?php
}`;

    fs.writeFileSync(`./wp-content/plugins/${pluginFolder}/${pluginFolder}.php`, examplePlugin);
    console.log(`✅ Created example plugin file: ${pluginFolder}.php`);
  } else {
    console.log(`ℹ️  Plugin file already exists: ${pluginFolder}.php`);
  }

  // Create example theme functions.php only if it doesn't exist and theme setup is requested
  if (themeFolder && !themeFunctionsExists && (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.THEME_ONLY)) {
    const exampleThemeFunctions = `<?php
/**
 * ${themeFolder} Theme Functions
 * Tailwind CSS Integration
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Enqueue Tailwind CSS
function ${themeFolder}_enqueue_styles() {
    wp_enqueue_style(
        '${themeFolder}-tailwind',
        get_template_directory_uri() . '/${themeCSSPath}',
        array(),
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', '${themeFolder}_enqueue_styles');

// Add theme support
function ${themeFolder}_theme_support() {
    add_theme_support('post-thumbnails');
    add_theme_support('title-tag');
    add_theme_support('custom-logo');
}
add_action('after_setup_theme', '${themeFolder}_theme_support');

// Example custom function with Tailwind classes
function ${themeFolder}_custom_header() {
    ?>
    <header class="bg-white shadow-md">
        <div class="wp-container">
            <nav class="wp-nav">
                <a href="<?php echo home_url(); ?>" class="text-wp-blue hover:text-wp-blue-dark font-semibold">
                    <?php bloginfo('name'); ?>
                </a>
            </nav>
        </div>
    </header>
    <?php
}`;

    fs.writeFileSync(`./wp-content/themes/${themeFolder}/functions.php`, exampleThemeFunctions);
    console.log(`✅ Created example theme functions.php`);
  } else {
    console.log(`ℹ️  Theme functions.php already exists`);
  }
  
  // Create shared CSS enqueue instructions for shared setup
  if (setupType === SETUP_TYPES.SHARED) {
    console.log('\n📋 Shared CSS Setup Instructions');
    console.log('=================================\n');
    console.log('Since you chose shared CSS, you can enqueue the CSS from either:');
    console.log(`📁 Shared CSS location: ${sharedCSSPath}/main.css\n`);
    
    if (pluginFolder) {
      console.log('🔌 To enqueue from your plugin:');
      console.log('```php');
      console.log(`function ${pluginFolder}_enqueue_shared_styles() {`);
      console.log(`    wp_enqueue_style(`);
      console.log(`        '${pluginFolder}-shared-tailwind',`);
      console.log(`        plugin_dir_url(__FILE__) . '../../${sharedCSSPath.replace('./wp-content/', '')}/main.css',`);
      console.log(`        array(),`);
      console.log(`        '1.0.0'`);
      console.log(`    );`);
      console.log(`}`);
      console.log(`add_action('wp_enqueue_scripts', '${pluginFolder}_enqueue_shared_styles');`);
      console.log('```\n');
    }
    
    if (themeFolder) {
      console.log('🎨 To enqueue from your theme:');
      console.log('```php');
      console.log(`function ${themeFolder}_enqueue_shared_styles() {`);
      console.log(`    wp_enqueue_style(`);
      console.log(`        '${themeFolder}-shared-tailwind',`);
      console.log(`        get_template_directory_uri() . '/${sharedCSSPath.replace(`./wp-content/themes/${themeFolder}/`, '')}/main.css',`);
      console.log(`        array(),`);
      console.log(`        '1.0.0'`);
      console.log(`    );`);
      console.log(`}`);
      console.log(`add_action('wp_enqueue_scripts', '${themeFolder}_enqueue_shared_styles');`);
      console.log('```\n');
    }
  }
}

// Function to display PHP code snippets for existing files
function displayPHPSnippets(setupType, pluginFolder, themeFolder, sharedCSSPath, pluginCSSPath = 'assets/css/main.css', themeCSSPath = 'assets/css/main.css') {
  if (setupType === SETUP_TYPES.SHARED) {
    // Shared CSS snippets are already displayed in createExampleFiles
    return;
  }
  
  console.log('\n📋 PHP Code Snippets for Existing Files');
  console.log('==========================================\n');
  
  if (pluginFolder && (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.PLUGIN_ONLY)) {
    console.log('🔌 Plugin CSS Enqueue Code:');
    console.log('Add this to your existing plugin file:\n');
    console.log('```php');
    console.log(`// Enqueue Tailwind CSS for ${pluginFolder}`);
    console.log(`function ${pluginFolder}_enqueue_styles() {`);
    console.log(`    wp_enqueue_style(`);
    console.log(`        '${pluginFolder}-tailwind',`);
    console.log(`        plugin_dir_url(__FILE__) . '${pluginCSSPath}',`);
    console.log(`        array(),`);
    console.log(`        '1.0.0'`);
    console.log(`    );`);
    console.log(`}`);
    console.log(`add_action('wp_enqueue_scripts', '${pluginFolder}_enqueue_styles');`);
    console.log('```\n');
    
    console.log('🎯 Admin CSS Enqueue Code (for plugin admin pages):');
    console.log('Add this to your plugin for admin pages:\n');
    console.log('```php');
    console.log(`// Enqueue Tailwind CSS for admin pages`);
    console.log(`function ${pluginFolder}_admin_enqueue_styles() {`);
    console.log(`    wp_enqueue_style(`);
    console.log(`        '${pluginFolder}-admin-tailwind',`);
    console.log(`        plugin_dir_url(__FILE__) . '${pluginCSSPath}',`);
    console.log(`        array(),`);
    console.log(`        '1.0.0'`);
    console.log(`    );`);
    console.log(`}`);
    console.log(`add_action('admin_enqueue_scripts', '${pluginFolder}_admin_enqueue_styles');`);
    console.log('```\n');
  }
  
  if (themeFolder && (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.THEME_ONLY)) {
    console.log('🎨 Theme CSS Enqueue Code:');
    console.log('Add this to your existing theme functions.php:\n');
    console.log('```php');
    console.log(`// Enqueue Tailwind CSS for ${themeFolder}`);
    console.log(`function ${themeFolder}_enqueue_styles() {`);
    console.log(`    wp_enqueue_style(`);
    console.log(`        '${themeFolder}-tailwind',`);
    console.log(`        get_template_directory_uri() . '/${themeCSSPath}',`);
    console.log(`        array(),`);
    console.log(`        '1.0.0'`);
    console.log(`    );`);
    console.log(`}`);
    console.log(`add_action('wp_enqueue_scripts', '${themeFolder}_enqueue_styles');`);
    console.log('```\n');
  }
}

// Function to verify installation
function verifyInstallation(setupType, pluginFolder, themeFolder, sharedCSSPath) {
  console.log('\n🔍 Verifying installation...');
  
  const checks = [
    { name: 'Package.json exists', check: () => fs.existsSync('./package.json') },
    { name: 'Tailwind config exists', check: () => fs.existsSync('./tailwind.config.js') },
    { name: 'PostCSS config exists', check: () => fs.existsSync('./postcss.config.js') },
    { name: 'Input CSS exists', check: () => fs.existsSync('./src/input.css') },
    { name: 'Node modules exist', check: () => dirExists('./node_modules') }
  ];
  
  // Add setup-specific checks
  if (pluginFolder && (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.PLUGIN_ONLY)) {
    checks.push(
      { name: 'Plugin directory exists', check: () => dirExists(`./wp-content/plugins/${pluginFolder}`) },
      { name: 'Plugin CSS directory exists', check: () => dirExists(`./wp-content/plugins/${pluginFolder}/assets/css`) }
    );
  }
  
  if (themeFolder && (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.THEME_ONLY)) {
    checks.push(
      { name: 'Theme directory exists', check: () => dirExists(`./wp-content/themes/${themeFolder}`) },
      { name: 'Theme CSS directory exists', check: () => dirExists(`./wp-content/themes/${themeFolder}/assets/css`) }
    );
  }
  
  if (setupType === SETUP_TYPES.SHARED) {
    checks.push(
      { name: 'Shared CSS directory exists', check: () => dirExists(`./${sharedCSSPath}`) }
    );
  }

  let allPassed = true;
  checks.forEach(check => {
    if (check.check()) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      allPassed = false;
    }
  });

  return allPassed;
}

// Function to ask for user input with validation
function askQuestion(question, validator = null) {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(question, (answer) => {
        if (validator) {
          const error = validator(answer);
          if (error) {
            console.log(`❌ ${error}`);
            ask();
            return;
          }
        }
        resolve(answer.trim());
      });
    };
    ask();
  });
}

// Function to ask for setup type
function askSetupType() {
  return new Promise((resolve) => {
    console.log('\n🎯 Choose your setup type:');
    console.log('1. Both Theme and Plugin (separate CSS files)');
    console.log('2. Theme Only');
    console.log('3. Plugin Only');
    console.log('4. Shared CSS (single file for both theme and plugin)');
    
    const ask = () => {
      rl.question('\nEnter your choice (1-4): ', (answer) => {
        const choice = answer.trim();
        switch (choice) {
          case '1':
            resolve(SETUP_TYPES.BOTH);
            break;
          case '2':
            resolve(SETUP_TYPES.THEME_ONLY);
            break;
          case '3':
            resolve(SETUP_TYPES.PLUGIN_ONLY);
            break;
          case '4':
            resolve(SETUP_TYPES.SHARED);
            break;
          default:
            console.log('❌ Please enter a valid choice (1-4)');
            ask();
        }
      });
    };
    ask();
  });
}

// Function to validate path
function validatePath(path) {
  if (!path || path.trim() === '') {
    return 'Path cannot be empty';
  }
  if (path.includes('../') || path.startsWith('/')) {
    return 'Please use relative paths within the WordPress directory';
  }
  return null;
}

// Function to validate CSS file path
function validateCSSPath(path) {
  if (!path || path.trim() === '') {
    return 'CSS path cannot be empty';
  }
  if (!path.endsWith('.css')) {
    return 'CSS path must end with .css extension';
  }
  if (path.includes('../') || path.startsWith('/')) {
    return 'Please use relative paths within the folder';
  }
  return null;
}

// Function to ask for custom CSS paths
function askCustomCSSPaths(setupType, pluginFolder, themeFolder) {
  return new Promise(async (resolve) => {
    let pluginCSSPath = 'assets/css/main.css';
    let themeCSSPath = 'assets/css/main.css';
    
    // Ask for plugin CSS path if applicable
    if (pluginFolder && (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.PLUGIN_ONLY)) {
      console.log(`\n📁 Plugin CSS Path Configuration`);
      console.log(`Plugin: ${pluginFolder}`);
      console.log(`Default CSS path: ${pluginCSSPath}`);
      
      const customPluginPath = await askQuestion(
        'Enter custom CSS path for plugin (or press Enter for default): ',
        (answer) => {
          if (answer.trim() === '') return null; // Allow empty for default
          return validateCSSPath(answer);
        }
      );
      
      if (customPluginPath.trim() !== '') {
        pluginCSSPath = customPluginPath;
      }
      console.log(`✅ Plugin CSS will be generated to: wp-content/plugins/${pluginFolder}/${pluginCSSPath}`);
    }
    
    // Ask for theme CSS path if applicable
    if (themeFolder && (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.THEME_ONLY)) {
      console.log(`\n🎨 Theme CSS Path Configuration`);
      console.log(`Theme: ${themeFolder}`);
      console.log(`Default CSS path: ${themeCSSPath}`);
      
      const customThemePath = await askQuestion(
        'Enter custom CSS path for theme (or press Enter for default): ',
        (answer) => {
          if (answer.trim() === '') return null; // Allow empty for default
          return validateCSSPath(answer);
        }
      );
      
      if (customThemePath.trim() !== '') {
        themeCSSPath = customThemePath;
      }
      console.log(`✅ Theme CSS will be generated to: wp-content/themes/${themeFolder}/${themeCSSPath}`);
    }
    
    resolve({ pluginCSSPath, themeCSSPath });
  });
}

// Function to display CSS editing guidance after setup
function displayCSSEditingGuidance(setupType, pluginFolder, themeFolder) {
  console.log('\n🎨 CSS Editing Guide:');
  console.log('====================\n');
  
  switch (setupType) {
    case SETUP_TYPES.BOTH:
      console.log('🏗️ **Smart CSS Structure Created** - No duplication!');
      console.log('');
      console.log('🖼️ **Edit these files to customize your styles:**');
      console.log('');
      console.log('🔄 **For styles used in BOTH theme and plugin:**');
      console.log('   Edit: src/shared.css');
      console.log('   Example: .wp-custom-button, .wp-common-styles');
      console.log('');
      console.log('🎨 **For theme-specific styles (frontend):**');
      console.log('   Edit: src/theme.css');
      console.log('   Example: .hero-section, .blog-card, .site-header');
      console.log('');
      console.log('🔌 **For plugin-specific styles (admin):**');
      console.log('   Edit: src/plugin.css');
      console.log('   Example: .admin-panel, .plugin-dashboard, .settings-form');
      console.log('');
      console.log('⚙️  **File Structure:**');
      console.log('   src/shared.css  → Common WordPress styles (imports in both)');
      console.log('   src/plugin.css  → Plugin styles + shared styles');
      console.log('   src/theme.css   → Theme styles + shared styles');
      break;
      
    case SETUP_TYPES.THEME_ONLY:
      console.log('🎨 **Theme-Only Setup**');
      console.log('');
      console.log('🖼️ **Edit this file to customize your theme styles:**');
      console.log('   Edit: src/input.css');
      console.log('');
      console.log('🎨 **Theme-specific examples:**');
      console.log('   .hero-banner, .blog-post, .site-navigation');
      console.log('   .footer-widgets, .page-header, .content-area');
      break;
      
    case SETUP_TYPES.PLUGIN_ONLY:
      console.log('🔌 **Plugin-Only Setup**');
      console.log('');
      console.log('🖼️ **Edit this file to customize your plugin styles:**');
      console.log('   Edit: src/input.css');
      console.log('');
      console.log('🔌 **Plugin-specific examples:**');
      console.log('   .admin-table, .settings-panel, .dashboard-widget');
      console.log('   .plugin-form, .status-indicator, .action-buttons');
      break;
      
    case SETUP_TYPES.SHARED:
      console.log('🔄 **Shared CSS Setup**');
      console.log('');
      console.log('🖼️ **Edit this file for shared styles:**');
      console.log('   Edit: src/input.css');
      console.log('');
      console.log('🔄 **Shared examples:**');
      console.log('   .wp-common-button, .shared-modal, .universal-card');
      console.log('   .consistent-form, .shared-icons, .common-layout');
      break;
  }
  
  console.log('');
  console.log('🎯 **Quick Start Examples:**');
  console.log('');
  
  if (setupType === SETUP_TYPES.BOTH) {
    console.log('```css');
    console.log('/* Add to src/shared.css (available in both contexts) */');
    console.log('@layer components {');
    console.log('  .my-custom-button {');
    console.log('    @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700;');
    console.log('  }');
    console.log('}');
    console.log('');
    console.log('/* Add to src/theme.css (theme only) */');
    console.log('@layer components {');
    console.log('  .hero-section {');
    console.log('    @apply bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20;');
    console.log('  }');
    console.log('}');
    console.log('');
    console.log('/* Add to src/plugin.css (plugin only) */');
    console.log('@layer components {');
    console.log('  .admin-dashboard {');
    console.log('    @apply grid grid-cols-1 md:grid-cols-3 gap-6 p-6;');
    console.log('  }');
    console.log('}');
    console.log('```');
  } else {
    console.log('```css');
    console.log('/* Add to src/input.css */');
    console.log('@layer components {');
    console.log('  .my-custom-component {');
    console.log('    @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;');
    console.log('  }');
    console.log('  ');
    console.log('  .my-button {');
    console.log('    @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;');
    console.log('  }');
    console.log('}');
    console.log('```');
  }
  
  console.log('');
  console.log('📄 **Documentation:**');
  console.log('   - docs/CSS_MANAGEMENT.md - Complete CSS guide');
  console.log('   - docs/CUSTOM_CSS_PATHS.md - Path customization examples');
  console.log('   - README.md - Full documentation');
  console.log('');
  console.log('🧹 **Clean up toolkit files when done:**');
  console.log('   npm run cleanup  # Removes setup files, keeps only your project');
}

// Function to check system requirements
function checkSystemRequirements() {
  console.log('⚙️  Checking system requirements...');
  
  try {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      console.log(`⚠️  Node.js v${nodeVersion} detected. Recommended: v18.0.0 or higher`);
      console.log('   Visit: https://nodejs.org/ to upgrade');
    } else {
      console.log(`✅ Node.js ${nodeVersion} (compatible)`);
    }
    
    // Check npm version
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    const npmMajor = parseInt(npmVersion.split('.')[0]);
    
    if (npmMajor < 9) {
      console.log(`⚠️  npm v${npmVersion} detected. Recommended: v9.0.0 or higher`);
      console.log('   Run: npm install -g npm@latest');
    } else {
      console.log(`✅ npm v${npmVersion} (compatible)`);
    }
    
    console.log('✅ System requirements check completed\n');
    
  } catch (error) {
    console.log('⚠️  Could not verify all system requirements');
    console.log('Continuing with setup...\n');
  }
}

// Main setup function
async function setup() {
  try {
    console.log('Welcome to WordPress Tailwind CSS Setup v2.0!');
    console.log('This will set up Tailwind CSS for your WordPress project.\n');

    // Check system requirements
    checkSystemRequirements();

    // Check if we're in a WordPress root directory
    if (!fs.existsSync('./wp-content') || !fs.existsSync('./wp-config.php')) {
      console.log('❌ Error: This doesn\'t appear to be a WordPress root directory.');
      console.log('Please run this script from your WordPress root folder (where wp-config.php is located).');
      process.exit(1);
    }
    
    console.log('✅ WordPress root directory detected');
    console.log('✨ Ready to install Tailwind CSS v4.1.13\n');

    // Get setup type
    const setupType = await askSetupType();
    
    let pluginFolder = null;
    let themeFolder = null;
    let sharedCSSPath = null;
    
    // Get folder names based on setup type
    if (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.PLUGIN_ONLY || setupType === SETUP_TYPES.SHARED) {
      pluginFolder = await askQuestion('Enter your plugin folder name: ', validateFolderName);
    }
    
    if (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.THEME_ONLY || setupType === SETUP_TYPES.SHARED) {
      themeFolder = await askQuestion('Enter your custom theme folder name: ', validateFolderName);
    }
    
    if (setupType === SETUP_TYPES.SHARED) {
      sharedCSSPath = await askQuestion('Enter path for shared CSS (e.g., wp-content/assets): ', validatePath);
    }
    
    // Get custom CSS paths for theme and plugin
    let pluginCSSPath = 'assets/css/main.css';
    let themeCSSPath = 'assets/css/main.css';
    
    if (setupType !== SETUP_TYPES.SHARED) {
      const customPaths = await askCustomCSSPaths(setupType, pluginFolder, themeFolder);
      pluginCSSPath = customPaths.pluginCSSPath;
      themeCSSPath = customPaths.themeCSSPath;
    }
    
    console.log('\n🚀 Setting up Tailwind CSS...\n');
    
    // Create necessary directories based on setup type
    if (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.PLUGIN_ONLY) {
      createDir(`./wp-content/plugins/${pluginFolder}`);
      // Create directories for custom CSS path
      const pluginCSSDir = path.dirname(`./wp-content/plugins/${pluginFolder}/${pluginCSSPath}`);
      createDir(pluginCSSDir);
    }
    
    if (setupType === SETUP_TYPES.BOTH || setupType === SETUP_TYPES.THEME_ONLY) {
      createDir(`./wp-content/themes/${themeFolder}`);
      // Create directories for custom CSS path
      const themeCSSDir = path.dirname(`./wp-content/themes/${themeFolder}/${themeCSSPath}`);
      createDir(themeCSSDir);
    }
    
    if (setupType === SETUP_TYPES.SHARED) {
      createDir(`./${sharedCSSPath}`);
    }
    
    // Update package.json
    updatePackageJson(setupType, pluginFolder, themeFolder, sharedCSSPath, pluginCSSPath, themeCSSPath);
    
    // Create PostCSS config
    createPostCSSConfig();
    
    // Update .gitignore
    updateGitignore();
    
    // Install dependencies
    const installSuccess = installDependencies();
    if (!installSuccess) {
      console.log('\n⚠️  Dependencies installation failed. You can run "npm install" manually later.');
    }
    
    // Create initial CSS files and input sources
    createInitialCSS(setupType, pluginFolder, themeFolder, sharedCSSPath, pluginCSSPath, themeCSSPath);
    createInputSources(setupType, pluginFolder, themeFolder);
    
    // Create example files
    createExampleFiles(setupType, pluginFolder, themeFolder, sharedCSSPath, pluginCSSPath, themeCSSPath);
    
    // Display PHP code snippets for existing files
    displayPHPSnippets(setupType, pluginFolder, themeFolder, sharedCSSPath, pluginCSSPath, themeCSSPath);
    
    // Verify installation
    const verificationPassed = verifyInstallation(setupType, pluginFolder, themeFolder, sharedCSSPath, pluginCSSPath, themeCSSPath);
    
    console.log('\n🎉 Setup Complete!');
    console.log('==================\n');
    
    if (verificationPassed) {
      console.log('✅ All checks passed! Your Tailwind CSS v4.1.13 setup is ready.');
    } else {
      console.log('⚠️  Some checks failed. Please review the errors above.');
    }
    
    // Display CSS editing guidance
    displayCSSEditingGuidance(setupType, pluginFolder, themeFolder);
    
    // Display setup-specific next steps
    console.log('\n📋 Development Commands:');
    switch (setupType) {
      case SETUP_TYPES.THEME_ONLY:
        console.log('1. npm run dev (watch theme files)');
        console.log('2. npm run build:prod (production build)');
        console.log(`\n📁 CSS Output: wp-content/themes/${themeFolder}/${themeCSSPath}`);
        break;
      
      case SETUP_TYPES.PLUGIN_ONLY:
        console.log('1. npm run dev (watch plugin files)');
        console.log('2. npm run build:prod (production build)');
        console.log(`\n📁 CSS Output: wp-content/plugins/${pluginFolder}/${pluginCSSPath}`);
        break;
      
      case SETUP_TYPES.SHARED:
        console.log('1. npm run dev (watch all files)');
        console.log('2. npm run build:prod (production build)');
        console.log(`\n📁 CSS Output: ${sharedCSSPath}/main.css`);
        break;
      
      default: // BOTH
        console.log('1. npm run dev (watch both - optimized compilation)');
        console.log('2. npm run watch:plugin (plugin only)');
        console.log('3. npm run watch:theme (theme only)');
        console.log('\n📁 CSS Outputs:');
        if (pluginFolder) console.log(`   • Plugin: wp-content/plugins/${pluginFolder}/${pluginCSSPath}`);
        if (themeFolder) console.log(`   • Theme: wp-content/themes/${themeFolder}/${themeCSSPath}`);
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup();
