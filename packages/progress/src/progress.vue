<template>
  <div
    class="el-progress"
    :class="{
      [`el-progress--type-${type}`]: type,
      [`el-progress--size-${size}`]: size
    }"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="percentage"
  >
    <svg
      v-if="type === 'circle'"
      viewBox="0 0 16 16"
      class="el-progress-circle"
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        class="el-progress-circle__outer"
      />
      <circle
        :style="{ strokeDashoffset: offset }"
        cx="8"
        cy="8"
        r="7"
        class="el-progress-circle__inner"
        :class="{
          [`el-progress-circle__inner--color-${color}`]: color
        }"
      />
    </svg>

    <div
      v-else-if="type === 'segmented'"
      class="el-progress-bar"
    >
      <div
        class="el-progress-bar__outer"
        :style="{ display : 'flex'}"
      >
        <template v-if="percentage">
          <span
            v-for="(segment, index) in segments"
            :key="index"
            :style="{ width : `${segment.percentage}%`, cursor: interaction==='popover'?'pointer':'default'}"
          >
            <el-popover
              :disabled="interaction!=='popover'"
              placement="top"
            >
              <slot
                name="popover"
                v-bind:segment="segment"
              />
              <template #reference>
                <el-tooltip
                  :content="segment.name"
                  :disabled="interaction!=='tooltip'||!segment.name"
                >
                  <div
                    class="el-progress-bar__inner"
                    :class="{
                      [`el-progress-bar__inner--color-${segment.color}`]: segment.color,
                      [colorClass]: colorClass,
                      'el-progress-bar__inner--animate': animate,
                      'el-progress-bar__inner--animate-freeze': animate === 'freeze'
                    }"
                    :style="{height: size==='medium'?'8px':'4px'}"
                  />
                </el-tooltip>
              </template>
            </el-popover>
          </span>
        </template>
      </div>
    </div>

    <div
      v-else
      class="el-progress-bar"
    >
      <div class="el-progress-bar__outer">
        <div
          class="el-progress-bar__inner"
          :class="{
            [`el-progress-bar__inner--color-${color}`]: color,
            [colorClass]: colorClass,
            'el-progress-bar__inner--animate': animate,
            'el-progress-bar__inner--animate-freeze': animate === 'freeze'
          }"
          :style="{ width: `${percentage}%` }"
        />
      </div>
    </div>
  </div>
</template>

<script>

  import ElTooltip from 'packages/tooltip';
  import ElPopover from 'packages/popover';

  export default {
    name: 'ElProgress',

    components: {
      ElTooltip,
      ElPopover
    },

    props: {
      percentage: {
        type: Number,
        default: 0,
        required: true,
        validator: (value) => value >= 0 && value <= 100
      },

      type: {
        type: String,
        default: 'line',
        validator: (value) => ['line', 'circle', 'segmented'].indexOf(value) > -1
      },

      size: {
        type: String,
        default: 'medium',
        validator: (value) => ['medium', 'small'].indexOf(value) > -1
      },

      color: {
        type: String,
        default: 'brand-secondary'
      },

      colorClass: String,

      animate: {
        type: [Boolean, String],
        default: false
      },

      segments: {
        type: Array,
        default: () => []
      },

      interaction: {
        type: String,
        default: 'tooltip',
        validator: (value) => ['tooltip', 'popover'].indexOf(value) > -1
      }
    },

    computed: {

      offset() {
        return (100 - this.percentage) * 0.44;
      }
    }
  };
</script>
