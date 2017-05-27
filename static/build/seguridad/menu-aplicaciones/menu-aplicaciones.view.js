define(["require", "exports", './menu-aplicaciones.service', '../../core/utils', '../../core/helper.inei'], function (require, exports, menu_aplicaciones_service_1, utils, helper_inei_1) {
    "use strict";
    var objectHelper = new helper_inei_1.ObjectHelper();
    var proyectosService = new menu_aplicaciones_service_1.ProyectosService();
    var sistemasService = new menu_aplicaciones_service_1.SistemasService();
    var moduloService = new menu_aplicaciones_service_1.ModuloService();
    var form_modulo_validate;
    var proyectos;
    var sistemas;
    var sistema_selected;
    var proyecto_selected;
    var modulosRecursive;
    var modulo_selected;
    var key_tree_node_selected = null;
    var jsonRulesModuloForm = {
        nombre: {
            maxlength: 100
        },
        descripcion: {
            maxlength: 255
        },
        slug: {
            maxlength: 500
        },
        codigo: {
            maxlength: 8
        },
        template_html: {
            maxlength: 255
        },
        icon: {
            maxlength: 100
        }
    };
    var addModulo = false;
    var updateModulo = false;
    var proyectosistema_id = null;
    var MenuAplicacionesController = {
        getProyectos: function (byPk) {
            proyectosService.getProyectos(byPk).done(function (data) {
                proyectos = data;
                var html = '';
                proyectos.map(function (value, key) {
                    html += "<tr data-value=\"" + value.id + "\"><td>" + value.sigla + "</td><td>" + value.anio + "</td><td>" + value.nombre + "</td></tr>";
                });
                $('#table_proyectos').find('tbody').html(html);
                $('#table_proyectos').find('tr').on('click', function (event) {
                    MenuAplicacionesController.getSistemasbyProyecto($(event.currentTarget).data('value'));
                });
            }).fail(function (error) {
                utils.showSwalAlert('Ocurrio un error!', 'Error', 'error');
            });
        },
        getSistemasbyProyecto: function (by) {
            proyecto_selected = objectHelper.findInArrayObject(proyectos, by, 'id');
            var html = '';
            sistemas = proyecto_selected.sistemas;
            sistemas.map(function (value, key) {
                html += "<tr data-value=\"" + value.id + "\"><td>" + (key + 1) + "</td><td>" + value.nombre + "</td></tr>";
            });
            $('#table_sistemas').find('tbody').html(html);
            $('#table_sistemas').find('tr').on('click', function (event) {
                sistema_selected = objectHelper.findInArrayObject(sistemas, $(event.currentTarget).data('value'), 'id');
                MenuAplicacionesController.getModuloRecursive();
            });
        },
        getSistemas: function (byPk) {
            sistemasService.getSistemas(byPk).done(function (data) {
                sistemas = data;
            }).fail(function (error) {
                utils.showSwalAlert('Ocurrio un error!', 'Error', 'error');
            });
        },
        getModuloRecursive: function () {
            // moduloService.getModulosRecursive(proyecto_selected.id, sistema_selected.id).done(data => {
            proyectosService.getProyectoSistema(proyecto_selected.id, sistema_selected.id).done(function (data) {
                // proyectosService.getProyectoSistema(proyecto_selected.id, sistema_selected.id).done((data) => {
                //     proyectosistema_id = data[0].id
                // });
                proyectosistema_id = data[0].id;
                moduloService.modulosRecursive(data[0].codigo).done(function (data) {
                    modulosRecursive = [data['menuRecursive']];
                    console.log(modulosRecursive);
                    var treeFormat = utils.jsonFormatFancyTree2(modulosRecursive);
                    var options_tree = {
                        checkbox: false,
                        selectMode: 1,
                        source: treeFormat,
                        beforeSelect: function (event, data) {
                            if (data.node.folder) {
                                return false;
                            }
                        },
                        select: function (event, data) {
                            // Display list of selected nodes
                            var selNodes = data.tree.getSelectedNodes();
                            // convert to title/key array
                            selNodes.length == 0 ? key_tree_node_selected = null : '';
                            var selKeys = $.map(selNodes, function (node) {
                                key_tree_node_selected = parseInt(node.key);
                            });
                            if (key_tree_node_selected != null) {
                                moduloService.getModulos(key_tree_node_selected).done(function (data) {
                                    modulo_selected = data;
                                    $('#btn_edit_modulo').prop('disabled', false);
                                    $('#btn_add_modulo').prop('disabled', false);
                                    $('#btn_delete_modulo').prop('disabled', false);
                                }).fail(function (error) {
                                    $('#btn_edit_modulo').prop('disabled', true);
                                    $('#btn_add_modulo').prop('disabled', true);
                                    $('#btn_delete_modulo').prop('disabled', true);
                                });
                            }
                            else {
                                $('#btn_edit_modulo').prop('disabled', true);
                                $('#btn_add_modulo').prop('disabled', true);
                                $('#btn_delete_modulo').prop('disabled', true);
                            }
                        },
                        click: function (event, data) {
                            if (!data.node.folder) {
                                data.node.toggleSelected();
                            }
                        },
                        dblclick: function (event, data) {
                            data.node.toggleExpanded();
                        },
                        keydown: function (event, data) {
                            if (event.which === 32) {
                                data.node.toggleSelected();
                                return false;
                            }
                        }
                    };
                    $('#tree_modulos').fancytree(options_tree);
                    $('#tree_modulos').fancytree("destroy");
                    $('#tree_modulos').fancytree(options_tree);
                });
            });
        },
        addModulo: function () {
            if (form_modulo_validate.valid()) {
                var valid_form = objectHelper.formToObject(utils.serializeForm('form_modulo'));
                valid_form.modulo_padre = modulo_selected.id;
                valid_form.proyectosistema = proyectosistema_id;
                moduloService.addModulo(valid_form).done(function (response) {
                    utils.showSwalAlert('Se ha agregado el Modulo correctamente', 'Exito!', 'success');
                    $('#modal_modulo_form').modal('hide');
                    form_modulo_validate.resetForm();
                    MenuAplicacionesController.getModuloRecursive();
                }).fail(function (error) {
                    utils.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
                });
            }
        },
        updateModulo: function () {
            if (form_modulo_validate.valid()) {
                var valid_form = objectHelper.formToObject(utils.serializeForm('form_modulo'));
                valid_form.proyectosistema = proyectosistema_id;
                moduloService.updateModulo(modulo_selected.id, valid_form).done(function (response) {
                    utils.showSwalAlert('Se ha editado el Modulo correctamente', 'Exito!', 'success');
                    $('#modal_modulo_form').modal('hide');
                    form_modulo_validate.resetForm();
                    MenuAplicacionesController.getModuloRecursive();
                }).fail(function (error) {
                    utils.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
                });
            }
        },
        deleteModulo: function () {
            moduloService.deleteModulo(modulo_selected.id).done(function () {
                utils.showSwalAlert('El Modulo se ha eliminado exitosamente', 'Exito!', 'success');
                MenuAplicacionesController.getModuloRecursive();
            }).fail(function (error) {
                utils.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
            });
        }
    };
    var appMenuAplicaciones = {
        init: function () {
            MenuAplicacionesController.getProyectos();
            MenuAplicacionesController.getSistemas();
            form_modulo_validate = $('#form_modulo').validate(utils.validateForm(jsonRulesModuloForm));
        },
        setModal: function (modal_title, modulo_selected_form) {
            $('#modal_title_modulo_form').text(modal_title);
            if (modulo_selected_form != null) {
                for (var i in modulo_selected_form) {
                    if ($("[name=" + i + "]").length) {
                        if (i == 'is_padre') {
                            modulo_selected_form.is_padre == 1 ? $('[name="is_padre"]').prop('checked', true) : $('[name="is_padre"]').prop('checked', false);
                        }
                        else {
                            $("[name=" + i + "]").val(modulo_selected_form[i]);
                        }
                    }
                }
            }
            else {
                form_modulo_validate.resetForm();
            }
        }
    };
    appMenuAplicaciones.init();
    $('#btn_edit_modulo').on('click', function () {
        addModulo = false;
        updateModulo = true;
        appMenuAplicaciones.setModal('Editar Modulo', modulo_selected);
    });
    $('#btn_add_modulo').on('click', function () {
        addModulo = true;
        updateModulo = false;
        appMenuAplicaciones.setModal('Agregar Modulo', null);
        $('#form_modulo')[0].reset();
    });
    $('#btn_submit_form').on('click', function () {
        if (addModulo === true || updateModulo == false) {
            MenuAplicacionesController.addModulo();
        }
        else if (updateModulo === true || addModulo === false) {
            MenuAplicacionesController.updateModulo();
        }
    });
    $('#btn_delete_modulo').on('click', function () {
        // if(modulo_selected.modulo_hijos.length){
        //     utils.alert_confirm(MenuAplicacionesController.deleteModulo, 'Este modulo contiene mas hijos, aun asi lo desea borrar?');
        // }else{
        //     utils.alert_confirm(MenuAplicacionesController.deleteModulo, 'Esta usted seguro de eliminar este Modulo?');
        // }
        utils.alert_confirm(MenuAplicacionesController.deleteModulo, 'Esta usted seguro de eliminar este Modulo?');
    });
});
//# sourceMappingURL=menu-aplicaciones.view.js.map