export interface IBounds {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

export type BoundsKeys = Array<keyof IBounds>;

const allKeys = [
  "bottom",
  "height",
  "left",
  "right",
  "top",
  "width"
] as BoundsKeys;

export function equals(
  a: IBounds,
  b: IBounds | null,
  keys: BoundsKeys = allKeys
) {
  return b && keys.every(key => a[key] === b[key]);
}
