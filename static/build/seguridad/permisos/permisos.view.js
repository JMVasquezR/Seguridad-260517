define(["require", "exports", 'permisos.service', '../proyectos/proyectos.service', '../../core/utils', '../../core/helper.inei'], function (require, exports, permisos_service_1, proyectos_service_1, utils, helper_inei_1) {
    "use strict";
    var objectHelper = new helper_inei_1.ObjectHelper();
    var PermisoController = (function () {
        function PermisoController() {
            this.proyectosistema = null;
            this.permisoService = new permisos_service_1.PermisosService();
            this.proyectosService = new proyectos_service_1.ProyectosService();
            this.permiso_json_rules = {
                nombre: {
                    maxlength: 30
                },
                descripcion: {
                    maxlength: 50
                },
                codigo: {
                    number: true
                },
                dom_sufijo_name: {
                    maxlength: 15
                }
            };
            this.onInit();
        }
        PermisoController.prototype.onInit = function () {
            var _this = this;
            this.getPermisos();
            this.permiso_form_validate = $('#form_permiso').validate(utils.validateForm(this.permiso_json_rules));
            this.getProyectos();
            $('#btn_add_permiso').on('click', function () {
                _this.setModal('Agregar Permiso', null);
                $('#modal_permiso').modal('show');
            });
            $('#btn_add_permiso_proyecto_sistema').on('click', function () {
                _this.setModal('Agregar Permiso', null);
                $('#modal_permiso').modal('show');
            });
            $('#btn_save_permiso').on('click', function () {
                if (_this.permiso_selected === null) {
                    $('#tab_permisos_genericos').hasClass('active') ? _this.addPermiso() : _this.addPermiso(true);
                }
                else {
                    _this.editPermiso();
                }
            });
            this.setChangeProyectos();
            this.setChangeSistemas();
        };
        PermisoController.prototype.getPermisos = function () {
            var _this = this;
            this.permisoService.getGenericos().done(function (data) {
                _this.permisos = data;
                utils.drawTable(_this.permisos, ['codigo', 'nombre', 'descripcion', 'dom_name_sufijo'], 'id', {
                    edit_name: 'btn_edit_permiso',
                    delete_name: 'btn_delete_permiso',
                    enumerar: true,
                    table_id: 'table_permisos'
                });
                _this.upgradeHTMLElements();
            }).fail(function () {
                utils.showSwalAlert('Ha ocurrido un error', 'Error', 'error');
            });
        };
        PermisoController.prototype.upgradeHTMLElements = function () {
            var _this = this;
            $('li[name="btn_edit_permiso"]').on('click', function (event) {
                $('#tab_permisos_genericos').hasClass('active') ? _this.setPermiso($(event.currentTarget).data('value')) : _this.setPermiso($(event.currentTarget).data('value'), true);
                $('#tab_permisos_genericos').hasClass('active') ? _this.setModal('Editar Permiso', _this.permiso_selected) : _this.setModal('Editar Permiso', _this.permiso_selected);
                $('#modal_permiso').modal('show');
            });
            $('li[name="btn_delete_permiso"]').on('click', function (event) {
                _this.setPermiso(parseInt($(event.currentTarget).data('value')));
                utils.alert_confirm(function () { return _this.deletePermiso(parseInt($(event.currentTarget).data('value'))); }, 'Esta seguro que desea eliminar?', 'error');
            });
        };
        PermisoController.prototype.setChangeProyectos = function () {
            var _this = this;
            $('#select_proyectos').on('change', function (event) {
                _this.setProyecto(event.target.value);
                var _html = '';
                _html += "<option value=\"-1\">Seleccione</option>";
                _this.proyecto_selected.sistemas.map(function (value, key) {
                    _html += "<option value=\"" + value.id + "\">" + value.nombre + "</option>";
                });
                $('#select_sistemas').html(_html);
                $('.bootstrap-select').selectpicker('destroy');
                $('.bootstrap-select').selectpicker('render');
            });
        };
        PermisoController.prototype.setChangeSistemas = function () {
            var _this = this;
            $('#select_sistemas').on('change', function (event) {
                _this.setSistema(event.target.value);
                _this.proyectosService.getProyectoSistema(_this.proyecto_selected.id, _this.sistema_selected.id).done(function (response) {
                    _this.proyectosistema = response[0];
                });
                _this.getPermisosbyProyectoSistema();
            });
        };
        PermisoController.prototype.getPermisosbyProyectoSistema = function () {
            var _this = this;
            this.permisoService.getPermisosbyProyectoSistema(this.proyecto_selected.id, this.sistema_selected.id).done(function (data) {
                _this.permisos_proyectosistema = data;
                var message_html = '';
                if (_this.permisos_proyectosistema.length) {
                    $('#message_empty_permisos').html('');
                    utils.drawTable(_this.permisos_proyectosistema, ['codigo', 'nombre', 'descripcion', 'dom_name_sufijo'], 'id', {
                        edit_name: 'btn_edit_permiso',
                        delete_name: 'btn_delete_permiso',
                        enumerar: true,
                        table_id: 'table_permisos_proyecto_sistema'
                    });
                    _this.upgradeHTMLElements();
                }
                else {
                    message_html = utils.showDivAlert('No hay permisos creandos aún, haga click en el boton + para agregar permisos', 'info');
                    $('#message_empty_permisos').html(message_html);
                    $('#table_permisos_proyecto_sistema').find('tbody').html('');
                }
            }).fail(function (error) {
                console.log(error);
            });
        };
        PermisoController.prototype.getProyectos = function () {
            var _this = this;
            this.proyectosService.getSistemasProyecto().done(function (data) {
                _this.proyectos = data;
                var html = '';
                html += "<option value=\"-1\">Seleccione</option>";
                _this.proyectos.map(function (value, key) {
                    html += "<option value=\"" + value.id + "\">" + value.nombre + "</option>";
                });
                $('#select_proyectos').html(html);
                $('.bootstrap-select').selectpicker();
            });
        };
        PermisoController.prototype.addPermiso = function (proyectosistema) {
            var _this = this;
            if (proyectosistema === void 0) { proyectosistema = false; }
            if (this.permiso_form_validate.valid()) {
                var valid_form = objectHelper.formToObject(utils.serializeForm('form_permiso'));
                // if (this.proyecto_selected !== null && this.sistema_selected !== null) {
                //     valid_form['proyectosistema'] = this.proyectosistema.id;
                // }
                proyectosistema ? valid_form['proyectosistema'] = this.proyectosistema.id : '';
                this.permisoService.add(valid_form).done(function () {
                    _this.permiso_form_validate.resetForm();
                    proyectosistema ? _this.getPermisosbyProyectoSistema() : _this.getPermisos();
                    $('#modal_permiso').modal('hide');
                    utils.showSwalAlert('El permiso se ha agregado con éxito!', 'Exito!', 'success');
                }).fail(function () {
                    utils.showSwalAlert('Ha ocurrido un error!, favor de contactar con el administrador', 'Error', 'error');
                    $('#modal_permiso').modal('hide');
                });
            }
        };
        PermisoController.prototype.editPermiso = function (proyectosistema) {
            var _this = this;
            if (proyectosistema === void 0) { proyectosistema = false; }
            if (this.permiso_form_validate.valid()) {
                var valid_form = objectHelper.formToObject(utils.serializeForm('form_permiso'));
                this.permisoService.update(this.permiso_selected.id, valid_form).done(function () {
                    _this.permiso_form_validate.resetForm();
                    proyectosistema ? _this.getPermisosbyProyectoSistema() : _this.getPermisos();
                    $('#modal_permiso').modal('hide');
                    utils.showSwalAlert('El permiso se ha editado con exito!', 'Exito!', 'success');
                }).fail(function () {
                    utils.showSwalAlert('Ha ocurrido un error!, favor de contactar con el administrador', 'Error', 'error');
                    $('#modal_permiso').modal('hide');
                });
            }
        };
        PermisoController.prototype.deletePermiso = function (pk) {
            var _this = this;
            this.permisoService.delete(pk).done(function () {
                _this.getPermisosbyProyectoSistema();
                _this.getPermisos();
                utils.showSwalAlert('El permiso se ha borrado con éxito', 'Eliminado', 'success');
            }).fail(function () { return utils.showSwalAlert('Ha ocurrido un error!, favor de contactar con el administrador', 'Error', 'error'); });
        };
        PermisoController.prototype.setPermiso = function (pk, proyectosistema) {
            if (proyectosistema === void 0) { proyectosistema = false; }
            var data = null;
            if (proyectosistema) {
                this.permisos_proyectosistema.filter(function (value) {
                    if (value.id == pk) {
                        data = value;
                    }
                });
                this.permisos_proyectosistema_selected = data;
            }
            this.permisos.filter(function (value) {
                if (value.id == pk) {
                    data = value;
                }
            });
            this.permiso_selected = data;
        };
        PermisoController.prototype.setProyecto = function (pk) {
            var data = null;
            this.proyectos.filter(function (value) {
                if (value.id == pk) {
                    data = value;
                }
            });
            this.proyecto_selected = data;
        };
        PermisoController.prototype.setSistema = function (pk) {
            var data = null;
            this.proyecto_selected.sistemas.filter(function (value) {
                if (value.id == pk) {
                    data = value;
                }
            });
            this.sistema_selected = data;
        };
        PermisoController.prototype.setModal = function (modal_title, data_selected) {
            if (data_selected === void 0) { data_selected = null; }
            this.permiso_selected = data_selected;
            $('#modal_title_modulo_form').text(modal_title);
            if (data_selected != null) {
                for (var i in data_selected) {
                    if ($("[name=" + i + "]").length) {
                        $("[name=" + i + "]").val(data_selected[i]);
                    }
                }
            }
            else {
                $('#form_permiso')[0].reset();
                this.permiso_form_validate.resetForm();
            }
        };
        return PermisoController;
    }());
    new PermisoController();
});
//# sourceMappingURL=permisos.view.js.map