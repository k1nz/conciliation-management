<script lang="ts">
export default {
  name: 'DialogFormGroup',
};
</script>
<script lang="ts" setup>
import { computed, PropType, ref, watch } from 'vue';
import _ from 'lodash';
import { MessagePlugin } from 'tdesign-vue-next';
import { useRequest } from 'vue-request';

import type * as SYS from '@/types/system';
import * as API from '@/api';

const emit = defineEmits(['update:visible']);
const props = defineProps({
  /** dialog visibility */
  visible: {
    type: Boolean,
    default: false,
  },
  /** 分组树 */
  currentGroup: {
    type: Object as PropType<SYS.ITreeGroup>,
    required: true,
  },
  /** 当前选择的分组节点 */
  data: {
    type: Object as PropType<SYS.ITreeGroupObject | SYS.IReqCreateGroup>,
    required: true,
  },
  /** 更新分组树 */
  updateList: {
    type: Function as PropType<() => Promise<any>>,
    required: true,
  },
});
const localData = ref<SYS.ITreeGroupObject | SYS.IReqCreateGroup>({
  grpName: '',
  parentGrpId: '0',
  description: '',
});
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      localData.value = _.cloneDeep(props.data);
    }
  },
);
const mode = computed(() => {
  if (Reflect.has(localData.value, 'grpId')) {
    return 'edit';
  }
  return 'new';
});

const close = () => {
  emit('update:visible', false);
};
// 提交
const form = ref();
const handleSubmitSuccess = () => {
  props.updateList?.();
  MessagePlugin.success(`${mode.value === 'new' ? '创建' : '修改'}用户成功`);
  close();
};
const { loading: groupCreating, run: runCreateGroup } = useRequest(API.createGroups, {
  manual: true,
  onSuccess: handleSubmitSuccess,
});
const { loading: groupsUpdating, run: runUpdateGroups } = useRequest(API.updateGroups, {
  manual: true,
  onSuccess: handleSubmitSuccess,
});
const submitLoading = computed(() => groupsUpdating.value || groupCreating.value);
const onClickConfirm = async () => {
  const validateResult = await form.value.validate();
  if (validateResult === true) {
    try {
      if (mode.value === 'new') {
        await runCreateGroup(localData.value as SYS.IReqCreateGroup);
      } else if (mode.value === 'edit') {
        await runUpdateGroups(localData.value as SYS.IReqUpdateGroup);
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('error submit', validateResult);
  }
};
</script>
<template>
  <t-dialog
    v-model:visible="props.visible"
    placement="center"
    :header="`${mode === 'new' ? '新增' : localData.grpName + '的'}分组`"
    width="40%"
    :confirm-btn="{
      content: `${submitLoading ? '保存中...' : '提交'}`,
      theme: 'primary',
      loading: submitLoading,
    }"
    @confirm="onClickConfirm"
    @close="close"
  >
    <t-form
      ref="form"
      :data="localData"
      label-align="left"
      layout="vertical"
      :colon="true"
      :rules="FORM_RULES"
      label-width="120px"
    >
      <t-form-item label="父分组" name="parentGrpId">
        <t-cascader
          v-model="localData.parentGrpId"
          :keys="{ label: 'grpName', value: 'grpId', children: 'children' }"
          :options="props.currentGroup"
          check-strictly
          clearable
          placeholder="请选择"
        />
      </t-form-item>
      <t-form-item label="分组名称" name="grpName">
        <t-input v-model="localData.grpName"></t-input>
      </t-form-item>
      <t-form-item label="备注" name="description">
        <t-input v-model="localData.description"></t-input>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>
<style lang="less" scoped></style>
