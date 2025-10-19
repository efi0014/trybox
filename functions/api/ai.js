// File: /functions/api/ai.js (非流式、最稳定版本)

export async function onRequestPost({ request, env }) {
  try {
    // 确保 AI 绑定存在
    if (!env.AI) {
      throw new Error("AI binding not configured.");
    }
    
    const { messages, model } = await request.json();

    // 如果没有消息，则返回错误
    if (!messages) {
      throw new Error("'messages' is required in the request body.");
    }

    const modelToUse = model || '@cf/meta/llama-3-8b-instruct';

    // **重要改变**：不再使用 stream: true
    const aiResponse = await env.AI.run(
        modelToUse, 
        {
            messages
            // stream: false is the default
        }
    );
    
    // 直接返回完整的 AI 响应
    return new Response(JSON.stringify({ response: aiResponse.response }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    // 如果出错，以标准 JSON 格式返回 500 错误
    console.error('AI Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
