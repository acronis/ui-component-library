<template>
  <div>
    <el-dialog
      v-model:visible="isVisible"
      class="el-file-browser"
      :modal="false"
      :title="title"
      :width-size="dialogWidth"
      height-size="fixed-auto"
      hide-footer-when-empty
      @close="handleCancelClick"
    >
      <template
        v-if="menuItems.length"
        #aside
      >
        <el-menu
          :default-active="activeMenuIndex"
          type="secondary"
          scroll-into-expanded
          @select="handleMenuSelect"
        >
          <el-menu-item
            v-for="(menuItem, index) in menuItems"
            :key="menuItem.name"
            :index="index.toString()"
          >
            <template #icon>
              <el-icon
                :name="menuItem.icon"
                size="32"
              />
            </template>

            <template #title>
              {{ menuItem.name }}
            </template>
          </el-menu-item>
        </el-menu>
      </template>
      <div
        v-show="isError"
        class="el-file-browser__error-overlay"
      >
        <div class="el-empty-screen__wrapper">
          <div class="el-empty-screen">
            <slot
              name="empty-screen"
              :active-menu-index="activeMenuIndex"
            />
          </div>
        </div>
      </div>
      <div
        v-show="!isFileTreeLoaded"
        class="el-file-browser__loading-overlay"
      >
        <div class="el-empty-screen__wrapper">
          <div class="el-empty-screen">
            <div
              v-loading="true"
              class="loading-wrapper my-16"
              color="brand-light"
              el-loading-size="48"
            />
            <div
              class="
                el-empty-screen__description
                el-text el-text--body-24
                mb-16
              "
            >
              {{ t('el.filebrowser.loadingText') }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-show="isFileTreeLoaded && !isError"
        class="el-file-browser__main"
      >
        <div class="el-file-browser__search-wrapper px-24 pt-24 pb-8">
          <el-form
            ref="searchForm"
            :model="searchForm.form"
          >
            <el-form-item
              prop="searchForm"
              display-error-always
              :error="searchForm.error.fileSearchPath"
            >
              <el-input
                v-model="searchForm.form.fileSearchPath"
                :placeholder="searchPlaceholder"
                :suffix-icon="inputIcon"
                size="small"
                :on-icon-click="resetSearchField"
                @keyup.enter="handleEnterKeyUp"
              >
                <template #suffix>
                  <slot name="suffix">
                    <el-spinner
                      v-if="isSearching"
                    />
                  </slot>
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <slot name="search-description" />
        </div>
        <file-tree
          ref="fileTree"
          :file-items-loader="fileItemsLoader"
          :size="size"
          :active-menu-index="activeMenuIndex"
          @tree-node-check="handleTreeNodeCheck"
          @tree-node-click="handleTreeNodeClick"
          @tree-action="handleTreeAction"
          @loaded="handeFileTreeLoaded"
          @unloaded="handeFileTreeUnloaded"
          @error="handeFileTreeError"
        />
      </div>
      <template #footer>
        <el-button
          v-if="isFileTreeLoaded && !isError"
          type="secondary"
          @click="handleCancelClick"
        >
          {{ t('el.filebrowser.footer.buttonCancel') }}
        </el-button>
        <el-button
          v-if="isFileTreeLoaded && !isError"
          :disabled="!checkedKeys.length"
          @click="handleSelectClick"
        >
          {{ addButtonText || t('el.filebrowser.footer.buttonSelect') }}
        </el-button>
      </template>
    </el-dialog>
    <div @click="isVisible = true">
      <slot>
        <el-button>{{ t('el.filebrowser.buttonOpen') }}</el-button>
      </slot>
    </div>
    <file-actions-dialog
      :opened="!!fileActionData"
      :action="selectedAction"
      :current-name="selectedFileName"
      :current-type="selectedFileType"
      @close="closeFileActionDialog"
      @confirm="onActionConfirmed"
    />
  </div>
</template>

<script>
import Locale from '@/mixins/locale';
import Loading from 'packages/loading/src/directive';
import ElButton from 'packages/button';
import ElIcon from 'packages/icon';
import ElInput from 'packages/input';
import ElDialog from 'packages/dialog';
import ElSpinner from 'packages/spinner';
import ElMenuItem from 'packages/menu-item';
import ElMenu from 'packages/menu';
import ElForm from 'packages/form';
import ElFormItem from 'packages/form-item';
import FileActionsDialog from './file-actions-dialog.vue';
import FileTree from './file-tree.vue';
import {
  FileActions,
  FileType,
  fileTypeIconMapper,
  replaceLast,
  replaceKeys,
  localFolderPathRegex
} from '../util';

export default {
  name: 'ElFileBrowser',
  components: {
    FileTree,
    ElButton,
    ElIcon,
    ElDialog,
    ElInput,
    ElForm,
    ElFormItem,
    ElSpinner,
    ElMenuItem,
    ElMenu,
    FileActionsDialog
  },
  directives: {
    loading: Loading
  },
  mixins: [Locale],
  props: {
    filesApi: {
      type: Object,
      required: true
    },
    searchPlaceholder: {
      type: String,
      default: ''
    },
    menuItems: {
      type: Array,
      default: () => []
    },
    defaultMenuIndex: {
      type: String,
      default: ''
    },
    size: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      required: true
    },
    addButtonText: {
      type: String,
      default: ''
    },
    notAvailableTitle: {
      type: String,
      default: 'Not available'
    },
    notAvailableDescription: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedNode: null,
      selectedNodeKey: '',
      checkedNodeKeys: [],
      checkedKeys: [],
      fileActionData: null,
      isVisible: false,
      isSearching: false,
      isError: false,
      isFileTreeLoaded: false,
      activeMenuIndex: '0',
      searchForm: {
        form: {
          fileSearchPath: ''
        },
        error: {
          fileSearchPath: ''
        }
      }
    };
  },
  computed: {
    dialogWidth() {
      return this.menuItems.length ? 'large' : 'medium';
    },

    inputIcon() {
      return this.searchForm.form.fileSearchPath
        ? 'i-times--16'
        : 'i-long-arrow-right--16';
    },

    selectedAction() {
      return this.fileActionData
        ? this.fileActionData.action
        : FileActions.Create;
    },

    selectedFileName() {
      return this.fileActionData ? this.fileActionData.data.label : '';
    },

    selectedFileType() {
      return this.fileActionData ? this.fileActionData.data.fileType : '';
    }
  },
  created() {
    if (this.defaultMenuIndex && this.menuItems.length) {
      this.activeMenuIndex = this.defaultMenuIndex;
    }
  },
  methods: {
    handeFileTreeError() {
      this.isError = true;
    },

    handleMenuSelect(index) {
      this.activeMenuIndex = index;
    },

    handeFileTreeLoaded() {
      this.isFileTreeLoaded = true;
    },

    handeFileTreeUnloaded() {
      this.isError = false;
      this.isFileTreeLoaded = false;
    },

    async handleEnterKeyUp() {
      let inputErrorMsg = '';
      if (!localFolderPathRegex.test(this.searchForm.form.fileSearchPath)) {
        inputErrorMsg = this.t('el.filebrowser.error.invalidPath');
      } else {
        this.isSearching = true;
        const navigationOutcome = await this.$refs.fileTree.navigate(
          this.searchForm.form.fileSearchPath
        );
        if (!navigationOutcome) {
          inputErrorMsg = this.t('el.filebrowser.error.pathNotFound');
        }
        this.isSearching = false;
      }
      this.searchForm.error = {
        fileSearchPath: inputErrorMsg
      };
    },

    handleTreeAction(action, node) {
      this.fileActionData = {
        action,
        node,
        data: node.data
      };
    },

    handleTreeNodeCheck(keys) {
      this.checkedKeys = keys;
    },

    resetSearchField() {
      this.$refs.searchForm.clearValidate();
      this.$refs.searchForm.resetFields();
      this.searchForm.error.fileSearchPath = '';
      this.searchForm.form.fileSearchPath = '';
    },

    handleTreeNodeClick(path) {
      this.resetSearchField();
      this.searchForm.form.fileSearchPath = path;
    },

    async fileItemsLoader(node) {
      return this.filesApi.loadFileItems(node.data?.path, this.activeMenuIndex);
    },

    closeFileActionDialog() {
      this.fileActionData = null;
    },

    async onActionConfirmed(name) {
      if (!this.fileActionData) return;

      const pathSpec = {
        root: this.fileActionData.root,
        path: this.fileActionData.data.path
      };

      switch (this.fileActionData.action) {
        case FileActions.Create:
          await this.createTreeItem(
            pathSpec,
            name,
            this.fileActionData.node,
            this.activeMenuIndex
          );
          break;
        case FileActions.Rename: {
          pathSpec.path = this.fileActionData.node.parent?.data?.path || '';
          await this.renameTreeItem(
            pathSpec,
            name,
            this.fileActionData.node,
            this.activeMenuIndex
          );
          break;
        }
        case FileActions.Delete:
          await this.deleteTreeItem(
            pathSpec,
            this.fileActionData.node,
            this.activeMenuIndex
          );
          break;
        default:
          return;
      }

      this.closeFileActionDialog();
    },

    async createTreeItem(parentPathSpec, name, node, menuIndex) {
      try {
        const newNode = {
          label: name,
          path: `${node.data.path}${name}\\`,
          fileType: FileType.directory,
          icon: fileTypeIconMapper(FileType.directory),
          isLeaf: false,
          hasChildren: false,
          size: 0,
          disabled: false
        };

        await this.filesApi.createItem(parentPathSpec, name, menuIndex);
        node.store.append(newNode, node.data);

        if (node.checked) {
          node.setChecked(true, true);
        }

        node.expand(() => {
          this.selectedNodeKey = newNode.path;
        });
      } catch (error) {
        this.$notify.error(error);
      }
    },

    async renameTreeItem(parentPathSpec, newName, node, menuIndex) {
      try {
        const newPath = replaceLast(node.data.path, node.data.label, newName);
        const parentNode = node.parent;

        await this.filesApi.renameItem(
          parentPathSpec,
          node.data.path,
          newPath,
          menuIndex
        );

        node.store.insertBefore(
          {
            ...node.data,
            label: newName,
            path: newPath
          },
          node.data
        );
        node.store.remove(node.data);

        this.$nextTick(() => {
          this.checkedNodeKeys = replaceKeys(
            this.checkedNodeKeys,
            node.data.path,
            newPath
          );

          if (node.checked) {
            parentNode?.childNodes
              .find((childNode) => childNode.data.path === newPath)
              ?.setChecked(true, true);
          }
        });

        this.selectedNodeKey = newPath;
      } catch (error) {
        this.$notify.error(error);
        throw error;
      }
    },

    async deleteTreeItem(pathSpec, node, menuIndex) {
      try {
        const parentNode = node.parent;
        const parentPath = node.parent?.data?.path || '';

        delete this.checkedNodeKeys[this.checkedNodeKeys.indexOf(node.data.path)];

        await this.filesApi.deleteItem(pathSpec, menuIndex);
        node.store.remove(node.data);

        this.$nextTick(() => {
          if (
            parentNode
            && parentNode.childNodes.length > 0
            && parentNode.childNodes.every((childNode) => childNode.checked)
          ) {
            this.checkedNodeKeys = this.checkedNodeKeys.filter(
              (checkedKey) => !checkedKey.startsWith(parentPath)
            );
            this.checkedNodeKeys.push(parentPath);
          } else if (parentNode?.childNodes.length === 0) {
            parentNode.setChecked(false, true);
          }
        });

        this.selectedNodeKey = parentPath;
      } catch (error) {
        this.checkedNodeKeys.push(node.data.path);
        this.$notify.error(error);
      }
    },

    handleCancelClick() {
      this.handleClose();
      this.$emit('close');
    },

    handleSelectClick() {
      this.handleClose();
      this.$emit('select', this.checkedKeys);
    },

    handleClose() {
      this.resetSearchField();
      this.isVisible = false;
      this.checkedNodeKeys = [];
      this.checkedKeys = [];
    }
  }
};
</script>
