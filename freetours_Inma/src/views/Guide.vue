<script setup>
import { ref, onMounted } from 'vue';
import InfoRoute from '@/components/InfoRoute.vue';

//------------- VARIABLES
let guiaLogueado = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //Obtener guía del localStorage
let asignacionesGuia = ref(null);
//console.log(guiaLogueado.value);
let rutaSeleccionada = ref(null);
let modalInfo = null;

//-------------------FUNCIONES MODALES
onMounted(() => {
    modalInfo = new bootstrap.Modal(document.getElementById('modalInfo'));

});

function cerrarModal() {
    modalInfo.hide();
    rutaSeleccionada.value = null; //Para eliminar el valor que tenía antes
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


function pasarLista(asignacion) {
    //Por ahora nada 
}


//----------LLAMADA PRINCIPAL
obtenerRutasGuia(guiaLogueado.value.id);
</script>


<template>
    <!--Mirar estilo !!!-->
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
                        <button class="btn btn-sm btn-warning" @click="pasarLista(asignacion)">
                            Cambiar Asistentes
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

    <InfoRoute :ruta-seleccionada="rutaSeleccionada" @cerrar-modal="cerrarModal()"></InfoRoute>
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