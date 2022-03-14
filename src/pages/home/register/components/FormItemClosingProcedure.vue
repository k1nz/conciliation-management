<template>
  <t-form-item label="结案日期" name="closeDate">
    <t-date-picker v-model="props.data.closeDate" theme="primary" mode="date" clearable />
  </t-form-item>
  <t-form-item label="调解结果" name="closingStatement">
    <t-textarea
      v-model="props.data.closingStatement"
      placeholder="请输入"
      name="closingNote"
      :autosize="{ minRows: 6 }"
    />
  </t-form-item>
  <t-form-item label="履行情况" name="executionKind">
    <t-radio-group
      v-model="props.data.executionKind"
      name="executionKind"
      :options="options.executionKind"
    ></t-radio-group>
  </t-form-item>
  <t-form-item label="回访情况" name="revisit">
    <t-radio-group v-model="props.data.revisit" name="revisit" :options="options.revisit"></t-radio-group>
  </t-form-item>
  <t-form-item label="归档日期" name="acceptDate">
    <t-input v-model="props.data.acceptDate" placeholder="系统自动生成" readonly></t-input>
  </t-form-item>
  <t-form-item label="保持期限" name="retentionPeriod">
    <!-- <t-input v-model="props.data.retentionPeriod" placeholder="请输入"></t-input> -->
    <cm-selector v-model="props.data.retentionPeriod" dict-name="KeepDeadline" />
  </t-form-item>
  <t-form-item label="备注" name="closingNote">
    <t-textarea v-model="props.data.closingNote" placeholder="请输入" name="closingNote" :autosize="{ minRows: 3 }" />
  </t-form-item>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';
import type * as BIZ from '@/types/business';
import { REVISIT_OPTIONS, EXECUTION_OPTIONS } from '@/constants';
import CmSelector from '@/components/cm-selector/index.vue';

const props = defineProps({
  data: {
    type: Object as PropType<BIZ.IReqCreateCase>,
    required: true,
  },
});

const options = ref({
  executionKind: EXECUTION_OPTIONS,
  revisit: REVISIT_OPTIONS,
});
</script>
<style lang="less"></style>
