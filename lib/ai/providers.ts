import { createOpenAI } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";
import { offlineProvider } from "./providers-offline";

// Check if we have a valid API key
const hasValidAPIKey = process.env.OPENROUTER_API_KEY && 
  process.env.OPENROUTER_API_KEY !== "your-new-openrouter-api-key-here" &&
  process.env.OPENROUTER_API_KEY.startsWith("sk-or-v1-");

// OpenRouter provider configuration
const openRouterProvider = hasValidAPIKey ? createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  // Add custom headers for OpenRouter
  headers: {
    "HTTP-Referer": "https://github.com/kamesh14151/nextjs-ai-chatbot",
    "X-Title": "Next.js AI Chatbot",
  },
}) : null;

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
  : hasValidAPIKey && openRouterProvider
    ? customProvider({
        languageModels: {
          // Premium models with valid API key
          "chat-model": openRouterProvider("openai/gpt-4o"),
          "chat-model-reasoning": wrapLanguageModel({
            model: openRouterProvider("deepseek/deepseek-r1-distill-llama-70b"),
            middleware: extractReasoningMiddleware({ 
              tagName: "think",
            }),
          }),
          "title-model": openRouterProvider("openai/gpt-4o-mini"),
          "artifact-model": openRouterProvider("openai/gpt-4o"),
        },
      })
    : offlineProvider; // Use offline mock provider when no valid API key
