<template>
  <ul
    class="el-pager"
    @click="onPagerClick"
    @keydown.enter="onPagerClick"
    @mousedown="isClicked = true"
    @blur="isClicked = true"
    @keyup.tab="isClicked = false"
  >
    <li
      v-for="pager in pagers"
      :key="`pager-item-${pager}`"
      tabindex="0"
      :class="[
        'el-pager__item',
        { 'is-active': currentPage === pager },
        { 'is-clicked': isClicked }
      ]"
    >
      {{ pager }}
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'ElPager',

    props: {
      currentPage: Number,
      pageCount: Number,
      total: Number
    },

    data() {
      return {
        isClicked: false
      };
    },

    computed: {
      pagers() {
        const array = [];
        for (let i = 1; i <= this.total; i++) {
          array.push(i);
        }

        const pageCountHalf = this.pageCount * 0.5;
        if (this.currentPage >= this.total - pageCountHalf) {
          return array.slice(-this.pageCount);
        }
        if (this.currentPage <= pageCountHalf) {
          return array.slice(0, this.pageCount);
        }
        return array.slice(
          this.currentPage - Math.round(pageCountHalf),
          this.currentPage + Math.floor(pageCountHalf)
        );
      }
    },

    methods: {
      onPagerClick(event) {
        const target = event.target;
        const newPage = Number(event.target.textContent);
        const currentPage = this.currentPage;
        if (newPage !== currentPage && target.tagName === 'LI') {
          this.$emit('change', newPage);
        }
        target.blur();
      }
    }
  };
</script>
