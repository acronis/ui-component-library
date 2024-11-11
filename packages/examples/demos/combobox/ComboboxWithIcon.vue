<script setup>
  import Combobox from '@/components/combobox/combobox.vue';
  import Option from '@/components/combobox/option.vue';
  import { ref } from 'vue';

  const options = ['Acronis', 'Parallels', 'Virtuozzo', 'Google', 'Apple', 'Microsoft'];
  const passwordOptions = {
    Acronis: 'qwe123',
    Parallels: 'admin',
    Virtuozzo: 'qwerty',
    Google: '1234567890',
    Apple: '1q2w3e',
    Microsoft: '11111111'
  };
  const value = ref('Acronis');
  const valuePassword = ref('1q2w3e');
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Default"
      span="8"
    >
      <Combobox
        v-model="value"
        label="The best company"
      >
        <Option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        />
      </Combobox>
    </Preview>

    <Preview
      name="with icon"
      span="8"
    >
      <Combobox
        v-model="value"
        label="The best company"
        icon="times"
      >
        <Option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        />
      </Combobox>
    </Preview>

    <Preview
      name="password with icon"
      span="8"
    >
      <Combobox
        v-model="valuePassword"
        type="password"
        show-password-icon
        label="The best company"
        icon="times"
      >
        <Option
          v-for="(passwordOption, key) in passwordOptions"
          :key="passwordOption"
          :label="passwordOption"
          :value="passwordOption"
        >
          {{ key }}
        </Option>
      </Combobox>
    </Preview>

    <Preview
      name="small"
      span="8"
    >
      <Combobox
        v-model="value"
        label="The best company"
        size="small"
      >
        <Option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        />
      </Combobox>
    </Preview>

    <Preview
      name="small with icon"
      span="8"
    >
      <Combobox
        v-model="value"
        label="The best company"
        size="small"
        icon="i-times--16"
      >
        <Option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        />
      </Combobox>
    </Preview>

    <Preview
      name="password with icon and small"
      span="8"
    >
      <Combobox
        v-model="valuePassword"
        type="password"
        show-password-icon
        label="The best company"
        size="small"
        icon="times"
      >
        <Option
          v-for="(passwordOption, key) in passwordOptions"
          :key="passwordOption"
          :label="passwordOption"
          :value="passwordOption"
        >
          {{ key }}
        </Option>
      </Combobox>
    </Preview>
  </PreviewGroup>
</template>
