export default function (ref) {
  return {
    methods: {
      focus() {
        this.$refs[ref].focus();
      },
      blur() {
        this.$refs[ref].blur();
      }
    }
  };
}
