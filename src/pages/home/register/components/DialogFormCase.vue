<template>
  <t-dialog
    v-model:visible="props.visible"
    placement="center"
    :header="`${mode === 'new' ? '新增' : defaultCaseName + '的'}案件`"
    width="50%"
    :confirm-btn="{
      content: `${submitLoading ? '保存中...' : '提交'}`,
      theme: 'primary',
      loading: submitLoading,
    }"
    @confirm="onClickConfirm"
    @close="close"
  >
    <div class="dialog">
      <t-anchor container="#anchor-container" class="anchor">
        <t-anchor-item :href="`#${path}#step-1`" title="调解受理" />
        <t-anchor-item :href="`#${path}#step-2`" title="当事人" />
        <t-anchor-item :href="`#${path}#step-3`" title="收条" />
        <t-anchor-item v-if="componentVisible.normal" :href="`#${path}#step-4`" title="结案登记" />
        <t-anchor-item v-if="componentVisible.normal" :href="`#${path}#step-5`" title="调解笔录" />
        <t-anchor-item v-if="componentVisible.justicial" :href="`#${path}#step-6`" title="司法确认" />
      </t-anchor>
      <div id="anchor-container" class="form">
        <t-form
          ref="form"
          :data="localData"
          label-align="left"
          layout="vertical"
          :colon="true"
          :rules="FORM_RULES"
          label-width="120px"
          :disabled="localData.archiveDate"
        >
          <div class="radio-group">
            <t-radio-group
              v-model:value="localData.caseKind"
              :default-value="localData.caseKind || CASE_TYPE.People"
              variant="primary-filled"
            >
              <t-radio-button :value="CASE_TYPE.People">人民调解</t-radio-button>
              <t-radio-button :value="CASE_TYPE.Public">治安调解</t-radio-button>
              <t-radio-button :value="CASE_TYPE.Stop">终止调解</t-radio-button>
            </t-radio-group>
            <t-radio-group
              v-if="localData.caseKind === CASE_TYPE.People"
              v-model:value="localData.procedureKind"
              :default-value="localData.procedureKind || CASE_PROCEDURE_TYPE.Easy"
              variant="primary-filled"
            >
              <t-radio-button :value="CASE_PROCEDURE_TYPE.Easy">简易程序</t-radio-button>
              <t-radio-button :value="CASE_PROCEDURE_TYPE.Normal">普通程序</t-radio-button>
              <t-radio-button :value="CASE_PROCEDURE_TYPE.Judicial">司法确认</t-radio-button>
            </t-radio-group>
          </div>
          <div :id="`${path}#step-1`">
            <t-divider align="left"> 调解受理 </t-divider>
            <t-form-item label="案号" name="caseId">
              <t-input v-model="localData.docNum" placeholder="系统自动生成" readonly></t-input>
            </t-form-item>
            <t-form-item label="受理日期" name="acceptDate">
              <t-input v-model="localData.acceptDate" placeholder="系统自动生成" readonly></t-input>
            </t-form-item>
            <t-form-item label="申请所在调解室" name="medOfficeId">
              <med-office-selector v-model="localData.medOfficeId" />
            </t-form-item>
            <t-form-item label="纠纷类别" name="disputeKind">
              <cm-selector v-model="localData.disputeKind" dict-name="Dispute" create-options value-equal-to-lable />
            </t-form-item>
            <t-form-item label="涉案金额" name="moneyInvolved">
              <t-input v-model="localData.moneyInvolved" type="number" suffix="元"></t-input>
            </t-form-item>
            <t-form-item label="纠纷简要情况" name="synopsis">
              <t-textarea
                v-model="localData.synopsis"
                placeholder="请输入"
                name="synopsis"
                :autosize="AUTO_SIZE_OPTIONS"
              />
            </t-form-item>
            <t-form-item label="调解达成协议" name="agreement">
              <t-textarea
                v-model="localData.agreement"
                placeholder="请输入"
                name="synopsis"
                :autosize="{ minRows: 6 }"
              />
            </t-form-item>
            <t-form-item label="协议履行情况" name="executionState">
              <t-textarea
                v-model="localData.executionState"
                placeholder="请输入"
                name="synopsis"
                :autosize="AUTO_SIZE_OPTIONS"
              />
            </t-form-item>
            <t-form-item label="受理方式" name="acceptMode">
              <cm-selector v-model="localData.acceptMode" dict-name="AcceptWay" />
            </t-form-item>
            <t-form-item label="移交民警" name="transferor">
              <t-input v-model="localData.transferor" placeholder="如：某派出所民警"></t-input>
            </t-form-item>
            <t-form-item label="接办调解员" name="acceptor">
              <t-input v-model="localData.acceptor" placeholder="调解员姓名"></t-input>
            </t-form-item>
          </div>
          <div :id="`${path}#step-2`">
            <t-divider align="left"> 当事人 </t-divider>
          </div>
          <div :id="`${path}#step-3`">
            <t-divider align="left"> 收条 </t-divider>
            <t-form-item label="收条内容" name="receiptContent">
              <t-textarea
                v-model="localData.receiptContent"
                placeholder="请输入"
                name="receiptContent"
                :autosize="AUTO_SIZE_OPTIONS"
              />
            </t-form-item>
            <t-form-item label="收条日期" name="receiptDate">
              <t-date-picker v-model="localData.receiptDate" theme="primary" mode="date" clearable />
            </t-form-item>
          </div>
          <div v-if="componentVisible.normal" :id="`${path}#step-4`">
            <t-divider align="left"> 结案登记 </t-divider>
            <form-item-closing-procedure :data="localData" />
          </div>
          <div v-if="componentVisible.normal" :id="`${path}#step-5`">
            <t-divider align="left"> 调解笔录 </t-divider>
          </div>
          <div v-if="componentVisible.justicial" :id="`${path}#step-6`">
            <t-divider align="left"> 司法确认 </t-divider>
            <t-form-item label="法院名称" name="court">
              <cm-selector v-model="localData.court" dict-name="Court" />
            </t-form-item>
          </div>
        </t-form>
      </div>
    </div>
  </t-dialog>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import type { FormRule, FormValidateParams, FormValidateResult } from 'tdesign-vue-next';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRequest } from 'vue-request';
