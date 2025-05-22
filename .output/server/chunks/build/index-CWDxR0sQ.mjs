import { defineComponent, ref, computed, resolveComponent, mergeProps, withCtx, createTextVNode, createVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { B as BaseFilter, a as BaseTable } from './BaseTable-C1zcmb5s.mjs';
import { B as BaseDialogForm } from './BaseDialogForm-DUGipoET.mjs';
import { B as BaseActions } from './BaseActions-DBZ3m5Fi.mjs';
import { _ as _export_sfc, o as delete_default, p as plus_default, h as ElMessageBox, a as useNuxtApp } from './server.mjs';
import 'dayjs';
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

function getOrders(params) {
  const { $axios } = useNuxtApp();
  return $axios.get("/orders", { params });
}
function addOrder(data) {
  const { $axios } = useNuxtApp();
  return $axios.post("/orders", data);
}
function updateOrder(id, data) {
  const { $axios } = useNuxtApp();
  return $axios.put(`/orders/${id}`, data);
}
function deleteOrder(id) {
  const { $axios } = useNuxtApp();
  return $axios.delete(`/orders/${id}`);
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    const filter = ref({ id: "", customer: "", status: "", createdAt: "" });
    const filterFields = [
      { prop: "id", label: "\u8BA2\u5355ID", placeholder: "\u8BF7\u8F93\u5165\u8BA2\u5355ID", type: "input" },
      { prop: "customer", label: "\u5BA2\u6237", placeholder: "\u8BF7\u8F93\u5165\u5BA2\u6237\u540D", type: "input" },
      {
        prop: "status",
        label: "\u72B6\u6001",
        type: "select",
        placeholder: "\u8BF7\u9009\u62E9\u72B6\u6001",
        options: [
          { label: "\u5168\u90E8", value: "" },
          { label: "\u5DF2\u652F\u4ED8", value: "\u5DF2\u652F\u4ED8" },
          { label: "\u5F85\u652F\u4ED8", value: "\u5F85\u652F\u4ED8" }
        ]
      },
      {
        prop: "createdAt",
        label: "\u521B\u5EFA\u65F6\u95F4",
        type: "date",
        placeholder: "\u8BF7\u9009\u62E9\u521B\u5EFA\u65F6\u95F4",
        valueFormat: "YYYY-MM-DD"
      }
    ];
    const showDialog = ref(false);
    const isEdit = ref(false);
    const dialogForm = ref({
      customer: "",
      goodsList: [{ name: "", quantity: 1 }],
      amount: null,
      status: "\u5F85\u652F\u4ED8",
      shippingDate: "",
      contractUrl: "",
      contractFileList: [],
      _id: void 0
    });
    const ordersList = ref([]);
    const previewDialogVisible = ref(false);
    const previewUrl = ref("");
    const downloadUrl = ref("");
    const customerOptions = ref([]);
    const goodsOptions = ref([]);
    const goodsSearchKeyword = ref("");
    computed(() => {
      if (!goodsSearchKeyword.value) return goodsOptions.value;
      return goodsOptions.value.filter((item) => item.name.includes(goodsSearchKeyword.value));
    });
    async function fetchOrders() {
      const res = await getOrders();
      ordersList.value = (res.data.data || res).map((item) => ({
        ...item,
        createdAt: item.createdAt || "",
        updatedAt: item.updatedAt || ""
      }));
    }
    function handleSearch(f) {
      fetchOrders().then(() => {
        ordersList.value = ordersList.value.filter((item) => {
          const matchId = !f.id || item.id.includes(f.id);
          const matchCustomer = !f.customer || item.customer.includes(f.customer);
          const matchStatus = !f.status || item.status === f.status;
          const matchDate = !f.createdAt || item.createdAt.startsWith(f.createdAt);
          return matchId && matchCustomer && matchStatus && matchDate;
        });
      });
    }
    function handleReset() {
      filter.value = { id: "", customer: "", status: "", createdAt: "" };
      fetchOrders();
    }
    function handleContractUploadSuccess(res, file, fileList, form) {
      form.contractUrl = res.data.url;
      form.contractFileList = [
        {
          name: file.name,
          url: res.url,
          status: "success"
        }
      ];
    }
    function handleContractPreview(file, form) {
      previewContractFile(file.url);
    }
    function handleContractRemove(file, fileList, form) {
      form.contractUrl = "";
      form.contractFileList = [];
    }
    function openAddDialog() {
      isEdit.value = false;
      resetDialogForm();
      showDialog.value = true;
    }
    function openEditDialog(row) {
      isEdit.value = true;
      dialogForm.value = {
        ...row,
        _id: row.id,
        contractFileList: row.contractUrl ? [{ name: "\u5408\u540C\u6587\u4EF6", url: row.contractUrl, status: "success" }] : []
      };
      showDialog.value = true;
    }
    function resetDialogForm() {
      dialogForm.value = {
        customer: "",
        goodsList: [{ name: "", quantity: 1 }],
        amount: null,
        status: "\u5F85\u652F\u4ED8",
        shippingDate: "",
        contractUrl: "",
        contractFileList: [],
        _id: void 0
      };
    }
    async function handleDialogSubmit(form) {
      const submitData = { ...form };
      delete submitData._id;
      if (isEdit.value) {
        await updateOrder(form._id, submitData);
      } else {
        await addOrder(submitData);
      }
      fetchOrders();
      showDialog.value = false;
      resetDialogForm();
    }
    function handleEdit(row) {
      openEditDialog(row);
    }
    function handleDelete(row) {
      ElMessageBox.confirm(`\u786E\u5B9A\u8981\u5220\u9664\u8BA2\u5355\uFF1A${row.id} \u5417\uFF1F`, "\u63D0\u793A", {
        confirmButtonText: "\u786E\u5B9A",
        cancelButtonText: "\u53D6\u6D88",
        type: "warning"
      }).then(() => {
        deleteOrder(row.id).then(() => {
          fetchOrders();
        });
      });
    }
    function previewContractFile(url) {
      console.log(url);
      const preview = getPreviewUrl(url);
      if (!preview) {
        ElMessageBox.alert("\u6682\u4E0D\u652F\u6301\u9884\u89C8\u8BE5\u7C7B\u578B\u6587\u4EF6\uFF0C\u8BF7\u4E0B\u8F7D\u540E\u67E5\u770B", "\u63D0\u793A");
        previewUrl.value = "";
        previewDialogVisible.value = true;
        downloadUrl.value = url;
        return;
      }
      previewUrl.value = preview;
      previewDialogVisible.value = true;
      downloadUrl.value = url;
    }
    function getPreviewUrl(url) {
      var _a;
      if (!url) return "";
      const ext = (_a = url.split(".").pop()) == null ? void 0 : _a.toLowerCase();
      if (ext === "pdf") {
        return url;
      }
      const officeExts = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"];
      if (officeExts.includes(ext)) {
        return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`;
      }
      return "";
    }
    function downloadFile(url) {
      const a = (void 0).createElement("a");
      a.href = url;
      a.download = "";
      (void 0).body.appendChild(a);
      a.click();
      (void 0).body.removeChild(a);
    }
    const orderFields = computed(() => [
      {
        prop: "customer",
        label: "\u5BA2\u6237",
        type: "select",
        placeholder: "\u8BF7\u9009\u62E9\u5BA2\u6237",
        options: customerOptions.value.map((item) => ({ label: item.name, value: item.name })),
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      {
        prop: "goodsList",
        label: "\u5546\u54C1\u5217\u8868",
        type: "goods-list"
      },
      {
        prop: "amount",
        label: "\u91D1\u989D",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u91D1\u989D",
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      {
        prop: "status",
        label: "\u72B6\u6001",
        type: "select",
        placeholder: "\u8BF7\u9009\u62E9\u72B6\u6001",
        options: [
          { label: "\u5DF2\u652F\u4ED8", value: "\u5DF2\u652F\u4ED8" },
          { label: "\u5F85\u652F\u4ED8", value: "\u5F85\u652F\u4ED8" }
        ],
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      {
        prop: "shippingDate",
        label: "\u8239\u671F",
        type: "date",
        placeholder: "\u8BF7\u9009\u62E9\u8239\u671F",
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      {
        prop: "contractUrl",
        label: "\u5408\u540C\u6587\u4EF6",
        type: "custom-upload"
      }
    ]);
    const columns = [
      { prop: "id", label: "\u8BA2\u5355ID", width: 200 },
      { prop: "customer", label: "\u5BA2\u6237", width: 120 },
      { prop: "goodsList", label: "\u5546\u54C1\u5217\u8868", minWidth: 200, slot: true },
      { prop: "amount", label: "\u91D1\u989D", width: 100 },
      { prop: "status", label: "\u72B6\u6001", width: 100, slot: true },
      { prop: "shippingDate", label: "\u8239\u671F", width: 120 },
      {
        prop: "contractUrl",
        label: "\u5408\u540C\u9884\u89C8",
        width: 160,
        slot: true,
        getSlot: (row) => row.contractUrl ? `<span class='contract-actions'>
            <button class='el-button el-button--text' onclick='window.__vuePreviewContractFile && window.__vuePreviewContractFile("${row.contractUrl}")'>\u9884\u89C8</button>
            <button class='el-button el-button--text' onclick='window.__vueDownloadContractFile && window.__vueDownloadContractFile("${row.contractUrl}")'>\u4E0B\u8F7D</button>
          </span>` : "\u65E0"
      },
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
    __expose({ handleContractPreview, handleContractRemove });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_card = resolveComponent("el-card");
      const _component_el_button = resolveComponent("el-button");
      const _component_el_select = resolveComponent("el-select");
      const _component_el_option = resolveComponent("el-option");
      const _component_el_input_number = resolveComponent("el-input-number");
      const _component_el_upload = resolveComponent("el-upload");
      const _component_el_dialog = resolveComponent("el-dialog");
      _push(ssrRenderComponent(_component_el_card, mergeProps({ class: "order-card" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-0c2c1998${_scopeId}><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "16px" })}" data-v-0c2c1998${_scopeId}><h1 data-v-0c2c1998${_scopeId}>\u8BA2\u5355\u7BA1\u7406</h1>`);
            _push2(ssrRenderComponent(_component_el_button, {
              type: "primary",
              onClick: openAddDialog
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u6DFB\u52A0\u8BA2\u5355`);
                } else {
                  return [
                    createTextVNode("\u6DFB\u52A0\u8BA2\u5355")
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
              goods: ordersList.value,
              columns
            }, {
              goodsList: withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div data-v-0c2c1998${_scopeId2}><!--[-->`);
                  ssrRenderList(row.goodsList, (item) => {
                    _push3(`<span style="${ssrRenderStyle({ "margin-right": "8px" })}" data-v-0c2c1998${_scopeId2}>${ssrInterpolate(item.name)} x${ssrInterpolate(item.quantity)}</span>`);
                  });
                  _push3(`<!--]--></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(row.goodsList, (item) => {
                        return openBlock(), createBlock("span", {
                          key: item.name,
                          style: { "margin-right": "8px" }
                        }, toDisplayString(item.name) + " x" + toDisplayString(item.quantity), 1);
                      }), 128))
                    ])
                  ];
                }
              }),
              contractUrl: withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (row.contractUrl) {
                    _push3(ssrRenderComponent(_component_el_button, {
                      type: "primary",
                      link: "",
                      onClick: ($event) => previewContractFile(row.contractUrl)
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`\u9884\u89C8`);
                        } else {
                          return [
                            createTextVNode("\u9884\u89C8")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (row.contractUrl) {
                    _push3(ssrRenderComponent(_component_el_button, {
                      type: "danger",
                      link: "",
                      onClick: ($event) => downloadFile(row.contractUrl)
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`\u4E0B\u8F7D`);
                        } else {
                          return [
                            createTextVNode("\u4E0B\u8F7D")
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    _push3(`<span data-v-0c2c1998${_scopeId2}>\u65E0</span>`);
                  }
                } else {
                  return [
                    row.contractUrl ? (openBlock(), createBlock(_component_el_button, {
                      key: 0,
                      type: "primary",
                      link: "",
                      onClick: ($event) => previewContractFile(row.contractUrl)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u9884\u89C8")
                      ]),
                      _: 2
                    }, 1032, ["onClick"])) : createCommentVNode("", true),
                    row.contractUrl ? (openBlock(), createBlock(_component_el_button, {
                      key: 1,
                      type: "danger",
                      link: "",
                      onClick: ($event) => downloadFile(row.contractUrl)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u4E0B\u8F7D")
                      ]),
                      _: 2
                    }, 1032, ["onClick"])) : (openBlock(), createBlock("span", { key: 2 }, "\u65E0"))
                  ];
                }
              }),
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
              title: isEdit.value ? "\u7F16\u8F91\u8BA2\u5355" : "\u6DFB\u52A0\u8BA2\u5355",
              fields: orderFields.value,
              formData: dialogForm.value,
              onSubmit: handleDialogSubmit
            }, {
              goodsList: withCtx(({ form }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(form.goodsList, (item, idx) => {
                    _push3(`<div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "margin-bottom": "8px" })}" data-v-0c2c1998${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_el_select, {
                      modelValue: item.name,
                      "onUpdate:modelValue": ($event) => item.name = $event,
                      placeholder: "\u8BF7\u9009\u62E9\u5546\u54C1",
                      style: { "width": "160px", "margin-right": "8px" }
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(goodsOptions.value, (g) => {
                            _push4(ssrRenderComponent(_component_el_option, {
                              key: g.name,
                              label: g.name,
                              value: g.name
                            }, null, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(goodsOptions.value, (g) => {
                              return openBlock(), createBlock(_component_el_option, {
                                key: g.name,
                                label: g.name,
                                value: g.name
                              }, null, 8, ["label", "value"]);
                            }), 128))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(_component_el_input_number, {
                      modelValue: item.quantity,
                      "onUpdate:modelValue": ($event) => item.quantity = $event,
                      min: 1,
                      style: { "width": "100px", "margin-right": "8px" }
                    }, null, _parent3, _scopeId2));
                    if (form.goodsList.length > 1) {
                      _push3(ssrRenderComponent(_component_el_button, {
                        type: "danger",
                        icon: unref(delete_default),
                        onClick: ($event) => form.goodsList.splice(idx, 1)
                      }, {
                        default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(` \u5220\u9664 `);
                          } else {
                            return [
                              createTextVNode(" \u5220\u9664 ")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                  });
                  _push3(`<!--]-->`);
                  _push3(ssrRenderComponent(_component_el_button, {
                    type: "primary",
                    plain: "",
                    icon: unref(plus_default),
                    onClick: ($event) => form.goodsList.push({ name: "", quantity: 1 })
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u6DFB\u52A0\u5546\u54C1`);
                      } else {
                        return [
                          createTextVNode("\u6DFB\u52A0\u5546\u54C1")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(form.goodsList, (item, idx) => {
                      return openBlock(), createBlock("div", {
                        key: idx,
                        style: { "display": "flex", "align-items": "center", "margin-bottom": "8px" }
                      }, [
                        createVNode(_component_el_select, {
                          modelValue: item.name,
                          "onUpdate:modelValue": ($event) => item.name = $event,
                          placeholder: "\u8BF7\u9009\u62E9\u5546\u54C1",
                          style: { "width": "160px", "margin-right": "8px" }
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(goodsOptions.value, (g) => {
                              return openBlock(), createBlock(_component_el_option, {
                                key: g.name,
                                label: g.name,
                                value: g.name
                              }, null, 8, ["label", "value"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1032, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_component_el_input_number, {
                          modelValue: item.quantity,
                          "onUpdate:modelValue": ($event) => item.quantity = $event,
                          min: 1,
                          style: { "width": "100px", "margin-right": "8px" }
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        form.goodsList.length > 1 ? (openBlock(), createBlock(_component_el_button, {
                          key: 0,
                          type: "danger",
                          icon: unref(delete_default),
                          onClick: ($event) => form.goodsList.splice(idx, 1)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" \u5220\u9664 ")
                          ]),
                          _: 2
                        }, 1032, ["icon", "onClick"])) : createCommentVNode("", true)
                      ]);
                    }), 128)),
                    createVNode(_component_el_button, {
                      type: "primary",
                      plain: "",
                      icon: unref(plus_default),
                      onClick: ($event) => form.goodsList.push({ name: "", quantity: 1 })
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u6DFB\u52A0\u5546\u54C1")
                      ]),
                      _: 2
                    }, 1032, ["icon", "onClick"])
                  ];
                }
              }),
              contractUrl: withCtx(({ form }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_upload, {
                    "file-list": form.contractFileList,
                    "show-file-list": true,
                    "on-success": (res, file, fileList) => handleContractUploadSuccess(res, file, fileList, form),
                    "on-preview": (file) => _ctx.$options.handleContractPreview(file, form),
                    "before-remove": (file, fileList) => _ctx.$options.handleContractRemove(file, fileList, form),
                    "auto-upload": true,
                    limit: 1,
                    action: "/api/upload",
                    accept: "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_el_button, { type: "primary" }, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`\u4E0A\u4F20\u5408\u540C`);
                            } else {
                              return [
                                createTextVNode("\u4E0A\u4F20\u5408\u540C")
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        if (form.contractFileList && form.contractFileList.length) {
                          _push4(`<span style="${ssrRenderStyle({ "margin-left": "8px", "color": "#67c23a" })}" data-v-0c2c1998${_scopeId3}>\u5DF2\u4E0A\u4F20</span>`);
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(_component_el_button, { type: "primary" }, {
                            default: withCtx(() => [
                              createTextVNode("\u4E0A\u4F20\u5408\u540C")
                            ]),
                            _: 1
                          }),
                          form.contractFileList && form.contractFileList.length ? (openBlock(), createBlock("span", {
                            key: 0,
                            style: { "margin-left": "8px", "color": "#67c23a" }
                          }, "\u5DF2\u4E0A\u4F20")) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_upload, {
                      "file-list": form.contractFileList,
                      "show-file-list": true,
                      "on-success": (res, file, fileList) => handleContractUploadSuccess(res, file, fileList, form),
                      "on-preview": (file) => _ctx.$options.handleContractPreview(file, form),
                      "before-remove": (file, fileList) => _ctx.$options.handleContractRemove(file, fileList, form),
                      "auto-upload": true,
                      limit: 1,
                      action: "/api/upload",
                      accept: "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_el_button, { type: "primary" }, {
                          default: withCtx(() => [
                            createTextVNode("\u4E0A\u4F20\u5408\u540C")
                          ]),
                          _: 1
                        }),
                        form.contractFileList && form.contractFileList.length ? (openBlock(), createBlock("span", {
                          key: 0,
                          style: { "margin-left": "8px", "color": "#67c23a" }
                        }, "\u5DF2\u4E0A\u4F20")) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1032, ["file-list", "on-success", "on-preview", "before-remove"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_el_dialog, {
              modelValue: previewDialogVisible.value,
              "onUpdate:modelValue": ($event) => previewDialogVisible.value = $event,
              title: "\u5408\u540C\u9884\u89C8",
              width: "80vw",
              top: "5vh",
              "custom-class": "preview-dialog"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="preview-dialog-flex" data-v-0c2c1998${_scopeId2}><div class="preview-dialog-body-full" data-v-0c2c1998${_scopeId2}>`);
                  if (previewUrl.value) {
                    _push3(`<iframe${ssrRenderAttr("src", previewUrl.value)} class="preview-iframe-full" data-v-0c2c1998${_scopeId2}></iframe>`);
                  } else {
                    _push3(`<div class="preview-empty-tip" data-v-0c2c1998${_scopeId2}>\u6682\u4E0D\u652F\u6301\u9884\u89C8\u8BE5\u7C7B\u578B\u6587\u4EF6\uFF0C\u8BF7\u4E0B\u8F7D\u540E\u67E5\u770B</div>`);
                  }
                  _push3(`</div>`);
                  if (downloadUrl.value) {
                    _push3(`<div class="preview-dialog-footer" data-v-0c2c1998${_scopeId2}>`);
                    _push3(ssrRenderComponent(_component_el_button, {
                      type: "primary",
                      onClick: ($event) => downloadFile(downloadUrl.value)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`\u4E0B\u8F7D\u6587\u4EF6`);
                        } else {
                          return [
                            createTextVNode("\u4E0B\u8F7D\u6587\u4EF6")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(`</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "preview-dialog-flex" }, [
                      createVNode("div", { class: "preview-dialog-body-full" }, [
                        previewUrl.value ? (openBlock(), createBlock("iframe", {
                          key: 0,
                          src: previewUrl.value,
                          class: "preview-iframe-full"
                        }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "preview-empty-tip"
                        }, "\u6682\u4E0D\u652F\u6301\u9884\u89C8\u8BE5\u7C7B\u578B\u6587\u4EF6\uFF0C\u8BF7\u4E0B\u8F7D\u540E\u67E5\u770B"))
                      ]),
                      downloadUrl.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "preview-dialog-footer"
                      }, [
                        createVNode(_component_el_button, {
                          type: "primary",
                          onClick: ($event) => downloadFile(downloadUrl.value)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u4E0B\u8F7D\u6587\u4EF6")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])) : createCommentVNode("", true)
                    ])
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
                  createVNode("h1", null, "\u8BA2\u5355\u7BA1\u7406"),
                  createVNode(_component_el_button, {
                    type: "primary",
                    onClick: openAddDialog
                  }, {
                    default: withCtx(() => [
                      createTextVNode("\u6DFB\u52A0\u8BA2\u5355")
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
                  goods: ordersList.value,
                  columns
                }, {
                  goodsList: withCtx(({ row }) => [
                    createVNode("div", null, [
                      (openBlock(true), createBlock(Fragment, null, renderList(row.goodsList, (item) => {
                        return openBlock(), createBlock("span", {
                          key: item.name,
                          style: { "margin-right": "8px" }
                        }, toDisplayString(item.name) + " x" + toDisplayString(item.quantity), 1);
                      }), 128))
                    ])
                  ]),
                  contractUrl: withCtx(({ row }) => [
                    row.contractUrl ? (openBlock(), createBlock(_component_el_button, {
                      key: 0,
                      type: "primary",
                      link: "",
                      onClick: ($event) => previewContractFile(row.contractUrl)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u9884\u89C8")
                      ]),
                      _: 2
                    }, 1032, ["onClick"])) : createCommentVNode("", true),
                    row.contractUrl ? (openBlock(), createBlock(_component_el_button, {
                      key: 1,
                      type: "danger",
                      link: "",
                      onClick: ($event) => downloadFile(row.contractUrl)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u4E0B\u8F7D")
                      ]),
                      _: 2
                    }, 1032, ["onClick"])) : (openBlock(), createBlock("span", { key: 2 }, "\u65E0"))
                  ]),
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
                  title: isEdit.value ? "\u7F16\u8F91\u8BA2\u5355" : "\u6DFB\u52A0\u8BA2\u5355",
                  fields: orderFields.value,
                  formData: dialogForm.value,
                  onSubmit: handleDialogSubmit
                }, {
                  goodsList: withCtx(({ form }) => [
                    (openBlock(true), createBlock(Fragment, null, renderList(form.goodsList, (item, idx) => {
                      return openBlock(), createBlock("div", {
                        key: idx,
                        style: { "display": "flex", "align-items": "center", "margin-bottom": "8px" }
                      }, [
                        createVNode(_component_el_select, {
                          modelValue: item.name,
                          "onUpdate:modelValue": ($event) => item.name = $event,
                          placeholder: "\u8BF7\u9009\u62E9\u5546\u54C1",
                          style: { "width": "160px", "margin-right": "8px" }
                        }, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(goodsOptions.value, (g) => {
                              return openBlock(), createBlock(_component_el_option, {
                                key: g.name,
                                label: g.name,
                                value: g.name
                              }, null, 8, ["label", "value"]);
                            }), 128))
                          ]),
                          _: 2
                        }, 1032, ["modelValue", "onUpdate:modelValue"]),
                        createVNode(_component_el_input_number, {
                          modelValue: item.quantity,
                          "onUpdate:modelValue": ($event) => item.quantity = $event,
                          min: 1,
                          style: { "width": "100px", "margin-right": "8px" }
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        form.goodsList.length > 1 ? (openBlock(), createBlock(_component_el_button, {
                          key: 0,
                          type: "danger",
                          icon: unref(delete_default),
                          onClick: ($event) => form.goodsList.splice(idx, 1)
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" \u5220\u9664 ")
                          ]),
                          _: 2
                        }, 1032, ["icon", "onClick"])) : createCommentVNode("", true)
                      ]);
                    }), 128)),
                    createVNode(_component_el_button, {
                      type: "primary",
                      plain: "",
                      icon: unref(plus_default),
                      onClick: ($event) => form.goodsList.push({ name: "", quantity: 1 })
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u6DFB\u52A0\u5546\u54C1")
                      ]),
                      _: 2
                    }, 1032, ["icon", "onClick"])
                  ]),
                  contractUrl: withCtx(({ form }) => [
                    createVNode(_component_el_upload, {
                      "file-list": form.contractFileList,
                      "show-file-list": true,
                      "on-success": (res, file, fileList) => handleContractUploadSuccess(res, file, fileList, form),
                      "on-preview": (file) => _ctx.$options.handleContractPreview(file, form),
                      "before-remove": (file, fileList) => _ctx.$options.handleContractRemove(file, fileList, form),
                      "auto-upload": true,
                      limit: 1,
                      action: "/api/upload",
                      accept: "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    }, {
                      default: withCtx(() => [
                        createVNode(_component_el_button, { type: "primary" }, {
                          default: withCtx(() => [
                            createTextVNode("\u4E0A\u4F20\u5408\u540C")
                          ]),
                          _: 1
                        }),
                        form.contractFileList && form.contractFileList.length ? (openBlock(), createBlock("span", {
                          key: 0,
                          style: { "margin-left": "8px", "color": "#67c23a" }
                        }, "\u5DF2\u4E0A\u4F20")) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1032, ["file-list", "on-success", "on-preview", "before-remove"])
                  ]),
                  _: 1
                }, 8, ["modelValue", "onUpdate:modelValue", "title", "fields", "formData"]),
                createVNode(_component_el_dialog, {
                  modelValue: previewDialogVisible.value,
                  "onUpdate:modelValue": ($event) => previewDialogVisible.value = $event,
                  title: "\u5408\u540C\u9884\u89C8",
                  width: "80vw",
                  top: "5vh",
                  "custom-class": "preview-dialog"
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "preview-dialog-flex" }, [
                      createVNode("div", { class: "preview-dialog-body-full" }, [
                        previewUrl.value ? (openBlock(), createBlock("iframe", {
                          key: 0,
                          src: previewUrl.value,
                          class: "preview-iframe-full"
                        }, null, 8, ["src"])) : (openBlock(), createBlock("div", {
                          key: 1,
                          class: "preview-empty-tip"
                        }, "\u6682\u4E0D\u652F\u6301\u9884\u89C8\u8BE5\u7C7B\u578B\u6587\u4EF6\uFF0C\u8BF7\u4E0B\u8F7D\u540E\u67E5\u770B"))
                      ]),
                      downloadUrl.value ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "preview-dialog-footer"
                      }, [
                        createVNode(_component_el_button, {
                          type: "primary",
                          onClick: ($event) => downloadFile(downloadUrl.value)
                        }, {
                          default: withCtx(() => [
                            createTextVNode("\u4E0B\u8F7D\u6587\u4EF6")
                          ]),
                          _: 1
                        }, 8, ["onClick"])
                      ])) : createCommentVNode("", true)
                    ])
                  ]),
                  _: 1
                }, 8, ["modelValue", "onUpdate:modelValue"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0c2c1998"]]);

export { index as default };
//# sourceMappingURL=index-CWDxR0sQ.mjs.map
