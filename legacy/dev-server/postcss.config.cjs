module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-mixins': {},
    'postcss-custom-media': {},
    'postcss-preset-env': {
      features: {
        'dir-pseudo-class': false, // do not process text-align: end
        'focus-visible-pseudo-class': false, // these features turned off because js plugin is
        'focus-within-pseudo-class': false, //  needed for their work
      },
    }
  },
};
