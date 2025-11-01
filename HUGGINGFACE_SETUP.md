# Hugging Face Setup Guide

## Overview
This chatbot now uses Hugging Face's Router API with the GLM-4.5-Air model for both regular chat and advanced reasoning capabilities.

## Getting Your API Key

1. Go to https://huggingface.co/settings/tokens
2. Create a new token with "Read" access
3. Copy the token (starts with `hf_`)
4. Add it to your environment variables

## Local Development Setup

### 1. Update `.env.local`
```bash
HUGGINGFACE_API_KEY=hf_your_actual_token_here
```

### 2. Test the Configuration
```bash
npm run dev
```

## Production Deployment (Vercel)

### 1. Add Environment Variable
- Go to your Vercel dashboard
- Navigate to Project Settings → Environment Variables
- Add: `HUGGINGFACE_API_KEY` with your token
- Apply to: Production, Preview, Development

### 2. Redeploy
The app will automatically redeploy when you push to GitHub.

## Features

### 1. Regular Chat Mode
- Fast responses
- Good for general conversations
- Efficient token usage

### 2. Reasoning Mode (Chain-of-Thought)
- Shows detailed thinking process
- Step-by-step problem solving
- Perfect for:
  - Math problems
  - Logic puzzles
  - Complex analysis
  - Decision making
  - Code debugging

## Chain-of-Thought Example

When you ask: "What is 15 × 23?"

The reasoning model will show:
```
<think>
Step 1: Break down the problem
- I need to multiply 15 by 23
- I can use the distributive property: 15 × 23 = 15 × (20 + 3)

Step 2: Calculate each part
- 15 × 20 = 300
- 15 × 3 = 45

Step 3: Add the results
- 300 + 45 = 345

Step 4: Verify
- Does 345 ÷ 15 = 23? Yes!
- Does 345 ÷ 23 = 15? Yes!
</think>

The answer is 345.
```

## API Endpoint Details

- **Base URL**: https://router.huggingface.co/v1
- **Model**: zai-org/GLM-4.5-Air:nebius
- **Features**: Streaming, chat completions, OpenAI-compatible
- **Rate Limits**: Depends on your Hugging Face account tier

## Security Notes

✅ **DO NOT** commit API keys to git
✅ **DO** use environment variables
✅ **DO** rotate keys regularly
✅ **DO** use different keys for dev/prod

## Troubleshooting

### Issue: "HUGGINGFACE_API_KEY is required"
**Solution**: Add your API key to `.env.local` or Vercel environment variables

### Issue: API key not working
**Solutions**:
1. Verify key starts with `hf_`
2. Check key has "Read" permissions
3. Regenerate key if expired
4. Wait 1-2 minutes after creating new key

### Issue: Reasoning not showing
**Solutions**:
1. Make sure you selected "GLM-4.5 Reasoning" model
2. Check that chain-of-thought is enabled in settings
3. Try refreshing the page

## Cost

Hugging Face Router API pricing varies by model and usage. Check:
https://huggingface.co/pricing

The GLM-4.5-Air model typically has competitive pricing for inference.

## Support

- Hugging Face Docs: https://huggingface.co/docs
- Model Card: https://huggingface.co/zai-org/GLM-4.5-Air
- Issues: Report in your GitHub repository