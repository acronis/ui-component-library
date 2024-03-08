<template>
  <img
    v-if="!!iconUrl && iconUrlFound"
    :src="iconUrl"
    :width="variant"
    :class="{
      [name]: isFontFullName,
      [`${prefix}-${name}--${computedVariant}`]:
        name && variant && !isFontFullName,
      'is-disabled': disabled,
      'is-right': right,
      'is-left': left,
    }"
    alt="Icon"
    class="i"
    @error="onIconError"
    @click="handeClick"
  />
  <i
    v-else
    class="i el-icon qa-icon"
    :class="{
      [name]: isFontFullName,
      [`${prefix}-${name}--${computedVariant}`]:
        name && variant && !isFontFullName,
      [`${prefix}--size-${computedSize}`]: size || variant,
      [`${prefix}--color-${color}`]: color,
      'is-disabled': disabled,
      'is-right': right,
      'is-left': left,
      'is-multi-color': isMultiColor,
    }"
    @click="handeClick"
  >
    <i
      v-if="state"
      class="i__state qa-icon-state"
      :class="{
        [state]: state,
        [`${prefix}--size-${computedSize}`]: size || variant,
        [`${prefix}--color-${color}`]: color,
        'is-disabled': disabled,
        'is-multi-color': isStateMultiColor,
      }"
    >
      <component :is="stateComponent" :class="svgIconComponentClass" />
    </i>
    <component :is="iconComponent" :class="svgIconComponentClass" />
  </i>
</template>

<script setup>
import { defineAsyncComponent, defineProps, ref, computed } from "vue";

const basePath = "../../../icons";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
    default: "i",
  },
  state: {
    type: [String, Boolean],
    default: false,
  },
  variant: {
    type: String,
    default: "16",
  },
  iconUrl: {
    type: String,
    default: "",
  },
  size: String,
  color: String,
  disabled: Boolean,
  right: Boolean,
  left: Boolean,
});

const variants = {
  sm: 16,
  md: 24,
  lg: 32,
};

const sizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xlg: 96,
};

const iconUrlFound = ref(true);

const icons = import.meta.glob(
  `../../../icons/**/*.svg`
);

const isSvgIcon = computed(() => {
  return /^(clr)-/.test(props.name);
});

const isFontFullName = computed(() => {
  return /^(i|clr)-/.test(props.name);
});

const iconPath = computed(() => {
  let iconName = props.name;
  if (isFontFullName.value) {
    iconName =
      props.name && props.name.startsWith("clr")
        ? `multicolor-icons/${props.name.slice(4)}`
        : `monocolor-icons/${props.name.slice(2)}`;
  } else {
    iconName = `monocolor-icons/${props.name}--${computedVariant.value}`;
  }
  return iconName;
});

const statePath = computed(() => {
  const stateName = props.state.startsWith("clr")
    ? `multicolor-icons/${props.state.slice(4)}`
    : `monocolor-icons/${props.state.slice(2)}`;
  return stateName;
});

const computedVariant = computed(() => {
  return variants[props.variant] || props.variant;
});

const computedSize = computed(() => {
  return (
    sizes[props.size] ||
    props.size ||
    (isFontFullName.value && props.name.substr(-2)) ||
    props.variant
  );
});

const isMultiColor = computed(() => {
  return props.name && props.name.startsWith("clr");
});

const isStateMultiColor = computed(() => {
  return props.state.startsWith("clr");
});

const svgIconComponentClass = computed(() => {
  return {
    svg: true,
    "qa-svg": true,
    [`svg--size-${computedSize.value}`]: props.size || props.variant,
  };
});

const stateComponent = computed(() => {
  console.log(icons)
  return defineAsyncComponent(() => {
    return icons[`${basePath}/${statePath.value}.svg`]();
  });
});

const iconComponent = computed(() => {
  return defineAsyncComponent(() => {
    return icons[`${basePath}/${iconPath.value}.svg`]();
  });
});

const handeClick = (e) => {
  // emit("close", e);
};

const onIconError = () => {
  this.iconUrlFound = false;
};
</script>
