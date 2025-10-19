// File: /functions/api/ai.js - 带诊断日志的版本

export async function onRequestPost({ request, env }) {
  console.log('Function triggered: onRequestPost');

  try {
    const { messages, model } = await request.json();
    console.log('Received model:', model);
    console.log('Received messages:', JSON.stringify(messages));

    // 如果前端没有指定模型，则使用一个默认模型
    const modelToUse = model || '@cf/meta/llama-3-8b-instruct';
    console.log('Model to use:', modelToUse);
    
    // 检查 AI 绑定是否存在
    if (!env.AI) {
        console.error('AI binding is missing. Please check your Pages project settings.');
        throw new Error("AI binding not configured.");
    }

    console.log('Calling env.AI.run...');
    const stream = await env.AI.run(
        modelToUse, 
        {
            messages,
            stream: true
        }
    );
    console.log('env.AI.run call completed. Stream object received.');
    
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const encoder = new TextEncoder();

    (async () => {
        console.log('Starting to process the AI stream...');
        let chunkReceived = false;
        for await (const chunk of stream) {
            chunkReceived = true;
            console.log('Received a chunk from AI stream.');
            if (chunk.response) {
                await writer.write(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
            }
        }
        
        // 这个日志非常关键！
        if (!chunkReceived) {
            console.warn('Warning: AI stream was empty. No chunks were received.');
        }

        console.log('AI stream finished. Sending [DONE] signal.');
        await writer.write(encoder.encode('data: [DONE]\n\n'));
        writer.close();
        console.log('Writer closed.');
    })();

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    });

  } catch (error) {
    console.error('AI Function Error:', error.message);
    // 即使在 catch 块中，也返回一个 SSE 格式的错误，以便前端可以优雅地处理
    const errorPayload = `data: ${JSON.stringify({ error: error.message })}\n\ndata: [DONE]\n\n`;
    return new Response(errorPayload, {
      status: 200, // 返回200，但 payload 包含错误信息
      headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
      },
    });
  }
}
