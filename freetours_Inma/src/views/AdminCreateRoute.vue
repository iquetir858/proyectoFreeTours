<script setup>

</script>


<template>
    <div id="divRuta">
        <form action="">
            <label for="nombreRuta">Nombre Ruta:</label>
            <input type="text" name="nombreRuta" placeholder="Escribe aquí el nombre...">

            <label for="localidad">Localidad:</label>
            <input type="text" name="localidad" placeholder="Indica la localidad...">

            <label for="descripcion">Descripción: </label>
            <textarea name="descripcion" id="descripcionRuta" placeholder="Describe brevemente la ruta."></textarea>

            <label for="foto">Foto:</label>
            <input type="file" name="foto" id="foto" accept="image/png, image/jpeg">
            <!--Subir foto??-->

            <label for="guia">Asignar guía:</label>
            <!--Meter aquí componente de guía-->

            <label for="fecha">Fecha:</label>
            <input type="date" name="fecha">

            <label for="hora">Hora:</label>
            <input type="time" name="hora">

            <label for="mapa">Punto de encuentro</label>
            <!--Introducir aquí mapa de -->

        </form>
    </div>
</template>

<style>
textarea {
    resize: none;
}
</style>