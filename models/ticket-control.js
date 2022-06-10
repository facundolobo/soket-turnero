const path = require('path');
const fs = require('fs');

class Ticket{
    constructor( numero, escritorio){ //instaciamos al elemento
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl{

    constructor(){
        this.ultimo   = 0;
        this.hoy      = new Date().getDate(); //sale el numero de hoy
        this.tickets  = [];
        this.ultimos4  = []; //los que se mostraran en pantalla

        this.init();
    }

    get toJson(){
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    init(){
        const data = require('../db/data.json'); //obtiene los datos de data.json
        const {hoy, tickets, ultimo, ultimos4} = require('../db/data.json');
        if(hoy === this.hoy){
            this.hoy = hoy,
            this.tickets = tickets,
            this.ultimos4 = ultimos4,
            this.ultimo = ultimo            
        }else {
            // Es para guardar
            this.guardarDB()
        }
    }

    guardarDB(){
        const dbPath = path.join( __dirname, '../db/data.json'); //creamos la direcion apra guardar
        fs.writeFileSync(dbPath, JSON.stringify( this.toJson )); //guarda los datos, seusa JSON.stringify para guardar objetos en archivos planos ya q no se peude enviar objetos
    }

    siguiente(){
        this.ultimo += 1;
        // console.log(this.ultimo)
        const ticket = new Ticket( this.ultimo , null) //creamos un ticket con el numero +`1 y null en escritorio que todavia no lo atiene nadie
        console.log(ticket.numero)
        this.tickets.push( ticket ); //lo guardamos en el vector tickets
        this.guardarDB(); //guardamos en la base de datos
        return 'Ticket ' + ticket.numero; //devolvemos el numero q le toco
    }

    atenderTicket( escritorio ){
        //No tenemos tickets
        if(this.tickets.length === 0){
            return null;
        }

        const ticket = this.tickets.shift(); // shift retorna el primer elemento del array luego lo borra
        ticket.escritorio = escritorio;  //agrego una propiedad a ticket q es el escritorio
        this.ultimos4.unshift(ticket); // unshift funcion para agregar alk principio de el array 

        //borramos el ultimo del vector que se muestra en pantalla
        if (this.ultimos4.length > 4){
            this.ultimos4.splice(-1,1); //splice fucnion para posicionarse y coratar el ultimo
        }

        this.guardarDB();
        return ticket;


    }
}

module.exports = { 
    TicketControl
}