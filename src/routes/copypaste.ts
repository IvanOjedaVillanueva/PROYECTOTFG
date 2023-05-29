import { Router } from "express"
import copypastecontroller from "../controller/copypastecontroller"
// async function run(){
//     try{
//         const database = client.database("ProyectoBD");
//         const direct_channel = database.collection('direct_channel');
//         const direct_message = database.collection('direct_message');
//         const message = database.collection('message');
//         const rol = database.collection('rol');
//         const server = database.collection('server');
//         const server_channel = database.collection('server_channel');
//         const server_user = database.collection('server_user');
//         const user = database.collection('user');

//     }finally{
//         await client.close();
//     }
//}

class copypaste{
    public router : Router = Router()
    constructor(){
        this.config();
    }
    config(){
        this.router.get("/ruta",copypastecontroller.cosas);
    }

}
const pruebaRutas = new copypaste();
export default pruebaRutas.router;