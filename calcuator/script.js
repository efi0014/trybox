document.addEventListener('DOMContentLoaded', function() {
    const displayElement = document.getElementById('display');

    // 将函数挂载到window对象上，以便全局可访问
    window.appendToDisplay = function(value) {
        if (displayElement.innerText === '0' && value !== '.') {
            displayElement.innerText = value;
        } else {
            displayElement.innerText += value;
        }
    };

    window.clearDisplay = function() {
        displayElement.innerText = '0';
    };

    window.deleteLast = function() {
        if (displayElement.innerText.length === 1) {
            clearDisplay();
        } else {
            displayElement.innerText = displayElement.innerText.slice(0, -1);
        }
    };

    window.calculate = function() {
        try {
            let expression = displayElement.innerText;
            expression = expression.replace(/π/g, 'pi').replace(/×/g, '*').replace(/÷/g, '/');
            
            // 直接使用全局的math对象，mathjs库会提供这个对象
            const result = math.evaluate(expression);
            displayElement.innerText = Number.isInteger(result) ? result : result.toFixed(6);
        } catch (error) {
            displayElement.innerText = '错误';
            setTimeout(() => {
                clearDisplay();
            }, 1500);
        }
    };
});
