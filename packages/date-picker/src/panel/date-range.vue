<template>
  <transition
    name="el-zoom-in-top"
    @after-leave="$emit('dodestroy')"
  >
    <div
      v-show="visible"
      class="el-picker-panel el-date-range-picker el-popper"
      :class="[
        popperClass
      ]"
    >
      <div class="el-picker-panel__body-wrapper">
        <div class="el-picker-panel__body">
          <div class="el-date-range-picker__content is-left">
            <div class="el-date-range-picker__header">
              <el-icon
                :aria-label="t(`el.datepicker.prevYear`)"
                class="el-date-picker__header-btn"
                name="i-chevron-double-left--16"
                @click="leftPrevYear"
              />
              <el-icon
                v-show="leftCurrentView === 'date'"
                :aria-label="t(`el.datepicker.prevMonth`)"
                class="el-date-picker__header-btn el-date-picker__header-btn--with-spacer-left"
                name="i-chevron-left--16"
                @click="leftPrevMonth"
              />
              <span class="el-date-picker__label-wrapper">
                <span
                  v-show="leftCurrentView === 'date'"
                  role="button"
                  class="el-date-picker__header-label el-date-picker__header-label-month"
                  :class="{ active: leftCurrentView === 'month' }"
                  @click="leftShowMonthPicker"
                >{{ leftMonthLabel }}</span>
                <span
                  role="button"
                  class="el-date-picker__header-label el-date-picker__header-label-year"
                  :class="{
                    disabled: leftCurrentView === 'year',
                    'el-date-picker__header-label-year--full-width': leftCurrentView !== 'date'
                  }"
                  @click="leftShowYearPicker"
                >
                  {{ leftYearLabel }}
                </span>
              </span>
              <el-icon
                v-show="leftCurrentView === 'date'"
                :aria-label="t(`el.datepicker.nextMonth`)"
                class="el-date-picker__header-btn  el-date-picker__header-btn--with-spacer-right"
                name="i-chevron-right--16"
                @click="leftNextMonth"
              />
              <el-icon
                :aria-label="t(`el.datepicker.nextYear`)"
                class="el-date-picker__header-btn"
                name="i-chevron-double-right--16"
                @click="leftNextYear"
              />
            </div>
            <date-table
              v-show="leftCurrentView === 'date'"
              selection-mode="range"
              :date="leftDate"
              :default-value="defaultValue"
              :min-date="minDate"
              :max-date="maxDate"
              :range-state="rangeState"
              :disabled-date="disabledDate"
              :first-day-of-week="firstDayOfWeek"
              @changerange="handleChangeRange"
              @pick="handleRangePick"
            />
            <month-table
              v-show="leftCurrentView === 'month'"
              :value="new Date(minDate)"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="leftDate"
              :disabled-date="disabledDate"
              @pick="leftHandleMonthPick"
            />
            <year-table
              v-show="leftCurrentView === 'year'"
              :value="new Date(minDate)"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="leftDate"
              :disabled-date="disabledDate"
              @pick="leftHandleYearPick"
            />
          </div>
          <div class="el-date-range-picker__content is-right">
            <div class="el-date-range-picker__header">
              <el-icon
                :aria-label="t(`el.datepicker.prevYear`)"
                class="el-date-picker__header-btn"
                name="i-chevron-double-left--16"
                @click="rightPrevYear"
              />
              <el-icon
                v-show="rightCurrentView === 'date'"
                :aria-label="t(`el.datepicker.prevMonth`)"
                class="el-date-picker__header-btn el-date-picker__header-btn--with-spacer-left"
                name="i-chevron-left--16"
                @click="rightPrevMonth"
              />
              <span class="el-date-picker__label-wrapper">
                <span
                  v-show="rightCurrentView === 'date'"
                  role="button"
                  class="el-date-picker__header-label el-date-picker__header-label-month"
                  :class="{ active: rightCurrentView === 'month' }"
                  @click="rightShowMonthPicker"
                >{{ rightMonthLabel }}</span>
                <span
                  role="button"
                  class="el-date-picker__header-label el-date-picker__header-label-year"
                  :class="{
                    disabled: rightCurrentView === 'year',
                    'el-date-picker__header-label-year--full-width': rightCurrentView !== 'date'
                  }"
                  @click="rightShowYearPicker"
                >
                  {{ rightYearLabel }}
                </span>
              </span>
              <el-icon
                v-show="rightCurrentView === 'date'"
                :aria-label="t(`el.datepicker.nextMonth`)"
                class="el-date-picker__header-btn  el-date-picker__header-btn--with-spacer-right"
                name="i-chevron-right--16"
                @click="rightNextMonth"
              />
              <el-icon
                :aria-label="t(`el.datepicker.nextYear`)"
                class="el-date-picker__header-btn"
                name="i-chevron-double-right--16"
                @click="rightNextYear"
              />
            </div>
            <date-table
              v-show="rightCurrentView === 'date'"
              selection-mode="range"
              :date="rightDate"
              :default-value="defaultValue"
              :min-date="minDate"
              :max-date="maxDate"
              :range-state="rangeState"
              :disabled-date="disabledDate"
              :first-day-of-week="firstDayOfWeek"
              @changerange="handleChangeRange"
              @pick="handleRangePick"
            />
            <month-table
              v-show="rightCurrentView === 'month'"
              :value="new Date(maxDate)"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="rightDate"
              :disabled-date="disabledDate"
              @pick="rightHandleMonthPick"
            />
            <year-table
              v-show="rightCurrentView === 'year'"
              :value="new Date(maxDate)"
              :default-value="defaultValue ? new Date(defaultValue) : null"
              :date="rightDate"
              :disabled-date="disabledDate"
              @pick="rightHandleYearPick"
            />
          </div>
          <div
            v-if="predefined"
            class="el-date-range-picker__predefined"
          >
            <el-radio
              v-for="predefinedSetting in predefinedSettings"
              :key="predefinedSetting.label"
              v-model="predefinedSelected"
              class="el-date-range-picker__predefined-setting"
              :label="predefinedSetting.label"
              :name="predefinedSetting.name"
              @change="handlePreDefChange"
            >
              {{ predefinedSetting.name }}
            </el-radio>
          </div>
        </div>
        <div
          v-if="predefined"
          class="el-date-range-picker__action-panel pa-16"
        >
          <el-button
            type="ghost"
            @click="handlePreDefClear"
          >{{ predefinedResetText }}</el-button>
          <el-button @click="handleConfirm(false)">{{ predefinedApplyText }}</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Locale from '@/mixins/locale';
  import ElButton from 'packages/button';
  import ElIcon from 'packages/icon';
  import ElRadio from 'packages/radio';
  import {
    isDate,
    formatDate,
    modifyDate,
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    getPreDefinedDates
  } from '../util';
  import DateTable from '../basic/date-table.vue';
  import YearTable from '../basic/year-table.vue';
  import MonthTable from '../basic/month-table.vue';
  import VueI18nFirstDay from '../mixins/vue-i18n-first-day';

  const advanceDate = (date, amount) => new Date(new Date(date).getTime() + amount);
  const monthsList = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  const calcDefaultValue = (defaultValue, isPredefined) => {
    if (defaultValue) {
      return isPredefined
        ? [prevMonth(new Date(defaultValue)), new Date(defaultValue)]
        : [new Date(defaultValue), advanceDate(defaultValue, 24 * 60 * 60 * 1000)];
    }
    return isPredefined
      ? [prevMonth(new Date()), new Date()]
      : [new Date(), advanceDate(Date.now(), 24 * 60 * 60 * 1000)];
  };

  const goBackDateByDays = (defaultDate, amount) => {
    const goBackDate = defaultDate ? new Date(defaultDate) : new Date();
    goBackDate.setDate(goBackDate.getDate() - amount);
    return goBackDate;
  };

  export default {
    components: {
      DateTable,
      MonthTable,
      YearTable,
      ElButton,
      ElIcon,
      ElRadio
    },
    mixins: [Locale, VueI18nFirstDay],

    data() {
      return {
        popperClass: '',
        value: [],
        defaultValue: null,
        minDate: '',
        maxDate: '',
        leftDate: new Date(),
        leftCurrentView: 'date',
        rightDate: nextMonth(new Date()),
        rightCurrentView: 'date',
        rangeState: {
          endDate: null,
          selecting: false,
          row: null,
          column: null
        },
        visible: '',
        disabledDate: '',
        firstDayOfWeek: 1,
        format: '',
        arrowControl: false,
        predefinedApplyText: this.t('el.datepicker.predefined.apply'),
        predefinedResetText: this.t('el.datepicker.predefined.resetToDefault'),
        predefined: false,
        predefinedSelected: '',
        predefinedSettingsMap: {
          lastday: 1,
          lastseven: 6,
          lastthirty: 29
        },
        predefinedSettings: [{
          name: this.t('el.datepicker.predefined.lastTwentyFourHours'),
          label: 'lastday'
        }, {
          name: this.t('el.datepicker.predefined.lastSevenDays'),
          label: 'lastseven'
        }, {
          name: this.t('el.datepicker.predefined.lastThirtyDays'),
          label: 'lastthirty'
        }, {
          name: this.t('el.datepicker.predefined.customRange'),
          label: 'custom'
        }]
      };
    },

    computed: {
      leftMonthLabel() {
        return isNaN(this.leftMonth) ? '' : this.t(`el.datepicker.months.${monthsList[this.leftMonth]}`);
      },

      leftYearLabel() {
        const yearTranslation = this.t('el.datepicker.year');
        if (this.leftCurrentView === 'year') {
          const startYear = Math.floor(this.leftYear / 10) * 10;
          const endYear = startYear + 9;
          if (yearTranslation) {
            return `${startYear} ${yearTranslation} - ${endYear} ${yearTranslation}`;
          }
          return `${startYear} - ${endYear}`;
        }
        return `${this.leftYear} ${yearTranslation}`;
      },

      rightMonthLabel() {
        return isNaN(this.rightMonth) ? '' : this.t(`el.datepicker.months.${monthsList[this.rightMonth]}`);
      },

      rightYearLabel() {
        const yearTranslation = this.t('el.datepicker.year');
        if (this.rightCurrentView === 'year') {
          const startYear = Math.floor(this.rightYear / 10) * 10;
          const endYear = startYear + 9;
          if (yearTranslation) {
            return `${startYear} ${yearTranslation} - ${endYear} ${yearTranslation}`;
          }
          return `${startYear} - ${endYear}`;
        }
        return `${this.rightYear} ${yearTranslation}`;
      },

      leftYear() {
        return this.leftDate.getFullYear();
      },

      leftMonth() {
        return this.leftDate.getMonth();
      },

      leftMonthDate() {
        return this.leftDate.getDate();
      },

      rightYear() {
        return this.rightDate.getFullYear();
      },

      rightMonth() {
        return this.rightDate.getMonth();
      },

      rightMonthDate() {
        return this.rightDate.getDate();
      },

      todayDate() {
        return this.defaultValue ? new Date(this.defaultValue) : new Date();
      }
    },

    watch: {
      value(newVal) {
        if (!newVal) {
          this.minDate = null;
          this.maxDate = null;
        } else if (Array.isArray(newVal)) {
          this.minDate = isDate(newVal[0]) ? new Date(newVal[0]) : null;
          this.maxDate = isDate(newVal[1]) ? new Date(newVal[1]) : null;
          if (this.minDate) {
            this.leftDate = this.minDate;
            this.rightDate = this.maxDate && this.maxDate.getMonth() !== this.minDate.getMonth()
              ? this.maxDate
              : nextMonth(this.leftDate);
          } else {
            this.leftDate = calcDefaultValue(this.defaultValue, this.predefined)[0];
            this.rightDate = nextMonth(this.leftDate);
          }
        }
      },

      defaultValue(val) {
        if (!Array.isArray(this.value)) {
          const [left, right] = calcDefaultValue(val, this.predefined);
          this.leftDate = left;
          this.rightDate = val && val[1] && left.getMonth() !== right.getMonth()
            ? right
            : nextMonth(this.leftDate);
        }
      },

      visible(nextVisible) {
        if (nextVisible) {
          this.updateRangePick();
          this.leftCurrentView = 'date';
          this.rightCurrentView = 'date';
        }
      }
    },

    methods: {
      updateRangePick() {
        if (this.minDate) {
          this.leftDate = new Date(this.minDate);
          this.rightDate = nextMonth(this.leftDate);
        }
        if (this.maxDate && this.maxDate.getMonth() !== this.minDate.getMonth()) {
          this.rightDate = new Date(this.maxDate);
        }
      },
      handlePreDefChange(val) {
        if (val !== 'custom') {
          this.resetPanel();
          this.handleChangeRange(getPreDefinedDates(val, this.defaultValue));
          this.updateRangePick();
        } else {
          this.handleRangePick(
            {
              minDate: null,
              maxDate: null
            }
          );
        }
      },

      handlePreDefClear() {
        this.predefinedSelected = '';
        this.minDate = null;
        this.maxDate = null;
        this.resetPanel();
      },

      resetPanel() {
        this.leftDate = calcDefaultValue(this.defaultValue, this.predefined)[0];
        this.rightDate = nextMonth(this.leftDate);
      },

      handleClear() {
        this.minDate = null;
        this.maxDate = null;
        this.leftDate = calcDefaultValue(this.defaultValue, this.predefined)[0];
        this.rightDate = nextMonth(this.leftDate);
        this.$emit('pick', null);
      },

      handleChangeRange(val) {
        this.minDate = val.minDate;
        this.maxDate = val.maxDate;
        this.rangeState = val.rangeState;
      },

      handleRangePick(val, close = true) {
        const minDate = val.minDate;
        const maxDate = val.maxDate;

        if (this.maxDate === val.maxDate && this.minDate === val.minDate) {
          return;
        }
        this.onPick && this.onPick(val);
        this.maxDate = maxDate;
        this.minDate = minDate;

        if (this.predefined) {
          this.predefinedSelected = 'custom';
          if (formatDate(this.maxDate, 'yyyy-MM-dd') === formatDate(this.todayDate, 'yyyy-MM-dd')) {
            for (const key in this.predefinedSettingsMap) {
              if (formatDate(this.minDate, 'yyyy-MM-dd') === formatDate(goBackDateByDays(this.defaultValue, this.predefinedSettingsMap[key]), 'yyyy-MM-dd')) {
                this.predefinedSelected = key;
              }
            }
          }
        }

        // workaround for https://github.com/ElemeFE/element/issues/7539,
        // should remove this block when we don't have to care about Chromium 55 - 57
        setTimeout(() => {
          this.maxDate = val.maxDate;
          this.minDate = val.minDate;
          this.predefinedSelected = 'custom';

          if (this.predefined) {
            this.predefinedSelected = 'custom';
            if (formatDate(this.maxDate, 'yyyy-MM-dd') === formatDate(this.todayDate, 'yyyy-MM-dd')) {
              for (const key in this.predefinedSettingsMap) {
                if (formatDate(this.minDate, 'yyyy-MM-dd') === formatDate(goBackDateByDays(this.defaultValue, this.predefinedSettingsMap[key]), 'yyyy-MM-dd')) {
                  this.predefinedSelected = key;
                }
              }
            }
          }
        }, 10);
        if (!close) return;
        if (!val.maxDate) return;
        if (this.predefined) return;
        this.handleConfirm();
      },

      leftPrevYear() {
        const amount = this.leftCurrentView === 'year' ? 10 : 1;
        this.leftDate = prevYear(this.leftDate, amount);
      },

      leftNextYear() {
        const amount = this.leftCurrentView === 'year' ? 10 : 1;
        this.leftDate = nextYear(this.leftDate, amount);
      },

      leftPrevMonth() {
        this.leftDate = prevMonth(this.leftDate);
      },

      leftNextMonth() {
        this.leftDate = nextMonth(this.leftDate);
      },

      rightPrevYear() {
        const amount = this.rightCurrentView === 'year' ? 10 : 1;
        this.rightDate = prevYear(this.rightDate, amount);
      },

      rightNextYear() {
        const amount = this.rightCurrentView === 'year' ? 10 : 1;
        this.rightDate = nextYear(this.rightDate, amount);
      },

      rightPrevMonth() {
        this.rightDate = prevMonth(this.rightDate);
      },

      rightNextMonth() {
        this.rightDate = nextMonth(this.rightDate);
      },

      leftShowMonthPicker() {
        this.leftCurrentView = 'month';
      },

      rightShowMonthPicker() {
        this.rightCurrentView = 'month';
      },

      leftShowYearPicker() {
        this.leftCurrentView = 'year';
      },

      rightShowYearPicker() {
        this.rightCurrentView = 'year';
      },

      leftHandleMonthPick(month) {
        this.leftDate = modifyDate(this.leftDate, this.leftYear, month, this.leftMonthDate);
        this.leftCurrentView = 'date';
      },

      rightHandleMonthPick(month) {
        this.rightDate = modifyDate(this.rightDate, this.rightYear, month, this.rightMonthDate);
        this.rightCurrentView = 'date';
      },

      leftHandleYearPick(year) {
        this.leftDate = modifyDate(this.leftDate, year, this.leftMonth, this.leftMonthDate);
        this.leftCurrentView = 'month';
      },

      rightHandleYearPick(year) {
        this.rightDate = modifyDate(this.rightDate, year, this.rightMonth, this.rightMonthDate);
        this.rightCurrentView = 'month';
      },

      handleConfirm(visible = false) {
        this.$emit('pick', [this.minDate, this.maxDate], visible);
      },

      isValidValue(value) {
        return Array.isArray(value)
          && value && value[0] && value[1]
          && isDate(value[0]) && isDate(value[1])
          && value[0].getTime() <= value[1].getTime() && (
            typeof this.disabledDate === 'function'
              ? !this.disabledDate(value[0]) && !this.disabledDate(value[1])
              : true
          );
      }
    }
  };
</script>
