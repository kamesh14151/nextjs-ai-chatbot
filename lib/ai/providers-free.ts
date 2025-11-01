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
  apiKey: process.env.OPENROUTER_API_KEY || "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",
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
        // Using free models that are more likely to work
        "chat-model": openRouterProvider("meta-llama/llama-3.2-3b-instruct:free"),
        "chat-model-reasoning": wrapLanguageModel({
          model: openRouterProvider("meta-llama/llama-3.2-3b-instruct:free"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": openRouterProvider("meta-llama/llama-3.2-3b-instruct:free"),
        "artifact-model": openRouterProvider("meta-llama/llama-3.2-3b-instruct:free"),
      },
    });