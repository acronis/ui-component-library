<script>
  import { AcvOption, AcvSelect } from '@/components';

  export default {
    components: {
      AcvSelect,
      AcvOption
    },
    data() {
      const objectValues = [
        {
          label: 'Avengers',
          value: {
            'Captain America': 'Steven "Steve" Rogers',
            'Iron man': 'Anthony "Tony" Edward Stark',
            'Hulk': 'Dr. Robert Bruce Banner',
            'Black Panther': 'T\'Challa'
          }
        },
        {
          label: 'Justice League',
          value: {
            'Superman': 'Clark Kent',
            'Batman': 'Bruce Wayne',
            'Wonder Woman': 'Diana Prince',
            'Aquaman': 'Arthur Curry',
            'Green Lantern': 'Hal Jordan',
            'The Flash': 'Barry Allen'
          }
        },
        {
          label: 'X-Men',
          value: {
            'Professor X': 'Charles Francis Xavier',
            'Cyclops': 'Scott Summers',
            'Iceman': 'Robert Louis "Bobby" Drake',
            'Wolverine': { fullName: { firstName: 'James', lastName: 'Howlett' }, name: 'Logan' },
            'Storm': 'Ororo Monroe',
            'Beast': 'Henry Philip "Hank" McCoy'
          }
        }
      ];
      const arrayValues = [
        {
          label: 'Avengers',
          value: [
            'Captain America',
            'Iron man',
            'Hulk',
            'Black Panther'
          ]
        },
        {
          label: 'Justice League',
          value: [
            'Superman',
            'Batman',
            'Wonder Woman',
            'Aquaman',
            'Green Lantern',
            'The Flash'
          ]
        },
        {
          label: 'X-Men',
          value: [
            'Professor X',
            'Cyclops',
            'Iceman',
            { fullName: { firstName: 'James', lastName: 'Howlett' }, name: 'Logan', nickname: 'Wolverine' },
            'Storm',
            'Beast'
          ]
        }
      ];
      return {
        objectValuesModel: {},
        objectValuesModelMultiple: {},
        arrayValuesModel: [],
        arrayValuesModelMultiple: [],
        objectPredefinedValuesModel: objectValues[1].value,
        arrayPredefinedValuesModel: arrayValues[2].value,
        objectValues,
        arrayValues
      };
    }
  };
</script>

<template>
  <PreviewGroup>
    <Preview
      name="Object"
      span="12"
    >
      <div class="value-json-preview">
        {{ objectValuesModel }}
      </div>
      <AcvSelect
        v-model="objectValuesModel"
        label="Select a team to protect the World"
      >
        <AcvOption
          v-for="(item, key) in objectValues"
          :key="key"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
    <Preview
      name="Object with Predefined Value"
      span="12"
    >
      <div class="value-json-preview">
        {{ objectPredefinedValuesModel }}
      </div>
      <AcvSelect
        v-model="objectPredefinedValuesModel"
        label="Select a team to protect the World"
      >
        <AcvOption
          v-for="(item, key) in objectValues"
          :key="key"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>

    <Preview
      name="Array"
      span="12"
    >
      <div class="value-json-preview">
        {{ arrayValuesModel }}
      </div>
      <AcvSelect
        v-model="arrayValuesModel"
        label="Select a team to protect the World"
      >
        <AcvOption
          v-for="(item, key) in arrayValues"
          :key="key"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>

    <Preview
      name="Array with Predefined Value"
      span="12"
    >
      <div class="value-json-preview">
        {{ arrayPredefinedValuesModel }}
      </div>
      <AcvSelect
        v-model="arrayPredefinedValuesModel"
        label="Select a team to protect the World"
      >
        <AcvOption
          v-for="(item, key) in arrayValues"
          :key="key"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>

    <Preview
      name="Object multiple"
      span="12"
    >
      <div class="value-json-preview">
        {{ objectValuesModelMultiple }}
      </div>
      <AcvSelect
        v-model="objectValuesModelMultiple"
        multiple
        label="Select a team to protect the World"
      >
        <AcvOption
          v-for="(item, key) in objectValues"
          :key="key"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>

    <Preview
      name="Array multiple"
      span="12"
    >
      <div class="value-json-preview">
        {{ arrayValuesModelMultiple }}
      </div>
      <AcvSelect
        v-model="arrayValuesModelMultiple"
        multiple
        label="Select a team to protect the World"
      >
        <AcvOption
          v-for="(item, key) in arrayValues"
          :key="key"
          :label="item.label"
          :value="item.value"
        />
      </AcvSelect>
    </Preview>
  </PreviewGroup>
</template>
