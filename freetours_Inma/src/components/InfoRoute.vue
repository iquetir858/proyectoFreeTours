<script setup>
import { ref, onMounted } from 'vue';
import Map from './Map.vue';

//--------------------PROPS
const props = defineProps({
    rutaSeleccionada: Object, //Ruta que se envía para duplicar
});

//------------------EMITs

const emit = defineEmits(["cerrarModal"]);

//--------------------VARIABLES
let modalInfo = null;
onMounted(() => {
    if (!modalInfo) modalInfo = new bootstrap.Modal(document.getElementById('modalInfo'));
});

//--------------------FUNCIONES
function cerrarModal() {
    modalInfo.hide();
    emit("cerrarModal"); //Se emite para que se actualice la tabla de rutas
}

</script>

<template>
    <div role="dialog" class="modal fade" id="modalInfo" tabindex="-1" aria-labelledby="modalInfoLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalInfoLabel">{{ rutaSeleccionada?.titulo }}</h5>
                    <button @click.prevent="cerrarModal()" type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-4 d-flex flex-column justify-content-evenly  col-sm-12">
                            <p><strong>Localidad:</strong> {{ rutaSeleccionada?.localidad }}</p>
                            <p><strong>Fecha:</strong> {{ rutaSeleccionada?.fecha }}</p>
                            <p><strong>Hora:</strong> {{ rutaSeleccionada?.hora }}</p>
                        </div>
                        <div class="col-md-8 col-sm-12">
                            <img :src="rutaSeleccionada?.foto" :alt="rutaSeleccionada?.titulo"
                                :title="rutaSeleccionada?.descripcion">
                            <p>{{ rutaSeleccionada?.descripcion }}</p>
                        </div>
                    </div>


                    <p><strong>Punto de encuentro:</strong> </p>
                    <Map v-if="rutaSeleccionada" :ruta="rutaSeleccionada"></Map>
                </div>
                <div class="modal-footer">
                    <button @click.prevent="cerrarModal()" type="button" class="btn btnBorrado"
                        data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
img {
    width: 100%;
}

.btnBorrado {
    color: white;
    background-color: #DC4C64;
    border: 1px solid #DC4C64;
}

.btnBorrado:hover {
    background-color: white;
    color: #DC4C64;
    border: 1px solid #DC4C64;
}
</style>