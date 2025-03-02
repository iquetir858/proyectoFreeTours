<script setup>
import { ref, onMounted } from 'vue';
import Rating from '@/components/Rating.vue';

//PROPS
const props = defineProps({
    reservas: Object,
    valoracion: Boolean,
});

//EMITs 
const emit = defineEmits(["actualizarReservas"]);

//Variables:
let reservaSeleccionada = ref(null);
let modalNumPersonas = null;
let modalCancelacion = null;
let exitoModificacionPersonas = ref(''); //Mensaje de éxito modificar el num de personas que asisten
let errorModificacionPersonas = ref(''); //Mensaje de éxito modificar el num de personas que asisten
let errorCancelacion = ref(''); //Mensaje de error al cancelar reserva
let exitoCancelacion = ref(''); //Mensaje de éxito al cancelar reserva

onMounted(() => {
    modalNumPersonas = new bootstrap.Modal(document.getElementById('modalNumPersonas'));
    modalCancelacion = new bootstrap.Modal(document.getElementById('modalCancelacionReserva'));
});

/**
 * Función que oculta/cierra los modales
 */
function cerrarModal() {
    modalNumPersonas.hide();
    modalCancelacion.hide();
    reservaSeleccionada.value = null;
}

/**
 * Función que muestra el modal para confirmar o cancelar la reserva 
 * @param reserva Reserva que será almacenada como selección 
 */
function mostrarModalCancelacion(reserva) {
    reservaSeleccionada.value = reserva;
    modalCancelacion.show();
}

/**
 * Función que cancela la reserva seleccionada 
 */
function cancelarReserva() {
    let reservaId = reservaSeleccionada.value.reserva_id;
    //console.log("ReservaId: " + reservaId);

    fetch(`/api/api.php/reservas?id=${reservaId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Respuesta:', data);
            if (data.status == 'success') {
                exitoCancelacion.value = data.message;
                errorCancelacion.value = '';
                //'Emitimos' evento para que se actualicen las tablas con las rutas
                emit('actualizarReservas');
            } else {
                errorCancelacion.value = data.message;
                exitoCancelacion.value = ''
            }

            setTimeout(() => {
                errorCancelacion.value = '';
                exitoCancelacion.value = '';
                reservaSeleccionada.value = null; //Eliminamos la ruta seleccionada 
                cerrarModal();
            }, 3000);
        })
        .catch(error => console.error('Error:', error));
}

/**
 * Función que muestra el modal para cambiar el número de personas y llama a la función del fetch 
 * o muestra un error
 * @param reserva 
 */
function mostrarModalNumPersonas(reserva) {
    modalNumPersonas.show();
    reservaSeleccionada.value = reserva;
    console.log(reserva);
    console.log(reservaSeleccionada.value);


}

/**
 * Función que realiza la petición a la base de datos para cambiar el número de asistentes a una ruta
 * según la reserva del cliente registrado.
 * Obtiene el nuevo valor del input 
 */
function cambiarNumPersonas() {
    let inputNumPersonas = document.getElementById('numPersonas');
    //Se comprueba el input
    if (!inputNumPersonas.value || isNaN(inputNumPersonas.value) || inputNumPersonas.value < 1 || inputNumPersonas.value > 8) {
        //Hay un error con el número de personas y no debe actualizarse
        errorModificacionPersonas.value = "Número de personas no válido.";
        exitoModificacionPersonas.value = '';
    } else {
        errorModificacionPersonas.value = ''; //REseteamos el error

        //Actualizamos los datos de la reserva a modificar
        let idReserva = reservaSeleccionada.value.reserva_id;
        let num_personas = { num_personas: inputNumPersonas.value };

        fetch(`/api/api.php/reservas?id=${idReserva}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(num_personas)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta:', data);
                if (data.status == 'success') {
                    exitoModificacionPersonas.value = data.message;
                    errorModificacionPersonas.value = '';
                    emit('actualizarReservas');

                } else {
                    exitoModificacionPersonas.value = '';
                    errorModificacionPersonas.value = data.message;
                }
                setTimeout(() => {
                    exitoModificacionPersonas.value = '';
                    errorModificacionPersonas.value = '';
                    cerrarModal();
                    reservaSeleccionada.value = null;
                    inputNumPersonas.value = 1; //Valor por defecto
                }, 3000);
            })
            .catch(error => console.error('Error:', error));
    }
}

