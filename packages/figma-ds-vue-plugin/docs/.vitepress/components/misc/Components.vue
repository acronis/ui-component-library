<script>
  import {
    Button,
    Checkbox,
    Divider,
    IconButton,
    NumInput,
    Select,
    Toggle,
    Tooltip
  } from '@/components';

  export default {
    components: {
      Button,
      Checkbox,
      Divider,
      IconButton,
      NumInput,
      Select,
      Toggle,
      Tooltip
    },
    props: {
      xVal: {
        type: Number
      },
      yVal: {
        type: Number
      },
      widthVal: {
        type: Number
      },
      heightVal: {
        type: Number
      },
      cornerVal: {
        type: Number
      },
      angleVal: {
        type: Number
      },
      blendVal: {
        type: String
      },
      toggleVal: {
        type: Boolean
      }
    },
    data() {
      return {
        lock: false
      };
    },
    computed: {
      x: {
        get() {
          return this.xVal;
        },
        set(val) {
          this.$emit('x', val);
        }
      },
      y: {
        get() {
          return this.yVal;
        },
        set(val) {
          this.$emit('y', val);
        }
      },
      width: {
        get() {
          return this.widthVal;
        },
        set(val) {
          this.$emit('width', val);
        }
      },
      height: {
        get() {
          return this.heightVal;
        },
        set(val) {
          this.$emit('height', val);
        }
      },
      corner: {
        get() {
          return this.cornerVal;
        },
        set(val) {
          this.$emit('corner', val);
        }
      },
      angle: {
        get() {
          return this.angleVal;
        },
        set(val) {
          this.$emit('angle', val);
        }
      },
      blend: {
        get() {
          return this.blendVal;
        },
        set(val) {
          this.$emit('blend', val);
        }
      },
      toggle: {
        get() {
          return this.toggleVal;
        },
        set(val) {
          this.$emit('toggle', val);
        }
      }
    }
  };
</script>

<template>
  <div class="window">
    <div class="window__bar">
      Figma Plugin
    </div>
    <div class="window__content">
      <IconButton
        icon="align-left"
        :disabled="lock"
        @click="$emit('justify', 'flex-start')"
      />
      <IconButton
        icon="align-horizontal-centers"
        :disabled="lock"
        @click="$emit('justify', 'center')"
      />
      <IconButton
        icon="align-right"
        :disabled="lock"
        @click="$emit('justify', 'flex-end')"
      />
      <IconButton
        icon="align-top"
        :disabled="lock"
        @click="$emit('align', 'flex-start')"
      />
      <IconButton
        icon="align-vertical-centers"
        :disabled="lock"
        @click="$emit('align', 'center')"
      />
      <IconButton
        icon="align-bottom"
        :disabled="lock"
        @click="$emit('align', 'flex-end')"
      />
      <IconButton
        icon="distribute-horizontal-spacing"
        disabled
      />
      <Divider />
      <div class="flex column">
        <div class="flex mb-xxsmall">
          <NumInput
            v-model="x"
            icon-text="X"
            class="mr-xxsmall"
            style="width: 96px"
            :disabled="lock"
          />
          <NumInput
            v-model="y"
            icon-text="Y"
            style="width: 96px"
            :disabled="lock"
          />
        </div>
        <div class="flex mb-xxsmall">
          <NumInput
            v-model="width"
            icon-text="W"
            min="0"
            class="mr-xxsmall"
            style="width: 96px"
            :disabled="lock"
          />
          <NumInput
            v-model="height"
            icon-text="H"
            min="0"
            style="width: 96px"
            :disabled="lock"
          />
        </div>
        <div class="flex">
          <NumInput
            v-model="angle"
            icon="angle"
            class="mr-xxsmall"
            style="width: 96px"
            :disabled="lock"
          />
          <NumInput
            v-model="corner"
            icon="corner-radius"
            style="width: 96px"
            min="0"
            :disabled="lock"
          />
        </div>
      </div>
      <Divider />
      <Select
        v-model="blend"
        :items="[
          {
            icon: 'blend-empty',
            label: 'Pass through',
            key: 'normal',
          },
          {
            icon: 'blend-empty',
            label: 'Normal',
            key: 'normal',
          },
          {
            divider: true,
          },
          {
            icon: 'blend',
            label: 'Darken',
            key: 'darken',
          },
          {
            icon: 'blend',
            label: 'Multiply',
            key: 'multiply',
          },
          {
            icon: 'blend',
            label: 'Color burn',
            key: 'color-burn',
          },
          {
            divider: true,
          },
          {
            icon: 'blend',
            label: 'Lighten',
            key: 'lighten',
          },
          {
            icon: 'blend',
            label: 'Screen',
            key: 'screen',
          },
          {
            icon: 'blend',
            label: 'Color dodge',
            key: 'color-dodge',
          },
          {
            divider: true,
          },
          {
            icon: 'blend',
            label: 'Difference',
            key: 'difference',
          },
          {
            icon: 'blend',
            label: 'Exclusion',
            key: 'exclusion',
          },
          {
            divider: true,
          },
          {
            icon: 'blend',
            label: 'Hue',
            key: 'hue',
          },
          {
            icon: 'blend',
            label: 'Saturation',
            key: 'saturation',
          },
          {
            icon: 'blend',
            label: 'Color',
            key: 'color',
          },
          {
            icon: 'blend',
            label: 'Luminosity',
            key: 'luminosity',
          },
        ]"
        :disabled="lock"
      />
      <Divider />
      <div class="flex">
        <Toggle
          v-model="toggle"
          :disabled="lock"
        >
          Capslock
        </Toggle><Tooltip
          width="116"
          position="r"
          style="margin-left: -16px"
        >
          This is a tooltip.
        </Tooltip>
      </div>
      <Divider />
      <Checkbox v-model="lock">
        Lock changes
      </Checkbox>
      <Divider />
      <div class="flex">
        <Button
          class="mr-xxsmall"
          style="width: 70%"
          @click="() => $router.push('docs/')"
        >
          Visit docs
        </Button>
        <Button
          secondary
          style="width: calc(30% - 8px)"
          @click="$emit('reset')"
        >
          Reset
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.window {
  display: block;
  background: hsl(0deg, 0%, 100%);
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  width: 300px;
  border-radius: 3px;
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.15);

  .window__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 42px;
    padding: 0 4px 0 16px;
    font-size: 11px;
    font-weight: 600;
    font-style: normal;
    line-height: 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .window__content {
    padding: 8px;
  }
}
</style>
