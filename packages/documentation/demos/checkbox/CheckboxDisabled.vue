<script>
  import {
    Checkbox
  } from '@acronis-platform/ui-component-library';

  export default {
    components: {
      Checkbox
    },
    data: () => ({
      counter: 1,
      indeterminate: true,
      value1: false,
      value2: true,
      value3: false,
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
  <PreviewGroup class="qa-checkbox-disabled">
    <Preview
      span="6"
      name="Default"
    >
      <Checkbox disabled>
        Label
      </Checkbox>
    </Preview>
    <Preview
      span="6"
      name="Checked"
    >
      <Checkbox
        checked
        disabled
      >
        Label
      </Checkbox>
    </Preview>
    <Preview
      span="6"
      name="Indeterminate"
    >
      <Checkbox
        v-model="value3"
        :indeterminate="indeterminate"
        disabled
      >
        Label
      </Checkbox>
    </Preview>
    <Preview
      span="6"
      name="Long label"
    >
      <Checkbox
        :checked="value4"
        disabled
        show-hover-hint
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
      </Checkbox>
    </Preview>
    <Preview
      span="24"
      name="Description"
    >
      <Checkbox
        :checked="value5"
        disabled
      >
        Label
        <template #description>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
        </template>
      </Checkbox>
    </Preview>
  </PreviewGroup>
</template>
