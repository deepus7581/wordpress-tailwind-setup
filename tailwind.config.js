/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Watch all PHP files in wp-content/themes and wp-content/plugins
    './wp-content/themes/**/*.php',
    './wp-content/plugins/**/*.php',
    // Watch HTML files in themes
    './wp-content/themes/**/*.html',
    // Watch JavaScript files
    './wp-content/themes/**/*.js',
    './wp-content/plugins/**/*.js',
    // Watch any additional template files
    './wp-content/themes/**/*.{html,php,js}',
    './wp-content/plugins/**/*.{html,php,js}',
  ],
  theme: {
    extend: {
      // Add custom theme extensions here
      colors: {
        // WordPress admin colors
        'wp-blue': '#0073aa',
        'wp-blue-dark': '#005177',
        'wp-gray': '#f1f1f1',
        'wp-gray-dark': '#23282d',
      },
      fontFamily: {
        // WordPress default fonts
        'wp-default': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', '"Helvetica Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [
    // Add Tailwind plugins here
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
  // Purge unused styles in production
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './wp-content/themes/**/*.php',
      './wp-content/plugins/**/*.php',
      './wp-content/themes/**/*.html',
      './wp-content/themes/**/*.js',
      './wp-content/plugins/**/*.js',
    ],
  },
}
