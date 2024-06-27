import type { DeepPartial } from './generic.ts';

export interface LocaleConfig {
  locale: string

  /**
   * if false, the spaces will be removed when make sentence
   */
  wordSpace: boolean

  calendar: {
    year: string
    month: string
    month1: string
    month2: string
    month3: string
    month4: string
    month5: string
    month6: string
    month7: string
    month8: string
    month9: string
    month10: string
    month11: string
    month12: string
    week1: string
    week2: string
    week3: string
    week4: string
    week5: string
    week6: string
    week7: string

    ariaLabel: {
      year: string
      month: string
      month1: string
      month2: string
      month3: string
      month4: string
      month5: string
      month6: string
      month7: string
      month8: string
      month9: string
      month10: string
      month11: string
      month12: string
      week1: string
      week2: string
      week3: string
      week4: string
      week5: string
      week6: string
      week7: string
    }
  }

  captcha: {
    slideEnd: string
    slide: string
    success: string
    fail: string
    doCaptcha: string
    pointInOrder: string
    trigger: string
    completed: string
  }

  checkbox: {
    all: string
  }

  confirm: {
    confirm: string
    cancel: string
  }

  datePicker: {
    confirm: string
    cancel: string
    placeholder: {
      year: string
      month: string
      date: string
      datetime: string
      start: string
      end: string
      select: string
    }
    startTime: string
    endTime: string

    ariaLabel: {
      clear: string
      quarter: string
      week: string
      date: string
      hour: string
      minute: string
      second: string
    }
  }

  form: {
    submit: string
    reset: string
    notNullable: string
    validateFail: string
  }

  input: {
    placeholder: string

    ariaLabel: {
      clear: string
    }
  }

  layout: {
    signOut: string
    signType: string
    majorColor: string
    themeMode: string
  }

  modal: {
    confirm: string
    cancel: string
  }

  numberInput: {
    placeholder: string
    outOfRange: string

    ariaLabel: {
      clear: string
      increase: string
      decrease: string
    }
  }

  pagination: {
    page: string
    perPage: string
    prevPage: string
    nextPage: string
    prev: string
    next: string
    total: string
    jumpTo: string
    itemUnit: string
  }

  select: {
    placeholder: string
    empty: string

    ariaLabel: {
      clear: string
    }
  }

  table: {
    empty: string
    filterConfirm: string
    filterReset: string
    filterAll: string
  }

  timePicker: {
    confirm: string
    cancel: string
    placeholder: {
      time: string
      start: string
      end: string
      select: string
    }

    ariaLabel: {
      clear: string
      hour: string
      minute: string
      second: string
    }
  }

  tree: {
    empty: string
  }

  upload: {
    upload: string
    uploading: string
    dragOrClick: string

    ariaLabel: {
      preview: string
      delete: string
    }
  }
}

export type LocaleOptions = DeepPartial<LocaleConfig>;
export type LocaleNames = Exclude<keyof LocaleConfig, 'locale' | 'wordSpace'>;
