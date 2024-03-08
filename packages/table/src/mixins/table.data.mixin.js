import { mapStates } from 'packages/table/src/store/helper';

export default {
  props: {
    defaultSort: { type: Object, default: () => ({}) },
    data: { type: Array, default: () => [] }
  },
  computed: {
    ...mapStates({
      rawData: '__rawData',
      tableData: 'data',
      dataLength: 'dataLength'
    })
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(value) {
        value && this.store.commit('setData', value);

        if (this.$ready) {
          this.$nextTick(() => {
            for (let i = 0; i < this.selectedKeys.length; i++) {
              const rowKey = this.selectedKeys[i];
              if (!this.internalSelectedIds.includes(rowKey)) {
                this.internalSelectedIds.push(rowKey);
              }
            }
            const dataChanged = this.rawData !== value;

            this.updateExpandRows();

            this.doLayout();
            this.__calcSelection(dataChanged);
            this.updateBodyScrollbar();
          });
        }
      }
    }
  }
};
