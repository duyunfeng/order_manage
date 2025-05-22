import { defineComponent, resolveComponent, mergeProps, withCtx, createBlock, openBlock, Fragment, renderList, createCommentVNode, createTextVNode, createVNode, unref, toDisplayString, renderSlot, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderList, ssrRenderAttrs, ssrRenderSlot, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import dayjs from 'dayjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BaseFilter",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    fields: {}
  },
  emits: ["update:modelValue", "search", "reset"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function onSearch() {
      emit("search", { ...props.modelValue });
    }
    function onReset() {
      const resetObj = {};
      props.fields.forEach((f) => {
        resetObj[f.prop] = "";
      });
      emit("update:modelValue", resetObj);
      emit("reset");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_form = resolveComponent("el-form");
      const _component_el_form_item = resolveComponent("el-form-item");
      const _component_el_input = resolveComponent("el-input");
      const _component_el_select = resolveComponent("el-select");
      const _component_el_option = resolveComponent("el-option");
      const _component_el_date_picker = resolveComponent("el-date-picker");
      const _component_el_button = resolveComponent("el-button");
      _push(ssrRenderComponent(_component_el_form, mergeProps({
        inline: true,
        model: _ctx.modelValue,
        class: "base-filter",
        onSubmit: () => {
        }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(_ctx.fields, (item) => {
              _push2(ssrRenderComponent(_component_el_form_item, {
                key: item.prop,
                label: item.label
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (item.type === "input" || !item.type) {
                      _push3(ssrRenderComponent(_component_el_input, {
                        modelValue: _ctx.modelValue[item.prop],
                        "onUpdate:modelValue": ($event) => _ctx.modelValue[item.prop] = $event,
                        placeholder: item.placeholder
                      }, null, _parent3, _scopeId2));
                    } else if (item.type === "select") {
                      _push3(ssrRenderComponent(_component_el_select, {
                        modelValue: _ctx.modelValue[item.prop],
                        "onUpdate:modelValue": ($event) => _ctx.modelValue[item.prop] = $event,
                        placeholder: item.placeholder,
                        style: { "width": "140px" }
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<!--[-->`);
                            ssrRenderList(item.options, (opt) => {
                              _push4(ssrRenderComponent(_component_el_option, {
                                key: opt.value,
                                label: opt.label,
                                value: opt.value
                              }, null, _parent4, _scopeId3));
                            });
                            _push4(`<!--]-->`);
                          } else {
                            return [
                              (openBlock(true), createBlock(Fragment, null, renderList(item.options, (opt) => {
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
                      }, _parent3, _scopeId2));
                    } else if (item.type === "date") {
                      _push3(ssrRenderComponent(_component_el_date_picker, {
                        modelValue: _ctx.modelValue[item.prop],
                        "onUpdate:modelValue": ($event) => _ctx.modelValue[item.prop] = $event,
                        placeholder: item.placeholder,
                        type: "date",
                        "value-format": item.valueFormat || "YYYY-MM-DD",
                        style: { "width": "200px" }
                      }, null, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      item.type === "input" || !item.type ? (openBlock(), createBlock(_component_el_input, {
                        key: 0,
                        modelValue: _ctx.modelValue[item.prop],
                        "onUpdate:modelValue": ($event) => _ctx.modelValue[item.prop] = $event,
                        placeholder: item.placeholder
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : item.type === "select" ? (openBlock(), createBlock(_component_el_select, {
                        key: 1,
                        modelValue: _ctx.modelValue[item.prop],
                        "onUpdate:modelValue": ($event) => _ctx.modelValue[item.prop] = $event,
                        placeholder: item.placeholder,
                        style: { "width": "140px" }
                      }, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(item.options, (opt) => {
                            return openBlock(), createBlock(_component_el_option, {
                              key: opt.value,
                              label: opt.label,
                              value: opt.value
                            }, null, 8, ["label", "value"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder"])) : item.type === "date" ? (openBlock(), createBlock(_component_el_date_picker, {
                        key: 2,
                        modelValue: _ctx.modelValue[item.prop],
                        "onUpdate:modelValue": ($event) => _ctx.modelValue[item.prop] = $event,
                        placeholder: item.placeholder,
                        type: "date",
                        "value-format": item.valueFormat || "YYYY-MM-DD",
                        style: { "width": "200px" }
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "value-format"])) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
            _push2(ssrRenderComponent(_component_el_form_item, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_button, {
                    type: "primary",
                    onClick: onSearch
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u67E5\u8BE2`);
                      } else {
                        return [
                          createTextVNode("\u67E5\u8BE2")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_el_button, { onClick: onReset }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u91CD\u7F6E`);
                      } else {
                        return [
                          createTextVNode("\u91CD\u7F6E")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_button, {
                      type: "primary",
                      onClick: onSearch
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u67E5\u8BE2")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_button, { onClick: onReset }, {
                      default: withCtx(() => [
                        createTextVNode("\u91CD\u7F6E")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.fields, (item) => {
                return openBlock(), createBlock(_component_el_form_item, {
                  key: item.prop,
                  label: item.label
                }, {
                  default: withCtx(() => [
                    item.type === "input" || !item.type ? (openBlock(), createBlock(_component_el_input, {
                      key: 0,
                      modelValue: _ctx.modelValue[item.prop],
                      "onUpdate:modelValue": ($event) => _ctx.modelValue[item.prop] = $event,
                      placeholder: item.placeholder
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"])) : item.type === "select" ? (openBlock(), createBlock(_component_el_select, {
                      key: 1,
                      modelValue: _ctx.modelValue[item.prop],
                      "onUpdate:modelValue": ($event) => _ctx.modelValue[item.prop] = $event,
                      placeholder: item.placeholder,
                      style: { "width": "140px" }
                    }, {
                      default: withCtx(() => [
                        (openBlock(true), createBlock(Fragment, null, renderList(item.options, (opt) => {
                          return openBlock(), createBlock(_component_el_option, {
                            key: opt.value,
                            label: opt.label,
                            value: opt.value
                          }, null, 8, ["label", "value"]);
                        }), 128))
                      ]),
                      _: 2
                    }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder"])) : item.type === "date" ? (openBlock(), createBlock(_component_el_date_picker, {
                      key: 2,
                      modelValue: _ctx.modelValue[item.prop],
                      "onUpdate:modelValue": ($event) => _ctx.modelValue[item.prop] = $event,
                      placeholder: item.placeholder,
                      type: "date",
                      "value-format": item.valueFormat || "YYYY-MM-DD",
                      style: { "width": "200px" }
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder", "value-format"])) : createCommentVNode("", true)
                  ]),
                  _: 2
                }, 1032, ["label"]);
              }), 128)),
              createVNode(_component_el_form_item, null, {
                default: withCtx(() => [
                  createVNode(_component_el_button, {
                    type: "primary",
                    onClick: onSearch
                  }, {
                    default: withCtx(() => [
                      createTextVNode("\u67E5\u8BE2")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_el_button, { onClick: onReset }, {
                    default: withCtx(() => [
                      createTextVNode("\u91CD\u7F6E")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BaseFilter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const BaseFilter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d71acf57"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseTable",
  __ssrInlineRender: true,
  props: {
    goods: {},
    columns: {}
  },
  emits: ["factory-click"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_table = resolveComponent("el-table");
      const _component_el_table_column = resolveComponent("el-table-column");
      const _component_el_button = resolveComponent("el-button");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "base-table-wrapper" }, _attrs))} data-v-211858b1>`);
      _push(ssrRenderComponent(_component_el_table, {
        data: _ctx.goods,
        style: { "width": "100%" },
        class: "base-table",
        border: true,
        fit: true,
        "scrollbar-always-on": true,
        "max-height": null,
        "show-overflow-tooltip": true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(_ctx.columns, (col) => {
              _push2(ssrRenderComponent(_component_el_table_column, {
                key: col.prop,
                prop: col.prop,
                label: col.label,
                width: col.width,
                "min-width": col.minWidth,
                fixed: col.prop === "actions" ? "right" : void 0
              }, {
                default: withCtx((scope, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    if (col.slot && col.prop !== "actions") {
                      ssrRenderSlot(_ctx.$slots, col.prop, mergeProps({ ref_for: true }, scope), null, _push3, _parent3, _scopeId2);
                    } else if (["createdAt", "updatedAt"].includes(col.prop)) {
                      _push3(`<span data-v-211858b1${_scopeId2}>${ssrInterpolate(unref(dayjs)(scope.row[col.prop]).format("YYYY-MM-DD HH:mm:ss"))}</span>`);
                    } else if (col.prop === "actions" && typeof col.getActions === "function") {
                      _push3(`<div style="${ssrRenderStyle({ "display": "flex", "gap": "4px" })}" data-v-211858b1${_scopeId2}><!--[-->`);
                      ssrRenderList(col.getActions(scope.row, scope.$index), (action, idx) => {
                        _push3(ssrRenderComponent(_component_el_button, mergeProps({
                          link: "",
                          key: idx,
                          type: action.type || "default",
                          onClick: ($event) => action.onClick(scope.row, scope.$index),
                          ref_for: true
                        }, action.buttonProps || {}), {
                          default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(action.label)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(action.label), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      });
                      _push3(`<!--]--></div>`);
                    } else {
                      _push3(`<span data-v-211858b1${_scopeId2}>${ssrInterpolate(scope.row[col.prop])}</span>`);
                    }
                  } else {
                    return [
                      col.slot && col.prop !== "actions" ? renderSlot(_ctx.$slots, col.prop, mergeProps({
                        key: 0,
                        ref_for: true
                      }, scope), void 0, true) : ["createdAt", "updatedAt"].includes(col.prop) ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(unref(dayjs)(scope.row[col.prop]).format("YYYY-MM-DD HH:mm:ss")), 1)) : col.prop === "actions" && typeof col.getActions === "function" ? (openBlock(), createBlock("div", {
                        key: 2,
                        style: { "display": "flex", "gap": "4px" }
                      }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(col.getActions(scope.row, scope.$index), (action, idx) => {
                          return openBlock(), createBlock(_component_el_button, mergeProps({
                            link: "",
                            key: idx,
                            type: action.type || "default",
                            onClick: ($event) => action.onClick(scope.row, scope.$index),
                            ref_for: true
                          }, action.buttonProps || {}), {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(action.label), 1)
                            ]),
                            _: 2
                          }, 1040, ["type", "onClick"]);
                        }), 128))
                      ])) : (openBlock(), createBlock("span", { key: 3 }, toDisplayString(scope.row[col.prop]), 1))
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.columns, (col) => {
                return openBlock(), createBlock(_component_el_table_column, {
                  key: col.prop,
                  prop: col.prop,
                  label: col.label,
                  width: col.width,
                  "min-width": col.minWidth,
                  fixed: col.prop === "actions" ? "right" : void 0
                }, {
                  default: withCtx((scope) => [
                    col.slot && col.prop !== "actions" ? renderSlot(_ctx.$slots, col.prop, mergeProps({
                      key: 0,
                      ref_for: true
                    }, scope), void 0, true) : ["createdAt", "updatedAt"].includes(col.prop) ? (openBlock(), createBlock("span", { key: 1 }, toDisplayString(unref(dayjs)(scope.row[col.prop]).format("YYYY-MM-DD HH:mm:ss")), 1)) : col.prop === "actions" && typeof col.getActions === "function" ? (openBlock(), createBlock("div", {
                      key: 2,
                      style: { "display": "flex", "gap": "4px" }
                    }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(col.getActions(scope.row, scope.$index), (action, idx) => {
                        return openBlock(), createBlock(_component_el_button, mergeProps({
                          link: "",
                          key: idx,
                          type: action.type || "default",
                          onClick: ($event) => action.onClick(scope.row, scope.$index),
                          ref_for: true
                        }, action.buttonProps || {}), {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(action.label), 1)
                          ]),
                          _: 2
                        }, 1040, ["type", "onClick"]);
                      }), 128))
                    ])) : (openBlock(), createBlock("span", { key: 3 }, toDisplayString(scope.row[col.prop]), 1))
                  ]),
                  _: 2
                }, 1032, ["prop", "label", "width", "min-width", "fixed"]);
              }), 128))
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BaseTable.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaseTable = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-211858b1"]]);

export { BaseFilter as B, BaseTable as a };
//# sourceMappingURL=BaseTable-C1zcmb5s.mjs.map
