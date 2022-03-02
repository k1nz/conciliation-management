<template>
  <t-select v-bind="$attrs" filterable clearable placeholder="请选择或搜索" :options="options">
    <template v-if="createOptions" #panelBottomContent>
      <div class="select-panel-footer">
        <t-button
          v-if="!createSelectOptionMode"
          theme="primary"
          variant="text"
          @click="createSelectOptionModeToggle(true)"
          >新增选项</t-button
        >
        <div v-else>
          <t-input v-model="newSelectOption" autofocus></t-input>
          <t-button size="small" style="margin-top: 12px" @click="onAddSelectOptionConfirm"> 确认 </t-button>
          <t-button
            theme="default"
            size="small"
            style="margin-top: 12px; margin-left: 8px"
            @click="createSelectOptionModeToggle(false)"
          >
            取消
          </t-button>
        </div>
      </div>
    </template>
  </t-select>
</template>

<script lang="ts">
export default {
  name: 'CMSelector',
};
</script>
<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import type { SelectOption } from 'tdesign-vue-next';
import { useSystemStore } from '@/store';
import { DICT_TYPES } from '@/constants';

const systemStore = useSystemStore();
type PropsDictNameType = keyof typeof DICT_TYPES;
const props = defineProps({
  // use system state dict
  dictName: {
    type: String as PropType<PropsDictNameType>,
    required: true,
  },
  // options
  valueEqualToLable: {
    type: Boolean,
    default: false,
  },
  // create new options?
  createOptions: {
    type: Boolean,
    default: false,
  },
});
const { dictName, valueEqualToLable, createOptions } = props;

const options = computed<SelectOption[]>(() => {
  if (dictName) {
    if (systemStore.dict[dictName] && valueEqualToLable) {
      return systemStore.getSelectOptions(systemStore.dict[dictName]!, { valueEqualToLable });
    }
    if (systemStore.dict[dictName]) return systemStore.getSelectOptions(systemStore.dict[dictName]!);
  }
  return [];
});

//
const createSelectOptionMode = ref<boolean>(false);
const newSelectOption = ref<string>('');
const createSelectOptionModeToggle = (mode: boolean) => {
  newSelectOption.value = '';
  createSelectOptionMode.value = mode;
};
const onAddSelectOptionConfirm = () => {
  if (!newSelectOption.value || newSelectOption.value === '') {
    MessagePlugin.warning('请正确填写!!!');
    return;
  }
  systemStore.dict[dictName]?.push({
    id: newSelectOption.value,
    value: newSelectOption.value,
    category: DICT_TYPES[dictName],
  });
  createSelectOptionModeToggle(false);
};
</script>
<style lang="less">
.select-panel-footer {
  border-top: 1px solid var(--td-border-level-2-color);
  margin-top: 8px;
  padding: 8px 0;
}
</style>
