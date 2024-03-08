<script lang="jsx">
import ElButton from 'packages/button';
import Carousel from 'packages/carousel';
import CarouselItem from 'packages/carousel-item';
import ElIcon from 'packages/icon';

import WhatIsNewItem from './whatisnewItem.vue';

export default {
  name: 'WhatIsNewItemsList',
  components: {
    ElButton, ElIcon, CarouselItem, Carousel, WhatIsNewItem
  },
  props: {
    backButtonText: {
      type: String,
      default: ''
    },
    nextButtonText: {
      type: String,
      default: ''
    },
    finishButtonText: {
      type: String,
      default: ''
    }
  },
  emits: ['finish'],
  data() {
    return {
      items: [],
      showSteps: true,
      isLastScreenFinishButtonDisabled: false,
      disableFinishClick: true,
      buttonDisablingTimeout: null
    };
  },

  watch: {
    showSteps(newValue) {
      if (newValue === false) {
        this.disableFinishClick = true;
        if (this.buttonDisablingTimeout !== null) {
          clearTimeout(this.buttonDisablingTimeout);
        }
        this.buttonDisablingTimeout = setTimeout(() => {
          this.disableFinishClick = false;
          this.buttonDisablingTimeout = null;
        }, 600);
      }
    }
  },
  mounted() {
    this.updateItems();
  },
  methods: {
    updateItems() {
      const childrenVNodes = this.$slots.default?.();

      this.items = childrenVNodes?.filter((vnode) => vnode.type.name === 'WhatisnewItem');
    },

    handleBackClick() {
      this.$refs.carousel.prev();
    },

    handleLastScreenFinishButtonClick() {
      if (this.disableFinishClick) { // prevents accidental click the button was shown after 'next' button
        return;
      }

      this.isLastScreenFinishButtonDisabled = true;

      if (this.buttonDisablingTimeout !== null) {
        clearTimeout(this.buttonDisablingTimeout);
        this.buttonDisablingTimeout = null;
      }

      this.buttonDisablingTimeout = setTimeout(() => {
        this.isLastScreenFinishButtonDisabled = false;
        this.buttonDisablingTimeout = null;
      }, 5000); // disable buttons for clicks for 5s

      this.$emit('finish', 'button');
    },

    handleChangeIndex(index) {
      if (!this.$refs.carousel) {
        return;
      }
      const itemsCount = this.$refs.carousel.items.length;
      this.showSteps = index + 1 < itemsCount;
    },

    renderCarouseItem(item) {
      return (
        <carousel-item>{item}</carousel-item>
      );
    },

    getWhatIsNewItemsVNodes() {
      return this.$slots.default?.()[0].children?.filter((vnode) => vnode.type.name === 'WhatisnewItem');
    }
  },

  render() {
    return (
      <div class="el-whatisnew-items-list">
        <carousel
          ref="carousel"
          navigation-arrows="always"
          slide-indicators={this.showSteps ? 'always' : 'never'}
          width={512}
          on-change={this.handleChangeIndex}
        >
          {this.getWhatIsNewItemsVNodes().map((i) => this.renderCarouseItem(i))}
          <slot name="nav-arrow-backward">
            <el-button type="ghost" v-show={this.showSteps}>
              {this.backButtonText}
            </el-button>
          </slot>
          <template v-slot:nav-arrow-forward>
            <el-button type="ghost">
              {this.nextButtonText}
            </el-button>
          </template>
        </carousel>
        <Transition name="buttons-fade-effect">
          <el-button
            class="el-whatisnew-items-list__back-button"
            v-show={!this.showSteps}
            type="ghost"
            onClick={this.handleBackClick}
          >
            <el-icon name="i-long-arrow-left--24"/>
          </el-button>
        </Transition>
        <div v-show={!this.showSteps}>
          <Transition
            name="button-finish-fade-effect"
          >
            <div
              class="el-whatisnew-items-list__finish-button-wrapper"
              v-show={!this.showSteps}
            >
              <el-button
                class="el-whatisnew-items-list__finish-button"
                size="large"
                disabled={this.isLastScreenFinishButtonDisabled}
                onClick={this.handleLastScreenFinishButtonClick}
              >
                {this.finishButtonText}
              </el-button>
            </div>
          </Transition>
        </div>
      </div>
    );
  }
};

</script>
