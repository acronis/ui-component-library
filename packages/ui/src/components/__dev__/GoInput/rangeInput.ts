export interface GoRangeInputProps {
  modelValue?: number
  min?: number
  max: number
  step?: number | 'any'
  numberFormatOptions?: Intl.NumberFormatOptions
  uniqueId?: string
}

export type GoRangeInputControlProps = {
  label: string
  name: string
  rules?: string
} & GoRangeInputProps;
