<template>
  <card title="当事人管理">
    <t-row justify="space-between">
      <div class="left-operation-container">
        <t-button :disabled="!hasPermission(['party:create'])" @click="handleCreateCase"> 新增当事人调解申请 </t-button>
      </div>
      <div style="display: flex; flex-direction: row; gap: 20px">
        <t-input
          v-model="queryParams.name$like"
          class="search-input"
          placeholder="请输入姓名搜索"
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
      expand-icon
      vertical-align="top"
      :hover="true"
      :pagination="pagination"
      :loading="loading"
      :expanded-row-keys="expandedRowKeys"
      :expand-on-row-click="false"
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
      <template #op="{ row, rowIndex }">
        <t-tooltip content="详情" style="margin: 0 25px 0 0">
          <t-icon name="bulletpoint" size="xs" style="cursor: pointer" @click="handleClickDetail(row)" />
        </t-tooltip>
        <t-tooltip theme="danger" content="删除" style="margin: 0 0 0 0">
          <t-icon
            name="delete"
            size="xs"
            :style="{ cursor: row.archiveDate ? 'not-allowed' : 'pointer' }"
            @click="showDialog('delete', rowIndex)"
          />
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
    <t-dialog
      :visible="dialogState.confirmVisible || dialogState.mode === 'delete'"
      :header="`${dialogState.mode === 'delete' ? '确认删除当前所选当事人？' : ''}`"
      :body="confirmBody"
      :on-cancel="resetDialogState"
      :confirm-btn="{
        content: `${caseDeleting ? '删除中...' : '确认'}`,
        loading: caseDeleting,
      }"
      @confirm="handleDialogConfirm"
    />
    <dialog-form-party v-model:data="selectedData" v-model:visible="visible" :update-list="refresh" />
    <dialog-upload v-model:visible="uploadVisible" :data="selectedData" :update-list="refresh" />
  </card>
</template>
<script setup lang="ts">
import { useRequest } from 'vue-request';
import { ref, computed, reactive } from 'vue';
import dayjs from 'dayjs';
import { MessagePlugin } from 'tdesign-vue-next';
import type { TableChangeData } from 'tdesign-vue-next';
import { usePermissionCheck } from '@/hooks';
import { PARTY_INITIAL_DATA, COLUMNS } from './constants';
import { PARTY_OPTIONS, GENDER_OPTIONS } from '@/constants';

import Card from '@/components/card/index.vue';
import DialogUpload from './components/DialogUpload.vue';
import DialogFormParty from './components/DialogFormParty.vue';

import * as API from '@/api';
import type * as BIZ from '@/types/business';

const DEFAULT_PAGINATION = {
  pageSize: 20,
  current: 1,
};

const hasPermission = usePermissionCheck();

// data init
const pagination = ref<typeof DEFAULT_PAGINATION & { total?: number }>(DEFAULT_PAGINATION);
const selectedData = ref<Partial<BIZ.IParty>>(PARTY_INITIAL_DATA);
const queryParams = ref<BIZ.IReqGetParty>({
  applicationDate$ge: dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
  applicationDate$lt: dayjs().format('YYYY-MM-DD'),
  __limit: DEFAULT_PAGINATION.pageSize,
  __page: DEFAULT_PAGINATION.current,
  __sortBy: 'applicationDate$desc',
});
const queryParamsFormat = computed(() => {
  const { applicationDate$ge, applicationDate$lt } = queryParams.value;
  return {
    ...queryParams.value,
    applicationDate$ge: `${applicationDate$ge} 00:00:00`,
    applicationDate$lt: `${applicationDate$lt} 23:59:59`,
  };
});

// table
const expandedRowKeys = ref<string[]>([]);
const rehandleExpandChange = (value: string[]) => {
  expandedRowKeys.value = value;
};

// request
const {
  data: list,
  loading,
  refresh,
  // run,
} = useRequest(() => API.getParty(queryParamsFormat.value), {
  refreshDeps: [queryParamsFormat],
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
  queryParams.value = {
    ...queryParams.value,
    __limit: pageSize as number,
    __page: current || 1,
  };
};

// upload
const uploadVisible = ref(false);
const showUploadPopup = (row: BIZ.IParty) => {
  selectedData.value = row;
  uploadVisible.value = true;
};

// user detail
const visible = ref(false);
const handleCreateCase = () => {
  visible.value = true;
};
const handleClickDetail = (row: BIZ.IParty) => {
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
    MessagePlugin.success(dialogState.mode === 'delete' ? '删除成功' : '');
    resetDialogState();
  },
});
const confirmBody = computed<string>(() => {
  if (dialogState.selectedIndex > -1) {
    const { name } = data.value[dialogState.selectedIndex];
    switch (dialogState.mode) {
      case 'delete':
        return `你将对 ${name || '未命名'} 当事人执行删除操作。`;
      default:
        return '';
    }
  }
  return '';
});
const showDialog = (mode: DialogStateType['mode'], selectedIndex: number) => {
  Object.assign(dialogState, { mode, selectedIndex, confirmVisible: true });
};
const resetDialogState = () => {
  Object.assign(dialogState, { selectedIndex: -1, confirmVisible: false, mode: '' });
};
// dialog confirm
const { loading: caseDeleting, run: deleteParty } = useRequest(API.deleteParty, {
  manual: true,
  onSuccess: dialogState.confirmSuccess,
});
const handleDialogConfirm = async () => {
  const { partyId, applicationDate } = data.value[dialogState.selectedIndex];
  switch (dialogState.mode) {
    case 'delete':
      deleteParty({ applicationDate, partyId });
      break;
    default:
      break;
  }
};
</script>
<style lang="less"></style>
