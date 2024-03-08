<template>
  <div class="el-pagination">
    <pager
      :current-page="internalCurrentPage"
      :page-count="internalPageCount"
      :total="totalPages"
      @change="handleCurrentChange"
    />
    <el-dropdown
      split-button
      type="secondary"
      :class="{ 'mr-8': $slots.default }"
      @click="handleCurrentChange(totalPages)"
    >
      {{ totalPages }}
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="index in Math.ceil(total / pageSize)"
            :key="`dropdown-item-${index}`"
            @click="handleCurrentChange(index)"
          >
            {{ index }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <slot />
  </div>
</template>

<script>
  import ElDropdown from 'packages/dropdown';
  import ElDropdownMenu from 'packages/dropdown-menu';
  import ElDropdownItem from 'packages/dropdown-item';
  import Pager from './pager.vue';

  export default {
    name: 'ElPagination',

    components: {
      ElDropdown,
      ElDropdownMenu,
      ElDropdownItem,
      Pager
    },

    props: {
      pageSize: {
        type: Number,
        default: 10
      },
      total: Number,
      pageCount: {
        type: Number,
        default: 5
      },
      currentPage: {
        type: Number,
        default: 1
      },
      popperClass: String
    },

    data() {
      return {
        internalCurrentPage: 1,
        internalPageSize: 0
      };
    },

    computed: {
      internalPageCount() {
        const total = Math.ceil(this.total / this.internalPageSize);
        return this.pageCount > total ? total : this.pageCount;
      },

      totalPages() {
        return Math.ceil(this.total / this.pageSize);
      }
    },

    watch: {
      currentPage: {
        immediate: true,
        handler(val) {
          this.internalCurrentPage = val;
        }
      },

      pageSize: {
        immediate: true,
        handler(val) {
          this.internalPageSize = val;
        }
      },

      internalCurrentPage(newValue) {
        this.internalCurrentPage = newValue;
        this.$emit('current-change', this.internalCurrentPage);
      }
    },

    methods: {
      handleCurrentChange(val) {
        this.internalCurrentPage = val;
      }
    }
  };
</script>
