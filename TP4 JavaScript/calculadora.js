let num1 = 0;
let num2 = 0;
let op = "";

function calcular(num1, num2, op) {
 switch (op) {
    case "+":
        return num1 + num2;
    case "-":
        return num1 - num2;
    case "*":
        return num1 * num2;
    case "/":
        return num1 / num2; 
    default:
        return "Operación no válida";
    }
}
function asignarValor(num) {
    if (!op) {
        num1 = num;
        document.getElementById("display").innerText = num1;
    } else {
        num2 = num;
        document.getElementById("display").innerText = num2;
    }
}

document.getElementById("display").innerText = "0";

const btnNum0 = document.querySelector("#num0");
const btnNum1 = document.querySelector("#num1");
const btnNum2 = document.querySelector("#num2");
const btnNum3 = document.querySelector("#num3");
const btnNum4 = document.querySelector("#num4");
const btnNum5 = document.querySelector("#num5");
const btnNum6 = document.querySelector("#num6");
const btnNum7 = document.querySelector("#num7");
const btnNum8 = document.querySelector("#num8");
const btnNum9 = document.querySelector("#num9");
const btnNum10 = document.querySelector("#opSuma");
const btnNum11 = document.querySelector("#opMulti");
const btnNum12 = document.querySelector("#opIgual");
const btnNum13 = document.querySelector("#opDivision");
const btnNum14 = document.querySelector("#opRestar");

btnNum0.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "0";
});

btnNum1.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "1";
});

btnNum2.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "2";
});

btnNum3.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "3";
});

btnNum4.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "4";
});

btnNum5.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "5";
});

btnNum6.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "6";
});

btnNum7.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "7";
});

btnNum8.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "8";
});

btnNum9.addEventListener("click", (e) => {
    asignarValor(Number(e.target.innerText));
    document.getElementById("display").innerText = "9";
});

btnNum10.addEventListener("click", () => {
    console.log("click en +");
    op = "+";
});

btnNum11.addEventListener("click", () => {
    console.log("click en *");
    op = "*";
});

btnNum12.addEventListener("click", () => {
    console.log("click en =");

    const total = calcular(num1, num2, op);
    document.getElementById("display").innerText = total;

    num1 = total;
    num2 = 0;
    op = "";
});

btnNum13.addEventListener("click", () => {
    console.log("click en /");
    op = "/";
});

btnNum14.addEventListener("click", () => {
    console.log("click en -");
    op = "-";
});



