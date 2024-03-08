<template>
  <div class="source">
    <div class="box qa-tooltip-placement">
      <div class="top">
        <el-tooltip
          class="item"
          content="Top Left prompts info"
          placement="top-start"
        >
          <el-button>top-start</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          content="Top Center prompts info"
          placement="top"
        >
          <el-button>top</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          content="Top Right prompts info"
          placement="top-end"
        >
          <el-button>top-end</el-button>
        </el-tooltip>
      </div>
      <div class="left">
        <el-tooltip
          class="item"
          content="Left Top prompts info"
          placement="left-start"
        >
          <el-button fluid>left-start</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          content="Left Center prompts info"
          placement="left"
        >
          <el-button fluid>left</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          content="Left Bottom prompts info"
          placement="left-end"
        >
          <el-button fluid>left-end</el-button>
        </el-tooltip>
      </div>
      <div class="right">
        <el-tooltip
          class="item"
          content="Right Top prompts info"
          placement="right-start"
        >
          <el-button fluid>right-start</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          content="Right Center prompts info"
          placement="right"
        >
          <el-button fluid>right</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          content="Right Bottom prompts info"
          placement="right-end"
        >
          <el-button fluid>right-end</el-button>
        </el-tooltip>
      </div>
      <div class="bottom">
        <el-tooltip
          class="item"
          content="Bottom Left prompts info"
          placement="bottom-start"
        >
          <el-button>bottom-start</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          content="Bottom Center prompts info"
          placement="bottom"
        >
          <el-button>bottom</el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          content="Bottom Right prompts info"
          placement="bottom-end"
        >
          <el-button>bottom-end</el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script setup>
import ElTooltip from "packages/tooltip";
import ElButton from "packages/button";
</script>

<style lang="scss" scoped>
.box {
  width: 400px;

  .top,
  .bottom {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
      margin: 4px;
    }
  }

  .left,
  .right {
    width: 104px;

    .item {
      margin: 4px 0;
    }
  }

  .left {
    float: left;
  }

  .right {
    float: right;
  }

  .bottom {
    clear: both;
  }
}
</style>
