document.addEventListener('DOMContentLoaded', () => {
    // --- 通用：选项卡切换逻辑 ---
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(item => item.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // --- 模块 1: 计算器 ---
    const calculator = document.querySelector('.calculator-grid');
    const display = document.getElementById('calc-display');
    let displayValue = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;

    function updateDisplay() {
        display.textContent = displayValue;
    }
    updateDisplay();

    calculator.addEventListener('click', (event) => {
        const { target } = event;
        if (!target.matches('button')) return;

        const { key } = target.dataset;
        const displayedNum = display.textContent;

        if (!isNaN(parseInt(key))) { // 数字键
            if (waitingForSecondOperand) {
                displayValue = key;
                waitingForSecondOperand = false;
            } else {
                displayValue = displayValue === '0' ? key : displayValue + key;
            }
        } else if (key === '.') { // 小数点
            if (!displayValue.includes('.')) {
                displayValue += '.';
            }
        } else if (['+', '-', '*', '/'].includes(key)) { // 运算符
             handleOperator(key);
        } else if (key === '=') {
            if (operator && firstOperand !== null) {
                const result = calculate(firstOperand, parseFloat(displayValue), operator);
                displayValue = `${parseFloat(result.toFixed(7))}`;
                operator = null;
                firstOperand = null;
            }
        } else if (key === 'clear') {
            displayValue = '0';
            firstOperand = null;
            operator = null;
            waitingForSecondOperand = false;
        } else if (key === 'sign') {
            displayValue = `${parseFloat(displayValue) * -1}`;
        } else if (key === '%') {
            displayValue = `${parseFloat(displayValue) / 100}`;
        } else { // 科学计算
            try {
                let expression = '';
                switch(key) {
                    case 'sin': expression = `sin(${displayValue} deg)`; break;
                    case 'cos': expression = `cos(${displayValue} deg)`; break;
                    case 'tan': expression = `tan(${displayValue} deg)`; break;
                    case 'log': expression = `log10(${displayValue})`; break;
                    case 'sqrt': expression = `sqrt(${displayValue})`; break;
                    case '^': handleOperator('^'); return; // 特殊处理
                }
                const result = math.evaluate(expression);
                displayValue = `${parseFloat(result.toFixed(7))}`;
            } catch {
                displayValue = 'Error';
            }
        }
        updateDisplay();
    });
    
    function handleOperator(nextOperator) {
        const value = parseFloat(displayValue);
        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }
        if (firstOperand === null) {
            firstOperand = value;
        } else if (operator) {
            const result = calculate(firstOperand, value, operator);
            displayValue = `${parseFloat(result.toFixed(7))}`;
            firstOperand = result;
        }
        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    function calculate(first, second, op) {
        if (op === '+') return first + second;
        if (op === '-') return first - second;
        if (op === '*') return first * second;
        if (op === '/') return first / second;
        if (op === '^') return Math.pow(first, second);
        return second;
    }


    // --- 模块 2: 方程求解器 ---
    const equationInput = document.getElementById('equation-input');
    const solveBtn = document.getElementById('solve-equation-btn');
    const solverResult = document.getElementById('solver-result');

    solveBtn.addEventListener('click', () => {
        const equationStr = equationInput.value;
        if (!equationStr) return;
        try {
            const eq = algebra.parse(equationStr);
            const solutions = eq.solveFor("x");
            let html = '<h3>解:</h3>';
            if (Array.isArray(solutions)) {
                solutions.forEach(s => {
                    html += `<p>x = ${s.toString()}</p>`;
                });
            } else {
                html += `<p>x = ${solutions.toString()}</p>`;
            }
            solverResult.innerHTML = html;
        } catch (error) {
            solverResult.innerHTML = `<p style="color:red;">无法求解: ${error.message}</p>`;
        }
    });

    // --- 模块 3: 函数绘图 ---
    const functionInput = document.getElementById('function-input');
    const plotBtn = document.getElementById('plot-function-btn');

    plotBtn.addEventListener('click', () => {
        const fn = functionInput.value;
        if (!fn) return;
        try {
            functionPlot({
                target: '#plot-container',
                data: [{ fn }],
                grid: true
            });
        } catch (error) {
            alert(`无法绘制函数: ${error.message}`);
        }
    });

    // --- 模块 4: 单位换算 ---
    const unitInput = document.getElementById('unit-input');
    const convertBtn = document.getElementById('convert-unit-btn');
    const converterResult = document.getElementById('converter-result');

    convertBtn.addEventListener('click', () => {
        const conversion = unitInput.value;
        if (!conversion) return;
        try {
            const result = math.evaluate(conversion);
            converterResult.innerHTML = `<p><strong>${result.toString()}</strong></p>`;
        } catch (error) {
            converterResult.innerHTML = `<p style="color:red;">换算失败: ${error.message}</p>`;
        }
    });
});
