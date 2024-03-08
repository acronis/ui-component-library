<template>
  <div
    ref="table"
    class="el-table"
    :class="tableClassNames"
    :style="tableStyles"
  >
    <div
      ref="hiddenColumns"
      class="hidden-columns"
    >
      <slot />
    </div>

    <div
      v-if="showHeader"
      ref="headerWrapper"
      class="el-table__head_wrapper"
      @scroll="handleScroll"
    >
      <table-header
        ref="tableHeader"
        :store="store"
        :style="bodyWidth"
      />
    </div>

    <div
      ref="bodyWrapper"
      class="el-table__body_wrapper"
      :style="bodyHeight"
    >
      <el-scrollbar
        ref="bodyScrollbar"
        :offset="bodyScrollbarOffset"
        :axis="scrollbarAxis"
        @scroll="handleScroll"
      >
        <table-body
          ref="tableBody"
          :store="store"
          :height="bodyHeight"
          :width="bodyWidth"
          :trigger-rerender="triggerRerender"
        >
          <slot name="append">
            <div
              v-if="loadingAppend"
              class="el-table__append-loader"
              :style="appendLoaderHeight"
            >
              <el-loading
                size="32"
              />
            </div>
          </slot>
        </table-body>
        <div
          v-if="(!data || data.length === 0) && !cSkeleton"
          ref="emptyBlock"
          class="el-table__empty-block"
          :style="bodyWidth"
        >
          <span class="el-table__empty-text">
            <slot name="empty">{{ emptyText || t('el.table.emptyText') }}</slot>
          </span>
        </div>
      </el-scrollbar>
    </div>

    <div
      v-if="$slots.footer"
      ref="footerWrapper"
      class="el-table__footer_wrapper el-table--border-top"
      @scroll="handleScroll"
    >
      <div
        class="el-table__footer"
        :style="bodyWidth"
      >
        <slot
          name="footer"
          :columns="columns"
          :store="store"
        />
      </div>
    </div>

    <div
      v-show="resizeProxyVisible.header"
      ref="resizeProxyHeader"
      class="el-table__column-resize-proxy-header"
    />
    <div
      v-show="resizeProxyVisible.body"
      ref="resizeProxyBody"
      class="el-table__column-resize-proxy-body"
    />
    <el-tooltip
      v-show="tooltipReference"
      ref="tableTooltip"
      :reference="tooltipReference"
      :content="tooltipContent"
    />
  </div>
</template>

