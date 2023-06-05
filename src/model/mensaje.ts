import { Usuario } from "./usuario";

export interface Mensaje{
    [key: string]: any;
    usuario_enviador:Usuario;
    mensaje:string;


}