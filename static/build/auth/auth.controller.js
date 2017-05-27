/**
 * Created by Administrador on 21/04/2017.
 */
define(["require", "exports", 'auth.service', '../core/core'], function (require, exports, auth_service_1, core_1) {
    "use strict";
    var AuthController = (function () {
        function AuthController() {
            var _this = this;
            this.loginService = new auth_service_1.LoginService();
            $('#frm_auth').on('submit', function (ev) {
                ev.preventDefault();
                _this.authenticate();
            });
        }
        AuthController.prototype.authenticate = function () {
            var credenciales = { usuario: $('input[name="usuario"]').val(), clave: $('input[name="clave"]').val() };
            this.loginService.Authenticate(credenciales).done(function (response) {
                console.log(response);
                if (response.valid)
                    window.location.replace(core_1.CoreConfig.BASEURL + "/Bienvenido?key=" + response.key);
            });
        };
        AuthController.prototype.logout = function () {
            this.loginService.Logout().done(function () {
                window.location.replace(core_1.CoreConfig.BASEURL);
            });
        };
        return AuthController;
    }());
    exports.AuthController = AuthController;
    new AuthController();
});
//# sourceMappingURL=auth.controller.js.map