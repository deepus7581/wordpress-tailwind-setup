# WordPress Tailwind CSS Setup

A dynamic Tailwind CSS compiler setup for WordPress themes and plugins that watches both your custom theme and plugin folders, generating CSS to your plugin's assets directory.

## 🚀 Quick Start

### 1. Run the Setup Script
```bash
npm run init
```

This will prompt you for:
- Your plugin folder name
- Your custom theme folder name

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development
```bash
npm run dev
```

This will watch both your theme and plugin folders simultaneously.

## 📁 Project Structure

After setup, your project will have this structure:

```
your-wordpress-site/
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── src/
│   └── input.css
├── scripts/
│   └── setup.js
├── wp-content/
│   ├── themes/
│   │   └── your-custom-theme/
│   │       └── assets/
│   │           └── css/
│   │               └── main.css (generated)
│   └── plugins/
│       └── your-plugin/
│           └── assets/
│               └── css/
│                   └── main.css (generated)
```

## 🛠️ Available Scripts

### Development Scripts
- `npm run dev` - Watch both theme and plugin folders
- `npm run watch` - Same as dev (watch both)
- `npm run watch:plugin` - Watch only plugin folder
- `npm run watch:theme` - Watch only theme folder

### Production Scripts
- `npm run build:prod` - Build optimized CSS for plugin
- `npm run build:theme:prod` - Build optimized CSS for theme

### Setup Script
- `npm run init` - Run the interactive setup

## 🎨 Using Tailwind in Your WordPress Files

### In PHP Templates
```php
<div class="wp-container">
    <header class="bg-white shadow-md">
        <nav class="wp-nav">
            <a href="/" class="text-wp-blue hover:text-wp-blue-dark">Home</a>
            <a href="/about" class="text-gray-700 hover:text-wp-blue">About</a>
        </nav>
    </header>
    
    <main class="py-8">
        <article class="wp-post">
            <h1 class="wp-post-title"><?php the_title(); ?></h1>
            <div class="wp-post-content">
                <?php the_content(); ?>
            </div>
        </article>
    </main>
</div>
```

### In Plugin Files
```php
function my_plugin_admin_page() {
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">My Plugin Settings</h1>
        <form class="wp-form">
            <label for="setting1">Setting 1</label>
            <input type="text" id="setting1" name="setting1" class="w-full px-3 py-2 border rounded">
            
            <button type="submit" class="wp-button">Save Settings</button>
        </form>
    </div>
    <?php
}
```

## 🎯 Custom WordPress Components

The setup includes pre-built WordPress-specific Tailwind components:

### Buttons
- `.wp-button` - Primary WordPress button
- `.wp-button-secondary` - Secondary button

### Forms
- `.wp-form` - Form container with spacing
- Form inputs automatically styled

### Posts
- `.wp-post` - Post container
- `.wp-post-title` - Post title styling
- `.wp-post-content` - Post content styling
- `.wp-post-meta` - Post meta information

### Navigation
- `.wp-nav` - Navigation container
- Automatic current menu item styling

### Layout
- `.wp-container` - WordPress container with max-width
- `.wp-sidebar` - Sidebar styling
- `.wp-widget` - Widget container
- `.wp-widget-title` - Widget title

## 🔧 Configuration

### Tailwind Config
The `tailwind.config.js` file is configured to watch:
- All PHP files in `wp-content/themes/` and `wp-content/plugins/`
- All HTML files in themes
- All JavaScript files in themes and plugins

### Custom Colors
WordPress-specific colors are included:
- `wp-blue` - WordPress primary blue (#0073aa)
- `wp-blue-dark` - Darker blue (#005177)
- `wp-gray` - WordPress gray (#f1f1f1)
- `wp-gray-dark` - Dark gray (#23282d)

### Custom Fonts
WordPress default font stack is included as `wp-default`.

## 📦 Dependencies

- **tailwindcss** - The main Tailwind CSS framework
- **concurrently** - Run multiple watch processes
- **autoprefixer** - Add vendor prefixes
- **postcss** - CSS processing
- **@tailwindcss/forms** - Form styling plugin
- **@tailwindcss/typography** - Typography plugin

## 🔄 Dynamic Setup

This setup is designed to be dynamic and work with any WordPress project structure. Simply:

1. Copy these files to your WordPress root directory
2. Run `npm run init`
3. Enter your plugin and theme folder names
4. Start developing!

## 🚨 Important Notes

- CSS files are generated to your plugin's `assets/css/` directory
- The setup watches both theme and plugin folders simultaneously
- Production builds are minified and optimized
- Generated CSS files are automatically added to `.gitignore`

## 🐛 Troubleshooting

### CSS Not Updating
- Make sure the watch process is running (`npm run dev`)
- Check that your PHP files contain Tailwind classes
- Verify the file paths in `tailwind.config.js`

### Build Errors
- Ensure all dependencies are installed (`npm install`)
- Check that your plugin/theme folders exist
- Verify folder names match what you entered during setup

### Performance Issues
- Use production builds for live sites (`npm run build:prod`)
- Consider purging unused styles in production
- Monitor file sizes of generated CSS

## 📚 Additional Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WordPress Theme Development](https://developer.wordpress.org/themes/)
- [WordPress Plugin Development](https://developer.wordpress.org/plugins/)
