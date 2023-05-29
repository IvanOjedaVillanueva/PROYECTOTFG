import { Router } from "express"
import serverController from "../controller/serverController"
import auth from "../middlewares/autenticarToken";
import usuCon from "../controller/usuController";

class serverRoute{
    public router : Router = Router()
    constructor(){
        this.config();
    }
    config(){
        this.router.get("/yo/info",auth,serverController.getMiServidor);
        this.router.post("/yo/crearServidor",auth,usuCon.crearMiServidor);
        this.router.delete("/yo/borrarServidor/:id_servidor",auth,serverController.borrarMiServidor);

    }

}
const serverRutas = new serverRoute();
export default serverRutas.router;