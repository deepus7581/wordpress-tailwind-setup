# WordPress Tailwind CSS Setup - Quick Reference

## 🚀 One-Time Setup

1. **Run Setup Script**
   ```bash
   npm run init
   ```
   - Enter your plugin folder name
   - Enter your custom theme folder name

2. **Install Dependencies**
   ```bash
   npm install
   ```

## 🛠️ Daily Usage

### Development (Watch Mode)
```bash
npm run dev          # Watch both theme and plugin
npm run watch:plugin # Watch only plugin
npm run watch:theme  # Watch only theme
```

### Production Builds
```bash
npm run build:prod      # Build plugin CSS
npm run build:theme:prod # Build theme CSS
```

## 📁 File Locations

- **Input CSS**: `src/input.css`
- **Plugin CSS**: `wp-content/plugins/YOUR_PLUGIN/assets/css/main.css`
- **Theme CSS**: `wp-content/themes/YOUR_THEME/assets/css/main.css`

## 🎨 WordPress Components

### Quick Classes
- `.wp-container` - Main container
- `.wp-button` - Primary button
- `.wp-form` - Form styling
- `.wp-post` - Post container
- `.wp-nav` - Navigation
- `.wp-widget` - Widget container

### Colors
- `wp-blue` - WordPress blue (#0073aa)
- `wp-blue-dark` - Dark blue (#005177)
- `wp-gray` - Light gray (#f1f1f1)
- `wp-gray-dark` - Dark gray (#23282d)

## 🔧 Configuration Files

- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `package.json` - Dependencies and scripts

## 📝 Example Usage

```php
<div class="wp-container">
    <header class="bg-white shadow-md">
        <nav class="wp-nav">
            <a href="/" class="text-wp-blue">Home</a>
        </nav>
    </header>
    <main class="py-8">
        <article class="wp-post">
            <h1 class="wp-post-title"><?php the_title(); ?></h1>
            <div class="wp-post-content"><?php the_content(); ?></div>
        </article>
    </main>
</div>
```

## 🚨 Troubleshooting

- **CSS not updating**: Check if watch process is running
- **Build errors**: Verify folder names match setup
- **Performance**: Use production builds for live sites
