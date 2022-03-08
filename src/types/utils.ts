/**
 * 将对象类型中某些类型设为必须
 * 接受两个类型变量<T, U>
 *   T: 需要操作的对象类型
 *   U: 需要设为必须类型的键
 */
export type GetPartsRequired<T extends Record<string, any>, U extends keyof T = keyof T> = T & Pick<Required<T>, U>;

/**
 * 返回接口中所有必须类型，即去除所有可选类型
 */
export type GetRequired<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K];
};

/**
 * is类型保护
 * @example if(is<Type>(data)) { // 作用域内所有data类型均为Type }
 * @param value
 * @return true
 */
// eslint-disable-next-line
export function is<T>(value: any): value is T {
  return true;
}
