// =========================
// Cambiar opciones de números
// =========================

const operaciones = document.querySelectorAll('input[name="operacion"]');

const opcion1 = document.getElementById("opcion1");
const opcion2 = document.getElementById("opcion2");

function actualizarNumeros() {

    const operacion = document.querySelector(
        'input[name="operacion"]:checked'
    ).value;

    if (operacion === "suma" || operacion === "resta") {

        opcion1.textContent = "2 cifras";
        opcion2.textContent = "3 cifras";

    } else {

        opcion1.textContent = "1 cifra";
        opcion2.textContent = "2 cifras";

    }

}

operaciones.forEach(radio => {
    radio.addEventListener("change", actualizarNumeros);
});

actualizarNumeros();

// =========================
// Cambio de pantalla
// =========================

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");

const btnInfinite = document.getElementById("btnInfinite");
const btnTimer = document.getElementById("btnTimer");

// =========================
// Operaciones de prueba
// =========================

const operationElement = document.getElementById("operation");
const answerInput = document.getElementById("answer");

const operations = [
    {
        text: "34 + 29",
        answer: "63"
    },
    {
        text: "7 + 8",
        answer: "15"
    }
];

let currentOperation = 0;

function showOperation() {

    operationElement.textContent = operations[currentOperation].text;

    answerInput.value = "";
    answerInput.focus();

}

function iniciarJuego() {

    menuScreen.style.display = "none";
    gameScreen.style.display = "flex";

    showOperation();

}

btnInfinite.addEventListener("click", iniciarJuego);
btnTimer.addEventListener("click", iniciarJuego);

// =========================
// Comprobación automática
// =========================

answerInput.addEventListener("input", () => {

    // Solo permite números
    answerInput.value = answerInput.value.replace(/\D/g, "");

    if (answerInput.value === operations[currentOperation].answer) {

        currentOperation++;

        if (currentOperation >= operations.length) {
            currentOperation = 0;
        }

        showOperation();

    }

});