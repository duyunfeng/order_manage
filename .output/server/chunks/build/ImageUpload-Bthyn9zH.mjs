import { defineComponent, ref, watch, resolveComponent, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ImageUpload",
  __ssrInlineRender: true,
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue", "file-change"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const imageUrl = ref(props.modelValue || "");
    const fileRaw = ref(null);
    watch(
      () => props.modelValue,
      (val) => {
        imageUrl.value = val;
      }
    );
    function handleBeforeUpload(file) {
      return false;
    }
    function handleChange(file) {
      fileRaw.value = file.raw;
      const reader = new FileReader();
      reader.onload = (e) => {
        var _a;
        imageUrl.value = (_a = e.target) == null ? void 0 : _a.result;
        emit("update:modelValue", imageUrl.value);
        emit("file-change", fileRaw.value);
      };
      reader.readAsDataURL(file.raw);
    }
    function clearImage() {
      imageUrl.value = "";
      fileRaw.value = null;
      emit("update:modelValue", "");
      emit("file-change", null);
    }
    __expose({ fileRaw });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_upload = resolveComponent("el-upload");
      const _component_el_button = resolveComponent("el-button");
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_el_upload, {
        "auto-upload": false,
        "show-file-list": false,
        "before-upload": handleBeforeUpload,
        "on-change": handleChange,
        accept: "image/*"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_el_button, { type: "primary" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`\u9009\u62E9\u56FE\u7247`);
                } else {
                  return [
                    createTextVNode("\u9009\u62E9\u56FE\u7247")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_el_button, { type: "primary" }, {
                default: withCtx(() => [
                  createTextVNode("\u9009\u62E9\u56FE\u7247")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (imageUrl.value) {
        _push(`<span style="${ssrRenderStyle({ "margin-left": "12px", "color": "#67c23a" })}">\u5DF2\u9009\u62E9</span>`);
      } else {
        _push(`<!---->`);
      }
      if (imageUrl.value) {
        _push(`<img${ssrRenderAttr("src", imageUrl.value)} style="${ssrRenderStyle({ "max-width": "60px", "max-height": "60px", "margin-left": "12px", "vertical-align": "middle" })}">`);
      } else {
        _push(`<!---->`);
      }
      if (imageUrl.value) {
        _push(ssrRenderComponent(_component_el_button, {
          type: "danger",
          size: "small",
          onClick: clearImage,
          style: { "margin-left": "8px" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u79FB\u9664`);
            } else {
              return [
                createTextVNode("\u79FB\u9664")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ImageUpload.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=ImageUpload-Bthyn9zH.mjs.map
