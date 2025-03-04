<script setup>
import router from '@/router';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'

//!!!!!!!!!!!!!!! IMPORTANTE
//MANTENER USUARIO LOGEADO EN EL LOCALSTORAGE???

const emit = defineEmits(["loggedIn"]);
const route = useRoute();

//---------Datos Login
const form = ref({ email: '', contraseña: '' });
const userLogged = ref(); //id, nombre, email, rol --Datos que recibe en el fetch
const errorLogin = ref('');

//---------Datos Registro
const formRegistro = ref({ nombre: '', email: '', contraseña: '' });
const errorRegistro = ref('');
const exitoRegistro = ref('');

//Modal para el resgitro 
let modalRegistro = null;
onMounted(() => {
    modalRegistro = new bootstrap.Modal(document.getElementById('modalRegistro'));
});


//---------Función de login de usuario
function login() {
    try {
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form.value)
        }
        //fetch('http://localhost/api/api.php/usuarios?login', options)
        fetch('/api/api.php/usuarios?login', options)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    userLogged.value = data.user;
                    emit('loggedIn', userLogged.value);
                    errorLogin.value = '';

                    //Redirigimos al home (ya con ese usuario logeado)
                    router.push('/');
                } else {
                    errorLogin.value = data.message;
                    form.value = { email: '', contraseña: '' }; //Para vaciar los inputs en caso de error
                    //console.error(data.message);
                }
            })
            .catch(errMsg => {
                errorLogin.value = errMsg;
                console.error(errMsg);
            }
            );
    } catch (err) {
        errorLogin.value = 'Error al cargar los datos';
    }
}

//---------------------- Función para realizar el resgitro del usuario en la base de datos
function userRegister() {
    //Primero hay que comprobar el formato de los input de entrada
    //CAMBIAR LUEGO ESTAS COMPROBACIONES--> mejorarlo
    //Añadir tooltips o ayudas al formulario para saber el formato
    if (formRegistro.value.nombre.length >= 4 && formRegistro.value.contraseña.length >= 4) {
        const regex = /[a-zA-Z0-9]+@tours.com/; //CAMBIAR(?)
        if (regex.test(formRegistro.value.email)) {
            //Aquí ya estarían todos los datos correctos en el registro por lo que se haría el fetch
            //Hacemos la petición a la api
            //fetch('http://localhost/api/api.php/usuarios', {
            fetch('/api/api.php/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formRegistro.value)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        errorRegistro.value = '';
                        exitoRegistro.value = data.message;
                        //Mostramos el modal
                        if (!modalRegistro) {
                            modalRegistro = new bootstrap.Modal(document.getElementById('modalRegistro'));
                        }
                        modalRegistro.show();
                        setTimeout(() => {
                            modalRegistro.hide();
                            exitoRegistro.value = '';
                            router.push('/login')
                        }, 2000);
                    } else {
                        exitoRegistro.value = '';
                        errorRegistro.value = data.message;
                    }
                })
                .catch(error => console.error('Error:', error));

        } else {
            exitoRegistro.value = '';
            errorRegistro.value = 'Formato de correo incorrecto';
        }
    } else {
        //errorRegistro.value = 'El nombre y/o contraseña deben tener al menos 4 caracteres';
        exitoRegistro.value = '';
        errorRegistro.value = 'Formato nombre/contraseña incorrectos';
        //setTimeout(()=> errorRegistro.value='', 5000);
    }
}
//HAY QUE HACER VALIDACIÓN DE LOS DATOS DEL FORM ANTES DEL REGISTRO

</script>

