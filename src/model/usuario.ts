import { ObjectId } from "mongodb";
import { CanalPrivado } from "./canalPrivado";
import { Servidor } from "./servidor";

export interface Usuario{
    [key: string]: any;
    uuid_usuario?:string,
    foto_perfil?:string,
    nombre_de_usuario?:string,
    correo_electrónico?:string,
    contraseña?:string,
    última_conexión?:Date,
    estado?:string,
     // Array de referencias a los ID de los canales asociados al usuario
      // Array de referencias a los ID de los canales asociados al usuario

}