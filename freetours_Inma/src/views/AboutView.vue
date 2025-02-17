<script setup>

</script>



<template>
  <div class="about row m-5 d-flex flex-row flex-wrap justify-content-between">

    <div class="info col-12 col-md-6">
      <h2>Sobre nosotros</h2>
      <p>Sabemos que no es lo mismo ser turista que viajero. Es por ello que apostamos por el concepto de 'free tours'
        y pensamos en lo cómodo que sería disponer de una plataforma que ponga en contacto a viajeros inteligentes con
        lugañeros, guías residentes y proveedores de tours económicos alrededor del mundo, de forma que cualquiera pueda
        disfrutar de experiencias auténticas y enriquecedoras sin preocuparse de gastar demasiado. ¡Y así nació
        ----CAMBIAR ESTO AL NOMBRE DE MI PÁGINAAAA-------------!</p>
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
p {
  word-wrap: break-word;
}

/*
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}*/
</style>
