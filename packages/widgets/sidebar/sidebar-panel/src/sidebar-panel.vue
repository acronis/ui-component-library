<template>
  <div class="el-sidebar-panel">
    <el-icon
      v-if="showClose"
      class="el-sidebar-panel__close"
      color="brand-primary"
      name="i-times--16"
      @click="closeSidebarView"
    />
    <el-scrollbar
      ref="scroll"
      class="el-sidebar-panel__wrapper"
      @scroll="throttleCheckTitlePosisiton"
    >
      <div
        v-if="!$slots.preview"
        :class="{
          'el-sidebar-panel__close-padding--small': !showClose,
          'el-sidebar-panel__close-padding--large': showClose,
        }"
      />
      <div
        v-if="$slots.preview"
        class="el-sidebar-panel__preview"
      >
        <slot name="preview" />
      </div>
      <div
        v-if="isStickyTitleShown && (showClose || title)"
        class="el-text el-text--strong el-sidebar-panel__sticky-title"
      >
        {{ title }}
      </div>
      <el-sidebar-title
        v-if="isTitleShown"
        ref="title"
        :title="title"
        :subtitle="subtitle"
      />

      <slot name="properties">
        <div
          v-if="isPropertiesShown"
          class="px-24 my-24"
        >
          <div
            v-for="property in properties"
            :key="property.label"
            class="el-text el-text--caption mb-16"
          >
            <!-- eslint-disable-next-line @uikit/locale/no-element-text -->
            <span class="el-sidebar-panel__property-label"> {{ property.label }}: </span>
            <span class="el-sidebar-panel__property-value"> {{ property.value }} </span>
          </div>
        </div>
      </slot>

      <div
        v-if="isActionsShown"
        class="el-sidebar-panel__action-wrapper mt-24"
      >
        <slot name="actions">
          <el-button
            v-if="highlightAction"
            :icon="highlightAction.icon"
            fluid
            @click="() => emitCommand(highlightAction.command)"
          >
            {{ highlightAction.label }}
          </el-button>
          <div
            class="el-sidebar-panel__action-list--large-spacing"
            :class="{'el-sidebar-panel__action-list--small-spacing': isSmallSpacingActionList }"
          >
            <div
              v-for="(item, index) in normalActions"
              :key="index"
              class="mb-16"
            >
              <el-divider
                v-if="item.divider"
                class="el-sidebar-panel__action-divider"
              />
              <div v-if="item.type === 'action-group'">
                <el-dropdown
                  placement="top-end"
                  class="el-sidebar-panel__action-group"
                  :is-sidebar="true"
                  @command="emitCommand"
                >
                  <el-sidebar-action
                    :icon="item.icon"
                    :action-group="true"
                  >
                    {{ item.label }}
                  </el-sidebar-action>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-for="(action, actionIndex) in item.subActions"
                        :key="actionIndex"
                        :command="action.command"
                      >
                        {{ action.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div v-else>
                <el-sidebar-action
                  :icon="item.icon"
                  :command="item.command"
                  @command="emitCommand"
                >
                  {{ item.label }}
                </el-sidebar-action>
              </div>
            </div>
          </div>
        </slot>
      </div>
      <slot name="default" />
    </el-scrollbar>
  </div>
</template>

<script>
  import ElIcon from 'packages/icon';
  import ElButton from 'packages/button';
  import ElScrollbar from 'packages/scrollbar';
  import ElDropdown from 'packages/dropdown';
  import ElSidebarAction from 'packages/widgets/sidebar/sidebar-action';
  import ElSidebarTitle from 'packages/widgets/sidebar/sidebar-title';

  export default {
    name: 'ElSidebarPanel',

    inject: ['sidebar'],

    components: {
      ElIcon,
      ElButton,
      ElDropdown,
      ElScrollbar,
      ElSidebarAction,
      ElSidebarTitle
    },

    props: {
      title: {
        type: String,
        default: ''
      },
      subtitle: {
        type: String,
        default: ''
      },

      // Array of property object
      // {
      //   label: string,
      //   value: string
      // }
      properties: {
        type: Array,
        default: () => []
      },

      // Array of action object
      // {
      //   type: 'action' || 'action-group' || 'highlight',
      //   divider: boolean,
      //   label: string,
      //   icon: string,
      //   command: string || symbol,
      //   subActions: array of action object, do not allow action-group type
      // }
      actions: {
        type: Array,
        default: () => []
      },
      showClose: {
        type: Boolean,
        default: false
      }
    },

    data() {
      return {
        titlePosition: 0,
        titleHeight: 0,
        isStickyTitleShown: false,
        scrollTicking: false
      };
    },

    computed: {
      isTitleShown() {
        return this.title || this.subtitle;
      },

      isPropertiesShown() {
        return this.properties.length;
      },

      isActionsShown() {
        return this.actions.length || this.$slots.actions;
      },

      isSmallSpacingActionList() {
        return !this.isTitleShown
          && !this.$slots.preview
          && !this.isPropertiesShown
          && this.isActionsShown
          && !this.highlightAction
          && this.normalActions.length;
      },

      highlightAction() {
        return this.actions && this.actions.filter((action) => action.type === 'highlight')[0];
      },

      normalActions() {
        return this.actions && this.actions.filter((action) => action.type !== 'highlight');
      }
    },

    methods: {
      closeSidebarView() {
        /* istanbul ignore else */
        if (this.sidebar) {
          this.sidebar.close();
        }
        this.$emit('close');
      },

      checkTitlePosisition() {
        if (this.title) {
          this.isStickyTitleShown = this.$refs.title.$el.getBoundingClientRect().top
            < this.$el.getBoundingClientRect().top;
        } else {
          this.isStickyTitleShown = this.$refs.scroll && this.$refs.scroll.$refs.wrap.scrollTop;
        }
      },

      throttleCheckTitlePosisiton() {
        /* istanbul ignore else */
        if (!this.scrollTicking) {
          window.requestAnimationFrame(() => {
            this.checkTitlePosisition();
            this.scrollTicking = false;
          });
          this.scrollTicking = true;
        }
      },

      emitCommand(command) {
        this.$emit('command', command);
      }
    }
  };
</script>
