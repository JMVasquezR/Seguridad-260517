define(["require", "exports", '../webservices/webservice.service'], function (require, exports, webservice_service_1) {
    "use strict";
    var WebServiceView = (function () {
        function WebServiceView() {
            this.webservices = null;
            this.webserviceService = new webservice_service_1.WebServiceService();
            this.get();
        }
        WebServiceView.prototype.get = function () {
            var _this = this;
            this.webserviceService.get().done(function (webservices) {
                _this.webservices = webservices;
                _this.drawAccordionWebService();
            });
        };
        WebServiceView.prototype.drawAccordionWebService = function () {
            var _this = this;
            var panelshtml = '';
            console.log(this.webservices);
            this.webservices.map(function (ws, index) {
                panelshtml += _this.setPanelAccordion(ws, index);
            });
            $('#accordion-styled').html(panelshtml);
        };
        WebServiceView.prototype.setPanelAccordion = function (panelParameters, index) {
            var parametersTable = '';
            var urlParameters = panelParameters.url + "/";
            panelParameters.parameters.map(function (parameter) {
                parametersTable += "<tr><td>" + parameter.nombre + "</td>\n                                   <td>" + parameter.descripcion + "</td>\n                                   <td>" + parameter.tipovariable.nombre + "</td>\n                               </tr>";
                urlParameters += parameter.parameterexample + "/";
            });
            urlParameters += "?key=r10tuzgqruefb0n8p2ke94bdr4mhk3kn";
            return "<div class=\"panel\">\n                        <div class=\"panel-heading bg-info\">\n                            <h6 class=\"panel-title\">\n                                <a data-toggle=\"collapse\" data-parent=\"#accordion-styled\"\n                                   href=\"#accordion-styled-group" + index + "\">" + panelParameters.nombre + "</a>\n                            </h6>\n                        </div>\n                        <div id=\"accordion-styled-group" + index + "\" class=\"panel-collapse collapse\">\n                            <div class=\"panel-body\">\n                            <div class=\"content-group\">\n\t\t\t\t\t\t\t\t\t\t<div class=\"list-group\">\n\t\t\t\t\t\t\t\t\t\t    <a href=\"" + BASEURL + "/services/" + urlParameters + "\" target=\"_blank\" class=\"list-group-item list-group-item-info\"><span class=\"text-bold\">SERVICIO DE EJEMPLO</span>\n                                            " + BASEURL + "/services/" + urlParameters + "</a>\n\t\t\t\t\t\t\t\t\t\t\t<a href=\"#\" class=\"list-group-item\">\n\t\t\t\t\t\t\t\t\t\t\t\t<h6 class=\"list-group-item-heading\"><i class=\"icon-bus position-left\"></i>Descripci\u00F3n</h6>\n\t\t\t\t\t\t\t\t\t\t\t\t<p class=\"list-group-item-text\">" + panelParameters.descripcion + "</p>\n\t\t\t\t\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t</div>\n                                <table class=\"table table-responsive table-bordered\">\n                                <thead>\n                                <th>Parametro</th>\n                                <th>Descripci\u00F3n</th>\n                                <th>Tipo Parametro</th>\n                                </thead>\n                                <tbody>\n                                    " + parametersTable + "\n                                </tbody>\n                                </table>\n                            </div>\n                        </div>\n                    </div>";
        };
        return WebServiceView;
    }());
    new WebServiceView();
});
//# sourceMappingURL=webservice.view.js.map