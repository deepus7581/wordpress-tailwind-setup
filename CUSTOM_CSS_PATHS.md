# Custom CSS Path Configuration

## 🎯 New Feature: Customizable CSS Output Paths

The WordPress Tailwind Setup now supports customizable CSS compilation paths for both themes and plugins!

## 📋 How It Works

After selecting your setup type and entering folder names, you'll be prompted to customize the CSS output paths:

### Default Path
- **Default**: `assets/css/main.css`
- **Full Path**: `wp-content/themes/your-theme/assets/css/main.css`

### Custom Path Examples

#### Example 1: WordPress Standard
```
Custom CSS path: css/style.css
Full path: wp-content/themes/your-theme/css/style.css
```

#### Example 2: Build Directory
```
Custom CSS path: dist/tailwind.css
Full path: wp-content/plugins/your-plugin/dist/tailwind.css  
```

#### Example 3: Assets Directory
```
Custom CSS path: assets/styles/main.css
Full path: wp-content/themes/your-theme/assets/styles/main.css
```

## 🚀 Setup Flow Example

```bash
npm run init

🎯 Choose your setup type:
1. Both Theme and Plugin (separate CSS files)
2. Theme Only  
3. Plugin Only
4. Shared CSS (single file for both theme and plugin)

Enter your choice (1-4): 2

Enter your custom theme folder name: my-awesome-theme

📁 Theme CSS Path Configuration
Theme: my-awesome-theme
Default CSS path: assets/css/main.css
Enter custom CSS path for theme (or press Enter for default): css/style.css

✅ Theme CSS will be generated to: wp-content/themes/my-awesome-theme/css/style.css

🚀 Setting up Tailwind CSS...
```

## 🎨 Generated PHP Enqueue Code

The setup automatically generates the correct PHP enqueue code with your custom paths:

### Theme Example
```php
// Enqueue Tailwind CSS for my-awesome-theme
function my_awesome_theme_enqueue_styles() {
    wp_enqueue_style(
        'my-awesome-theme-tailwind',
        get_template_directory_uri() . '/css/style.css',
        array(),
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'my_awesome_theme_enqueue_styles');
```

### Plugin Example  
```php
// Enqueue Tailwind CSS for my-awesome-plugin
function my_awesome_plugin_enqueue_styles() {
    wp_enqueue_style(
        'my-awesome-plugin-tailwind',
        plugin_dir_url(__FILE__) . 'dist/tailwind.css',
        array(),
        '1.0.0'
    );
}
add_action('wp_enqueue_scripts', 'my_awesome_plugin_enqueue_styles');
```

## 📦 Package.json Scripts

The build scripts are automatically updated to use your custom paths:

```json
{
  "scripts": {
    "dev": "tailwindcss -i ./src/input.css -o ./wp-content/themes/my-theme/css/style.css --watch",
    "build:prod": "NODE_ENV=production tailwindcss -i ./src/input.css -o ./wp-content/themes/my-theme/css/style.css --minify"
  }
}
```

## ✨ Benefits

1. **WordPress Standards**: Use `css/style.css` for themes following WordPress conventions
2. **Build Workflows**: Use `dist/` or `build/` directories for modern build processes
3. **Organization**: Custom directory structures for better project organization
4. **Flexibility**: Any relative path within your plugin/theme directory
5. **Automatic**: All scripts and PHP code updated automatically

## 🔧 Validation

The setup includes validation to ensure:
- ✅ Path ends with `.css` extension
- ✅ Relative paths only (no `../` or absolute paths)
- ✅ Non-empty paths
- ✅ Automatic directory creation

## 📁 Directory Creation

The setup automatically creates the necessary directory structure based on your custom path:

```
wp-content/themes/my-theme/
├── css/              # Created automatically
│   └── style.css     # Generated CSS file
├── dist/             # Created if using dist/main.css
│   └── main.css      # Generated CSS file  
└── assets/
    └── styles/       # Created if using assets/styles/main.css
        └── main.css  # Generated CSS file
```

## 🎯 Use Cases

### WordPress Theme Development
```
CSS Path: css/style.css
→ Follows WordPress theme standards
→ Easy integration with existing themes
```

### Modern Build Workflow
```  
CSS Path: dist/styles.css
→ Separates source and build files
→ Integrates with build tools
```

### Custom Organization
```
CSS Path: assets/tailwind/main.css
→ Clear project organization
→ Semantic directory structure
```