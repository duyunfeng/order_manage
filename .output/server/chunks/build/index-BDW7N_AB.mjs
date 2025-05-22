import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { _ as _export_sfc, a as useNuxtApp } from './server.mjs';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import '../_/nitro.mjs';
import 'node:events';
import 'jsonwebtoken';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'ipx';
import 'pinia';
import 'axios';
import 'dayjs';
import 'dayjs/plugin/localeData.js';
import 'dayjs/plugin/customParseFormat.js';
import 'dayjs/plugin/advancedFormat.js';
import 'dayjs/plugin/weekOfYear.js';
import 'dayjs/plugin/weekYear.js';
import 'dayjs/plugin/dayOfYear.js';
import 'dayjs/plugin/isSameOrAfter.js';
import 'dayjs/plugin/isSameOrBefore.js';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { $axios } = useNuxtApp();
    const router = useRouter();
    const orderCount = ref(0);
    const customerCount = ref(0);
    const goodsCount = ref(0);
    function goOrders() {
      router.push("/orders");
    }
    function goAddOrder() {
      router.push("/orders?add=1");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_row = resolveComponent("el-row");
      const _component_el_col = resolveComponent("el-col");
      const _component_el_card = resolveComponent("el-card");
      const _component_el_icon = resolveComponent("el-icon");
      const _component_el_button = resolveComponent("el-button");
      _push(ssrRenderComponent(_component_el_row, mergeProps({
        gutter: 20,
        style: { "margin-top": "40px" }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_el_col, { span: 24 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<h1 data-v-f8453d03${_scopeId3}>\u6B22\u8FCE\u4F7F\u7528\u8BA2\u5355\u7BA1\u7406\u7CFB\u7EDF</h1><p data-v-f8453d03${_scopeId3}>\u672C\u7CFB\u7EDF\u652F\u6301\u8BA2\u5355\u7684\u521B\u5EFA\u3001\u7F16\u8F91\u3001\u5220\u9664\u3001\u5408\u540C\u4E0A\u4F20\u7B49\u529F\u80FD\u3002</p>`);
                      } else {
                        return [
                          createVNode("h1", null, "\u6B22\u8FCE\u4F7F\u7528\u8BA2\u5355\u7BA1\u7406\u7CFB\u7EDF"),
                          createVNode("p", null, "\u672C\u7CFB\u7EDF\u652F\u6301\u8BA2\u5355\u7684\u521B\u5EFA\u3001\u7F16\u8F91\u3001\u5220\u9664\u3001\u5408\u540C\u4E0A\u4F20\u7B49\u529F\u80FD\u3002")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_card, null, {
                      default: withCtx(() => [
                        createVNode("h1", null, "\u6B22\u8FCE\u4F7F\u7528\u8BA2\u5355\u7BA1\u7406\u7CFB\u7EDF"),
                        createVNode("p", null, "\u672C\u7CFB\u7EDF\u652F\u6301\u8BA2\u5355\u7684\u521B\u5EFA\u3001\u7F16\u8F91\u3001\u5220\u9664\u3001\u5408\u540C\u4E0A\u4F20\u7B49\u529F\u80FD\u3002")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_col, { span: 8 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center" })}" data-v-f8453d03${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_el_icon, { style: { "font-size": "32px", "color": "#409eff", "margin-right": "12px" } }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<i class="el-icon-document" data-v-f8453d03${_scopeId4}></i>`);
                            } else {
                              return [
                                createVNode("i", { class: "el-icon-document" })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div data-v-f8453d03${_scopeId3}><div data-v-f8453d03${_scopeId3}>\u8BA2\u5355\u603B\u6570</div><div style="${ssrRenderStyle({ "font-size": "24px", "font-weight": "bold" })}" data-v-f8453d03${_scopeId3}>${ssrInterpolate(orderCount.value)}</div></div></div>`);
                      } else {
                        return [
                          createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                            createVNode(_component_el_icon, { style: { "font-size": "32px", "color": "#409eff", "margin-right": "12px" } }, {
                              default: withCtx(() => [
                                createVNode("i", { class: "el-icon-document" })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode("div", null, "\u8BA2\u5355\u603B\u6570"),
                              createVNode("div", { style: { "font-size": "24px", "font-weight": "bold" } }, toDisplayString(orderCount.value), 1)
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_card, null, {
                      default: withCtx(() => [
                        createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                          createVNode(_component_el_icon, { style: { "font-size": "32px", "color": "#409eff", "margin-right": "12px" } }, {
                            default: withCtx(() => [
                              createVNode("i", { class: "el-icon-document" })
                            ]),
                            _: 1
                          }),
                          createVNode("div", null, [
                            createVNode("div", null, "\u8BA2\u5355\u603B\u6570"),
                            createVNode("div", { style: { "font-size": "24px", "font-weight": "bold" } }, toDisplayString(orderCount.value), 1)
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_col, { span: 8 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center" })}" data-v-f8453d03${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_el_icon, { style: { "font-size": "32px", "color": "#67c23a", "margin-right": "12px" } }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<i class="el-icon-user" data-v-f8453d03${_scopeId4}></i>`);
                            } else {
                              return [
                                createVNode("i", { class: "el-icon-user" })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div data-v-f8453d03${_scopeId3}><div data-v-f8453d03${_scopeId3}>\u5BA2\u6237\u603B\u6570</div><div style="${ssrRenderStyle({ "font-size": "24px", "font-weight": "bold" })}" data-v-f8453d03${_scopeId3}>${ssrInterpolate(customerCount.value)}</div></div></div>`);
                      } else {
                        return [
                          createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                            createVNode(_component_el_icon, { style: { "font-size": "32px", "color": "#67c23a", "margin-right": "12px" } }, {
                              default: withCtx(() => [
                                createVNode("i", { class: "el-icon-user" })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode("div", null, "\u5BA2\u6237\u603B\u6570"),
                              createVNode("div", { style: { "font-size": "24px", "font-weight": "bold" } }, toDisplayString(customerCount.value), 1)
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_card, null, {
                      default: withCtx(() => [
                        createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                          createVNode(_component_el_icon, { style: { "font-size": "32px", "color": "#67c23a", "margin-right": "12px" } }, {
                            default: withCtx(() => [
                              createVNode("i", { class: "el-icon-user" })
                            ]),
                            _: 1
                          }),
                          createVNode("div", null, [
                            createVNode("div", null, "\u5BA2\u6237\u603B\u6570"),
                            createVNode("div", { style: { "font-size": "24px", "font-weight": "bold" } }, toDisplayString(customerCount.value), 1)
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_col, { span: 8 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center" })}" data-v-f8453d03${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_el_icon, { style: { "font-size": "32px", "color": "#e6a23c", "margin-right": "12px" } }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<i class="el-icon-goods" data-v-f8453d03${_scopeId4}></i>`);
                            } else {
                              return [
                                createVNode("i", { class: "el-icon-goods" })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div data-v-f8453d03${_scopeId3}><div data-v-f8453d03${_scopeId3}>\u5546\u54C1\u603B\u6570</div><div style="${ssrRenderStyle({ "font-size": "24px", "font-weight": "bold" })}" data-v-f8453d03${_scopeId3}>${ssrInterpolate(goodsCount.value)}</div></div></div>`);
                      } else {
                        return [
                          createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                            createVNode(_component_el_icon, { style: { "font-size": "32px", "color": "#e6a23c", "margin-right": "12px" } }, {
                              default: withCtx(() => [
                                createVNode("i", { class: "el-icon-goods" })
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode("div", null, "\u5546\u54C1\u603B\u6570"),
                              createVNode("div", { style: { "font-size": "24px", "font-weight": "bold" } }, toDisplayString(goodsCount.value), 1)
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_card, null, {
                      default: withCtx(() => [
                        createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                          createVNode(_component_el_icon, { style: { "font-size": "32px", "color": "#e6a23c", "margin-right": "12px" } }, {
                            default: withCtx(() => [
                              createVNode("i", { class: "el-icon-goods" })
                            ]),
                            _: 1
                          }),
                          createVNode("div", null, [
                            createVNode("div", null, "\u5546\u54C1\u603B\u6570"),
                            createVNode("div", { style: { "font-size": "24px", "font-weight": "bold" } }, toDisplayString(goodsCount.value), 1)
                          ])
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_col, {
              span: 24,
              style: { "margin-top": "20px" }
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_card, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_el_button, {
                          type: "primary",
                          onClick: goOrders,
                          size: "large"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`\u8FDB\u5165\u8BA2\u5355\u7BA1\u7406`);
                            } else {
                              return [
                                createTextVNode("\u8FDB\u5165\u8BA2\u5355\u7BA1\u7406")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_el_button, {
                          type: "success",
                          onClick: goAddOrder,
                          size: "large",
                          style: { "margin-left": "16px" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`\u5FEB\u901F\u6DFB\u52A0\u8BA2\u5355`);
                            } else {
                              return [
                                createTextVNode("\u5FEB\u901F\u6DFB\u52A0\u8BA2\u5355")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_el_button, {
                            type: "primary",
                            onClick: goOrders,
                            size: "large"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u8FDB\u5165\u8BA2\u5355\u7BA1\u7406")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_el_button, {
                            type: "success",
                            onClick: goAddOrder,
                            size: "large",
                            style: { "margin-left": "16px" }
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u5FEB\u901F\u6DFB\u52A0\u8BA2\u5355")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_card, null, {
                      default: withCtx(() => [
                        createVNode(_component_el_button, {
                          type: "primary",
                          onClick: goOrders,
                          size: "large"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u8FDB\u5165\u8BA2\u5355\u7BA1\u7406")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_el_button, {
                          type: "success",
                          onClick: goAddOrder,
                          size: "large",
                          style: { "margin-left": "16px" }
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u5FEB\u901F\u6DFB\u52A0\u8BA2\u5355")
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_el_col, { span: 24 }, {
                default: withCtx(() => [
                  createVNode(_component_el_card, null, {
                    default: withCtx(() => [
                      createVNode("h1", null, "\u6B22\u8FCE\u4F7F\u7528\u8BA2\u5355\u7BA1\u7406\u7CFB\u7EDF"),
                      createVNode("p", null, "\u672C\u7CFB\u7EDF\u652F\u6301\u8BA2\u5355\u7684\u521B\u5EFA\u3001\u7F16\u8F91\u3001\u5220\u9664\u3001\u5408\u540C\u4E0A\u4F20\u7B49\u529F\u80FD\u3002")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_el_col, { span: 8 }, {
                default: withCtx(() => [
                  createVNode(_component_el_card, null, {
                    default: withCtx(() => [
                      createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                        createVNode(_component_el_icon, { style: { "font-size": "32px", "color": "#409eff", "margin-right": "12px" } }, {
                          default: withCtx(() => [
                            createVNode("i", { class: "el-icon-document" })
                          ]),
                          _: 1
                        }),
                        createVNode("div", null, [
                          createVNode("div", null, "\u8BA2\u5355\u603B\u6570"),
                          createVNode("div", { style: { "font-size": "24px", "font-weight": "bold" } }, toDisplayString(orderCount.value), 1)
                        ])
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_el_col, { span: 8 }, {
                default: withCtx(() => [
                  createVNode(_component_el_card, null, {
                    default: withCtx(() => [
                      createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                        createVNode(_component_el_icon, { style: { "font-size": "32px", "color": "#67c23a", "margin-right": "12px" } }, {
                          default: withCtx(() => [
                            createVNode("i", { class: "el-icon-user" })
                          ]),
                          _: 1
                        }),
                        createVNode("div", null, [
                          createVNode("div", null, "\u5BA2\u6237\u603B\u6570"),
                          createVNode("div", { style: { "font-size": "24px", "font-weight": "bold" } }, toDisplayString(customerCount.value), 1)
                        ])
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_el_col, { span: 8 }, {
                default: withCtx(() => [
                  createVNode(_component_el_card, null, {
                    default: withCtx(() => [
                      createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                        createVNode(_component_el_icon, { style: { "font-size": "32px", "color": "#e6a23c", "margin-right": "12px" } }, {
                          default: withCtx(() => [
                            createVNode("i", { class: "el-icon-goods" })
                          ]),
                          _: 1
                        }),
                        createVNode("div", null, [
                          createVNode("div", null, "\u5546\u54C1\u603B\u6570"),
                          createVNode("div", { style: { "font-size": "24px", "font-weight": "bold" } }, toDisplayString(goodsCount.value), 1)
                        ])
                      ])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_el_col, {
                span: 24,
                style: { "margin-top": "20px" }
              }, {
                default: withCtx(() => [
                  createVNode(_component_el_card, null, {
                    default: withCtx(() => [
                      createVNode(_component_el_button, {
                        type: "primary",
                        onClick: goOrders,
                        size: "large"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u8FDB\u5165\u8BA2\u5355\u7BA1\u7406")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_el_button, {
                        type: "success",
                        onClick: goAddOrder,
                        size: "large",
                        style: { "margin-left": "16px" }
                      }, {
                        default: withCtx(() => [
                          createTextVNode("\u5FEB\u901F\u6DFB\u52A0\u8BA2\u5355")
                        ]),
                        _: 1
                      })
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-f8453d03"]]);

export { index as default };
//# sourceMappingURL=index-BDW7N_AB.mjs.map
