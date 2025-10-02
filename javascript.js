let output = document.querySelector(".inp-box")
// given the button functions 
function append(value) {
    output.value += value;
}
function appendTrig(value) {
    output.value += value;
}
function cleardisplay() {
    output.value = "";
}
function backspace() {
    output.value = output.value.slice(0, -1);
}

// 🌟 NEW: State and Conversion for RAD/DEG mode
let isDegreesMode = true; // Start in Degrees mode by default
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

// Selecting the angle mode button (formerly 'RAD')
let angleModeButton = document.getElementById("angle-mode-btn");

// selecting the tignomatric button, column,
let tig = document.getElementById("tig")
let cols = document.querySelector(".column")
let rows = document.querySelector(".row")
let toggled = false; // track state for "tig" button

tig.addEventListener("click", function () {
    if (!toggled) {
        // first click
        cols.style.display = "block";
        rows.style.display = "none";
        reps.style.display = "none";
    } else {
        // second click → reset to original
        cols.style.display = "none";
        rows.style.display = "block";
        reps.style.display = "none";
    }
    toggled = !toggled; // flip state
});

// 🌟 NEW: State and Conversion for RAD/DEG mode
  let originalValue = null;   // stores the original input
  let radToggled = false;     // track if RAD is toggled
  let degToggled = false;     // track if DEG is toggled

  function toggleRad() {
    let val = parseFloat(output.value);

    if (isNaN(val)) return; // do nothing if empty

    if (!radToggled) {
      // First click → store original and convert to radians
      originalValue = val;
      let radians = (val * Math.PI / 180).toFixed(4);
      output.value = radians;
      radToggled = true;
      degToggled = false; // reset DEG toggle
    } else {
      // Second click → restore original value
      output.value = originalValue;
      radToggled = false;
    }
  }

  function toggleDeg() {
    let val = parseFloat(output.value);

    if (isNaN(val)) return; // do nothing if empty

    if (!degToggled) {
      // First click → store original and convert to degrees
      originalValue = val;
      let degrees = (val * 180 / Math.PI).toFixed(4);
      output.value = degrees;
      degToggled = true;
      radToggled = false; // reset RAD toggle
    } else {
      // Second click → restore original value
      output.value = originalValue;
      degToggled = false;
    }
  }
// selecting the replace, button(rot,rote)
let reps = document.querySelector(".replace")

// one shared state
let isReplaced = false;

function toggleReplace() {
        if (!isReplaced) {
            if (reps) reps.style.display = "block";
            if (cols) cols.style.display = "none";
            if (rows) rows.style.display = "none";
        } else {
            if (reps) reps.style.display = "none";
            if (cols) cols.style.display = "block";
            if (rows) rows.style.display = "none";
        }
        isReplaced = !isReplaced;
    }

    let rots = document.getElementById("rot");
    let rotess = document.getElementById("rote");
    if (rots) rots.addEventListener("click", toggleReplace);
    if (rotess) rotess.addEventListener("click", toggleReplace);
// ================== History ==================
let historyBox = null;
let historyVisible = false;
let calcHistory = []; // store calculations

function history() {
    if (!historyBox) {
        historyBox = document.createElement("div");
        historyBox.className = "history-box";
        historyBox.style.width = "90%";
        historyBox.style.minHeight = "100px";
        historyBox.style.margin = "10px auto";
        historyBox.style.padding = "10px";
        historyBox.style.border = "1.5px solid black";
        historyBox.style.borderRadius = "10px";
        historyBox.style.background = "rgba(255,255,255,0.3)";
        historyBox.style.fontSize = "18px";
        historyBox.style.overflowY = "auto";
        historyBox.style.maxHeight = "150px";
        // Assuming there is an element with class ".input" as a container
        let inputContainer = document.querySelector(".input");
        if (inputContainer) {
             inputContainer.appendChild(historyBox);
        } else {
            // Fallback if .input is not found (though it is in the HTML)
            document.body.appendChild(historyBox);
        }
    }

    if (!historyVisible) {
        renderHistory();
        historyBox.style.display = "block";
    } else {
        historyBox.style.display = "none";
    }
    historyVisible = !historyVisible;
}

function renderHistory() {
    if (historyBox) {
        if (calcHistory.length === 0) {
            historyBox.innerHTML = "<b>History:</b><br><i>No calculations yet.</i>";
        } else {
            historyBox.innerHTML = "<b>History:</b><br>" +
                calcHistory.map(item => `${item.expr} = <b>${item.result}</b>`).join("<br>");
        }
    }
}


// ================== Helper Functions for Expression Conversion ==================

