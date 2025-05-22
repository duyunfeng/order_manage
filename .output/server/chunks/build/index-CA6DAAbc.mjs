import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, h as ElMessageBox, k as deleteUser, i as updateUser, j as addUser, m as getUsers } from './server.mjs';
import { B as BaseFilter, a as BaseTable } from './BaseTable-C1zcmb5s.mjs';
import { B as BaseDialogForm } from './BaseDialogForm-DUGipoET.mjs';
import { _ as _sfc_main$1 } from './ImageUpload-Bthyn9zH.mjs';
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
    const filter = ref({ id: "", username: "", status: "", registeredAt: "" });
    const filterFields = [
      { prop: "id", label: "\u7528\u6237ID", placeholder: "\u8BF7\u8F93\u5165\u7528\u6237ID", type: "input" },
      { prop: "username", label: "\u7528\u6237\u540D", placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D", type: "input" },
      {
        prop: "status",
        label: "\u72B6\u6001",
        type: "select",
        placeholder: "\u8BF7\u9009\u62E9\u72B6\u6001",
        options: [
          { label: "\u5168\u90E8", value: "" },
          { label: "\u6B63\u5E38", value: "active" },
          { label: "\u7981\u7528", value: "inactive" }
        ]
      },
      {
        prop: "registeredAt",
        label: "\u6CE8\u518C\u65F6\u95F4",
        type: "date",
        placeholder: "\u8BF7\u9009\u62E9\u6CE8\u518C\u65F6\u95F4",
        valueFormat: "YYYY-MM-DD"
      }
    ];
    const showDialog = ref(false);
    const isEdit = ref(false);
    const dialogForm = ref({
      username: "",
      name: "",
      role: "",
      email: "",
      avatar: "",
      avatarFile: null,
      status: "active",
      _id: void 0
    });
    const addFields = [
      {
        prop: "username",
        label: "\u7528\u6237\u540D",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u7528\u6237\u540D",
        rules: [
          { required: true, message: "\u5FC5\u586B" },
          { validator: validateGithubUsername, trigger: "blur" }
        ]
      },
      {
        prop: "name",
        label: "\u6635\u79F0",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u6635\u79F0",
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      {
        prop: "role",
        label: "\u89D2\u8272",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u89D2\u8272",
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      { prop: "email", label: "\u90AE\u7BB1", type: "input", placeholder: "\u8BF7\u8F93\u5165\u90AE\u7BB1" },
      {
        prop: "avatar",
        label: "\u5934\u50CF",
        type: "custom-upload",
        placeholder: "\u8BF7\u4E0A\u4F20\u5934\u50CF"
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
    const columns = [
      { prop: "id", label: "\u7528\u6237ID", width: 200 },
      { prop: "username", label: "\u7528\u6237\u540D", width: 120 },
      { prop: "name", label: "\u6635\u79F0", width: 120 },
      { prop: "role", label: "\u89D2\u8272", width: 100 },
      { prop: "email", label: "\u90AE\u7BB1", width: 180 },
      { prop: "status", label: "\u72B6\u6001", width: 100, slot: true },
      { prop: "createdAt", label: "\u521B\u5EFA\u65F6\u95F4", width: 160 },
      { prop: "updatedAt", label: "\u66F4\u65B0\u65F6\u95F4", width: 160 },
      {
        prop: "actions",
        label: "\u64CD\u4F5C",
        minWidth: 180,
        slot: true
      }
    ];
    const usersList = ref([]);
    async function fetchUsers() {
      const res = await getUsers(filter.value);
      usersList.value = (res.data.data || res).map((item) => ({
        ...item,
        createdAt: item.createdAt || "",
        updatedAt: item.updatedAt || ""
      }));
    }
    function handleSearch(f) {
      fetchUsers().then(() => {
        usersList.value = usersList.value.filter((item) => {
          const matchId = !f.id || item.id.includes(f.id);
          const matchUsername = !f.username || item.username.includes(f.username);
          const matchStatus = !f.status || item.status === f.status;
          const matchDate = !f.registeredAt || item.registeredAt.startsWith(f.registeredAt);
          return matchId && matchUsername && matchStatus && matchDate;
        });
      });
    }
    function handleReset() {
      filter.value = { id: "", username: "", status: "", registeredAt: "" };
      fetchUsers();
    }
    function openAddDialog() {
      isEdit.value = false;
      resetDialogForm();
      showDialog.value = true;
    }
    function openEditDialog(row) {
      isEdit.value = true;
      dialogForm.value = { ...row, _id: row.id, avatarFile: null };
      showDialog.value = true;
    }
    function resetDialogForm() {
      dialogForm.value = {
        username: "",
        name: "",
        role: "",
        email: "",
        avatar: "",
        avatarFile: null,
        status: "active",
        _id: void 0
      };
    }
    async function handleDialogSubmit(form) {
      let avatarUrl = form.avatar;
      if (form.avatarFile) {
        avatarUrl = await uploadFile(form.avatarFile);
      }
      const submitData = { ...form, avatar: avatarUrl };
      delete submitData._id;
      if (isEdit.value) {
        await updateUser(form._id, submitData);
      } else {
        const password = generateRandomPassword();
        await addUser({ ...submitData, password });
        showPasswordTip(password, "\u7528\u6237\u6DFB\u52A0\u6210\u529F\uFF0C\u521D\u59CB\u5BC6\u7801\u4E3A\uFF1A");
      }
      fetchUsers();
      showDialog.value = false;
      resetDialogForm();
    }
    function handleEdit(row) {
      openEditDialog(row);
    }
    function handleDelete(row) {
      ElMessageBox.confirm(`\u786E\u5B9A\u8981\u5220\u9664\u7528\u6237\uFF1A${row.username} \u5417\uFF1F`, "\u63D0\u793A", {
        confirmButtonText: "\u786E\u5B9A",
        cancelButtonText: "\u53D6\u6D88",
        type: "warning"
      }).then(() => {
        deleteUser(row.id).then(() => {
          fetchUsers();
        });
      });
    }
    function generateRandomPassword(length = 10) {
      const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
      let pwd = "";
      for (let i = 0; i < length; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return pwd;
    }
    async function handleResetPassword(row) {
      const password = generateRandomPassword();
      await updateUser(row.id, { password });
      showPasswordTip(password);
    }
    async function validateGithubUsername(rule, value, callback) {
      if (!value) {
        return callback(new Error("\u7528\u6237\u540D\u4E0D\u80FD\u4E3A\u7A7A"));
      }
      const githubUsernameReg = new RegExp("^(?!-)(?!.*--)[a-zA-Z0-9-]{1,39}(?<!-)$");
      if (!githubUsernameReg.test(value)) {
        return callback(
          new Error('\u7528\u6237\u540D\u4EC5\u652F\u6301\u5B57\u6BCD\u3001\u6570\u5B57\u3001\u5355\u4E2A"-",\u4E0D\u80FD\u4EE5"-"\u5F00\u5934/\u7ED3\u5C3E\uFF0C\u4E0D\u80FD\u8FDE\u7EED"-",\u957F\u5EA61-39')
        );
      }
      const res = await getUsers({ username: value });
      if (res.data.data && res.data.data.length > 0) {
        const editingId = dialogForm.value._id;
        const exist = res.data.data.find((u) => u.id !== editingId);
        if (exist) {
          return callback(new Error("\u7528\u6237\u540D\u5DF2\u5B58\u5728"));
        }
      }
      callback();
    }
    function showPasswordTip(password, msg = "\u5BC6\u7801\u5DF2\u91CD\u7F6E\uFF0C\u65B0\u7684\u521D\u59CB\u5BC6\u7801\u4E3A\uFF1A") {
      return ElMessageBox.alert(
        `${msg}<b style="color:#409EFF">${password}</b>\uFF0C\u8BF7\u59A5\u5584\u4FDD\u5B58\uFF01`,
        "\u63D0\u793A",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "\u77E5\u9053\u4E86"
        }
      );
    }
    async function uploadFile(file) {
      return URL.createObjectURL(file);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_card = resolveComponent("el-card");
      const _component_el_button = resolveComponent("el-button");
      const _component_el_tag = resolveComponent("el-tag");
      _push(ssrRenderComponent(_component_el_card, mergeProps({ class: "user-card" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-0e9111e0${_scopeId}><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "16px" })}" data-v-0e9111e0${_scopeId}><h1 data-v-0e9111e0${_scopeId}>\u7528\u6237\u7BA1\u7406</h1>`);
            _push2(ssrRenderComponent(_component_el_button, {
              type: "primary",
              onClick: openAddDialog
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u6DFB\u52A0\u7528\u6237`);
                } else {
                  return [
                    createTextVNode("\u6DFB\u52A0\u7528\u6237")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
            _push2(ssrRenderComponent(BaseFilter, {
              modelValue: filter.value,
              "onUpdate:modelValue": ($event) => filter.value = $event,
              fields: filterFields,
              onSearch: handleSearch,
              onReset: handleReset
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(BaseTable, {
              goods: usersList.value,
              columns,
              onEdit: handleEdit,
              onDelete: handleDelete
            }, {
              actions: withCtx(({ row, $index }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_button, {
                    type: "primary",
                    size: "small",
                    onClick: ($event) => handleEdit(row)
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u7F16\u8F91`);
                      } else {
                        return [
                          createTextVNode("\u7F16\u8F91")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_el_button, {
                    type: "danger",
                    size: "small",
                    onClick: ($event) => handleDelete(row)
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u5220\u9664`);
                      } else {
                        return [
                          createTextVNode("\u5220\u9664")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_el_button, {
                    type: "warning",
                    size: "small",
                    onClick: ($event) => handleResetPassword(row)
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u91CD\u7F6E\u5BC6\u7801`);
                      } else {
                        return [
                          createTextVNode("\u91CD\u7F6E\u5BC6\u7801")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_button, {
                      type: "primary",
                      size: "small",
                      onClick: ($event) => handleEdit(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u7F16\u8F91")
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_el_button, {
                      type: "danger",
                      size: "small",
                      onClick: ($event) => handleDelete(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u5220\u9664")
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_el_button, {
                      type: "warning",
                      size: "small",
                      onClick: ($event) => handleResetPassword(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u91CD\u7F6E\u5BC6\u7801")
                      ]),
                      _: 2
                    }, 1032, ["onClick"])
                  ];
                }
              }),
              status: withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_tag, {
                    type: row.status === "active" ? "success" : "info"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.status === "active" ? "\u6B63\u5E38" : "\u7981\u7528")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.status === "active" ? "\u6B63\u5E38" : "\u7981\u7528"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_tag, {
                      type: row.status === "active" ? "success" : "info"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.status === "active" ? "\u6B63\u5E38" : "\u7981\u7528"), 1)
                      ]),
                      _: 2
                    }, 1032, ["type"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(BaseDialogForm, {
              modelValue: showDialog.value,
              "onUpdate:modelValue": [
                ($event) => showDialog.value = $event,
                (val) => {
                  if (!val) resetDialogForm();
                }
              ],
              title: isEdit.value ? "\u7F16\u8F91\u7528\u6237" : "\u6DFB\u52A0\u7528\u6237",
              fields: addFields,
              formData: dialogForm.value,
              onSubmit: handleDialogSubmit
            }, {
              avatar: withCtx(({ form }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$1, {
                    modelValue: form.avatar,
                    "onUpdate:modelValue": ($event) => form.avatar = $event,
                    onFileChange: (file) => form.avatarFile = file
                  }, null, _parent3, _scopeId2));
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
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { style: { "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "16px" } }, [
                  createVNode("h1", null, "\u7528\u6237\u7BA1\u7406"),
                  createVNode(_component_el_button, {
                    type: "primary",
                    onClick: openAddDialog
                  }, {
                    default: withCtx(() => [
                      createTextVNode("\u6DFB\u52A0\u7528\u6237")
                    ]),
                    _: 1
                  })
                ]),
                createVNode(BaseFilter, {
                  modelValue: filter.value,
                  "onUpdate:modelValue": ($event) => filter.value = $event,
                  fields: filterFields,
                  onSearch: handleSearch,
                  onReset: handleReset
                }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                createVNode(BaseTable, {
                  goods: usersList.value,
                  columns,
                  onEdit: handleEdit,
                  onDelete: handleDelete
                }, {
                  actions: withCtx(({ row, $index }) => [
                    createVNode(_component_el_button, {
                      type: "primary",
                      size: "small",
                      onClick: ($event) => handleEdit(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u7F16\u8F91")
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_el_button, {
                      type: "danger",
                      size: "small",
                      onClick: ($event) => handleDelete(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u5220\u9664")
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_el_button, {
                      type: "warning",
                      size: "small",
                      onClick: ($event) => handleResetPassword(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u91CD\u7F6E\u5BC6\u7801")
                      ]),
                      _: 2
                    }, 1032, ["onClick"])
                  ]),
                  status: withCtx(({ row }) => [
                    createVNode(_component_el_tag, {
                      type: row.status === "active" ? "success" : "info"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.status === "active" ? "\u6B63\u5E38" : "\u7981\u7528"), 1)
                      ]),
                      _: 2
                    }, 1032, ["type"])
                  ]),
                  _: 1
                }, 8, ["goods"]),
                createVNode(BaseDialogForm, {
                  modelValue: showDialog.value,
                  "onUpdate:modelValue": [
                    ($event) => showDialog.value = $event,
                    (val) => {
                      if (!val) resetDialogForm();
                    }
                  ],
                  title: isEdit.value ? "\u7F16\u8F91\u7528\u6237" : "\u6DFB\u52A0\u7528\u6237",
                  fields: addFields,
                  formData: dialogForm.value,
                  onSubmit: handleDialogSubmit
                }, {
                  avatar: withCtx(({ form }) => [
                    createVNode(_sfc_main$1, {
                      modelValue: form.avatar,
                      "onUpdate:modelValue": ($event) => form.avatar = $event,
                      onFileChange: (file) => form.avatarFile = file
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onFileChange"])
                  ]),
                  _: 1
                }, 8, ["modelValue", "onUpdate:modelValue", "title", "formData"])
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0e9111e0"]]);

export { index as default };
//# sourceMappingURL=index-CA6DAAbc.mjs.map
