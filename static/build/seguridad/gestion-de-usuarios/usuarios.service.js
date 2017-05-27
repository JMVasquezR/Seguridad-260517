/**
 * Created by Administrador on 6/03/2017.
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    var UsuarioService = (function () {
        function UsuarioService() {
            this.url = {
                usuario: BASEURL + "/rest_usuario/usuario/",
                usuario_detalle: BASEURL + "/rest_usuario/usuario_detalle/",
                save_rol: BASEURL + "/usuario/saveRol/"
            };
            this.url_departamentos = "http://cpv.inei.gob.pe:85/ubigeo/departamentos/";
            this.url_provincias = "http://cpv.inei.gob.pe:85/ubigeo/provincias/";
            this.url_distritos = "http://cpv.inei.gob.pe:85/ubigeo/distritos/";
        }
        UsuarioService.prototype.get = function (pk) {
            if (pk === void 0) { pk = null; }
            return $.ajax({
                url: pk == null ? this.url.usuario_detalle : "" + this.url.usuario_detalle + pk + "/",
                type: 'GET'
            });
        };
        UsuarioService.prototype.update = function (pk, obj) {
            return $.ajax({
                url: "" + this.url.usuario + pk + "/",
                type: 'PUT',
                data: obj
            });
        };
        UsuarioService.prototype.add = function (obj) {
            return $.ajax({
                url: "" + this.url.usuario,
                type: 'POST',
                data: obj
            });
        };
        UsuarioService.prototype.saveRol = function (rol, user_id) {
            return $.ajax({
                url: "" + this.url.save_rol,
                type: 'POST',
                data: { rol_id: rol, user_id: user_id }
            });
        };
        UsuarioService.prototype.delete = function (pk) {
            return $.ajax({
                url: "" + this.url.usuario + pk + "/",
                type: 'DELETE'
            });
        };
        UsuarioService.prototype.getDepartamentos = function () {
            return $.ajax({
                async: false,
                url: this.url_departamentos,
                type: 'GET'
            });
        };
        UsuarioService.prototype.getProvincias = function (ccdd) {
            return $.ajax({
                async: false,
                url: "" + this.url_provincias + ccdd + "/"
            });
        };
        UsuarioService.prototype.getDistritos = function (ccdd, ccpp) {
            return $.ajax({
                async: false,
                url: "" + this.url_distritos + ccdd + "/" + ccpp + "/"
            });
        };
        return UsuarioService;
    }());
    exports.UsuarioService = UsuarioService;
});
//# sourceMappingURL=usuarios.service.js.map