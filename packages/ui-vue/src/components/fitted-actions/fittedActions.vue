<script setup lang="ts">
  import type { Ref } from 'vue';
  import type { AcvFittedAction, AcvFittedActionsProps, AcvFittedItem } from './fittedActions.ts';
  import AcvButton from '@/components/button/button.vue';
  import AcvDropdown from '@/components/dropdown/dropdown.vue';
  import AcvDropdownMenu from '@/components/dropdown/dropdownMenu.vue';
  import useFittedActions from '@/components/fitted-actions/useFittedActions.ts';
  import ListItem from '@/components/list-item/listItem.vue';
  import { ref, toRefs } from 'vue';

  import './fittedActions.css';

  const props = withDefaults(
    defineProps<AcvFittedActionsProps>(),
    {
      showDropdown: true
    }
  );
  const { actions, item, showDropdown } = toRefs(props) as { actions: Ref<AcvFittedAction[]>, item: Ref<AcvFittedItem>, showDropdown: Ref<boolean> };

  const resizableContainer = ref(null);
  const elementRefs = ref([]);
  const {
    elements,
    visibleActions,
    dropdownActions
  } = useFittedActions({
    resizableContainer,
    elementRefs,
    actions,
    item,
    showDropdown
  });

  function triggerAction({ item, action }: { item: AcvFittedItem, action: (item: AcvFittedItem) => void | undefined }) {
    return typeof action === 'function' && action(item);
  }
</script>

<template>
  <div
    ref="resizableContainer"
    :key="item && `actions_${item.id}`"
    class="acv-fitted-actions"
  >
    <div
      class="tracing-layer"
    >
      <span
        v-for="(action, index) in elements"
        :key="index"
        ref="elementRefs"
        :ref3="`element${index}`"
        class="element is-hidden"
      >
        <AcvButton>
          {{ action.title }}
        </AcvButton>
        <!--        <acv-list-item -->
        <!--          :label="action.title" -->
        <!--          :item="item" -->
        <!--          :action="action" -->
        <!--          class="button" -->
        <!--          type="button" -->
        <!--        /> -->
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
        <AcvButton>
          {{ action.title }}
        </AcvButton>
        <!--        <acv-list-item -->
        <!--          :label="action.title" -->
        <!--          :item="item" -->
        <!--          :action="action" -->
        <!--          class="button" -->
        <!--          type="button" -->
        <!--          :test-i-d="action.name" -->
        <!--        /> -->
      </span>
    </div>
    <AcvDropdown
      v-if="dropdownActions.length && showDropdown"
      flyweight
      class="dropdown"
      trigger="click"
      data-testid="dropdown-trigger"
      @command="triggerAction"
    >
      <AcvButton
        variant="ghost"
        class="mr-8"
      >
        {{ 'More' }}
      </AcvButton>
      <template #dropdown>
        <AcvDropdownMenu
          data-testid="dropdown"
        >
          <ListItem
            v-for="actionItem in dropdownActions"
            :key="actionItem.actionName"
            :label="actionItem.title"
            :item="item"
            :divided="actionItem.isDivided"
            :action="actionItem"
            type="dropdown"
          />
        </AcvDropdownMenu>
      </template>
    </AcvDropdown>
  </div>
</template>

<style scoped>
  .acv-fitted-actions {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0;
    margin: 0;
    width: 100%;
    position: relative;
    overflow: hidden;

    .elements {
      position: relative;
      display: flex;
      flex-flow: row wrap;
      align-items: center;
      min-width: 0;
      max-height: 32px;
    }

    .tracing-layer {
      position: absolute;
      display: flex;
    }

    .element {
      display: inline-flex;
      height: 32px;
      cursor: pointer;
      position: relative;
      align-items: center;

      .button {
        margin: 0 8px 0 7px;
      }

      &.is-hidden {
        opacity: 0;
        pointer-events: none;
      }
    }

    .dropdown {
      flex: 0 1 auto;
      margin-left: 8px;
    }
  }
</style>
