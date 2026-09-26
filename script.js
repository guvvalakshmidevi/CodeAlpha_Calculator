/* ==============================
   ELEMENTS
============================== */

const currentDisplay =
    document.getElementById("currentDisplay");

const previousDisplay =
    document.getElementById("previousDisplay");

const buttons =
    document.querySelectorAll(".btn");

const historyList =
    document.getElementById("historyList");

const clearHistoryBtn =
    document.getElementById("clearHistory");

const themeToggle =
    document.getElementById("themeToggle");


/* ==============================
   VARIABLES
============================== */

let currentValue = "";
let previousValue = "";
let operator = null;

let history = [];


/* ==============================
   UPDATE DISPLAY
============================== */

function updateDisplay() {

    currentDisplay.textContent =
        currentValue || "0";

    previousDisplay.textContent =
        previousValue && operator
            ? `${previousValue} ${getOperatorSymbol(operator)}`
            : "0";
}


/* ==============================
   OPERATOR SYMBOL
============================== */

function getOperatorSymbol(operation) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operation] || operation;
}


/* ==============================
   NUMBER INPUT
============================== */

function appendNumber(number) {

    if (number === "." &&
        currentValue.includes(".")) {
        return;
    }

    if (number === "." &&
        currentValue === "") {
        currentValue = "0";
    }

    if (currentValue === "0" &&
        number !== ".") {
        currentValue = "";
    }

    currentValue += number;

    updateDisplay();
}


/* ==============================
   OPERATOR
============================== */

function chooseOperator(selectedOperator) {

    if (currentValue === "" &&
        previousValue === "") {
        return;
    }

    if (currentValue === "" &&
        previousValue !== "") {
        operator = selectedOperator;

        updateDisplay();

        return;
    }

    if (previousValue !== "" &&
        operator !== null) {

        calculateResult();
    }

    previousValue = currentValue;

    currentValue = "";

    operator = selectedOperator;

    updateDisplay();
}


/* ==============================
   CALCULATE
============================== */

function calculateResult() {

    if (
        previousValue === "" ||
        currentValue === "" ||
        operator === null
    ) {
        return;
    }

    const first =
        parseFloat(previousValue);

    const second =
        parseFloat(currentValue);

    let result;


    switch (operator) {

        case "+":
            result = first + second;
            break;

        case "-":
            result = first - second;
            break;

        case "*":
            result = first * second;
            break;

        case "/":

            if (second === 0) {

                currentDisplay.textContent =
                    "Cannot divide by 0";

                previousDisplay.textContent =
                    "Error";

                resetCalculator();

                return;
            }

            result = first / second;

            break;

        default:
            return;
    }


    result =
        Number(result.toFixed(10))
            .toString();


    const expression =
        `${previousValue} ${getOperatorSymbol(operator)} ${currentValue}`;


    addToHistory(
        expression,
        result
    );


    currentValue = result;

    previousValue = "";

    operator = null;

    updateDisplay();
}


/* ==============================
   PERCENTAGE
============================== */

function percentage() {

    if (currentValue === "") {
        return;
    }

    currentValue =
        (parseFloat(currentValue) / 100)
            .toString();

    updateDisplay();
}


/* ==============================
   DELETE
============================== */

function deleteLast() {

    currentValue =
        currentValue.slice(0, -1);

    updateDisplay();
}


/* ==============================
   CLEAR
============================== */

function resetCalculator() {

    currentValue = "";

    previousValue = "";

    operator = null;

    updateDisplay();
}


/* ==============================
   HISTORY
============================== */

function addToHistory(
    expression,
    result
) {

    history.unshift({
        expression,
        result
    });


    if (history.length > 10) {
        history.pop();
    }

    renderHistory();
}


function renderHistory() {

    historyList.innerHTML = "";


    if (history.length === 0) {

        historyList.innerHTML =
            `<p class="empty-history">
                No calculations yet
             </p>`;

        return;
    }


    history.forEach((item) => {

        const historyItem =
            document.createElement("div");

        historyItem.className =
            "history-item";


        historyItem.innerHTML = `
            <div class="history-expression">
                ${item.expression}
            </div>

            <div class="history-result">
                = ${item.result}
            </div>
        `;


        historyItem.addEventListener(
            "click",
            () => {

                currentValue =
                    item.result;

                previousValue = "";

                operator = null;

                updateDisplay();
            }
        );


        historyList.appendChild(
            historyItem
        );

    });
}


/* ==============================
   CLEAR HISTORY
============================== */

clearHistoryBtn.addEventListener(
    "click",
    () => {

        history = [];

        renderHistory();

    }
);


/* ==============================
   BUTTON EVENTS
============================== */

buttons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const number =
                button.dataset.number;

            const operation =
                button.dataset.operation;

            const action =
                button.dataset.action;


            if (number !== undefined) {

                appendNumber(number);

            }


            if (operation !== undefined) {

                chooseOperator(operation);

            }


            if (action === "clear") {

                resetCalculator();

            }


            if (action === "delete") {

                deleteLast();

            }


            if (action === "percentage") {

                percentage();

            }


            if (action === "calculate") {

                calculateResult();

            }

        }
    );

});


/* ==============================
   KEYBOARD SUPPORT
============================== */

document.addEventListener(
    "keydown",
    (event) => {

        const key = event.key;


        if (
            !isNaN(key) ||
            key === "."
        ) {

            appendNumber(key);

            return;
        }


        if (
            key === "+" ||
            key === "-" ||
            key === "*" ||
            key === "/"
        ) {

            chooseOperator(key);

            return;
        }


        if (key === "%") {

            percentage();

            return;
        }


        if (
            key === "Enter" ||
            key === "="
        ) {

            event.preventDefault();

            calculateResult();

            return;
        }


        if (key === "Backspace") {

            deleteLast();

            return;
        }


        if (key === "Escape") {

            resetCalculator();

        }

    }
);


/* ==============================
   THEME BUTTON
============================== */

let darkMode = true;

themeToggle.addEventListener(
    "click",
    () => {

        darkMode = !darkMode;

        if (darkMode) {

            document.documentElement.style
                .setProperty("--bg", "#020b20");

            document.documentElement.style
                .setProperty("--card", "#0a1730");

            themeToggle.textContent = "☀";

        } else {

            document.documentElement.style
                .setProperty("--bg", "#e8eef8");

            document.documentElement.style
                .setProperty("--card", "#ffffff");

            document.documentElement.style
                .setProperty("--text", "#101827");

            themeToggle.textContent = "☾";
        }

    }
);


/* ==============================
   INITIAL DISPLAY
============================== */

updateDisplay();