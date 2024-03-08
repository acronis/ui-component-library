import { getFirstDayOfWeek } from '@/locale';

export default {
  created() {
    // try to deduce locale culture code from vue-i18n, then deduce first day of week from culture code.
    const parentI18nInstance = this.$options.parentElement && this.$options.parentElement.$i18n;
    if (!parentI18nInstance) {
      return;
    }

    const i18nCultureCode = parentI18nInstance && parentI18nInstance.locale;
    const deducedRegion = i18nCultureCode && i18nCultureCode.split('-')[1];
    if (deducedRegion) {
      const deducedFirstDayOfWeek = getFirstDayOfWeek(deducedRegion.toUpperCase());
      if (deducedFirstDayOfWeek) {
        this.firstDayOfWeek = deducedFirstDayOfWeek;
      }
    }
  }
};
