<template>
  <t-divider align="left"> 调解受理 </t-divider>
  <t-form-item label="案号" name="caseId">
    <t-input v-model="props.data.docNum" placeholder="系统自动生成" readonly></t-input>
  </t-form-item>
  <t-form-item label="受理日期" name="acceptDate">
    <t-input v-model="props.data.acceptDate" placeholder="系统自动生成" readonly></t-input>
  </t-form-item>
  <t-form-item label="申请所在调解室" name="medOfficeId">
    <med-office-selector v-model="props.data.medOfficeId" />
  </t-form-item>
  <t-form-item label="纠纷类别" name="disputeKind">
    <cm-selector v-model="props.data.disputeKind" dict-name="Dispute" create-options value-equal-to-lable />
  </t-form-item>
  <t-form-item label="涉案金额" name="moneyInvolved">
    <t-input v-model="props.data.moneyInvolved" type="number" suffix="元"></t-input>
  </t-form-item>
  <t-form-item label="纠纷简要情况" name="synopsis">
    <t-textarea v-model="props.data.synopsis" placeholder="请输入" name="synopsis" :autosize="AUTO_SIZE_OPTIONS" />
  </t-form-item>
  <t-form-item label="调解达成协议" name="agreement">
    <t-textarea v-model="props.data.agreement" placeholder="请输入" name="synopsis" :autosize="{ minRows: 6 }" />
  </t-form-item>
  <t-form-item label="协议履行情况" name="executionState">
    <t-textarea
      v-model="props.data.executionState"
      placeholder="请输入"
      name="synopsis"
      :autosize="AUTO_SIZE_OPTIONS"
    />
  </t-form-item>
  <t-form-item label="受理方式" name="acceptMode">
    <cm-selector v-model="props.data.acceptMode" dict-name="AcceptWay" />
  </t-form-item>
  <t-form-item label="移交民警" name="transferor">
    <t-input v-model="props.data.transferor" placeholder="如：某派出所民警"></t-input>
  </t-form-item>
  <t-form-item label="接办调解员" name="acceptor">
    <t-input v-model="props.data.acceptor" placeholder="调解员姓名"></t-input>
  </t-form-item>
</template>
<script setup lang="ts">
import type { PropType } from 'vue';
import CmSelector from '@/components/cm-selector/index.vue';
import MedOfficeSelector from '@/components/med-office-selector/index.vue';

import { AUTO_SIZE_OPTIONS } from '../constants';

import type * as BIZ from '@/types/business';

const props = defineProps({
  data: {
    type: Object as PropType<BIZ.IReqCreateCase>,
    required: true,
  },
});
</script>
<style lang="less"></style>
