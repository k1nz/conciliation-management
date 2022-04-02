<script lang="ts" setup>
import { nextTick, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue';
import { $computed, $ref } from 'vue/macros';
import * as echarts from 'echarts/core';
import { useEventListener } from '@vueuse/core';
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';

import { changeChartsTheme, getReportDataSet, ReportType } from '@/pages/dashboard/base/index';
import * as API from '@/api';
import { useSettingStore } from '@/store';
// components
import Card from '@/components/card/index.vue';
import { IMedMonthlyReport } from '@/types/business';

echarts.use([TooltipComponent, LegendComponent, GridComponent, LineChart, SVGRenderer]);
const settingStore = useSettingStore();

const props = defineProps({
  type: {
    type: String as PropType<ReportType>,
    required: true,
    default: 'month',
  },
  chartId: {
    type: String,
    required: true,
  },
});

const { chartId } = props;
const title = $computed(() => {
  if (props.type === 'month') return '月度报表';
  if (props.type === 'quarter') return '季度报表';
  if (props.type === 'semiannual') return '半年度报表';
  return '年度报表';
});
// request
const getReportData = async () => {
  try {
    switch (props.type) {
      case 'month': {
        const { data } = await API.getMonthlyReport({ year: 2021 });
        return data!;
      }
      case 'quarter': {
        const { data } = await API.getQuarterlyReport({ year: 2021 });
        return data!;
      }
      case 'semiannual': {
        const { data } = await API.getSemiannualReport({ year: 2021 });
        return data!;
      }
      case 'annual': {
        const { data } = await API.getAnnualReport({ yearStart: 2020, yearEnd: 2022 });
        return data!;
      }
      default:
        break;
    }
  } catch (e) {
    console.log(e);
  }
  return Promise.resolve([] as IMedMonthlyReport[]);
};
type GetPromiseInnerType<T extends Promise<unknown>> = T extends Promise<unknown>
  ? T extends Promise<infer P>
    ? P
    : never
  : never;
let data = $ref<GetPromiseInnerType<ReturnType<typeof getReportData>>>([]);
data = await getReportData();

const chartContainer = ref<HTMLElement | null>(null);
let reportChart: echarts.ECharts;

let resizeTime = $ref<number>(1);
const updateContainer = () => {
  if (document.documentElement.clientWidth >= 1400 && document.documentElement.clientWidth < 1920) {
    resizeTime = Number((document.documentElement.clientWidth / 2080).toFixed(2));
  } else if (document.documentElement.clientWidth < 1080) {
    resizeTime = Number((document.documentElement.clientWidth / 1080).toFixed(2));
  } else {
    resizeTime = 1;
  }
  reportChart.resize({
    width: chartContainer.value?.clientWidth || 500,
    height: resizeTime * 326,
  });
};
const renderCharts = () => {
  if (chartContainer.value) {
    reportChart = echarts.init(chartContainer.value);
    reportChart.setOption(getReportDataSet({ type: props.type, data, ...settingStore.chartColors }));
  }
};
onMounted(async () => {
  renderCharts();
  await nextTick();
  updateContainer();
});
useEventListener('resize', updateContainer, false);

watch(
  () => settingStore.brandTheme,
  () => {
    changeChartsTheme([reportChart]);
  },
);

watch(
  () => settingStore.mode,
  () => {
    reportChart.dispose();

    renderCharts();
  },
);

onBeforeUnmount(() => {
  console.log('unmount');
  chartContainer.value = null;
  reportChart.dispose();
});
</script>

<template>
  <card :title="title">
    <template #option>
      <div class="dashboard-chart-title-container">
        <!--        <t-date-picker-->
        <!--          class="card-date-picker-container"-->
        <!--          theme="primary"-->
        <!--          mode="date"-->
        <!--          range-->
        <!--          :default-value="LAST_7_DAYS"-->
        <!--          @change="onCurrencyChange"-->
        <!--        />-->
      </div>
    </template>
    <div
      :id="chartId"
      ref="chartContainer"
      class="dashboard-chart-container"
      :style="{ width: '100%', height: `${resizeTime * 326}px` }"
    />
  </card>
</template>

<style lang="less" scoped>
@import '@/style/variables.less';

.card-container.main-color {
  background: @brand-color;
  color: @text-color-primary;

  .card-subtitle {
    color: @text-color-anti;
  }
  .card-describe {
    color: @text-color-anti;
  }

  .dashboard-item-top span {
    color: @text-color-anti;
  }

  .dashboard-item-block {
    color: @text-color-anti;
    opacity: 0.6;
  }

  .dashboard-item-bottom {
    color: @text-color-anti;
  }
}
</style>
