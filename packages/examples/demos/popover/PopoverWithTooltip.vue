<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvIcon from '@/components/icon/icon.vue';
  import AcvPopover from '@/components/popover/popover.vue';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
  import { IconAttention16 } from '@acronis-platform/icons/attention';
  import { ref } from 'vue';

  const firstPopoverReference = ref(null);
  const secondPopoverReference = ref(null);
  const isTooltipDisabled = ref(false);
  const isIconTooltipDisabled = ref(false);
  const toolTipPopover = ref(false);
  const toolTipPopoverWithIcon = ref(false);

  function enableTooltip() {
    isTooltipDisabled.value = false;
  }
  function enableIconTooltip() {
    isIconTooltipDisabled.value = false;
  }
  function disableTooltip() {
    isTooltipDisabled.value = true;
  }
  function openToolTipPopover(val) {
    toolTipPopover.value = val;
  }
  function openToolTipPopoverWithIcon(val) {
    toolTipPopoverWithIcon.value = val;
  }
  function disableIconTooltip() {
    isIconTooltipDisabled.value = true;
  }
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Hide Tooltip when popover is open (Button)"
      span="12"
    >
      <AcvPopover
        :reference-el="firstPopoverReference"
        width="300"
        @show="openToolTipPopover(true)"
        @hide="enableTooltip"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          When the popover hides itself, it would enable to tooltip.
        </div>
      </AcvPopover>
      <AcvTooltip
        content="Clicking on the button would disable the tooltip."
        placement="top"
        :disabled="isTooltipDisabled"
      >
        <AcvButton
          ref="firstPopoverReference"
          :class="{ 'is-selected': toolTipPopover && isTooltipDisabled }"
          @click="disableTooltip"
        >
          Button
        </AcvButton>
      </AcvTooltip>
    </Preview>
    <Preview
      name="Hide Tooltip when popover is open (Icon)"
      span="12"
    >
      <AcvPopover
        :reference-el="secondPopoverReference"
        width="300"
        @hide="enableIconTooltip"
        @show="openToolTipPopoverWithIcon(true)"
      >
        <div class="mx-24 my-16 acv-text acv-text--body-24">
          When the popover hides itself, it would enable to tooltip.
        </div>
      </AcvPopover>
      <AcvTooltip
        content="Clicking on the icon would disable the tooltip."
        placement="top"
        :disabled="isIconTooltipDisabled"
      >
        <AcvButton
          ref="secondPopoverReference"
          type="ghost"
          :class="{ 'is-selected': toolTipPopoverWithIcon && isIconTooltipDisabled }"
          @click="disableIconTooltip"
        >
          <AcvIcon
            :icon="IconAttention16"
            color="white"
          />
        </AcvButton>
      </AcvTooltip>
    </Preview>
  </PreviewGroup>
</template>
