define(["require", "exports"], function (require, exports) {
    "use strict";
    var PermisosService = (function () {
        function PermisosService() {
            this.url = {
                permisos: BASEURL + "/rest_modulousuario/permiso/",
                permisos_proyecto_sistemas: BASEURL + "/rest_modulousuario/proyecto_sistema_permisos/",
                permisos_genericos: BASEURL + "/rest_modulousuario/permisos_genericos/",
                permisos_byproyectosistema: BASEURL + "/rest_modulousuario/permisos_proyectosistema/",
                permisos_modulorol: BASEURL + "/rest_modulousuario/permisos_modulorol/",
                save_permisos_modulorol: BASEURL + "/rest_modulousuario/save_permisos_modulorol/"
            };
        }
        PermisosService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk == null ? this.url.permisos : "" + this.url.permisos + pk + "/",
                type: 'GET'
            });
        };
        PermisosService.prototype.getGenericos = function () {
            return $.ajax({
                url: this.url.permisos_genericos,
                type: 'GET'
            });
        };
        PermisosService.prototype.getModuloRol = function (rol_id, modulo_id) {
            return $.ajax({
                url: "" + this.url.permisos_modulorol + rol_id + "/" + modulo_id,
                type: 'GET'
            });
        };
        PermisosService.prototype.getPermisosbyProyectoSistema = function (id_proyecto, id_sistema) {
            return $.ajax({
                url: "" + this.url.permisos_proyecto_sistemas + id_proyecto + "/" + id_sistema,
                type: 'GET'
            });
        };
        PermisosService.prototype.getPermisosProyectoSistema = function (id_proyecto, id_sistema) {
            return $.ajax({
                url: "" + this.url.permisos_byproyectosistema + id_proyecto + "/" + id_sistema,
                type: 'GET'
            });
        };
        PermisosService.prototype.savePermisosModuloRol = function (objectData) {
            return $.ajax({
                url: "" + this.url.save_permisos_modulorol,
                type: 'POST',
                data: objectData
            });
        };
        PermisosService.prototype.update = function (pk, obj) {
            return $.ajax({
                url: "" + this.url.permisos + pk + "/",
                type: 'PUT',
                data: obj
            });
        };
        PermisosService.prototype.add = function (obj) {
            return $.ajax({
                url: "" + this.url.permisos,
                type: 'POST',
                data: obj
            });
        };
        PermisosService.prototype.delete = function (pk) {
            return $.ajax({
                url: "" + this.url.permisos + pk + "/",
                type: 'DELETE'
            });
        };
        return PermisosService;
    }());
    exports.PermisosService = PermisosService;
});
//# sourceMappingURL=permisos.service.js.map