import { createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  class: "acv-icon"
}
const _hoisted_2 = /*#__PURE__*/_createElementVNode("g", {
  fill: "#2668C5",
  "clip-path": "url(#a)"
}, [
  /*#__PURE__*/_createElementVNode("path", { d: "m13 2.5-7.5 17H0l6-11 7-6ZM14 4l-3 8.5 6 7-11.5 2H24L14 4Z" })
], -1 /* HOISTED */)
const _hoisted_3 = /*#__PURE__*/_createElementVNode("defs", null, [
  /*#__PURE__*/_createElementVNode("clipPath", { id: "a" }, [
    /*#__PURE__*/_createElementVNode("path", {
      fill: "#fff",
      d: "M0 0h24v24H0z"
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