<script setup>
import { ref, onMounted } from 'vue';

//PROPS
const props = defineProps({
    reservas: Object,
    valoracion: Boolean //Valor para 
});

//EMITs 
const emit = defineEmits(["actualizarReservas"]);

//Variables:
let reservaSeleccionada = ref(null);
let modalPersonas = null;
let modalCancelacion = null;
let modificacionPersonas = ref(''); //Mensaje al modificar el num de personas que asisten
let errorCancelacion = ref(''); //Mensaje de error al cancelar reserva
let exitoCancelacion = ref(''); //Mensaje de éxito al cancelar reserva

onMounted(() => {
    modalPersonas = new bootstrap.Modal(document.getElementById('modalPersonas'));
    modalCancelacion = new bootstrap.Modal(document.getElementById('modalCancelacionReserva'));
});

/**
 * Función que oculta/cierra los modales
 */
function cerrarModal() {
    modalPersonas.hide();
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
    console.log("ReservaId: " + reservaId);

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
                modalCancelacion.hide();
            }, 3000);
        })
        .catch(error => console.error('Error:', error));
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
                                    <button v-if="valoracion" class="btn btn-sm btn-primary"
                                        aria-label="Modificar número de personas"><i
                                            class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                </div>
                                <button @click.prevent="mostrarModalCancelacion(reserva)"
                                    class="btn btn-danger w-100 mt-3">Cancelar Reserva</button>
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
</template>

<style scoped></style>