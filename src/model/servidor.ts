import { ObjectId } from "mongodb";

export interface Servidor{
    [key: string]: any;
    uuid_servidor?:string,
    imagen_de_servidor?:string,
    nombre_de_servidor?:string,
    descripcion?:string,
    fecha_de_creacion?:string,
    usuarios?:ObjectId[],
    admin?:ObjectId;
// REFERENCIA A ADMIN USU    id_administrador?:'id_administrador',
// REFERENCIA A usuarios conectados    id_administrador?:'id_administrador',
// REFERENCIA A canales -> REFERENCIA Mensajes   id_administrador?:'id_administrador',
// REFERENCIA A ROLES DEL SERVIDOR

}