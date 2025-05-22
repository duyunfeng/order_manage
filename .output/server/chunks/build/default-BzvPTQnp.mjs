import { _ as __nuxt_component_0 } from './page-DhV1LWio.mjs';
import { withCtx, createVNode, defineComponent, ref, computed, watch, resolveComponent, mergeProps, unref, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { _ as _export_sfc, e as useUserStore, y as home_filled_default, z as shopping_cart_default, A as document_default, f as user_default, B as office_building_default, C as user_filled_default, D as setting_default, F as fold_default, G as expand_default } from './server.mjs';
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

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Layout",
  __ssrInlineRender: true,
  setup(__props) {
    const sidebarWidth = ref("220px");
    const isCollapse = ref(false);
    const showLogoTitle = ref(true);
    const route = useRoute();
    useRouter();
    const activeMenu = computed(() => route.path);
    const userStore = useUserStore();
    const username = computed(() => userStore.user.username);
    const avatarText = computed(() => username.value ? username.value[0].toUpperCase() : "U");
    const isDarkMode = ref(false);
    const showUserDropdown = ref(false);
    const toggleDarkMode = () => {
      (void 0).documentElement.classList.remove("light");
      (void 0).documentElement.classList.toggle("dark");
      localStorage.setItem("dark_mode", isDarkMode.value ? "true" : "false");
    };
    watch(isCollapse, (val) => {
      setTimeout(() => {
        showLogoTitle.value = !val;
      }, 300);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_menu = resolveComponent("el-menu");
      const _component_el_menu_item = resolveComponent("el-menu-item");
      const _component_el_icon = resolveComponent("el-icon");
      const _component_el_switch = resolveComponent("el-switch");
      const _component_el_avatar = resolveComponent("el-avatar");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout" }, _attrs))} data-v-983a4838><aside class="sidebar" style="${ssrRenderStyle({ width: sidebarWidth.value })}" data-v-983a4838><div class="logo" data-v-983a4838><span data-v-983a4838>\u{1F33F}</span>`);
      if (showLogoTitle.value) {
        _push(`<span class="title" data-v-983a4838>\u8BA2\u5355\u7BA1\u7406\u7CFB\u7EDF</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_el_menu, {
        "default-active": activeMenu.value,
        class: "el-menu-vertical-demo",
        "background-color": "#263445",
        "text-color": "#bfcbd9",
        "active-text-color": "#409eff",
        collapse: isCollapse.value,
        router: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_el_menu_item, { index: "/" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_icon, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(home_filled_default), null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(home_filled_default))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span data-v-983a4838${_scopeId2}>\u9996\u9875</span>`);
                } else {
                  return [
                    createVNode(_component_el_icon, null, {
                      default: withCtx(() => [
                        createVNode(unref(home_filled_default))
                      ]),
                      _: 1
                    }),
                    createVNode("span", null, "\u9996\u9875")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_menu_item, { index: "/goods" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_icon, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(shopping_cart_default), null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(shopping_cart_default))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span data-v-983a4838${_scopeId2}>\u5546\u54C1\u7BA1\u7406</span>`);
                } else {
                  return [
                    createVNode(_component_el_icon, null, {
                      default: withCtx(() => [
                        createVNode(unref(shopping_cart_default))
                      ]),
                      _: 1
                    }),
                    createVNode("span", null, "\u5546\u54C1\u7BA1\u7406")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_menu_item, { index: "/orders" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_icon, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(document_default), null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(document_default))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span data-v-983a4838${_scopeId2}>\u8BA2\u5355\u7BA1\u7406</span>`);
                } else {
                  return [
                    createVNode(_component_el_icon, null, {
                      default: withCtx(() => [
                        createVNode(unref(document_default))
                      ]),
                      _: 1
                    }),
                    createVNode("span", null, "\u8BA2\u5355\u7BA1\u7406")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_menu_item, { index: "/customers" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_icon, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(user_default), null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(user_default))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span data-v-983a4838${_scopeId2}>\u5BA2\u6237\u7BA1\u7406</span>`);
                } else {
                  return [
                    createVNode(_component_el_icon, null, {
                      default: withCtx(() => [
                        createVNode(unref(user_default))
                      ]),
                      _: 1
                    }),
                    createVNode("span", null, "\u5BA2\u6237\u7BA1\u7406")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_menu_item, { index: "/factories" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_icon, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(office_building_default), null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(office_building_default))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span data-v-983a4838${_scopeId2}>\u5DE5\u5382\u8D44\u6599</span>`);
                } else {
                  return [
                    createVNode(_component_el_icon, null, {
                      default: withCtx(() => [
                        createVNode(unref(office_building_default))
                      ]),
                      _: 1
                    }),
                    createVNode("span", null, "\u5DE5\u5382\u8D44\u6599")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_menu_item, { index: "/users" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_icon, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(user_filled_default), null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(user_filled_default))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span data-v-983a4838${_scopeId2}>\u7528\u6237\u7BA1\u7406</span>`);
                } else {
                  return [
                    createVNode(_component_el_icon, null, {
                      default: withCtx(() => [
                        createVNode(unref(user_filled_default))
                      ]),
                      _: 1
                    }),
                    createVNode("span", null, "\u7528\u6237\u7BA1\u7406")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_menu_item, { index: "/profile" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_icon, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(setting_default), null, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(setting_default))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<span data-v-983a4838${_scopeId2}>\u7528\u6237\u8D44\u6599</span>`);
                } else {
                  return [
                    createVNode(_component_el_icon, null, {
                      default: withCtx(() => [
                        createVNode(unref(setting_default))
                      ]),
                      _: 1
                    }),
                    createVNode("span", null, "\u7528\u6237\u8D44\u6599")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_el_menu_item, { index: "/" }, {
                default: withCtx(() => [
                  createVNode(_component_el_icon, null, {
                    default: withCtx(() => [
                      createVNode(unref(home_filled_default))
                    ]),
                    _: 1
                  }),
                  createVNode("span", null, "\u9996\u9875")
                ]),
                _: 1
              }),
              createVNode(_component_el_menu_item, { index: "/goods" }, {
                default: withCtx(() => [
                  createVNode(_component_el_icon, null, {
                    default: withCtx(() => [
                      createVNode(unref(shopping_cart_default))
                    ]),
                    _: 1
                  }),
                  createVNode("span", null, "\u5546\u54C1\u7BA1\u7406")
                ]),
                _: 1
              }),
              createVNode(_component_el_menu_item, { index: "/orders" }, {
                default: withCtx(() => [
                  createVNode(_component_el_icon, null, {
                    default: withCtx(() => [
                      createVNode(unref(document_default))
                    ]),
                    _: 1
                  }),
                  createVNode("span", null, "\u8BA2\u5355\u7BA1\u7406")
                ]),
                _: 1
              }),
              createVNode(_component_el_menu_item, { index: "/customers" }, {
                default: withCtx(() => [
                  createVNode(_component_el_icon, null, {
                    default: withCtx(() => [
                      createVNode(unref(user_default))
                    ]),
                    _: 1
                  }),
                  createVNode("span", null, "\u5BA2\u6237\u7BA1\u7406")
                ]),
                _: 1
              }),
              createVNode(_component_el_menu_item, { index: "/factories" }, {
                default: withCtx(() => [
                  createVNode(_component_el_icon, null, {
                    default: withCtx(() => [
                      createVNode(unref(office_building_default))
                    ]),
                    _: 1
                  }),
                  createVNode("span", null, "\u5DE5\u5382\u8D44\u6599")
                ]),
                _: 1
              }),
              createVNode(_component_el_menu_item, { index: "/users" }, {
                default: withCtx(() => [
                  createVNode(_component_el_icon, null, {
                    default: withCtx(() => [
                      createVNode(unref(user_filled_default))
                    ]),
                    _: 1
                  }),
                  createVNode("span", null, "\u7528\u6237\u7BA1\u7406")
                ]),
                _: 1
              }),
              createVNode(_component_el_menu_item, { index: "/profile" }, {
                default: withCtx(() => [
                  createVNode(_component_el_icon, null, {
                    default: withCtx(() => [
                      createVNode(unref(setting_default))
                    ]),
                    _: 1
                  }),
                  createVNode("span", null, "\u7528\u6237\u8D44\u6599")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</aside><div class="main-area" data-v-983a4838><header class="header" data-v-983a4838><div class="header-left" data-v-983a4838><span class="toggle-btn" data-v-983a4838>`);
      if (!isCollapse.value) {
        _push(ssrRenderComponent(_component_el_icon, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(fold_default), null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(fold_default))
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_el_icon, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(expand_default), null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(expand_default))
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</span><span class="title" data-v-983a4838>\u9996\u9875</span></div><div class="header-right" style="${ssrRenderStyle({ "position": "relative" })}" data-v-983a4838>`);
      _push(ssrRenderComponent(_component_el_switch, {
        modelValue: isDarkMode.value,
        "onUpdate:modelValue": ($event) => isDarkMode.value = $event,
        onChange: toggleDarkMode
      }, null, _parent));
      _push(`<div class="user-dropdown-trigger" style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "cursor": "pointer", "user-select": "none", "outline": "none" })}" tabindex="0" data-v-983a4838>`);
      _push(ssrRenderComponent(_component_el_avatar, {
        size: 32,
        style: { "margin-right": "8px" },
        src: unref(userStore).user.avatar
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(avatarText.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(avatarText.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(` ${ssrInterpolate(username.value)}</div>`);
      if (showUserDropdown.value) {
        _push(`<div class="user-dropdown-menu" style="${ssrRenderStyle({ "position": "absolute", "right": "0", "top": "48px", "background": "#fff", "box-shadow": "0 2px 8px rgba(0, 0, 0, 0.15)", "border-radius": "6px", "min-width": "120px", "z-index": "1000" })}" data-v-983a4838><div class="user-dropdown-item" style="${ssrRenderStyle({ "padding": "10px 20px", "cursor": "pointer", "color": "#333" })}" data-v-983a4838> \u9000\u51FA\u7CFB\u7EDF </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></header><main class="main-content" data-v-983a4838>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Layout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Layout = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-983a4838"]]);
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(ssrRenderComponent(Layout, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BzvPTQnp.mjs.map
