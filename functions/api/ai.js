// File: /functions/api/ai.js (Robust Streaming Version)

export async function onRequestPost({ request, env }) {
  try {
    if (!env.AI) {
      throw new Error("AI binding is not configured in Cloudflare Pages settings.");
    }
    
    const { messages, model } = await request.json();

    if (!messages) {
      throw new Error("'messages' field is required.");
    }

    const modelToUse = model || '@cf/meta/llama-3-8b-instruct';

    // 使用 ReadableStream 来完全控制流
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          const aiStream = await env.AI.run(modelToUse, {
            messages,
            stream: true,
          });

          for await (const chunk of aiStream) {
            // 确保只发送有内容的块
            if (chunk.response) {
              const payload = `data: ${JSON.stringify(chunk)}\n\n`;
              controller.enqueue(encoder.encode(payload));
            }
          }
          
          // 确保在流结束后发送 [DONE] 信号
          controller.enqueue(encoder.encode('data: [DONE]\N\n'));

        } catch (e) {
          // 如果在流处理中发生错误，通过流发送错误信息
          const errorPayload = `data: ${JSON.stringify({ error: e.message })}\n\n`;
          controller.enqueue(encoder.encode(errorPayload));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          console.error("Error during AI stream:", e);
        } finally {
          // 确保流总是被关闭
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    // 捕获请求解析等初始错误
    console.error('Initial Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
