<script setup>
import { ref } from 'vue';
/*
Rutas reservadas --> obtener todas las reservas del usuario con fecha >= actual
Rutas pasadas --> Reserva del usuario cuya fecha sea < actual

*/
let cliente = ref(JSON.parse(localStorage.getItem('usuarioLogeado'))); //cliente logeado
let reservas = ref(null);

function obtenerReservas(emailUsuario) {

    fetch(`/api/api.php/reservas?email=${emailUsuario}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Reservas del usuario:', data);
            reservas.value = data;
        })
        .catch(error => console.error('Error:', error));

}

obtenerReservas(cliente.value.email);
</script>

<template>
    <!--Tabla rutas reservadas-->
    <!--Mismo componente que en la pág principal?-->

    <!--Tabla rutas realizadas para valorar-->

</template>

<style scoped></style>