export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "GLM-4.5 Air",
    description: "Fast and efficient model powered by Hugging Face",
  },
  {
    id: "chat-model-reasoning",
    name: "GLM-4.5 Reasoning",
    description:
      "Advanced chain-of-thought reasoning with detailed step-by-step thinking",
  },
];
