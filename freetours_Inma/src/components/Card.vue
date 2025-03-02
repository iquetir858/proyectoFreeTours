<script setup>
import { ref, onMounted } from 'vue';
import { Modal } from 'bootstrap';
import router from '@/router';
import Map from '@/components/Map.vue';

//PROPS
const props = defineProps({
    propRutas: Object
});

//Variables:
const rutaSeleccionada = ref(null);
let modalInfo = null;
let usuarioLogeado = ref(JSON.parse(localStorage.getItem('usuarioLogeado')));
let modalReserva = null;
let asistentes = ref(1);
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
    rutaSeleccionada.value = null;
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

    if (asistentes.value >= 1 && asistentes.value <= 8) {
        fetch('/api/api.php/reservas', {
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
                    asistentes.value = 1; 
                    mensajeReserva.value = '';
                    errorReserva.value = '';
                }, 3000);
            })
            .catch(error => {
                console.error('Error reserva (card):', error);
                errorReserva.value = 'Error al procesar la reserva. Inténtalo de nuevo.';
                setTimeout(() => {
                    errorReserva.value = '';
                }, 3000);
            });
    }
}

</script>

<template>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-12 col-lg-10 cards-container p-4">
                <div class="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
                    <div v-for="ruta in propRutas" :key="ruta.id" class="col">
                        <div class="card h-100 shadow-sm hover-card">
                            <div class="card-img-wrapper">
                                <img v-bind:src="ruta.foto" class="card-img-top" :alt="ruta.titulo">
                                <div class="card-img-overlay d-flex align-items-end">
                                    <span class="badge bg-primary mb-2">{{ ruta.localidad }}</span>
                                </div>
                            </div>
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">{{ ruta.titulo }}</h5>
                                <p class="card-text text-muted">
                                    <i class="fas fa-calendar-alt me-2"></i>{{ ruta.fecha }}
                                </p>
                                <button class="btn btn-outline-primary mt-auto" 
                                        @click.prevent="mostrarInfo(ruta)">
                                    <i class="fas fa-info-circle me-2"></i>Más información
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--MODAL (cambiarlo a componente????)-->
    <div role="dialog" class="modal fade" id="modalInfo" tabindex="-1" aria-labelledby="modalInfoLabel">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalInfoLabel">{{ rutaSeleccionada?.titulo }}</h5>
                    <button @click.prevent="cerrarModal" type="button" class="btn-close" data-bs-dismiss="modal"
                        aria-label="Cerrar"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-4 d-flex flex-column justify-content-evenly col-sm-12">
                            <p><strong>Localidad:</strong> {{ rutaSeleccionada?.localidad }}</p>
                            <p><strong>Fecha:</strong> {{ rutaSeleccionada?.fecha }}</p>
                            <p><strong>Hora:</strong> {{ rutaSeleccionada?.hora }}</p>
                        </div>
                        <div class="col-md-8 col-sm-12"><img :src="rutaSeleccionada?.foto"
                                :alt="rutaSeleccionada?.titulo" :title="rutaSeleccionada?.descripcion">
                            <p>{{ rutaSeleccionada?.descripcion }}</p>
                        </div>
                    </div>


                    <p><strong>Punto de encuentro:</strong> </p>
                    <Map v-if="rutaSeleccionada" :ruta="rutaSeleccionada"></Map>
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
    <div role="dialog" class="modal fade" id="modalReserva" tabindex="-1" aria-labelledby="modalInfoLabel">
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
                    <input v-model.number="asistentes" type="number" min="1" max="8" name="numPersonas" id="asistentes"
                        placeholder="1">
                    <!--Mensaje de confirmación/error-->
                    <div>
                        <p v-if="mensajeReserva != ''" class="text-success">{{ mensajeReserva }}</p>
                        <p v-else-if="mensajeReserva == '' && errorReserva != ''" class="text-danger">
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
.cards-container {
    background: rgba(209, 96, 113, 0.1);
    border-radius: 1rem;
    backdrop-filter: blur(10px);
    min-height: fit-content;
    height: auto;
    padding: 2rem;
    margin: 2rem 0;
}

.card {
    border: none;
    transition: all 0.3s ease;
    background: white;
    border-radius: 0.5rem;
}

.hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.card-img-wrapper {
    position: relative;
    overflow: hidden;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}

.card-img-top {
    height: 200px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.hover-card:hover .card-img-top {
    transform: scale(1.05);
}

.card-img-overlay {
    background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
}

.btn-outline-primary {
    color: rgb(209, 96, 113);
    border-color: rgb(209, 96, 113);
}

.btn-outline-primary:hover {
    background-color: rgb(209, 96, 113);
    border-color: rgb(209, 96, 113);
    color: white;
}

.badge {
    background-color: rgb(209, 96, 113) !important;
}

.modal-content {
    border-radius: 1rem;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.modal-header {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    background-color: rgba(209, 96, 113, 0.1);
    border-top-left-radius: 1rem;
    border-top-right-radius: 1rem;
}

.modal-footer {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.modal-body img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
}

.modal-body .row {
    margin: 0;
}

.modal-dialog {
    max-width: 800px;
    margin: 1.75rem auto;
}

@media (max-width: 768px) {
    .cards-container {
        min-height: fit-content;
        height: auto;
        border-radius: 0;
        padding: 1rem;
        margin: 1rem 0;
    }
}

@media (max-width: 768px) {
    .cards-container {
        max-height: 100vh;
        border-radius: 0;
    }

    .card-img-top {
        height: 150px;
    }
}
</style>
