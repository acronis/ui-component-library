<script setup>
  </script>

<template>
  <div>
    <acv-table row-key="id">
      <acv-table-column
        type="selection"
        border
      />
      <acv-table-column
        prop="date"
        label="Date"
        width="180"
      />
      <acv-table-column
        prop="name"
        label="Name"
        show-overflow-tooltip
        width="180"
      />
      <acv-table-column
        prop="address"
        label="Address"
        show-overflow-tooltip
      />
    </acv-table>
  </div>
</template>
