import ElDropdownItem from '../dropdown/src/dropdown-item.vue';


ElDropdownItem.install = function (Vue) {
  Vue.component(ElDropdownItem.name, ElDropdownItem);
};

export default ElDropdownItem;
