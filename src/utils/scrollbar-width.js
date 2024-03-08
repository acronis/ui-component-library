let scrollBarWidth;
let windowInnerHeight;
let windowInnerWidth;

export default function () {
  // recalculate scrollbar width when window size changed, because scrollbar size changes when zooming.
  if (scrollBarWidth !== undefined
    && window.innerHeight === windowInnerHeight
    && window.innerWidth === windowInnerWidth) return scrollBarWidth;
  windowInnerHeight = window.innerHeight;
  windowInnerWidth = window.innerWidth;
  scrollBarWidth = (windowInnerWidth && document.documentElement.clientWidth)
    ? windowInnerWidth - document.documentElement.clientWidth
    : 0;

  return scrollBarWidth;
}
