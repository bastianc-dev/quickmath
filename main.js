// =========================
// Elementos de la interfaz
// =========================

const menuScreen = document.getElementById("menuScreen");
const timerScreen = document.getElementById("timerScreen");
const gameScreen = document.getElementById("gameScreen");
const summaryScreen = document.getElementById("summaryScreen");
const recordsScreen = document.getElementById("recordsScreen");

const screens = [
    menuScreen,
    timerScreen,
    gameScreen,
    summaryScreen,
    recordsScreen
];

const btnInfinite = document.getElementById("btnInfinite");
const btnTimer = document.getElementById("btnTimer");
const btnRecords = document.getElementById("btnRecords");
const btnBackTimer = document.getElementById("btnBackTimer");
const btnStop = document.getElementById("btnStop");
const btnMenu = document.getElementById("btnMenu");
const btnRecordsMenu = document.getElementById("btnRecordsMenu");
const btnResetRecords = document.getElementById("btnResetRecords");

const timeButtons = document.querySelectorAll(
    "#timerScreen button[data-time]"
);

const operationRadios = document.querySelectorAll(
    'input[name="operacion"]'
);

const opcion1 = document.getElementById("opcion1");
const opcion2 = document.getElementById("opcion2");

const operationElement = document.getElementById("operation");
const answerInput = document.getElementById("answer");
const gameInfoTitle = document.getElementById("gameInfoTitle");
const gameInfoValue = document.getElementById("gameInfoValue");

const summaryOperations = document.getElementById("summaryOperations");
const summaryAverage = document.getElementById("summaryAverage");
const summaryRecord = document.getElementById("summaryRecord");

const recordsList = document.getElementById("recordsList");


// =========================
// Definición de récords
// =========================

const RECORDS = [
    {
        clave: "suma_facil",
        operacion: "Addition",
        numeros: "2 digits"
    },
    {
        clave: "suma_dificil",
        operacion: "Addition",
        numeros: "3 digits"
    },
    {
        clave: "resta_facil",
        operacion: "Subtraction",
        numeros: "2 digits"
    },
    {
        clave: "resta_dificil",
        operacion: "Subtraction",
        numeros: "3 digits"
    },
    {
        clave: "multiplicacion_facil",
        operacion: "Multiplication",
        numeros: "1 digit"
    },
    {
        clave: "multiplicacion_dificil",
        operacion: "Multiplication",
        numeros: "2 digits"
    },
    {
        clave: "division_facil",
        operacion: "Division",
        numeros: "1 digit"
    },
    {
        clave: "division_dificil",
        operacion: "Division",
        numeros: "2 digits"
    }
];


// =========================
// Estado del juego
// =========================

let currentProblem = null;
let currentMode = "infinite";
let gameActive = false;

let operationStartTime = 0;
let totalTime = 0;
let solvedOperations = 0;

let timerInterval = null;
let timerEndTime = 0;
let remainingTime = 0;


// =========================
// Navegación entre pantallas
// =========================

function mostrarPantalla(screenToShow) {
    screens.forEach(screen => {
        screen.hidden = screen !== screenToShow;
    });
}


// =========================
// Opciones de cifras
// =========================

function actualizarNumeros() {
    const operacion = document.querySelector(
        'input[name="operacion"]:checked'
    ).value;

    const esSumaOResta =
        operacion === "suma" ||
        operacion === "resta";

    opcion1.textContent = esSumaOResta
        ? "2 digits"
        : "1 digit";

    opcion2.textContent = esSumaOResta
        ? "3 digits"
        : "2 digits";
}

operationRadios.forEach(radio => {
    radio.addEventListener("change", actualizarNumeros);
});

actualizarNumeros();


// =========================
// Inicio de partida
// =========================

