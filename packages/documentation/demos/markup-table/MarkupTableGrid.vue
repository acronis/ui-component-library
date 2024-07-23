<script setup>
</script>

<template>
  <div class="acv-table__wrapper">
    <table class="six-columns">
      <thead>
        <tr>
          <th><input type="checkbox"></th>
          <th>First Name - 1fr</th>
          <th>Last Name - 2fr</th>
          <th>PhD - max-content</th>
          <th>Occupation - min-max</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th><input type="checkbox"></th>
          <td>Sheldon</td>
          <td>Cooper</td>
          <td>Yes</td>
          <td>Physicist</td>
        </tr>
        <tr>
          <th><input type="checkbox"></th>
          <td>Leonard</td>
          <td>Hofstader</td>
          <td>Yes</td>
          <td>Physicist</td>
        </tr>
        <tr>
          <th><input type="checkbox"></th>
          <td>Rajesh</td>
          <td class="nowrap">
            KoothrappaliKoothrappaliKoothrappaliKoothrappaliKoothrappaliKoothrappaliKoothrappali
          </td>
          <td>Yes</td>
          <td>Astro-Physicist</td>
        </tr>
        <tr>
          <th><input type="checkbox"></th>
          <td>Howard</td>
          <td>Wolowitz</td>
          <td>No 😂</td>
          <td>Engineer</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.acv-table__wrapper {
  overflow: scroll;
  height: 200px;
}

table {
  display: grid;
}

table.six-columns {
  grid-template-columns: 64px 1fr minmax(max-content, 200px) max-content minmax(max-content, 100px);
}

thead {
  color: var(--acv-color-white);
  background-color: hsl(0deg 0% 66%);
  position: sticky;
  top: 0;
  z-index: var(--acv-z-index-normal);
}

th {
  text-align: left;
}

td, th {
  padding: 8px;
}

tbody > tr:hover {
  background-color: hsl(0deg 0% 94%);
}

tr > th:first-of-type {
  text-align: center;
}

tbody,
thead,
tr {
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
}

.nowrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
