import { createOpenAI } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// OpenRouter provider configuration
const openRouterProvider = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  // Add custom headers for OpenRouter
  headers: {
    "HTTP-Referer": "https://github.com/kamesh14151/nextjs-ai-chatbot",
    "X-Title": "Next.js AI Chatbot",
  },
});

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        // Fallback to free models if no valid API key, otherwise use premium models
        "chat-model": process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "your-new-openrouter-api-key-here"
          ? openRouterProvider("openai/gpt-4o")
          : openRouterProvider("meta-llama/llama-3.2-3b-instruct:free"),
        
        // Reasoning model with proper chain-of-thought configuration
        "chat-model-reasoning": wrapLanguageModel({
          model: process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "your-new-openrouter-api-key-here"
            ? openRouterProvider("deepseek/deepseek-r1-distill-llama-70b")
            : openRouterProvider("meta-llama/llama-3.2-3b-instruct:free"),
          middleware: extractReasoningMiddleware({ 
            tagName: "think",
            // Enable reasoning output for better chain-of-thought display
          }),
        }),
        
        // Title and artifact models
        "title-model": process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "your-new-openrouter-api-key-here"
          ? openRouterProvider("openai/gpt-4o-mini")
          : openRouterProvider("meta-llama/llama-3.2-3b-instruct:free"),
        
        "artifact-model": process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== "your-new-openrouter-api-key-here"
          ? openRouterProvider("openai/gpt-4o")
          : openRouterProvider("meta-llama/llama-3.2-3b-instruct:free"),
      },
    });
