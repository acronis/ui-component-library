<template>
  <div class="el-ribbon" role="ribbon">
    <template v-for="(alert, index) in alerts">
      <el-alert
        :key="index"
        :type="alert.type"
        v-if="index === currentIndex"
      >
        <template v-if="alert.title" v-slot:title>
          {{ alert.title }}
        </template>
        <template v-if="alert.description" v-slot:description>
          <div class="el-ribbon__description">
            {{ alert.description }}
            <template v-if="alert.link">
              <el-link
                :href="alert.link.href"
                :target="alert.link.target || '_blank'"
                @click="(event) => onClickLink(event, alert.link)"
              >
                {{ alert.link.title }}
              </el-link>
            </template>
          </div>
        </template>
        <template v-slot:actions-right>
          <template v-if="alerts.length > 1">
            <div class="el-text el-text--body-32 pr-16">
              {{ stepLabel }}
            </div>
            <el-divider vertical></el-divider>
            <el-button
              type="ghost"
              icon="i-long-arrow-left--16"
              :disabled="isFirst"
              @click="onPrevious"
              class="mx-8 el-button--previous"
            >
            </el-button>
            <el-divider vertical></el-divider>
            <el-button
              type="ghost"
              icon="i-long-arrow-right--16"
              @click="onNext"
              :disabled="isLast"
              class="mx-8 el-button--next"
            ></el-button>
          </template>
          <el-divider vertical></el-divider>
          <el-button
            type="ghost"
            icon="i-times--16"
            @click="onClose"
            class="mx-8 el-button--close"
            v-if="!hideClose"
          >
          </el-button>
        </template>
      </el-alert>
    </template>
  </div>
</template>
<script>
import ElButton from 'packages/button';
import ElAlert from 'packages/alert';
import ElDivider from 'packages/divider';
import ElLink from 'packages/link';

export default {
  name: 'ElRibbon',

  components: {
    ElButton,
    ElAlert,
    ElDivider,
    ElLink
  },
  props: {
    alerts: {
      type: Array
    },
    hideClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentIndex: 0
    };
  },
  computed: {
    isFirst() {
      return !this.currentIndex;
    },
    isLast() {
      return this.currentIndex === (this.alerts.length - 1);
    },
    stepLabel() {
      return `${this.currentIndex + 1} of ${this.alerts.length}`;
    }
  },
  methods: {
    onClose() {
      this.$emit('close', this.currentIndex);
      this.$nextTick(() => {
        if (this.currentIndex >= this.alerts.length) {
          this.currentIndex = this.alerts.length - 1;
        }
      });
    },
    onPrevious() {
      this.currentIndex -= 1;
    },
    onNext() {
      this.currentIndex += 1;
    },
    onClickLink(event, link) {
      event.preventDefault();
      if (link.click) {
        link.click();
        return;
      }
      if (link.href) {
        window.open(link.href, link.target || '_blank');
      }
    }
  }
};
</script>
