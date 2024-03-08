<script lang="jsx">
  import ElDialog from 'packages/dialog';
  import ElScrollbar from 'packages/scrollbar';
  import ElIcon from 'packages/icon';
  import ElButton from 'packages/button';

  const generateAddedClassNode = (vnodes, classStr) => vnodes.map((vnode) => {
  vnode.data = vnode.data || {};
  vnode.data.class = vnode.data.class || {};
  vnode.data.class[classStr] = true;
  return vnode;
});

  export default {
  name: 'ElAboutWindow',

  components: {
    ElDialog,
    ElScrollbar,
    ElIcon,
    ElButton
  },

  props: {
    title: {
      type: String
    },
    visible: {
      type: Boolean
    },
    message: {
      type: String
    },
    isErrorMessage: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    }
  },

  emits: ['update:visible', 'close', 'open'],

  computed: {
    aboutVisible: {
      set(newValue) {
        this.$emit('update:visible', newValue);
      },
      get() {
        return this.visible;
      }
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.$emit('open');
      } else {
        this.$emit('close');
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    renderLogo() {
      if (this.$slots.logo) {
        return (
            <div class="el-about-window__logo">
              { generateAddedClassNode(this.$slots.logo(), 'el-about-window__logo-image') }
            </div>
        );
      }
      return '';
    },
    renderTitleSection() {
      if (this.title || this.$slots.versions) {
        const titleContent = this.title
          ? (
              <div class="el-text el-text--display-large">
                {this.title}
              </div>
          ) : '';
        let versionsContent = '';
        if (this.$slots.versions) {
          versionsContent = (
              <div class="el-about-window__versions">
                { generateAddedClassNode(this.$slots.versions(), 'el-about-window__version') }
              </div>
          );
        }
        return (
            <div class="el-about-window__section">
              {titleContent}
              {versionsContent}
            </div>
        );
      }
    },
    renderMessageSection() {
      const messageStyle = { class: { 'is-error': this.isErrorMessage } };
      if (this.message || this.$slots.actions) {
        const messageContent = this.message
          ? (
              <div class="el-about-window__message" {...messageStyle}>
                {this.message}
              </div>
          ) : '';
        const actionsContent = this.$slots.actions() || '';
        return (
            <div class="el-about-window__section">
              {messageContent}
              {actionsContent}
            </div>
        );
      }
    },
    renderLinks() {
      let linksContent = '';
      if (this.$slots.links) {
        linksContent = (
            <div class="el-about-window__links">
              { generateAddedClassNode(this.$slots.links(), 'el-about-window__link') }
            </div>
        );
      }
      return linksContent;
    }
  },

  render() {
    const dialogAttr = {
      ref: 'dialog',
      props: {
        variant: 'clean',
        widthSize: 'small',
        heightSize: 'fixed-auto',
        visible: this.aboutVisible,
        appendToBody: this.appendToBody,
        closeOnClickModal: this.closeOnClickModal,
        closeOnPressEscape: this.closeOnPressEscape,
        modal: this.modal,
        modalAppendToBody: this.modalAppendToBody
      },
      on: { 'update:visible': ($event) => { this.aboutVisible = $event; } }
    };
    if (this.customClass) dialogAttr.props.customClass = this.customClass;
    return (
          <el-dialog class="el-about-window" {...dialogAttr}>
            <div class="el-about-window__content">
              {this.renderLogo()}
              {this.renderTitleSection()}
              {this.renderMessageSection()}
              {this.renderLinks()}
            </div>
          </el-dialog>
    );
  }
};
</script>
