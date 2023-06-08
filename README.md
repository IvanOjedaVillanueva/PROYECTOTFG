# PROYECTOTFG
 backend del proyecto de final de grado de Iván Ojeda Villanueva
## Funciones
 Esto es la APIREST que proporciona funciones necesarias para la creación de usuarios, logins, registros, creación de chats,de servidores y manejo de mensajes 
 
## Tecnologías utilizadas
 - NodeJS Como base del proyecto
 - Express Creación de rutas, controladores y middlewares
 - Typescript Lenguaje que remplaza el JavaScript del código
 - MongoDB Como base de datos que utilizaremos
 - Swagger Para la documentación sobre el enrutado
 - uuid Para las ids unicas de cada tabla de la base de datos
 - bcrypt Para el guardado de contraseñas encriptadas
 - JWT Para generar tokens de sesión
 - Socket.io Para las conexiones entre usuarios y crear chat
 
## Docker
Todo el proyecto esta alojado en una máquina de docker la cuál iniciamos de la siguiente manera

```
docker run -d \
  --name nombre-del-contenedor \
  -p 3000:3000 \
  eunpiko/proyecto-tfg:latest
```
Las variables utilizadas son las siguientes, puede cambiarlas a su gusto con -e NOMBRE_VARIABLE=VALOR

-  JWTKEY key                  (Clave segura encriptada de usuario)
-  KEYSSN a                    (Clave segura de express)
-  PORT 3000                   (Puerto de express)
-  DBHOST localhost            (Nombre del Host de la Base de datos)
-  DBPORT 27017                (Puerto de la base de datos)
-  DBUSER root                 (Usuario de la base de datos)
-  DBPASSWORD root             (Contraseña de la base de datos)

### También podemos iniciarlo con el docker-compose
```
version: '3'
services:
  webTFG:
    image: eunpiko/proyecto-tfg:latest
    environment:
      - "JWTKEY=g8+36kf8HDu+GbG2*ZjYp6AIA6D=yvZ_"
      - "KEYSSN=a"
      - "DBHOST=baseDeDatosTfg"
      - "PORT=3000"
      - "DBPORT=27017"
      - "DBUSER=root"
      - "DBPASSWORD=root"
      - "DBDATABASE=ProyectoBD"
    ports:
      - 3000:3000
      baseDeDatosTfg:
    image: mongo:latest
    ports:
      - 27017:27017
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=root
      - MONGO_INITDB_DATABASE=database
    volumes:
      - /var/lib/docker/volumes/a6c1ee15d37fb3ac34efac59e93bc963db5ce3a4a399fa0375ffec8282c48f84/_data:/data/db

```
