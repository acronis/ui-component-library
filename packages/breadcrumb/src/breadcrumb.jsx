import { h } from 'vue';

import ElButton from 'packages/button';
import ElDropdown from 'packages/dropdown';
import ElDropdownItem from 'packages/dropdown-item';
import ElDropdownMenu from 'packages/dropdown-menu';
import ElIcon from 'packages/icon';
import ElBreadcrumbItem from 'packages/breadcrumb-item';

const isBreadcrumbItemVnode = (vnode) => vnode?.type?.name === 'ElBreadcrumbItem';

export default {
  name: 'ElBreadcrumb',

  components: {
    ElIcon,
    ElButton,
    ElBreadcrumbItem,
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem
  },

  provide() {
    return {
      elBreadcrumb: this
    };
  },

  props: {
    maxItems: Number,

    multiLine: {
      type: Boolean,
      default: false
    },

    separator: {
      type: String
    },

    separatorIcon: {
      type: String,
      default: 'i-chevron-right--16'
    }
  },

  computed: {
    rootClasses() {
      return {
        'el-breadcrumb': true,
        'is-multi-line': this.multiLine
      };
    }
  },

  async mounted() {
    this.setBreadcrumbItemsAttributes();
  },

  methods: {
    onDropdownItemClick(e) {
      const dropdownItem = e.currentTarget;
      const link = dropdownItem.querySelector('.el-breadcrumb__inner');
      if (!link) {
        return;
      }
      if (!link.contains(e.target)) {
        e.stopPropagation();
        link.click();
      }
    },

    renderItemLike(item, additionalItemClass) {
      const itemClass = `el-breadcrumb__item${additionalItemClass ? ` ${additionalItemClass}` : ''}`;

      return (
         <span class={itemClass}>
          { item }
          {this.separator
            ? <span class="el-breadcrumb__separator" role="presentation">{ this.separator }</span>
            : <el-icon name={this.separatorIcon} class="el-breadcrumb__separator"/>}
        </span>
      );
    },

    setBreadcrumbItemsAttributes() {
      // TODO move logic into breadcrumb-item
      const breadcrumbItems = this.$el.querySelectorAll('.el-breadcrumb__item');

      if (breadcrumbItems.length) {
        breadcrumbItems.forEach((el, index) => {
          const isLastBreadcrumbIndex = index === breadcrumbItems.length - 1;

          if (isLastBreadcrumbIndex) {
            el.setAttribute('aria-current', 'page');
            el.setAttribute('tabindex', -1);
          } else {
            // for tab focus behavior, <a/> is not tab focusable if href is empty
            el.setAttribute('tabindex', 0);
          }
        });
      }
    }
  },

  render() {
    const {
      maxItems,
      onDropdownItemClick,
      renderItemLike,
      rootClasses
    } = this;

    let childrenVNodes = this.$slots.default?.();

    const breadcrumbItemVNodes = childrenVNodes.filter(isBreadcrumbItemVnode);
    const truncateSize = breadcrumbItemVNodes.length - maxItems;

    const truncateBreadcrumbs = truncateSize > 0 && truncateSize <= breadcrumbItemVNodes.length - 2;

    // when truncate, at least 2 breadcrumb items will be shown
    if (truncateBreadcrumbs) {
      const hiddenVNodes = breadcrumbItemVNodes.slice(1, truncateSize + 1);

      const dropdownVnode = (
        <el-dropdown class="is-dropdown">
          <el-button type="ghost" size="small">
            <el-icon name="i-ellipsis-h--16"></el-icon>
          </el-button>
          <template v-slot:dropdown>
            <el-dropdown-menu class="el-breadcrumb__dropdown-menu">
              {
                hiddenVNodes.map(
                  (truncatedBreadcrumbItem) => h(
                    ElDropdownItem,
                    { onClick: onDropdownItemClick },
                    [truncatedBreadcrumbItem]
                  )
                )
              }
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      );

      childrenVNodes = [
        ...breadcrumbItemVNodes.slice(0, 1),
        ...[renderItemLike(dropdownVnode, 'is-dropdown')],
        ...breadcrumbItemVNodes.slice(truncateSize + 1)
      ];
    }

    childrenVNodes = childrenVNodes.map((vnode) => {
      const isBreadcrumbItem = isBreadcrumbItemVnode(vnode);
      if (isBreadcrumbItem) {
        return renderItemLike(vnode);
      }

      return vnode;
    });

    return h(
      'div',
      { ariaLabel: 'Breadcrumb', class: rootClasses, role: 'navigation' },
      childrenVNodes
    );
  }
};
