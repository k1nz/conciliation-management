export const RegExpEnum: Record<string, RegExp | (string | RegExp)[]> = {
  idCard: [
    '^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$',
    '^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}([0-9]|X)$',
  ],
  telephone:
    /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
};
export const validator = (regName: string, value: string): boolean | never => {
  if (regName in RegExpEnum) {
    const reg = RegExpEnum[regName];
    if (reg instanceof Array) {
      for (const regItem of reg) {
        if (regItem instanceof RegExp && regItem.test(value)) return true;
        if (typeof regItem === 'string' && new RegExp(regItem).test(value)) return true;
      }
      return false;
    }
    if (reg instanceof RegExp) {
      return reg.test(value);
    }
    throw Error('error, 10001');
  }
  throw Error('请输入正确的正则Key, 10002');
};
