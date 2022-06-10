//Referencias HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender    = document.querySelector('button');
const lblTicket     = document.querySelector('small');
const divAlerta     = document.querySelector('.alert'); 
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if( !searchParams.has('escritorio' )){ //debe colocar escritorio en el search seguro
    window.location = ' index.html';
    throw new Error('El escritorio es obligatorio')
}

const escritorio = searchParams.get('escritorio');// obtenemos lo que escribio en el input de escritorio
lblEscritorio.innerText = escritorio;

divAlerta.style.display = 'none'; //ocultamos la caja de alertas (no hay  tickets) cuando inicia la aplicaicon


const socket = io();


socket.on('connect', () => {

    btnAtender.disabled = false; //es visible el vector

});

socket.on('disconnect', () => {

    btnAtender.disabled = true //quitamos el boton
});   

socket.on('ticket-pendientes', ( pendientes )=>{ //funcon escucha, para mostrarme el ultimo ticket en el frontend
    if( pendientes === 0){
        lblPendientes.style.display = 'none';
    }else{
        lblPendientes.style.display = '';
        lblPendientes.innerText = pendientes;
    }

    
    
})

btnAtender.addEventListener( 'click', () => {

    socket.emit('atender-ticket', { escritorio }, ({ok, ticket, msg}) =>{ //funcion emitir eniamos escritorio y un callback
        if(!ok){
            lblTicket.innerText = 'Nadie.';
            return divAlerta.style.display = ''; //si no existe ticket muestra la caja de alerta
        }

        lblTicket.innerText =  'Ticket '+ticket.numero;

    })
    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //     lblNuevoTicket.innerText = ticket;
    // });

});

