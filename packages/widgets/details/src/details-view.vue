<template>
  <div class="el-details-view">
    <div class="el-details-view__wrapper">
      <div class="el-details-view__header">
        <el-header>
          <slot name="header">
            <span
              class="el-details-view__title"
              :title="title"
              v-text="title"
            />
          </slot>
          <template #aside>
            <el-button
              class="el-details-view__close"
              type="ghost"
              @click="closeDetailsView"
            >
              <el-icon name="i-times--24" />
            </el-button>
          </template>
        </el-header>
      </div>
      <div
        v-if="$slots['toolbar']"
        class="el-details-view__actions"
      >
        <slot name="toolbar" />
      </div>
      <div
        v-if="$slots['content-header']"
        class="el-details-view__content-header"
      >
        <slot name="content-header" />
      </div>
      <el-scrollbar
        ref="content"
        class="el-details-view__scrollable-content"
      >
        <div class="el-details-view__content">
          <slot name="content" />
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import ElIcon from 'packages/icon';
  import ElButton from 'packages/button';
  import ElScrollbar from 'packages/scrollbar';
  import ElHeader from 'packages/widgets/header';

  export default {
    name: 'ElDetailsView',

    inject: ['details'],

    components: {
      ElIcon,
      ElButton,
      ElScrollbar,
      ElHeader
    },

    props: {
      title: {
        type: String,
        default: ''
      }
    },

    methods: {
      closeDetailsView() {
        if (this.details) {
          this.details.close();
        }
        this.$emit('close');
      }
    }
  };
</script>
