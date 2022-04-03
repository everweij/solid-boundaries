export interface Bounds {
  top: number;
  left: number;
  bottom: number;
  right: number;
  width: number;
  height: number;
}

export type BoundsKeys = Array<keyof Bounds>;

export const allKeys = [
  "bottom",
  "height",
  "left",
  "right",
  "top",
  "width"
] as BoundsKeys;

/**
 * Check if two bounds are equal.
 */
export function equals(
  a: Bounds,
  b: Bounds | null,
  keys: BoundsKeys = allKeys
) {
  return b && keys.every(key => a[key] === b[key]);
}

/**
 * Creates bounds from an element.
 */
export const boundsFromElement = (element: HTMLElement): Bounds => {
  const domRect = element.getBoundingClientRect();
  const bounds = Object.fromEntries(
    allKeys.map(key => [key, domRect[key]])
  ) as unknown as Bounds;
  return bounds;
};
