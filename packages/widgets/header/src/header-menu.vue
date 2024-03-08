<template>
  <div
    class="el-header__aside-item"
    :title="tooltipText"
  >
    <el-dropdown
      class="el-header__menu"
      placement="bottom-end"
      @command="handleCommand($event)"
      @visible-change="handleChange"
    >
      <el-button
        ref="icon"
        type="ghost"
        :icon="icon"
        :class="{ 'is-active-button': isVisible }"
      />
      <template #dropdown>
        <el-dropdown-menu
          v-if="isDropdownEnabled"
          ref="dropdownMenu"
          class="el-header__menu-dropdown"
          :style="width && { width }"
          :hide-on-scroll="hideOnScroll"
          :hide-on-resize="hideOnResize"
        >
          <el-dropdown-item
            v-if="title && !$slots.title"
            disabled
          >
            <span
              class="el-text--color-fixed-primary el-text--ellipsis"
            >
              {{ title }}
            </span>
          </el-dropdown-item>
          <div
            v-if="$slots.title"
            disabled
          >
            <slot name="title" />
          </div>
          <el-dropdown-item
            v-for="(item, index) in items"
            :key="index"
            :command="index"
            :disabled="item.disabled"
            :visible="item.visible"
            :divided="(title && index === 0) || item.divided"
            :class="{
              'px-24 py-16': isLarge,
              [`${item.class}`]: item.class
            }"
          >
            <el-icon
              v-if="item.icon"
              v-bind="{
                left: !item.right,
                right: item.right,
                iconUrl: item.iconUrl
              }"
              :name="item.icon"
              :variant="isLarge ? '24' : '16'"
            />
            {{ item.title }}
            <el-tag
              v-if="item.tag"
              :type="item.tagType"
              :class="{'mx-8' : !!item.title}"
            >
              {{ item.tag }}
            </el-tag>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
  import ElDropdown from 'packages/dropdown';
  import ElIcon from 'packages/icon';
  import { isFunction } from '@/utils/util';
  import isAbsoluteUrl from '@/utils/is-absolute-url';
  import ElTag from 'packages/tag';
  import HidePopper from '@/mixins/hidePopper';

  export default {
    name: 'ElHeaderMenu',

    components: {
      ElDropdown,
      ElIcon,
      ElTag
    },

    mixins: [HidePopper],

    componentName: 'ElHeaderMenu',

    props: {
      items: {
        type: Array,
        default: () => []
      },
      icon: {
        type: String,
        required: true
      },
      title: {
        type: String
      },
      width: {
        type: String
      },
      isLarge: {
        type: Boolean,
        default: false
      },
      tooltipText: {
        type: String,
        default: ''
      }
    },

    data() {
      return {
        isVisible: false
      };
    },

    computed: {
      isDropdownEnabled() {
        return this.title || (this.items && this.items.length);
      }
    },

    mounted() {
      if (this.isDropdownEnabled) {
        this.$refs.dropdownMenu.referenceElm = this.$refs.icon.$el;
      }
    },

    methods: {
      handleCommand(command) {
        if (!this.isDropdownEnabled) return;
        const item = this.items[command];
        if (!item) return;

        try {
          if (isFunction(item.action)) {
            item.action();
          } else if (typeof item.action === 'string') {
            if (item.route) {
              this.$router.push(item.action);
            } else {
              window.open(item.action, isAbsoluteUrl(item.action) ? '_blank' : '_self');
            }
          }
        } catch (e) {
          console.error(e);
        }
      },
      handleChange(value) {
        this.isVisible = value;
      }
    }
  };
</script>
