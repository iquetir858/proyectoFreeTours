<script setup>
import { ref } from 'vue';
import Reservations from '@/components/Reservations.vue';

//-------------VARIABLES
let cliente = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //cliente logeado
let email = cliente.value.email;
let reservasPasadas = ref(null);

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
            //Filtramos reservas pasadas
            reservasPasadas.value = data.filter(elem => new Date(elem.ruta_fecha) < fechaActual);
        })
        .catch(error => console.error('Error:', error));
}

//Llamada principal al abrir la página del cliente
obtenerReservas(email);


</script>

<template>
    <h2 class="text-center mt-2">Rutas pasadas</h2>
    <Reservations v-if="reservasPasadas" :reservas="reservasPasadas" :valoracion="true"
        @actualizar-reservas="obtenerReservas(email)"></Reservations>
</template>

<style scoped></style>