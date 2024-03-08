<template>
  <table
    cellspacing="0"
    cellpadding="0"
    class="el-date-table"
    :class="{ 'is-multi-mode': selectionMode === 'multi' || selectionMode === 'oneday'}"
    @click="handleClick"
    @mousemove="handleMouseMove"
  >
    <thead v-show="selectionMode !== 'multi' && selectionMode !== 'oneday'">
      <tr>
        <th
          v-for="week in WEEKS"
          :key="week"
          :class="{'weekends': week === saturday || week === sunday }"
          class="el-date-table__weekday-name"
        >
          {{ getWeekLabel(week) }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(row, i) in rows"
        :key="i"
        class="el-date-table__row"
        :class="{
          'el-date-table__row--hidden': !isWeekInCurrentMonth(row)
        }"
      >
        <td
          v-for="(cell, i) in row"
          :key="i"
          :class="getCellClasses(cell)"
        >
          <div
            :class="[
              {'el-date-table--start': cell.start && !cell.end},
              {'el-date-table--end': cell.end && !cell.start}
            ]"
          >
            <span>
              {{ cell.text }}
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Locale from '@/mixins/locale';
import { hasClass } from '@/utils/dom';

import {
  getFirstDayOfMonth,
  getDayCountOfMonth,
  getStartDateOfMonth,
  nextDate,
  isDate,
  formatDate
} from '../util';

const WEEKS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const clearHours = function (time) {
  const cloneDate = new Date(time);
  cloneDate.setHours(0, 0, 0, 0);
  return cloneDate.getTime();
};

