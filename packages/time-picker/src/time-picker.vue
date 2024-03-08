<template>
  <div
    class="el-time-picker"
    :class="{
      'is-error': !isValid
    }"
  >
    <div class="el-time-picker__time">
      <el-combobox
        ref="combobox"
        v-bind="$attrs"
        :value="time"
        :meridiem="meridiem"
        :label="label"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="handleInput"
      >
        <el-option
          v-for="(item, index) in optionsDropdown"
          :key="`${index}-${item.value}`"
          :label="item.label"
          :value="item.value"
        />
      </el-combobox>
    </div>
  </div>
</template>

<script>
  import Locale from '@/mixins/locale';
  import ElCombobox from 'packages/combobox';
  import ElOption from 'packages/option';

  export default {
    name: 'ElTimePicker',
    componentName: 'ElTimePicker',
    components: {
      ElCombobox,
      ElOption
    },
    mixins: [Locale],
    props: {
      value: {
        type: Date
      },
      disabled: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      meridiem: {
        type: Boolean,
        default: false
      },
      step: {
        type: Number,
        default: 60
      }
    },
    data() {
      return {
        isOptionsFiltered: false,
        placeholder: this.meridiem ? '00:00 AM' : '00:00',
        emptyOptions: Array.from({ length: 24 }, (_, index) => index),
        time: this.formatDateToTime(this.value),
        normalizedStep: this.step > 60 || this.step <= 0 ? 60 : this.step,
        regExp: this.meridiem
          ? new RegExp(/^(1[0-2]?|0[1-9]?):[0-5]\d$/i)
          : new RegExp(/^(2[0-3]?|[0-1]\d?):[0-5]\d$/i),
        meridiemAM: this.t('el.timepicker.meridiemAM'),
        meridiemPM: this.t('el.timepicker.meridiemPM')
      };
    },
    computed: {
      isValid() {
        return this.isValidValue(this.time);
      },
      minLength() {
        const lengths = this.options.map((o) => o.value.length);
        return Math.min(...lengths);
      },
      optionsBySteps() {
        const amount = 60 / this.normalizedStep;
        const options = [];

        for (let i = 0; i < amount; i++) {
          options.push(i * this.normalizedStep);
        }

        return options;
      },
      options() {
        const options = this.emptyOptions.reduce((sum, current) => {
          const hours = this.prepareHours(current);
          const meridiemType = this.getMeridiemType(current);

          this.optionsBySteps.forEach((value) => {
            const minutes = this.prepareMinutes(value);
            const str = this.meridiem
              ? `${hours}:${minutes} ${meridiemType}`
              : `${hours}:${minutes}`;

            sum.push({
              value: str,
              label: str
            });
          });

          return sum;
        }, []);

        return options;
      },
      optionsFiltered() {
        if (!this.time) {
          return this.options;
        }
        return this.options.filter((option) => option.value.includes(this.time));
      },
      optionsDropdown() {
        return this.isOptionsFiltered ? this.optionsFiltered : this.options;
      }
    },
    watch: {
      time(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.isOptionsFiltered = true;
        }
      },
      value(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.time = this.formatDateToTime(newVal);
        }
      }
    },
    mounted() {
      this.$refs.combobox.$refs.select.$on('click', (e) => {
        if (!this.$refs.combobox.visible) {
          this.isOptionsFiltered = false;
        }
        this.$emit('click', e);
      });
      this.$refs.combobox.$refs.select.$on('visible-change', (value) => {
        if (!this.$refs.combobox.visible) {
          this.isOptionsFiltered = false;
        }
        this.$emit('visible-change', value);
      });
      this.$refs.combobox.$refs.select.$refs.reference.$on('blur', (e) => {
        // await while select change a value
        setTimeout(() => {
          if (this.time.length < this.minLength && this.optionsFiltered.length !== 0) {
            const newValue = this.optionsFiltered[0].value;
            this.$emit('input', this.formatTimeToDate(newValue));
          } else if (this.isValid && this.optionsFiltered.length === 0) {
            this.$emit('input', this.formatTimeToDate(this.time));
          }
        }, 200);
        this.$emit('blur', e);
      });
    },
    methods: {
      getMeridiemType(value) {
        if (!this.meridiem) return '';

        const meridiemAM = this.t('el.timepicker.meridiemAM');
        const meridiemPM = this.t('el.timepicker.meridiemPM');

        return value < 12 ? meridiemAM : meridiemPM;
      },
      isMeridiemAM(value) {
        return this.meridiemAM.includes(value);
      },
      isMeridiemPM(value) {
        return this.meridiemPM.includes(value);
      },
      prepareHours(value = 0) {
        let hours = parseInt(value, 10);
        if (this.meridiem && hours === 0) {
          hours = 12;
        } else if (this.meridiem && hours > 12) {
          hours %= 12;
        }
        return hours < 10 ? `0${hours}` : `${hours}`;
      },
      prepareMinutes(value = 0) {
        const minutes = value > 59 ? 59 : parseInt(value, 10);
        return minutes < 10 ? `0${minutes}` : `${minutes}`;
      },
      formatDateToTime(date) {
        const dateHours = date.getHours();
        const dateMinutes = date.getMinutes();
        const hours = this.prepareHours(dateHours);
        const minutes = this.prepareMinutes(dateMinutes);

        if (this.meridiem) {
          const meridiemType = this.getMeridiemType(dateHours);
          return `${hours}:${minutes} ${meridiemType}`;
        }

        return `${hours}:${minutes}`;
      },
      formatTimeToDate(value = '') {
        const [time, meridiem] = value.split(' ');
        const matchTime = time ? time.match(/\d+/g) : ['00', '00'];
        const hours = this.prepareHours(matchTime[0]);
        const minutes = this.prepareMinutes(matchTime[1]);
        const newDate = new Date(this.value.getTime());

        newDate.setMinutes(minutes);

        if (this.meridiem && this.isMeridiemPM(meridiem) && +hours !== 12) {
          newDate.setHours(+hours + 12);
        } else if (this.meridiem && this.isMeridiemAM(meridiem) && +hours === 12) {
          newDate.setHours(0);
        } else {
          newDate.setHours(hours);
        }

        return newDate;
      },
      isValidValue(value) {
        const [time, meridiem] = value.split(' ');

        if (this.meridiem) {
          return this.regExp.test(time) && (this.isMeridiemAM(meridiem) || this.isMeridiemPM(meridiem));
        }
        return this.regExp.test(time);
      },
      handleInput(value) {
        if (this.time === value) return;

        this.time = value;

        if (value && value.length >= this.minLength && this.isValidValue(value)) {
          this.$emit('input', this.formatTimeToDate(value));
        }
      },
      handleInputNative() {
        // when we have not matched options and dropdown visible then show it
        if (this.optionsFiltered.length === 0 && this.$refs.combobox.visible) {
          this.$refs.combobox.toggleDropdown();
          // when we have matched options and dropdown hidden then show it
        } else if (this.optionsFiltered.length > 0 && !this.$refs.combobox.visible) {
          this.$refs.combobox.toggleDropdown();
        }
      }
    }
  };
</script>
