<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :visible="opened"
      append-to-body
      class="file-action-dialog"
      @open="onInit"
      @close="handleCloseDialog"
    >
      <!-- create action -->
      <div
        v-if="FileActions && action === FileActions.Create"
        class="px-24 pb-24 pt-8"
      >
        <el-input
          ref="folderName"
          v-model="newName"
          placeholder="Folder name"
          class="mt-16"
        />
      </div>

      <!-- rename action -->
      <div
        v-if="FileActions && action === FileActions.Rename"
        class="px-24 pb-24 pt-16"
      >
        <div>
          {{ t('el.filebrowser.dialog.body.rename') }}
          {{
            currentType === this.regularFileType
              ? t('el.filebrowser.dialog.body.file')
              : t('el.filebrowser.dialog.body.folder')
          }}
          <span class="el-text--weight-bold">{{ `${currentName}?` }}</span>
        </div>

        <el-input
          ref="newName"
          v-model="newName"
          :placeholder="currentName"
          class="mt-16"
        />
      </div>

      <!-- delete action -->
      <div v-if="FileActions && action === FileActions.Delete" class="pa-24">
        {{ t('el.filebrowser.dialog.body.delete') }}
        {{
          currentType === this.regularFileType
            ? t('el.filebrowser.dialog.body.file')
            : t('el.filebrowser.dialog.body.folder')
        }}
        <span class="el-text--weight-bold">{{ `${currentName}.` }}</span>
        {{ t('el.filebrowser.dialog.body.deleteWarning') }}
      </div>

      <template #footer>
        <el-button type="secondary" @click="handleCloseDialog">
          {{ t('el.filebrowser.dialog.button.cancel') }}
        </el-button>

        <el-button :disabled="confirmButtonDisabled" @click="handleConfirm">
          {{ confirmButtonText }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Locale from '@/mixins/locale';
import ElButton from 'packages/button';
import ElDialog from 'packages/dialog';
import ElInput from 'packages/input';
import { FileActions, FileType } from '../util';

export default {
  name: 'ElFileActionsDialog',
  data() {
    return {
      newName: '',
      regularFileType: FileType.regular
    };
  },
  components: {
    ElButton,
    ElDialog,
    ElInput
  },
  mixins: [Locale],
  props: {
    opened: {
      type: Boolean,
      default: false
    },
    action: {
      type: String,
      default: FileActions.Create,
      validator(value) {
        return Object.values(FileActions).indexOf(value) !== -1;
      }
    },
    currentName: {
      type: String,
      default: ''
    },
    currentType: {
      type: String,
      default: ''
    }
  },

  created() {
    this.FileActions = FileActions;
  },

  computed: {
    dialogTitle() {
      switch (this.action) {
        case FileActions.Delete:
          return `${this.t('el.filebrowser.dialog.delete')}`;
        case FileActions.Rename:
          return `${this.t('el.filebrowser.dialog.rename')}`;
        case FileActions.Create:
        default:
          return `${this.t('el.filebrowser.dialog.create')}`;
      }
    },

    confirmButtonText() {
      switch (this.action) {
        case FileActions.Delete:
          return `${this.t('el.filebrowser.dialog.button.delete')}`;
        case FileActions.Rename:
          return `${this.t('el.filebrowser.dialog.button.rename')}`;
        case FileActions.Create:
        default:
          return `${this.t('el.filebrowser.dialog.button.create')}`;
      }
    },

    confirmButtonDisabled() {
      return (
        this.action !== FileActions.Delete
        && (!this.newName || this.newName.length === 0)
      );
    }
  },

  methods: {
    onInit() {
      this.newName = '';

      if (this.action === FileActions.Rename) {
        this.newName = this.currentName;

        this.$nextTick(() => {
          this.$refs.newName.focus();
        });
      }

      if (this.action === FileActions.Create) {
        this.$nextTick(() => {
          this.$refs.folderName.focus();
        });
      }
    },

    handleCloseDialog() {
      this.$emit('close');
    },

    handleConfirm() {
      this.$emit('confirm', this.newName);
    }
  }
};
</script>
