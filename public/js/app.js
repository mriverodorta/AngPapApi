/**
 * File: app.js
 * Creado por: Maikel Rivero Dorta on 28/01/2015.
 * Twitter: @mriverodorta
 * Descripcion: Aplicacion ejemplo de uso del servicio ngResource de AngularJS
 *              para el libro AngularJs Paso a Paso.
 */
angular.module('miApp', ['ngResource'])
    /**
     * Servicio utilizado para interactuar con el servidor
     */
    .factory('Mensajes', ['$resource', function ($resource) {
        return $resource('/api/mensajes/:id', {id: '@mid'}, {update: { method: 'PUT'}});
    }])
    /**
     * Ejemplo de la creación de un servicio con algunos de
     * las opciones de configuración de $resource
     */
    .factory('MensajesX', ['$resource', function ($resource) {
        return $resource('/api/mensajes/:id', {id: '@mid'}, {
            actualizar: {
                method: 'PUT',
                isArray: false,
                transformRequest: function (datos) {
                    return JSON.stringify(datos);
                },
                transformResponse: function (datos) {
                    return JSON.parse(datos);
                },
                cache: false,
                timeout: 2000,
                withCredentials: true,
                responseType: 'json'

            }
        })
    }])
    .controller('MensajesCtrl',['$scope', 'Mensajes', function ($scope, Mensajes) {
        Mensajes.query(function (datos) {
            $scope.mensajes = datos;
            // Imprimir en la consola si se ha resuelto la promesa
            console.info('Promesa de obtener los mensajes resuelta: ' + datos.$resolved);
        }, function (err) {
            // Imprimir en la consola un error si no se han obtenido los datos
            console.error('Error ' + err.status + ': ' + err.data.mensaje);
        });

        /**
         * Vía rápida de obtener los mensajes
         */
        //$scope.mensajes = Mensajes.query();

        /**
         * Ejemplifico que no se puede utilizar el recurso hasta que los datos
         * no hayan sido devueltos por el servidor y la promesa haya sido resuelta.
         */
        //console.log($scope.mensajes.$resolved);

        /**
         * Ejemplifico el uso de la propiedad $promise de la instancia de resource
        $scope.mensajes.$promise.then(function (data) {
            console.log(data[0].mensaje);
            console.log($scope.mensajes.$resolved);
        });
         */

        /**
         * Método para crear un nuevo mensaje en el servidor
         * utilizando el método save() del servicio Mensajes
         */
        $scope.nuevo = function () {
            Mensajes.save({}, $scope.msg, function (res) {
                $scope.mensajes.push(res);
                $scope.msg = {};
            });
        };

        /**
         * Método para eliminar un mensaje del servidor
         * utilizando el método remove() del servicio Mensajes
         */
        $scope.eliminar = function (index) {
            if ( $scope.actualizando && $scope.mensajes[index].mid == $scope.act.mid ) $scope.actualizando = false;
            Mensajes.remove({id: $scope.mensajes[index].mid}, function () {
                $scope.mensajes.splice(index,1);
            });
        };

        /**
         * Método para eliminar un mensaje del servidor
         * utilizando el método $remove() de una instancia de Mensajes
         */
        $scope.remove = function (index) {
            if ($scope.actualizando && $scope.mensajes[index].mid == $scope.act.mid ) $scope.actualizando = false;
            $scope.mensajes[index].$remove(function () {
                $scope.mensajes.splice(index,1);
            })
        };

        /**
         * Método para establecer un mensaje como listo para editar
         */
        $scope.seleccion = function (index) {
            $scope.actualizando = true;
            $scope.act = $scope.mensajes[index];

            //Ejemplo del uso del método get() del servicio Mensajes
            //$scope.act =  Mensajes.get({id: mid}, function (data, headersFn) {
            //     $scope.seleccionado = data;
            // })
        };

        /**
         * Método para actualizar un mensaje del servidor
         * utilizando el método update() especificado en la configuración
         * del servicio Mensajes
         */
        $scope.actualizar = function () {
            Mensajes.update($scope.act, function () {
                $scope.actualizando = false;
            })
        }
    }]);