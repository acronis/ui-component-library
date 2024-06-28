export interface RGB extends Record<any, any> {
  r: number
  g: number
  b: number
  a?: number
}

export interface RGBColor extends RGB {
  a?: 1
  format?: 'name' | 'rgb'
}

export interface RGBAColor extends RGB {
  a: number
  format?: 'name' | 'rgba'
}

export interface HEX3Color extends RGB {
  a?: 1
  format?: 'name' | 'hex3'
}
export interface HEX4Color extends RGB {
  a: number
  format?: 'name' | 'hex4'
}
export interface HEX6Color extends RGB {
  a?: 1
  format?: 'name' | 'hex6'
}
export interface HEX8Color extends RGB {
  a: number
  format?: 'name' | 'hex8'
}

export interface HSL extends Record<any, any> {
  h: number
  s: number
  l: number
  a?: number
}

export interface HSLColor extends HSL {
  a?: 1
  format?: 'name' | 'hsl'
}

export interface HSLAColor extends HSL {
  a: number
  format?: 'name' | 'hsla'
}

export interface HSV extends Record<any, any> {
  h: number
  s: number
  v: number
  a?: number
}

export interface HSVColor extends HSV {
  a?: 1
  format?: 'name' | 'hsv'
}

export interface HSVAColor extends HSV {
  a: number
  format?: 'name' | 'hsva'
}

export type Color =
  | string
  | RGBColor
  | RGBAColor
  | HSLColor
  | HSLAColor
  | HSVColor
  | HSVAColor
  | HEX3Color
  | HEX4Color
  | HEX6Color
  | HEX8Color;

export type ObjectColor = Exclude<Color, string>;

export interface ColorMeta {
  rgb: RGBColor
  hsl: HSLColor
  hsv: HSVColor
  hex: string
  alpha: number
  rgba: RGBAColor
  hsla: HSLAColor
  hsva: HSVAColor
  hex8: string
  gray: number
  origin: Color
}

export type ColorType = 'hex' | 'rgb' | 'hsv' | 'hsl';
