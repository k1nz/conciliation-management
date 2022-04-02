<template>
  <div>
    <t-row :gutter="[16, 24]" class="row-container">
      <t-col v-for="report in REPORTS" :key="report.id" :xs="12" :xl="6">
        <Suspense>
          <Report :type="report.type" :chart-id="report.id" />
          <template #fallback>
            <Card :title="report.title">
              <t-skeleton :loading="true" theme="tab" animation="gradient" />
            </Card>
          </template>
        </Suspense>
      </t-col>
    </t-row>
  </div>
</template>

<script lang="ts" setup>
import Report from './components/BrokenLineReport.vue';
import Card from '@/components/card/index.vue';

const REPORTS = [
  {
    id: 'monthlyReport',
    type: 'month',
    title: '月度台账',
  },
  {
    id: 'quarterlyReport',
    type: 'quarter',
    title: '季度台账',
  },
  {
    id: 'semiannualReport',
    type: 'semiannual',
    title: '半年度台账',
  },
  {
    id: 'annualReport',
    type: 'annual',
    title: '年度台账',
  },
] as const;
</script>
