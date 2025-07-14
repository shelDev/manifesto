# Static Export Configuration for Voice Journal Web App

This file contains instructions for creating a static export of the Voice Journal web application that can be deployed to any static web hosting service.

## Creating a Static Export

1. First, ensure you have built the application:
```bash
npm run build
```

2. Then, export the application as static files:
```bash
npm run export
```

3. The static files will be available in the `out` directory.

## Web Server Configuration

### Apache Configuration (.htaccess)

If you're using Apache, create a `.htaccess` file in the root of your exported directory with the following content:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Nginx Configuration

If you're using Nginx, add the following to your server block:

```
location / {
  try_files $uri $uri/ /index.html;
}
```

## Important Notes

- The application uses client-side storage (localStorage), so all user data is stored in the browser
- Ensure your web host supports HTTPS, as this is required for microphone access
- The application requires modern browser APIs, so it may not work in older browsers
- No server-side functionality is required, as all features run in the browser

## Testing Your Deployment

After deploying, verify that:

1. The application loads correctly
2. Voice recording works (requires HTTPS)
3. Journal entries can be saved and retrieved
4. All pages and features are accessible

## Troubleshooting

If you encounter issues:

- Check browser console for errors
- Verify that your web server is correctly configured
- Ensure all files were uploaded correctly
- Confirm that your domain has HTTPS properly configured
