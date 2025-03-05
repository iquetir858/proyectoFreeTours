<script setup>
import { ref, onMounted } from 'vue';
import InfoRoute from '@/components/InfoRoute.vue';
import router from '@/router';

//------------- VARIABLES
let guiaLogueado = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //Obtener guía del localStorage
//Primero comprobamos que no se pueda entrar a esta vista si no es GUIA
if (!guiaLogueado.value || guiaLogueado.value.rol != 'guia') {
    router.push('/');
}


let asignacionesGuia = ref(null);
//console.log(guiaLogueado.value);
let rutaSeleccionada = ref(null);
let modalInfo = null;
let asignacionSeleccionada = ref(null);
let modalPasarLista = null;
let errorCambio = ref('');
let exitoCambio = ref('');
let reservasEditadas = ref({});

//-------------------FUNCIONES MODALES
onMounted(() => {
    modalInfo = new bootstrap.Modal(document.getElementById('modalInfo'));
    modalPasarLista = new bootstrap.Modal(document.getElementById('modalPasarLista'));

});

/**
 * Función que cierra los modales y elimina los valores asignados a ruta/asignación seleccionadas
 */
function cerrarModal() {
    modalInfo.hide();
    modalPasarLista.hide();
    rutaSeleccionada.value = null; //Para eliminar el valor que tenía antes
    asignacionSeleccionada.value = null;
    errorCambio.value = '';
    exitoCambio.value = '';
    reservasEditadas.value = {};
}

/**
 * Función que muestra el modal con la información de la ruta elegida
 */
function mostrarModalInfo(asignacion) {
    rutaSeleccionada.value = {
        id: asignacion.ruta_id,
        titulo: asignacion.ruta_titulo,
        descripcion: asignacion.ruta_descripcion,
        foto: asignacion.ruta_foto,
        localidad: asignacion.ruta_localidad,
        fecha: asignacion.ruta_fecha,
        hora: asignacion.ruta_hora,
        latitud: asignacion.ruta_latitud,
        longitud: asignacion.ruta_longitud
    }
    modalInfo.show();
}

