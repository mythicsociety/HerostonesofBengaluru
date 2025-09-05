// Hybrid AI Mode Selector for WebGIS
// This script enables toggling between rule-based and WebLLM AI for chat queries.
// Usage: Include this script after loading WebLLM and your app.js

window.webllmEngine = null;
window.webllmEnabled = false;

// Load WebLLM only if user enables it
window.enableWebLLM = async function() {
  if (window.webllmEngine) {
    window.webllmEnabled = true;
    return;
  }
  if (!window.mlc) {
    // Load WebLLM script dynamically
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@mlc-ai/web-llm/dist/index.min.js';
    script.onload = async () => {
      window.webllmEngine = new window.mlc.WebLLM.Engine();
      await window.webllmEngine.loadModel("Llama-2-7b-chat-hf-q4f16_1");
      window.webllmEnabled = true;
      alert('WebLLM loaded! You can now use Smart AI mode.');
    };
    document.body.appendChild(script);
  } else {
    window.webllmEngine = new window.mlc.WebLLM.Engine();
    await window.webllmEngine.loadModel("Llama-2-7b-chat-hf-q4f16_1");
    window.webllmEnabled = true;
    alert('WebLLM loaded! You can now use Smart AI mode.');
  }
};

// Hybrid AI query handler
window.hybridAIQuery = async function(query, features, namedLocations) {
  if (window.webllmEnabled && window.webllmEngine) {
    // Use WebLLM for natural language
    const reply = await window.webllmEngine.chat.completions.create({
      messages: [{ role: "user", content: query }]
    });
    return { mode: 'webllm', result: reply.choices[0].message.content };
  } else if (window.handleUserQuery) {
    // Use rule-based AI
    const result = await window.handleUserQuery(query, features, namedLocations);
    return { mode: 'rule', result };
  } else {
    return { mode: 'none', result: 'No AI available.' };
  }
};
