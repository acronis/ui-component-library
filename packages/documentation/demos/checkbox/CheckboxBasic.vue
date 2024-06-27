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
  <PreviewGroup class="qa-checkbox-basic">
    <Preview
      span="6"
      name="Default"
    >
      <Checkbox v-model="value1">
        Label
      </Checkbox>
    </Preview>
    <Preview
      span="6"
      name="Checked"
    >
      <Checkbox v-model="value2">
        Label
      </Checkbox>
    </Preview>
    <Preview
      span="6"
      name="Indeterminate"
    >
      <Checkbox
        v-model="value3"
        v-model:indeterminate="indeterminate"
        @change="handleChange"
      >
        Label
      </Checkbox>
    </Preview>
    <Preview
      span="6"
      name="Long label"
    >
      <Checkbox
        v-model="value4"
        show-hover-hint
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
      </Checkbox>
    </Preview>
    <Preview
      span="12"
      name="Long multi line label"
    >
      <Checkbox
        v-model="value4"
        show-hover-hint
        multiline-label
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
      </Checkbox>
    </Preview>
    <Preview
      span="12"
      name="Long multi line label with limit"
    >
      <Checkbox
        v-model="value4"
        show-hover-hint
        multiline-label
        :multiline-label-limit="3"
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
      </Checkbox>
    </Preview>
    <Preview
      span="24"
      name="Description"
    >
      <Checkbox v-model="value5">
        Label
        <template #description>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque commodi deleniti dignissimos dolores earum eius expedita fugit ipsum natus, neque nesciunt odio officiis porro, quaerat quia quo repudiandae soluta voluptatibus.
        </template>
      </Checkbox>
    </Preview>
  </PreviewGroup>
</template>
