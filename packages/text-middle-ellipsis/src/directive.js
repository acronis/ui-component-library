const windowPathValidation = (path) => RegExp('^[a-zA-Z]:\\\\[\\\\\\S|*\\S]?.*$').test(path);
const linuxPathValidation = (path) => RegExp('^/|(/[a-zA-Z0-9_-]+)+$').test(path);

const textMiddleEllipsis = (el, binding, path) => {
  if (!windowPathValidation(path) && !linuxPathValidation(path)) {
    console.warn(`Invalid path for v-text-middle-ellipsis: "${path}"`);
    return;
  }
  el.innerHTML = '';
  const splitIndex = Math.round(path.length * 0.75);
  el.className = 'el-text-middle-ellipsis';
  const leftSpan = document.createElement('span');
  const rightSpan = document.createElement('span');
  leftSpan.className = 'left';
  rightSpan.className = 'right';
  leftSpan.innerText = path.slice(0, splitIndex);
  rightSpan.innerText = path.slice(splitIndex);

  if (binding.arg === 'show-hover-hint') {
    el.setAttribute('title', path);
  }
  el.appendChild(leftSpan);
  el.appendChild(rightSpan);
};

const createDirective = () => {
  return {
    componentUpdated(el, binding, vnode) {
      textMiddleEllipsis(el, binding, vnode.children[0].text.trim());
    },
    bind(el, binding) {
      textMiddleEllipsis(el, binding, el.textContent.trim());
    }
  };
};


export default createDirective();
