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
// Juego
// =========================

const operationElement = document.getElementById("operation");
const answerInput = document.getElementById("answer");

let currentProblem;


// =========================
// Iniciar juego
// =========================

function iniciarJuego() {

    menuScreen.style.display = "none";
    gameScreen.style.display = "flex";

    generarNuevaOperacion();

    answerInput.focus();

}

btnInfinite.addEventListener("click", iniciarJuego);
btnTimer.addEventListener("click", iniciarJuego);


// =========================
// Comprobación automática
// =========================

answerInput.addEventListener("input", () => {

    // Solo números
    answerInput.value = answerInput.value.replace(/\D/g, "");

    if (answerInput.value === String(currentProblem.respuesta)) {

        generarNuevaOperacion();

    }

});


// =========================
// Generar nueva operación
// =========================

function generarNuevaOperacion() {

    const operacion = document.querySelector(
        'input[name="operacion"]:checked'
    ).value;

    switch (operacion) {

        case "suma":
            currentProblem = generarSuma();
            break;

        case "resta":
            currentProblem = generarResta();
            break;

        case "multiplicacion":
            currentProblem = generarMultiplicacion();
            break;

        case "division":
            currentProblem = generarDivision();
            break;

    }

    operationElement.textContent = currentProblem.texto;

    answerInput.value = "";
    answerInput.focus();

}


// =========================
// Utilidades
// =========================

function numeroAleatorio(min, max) {

    return Math.floor(Math.random() * (max - min + 1)) + min;

}


// =========================
// Generadores
// =========================

function generarSuma() {

    const a = numeroAleatorio(10, 99);
    const b = numeroAleatorio(10, 99);

    return {

        texto: `${a} + ${b}`,
        respuesta: a + b

    };

}


function generarResta() {

    let a = numeroAleatorio(10, 99);
    let b = numeroAleatorio(10, 99);

    if (b > a) {
        [a, b] = [b, a];
    }

    return {

        texto: `${a} - ${b}`,
        respuesta: a - b

    };

}


function generarMultiplicacion() {

    const a = numeroAleatorio(10, 99);

    const b = Math.random() < 0.7
        ? numeroAleatorio(1, 9)
        : numeroAleatorio(10, 99);

    return {

        texto: `${a} × ${b}`,
        respuesta: a * b

    };

}


function generarDivision() {

    const divisor = Math.random() < 0.7
        ? numeroAleatorio(1, 9)
        : numeroAleatorio(10, 99);

    const cociente = numeroAleatorio(2, 20);

    const dividendo = divisor * cociente;

    return {

        texto: `${dividendo} ÷ ${divisor}`,
        respuesta: cociente

    };

}