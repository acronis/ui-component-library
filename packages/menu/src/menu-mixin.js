export default {
  computed: {
    indexPath() {
      const path = [this.index];
      let parent = this.$parent;
      while (parent.$options.componentName !== 'ElMenu') {
        /* istanbul ignore else */
        if (parent.index) {
          path.unshift(parent.index);
        }
        parent = parent.$parent;
      }
      return path;
    },
    rootMenu() {
      let parent = this.$parent;
      while (
        parent
        && parent.$options.componentName !== 'ElMenu'
      ) {
        parent = parent.$parent;
      }
      return parent;
    },
    parentMenu() {
      let parent = this.$parent;
      while (
        parent
        && ['ElMenu', 'ElSubmenu'].indexOf(parent.$options.componentName) === -1
      ) {
        parent = parent.$parent;
      }
      return parent;
    },
    isRoot() {
      return !['ElSubmenu', 'ElMenuGroup'].includes(this.$parent?.$options?.name);
    }
  }
};
