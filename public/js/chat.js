const { validarJWT } = require("../../middlewares");

let usuario = null;
let socket = null;

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
    const socket = io({ 
        'extraHeaders' : {
           'x-token': localStorage.getItem('token')
        }
    });

}

const main =  async () => {

    await validarJWT();

} 

main();
//const socket = io();