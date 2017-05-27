define(["require", "exports", '../core/core'], function (require, exports, core_1) {
    "use strict";
    var LoginService = (function () {
        function LoginService() {
            this.url = core_1.CoreConfig.BASEURL + "/services/authenticate/";
            this.logout = core_1.CoreConfig.BASEURL + "/services/logout/";
        }
        LoginService.prototype.Authenticate = function (credenciales) {
            return $.ajax({
                url: this.url,
                type: 'POST',
                data: credenciales
            });
        };
        LoginService.prototype.Logout = function () {
            return $.ajax({
                url: this.logout,
                type: 'POST',
                data: { key: core_1.CoreConfig.KEY }
            });
        };
        return LoginService;
    }());
    exports.LoginService = LoginService;
});
//# sourceMappingURL=auth.service.js.map