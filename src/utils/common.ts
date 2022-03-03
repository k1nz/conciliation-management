/**
 * 删除对象键值对（默认删除undefined, null, 空字符串）
 * @param obj Object - 需要操作的对象
 * @param valueCollection [value] - 需要删除元素值为value的键值对
 * @returns obj
 */
export const removeNullProperty = (
  obj: Record<string, any>,
  valueCollection: (null | undefined | string)[] = [undefined, null, ''],
) => {
  for (const item in obj) {
    if (valueCollection.includes(obj[item])) Reflect.deleteProperty(obj, item);
  }
  return obj;
};
