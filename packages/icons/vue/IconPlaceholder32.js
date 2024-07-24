import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 32 32",
  class: "acv-icon"
}
const _hoisted_2 = /*#__PURE__*/_createElementVNode("g", { "clip-path": "url(#a)" }, [
  /*#__PURE__*/_createElementVNode("rect", {
    width: "32",
    height: "32",
    fill: "#2668C5",
    rx: "2"
  })
], -1 /* HOISTED */)
const _hoisted_3 = /*#__PURE__*/_createElementVNode("defs", null, [
  /*#__PURE__*/_createElementVNode("clipPath", { id: "a" }, [
    /*#__PURE__*/_createElementVNode("path", {
      fill: "#fff",
      d: "M0 0h32v32H0z"
    })
  ])
], -1 /* HOISTED */)
const _hoisted_4 = [
  _hoisted_2,
  _hoisted_3
]

export function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("svg", _hoisted_1, [..._hoisted_4]))
}