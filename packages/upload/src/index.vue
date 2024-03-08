<script>
  import Upload from './upload';

  function noop() {}

  export default {
    name: 'ElUpload',

    components: { Upload },

    provide: {
      uploader: this
    },

    props: {
      action: String,
      headers: {
        type: Object,
        default() {
          return {};
        }
      },
      data: Object,
      multiple: Boolean,
      name: {
        type: String,
        default: 'file'
      },
      drag: Boolean,
      dragger: Boolean,
      withCredentials: Boolean,
      accept: String,
      type: {
        type: String,
        default: 'select'
      },
      beforeUpload: Function,
      onRemove: {
        type: Function,
        default: noop
      },
      onChange: {
        type: Function,
        default: noop
      },
      onSuccess: {
        type: Function,
        default: noop
      },
      onProgress: {
        type: Function,
        default: noop
      },
      onError: {
        type: Function,
        default: noop
      },
      autoUpload: {
        type: Boolean,
        default: true
      },
      httpRequest: Function,
      disabled: Boolean,
      limit: Number,
      width: [Number, String],
      height: [Number, String],
      buttonText: String,
      onExceed: {
        type: Function,
        default: noop
      },
      visibleOnDragOver: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        uploadFiles: [],
        dragOver: false,
        draging: false,
        tempIndex: 1
      };
    },

    methods: {
      handleStart(rawFile) {
        rawFile.uid = Date.now() + this.tempIndex++;
        const file = {
          status: 'ready',
          name: rawFile.name,
          size: rawFile.size,
          percentage: 0,
          uid: rawFile.uid,
          raw: rawFile
        };

        try {
          file.url = URL.createObjectURL(rawFile);
        } catch (err) {
          console.error(err);

          return;
        }

        this.uploadFiles.push(file);
        this.onChange(file, this.uploadFiles);
      },
      handleProgress(ev, rawFile) {
        const file = this.getFile(rawFile);

        /* istanbul ignore else */
        if (file) {
          this.onProgress(ev, file, this.uploadFiles);
          file.status = 'uploading';
          file.percentage = ev.percent || 0;
        }
      },
      handleSuccess(res, rawFile) {
        const file = this.getFile(rawFile);

        /* istanbul ignore else */
        if (file) {
          file.status = 'success';
          file.response = res;

          this.onSuccess(res, file, this.uploadFiles);
          this.onChange(file, this.uploadFiles);
        }
      },
      handleError(err, rawFile) {
        const file = this.getFile(rawFile);
        const fileList = this.uploadFiles;

        file.status = 'fail';

        fileList.splice(fileList.indexOf(file), 1);

        this.onError(err, file, this.uploadFiles);
        this.onChange(file, this.uploadFiles);
      },
      handleRemove(file, raw) {
        /* istanbul ignore else */
        if (raw) {
          file = this.getFile(raw); // eslint-disable-line no-param-reassign
        }

        this.abort(file);
        const fileList = this.uploadFiles;
        fileList.splice(fileList.indexOf(file), 1);
        this.onRemove(file, fileList);
      },
      getFile(rawFile) {
        const fileList = this.uploadFiles;
        let target;
        fileList.every((item) => {
          target = rawFile.uid === item.uid ? item : null;
          return !target;
        });
        return target;
      },
      abort(file) {
        this.$refs['upload-inner'].abort(file);
      },
      clearFiles() {
        this.uploadFiles = [];
      },
      submit() {
        this.uploadFiles
          .filter((file) => file.status === 'ready')
          .forEach((file) => {
            this.$refs['upload-inner'].upload(file.raw);
          });
      },
      uploadRawFiles(files) {
        this.$refs['upload-inner'].handleChange({ target: { files } });
      },
      openAddFileDialog() {
        this.$refs['upload-inner'].handleClick();
      }
    },

    render() {
      const uploadData = {
        props: {
          type: this.type,
          drag: this.drag,
          action: this.action,
          multiple: this.multiple,
          'before-upload': this.beforeUpload,
          'with-credentials': this.withCredentials,
          headers: this.headers,
          name: this.name,
          data: this.data,
          accept: this.accept,
          fileList: this.uploadFiles,
          autoUpload: this.autoUpload,
          disabled: this.disabled,
          limit: this.limit,
          width: this.width,
          height: this.height,
          buttonText: this.buttonText,
          'visible-on-drag-over': this.visibleOnDragOver,
          'on-exceed': this.onExceed,
          'on-start': this.handleStart,
          'on-progress': this.handleProgress,
          'on-success': this.handleSuccess,
          'on-error': this.handleError,
          'on-remove': this.handleRemove,
          'http-request': this.httpRequest
        },
        ref: 'upload-inner',
        on: {
          'file-list': (files) => this.$emit('file-list', files)
        }
      };

      return (
      <upload {...uploadData}>
        { this.$slots.default && this.$slots.default({ openAddFileDialog: this.openAddFileDialog })}
        <template {...{ slot: 'drag' }}>
          { this.$slots.drag && this.$slots.drag() }
        </template>
      </upload>
      );
    }
  };
</script>
