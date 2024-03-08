import ElTableColumn from '../table/src/table-columns.vue';


ElTableColumn.install = function (Vue) {
  Vue.component(ElTableColumn.name, ElTableColumn);
};

export default ElTableColumn;
