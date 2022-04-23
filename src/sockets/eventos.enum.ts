export enum Eventos {

    ORDEN="Orden", //Envia Info al Admin
    CUSTOMER = "Customer", // Envia info al customer
    DELIVERY = "Delivery", // Envia info al Delivery
    UBICACION = "Ubicacion", // Envia coordenadas 
    DESCONECTAR ="disconnect", //SOLO SE USA EN BACK
    CONECTAR = "connect", // SOLO SE USA EN BACK
    CONFIGUSER ="salaRestaurant", //Configura al usuario en su sala (debe ir siempre en el evento connect) (debes mandar id del usuario dentro del payload) 



}

export enum Salas {

    ADMIN="salaRestaurant-Colaborador",
    DELIVERY ="salaRestaurant-Delivery",
    CUSTOMER = "salaRestaurant-Customer"


}