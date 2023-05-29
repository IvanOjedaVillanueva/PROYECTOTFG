import { Usuario } from "./usuario";

export interface CanalPrivado{
    [key: string]: any;
    uuid_canalPrivado?:string,
    nombre_de_canal:string;
    usuarios:Usuario[];
// REFERENCIA A mensajes
// REFERENCIA A USUARIO 1
// REFERENCIA A USUARIO 2

}