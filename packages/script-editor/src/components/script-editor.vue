<script>
import monacoLoader from '../services/monaco-loader';
import { getFont } from '../../../../examples/utils/local-storage';

function noop() { }
export default {
  name: 'ElScriptEditor',
  props: {
    script: {
      type: String,
      require: true
    },
    language: {
      type: String,
      require: true
    },
    originalScript: {
      type: String,
      default: ''
    },
    originalLanguage: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'edit',
      validator: (value) => ['ro', 'diff', 'edit'].indexOf(value) !== -1
    },
    width: { type: [String, Number], default: '100%' },
    height: { type: [String, Number], default: '100%' },
    editorMounted: { type: Function, default: noop },
    editorBeforeMount: { type: Function, default: noop },
    assetsPath: {
      type: String,
      required: true
    }
  },
  computed: {
    style() {
      return {
        width: !/^\d+$/.test(this.width) ? this.width : `${this.width}px`,
        height: !/^\d+$/.test(this.height) ? this.height : `${this.height}px`
      };
    },
    options() {
      return {
        readOnly: this.mode !== 'edit',
        theme: 'vs',
        automaticLayout: true,
        overviewRulerLanes: 0,
        overviewRulerBorder: false,
        scrollBeyondLastLine: false,
        folding: true,
        foldingStrategy: 'indentation',
        minimap: {
          enabled: false
        },
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8
        },
        renderOverviewRuler: false,
        fontSize: 13,
        fontFamily: getFont()
      };
    },
    showDiff() {
      return this.mode === 'diff';
    }
  },
  watch: {
    language() {
      if (!this.editor) return;
      this.init();
    },

    script() {
      this.editor && this.script !== this._getValue() && this._setValue(this.script);
    },

    style() {
      this.editor && this.$nextTick(() => {
        this.editor.layout();
      });
    },

    showDiff() {
      if (!this.editor) return;
      this.init();
    }
  },
  beforeUnmount() {
    this.editor && this.editor.dispose();
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init() {
      try {
        await monacoLoader.ensureMonacoIsLoaded(this.assetsPath);
        this.initMonaco();
      } catch (e) {
        console.error('Failure during loading monaco editor:', e);
      }
    },
    initMonaco() {
      const {
        script,
        language,
        originalScript,
        options
      } = this;
      Object.assign(options, this._editorBeforeMount(window.monaco));
      if (this.editor) {
        this.editor.dispose();
      }
      this.setTheme();
      this.editor = window.monaco.editor[this.showDiff ? 'createDiffEditor' : 'create'](this.$el, {
        value: script,
        language: this.getLanguage(language),
        ...options
      });
      this.showDiff && this._setModel(this.script, originalScript);
      !this.showDiff && this._editorMounted(this.editor);
    },
    _getEditor() {
      if (!this.editor) return null;
      return this.showDiff ? this.editor.modifiedEditor : this.editor;
    },

    _setModel(value, original) {
      const { language, originalLanguage } = this;
      const originalModel = window.monaco.editor.createModel(original, this.getLanguage(originalLanguage));
      const modifiedModel = window.monaco.editor.createModel(value, this.getLanguage(language));
      this.editor.setModel({
        original: originalModel,
        modified: modifiedModel
      });
    },

    _setValue(value) {
      const editor = this._getEditor();
      if (!editor) return;
      if (editor) return editor.setValue(value);
    },

    _getValue() {
      const editor = this._getEditor();
      if (!editor) return '';
      return editor.getValue && editor.getValue();
    },
    _editorBeforeMount() {
      const options = this.editorBeforeMount(window.monaco);
      return options || {};
    },

    _editorMounted(editor) {
      this.editorMounted(editor, window.monaco);
      editor.onDidChangeModelContent(() => {
        const value = this._getValue();
        const decorations = editor.getModel().getAllDecorations();
        this._emitChange(value, !decorations.filter(this.isError).map((e) => e).length);
      });
    },

    _emitChange(value, isValid) {
      this.$emit('change', value, isValid);
    },

    isError(decorations) {
      return decorations.options.className && decorations.options.className.includes('squiggly-error');
    },

    getLanguage(language) {
      return (language === 'BASH' ? 'SHELL' : language).toLowerCase();
    },
    setTheme() {
      this.$el.style.height = this.style.height;
      this.$el.style.width = this.style.width;
      const scrollbarColor = window.getComputedStyle(document.body).getPropertyValue('--av-scroll-thumb');
      window.monaco.editor.defineTheme('acronisTheme', {
        base: 'vs',
        inherit: true,
        rules: [
          {
            background: scrollbarColor
          }
        ],
        colors: {
          'scrollbarSlider.background': scrollbarColor,
          'scrollbarSlider.hoverBackground': scrollbarColor,
          'scrollbarSlider.activeBackground': scrollbarColor
        }
      });
    }
  },
  render(createElement) {
    return createElement('div', {
      attrs: {
        class: 'monaco_editor_container'
      }
    });
  }
};
</script>
