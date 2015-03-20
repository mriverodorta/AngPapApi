/**
 * File: server.js
 * Creado por: Maikel Rivero Dorta on 28/01/2015.
 * Twitter: @mriverodorta
 * Descripción: API RESTful de ejemplo para el libro AngularJs Paso a Paso.
 */

// Defino las dependencias del servidor
var express     = require('express'),
    path        = require('path'),
    bodyParser  = require('body-parser'),
    logger      = require('morgan'),
    mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    app         = express();

// Configuraciones básicas del servidor.
var appPort     = 3000,         // Puerto del servidor
    dbServer    = '127.0.0.1',  // Servidor de Base de Datos
    dbPort      = 27017,        // Puerto del servidor de BD
    dbName      = 'apap';       // Nombre de la Base de Datos

/**
 * Modelos para utilizar la base de datos con mongodb y mongoose
 */

// Esquema de mensajes.
var mensajesSchema = Schema({
    usuario: String,
    mensaje: String,
    mid: String
});
var Mensaje = mongoose.model('Mensajes', mensajesSchema);

/**
 * Seeds de la base de datos
 */

// Seed de los mensajes.
var MensajesSeedData = [
    {
        "usuario": "barbara17",
        "mensaje": "Magnam et labore illum praesentium culpa eum vel blanditiis. Rerum doloremque quia omnis repellendus blanditiis sit dolores. Laboriosam consequatur labore quos iusto dolorem ut libero."
    },
    {
        "usuario": "lowell.weissnat",
        "mensaje": "Voluptatum suscipit illum magnam aut quia. Beatae quae quisquam quia doloribus ut. Dolor vitae qui cupiditate dolorem autem voluptatem perferendis."
    },
    {
        "usuario": "donavon76",
        "mensaje": "Sunt nobis praesentium iste mollitia eius ducimus nam. Voluptatum cum consequuntur et quaerat ut rerum. Est nisi eos qui deserunt officia corporis quis. Praesentium fugit doloremque aut voluptatum expedita. Cum quia temporibus et et ut aperiam."
    },
    {
        "usuario": "qframi",
        "mensaje": "Minima consequuntur quas sunt repellat dolor. Blanditiis cumque sunt exercitationem natus tempore. Non ab ad et deleniti libero."
    },
    {
        "usuario": "kerluke.ulices",
        "mensaje": "Eaque distinctio inventore natus. Consequatur officia molestiae facere deleniti ut possimus. Rem molestias impedit facere ducimus sequi."
    },
    {
        "usuario": "dino95",
        "mensaje": "Beatae et aut minus dolor facilis voluptas. Repudiandae voluptatem exercitationem in voluptates."
    },
    {
        "usuario": "marjory.gibson",
        "mensaje": "Aut a a architecto et laudantium assumenda facilis. Sed molestiae tenetur ut praesentium eaque quos voluptate tempora. Nihil consequatur sint aut est ut et. Est est fugiat aperiam aspernatur dicta. Consequatur ipsa voluptatum enim et sequi sunt."
    },
    {
        "usuario": "wuckert.arielle",
        "mensaje": "Corrupti occaecati culpa alias commodi et mollitia ab. Tenetur ut dolorem assumenda ea placeat ut consequatur. Earum ut et et cum."
    },
    {
        "usuario": "leif.bogisich",
        "mensaje": "Non excepturi sit aut alias quis mollitia dolorem. Perspiciatis corporis recusandae libero at. Quia qui et cupiditate est facere id."
    },
    {
        "usuario": "sage.farrell",
        "mensaje": "Aliquam rerum nulla dolores deserunt soluta facere sit. Explicabo esse soluta ex sit voluptates. Eum veniam neque placeat et fugiat totam. Pariatur odit provident possimus rerum."
    }
];
Mensaje.find({}, function (err, data) {
    var errors = false;
    if ( !err && data.length == 0 ){
        for (var i = MensajesSeedData.length - 1; i >= 0; i--) {
            var mensaje = new Mensaje({
                usuario: MensajesSeedData[i].usuario,
                mensaje: MensajesSeedData[i].mensaje
            });
            mensaje.mid = mensaje.id;
            mensaje.save(function (err) {
                if ( err ){
                    console.log('MensajesTableSeeder: Error intentando agregar un mensaje.');
                    errors = true;
                }
            });
        }
    }
    if ( errors ){console.log('Han ocurrido errores ejecutando [MensajesTableSeeder]');}
});

