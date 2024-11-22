<script>
  import { h } from 'vue';

  const createElement = h;

  export default {
    props: {
      label: {
        type: [Array, String]
      },
      icon: {
        type: [Array, String],
      },
    },
    render() {
      return createElement(
        'div',
        {
          class: 'custom-tab-label',
        },
        [
          this.icon,
          this.label
        ]
      );
    },
  };
</script>

<style scoped>
  .custom-tab-label {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
