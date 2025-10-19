// File: /functions/api/ai.js (确保使用这个最稳定的版本)

export async function onRequestPost({ request, env }) {
  try {
    if (!env.AI) {
      throw new Error("AI binding is not configured in Cloudflare Pages settings.");
    }
    
    const { messages, model } = await request.json();

    if (!messages) {
      throw new Error("'messages' is required in the request body.");
    }

    const modelToUse = model || '@cf/meta/llama-3-8b-instruct';

    // **重要**: 确保这里没有 stream: true
    const aiResponse = await env.AI.run(
        modelToUse, 
        {
            messages
        }
    );
    
    // 直接返回完整的 JSON 响应
    return new Response(JSON.stringify({ response: aiResponse.response }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('AI Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
