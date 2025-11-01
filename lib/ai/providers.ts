import { createOpenAI } from "@ai-sdk/openai";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// Check if we have a valid Hugging Face API key (only on server)
const getAPIKey = () => {
  if (typeof window !== 'undefined') {
    // Client-side: return placeholder to avoid errors
    return null;
  }
  return process.env.HUGGINGFACE_API_KEY;
};

const hasValidAPIKey = () => {
  const key = getAPIKey();
  return key && 
    key !== "your-huggingface-api-key-here" &&
    key.startsWith("hf_");
};

// Hugging Face provider configuration
const createHuggingFaceProvider = () => {
  const apiKey = getAPIKey();
  if (!apiKey || !hasValidAPIKey()) {
    return null;
  }
  
  return createOpenAI({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: apiKey,
    // Hugging Face uses standard OpenAI-compatible API
  });
};

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
  : (() => {
      const huggingFaceProvider = createHuggingFaceProvider();
      
      if (huggingFaceProvider) {
        return customProvider({
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
        });
      }
      
      // Fallback: Use placeholder on client, error on server
      if (typeof window === 'undefined') {
        // Server-side: require API key
        throw new Error("HUGGINGFACE_API_KEY environment variable is required. Get your key from https://huggingface.co/settings/tokens");
      }
      
      // Client-side: return mock provider to prevent errors
      const mockModel = {
        specificationVersion: "v2" as const,
        provider: "huggingface",
        modelId: "zai-org/GLM-4.5-Air:nebius",
        defaultObjectGenerationMode: "tool" as const,
        supportedUrls: {} as Record<string, RegExp[]>,
        async doGenerate() {
          throw new Error("API key not configured");
        },
        async doStream() {
          throw new Error("API key not configured");
        },
      };
      
      return customProvider({
        languageModels: {
          "chat-model": mockModel,
          "chat-model-reasoning": mockModel,
          "title-model": mockModel,
          "artifact-model": mockModel,
        },
      });
    })();