export default {
  mixins: [Locale],

  props: {
    firstDayOfWeek: {
      default: 1,
      type: Number,
      validator: (val) => val >= 1 && val <= 7
    },

    modelValue: {},

    days: {
      type: [String, Date, Array],
      default: ''
    },

    defaultValue: {
      validator(val) {
        // either: null, valid Date object, Array of valid Date objects
        return val === null || isDate(val) || (Array.isArray(val) && val.every(isDate));
      }
    },

    date: {},

    selectionMode: {
      default: 'day'
    },

    disabledDate: {},

    minDate: {},

    maxDate: {},

    rangeState: {
      default() {
        return {
          endDate: null,
          selecting: false,
          row: null,
          column: null
        };
      }
    }
  },
  emits: ['changerange', 'pick', 'multi'],

  data() {
    return {
      tableRows: [[], [], [], [], [], []],
      saturday: WEEKS[6],
      sunday: WEEKS[0],
      rangeStateModel: this.rangeState,
      rangeStateIsSelecting: this.rangeState.selecting
    };
  },

  computed: {
    offsetDay() {
      const week = this.firstDayOfWeek;
      // Sunday is the boundary, the number of days offset left and right,
      // 3217654 For example, Monday is -1, the purpose is to adjust the position of the first two rows of dates
      return week > 3 ? 7 - week : -week;
    },

    WEEKS() {
      const week = this.firstDayOfWeek;
      return WEEKS.concat(WEEKS).slice(week, week + 7);
    },

    year() {
      return this.date.getFullYear();
    },

    month() {
      return this.date.getMonth();
    },

    startDate() {
      return getStartDateOfMonth(this.year, this.month);
    },

    rows() {
      // TODO: refactory rows / getCellClasses
      const date = new Date(this.year, this.month, 1);
      let day = getFirstDayOfMonth(date); // day of first day
      const dateCountOfMonth = getDayCountOfMonth(date.getFullYear(), date.getMonth());
      const dateCountOfLastMonth = getDayCountOfMonth(
        date.getFullYear(),
        (date.getMonth() === 0 ? 11 : date.getMonth() - 1)
      );

      day = (day === 0 ? 7 : day);

      const offset = this.offsetDay;
      const rows = this.tableRows;
      let count = 1;
      let firstDayPosition;

      const startDate = this.startDate;
      const disabledDate = this.disabledDate;
      const now = clearHours(new Date());

      for (let i = 0; i < 6; i++) {
        const row = rows[i];

        for (let j = 0; j < 7; j++) {
          let cell = row[j];
          if (!cell) {
            cell = {
              row: i, column: j, type: 'normal', inRange: false, start: false, end: false
            };
          }

          cell.type = 'normal';

          const index = i * 7 + j;
          const time = nextDate(startDate, index - offset).getTime();
          cell.inRange = time >= clearHours(this.minDate) && time <= clearHours(this.maxDate);
          cell.start = this.minDate && time === clearHours(this.minDate);
          cell.end = this.maxDate && time === clearHours(this.maxDate);

          const simulatedDate = new Date(this.minDate);
          simulatedDate.setDate(simulatedDate.getDate() + 1);
          cell.startConsecutive = this.minDate && time === clearHours(this.minDate) && formatDate(simulatedDate, 'yyyy-MM-dd') === formatDate(this.maxDate, 'yyyy-MM-dd');

          const isToday = time === now;

          if (isToday) {
            cell.type = 'today';
          }

          if (i >= 0 && i <= 1) {
            if (j + i * 7 >= (day + offset)) {
              cell.text = count++;
              if (count === 2) {
                firstDayPosition = i * 7 + j;
              }
            } else {
              cell.text = dateCountOfLastMonth - (day + offset - (j % 7)) + 1 + i * 7;
              cell.type = 'prev-month';
            }
          } else if (count <= dateCountOfMonth) {
            cell.text = count++;
            if (count === 2) {
              firstDayPosition = i * 7 + j;
            }
          } else {
            cell.text = count++ - dateCountOfMonth;
            cell.type = 'next-month';
          }

          cell.disabled = typeof disabledDate === 'function' && disabledDate(new Date(time));
          cell.week = this.WEEKS[j];

          row[j] = cell;
        }
      }

      rows.firstDayPosition = firstDayPosition;

      return rows;
    }
  },

  watch: {
    rangeState(newVal) {
      this.rangeStateModel = newVal;
    },
    'rangeState.endDate': function (newVal) {
      this.markRange(newVal);
    },

    minDate(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.rangeStateIsSelecting = true;
        this.markRange(newVal);
      } else if (!newVal) {
        this.rangeStateIsSelecting = false;
        this.markRange(newVal);
      } else {
        this.markRange();
      }
    },

    maxDate(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.rangeStateIsSelecting = false;
        this.markRange(newVal);
        this.$emit('pick', {
          minDate: this.minDate,
          maxDate: this.maxDate
        });
      }
    }
  },

  methods: {
    cellMatchesDate(cell, date) {
      const value = new Date(date);
      return this.year === value.getFullYear()
          && this.month === value.getMonth()
          && Number(cell.text) === value.getDate();
    },

    multiSelect(cell) {
      if (!Array.isArray(this.days)) {
        return false;
      }
      for (let i = 0; i < this.days.length; i++) {
        const value = new Date(this.days[i]);
        if (this.year === value.getFullYear()
            && this.month === value.getMonth()
            && Number(cell.text) === value.getDate()) {
          return true;
        }
      }
      return false;
    },

    getCellClasses(cell) {
      const selectionMode = this.selectionMode;
      // eslint-disable-next-line max-len
      const defaultValue = this.defaultValue ? Array.isArray(this.defaultValue) ? this.defaultValue : [this.defaultValue] : [];

      const classes = [];
      if (cell.start) {
        classes.push('start-date');
      }

      if (cell.startConsecutive) {
        classes.push('start-date-consecutive');
      }

      if (cell.inRange && (cell.type === 'normal' || cell.type === 'today')) {
        classes.push('in-range');

        if (cell.end) {
          classes.push('end-date');
        }
      }

      if ((cell.type === 'normal' || cell.type === 'today') && !cell.disabled) {
        classes.push('available');
        if (cell.type === 'today') {
          classes.push('today');
        }
      } else {
        classes.push(cell.type);
      }

      if (cell.type === 'normal' && defaultValue.some((date) => this.cellMatchesDate(cell, date))) {
        classes.push('default');
      }

      if ((selectionMode === 'day' || selectionMode === 'multi') && (cell.type === 'normal' || cell.type === 'today') && this.cellMatchesDate(cell, this.value)) {
        classes.push('current');
      }

      if (selectionMode === 'multi' && (cell.type === 'normal' || cell.type === 'today') && this.multiSelect(cell)) {
        classes.push('current');
      }

      if (cell.disabled) {
        classes.push('disabled');
      }

      if (cell.week === this.saturday || cell.week === this.sunday) {
        classes.push('weekends');
      }

      if (selectionMode === 'oneday' && (cell.type === 'normal' || cell.type === 'today') && this.cellMatchesDate(cell, this.value)) {
        classes.push('current');
      }

      return classes.join(' ');
    },

    getDateOfCell(row, column) {
      const offsetFromStart = row * 7 + column - this.offsetDay;
      return nextDate(this.startDate, offsetFromStart);
    },

    isWeekInCurrentMonth(row) {
      return row.some((cell) => cell.type === 'normal' || cell.type === 'today');
    },

    getWeekLabel(week) {
      const translated = this.t(`el.datepicker.weeks.${week}`);
      return translated.toLowerCase() === week.toLowerCase()
        ? translated.charAt(0)
        : translated;
    },

    markRange(maxDate = this.maxDate) {
      const startDate = this.startDate;

      const rows = this.rows;
      const minDate = this.minDate;
      for (let i = 0, k = rows.length; i < k; i++) {
        const row = rows[i];
        for (let j = 0, l = row.length; j < l; j++) {
          const cell = row[j];
          const index = i * 7 + j;
          const time = nextDate(startDate, index - this.offsetDay).getTime();

          if (maxDate && maxDate < minDate) {
            cell.inRange = minDate && time >= clearHours(maxDate) && time <= clearHours(minDate);
            cell.start = maxDate && time === clearHours(maxDate.getTime());
            cell.end = minDate && time === clearHours(minDate.getTime());
          } else {
            cell.inRange = minDate && time >= clearHours(minDate) && time <= clearHours(maxDate);
            cell.start = minDate && time === clearHours(minDate.getTime());
            cell.end = maxDate && time === clearHours(maxDate.getTime());
          }
        }
      }
    },

    handleMouseMove(event) {
      if (!this.rangeStateIsSelecting) return;

      this.$emit('changerange', {
        minDate: this.minDate,
        maxDate: this.maxDate,
        rangeState: this.rangeStateModel
      });

      let target = event.target;
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }
      if (target.tagName !== 'TD') return;
      if (target.className.indexOf('prev-month') !== -1 || target.className.indexOf('next-month') !== -1) return;

      const column = target.cellIndex;
      const row = target.parentNode.rowIndex - 1;
      const { row: oldRow, column: oldColumn } = this.rangeState;

      if (oldRow !== row || oldColumn !== column) {
        this.rangeStateModel = {
          row, column, endDate: this.getDateOfCell(row, column)
        };
      }
    },

    handleClick(event) {
      let target = event.target;
      if (target.tagName === 'SPAN') {
        target = target.parentNode.parentNode;
      }
      if (target.tagName === 'DIV') {
        target = target.parentNode;
      }

      if (target.tagName !== 'TD') return;
      if (hasClass(target, 'disabled') || hasClass(target, 'week')) return;

      const selectionMode = this.selectionMode;

      const year = Number(this.year);
      const month = Number(this.month);

      const cellIndex = target.cellIndex;
      const rowIndex = target.parentNode.rowIndex;

      const cell = this.rows[rowIndex - 1][cellIndex];
      const text = cell.text;
      const className = target.className;

      const newDate = new Date(year, month, 1);

      // disable `prev-month` and `next-month` cells selection
      if (className.indexOf('prev') !== -1 || className.indexOf('next') !== -1) {
        return;
      }

      newDate.setDate(parseInt(text, 10));

      if (this.selectionMode === 'range' && cell.type !== 'prev-month' && cell.type !== 'next-month') {
        if (this.minDate && this.maxDate) {
          const minDate = new Date(newDate.getTime());
          const maxDate = null;

          this.$emit('pick', { minDate, maxDate }, true);
          this.rangeStateIsSelecting = true;
          this.markRange(this.minDate);
          this.$nextTick(() => {
            this.handleMouseMove(event);
          });
        } else if (this.minDate && !this.maxDate) {
          if (newDate >= this.minDate) {
            const maxDate = new Date(newDate.getTime());
            this.rangeStateIsSelecting = false;

            this.$emit('pick', {
              minDate: this.minDate,
              maxDate
            });
          } else {
            const minDate = new Date(newDate.getTime());
            this.rangeStateIsSelecting = false;

            this.$emit('pick', { minDate, maxDate: this.minDate });
          }
        } else if (!this.minDate) {
          const minDate = new Date(newDate.getTime());

          this.$emit('pick', { minDate, maxDate: this.maxDate }, false);
          this.rangeStateIsSelecting = true;
          this.markRange(this.minDate);
        }
      } else if (selectionMode === 'day') {
        this.$emit('pick', newDate);
      } else if (selectionMode === 'multi' && cell.type !== 'prev-month' && cell.type !== 'next-month') {
        this.$emit('multi', newDate);
      } else if (selectionMode === 'oneday' && cell.type !== 'prev-month' && cell.type !== 'next-month') {
        this.$emit('pick', newDate);
      }
    }
  }
};
</script>
