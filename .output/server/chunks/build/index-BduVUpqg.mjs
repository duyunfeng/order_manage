import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, a as useNuxtApp, h as ElMessageBox } from './server.mjs';
import { B as BaseFilter, a as BaseTable } from './BaseTable-C1zcmb5s.mjs';
import { B as BaseActions } from './BaseActions-DBZ3m5Fi.mjs';
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

function getFactories(params) {
  const { $axios } = useNuxtApp();
  return $axios.get("/factories", { params });
}
function addFactory(data) {
  const { $axios } = useNuxtApp();
  return $axios.post("/factories", data);
}
function updateFactory(id, data) {
  const { $axios } = useNuxtApp();
  delete data._id;
  return $axios.put(`/factories/${id}`, data);
}
function deleteFactory(id) {
  const { $axios } = useNuxtApp();
  return $axios.delete(`/factories/${id}`);
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const statusMap = {
      active: "\u6B63\u5E38",
      inactive: "\u505C\u7528"
    };
    const filter = ref({ id: "", name: "", status: "" });
    const filterFields = [
      { prop: "id", label: "\u5DE5\u5382ID", placeholder: "\u8BF7\u8F93\u5165\u5DE5\u5382ID", type: "input" },
      { prop: "name", label: "\u5DE5\u5382\u540D\u79F0", placeholder: "\u8BF7\u8F93\u5165\u5DE5\u5382\u540D\u79F0", type: "input" },
      {
        prop: "status",
        label: "\u72B6\u6001",
        type: "select",
        placeholder: "\u8BF7\u9009\u62E9\u72B6\u6001",
        options: [
          { label: "\u5168\u90E8", value: "" },
          { label: "\u6B63\u5E38", value: "active" },
          { label: "\u505C\u7528", value: "inactive" }
        ]
      }
    ];
    const showDialog = ref(false);
    const isEdit = ref(false);
    const dialogForm = ref({
      name: "",
      address: "",
      manager: "",
      phone: "",
      status: "\u6B63\u5E38",
      _id: void 0
    });
    const addFields = [
      { prop: "name", label: "\u5DE5\u5382\u540D\u79F0", type: "input", placeholder: "\u8BF7\u8F93\u5165\u5DE5\u5382\u540D\u79F0", required: true },
      { prop: "address", label: "\u5730\u5740", type: "input", placeholder: "\u8BF7\u8F93\u5165\u5730\u5740", required: true },
      { prop: "manager", label: "\u8D1F\u8D23\u4EBA", type: "input", placeholder: "\u8BF7\u8F93\u5165\u8D1F\u8D23\u4EBA", required: true },
      {
        prop: "phone",
        label: "\u8054\u7CFB\u65B9\u5F0F",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u8054\u7CFB\u65B9\u5F0F",
        required: true
      },
      {
        prop: "status",
        label: "\u72B6\u6001",
        type: "select",
        placeholder: "\u8BF7\u9009\u62E9\u72B6\u6001",
        options: [
          { label: "\u6B63\u5E38", value: "active" },
          { label: "\u505C\u7528", value: "inactive" }
        ],
        required: true
      }
    ];
    const columns = [
      { prop: "id", label: "\u5DE5\u5382ID", width: 200 },
      { prop: "name", label: "\u5DE5\u5382\u540D\u79F0", width: 120 },
      { prop: "address", label: "\u5730\u5740", width: 200 },
      { prop: "manager", label: "\u8D1F\u8D23\u4EBA", width: 120 },
      { prop: "phone", label: "\u8054\u7CFB\u65B9\u5F0F", width: 140 },
      { prop: "status", label: "\u72B6\u6001", width: 100, slot: true },
      { prop: "createdAt", label: "\u521B\u5EFA\u65F6\u95F4", width: 160 },
      { prop: "updatedAt", label: "\u66F4\u65B0\u65F6\u95F4", width: 160 },
      {
        prop: "actions",
        label: "\u64CD\u4F5C",
        minWidth: 180,
        slot: true,
        actions: BaseActions,
        getActions: (row, index2) => [
          {
            label: "\u7F16\u8F91",
            type: "primary",
            onClick: (row2) => handleEdit(row2)
          },
          {
            label: "\u5220\u9664",
            type: "danger",
            onClick: (row2) => handleDelete(row2)
          }
        ]
      }
    ];
    const factoriesList = ref([]);
    const { $axios } = useNuxtApp();
    async function fetchFactories() {
      const res = await getFactories(filter.value);
      factoriesList.value = res.data.data || res;
    }
    function handleSearch(f) {
      fetchFactories().then(() => {
        factoriesList.value = factoriesList.value.filter((item) => {
          const matchId = !f.id || item.id.includes(f.id);
          const matchName = !f.name || item.name.includes(f.name);
          const matchStatus = !f.status || item.status === f.status;
          return matchId && matchName && matchStatus;
        });
      });
    }
    function handleReset() {
      filter.value = { id: "", name: "", status: "" };
      fetchFactories();
    }
    function openAddDialog() {
      isEdit.value = false;
      resetDialogForm();
      showDialog.value = true;
    }
    function openEditDialog(row) {
      isEdit.value = true;
      dialogForm.value = { ...row, _id: row.id };
      showDialog.value = true;
    }
    function resetDialogForm() {
      dialogForm.value = {
        name: "",
        address: "",
        manager: "",
        phone: "",
        status: "\u6B63\u5E38",
        _id: void 0
      };
    }
    async function handleDialogSubmit(form) {
      const submitData = { ...form };
      delete submitData._id;
      if (isEdit.value) {
        await updateFactory(form._id, submitData);
      } else {
        await addFactory(submitData);
      }
      fetchFactories();
      showDialog.value = false;
      resetDialogForm();
    }
    function handleEdit(row) {
      openEditDialog(row);
    }
    function handleDelete(row) {
      ElMessageBox.confirm(`\u786E\u5B9A\u8981\u5220\u9664\u5DE5\u5382\uFF1A${row.name} \u5417\uFF1F`, "\u63D0\u793A", {
        confirmButtonText: "\u786E\u5B9A",
        cancelButtonText: "\u53D6\u6D88",
        type: "warning"
      }).then(() => {
        deleteFactory(row.id).then(() => {
          fetchFactories();
        });
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_card = resolveComponent("el-card");
      const _component_el_button = resolveComponent("el-button");
      const _component_el_tag = resolveComponent("el-tag");
      _push(ssrRenderComponent(_component_el_card, mergeProps({ class: "factory-card" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-92337428${_scopeId}><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "16px" })}" data-v-92337428${_scopeId}><h1 data-v-92337428${_scopeId}>\u5DE5\u5382\u8D44\u6599</h1>`);
            _push2(ssrRenderComponent(_component_el_button, {
              type: "primary",
              onClick: openAddDialog
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u6DFB\u52A0\u5DE5\u5382`);
                } else {
                  return [
                    createTextVNode("\u6DFB\u52A0\u5DE5\u5382")
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
              goods: factoriesList.value,
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
                        _push4(`${ssrInterpolate(statusMap[row.status])}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(statusMap[row.status]), 1)
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
                        createTextVNode(toDisplayString(statusMap[row.status]), 1)
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
              title: isEdit.value ? "\u7F16\u8F91\u5DE5\u5382" : "\u6DFB\u52A0\u5DE5\u5382",
              fields: addFields,
              formData: dialogForm.value,
              onSubmit: handleDialogSubmit
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { style: { "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "16px" } }, [
                  createVNode("h1", null, "\u5DE5\u5382\u8D44\u6599"),
                  createVNode(_component_el_button, {
                    type: "primary",
                    onClick: openAddDialog
                  }, {
                    default: withCtx(() => [
                      createTextVNode("\u6DFB\u52A0\u5DE5\u5382")
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
                  goods: factoriesList.value,
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
                    }, 1032, ["onClick"])
                  ]),
                  status: withCtx(({ row }) => [
                    createVNode(_component_el_tag, {
                      type: row.status === "active" ? "success" : "info"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(statusMap[row.status]), 1)
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
                  title: isEdit.value ? "\u7F16\u8F91\u5DE5\u5382" : "\u6DFB\u52A0\u5DE5\u5382",
                  fields: addFields,
                  formData: dialogForm.value,
                  onSubmit: handleDialogSubmit
                }, null, 8, ["modelValue", "onUpdate:modelValue", "title", "formData"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/factories/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-92337428"]]);

export { index as default };
//# sourceMappingURL=index-BduVUpqg.mjs.map
