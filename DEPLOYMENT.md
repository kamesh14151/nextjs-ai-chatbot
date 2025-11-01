# Production Deployment Guide

This guide covers deploying the OpenRouter-enabled Next.js AI Chatbot to production.

## Environment Variables Required

### Required for Production:

1. **OPENROUTER_API_KEY** - Your OpenRouter API key
   - Get from: https://openrouter.ai/keys
   - Example: `sk-or-v1-...`

2. **AUTH_SECRET** - JWT signing secret
   - Generate: https://generate-secret.vercel.app/32
   - Or run: `openssl rand -base64 32`

3. **POSTGRES_URL** - PostgreSQL database connection string
   - Format: `postgresql://username:password@host:port/database`
   - Options: Vercel Postgres, Neon, Supabase, Railway

4. **BLOB_READ_WRITE_TOKEN** - Vercel Blob storage token
   - For file uploads and storage
   - Get from: Vercel Dashboard → Storage → Blob

5. **REDIS_URL** (Optional) - Redis connection string
   - For caching and session storage
   - Format: `redis://username:password@host:port`

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Fork/Clone this repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add all required variables listed above

4. **Database Setup:**
   - Use Vercel Postgres for easy integration
   - Or connect external database (Neon, Supabase)

5. **Deploy:**
   - Vercel will automatically deploy on every push to main

### Option 2: Other Platforms

This can be deployed to:
- Railway
- Render
- AWS Amplify
- Google Cloud Run
- Docker containers

## Model Configuration

The application is configured to use OpenRouter with:

- **Grok Vision** → `gpt-4o`
- **Grok Reasoning** → `deepseek/deepseek-r1-distill-llama-70b:free`

You can modify model mappings in `lib/ai/providers.ts`.

## Database Migration

After setting up your database:

```bash
# Install dependencies
pnpm install

# Run database migrations
pnpm run db:migrate

# Start the application
pnpm start
```

## Testing Locally

1. Copy `.env.example` to `.env.local`
2. Fill in your environment variables
3. Run `pnpm dev`
4. Visit `http://localhost:3000`

## Troubleshooting

### Common Issues:

1. **500 Error on Authentication:**
   - Check POSTGRES_URL is valid
   - Ensure database is accessible
   - Run database migrations

2. **Model API Errors:**
   - Verify OPENROUTER_API_KEY is correct
   - Check API key has sufficient credits
   - Test with curl commands

3. **Build Failures:**
   - Ensure all environment variables are set
   - Check TypeScript compilation errors
   - Verify dependencies are installed

## Security Notes

- Never commit `.env.local` or actual API keys
- Use environment variables for all secrets
- Enable rate limiting in production
- Monitor API usage and costs