<script lang="ts">
export default {
  name: 'Record',
};
</script>
<script lang="ts" setup>
import { computed, PropType } from 'vue';
import { storeToRefs } from 'pinia';
import * as BIZ from '@/types/business';
import CMSelector from '@/components/cm-selector/index.vue';
import { useUserStore } from '@/store';
import { AUTO_SIZE_OPTIONS } from './constants';

const props = defineProps({
  case: {
    type: Object as PropType<BIZ.IMedCase>,
    required: true,
  },
  currentPartyIdx: {
    type: Number,
    default: 0,
  },
  type: {
    type: String as PropType<'inquiry' | 'mediate'>,
    required: true,
    default: 'mediate',
  },
});

const partiesName = computed<string>(() => {
  return props.case.parties.map((party) => party.name).join(',');
});
const { userInfo } = storeToRefs(useUserStore());
const investigator = computed({
  get(): string {
    const { investigator } = props.case.parties[props.currentPartyIdx];
    if (investigator !== undefined) return investigator;
    Reflect.set(props.case.parties[props.currentPartyIdx], 'investigator', userInfo.value.userName);
    return userInfo.value.userName!;
  },
  set(newVal: string) {
    Reflect.set(props.case.parties[props.currentPartyIdx], 'investigator', newVal);
  },
});
const mediator = computed({
  get(): string {
    const { mediator } = props.case;
    if (mediator !== undefined) return mediator;
    Reflect.set(props.case, 'mediator', userInfo.value.userName);
    return userInfo.value.userName!;
  },
  set(newVal: string) {
    Reflect.set(props.case, 'mediator', newVal);
  },
});
</script>

<template>
  <t-form ref="form" :data="props.case" :colon="true">
    <template v-if="props.type === 'inquiry'">
      <t-form-item label="调查时间" name="investigateDate">
        <t-date-picker
          v-model="props.case.parties[props.currentPartyIdx].investigateDate"
          theme="primary"
          mode="date"
          clearable
        />
      </t-form-item>
      <t-form-item label="调查地点" name="investigateLoc">
        <t-input v-model="props.case.parties[props.currentPartyIdx].investigateLoc" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="调查事由" name="medDispute">
        <CMSelector
          v-model="props.case.parties[props.currentPartyIdx].dispute"
          dict-name="Dispute"
          value-equal-to-lable
          create-options
        />
      </t-form-item>
      <t-form-item label="参加人" name="participants">
        <t-input v-model="props.case.parties[props.currentPartyIdx].participants" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="调查人" name="investigator">
        <t-input v-model="investigator" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="调查记录人" name="recorder">
        <t-input v-model="props.case.parties[props.currentPartyIdx].recorder" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="被调查人" name="name">
        <t-input v-model="props.case.parties[props.currentPartyIdx].name" placeholder="请输入内容" readonly></t-input>
      </t-form-item>
      <t-form-item label="调查笔录" name="note">
        <t-textarea
          v-model="props.case.parties[props.currentPartyIdx].note"
          :autosize="AUTO_SIZE_OPTIONS"
          placeholder="请输入内容"
        ></t-textarea>
      </t-form-item>
    </template>
    <template v-else>
      <t-form-item label="调解时间" name="medDate">
        <t-date-picker v-model="props.case.medDate" theme="primary" mode="date" clearable />
      </t-form-item>
      <t-form-item label="调解地点" name="medAddr">
        <t-input v-model="props.case.medAddr" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="调解事由" name="medDispute">
        <CMSelector v-model="props.case.medDispute" dict-name="Dispute" value-equal-to-lable create-options />
      </t-form-item>
      <t-form-item label="参加人" name="participants">
        <t-input v-model="props.case.participants" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="调解员" name="mediator">
        <t-input v-model="mediator" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="调解记录人" name="medRecorder">
        <t-input v-model="props.case.medRecorder" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="当事人" name="partiesName">
        <t-input v-model="partiesName" placeholder="请输入内容" readonly></t-input>
      </t-form-item>
      <t-form-item label="调解笔录" name="medNote">
        <t-textarea v-model="props.case.medNote" :autosize="AUTO_SIZE_OPTIONS" placeholder="请输入内容"></t-textarea>
      </t-form-item>
    </template>
  </t-form>
</template>
