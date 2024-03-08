const isNativeSupport = typeof window !== 'undefined' && window.CSS && CSS.supports('(--a: 0)');

function switchColors(colors) {
  if (isNativeSupport) {
    Object.keys(colors).forEach(function(k) {
      document.documentElement.style.setProperty(k, colors[k]);
    });
    return Promise.resolve();
  }

  return import(/* webpackChunkName: "css-var-ployfill" */'css-vars-ponyfill')
    .then(({ default: cssVar }) => cssVar({ variables: colors }));
}

export default switchColors;
