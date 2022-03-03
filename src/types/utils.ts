export type GetRequired<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};
// eslint-disable-next-line
export function is<T>(value: any): value is T {
  return true;
}
