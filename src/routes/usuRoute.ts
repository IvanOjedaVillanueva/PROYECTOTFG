import { Router } from "express"
import usuController from "../controller/usuController"
import auth from "../middlewares/autenticarToken";

class usuRoute{
    public router : Router = Router()
    constructor(){
        this.config();
    }
    config(){
        this.router.get("/yo/info",auth,usuController.getMiUsuario);
        this.router.get("/yo/canales",auth,usuController.getMiCanalesPrivados);
        this.router.get("/yo/servidores",auth,usuController.getMiServidores);

        this.router.get("/:id_usu",usuController.getUsuario);
        this.router.get("/",usuController.getAllUsuarios);
        this.router.post("/",usuController.insertUsuario);
        this.router.post("/canalPrivado",auth,usuController.crearCanalPrivado);

        this.router.delete("/:id_usu",usuController.deleteUsuario);
        this.router.put("/:id_usu",usuController.updateUsuario);
        this.router.delete("/yo/borrarCanal/:id_canal",auth,usuController.borrarMiCanal);


    }

}
const usuRutas = new usuRoute();
export default usuRutas.router;