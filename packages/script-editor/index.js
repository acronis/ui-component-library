import ElScriptEditor from './src/components/script-editor.vue';


ElScriptEditor.install = function (Vue) {
  Vue.component(ElScriptEditor.name, ElScriptEditor);
};

export default ElScriptEditor;
