<template>
  <div class="el-whatisnew-carousel">
    <div v-loading="!isReady" />
    <div
      v-if="isReady"
      class="el-whatisnew-carousel__frame"
    >
      <div
        class="el-whatisnew-carousel__items-container"
        :style="containerStyles"
      >
        <slot />
      </div>
    </div>
    <div
      v-if="itemsCount>1 && showSteps"
      class="el-whatisnew-carousel__buttons"
    >
      <el-row type="flex">
        <el-col
          class="el-whatisnew-carousel__buttons-back-ctr"
          :span="8"
        >
          <transition name="buttons-fade-effect">
            <el-button
              v-show="isBackButtonShown"
              type="ghost"
              @click="debouncedHandleBackClick"
            >
              {{ backButtonText }}
            </el-button>
          </transition>
        </el-col>
        <el-col
          class="el-whatisnew-carousel__steps"
          :span="8"
        >
          <steps
            :items-count="itemsCount"
            :current="currentItem"
            @step-click="debouncedHandleStepClick"
          />
        </el-col>
        <el-col
          class="el-whatisnew-carousel__buttons-next-ctr"
          :span="8"
        >
          <transition name="buttons-fade-effect">
            <el-button
              v-if="isNextButtonShown"
              type="ghost"
              @click="debouncedHandleNextClick"
            >
              {{ nextButtonText }}
            </el-button>
          </transition>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import { debounce } from 'throttle-debounce';
  import Steps from './steps';

  export default {
    name: 'Carousel',
    components: { Steps },
    props: {
      showSteps: {
        type: Boolean,
        default: true
      },

      autoRolling: {
        type: Boolean,
        default: false
      },

      autoRollingDelay: {
        type: Number,
        default: 6000
      },

      initialFrameWidth: {
        type: Number,
        default: undefined
      },

      nextButtonText: {
        type: String,
        default: '→'
      },

      backButtonText: {
        type: String,
        default: '←'
      }
    },
    data() {
      return {
        frameWidth: 512,
        paused: false,
        currentItem: 0,
        items: []
      };
    },
    computed: {
      itemsCount() {
        return this.items.length;
      },

      itemsContainerWidth() {
        return this.isReady ? this.itemsCount * this.frameWidth : 0;
      },

      isReady() {
        return this.frameWidth !== undefined;
      },

      containerStyles() {
        const width = this.itemsContainerWidth;
        const marginLeft = this.currentItem * this.frameWidth;

        return {
          width: `${width}px`,
          marginLeft: `-${marginLeft}px`
        };
      },

      isBackButtonShown() {
        return this.currentItem > 0;
      },
      isNextButtonShown() {
        return this.currentItem + 1 < this.itemsCount;
      }
    },
    watch: {
      currentItem: {
        immediate: true,
        handler(newIndex) {
          this.$emit('change-item', newIndex);
        }
      }
    },
    created() {
      if (this.initialFrameWidth > 0) {
        this.frameWidth = this.initialFrameWidth;
      }
      this.debouncedHandleStepClick = debounce(200, this.handleStepClick);
      this.debouncedHandleNextClick = debounce(200, this.handleNextClick);
      this.debouncedHandleBackClick = debounce(200, this.handleBackClick);
    },
    mounted() {
      this.$nextTick(() => {
        this.updateItems();
      });
    },
    methods: {
      updateItems() {
        this.items = this.$children.filter((item) => item.$options.name === 'CarouselItem');
        this.items.forEach((item) => {
          item.$el.style.width = `${this.frameWidth}px`;
        });
      },

      handleStepClick(stepIndex) {
        const index = parseInt(stepIndex, 10);
        if (!Number.isNaN(index) && (index >= 0 || index < this.itemsCount)) {
          this.currentItem = index;
        }
      },

      handleNextClick() {
        if (this.currentItem + 1 < this.itemsCount) {
          this.currentItem++;
        }
      },

      handleBackClick() {
        if (this.currentItem > 0) {
          this.currentItem--;
        }
      }
    }
  };
</script>
