<script setup>
  import AcvButton from '@/components/button/button.vue';
  import AcvTooltip from '@/components/tooltip/tooltip.vue';
</script>

<template>
  <div class="box">
    <div class="top">
      <AcvTooltip
        content="Top Left prompts info"
        placement="top-start"
      >
        <AcvButton class="item">
          top-start
        </AcvButton>
      </AcvTooltip>
      <AcvTooltip

        content="Top Center prompts info"
        placement="top"
      >
        <AcvButton class="item">
          top
        </AcvButton>
      </AcvTooltip>
      <AcvTooltip
        content="Top Right prompts info"
        placement="top-end"
      >
        <AcvButton>top-end</AcvButton>
      </AcvTooltip>
    </div>
    <div class="left">
      <AcvTooltip
        content="Left Top prompts info"
        placement="left-start"
      >
        <AcvButton
          class="item"
          fluid
        >
          left-start
        </AcvButton>
      </AcvTooltip>
      <AcvTooltip
        content="Left Center prompts info"
        placement="left"
      >
        <AcvButton
          class="item"
          fluid
        >
          left
        </AcvButton>
      </AcvTooltip>
      <AcvTooltip

        content="Left Bottom prompts info"
        placement="left-end"
      >
        <AcvButton
          class="item"
          fluid
        >
          left-end
        </AcvButton>
      </AcvTooltip>
    </div>
    <div class="right">
      <AcvTooltip

        content="Right Top prompts info"
        placement="right-start"
      >
        <AcvButton
          class="item"
          fluid
        >
          right-start
        </AcvButton>
      </AcvTooltip>
      <AcvTooltip

        content="Right Center prompts info"
        placement="right"
      >
        <AcvButton
          class="item"
          fluid
        >
          right
        </AcvButton>
      </AcvTooltip>
      <AcvTooltip

        content="Right Bottom prompts info"
        placement="right-end"
      >
        <AcvButton
          class="item"
          fluid
        >
          right-end
        </AcvButton>
      </AcvTooltip>
    </div>
    <div class="bottom">
      <AcvTooltip
        arrow

        content="Bottom Left prompts info"
        placement="bottom-start"
      >
        <AcvButton>bottom-start</AcvButton>
      </AcvTooltip>
      <AcvTooltip
        content="Bottom Center prompts info"
        placement="bottom"
      >
        <AcvButton class="item">
          bottom
        </AcvButton>
      </AcvTooltip>
      <AcvTooltip

        content="Bottom Right prompts info"
        placement="bottom-end"
      >
        <AcvButton>bottom-end</AcvButton>
      </AcvTooltip>
    </div>
  </div>
</template>

<style scoped>
.box {
  width: 400px;
  margin: 100px 200px;

  .top,
  .bottom,
  .left,
  .right {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .top,
  .bottom {
    text-align: center;
  }

  .left,
  .right {
    width: 104px;
  }

  .left {
    float: left;
  }

  .right {
    float: right;
    text-align: right;
  }

  .bottom {
    clear: both;
  }
}
</style>
