<script>
  export default {
    name: 'DisclosureItem',
    /**
     * Disclosure item, must be children of Disclosure component
     */
    // Inject data from parent Disclosure wrapper
    inject: ['disclosure', 'concede'],
    props: {
      title: { type: String, default: 'Disclosure title' },
      bold: Boolean,
    },
    data: () => ({
      index: null,
      isExpanded: false,
    }),
    computed: {
      expanded() {
        if (!this.concede) {
          return this.index === this.disclosure.currentIndex;
        }
        return this.isExpanded;
      },
    },
    created() {
      this.index = this.disclosure.numItems++;
    },
    methods: {
      toggle(e) {
        e.preventDefault();
        if (this.concede) {
          this.isExpanded = !this.isExpanded;
        }

        if (this.expanded) {
          this.disclosure.currentIndex = null;
        }
        else {
          this.disclosure.currentIndex = this.index;
        }
      },
    },
  };
</script>

<template>
  <li
    class="fig-disclosure-item"
    :class="{
      'fig-disclosure-item--expanded': expanded,
      'fig-disclosure-item--bold': bold,
    }"
  >
    <span
      class="fig-disclosure-item__title"
      tabindex="0"
      @click="toggle"
      @keydown.space="toggle"
      v-html="title"
    />
    <div class="fig-disclosure-item__content">
      <slot>Disclosure content</slot>
    </div>
  </li>
</template>

<style scoped>
.fig-disclosure-item {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style-type: none;
  border-bottom: 1px solid var(--bg-silver);

  &:active,
  &:focus {
    outline: none;
  }

  &:last-child {
    border-bottom: 1px solid transparent;
  }

  &.fig-disclosure-item--bold .fig-disclosure-item__title {
    font-weight: var(--font-weight-bold);
  }

  &.fig-disclosure-item--expanded {
    .fig-disclosure-item__title {
      &:before {
        background-image: url('data:image/svg+xml;utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m9%2010%203-4h-6z%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E');
        opacity: 0.8;
      }
    }
    .fig-disclosure-item__content {
      display: block;
      border-bottom: 1px solid transparent;
    }
  }

  .fig-disclosure-item__title {
    display: flex;
    align-items: center;
    height: var(--size-medium);
    padding: 0 8px 0 24px;
    color: var(--black8);
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xsmall);
    line-height: var(--font-line-height);
    letter-spacing: var(--font-letter-spacing-pos-xsmall);
    cursor: default;
    user-select: none;

    &:before {
      position: absolute;
      top: 8px;
      left: 4px;
      display: block;
      width: 16px;
      height: 16px;
      background-image: url('data:image/svg+xml;utf8,%3Csvg%20fill%3D%22none%22%20height%3D%2216%22%20viewBox%3D%220%200%2016%2016%22%20width%3D%2216%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m11%208-4-3v6z%22%20fill%3D%22%23000%22%2F%3E%3C%2Fsvg%3E');
      background-repeat: no-repeat;
      background-position: center center;
      opacity: 0.3;
      content: '';
    }

    &:hover {
      &:before {
        opacity: 0.8;
      }
    }

    &:active,
    &:focus {
      outline: 2px solid var(--blue);
      outline-offset: -2px;
    }
  }

  .fig-disclosure-item__content {
    display: none;
    padding: var(--size-xxsmall) var(--size-xxsmall) var(--size-xxsmall)
      var(--size-small);
    color: var(--black8);
    font-weight: var(--font-weight-normal);
    font-size: var(--font-size-xsmall);
    line-height: var(--font-line-height);
    letter-spacing: var(--font-letter-spacing-pos-xsmall);
    user-select: none;
  }
}
</style>
