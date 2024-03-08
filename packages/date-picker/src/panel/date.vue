<template>
  <transition
    name="el-zoom-in-top"
    @after-enter="handleEnter"
    @after-leave="handleLeave"
  >
    <div
      v-show="visible"
      class="el-picker-panel el-date-picker el-popper"
      :class="[popperClass]"
    >
      <div class="el-picker-panel__body-wrapper">
        <div class="el-picker-panel__body">
          <div
            v-if="selectionMode === 'multi' || selectionMode === 'oneday'"
            class="el-date-picker__header"
          >
            <span class="el-date-picker__header--multi">{{ pickerHeaderLabel }}</span>
          </div>
          <div
            v-show="selectionMode !== 'multi' && selectionMode !== 'oneday'"
            class="el-date-picker__header"
          >
            <el-icon
              :aria-label="t(`el.datepicker.prevYear`)"
              class="el-date-picker__header-btn"
              name="i-chevron-double-left--16"
              @click="prevYear"
            />
            <el-icon
              v-show="currentView === 'date'"
              :aria-label="t(`el.datepicker.prevMonth`)"
              class="el-date-picker__header-btn el-date-picker__header-btn--with-spacer-left"
              name="i-chevron-left--16"
              @click="prevMonth"
            />
            <span class="el-date-picker__label-wrapper">
              <span
                v-show="currentView === 'date'"
                role="button"
                class="el-date-picker__header-label el-date-picker__header-label-month"
                :class="{ active: currentView === 'month' }"
                :title="displayValue"
                @click="showMonthPicker"
              >{{ t(`el.datepicker.months.${ monthsList[month] }`) }}</span>
              <span
                role="button"
                class="el-date-picker__header-label el-date-picker__header-label-year"
                :class="{
                  disabled: currentView === 'year',
                  'el-date-picker__header-label-year--full-width': currentView !== 'date'
                }"
                @click="showYearPicker"
              >
                {{ yearLabel }}
              </span>
            </span>
            <el-icon
              v-show="currentView === 'date'"
              :aria-label="t(`el.datepicker.nextMonth`)"
              class="el-date-picker__header-btn el-date-picker__header-btn--with-spacer-right"
              name="i-chevron-right--16"
              @click="nextMonth"
            />
            <el-icon
              :aria-label="t(`el.datepicker.nextYear`)"
              class="el-date-picker__header-btn"
              name="i-chevron-double-right--16"
              @click="nextYear"
            />
          </div>

          <div
            :class="{'el-picker-panel__content--multi': (selectionMode === 'multi' || selectionMode === 'oneday')}"
            class="el-picker-panel__content"
            @click="isMultiFocused=true"
          >
            <date-table
              v-show="currentView === 'date'"
              :selection-mode="selectionMode"
              :first-day-of-week="firstDayOfWeek"
              :value="new Date(value)"
              :days="multiValues"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="date"
              :disabled-date="disabledDate"
              @pick="handleDatePick"
              @multi="handleDatePickMulti"
            />
            <year-table
              v-if="selectionMode !== 'multi' && selectionMode !== 'oneday'"
              v-show="currentView === 'year'"
              :value="new Date(value)"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="date"
              :disabled-date="disabledDate"
              @pick="handleYearPick"
            />
            <month-table
              v-if="selectionMode !== 'multi' && selectionMode !== 'oneday'"
              v-show="currentView === 'month'"
              :value="new Date(value)"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="date"
              :disabled-date="disabledDate"
              @pick="handleMonthPick"
            />
          </div>
          <div
            v-if="showCustomOptions"
            class="el-picker-panel__custom-options"
          >
            <el-custom-options
              :custom-options="customOptions"
              :custom-option-select-all="customOptionSelectAll"
              v-model:selected-options="currentCustomOptions"
              :is-all-selected="isAllSelected"
              @select-all="selectAllDays"
              @select-option="selectDay"
            />
          </div>
          <div
            v-if="selectionMode === 'multi'"
            class="el-picker-panel__footer-multi"
            @click="isMultiFocused=false"
          >
            <el-button
              class="el-picker-panel__footer-multi--clear-btn"
              type="text"
              @click="clearAllDays"
            >
              {{ this.t(`el.datepicker.clearSelection`) }}
            </el-button>
            <el-button
              class="el-picker-panel__footer-multi--all-btn"
              :disabled="disableApply"
              @click="applyMultiSelection"
              show-hover-hint
            >
              {{ this.t(`el.datepicker.apply`) }}
            </el-button>
          </div>
          <div
            v-if="selectionMode === 'oneday'"
            class="el-picker-panel__footer-multi is-one-day"
          >
            <el-button
              class="el-picker-panel__footer-multi--all-btn"
              :disabled="disableApply"
              @click="$emit('pick-oneday')"
              show-hover-hint
            >
              {{ this.t(`el.datepicker.apply`) }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Locale from '@/mixins/locale';
  import ElIcon from 'packages/icon';
  import ElButton from 'packages/button';
  import {
    isDate,
    modifyDate,
    clearTime,
    prevYear,
    nextYear,
    prevMonth,
    nextMonth
  } from '../util';
  import YearTable from '../basic/year-table.vue';
  import MonthTable from '../basic/month-table.vue';
  import DateTable from '../basic/date-table.vue';
  import ElCustomOptions from '../basic/custom-options.vue';
  import VueI18nFirstDay from '../mixins/vue-i18n-first-day';

  export default {

    components: {
      YearTable,
      MonthTable,
      DateTable,
      ElIcon,
      ElButton,
      ElCustomOptions
    },
    mixins: [Locale, VueI18nFirstDay],

    data() {
      return {
        popperClass: '',
        date: new Date(),
        value: '',
        multiValues: [],
        defaultValue: null,
        selectionMode: 'day',
        visible: false,
        currentView: 'date',
        disabledDate: '',
        firstDayOfWeek: 1,
        format: '',
        arrowControl: false,
        bothDate: true,
        customOptions: [],
        customOptionSelectAll: '',
        currentCustomOptions: [],
        isMultiFocused: true
      };
    },

    computed: {
      year() {
        return this.date.getFullYear();
      },

      month() {
        return this.date.getMonth();
      },

      monthsList() {
        return ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      },

      monthDate() {
        return this.date.getDate();
      },

      yearLabel() {
        const yearTranslation = this.t('el.datepicker.year');
        if (this.currentView === 'year') {
          const startYear = Math.floor(this.year / 10) * 10;
          if (yearTranslation) {
            return `${startYear} ${yearTranslation} - ${startYear + 9} ${yearTranslation}`;
          }
          return `${startYear} - ${startYear + 9}`;
        }
        return `${this.year} ${yearTranslation}`;
      },

      showCustomOptions() {
        return (this.selectionMode === 'multi' || this.selectionMode === 'oneday')
          && (this.customOptions && this.customOptions.length) || this.customOptionSelectAll;
      },

      isAllSelected() {
        return this.multiValues.length === 31;
      },
      disableApply() {
        if (this.selectionMode === 'oneday') {
          return this.value !== undefined && (this.value.hasOwnProperty('length') && this.value.length === 0);
        }
        return false;
      },
      pickerHeaderLabel() {
        if (this.selectionMode === 'oneday') {
          return this.t('el.datepicker.pickADay');
        }
        return this.t('el.datepicker.pickADays');
      },
      displayValue() {
        return this.t(`el.datepicker.months.${this.monthsList[this.month]}`);
      }
    },

    watch: {
      value(val) {
        if (isDate(val)) {
          this.date = new Date(val);
        } else {
          this.date = this.defaultValue ? new Date(this.defaultValue) : new Date();
        }
      },

      defaultValue(val) {
        if (!isDate(this.value)) {
          this.date = val ? new Date(val) : new Date();
        }
      },

      selectionMode(newVal) {
        if (newVal === 'month') {
          if (this.currentView !== 'year' || this.currentView !== 'month') {
            this.currentView = 'month';
          }
        }
        if (newVal === 'multi') {
          this.firstDayOfWeek = 1;
        }
      }
    },

    methods: {
      clearAllDays() {
        if (this.selectionMode === 'oneday') {
          this.value = '';
        } else {
          this.$emit('multi', null);
        }
        this.currentCustomOptions = [];
      },

      selectAllDays(isChecked) {
        if (isChecked) {
          this.$emit('select-all');
        } else {
          this.clearAllDays();
        }
      },

      applyMultiSelection() {
        this.$emit('apply-multi');
        this.$emit('update-custom-options', this.currentCustomOptions);
      },

      handleClear() {
        this.date = this.defaultValue ? new Date(this.defaultValue) : new Date();
        this.$emit('pick', null);
      },

      emit(value, ...args) {
        if (!value) {
          this.$emit('pick', value, ...args);
          return;
        }
        this.$emit('pick', clearTime(value), ...args);
      },

      showMonthPicker() {
        this.currentView = 'month';
      },

      showYearPicker() {
        this.currentView = 'year';
      },

      prevMonth() {
        this.date = prevMonth(this.date);
      },

      nextMonth() {
        this.date = nextMonth(this.date);
      },

      prevYear() {
        if (this.currentView === 'year') {
          this.date = prevYear(this.date, 10);
        } else {
          this.date = prevYear(this.date);
        }
      },

      nextYear() {
        if (this.currentView === 'year') {
          this.date = nextYear(this.date, 10);
        } else {
          this.date = nextYear(this.date);
        }
      },

      handleMonthPick(month) {
        if (this.selectionMode === 'month') {
          this.date = modifyDate(this.date, this.year, month, 1);
          this.emit(this.date);
        } else {
          this.date = modifyDate(this.date, this.year, month, this.monthDate);
          this.currentView = 'date';
        }
      },

      handleDatePick(value) {
        if (this.selectionMode === 'day') {
          this.date = modifyDate(this.date, value.getFullYear(), value.getMonth(), value.getDate());
          this.emit(this.date, false);
        }
        if (this.selectionMode === 'oneday') {
          this.value = value;
          // toggle selection of custom option if selected date is the first or last
          if (Number(this.value) && this.currentCustomOptions.length > 0) {
            this.currentCustomOptions = [];
          }
        }
      },

      handleDatePickMulti(date) {
        this.$emit('multi', date);
      },

      handleYearPick(year) {
        if (this.selectionMode === 'year') {
          this.date = modifyDate(this.date, year, 0, 1);
          this.emit(this.date);
        } else {
          this.date = modifyDate(this.date, year, this.month, this.monthDate);
          this.currentView = 'month';
        }
      },

      resetView() {
        if (this.selectionMode === 'month') {
          this.currentView = 'month';
        } else if (this.selectionMode === 'year') {
          this.currentView = 'year';
        } else {
          this.currentView = 'date';
        }
      },

      handleEnter() {
        this.isMultiFocused = true;
        document.body.addEventListener('keydown', this.handleKeydown);
      },

      handleLeave() {
        this.$emit('dodestroy');
        document.body.removeEventListener('keydown', this.handleKeydown);
      },

      handleKeydown(e) {
        const keyCode = e.keyCode;
        const list = [38, 40, 37, 39];
        if (this.visible && (this.selectionMode !== 'multi' && this.selectionMode !== 'oneday')) {
          if (list.indexOf(keyCode) !== -1) {
            this.handleKeyControl(keyCode);
            e.stopPropagation();
            e.preventDefault();
          }
          if (keyCode === 13) { // Enter
            this.$emit('pick', this.date, false);
          }
        }
        if (this.visible && (this.selectionMode === 'multi' || this.selectionMode === 'oneday')) {
          if (this.isMultiFocused) {
            if (list.indexOf(keyCode) !== -1) {
              this.handleKeyControlMulti(keyCode);
              e.stopPropagation();
              e.preventDefault();
            }
            if (keyCode === 13 && this.selectionMode === 'multi') {
              this.$emit('multi', this.date);
            }
          }
        }
      },

      handleKeyControlMulti(keyCode) {
        const map = {
            38: -7, 40: 7, 37: -1, 39: 1, offset: (date, step) => date.setDate(date.getDate() + step)
        };
        const baseDate = new Date('2018-01-01');
        const currentDate = new Date(this.date.getTime());
        const month = 2.592e9;
        map.offset(currentDate, map[keyCode]);

        while ((currentDate.getTime() - baseDate) >= 0 && (currentDate.getTime() - baseDate) <= month) {
          if (typeof this.disabledDate === 'function' && this.disabledDate(currentDate)) {
            continue;
          }
          this.date = currentDate;
          this.$emit('pick-multi', this.date);
          this.value = currentDate;
          break;
        }
      },

      handleKeyControl(keyCode) {
        const mapping = {
          year: {
            38: -4, 40: 4, 37: -1, 39: 1, offset: (date, step) => date.setFullYear(date.getFullYear() + step)
          },
          month: {
            38: -4, 40: 4, 37: -1, 39: 1, offset: (date, step) => date.setMonth(date.getMonth() + step)
          },
          day: {
            38: -7, 40: 7, 37: -1, 39: 1, offset: (date, step) => date.setDate(date.getDate() + step)
          }
        };
        const mode = this.selectionMode;
        const year = 3.1536e10;
        const now = this.date.getTime();
        const newDate = new Date(this.date.getTime());
        while (Math.abs(now - newDate.getTime()) <= year) {
          const map = mapping[mode];
          map.offset(newDate, map[keyCode]);
          if (typeof this.disabledDate === 'function' && this.disabledDate(newDate)) {
            continue;
          }
          this.date = newDate;
          this.$emit('pick', newDate, true);
          break;
        }
      },

      isValidValue(value) {
        return value && !isNaN(value) && (
          typeof this.disabledDate === 'function'
            ? !this.disabledDate(value)
            : true
        );
      },

      selectDay(isChecked, day) { // custom date option selection e.g first day or last day
        if (this.selectionMode === 'oneday') {
          if (isChecked) {
            this.currentCustomOptions.push(day);
            this.value = day;
          } else {
            this.currentCustomOptions = this.currentCustomOptions.filter((option) => option !== day);
            this.value = '';
          }
        }
      }
    }
  };
</script>
