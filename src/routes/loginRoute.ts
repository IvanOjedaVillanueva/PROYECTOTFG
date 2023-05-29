import { Router } from "express"
import loginController from "../controller/loginController"

class loginRoute{
    public router : Router = Router()
    constructor(){
        this.config();
    }
    config(){

        this.router.post("/",loginController.loginUsu);
    }

}
const loginRutas = new loginRoute();
export default loginRutas.router;