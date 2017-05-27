define(["require", "exports", '../core/helper.inei', '../core/utils'], function (require, exports, helper_inei_1, utils_1) {
    "use strict";
    var sessionHelper = new helper_inei_1.SessionHelper();
    var objectHelper = new helper_inei_1.ObjectHelper();
    $('#iniciar_sesion').on('click', function (event) {
        "use strict";
        var url = BASEURL + "/usuario/authentication/";
        var data = { usuario: $('#usuario').val(), clave: $('#clave').val() };
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            success: function (response) {
                if (objectHelper.isEmpty(response)) {
                    $('#div_error_message').html(utils_1.showDivAlert('Usuario o contraseña no validos', 'danger'));
                }
                else {
                    $('#div_error_message').html(utils_1.showDivAlert('Bienvenido!', 'success'));
                    $('#iniciar_sesion').addClass('disabled');
                    setTimeout(function () {
                        sessionHelper.setSession('usuario', response);
                        var session = sessionHelper.getSession();
                        window.location.href = BASEURL + "/" + session.routes[1].slug;
                    }, 1000);
                }
            }
        });
    });
});
//# sourceMappingURL=login.js.map