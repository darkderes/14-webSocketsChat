const { validarJWT } = require("../../middlewares");

let usuario = null;
let socket = null;

//referencias HTML

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const UlMensajes = document.querySelector('#UlUsuarios');
const UlUsuarios = document.querySelector('#UlMensajes');
const btnSalir = document.querySelector('#btnSalir');

const validarJWT = async() => {

   const token = localStorage.getItem('token') || '';

   if(token.length < 10) {
       window.location = 'index.html';
       throw new Error ('No hay token en el servidor');      
   }

   const resp = await fetch(url, {
       header: { 'x-token' : token }
   });
   const { usuario: userDB,token: tokenDB } = await resp.json();
   localStorage.setItem('token',tokenDB)
   usuario = userDB;
   document.title = usuario.nombre;
   await conectarSocket();
}

const conectarSocket = async() => {
       socket = io({ 
        'extraHeaders' : {
           'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect',() => {
        console.log('Sockets online');
    });
    socket.on('disconnect',() => {
        console.log('Sockets offline');
    }); 
    socket.on('recibir-mensajes',(payload) => {
        console.log(payload)
    });
    socket.on('usuarios-activos',dibujarUsuarios);
    socket.on('recibir-mensajes',dibujarMensajes);
    socket.on('mensaje-privado',( payload ) => {
        console.log('privado :',payload);
    });
}

const dibujarUsuarios = ( usuarios = [])=> {
    let userHtml = '';
    usuarios.forEach( ({nombre,uid}) => {
        users += `
          <li>
              <p>
                  <h5 class = "text-success"> ${ nombre } </h5>
                  <span class="fs-6 text-muted">${ uid } </span>
              </p>
          </li>

        `;
    });

    UlUsuarios.innerHTML = userHtml;
}

const dibujarMensajes = ( mensajes = [])=> {
    let mensajesHtml = '';
    mensajes.forEach( ({ nombre,mensaje}) => {
        mensajesHtml += `
          <li>
              <p>
                  <span class = "text-primary"> ${ nombre } </span>
                  <span>${ mensaje } </span>
              </p>
          </li>

        `;
    });

    UlUsuarios.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup',({keyCode}) => {

    const mensaje = txtMensaje.value;

    if(keyCode !== 13){ return; }
    if(mensaje.length === 0 ) { return;}

    socket.emit('enviar-mensaje',{mensaje,uid});
    txtMensaje.value = '';
})


const main =  async () => {
    await validarJWT();
} 
main();
//const socket = io();