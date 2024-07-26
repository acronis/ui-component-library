<script setup>
  import { computed } from 'vue';

  defineOptions({
    name: 'Preview'
  });
  const {
    background,
    name,
    span,
    justifyContent,
    alignItems,
    inverse
  } = defineProps({
    name: String,
    span: {
      type: String,
      default: '24'
    },
    justifyContent: {
      type: String,
      default: 'center'
    },
    alignItems: {
      type: String,
      default: 'center'
    },
    background: String,
    inverse: {
      type: Boolean,
      default: false
    }
  });
  const previewWidth = computed(() => {
    return `${(100 / (24 / span)).toFixed(2)}%`;
  });
  const previewClasses = computed(() => {
    return {
      'preview': true,
      [`preview--color-${background}`]: background,
      'preview--has-background': background,
      'preview--has-caption': name,
    };
  });
  const previewContentClasses = computed(() => {
    return {
      preview__content: true,
      [`justify-content--${justifyContent}`]: justifyContent,
      [`align-items--${alignItems}`]: alignItems,
    };
  });
  const previewCaptionClasses = computed(() => {
    return {
      'preview__caption': true,
      'is-inverse': inverse
    };
  });
</script>

<template>
  <div
    :class="previewClasses"
  >
    <div
      :class="previewContentClasses"
    >
      <slot />
    </div>
    <div
      v-if="name"
      :class="previewCaptionClasses"
    >
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
.justify-content--center {
  justify-content: center;
}

.justify-content--start {
  justify-content: start;

}

.justify-content--end {
  justify-content: end;

}

.justify-content--flex-start {
  justify-content: flex-start;

}

.justify-content--flex-end {
  justify-content: flex-end;

}

.justify-content--left {
  justify-content: left;

}

.justify-content--right {
  justify-content: right;

}

.justify-content--space-between {
  justify-content: space-between;

}

.justify-content--space-around {
  justify-content: space-around;

}

.justify-content--space-evenly {
  justify-content: space-evenly;

}

.justify-content--stretch {
  justify-content: stretch;

}

.align-items--center {
  align-items: center;

}

.align-items--start {
  align-items: start;

}

.align-items--end {
  align-items: end;

}

.align-items--flex-start {
  align-items: flex-start;

}

.align-items--flex-end {
  align-items: flex-end;

}

.align-items--stretch {
  align-items: stretch;

}

.preview {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 176px;
  padding: 24px;
  border-right: var(--acv-border-regular) var(--acv-color-status-info-primary);
  border-bottom: var(--acv-border-regular) var(--acv-color-status-info-primary);
  width: v-bind(previewWidth);

  .preview__content {
      display: flex;
      flex: 1;
      flex-direction: column;
      margin: auto;
      width: 100%;
      height: inherit;
  }

  .preview__caption {
      font-size: var(--acv-font-size-body); /* 16px */
      font-weight: var(--acv-font-weight-regular);
      line-height: var(--acv-font-line-height-regular);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--acv-color-primary-light);
      text-align: center;
      margin-top: 16px;
  }

  .preview--color-brand-lightest {
      background-color: var(--acv-color-primary-lightest);
  }

  .preview--color-brand-accent {
      background-color: var(--acv-color-status-info-primary);
  }

  .preview--color-brand-light {
      background-color: var(--acv-color-primary-light);
  }

  .preview--color-nav-primary {
      background-color: var(--acv-color-nav-primary);
  }

  .preview--color-nav-secondary {
      background-color: var(--acv-color-nav-secondary);
  }

  .preview--color-fixed-secondary {
      background-color: var(--acv-color-secondary);
  }

  .preview--color-nav-primary,
    .preview--color-nav-light,
    .preview--color-nav-secondary,
    .preview--color-fixed-secondary {
      .preview__caption {
        color: var(--acv-color-inverted);

        &.is-inverse {
            color: var(--acv-color-brand-primary)
        }
      }
    }

  .preview--has-background {
      border-right: none;
  }

  .preview--has-caption {
      padding: 24px 24px 16px;
  }

  .preview--hidden {
      display: none;
  }
}
</style>
