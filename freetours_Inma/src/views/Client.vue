<script setup>
import { ref } from 'vue';
import Reservations from '@/components/Reservations.vue';

//-------------VARIABLES
let cliente = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //cliente logeado
let reservasActuales = ref(null);
let email = cliente.value.email;

//-------------FUNCIONES
function obtenerReservas(emailUsuario) {

    fetch(`/api/api.php/reservas?email=${emailUsuario}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Reservas del usuario:', data);
            let fechaActual = new Date();
            //Primero ordenamos las reservas de data según la fecha más próxima a la actual
            data.sort((a, b) => new Date(a.ruta_fecha) - new Date(b.ruta_fecha));
            //Ahora filtramos las reservas actuales (cuya fecha es superior a la actual)
            reservasActuales.value = data.filter(elem => new Date(elem.ruta_fecha) >= fechaActual);
        })
        .catch(error => console.error('Error:', error));

}

/**
 * Función llamada desde el emit del componente REservations (tarjetas con las reservas actuales)
 * para actualizarel listado de reservas general (ocurre después del borrado)
 */
function actualizarReservasActuales() {
    obtenerReservas(cliente.value.email);
}

//Llamada principal al abrir la página del cliente
obtenerReservas(cliente.value.email);

</script>

<template>
    <h2 class="text-center mt-2">Rutas reservadas</h2>
    <Reservations v-if="reservasActuales" @actualizar-reservas="actualizarReservasActuales" :reservas="reservasActuales"
        :valoracion="false"></Reservations>

</template>

<style scoped></style>