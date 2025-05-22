import { defineComponent, ref, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, unref, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderTeleport } from 'vue/server-renderer';
import { _ as _export_sfc, a as useNuxtApp, h as ElMessageBox, E as ElMessage, g as ElImageViewer } from './server.mjs';
import { B as BaseFilter, a as BaseTable } from './BaseTable-C1zcmb5s.mjs';
import { B as BaseDialogForm } from './BaseDialogForm-DUGipoET.mjs';
import { _ as _sfc_main$2 } from './ImageUpload-Bthyn9zH.mjs';
import { u as uploadFile } from './upload-D2iGuTey.mjs';
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

function getGoods(params) {
  const { $axios } = useNuxtApp();
  return $axios.get("/goods", { params });
}
function addGood(data) {
  const { $axios } = useNuxtApp();
  return $axios.post("/goods", data);
}
function updateGood(id, data) {
  const { $axios } = useNuxtApp();
  return $axios.put(`/goods/${id}`, data);
}
function deleteGood(id) {
  const { $axios } = useNuxtApp();
  return $axios.delete(`/goods/${id}`);
}
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ImagePreviewer",
  __ssrInlineRender: true,
  props: {
    urlList: {},
    initialIndex: {},
    visible: { type: Boolean }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    function close() {
      emit("close");
    }
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (_ctx.visible) {
          _push2(ssrRenderComponent(unref(ElImageViewer), {
            "url-list": _ctx.urlList,
            "z-index": 3e3,
            "initial-index": _ctx.initialIndex,
            "hide-on-click-modal": true,
            onClose: close
          }, null, _parent));
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImagePreviewer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const filter = ref({ id: "", name: "", status: "", createdAt: "" });
    const filterFields = [
      { prop: "id", label: "\u5546\u54C1ID", placeholder: "\u8BF7\u8F93\u5165\u5546\u54C1ID", type: "input" },
      { prop: "name", label: "\u5546\u54C1\u540D\u79F0", placeholder: "\u8BF7\u8F93\u5165\u5546\u54C1\u540D\u79F0", type: "input" },
      {
        prop: "status",
        label: "\u72B6\u6001",
        type: "select",
        placeholder: "\u8BF7\u9009\u62E9\u72B6\u6001",
        options: [
          { label: "\u5168\u90E8", value: "" },
          { label: "\u4E0A\u67B6", value: "on" },
          { label: "\u4E0B\u67B6", value: "off" }
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
      name: "",
      price: null,
      spec_length: null,
      spec_width: null,
      spec_height: null,
      spec_unit: "cm",
      spec_color: "",
      image: "",
      imageFile: null,
      factories: [],
      _id: void 0
      // 编辑时用
    });
    const factoryOptions = [
      { label: "\u5DE5\u5382\u4E00", value: "f1" },
      { label: "\u5DE5\u5382\u4E8C", value: "f2" },
      { label: "\u5DE5\u5382\u4E09", value: "f3" }
    ];
    const addFields = [
      {
        prop: "name",
        label: "\u5546\u54C1\u540D\u79F0",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u5546\u54C1\u540D\u79F0",
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      {
        prop: "price",
        label: "\u4EF7\u683C($)",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u4EF7\u683C",
        rules: [{ required: true, message: "\u5FC5\u586B" }]
      },
      { prop: "spec_length", label: "\u957F\u5EA6", type: "input", placeholder: "\u8BF7\u8F93\u5165\u957F\u5EA6" },
      { prop: "spec_width", label: "\u5BBD\u5EA6", type: "input", placeholder: "\u8BF7\u8F93\u5165\u5BBD\u5EA6" },
      { prop: "spec_height", label: "\u9AD8\u5EA6", type: "input", placeholder: "\u8BF7\u8F93\u5165\u9AD8\u5EA6" },
      {
        prop: "spec_unit",
        label: "\u5355\u4F4D",
        type: "input",
        placeholder: "\u8BF7\u8F93\u5165\u5355\u4F4D",
        rules: [],
        default: "cm"
      },
      { prop: "spec_color", label: "\u989C\u8272", type: "input", placeholder: "\u8BF7\u8F93\u5165\u989C\u8272" },
      {
        prop: "image",
        label: "\u5546\u54C1\u56FE\u7247",
        type: "custom-upload",
        placeholder: "\u8BF7\u4E0A\u4F20\u5546\u54C1\u56FE\u7247"
      },
      {
        prop: "factories",
        label: "\u751F\u4EA7\u5DE5\u5382",
        type: "factory-select",
        placeholder: "\u8BF7\u9009\u62E9\u5DE5\u5382",
        options: factoryOptions
      }
    ];
    const columns = [
      { prop: "id", label: "\u5546\u54C1ID", width: 200 },
      { prop: "name", label: "\u540D\u79F0", width: 180 },
      { prop: "spec", label: "\u89C4\u683C", minWidth: 200, slot: true },
      { prop: "image", label: "\u56FE\u7247", width: 120, slot: true },
      { prop: "price", label: "\u4EF7\u683C($)", width: 100 },
      { prop: "factories", label: "\u751F\u4EA7\u5DE5\u5382", minWidth: 180, slot: true },
      { prop: "status", label: "\u4E0A\u67B6\u72B6\u6001", width: 100, slot: true },
      { prop: "createdAt", label: "\u521B\u5EFA\u65F6\u95F4", width: 160 },
      { prop: "updatedAt", label: "\u66F4\u65B0\u65F6\u95F4", width: 160 },
      {
        prop: "actions",
        label: "\u64CD\u4F5C",
        minWidth: 240,
        getActions: (row, index2) => [
          {
            label: "\u67E5\u770B",
            onClick: (row2) => handleView(row2)
          },
          {
            label: "\u7F16\u8F91",
            type: "primary",
            onClick: (row2) => openEditDialog(row2)
          },
          {
            label: row.status === "on" ? "\u4E0B\u67B6" : "\u4E0A\u67B6",
            type: row.status === "on" ? "warning" : "success",
            onClick: (row2) => handleToggleStatus(row2, row2.status === "on" ? "off" : "on")
          },
          {
            label: "\u5220\u9664",
            type: "danger",
            onClick: (row2) => handleDelete(row2)
          }
        ]
      }
    ];
    const goodsList = ref([]);
    const { $axios } = useNuxtApp();
    const imagePreviewVisible = ref(false);
    const imagePreviewList = ref([]);
    const imagePreviewIndex = ref(0);
    async function fetchGoods() {
      const res = await getGoods(filter.value);
      goodsList.value = res.data.data.map((item) => {
        return {
          ...item,
          spec: JSON.parse(item.spec),
          factories: item.factories.map((f) => f.factory)
        };
      }) || [];
    }
    function handleSearch(f) {
      fetchGoods().then(() => {
        goodsList.value = goodsList.value.filter((item) => {
          const matchId = !f.id || item.id.includes(f.id);
          const matchName = !f.name || item.name.includes(f.name);
          const matchStatus = !f.status || item.status === f.status;
          const matchDate = !f.createdAt || item.createdAt.startsWith(f.createdAt);
          return matchId && matchName && matchStatus && matchDate;
        });
      });
    }
    function handleReset() {
      filter.value = { id: "", name: "", status: "", createdAt: "" };
      fetchGoods();
    }
    function handleView(row) {
      alert("\u67E5\u770B\u8BE6\u60C5\uFF1A" + row.name);
    }
    function handleEdit(row) {
      var _a;
      isEdit.value = true;
      dialogForm.value = {
        name: row.name,
        price: row.price,
        spec_length: row.spec.length,
        spec_width: row.spec.width,
        spec_height: row.spec.height,
        spec_color: row.spec.color,
        spec_unit: row.spec.unit || "cm",
        image: row.image,
        imageFile: null,
        factories: ((_a = row.factories) == null ? void 0 : _a.map((f) => f.id)) || [],
        _id: row.id
      };
      showDialog.value = true;
    }
    function handleDelete(row) {
      ElMessageBox.confirm(`\u786E\u5B9A\u8981\u5220\u9664\u5546\u54C1\uFF1A${row.name} \u5417\uFF1F`, "\u63D0\u793A", {
        confirmButtonText: "\u786E\u5B9A",
        cancelButtonText: "\u53D6\u6D88",
        type: "warning"
      }).then(() => {
        deleteGood(row.id).then(() => {
          fetchGoods();
        });
      });
    }
    function handleToggleStatus(row, status) {
      updateGood(row.id, {
        ...row,
        status
      }).then(() => {
        fetchGoods();
      });
    }
    function handleFactoryClick(factory) {
      router.push({ path: "/factories", query: { id: factory.id } });
    }
    function openAddDialog() {
      isEdit.value = false;
      resetDialogForm();
      showDialog.value = true;
    }
    function openEditDialog(row) {
      var _a;
      isEdit.value = true;
      dialogForm.value = {
        name: row.name,
        price: row.price,
        spec_length: row.spec.length,
        spec_width: row.spec.width,
        spec_height: row.spec.height,
        spec_color: row.spec.color,
        spec_unit: row.spec.unit || "cm",
        image: row.image,
        imageFile: null,
        factories: ((_a = row.factories) == null ? void 0 : _a.map((f) => f.id)) || [],
        _id: row.id
      };
      showDialog.value = true;
    }
    function resetDialogForm() {
      dialogForm.value = {
        name: "",
        price: null,
        spec_length: null,
        spec_width: null,
        spec_height: null,
        spec_unit: "cm",
        spec_color: "",
        image: "",
        imageFile: null,
        factories: [],
        _id: void 0
      };
    }
    async function handleDialogSubmit(form) {
      let imageUrl = form.image;
      if (form.imageFile) {
        imageUrl = await uploadFile(form.imageFile);
      }
      const selectedFactories = factoryOptions.filter((f) => {
        var _a;
        return (_a = form.factories) == null ? void 0 : _a.includes(f.value);
      }).map((f) => ({ id: f.value, name: f.label }));
      const goodsData = {
        name: form.name,
        price: Number(form.price),
        spec: JSON.stringify({
          length: form.spec_length,
          width: form.spec_width,
          height: form.spec_height,
          color: form.spec_color,
          unit: form.spec_unit || "cm"
        }),
        image: imageUrl,
        factories: selectedFactories,
        status: "on"
      };
      if (isEdit.value) {
        const submitData = { ...goodsData };
        delete submitData._id;
        await updateGood(form._id, submitData);
        ElMessage.success("\u5546\u54C1\u7F16\u8F91\u6210\u529F");
      } else {
        await addGood(goodsData);
        ElMessage.success("\u5546\u54C1\u6DFB\u52A0\u6210\u529F");
      }
      fetchGoods();
      showDialog.value = false;
      resetDialogForm();
    }
    function openImagePreview(url) {
      imagePreviewList.value = [url];
      imagePreviewIndex.value = 0;
      imagePreviewVisible.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_card = resolveComponent("el-card");
      const _component_el_button = resolveComponent("el-button");
      const _component_el_tag = resolveComponent("el-tag");
      _push(ssrRenderComponent(_component_el_card, mergeProps({ class: "goods-card" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-c8a12274${_scopeId}><div style="${ssrRenderStyle({ "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "16px" })}" data-v-c8a12274${_scopeId}><h1 data-v-c8a12274${_scopeId}>\u5546\u54C1\u7BA1\u7406</h1>`);
            _push2(ssrRenderComponent(_component_el_button, {
              type: "primary",
              onClick: openAddDialog
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u6DFB\u52A0\u5546\u54C1`);
                } else {
                  return [
                    createTextVNode("\u6DFB\u52A0\u5546\u54C1")
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
              goods: goodsList.value,
              columns,
              onView: handleView,
              onEdit: handleEdit,
              onDelete: handleDelete,
              onFactoryClick: handleFactoryClick
            }, {
              spec: withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div data-v-c8a12274${_scopeId2}><div data-v-c8a12274${_scopeId2}> \u957F*\u5BBD*\u9AD8\uFF1A${ssrInterpolate(row.spec.length)}*${ssrInterpolate(row.spec.width)}*${ssrInterpolate(row.spec.height)}${ssrInterpolate((row.spec.unit || "cm") + "\xB3")}</div><div data-v-c8a12274${_scopeId2}>\u989C\u8272\uFF1A${ssrInterpolate(row.spec.color)}</div></div>`);
                } else {
                  return [
                    createVNode("div", null, [
                      createVNode("div", null, " \u957F*\u5BBD*\u9AD8\uFF1A" + toDisplayString(row.spec.length) + "*" + toDisplayString(row.spec.width) + "*" + toDisplayString(row.spec.height) + toDisplayString((row.spec.unit || "cm") + "\xB3"), 1),
                      createVNode("div", null, "\u989C\u8272\uFF1A" + toDisplayString(row.spec.color), 1)
                    ])
                  ];
                }
              }),
              image: withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img style="${ssrRenderStyle({ "width": "48px", "height": "48px", "object-fit": "cover", "border-radius": "4px", "border": "1px solid #eee", "cursor": "pointer" })}"${ssrRenderAttr("src", row.image)} data-v-c8a12274${_scopeId2}>`);
                } else {
                  return [
                    createVNode("img", {
                      style: { "width": "48px", "height": "48px", "object-fit": "cover", "border-radius": "4px", "border": "1px solid #eee", "cursor": "pointer" },
                      src: row.image,
                      onClick: ($event) => openImagePreview(row.image)
                    }, null, 8, ["src", "onClick"])
                  ];
                }
              }),
              factories: withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(row.factories, (factory) => {
                    _push3(ssrRenderComponent(_component_el_tag, {
                      key: factory.id,
                      class: "factory-tag",
                      onClick: ($event) => _ctx.$emit("factory-click", factory),
                      style: { "cursor": "pointer", "margin-right": "4px" }
                    }, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(factory.name)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(factory.name), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(row.factories, (factory) => {
                      return openBlock(), createBlock(_component_el_tag, {
                        key: factory.id,
                        class: "factory-tag",
                        onClick: ($event) => _ctx.$emit("factory-click", factory),
                        style: { "cursor": "pointer", "margin-right": "4px" }
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(factory.name), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick"]);
                    }), 128))
                  ];
                }
              }),
              status: withCtx(({ row }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_tag, {
                    type: row.status === "on" ? "success" : "info"
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.status === "on" ? "\u4E0A\u67B6" : "\u4E0B\u67B6")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.status === "on" ? "\u4E0A\u67B6" : "\u4E0B\u67B6"), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_el_tag, {
                      type: row.status === "on" ? "success" : "info"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.status === "on" ? "\u4E0A\u67B6" : "\u4E0B\u67B6"), 1)
                      ]),
                      _: 2
                    }, 1032, ["type"])
                  ];
                }
              }),
              actions: withCtx(({ row, $index }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_el_button, {
                    size: "small",
                    onClick: ($event) => handleView(row)
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`\u67E5\u770B`);
                      } else {
                        return [
                          createTextVNode("\u67E5\u770B")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_el_button, {
                    type: "primary",
                    size: "small",
                    onClick: ($event) => openEditDialog(row)
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
                    type: row.status === "on" ? "warning" : "success",
                    size: "small",
                    onClick: ($event) => handleToggleStatus(row, row.status === "on" ? "off" : "on")
                  }, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(row.status === "on" ? "\u4E0B\u67B6" : "\u4E0A\u67B6")}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(row.status === "on" ? "\u4E0B\u67B6" : "\u4E0A\u67B6"), 1)
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
                      size: "small",
                      onClick: ($event) => handleView(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u67E5\u770B")
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_el_button, {
                      type: "primary",
                      size: "small",
                      onClick: ($event) => openEditDialog(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u7F16\u8F91")
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_el_button, {
                      type: row.status === "on" ? "warning" : "success",
                      size: "small",
                      onClick: ($event) => handleToggleStatus(row, row.status === "on" ? "off" : "on")
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.status === "on" ? "\u4E0B\u67B6" : "\u4E0A\u67B6"), 1)
                      ]),
                      _: 2
                    }, 1032, ["type", "onClick"]),
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
              title: isEdit.value ? "\u7F16\u8F91\u5546\u54C1" : "\u6DFB\u52A0\u5546\u54C1",
              fields: addFields,
              formData: dialogForm.value,
              onSubmit: handleDialogSubmit
            }, {
              image: withCtx(({ form }, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_sfc_main$2, {
                    modelValue: form.image,
                    "onUpdate:modelValue": ($event) => form.image = $event,
                    onFileChange: (file) => form.imageFile = file
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_sfc_main$2, {
                      modelValue: form.image,
                      "onUpdate:modelValue": ($event) => form.image = $event,
                      onFileChange: (file) => form.imageFile = file
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onFileChange"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_sfc_main$1, {
              "url-list": imagePreviewList.value,
              "initial-index": imagePreviewIndex.value,
              visible: imagePreviewVisible.value,
              onClose: ($event) => imagePreviewVisible.value = false
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("div", { style: { "display": "flex", "align-items": "center", "justify-content": "space-between", "margin-bottom": "16px" } }, [
                  createVNode("h1", null, "\u5546\u54C1\u7BA1\u7406"),
                  createVNode(_component_el_button, {
                    type: "primary",
                    onClick: openAddDialog
                  }, {
                    default: withCtx(() => [
                      createTextVNode("\u6DFB\u52A0\u5546\u54C1")
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
                  goods: goodsList.value,
                  columns,
                  onView: handleView,
                  onEdit: handleEdit,
                  onDelete: handleDelete,
                  onFactoryClick: handleFactoryClick
                }, {
                  spec: withCtx(({ row }) => [
                    createVNode("div", null, [
                      createVNode("div", null, " \u957F*\u5BBD*\u9AD8\uFF1A" + toDisplayString(row.spec.length) + "*" + toDisplayString(row.spec.width) + "*" + toDisplayString(row.spec.height) + toDisplayString((row.spec.unit || "cm") + "\xB3"), 1),
                      createVNode("div", null, "\u989C\u8272\uFF1A" + toDisplayString(row.spec.color), 1)
                    ])
                  ]),
                  image: withCtx(({ row }) => [
                    createVNode("img", {
                      style: { "width": "48px", "height": "48px", "object-fit": "cover", "border-radius": "4px", "border": "1px solid #eee", "cursor": "pointer" },
                      src: row.image,
                      onClick: ($event) => openImagePreview(row.image)
                    }, null, 8, ["src", "onClick"])
                  ]),
                  factories: withCtx(({ row }) => [
                    (openBlock(true), createBlock(Fragment, null, renderList(row.factories, (factory) => {
                      return openBlock(), createBlock(_component_el_tag, {
                        key: factory.id,
                        class: "factory-tag",
                        onClick: ($event) => _ctx.$emit("factory-click", factory),
                        style: { "cursor": "pointer", "margin-right": "4px" }
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(factory.name), 1)
                        ]),
                        _: 2
                      }, 1032, ["onClick"]);
                    }), 128))
                  ]),
                  status: withCtx(({ row }) => [
                    createVNode(_component_el_tag, {
                      type: row.status === "on" ? "success" : "info"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.status === "on" ? "\u4E0A\u67B6" : "\u4E0B\u67B6"), 1)
                      ]),
                      _: 2
                    }, 1032, ["type"])
                  ]),
                  actions: withCtx(({ row, $index }) => [
                    createVNode(_component_el_button, {
                      size: "small",
                      onClick: ($event) => handleView(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u67E5\u770B")
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_el_button, {
                      type: "primary",
                      size: "small",
                      onClick: ($event) => openEditDialog(row)
                    }, {
                      default: withCtx(() => [
                        createTextVNode("\u7F16\u8F91")
                      ]),
                      _: 2
                    }, 1032, ["onClick"]),
                    createVNode(_component_el_button, {
                      type: row.status === "on" ? "warning" : "success",
                      size: "small",
                      onClick: ($event) => handleToggleStatus(row, row.status === "on" ? "off" : "on")
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(row.status === "on" ? "\u4E0B\u67B6" : "\u4E0A\u67B6"), 1)
                      ]),
                      _: 2
                    }, 1032, ["type", "onClick"]),
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
                  title: isEdit.value ? "\u7F16\u8F91\u5546\u54C1" : "\u6DFB\u52A0\u5546\u54C1",
                  fields: addFields,
                  formData: dialogForm.value,
                  onSubmit: handleDialogSubmit
                }, {
                  image: withCtx(({ form }) => [
                    createVNode(_sfc_main$2, {
                      modelValue: form.image,
                      "onUpdate:modelValue": ($event) => form.image = $event,
                      onFileChange: (file) => form.imageFile = file
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "onFileChange"])
                  ]),
                  _: 1
                }, 8, ["modelValue", "onUpdate:modelValue", "title", "formData"]),
                createVNode(_sfc_main$1, {
                  "url-list": imagePreviewList.value,
                  "initial-index": imagePreviewIndex.value,
                  visible: imagePreviewVisible.value,
                  onClose: ($event) => imagePreviewVisible.value = false
                }, null, 8, ["url-list", "initial-index", "visible", "onClose"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/goods/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c8a12274"]]);

export { index as default };
//# sourceMappingURL=index-vuwAWYbC.mjs.map
