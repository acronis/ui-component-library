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
        :data-testid="testID"
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
              {{ label }}
            </template>
          </slot>
        </template>
      </el-button>
    </span>
  </el-tooltip>
  <el-dropdown-item
    v-else-if="type === 'dropdown' && isVisible"
    class="el-table__action-item"
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
        />{{ title }}
      </template>
    </slot>
  </el-dropdown-item>
</template>

<script>
import { every } from 'lodash-es';

  export default {
    name: 'ElTableActionItem',
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
      label: String,
      component: Object,
      buttonType: {
        type: String,
        default: 'ghost'
      },
      testID: {
        type: String,
        default: undefined
      }
    },
    data() {
      return { loading: false };
    },
    computed: {
      isVisible() {
        if (typeof this.action.display === 'undefined') {
          return true;
        }

        return this.getPropertyValue(this.action.display, this.item);
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
          ? this.disabledValue
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
