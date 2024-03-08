<template>
  <colgroup class="el-table__columns">
    <col
      v-for="(column, cid) in columns"
      :ref="'col'+cid"
      :key="cid"
      class="el-table__column"
      :name="column.id"
      :style="{width: `${column.realWidth || column.width || column.minWidth}px`}"
    />
  </colgroup>
</template>

<script>
export default {
  name: 'ElTableColumns',
  props: {
    columns: Array
  }
};
</script>
