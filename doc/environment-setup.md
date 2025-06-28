# Environment File Selection in Next.js

## Overview

Next.js supports multiple environment files with different priorities and use cases. Environment variables are loaded automatically based on the current environment and file naming conventions.

## Environment File Priority Order

Next.js loads environment files in the following order (highest priority first):

1. `.env.local` - Always loaded, ignored by git
2. `.env.development` - Loaded in development
3. `.env.production` - Loaded in production
4. `.env` - Always loaded

## File Types and Usage

### 1. `.env.local` (Highest Priority)
- **When**: Always loaded, regardless of environment
- **Use case**: Local development overrides, secrets, personal configurations
- **Git**: Should be in `.gitignore` (already configured)
- **Example**: Database credentials, API keys for local development

### 2. `.env.development`
- **When**: Only in development mode (`npm run dev`)
- **Use case**: Development-specific configurations
- **Git**: Can be committed for team sharing
- **Example**: Development API endpoints, debug flags

### 3. `.env.production`
- **When**: Only in production mode (`npm run build`, `npm run start`)
- **Use case**: Production-specific configurations
- **Git**: Can be committed for deployment
- **Example**: Production API endpoints, optimization flags

### 4. `.env` (Lowest Priority)
- **When**: Always loaded, regardless of environment
- **Use case**: Default configurations, shared across environments
- **Git**: Can be committed for team sharing
- **Example**: Default API endpoints, feature flags

## How to Select Environment Files

### Method 1: File Naming Convention (Automatic)
Next.js automatically selects the appropriate environment file based on the current mode:

```bash
# Development mode - loads .env.development, .env.local, .env
npm run dev

# Production build - loads .env.production, .env.local, .env
npm run build

# Production start - loads .env.production, .env.local, .env
npm run start
```

### Method 2: Custom Environment Selection
You can specify a custom environment file using the `NODE_ENV` variable:

```bash
# Force development environment
NODE_ENV=development npm run build

# Force production environment
NODE_ENV=production npm run dev

# Custom environment
NODE_ENV=staging npm run build
```

### Method 3: Using dotenv-cli (Advanced)
For more control, you can use `dotenv-cli`:

```bash
# Install dotenv-cli
npm install --save-dev dotenv-cli

# Use specific env file
dotenv -e .env.staging npm run build
```

## Example Environment Files

### `.env` (Base configuration)
```env
# Default configuration
NEXT_PUBLIC_APP_NAME=DeltaMobi
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
FEATURE_FLAG_NEW_UI=false
```

### `.env.development` (Development overrides)
```env
# Development-specific overrides
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
FEATURE_FLAG_NEW_UI=true
DEBUG=true
```

### `.env.production` (Production overrides)
```env
# Production-specific overrides
NEXT_PUBLIC_API_BASE_URL=https://api.production.com
FEATURE_FLAG_NEW_UI=false
DEBUG=false
```

### `.env.local` (Local overrides)
```env
# Local development overrides (not committed to git)
MONGODB_URI=mongodb://localhost:27017/delta_mobi_local
API_SECRET_KEY=your_local_secret_key
```

## Environment Variables in Next.js

### Server-Side Variables
Variables without `NEXT_PUBLIC_` prefix are only available on the server:

```typescript
// Available in API routes, getServerSideProps, etc.
const dbUri = process.env.MONGODB_URI;
const apiKey = process.env.API_SECRET_KEY;
```

### Client-Side Variables
Variables with `NEXT_PUBLIC_` prefix are available in the browser:

```typescript
// Available in React components
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const appName = process.env.NEXT_PUBLIC_APP_NAME;
```

## Best Practices

1. **Never commit secrets**: Use `.env.local` for sensitive data
2. **Use descriptive names**: Make environment variable names clear
3. **Document defaults**: Include example values in `.env.example`
4. **Validate required variables**: Check for required env vars at startup
5. **Use TypeScript**: Define environment variable types

## Example Setup for This Project

### 1. Create `.env.example`
```env
# Database
MONGODB_URI=mongodb://localhost:27017/delta_mobi

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### 2. Create `.env.development`
```env
# Development overrides
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_DEBUG=true
```

### 3. Create `.env.production`
```env
# Production overrides
NEXT_PUBLIC_API_BASE_URL=https://api.deltamobi.com
NEXT_PUBLIC_ENABLE_DEBUG=false
```

### 4. Create `.env.local` (not committed)
```env
# Local development secrets
MONGODB_URI=mongodb://localhost:27017/delta_mobi_local
```

## Scripts for Different Environments

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "build:dev": "NODE_ENV=development next build",
    "build:prod": "NODE_ENV=production next build",
    "preview_build": "npm run build && npm run start",
    "preview_build:dev": "NODE_ENV=development npm run build && npm run start"
  }
}
```

## Troubleshooting

### Environment Variables Not Loading
1. Check file naming convention
2. Verify file location (project root)
3. Restart the development server
4. Check for syntax errors in env files

### Variables Not Available in Browser
1. Ensure variables start with `NEXT_PUBLIC_`
2. Rebuild the application after changes
3. Check for typos in variable names

### Production Variables Not Working
1. Verify `.env.production` exists
2. Check deployment platform configuration
3. Ensure variables are set in deployment environment 