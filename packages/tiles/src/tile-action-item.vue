<template>
  <el-tooltip
    v-if="(type === 'button' || type === 'iconbutton') && isVisible"
    :disabled="!disabledWithReason"
    :content="disabledWithReason"
  >
    <span>
      <!-- ElButton should be wrapped with an element to be able to display tooltip in disabled state -->
      <el-button
        class="action-item-button"
        :type="buttonType"
        :icon="action.icon"
        :loading="loading"
        :disabled="isDisabled"
        @click="triggerAction(item, $event)"
      >
        <template v-if="type === 'button'">
          <slot>
            <component
              :is="action.component"
              v-if="action.component"
              :item="item"
              :disabled="isDisabled"
            />
            <template v-else>
              {{ translate(label, i18n) }}
            </template>
          </slot>
        </template>
      </el-button>
    </span>
  </el-tooltip>
  <el-dropdown-item
    v-else-if="type === 'dropdown' && isVisible"
    class="el-tile__action-item"
    :style="itemStyles"
    :divided="isDivided"
    :command="{ item, action: wrappedActionByLoading(), command: action.command }"
    :disabled="isDisabled"
  >
    <slot>
      <component
        :is="action.component"
        v-if="action.component"
        :item="item"
        :disabled="isDisabled"
      />
      <template v-else>
        <el-icon
          v-if="action.icon"
          class="mr-8"
          :name="action.icon"
          size="16"
        />{{ translate(title, i18n) }}
      </template>
    </slot>
  </el-dropdown-item>
</template>

<script>
import { every } from 'lodash-es';
import { translate } from './translate';
  
export default {
  name: 'ElTileActionItem',
  props: {
    item: {
      type: [Object, Array],
      default: () => {}
    },
    action: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'dropdown',
      validator: (value) => ['button', 'iconbutton', 'dropdown'].indexOf(value) !== -1
    },
    divided: Boolean,
    label: {
      type: String,
      default: ''
    },
    component: {
      type: Object,
      default: null
    },
    buttonType: {
      type: String,
      default: 'ghost'
    },
    i18n: { type: Object, default: null }
  },
  data() {
    return {
      translate,
      loading: false
    };
  },
  computed: {
    isVisible() {
      if (typeof this.action.display === 'undefined') {
        return true;
      }

      return this.getPropertyValue(this.action.display, this.item);
    },
    itemStyles() {
      const styles = {};
      if (this.action.color) {
        styles.color = `var(--${this.action.color})`;
      }
      return styles;
    },
    isGroupAction() {
      return this.item instanceof Array;
    },
    isDivided() {
      return this.divided || this.getPropertyValue(this.action.divided, this.item);
    },
    disabledValue() {
      return this.getPropertyValue(this.action.disabled, this.item);
    },
    disabledWithReason() {
      return typeof this.disabledValue === 'string'
        ? translate(this.disabledValue, this.i18n)
        : undefined;
    },
    isDisabled() {
      return !!this.disabledValue || this.loading;
    },
    title() {
      return this.getPropertyValue(this.action.label, this.item) || this.label;
    }
  },
  methods: {
    getPropertyValue(value, target) {
      if (typeof value === 'function') {
        if (this.isGroupAction) {
          return every(target.map((it) => value.call(this, it), true));
        }

        return value.call(this, target);
      }

      return value;
    },
    wrappedActionByLoading() {
      if (typeof this.action.action === 'function') {
        return (...args) => Promise.resolve()
          .then(() => {
            this.loading = true;
          })
          .then(() => this.action.action.call(null, ...args))
          .then((res) => {
            this.loading = false;
            return res;
          })
          .catch((err) => {
            this.loading = false;

            throw err;
          });
      }

      return false;
    },
    triggerAction(item, $event) {
      return typeof this.action.action === 'function' && this.wrappedActionByLoading(this.action.action)(item, $event);
    }
  }
};
</script>
