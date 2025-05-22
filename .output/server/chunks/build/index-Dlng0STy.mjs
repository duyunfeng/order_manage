import { defineComponent, ref, reactive, resolveComponent, withCtx, createBlock, openBlock, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, e as useUserStore, E as ElMessage, q as getUser } from './server.mjs';
import { _ as _sfc_main$1 } from './ImageUpload-Bthyn9zH.mjs';
import { u as uploadFile } from './upload-D2iGuTey.mjs';
import { B as BaseDialogForm } from './BaseDialogForm-DUGipoET.mjs';
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
import 'vue-router';
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
    const statusMap = {
      active: "\u6B63\u5E38",
      inactive: "\u7981\u7528"
    };
    const userStore = useUserStore();
    const user = ref({
      id: "",
      username: "",
      role: "",
      email: "",
      status: "",
      avatar: ""
    });
    const showEdit = ref(false);
    const showPwd = ref(false);
    const editForm = reactive({
      username: "",
      role: "",
      email: "",
      status: "",
      avatar: "",
      avatarFile: null
    });
    const pwdForm = reactive({
      oldPwd: "",
      newPwd: "",
      confirmPwd: ""
    });
    const pwdFormRef = ref();
    const editFields = [
      {
        prop: "avatar",
        label: "\u5934\u50CF",
        type: "custom-upload",
        placeholder: "\u8BF7\u4E0A\u4F20\u5934\u50CF"
      },
      {
        prop: "username",
        label: "\u7528\u6237\u540D",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      {
        prop: "role",
        label: "\u89D2\u8272",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u89D2\u8272",
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      {
        prop: "email",
        label: "\u90AE\u7BB1",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u90AE\u7BB1"
      },
      {
        prop: "status",
        label: "\u72B6\u6001",
        type: "select",
        placeholder: "\u8BF7\u9009\u62E9\u72B6\u6001",
        options: [
          { label: "\u6B63\u5E38", value: "active" },
          { label: "\u7981\u7528", value: "inactive" }
        ],
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      }
    ];
    const pwdFields = [
      {
        prop: "oldPwd",
        label: "\u539F\u5BC6\u7801",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u539F\u5BC6\u7801",
        inputType: "password",
        rules: [{ required: true, message: "\u8BF7\u8F93\u5165\u539F\u5BC6\u7801", trigger: "blur" }]
      },
      {
        prop: "newPwd",
        label: "\u65B0\u5BC6\u7801",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801",
        inputType: "password",
        rules: [{ required: true, message: "\u8BF7\u8F93\u5165\u65B0\u5BC6\u7801", trigger: "blur" }]
      },
      {
        prop: "confirmPwd",
        label: "\u786E\u8BA4\u65B0\u5BC6\u7801",
        type: "input",
        placeholder: "\u8BF7\u786E\u8BA4\u65B0\u5BC6\u7801",
        inputType: "password",
        rules: [
          { required: true, message: "\u8BF7\u786E\u8BA4\u65B0\u5BC6\u7801", trigger: "blur" },
          {
            validator: (rule, value) => value === pwdForm.newPwd,
            message: "\u4E24\u6B21\u8F93\u5165\u5BC6\u7801\u4E0D\u4E00\u81F4",
            trigger: "blur"
          }
        ]
      }
    ];
    async function fetchUser() {
      const res = await getUser(userStore.user.id);
      console.log(res.data.data);
      Object.assign(user.value, res.data.data || res);
      console.log(user);
    }
    function openEdit() {
      Object.assign(editForm, user.value);
      showEdit.value = true;
    }
    function submitEdit() {
      const doUpdate = async () => {
        const data = { ...editForm };
        delete data.avatarFile;
        userStore.updateProfile(data).then(() => {
          showEdit.value = false;
          ElMessage.success("\u8D44\u6599\u4FEE\u6539\u6210\u529F");
          fetchUser();
        });
      };
      if (editForm.avatarFile) {
        uploadFile(editForm.avatarFile).then((url) => {
          editForm.avatar = url;
          doUpdate();
        });
      } else {
        doUpdate();
      }
    }
    function submitPwd() {
      pwdFormRef.value.validate(async (valid) => {
        if (!valid) return;
        if (pwdForm.newPwd !== pwdForm.confirmPwd) {
          ElMessage.error("\u4E24\u6B21\u8F93\u5165\u5BC6\u7801\u4E0D\u4E00\u81F4");
          return;
        }
        await userStore.changePassword(pwdForm.oldPwd, pwdForm.newPwd);
        showPwd.value = false;
        ElMessage.success("\u5BC6\u7801\u4FEE\u6539\u6210\u529F");
        pwdForm.oldPwd = pwdForm.newPwd = pwdForm.confirmPwd = "";
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_row = resolveComponent("el-row");
      const _component_el_col = resolveComponent("el-col");
      const _component_el_card = resolveComponent("el-card");
      const _component_el_avatar = resolveComponent("el-avatar");
      const _component_el_button = resolveComponent("el-button");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_el_row, {
        justify: "center",
        style: { "margin-top": "40px" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_el_col, { span: 12 }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_card, { class: "profile-card" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center" })}" data-v-d591b9af${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_el_avatar, {
                          size: 64,
                          style: { "margin-right": "24px" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              if (user.value.avatar) {
                                _push5(`<img${ssrRenderAttr("src", user.value.avatar)} style="${ssrRenderStyle({ "width": "64px", "height": "64px", "object-fit": "cover" })}" data-v-d591b9af${_scopeId4}>`);
                              } else {
                                _push5(`<i class="el-icon-user" data-v-d591b9af${_scopeId4}></i>`);
                              }
                            } else {
                              return [
                                user.value.avatar ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: user.value.avatar,
                                  style: { "width": "64px", "height": "64px", "object-fit": "cover" }
                                }, null, 8, ["src"])) : (openBlock(), createBlock("i", {
                                  key: 1,
                                  class: "el-icon-user"
                                }))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`<div data-v-d591b9af${_scopeId3}><h2 data-v-d591b9af${_scopeId3}>${ssrInterpolate(user.value.username)}</h2><p data-v-d591b9af${_scopeId3}>\u89D2\u8272\uFF1A${ssrInterpolate(user.value.role)}</p><p data-v-d591b9af${_scopeId3}>\u90AE\u7BB1\uFF1A${ssrInterpolate(user.value.email)}</p><p data-v-d591b9af${_scopeId3}>\u72B6\u6001\uFF1A${ssrInterpolate(statusMap[user.value.status])}</p></div></div><div style="${ssrRenderStyle({ "margin-top": "24px" })}" data-v-d591b9af${_scopeId3}>`);
                        _push4(ssrRenderComponent(_component_el_button, {
                          type: "primary",
                          onClick: openEdit
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`\u7F16\u8F91\u8D44\u6599`);
                            } else {
                              return [
                                createTextVNode("\u7F16\u8F91\u8D44\u6599")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_el_button, {
                          type: "warning",
                          onClick: ($event) => showPwd.value = true,
                          style: { "margin-left": "16px" }
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`\u4FEE\u6539\u5BC6\u7801`);
                            } else {
                              return [
                                createTextVNode("\u4FEE\u6539\u5BC6\u7801")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</div>`);
                      } else {
                        return [
                          createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                            createVNode(_component_el_avatar, {
                              size: 64,
                              style: { "margin-right": "24px" }
                            }, {
                              default: withCtx(() => [
                                user.value.avatar ? (openBlock(), createBlock("img", {
                                  key: 0,
                                  src: user.value.avatar,
                                  style: { "width": "64px", "height": "64px", "object-fit": "cover" }
                                }, null, 8, ["src"])) : (openBlock(), createBlock("i", {
                                  key: 1,
                                  class: "el-icon-user"
                                }))
                              ]),
                              _: 1
                            }),
                            createVNode("div", null, [
                              createVNode("h2", null, toDisplayString(user.value.username), 1),
                              createVNode("p", null, "\u89D2\u8272\uFF1A" + toDisplayString(user.value.role), 1),
                              createVNode("p", null, "\u90AE\u7BB1\uFF1A" + toDisplayString(user.value.email), 1),
                              createVNode("p", null, "\u72B6\u6001\uFF1A" + toDisplayString(statusMap[user.value.status]), 1)
                            ])
                          ]),
                          createVNode("div", { style: { "margin-top": "24px" } }, [
                            createVNode(_component_el_button, {
                              type: "primary",
                              onClick: openEdit
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u7F16\u8F91\u8D44\u6599")
                              ]),
                              _: 1
                            }),
                            createVNode(_component_el_button, {
                              type: "warning",
                              onClick: ($event) => showPwd.value = true,
                              style: { "margin-left": "16px" }
                            }, {
                              default: withCtx(() => [
                                createTextVNode("\u4FEE\u6539\u5BC6\u7801")
                              ]),
                              _: 1
                            }, 8, ["onClick"])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_card, { class: "profile-card" }, {
                      default: withCtx(() => [
                        createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                          createVNode(_component_el_avatar, {
                            size: 64,
                            style: { "margin-right": "24px" }
                          }, {
                            default: withCtx(() => [
                              user.value.avatar ? (openBlock(), createBlock("img", {
                                key: 0,
                                src: user.value.avatar,
                                style: { "width": "64px", "height": "64px", "object-fit": "cover" }
                              }, null, 8, ["src"])) : (openBlock(), createBlock("i", {
                                key: 1,
                                class: "el-icon-user"
                              }))
                            ]),
                            _: 1
                          }),
                          createVNode("div", null, [
                            createVNode("h2", null, toDisplayString(user.value.username), 1),
                            createVNode("p", null, "\u89D2\u8272\uFF1A" + toDisplayString(user.value.role), 1),
                            createVNode("p", null, "\u90AE\u7BB1\uFF1A" + toDisplayString(user.value.email), 1),
                            createVNode("p", null, "\u72B6\u6001\uFF1A" + toDisplayString(statusMap[user.value.status]), 1)
                          ])
                        ]),
                        createVNode("div", { style: { "margin-top": "24px" } }, [
                          createVNode(_component_el_button, {
                            type: "primary",
                            onClick: openEdit
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u7F16\u8F91\u8D44\u6599")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_el_button, {
                            type: "warning",
                            onClick: ($event) => showPwd.value = true,
                            style: { "margin-left": "16px" }
                          }, {
                            default: withCtx(() => [
                              createTextVNode("\u4FEE\u6539\u5BC6\u7801")
                            ]),
                            _: 1
                          }, 8, ["onClick"])
                        ])
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
              createVNode(_component_el_col, { span: 12 }, {
                default: withCtx(() => [
                  createVNode(_component_el_card, { class: "profile-card" }, {
                    default: withCtx(() => [
                      createVNode("div", { style: { "display": "flex", "align-items": "center" } }, [
                        createVNode(_component_el_avatar, {
                          size: 64,
                          style: { "margin-right": "24px" }
                        }, {
                          default: withCtx(() => [
                            user.value.avatar ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: user.value.avatar,
                              style: { "width": "64px", "height": "64px", "object-fit": "cover" }
                            }, null, 8, ["src"])) : (openBlock(), createBlock("i", {
                              key: 1,
                              class: "el-icon-user"
                            }))
                          ]),
                          _: 1
                        }),
                        createVNode("div", null, [
                          createVNode("h2", null, toDisplayString(user.value.username), 1),
                          createVNode("p", null, "\u89D2\u8272\uFF1A" + toDisplayString(user.value.role), 1),
                          createVNode("p", null, "\u90AE\u7BB1\uFF1A" + toDisplayString(user.value.email), 1),
                          createVNode("p", null, "\u72B6\u6001\uFF1A" + toDisplayString(statusMap[user.value.status]), 1)
                        ])
                      ]),
                      createVNode("div", { style: { "margin-top": "24px" } }, [
                        createVNode(_component_el_button, {
                          type: "primary",
                          onClick: openEdit
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u7F16\u8F91\u8D44\u6599")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_el_button, {
                          type: "warning",
                          onClick: ($event) => showPwd.value = true,
                          style: { "margin-left": "16px" }
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u4FEE\u6539\u5BC6\u7801")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])
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
      _push(ssrRenderComponent(BaseDialogForm, {
        modelValue: showEdit.value,
        "onUpdate:modelValue": ($event) => showEdit.value = $event,
        title: "\u7F16\u8F91\u8D44\u6599",
        fields: editFields,
        formData: editForm,
        onSubmit: submitEdit
      }, {
        avatar: withCtx(({ form }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_sfc_main$1, {
              modelValue: form.avatar,
              "onUpdate:modelValue": ($event) => form.avatar = $event,
              onFileChange: (file) => form.avatarFile = file
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_sfc_main$1, {
                modelValue: form.avatar,
                "onUpdate:modelValue": ($event) => form.avatar = $event,
                onFileChange: (file) => form.avatarFile = file
              }, null, 8, ["modelValue", "onUpdate:modelValue", "onFileChange"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(BaseDialogForm, {
        modelValue: showPwd.value,
        "onUpdate:modelValue": ($event) => showPwd.value = $event,
        title: "\u4FEE\u6539\u5BC6\u7801",
        fields: pwdFields,
        formData: pwdForm,
        onSubmit: submitPwd
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/profile/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d591b9af"]]);

export { index as default };
//# sourceMappingURL=index-Dlng0STy.mjs.map
