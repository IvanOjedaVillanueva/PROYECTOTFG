import { Usuario } from "./usuario";
import { Mensaje } from "./mensaje";

export interface Servidor{
    [key: string]: any;
    uuid_servidor?:string,
    imagen_de_servidor?:string,
    nombre_de_servidor?:string,
    descripcion?:string,
    fecha_de_creacion?:string,
    usuarios?:Usuario[],
    admin?:Usuario;
    mensajes?:Mensaje[]


}