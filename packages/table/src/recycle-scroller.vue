<template>
  <div
    v-observe-visibility="handleVisibilityChange"
    class="el-recycle-scroller"
    :class="{
      'is-ready': ready,
      [`is-direction-${direction}`]: true,
    }"
  >
    <div
      v-if="$slots.before"
      class="el-recycle-scroller__slot"
    >
      <slot
        name="before"
      />
    </div>

    <div
      ref="wrapper"
      :style="{ [direction === 'vertical' ? 'minHeight' : 'minWidth']: totalSize + 'px' }"
      class="el-recycle-scroller__item-wrapper"
    >
      <div
        v-for="view of pool"
        :ref="'view'+view.nr.id"
        :key="view.nr.id"
        :style="ready ? { transform: `translate${direction === 'vertical' ? 'Y' : 'X'}(${view.position}px)` } : null"
        class="el-recycle-scroller__item-view"
      >
        <slot
          :item="view.item"
          :index="view.nr.index"
          :active="view.nr.used"
        />
      </div>
    </div>

    <div
      v-if="$slots.after"
      class="el-recycle-scroller__slot"
    >
      <slot
        name="after"
      />
    </div>
  </div>
</template>

<script>
  // https://github.com/Akryum/vue-virtual-scroller
  import { supportsPassive } from '@/utils/env';
  import { ObserveVisibility } from 'vue-observe-visibility';

  const config = {
    itemsLimit: 1000
  };

  let uid = 0;

  export default {
    name: 'RecycleScroller',

    directives: {
      ObserveVisibility
    },

    props: {
      items: {
        type: Array,
        required: true
      },
      getScrollParent: {
        type: Function,
        required: true
      },
      buffer: {
        type: Number,
        default: 200
      },
      direction: {
        type: String,
        default: 'vertical',
        validator: (value) => ['vertical', 'horizontal'].includes(value)
      },
      emitUpdate: {
        type: Boolean,
        default: false
      },
      getItemKey: {
        type: Function
      },
      itemSize: {
        type: Number,
        default: null
      },
      minItemSize: {
        type: [Number, String],
        default: null
      },
      sizeField: {
        type: String,
        default: 'size'
      },
      typeField: {
        type: String,
        default: 'type'
      },
      fixedItemPosition: {
        type: Boolean,
        default: true
      },
      triggerRerender: {
        type: [String, Number, Boolean, Function],
        required: false,
        default: undefined
      }
    },

    data() {
      return {
        pool: [],
        totalSize: 0,
        ready: false,
        maxItemSize: 0
      };
    },
    computed: {
      sizes() {
        if (this.itemSize === null) {
          const sizes = {
            '-1': { accumulator: 0 }
          };
          const { items, sizeField: field, minItemSize } = this;
          let computedMinSize = 10000;
          let accumulator = 0;
          let current;
          for (let i = 0, l = items.length; i < l; i++) {
            current = items[i][field] || minItemSize;
            if (current < computedMinSize) {
              computedMinSize = current;
            }
            accumulator += current;
            sizes[i] = { accumulator, size: current };
          }

          // eslint-disable-next-line
          this.$_computedMinItemSize = computedMinSize;
          return sizes;
        }
        return [];
      },
      bufferZoneSize() {
        if (this.fixedItemPosition) {
          return this.buffer;
        }

        return this.maxItemSize <= this.buffer ? this.buffer : (this.maxItemSize + this.buffer);
      }
    },
    watch: {
      triggerRerender: {
        handler() {
          this.$nextTick(() => {
            this.handleTriggerRerenderUpdate();
          });
        }
      },
      items() {
        this.handleItemsUpdate();
      },
      sizes: {
        handler() {
          this.updateVisibleItems(false);
        },
        deep: true
      }
    },
    created() {
      this.$_startIndex = 0;
      this.$_endIndex = 0;
      this.$_views = new Map();
      this.$_unusedViews = new Map();
      this.$_scrollDirty = false;
      this.$_lastUpdateScrollPosition = 0;
    },
    mounted() {
      this.addListeners();
      this.$nextTick(() => {
        this.updateVisibleItems(true);
        this.ready = true;
      });
    },
    beforeUnmount() {
      this.removeListeners();
    },
    methods: {
      handleTriggerRerenderUpdate() {
        this.updateVisibleItems(false);
      },
      handleItemsUpdate() {
        this.updateVisibleItems(true);
      },
      addView(pool, index, item, key, type) {
        const view = {
          item,
          position: 0
        };
        const nonReactive = {
          id: uid++,
          index,
          used: true,
          key,
          type
        };
        Object.defineProperty(view, 'nr', {
          configurable: false,
          value: nonReactive
        });
        pool.push(view);
        return view;
      },
      unuseView(view, fake = false) {
        const unusedViews = this.$_unusedViews;
        const type = view.nr.type;
        let unusedPool = unusedViews.get(type);
        if (!unusedPool) {
          unusedPool = [];
          unusedViews.set(type, unusedPool);
        }
        unusedPool.push(view);
        if (!fake) {
          view.nr.used = false;
          view.position = -9999;
          this.$_views.delete(view.nr.key);
        }
      },
      handleResize() {
        if (this.ready) this.updateVisibleItems(false);
      },
      handleScroll() {
        if (!this.$_scrollDirty) {
          this.$_scrollDirty = true;
          requestAnimationFrame(() => {
            this.$_scrollDirty = false;
            const { continuous } = this.updateVisibleItems(false, true);
            // It seems sometimes chrome doesn't fire scroll event :/
            // When non continuous scrolling is ending, we force a refresh
            if (!continuous) {
              clearTimeout(this.$_refreshTimout);
              this.$_refreshTimout = setTimeout(this.handleScroll, 100);
            }
            if (!this.fixedItemPosition) {
              setTimeout(this.updateItems, 100);
            }
          });
        }
      },
      handleVisibilityChange(isVisible, entry) {
        if (this.ready) {
          if (isVisible || entry.boundingClientRect.width !== 0 || entry.boundingClientRect.height !== 0) {
            this.$emit('visible');
            requestAnimationFrame(() => {
              this.updateVisibleItems(false);
            });
          } else {
            this.$emit('hidden');
          }
        }
      },
      updateVisibleItems(checkItem, checkPositionDiff = false) {
        const {
          $_unusedViews: unusedViews,
          $_views: views,
          $_computedMinItemSize: minItemSize,
          getItemKey,
          items,
          itemSize,
          pool,
          sizes,
          typeField,
          unuseView,
          addView,
          getScroll,
          bufferZoneSize: buffer
        } = this;
        const count = items.length;
        let startIndex;
        let endIndex; // it's "last item index + 1"
        let totalSize;

        if (!count) {
          startIndex = 0;
          endIndex = 0;
          totalSize = 0;
        } else {
          const scroll = getScroll();


          // Skip update if use hasn't scrolled enough
          if (checkPositionDiff) {
            let positionDiff = scroll.start - this.$_lastUpdateScrollPosition;
            if (positionDiff < 0) positionDiff = -positionDiff;
            if ((itemSize === null && positionDiff < minItemSize) || positionDiff < itemSize) {
              return {
                continuous: true
              };
            }
          }
          this.$_lastUpdateScrollPosition = scroll.start;

          scroll.start -= buffer;
          scroll.end += buffer;
          // Variable size mode
          if (itemSize === null) {
            let h;
            let a = 0;
            let b = count - 1;
            // eslint-disable-next-line no-bitwise
            let i = ~~(count / 2);
            let oldI;
            // Searching for startIndex
            do {
              oldI = i;
              h = sizes[i].accumulator;
              if (h < scroll.start) {
                a = i;
              } else if (i < count - 1 && sizes[i + 1].accumulator > scroll.start) {
                b = i;
              }
              // eslint-disable-next-line no-bitwise
              i = ~~((a + b) / 2);
            } while (i !== oldI);
            i < 0 && (i = 0);
            startIndex = i;
            // For container style
            totalSize = sizes[count - 1].accumulator;
            // Searching for endIndex
            for (endIndex = i; endIndex < count && sizes[endIndex].accumulator < scroll.end; endIndex++);
            if (endIndex === -1) {
              endIndex = items.length - 1;
            } else {
              endIndex++;
              // Bounds
              endIndex > count && (endIndex = count);
            }
          } else {
            // Fixed size mode
            // eslint-disable-next-line no-bitwise
            startIndex = ~~(scroll.start / itemSize);
            endIndex = Math.ceil(scroll.end / itemSize);
            const viewsCount = endIndex - startIndex;
            const lastIndex = count - 1;

            // Bounds
            if (startIndex >= lastIndex - viewsCount) {
              startIndex = lastIndex - viewsCount;
              endIndex = count;
            }
            if (startIndex < 0) {
              startIndex = 0;
            }
            if (endIndex > count) {
              endIndex = count;
            }

            totalSize = count * itemSize;
          }
        }
        if (endIndex - startIndex > config.itemsLimit) {
          this.itemsLimitError();
        }
        this.totalSize = totalSize;
        let view;
        const continuous = startIndex <= this.$_endIndex && endIndex >= this.$_startIndex;
        let unusedIndex;
        if (this.$_continuous !== continuous) {
          if (continuous) {
            views.clear();
            unusedViews.clear();
            for (let i = 0, l = pool.length; i < l; i++) {
              view = pool[i];
              unuseView(view);
            }
          }
          this.$_continuous = continuous;
        } else if (continuous) {
          const checkViewItem = (item) => (
            getItemKey
              ? getItemKey(item) === getItemKey(view.item)
              : item === view.item
          );
          for (let i = 0, l = pool.length; i < l; i++) {
            view = pool[i];
            if (view.nr.used) {
              // Update view item index
              if (checkItem) {
                view.nr.index = items.findIndex(checkViewItem);
              }
              // Check if index is still in visible range
              if (
                view.nr.index === -1
                || view.nr.index < startIndex
                || view.nr.index >= endIndex
              ) {
                unuseView(view);
              }
            }
          }
        }
        if (!continuous) {
          unusedIndex = new Map();
        }
        let item;
        let type;
        let unusedPool;
        let v;
        for (let i = startIndex; i < endIndex; i++) {
          item = items[i];
          let key = item;
          if (getItemKey) {
            key = getItemKey(item);
            if (!key) {
              if (item.id) {
                key = item.id;
              } else {
                key = item;
              }
            }
          }
          if (key == null) {
            throw new Error(`Key is ${key} on item ${item}`);
          }
          view = views.get(key);
          if (!itemSize && !sizes[i].size) {
            if (view) unuseView(view);
            continue;
          }
          // No view assigned to item
          if (!view) {
            type = item[typeField] || 'default';
            unusedPool = unusedViews.get(type);

            if (continuous) {
              // Reuse existing view
              if (unusedPool && unusedPool.length) {
                view = unusedPool.pop();
                view.item = item;
                view.nr.used = true;
                view.nr.index = i;
                view.nr.key = key;
                view.nr.type = type;
              } else {
                view = this.addView(pool, i, item, key, type);
              }
            } else {
              // Use existing view
              // We don't care if they are already used
              // because we are not in continuous scrolling
              v = unusedIndex.get(type) || 0;

              if (!unusedPool || v >= unusedPool.length) {
                view = addView(pool, i, item, key, type);
                unuseView(view, true);
                unusedPool = unusedViews.get(type);
              }

              view = unusedPool[v];
              view.item = item;
              view.nr.used = true;
              view.nr.index = i;
              view.nr.key = key;
              view.nr.type = type;
              unusedIndex.set(type, v + 1);
              v++;
            }
            views.set(key, view);
          } else {
            view.nr.used = true;
            view.item = item;
          }
          // Update position
          if (itemSize === null) {
            view.position = sizes[i - 1].accumulator;
          } else {
            const viewPosition = i * itemSize;
            if (this.fixedItemPosition) {
              view.position = viewPosition;
            } else {
              const prevItem = items[i - 1];
              const prevKey = getItemKey
                ? prevItem && getItemKey(prevItem) ? getItemKey(prevItem) : prevItem
                : prevItem;
              const prevView = prevKey && views.get(prevKey);
              const prevViewPosition = prevView?.position || 0;
              const prevViewItem = prevView && this.$refs?.[`view${prevView.nr.id}`];
              const prevViewHeight = prevViewItem?.[0]?.clientHeight;

              if (viewPosition && prevViewHeight) {
                if (prevViewHeight > this.maxItemSize) {
                  this.maxItemSize = prevViewHeight;
                }
                view.position = prevViewPosition + prevViewHeight;
              } else {
                view.position = viewPosition;
              }
            }
          }
        }
        this.$_startIndex = startIndex;
        this.$_endIndex = endIndex;
        if (this.emitUpdate) this.$emit('update', startIndex, endIndex);

        return {
          continuous
        };
      },
      getListenerTarget() {
        let target = this.getScrollParent();
        // Fix global scroll target for Chrome and Safari
        if (window.document && (target === window.document.documentElement || target === window.document.body)) {
          target = window;
        }
        return target;
      },
      getScroll() {
        const scrollEl = this.getScrollParent();

        return {
          start: scrollEl.scrollTop,
          end: scrollEl.scrollTop + scrollEl.clientHeight
        };
      },
      addListeners() {
        this.listenerTarget = this.getListenerTarget();
        this.listenerTarget.addEventListener('scroll', this.handleScroll, supportsPassive ? {
          passive: true
        } : false);
        this.listenerTarget.addEventListener('resize', this.handleResize);
      },
      removeListeners() {
        if (!this.listenerTarget) {
          return;
        }
        this.listenerTarget.removeEventListener('scroll', this.handleScroll);
        this.listenerTarget.removeEventListener('resize', this.handleResize);
        this.listenerTarget = null;
      },
      scrollToItem(index) {
        let scroll;
        if (this.itemSize === null) {
          scroll = index > 0 ? this.sizes[index - 1].accumulator : 0;
        } else {
          scroll = index * this.itemSize;
        }
        this.scrollToPosition(scroll);
      },
      scrollToPosition(position) {
        if (this.direction === 'vertical') {
          this.$el.scrollTop = position;
        } else {
          this.$el.scrollLeft = position;
        }
      },
      itemsLimitError() {
        setTimeout(() => {
          console.log('It seems the scroller element isn\'t scrolling, so it tries to render all the items at once.', 'Scroller:', this.$el);
          console.log('Make sure the scroller has a fixed height (or width) and \'overflow-y\' (or \'overflow-x\') set to \'auto\' so it can scroll correctly and only render the items visible in the scroll viewport.');
        });
        throw new Error('Rendered items limit reached');
      },
      updateItems() {
        if (!this.fixedItemPosition) {
          this.$nextTick(() => {
            this.updateVisibleItems(false);
          });
        }
      }
    }
  };
</script>
