define(["require", "exports"], function (require, exports) {
    "use strict";
    var RolesService = (function () {
        function RolesService() {
            this.url = BASEURL + "/rest_modulousuario/rol/";
            this.url_rol_modulo = BASEURL + "/rest_modulousuario/modulos_rol/";
            this.url_modulosbyrol = BASEURL + "/rest_modulousuario/modulosbyrol/";
        }
        RolesService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk == null ? this.url_rol_modulo : "" + this.url_rol_modulo + pk + "/",
                type: 'GET'
            });
        };
        RolesService.prototype.update = function (pk, obj) {
            return $.ajax({
                url: "" + this.url + pk + "/",
                type: 'PATCH',
                data: obj
            });
        };
        RolesService.prototype.add = function (obj) {
            return $.ajax({
                url: "" + this.url,
                type: 'POST',
                data: obj
            });
        };
        RolesService.prototype.delete = function (pk) {
            return $.ajax({
                url: "" + this.url + pk + "/",
                type: 'DELETE'
            });
        };
        RolesService.prototype.getModulos = function (pk) {
            return $.ajax({
                url: "" + this.url_modulosbyrol + pk + "/"
            });
        };
        return RolesService;
    }());
    exports.__esModule = true;
    exports["default"] = RolesService;
    var PermisosService = (function () {
        function PermisosService() {
            this.url = {
                permisos: BASEURL + "/rest_modulousuario/permiso/"
            };
        }
        PermisosService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk == null ? this.url.permisos : "" + this.url.permisos + pk + "/",
                type: 'GET'
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
    var ModulosRolService = (function () {
        function ModulosRolService() {
            this.url = {
                modulosrol: BASEURL + "/rest_modulousuario/edit_modulorol/"
            };
        }
        ModulosRolService.prototype.editModulosRol = function (objectData) {
            return $.ajax({
                url: "" + this.url.modulosrol,
                type: 'POST',
                data: objectData
            });
        };
        return ModulosRolService;
    }());
    exports.ModulosRolService = ModulosRolService;
});
//# sourceMappingURL=roles.service.js.map