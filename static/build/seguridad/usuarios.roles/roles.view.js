/**
 * Created by Administrador on 21/02/2017.
 */
define(["require", "exports", './roles.service', '../proyectos/proyectos.service', '../menu/menu.service', '../permisos/permisos.service', '../../core/helper.inei', '../../core/utils', '../menu-aplicaciones/menu-aplicaciones.service'], function (require, exports, roles_service_1, proyectos_service_1, menu_service_1, permisos_service_1, helper_inei_1, util, menu_aplicaciones_service_1) {
    "use strict";
    var objectHelper = new helper_inei_1.ObjectHelper();
    var sessionHelper = new helper_inei_1.SessionHelper();
    var rolesModel = new roles_service_1["default"]();
    var roles = [];
    var rol_selected = null;
    var session = sessionHelper.getSession();
    var tree_menu_format = [];
    var tree_menu_format_selecteds = [];
    var node_keys_selected = [];
    var keys_modulos_by_rol = [];
    var key_tree_node_selected = null;
    var keys_modulos_deleted = [];
    var keys_modulos_added_edited = [];
    var RolJsonRules = {
        form_rol: {
            nombre: {
                maxlength: 30
            },
            descripcion: {
                maxlength: 30
            }
        }
    };
    var form_rol_validate = $('#form_rol').validate(util.validateForm(RolJsonRules.form_rol));
    var utils = {
        enabledDisabledButtonModuloRol: function () {
        },
        diffDeletedAndEdited: function () {
            keys_modulos_deleted = keys_modulos_by_rol.filter(function (item) { return node_keys_selected.indexOf(item) < 0; });
            keys_modulos_added_edited = node_keys_selected.filter(function (item) { return keys_modulos_deleted.indexOf(item) < 0; });
        }
    };
    var proyecto_id = null;
    var sistema_id = null;
    var ModuloRolController = (function () {
        function ModuloRolController() {
            this.modulorolService = new roles_service_1.ModulosRolService();
            this.proyectosService = new proyectos_service_1.ProyectosService();
            this.menuService = new menu_service_1.MenuService();
            this.proyectos = null;
            this.proyecto_selected = null;
            this.sistema_selected = null;
            this.permisosService = new permisos_service_1.PermisosService();
            this.menuaplicacionesService = new menu_aplicaciones_service_1.ModuloService();
            this.getProyectos();
            this.setEvents();
        }
        ModuloRolController.prototype.setMenu = function () {
            var _this = this;
            this.menuaplicacionesService.modulosbyProyectoRecursive(this.proyecto_selected.id).done(function (menu) {
                _this.menu = menu;
            });
        };
        ModuloRolController.prototype.setMenuPermiso = function () {
            var _this = this;
            this.proyectosService.getProyectoSistema(this.proyecto_selected.id, this.sistema_selected.id).done(function (data) {
                _this.menuaplicacionesService.modulosRecursive(data[0].codigo).done(function (menupermiso) {
                    _this.menuPermiso = menupermiso;
                    _this.drawMenuPermisos();
                });
            });
        };
        ModuloRolController.prototype.editModulosRol = function (objectData) {
            var _this = this;
            this.modulorolService.editModulosRol(objectData).done(function () {
                _this.getRoles(null, rol_selected.id);
                util.showSwalAlert('Se ha editado con éxito!', 'Exito!', 'success');
            }).fail(function (error) {
                console.log(error);
            });
        };
        ModuloRolController.prototype.getProyectos = function () {
            var _this = this;
            this.proyectosService.getSistemasProyecto().done(function (proyectos) {
                _this.proyectos = proyectos;
                util.setDropdown(_this.proyectos, { id: 'id', text: ['nombre'] }, {
                    id_element: 'select_proyectos',
                    bootstrap_multiselect: true,
                    select2: false
                });
            });
        };
        ModuloRolController.prototype.setEvents = function () {
            var _this = this;
            $('#select_proyectos').on('change', function (input) {
                _this.setProyecto(input.target.value);
                if (_this.proyecto_selected !== null) {
                    _this.setMenu();
                    util.setDropdown(_this.proyecto_selected.sistemas, { id: 'id', text: ['nombre'] }, {
                        id_element: 'select_sistemas',
                        bootstrap_multiselect: true,
                        select2: false
                    });
                }
            });
            $('#select_sistemas').on('change', function (input) {
                _this.setSistema(parseInt(input.target.value));
                if (_this.sistema_selected !== null) {
                    _this.setMenuPermiso();
                    _this.getPermisos();
                }
            });
            $('#btn_edit_modulo_rol_permiso').click(function (event) {
                _this.savePermisosModuloRol();
            });
        };
        ModuloRolController.prototype.setProyecto = function (id) {
            var _this = this;
            if (id == "-1") {
                this.proyecto_selected = null;
            }
            else {
                this.proyectos.filter(function (proyecto) { return proyecto.id == id ? _this.proyecto_selected = proyecto : ''; });
            }
        };
        ModuloRolController.prototype.setSistema = function (id) {
            var _this = this;
            if (id == "-1") {
                this.sistema_selected = null;
            }
            else {
                this.proyecto_selected.sistemas.filter(function (sistema) { return sistema.id == id ? _this.sistema_selected = sistema : ''; });
            }
        };
        ModuloRolController.prototype.getRoles = function (pk, rol_id_selected) {
            var _this = this;
            if (pk === void 0) { pk = null; }
            if (rol_id_selected === void 0) { rol_id_selected = null; }
            rolesModel.get().done(function (data) {
                roles = data;
                _this.drawRoles();
                rol_id_selected ? _this.getRolSelected(rol_selected.id) : '';
            });
        };
        ModuloRolController.prototype.drawRoles = function () {
            var _this = this;
            var html = '';
            roles.map(function (value, key) {
                html += "<tr>\n                    <td>" + (parseInt(key) + 1) + "</td>\n                    <td>" + value.nombre + "</td>\n                    <td><ul class=\"icons-list\">\n                            <li name=\"li_editar_rol\" data-value=" + value.id + " class=\"text-primary-600\"><a><i class=\"icon-pencil4\"></i></a></li>\n                            <li name=\"li_rol\" data-value=" + value.id + " class=\"text-primary-600\"><a><i class=\"icon-database\"></i></a></li>\n                            <li name=\"li_delete_rol\" data-value=" + value.id + " class=\"text-danger-600\"><a><i class=\"icon-trash\"></i></a></li>\n\t\t\t\t\t\t</ul></td>\n                </tr>";
            });
            $('#table_roles').find('tbody').html(html);
            $('li[name="li_rol"]').off();
            $('li[name="li_rol"]').on('click', function (event) {
                _this.getRolSelected($(event.currentTarget).data('value'));
            });
            $('li[name="li_editar_rol"]').off();
            $('li[name="li_editar_rol"]').on('click', function (event) {
                rol_selected = objectHelper.findInArrayObject(roles, $(event.currentTarget).data('value'), 'id');
                _this.setFormularioRol();
            });
            $('li[name="li_delete_rol"]').off();
            $('li[name="li_delete_rol"]').on('click', function (event) {
                _this.deleteRol($(event.currentTarget).data('value'));
            });
        };
        ModuloRolController.prototype.setFormularioRol = function () {
            if (rol_selected !== null) {
                for (var key in rol_selected) {
                    var input = $("[name=\"" + key + "\"]");
                    if ($("[name=\"" + key + "\"]").is(':checkbox')) {
                        rol_selected[key] == 1 ? input.prop('checked', true) : '';
                    }
                    else {
                        input.val(rol_selected[key]);
                    }
                }
            }
            else {
                $('#form_rol')[0].reset();
            }
            $('#modal_rol').modal();
        };
        ModuloRolController.prototype.deleteRol = function (id) {
            var _this = this;
            util.alert_confirm(function () {
                rolesModel.delete(id).done(function () {
                    _this.getRoles();
                    util.showSwalAlert('Se ha eliminado el Rol correctamente', 'Exito!', 'success');
                });
            }, 'Esta seguro de eliminar este Rol?', 'info');
        };
        ModuloRolController.prototype.saveRol = function () {
            var _this = this;
            if (form_rol_validate.valid()) {
                var valid_form = objectHelper.formToObject(util.serializeForm('form_rol'));
                if (rol_selected !== null) {
                    rolesModel.update(rol_selected.id, valid_form).done(function (response) {
                        util.showSwalAlert('Se ha editado el Rol correctamente', 'Exito!', 'success');
                        _this.getRoles();
                        form_rol_validate.resetForm();
                        $('#modal_rol').modal('hide');
                    }).fail(function (error) {
                        util.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
                    });
                }
                else {
                    rolesModel.add(valid_form).done(function (response) {
                        util.showSwalAlert('Se ha agregado el Rol correctamente', 'Exito!', 'success');
                        _this.getRoles();
                        form_rol_validate.resetForm();
                        $('#modal_rol').modal('hide');
                    }).fail(function (error) {
                        util.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
                    });
                }
            }
        };
        ModuloRolController.prototype.drawMenuPermisos = function () {
            if (rol_selected.modulo_rol.length) {
                rol_selected.modulo_rol.map(function (value, key) {
                    keys_modulos_by_rol.push(value.modulo.id);
                });
                console.log(this.menuPermiso);
                tree_menu_format_selecteds = util.jsonFormatFancyTreeSelecteds(this.menuPermiso, keys_modulos_by_rol);
            }
            utils.enabledDisabledButtonModuloRol();
            var options_tree_selecteds = {
                checkbox: false,
                selectMode: 1,
                source: tree_menu_format_selecteds,
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
                        moduloRolController.getPermisosModuloRol(key_tree_node_selected);
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
            $('#tree_modulo_rol_permiso').fancytree(options_tree_selecteds);
            $('#tree_modulo_rol_permiso').fancytree("destroy");
            $('#tree_modulo_rol_permiso').fancytree(options_tree_selecteds);
        };
        ModuloRolController.prototype.getPermisosModuloRol = function (modulo_id) {
            var _this = this;
            $("[id^='permiso_id']").prop('checked', false);
            this.permisosService.getModuloRol(rol_selected.id, modulo_id).done(function (data) {
                _this.permisosModuloRol = data[0];
                if (_this.permisosModuloRol !== undefined) {
                    _this.permisosModuloRol.permisos.map(function (value, pos) {
                        $("#permiso_id_" + value.codigo).prop('checked', true);
                    });
                }
            });
        };
        ModuloRolController.prototype.savePermisosModuloRol = function () {
            var _this = this;
            var permisos_checked = [];
            $("[id^='permiso_id']").map(function (index, element) {
                element.checked ? permisos_checked.push(parseInt(element.value)) : '';
            });
            if (this.permisosModuloRol != null) {
                this.permisosService.savePermisosModuloRol({
                    modulo_id: this.permisosModuloRol.id,
                    permiso: permisos_checked
                }).done(function () {
                    util.showSwalAlert('Los permisos han sido agregados al Modulo', 'Exito!', 'success');
                    _this.getPermisosModuloRol(key_tree_node_selected);
                }).fail(function () {
                    util.showSwalAlert('Ha ocurrido un error', 'Error', 'error');
                });
            }
        };
        ModuloRolController.prototype.drawModulosTreeRecursive = function () {
            console.log(this.menu);
            if (rol_selected.modulo_rol.length) {
                keys_modulos_by_rol = [];
                rol_selected.modulo_rol.map(function (value, key) {
                    keys_modulos_by_rol.push(value.modulo.id);
                });
                tree_menu_format = util.jsonFormatFancyTree2(this.menu, keys_modulos_by_rol);
            }
            else {
                tree_menu_format = util.jsonFormatFancyTree2(this.menu);
            }
            utils.enabledDisabledButtonModuloRol();
            var options_tree = {
                checkbox: true,
                selectMode: 3,
                source: tree_menu_format,
                init: function (event, data) {
                    data.tree.getRootNode().visit(function (node) {
                        if (node.data.preselected)
                            node.setSelected(true);
                    });
                },
                loadChildren: function (event, ctx) {
                    ctx.node.fixSelection3AfterClick();
                },
                select: function (event, data) {
                    // Get a list of all selected nodes, and convert to a key array:
                    var selKeys = $.map(data.tree.getSelectedNodes(), function (node) {
                        return parseInt(node.key);
                    });
                    // Get a list of all selected TOP nodes
                    var selRootNodes = data.tree.getSelectedNodes(true);
                    // ... and convert to a key array:
                    var selRootKeys = $.map(selRootNodes, function (node) {
                        return node.key;
                    });
                    node_keys_selected = selKeys;
                    //utils.enabledDisabledButtonModuloRol();
                },
                dblclick: function (event, data) {
                    data.node.toggleSelected();
                },
                keydown: function (event, data) {
                    if (event.which === 32) {
                        data.node.toggleSelected();
                        return false;
                    }
                },
                // The following options are only required, if we have more than one tree on one page:
                //				initId: "SOURCE",
                cookieId: "fancytree-Cb3",
                idPrefix: "fancytree-Cb3-"
            };
            $('#tree_menu_rol').fancytree(options_tree);
            $('#tree_menu_rol').fancytree("destroy");
            $('#tree_menu_rol').fancytree(options_tree);
        };
        ModuloRolController.prototype.getRolSelected = function (id) {
            var _this = this;
            if (this.proyecto_selected === null) {
                util.showInfo('Por favor Seleccione un proyecto!');
                return false;
            }
            rol_selected = objectHelper.findInArrayObject(roles, id, 'id');
            rolesModel.getModulos(id).done(function (modulosrol) {
                rol_selected.modulo_rol = modulosrol;
                _this.drawModulosTreeRecursive();
            });
        };
        ModuloRolController.prototype.addRol = function () {
            var _this = this;
            if (form_rol_validate.valid()) {
                var valid_form = objectHelper.formToObject(util.serializeForm('form_rol'));
                rolesModel.add(valid_form).done(function (response) {
                    util.showSwalAlert('Se ha agregado el Rol correctamente', 'Exito!', 'success');
                    _this.getRoles();
                    form_rol_validate.resetForm();
                    $('#modal_rol').modal('hide');
                }).fail(function (error) {
                    util.showSwalAlert('Ha ocurrido un error, por favor intente nuevamente', 'Error!', 'error');
                });
            }
        };
        ModuloRolController.prototype.getPermisos = function () {
            var _this = this;
            this.permisosService.getPermisosProyectoSistema(this.proyecto_selected.id, this.sistema_selected.id).done(function (permisos) {
                _this.permisos = permisos;
                _this.drawPermisosCheckbox();
            });
        };
        ModuloRolController.prototype.drawPermisosCheckbox = function () {
            var html_genericos = '';
            var html_proyectosistema = '';
            this.permisos.map(function (value, pos) {
                if (value.proyectosistema_id === null) {
                    html_genericos += "<li class=\"list-group-item\">\n                                        " + value.nombre + "\n                                        <div class=\"material-switch pull-right\">\n                                            <input id=\"permiso_id_" + value.codigo + "\" value=\"" + value.id + "\" name=\"permiso_name_" + value.codigo + "\"\n                                                   type=\"checkbox\"/>\n                                            <label for=\"permiso_id_" + value.codigo + "\" class=\"label-success\"></label>\n                                        </div>\n                                    </li>";
                }
                else {
                    html_proyectosistema += "<li class=\"list-group-item\">\n                                            " + value.nombre + "\n                                            <div class=\"material-switch pull-right\">\n                                                <input id=\"permiso_id_" + value.codigo + "\" value=\"" + value.id + "\" name=\"permiso_name_" + value.codigo + "\"\n                                                       type=\"checkbox\"/>\n                                                <label for=\"permiso_id_" + value.codigo + "\" class=\"label-success\"></label>\n                                            </div>\n                                        </li>";
                }
            });
            $('#ul_permisos_genericos').html(html_genericos);
            $('#ul_permisos_proyectosistema').html(html_proyectosistema);
        };
        return ModuloRolController;
    }());
    var moduloRolController = new ModuloRolController();
    var id_dropdowns = ['select_proyectos', 'select_sistemas'];
    var App = {
        init: function () {
            $('#btn_submit_form').on('click', function (event) {
                moduloRolController.saveRol();
            });
            $('#btn_addrol').on('click', function (event) {
                rol_selected = null;
                moduloRolController.setFormularioRol();
            });
            $('#btn_save_modulo_rol').on('click', function (event) {
                util.alert_confirm(function () {
                    utils.diffDeletedAndEdited();
                    moduloRolController.editModulosRol({
                        id_rol: rol_selected.id,
                        delete: keys_modulos_deleted,
                        edited: keys_modulos_added_edited,
                        proyecto_id: $('#select_proyectos').val()
                    });
                }, 'Esta seguro de guardar?', 'info');
            });
            id_dropdowns.map(function (value, pos) {
                $("#" + value).selectpicker();
            });
            moduloRolController.getRoles();
            utils.enabledDisabledButtonModuloRol();
        }
    };
    App.init();
});
//# sourceMappingURL=roles.view.js.map