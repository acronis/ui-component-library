<template>
  <div class="el-file-tree">
      <el-tree
        ref="fileTree"
        node-key="path"
        :key="activeMenuIndex"
        :load="loadNode"
        show-checkbox
        render-after-expand
        lazy
        highlight
        :root-indent="24"
        :check-on-click-node="false"
        :expand-when-checked="false"
        :emit-current-change-only-on-leaf="false"
        @node-click="handleNodeClick"
        @check="handleNodeCheck"
      >
        <template #default="{ node, data }">
          <slot name="default" :node="node" :data="data">
            <div class="el-tree-node__file-tree el-text el-text--caption el-text--ellipsis">
              <slot
                name="node-label"
                :label="node.label"
                :node="node"
                :data="data"
              >
                <span class="el-tree-node__label">
                  {{ node.label }}
                </span>
              </slot>

              <template v-if="selectedNodeId === node.id">
                <slot name="node-actions" :node="node" :data="data">
                  <el-dropdown
                    placement="bottom-end"
                    @visible-change="handleVChange"
                  >
                    <slot name="node-dropdown-button" :node="node" :data="data">
                      <el-button
                        class="btn-actions"
                        type="ghost"
                        icon="i-ellipsis-h--16"
                        @click.stop
                      />
                    </slot>

                    <template #dropdown>
                      <slot name="node-dropdown-menu" :node="node" :data="data">
                        <el-dropdown-menu :max-height="250">
                          <el-dropdown-item
                            v-if="canShowCreateAction(data)"
                            @select="
                              handleSelectFileAction(FileActions.Create, node)
                            "
                          >
                            {{ t('el.filebrowser.filetree.dropdown.create') }}
                          </el-dropdown-item>

                          <template v-if="canShowRenameAndDeleteActions(data)">
                            <el-dropdown-item
                              @select="
                                handleSelectFileAction(FileActions.Rename, node)
                              "
                            >
                              {{ t('el.filebrowser.filetree.dropdown.rename') }}
                            </el-dropdown-item>

                            <el-dropdown-item
                              @select="
                                handleSelectFileAction(FileActions.Delete, node)
                              "
                            >
                              {{ t('el.filebrowser.filetree.dropdown.delete') }}
                            </el-dropdown-item>
                          </template>
                        </el-dropdown-menu>
                      </slot>
                    </template>
                  </el-dropdown>
                </slot>
              </template>

              <template v-else-if="getNodeFileSize(node) && size">
                <slot
                  name="node-size"
                  :value="getNodeFileSize(node)"
                  :node="node"
                  :data="data"
                >
                  <span>{{ getNodeFileSize(node) }}</span>
                </slot>
              </template>
            </div>
          </slot>
        </template>
      </el-tree>
  </div>
</template>

<script>
import Locale from '@/mixins/locale';
import ElDropdown from 'packages/dropdown';
import ElDropdownItem from 'packages/dropdown-item';
import ElDropdownMenu from 'packages/dropdown-menu';
import ElTree from 'packages/tree';
import ElButton from 'packages/button';

import {
  FileActions,
  FileType,
  fileTypeIconMapper,
  fileSizeTranslatorService,
  trimEndsPathSeparators,
  expandNode
} from '../util';

