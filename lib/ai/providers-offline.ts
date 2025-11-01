// Temporary offline provider for testing without API key
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { MockLanguageModelV2 } from "ai/test";

// Mock models that work offline for testing
const mockChatModel = new MockLanguageModelV2({
  doGenerate: async ({ prompt }) => {
    const userMessage = prompt.messages[prompt.messages.length - 1];
    const content = userMessage.content;
    
    return {
      rawCall: { rawPrompt: null, rawSettings: {} },
      finishReason: "stop",
      usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
      content: [{ 
        type: "text", 
        text: `Hello! I received your message: "${content}". I'm currently running in offline mode. To use the full OpenRouter models, please add a valid API key to your .env.local file.` 
      }],
      warnings: [],
    };
  },
});

const mockReasoningModel = new MockLanguageModelV2({
  doGenerate: async ({ prompt }) => {
    const userMessage = prompt.messages[prompt.messages.length - 1];
    const content = userMessage.content;
    
    return {
      rawCall: { rawPrompt: null, rawSettings: {} },
      finishReason: "stop",
      usage: { inputTokens: 15, outputTokens: 30, totalTokens: 45 },
      content: [
        { 
          type: "reasoning", 
          text: `Let me think about this step by step:

1. The user asked: "${content}"
2. I need to provide a thoughtful response
3. Since this is reasoning mode, I should show my thinking process
4. This demonstrates how chain-of-thought works

Based on my analysis above, I can provide a helpful response.` 
        },
        { 
          type: "text", 
          text: `After thinking through your question "${content}", here's my response: This is the reasoning model in offline mode. For full DeepSeek R1 reasoning capabilities, please add your OpenRouter API key.` 
        }
      ],
      warnings: [],
    };
  },
});

// Offline provider for testing without API key
export const offlineProvider = customProvider({
  languageModels: {
    "chat-model": mockChatModel,
    "chat-model-reasoning": wrapLanguageModel({
      model: mockReasoningModel,
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": mockChatModel,
    "artifact-model": mockChatModel,
  },
});