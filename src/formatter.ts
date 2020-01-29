export declare type NumberFormat = (v: number) => string;

export function defaultNumberFormat(v: number) {
  return v.toFixed(3);
}

export function percent(v: number) {
  return `${Math.round(v * 100 * 100) / 100}%`;
}