<template>
  <div id="generalDiv" class="d-flex flex-column justify-content-center align-items-center mt-5">
    <div id="botonesCambio" class="d-flex justify-content-evenly w-100">
      <RouterLink class="text-white" to="/login">
        <button class="btn btn-primary text-decoration-none">Login</button>
      </RouterLink>
      <RouterLink class="text-white text-decoration-none" to="/register">
        <button class="btn btn-primary">Registro</button>
      </RouterLink>
    </div>

    <div class="flip-container" :class="{ 'flipped': route.path === '/register' }">
      <div class="flipper">
        <!-- Parte del login -->
        <div class="front">
          <div id="loginDiv">
            <form action="POST">
              <h2 class="h3 mb-3 fw-normal">LOGIN</h2>
              <div class="form-floating p-1">
                <input v-model="form.email" type="text" name="email" id="email" class="form-control">
                <label for="email">Correo electrónico</label>
              </div>
              <div class="form-floating p-1">
                <input v-model="form.contraseña" type="password" name='contraseña' id="contraseña" class="form-control">
                <label for='contraseña'>Contraseña</label>
              </div>
              <p v-if="errorLogin" class="text-danger mt-2">{{ errorLogin }}</p>
              <div class="buttons mt-2 d-flex justify-content-evenly">
                <button type="submit" @click.prevent="login" class="btn btn-success me-1">Iniciar Sesión</button>
                <RouterLink class="text-black text-decoration-none" to="/"> <button class="btn btn-danger">Cancelar</button></RouterLink>
              </div>
            </form>
          </div>
        </div>

        <!-- Parte del registro -->
        <div class="back">
          <div id="registerDiv">
            <form action="">
              <h2 class="h3 mb-3 fw-normal">REGISTRO</h2>
              <div class="form-floating">
                <input v-model="formRegistro.nombre" type="text" name="nombre" id="nombre" class="form-control">
                <label for="nombre">Nombre</label>
              </div>

              <div class="form-floating">
                <input v-model="formRegistro.email" type="text" name="email" class="form-control">
                <label for="email">Correo</label>
              </div>
              <div class="form-floating">
                <input v-model="formRegistro.contraseña" type="text" name="contraseña" class="form-control">
                <label for="pass">Contraseña</label>
              </div>
              <p v-if="errorRegistro" class="text-danger mt-2">{{ errorRegistro }}</p>
              <div class="buttons mt-2 d-flex justify-content-evenly">
                <button @click.prevent="userRegister" class="btn btn-success">Registrarse</button>
                <RouterLink class="text-black text-decoration-none" to="/"> <button class="btn btn-danger">Cancelar</button></RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--MODAL DE CONFIRMACIÓN DE REGISTRO-->
  <div class="text-success bg-color-success text-black">
    <div class="modal fade" id="modalRegistro" tabindex="-1" aria-labelledby="infoModalLabel">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="infoModalLabel">Registro</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p>{{ exitoRegistro }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#generalDiv {
    padding: 2rem 1rem;
    background: linear-gradient(135deg, #fce8ec 0%, #ffe9e9 100%);
}

#botonesCambio {
    width: 90%;
    max-width: 400px;
    margin-bottom: 2rem;
}

#botonesCambio button {
    font-size: clamp(1rem, 2vw, 1.3rem);
    font-weight: 600;
    padding: 0.8rem 2rem;
    background-color: #ff8ba7;
    border: none;
    color: #33272a;
    border-radius: 25px;
    transition: all 0.3s ease;
    width: 140px;
}

#botonesCambio button:hover {
    background-color: #33272a;
    color: #ff8ba7;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

#loginDiv,
#registerDiv {
    width: 100%;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
}

.form-floating {
    margin-bottom: 1rem;
}

.form-control {
    border-radius: 12px;
    border: 2px solid #fce8ec;
    padding: 0.8rem 1rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #ff8ba7;
    box-shadow: 0 0 0 0.2rem rgba(255, 139, 167, 0.25);
}

.form-floating label {
    color: #666;
}

.buttons {
    margin-top: 1.5rem;
}

.buttons button {
    padding: 0.8rem 1.5rem;
    border-radius: 25px;
    border: none;
    transition: all 0.3s ease;
    min-width: 120px;
}

.btn-success {
    background-color: #ff8ba7 !important;
    border: none !important;
    color: #33272a !important;
}

.btn-danger {
    background-color: #fce8ec !important;
    border: none !important;
    color: #33272a !important;
}

.btn-success:hover {
    background-color: #33272a !important;
    color: #ff8ba7 !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-danger:hover {
    background-color: #33272a !important;
    color: #fce8ec !important;
    transform: translateY(-2px);
}

/* Ajustes de estilo del modal*/
.modal-content {
    border-radius: 20px;
    border: none;
}

.modal-header {
    background-color: #fce8ec;
    border-radius: 20px 20px 0 0;
}

/* Responsive */
@media (max-width: 768px) {
    #loginDiv,
    #registerDiv {
        width: 95%;
        padding: 1.5rem;
    }

    .buttons button {
        padding: 0.6rem 1.2rem;
    }
}

@media (max-width: 480px) {
    #botonesCambio button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
        width: 120px;
    }
}

/* Estilos para la transición 3D */
.flip-container {
  perspective: 500px;
  width: 90%;
  max-width: 50vh;
  height: 55vh; 
}

.flip-container.flipped .flipper {
  transform: rotateY(180deg);
}

.flipper {
  transition: 0.8s;
  transform-style: preserve-3d;
  position: relative;
  width: 100%;
  height: 100%;
  transition: all 1.0s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.front, .back {
  backface-visibility: hidden; /*Esto es para que no se vea el contenido cuando está "detras"*/
  position: absolute;
  width: 100%;
  height: 100%;
}

.front {
  z-index: 2;
  transform: rotateY(0deg);
}

.back {
  transform: rotateY(180deg);
}


#loginDiv, #registerDiv {
  max-height: 100%;
  overflow-y: auto;
}
</style>