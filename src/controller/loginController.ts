import { Request, Response } from "express";
import connection from "../database/database";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
class loginController {
    private static generarToken(id_usu:string):String{
        const payload = {check:true,uid:id_usu};
        const token = jwt.sign(payload,String(process.env.JWTKEY),{expiresIn:'7d',algorithm:"HS256"})
        return token;
    }
    public async loginUsu(req: Request, res: Response) {
        const client: MongoClient = connection();

        try {
            if(req.body.contraseña==null || req.body.nombre_de_usuario==null||req.body.nombre_de_usuario==""||req.body.contraseña==""){
                res.status(404).json({msg:"usuario o contraseña no introducidos"});
                return;
            }
            const db = client.db('ProyectoBD');
            const collection = db.collection('user');
            const query = { nombre_de_usuario: req.body.nombre_de_usuario};
            const registro = await collection.findOne(query);
            if(!registro || !bcrypt.compareSync(req.body.contraseña,registro.contraseña)){
                res.status(401).json({msg:"usuario o contraseña invalidos"});
            }else{
                res.status(200).json({ msg: "Se ha logueado el usuario" , token:loginController.generarToken(registro.uuid_usuario) });
            }
        }catch (e) {
            console.error(e)
            res.status(500).json({ resultado: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
}
const loginCon = new loginController();
export default loginCon;