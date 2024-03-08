<script>
  import ajax from './ajax';
  import UploadDragger from './upload-dragger';

  export default {
    inject: ['uploader'],
    components: {
      UploadDragger
    },
    props: {
      type: String,
      action: String,
      name: {
        type: String,
        default: 'file'
      },
      data: Object,
      headers: Object,
      withCredentials: Boolean,
      multiple: Boolean,
      accept: String,
      onStart: Function,
      onProgress: Function,
      onSuccess: Function,
      onError: Function,
      beforeUpload: Function,
      drag: Boolean,
      onRemove: {
        type: Function,

        default: function () {}
      },
      fileList: Array,
      autoUpload: Boolean,
      listType: String,
      httpRequest: {
        type: Function,
        default: ajax
      },
      disabled: Boolean,
      limit: Number,
      onExceed: Function,
      width: [Number, String],
      height: [Number, String],
      buttonText: String,
      visibleOnDragOver: Boolean
    },

    data() {
      return {
        mouseover: false,
        reqs: {}
      };
    },

    methods: {
      handleChange(ev) {
        const { files } = ev.target;

        /* istanbul ignore else  */
        if (!files) return;
        this.uploadFiles(files);
      },

      uploadFiles(files) {
        this.$emit('file-list', files);
        if (this.limit && this.fileList.length + files.length > this.limit) {
          this.onExceed && this.onExceed(files, this.fileList);
          return;
        }

        let postFiles = Array.prototype.slice.call(files);
        /* istanbul ignore else  */
        if (!this.multiple) { postFiles = postFiles.slice(0, 1); }

        /* istanbul ignore else  */
        if (postFiles.length === 0) { return; }

        postFiles.forEach((rawFile) => {
          this.onStart(rawFile);

          /* istanbul ignore else  */
          if (this.autoUpload) this.upload(rawFile);
        });
      },
      upload(rawFile) {
        this.$refs.input.value = null;

        /* istanbul ignore else  */
        if (!this.beforeUpload) {
          return this.post(rawFile);
        }

        const before = this.beforeUpload(rawFile);
        if (before && before.then) {
          before.then((processedFile) => {
            const fileType = Object.prototype.toString.call(processedFile);
            if (this.action !== undefined) {
              if (fileType === '[object File]' || fileType === '[object Blob]') {
                this.post(processedFile);
              } else {
                this.post(rawFile);
              }
            }
          }, () => {
            this.onRemove(null, rawFile);
          });
        } else if (before !== false && this.action !== undefined) {
          this.post(rawFile);
        } else {
          this.onRemove(null, rawFile);
        }
      },
      abort(file) {
        const { reqs } = this;
        if (file) {
          let uid = file;
          if (file.uid) uid = file.uid;
          if (reqs[uid]) {
            reqs[uid].abort();
          }
        } else {
          Object.keys(reqs).forEach((uid) => {
            if (reqs[uid]) reqs[uid].abort();
            delete reqs[uid];
          });
        }
      },
      post(rawFile) {
        const { uid } = rawFile;
        const options = {
          headers: this.headers,
          withCredentials: this.withCredentials,
          file: rawFile,
          data: this.data,
          filename: this.name,
          action: this.action,
          onProgress: (e) => {
            this.onProgress(e, rawFile);
          },
          onSuccess: (res) => {
            this.onSuccess(res, rawFile);
            delete this.reqs[uid];
          },
          onError: (err) => {
            this.onError(err, rawFile);
            delete this.reqs[uid];
          }
        };
        const req = this.httpRequest(options);
        this.reqs[uid] = req;

        /* istanbul ignore else  */
        if (req && req.then) {
          req.then(options.onSuccess, options.onError);
        }
      },
      handleClick() {
        /* istanbul ignore else  */
        if (!this.disabled) {
          this.$refs.input.value = null;
          this.$refs.input.click();
        }
      },
      handleKeydown(e) {
        /* istanbul ignore else  */
        if (e.keyCode === 13 || e.keyCode === 32) {
          this.handleClick();
        }
      }
    },

    render() {
      const {
        handleClick,
        drag,
        name,
        handleChange,
        multiple,
        accept,
        uploadFiles,
        disabled,
        handleKeydown,
        width,
        height,
        buttonText
      } = this;
      const data = {
        class: {
          'el-upload': true
        },
        on: {
          keydown: handleKeydown
        }
      };

      if (!drag) {
        data.on.click = handleClick;
      }

      return (
      <div {...data} tabindex="0" >
        {
          drag
            ? <upload-dragger
                disabled={disabled}
                width={width}
                height={height}
                button-text={buttonText}
                on-file={uploadFiles}
                on-click={handleClick}
                visible-on-drag-over={this.visibleOnDragOver}>
                {this.$slots.default && this.$slots.default({ selectFile: this.handleClick })}
                <template {...{ slot: 'drag' }}>
                  { this.$slots.drag && this.$slots.drag() }
                </template>
              </upload-dragger>
            : this.$slots.default()
        }
        <input class="el-upload__input" type="file" ref="input" name={name} on-change={handleChange} multiple={multiple} accept={accept}></input>
      </div>
      );
    }
  };
</script>
