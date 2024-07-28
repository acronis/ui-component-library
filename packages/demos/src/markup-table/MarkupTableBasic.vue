<script setup>
  import MarkupTable from '@/components/markup-table/markupTable.vue';
</script>

<template>
  <MarkupTable>
    <thead>
      <tr>
        <th class="text-left">
          Id
        </th>
        <th class="text-right">
          First name
        </th>
        <th class="text-right">
          Last name
        </th>
        <th class="text-right">
          Gender
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-left">
          1
        </td>
        <td class="text-left">
          Aldon
        </td>
        <td class="text-right">
          Dibnah
        </td>
        <td class="text-right">
          Male
        </td>
      </tr>
      <tr>
        <td class="text-left">
          2
        </td>
        <td class="text-left">
          Nikos
        </td>
        <td class="text-right">
          Godbald
        </td>
        <td class="text-right">
          Non-binary
        </td>
      </tr>
      <tr>
        <td class="text-left">
          3
        </td>
        <td class="text-left">
          Eclair
        </td>
        <td class="text-right">
          Pietruszka
        </td>
        <td class="text-right">
          Female
        </td>
      </tr>
      <tr>
        <td class="text-left">
          4
        </td>
        <td class="text-left">
          Jacky
        </td>
        <td class="text-right">
          Stanfield
        </td>
        <td class="text-right">
          Female
        </td>
      </tr>
      <tr>
        <td class="text-left">
          5
        </td>
        <td class="text-left">
          Frank
        </td>
        <td class="text-right">
          Traise
        </td>
        <td class="text-right">
          Male
        </td>
      </tr>
    </tbody>
  </MarkupTable>
</template>
