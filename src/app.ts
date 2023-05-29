require('dotenv').config()

import express, { Application, Router } from 'express';
import cors from 'cors';
import session from 'express-session';
import copypaste from './routes/copypaste';
import usuRoute from './routes/usuRoute';
import loginRoute from './routes/loginRoute';
import auth from "./middlewares/autenticarToken"
import serverRoute from './routes/serverRoute';


class Server {
  private app: Application;
  constructor() {
    this.app = express()
    this.config()
    this.routes()

  }
  config() {
    this.app.set("port", process.env.PORT || 3000)
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(session({
      secret: String(process.env.KEYSSN),
      resave: false,
      saveUninitialized: true
    }));

  }
  routes(){
    let rutaBase: Router = Router();
    //RUTAS DE LA APP
    // rutaBase.use("/direct_channel",copypaste,auth);
    // rutaBase.use("/direct_message",copypaste,auth);
    // rutaBase.use("/message",copypaste,auth);
    // rutaBase.use("/rol",copypaste,auth);
    rutaBase.use("/server",serverRoute,auth);
    // rutaBase.use("/server_channel",copypaste,auth);
    // rutaBase.use("/server_user",copypaste,auth);
    rutaBase.use("/usuario",usuRoute);
    rutaBase.use("/login",loginRoute);


    this.app.use("/aplicacion",rutaBase);


  }
  start(){
    this.app.listen(this.app.get("port"),()=>console.log("Se ha iniciado el servidor en el puerto: ", this.app.get("port")))
  }
}

let servidor = new Server()
servidor.start()
