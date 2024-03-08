<template>
  <el-button
    class="qa-dialog-nested-button"
    @click="outerVisible = true"
  >
    Click me
  </el-button>

  <el-dialog
    v-model:visible="outerVisible"
    title="Outter Dialog"
    height-size="fixed-auto"
  >
    <el-dialog
      v-model:visible="innerVisible"
      title="Inner Dialog"
      height-size="fixed-auto"
      append-to-body
    >
      <div class="px-24 py-16">
        This is a message in Inner Dialog
      </div>
      <el-form :model="form">
        <el-form-item
          class="mx-24 mt-16"
          prop="name"
        >
          <el-input
            v-model="form.name"
            label="Name"
          />
        </el-form-item>
        <el-form-item
          class="mx-24"
          prop="region"
        >
          <el-input
            v-model="form.region"
            label="Region"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="secondary"
          @click="innerVisible = false"
        >
          Cancel
        </el-button>
        <el-button @click="innerVisible = false">
          Ok
        </el-button>
      </template>
    </el-dialog>
    <div class="px-24 py-16">
      This is a message in Outter Dialog
    </div>
    <el-form :model="form">
      <el-form-item
        class="mx-24 mt-16"
        prop="resource"
      >
        <el-input
          v-model="form.resource"
          label="Resource"
        />
      </el-form-item>
      <el-form-item
        class="mx-24"
        prop="desc"
      >
        <el-input
          v-model="form.desc"
          label="Desc"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button
        type="secondary"
        @click="outerVisible = false"
      >
        Cancel
      </el-button>
      <el-button @click="innerVisible = true">
        Open the inner Dialog
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import ElInput from 'packages/input';
import { ref, reactive } from 'vue';
const outerVisible = ref(false);
const innerVisible = ref(false);
const form = reactive({
  name: '',
  region: '',
  resource: '',
  desc: ''
});
</script>
