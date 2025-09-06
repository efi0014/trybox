// 使用强大的 math.js 库来解析和计算表达式
const math = mathjs;

// 获取显示屏元素
const displayElement = document.getElementById('display');

// 向显示屏追加输入
function appendToDisplay(value) {
    if (displayElement.innerText === '0' && value !== '.') {
        displayElement.innerText = value;
    } else {
        displayElement.innerText += value;
    }
}

// 清空显示屏
function clearDisplay() {
    displayElement.innerText = '0';
}

// 删除最后一个字符
function deleteLast() {
    if (displayElement.innerText.length === 1) {
        clearDisplay();
    } else {
        displayElement.innerText = displayElement.innerText.slice(0, -1);
    }
}

// 进行计算
function calculate() {
    try {
        // 替换显示内容中的符号为 math.js 可识别的符号
        let expression = displayElement.innerText;
        expression = expression.replace(/π/g, 'pi').replace(/×/g, '*').replace(/÷/g, '/');
        
        // 使用 math.evaluate 计算表达式
        const result = math.evaluate(expression);
        
        // 显示结果，如果是整数则显示整数，小数则保留一定位数
        displayElement.innerText = Number.isInteger(result) ? result : result.toFixed(6);
    } catch (error) {
        // 如果计算出错（如表达式无效），显示错误信息
        displayElement.innerText = '错误';
        setTimeout(() => {
            clearDisplay();
        }, 1500);
    }
}