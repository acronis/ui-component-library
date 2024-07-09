<script>
  import AcvCascader from '@/components/cascader/cascader.vue';

  let id = 0;
  export default {
    components: {
      AcvCascader
    },
    data: () => ({
      loadOptions: (node, resolve) => {
        const { level } = node;
        setTimeout(() => {
          const nodes = Array.from({ length: level + 1 })
            .map(_item => ({
              value: ++id,
              label: `Option - ${id}`,
              leaf: level >= 2
            }));
          resolve(nodes);
        }, 1000);
      },
      valueSix: '',
    }),
    methods: {
      handleChange(value) {
        console.log('Change event fired');
        console.log(value);
      },
      handleSelect(value, label, path) {
        console.log('Select event fired');
        console.log(`${value},${label},${path}`);
      }
    }
  };
</script>

<template>
  <AcvCascader
    v-model="valueSix"
    :load-options="loadOptions"
    @change="handleChange"
    @select="handleSelect"
  />
</template>
