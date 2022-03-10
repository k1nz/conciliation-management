<script lang="ts">
export default {
  name: 'MediateRecord',
};
</script>
<script lang="ts" setup>
import { PropType, ref } from 'vue';

import Card from '@/components/card/index.vue';
import Record from './Record.vue';

import * as BIZ from '@/types/business';

const props = defineProps({
  case: {
    type: Object as PropType<BIZ.IMedCase>,
    required: true,
  },
});

const currentSelectedPartyIdx = ref<number>(0);
</script>

<template>
  <div class="container">
    <div class="party-selector">
      <span>当事人：</span>
      <t-radio-group v-model="currentSelectedPartyIdx">
        <t-radio-button v-for="(party, idx) in props.case.parties" :key="party.partyId" :value="idx">{{
          party.name
        }}</t-radio-button>
      </t-radio-group>
    </div>
    <div class="cards h-full">
      <card class="record h-full" subtitle="调查笔录" border>
        <Record :current-party-idx="currentSelectedPartyIdx" :case="props.case" type="inquiry" />
      </card>
      <card class="record h-full" subtitle="调解笔录" border>
        <Record v-bind="$attrs" type="mediate" :case="props.case" />
      </card>
    </div>
  </div>
</template>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
}
.cards {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 10px;
  padding: 1rem 0;
  .record {
    flex: 1;
  }
}
.h-full {
  height: 100%;
}
</style>
