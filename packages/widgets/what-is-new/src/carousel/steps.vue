<template>
  <div
    v-if="itemsCount>0"
    class="el-whatisnew-steps"
  >
    <div
      v-for="(step, index) in itemsCount"
      :key="index"
      class="el-whatisnew-steps__item"
      :class="{'el-whatisnew-steps__item--current': index===current}"
      @click="$emit('step-click',index)"
    />
  </div>
</template>

<script>
  export default {
    name: 'Steps',
    props: {
      itemsCount: {
        type: Number,
        default: 0
      },
      current: {
        type: Number,
        default: 0
      }
    }
  };
</script>
