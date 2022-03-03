<template>
  <t-dialog
    v-model:visible="props.visible"
    placement="center"
    :header="`${mode === 'new' ? '新增' : defaultName + '的'}当事人调解申请`"
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
        <t-anchor-item :href="`#${path}#step-1`" title="当事人基本信息" />
        <t-anchor-item :href="`#${path}#step-2`" title="申请事项" />
      </t-anchor>
      <div id="anchor-container" class="form">
        <t-form
          ref="form"
          :data="localData"
          label-align="left"
          layout="vertical"
          :colon="true"
          :rules="FORM_RULES"
          label-width="150px"
        >
          <div :id="`${path}#step-1`">
            <t-divider align="left"> 当事人基本信息 </t-divider>
            <t-form-item label="申请所在调解室" name="medOfficeId">
              <med-office-selector v-model="localData.medOfficeId" />
            </t-form-item>
            <t-form-item label="当事人姓名" name="name">
              <t-input v-model="localData.name" placeholder="请填写"></t-input>
            </t-form-item>
            <t-form-item label="当事人类别" name="partyKind">
              <t-radio-group v-model:value="localData.partyKind" :default-value="PARTY_TYPE.First">
                <t-radio-button v-for="(item, index) in PARTY_OPTIONS" :key="index" :value="item.value">{{
                  item.label
                }}</t-radio-button>
              </t-radio-group>
            </t-form-item>
            <t-form-item label="性别" name="gender">
              <t-radio-group v-model:value="localData.gender">
                <t-radio-button v-for="(item, index) in GENDER_OPTIONS" :key="index" :value="item.value">{{
                  item.label
                }}</t-radio-button>
              </t-radio-group>
            </t-form-item>
            <t-form-item label="身份证号码" name="idCardNum">
              <t-input v-model="localData.idCardNum" placeholder="请填写" />
            </t-form-item>
            <t-form-item label="出生日期" name="birthday">
              <t-date-picker
                v-model="localData.birthday"
                placeholder="请选择"
                theme="primary"
                mode="date"
                format="YYYY-MM-DD"
              />
            </t-form-item>
            <t-form-item label="年龄" name="age">
              <t-input v-model="localData.age" placeholder="请填写" type="number" />
            </t-form-item>
            <t-form-item label="联系电话" name="phoneNum">
              <t-input v-model="localData.phoneNum" type="tel" placeholder="请填写" />
            </t-form-item>
            <t-form-item label="教育程度" name="edu">
              <cm-selector v-model="localData.edu" dict-name="Education" value-equal-to-lable />
            </t-form-item>
            <t-form-item label="民族" name="race">
              <cm-selector v-model="localData.race" dict-name="Nation" value-equal-to-lable />
            </t-form-item>
            <t-form-item label="职业" name="job">
              <cm-selector v-model="localData.job" dict-name="Career" value-equal-to-lable />
            </t-form-item>
            <t-form-item label="单位" name="workLocOrAddr">
              <t-input v-model="localData.workLocOrAddr" placeholder="请填写"></t-input>
            </t-form-item>
            <div :id="`${path}#step-2`">
              <t-divider align="left"> 申请事项 </t-divider>
            </div>
            <t-form-item label="申请时间" name="applicationDate">
              <t-input v-model="localData.applicationDate" placeholder="系统自动生成" readonly></t-input>
            </t-form-item>
            <t-form-item label="主要事实及申请事项" name="statement">
              <t-textarea
                v-model="localData.statement"
                placeholder="请填写"
                name="statement"
                :autosize="AUTO_SIZE_OPTIONS"
              />
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

import { PARTY_INITIAL_DATA } from '../constants';
import { GENDER_OPTIONS, PARTY_OPTIONS } from '@/constants';

import { PARTY_TYPE } from '@/types/business';
import * as BIZ from '@/types/business';
import type { GetRequired } from '@/types/utils';
import { validator } from '@/utils/reg-exp';

// CONSTANTS
const AUTO_SIZE_OPTIONS: boolean | { minRows?: number; maxRows?: number } = { minRows: 3 };

const FORM_RULES: Record<keyof GetRequired<BIZ.IReqCreateParty>, FormRule[]> = {
  medOfficeId: [{ required: true, message: '必填项' }],
  name: [{ required: true, message: '必填项' }],
  partyKind: [{ required: true, message: '必填项' }],
  gender: [{ required: true, message: '必填项' }],
  birthday: [{ required: true, message: '必填项' }],
  age: [{ required: true, message: '必填项' }],
  idCardNum: [
    { required: true, message: '必填项' },
    { validator: (val) => validator('idCard', val), message: '请输入正确的身份证号', trigger: 'change' },
  ],
  phoneNum: [
    { required: true, message: '必填项' },
    { validator: (val) => validator('telephone', val), message: '请输入正确的手机号', trigger: 'change' },
  ],
  edu: [{ required: true, message: '必填项' }],
  race: [{ required: true, message: '必填项' }],
  job: [{ required: true, message: '必填项' }],
  workLocOrAddr: [{ required: true, message: '必填项' }],
};
// CONSTANTS END

const emit = defineEmits(['update:visible', 'update:data']);
const props = withDefaults(
  defineProps<{
    data: Partial<BIZ.IParty>;
    visible: boolean;
    updateList: () => Promise<any>;
  }>(),
  {
    visible: false,
    procedureKind: 1,
  },
);
const defaultName = ref('');
const localData = ref<Partial<BIZ.IParty>>({ ...props.data });
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      localData.value = { ...props.data };
      defaultName.value = props.data.name ?? '';
    }
  },
);
const form = ref<{ validate: (params?: FormValidateParams) => FormValidateResult<BIZ.IReqCreateParty> } | null>(null);
const { path } = useRoute();
const mode = computed(() => {
  if (props.data?.caseId) {
    return 'edit';
  }
  return 'new';
});

// submit
const resetData = () => {
  emit('update:data', PARTY_INITIAL_DATA);
};
const close = () => {
  emit('update:visible', false);
  resetData();
};
const handleSubmitSuccess = () => {
  MessagePlugin.success(`${mode.value === 'new' ? '创建' : '修改'}当事人调解申请成功`);
  close();
  props.updateList?.();
};
const { loading: partyCreating, run: runCreateParty } = useRequest(API.createParty, {
  manual: true,
  onSuccess: handleSubmitSuccess,
});
const { loading: partyUpdating, run: runUpdateParty } = useRequest(API.updateParty, {
  manual: true,
  onSuccess: handleSubmitSuccess,
});
const submitLoading = computed(() => partyCreating.value || partyUpdating.value);
const onClickConfirm = async () => {
  const validateResult = await form.value!.validate();
  if (validateResult === true) {
    console.log(localData.value);
    // localData.value = { ...localData.value, ...props.data };
    try {
      if (mode.value === 'new') {
        await runCreateParty([localData.value] as BIZ.IReqCreateParty[]);
      } else if (mode.value === 'edit') {
        await runUpdateParty([localData.value] as BIZ.IParty[]);
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
