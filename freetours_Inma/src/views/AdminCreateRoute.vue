<script setup>
import { ref, computed, onMounted } from 'vue';
import Map from '@/components/Map.vue';
import router from '@/router';

let usuarioLogueado = ref(JSON.parse(localStorage.getItem('usuarioLogeado')));
//Primero comprobamos que no se pueda entrar a esta vista si no es ADMIN
if (!usuarioLogueado.value || usuarioLogueado.value.rol != 'admin') {
    router.push('/');
}

let guiasDisponibles = ref(); //Se cogen mediante una llamada a la api
let nuevaRuta = ref({
    titulo: '',
    localidad: '',
    fecha: '',
    hora: '',
    descripcion: '',
    foto: '',
    guia_id: '',
    latitud: null,
    longitud: null
});

let errores = ref({}); //Errores para la validación del form
let fechaSeleccionada = computed(() => !!nuevaRuta.value.fecha); //Variable que comprueba si ya se ha seleccionado una fecha
//!!-> convierte el valor en su equivalente booleano (si hay fecha válida -> true, si no, false)
let exitoCreacion = ref('');
let errorCreacion = ref('');
let modalConfirmacion = null;

onMounted(() => {
    modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));
});
function cerrarModal() {
    modalConfirmacion.hide();
}


//-------------------------- FUNCIONES --------------------------------------
/**
 * Función para obtener los guías almacenados, filtrando los usuarios 
 * de la Base de Datos por rol  y según la fecha indicada en el formulario
 * ----IMPLEMENTAR EL MOSTRAR ERRORES!!!!!
 */
function obtenerGuiasBD() {
    let fecha = nuevaRuta.value.fecha;
    try {
        //fetch('http://localhost/api/api.php/usuarios', {
        fetch(`/api/api.php/asignaciones?fecha=${fecha}`, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                guiasDisponibles.value = data;
                console.log("Guías disponibles en esa fecha: " + JSON.stringify(guiasDisponibles.value));

                //error.value = '';
            })
            .catch(errMsg => {
                //error.value = errMsg;
                console.log("Error (obtención asignaciones): " + errMsg);

            }
            );
    } catch (err) {
        //error.value = 'Error al cargar los datos';
        console.log("Error Obtención Guías: " + err);

    }
}

//Función que almacena los valores de latitud y longitud del emit del mapa
function setLatitudLongitud(lat, lon) {
    nuevaRuta.value.latitud = lat;
    nuevaRuta.value.longitud = lon;
}

/**
 * Función que valida los datos de creación de una ruta
 */
function validarDatosRuta() {
    errores.value = {};

    if (!nuevaRuta.value.titulo || !isNaN(nuevaRuta.value.titulo)) errores.value.titulo = "El título es obligatorio (valor NO numérico).";
    if (!nuevaRuta.value.localidad || !isNaN(nuevaRuta.value.titulo)) errores.value.localidad = "La localidad es obligatoria (valor NO numérico).";

    if (!nuevaRuta.value.fecha) {
        errores.value.fecha = "La fecha es obligatoria.";
    } else {
        if (new Date(nuevaRuta.value.fecha) < new Date()) {
            errores.value.fecha = "La fecha no puede ser en el pasado.";
        }
    }

    if (!nuevaRuta.value.hora) errores.value.hora = "La hora es obligatoria.";
    if (!nuevaRuta.value.descripcion || !isNaN(nuevaRuta.value.descripcion)) errores.value.descripcion = "La descripción es obligatoria (valor NO numérico).";

    if (!nuevaRuta.value.latitud || !nuevaRuta.value.longitud) {
        errores.value.ubicacion = "Selecciona un punto en el mapa.";
    }
    let urlFoto = /^https?:\/\/.+\..+/;
    if (!nuevaRuta.value.foto || !urlFoto.test(nuevaRuta.value.foto)) {
        errores.value.foto = "La URL de la foto no es válida.";
    }
    //Devuelve true si NO hay errores
    return Object.keys(errores.value).length == 0;
}


/**
 * Función que realiza la petición para crear la ruta
 */
function crearRuta() {
    console.log(nuevaRuta.value);
    if (!validarDatosRuta()) return; //No sigue ejecutando si hay errores

    //-------------Creación de la ruta
    fetch('http://localhost/api/api.php/rutas', {
        // fetch('/api/api.php/rutas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaRuta.value)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta:', data);
            if (data.status == 'success') {
                exitoCreacion.value = data.message;
                errorCreacion.value = '';
            } else {
                errorCreacion.value = data.message;
                exitoCreacion.value = '';
            }
            modalConfirmacion.show();
            setTimeout(() => {
                modalConfirmacion.hide();
            }, 2000);
        })
        .catch(error => console.error('Error:', error));
}

