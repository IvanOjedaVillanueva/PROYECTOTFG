# PROYECTOTFG
 backend del proyecto de final de grado de Iván Ojeda Villanueva
## Funciones
 Esto es la APIREST que proporciona funciones necesarias para la creación de usuarios, logins, registros, creación de chats,de servidores y manejo de mensajes 
 
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

