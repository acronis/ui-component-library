import ElForm from './src/form.vue';


ElForm.install = function (app) {
  app.component(ElForm.name, ElForm);
};

export default ElForm;
