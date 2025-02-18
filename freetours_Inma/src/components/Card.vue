<script setup>
import { ref } from 'vue';

//Definir aquí props y coger las rutas de la vista del Home
//CÓDIGO DE EJEMPLOOO
//let rutas = ref();
const props = defineProps({
    propRutas: Object
});

</script>

<template>
    <div class="d-flex flex-row justify-content-center flex-wrap m-5 p-2 contenedorTarjetas">
        <div v-for="ruta in propRutas" class="card m-2 p-2" style="width: 18rem;">
            <img v-bind:src="ruta.foto" class="card-img-top img-fluid" :alt="ruta.titulo">
            <div class="card-body">
                <h5 class="card-title">{{ ruta.titulo }}</h5>
                <h6 class="text-secondary">{{ ruta.localidad }}</h6>
                <p class="card-text">
                    {{ ruta.fecha }}
                </p>
                <!--Este botón debería abrir un modal o vista que muestre la info de la ruta-->
                <a href="#" class="btn btn-primary btnVerInfo" title="Ver más información sobre la ruta">Más información</a>
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