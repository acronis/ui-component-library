<template>
  <div class="el-live-tracker">
    <el-row>
      <el-col
        v-for="(item, index) in data"
        :key="index"
        :xs="xs"
        :sm="sm"
        :md="md"
        :lg="lg"
        :xl="xl"
      >
        <div
          class="el-live-tracker__item pa-16 el-text el-text--body-32"
          @click="(event) => { return handleClick(index, event); }"
        >
          <el-icon
            class="el-live-tracker__icon"
            :name="item.icon"
          ></el-icon>
          <div class="el-live-tracker__title el-text--body-24">{{item.currentText}}</div>
          <div class="el-live-tracker__current el-text--display-large">{{item.current}}</div>
          <el-divider></el-divider>
          <div class="el-live-tracker__subtitle el-text--caption mt-8">{{item.totalText}}</div>
          <div class="el-live-tracker__total el-text--body-24">{{item.total}}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ElCol from 'packages/col';
import ElDivider from 'packages/divider';
import ElIcon from 'packages/icon';
import ElRow from 'packages/row';

export default {
  name: 'ElLiveTracker',
  components: {
    ElCol,
    ElDivider,
    ElIcon,
    ElRow
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    lg: {
      type: Number,
      default: 6
    },
    md: {
      type: Number,
      default: 8
    },
    sm: {
      type: Number,
      default: 12
    },
    xl: {
      type: Number,
      default: 4
    },
    xs: {
      type: Number,
      default: 24
    }
  },
  methods: {
    handleClick(index, e) {
      this.$emit('click', index, e);
    }
  }
};
</script>