</script>

<template>
    <div class="container mt-4 overflow-auto h-50  border border-2 border-danger ">
        <div v-if="!props.reservas || props.reservas.length === 0" class="text-black bg-secondary">
            No se han encontrado reservas
        </div>
        <div v-else class="row row-cols-1 row-cols-md-2 g-4">
            <div class="col" v-for="(reserva, index) in reservas" :key="index">
                <div class="card h-100">
                    <div class="row g-0 p-3">
                        <!--Columna de la foto de la ruta-->
                        <div class="col-md-4">
                            <img :src="reserva.ruta_foto" class="img-fluid rounded mt-4" :alt="reserva.ruta_descripcion"
                                title="Foto de la ruta">
                        </div>
                        <!--Columna con el resto de info y botones-->
                        <div class="col-md-8 d-flex flex-column">
                            <div class="card-body">
                                <h5 class="card-title">{{ reserva.ruta_titulo }}</h5>
                                <p class="card-text"><strong>Localidad:</strong> {{ reserva.ruta_localidad }}</p>
                                <p class="card-text"><strong>Fecha:</strong> {{ reserva.ruta_fecha }}</p>
                                <div class="d-flex align-items-center justify-content-between">
                                    <p class="mb-0 me-2"><strong>Número de personas:</strong>
                                        {{ reserva.num_personas }}
                                    </p>
                                    <button v-if="!valoracion" class="btn btn-sm btn-primary"
                                        aria-label="Modificar número de personas"
                                        @click.prevent="mostrarModalNumPersonas(reserva)">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>

                                </div>
                                <button v-if="!valoracion" @click.prevent="mostrarModalCancelacion(reserva)"
                                    class="btn btn-danger w-100 mt-3">Cancelar Reserva</button>
                                <div v-else>
                                    <!--Meter aquí lógica de la valoración-->
                                    <Rating></Rating>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--Modal de cancelación de reserva-->
    <div class="modal fade" id="modalCancelacionReserva" tabindex="-1" aria-labelledby="exampleModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Cancelar reserva</h5>
                    <button type="button" @click.prevent="cerrarModal" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cerrar modal"></button>
                </div>
                <div class="modal-body">
                    <p>La reserva de la ruta se cancelará. ¿Estás seguro?</p>
                    <p v-if="exitoCancelacion.value != ''" class="text-success">{{ exitoCancelacion }}</p>
                    <p v-else-if="errorCancelacion.value != ''" class="text-danger">{{ errorCancelacion }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" @click.prevent="cerrarModal" class="btn"
                        data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" @click.prevent="cancelarReserva" class="btn btnBorrado">
                        Cancelar Reserva
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!--Modal de MODIFICACIÓN DEL NÚMERO DE PERSONAS de la reserva-->
    <div class="modal fade" id="modalNumPersonas" tabindex="-1" aria-labelledby="exampleModalLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Cambiar número asistentes</h5>
                    <button type="button" @click.prevent="cerrarModal" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cerrar modal"></button>
                </div>
                <div class="modal-body">
                    <label for="numPersonas">Selecciona el número de asistentes: </label>
                    <input type="number" id="numPersonas" aria-label="Nuevo número de asistentes a la ruta" min="1"
                        max="8" value="1">
                    <p v-if="exitoModificacionPersonas.value != ''" class="text-success">
                        {{ exitoModificacionPersonas }}
                    </p>
                    <p v-else-if="errorModificacionPersonas.value != ''" class="text-danger">
                        {{ errorModificacionPersonas }}
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" @click.prevent="cerrarModal" class="btn btnBorrado"
                        data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" @click.prevent="cambiarNumPersonas()" class="btn">
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>