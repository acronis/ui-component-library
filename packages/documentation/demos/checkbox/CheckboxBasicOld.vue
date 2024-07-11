<script>
  import AcvCheckbox from '@/components/checkbox/checkbox.vue';

  export default {
    components: {
      AcvCheckbox
    },
    data: () => ({
      counter: 1,
      indeterminate: true,
      value1: false,
      value2: true,
      value3: null,
      value4: false,
      value5: false
    }),
    methods: {
      handleChange() {
        switch (this.counter % 3) {
          case 0:
            this.indeterminate = true;
            break;
          case 1:
            this.indeterminate = false;
            this.value3 = false;
            break;
          case 2:
          default:
            this.indeterminate = false;
            this.value3 = true;
            break;
        }
        this.counter++;
      }
    }
  };
</script>

<template>
  <div>
    <AcvCheckbox v-model="value1">
      Default
    </AcvCheckbox>
  </div>
  <div>
    <AcvCheckbox v-model="value2">
      Checked
    </AcvCheckbox>
  </div>
  <div>
    <AcvCheckbox
      v-model="value3"
      v-model:indeterminate="indeterminate"
      @change="handleChange"
    >
      Indeterminate
    </AcvCheckbox>
  </div>
  <div>
    <AcvCheckbox
      v-model="value4"
      show-hover-hint
    >
      Long label. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
    </AcvCheckbox>
  </div>
  <div>
    <AcvCheckbox
      v-model="value4"
      show-hover-hint
      multiline-label
    >
      Long multi line label. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
    </AcvCheckbox>
  </div>
  <div>
    <AcvCheckbox
      v-model="value4"
      show-hover-hint
      multiline-label
      :multiline-label-limit="3"
    >
      Long multi line label with limit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
    </AcvCheckbox>
  </div>
  <div>
    <AcvCheckbox v-model="value5">
      With Description
      <template #description>
        Description. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
      </template>
    </AcvCheckbox>
  </div>
</template>
