# Security Cleanup Guide

## API Key Exposure Incident

GitHub detected an exposed OpenRouter API key in commits and automatically revoked it. Here's how to properly clean up and secure your setup:

## Immediate Actions Taken

1. ✅ Removed exposed API key from `.env.local`
2. ✅ Replaced with placeholder in environment file

## What You Need to Do

### 1. Get a New OpenRouter API Key

1. Go to https://openrouter.ai/keys
2. Delete the old revoked key if still visible
3. Create a new API key
4. **COPY IT SAFELY** - don't paste in any public location

### 2. Update Environment Variables

**Local Development:**
```bash
# In .env.local (this file is gitignored)
OPENROUTER_API_KEY=your-new-actual-key-here
```

**Production (Vercel):**
1. Go to your Vercel dashboard
2. Project Settings → Environment Variables
3. Add/Update `OPENROUTER_API_KEY` with your new key
4. Redeploy the application

### 3. Clean Git History (IMPORTANT!)

The exposed key is in git commits. You have two options:

**Option A: Force Push Clean History (Recommended if no one else is using the repo)**
```bash
# WARNING: This rewrites git history!
git filter-branch --env-filter '
    if [ "$GIT_COMMIT" = "af51d98add331820794fd84624f6e375b8392d43" ] || [ "$GIT_COMMIT" = "563e37d7cc7dbd234e501dac02a90d87211e20ff" ]; then
        export GIT_AUTHOR_DATE="$GIT_COMMITTER_DATE"
    fi
' --msg-filter '
    sed "s/sk-or-v1-[a-zA-Z0-9]*/[REDACTED-API-KEY]/g"
' HEAD

git push --force-with-lease origin main
```

**Option B: Rotate Repository (Cleanest)**
1. Create a completely new GitHub repository
2. Copy only the current code (without git history)
3. Make initial commit to new repo
4. Update your remotes

### 4. Best Practices Going Forward

1. **Never commit API keys**: Always use environment variables
2. **Use .env.local**: This file is automatically gitignored
3. **Use placeholders in docs**: Show examples as `your-key-here`
4. **Enable GitHub secret scanning**: It should alert you to exposed keys
5. **Regular key rotation**: Change API keys periodically

## Testing Your Fix

1. Update `.env.local` with your new API key
2. Run locally: `npm run dev`
3. Test chat functionality
4. Deploy to production with new environment variables

## Emergency Contacts

- OpenRouter Support: Check their documentation for key security issues
- GitHub Security: They automatically detected this - good job!

## Current Status

- ❌ Old key: Revoked by GitHub (secure)
- ⏳ New key: Awaiting your generation
- ✅ Environment: Cleaned and ready for new key
- ⏳ Production: Needs new environment variable setup