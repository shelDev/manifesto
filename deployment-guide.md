# Voice Journal Web Application - Deployment Guide

This document provides instructions for deploying the Voice Journal web application to a permanent hosting environment.

## Application Overview

Voice Journal is a web application that allows users to:
- Record voice journal entries with automatic transcription
- Browse, search, and filter journal entries
- Get AI-powered insights about mood patterns and common topics
- Ask natural language questions about journal content
- View a narrative "hero's journey" based on journal entries

## Technical Stack

- **Frontend**: Next.js with React
- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage (client-side)
- **Audio**: Web Audio API and MediaRecorder API
- **AI Features**: Client-side implementation with JavaScript

## Deployment Requirements

1. **Static Site Hosting**: The application can be deployed as a static site since all functionality is client-side
2. **HTTPS Support**: Required for microphone access via MediaRecorder API
3. **Modern Browser Support**: Application requires modern browser APIs

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the recommended deployment platform for Next.js applications.

1. Create a Vercel account at https://vercel.com
2. Install Vercel CLI: `npm install -g vercel`
3. Run `vercel login` and follow the prompts
4. From the project directory, run `vercel` to deploy
5. For production deployment, run `vercel --prod`

### Option 2: Netlify

1. Create a Netlify account at https://netlify.com
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Run `netlify login` and follow the prompts
4. Build the application: `npm run build`
5. Deploy: `netlify deploy --dir=.next --prod`

### Option 3: GitHub Pages

1. Build the application: `npm run build && npm run export`
2. Create a GitHub repository for the project
3. Push the exported files to the `gh-pages` branch
4. Configure GitHub Pages to serve from this branch

## Build Process

To build the application for production:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# For static export (if needed)
npm run export
```

## Environment Variables

No environment variables are required for basic functionality since all features are client-side.

## Post-Deployment Verification

After deployment, verify the following:

1. Voice recording functionality works
2. Journal entries can be saved and retrieved
3. Search and filtering work correctly
4. AI insights are generated properly
5. Application is responsive on different devices

## Custom Domain Setup (Optional)

To use a custom domain:

1. Purchase a domain from a domain registrar
2. Configure DNS settings to point to your deployment platform
3. Set up the custom domain in your deployment platform's dashboard
4. Ensure HTTPS is properly configured

## Backup and Data Considerations

Since the application uses localStorage for data storage:
- All user data is stored in the browser and not on a server
- Users should be informed that clearing browser data will delete their journal entries
- Consider adding an export/import feature for data backup

## Performance Monitoring

After deployment, monitor the application's performance using:
- Browser developer tools
- Lighthouse audits
- Web Vitals metrics

## Accessibility Compliance

The application includes accessibility features, but verify:
- Proper keyboard navigation
- Screen reader compatibility
- Sufficient color contrast
- Appropriate ARIA attributes

## Future Enhancements

Consider these enhancements for future versions:
- Server-side storage for journal entries
- User authentication
- More sophisticated AI analysis using cloud services
- Mobile app versions using React Native
