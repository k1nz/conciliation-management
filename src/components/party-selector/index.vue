<template>
  <div>
    <t-row class="tag-block">
      <t-tag
        v-for="item in currentSelectRowData"
        :key="item.partyId"
        theme="primary"
        :closable="!disabled"
        @close="handleClose(item.partyId)"
      >
        {{ item.name }}
      </t-tag>
    </t-row>
    <t-row justify="space-between" style="margin-bottom: 20px">
      <div>
        显示未关联案件当事人
        <t-switch v-model="notCorrelate" size="large" :loading="loading"></t-switch>
      </div>
      <div style="display: flex; flex-direction: row; gap: 20px">
        <t-input
          v-model="queryParams.name$like"
          class="search-input"
          placeholder="输入姓名，按回车搜索"
          clearable
          @enter="refresh"
        >
        </t-input>
      </div>
    </t-row>
    <t-table
      :data="data"
      :columns="COLUMNS"
      row-key="partyId"
      size="small"
      expand-icon
      vertical-align="top"
      :hover="true"
      :pagination="pagination"
      :loading="loading"
      :expanded-row-keys="expandedRowKeys"
      :expand-on-row-click="false"
      :selected-row-keys="selectedKeys"
      @select-change="handleSelectedChange"
      @change="rehandleChange"
      @expand-change="rehandleExpandChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <!-- 当事人类别 -->
      <template #party-kind="{ row }">
        <div v-for="(item, index) in PARTY_OPTIONS" :key="index">
          <template v-if="row.partyKind === item.value">
            {{ item.label }}
          </template>
        </div>
      </template>
      <!-- 性别 -->
      <template #gender="{ row }">
        <div v-for="(item, index) in GENDER_OPTIONS" :key="index">
          <template v-if="row.gender === item.value">
            {{ item.label }}
          </template>
        </div>
      </template>
      <template #id-card-photo="{ row }">
        <t-tooltip content="查看或上传">
          <t-icon name="image" size="xs" style="cursor: pointer" @click="showUploadPopup(row)" />
        </t-tooltip>
      </template>
      <template #expandedRow="{ row }">
        <div class="more-detail">
          <p class="title"><b>申请时间：</b></p>
          <p class="content">{{ row.applicationDate }}</p>
          <br />
          <p class="title"><b>主要事实及申请事项：</b></p>
          <p class="content">{{ row.statement }}</p>
          <br />
        </div>
      </template>
    </t-table>
    <!-- <dialog-upload v-model:visible="uploadVisible" :data="selectedData" :update-list="refresh" /> -->
  </div>
</template>
<script lang="ts">
export default {
  name: 'PartySelector',
};
</script>

<script lang="ts" setup>
import { useRequest } from 'vue-request';
import type { PropType } from 'vue';
import { ref, computed, onBeforeMount, useAttrs } from 'vue';
import dayjs from 'dayjs';
import { SelectOptions } from 'tdesign-vue-next';
import type { TableChangeData } from 'tdesign-vue-next';
// import DialogUpload from '@/pages/home/party/components/DialogUpload.vue';

import _ from 'lodash';
import { DEFAULT_PAGINATION, COLUMNS } from './constants';
import { PARTY_OPTIONS, GENDER_OPTIONS } from '@/constants';

import * as API from '@/api';
import type * as BIZ from '@/types/business';
import type { ICorrelateCase } from './type';
import { GetPartsRequired } from '@/types/utils';

