<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import router from '@/router';

//PROPS
const props = defineProps({
    propRutas: Object
});

//Variables:
const rutaSeleccionada = ref(null);
let modalInfo = null;
let usuarioLogeado = ref(JSON.parse(localStorage.getItem('usuarioLogeado')));
let modalReserva = null;
let asistentes = ref();
let mensajeReserva = ref('');
let errorReserva = ref('');

onMounted(() => {
    modalInfo = new bootstrap.Modal(document.getElementById('modalInfo'));
    modalReserva = new bootstrap.Modal(document.getElementById('modalReserva'));
});

/**
 * Función que muestra un modal con la información de la ruta
 * @param ruta 
 */
function mostrarInfo(ruta) {
    rutaSeleccionada.value = ruta;
    modalInfo.show();
};

/**
 * Función que cierra / oculta el modal de info de la ruta
 */
function cerrarModal() {
    modalInfo.hide();
}

/**
 * Función que cierra el modal y reenvía a la página de registro desde el modal
 */
function enviarARegistro() {
    cerrarModal();
    router.push('/register');
}


function reservarRuta(idRuta, emailUsuario) {
    const reservaData = {
        email: emailUsuario, // Email del cliente
        ruta_id: idRuta,     // ID de la ruta
        num_personas: asistentes.value // Número de personas para la reserva
    };

    console.log(reservaData);

    if (asistentes.value >= 1 && asistentes.value <= 15) {
        fetch('api/api.php/reservas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservaData)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta:', data);
                if (data.status == 'success') {
                    mensajeReserva.value = data.message;
                    errorReserva.value = '';
                } else {
                    errorReserva.value = data.message;
                    mensajeReserva.value = '';
                }
                setTimeout(() => {
                    modalReserva.hide();
                    asistentes.value = '';
                }, 5000);
            })
            .catch(error => console.error('Error reserva (card):', error));
    }
}

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
                <a href="#" class="btn btnVerInfo" title="Ver más información sobre la ruta"
                    @click.prevent="mostrarInfo(ruta)">
                    Más información</a>
            </div>
        </div>
    </div>

    <!--MODAL (cambiarlo a componente????)-->
    <div class="modal fade" id="modalInfo" tabindex="-1" aria-labelledby="modalInfoLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalInfoLabel">{{ rutaSeleccionada?.titulo }}</h5>
                    <button @click.prevent="cerrarModal" type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Localidad:</strong> {{ rutaSeleccionada?.localidad }}</p>
                    <p><strong>Fecha:</strong> {{ rutaSeleccionada?.fecha }}</p>
                    <p><strong>Hora:</strong> {{ rutaSeleccionada?.hora }}</p>
                    <img :src="rutaSeleccionada?.foto" :alt="rutaSeleccionada?.titulo"
                        :title="rutaSeleccionada?.descripcion">
                    <p>{{ rutaSeleccionada?.descripcion }}</p>
                    <p>Punto de encuentro(?)</p>
                </div>
                <div class="modal-footer">
                    <button @click.prevent="cerrarModal" type="button" class="btn btnBorrado"
                        data-bs-dismiss="modal">Cerrar</button>
                    <!--Si hay usuario registrado, se reserva-->
                    <button v-if="usuarioLogeado" @click.prevent="modalReserva.show(); modalInfo.hide()"
                        class="btn">Reservar</button>
                    <!--Si no, se redirige al registro-->
                    <button v-else class="btn btn-success" @click.prevent="enviarARegistro">Regístrate</button>
                </div>

            </div>
        </div>
    </div>

    <!--MODAL RESERVA-->
    <div class="modal fade" id="modalReserva" tabindex="-1" aria-labelledby="modalInfoLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalInReservaLabel">Reserva</h5>
                    <button @click.prevent="modalReserva.hide()" type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Reserva de la ruta "{{ rutaSeleccionada?.titulo }}"</strong></p>
                    <label for="numPersonas">Número de asistentes: </label>
                    <input v-model="asistentes" type="number" min="1" max="15" name="numPersonas" id="asistentes"
                        placeholder="1">
                    <!--Mensaje de confirmación/error-->
                    <div>
                        <p v-if="mensajeReserva != ''" class="text-success text-center">{{ mensajeReserva }}</p>
                        <p v-else-if="mensajeReserva == '' && errorReserva != ''" class="text-success text-danger">
                            {{ errorReserva }}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click.prevent="modalReserva.hide()" type="button" class="btn btnBorrado"
                        data-bs-dismiss="modal">Cerrar</button>
                    <!--Si hay usuario registrado, se reserva-->
                    <button v-if="usuarioLogeado"
                        @click.prevent="reservarRuta(rutaSeleccionada.id, usuarioLogeado.email)"
                        class="btn">Confirmar</button>
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
    max-height: 600px;
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
    color: rgb(32, 13, 13);
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
