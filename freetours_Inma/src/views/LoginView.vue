<script setup>
import router from '@/router';
import { ref } from 'vue';
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
        fetch('http://localhost/api/api.php/usuarios?login', options)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    userLogged.value = data.user;
                    console.log("User logged: " + JSON.stringify(userLogged.value));
                    emit('loggedIn', userLogged.value);
                    errorLogin.value = '';
                    //Redirigimos al login
                    router.push('/');
                } else {
                    errorLogin.value = data.message;
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
            fetch('http://localhost/api/api.php/usuarios', {
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
    }
}
//HAY QUE HACER VALIDACIÓN DE LOS DATOS DEL FORM ANTES DEL REGISTRO

</script>

<template>

    <div id="generalDiv" class="d-flex flex-column justify-content-center align-items-center mt-5">
        <div id="buttonsChange" class="d-flex justify-content-evenly w-50">
            <RouterLink class="text-white" to="/login">
                <button class="btn btn-primary text-decoration-none">Login</button>
            </RouterLink>
            <RouterLink class="text-white text-decoration-none" to="/register">
                <button class="btn btn-primary">Registro</button>
            </RouterLink>
        </div>
        <!-- --------- LOGIN -------------->
        <div v-if="route.path == '/login'" id="loginDiv"
            class="w-50 d-flex flex-column justify-content-center align-items-center bg-white m-2 p-5">
            <h2>LOGIN</h2>
            <!--<p>Aquí irá un flash message al completar registro??</p>-->
            <form action="POST">
                <label for="email">Correo</label>
                <input v-model="form.email" type="text" name="email">
                <label for='contraseña'>Contraseña</label>
                <input v-model="form.contraseña" type="password" name='contraseña'>
                <p v-if="errorLogin" class="text-danger mt-2">{{ errorLogin }}</p>
                <div class="buttons mt-2 d-flex justify-content-evenly">
                    <button type="submit" @click.prevent="login" class="btn btn-success">Iniciar Sesion</button>
                    <RouterLink class="text-black text-decoration-none" to="/"> <button
                            class="btn btn-danger">Cancelar</button></RouterLink>
                </div>
            </form>
        </div>
        <!------------ REGISTRO -------------->
        <div v-if="route.path == '/register'" id="registerDiv"
            class="w-50 d-flex flex-column justify-content-center align-items-center bg-white m-2 p-5">
            <p v-if="exitoRegistro" class="text-success mb-2">{{ exitoRegistro }}</p>
            <h2>REGISTRO</h2>
            <!--MOSTRAR AQUÍ UN MODAL DE REGISTRO COMPLETADO-->
            <form action="">
                <label for="nombre">Nombre</label>
                <input v-model="formRegistro.nombre" type="text" name="nombre">
                <label for="email">Correo</label>
                <input v-model="formRegistro.email" type="text" name="email">
                <label for="pass">Contraseña</label>
                <input v-model="formRegistro.contraseña" type="text" name="contraseña">
                <p v-if="errorRegistro" class="text-danger mt-2">{{ errorRegistro }}</p>
                <div class="buttons mt-2 d-flex justify-content-evenly">
                    <button @click.prevent="userRegister" class="btn btn-success">Registrarse</button>
                    <RouterLink class="text-black text-decoration-none" to="/"> <button
                            class="btn btn-danger">Cancelar</button></RouterLink>
                </div>
            </form>
        </div>
    </div>

</template>

<style>
#generalDiv {
    height: 50vh;
    /* Ocupará toda la pantalla */
}

#loginDiv,
#registerDiv {
    width: 100%;
    max-width: 400px;
    /* Para que no sean demasiado anchos */
    text-align: center;
    box-shadow: 5px 5px 10px #c3c3c3;
    border-radius: 10px;
}

form {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
    color: black;
}

input {
    max-width: 300px;
}
</style>