// 🌟 FIX: Function to handle standard trig functions and apply mode
function replaceTrigFunctions(expression) {
    const conversion = isDegreesMode ? `* ${DEG_TO_RAD}` : ``;
    
    // Standard trig functions (sin, cos, tan) - apply mode conversion
    expression = expression.replace(/sin\(([^)]+)\)/g, `Math.sin(($1)${conversion})`)
                         .replace(/cos\(([^)]+)\)/g, `Math.cos(($1)${conversion})`)
                         .replace(/tan\(([^)]+)\)/g, `Math.tan(($1)${conversion})`);

    // Inverse trig functions (sin⁻¹, cos⁻¹, tan⁻¹) - apply inverse mode conversion
    const inverseConversion = isDegreesMode ? `* ${RAD_TO_DEG}` : ``;
    expression = expression.replace(/sin⁻¹\(([^)]+)\)/g, `(Math.asin($1)${inverseConversion})`)
                         .replace(/cos⁻¹\(([^)]+)\)/g, `(Math.acos($1)${inverseConversion})`)
                         .replace(/tan⁻¹\(([^)]+)\)/g, `(Math.atan($1)${inverseConversion})`);

    // Hyperbolic functions (no conversion needed)
    expression = expression.replace(/sinh\(([^)]+)\)/g, "Math.sinh($1)")
                         .replace(/cosh\(([^)]+)\)/g, "Math.cosh($1)")
                         .replace(/tanh\(([^)]+)\)/g, "Math.tanh($1)");

    // Inverse Hyperbolic functions (no conversion needed)
    expression = expression.replace(/sinh⁻¹\(([^)]+)\)/g, "Math.asinh($1)")
                         .replace(/cosh⁻¹\(([^)]+)\)/g, "Math.acosh($1)")
                         .replace(/tanh⁻¹\(([^)]+)\)/g, "Math.atanh($1)");
    
    return expression;
}

// 🌟 FIX: Function to handle special mathematical functions and symbols
function replaceSpecialFunctions(expression) {
    // Basic replacements
    expression = expression.replace(/÷/g, "/")
                           .replace(/x/g, "*")
                           .replace(/π/g, "Math.PI")
                           .replace(/e(?![a-z])/g, "Math.E") // 'e' not followed by a letter (to allow e^x)
                           .replace(/√\(([^)]+)\)/g, "Math.sqrt($1)"); // √ symbol followed by ()

    // 🌟 FIX: Handle 1/x (reciprocal)
    expression = expression.replace(/1\/x/g, "(1/")
    
    // Powers and special forms
    expression = expression.replace(/(\d+|\))\^(\d+|\()/g, "Math.pow($1,$2)"); // x^y
    expression = expression.replace(/x²/g, "Math.pow("); // x² (handled below)
    expression = expression.replace(/x³/g, "Math.pow("); // x³ (handled below)
    expression = expression.replace(/eˣ/g, "Math.pow(Math.E,"); // e^x (handled below)
    expression = expression.replace(/2ˣ/g, "Math.pow(2,"); // 2^x (handled below)
    
    // Add missing parentheses for functions like x², eˣ, etc.
    // Assuming user types 5x² or (4)x²
    expression = expression.replace(/Math.pow\(([^,]+)\)/g, "Math.pow($1,2)"); // This logic needs improvement based on your button/append setup.
    // A simpler fix for your current button implementation:
    expression = expression.replace(/(\d+)\^/g, "Math.pow($1,"); // Catches the base for a power
    
    // Logarithms
    expression = expression.replace(/ln\(([^)]+)\)/g, "Math.log($1)");
    expression = expression.replace(/log\(([^)]+)\)/g, "Math.log10($1)");

    // Factorial (x!)
    if (expression.includes("!")) {
        expression = expression.replace(/(\d+)!/g, function (_, n) {
            return factorial(parseInt(n));
        });
    }

    // Cube root
    expression = expression.replace(/∛\(([^)]+)\)/g, "Math.cbrt($1)");

    // Absolute value |x|
    expression = expression.replace(/\|([^|]+)\|/g, "Math.abs($1)");

    return expression;
}

// ================== Calculator ==================
function calculator() {
    try {
        let expression = output.value;
        const originalExpression = expression; // Save original for history
        
        // 1. Apply special math function and symbol replacements
        expression = replaceSpecialFunctions(expression);

        // 2. Apply trigonometric function replacements (with mode conversion)
        expression = replaceTrigFunctions(expression);
        
        // 🌟 FIX: Final cleanup for common button presses like 'x²' and 'eˣ'
        // This is a rough fix assuming a user pattern, as the current buttons only append the symbol.
        // It tries to find a number/parenthesis before the function name and complete the call.
        expression = expression.replace(/\(\(1\/\(([^)]+)\)/g, "((1/($1))") // Reciprocal fix
                           .replace(/Math.pow\(([^,]+),2\)/g, "Math.pow($1,2)") // x² fix
                           .replace(/Math.pow\(([^,]+),3\)/g, "Math.pow($1,3)"); // x³ fix


        let result = eval(expression);

        if (result !== undefined) {
            // Precision fix for common floating point errors 
            if (typeof result === 'number') {
                 // Check if the result is very close to an integer (for sin(30)=0.5, cos(60)=0.5 etc.)
                 if (Math.abs(result - Math.round(result)) < 1e-10) {
                     result = Math.round(result);
                 } else {
                     result = parseFloat(result.toFixed(10));
                 }
            }
            
            // Save to history using the original expression
            calcHistory.push({ expr: originalExpression, result: result });
            renderHistory();

            output.value = result;
        }
    } catch (e) {
        output.value = "Error";
        console.error("Calculation Error:", e);
    }
}

// ================== Factorial function ==================
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) {
        res *= i;
    }
    return res;
}
