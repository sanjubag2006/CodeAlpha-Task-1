class Calculator {
    constructor() {
        this.currentNumber = '0';
        this.previousNumber = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.memory = 0;
        
        this.expressionElement = document.getElementById('expression');
        this.resultElement = document.getElementById('result');
        
        this.initializeEventListeners();
        this.initializeKeyboardListeners();
        this.updateDisplay();
    }

    initializeEventListeners() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.animateButton(button);
                this.handleButtonClick(e.target);
            });
        });
    }

    initializeKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            this.handleKeyPress(e.key);
        });
    }

    animateButton(button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 150);
    }

    handleKeyPress(key) {
        const button = this.getButtonByKey(key);
        if (button) {
            this.animateButton(button);
            this.handleButtonClick(button);
        }
    }

    getButtonByKey(key) {
        const keyMap = {
            '0': '[data-number="0"]',
            '1': '[data-number="1"]',
            '2': '[data-number="2"]',
            '3': '[data-number="3"]',
            '4': '[data-number="4"]',
            '5': '[data-number="5"]',
            '6': '[data-number="6"]',
            '7': '[data-number="7"]',
            '8': '[data-number="8"]',
            '9': '[data-number="9"]',
            '+': '[data-operator="+"]',
            '-': '[data-operator="-"]',
            '*': '[data-operator="*"]',
            '/': '[data-operator="/"]',
            'Enter': '[data-action="equals"]',
            '=': '[data-action="equals"]',
            '.': '[data-action="decimal"]',
            'Escape': '[data-action="clear"]',
            'c': '[data-action="clear"]',
            'C': '[data-action="clear"]',
            '%': '[data-action="percent"]',
            'Backspace': '[data-action="backspace"]'
        };

        return document.querySelector(keyMap[key]);
    }

    handleButtonClick(button) {
        if (button.dataset.number) {
            this.inputNumber(button.dataset.number);
        } else if (button.dataset.operator) {
            this.inputOperator(button.dataset.operator);
        } else if (button.dataset.action) {
            this.handleAction(button.dataset.action);
        }
        this.updateDisplay();
    }

    inputNumber(number) {
        if (this.waitingForOperand) {
            this.currentNumber = number;
            this.waitingForOperand = false;
        } else {
            this.currentNumber = this.currentNumber === '0' ? number : this.currentNumber + number;
        }
        this.clearOperatorActive();
    }

    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentNumber);

        if (this.previousNumber === '') {
            this.previousNumber = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousNumber || 0;
            const newValue = this.calculate(currentValue, inputValue, this.operator);

            this.currentNumber = `${parseFloat(newValue.toFixed(7))}`;
            this.previousNumber = newValue;
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
        this.setOperatorActive(nextOperator);
    }

    calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                if (secondOperand === 0) {
                    this.showError('Cannot divide by zero');
                    return firstOperand;
                }
                return firstOperand / secondOperand;
            default:
                return secondOperand;
        }
    }

    setOperatorActive(operator) {
        this.clearOperatorActive();
        const button = document.querySelector(`[data-operator="${operator}"]`);
        if (button) {
            button.classList.add('active');
        }
    }

    clearOperatorActive() {
        document.querySelectorAll('.operator.active').forEach(btn => {
            btn.classList.remove('active');
        });
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'equals':
                this.equals();
                break;
            case 'decimal':
                this.inputDecimal();
                break;
            case 'negate':
                this.negate();
                break;
            case 'percent':
                this.percent();
                break;
            case 'sqrt':
                this.sqrt();
                break;
            case 'square':
                this.square();
                break;
            case 'reciprocal':
                this.reciprocal();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'mc':
                this.memoryClear();
                break;
            case 'mr':
                this.memoryRecall();
                break;
            case 'ms':
                this.memoryStore();
                break;
            case 'm+':
                this.memoryAdd();
                break;
            case 'm-':
                this.memorySubtract();
                break;
        }
    }

    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentNumber = '0.';
            this.waitingForOperand = false;
        } else if (this.currentNumber.indexOf('.') === -1) {
            this.currentNumber += '.';
        }
    }

    clear() {
        this.currentNumber = '0';
        this.previousNumber = '';
        this.operator = null;
        this.waitingForOperand = false;
        this.clearOperatorActive();
        this.clearError();
    }

    backspace() {
        if (this.currentNumber.length > 1) {
            this.currentNumber = this.currentNumber.slice(0, -1);
        } else {
            this.currentNumber = '0';
        }
    }

    equals() {
        const inputValue = parseFloat(this.currentNumber);

        if (this.previousNumber !== '' && this.operator) {
            const newValue = this.calculate(this.previousNumber, inputValue, this.operator);
            this.currentNumber = `${parseFloat(newValue.toFixed(7))}`;
            this.previousNumber = '';
            this.operator = null;
            this.waitingForOperand = true;
            
            // Show calculation in expression
            this.showCalculationResult();
        }
        this.clearOperatorActive();
    }

    showCalculationResult() {
        this.expressionElement.classList.add('small');
        this.resultElement.classList.add('large');
        
        setTimeout(() => {
            this.expressionElement.classList.remove('small');
            this.resultElement.classList.remove('large');
        }, 2000);
    }

    negate() {
        if (this.currentNumber !== '0') {
            this.currentNumber = this.currentNumber.startsWith('-') ? 
                this.currentNumber.substring(1) : 
                '-' + this.currentNumber;
        }
    }

    percent() {
        const number = parseFloat(this.currentNumber);
        this.currentNumber = `${number / 100}`;
        this.waitingForOperand = true;
    }

    sqrt() {
        const number = parseFloat(this.currentNumber);
        if (number < 0) {
            this.showError('Invalid input');
            return;
        }
        this.currentNumber = `${Math.sqrt(number)}`;
        this.waitingForOperand = true;
    }

    square() {
        const number = parseFloat(this.currentNumber);
        this.currentNumber = `${number * number}`;
        this.waitingForOperand = true;
    }

    reciprocal() {
        const number = parseFloat(this.currentNumber);
        if (number === 0) {
            this.showError('Cannot divide by zero');
            return;
        }
        this.currentNumber = `${1 / number}`;
        this.waitingForOperand = true;
    }

    memoryClear() {
        this.memory = 0;
    }

    memoryRecall() {
        this.currentNumber = `${this.memory}`;
        this.waitingForOperand = true;
    }

    memoryStore() {
        this.memory = parseFloat(this.currentNumber);
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentNumber);
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentNumber);
    }

    showError(message) {
        this.currentNumber = message;
        this.resultElement.classList.add('error');
        
        setTimeout(() => {
            this.clearError();
            this.currentNumber = '0';
            this.updateDisplay();
        }, 2000);
    }

    clearError() {
        this.resultElement.classList.remove('error');
    }

    updateDisplay() {
        // Build expression string
        let expression = '';
        if (this.previousNumber !== '') {
            expression = `${this.previousNumber}`;
            if (this.operator) {
                const operatorSymbol = this.getOperatorSymbol(this.operator);
                expression += ` ${operatorSymbol}`;
                if (!this.waitingForOperand) {
                    expression += ` ${this.currentNumber}`;
                }
            }
        }
        
        this.expressionElement.textContent = expression;
        this.resultElement.textContent = this.currentNumber;
    }

    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});