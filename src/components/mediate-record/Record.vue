<script lang="ts">
export default {
  name: 'Record',
};
</script>
<script lang="ts" setup>
import { computed, PropType } from 'vue';
import * as BIZ from '@/types/business';

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
</script>

<template>
  <t-form ref="form" :data="props.case" :colon="true">
    <t-form-item label="时间" name="medDate">
      <t-input v-model="props.case.medDate" placeholder="请输入内容"></t-input>
    </t-form-item>
    <t-form-item label="地点" name="medAddr">
      <t-input v-model="props.case.medAddr" placeholder="请输入内容"></t-input>
    </t-form-item>
    <t-form-item label="事由" name="status">
      <t-input v-model="props.case.status" placeholder="请输入内容"></t-input>
    </t-form-item>
    <t-form-item label="参加人" name="gender">
      <t-input v-model="props.case.medAddr" placeholder="请输入内容"></t-input>
    </t-form-item>
    <template v-if="props.type === 'inquiry'">
      <t-form-item label="调查人" name="investigator">
        <t-input v-model="props.case.parties[props.currentPartyIdx].investigator" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="记录人" name="recorder">
        <t-input v-model="props.case.parties[props.currentPartyIdx].recorder" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="被调查人" name="name">
        <t-input v-model="props.case.parties[props.currentPartyIdx].name" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="笔录" name="note">
        <t-input v-model="props.case.parties[props.currentPartyIdx].note" placeholder="请输入内容"></t-input>
      </t-form-item>
    </template>
    <template v-else>
      <t-form-item label="调解员" name="mediator">
        <t-input v-model="props.case.mediator" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="记录人" name="medRecorder">
        <t-input v-model="props.case.medRecorder" placeholder="请输入内容"></t-input>
      </t-form-item>
      <t-form-item label="当事人" name="partiesName">
        <t-input v-model="partiesName" placeholder="请输入内容" readonly></t-input>
      </t-form-item>
      <t-form-item label="笔录" name="medNote">
        <t-input v-model="props.case.medNote" placeholder="请输入内容"></t-input>
      </t-form-item>
    </template>
  </t-form>
</template>
