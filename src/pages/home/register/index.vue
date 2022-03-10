<template>
  <card title="调解登记">
    <t-row justify="space-between">
      <div class="left-operation-container">
        <t-button :disabled="!hasPermission(['med_case:create'])" @click="handleCreateCase"> 调解申请 </t-button>
        <t-button variant="base" theme="default" @click="handleExport"> 导出 </t-button>
      </div>
      <div style="display: flex; flex-direction: row; gap: 20px">
        <PopupFormSearch v-model:data="queryParams" />
      </div>
    </t-row>

    <t-table
      :data="data"
      :columns="COLUMNS"
      row-key="index"
      vertical-align="top"
      :hover="true"
      :pagination="pagination"
      :loading="loading"
      @change="rehandleChange"
    >
      <template #index="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #accept-date="{ row }">
        <div>{{ row.acceptDate.split(' ')[0] }}</div>
      </template>
      <template #dispute-kind="{ row }">
        <div v-if="row.disputeKind === 1">人民调解</div>
        <div v-else-if="row.disputeKind === 2">治安调解</div>
        <div v-else>终止调解</div>
      </template>
      <template #procedure-kind="{ row }">
        <div v-if="row.procedureKind === 1">简易程序</div>
        <div v-else-if="row.procedureKind === 2">普通程序</div>
        <div v-else>终止调解</div>
      </template>
      <template #archive-date="{ row }">
        <t-tag v-if="row.archiveDate" theme="success" variant="light"> 是 </t-tag>
        <t-tag v-else theme="danger" variant="light"> 否 </t-tag>
      </template>

      <template #op="{ row, rowIndex }">
        <t-tooltip content="详情" style="margin: 0 25px 0px 0">
          <t-icon name="bulletpoint" size="xs" style="cursor: pointer" @click="handleClickDetail(row)" />
        </t-tooltip>
        <t-tooltip theme="danger" :content="row.archiveDate ? '已归档无法删除' : '删除'" style="margin: 0 25px 0px 0">
          <t-icon
            name="delete"
            size="xs"
            :style="{ cursor: row.archiveDate ? 'not-allowed' : 'pointer' }"
            @click="showDialog('delete', rowIndex, row)"
          />
        </t-tooltip>
        <t-tooltip theme="primary" content="打印预览" style="margin: 0 25px 0px 0">
          <t-icon name="print" size="xs" style="cursor: pointer" @click="handlePreview(row)" />
        </t-tooltip>
        <t-tooltip theme="primary" :content="row.archiveDate ? '已归档' : '归档'" style="margin: 0 0px 0px 0">
          <t-icon
            name="save"
            size="xs"
            :style="{ cursor: row.archiveDate ? 'not-allowed' : 'pointer' }"
            @click="showDialog('archive', rowIndex, row)"
          />
        </t-tooltip>
      </template>
    </t-table>
    <t-dialog
      :visible="dialogState.confirmVisible || dialogState.mode === 'delete'"
      :header="`${dialogState.mode === 'delete' ? '确认删除当前所选案件？' : '确定对当前案件归档？'}`"
      :body="confirmBody"
      :on-cancel="resetDialogState"
      :confirm-btn="{
        content: `${caseDeleting ? '删除中...' : caseArchiving ? '归档中' : '确认'}`,
        loading: caseDeleting,
      }"
      @confirm="handleDialogConfirm"
    />
    <DialogFormCase v-model:data="selectedData" v-model:visible="visible" :update-list="refresh" />
  </card>
</template>
<script setup lang="ts">
import { useRequest } from 'vue-request';
import { ref, computed, reactive } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import type { TableChangeData } from 'tdesign-vue-next';
import { usePermissionCheck } from '@/hooks';

import Card from '@/components/card/index.vue';
import PopupFormSearch from './components/PopupFormSearch.vue';
import DialogFormCase from './components/DialogFormCase.vue';

import { CASE_INITIAL_DATA, COLUMNS, DEFAULT_SEARCH_PARAMS, DEFAULT_PAGINATION } from './constants';
import * as API from '@/api';
import type * as BIZ from '@/types/business';
import { getBaseURL } from '@/api';
import { TOKEN_NAME } from '@/config/global';

const hasPermission = usePermissionCheck();

