<template>
  <div
    class="el-tray-header__aside-item"
  >
    <el-button
      type="icon"
      @click="handleClick"
    >
      <el-icon
        ref="icon"
        :name="icon"
        :state="state"
        variant="16"
      />
    </el-button>
  </div>
</template>

<script>
  import Emitter from '@/mixins/emitter';
  import ElIcon from 'packages/icon';

  export default {
    name: 'TrayHeaderItem',

    components: {
      ElIcon
    },

    mixins: [Emitter],

    props: {
      command: {},
      icon: {
        type: String,
        required: true
      },
      state: {
        type: [String, Boolean],
        default: false
      }
    },

    methods: {
      handleClick() {
        this.dispatch('TrayHeaderItem', 'tray-header-item-click', [this.command, this]);
        this.$emit('click', this);
      }
    }
  };
</script>
