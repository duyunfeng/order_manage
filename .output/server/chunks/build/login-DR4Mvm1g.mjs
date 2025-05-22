import { defineComponent, ref, resolveComponent, mergeProps, withCtx, unref, createVNode, createTextVNode, withKeys, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import { _ as _export_sfc, e as useUserStore, f as user_default, l as lock_default, E as ElMessage } from './server.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const form = ref({
      username: "",
      password: ""
    });
    const rules = {
      username: [{ required: true, message: "\u8BF7\u8F93\u5165\u7528\u6237\u540D", trigger: "blur" }],
      password: [{ required: true, message: "\u8BF7\u8F93\u5165\u5BC6\u7801", trigger: "blur" }]
    };
    const formRef = ref();
    const loading = ref(false);
    const userStore = useUserStore();
    async function handleLogin() {
      formRef.value.validate(async (valid) => {
        if (!valid) return;
        loading.value = true;
        try {
          await userStore.login(form.value.username, form.value.password);
          await userStore.fetchUser();
          ElMessage.success("\u767B\u5F55\u6210\u529F");
          router.push("/");
        } catch (e) {
          ElMessage.error(e.message || "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF");
        } finally {
          loading.value = false;
        }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_card = resolveComponent("el-card");
      const _component_el_form = resolveComponent("el-form");
      const _component_el_form_item = resolveComponent("el-form-item");
      const _component_el_input = resolveComponent("el-input");
      const _component_el_button = resolveComponent("el-button");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-container" }, _attrs))} data-v-3ecb3159>`);
      _push(ssrRenderComponent(_component_el_card, { class: "login-card" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="login-title" data-v-3ecb3159${_scopeId}>\u8BA2\u5355\u7BA1\u7406\u7CFB\u7EDF</div>`);
            _push2(ssrRenderComponent(_component_el_form, {
              model: form.value,
              rules,
              ref_key: "formRef",
              ref: formRef,
              onKeyup: handleLogin
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_form_item, { prop: "username" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_el_input, {
                          modelValue: form.value.username,
                          "onUpdate:modelValue": ($event) => form.value.username = $event,
                          placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
                          "prefix-icon": unref(user_default),
                          clearable: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_el_input, {
                            modelValue: form.value.username,
                            "onUpdate:modelValue": ($event) => form.value.username = $event,
                            placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
                            "prefix-icon": unref(user_default),
                            clearable: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_el_form_item, { prop: "password" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_el_input, {
                          modelValue: form.value.password,
                          "onUpdate:modelValue": ($event) => form.value.password = $event,
                          type: "password",
                          placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
                          "prefix-icon": unref(lock_default),
                          "show-password": "",
                          clearable: ""
                        }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_el_input, {
                            modelValue: form.value.password,
                            "onUpdate:modelValue": ($event) => form.value.password = $event,
                            type: "password",
                            placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
                            "prefix-icon": unref(lock_default),
                            "show-password": "",
                            clearable: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_el_form_item, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_el_button, {
                          type: "primary",
                          style: { "width": "100%" },
                          onClick: handleLogin,
                          loading: loading.value
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` \u767B\u5F55 `);
                            } else {
                              return [
                                createTextVNode(" \u767B\u5F55 ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_el_button, {
                            type: "primary",
                            style: { "width": "100%" },
                            onClick: handleLogin,
                            loading: loading.value
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" \u767B\u5F55 ")
                            ]),
                            _: 1
                          }, 8, ["loading"])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_form_item, { prop: "username" }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.value.username,
                          "onUpdate:modelValue": ($event) => form.value.username = $event,
                          placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
                          "prefix-icon": unref(user_default),
                          clearable: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, { prop: "password" }, {
                      default: withCtx(() => [
                        createVNode(_component_el_input, {
                          modelValue: form.value.password,
                          "onUpdate:modelValue": ($event) => form.value.password = $event,
                          type: "password",
                          placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
                          "prefix-icon": unref(lock_default),
                          "show-password": "",
                          clearable: ""
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                      ]),
                      _: 1
                    }),
                    createVNode(_component_el_form_item, null, {
                      default: withCtx(() => [
                        createVNode(_component_el_button, {
                          type: "primary",
                          style: { "width": "100%" },
                          onClick: handleLogin,
                          loading: loading.value
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" \u767B\u5F55 ")
                          ]),
                          _: 1
                        }, 8, ["loading"])
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
              createVNode("div", { class: "login-title" }, "\u8BA2\u5355\u7BA1\u7406\u7CFB\u7EDF"),
              createVNode(_component_el_form, {
                model: form.value,
                rules,
                ref_key: "formRef",
                ref: formRef,
                onKeyup: withKeys(handleLogin, ["enter"])
              }, {
                default: withCtx(() => [
                  createVNode(_component_el_form_item, { prop: "username" }, {
                    default: withCtx(() => [
                      createVNode(_component_el_input, {
                        modelValue: form.value.username,
                        "onUpdate:modelValue": ($event) => form.value.username = $event,
                        placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
                        "prefix-icon": unref(user_default),
                        clearable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_el_form_item, { prop: "password" }, {
                    default: withCtx(() => [
                      createVNode(_component_el_input, {
                        modelValue: form.value.password,
                        "onUpdate:modelValue": ($event) => form.value.password = $event,
                        type: "password",
                        placeholder: "\u8BF7\u8F93\u5165\u5BC6\u7801",
                        "prefix-icon": unref(lock_default),
                        "show-password": "",
                        clearable: ""
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "prefix-icon"])
                    ]),
                    _: 1
                  }),
                  createVNode(_component_el_form_item, null, {
                    default: withCtx(() => [
                      createVNode(_component_el_button, {
                        type: "primary",
                        style: { "width": "100%" },
                        onClick: handleLogin,
                        loading: loading.value
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" \u767B\u5F55 ")
                        ]),
                        _: 1
                      }, 8, ["loading"])
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }, 8, ["model"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3ecb3159"]]);

export { login as default };
//# sourceMappingURL=login-DR4Mvm1g.mjs.map
