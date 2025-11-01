// Quick test script to verify OpenRouter API key and models
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "your-new-openrouter-api-key-here";

console.log("🔍 Testing OpenRouter API Key...");
console.log("API Key:", OPENROUTER_API_KEY === "your-new-openrouter-api-key-here" ? "❌ PLACEHOLDER" : "✅ SET");

if (OPENROUTER_API_KEY === "your-new-openrouter-api-key-here") {
  console.log("\n❌ You need to:");
  console.log("1. Go to https://openrouter.ai/keys");
  console.log("2. Create a new API key");
  console.log("3. Replace 'your-new-openrouter-api-key-here' in .env.local");
  console.log("4. Make sure you have credits in your OpenRouter account");
  process.exit(1);
}

// Test API connectivity
async function testAPI() {
  try {
    console.log("\n🧪 Testing API connectivity...");
    
    const response = await fetch("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://github.com/kamesh14151/nextjs-ai-chatbot",
        "X-Title": "Next.js AI Chatbot",
      },
    });

    if (!response.ok) {
      console.log(`❌ API Error: ${response.status} ${response.statusText}`);
      const errorData = await response.text();
      console.log("Error details:", errorData);
      return false;
    }

    const models = await response.json();
    console.log("✅ API connection successful!");
    console.log(`📊 Available models: ${models.data?.length || 0}`);
    
    // Check if our specific models are available
    const targetModels = [
      "openai/gpt-4o",
      "deepseek/deepseek-r1-distill-llama-70b",
      "meta-llama/llama-3.2-3b-instruct:free"
    ];
    
    console.log("\n🎯 Checking target models:");
    targetModels.forEach(modelId => {
      const found = models.data?.some(m => m.id === modelId);
      console.log(`${found ? "✅" : "❌"} ${modelId}`);
    });
    
    return true;
  } catch (error) {
    console.log("❌ Network error:", error.message);
    return false;
  }
}

// Test reasoning model with a simple prompt
async function testReasoning() {
  try {
    console.log("\n🧠 Testing reasoning model...");
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://github.com/kamesh14151/nextjs-ai-chatbot",
        "X-Title": "Next.js AI Chatbot",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-distill-llama-70b",
        messages: [
          {
            role: "system",
            content: "You are a reasoning assistant. Use <think> tags to show your reasoning process."
          },
          {
            role: "user",
            content: "What is 15 + 27? Please show your thinking process."
          }
        ],
        max_tokens: 150
      }),
    });

    if (!response.ok) {
      console.log(`❌ Reasoning test failed: ${response.status}`);
      const errorData = await response.text();
      console.log("Error:", errorData);
      return false;
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "";
    console.log("✅ Reasoning model response:");
    console.log(content);
    
    if (content.includes("<think>") || content.includes("thinking") || content.includes("step")) {
      console.log("✅ Chain-of-thought reasoning detected!");
    } else {
      console.log("⚠️  No explicit reasoning found - model may not be using chain-of-thought");
    }
    
    return true;
  } catch (error) {
    console.log("❌ Reasoning test error:", error.message);
    return false;
  }
}

// Run tests
(async () => {
  const apiTest = await testAPI();
  if (apiTest) {
    await testReasoning();
  }
  
  console.log("\n📝 Summary:");
  console.log("1. Make sure your OpenRouter account has credits");
  console.log("2. Deploy updated code to Vercel with proper environment variables");
  console.log("3. Test both 'Grok Vision' and 'Grok Reasoning' models in the UI");
})();