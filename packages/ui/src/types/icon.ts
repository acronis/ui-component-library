import type { Component } from 'vue';

export type IconProp = object | (() => NonNullable<unknown>) | string;
export type IconSource = Component | string | (string | Component)[];
