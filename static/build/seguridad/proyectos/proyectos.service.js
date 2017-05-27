define(["require", "exports"], function (require, exports) {
    "use strict";
    var ProyectosService = (function () {
        function ProyectosService() {
            this.url = {
                proyectos: BASEURL + "/rest_proyectos/proyecto/",
                sistemas_proyecto: BASEURL + "/rest_proyectos/sistemas_proyecto/",
                proyecto_sistema: BASEURL + "/rest_proyectos/get_proyecto_sistema/"
            };
            this.url_proyectosSiga = BASEURL + "/rest_proyectos/getProyectosSiga/";
            this.url_sistemas = BASEURL + "/rest_sistemas/sistema/";
        }
        ProyectosService.prototype.getSistemasProyecto = function () {
            return $.ajax({
                url: this.url.sistemas_proyecto,
                type: 'GET'
            });
        };
        ProyectosService.prototype.getProyectoSistema = function (id_proyecto, id_sistema) {
            return $.ajax({
                url: "" + this.url.proyecto_sistema + id_proyecto + "/" + id_sistema,
                type: 'GET'
            });
        };
        ProyectosService.prototype.getSistemas = function () {
            return $.ajax({
                url: this.url_sistemas,
                type: 'GET'
            });
        };
        ProyectosService.prototype.getProyectosSiga = function () {
            return $.ajax({
                url: this.url_proyectosSiga,
                type: 'GET'
            });
        };
        ProyectosService.prototype.get = function () {
            return $.ajax({
                url: this.url.proyectos,
                type: 'GET'
            });
        };
        ProyectosService.prototype.add = function (data) {
            return $.ajax({
                url: this.url.proyectos,
                type: 'POST',
                data: data
            });
        };
        ProyectosService.prototype.update = function (pk, data) {
            return $.ajax({
                url: "" + this.url.proyectos + pk,
                type: 'PATCH',
                data: data
            });
        };
        ProyectosService.prototype.delete = function (pk) {
            return $.ajax({
                url: "" + this.url.proyectos + pk,
                type: 'DELETE'
            });
        };
        return ProyectosService;
    }());
    exports.ProyectosService = ProyectosService;
});
//# sourceMappingURL=proyectos.service.js.map