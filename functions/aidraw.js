/**
 * 【最终修正版 v2】
 * 此版本修复了因上一版代码被截断而导致的 "Unterminated string literal" 构建错误。
 * 这是完整且正确的代码。
 */

// ===================================================================================
// 第一部分：完整的前端 HTML 内容
// ===================================================================================
const htmlContent = `
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <title>AI绘画</title>
    <style>
        body, html { margin: 0; padding: 0; height: 100%; width: 100%; display: flex; flex-direction: column; }
        .box { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, #e6f5ff, #ffe6f5); background-position: center; background-repeat: no-repeat; background-size: cover; }
        .card { position: absolute; inset: 2% auto; max-width: 80%; width: 90%; backdrop-filter: blur(21px) saturate(180%); -webkit-backdrop-filter: blur(21px) saturate(180%); background-color: rgba(255, 255, 255, 0.53); border-radius: 10px; border: 1px solid rgba(209, 213, 219, 0.3); padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 1rem; left: 50%; transform: translateX(-50%); text-align: center; overflow: hidden; }
        h1 { font-size: 2.5em; margin-bottom: 1rem; }
        img { width: 100%; max-width: 400px; height: auto; margin-bottom: 1rem; }
        select, input[type="text"] { width: 100%; padding: 10px; margin-bottom: 1rem; border: 1px solid #ccc; border-radius: 5px; line-height: 3.5; background-color: rgba(255, 255, 255, 0.1); backdrop-filter: blur(30px) saturate(180%); outline: none; transition: background-color 0.3s ease; }
        select:focus, input[type="text"]:focus { background-color: rgba(255, 255, 255, 0.9); }
        button.submit-btn { background: linear-gradient(to bottom, #ade8f4, #6cb3e3); border-radius: 5px; color: white; padding: 10px 20px; font-family: Arial, sans-serif; cursor: pointer; border: none; transition: all 0.3s ease; }
        button.random-btn { background: white; color: #007BFF; border-radius: 5px; padding: 5px 40px; font-family: Arial, sans-serif; cursor: pointer; border: 1px solid #007BFF; transition: all 0.3s ease; }
        button.submit-btn:hover { opacity: 0.6; }
        @media screen and (max-width: 600px) {
            .card { inset: 10% auto; width: 90%; left: 50%; transform: translateX(-50%); }
            select, input[type="text"] { width: 90%; line-height: 7; }
        }
    </style>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const submitButton = document.getElementById('submitButton');
            submitButton.addEventListener('click', async function (event) {
                event.preventDefault();
                submitButton.disabled = true;
                submitButton.textContent = '正在生成...';
                const model = document.getElementById('model').value;
                const prompt = document.getElementById('prompt').value;

                if (prompt === '') {
                    alert('请输入描述词');
                    submitButton.textContent = '提交';
                    submitButton.disabled = false;
                    return;
                }
                const blobToBase64 = (blob) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onerror = reject;
                    reader.onload = () => { resolve(reader.result); };
                    reader.readAsDataURL(blob);
                });

                try {
                    const controller = new AbortController();
                    const signal = controller.signal;
                    setTimeout(() => { controller.abort(); }, 30000);
                    const response = await fetch(window.location.href, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 'model': model, 'prompt': prompt }),
                        signal: signal
                    });

                    if (!response.ok) {
                        throw new Error('请求失败：' + response.status + ' ' + response.statusText);
                    }
                    const blob = await response.blob();
                    const imageBase64 = await blobToBase64(blob);
                    document.getElementById('aiImage').src = imageBase64;
                } catch (error) {
                    if (error.name === 'AbortError') {
                        alert('服务器连接超时，请稍后重试。');
                    } else {
                        console.error('Error:', error);
                        alert('生成过程中发生错误，请重试。');
                    }
                } finally {
                    submitButton.textContent = '提交';
                    submitButton.disabled = false;
                }
            });
            document.getElementById('randomButton').addEventListener('click', function () {
                var prompts = ['1girl,solo,cute,in glass,atmosphere_X,best quality,beautiful,extremely detailed,masterpiece,very aesthetic', 'a girl,,nahida,light,full body,symbol eye, nahida,1girl,fair_skin,in summer,day,in a meadow,sky,cirrus_fibratus,intense shadows,blonde hair,pleated_dress,collared_shirt,blue eyes,long hair,fang,smile', '((best quality)), ((masterpiece)),A Chinese couple in Hanfu embracing on an arch bridge, a sky full of rose petals, a romantic atmosphere, a huge moon, colorful clouds, clouds, ethereal, reflections of water, a mirage, a breeze,(Chinese ink style)', 'simple background, flower, signature, no humans, sparkle, leaf, plant, white flower, black background, still life, embroidery', ' 1 girl,(orange light effect),hair ornament,jewelry,looking at viewer,flower,floating hair,water,underwater,air bubble,submerged, 80sDBA style', 'masterpiece,best quality,high quality,loli,1girl, solo, long hair, looking at viewer, blush, bangs, thighhighs, dress, ribbon, brown eyes, very long hair, closed mouth, standing, full body, yellow eyes, white hair, short sleeves, outdoors, sky,no shoes, day, puffy sleeves, looking back, cloud, from behind, white dress, white thighhighs, red ribbon, tree, blue sky, puffy short sleeves, petals, cherry blossoms, skirt hold,', ' 1 girl,Clothes in the shape of snowflake,render,technology, (best quality) (masterpiece), (highly in detailed), 4K,Official art, unit 8 k wallpaper, ultra detailed, masterpiece, best quality, extremely detailed,CG,low saturation, as style, line art', ' best quality,masterpiece,sculpture,wonderland,,chinese fairy tales,an old man,boiling tea,drink tea,a painting of history floating and curved in the background,mountain,white cloud,chinese style courtyard,pavilion,chinese tea mountains,, Chinese architecture, trees,,white hair ,', ' 1girl, absurdres, arrow_(symbol), ata-zhubo, bicycle, billboard, black_eyes, black_footwear, black_hair, blue_sky, bridge, building, car, cardigan, city, cityscape, commentary_request, crosswalk, day, fire_hydrant, folding_bicycle, grey_cardigan, highres, lamppost, loafers, motor_vehicle, necktie, original, overpass, power_lines, railing, red_necktie, red_skirt, road, road_sign, scenery, school_uniform, shoes, short_hair, sign, skirt, sky, solo, stairs, standing, street, traffic_cone, traffic_light, truck, utility_pole, vending_machine', '1girl, solo, elf, golden eyes, glowing eyes, slit_pupils, silver hair, green gradient hair, long hair, blunt bangs, brown capelet, frilled shirt, long sleeves, green brooch, pouch, belt, brown gloves, upper body, (chibi:0.4), (close-up), (broken:1.3),  half-closed eye, expressionless, from side,  depth of field, fallen leaves, side light, gingko, tree, masterpiece,bestquality, line art,', 'flower, outdoors, sky, tree, no humans, window, bird, building, scenery, house,oil painting style'];
                var randomIndex = Math.floor(Math.random() * prompts.length);
                document.getElementById('prompt').value = prompts[randomIndex];
            });
        });
    </script>
</head>
<body>
<div class="box">
    <div class="card">
        <h1>AI绘画</h1>
        <img id="aiImage" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAIAAAB7GkOtAAADEUlEQVR4nO3BgQAAAADDoPlTX+EAVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBvArQAAVkUTe8AAAAASUVORK5CYII=" alt="AI生成的图片">
        <select id="model">
            <option value="dreamshaper-8-lcm">dreamshaper-8-lcm</option>
            <option value="stable-diffusion-xl-base-1.0">stable-diffusion-xl-base-1.0</option>
            <option value="stable-diffusion-xl-lightning">stable-diffusion-xl-lightning</option>
            <option value="stable-diffusion-v1-5-inpainting">stable-diffusion-v1-5-inpainting</option>
            <option value="phoenix-1.0">phoenix-1.0</option>
        </select>
        <input type="text" id="prompt" placeholder="请输入描述词...">
        <button type="button" class="random-btn" id="randomButton">随机提示词</button>
        <button type="button" class="submit-btn" id="submitButton">提交</button>
    </div>
</div>
</body>
</html>
`; // <-- 这一行就是之前缺失的结尾反引号