<script>
  import { debounce } from 'throttle-debounce';
  import normalizeWheel from 'normalize-wheel';
  import { addResizeListener, removeResizeListener } from '@/utils/resize-event';
  import Locale from '@/mixins/locale';
  import ElScrollbar from 'packages/scrollbar';
  import { isIE } from '@/utils/env';

  import { getInheritedBackgroundColor, getParentScrollableElement, RGBToHSL } from './table-utils';
  import TableHeader from './table-header';
  import TableBody from './table-body';
  import TableLayout from './table-layout';
  import { createStore } from './store/helper';
  import RowSelection from './mixins/table.selection.mixin';
  import RowExpand from './mixins/table.expand.mixin';
  import ColumnsMixin from './mixins/table.columns.mixin';
  import StateMixin from './mixins/table.state.mixin';
  import DataMixin from './mixins/table.data.mixin';
  import RowGroupsMixin from './mixins/table.rowGroups.mixin';

  import {
    ROW_HEIGHTS,
    APPEND_LOADER_HEIGHT,
    VIRTUAL_SCROLL_RENDER_TIMEOUT,
    BACKGROUND_PRESETS
  } from './table-constants';

  let tableIdSeed = 1;

  const fitOptions = ['fit', 'fit-scrollable', 'fit-viewport'];

  export default {
    name: 'ElTable',
    components: {
      ElScrollbar,
      TableHeader,
      TableBody
    },
    mixins: [
      Locale,
      RowSelection,
      RowExpand,
      ColumnsMixin,
      StateMixin,
      DataMixin,
      RowGroupsMixin
    ],
    props: {
      append: Boolean,
      backgroundColor: {
        type: String,
        validator(value) {
          return BACKGROUND_PRESETS.indexOf(value) !== -1;
        },
        default: 'solid-brand-lightest'
      },
      border: Boolean,
      borderVertical: Boolean,
      borderHorizontal: { type: Boolean, default: true },
      borderTop: Boolean,
      borderBottom: Boolean,
      cellClassName: [String, Function],
      cellStyle: [Object, Function],
      colReorderable: { type: Boolean, default: false },
      cols: Array,
      currentRowKey: [String, Number],
      customIcons: { type: Object, default: () => ({}) },
      data: { type: Array, default: () => [] },
      defaultSort: { type: Object, default: () => ({}) },
      emptyText: String,
      fit: { type: Boolean, default: true }, // whether width of column automatically fits its container
      headerRowClassName: [String, Function],
      headerRowStyle: [Object, Function],
      headerCellClassName: [String, Function],
      headerCellStyle: [Object, Function],
      height: [String, Number],
      highlightCurrentRow: Boolean,
      id: String,
      loadingAppend: {
        type: Boolean,
        default: false
      },
      maxHeight: [String, Number],
      perPage: { type: [String, Number], default: 10 },
      rowClassName: [String, Function],
      rowStyle: [Object, Function, String],
      rowKey: { type: [String, Function], required: true },
      scrollHorizontal: { type: Boolean, required: false, default: true },
      scrollVertical: { type: Boolean, required: false, default: true },
      showHeader: { type: Boolean, default: true },
      size: { type: String, validator(value) { return ['default', 'compact', 'medium'].indexOf(value) !== -1; }, default: 'default' },
      skeleton: { type: Boolean, default: false },
      stripe: Boolean,
      width: [String, Number],
      triggerRerender: {
        type: [String, Number, Boolean, Function],
        required: false,
        default: undefined
      },

      // Virtual scroll
      virtualScroll: {
        type: Boolean,
        default: true
      },
      virtualScrollRenderTimeout: {
        type: [Boolean, Number],
        default: VIRTUAL_SCROLL_RENDER_TIMEOUT
      },
      virtualRenderLimit: { type: Number, default: 100 },

      // Tooltip
      rowTooltipText: { type: [String, Function, Boolean], default: false }
    },
    data() {
      const store = createStore(this, {
        rowKey: this.rowKey
      });
      const layout = new TableLayout({
        store,
        table: this,
        fit: this.fit,
        showHeader: this.showHeader
      });
      this.appendLoaderHeight = {
        height: `${APPEND_LOADER_HEIGHT}px`
      };
      return {
        clientHeight: 0,
        clientWidth: 0,
        scrollLeft: 0,
        isScrollRight: false,
        isGroup: false,
        showFooter: false,
        layout,
        bgColor: null,

        // resize
        resizeProxyVisible: { header: false, body: false },
        dragging: false,
        resizeState: { width: null, height: null },

        rowHeight: ROW_HEIGHTS[this.size],
        sort: { key: this.defaultSort.prop || null, order: this.defaultSort.order || 'ascending' },
        store,

        tooltipReference: null,
        tooltipContent: null
      };
    },
    computed: {
      cSkeleton() {
        return this.skeleton || this.colReordering;
      },

      tableClassNames() {
        return {
          'el-table--bordered-vertical': this.hasBorderVertical,
          'el-table--bordered-horizontal': this.hasBorderHorizontal,
          'el-table--border-top': this.borderTop,
          'el-table--border-bottom': this.borderBottom,
          'el-table--enable-row-hover': !this.hasFixedColumns,
          'el-table--enable-row-transition': this.isRowTransitionEnabled,
          'el-table--fit': this.fit,
          'el-table--fluid-height': this.maxHeight,
          'el-table--scrollable-x': this.layout.scrollX,
          'el-table--scrollable-y': this.layout.scrollY,
          'el-table--group': this.isGroup,
          'el-table--striped': this.stripe,
          [`el-table--${this.tableSize}`]: this.size,
          [`el-table--bgcolor-${this.backgroundColor}`]: BACKGROUND_PRESETS.indexOf(this.backgroundColor) !== -1
        };
      },

      tableStyles() {
        if (!this.bgColor) return;

        const { h, s, l } = RGBToHSL(this.bgColor);

        return {
          '--table_bgcolor': this.bgColor,
          '--table_bgcolor-h': h,
          '--table_bgcolor-h-opposite': (h + 180) % 360,
          '--table_bgcolor-s': `${s}%`,
          '--table_bgcolor-l': `${l}%`
        };
      },

      withScroll() {
        // TODO calculate rendered and visible rows different way
        return this.dataLength > this.virtualRenderLimit;
      },

      withVirtualScroll() {
        return this.loadingAppend ? this.virtualScroll : this.virtualScroll && this.withScroll;
      },

      scrollbarAxis() {
        if (!this.scrollHorizontal && !this.scrollVertical
          || this.cSkeleton // disable scrolling if skeleton is enabled
        ) {
          return 'disabled';
        }

        if (!this.scrollHorizontal && this.scrollVertical) return 'y';
        if (this.scrollHorizontal && !this.scrollVertical) return 'x';
        return null;
      },

      tableSize() {
        return this.size || (this.$ELEMENT || {}).size;
      },

      bodyWrapper() {
        return this.$refs.bodyWrapper;
      },

      tableBody() {
        return this.$refs.tableBody;
      },

      recycleScroller() {
        return this.tableBody?.recycleScroller;
      },

      bodyScrollbarWrap() {
        return this.$refs.bodyScrollbar
          ? this.$refs.bodyScrollbar.$refs.wrap
          : null;
      },

      bodyScrollbarOffset() {
        return [0, this.layout.rightFixedWidth, 0, this.layout.fixedWidth];
      },

      shouldUpdateHeight() {
        return this.height || this.maxHeight;
      },

      bodyWidth() {
        const { bodyWidth } = this.layout;
        return {
          width: bodyWidth ? `${bodyWidth}px` : ''
        };
      },

      bodyHeight() {
        if (this.height) {
          return {
            height: this.layout.bodyHeight ? `${this.layout.bodyHeight}px` : this._defaultHeightLayoutPending
          };
        }
        if (this.maxHeight) {
          const maxHeight = this.showHeader
            ? this.maxHeight - this.layout.headerHeight - this.layout.footerHeight
            : this.maxHeight - this.layout.footerHeight;
          return {
            'max-height': `${maxHeight}px`,
            height: maxHeight <= this.layout.bodyHeight
              ? `${this.layout.bodyHeight}px`
              : this._defaultHeightLayoutPending
          };
        }
        if (this.withScroll && !this.append) {
          return {
            height: `${this.rowHeight * this.perPage}px`
          };
        }
        return {};
      },

      isFluidHeight() {
        return this.height === 'fit' || this.height === 'fit-scrollable'
          || this.maxHeight === 'fit' || this.maxHeight === 'fit-scrollable';
      },

      isViewportHeight() {
        return this.height === 'fit-viewport' || this.maxHeight === 'fit-viewport';
      },

      hasBorderVertical() {
        return this.border || this.isGroup || this.borderVertical;
      },

      hasBorderHorizontal() {
        return this.isGroup || this.borderHorizontal;
      },

      isRowTransitionEnabled() {
        return this.dataLength !== 0 && this.dataLength < 100;
      },

      requireStickyPolyfill() {
        return isIE;
      }
    },
    watch: {
      height: {
        immediate: true,
        handler(value) {
          this.layout.setHeight(value);
        }
      },

      maxHeight: {
        immediate: true,
        handler(value) {
          this.layout.setMaxHeight(value);
        }
      },

      rowKey: {
        // immediate: true,
        handler(value) {
          this.store.states.rowKey = value;
          this.store.commit('setData', this.data);
        }
      },

      showHeader: {
        immediate: true,
        handler(value) {
          this.layout.showHeader = value;
        }
      },

      showFooter: {
        handler() {
          this.doLayout();
        }
      },

      currentRowKey: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.store.setCurrentRowKey(newVal);
          }
        }
      }
    },
    created() {
      // Layout does not return computed table height immediately.
      // While waiting for layout, 0px should be used to prevent virtual rendering render full list.
      this._defaultHeightLayoutPending = this.withScroll ? '0px' : '';

      // for debouncing scroll-linked callbacks with requestAnimationFrame.
      this.scrollLeft = 0;
      this._scrollTop = 0;
      this._scrollHeight = 0;
      this._scrollWidth = 0;

      this.tableId = `el-table_${tableIdSeed++}`;
      this.debouncedUpdateLayout = debounce(50, () => this.doLayout());
      this.debouncedWheelListener = debounce(25, this.wheelListener);

      document.addEventListener('keydown', this.handleKeydown);
    },
    mounted() {
      this._fluidHeightContainer = getParentScrollableElement(this.$el);
      this.bindEvents();
      this.updateColumns();
      this.doLayout();
      this.addWheelListener();
      this.resizeState = {
        width: this.$el.offsetWidth,
        height: this.$el.offsetHeight
      };

      this.syncFixedColumns();
      this.$ready = true;

      if (this.border) {
        console.warn('WARN: border property is depreciated. Please use border-vertical instead');
      }
      if (this.height === 'fit' || this.maxHeight === 'fit') {
        console.warn('WARN: table height/max-height option "fit" is depreciated. Please use "fit-scrollable" or "fit-viewport" instead');
      }

      const { prop, order } = this.defaultSort;
      if (prop) {
        this.store.commit('sort', { prop, order, init: true });
      }

      if (!this.backgroundColor || this.backgroundColor === 'transparent-color') {
        this.bgColor = getInheritedBackgroundColor(this.$el);
      }
    },
    updated() {
      this.showFooter = !!this.$slots.footer;
    },
    beforeUnmount() {
      this.removeWheelListener();

      // destroy document-level event handlers
      document.removeEventListener('keydown', this.handleKeydown);
    },
    unmounted() {
      if (this.fit) {
        removeResizeListener(this.$el, this.resizeListener);
      }
      if (this.isFluidHeight) {
        removeResizeListener(this._fluidHeightContainer, this.resizeListener);
      }
    },
    methods: {
      updateWrapperScroll() {
        const { headerWrapper, footerWrapper, bodyScrollbar } = this.$refs;

        if (bodyScrollbar && bodyScrollbar.$refs.wrap) {
          bodyScrollbar.$refs.wrap.scrollTop = this._scrollTop;
        }

        if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
        if (footerWrapper) footerWrapper.scrollLeft = this.scrollLeft;
      },

      handleScroll(event) {
        const scrollWrapper = event.target;
        const horizontalScrollables = [
          this.bodyScrollbarWrap,
          this.$refs.headerWrapper,
          this.$refs.footerWrapper
        ];
        const verticalScrollables = [this.bodyScrollbarWrap];
        if (scrollWrapper && horizontalScrollables.indexOf(scrollWrapper) !== -1) {
          this.scrollLeft = scrollWrapper.scrollLeft;
        }
        if (verticalScrollables.indexOf(scrollWrapper) !== -1) {
          this._scrollTop = scrollWrapper.scrollTop;
        }
        if (scrollWrapper === this.bodyScrollbarWrap) {
          this._scrollHeight = scrollWrapper.scrollHeight;
          this._scrollWidth = scrollWrapper.scrollWidth;
          const clientHeight = scrollWrapper.clientHeight;
          const clientWidth = scrollWrapper.clientWidth;
          // TODO: emit the original event only?
          this.$emit(
            'scroll',
            this._scrollTop,
            this.scrollLeft,
            this._scrollHeight,
            this._scrollWidth,
            clientHeight,
            clientWidth,
            event
          );
        }

        this.syncFixedColumns(this.scrollLeft);
        this.updateWrapperScroll();
      },

      syncFixedColumns(scrollLeft = 0) {
        if (!this.requireStickyPolyfill && !this.rowsGroups.length) {
          return;
        }

        // TODO fix offsets with selectors like '.el-table__body .ie-sticky-polyfill-left'
        const leftSticky = this.$el.querySelectorAll('.ie-sticky-polyfill-left');
        const rightSticky = this.$el.querySelectorAll('.ie-sticky-polyfill-right');
        if (!leftSticky.length && !rightSticky.length) {
          return;
        }

        const scrollWidth = this.layout.bodyWidth;
        const clientWidth = this.$el.offsetWidth;

        let offsetRight = clientWidth - scrollWidth + scrollLeft;
        let offsetLeft = scrollLeft < 0 ? 0 : scrollLeft;

        // When a column is hidden, scrollWidth decreases so we need to
        // decrease scrollLeft too, but only until 0.
        if (scrollLeft + clientWidth > scrollWidth && scrollLeft > 0) {
          offsetLeft = Math.max(scrollWidth - clientWidth, 0);
          offsetRight = 0;
        }

        this.fixedOffsetRight = offsetRight;

        // TODO remove offset in row group headers
        for (let i = 0; i < leftSticky.length; i++) {
          const node = leftSticky[i];
          node.style.transform = `translateX(${offsetLeft}px)`;
        }
        for (let i = 0; i < rightSticky.length; i++) {
          const node = rightSticky[i];
          node.style.transform = `translateX(${offsetRight}px)`;
        }
      },

      getFixedOffsetParent() {
        return this.fixedOffsetRight;
      },

      handleKeydown(e) {
        if (e.target.tagName && e.target.tagName.toLowerCase() === 'body'
          && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
          e.preventDefault();
          const step = e.key === 'ArrowDown' ? 1 : -1;
          this.store.commit('moveCurrentRow', step, this.row);
        }
      },

      setCurrentRow(row) {
        this.store.commit('setCurrentRow', row);
      },

      clearSort() {
        this.store.clearSort();
      },

      async updateScrollY() {
        await this.$nextTick();
        this.layout.updateScrollY();
        this.layout.updateColumnsWidth();
      },

      updateBodyScrollbar() {
        if (this.$refs.bodyScrollbar?.update) {
          this.$refs.bodyScrollbar.update();
          this.$refs.bodyScrollbar.updateScrollPosition();
        }
      },

      bindEvents() {
        if (this.fit) {
          addResizeListener(this.$el, this.resizeListener);
        }
        if (this.isFluidHeight || this.isViewportHeight) {
          addResizeListener(this._fluidHeightContainer, this.resizeListener);
        }
      },

      resizeListener(entry) {
        if (!this.$ready) return;

        const cr = entry.contentRect;
        const { width: oldWidth, height: oldHeight } = this.resizeState;
        const { width, height } = cr;

        const shouldUpdateLayout = (oldWidth !== width)
          || (this.shouldUpdateHeight && (oldHeight !== height || this.isViewportHeight));

        if (shouldUpdateLayout) {
          this.resizeState.width = width;
          this.resizeState.height = height;
          this.doLayout();
          this.syncFixedColumns(this.scrollLeft);
        }
      },

      /**
       * Use wheel event for to control vertical scroll if there are fixed columns.
       */
      wheelListener(e) {
        const { pixelX, pixelY } = normalizeWheel(e);
        const direction = Math.abs(pixelX) >= Math.abs(pixelY) ? 'x' : 'y';
        if (direction === 'x') {
          e.preventDefault();
          this.bodyScrollbarWrap.scrollLeft += pixelX;

          this.isScrollRight = this.bodyScrollbarWrap.scrollWidth === (
            this.bodyScrollbarWrap.offsetWidth + this.bodyScrollbarWrap.scrollLeft
          );
        }
      },

      addWheelListener() {
        if (!this.bodyScrollbarWrap) return;
        this.bodyScrollbarWrap.addEventListener('wheel', this.debouncedWheelListener);
      },

      removeWheelListener() {
        this.bodyScrollbarWrap.removeEventListener('wheel', this.debouncedWheelListener);
      },

      doLayout() {
        this.layout.updateClientWidth();
        this.layout.updateColumnsWidth();
        if (this.shouldUpdateHeight) {
          this.layout.updateElsHeight();
        }

        if (fitOptions.some((option) => this.height === option)) {
          this.layout.setHeight(this.height);
        }
        if (fitOptions.some((option) => this.maxHeight === option)) {
          this.layout.setMaxHeight(this.maxHeight);
        }

        this.$nextTick(this.updateBodyScrollbar);
        this.$nextTick(this.updateWrapperScroll);
      },

      updateTableBody() {
        if (this.recycleScroller) {
          this.recycleScroller.updateItems();
        }
      },

      getRowTooltipText(row, rowIndex) {
        const { rowTooltipText } = this;

        return (typeof rowTooltipText === 'function')
          ? rowTooltipText.call(null, row, rowIndex)
          : rowTooltipText;
      },

      async showTooltip(reference, text) {
        if (!reference) return;

        this.tooltipReference = reference;
        this.tooltipContent = text;

        this.$refs.tableTooltip.show();
      },

      hideTooltip() {
        if (!this.$refs.tableTooltip) return;
        this.$refs.tableTooltip.hide();
      },

      // TODO use in table features or make row-key mandatory
      __assertRowKey() {
        const rowKey = this.rowKey;
        if (!rowKey) throw new Error('[ElTable] prop row-key is required');
      }
    }
  };
</script>
