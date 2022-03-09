/**
 * 删除对象键值对（默认删除undefined, null, 空字符串）
 * @param obj Object - 需要操作的对象
 * @param deleteValue [value] - 需要删除元素值为value的键值对
 * @param exclude Array<key> - 不删除obj[key]的键值对
 * @returns obj
 */
export const removeNullProperty = <T extends Record<string, any>>(
  obj: T extends Record<string, any> ? Record<string, any> : never,
  deleteValue: (null | undefined | string)[] = [undefined, null, ''],
  exclude: Array<keyof T> | undefined = undefined,
) => {
  for (const key in obj) {
    if (deleteValue.includes(obj[key]) && !exclude?.includes(key)) Reflect.deleteProperty(obj, key);
  }
  return obj;
};

export function filterDataByIds<T>(data: Array<T> = [], ids: Array<string | number> = [], byId = 'id'): Array<T> {
  return data.filter((d: Record<string, any> = {}) => ids.includes(d[byId]));
}
