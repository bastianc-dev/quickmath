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