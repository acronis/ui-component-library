<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
  import AcvDropdownItem from '@/components/dropdown/dropdownItem.vue';
  import AcvDropdownMenu from '@/components/dropdown/dropdownMenu.vue';
</script>

<template>
  <div class="pa-24 ma-24">
    <div
      style="
        height: 300px;
        background-color: hsl(0deg 0% 13%);
        color: var(--acv-color-white);
        width: 500px;
        overflow-y: scroll;
      "
    >
      <div
        style="
          height: 200px;
          background-color: hsl(0deg 0% 87%);
          color: hsl(0deg 0% 0%);
          width: 300px;
          overflow-y: scroll;
        "
      >
        <AcvDropdown>
          <AcvButton>Button</AcvButton>
          <template #dropdown>
            <AcvDropdownMenu>
              <AcvDropdownItem>Action 1</AcvDropdownItem>
              <AcvDropdownItem>Action 2</AcvDropdownItem>
              <AcvDropdownItem>Action 3</AcvDropdownItem>
              <AcvDropdownItem>Action 4</AcvDropdownItem>
              <AcvDropdownItem>Action 5</AcvDropdownItem>
              <AcvDropdownItem>Action 6</AcvDropdownItem>
              <AcvDropdownItem>Action 7</AcvDropdownItem>
              <AcvDropdownItem>Action 8</AcvDropdownItem>
              <AcvDropdownItem>Action 9</AcvDropdownItem>
              <AcvDropdownItem>Action 10</AcvDropdownItem>
            </AcvDropdownMenu>
          </template>
        </AcvDropdown>
        <div>Random text</div>
        <div>Random text</div>
        <div>Random text</div>
        <div>Random text</div>
        <div>Random text</div>
        <div>Random text</div>
        <div>Random text</div>
        <div>Random text</div>
        <div>Random text</div>
        <div>Random text</div>
        <div>Random text</div>
      </div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
      <div>Random text</div>
    </div>
  </div>
</template>
