export declare type NumberFormat = (v: number) => string;

export function defaultNumberFormat(v: number) {
  return v == null ? '' : v.toFixed(3);
}
