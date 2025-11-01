# OpenRouter Configuration Setup

This document explains the changes made to configure the Next.js AI Chatbot to use OpenRouter instead of Vercel AI Gateway.

## Changes Made

### 1. Updated Model Provider Configuration (`lib/ai/providers.ts`)

**Before**: Used Vercel AI Gateway with xAI models
**After**: Uses OpenRouter with the following model mappings:

- **Grok Vision** (`chat-model`) → `gpt-4o` via OpenRouter
- **Grok Reasoning** (`chat-model-reasoning`) → `deepseek/deepseek-r1-distill-llama-70b:free` via OpenRouter

### 2. Environment Variables (`.env.local`)

Added OpenRouter API key:
```bash
OPENROUTER_API_KEY=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
```

### 3. Dependencies

- **Added**: `@ai-sdk/openai` for OpenRouter integration
- **Removed**: `@ai-sdk/gateway` and `@ai-sdk/xai` (no longer needed)

### 4. Model Mappings

| UI Model Name | Model ID | OpenRouter Model | Description |
|---------------|----------|------------------|-------------|
| Grok Vision | `chat-model` | `gpt-4o` | Advanced multimodal model with vision and text capabilities |
| Grok Reasoning | `chat-model-reasoning` | `deepseek/deepseek-r1-distill-llama-70b:free` | Uses advanced chain-of-thought reasoning for complex problems |

## OpenRouter API Endpoints Used

Based on your curl examples:

### For Grok Vision (gpt-4o):
```bash
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer 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" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [
      { "role": "user", "content": "Write a 2-line poem about stars." }
    ]
  }'
```

### For Grok Reasoning (deepseek-r1-distill-llama-70b:free):
```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer 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" \
  -d '{
  "model": "deepseek/deepseek-r1-distill-llama-70b:free",
  "messages": [
    {
      "role": "user",
      "content": "What is the meaning of life?"
    }
  ]
}'
```

## Files Modified

1. `lib/ai/providers.ts` - Updated to use OpenRouter provider
2. `.env.local` - Added OpenRouter API key
3. `README.md` - Updated documentation to reflect OpenRouter usage
4. `package.json` - Updated dependencies

## Testing

The configuration has been tested and the development server starts successfully:
- Server runs on `http://localhost:3000`
- No TypeScript compilation errors
- OpenRouter models are properly configured

## Usage

To use the chatbot:
1. Start the development server: `pnpm dev`
2. Open `http://localhost:3000` in your browser
3. Select either "Grok Vision" or "Grok Reasoning" from the model selector
4. Start chatting!

The models will now use the OpenRouter endpoints you specified with the proper authentication and model configurations.