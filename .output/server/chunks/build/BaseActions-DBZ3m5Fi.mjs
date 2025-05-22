import { defineComponent, computed, resolveComponent, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BaseActions",
  __ssrInlineRender: true,
  props: {
    row: {},
    index: {},
    actions: {}
  },
  setup(__props) {
    const props = __props;
    const visibleBtns = computed(() => props.actions);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_el_button = resolveComponent("el-button");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "base-actions" }, _attrs))} data-v-1111494a><!--[-->`);
      ssrRenderList(visibleBtns.value, (btn, idx) => {
        _push(ssrRenderComponent(_component_el_button, {
          link: "",
          size: "small",
          disabled: btn.disabled,
          class: ["action-link", btn.type],
          onClick: () => btn.onClick(_ctx.row, _ctx.index)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(btn.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(btn.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BaseActions.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const BaseActions = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1111494a"]]);

export { BaseActions as B };
//# sourceMappingURL=BaseActions-DBZ3m5Fi.mjs.map
