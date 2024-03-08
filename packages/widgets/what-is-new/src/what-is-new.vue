<template>
  <el-dialog
    ref="dialog"
    class="el-whatisnew-window"
    :visible="visible"
    :append-to-body="appendToBody"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :modal="modal"
    :modal-append-to-body="modalAppendToBody"
    :custom-class="customClass"
    variant="clean-basic"
    height-size="fixed-auto"
    @close="handleClose"
  >
    <div class="el-whatisnew-window__content">
      <whatisnew-info
        ref="whatisnewInfo"
        :items="items"
        :back-button-text="cBackButtonText"
        :next-button-text="cNextButtonText"
        :finish-button-text="finishButtonText"
        @finish="handleFinish"
      >
        <template #upsell-badge>
          <slot name="upsell-badge" />
        </template>
        <template
          v-for="item in items"
          #[item.imageSlot]
        >
          <slot :name="item.imageSlot" />
        </template>
      </whatisnew-info>
    </div>
  </el-dialog>
</template>

<script>
  import ElDialog from 'packages/dialog';
  import Locale from '@/mixins/locale';
  import WhatisnewInfo from './whatisnewInfo.vue';

  export default {
  name: 'ElWhatIsNew',
  components: { WhatisnewInfo, ElDialog },
  mixins: [Locale],
  props: {
    visible: {
      type: Boolean
    },

    backButtonText: {
      type: String,
      default: ''
    },
    nextButtonText: {
      type: String,
      default: ''
    },
    finishButtonText: {
      type: String,
      default: ''
    },

    items: {
      type: Array,
      required: true
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
  emits: ['update:visible', 'open', 'close', 'finish'],
  computed: {
    cBackButtonText() {
      return this.backButtonText || this.t('el.whatisnew.backButtonText');
    },
    cNextButtonText() {
      return this.nextButtonText || this.t('el.whatisnew.nextButtonText');
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

    /**
       *
       * @param source {'button'|undefined}
       * @return {Promise<void>}
       */
    async handleFinish(source) {
      if (source === 'button') {
        this.$emit('finish');
      }
    }
  }
};
</script>
