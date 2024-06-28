<script lang="ts">
  import { defineComponent, vShow, withDirectives } from 'vue';

  /* this component use v-show if keepAlive=true, v-if otherwise */
  export default defineComponent({
    props: {
      keepAlive: Boolean,
      visible: Boolean,
    },
    setup(props, { slots }) {
      return () => {
        const slot = slots.default!()[0];

        if (props.keepAlive) {
          return withDirectives(slot, [[vShow, props.visible]]);
        }

        return props.visible ? slot : null;
      };
    },
  });
</script>
