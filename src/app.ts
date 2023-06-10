require('dotenv').config()

import express, { Application, Router } from 'express';
import cors from 'cors';
import session from 'express-session';
import copypaste from './routes/copypaste';
import usuRoute from './routes/usuRoute';
import loginRoute from './routes/loginRoute';
import auth from "./middlewares/autenticarToken"
import serverRoute from './routes/serverRoute';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken'
import { MongoClient } from 'mongodb';
import connection from "./database/database";
import { CanalPrivado } from './model/canalPrivado';
import { Usuario } from './model/usuario';
import { Servidor } from './model/servidor';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';


class ServidorPrincipal {
  private app: Application;
  private servidorSocket: any;
  private io!: Server;
  private clientes: {
    socket: Socket;
    uuid_usuario: string;
  }[] = [];

  constructor() {
    this.app = express()
    this.servidorSocket = require('http').Server(this.app);
    this.io = require('socket.io')(this.servidorSocket, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Authorization', 'Content-Type'],
        credentials: true
      }

    });
    this.config()
    this.routes()
    this.wsEvents();



  }
  config() {
    this.app.set("port", process.env.PORT || 3000)
    
    const swaggerDocument = YAML.load('./swagger.yaml');

    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    this.app.set("socketport", process.env.SOCKET_PORT || 2999)
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(session({
      secret: String(process.env.KEYSSN),
      resave: false,
      saveUninitialized: true
    }));

  }
  routes() {
    let rutaBase: Router = Router();
    //RUTAS DE LA APP
    // rutaBase.use("/direct_channel",copypaste,auth);
    // rutaBase.use("/direct_message",copypaste,auth);
    // rutaBase.use("/message",copypaste,auth);
    // rutaBase.use("/rol",copypaste,auth);
    rutaBase.use("/server", serverRoute, auth);
    // rutaBase.use("/server_channel",copypaste,auth);
    // rutaBase.use("/server_user",copypaste,auth);
    rutaBase.use("/usuario", usuRoute);
    rutaBase.use("/login", loginRoute);


    this.app.use("/aplicacion", rutaBase);


  }
  wsEvents() {
    this.io.on('connection', (socket: Socket) => {
      console.log('Cliente conectado');
      const idHandShake = socket.id;
      const { token } = socket.handshake.query;

      jwt.verify(String(token), String(process.env.JWTKEY), (err, decod) => {
        if (err) {
          console.log("Error usuario no autenticado")
        } else if (typeof (decod) !== 'string') {
          console.log("SI FUNCIONA")
          this.clientes.push({ socket: socket, uuid_usuario: decod?.uid })

        }
      })

      // Manejar eventos del socket
      socket.on('enviarMensaje', async (data: any) => {
        console.log(data, "\n\n")
        const dataFormated = JSON.parse(data);
        console.log("Mensaje enviado:", dataFormated.msg);
        const client: MongoClient = connection();
        let uid: string = "";
        jwt.verify(String(token), String(process.env.JWTKEY), (err, decod) => {
          if (err) {
            console.log("Error usuario no autenticado")
          } else if (typeof (decod) !== 'string') {
            console.log("SI FUNCIONA")
            uid = decod?.uid;
          }
        })
        try {
          const db = client.db('ProyectoBD');

          const collection = db.collection('direct_channel');
          const collection2 = db.collection('user');

          var trimmed: CanalPrivado = dataFormated.canal;
          Object.keys(dataFormated.canal).forEach((key) => {
            if (dataFormated.canal[key] !== undefined) {
              trimmed[key] = dataFormated.canal[key];
            }
          });
          const usuario = await collection2.findOne({ uuid_usuario: uid });

          //NO SE SACAR EL AUTOR DEL TOQUEN OTRA VEZ
          const result = await collection.updateOne({ uuid_canalPrivado: dataFormated.canal.uuid_canalPrivado }, { $push: { mensajes: { usuario_enviador: { uuid_usuario: uid, nombre_de_usuario: usuario?.nombre_de_usuario }, mensaje: dataFormated.msg } } })
          console.log(result);
          this.clientes.forEach(cliente => {
            dataFormated.canal.usuarios.forEach((usuarioCanal: string) => {
              if (cliente.uuid_usuario == usuarioCanal && usuarioCanal != usuario?.uuid_usuario) {
                //ENVIAR EL MENSAJE
                console.log(usuarioCanal,"HOLAAAA");
                cliente.socket.emit('enviarMensaje', JSON.stringify({ msg: dataFormated.msg, sender: usuario }))
              }
            });
          });
        } catch (e) {
          console.error(e)
        } finally {

          await client.close();

        }
        ////////////////////////////////////////////////HASTA AHI PARA METER EL MENSAJE NUEVO EN SU CANAL, AHORA PARA ENVIAR A LOS Q LO TIENEN Q RECIBIR


      });
      socket.on('enviarMensajeServer', async (data: any) => {
        console.log(data, "\n\n")
        const dataFormated = JSON.parse(data);
        console.log("Mensaje enviado:", dataFormated.msg);
        const client: MongoClient = connection();
        let uid: string = "";
        jwt.verify(String(token), String(process.env.JWTKEY), (err, decod) => {
          if (err) {
            console.log("Error usuario no autenticado")
          } else if (typeof (decod) !== 'string') {
            console.log("SI FUNCIONA")
            uid = decod?.uid;
          }
        })
        try {
          const db = client.db('ProyectoBD');

          const collection = db.collection('server');
          const collection2 = db.collection('user');

          var trimmed: Servidor = dataFormated.server;
          Object.keys(dataFormated.server).forEach((key) => {
            if (dataFormated.server[key] !== undefined) {
              trimmed[key] = dataFormated.server[key];
            }
          });
          
          const usuario = await collection2.findOne({ uuid_usuario: uid });

          //NO SE SACAR EL AUTOR DEL TOQUEN OTRA VEZ
          const result = await collection.updateOne({ uuid_servidor: dataFormated.server.uuid_servidor }, { $push: { mensajes: { usuario_enviador: { uuid_usuario: uid, nombre_de_usuario: usuario?.nombre_de_usuario }, mensaje: dataFormated.msg } } })
          console.log(result);
          this.clientes.forEach(cliente => {
            dataFormated.server.usuarios.forEach((usuarioServer: string) => {
              if (cliente.uuid_usuario == usuarioServer && usuarioServer != usuario?.uuid_usuario) {
                //ENVIAR EL MENSAJE
                console.log(usuarioServer,"HOLAAAA");
                cliente.socket.emit('enviarMensajeServer', JSON.stringify({ msg: dataFormated.msg, sender: usuario }))
              }
            });
          });
        } catch (e) {
          console.error(e)
        } finally {

          await client.close();

        }
        ////////////////////////////////////////////////HASTA AHI PARA METER EL MENSAJE NUEVO EN SU CANAL, AHORA PARA ENVIAR A LOS Q LO TIENEN Q RECIBIR


      });



      // Enviar datos al cliente
    });

    this.io.on('close', (socket: Socket) => {
      console.log('Cliente desconectado');
      const idHandShake = socket.id;
      const { token } = socket.handshake.query;
      jwt.verify(String(token), String(process.env.JWTKEY), (err, decod) => {
        if (err) {
          console.log("Error usuario no autenticado")
        } else if (typeof (decod) !== 'string') {
          console.log("SI FUNCIONA")
          this.clientes.forEach((cliente, index) => {
            if (cliente.uuid_usuario == decod?.uid) {
              console.log("BORRANDO")
              this.clientes.splice(index, 1);
            }
          })
        }
      })
    })

  }
  start() {
    //this.app.listen(this.app.get("port"), () => console.log("Se ha iniciado el servidor en el puerto: ", this.app.get("port")))
    this.servidorSocket.listen(this.app.get("port"), () => console.log("Servidor iniciado, puerto de escucha: ", this.app.get("port")));


  }
}

let servidor = new ServidorPrincipal()
servidor.start()
