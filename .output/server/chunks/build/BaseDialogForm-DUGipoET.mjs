import { defineComponent, ref, watch, computed, resolveComponent, mergeProps, withCtx, createBlock, openBlock, Fragment, renderList, renderSlot, createCommentVNode, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseDialogForm",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: Boolean },
    title: {},
    fields: {},
    formData: {}
  },
  emits: ["update:modelValue", "submit", "cancel"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const visible = ref(props.modelValue);
    watch(
      () => props.modelValue,
      (v) => visible.value = v
    );
    watch(visible, (v) => emit("update:modelValue", v));
    const form = computed({
      get: () => props.formData,
      set: (v) => Object.assign(props.formData, v)
    });
    const formRef = ref();
    const rules = {};
    function handleOk() {
      var _a, _b;
      (_b = (_a = formRef.value) == null ? void 0 : _a.validate) == null ? void 0 : _b.call(_a, (valid) => {
        if (valid) {
          emit("submit", { ...form.value });
          visible.value = false;
        }
      });
    }
    function handleCancel() {
      emit("cancel");
      visible.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_dialog = resolveComponent("el-dialog");
      const _component_el_form = resolveComponent("el-form");
      const _component_el_form_item = resolveComponent("el-form-item");
      const _component_el_input = resolveComponent("el-input");
      const _component_el_input_number = resolveComponent("el-input-number");
      const _component_el_select = resolveComponent("el-select");
      const _component_el_option = resolveComponent("el-option");
      const _component_el_date_picker = resolveComponent("el-date-picker");
      const _component_el_button = resolveComponent("el-button");
      _push(ssrRenderComponent(_component_el_dialog, mergeProps({
        title: _ctx.title,
        modelValue: visible.value,
        "onUpdate:modelValue": ($event) => visible.value = $event,
        width: "500px",
        onClose: handleCancel,
        "destroy-on-close": ""
      }, _attrs), {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_el_button, { onClick: handleCancel }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u53D6\u6D88`);
                } else {
                  return [
                    createTextVNode("\u53D6\u6D88")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_button, {
              type: "primary",
              onClick: handleOk
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u786E\u5B9A`);
                } else {
                  return [
                    createTextVNode("\u786E\u5B9A")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_el_button, { onClick: handleCancel }, {
                default: withCtx(() => [
                  createTextVNode("\u53D6\u6D88")
                ]),
                _: 1
              }),
              createVNode(_component_el_button, {
                type: "primary",
                onClick: handleOk
              }, {
                default: withCtx(() => [
                  createTextVNode("\u786E\u5B9A")
                ]),
                _: 1
              })
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_el_form, {
              model: form.value,
              rules,
              ref_key: "formRef",
              ref: formRef,
              "label-width": "100px"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(_ctx.fields, (field) => {
                    _push3(ssrRenderComponent(_component_el_form_item, {
                      key: field.prop,
                      label: field.label,
                      prop: field.prop,
                      rules: field.rules
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          if (field.type === "input") {
                            _push4(ssrRenderComponent(_component_el_input, {
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              style: { "width": "320px" }
                            }, null, _parent4, _scopeId3));
                          } else if (field.type === "number") {
                            _push4(ssrRenderComponent(_component_el_input_number, {
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              min: field.min,
                              max: field.max,
                              style: { "width": "320px" }
                            }, null, _parent4, _scopeId3));
                          } else if (field.type === "select") {
                            _push4(ssrRenderComponent(_component_el_select, {
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              style: { "width": "320px" }
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<!--[-->`);
                                  ssrRenderList(field.options, (opt) => {
                                    _push5(ssrRenderComponent(_component_el_option, {
                                      key: opt.value,
                                      label: opt.label,
                                      value: opt.value
                                    }, null, _parent5, _scopeId4));
                                  });
                                  _push5(`<!--]-->`);
                                } else {
                                  return [
                                    (openBlock(true), createBlock(Fragment, null, renderList(field.options, (opt) => {
                                      return openBlock(), createBlock(_component_el_option, {
                                        key: opt.value,
                                        label: opt.label,
                                        value: opt.value
                                      }, null, 8, ["label", "value"]);
                                    }), 128))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else if (field.type === "date") {
                            _push4(ssrRenderComponent(_component_el_date_picker, {
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              type: "date",
                              "value-format": "YYYY-MM-DD",
                              style: { "width": "320px" }
                            }, null, _parent4, _scopeId3));
                          } else if (field.type === "factory-select") {
                            _push4(ssrRenderComponent(_component_el_select, {
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              multiple: true,
                              style: { "width": "320px" }
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<!--[-->`);
                                  ssrRenderList(field.options, (opt) => {
                                    _push5(ssrRenderComponent(_component_el_option, {
                                      key: opt.value,
                                      label: opt.label,
                                      value: opt.value
                                    }, null, _parent5, _scopeId4));
                                  });
                                  _push5(`<!--]-->`);
                                } else {
                                  return [
                                    (openBlock(true), createBlock(Fragment, null, renderList(field.options, (opt) => {
                                      return openBlock(), createBlock(_component_el_option, {
                                        key: opt.value,
                                        label: opt.label,
                                        value: opt.value
                                      }, null, 8, ["label", "value"]);
                                    }), 128))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else if (field.type === "custom-upload") {
                            ssrRenderSlot(_ctx.$slots, field.prop, {
                              form: form.value,
                              field
                            }, null, _push4, _parent4, _scopeId3);
                          } else if (field.type === "goods-list") {
                            ssrRenderSlot(_ctx.$slots, field.prop, {
                              form: form.value,
                              field
                            }, null, _push4, _parent4, _scopeId3);
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            field.type === "input" ? (openBlock(), createBlock(_component_el_input, {
                              key: 0,
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              style: { "width": "320px" }
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "number" ? (openBlock(), createBlock(_component_el_input_number, {
                              key: 1,
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              min: field.min,
                              max: field.max,
                              style: { "width": "320px" }
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "min", "max"])) : field.type === "select" ? (openBlock(), createBlock(_component_el_select, {
                              key: 2,
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              style: { "width": "320px" }
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(field.options, (opt) => {
                                  return openBlock(), createBlock(_component_el_option, {
                                    key: opt.value,
                                    label: opt.label,
                                    value: opt.value
                                  }, null, 8, ["label", "value"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "date" ? (openBlock(), createBlock(_component_el_date_picker, {
                              key: 3,
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              type: "date",
                              "value-format": "YYYY-MM-DD",
                              style: { "width": "320px" }
                            }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "factory-select" ? (openBlock(), createBlock(_component_el_select, {
                              key: 4,
                              modelValue: form.value[field.prop],
                              "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                              placeholder: field.placeholder,
                              multiple: true,
                              style: { "width": "320px" }
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(field.options, (opt) => {
                                  return openBlock(), createBlock(_component_el_option, {
                                    key: opt.value,
                                    label: opt.label,
                                    value: opt.value
                                  }, null, 8, ["label", "value"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "custom-upload" ? renderSlot(_ctx.$slots, field.prop, {
                              key: 5,
                              form: form.value,
                              field
                            }, void 0, true) : field.type === "goods-list" ? renderSlot(_ctx.$slots, field.prop, {
                              key: 6,
                              form: form.value,
                              field
                            }, void 0, true) : createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.fields, (field) => {
                      return openBlock(), createBlock(_component_el_form_item, {
                        key: field.prop,
                        label: field.label,
                        prop: field.prop,
                        rules: field.rules
                      }, {
                        default: withCtx(() => [
                          field.type === "input" ? (openBlock(), createBlock(_component_el_input, {
                            key: 0,
                            modelValue: form.value[field.prop],
                            "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                            placeholder: field.placeholder,
                            style: { "width": "320px" }
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "number" ? (openBlock(), createBlock(_component_el_input_number, {
                            key: 1,
                            modelValue: form.value[field.prop],
                            "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                            placeholder: field.placeholder,
                            min: field.min,
                            max: field.max,
                            style: { "width": "320px" }
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "min", "max"])) : field.type === "select" ? (openBlock(), createBlock(_component_el_select, {
                            key: 2,
                            modelValue: form.value[field.prop],
                            "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                            placeholder: field.placeholder,
                            style: { "width": "320px" }
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(field.options, (opt) => {
                                return openBlock(), createBlock(_component_el_option, {
                                  key: opt.value,
                                  label: opt.label,
                                  value: opt.value
                                }, null, 8, ["label", "value"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "date" ? (openBlock(), createBlock(_component_el_date_picker, {
                            key: 3,
                            modelValue: form.value[field.prop],
                            "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                            placeholder: field.placeholder,
                            type: "date",
                            "value-format": "YYYY-MM-DD",
                            style: { "width": "320px" }
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "factory-select" ? (openBlock(), createBlock(_component_el_select, {
                            key: 4,
                            modelValue: form.value[field.prop],
                            "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                            placeholder: field.placeholder,
                            multiple: true,
                            style: { "width": "320px" }
                          }, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(field.options, (opt) => {
                                return openBlock(), createBlock(_component_el_option, {
                                  key: opt.value,
                                  label: opt.label,
                                  value: opt.value
                                }, null, 8, ["label", "value"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "custom-upload" ? renderSlot(_ctx.$slots, field.prop, {
                            key: 5,
                            form: form.value,
                            field
                          }, void 0, true) : field.type === "goods-list" ? renderSlot(_ctx.$slots, field.prop, {
                            key: 6,
                            form: form.value,
                            field
                          }, void 0, true) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1032, ["label", "prop", "rules"]);
                    }), 128))
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_el_form, {
                model: form.value,
                rules,
                ref_key: "formRef",
                ref: formRef,
                "label-width": "100px"
              }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.fields, (field) => {
                    return openBlock(), createBlock(_component_el_form_item, {
                      key: field.prop,
                      label: field.label,
                      prop: field.prop,
                      rules: field.rules
                    }, {
                      default: withCtx(() => [
                        field.type === "input" ? (openBlock(), createBlock(_component_el_input, {
                          key: 0,
                          modelValue: form.value[field.prop],
                          "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                          placeholder: field.placeholder,
                          style: { "width": "320px" }
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "number" ? (openBlock(), createBlock(_component_el_input_number, {
                          key: 1,
                          modelValue: form.value[field.prop],
                          "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                          placeholder: field.placeholder,
                          min: field.min,
                          max: field.max,
                          style: { "width": "320px" }
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "min", "max"])) : field.type === "select" ? (openBlock(), createBlock(_component_el_select, {
                          key: 2,
                          modelValue: form.value[field.prop],
                          "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                          placeholder: field.placeholder,
                          style: { "width": "320px" }
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(field.options, (opt) => {
                              return openBlock(), createBlock(_component_el_option, {
                                key: opt.value,
                                label: opt.label,
                                value: opt.value
                              }, null, 8, ["label", "value"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "date" ? (openBlock(), createBlock(_component_el_date_picker, {
                          key: 3,
                          modelValue: form.value[field.prop],
                          "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                          placeholder: field.placeholder,
                          type: "date",
                          "value-format": "YYYY-MM-DD",
                          style: { "width": "320px" }
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "factory-select" ? (openBlock(), createBlock(_component_el_select, {
                          key: 4,
                          modelValue: form.value[field.prop],
                          "onUpdate:modelValue": ($event) => form.value[field.prop] = $event,
                          placeholder: field.placeholder,
                          multiple: true,
                          style: { "width": "320px" }
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(field.options, (opt) => {
                              return openBlock(), createBlock(_component_el_option, {
                                key: opt.value,
                                label: opt.label,
                                value: opt.value
                              }, null, 8, ["label", "value"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder"])) : field.type === "custom-upload" ? renderSlot(_ctx.$slots, field.prop, {
                          key: 5,
                          form: form.value,
                          field
                        }, void 0, true) : field.type === "goods-list" ? renderSlot(_ctx.$slots, field.prop, {
                          key: 6,
                          form: form.value,
                          field
                        }, void 0, true) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1032, ["label", "prop", "rules"]);
                  }), 128))
                ]),
                _: 3
              }, 8, ["model"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BaseDialogForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaseDialogForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8d5ddca2"]]);

export { BaseDialogForm as B };
//# sourceMappingURL=BaseDialogForm-DUGipoET.mjs.map
