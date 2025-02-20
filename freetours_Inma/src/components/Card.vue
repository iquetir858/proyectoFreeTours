<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';

const props = defineProps({
    propRutas: Object
});

const selectedRuta = ref(null);
let modalInstance = null;

onMounted(() => {
    modalInstance = new Modal(document.getElementById('infoModal'));
});

const showInfo = (ruta, event) => {
    event.preventDefault(); // Evita que la página suba al inicio
    selectedRuta.value = ruta;
    modalInstance.show();
};
</script>

<template>
    <div class="d-flex flex-row justify-content-center flex-wrap m-5 p-2 contenedorTarjetas">
        <div v-for="ruta in propRutas" :key="ruta.id" class="card m-2 p-2" style="width: 18rem;">
            <img v-bind:src="ruta.foto" class="card-img-top img-fluid" :alt="ruta.titulo">
            <div class="card-body">
                <h5 class="card-title">{{ ruta.titulo }}</h5>
                <h6 class="text-secondary">{{ ruta.localidad }}</h6>
                <p class="card-text">
                    {{ ruta.fecha }}
                </p>
                <a href="#" class="btn btn-primary btnVerInfo" title="Ver más información sobre la ruta"
                    @click="showInfo(ruta, $event)">
                    Más información</a>
            </div>
        </div>
    </div>

    <!--MODAL (cambiarlo a componente????)-->
    <div class="modal fade" id="infoModal" tabindex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="infoModalLabel">{{ selectedRuta?.titulo }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Localidad:</strong> {{ selectedRuta?.localidad }}</p>
                    <p><strong>Fecha:</strong> {{ selectedRuta?.fecha }}</p>
                    <p>{{ selectedRuta?.descripcion }}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.contenedorTarjetas {
    width: 70%;
    padding: 10px;
    background-color: rgb(209, 96, 113);
    max-height: 900px;
    overflow-y: scroll;
}

img {
    height: 200px;
}

.btnVerInfo {
    color: rgb(32, 13, 13);
    font-weight: bold;
    background-color: rgb(236, 166, 177);
    border: 1px solid rgb(236, 166, 177);
}

.btnVerInfo:hover {
    background-color: white;
    border: 1px solid rgb(32, 13, 13);
}
</style>
