import { Request, Response } from "express";
import connection from "../database/database";
import { MongoClient } from "mongodb";
import { Servidor } from "../model/servidor";
const bcrypt = require('bcrypt');
const saltRounds = 10;
class serverController {
    public async getMiServidor(req:Request,res:Response){
        const client: MongoClient = connection();
        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('server');
            //@ts-ignore
            const uid = req.uid;
            const query = { admin : uid }; 
            const server = await collection.find(query).toArray();
            res.status(200).json(server);

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    public async borrarMiServidor(req:Request,res:Response){
        const client: MongoClient = connection();
        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('server');
            //@ts-ignore
            const uid = req.uid;
            const query = { admin : uid,uuid_servidor:req.params.id_servidor}; 
            const server = await collection.deleteOne(query);
            if(server.deletedCount != 0){
                res.status(200).json({msg:"Se ha borrado el servidor"});
            }else{
                res.status(404).json({ msg: "Error, no se pudo borrar el servidor" });
            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
}
const serverCon = new serverController();
export default serverCon;