import * as API from '@/api';
import MedOfficeSelector from '@/components/med-office-selector/index.vue';
import CmSelector from '@/components/cm-selector/index.vue';
import FormItemClosingProcedure from './FormItemClosingProcedure.vue';

import { CASE_INITIAL_DATA } from '../constants';

import { CASE_PROCEDURE_TYPE, CASE_TYPE } from '@/types/business';
import * as BIZ from '@/types/business';
import type { GetRequired } from '@/types/utils';

// CONSTANTS
const AUTO_SIZE_OPTIONS: boolean | { minRows?: number; maxRows?: number } = { minRows: 3 };

const FORM_RULES: Record<keyof GetRequired<BIZ.IReqCreateCase> | 'acceptor', FormRule[]> = {
  medOfficeId: [{ required: true, message: '必填项' }],
  caseKind: [{ required: true, message: '必填项' }],
  procedureKind: [{ required: true, message: '必填项' }],
  disputeKind: [{ required: true, message: '必填项' }],
  moneyInvolved: [{ required: true, message: '必填项' }],
  synopsis: [{ required: true, message: '必填项' }],
  agreement: [{ required: true, message: '必填项' }],
  acceptor: [{ required: true, message: '必填项' }],
};
// CONSTANTS END

const emit = defineEmits(['update:visible', 'update:data']);
const props = withDefaults(
  defineProps<{
    data: BIZ.IReqCreateCase;
    visible: boolean;
    updateList: () => Promise<any>;
    procedureKind: CASE_PROCEDURE_TYPE;
  }>(),
  {
    visible: false,
    procedureKind: 1,
  },
);
const defaultCaseName = ref('');
const localData = ref<BIZ.IReqCreateCase>({ ...props.data });
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      localData.value = { ...props.data };
      defaultCaseName.value = props.data.caseName ?? '';
    }
  },
);
const form = ref<{ validate: (params?: FormValidateParams) => FormValidateResult<BIZ.IReqCreateCase> } | null>(null);
const { path } = useRoute();
const mode = computed(() => {
  if (props.data?.caseId) {
    return 'edit';
  }
  return 'new';
});
const componentVisible = computed(() => ({
  normal: localData.value.caseKind === CASE_TYPE.People && localData.value.procedureKind !== CASE_PROCEDURE_TYPE.Easy,
  justicial:
    localData.value.caseKind === CASE_TYPE.People && localData.value.procedureKind === CASE_PROCEDURE_TYPE.Judicial,
}));

// submit
const resetData = () => {
  emit('update:data', CASE_INITIAL_DATA);
};
const close = () => {
  emit('update:visible', false);
  resetData();
};
const handleSubmitSuccess = () => {
  MessagePlugin.success(`${mode.value === 'new' ? '创建' : '修改'}案件成功`);
  close();
  props.updateList?.();
  resetData();
};
const { loading: caseCreating, run: runCreateCase } = useRequest(API.createCase, {
  manual: true,
  onSuccess: handleSubmitSuccess,
});
const { loading: caseUpdating, run: runUpdateCase } = useRequest(API.updateCase, {
  manual: true,
  onSuccess: handleSubmitSuccess,
});
const submitLoading = computed(() => caseUpdating.value || caseCreating.value);
const onClickConfirm = async () => {
  const validateResult = await form.value!.validate();
  if (validateResult === true) {
    console.log(localData.value);
    // localData.value = { ...localData.value, ...props.data };
    try {
      if (mode.value === 'new') {
        await runCreateCase(localData.value);
      } else if (mode.value === 'edit') {
        await runUpdateCase(localData.value);
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('error submit', validateResult);
  }
};

// onMounted(() => {});
</script>

<style lang="less" scoped>
.dialog {
  display: flex;
  flex-direction: row;
  .anchor {
    margin-top: 100px;
  }
  .form {
    padding: 20px;
    width: 80%;
    height: 80vh;
    overflow: auto;
  }
  .radio-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
</style>
