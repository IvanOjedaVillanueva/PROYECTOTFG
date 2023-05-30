import { Request, Response, raw } from "express";
import connection from "../database/database";
import { MongoClient, ObjectId } from "mongodb";
import { Usuario } from "../model/usuario";
import { CanalPrivado } from "../model/canalPrivado";
import { Servidor } from "../model/servidor";
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
class usuController {
    public async getMiUsuario(req: Request, res: Response) {
        const client: MongoClient = connection();
        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('user');
            //@ts-ignore
            const uid = req.uid;
            const query = { uuid_usuario: uid };
            const usuario = await collection.findOne(query);
            res.status(200).json(usuario);

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    public async getMiCanalesPrivados(req: Request, res: Response) {//Metodo para devolver canales privados en los q esta una persona
        const client: MongoClient = connection();
        try {
            const db = client.db('ProyectoBD');

            const userCollection = db.collection('user');
            //@ts-ignore
            const uid = req.uid;
            const query = { uuid_usuario: uid };
            const usuario = await userCollection.findOne(query);
            if (usuario == null) {
                res.status(401).json({ msg: "Usuario no encontrado" });
                return;
            }
            //res.status(200).json(usuario);

            if (usuario.canales != undefined) {

                const id_canales = usuario.canales;
                let arrayCanales: [CanalPrivado] = [{ uuid_canalPrivado: "", nombre_de_canal: "", usuarios: [] }];
                arrayCanales.pop();
                const queryCanales = db.collection('direct_channel');

                // await id_canales.forEach(async (canalPrivado: ObjectId) => {
                for (const canalPrivado of id_canales) {


                    const resultadoCanales = await queryCanales.findOne({ _id: canalPrivado })
                    arrayCanales.push({ uuid_canalPrivado: resultadoCanales?.uuid_canalPrivado, nombre_de_canal: resultadoCanales?.nombre_de_canal, usuarios: resultadoCanales?.usuarios });


                }

                res.status(200).json({ canales: arrayCanales });

            } else {
                res.status(200).json({ canales: undefined });
            }
        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error de servidor" });
        }
        await client.close();

    }
    public async getMiServidores(req: Request, res: Response) {//Metodo para devolver servidores en los q esta una persona
        const client: MongoClient = connection();
        try {
            const db = client.db('ProyectoBD');
            //@ts-ignore
            const uid = req.uid;
            const queryServidores = db.collection('server');
            const servidores = await queryServidores.find({ usuarios: [uid] }).toArray();
            console.log();
            res.status(200).json(servidores);


        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    public async getUsuario(req: Request, res: Response) {
        const client: MongoClient = connection();
        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('user');
            const query = { nombre_de_usuario: `${req.params.id_usu}` };
            const usuario = await collection.findOne(query);
            res.status(200).json(usuario);

        } catch (e) {
            console.error(e)
            res.status(500).json({ result: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    public async getAllUsuarios(req: Request, res: Response) {
        const client: MongoClient = connection();

        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('user');
            const usuario = await collection.find({}).project({ contraseña: 0 }).toArray();
            if (usuario.length > 0) {
                res.status(200).json(usuario);
            } else {
                res.status(404).json({ msg: "Error, no hay datos" });

            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    public async insertUsuario(req: Request, res: Response) {
        const client: MongoClient = connection();

        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('user');
            var nuevoUsu: Usuario = {
                uuid_usuario: uuidv4(),
                foto_perfil: req.body.foto_perfil,
                nombre_de_usuario: req.body.nombre_de_usuario,
                correo_electrónico: req.body.correo_electrónico,
                contraseña: await bcrypt.hash(req.body.contraseña, saltRounds),
                última_conexión: req.body.última_conexión,
                estado: req.body.estado
            }
            var trimmed: Usuario = {};

            Object.keys(nuevoUsu).forEach((key) => {
                if (nuevoUsu[key] !== undefined) {
                    trimmed[key] = nuevoUsu[key];
                }
            });
            const result = await collection.insertOne(trimmed);
            if (result.insertedId != null) {
                res.status(201).json({ msg: "Usuario creado" });

            } else {
                res.status(500).json({ msg: "FALLO AL INSERTAR" });

            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    public async crearCanalPrivado(req: Request, res: Response) {
        const client: MongoClient = connection();

        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('direct_channel');
            const collection2 = db.collection('user');
            //@ts-ignore
            const uid = req.uid;
            var nuevoCanal: CanalPrivado = {
                uuid_canalPrivado: uuidv4(),
                nombre_de_canal: req.body.nombre_de_canal,
                usuarios: [uid,req.body.uuid_usuario]
            }
            var trimmed: CanalPrivado = {
                nombre_de_canal: nuevoCanal.nombre_de_canal,
                usuarios: [uid,req.body.uuid_usuario]
            };
            Object.keys(nuevoCanal).forEach((key) => {
                if (nuevoCanal[key] !== undefined) {
                    trimmed[key] = nuevoCanal[key];
                }
            });
            console.log(req.body.uuid_usuario)
            const inserted = await collection.insertOne(trimmed);
            const result = await collection2.updateOne({ uuid_usuario: uid }, { $push: { canales: inserted.insertedId } });//CAMBAR CAMPO DE ID
            if(uid!=req.body.uuid_usuario){
                const result2 = await collection2.updateOne({ uuid_usuario: req.body.uuid_usuario }, { $push: { canales: inserted.insertedId } });//CAMBAR CAMPO DE ID
            }

            if (result.modifiedCount > 0) {
                res.status(201).json({ msg: "Canal creado" });

            } else {
                res.status(500).json({ msg: "FALLO AL Crear canal" });

            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ resultado: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////
    public async crearMiServidor(req: Request, res: Response) {
        const client: MongoClient = connection();

        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('server');
            //@ts-ignore
            const uid = req.uid;
            var nuevoServidor: Servidor = {
                uuid_servidor: uuidv4(),
                nombre_de_servidor: req.body.nombre_de_servidor,
                usuarios: [uid],
                admin: uid
            }
            var trimmed: Servidor = {
                nombre_de_servidor: nuevoServidor.nombre_de_servidor,
                usuarios: nuevoServidor.usuarios,
                admin: nuevoServidor.admin
            };
            Object.keys(nuevoServidor).forEach((key) => {
                if (nuevoServidor[key] !== undefined) {
                    trimmed[key] = nuevoServidor[key];
                }
            });
            const inserted = await collection.insertOne(trimmed);


            if (inserted.insertedId != null) {
                res.status(201).json({ msg: "Servidor creado" });

            } else {
                res.status(500).json({ msg: "FALLO AL Crear Servidor" });

            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ resultado: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    public async entrarServidor(req: Request, res: Response) {
        const client: MongoClient = connection();

        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('server');
            //@ts-ignore
            const uid = req.uid;
            const result = await collection.updateOne({ id_servidor: req.body.uuid_servidor }, { $push: { usuarios: uid } });//CAMBAR CAMPO DE ID

            if (result.modifiedCount != 0) {
                res.status(201).json({ msg: "Se entro en el servidor" });

            } else {
                res.status(500).json({ msg: "FALLO AL entrar en el Servidor" });

            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ resultado: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////
    public async deleteUsuario(req: Request, res: Response) {
        const client: MongoClient = connection();

        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('user');
            const usuario = await collection.deleteOne({ nombre_de_usuario: req.params.id_usu });
            if (usuario.deletedCount > 0) {
                res.status(201).json({ result: "Usuario Borrado" });
            } else {
                res.status(404).json({ result: "Error, no se pudo borrar" });
            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ resultado: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    public async updateUsuario(req: Request, res: Response) {
        const client: MongoClient = connection();

        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('user');
            var nuevoUsu: Usuario = {
                foto_perfil: req.body.foto_perfil,
                nombre_de_usuario: req.body.nombre_de_usuario,
                correo_electrónico: req.body.correo_electrónico,
                contraseña: req.body.contraseña,
                última_conexión: req.body.última_conexión,
                estado: req.body.estado
            }
            var trimmed: Usuario = {};
            Object.keys(nuevoUsu).forEach((key) => {
                if (nuevoUsu[key] !== undefined) {
                    trimmed[key] = nuevoUsu[key];
                }
            });
            const result = await collection.updateOne({ nombre_de_usuario: req.params.id_usu }, { $set: trimmed });//CAMBAR CAMPO DE ID
            if (result.modifiedCount > 0) {
                res.status(200).json({ result: "Usuario modificado" });

            } else {
                res.status(404).json({ result: "FALLO AL MODIFICAR" });

            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ resultado: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
    public async borrarMiCanal(req: Request, res: Response) {
        const client: MongoClient = connection();
        try {
            const db = client.db('ProyectoBD');

            const collection = db.collection('direct_channel');
            const collection2 = db.collection('user');
            
            //@ts-ignore
            const query = { uuid_canalPrivado: req.params.id_canal };
            const canalquery = await collection.findOne(query);
            for (const usu of canalquery?.usuarios) {
                const aux = canalquery?._id+"";
                const queryUsu = await collection2.updateOne({uuid_usuario:usu},{$pull:{canales:canalquery?._id}});//pq no furulaaaa
                if(queryUsu.modifiedCount!=0){
                    console.log("ACTUALIZAMOS ALGO");
                }else{
                    console.log("no actualizamos nose pq probar")
                }
            }

            const canal = await collection.deleteOne(query);

            if (canal.deletedCount != 0) {
                res.status(200).json({ msg: "Se ha borrado el canal" });
            } else {
                res.status(404).json({ msg: "Error, no se pudo borrar el canal" });
            }

        } catch (e) {
            console.error(e)
            res.status(500).json({ msg: "Error de servidor" });
        } finally {
            await client.close();
        }
    }
}
const usuCon = new usuController();
export default usuCon;