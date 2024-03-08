export default function createColorMixin(exclusions = ['nav-primary', 'brand-light', 'brand-lighter', 'brand-accent', 'brand-lightest', 'fixed-white']) {
  return {
    props: {
      color: String
    },

    methods: {
      isColorModifier(color) {
        return exclusions.indexOf(color) > -1;
      }
    }
  };
}