export default {
  name: 'ElFileTree',
  data() {
    return {
      rootNode: null,
      rootLoading: false,
      nodeLoading: false,
      selectedNodeId: 0,
      fileSize: null,
      isActionMenuActive: false
    };
  },
  components: {
    ElDropdown,
    ElDropdownItem,
    ElDropdownMenu,
    ElButton,
    ElTree
  },
  mixins: [Locale],
  props: {
    fileItemsLoader: {
      type: Function,
      required: true
    },
    searchNodeKey: {
      type: String,
      default: ''
    },
    size: {
      type: Boolean,
      default: true
    },
    activeMenuIndex: {
      type: String,
      required: true
    }
  },
  watch: {
    activeMenuIndex() {
      this.$emit('unloaded');
    }
  },
  beforeUnmount() {
    this.$emit('unloaded');
  },
  created() {
    this.fileSize = fileSizeTranslatorService(this.t.bind(this));
    this.FileActions = FileActions;
    this.$root.$on('tree-node-enter', (node) => {
      if (!this.isActionMenuActive) {
        this.selectedNodeId = node.id;
      }
    });
    this.$root.$on('tree-node-leave', () => {
      if (!this.isActionMenuActive) {
        this.selectedNodeId = 0;
      }
    });
  },
  methods: {
    handleVChange(b) {
      if (b) {
        this.isActionMenuActive = true;
      } else {
        this.isActionMenuActive = false;
        this.selectedNodeId = 0;
      }
    },

    selectFileAction(action, node) {
      this.$emit('file-action', {
        action,
        node,
        data: node.data
      });
    },

    async loadNode(node, resolve) {
      const isLeafNode = !!node.data?.isLeaf;
      let treeItems = [];

      if (node.level > 0 && isLeafNode) {
        resolve(treeItems);
        return;
      }

      try {
        if (node.level === 0) {
          this.rootLoading = true;
        } else {
          this.nodeLoading = true;
        }
        const result = await this.fileItemsLoader(node);

        if (result) {
          treeItems = this.transformFileItemsToTreeItems(result, node);
        }
      } catch (error) {
        this.$emit('error', error);
      } finally {
        this.rootLoading = false;
        this.$emit('loaded');
        this.nodeLoading = false;

        if (node.level === 0) {
          this.rootNode = node;
        }
      }

      resolve(treeItems);
    },

    transformFileItemsToTreeItems(fileItems) {
      return fileItems.map((fileItem) => {
        const { ...fileItemProps } = fileItem;

        return {
          ...fileItemProps,
          label: fileItem.name,
          path:
            fileItem.fileType === FileType.regular
              ? fileItem.path
              : `${fileItem.path}\\`.replace(/\\{1,500}$/, '\\'),
          icon: fileTypeIconMapper(fileItem.fileType),
          isLeaf: fileItem.fileType === FileType.regular,
          hasChildren: fileItem.fileType !== FileType.regular,
          disabled: false
        };
      });
    },

    transformPathToNodeKeys(path) {
      const folderNames = trimEndsPathSeparators(path).split(/\\+/);
      const rootFolder = folderNames.shift() || '';

      if (rootFolder) {
        return folderNames.reduce(
          (nodeKeys, folderName) => {
            nodeKeys.push(`${nodeKeys[nodeKeys.length - 1] + folderName}\\`);
            return nodeKeys;
          },
          [`${rootFolder}\\`]
        );
      }

      return [];
    },

    getNodeFileSize(node) {
      const size = node.data?.size || 0;
      const totalSize = node.data?.totalSize || 0;

      if (Number(size) !== size) {
        return '';
      }
      if (Number(totalSize) !== totalSize) {
        return '';
      }

      switch (node.data.fileType) {
        case FileType.removableDrive:
        case FileType.fixedDrive:
        case FileType.cdromDrive:
          return this.fileSize(size, 'global.unit.gb', false, true, totalSize);
        case FileType.regular:
          return this.fileSize(size);
        case FileType.directory:
        case FileType.junction:
          return this.fileSize(size, '', true);
        default:
          return '';
      }
    },

    getNode(data) {
      return this.rootNode?.store.getNode(data) || null;
    },

    canShowCreateAction(data) {
      return (
        data.fileType !== FileType.regular && data.fileType !== FileType.none
      );
    },

    canShowRenameAndDeleteActions(data) {
      return (
        data.fileType === FileType.regular
        || data.fileType === FileType.directory
      );
    },

    handleSelectFileAction(action, node) {
      this.$emit('tree-action', action, node);
      this.selectFileAction(action, node);
    },

    handleNodeCheck() {
      this.$emit('tree-node-check', this.$refs.fileTree.getCheckedKeys());
    },

    handleNodeClick(data) {
      if (data?.fileType !== FileType.regular) {
        this.$emit('tree-node-click', data.path);
      }
    },

    updateCurrentKey(currentKey) {
      if (currentKey !== this.$refs.fileTree.getCurrentKey()) {
        this.$refs.fileTree.setCurrentKey(currentKey);
      }
    },

    async searchNodes(searchPath) {
      const searchNodeKeys = this.transformPathToNodeKeys(searchPath);
      const expandedNodes = await this.expandSearchNodes(searchNodeKeys);

      const lastFoundNode = expandedNodes[expandedNodes.length - 1] || null;
      const searchIsSuccessful = searchNodeKeys.length === expandedNodes.length;

      if (lastFoundNode) {
        this.updateCurrentKey(lastFoundNode.data?.path || '');
        if (searchIsSuccessful) {
          return true;
        }
      }

      return false;
    },

    async expandSearchNodes(expandNodeKeys) {
      const expandNodes = async (nodeKeys, parentNode) => {
        const expandedNodes = [];

        const currentNodeKey = trimEndsPathSeparators(
          nodeKeys.shift() || ''
        ).toLowerCase();
        const currentNode = parentNode?.childNodes.find((childNode) => {
            return (
              trimEndsPathSeparators(childNode.data.path).toLowerCase()
              === currentNodeKey
            );
          }) || null;

        if (currentNode) {
          if (nodeKeys.length > 0) {
            await expandNode(currentNode);
          }

          return expandedNodes.concat(
            currentNode,
            await expandNodes(nodeKeys, currentNode)
          );
        }
        return expandedNodes;
      };

      return expandNodes([...expandNodeKeys], this.rootNode);
    },

    async navigate(searchPath) {
      return this.searchNodes(searchPath);
    }
  }
};
</script>
