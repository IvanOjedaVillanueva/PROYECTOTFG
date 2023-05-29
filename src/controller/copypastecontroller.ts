import { Request,Response } from "express";
class copypastecontroller{
    public async cosas(req:Request,res:Response){
        res.status(200).json({actividad:"Activo"})
    }
}
const prueba = new copypastecontroller();
export default prueba;