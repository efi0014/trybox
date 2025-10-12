/**
 * 【修正版】
 * 这个文件修复了原代码中由于嵌套模板字符串 `${...}` 导致的语法冲突问题。
 * 功能和逻辑与之前完全相同。
 */

// ===================================================================================
// 第一部分：前端 HTML 内容 (内部JS语法已修正)
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
                        // 【已修正】: 使用普通字符串拼接，避免语法冲突
                        throw new Error('请求失败：' + response.status + ' ' + response.statusText);
                    }

                    const blob = await response.blob();
                    const imageBase64 = await blobToBase64(blob);

                    // 【已修正】: 直接赋值，因为imageBase64本身就是完整的 "data:image/..." 字符串
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

            document.getElementById('randomButton').addEventListener('click', function
