import { createOpenAI } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// Check if we have a valid Hugging Face API key
const hasValidAPIKey = process.env.HUGGINGFACE_API_KEY && 
  process.env.HUGGINGFACE_API_KEY !== "your-huggingface-api-key-here" &&
  process.env.HUGGINGFACE_API_KEY.startsWith("hf_");

// Hugging Face provider configuration
const huggingFaceProvider = hasValidAPIKey ? createOpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HUGGINGFACE_API_KEY,
  // Hugging Face uses standard OpenAI-compatible API
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
  : hasValidAPIKey && huggingFaceProvider
    ? customProvider({
        languageModels: {
          // Hugging Face GLM-4.5-Air model for all purposes
          "chat-model": huggingFaceProvider("zai-org/GLM-4.5-Air:nebius"),
          "chat-model-reasoning": wrapLanguageModel({
            model: huggingFaceProvider("zai-org/GLM-4.5-Air:nebius"),
            middleware: extractReasoningMiddleware({ 
              tagName: "think",
            }),
          }),
          "title-model": huggingFaceProvider("zai-org/GLM-4.5-Air:nebius"),
          "artifact-model": huggingFaceProvider("zai-org/GLM-4.5-Air:nebius"),
        },
      })
    : (() => {
        // Fallback: Require API key - no hardcoded keys for security
        if (!process.env.HUGGINGFACE_API_KEY) {
          throw new Error("HUGGINGFACE_API_KEY environment variable is required. Get your key from https://huggingface.co/settings/tokens");
        }
        
        const fallbackProvider = createOpenAI({
          baseURL: "https://router.huggingface.co/v1",
          apiKey: process.env.HUGGINGFACE_API_KEY,
        });
        
        return customProvider({
          languageModels: {
            "chat-model": fallbackProvider("zai-org/GLM-4.5-Air:nebius"),
            "chat-model-reasoning": wrapLanguageModel({
              model: fallbackProvider("zai-org/GLM-4.5-Air:nebius"),
              middleware: extractReasoningMiddleware({ tagName: "think" }),
            }),
            "title-model": fallbackProvider("zai-org/GLM-4.5-Air:nebius"),
            "artifact-model": fallbackProvider("zai-org/GLM-4.5-Air:nebius"),
          },
        });
      })();
