import { ref, Ref, onUnmounted, onMounted } from 'vue';
import { $computed } from 'vue/macros';
import { useEventListener } from '@vueuse/core';
import * as echarts from 'echarts/core';
import { useUserStore } from '@/store';
import { IDocPreviewHooksOptions } from '@/types/business';
import { getBaseURL } from '@/api';

/**
 * eChart hook
 * @param domId
 * @param chart
 */
export const useChart = (domId: string): Ref<echarts.ECharts> => {
  let chartContainer: HTMLCanvasElement;
  const selfChart = ref<echarts.ECharts | any>();
  const updateContainer = () => {
    // TODO resize 报错，响应式的问题，待处理
    selfChart.value.resize({
      width: chartContainer.clientWidth,
      height: chartContainer.clientHeight,
    });
  };

  onMounted(() => {
    if (!chartContainer) {
      chartContainer = document.getElementById(domId) as HTMLCanvasElement;
    }
    selfChart.value = echarts.init(chartContainer);
  });

  useEventListener(window, 'resize', updateContainer, false);

  return selfChart;
};

/**
 * counter utils
 * @param duration
 * @returns
 */
export const useCounter = (duration = 60): [Ref<number>, () => void] => {
  // eslint-disable-next-line no-undef
  let intervalTimer: NodeJS.Timer;
  onUnmounted(() => {
    clearInterval(intervalTimer);
  });
  const countDown = ref(0);

  return [
    countDown,
    () => {
      countDown.value = duration;
      intervalTimer = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value -= 1;
        } else {
          clearInterval(intervalTimer);
          countDown.value = 0;
        }
      }, 1000);
    },
  ];
};

/**
 * permission utils
 */
export const usePermissionCheck = (): ((permissionArr: string[]) => boolean) => {
  const userStore = useUserStore();
  const roles = userStore.getRoles;

  return (permissionArr: string[]): boolean => {
    return [...permissionArr, 'ADMIN'].some((e) => roles.includes(e));
  };
};

/**
 * pdf
 */
export const usePdfPreview = (caseInfo: Ref<IDocPreviewHooksOptions>): (() => void) => {
  const userStore = useUserStore();
  const previewUrl = $computed(() => {
    return `${getBaseURL()}/pdf?${new URLSearchParams({
      acceptDate: caseInfo.value.acceptDate,
      caseId: caseInfo.value.caseId,
      docTyp: caseInfo.value.docTyp,
      partyId: caseInfo.value?.partyId || '',
      __token: userStore.token,
      disposition: 'inline',
    }).toString()}`;
  });

  return () => {
    window.open(previewUrl);
  };
};
