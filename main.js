// =========================
// Elementos del menú
// =========================

const menuScreen = document.getElementById("menuScreen");
const gameScreen = document.getElementById("gameScreen");
const summaryScreen = document.getElementById("summaryScreen");

const btnInfinite = document.getElementById("btnInfinite");
const btnTimer = document.getElementById("btnTimer");
const btnStop = document.getElementById("btnStop");
const btnMenu = document.getElementById("btnMenu");

const timeSection = document.getElementById("timeSection");


// =========================
// Operación seleccionada
// =========================

const operationRadios = document.querySelectorAll(
    'input[name="operacion"]'
);

const opcion1 = document.getElementById("opcion1");
const opcion2 = document.getElementById("opcion2");


// =========================
// Pantalla de juego
// =========================

const operationElement =
    document.getElementById("operation");

const answerInput =
    document.getElementById("answer");

const gameInfoTitle =
    document.getElementById("gameInfoTitle");

const gameInfoValue =
    document.getElementById("gameInfoValue");


// =========================
// Pantalla resumen
// =========================

const summaryOperations =
    document.getElementById("summaryOperations");

const summaryAverage =
    document.getElementById("summaryAverage");


// =========================
// Estado del juego
// =========================

let currentProblem = null;

let currentMode = "infinite";

let operationStartTime = 0;

let totalTime = 0;
let solvedOperations = 0;

let timerInterval = null;
let remainingTime = 0;


// =========================
// Dificultad visible
// =========================

function actualizarNumeros() {

    const operacion = document.querySelector(
        'input[name="operacion"]:checked'
    ).value;

    if (
        operacion === "suma" ||
        operacion === "resta"
    ) {

        opcion1.textContent = "2 cifras";
        opcion2.textContent = "3 cifras";

    } else {

        opcion1.textContent = "1 cifra";
        opcion2.textContent = "2 cifras";

    }

}

operationRadios.forEach(radio => {

    radio.addEventListener(
        "change",
        actualizarNumeros
    );

});

actualizarNumeros();


// =========================
// Inicio de partida
// =========================

function prepararPartida() {

    totalTime = 0;
    solvedOperations = 0;

    answerInput.value = "";

    menuScreen.style.display = "none";
    summaryScreen.style.display = "none";
    gameScreen.style.display = "flex";

    generarNuevaOperacion();

    answerInput.focus();

}

function iniciarJuegoInfinito() {

    currentMode = "infinite";

    prepararPartida();

    gameInfoTitle.textContent = "Promedio";

    actualizarPromedio();

}

function iniciarJuegoContrarreloj() {

    currentMode = "timer";

    prepararPartida();

    gameInfoTitle.textContent = "Tiempo";

    remainingTime = Number(
        document.querySelector(
            'input[name="time"]:checked'
        ).value
    );

    actualizarTiempo();

    timerInterval = setInterval(() => {

        remainingTime--;

        actualizarTiempo();

        if (remainingTime <= 0) {

            clearInterval(timerInterval);

            terminarJuego();

        }

    }, 1000);

}


// =========================
// Eventos principales
// =========================

btnInfinite.addEventListener(
    "click",
    iniciarJuegoInfinito
);

btnTimer.addEventListener(
    "click",
    iniciarJuegoContrarreloj
);

btnStop.addEventListener(
    "click",
    terminarJuego
);

btnMenu.addEventListener("click", () => {

    summaryScreen.style.display = "none";
    menuScreen.style.display = "block";

});


// =========================
// Respuesta automática
// =========================

answerInput.addEventListener(
    "input",
    () => {

        answerInput.value =
            answerInput.value.replace(/\D/g, "");

        if (
            answerInput.value ===
            String(currentProblem.respuesta)
        ) {

            const tiempoRespuesta =
                Date.now() - operationStartTime;

            totalTime += tiempoRespuesta;

            solvedOperations++;

            if (currentMode === "infinite") {

                actualizarPromedio();

            }

            generarNuevaOperacion();

        }

    }
);


