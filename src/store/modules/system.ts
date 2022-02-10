import { acceptHMRUpdate, defineStore } from 'pinia';
import type { IFlatGroup, ITreeGroup, ITreeGroupObject } from '@/types/system';

export type ISystemStore = Record<string, any>;

const useSystemStore = defineStore({
  id: 'system',
  state: (): ISystemStore => ({}),

  actions: {
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
  },

  getters: {},
});
export default useSystemStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSystemStore, import.meta.hot));
}
