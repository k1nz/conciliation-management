<template>
  <div>
    <t-popup theme="default" :visible="visible" overlay-class-name="search-popup">
      <t-button @click="visibleChange">
        <template #icon>
          <t-icon name="filter" />
        </template>
        筛选
      </t-button>

      <template #content>
        <t-form
          ref="form"
          :data="localData"
          label-align="left"
          layout="vertical"
          :colon="true"
          :rules="FORM_RULES"
          label-width="100px"
        >
          <t-form-item label="受理日期" name="acceptDate">
            <t-date-picker
              v-model="selectedDates"
              :presets="presetsRange"
              theme="primary"
              mode="date"
              range
              style="flex: 1"
            >
              <template #default="{ trigger }">
                <t-button
                  v-for="(value, key) in presetsRange"
                  :key="key"
                  theme="primary"
                  variant="text"
                  @click="trigger('click', value, true)"
                >
                  {{ key }}
                </t-button>
              </template>
            </t-date-picker>
          </t-form-item>
          <t-form-item label="调解类别" name="caseKind">
            <t-select
              v-model="localData.caseKind"
              :options="CASE_KIND_OPTIONS"
              placeholder="请选择调解类别"
              clearable
            />
          </t-form-item>
          <t-form-item label="程序类别" name="procedureKind">
            <t-select
              v-model="localData.procedureKind"
              :options="PROCEDURE_KIND_OPTIONS"
              placeholder="请选择程序类别"
              clearable
            />
          </t-form-item>
          <t-form-item label="纠纷类别" name="disputeKind">
            <CmSelector v-model="localData.disputeKind" dict-name="Dispute" />
          </t-form-item>
          <t-form-item label="案号" name="docNum">
            <t-input v-model="localData.docNum"></t-input>
          </t-form-item>
          <t-form-item label="接办调解员" name="acceptor">
            <t-input v-model="localData.acceptor"></t-input>
          </t-form-item>
          <t-form-item label="结案日期" name="closeDate">
            <t-date-picker v-model="localData.closeDate" theme="primary" mode="date" style="flex: 1" clearable>
            </t-date-picker>
          </t-form-item>
        </t-form>
        <div class="search-popup__button">
          <t-button variant="text" style="margin-right: 12px" @click="visibleChange">取消</t-button>
          <t-button variant="text" style="margin-right: 12px" @click="reset">重置</t-button>
          <t-button theme="primary" @click="handleSearch">搜索</t-button>
        </div>
      </template>
    </t-popup>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { computed, ref } from 'vue';
import type { FormRule } from 'tdesign-vue-next';

import type * as BIZ from '@/types/business';
import { PROCEDURE_KIND_OPTIONS, CASE_KIND_OPTIONS } from '@/constants';
import CmSelector from '../../../../components/cm-selector/index.vue';

const props = withDefaults(defineProps<{ data: BIZ.IReqGetCase }>(), {
  data: () => ({
    acceptDate$ge: dayjs().format('YYYY-MM-DD'),
    acceptDate$lt: dayjs().format('YYYY-MM-DD'),
  }),
});
const emit = defineEmits(['update:data', 'search']);
// lose reactive
const defaultData = { ...props.data };
const localData = ref({ ...props.data });

const FORM_RULES: Partial<Record<keyof BIZ.IReqGetCase, FormRule[]>> = {
  acceptDate: [{ required: true }],
};

const selectedDates = computed<string[] | undefined>({
  get() {
    if (localData.value.acceptDate$ge === undefined || localData.value.acceptDate$lt === undefined)
      return [dayjs().toISOString(), dayjs().toISOString()];
    return [localData.value.acceptDate$ge, localData.value.acceptDate$lt];
  },
  set(newVal) {
    if (newVal !== undefined) {
      const [acceptDate$ge, acceptDate$lt] = newVal;
      Object.assign(localData.value, { acceptDate$ge, acceptDate$lt });
    }
  },
});
const presetsRange = {
  最近7天: [dayjs().subtract(6, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  最近3天: [dayjs().subtract(2, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
  今天: [dayjs().format('YYYY-MM-DD')],
};

const visible = ref<boolean>(false);
const visibleChange = () => {
  visible.value = !visible.value;
  if (visible.value) {
    localData.value = { ...props.data };
  }
};

const reset = () => {
  localData.value = { ...defaultData };
  emit('update:data', { ...props.data, ...defaultData });
};
const handleSearch = () => {
  visibleChange();
  emit('update:data', { ...props.data, ...localData.value });
};
</script>
<style lang="less">
.search-popup {
  width: 400px;
  padding: 20px 20px;
  &__button {
    margin-top: 20px;
    flex: 1;
    display: flex;
    justify-content: end;
  }
}
</style>