const emit = defineEmits(['update:selected']);
const props = defineProps({
  selected: {
    type: Array as PropType<Array<GetPartsRequired<Partial<BIZ.IParty>, 'partyId' | 'applicationDate'>>>,
    required: true,
    default: () => [],
  },
  correlateCase: {
    type: Object as PropType<ICorrelateCase>,
  },
  defaultSelectedData: {
    type: Array as PropType<Array<GetPartsRequired<Partial<BIZ.IParty>, 'partyId' | 'applicationDate'>>>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// 已选择tags
const handleClose = (partyId: BIZ.IParty['partyId']) => {
  currentSelectRowData.value = currentSelectRowData.value.filter((e) => e.partyId !== partyId);
  emit('update:selected', currentSelectRowData.value);
};
const attrs = useAttrs();
const disabled = computed<boolean>(() => {
  return !!attrs.disabled || props.disabled;
});

// table
// 选择
const selectedKeys = computed<string[]>(() => [...new Set(props.selected.map((e) => e.partyId) || [])]);
const currentSelectRowData = ref<GetPartsRequired<Partial<BIZ.IParty>, 'partyId' | 'applicationDate'>[]>([]);
const handleSelectedChange = (
  selectedRowKeys: Array<string>,
  { type, currentRowData, selectedRowData }: SelectOptions<BIZ.IParty>,
) => {
  console.log(currentRowData);
  // select all
  if (typeof currentRowData === 'undefined') {
    const diffItems: BIZ.IParty[] = _.differenceBy(selectedRowData, currentSelectRowData.value, 'partyId');
    currentSelectRowData.value =
      type === 'check'
        ? currentSelectRowData.value.concat(diffItems)
        : _.differenceBy(currentSelectRowData.value, data.value, 'partyId');
  } else {
    // single select
    // eslint-disable-next-line no-lonely-if
    if (type === 'check') currentSelectRowData.value.push(currentRowData);
    else currentSelectRowData.value = currentSelectRowData.value.filter((e) => e.partyId !== currentRowData.partyId);
  }
  emit('update:selected', currentSelectRowData.value);
};
// 展开
const expandedRowKeys = ref<string[]>([]);
const rehandleExpandChange = (value: string[]) => {
  expandedRowKeys.value = value;
};

/**
 * 请求相关
 */
const notCorrelate = ref<boolean>(false);
// 表格分页
const pagination = ref<typeof DEFAULT_PAGINATION & { total?: number }>(DEFAULT_PAGINATION);
// 刷新依赖，修改自动刷新
const refreshDeps = computed(() => ({
  __limit: pagination.value.pageSize,
  __page: pagination.value.current,
}));
// 默认参数
const queryParams = ref<BIZ.IReqGetParty>({
  applicationDate$ge: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
  applicationDate$lt: dayjs().format('YYYY-MM-DD'),
  __sortBy: 'applicationDate$desc',
  ...props.correlateCase,
});
// 请求参数formatter
const queryParamsFormat = computed(() => {
  const { applicationDate$ge, applicationDate$lt } = queryParams.value;
  let res = {
    ...refreshDeps.value,
    ...queryParams.value,
    applicationDate$ge: `${applicationDate$ge} 00:00:00`,
    applicationDate$lt: `${applicationDate$lt} 23:59:59`,
  };
  if (notCorrelate.value)
    res = { ...res, caseAcceptDate: '', caseId: '', caseId$null: 'true', caseAcceptDate$null: 'true' };
  return res;
});
const {
  data: list,
  loading,
  refresh,
} = useRequest(() => API.getParty(queryParamsFormat.value), {
  refreshDeps: [refreshDeps, notCorrelate],
  onSuccess: (res) => {
    if (res.count !== undefined) {
      pagination.value.total = res.count!;
    }
  },
});
const data = computed(() => {
  return list?.value?.data || [];
});
const rehandleChange = (changeParams: TableChangeData) => {
  const { pageSize, current } = changeParams.pagination!;
  pagination.value = {
    ...pagination.value,
    pageSize: pageSize as number,
    current: current || 1,
  };
};

// upload
const selectedData = ref<Partial<BIZ.IParty>>();
const uploadVisible = ref(false);
const showUploadPopup = (row: BIZ.IParty) => {
  selectedData.value = row;
  uploadVisible.value = true;
};
onBeforeMount(() => {
  notCorrelate.value = !props.selected.length;
  currentSelectRowData.value = [...props.selected];
});
</script>
<style lang="less">
.tag-block {
  display: flex;
  > * {
    margin-right: 30px;
    margin-bottom: 20px;
  }
}
</style>
