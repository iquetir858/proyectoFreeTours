<script setup>
import Cat from '@/components/Cat.vue';

</script>



<template>
  <div class="about row m-5 d-flex flex-row flex-wrap justify-content-between">

    <div class="info col-12 col-md-6">
      <h2>Sobre nosotros</h2>
      <p>Sabemos que no es lo mismo ser turista que viajero. Es por ello que apostamos por el concepto de 'free tours'
        y pensamos en lo cómodo que sería disponer de una plataforma que ponga en contacto a viajeros inteligentes con
        lugañeros, guías residentes y proveedores de tours económicos alrededor del mundo, de forma que cualquiera pueda
        disfrutar de experiencias auténticas y enriquecedoras sin preocuparse de gastar demasiado. ¡Y así nació
        <span>PurrfectTours!</span>
      </p>
      <Cat></Cat>
    </div>
    <div class="video col-12 col-md-6">
      <video id="media" width="500" height="350" controls>
        <source src="../assets/videos/video.mp4" type="video/mp4">
        <source src="../assets/videos/video.ogv" type="video/ogg">
        Tu navegador no soporta este video
      </video>

      <p>Créditos video: <a
          href="https://pixabay.com/users/upstreamcity-12012850/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=22544">upstreamcity</a>
        from <a
          href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=22544">Pixabay</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
/*Enlace del estilo: https://codepen.io/joshwcomeau/pen/VwRqQGP */
.info {
  --radius: 0.7em;
  background-image:
    radial-gradient(var(--radius),
      transparent 98%,
      rgb(233, 192, 201)),
    linear-gradient(rgb(233, 192, 201) 0 0);
  background-repeat:
    round,
    no-repeat;
  background-position:
    calc(var(--radius) * -1.5) calc(var(--radius) * -1.5),
    40%;
  background-size:
    calc(var(--radius) * 3) calc(var(--radius) * 3),
    calc(100% - var(--radius) * 3) calc(100% - var(--radius) * 3);
}

.info {
  width: min(50%, 600px);
  height: auto;
  padding: 1.5em;
  inset: 0;
}

h2 {
  color: rgb(204, 15, 44);
  font-weight: bold;
}

p {
  text-indent: 2em;
}
</style>
