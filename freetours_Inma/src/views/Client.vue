<script setup>
import { ref } from 'vue';
import Reservations from '@/components/Reservations.vue';

/*
Rutas reservadas --> obtener todas las reservas del usuario con fecha >= actual
Rutas pasadas --> Reserva del usuario cuya fecha sea < actual

*/
let cliente = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //cliente logeado
let reservasActuales = ref(null);
let reservasPasadas = ref(null);

function obtenerReservas(emailUsuario) {

    fetch(`/api/api.php/reservas?email=${emailUsuario}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Reservas del usuario:', data);
            let fechaActual = new Date();
            reservasActuales.value = data.filter(elem => new Date(elem.ruta_fecha) >= fechaActual);
            reservasPasadas.value = data.filter(elem => new Date(elem.ruta_fecha) < fechaActual);
        })
        .catch(error => console.error('Error:', error));

}

obtenerReservas(cliente.value.email);
</script>

<template>
    <!--Tabla rutas reservadas-->
    <!--Mismo componente que en la pág principal?-->
    <!-- Contenedor principal para las reservas -->
    <h2 class="text-center mt-2">Rutas reservadas</h2>
   <Reservations :reservas="reservasActuales" :valoracion="true"></Reservations>


   <h2 class="text-center mt-2">Rutas pasadas</h2>
   <Reservations :reservas="reservasPasadas" :valoracion="true"></Reservations>

    <!--Tabla rutas realizadas para valorar-->

</template>

<style scoped></style>