</script>


<template>

    <div id="divRuta" class="container mt-4">
        <form class="card p-5 shadow-lg mb-5 needs-validation" novalidate>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="titulo" class="form-label">Título de la Ruta:</label>
                    <input type="text" class="form-control" id="titulo" v-model="nuevaRuta.titulo"
                        placeholder="Escribe aquí el nombre..." :class="{ 'is-invalid': errores.titulo }">
                    <div class="invalid-feedback">{{ errores.titulo }}</div>
                </div>
                <div class="col-md-6">
                    <label for="localidad" class="form-label">Localidad:</label>
                    <input type="text" class="form-control" id="localidad" v-model="nuevaRuta.localidad"
                        placeholder="Indica la localidad..." :class="{ 'is-invalid': errores.localidad }">
                    <div class="invalid-feedback">{{ errores.localidad }}</div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="fecha" class="form-label">Fecha:</label>
                    <input type="date" class="form-control" id="fecha" v-model="nuevaRuta.fecha"
                        @change="obtenerGuiasBD" :class="{ 'is-invalid': errores.fecha }">
                    <div class="invalid-feedback">{{ errores.fecha }}</div>
                </div>
                <div class="col-md-6">
                    <label for="hora" class="form-label">Hora:</label>
                    <input type="time" class="form-control" id="hora" v-model="nuevaRuta.hora"
                        :class="{ 'is-invalid': errores.hora }">
                    <div class="invalid-feedback">{{ errores.hora }}</div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="foto" class="form-label">Foto:</label>
                    <input type="text" class="form-control" id="foto" v-model="nuevaRuta.foto" placeholder="URL"
                        :class="{ 'is-invalid': errores.foto }">
                    <div class="invalid-feedback">{{ errores.foto }}</div>
                </div>
                <div class="col-md-6">
                    <label for="guia" class="form-label">Asignar guía: <span class="text-danger">(Tras seleccionar
                            fecha)</span></label>
                    <select class="form-select" v-model="nuevaRuta.guia_id" :disabled="!fechaSeleccionada"
                        :class="{ 'is-invalid': errores.guia_id }">
                        <option value="" disabled>Selecciona un guía</option>
                        <option v-for="guia in guiasDisponibles" :key="guia.id" :value="guia.id">{{ guia.nombre }}
                        </option>
                    </select>
                    <div class="invalid-feedback">{{ errores.guia_id }}</div>
                </div>
            </div>

            <div class="mb-3">
                <label for="descripcion" class="form-label">Descripción:</label>
                <textarea class="form-control" id="descripcionRuta" v-model="nuevaRuta.descripcion" rows="3"
                    placeholder="Describe brevemente la ruta." :class="{ 'is-invalid': errores.descripcion }"></textarea>
                <div class="invalid-feedback">{{ errores.descripcion }}</div>
            </div>

            <div class="mb-3">
                <label class="form-label">Punto de encuentro:</label>
                <Map id="mapa" @enviar-coordenadas="setLatitudLongitud"></Map>
                <div class="text-danger mt-2" v-if="errores.ubicacion">{{ errores.ubicacion }}</div>
            </div>

            <button type="submit" class="btn" @click.prevent="crearRuta">
                Crear Ruta
            </button>
        </form>
    </div>

    <!--MODAL DE CONFIRMACIÓN DE CREACIÓN-->
    <div class="text-success bg-color-success text-black">
        <div class="modal fade" id="modalConfirmacion" tabindex="-1" aria-labelledby="infoModalLabel">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="infoModalLabel">Creación de ruta</h5>
                        <button type="button" @click.prevent="cerrarModal" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Cerrar"></button>
                    </div>
                    <div class="modal-body">
                        <p v-if="exitoCreacion != ''" class="text-success">{{ exitoCreacion }}</p>
                        <p v-else class="text-danger">{{ errorCreacion }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
textarea {
    resize: none;
}

.btn {
    color: rgb(32, 13, 13);
    font-weight: bold;
    background-color: rgb(236, 166, 177);
    border: 1px solid rgb(236, 166, 177);
}

.btn:hover {
    background-color: rgb(32, 13, 13);
    border: 1px solid rgb(32, 13, 13);
    color: rgb(236, 166, 177);
}
</style>