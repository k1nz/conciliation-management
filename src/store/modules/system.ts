import to from 'await-to-js';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { SelectOption } from 'tdesign-vue-next';
import type { IDictEntry, IFlatGroup, IReqGetDict, ITreeGroup, ITreeGroupObject } from '@/types/system';
import { getDict, getMedOffice } from '@/api';
import { DICT_TYPES } from '@/constants';
import { IMedOfficeType } from '@/types/mediation';
import { is } from '@/utils/types-utils';

export interface GetSelectOptionsOptUseEqual {
  valueEqualToLable: boolean;
}
export interface GetSelectOptionsOptNotUseEqual<T> {
  valueKey: T;
  labelKey: T;
}
export type GetSeletOptionsOptUnion<T> = GetSelectOptionsOptNotUseEqual<T> | GetSelectOptionsOptUseEqual;

function getSelectOptions(originalData: IDictEntry[]): SelectOption[];
function getSelectOptions<T extends Record<string, any>[] = Record<string, any>[], U extends T[number] = T[number]>(
  originalData: T extends IDictEntry[] ? IDictEntry[] : T,
  options: T extends IDictEntry[] ? GetSelectOptionsOptUseEqual : GetSelectOptionsOptNotUseEqual<keyof U>,
): SelectOption[];
function getSelectOptions<T extends Record<string, any>[] = Record<string, any>[], U extends T[number] = T[number]>(
  originalData: T extends IDictEntry[] ? IDictEntry[] : T,
  options: GetSeletOptionsOptUnion<keyof U> = {
    valueKey: undefined,
    labelKey: undefined,
    valueEqualToLable: false,
  },
): SelectOption[] {
  const res: SelectOption[] = originalData.map((data) => {
    // overload 3
    const { valueKey, labelKey } = options as GetSelectOptionsOptNotUseEqual<keyof U>;
    if (valueKey && labelKey && is<U>(data)) {
      return {
        label: data[labelKey],
        value: data[valueKey],
      };
    }
    if (is<IDictEntry>(data)) {
      const { value: label, id: value } = data;
      // overload 2
      const { valueEqualToLable } = options as GetSelectOptionsOptUseEqual;
      if (valueEqualToLable) return { label, value: label };
      // overload 1
      return {
        label: label.toString(),
        value,
      };
    }
    return { label: '', value: '' };
  });
  return res;
}

export interface ISystemState {
  dict: Partial<Record<keyof typeof DICT_TYPES, IDictEntry[]>>;
  medOffice: IMedOfficeType[];
}
const useSystemStore = defineStore({
  id: 'system',
  state: (): ISystemState => ({
    dict: {},
    medOffice: [],
  }),

  actions: {
    initSystem() {
      this.fetchDict();
      this.fetchMedOffice();
    },
    getGroupTree(flatGroupData: IFlatGroup[]): ITreeGroup {
      const groupMap: Record<string, ITreeGroupObject> = {};
      const result: ITreeGroup = [];

      for (const group of flatGroupData) {
        const { grpId } = group;
        groupMap[grpId] = { ...group, children: [] };
      }

      for (const group of flatGroupData) {
        const id = group.grpId;
        const pid = group.parentGrpId;
        if (id === '0') {
          result.push(groupMap[id]);
        } else if (pid) {
          groupMap[pid].children!.push(groupMap[id]);
        } else {
          console.log('had not find pid');
        }
      }

      return result;
    },
    // fetch
    async fetchMedOffice() {
      const [err, data] = await to(getMedOffice());
      if (err || !data) throw err;
      this.medOffice = data.data ?? [];
      return this.medOffice;
    },
    async fetchDict(categorys: number[] | string[] = []): Promise<Record<string, IDictEntry[]> | undefined> {
      // initial
      if (!categorys.length) {
        this.dict = {};
        categorys = Object.keys(DICT_TYPES).filter((e) => !Number.isNaN(Number(e)));
      }
      const category = categorys.join(',');
      const queryParams: IReqGetDict = {
        category$in: category,
        __limit: 1000,
        __page: 1,
        __sortBy: 'category',
      };
      const [err, data] = await to(getDict(queryParams));
      if (err) {
        console.log('获取字典失败');
        return Promise.reject(err);
      }
      const { data: dictList } = data!;
      dictList?.forEach((dict) => {
        const { category } = dict;
        const key = DICT_TYPES[category] as keyof typeof DICT_TYPES;
        const stateDict = this.dict[key];
        if (!stateDict || stateDict.length === 0) this.dict[key] = [];
        this.dict[key]!.push(dict);
      });

      // TODO: The dictionary returned is obtained from the ID request in the argument(ids)
      return this.dict;
    },
    getSelectOptions, // declare on the top
  },

  getters: {},
});
export default useSystemStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSystemStore, import.meta.hot));
}
