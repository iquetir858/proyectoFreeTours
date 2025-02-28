<script setup>
import { ref, onMounted } from 'vue';

//PROPS
const props = defineProps({
    reservas: Object,
    valoracion: Boolean //Valor para 
});

//Variables:
let rutaSeleccionada = ref(null);
let modalPersonas = null;
let modalCancelación = null;
let modificacionPersonas = ref(''); //Mensaje al modificar el num de personas que asisten
let cancelacion = ref(''); //Mensaje al cancelar reserva(?)

onMounted(() => {
    modalPersonas = new bootstrap.Modal(document.getElementById('modalPersonas'));
    modalCancelación = new bootstrap.Modal(document.getElementById('modalCancelación'));
});

/**
 * Función que cierra / oculta el modal de info de la ruta
 */
function cerrarModal() {
    modalPersonas.hide();
    modalCancelación.hide();
    rutaSeleccionada.value = null;
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
                                <button class="btn btn-danger w-100 mt-3">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>