export enum AlertType {
  INFO ='info',
  SUCCESS = 'success',
  WARNING = 'warning',
  CRITICAL = 'critical',
  ERROR = 'error',
  UNKNOWN = 'unknown'
}

export const AlertIconTypes = {
  [AlertType.INFO]: 'clr-info--16',
  [AlertType.SUCCESS]: 'clr-success--16',
  [AlertType.WARNING]: 'clr-warning--16',
  [AlertType.CRITICAL]: 'clr-critical--16',
  [AlertType.ERROR]: 'clr-danger--16',
  [AlertType.UNKNOWN]: 'clr-unknown--16'
};
