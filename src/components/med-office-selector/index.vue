<template>
  <t-select
    v-bind="$attrs"
    :options="medOfficeOptions"
    placeholder="请选择调解室"
    clearable
    @visible-change="getMedOffice"
  />
</template>

<script lang="ts">
export default {
  name: 'MedOfficeSelector',
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { to } from 'await-to-js';
import type { SelectOption } from 'tdesign-vue-next';
import { useSystemStore } from '@/store';

const systemStore = useSystemStore();

// const props = defineProps({
//   value: {
//     type: String as PropType<string>,
//     required: true,
//   },
// });
const medOfficeOptions = ref<SelectOption[]>();
// fetch
const getMedOffice = async (visible: boolean) => {
  if (!visible) return false;
  if (medOfficeOptions.value !== undefined) return true;
  let office = systemStore.medOffice;

  if (!office) {
    const [err, newOffice] = await to(systemStore.fetchMedOffice());
    if (err) {
      return MessagePlugin.warning('网络异常:无法获取调解室');
    }
    office = newOffice!;
  }

  medOfficeOptions.value = systemStore.getSelectOptions(office, { valueKey: 'officeId', labelKey: 'officeFullName' });
  return true;
};

onMounted(() => {
  getMedOffice(true);
});
</script>
<style lang="less"></style>
