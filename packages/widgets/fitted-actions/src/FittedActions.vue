<template>
  <div
    ref="resizableContainer"
    :key="`actions_${item.id}`"
    class="el-fitted-actions"
  >
    <div
      class="tracing-layer"
    >
      <span
        v-for="(action, index) in elements"
        :key="index"
        :ref="`element${index}`"
        class="element is-hidden"
      >
        <el-table-action-item
          :label="action.title"
          :item="item"
          :action="action"
          class="button"
          type="button"
        />
      </span>
    </div>
    <div
      v-show="visibleActions.length"
      class="elements"
    >
      <span
        v-for="(action) in visibleActions"
        :key="action.id"
        :data-name="action.name"
        class="element"
      >
        <el-table-action-item
          :label="action.title"
          :item="item"
          :action="action"
          class="button"
          type="button"
          :test-i-d="action.name"
        />
      </span>
    </div>
    <el-dropdown
      v-if="dropdownActions.length && showDropdown"
      flyweight
      class="dropdown"
      trigger="click"
      data-testid="dropdown-trigger"
      @command="triggerAction"
    >
      <el-button
        type="ghost"
        class="mr-8"
      >
        {{ t('el.fittedactions.more') }}
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-table-action-item
            v-for="actionItem in dropdownActions"
            :key="actionItem.actionName"
            :label="actionItem.title"
            :item="item"
            :divided="actionItem.isDivided"
            :action="actionItem"
            type="dropdown"
          />
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>
  import ObserverMixin from '@/mixins/resizeObserver.mixin';
  import Locale from '@/mixins/locale';
  import ElTableActionItem from 'packages/table/src/table-action-item.vue';

  export default {
    name: 'ElFittedActions',
    components: { ElTableActionItem },
    mixins: [ObserverMixin, Locale],
    props: {
      actions: [Array, Object],
      item: { type: Object, default: () => ({}) },
      showDropdown: { type: Boolean, default: true }
    },
    data() {
      return {
        elements: [],
        refElements: []
      };
    },
    computed: {
      displayedActions() {
        return this.elements?.filter((it) => this.isDisplayed(it)) || [];
      },
      dropdownActions() {
        return this.displayedActions.filter((el) => el.isInDropdown);
      },
      visibleActions() {
        return this.displayedActions.filter((el) => !el?.isInDropdown);
      }
    },
    watch: {
      actions: {
        immediate: true,
        async handler(newActions) {
          this.elements = newActions.map((item) => {
            const name = item.name || item.title.split(' ').join('_').toLowerCase();

            return { ...item, name };
          });
          this.calculateVisibility();
        }
      },
      /**
       * Recalculate visible items after item state changed
       */
      displayedActions() {
        this.calculateVisibility();
      }
    },
    methods: {
      isDisplayed(action) {
        if (typeof action.display === 'function') {
          return action.display(this.item);
        }
        if (typeof action.display === 'undefined') {
          return true;
        }

        return !!action.display;
      },
      triggerAction({ item, action }) {
        return action(item);
      },
      onResize() {
        this.calculateVisibility();
      },
      getRefElements() {
        const { $refs, elements } = this;

        if (!$refs) return [];
        const refKeys = Object.keys($refs) || null;

        return refKeys?.map((key, index) => {
          const element = $refs[key][0];

          if (element && elements[index]) {
            return element;
          }

          return false;
        }).filter((i) => i);
      },
      async calculateVisibility() {
        const { $refs, getRefElements, elements } = this;

        if (!$refs) return;
        // wait while tracing elements are rendering
        await this.$nextTick();
        this.refElements = getRefElements();

        let showNextElement = true;
        const DROPDOWN_WIDTH = this.showDropdown ? 40 : 0;
        const fullWidth = ($refs.resizableContainer?.offsetWidth) - DROPDOWN_WIDTH;
        let remainingWidth = 0;

        this.refElements.forEach((element, index) => {
          if (showNextElement && element.offsetWidth) {
            remainingWidth += element.offsetWidth;

            const isInDropdown = remainingWidth >= fullWidth;
            showNextElement = !isInDropdown;
            this.$set(elements[index], 'isInDropdown', isInDropdown);
          } else {
            this.$set(elements[index], 'isInDropdown', true);
          }
        });
      }
    }
  };
</script>