//----------------FUNCIONES
function obtenerRutasGuia(guiaId) {

    fetch(`/api/api.php/asignaciones?guia_id=${guiaId}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Asignaciones del guía:', data);
            //Obtenemos las asignaciones ordenando por fecha (la más reciente primero)
            asignacionesGuia.value = data.sort((asig1, asig2) => new Date(asig1.ruta_fecha) - new Date(asig2.ruta_fecha));
        })
        .catch(error => console.error('Error:', error));

}

/**
 * Función que calcula el número total de personas que acuden a según la ruta asignada
 * @param asignacion (cada una de las asignaciones que se muestren en la tabla)
 * @returns (INT) Número de personas
 */
function calcularTotalPersonas(asignacion) {
    return asignacion.reservas.reduce((total, reserva) => total + reserva.num_personas, 0);
}

/**
 * FUNCIÓN PARA PASAR LISTA DEL GUÍA
 * Muestra el modal de pasar lista, que enseñará todas las reservas con inputs numéricos
 * para cambiar el número de asistentes (fetch a reservas con PUT)
 * @param asignacion Asignación del guía a modificar
 */
function pasarLista(asignacion) {
    asignacionSeleccionada.value = asignacion;
    reservasEditadas.value = {};
    modalPasarLista.show();
}

/**
 * Función que realiza una petición a la api para cambiar el número de asistentes en la reserva de un cliente
 * @param reserva 
 * @param numPersonas 
 */
function cambiarAsistentes(reserva, numPersonas) {

    fetch('/api/api.php/reservas?id=' + reserva.reserva_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ num_personas: numPersonas })
    })
        .then(response => response.json())
        .then(data => {
            // console.log('Respuesta:', data);
            if (data.status == 'success') {
                exitoCambio.value = data.message;
                errorCambio.value = '';
                obtenerRutasGuia(guiaLogueado.value.id); //Actualizamos la tabla para mostrar los cambios
            } else {
                exitoCambio.value = '';
                errorCambio.value = data.message;
            }
            setTimeout(() => {
                exitoCambio.value = '';
                errorCambio.value = '';
            }, 3000);
        })
        .catch(error => console.error('Error:', error));

}

/**
 * Función que cambia los asistentes de las reservas editadas (según los cambios de v-model del modalPasarLista)
 */
function guardarCambios() {
    for (let [id, numPersonas] of Object.entries(reservasEditadas.value)) {
        if (isNaN(numPersonas) || numPersonas < 1 || numPersonas > 8) {
            errorCambio.value = 'Se han introducido valores erróneos';
        } else {
            const reserva = asignacionSeleccionada.value.reservas.find(reserva => reserva.reserva_id == id);
            if (reserva) cambiarAsistentes(reserva, numPersonas);
        }
    }
    //cerrarModal();
}

//----------LLAMADA PRINCIPAL
obtenerRutasGuia(guiaLogueado.value.id || null);
</script>


<template>
    <h3 class="text-center">Mis asignaciones ({{ guiaLogueado.email }})</h3>

    <div id="divTabla" class="m-3 d-flex flex-column align-items-center">
        <table class="table table-light table-striped table-hover text-center mb-3">
            <caption class="text-center">Listado de rutas</caption>
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Ruta</th> <!--Poner en esta columna el titulo y un modal de info-->
                    <th scope="col">Asistentes</th> <!--Warning si es <10-->
                    <th scope="col">Reservas</th>
                    <th scope="col">Acción</th>
                </tr>
            </thead>
            <tbody>
                <!--HACER QUE NO SE PUEDA MODIFICAR EL ADMIN-->
                <tr v-for="asignacion in asignacionesGuia" :key="asignacion.ruta_id">
                    <td>{{ asignacion.ruta_id }}</td>
                    <td>
                        {{ asignacion.ruta_titulo }}
                        <button @click.prevent="mostrarModalInfo(asignacion)" class="btn btnMasInfo"
                            aria-label="Información de la ruta">
                            <i class="fa-solid fa-circle-info"></i>
                        </button>
                    </td>
                    <td>
                        {{ calcularTotalPersonas(asignacion) }}
                        <span v-if="calcularTotalPersonas(asignacion) < 10" title="Menos de 10 asistentes">
                            <i class="fa-solid fa-triangle-exclamation text-danger"></i>
                        </span>
                    </td>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Ver reservas
                            </button>
                            <ul class="dropdown-menu">
                                <li v-for="reserva in asignacion.reservas" :key="reserva.reserva_id"
                                    class="dropdown-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{{ reserva.cliente.email }}</strong> - {{ reserva.num_personas }}
                                        personas
                                    </div>

                                </li>
                            </ul>
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-warning" @click="pasarLista(asignacion)">
                            Pasar Lista
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <InfoRoute :ruta-seleccionada="rutaSeleccionada" @cerrar-modal="cerrarModal()"></InfoRoute>
    <!--------------------------------------------------------------------------------------------------->
    <!--MODAL DE PASAR LISTA (Cambiar número de asistentes en una ruta, como guía)-->
    <div class="modal fade" id="modalPasarLista" tabindex="-1" aria-labelledby="modalPasarListaLabel">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Asignación: {{ asignacionSeleccionada?.ruta_titulo }}</h5>
                    <button type="button" class="btn-close" @click="cerrarModal"></button>
                </div>
                <div class="modal-body">
                    <ul class="list-group">
                        <li v-for="reserva in asignacionSeleccionada?.reservas" :key="reserva.reserva_id"
                            class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>{{ reserva.cliente.email }}</strong>
                            </div>
                            <input type="number" min="1" max="8" class="form-control w-25"
                                v-model="reservasEditadas[reserva.reserva_id]" :placeholder="reserva.num_personas">
                        </li>
                    </ul>
                    <div class="mt-2">
                        <p v-if="exitoCambio != ''" class="text-success">{{ exitoCambio }}</p>
                        <p v-if="errorCambio != ''" class="text-danger">{{ errorCambio }}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
                    <button type="button" class="btn btn-success" @click="guardarCambios">Guardar cambios</button>
                </div>
            </div>
        </div>
    </div>

</template>


<style scoped>
th {
    text-transform: uppercase;
}

table {
    max-width: 80%;
    overflow-y: scroll;
    border: 2px solid rgb(236, 166, 177);
}

img {
    width: 10rem;
}

.btnMasInfo {
    background: transparent;
    border: none;
    padding: 0;
    color: palevioletred;
    font-size: 1.5em;
}
</style>