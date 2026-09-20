const display = document.getElementById("display");
const history = document.getElementById("history");

let expression = "";
let justCalculated = false;


// Add numbers and decimal point
function appendNumber(value) {

    if (justCalculated) {
        expression = "";
        history.textContent = "";
        justCalculated = false;
    }

    // Prevent multiple decimal points
    if (value === ".") {

        const currentNumber =
            expression.split(/[+\-*/%]/).pop();

        if (currentNumber.includes(".")) {
            return;
        }

        if (currentNumber === "") {
            expression += "0";
        }
    }

    expression += value;

    display.value = expression || "0";
}


// Add mathematical operators
function appendOperator(operator) {

    if (expression === "") {
        return;
    }

    justCalculated = false;

    // Replace previous operator
    if (/[+\-*/%]$/.test(expression)) {
        expression = expression.slice(0, -1);
    }

    expression += operator;

    display.value = expression;
}


// Clear calculator
function clearDisplay() {

    expression = "";

    history.textContent = "";

    display.value = "0";

    justCalculated = false;
}


// Delete last character
function deleteLast() {

    if (justCalculated) {
        clearDisplay();
        return;
    }

    expression = expression.slice(0, -1);

    display.value = expression || "0";
}


// Calculate result
function calculate() {

    if (!expression) {
        return;
    }

    // Don't calculate incomplete expressions
    if (/[+\-*/%]$/.test(expression)) {
        return;
    }

    try {

        const result =
            Function('"use strict"; return (' + expression + ')')();

        if (!Number.isFinite(result)) {

            display.value = "Error";

            expression = "";

            return;
        }

        history.textContent = expression + " =";

        display.value =
            Number.isInteger(result)
                ? result
                : Number(result.toFixed(10));

        expression = String(result);

        justCalculated = true;

    } catch {

        display.value = "Error";

        expression = "";
    }
}


// Keyboard support
document.addEventListener("keydown", function (event) {

    const key = event.key;

    // Numbers and decimal
    if (/^[0-9.]$/.test(key)) {

        appendNumber(key);
    }

    // Operators
    else if (["+", "-", "*", "/", "%"].includes(key)) {

        appendOperator(key);
    }

    // Enter or =
    else if (key === "Enter" || key === "=") {

        calculate();
    }

    // Escape
    else if (key === "Escape") {

        clearDisplay();
    }

    // Backspace
    else if (key === "Backspace") {

        deleteLast();
    }

});