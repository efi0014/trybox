// File: /functions/api/ai.js

export async function onRequestPost({ request, env }) {
  try {
    // 从请求中解构出消息和选择的模型
    const { messages, model } = await request.json();

    // 如果前端没有指定模型，则使用一个默认模型
    const modelToUse = model || '@cf/meta/llama-3-8b-instruct';

    const stream = await env.AI.run(
        modelToUse, 
        {
            messages,
            stream: true // 开启流式响应
        }
    );
    
    // 使用 TransformStream 将 AI 响应流式传输到前端
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    // 异步函数，用于读取 AI 输出并写入响应流
    (async () => {
        for await (const chunk of stream) {
            // 将每个数据块格式化为 SSE 格式
            if (chunk.response) {
                await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
            }
        }
        // 当 AI 流结束后，发送一个 [DONE] 信号
        await writer.write(encoder.encode('data: [DONE]\n\n'));
        writer.close();
    })();

    // 将可读流返回给客户端
    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    });

  } catch (error) {
    console.error('AI Function Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