// data init
const pagination = ref<typeof DEFAULT_PAGINATION & { total?: number }>(DEFAULT_PAGINATION);
const selectedData = ref<BIZ.IReqCreateCase>(CASE_INITIAL_DATA);
const queryParams = ref<BIZ.IReqGetCase>(DEFAULT_SEARCH_PARAMS);
const queryParamsFormat = computed(() => {
  const { acceptDate$ge, acceptDate$lt } = queryParams.value;
  return {
    ...queryParams.value,
    acceptDate$ge: `${acceptDate$ge} 00:00:00`,
    acceptDate$lt: `${acceptDate$lt} 23:59:59`,
  };
});

// request
const {
  data: list,
  loading,
  refresh,
  // run,
} = useRequest(() => API.getCase(queryParamsFormat.value), {
  refreshDeps: [queryParamsFormat],
  onSuccess: (res) => {
    if (res.count !== undefined) {
      pagination.value.total = res.count!;
    }
  },
});
const data = computed<BIZ.IMedCase[]>(() => {
  return list?.value?.data || [];
});

const rehandleChange = (changeParams: TableChangeData) => {
  const { pageSize, current } = changeParams.pagination!;
  pagination.value = {
    ...pagination.value,
    pageSize: pageSize as number,
    current: current || 1,
  };
  queryParams.value = {
    ...queryParams.value,
    __limit: pageSize as number,
    __page: current || 1,
  };
};

const visible = ref(false);
const handleCreateCase = () => {
  visible.value = true;
};

// export
const handleExport = () => {
  MessagePlugin.success('正在导出，请稍后...');
  const { __page, __limit, ...rest } = queryParamsFormat.value;
  const params: Record<string, any> = { __token: localStorage.getItem(TOKEN_NAME), ...rest };
  for (const key in params) {
    const deleteValue = ['', null, undefined];
    if (deleteValue.includes(params[key])) Reflect.deleteProperty(params, key);
  }
  const src = `${getBaseURL()}/med_case/brief/export?${new URLSearchParams(params).toString()}`;
  const a = document.createElement('a');
  a.href = src;
  a.download = '数据报表.xlsx';
  a.click();
};
const handlePreview = (row: BIZ.IMedCase) => {
  console.log('todo', row);
};

// case detail
const handleClickDetail = (row: BIZ.IMedCase) => {
  selectedData.value = { ...row };
  visible.value = true;
};

// dialog
interface DialogStateType {
  mode: '' | 'delete' | 'archive';
  confirmVisible: boolean;
  selectedIndex: number;
  confirmSuccess: () => void;
}
const dialogState = reactive<DialogStateType>({
  mode: '',
  confirmVisible: false,
  selectedIndex: -1,
  confirmSuccess: () => {
    refresh();
    MessagePlugin.success(dialogState.mode === 'delete' ? '删除成功' : '归档成功');
    resetDialogState();
  },
});
const confirmBody = computed<string>(() => {
  if (dialogState.selectedIndex > -1) {
    const { caseName } = data.value[dialogState.selectedIndex];
    return `你将对 ${caseName || '未命名'} 案件执行${dialogState.mode === 'delete' ? '删除' : '归档'}操作。`;
  }
  return '';
});
const showDialog = (mode: DialogStateType['mode'], selectedIndex: number, row: BIZ.IMedCase) => {
  if (row.archiveDate) return;
  Object.assign(dialogState, { mode, selectedIndex, confirmVisible: true });
};
const resetDialogState = () => {
  Object.assign(dialogState, { selectedIndex: -1, confirmVisible: false, mode: '' });
};
// dialog confirm
const { loading: caseArchiving, run: caseArchive } = useRequest(API.caseArchive, {
  manual: true,
  onSuccess: dialogState.confirmSuccess,
});
const { loading: caseDeleting, run: deleteCase } = useRequest(API.deleteCase, {
  manual: true,
  onSuccess: dialogState.confirmSuccess,
});
const handleDialogConfirm = async () => {
  const { caseId, acceptDate } = data.value[dialogState.selectedIndex];
  switch (dialogState.mode) {
    case 'delete':
      deleteCase({ acceptDate, caseId });
      break;
    case 'archive':
      caseArchive({ acceptDate, caseId });
      break;
    default:
      break;
  }
};
</script>
<style lang="less"></style>
