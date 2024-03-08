<template>
  <div
    class="el-tile"
  >
    <div
      class="el-tile__click-area"
      @click="handleClick"
    >
      <div class="el-tile__image-wrap">
        <div
          class="el-tile__image"
          :style="imageStyles"
        >
          <img
            v-if="isImg"
            :src="imgSrc"
          >
          <el-icon
            v-else-if="isImageShow"
            :name="iconName"
            :size="iconSize"
            :color="iconColor"
          />
        </div>
        <div class="el-tile__sidebar">
          <div
            class="el-tile__actions"
          >
            <el-tile-actions
              v-if="isActionsShow"
              :actions="actions"
              :i18n="i18n"
              :row="tile"
              @command="handleAction"
            />
          </div>
        </div>
      </div>
      <div
        v-if="isTitleShow"
        class="el-tile__title el-text el-text--body el-text--ellipsis"
      >
        {{ title }}
      </div>
      <div
        v-if="isCaptionShow"
        class="el-tile__caption el-text el-text--caption el-text--ellipsis"
      >
        {{ caption }}
      </div>
      <div
        v-if="isSubCaptionShow"
        class="el-tile__sub-caption el-text el-text--caption el-text--ellipsis"
      >
        {{ subCaption }}
      </div>
    </div>
    <div class="el-tile__footer">
      <div class="el-tile__footer-column-1">
        <div
          v-if="isFooterTitleShow"
          class="el-tile__footer-title el-text el-text--caption el-text--ellipsis"
        >
          {{ footerTitle }}
        </div>
        <div
          v-if="isFooterCaptionShow"
          class="el-tile__footer-caption el-text el-text--caption el-text--ellipsis"
        >
          {{ footerCaption }}
        </div>
      </div>
      <div
        v-if="isIconsShow"
        class="el-tile__icons"
      >
        <el-tooltip
          v-for="(icon, index) in icons"
          :key="index"
          :style="iconStyles(icon)"
          :class="{ 'el-tile__icon-clichable': icon.isClickable }"
          :content="translate(icon.text, i18n)"
          :disabled="!icon.text"
          placement="right"
          class="el-tile__icon-wrap"
        >
          <el-icon
            :name="icon.name"
            :color="icon.color"
            @click="handleIconClick(icon)"
          />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { emptyValue } from './constants';
import ElTileActions from './tile-actions';
import { translate } from './translate';

const imgSizes = {
  16: '16px',
  24: '24px',
  32: '32px',
  64: '64px',
  72: '72px',
  96: '96px'
};

const iconSizes = {
  16: '32px',
  24: '48px',
  32: '64px',
  64: '96px',
  72: '112px',
  96: '128px'
};

export default {
  name: 'ElTile',
  components: {
    ElTileActions
  },
  props: {
    tile: { type: Object, required: true },
    tilesConfig: { type: Object, required: true },
    i18n: { type: Object, default: null }
  },
  data() {
    return {
      translate
    };
  },
  computed: {
    isTitleShow() {
      return !!this.tilesConfig?.map?.title;
    },
    title() {
      return this.tilesConfig?.map?.title && translate(this.tile[this.tilesConfig.map.title], this.i18n) || emptyValue;
    },
    isSubCaptionShow() {
      return !!this.tilesConfig?.map?.subCaption;
    },
    subCaption() {
      return this.tilesConfig?.map?.subCaption
        && translate(this.tile[this.tilesConfig.map.subCaption], this.i18n)
        || emptyValue;
    },
    isCaptionShow() {
      return !!this.tilesConfig?.map?.caption;
    },
    caption() {
      return this.tilesConfig?.map?.caption
        && translate(this.tile[this.tilesConfig.map.caption], this.i18n)
        || emptyValue;
    },
    isFooterTitleShow() {
      return !!this.tilesConfig?.map?.footerTitle;
    },
    footerTitle() {
      return this.tilesConfig?.map?.footerTitle
        && translate(this.tile[this.tilesConfig.map.footerTitle], this.i18n)
        || emptyValue;
    },
    isFooterCaptionShow() {
      return !!this.tilesConfig?.map?.footerCaption;
    },
    footerCaption() {
      return this.tilesConfig?.map?.footerCaption
        && translate(this.tile[this.tilesConfig.map.footerCaption], this.i18n)
        || emptyValue;
    },
    isImageShow() {
      return !!this.tilesConfig?.map?.image;
    },
    image() {
      return this.tilesConfig?.map?.image && this.tile[this.tilesConfig.map.image] || {};
    },
    isImg() {
      return this.image.src !== undefined;
    },
    imgSrc() {
      return this.image.src;
    },
    iconName() {
      return this.image.name;
    },
    iconColor() {
      return this.image.color;
    },
    iconSize() {
      return this.image.size || '24';
    },
    imageStyles() {
      const styles = {};
      if (this.image.backgroundColor) {
        styles.backgroundColor = `var(--${this.image.backgroundColor})`;
      }
      if (this.image.borderColor) {
        styles.borderColor = `var(--${this.image.borderColor})`;
      }
      if (this.image.size) {
        if (this.isImg && imgSizes[this.image.size]) {
          styles.width = imgSizes[this.image.size];
          styles.height = imgSizes[this.image.size];
        } else if (iconSizes[this.image.size]) {
          styles.width = iconSizes[this.image.size];
          styles.height = iconSizes[this.image.size];
        }
      }
      if (this.isImg) {
        styles.borderRadius = 0;
        styles.border = 'none';
      }
      return styles;
    },
    isActionsShow() {
      return !!this.tilesConfig?.map?.actions && this.tile[this.tilesConfig.map.actions]?.length > 0;
    },
    actions() {
      return this.tilesConfig?.map?.actions && this.tile[this.tilesConfig.map.actions] || [];
    },
    isIconsShow() {
      return !!this.tilesConfig?.map?.icons && this.tile[this.tilesConfig.map.icons]?.length > 0;
    },
    icons() {
      return this.tilesConfig?.map?.icons && this.tile[this.tilesConfig.map.icons] || [];
    }
  },
  methods: {
    iconStyles(icon) {
      if (icon.backgroundColor) {
        return { backgroundColor: `var(--${icon.backgroundColor})` };
      }
      return {};
    },
    handleAction(action) {
      this.$emit('command', action);
    },
    handleClick() {
      this.$emit('click-action', this.tile);
    },
    handleIconClick(icon) {
      if (icon.isClickable) {
        this.$emit('icon-click', { icon, tile: this.tile });
      }
    }
  }
};
</script>
