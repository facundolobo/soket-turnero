const { TicketControl } = require("../models/ticket-control");

const ticketControl = new TicketControl(); //cuando creo una instancia ejecuto el constructor


const socketController =  (socket) => {


    socket.emit( 'ultimo-ticket', ticketControl.ultimo); //funcion emite cuando inicia el server
    socket.emit( 'estado-actual', ticketControl.ultimos4); //funcion emite cuando inicia el server

    //'ticket-pendientes' , ticketControl.tickets.lenght
    socket.broadcast.emit('ticket-pendientes', ticketControl.tickets.length ); //envia el numero de tickets restantes

    socket.on('siguiente-ticket', (payload , callback)=>{ //escucha si se activa este evento
        
        const siguiente = ticketControl.siguiente() //obtenemos el 'Ticket' + ticket.numero;
        callback(siguiente);

        
        //TODO notificar que hay un nuevo ticket pendiente de asignar
        socket.broadcast.emit('ticket-pendientes', ticketControl.tickets.length ); //envia el numero de tickets restantes a escritorios

         
    }) 
    
    socket.on('atender-ticket', ({escritorio}, callback) => { //buncion escucha para cuando haga click el boton btnAtender
        if(! escritorio){
            return callback({
                ok: false,
                msg: 'El Escritorio es obligatorio'
            })
        }
        const ticket = ticketControl.atenderTicket( escritorio ); 

        //amito 2 para que se actualive la pantalla donde envio y todas las otras 
        socket.emit('ticket-pendientes', ticketControl.tickets.length ); //envia el numero de tickets restantes
        socket.broadcast.emit('ticket-pendientes', ticketControl.tickets.length ); //envia el numero de tickets restantes

        //TODO: Notificar cambio en los ultimos4 -- broadcast porque debe emitirle a todas las pantallas , sino lo devuelve a la patanlla de escritorio
        socket.broadcast.emit( 'estado-actual', ticketControl.ultimos4); //funcion emite cuando inicia el server a la pantalla publico 
       
        if( !ticket){ //si no hay ticket que atender
            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            })            
        } else { //si existe ticket para atender
            callback({
                ok: true,
                ticket
            })
        }
    })
}
 
module.exports = {
    socketController
}