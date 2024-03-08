export default function switchColors(colors) {
    Object.keys(colors).forEach(function (k) {
      document.documentElement.style.setProperty(k, colors[k]);
    });
    return Promise.resolve();
  }
