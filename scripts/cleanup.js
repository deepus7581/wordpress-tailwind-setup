#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 WordPress Tailwind Setup - Cleanup Tool');
console.log('==========================================\n');

console.log('This will remove toolkit files after setup completion, keeping only your WordPress project files.\n');

// Files and folders to remove (toolkit files)
const filesToRemove = [
  'docs/',
  'WARP.md',
  'scripts/cleanup.js',
  'scripts/setup.js',
  'setup.sh',
  'setup.bat',
  '.history/'
];

// Files to keep (essential project files)
const filesToKeep = [
  'README.md',
  'package.json',
  'tailwind.config.js',
  'postcss.config.js',
  'src/',
  'wp-content/',
  '.gitignore',
  'node_modules/'
];

console.log('📋 Files that will be REMOVED (toolkit files):');
filesToRemove.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ❌ ${file}`);
  }
});

console.log('\n📋 Files that will be KEPT (your project):');
filesToKeep.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  }
});

console.log('\nNote: This will leave you with a clean WordPress project with Tailwind CSS setup.');
console.log('You can always re-download the toolkit if needed.\n');

// Ask for confirmation
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Are you sure you want to remove toolkit files? (y/N): ', (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    console.log('\n🧹 Cleaning up toolkit files...\n');
    
    let removedCount = 0;
    filesToRemove.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          if (fs.statSync(file).isDirectory()) {
            fs.rmSync(file, { recursive: true, force: true });
          } else {
            fs.unlinkSync(file);
          }
          console.log(`✅ Removed: ${file}`);
          removedCount++;
        } catch (error) {
          console.log(`❌ Failed to remove: ${file} (${error.message})`);
        }
      }
    });
    
    // Create a clean .gitignore for the project
    const cleanGitignore = `# WordPress Tailwind Project - .gitignore

# Node modules
node_modules/

# Generated CSS files
wp-content/plugins/*/assets/css/*.css
wp-content/themes/*/assets/css/*.css
wp-content/plugins/*/css/*.css
wp-content/themes/*/css/*.css
wp-content/plugins/*/dist/*.css
wp-content/themes/*/dist/*.css
wp-content/plugins/*/build/*.css
wp-content/themes/*/build/*.css

# Logs
*.log
npm-debug.log*

# System files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/

# Temporary files
*.tmp
*.temp`;
    
    try {
      fs.writeFileSync('.gitignore', cleanGitignore);
      console.log('✅ Updated .gitignore for clean project');
    } catch (error) {
      console.log('⚠️  Could not update .gitignore');
    }
    
    console.log(`\n🎉 Cleanup complete! Removed ${removedCount} toolkit files.`);
    console.log('\n📁 Your clean WordPress project structure:');
    console.log('├── README.md            # Documentation');
    console.log('├── package.json         # Build scripts');
    console.log('├── tailwind.config.js   # Tailwind configuration'); 
    console.log('├── postcss.config.js    # PostCSS configuration');
    console.log('├── src/                 # CSS source files');
    console.log('├── wp-content/          # WordPress files with generated CSS');
    console.log('├── .gitignore           # Clean git ignore');
    console.log('└── node_modules/        # Dependencies');
    console.log('\n💡 Your Tailwind CSS setup is ready for development!');
    console.log('Run: npm run dev');
    
  } else {
    console.log('\n❌ Cleanup cancelled. All files remain unchanged.');
  }
  
  rl.close();
});