import { xssSafeHighlighter } from '@/utils/highlighter';

const highlight = function (el, text, value) {
  const arr = xssSafeHighlighter.highlightAsXssSafeArr(text, value);
  arr.forEach((element) => {
    if (element.className) {
      const newSpan = document.createElement('span');
      newSpan.classList.add(element.className);
      newSpan.appendChild(document.createTextNode(element.value));

      el.appendChild(newSpan);
    } else {
      el.appendChild(document.createTextNode(element.value));
    }
  });
};

const removeChildren = function (el) {
  let child = el.lastChild;
  while (child) {
    el.removeChild(child);
    child = el.lastChild;
  }
};

const createDirective = function () {
  return {
    inserted(el, binding, vnode) {
      removeChildren(el);
      highlight(el, vnode.children[0].text.trim(), binding.value);
    },

    update(el, binding, vnode) {
      removeChildren(el);
      highlight(el, vnode.children[0].text.trim(), binding.value);
    }
  };
};

export default createDirective();