// ===================================================================================
// 第二部分：后端逻辑 (保持不变)
// ===================================================================================

export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method === 'POST') {
    const data = await request.json();
    let model = '@cf/lykon/dreamshaper-8-lcm';

    if ('prompt' in data && 'model' in data) {
      switch(data.model) {
        case 'dreamshaper-8-lcm': model = '@cf/lykon/dreamshaper-8-lcm'; break;
        case 'stable-diffusion-xl-base-1.0': model = '@cf/stabilityai/stable-diffusion-xl-base-1.0'; break;
        case 'stable-diffusion-xl-lightning': model = '@cf/bytedance/stable-diffusion-xl-lightning'; break;
        case 'stable-diffusion-v1-5-inpainting': model = '@cf/runwayml/stable-diffusion-v1-5-inpainting'; break;
        case 'phoenix-1.0': model = '@cf/leonardo/phoenix-1.0'; break;
      }
      const inputs = { prompt: data.prompt };
      const response = await env.AI.run(model, inputs);
      return new Response(response, { headers: { ...corsHeaders, 'content-type': 'image/png' } });
    } else {
      return new Response('Missing prompt or model', { status: 400, headers: corsHeaders });
    }
  } else {
    return new Response(htmlContent, { headers: { ...corsHeaders, "content-type": "text/html;charset=UTF-8" } });
  }
}
