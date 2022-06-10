
//Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');


const socket = io();



socket.on('connect', () => {

    btnCrear.disabled = false; //es visible el vector

});

socket.on('disconnect', () => {

    btnCrear.disabled = true //quitamos el boton
});   

socket.on('ultimo-ticket', (ultimo)=>{ //funcon escucha, para mostrarme el ultimo ticket en el frontend
    lblNuevoTicket.innerText = `Ticket `+ultimo;

})

btnCrear.addEventListener( 'click', () => {

    socket.emit( 'siguiente-ticket', null, ( ticket ) => {
        lblNuevoTicket.innerText = ticket;
        console.log(ticket)
    });

});


