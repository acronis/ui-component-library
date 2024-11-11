<script setup>
  import { AcvCode } from '@acronis-platform/ui-component-library';

  const code = `from pymatgen.core import Lattice, Structure
from rolos_sdk import Dataframe, DataStorageInterface, DataStorageType, RawObject, TableColumn
from rolos_sdk.structures.object.pymatgen import PyMatGenObject

table_schema = [
    TableColumn(name="Index", type=int),
    TableColumn(name="Test", type=float),
    TableColumn(name="Structure", type=PyMatGenObject),
    TableColumn(name="Raw experiment data", type=RawObject),
]`;
</script>

<template>
  <AcvCode :code="code" />
</template>
