# WordPress Tailwind CSS Setup - Installation Guide

## 🚀 One-Command Setup

### For macOS/Linux:
```bash
./setup.sh
```

### For Windows:
```cmd
setup.bat
```

### Alternative (Cross-platform):
```bash
node scripts/setup.js
```

## 📋 What the Setup Does

The setup script will automatically:

1. **Validate Environment**
   - Check if you're in a WordPress root directory
   - Verify Node.js and npm are installed
   - Validate folder names (letters, numbers, hyphens, underscores only)

2. **Create Directory Structure**
   ```
   wp-content/
   ├── plugins/
   │   └── YOUR_PLUGIN/
   │       └── assets/
   │           └── css/
   └── themes/
       └── YOUR_THEME/
           └── assets/
               └── css/
   ```

3. **Install Dependencies**
   - Automatically runs `npm install`
   - Installs Tailwind CSS and all required packages

4. **Configure Files**
   - Updates `package.json` with your folder names
   - Creates `postcss.config.js`
   - Updates `.gitignore` with Tailwind entries

5. **Create Example Files**
   - Basic plugin PHP file with Tailwind integration
   - Theme `functions.php` with CSS enqueuing
   - Initial CSS files with Tailwind directives

6. **Verify Installation**
   - Checks all files and directories were created
   - Validates the complete setup

## 🎯 Interactive Prompts

The setup will ask you for:

1. **Plugin Folder Name**
   - Example: `my-custom-plugin`
   - Must contain only letters, numbers, hyphens, and underscores
   - Maximum 50 characters

2. **Theme Folder Name**
   - Example: `my-custom-theme`
   - Same validation rules as plugin folder

## 📁 Generated Files

After setup, you'll have:

### Configuration Files
- `package.json` - Updated with your folder names
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `.gitignore` - Updated with Tailwind entries

### Plugin Files
- `wp-content/plugins/YOUR_PLUGIN/YOUR_PLUGIN.php` - Main plugin file
- `wp-content/plugins/YOUR_PLUGIN/assets/css/main.css` - Generated CSS

### Theme Files
- `wp-content/themes/YOUR_THEME/functions.php` - Theme functions
- `wp-content/themes/YOUR_THEME/assets/css/main.css` - Generated CSS

### Source Files
- `src/input.css` - Your Tailwind input file
- `scripts/setup.js` - Setup script

## 🛠️ Available Commands After Setup

### Development
```bash
npm run dev          # Watch both theme and plugin
npm run watch:plugin  # Watch only plugin
npm run watch:theme   # Watch only theme
```

### Production
```bash
npm run build:prod      # Build plugin CSS
npm run build:theme:prod # Build theme CSS
```

## 🚨 Troubleshooting

### Setup Fails
- Ensure you're in WordPress root directory (where `wp-config.php` is located)
- Check that Node.js and npm are installed
- Verify folder names don't contain special characters

### Dependencies Won't Install
- Check your internet connection
- Try running `npm install` manually
- Clear npm cache: `npm cache clean --force`

### CSS Not Generating
- Make sure watch process is running (`npm run dev`)
- Check that your PHP files contain Tailwind classes
- Verify file paths in `tailwind.config.js`

## 📚 Next Steps

1. **Start Development**
   ```bash
   npm run dev
   ```

2. **Add Tailwind Classes**
   ```php
   <div class="bg-blue-500 text-white p-4 rounded-lg">
       Hello Tailwind!
   </div>
   ```

3. **Customize Styles**
   - Edit `src/input.css` for custom styles
   - Modify `tailwind.config.js` for theme customization

4. **Read Documentation**
   - `README.md` - Complete documentation
   - `QUICK_START.md` - Quick reference guide

## 🔄 Re-running Setup

If you need to reconfigure:

1. Delete the generated folders:
   ```bash
   rm -rf wp-content/plugins/YOUR_PLUGIN
   rm -rf wp-content/themes/YOUR_THEME
   ```

2. Run setup again:
   ```bash
   ./setup.sh
   ```

## 💡 Tips

- Use descriptive folder names (e.g., `my-portfolio-plugin`, `business-theme`)
- Keep folder names lowercase with hyphens for WordPress standards
- The setup creates example files you can modify or delete
- Generated CSS files are automatically added to `.gitignore`
