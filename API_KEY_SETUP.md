# Working OpenRouter API Key Setup Guide

## Immediate Fix for Testing

The current issue is that you need a valid OpenRouter API key even for free models. Here's how to fix this:

### Step 1: Get a Working API Key

1. **Go to https://openrouter.ai/keys**
2. **Sign up/Login to OpenRouter** 
3. **Create a new API key**
4. **You get $1 free credit to start** - enough for testing
5. **Copy the key that starts with `sk-or-v1-...`**

### Step 2: Update Local Environment

Replace the placeholder in `.env.local`:

```bash
# Replace this line:
OPENROUTER_API_KEY=your-new-openrouter-api-key-here

# With your actual key:
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

### Step 3: Update Production (Vercel)

1. Go to https://vercel.com/dashboard
2. Find your `nextjs-ai-chatbot` project
3. Go to Settings → Environment Variables
4. Add or update `OPENROUTER_API_KEY` with your new key
5. Redeploy the project

### Step 4: Test Models

After setting up the API key:

**For basic chat (works with free credits):**
- Use "Grok Vision" - maps to `meta-llama/llama-3.2-3b-instruct:free`

**For reasoning (needs premium credits):**
- Use "Grok Reasoning" - maps to `deepseek/deepseek-r1-distill-llama-70b`

## Model Costs

- **Free models**: `meta-llama/llama-3.2-3b-instruct:free` - $0.00
- **Premium models**: `gpt-4o`, `deepseek-r1` - Small cost per message

## Troubleshooting

If you still get errors:

1. **Check API key format**: Should start with `sk-or-v1-`
2. **Check credits**: Visit https://openrouter.ai/credits
3. **Check model availability**: Some models require approval
4. **Test API key**: Run `node test-setup.js` locally

## Current Status

❌ **No valid API key** - Messages will timeout
✅ **With valid API key** - Both models will work
✅ **Free tier available** - $1 free credit for testing

The app is configured to automatically use:
- Free models when you have basic API access
- Premium models when you add more credits

Get your API key first, then both issues (no response + no reasoning) will be resolved!