//Gestión de peticiones JSON
app.use(bodyParser.json());

//Logger en modo de desarrollo
app.use(logger('dev'));

//Conexion con el servidor de bases de dato
mongoose.connect('mongodb://'+dbServer+':'+dbPort+'/'+dbName, function (err) {
    if (err) { console.log(err); }
    else { console.log('Conectado a la BD...'); }
});

//Sirvo los archivos estáticos que reciden en la carpeta public
app.use(express.static(path.resolve('public')));

//Creo las rutas RESTful para responder a las peticiones en /api/mensajes
app.route('/api/mensajes')
    .get(function (req, res) {
        Mensaje.find({}, function (err, mensajes) {
            if ( !err && mensajes ){
                res.json(mensajes);
            } else {
                res.status(500).json({error:'No se ha podido encontrar ningun mensaje'});
            }
        });

        //Simular error 500
        //res.status(500).json({mensaje:'Error interno en el servidor'});
    })
    .post(function (req, res) {
        var mensaje = new Mensaje({
            usuario: req.body.usuario,
            mensaje: req.body.mensaje
        });
        mensaje.mid = mensaje.id;
        mensaje.save(function (err) {
            if ( !err ){
                res.json(mensaje);
                console.log(mensaje);
            } else {
                res.status(500).json({mensaje:'No se ha podido procesar el nuevo mensaje'});
            }
        });
    });
app.route('/api/mensajes/:id')
    .get(function (req, res) {
        var id = req.params.id;
        Mensaje.findOne({_id: id}, function (err, mensaje) {
            if ( !err && mensaje ){
                res.json(mensaje);
            } else {
                res.status(404).json({mensaje: 'No se ha encontrado ningun mensaje con la id: '+ id});
            }
        })
    })
    .put(function (req, res) {
        var id = req.params.id;
        Mensaje.findById(id, function (err, msg) {
            if ( !err && msg ){
                msg.usuario = req.body.usuario;
                msg.mensaje = req.body.mensaje;
                msg.save(function (err) {
                    if ( !err ){
                        res.json(msg);
                    } else {
                        res.status(500).json({mensaje: 'No se ha podido actualizar el mensaje.'})
                    }
                });
            } else {
                res.status(404).json({mensaje: 'No se ha encontrado ningun mensaje con la id: '+ id});
            }
        })
    })
    .delete(function (req, res) {
        var id = req.params.id;
        Mensaje.findById(id, function (err, msg) {
            if ( !err && msg ){
                msg.remove(function (err) {
                    if ( !err ){
                        res.json({mensaje: 'Mensaje eliminado correctamente'});
                    } else {
                        res.status(500).json({mensaje: 'No se ha podido eliminar el mensaje'});
                    }
                });
            } else {
                res.status(404).json({mensaje: 'No se ha encontrado ningun mensaje con la id: '+ id});
            }
        })
    });

/**
 * Envio el archivo /public/main.html para todas las peticiones
 * que no correspondan con las rutas anteriores.
 */
app.get('*', function (req, res) {
    res.sendFile('/public/main.html', {root:__dirname});
});

//Defino el puerto en el que el servidor esperará las peticiones
app.set('port', appPort);

//Inicio el servidor para esperar peticiones
var server = app.listen(app.get('port'), function () {
    console.log('Servidor listo y esperando conexiones en el puerto: ' + server.address().port);
});
