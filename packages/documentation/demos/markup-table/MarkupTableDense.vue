<script setup>
  import MarkupTable from '@/components/markup-table/markupTable.vue';
</script>

<template>
  <MarkupTable dense>
    <thead>
      <tr>
        <th class="acv-text--align-left">
          Id
        </th>
        <th class="acv-text--align-left">
          First name
        </th>
        <th class="acv-text--align-right">
          Last name
        </th>
        <th class="acv-text--align-right">
          Gender
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="acv-text--align-left">
          1
        </td>
        <td class="acv-text--align-left">
          Aldon
        </td>
        <td class="acv-text--align-right">
          Dibnah
        </td>
        <td class="acv-text--align-right">
          Male
        </td>
      </tr>
      <tr>
        <td class="acv-text--align-left">
          2
        </td>
        <td class="acv-text--align-left">
          Nikos
        </td>
        <td class="acv-text--align-right">
          Godbald
        </td>
        <td class="acv-text--align-right">
          Non-binary
        </td>
      </tr>
      <tr>
        <td class="acv-text--align-left">
          3
        </td>
        <td class="acv-text--align-left">
          Eclair
        </td>
        <td class="acv-text--align-right">
          Pietruszka
        </td>
        <td class="acv-text--align-right">
          Female
        </td>
      </tr>
      <tr>
        <td class="acv-text--align-left">
          4
        </td>
        <td class="acv-text--align-left">
          Jacky
        </td>
        <td class="acv-text--align-right">
          Stanfield
        </td>
        <td class="acv-text--align-right">
          Female
        </td>
      </tr>
      <tr>
        <td class="acv-text--align-left">
          5
        </td>
        <td class="acv-text--align-left">
          Frank
        </td>
        <td class="acv-text--align-right">
          Traise
        </td>
        <td class="acv-text--align-right">
          Male
        </td>
      </tr>
    </tbody>
  </MarkupTable>
</template>
