<script setup>
  import { ref } from 'vue';

  const model = ref([
    {
      id: 1,
      email: 'valid@email.com'
    },
    {
      id: 2,
      email: ''
    },
    {
      id: 3,
      text: ''
    }
  ]);

  // const rules = ref({
  //   email: {
  //     validator: (_, value, callback) => {
  //       if (!/^[\w.!#$%&’*+/=?^`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*$/i.test(value)) {
  //         callback('Incorrect email address format. Please use a valid email address.');
  //       }
  //     }
  //   }
  // });
</script>

<template>
  <PreviewGroup>
    <Preview
      name="always-display-error = true (Default)"
      span="12"
    >
      <acv-table
        row-key="id"
        :data="model"
        :default-sort="{ prop: 'url', order: 'descending' }"
        border-bottom
      >
        <acv-table-column
          label="email Validator"
          class="alwaysDisplayError-column"
        >
          <!--          <template #default="scope"> -->
          <!--            <div> -->
          <!--              <acv-form -->
          <!--                :model="scope.row" -->
          <!--                :rules="rules" -->
          <!--              > -->
          <!--                <acv-form-item prop="email"> -->
          <!--                  <acv-input -->
          <!--                    v-model="scope.row.email" -->
          <!--                    :value="scope.row.email" -->
          <!--                    size="small" -->
          <!--                    type="string" -->
          <!--                  /> -->
          <!--                </acv-form-item> -->
          <!--              </acv-form> -->
          <!--            </div> -->
          <!--          </template> -->
        </acv-table-column>
      </acv-table>
    </Preview>
  </PreviewGroup>
</template>
