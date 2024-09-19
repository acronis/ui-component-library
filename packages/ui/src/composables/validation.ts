import { confirmed, email, max, max_value, min_value, required } from '@vee-validate/rules';
import { defineRule } from 'vee-validate';

/**
 * These interfaces are copied from vee-validate because FieldValidationMetaInfo from lib
 * doesn't browser generic Value type
 */

export interface FieldValidationMetaInfo<Value> {
  field: string
  value: Value
  form: Record<string, unknown>
  rule?: {
    name: string
    params?: Record<string, unknown> | unknown[]
  }
}

type GenericValidateFunction<Value> = (
  value: Value,
  ctx: FieldValidationMetaInfo<Value>,
) => boolean | string | Promise<boolean | string>;

export type RuleExpression<Value = unknown> =
  | string
  | Record<string, unknown>
  | GenericValidateFunction<Value>
  | GenericValidateFunction<Value>[]
  | undefined;

export type RuleMessages = Record<string, string>;
// key - field name. value - RuleMessages
export type FieldMessages = Record<string, RuleMessages>;

const defaultRuleMessages: RuleMessages = {
  required: 'Field is required',
  email: 'Field has wrong email',
  confirmed: 'Passwords must match',
  length: 'Field must have 0:{length} symbols',
  maxLength: 'Field cannot exceed 0:{length} symbols',
  default: 'Field is invalid',
};

/**
 * Get from https://github.com/logaretm/vee-validate/blob/main/packages/i18n/src/utils.ts
 * Example: The {field} value must be between 0:{min} and 1:{max}
 */
export function generateErrorMessage(
  context: FieldValidationMetaInfo<unknown>,
  ruleMessages: RuleMessages,
  fieldMessages: FieldMessages,
): string {
  const { form, rule, field } = context;
  const messageKey = rule?.name;
  const params = rule?.params;
  const messages = {
    ...defaultRuleMessages,
    ...ruleMessages,
    ...fieldMessages[field],
  };
  const template = (messageKey && messages[messageKey]) || messages.default;

  return template.replace(/(\d:)?\{([^}]+)\}/g, (_, param, placeholder): string => {
    if (!param) {
      return placeholder in form ? (form[placeholder] as string) : `{${placeholder}}`;
    }

    // Extended Params exit in the format of `paramIndex:{paramName}` where the index is optional
    const paramIndex = Number(param.replace(':', ''));

    if (Array.isArray(params)) {
      return paramIndex in params ? (params[paramIndex] as string) : `${param}{${placeholder}}`;
    }

    return `{${placeholder}}`;
  });
}

export function passwordValidator(value: string) {
  if (!/\d/.test(value)) {
    return 'Password must contain numbers';
  }

  if (!/[a-z]/.test(value)) {
    return 'Password must contain lowercase letters';
  }

  if (!/[A-Z]/.test(value)) {
    return 'Password must contain uppercase letters';
  }

  if (value.length < 6) {
    return 'Password must be at least 6 symbols';
  }

  if (value.length > 32) {
    return 'Password must be less than 33 symbols';
  }

  return true;
}

export function lengthValidator(value: string | unknown[] | undefined, params: string[]) {
  if (!value || value.length === 0) {
    return true;
  }

  return value.length === +params[0];
}

export function requiredValidator(...params: Parameters<typeof required>) {
  return required(...params);
}

export function emailValidator(...params: Parameters<typeof email>) {
  return email(...params);
}

export function confirmedValidator(...params: Parameters<typeof confirmed>) {
  return confirmed(...params);
}

export function maxLengthValidator(...params: Parameters<typeof max>) {
  return max(...params);
}

export function maxValueValidator(...params: Parameters<typeof max_value>) {
  return max_value(...params);
}

export function minValueValidator(...params: Parameters<typeof min_value>) {
  return min_value(...params);
}

export function defineDefaultRules() {
  defineRule('required', requiredValidator);
  defineRule('email', emailValidator);
  defineRule('confirmed', confirmedValidator);
  defineRule('length', lengthValidator);
  defineRule('maxLength', maxLengthValidator);
  defineRule('password', passwordValidator);
  defineRule('maxValue', maxValueValidator);
  defineRule('minValue', minValueValidator);
}
