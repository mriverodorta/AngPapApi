#Servidor API RESTful con Nodejs y Express

Para propósitos del libro [AngularJS Paso a Paso](https://leanpub.com/angularjs-paso-a-paso) como contenido extra he desarrollado un servidor utilizando **NodeJS**, **Express.js** y **MongoDB**. En este servidor podrás hacer prueba de todos los ejemplos expuestos en el libro. También dispone de un **API RESTful** para realizar peticiones y es el que se ha utilizado en el **Capítulo 10** para demostrar el uso del servicio **$resource** de Angular.

## Requerimientos

* [http://nodejs.org](NodeJS)
* [http://bower.io](Bower)

## Instalando dependencias
Para instalar las dependencias abrimos la consola y vamos hasta la carpeta donde tenemos el servidor. Ejecutamos el comando `npm install` y esperamos a que termine de instalar. Cuando **npm** finalice ejecutará **bower** para gestionar las librerías.

## Configurando el servidor
El servidor en si es solo el archivo llamado server.js que está en la raíz. Para configurarlo abre el archivo en tu editor de texto favorito y ve hasta la línea 18. Aquí se definen 4 variables.

1. **appPort**: El puerto por el que el servidor estará esperando conexiones.

1. **dbServer**: Dirección del servidor de base de datos MongoDB

1. **dbPort**: Puerto del servidor de base de datos MongoDB

1. **dbName**: Nombre de la base de datos que utilizará este servidor.

## Iniciando el servidor

Para iniciar el servidor dirígete en la consola hasta la carpeta del servidor y ejecuta `node server` y el servidor comenzará a esperar conexiones por el puerto que has definido en la configuración.

## Uso del servidor

La primera vez que el servidor inicie intentará introducir mensajes de prueba en la base de datos para posteriormente utilizarlos en los ejemplos. En caso de que no pueda imprimirá el error en la consola.

El servidor posee una API RESTful para mensajes. Solo tiene definido dos rutas conformando así un recurso REST.

* Para acceder a la lista de los mensajes puedes hacerlo mediante una petición **GET** a */api/mensajes*.

* Para acceder a un mensaje especifico ejecuta una petición **GET** a */api/mensajes/:mid* donde **:mid** sea la id del mensaje. Este se puede obtener en la propiedad **mid** que posee cada mensaje.

* Para crear un nuevo mensaje ejecuta una petición **POST** */api/mensajes* con un objeto json como cuerpo de la petición. El objeto debe contener dos propiedades. 1: usuario y 2: mensaje.

* Para actualizar un mensaje debes hacer una petición **PUT** a */api/mensajes/:mid* con un objeto json en el cuerpo de la petición con las propiedades **usuario** y **mensaje**.

* Para eliminar un mensaje ejecuta una petición **DELETE** a */api/mensajes/:mid*.

En caso de que exista algún error en alguna de las peticiones el servidor devolverá un objeto **json** con la propiedad mensaje explicando el error ocurrido.

Las peticiones **POST** y **PUT** devuelven el nuevo objeto para que pueda ser utilizado en el cliente.

Para todas las demás peticiones **GET** que no cumplan con ninguna de las rutas anteriormente mencionadas se devolverá el archivo **public/main.html** como respuesta. En el archivo **public/js/app.js** reside una aplicación **AngularJS**. Para cualquier prueba que necesites realizar puedes modificarlo y hacer cualquier ejemplo necesario.