function detenerTemporizador() {
    if (timerInterval !== null) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function prepararPartida() {
    detenerTemporizador();

    totalTime = 0;
    solvedOperations = 0;
    remainingTime = 0;
    timerEndTime = 0;

    currentProblem = null;
    gameActive = true;

    answerInput.disabled = false;
    answerInput.value = "";

    summaryRecord.hidden = true;

    mostrarPantalla(gameScreen);
    generarNuevaOperacion();

    answerInput.focus();
}

function iniciarJuegoInfinito() {
    currentMode = "infinite";

    prepararPartida();

    gameInfoTitle.textContent = "Average";
    actualizarPromedio();
}

function iniciarJuegoContrarreloj(segundos) {
    if (!Number.isFinite(segundos) || segundos <= 0) {
        return;
    }

    currentMode = "timer";

    prepararPartida();

    gameInfoTitle.textContent = "Time";

    timerEndTime = Date.now() + segundos * 1000;

    actualizarTiempo();

    timerInterval = setInterval(
        controlarTemporizador,
        250
    );
}


// =========================
// Temporizador
// =========================

function controlarTemporizador() {
    actualizarTiempo();

    if (remainingTime <= 0) {
        terminarJuego();
    }
}

function actualizarTiempo() {
    const milisegundosRestantes =
        Math.max(0, timerEndTime - Date.now());

    remainingTime =
        Math.ceil(milisegundosRestantes / 1000);

    const minutos =
        Math.floor(remainingTime / 60);

    const segundos =
        remainingTime % 60;

    gameInfoValue.textContent =
        `${String(minutos).padStart(2, "0")}:` +
        `${String(segundos).padStart(2, "0")}`;
}


// =========================
// Eventos de navegación
// =========================

btnInfinite.addEventListener(
    "click",
    iniciarJuegoInfinito
);

btnTimer.addEventListener("click", () => {
    mostrarPantalla(timerScreen);
});

timeButtons.forEach(button => {
    button.addEventListener("click", () => {
        const segundos = Number(button.dataset.time);
        iniciarJuegoContrarreloj(segundos);
    });
});

btnBackTimer.addEventListener("click", () => {
    mostrarPantalla(menuScreen);
});

btnStop.addEventListener(
    "click",
    terminarJuego
);

btnMenu.addEventListener("click", () => {
    mostrarPantalla(menuScreen);
});

btnRecordsMenu.addEventListener("click", () => {
    mostrarPantalla(menuScreen);
});

btnRecords.addEventListener("click", () => {
    mostrarRecords();
    mostrarPantalla(recordsScreen);
});

btnResetRecords.addEventListener(
    "click",
    reiniciarRecords
);


// =========================
// Respuesta automática
// =========================

answerInput.addEventListener("input", () => {
    answerInput.value =
        answerInput.value.replace(/\D/g, "");

    if (!gameActive || currentProblem === null) {
        return;
    }

    if (
        currentMode === "timer" &&
        Date.now() >= timerEndTime
    ) {
        terminarJuego();
        return;
    }

    const respuestaCorrecta =
        answerInput.value ===
        String(currentProblem.respuesta);

    if (!respuestaCorrecta) {
        return;
    }

    const tiempoRespuesta =
        Date.now() - operationStartTime;

    totalTime += tiempoRespuesta;
    solvedOperations++;

    if (currentMode === "infinite") {
        actualizarPromedio();
    }

    generarNuevaOperacion();
});


// =========================
// Local Storage
// =========================

function obtenerClaveRecord() {
    const operacion = document.querySelector(
        'input[name="operacion"]:checked'
    ).value;

    const rango = document.querySelector(
        'input[name="cifras"]:checked'
    ).value;

    return `${operacion}_${rango}`;
}

function leerRecord(clave) {
    try {
        const valor = localStorage.getItem(clave);

        if (valor === null) {
            return null;
        }

        const record = Number(valor);

        return Number.isFinite(record)
            ? record
            : null;

    } catch (error) {
        console.warn(
            "The record could not be read.",
            error
        );

        return null;
    }
}

function guardarRecord(clave, promedio) {
    try {
        localStorage.setItem(
            clave,
            String(promedio)
        );

        return true;

    } catch (error) {
        console.warn(
            "The record could not be saved.",
            error
        );

        return false;
    }
}

function intentarGuardarRecord(promedio) {
    const clave = obtenerClaveRecord();
    const recordAnterior = leerRecord(clave);

    const esNuevoRecord =
        recordAnterior === null ||
        promedio < recordAnterior;

    if (!esNuevoRecord) {
        return false;
    }

    return guardarRecord(clave, promedio);
}


// =========================
// Pantalla de récords
// =========================

function mostrarRecords() {
    recordsList.replaceChildren();

    const fragmento =
        document.createDocumentFragment();

    RECORDS.forEach(record => {
        const valor = leerRecord(record.clave);

        if (valor === null) {
            return;
        }

        const bloque =
            document.createElement("article");

        bloque.className = "record-item";

        const operacion =
            document.createElement("p");

        operacion.className = "record-operation";
        operacion.textContent = record.operacion;

        const numeros =
            document.createElement("p");

        numeros.textContent = record.numeros;

        const tiempo =
            document.createElement("p");

        tiempo.className = "record-time";
        tiempo.textContent =
            `${valor.toFixed(2)} s`;

        bloque.append(
            operacion,
            numeros,
            tiempo
        );

        fragmento.appendChild(bloque);
    });

    if (!fragmento.hasChildNodes()) {
        const mensaje =
            document.createElement("p");

        mensaje.textContent =
            "No records yet.";

        fragmento.appendChild(mensaje);
    }

    recordsList.appendChild(fragmento);
}

function reiniciarRecords() {
    const confirmar = confirm(
        "Are you sure you want to delete all records?"
    );

    if (!confirmar) {
        return;
    }

    RECORDS.forEach(record => {
        try {
            localStorage.removeItem(record.clave);
        } catch (error) {
            console.warn(
                "A record could not be deleted.",
                error
            );
        }
    });

    mostrarRecords();
}


// =========================
// Estadísticas
// =========================

function calcularPromedio() {
    if (solvedOperations === 0) {
        return 0;
    }

    return (
        totalTime /
        solvedOperations /
        1000
    );
}

function actualizarPromedio() {
    const promedio = calcularPromedio();

    gameInfoValue.textContent =
        `${promedio.toFixed(2)} s`;
}


// =========================
// Finalizar partida
// =========================

function terminarJuego() {
    if (!gameActive) {
        return;
    }

    gameActive = false;

    detenerTemporizador();

    answerInput.disabled = true;
    currentProblem = null;

    const promedio = calcularPromedio();

    summaryOperations.textContent =
        String(solvedOperations);

    summaryAverage.textContent =
        `${promedio.toFixed(2)} s`;

    const hayNuevoRecord =
        solvedOperations > 0 &&
        intentarGuardarRecord(promedio);

    summaryRecord.hidden =
        !hayNuevoRecord;

    mostrarPantalla(summaryScreen);
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
            currentProblem =
                generarMultiplicacion(rango);
            break;

        case "division":
            currentProblem =
                generarDivision(rango);
            break;

        default:
            throw new Error(
                `Unknown operation: ${operacion}`
            );
    }

    operationElement.textContent =
        currentProblem.texto;

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

function obtenerLimites(
    rango,
    limitesFaciles,
    limitesDificiles
) {
    return rango === "facil"
        ? limitesFaciles
        : limitesDificiles;
}


// =========================
// Generadores
// =========================

function generarSuma(rango) {
    const [minimo, maximo] =
        obtenerLimites(
            rango,
            [10, 99],
            [100, 999]
        );

    const a = numeroAleatorio(minimo, maximo);
    const b = numeroAleatorio(minimo, maximo);

    return {
        texto: `${a} + ${b}`,
        respuesta: a + b
    };
}

function generarResta(rango) {
    const [minimo, maximo] =
        obtenerLimites(
            rango,
            [10, 99],
            [100, 999]
        );

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
    if (rango === "facil") {
        const a = numeroAleatorio(1, 9);
        const b = numeroAleatorio(1, 9);

        return {
            texto: `${a} × ${b}`,
            respuesta: a * b
        };
    }

    const a = numeroAleatorio(10, 99);

    const b = Math.random() < 0.7
        ? numeroAleatorio(1, 9)
        : numeroAleatorio(10, 99);

    return {
        texto: `${a} × ${b}`,
        respuesta: a * b
    };
}

function generarDivision(rango) {
    const divisor = rango === "facil"
        ? numeroAleatorio(1, 9)
        : numeroAleatorio(10, 99);

    const cociente =
        numeroAleatorio(2, 20);

    const dividendo =
        divisor * cociente;

    return {
        texto: `${dividendo} ÷ ${divisor}`,
        respuesta: cociente
    };
}