// =========================
// Estadísticas
// =========================

function actualizarPromedio() {

    if (solvedOperations === 0) {

        gameInfoValue.textContent =
            "0.00 s";

        return;

    }

    const promedio =
        totalTime /
        solvedOperations /
        1000;

    gameInfoValue.textContent =
        promedio.toFixed(2) + " s";

}

function actualizarTiempo() {

    const minutos =
        Math.floor(remainingTime / 60);

    const segundos =
        remainingTime % 60;

    gameInfoValue.textContent =
        `${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;

}

// =========================
// Finalizar partida
// =========================

function terminarJuego() {

    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    gameScreen.style.display = "none";
    summaryScreen.style.display = "flex";

    summaryOperations.textContent = solvedOperations;

    if (solvedOperations === 0) {

        summaryAverage.textContent = "0.00 s";

    } else {

        summaryAverage.textContent =
            (totalTime / solvedOperations / 1000).toFixed(2) + " s";

    }

}


// =========================
// Nueva operación
// =========================

function generarNuevaOperacion() {

    const operacion = document.querySelector(
        'input[name="operacion"]:checked'
    ).value;

    const rango = document.querySelector(
        'input[name="cifras"]:checked'
    ).value;

    switch (operacion) {

        case "suma":
            currentProblem = generarSuma(rango);
            break;

        case "resta":
            currentProblem = generarResta(rango);
            break;

        case "multiplicacion":
            currentProblem = generarMultiplicacion(rango);
            break;

        case "division":
            currentProblem = generarDivision(rango);
            break;

    }

    operationElement.textContent = currentProblem.texto;

    answerInput.value = "";
    answerInput.focus();

    operationStartTime = Date.now();

}


// =========================
// Utilidades
// =========================

function numeroAleatorio(min, max) {

    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;

}


// =========================
// Generadores
// =========================

function generarSuma(rango) {

    let minimo;
    let maximo;

    if (rango === "facil") {

        minimo = 10;
        maximo = 99;

    } else {

        minimo = 100;
        maximo = 999;

    }

    const a = numeroAleatorio(minimo, maximo);
    const b = numeroAleatorio(minimo, maximo);

    return {

        texto: `${a} + ${b}`,
        respuesta: a + b

    };

}


function generarResta(rango) {

    let minimo;
    let maximo;

    if (rango === "facil") {

        minimo = 10;
        maximo = 99;

    } else {

        minimo = 100;
        maximo = 999;

    }

    let a = numeroAleatorio(minimo, maximo);
    let b = numeroAleatorio(minimo, maximo);

    if (b > a) {

        [a, b] = [b, a];

    }

    return {

        texto: `${a} - ${b}`,
        respuesta: a - b

    };

}


function generarMultiplicacion(rango) {

    let minimo;
    let maximo;

    if (rango === "facil") {

        minimo = 1;
        maximo = 9;

    } else {

        minimo = 10;
        maximo = 99;

    }

    const a = numeroAleatorio(minimo, maximo);

    const b = Math.random() < 0.7
        ? numeroAleatorio(1, 9)
        : numeroAleatorio(minimo, maximo);

    return {

        texto: `${a} × ${b}`,
        respuesta: a * b

    };

}


function generarDivision(rango) {

    let minimo;
    let maximo;

    if (rango === "facil") {

        minimo = 1;
        maximo = 9;

    } else {

        minimo = 10;
        maximo = 99;

    }

    const divisor = Math.random() < 0.7
        ? numeroAleatorio(1, 9)
        : numeroAleatorio(minimo, maximo);

    const cociente = numeroAleatorio(2, 20);

    const dividendo = divisor * cociente;

    return {

        texto: `${dividendo} ÷ ${divisor}`,
        respuesta: cociente

    };

}


// =========================
// Mostrar u ocultar tiempo
// =========================

btnInfinite.addEventListener("click", () => {

    timeSection.style.display = "none";

});

btnTimer.addEventListener("click", () => {

    timeSection.style.display = "block";

});

timeSection.style.display = "none";