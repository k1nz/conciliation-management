<template>
  <card title="分组管理">
    <t-row>
      <t-button type="primary" @click="refresh">刷新</t-button>
    </t-row>
    <t-enhanced-table
      :data="data"
      :columns="COLUMNS"
      row-key="grpId"
      vertical-align="top"
      :hover="true"
      :loading="loading"
    >
      <template #op="{ row }">
        <div class="operators-container">
          <t-tooltip content="新建子分组">
            <t-button shape="square" variant="text" @click="showDetails('create', row)">
              <t-icon name="add" size="xs" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="编辑">
            <t-button shape="square" variant="text" @click="showDetails('edit', row)">
              <t-icon name="bulletpoint" size="xs" />
            </t-button>
          </t-tooltip>
          <t-tooltip content="删除">
            <t-popconfirm
              theme="default"
              content="是否删除该分组？"
              :confirm-btn="{ loading: grpDeleting }"
              @confirm="deleteGrp(row)"
            >
              <t-button shape="square" variant="text">
                <t-icon name="delete" size="xs" />
              </t-button>
            </t-popconfirm>
          </t-tooltip>
        </div>
      </template>
    </t-enhanced-table>
    <dialog-form-group
      v-model:data="selectedData"
      v-model:visible="visible"
      :update-list="refresh"
      :current-group="data"
    />
  </card>
</template>
<script setup lang="tsx">
import { useRequest } from 'vue-request';
import { ref, computed } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';

import Card from '@/components/card/index.vue';
import DialogFormGroup from './components/DialogFormGroup.vue';

import { COLUMNS } from './constants';
import * as API from '@/api';
import type * as SYS from '@/types/system';
import { useSystemStore } from '@/store';

const systemStore = useSystemStore();

// request
const { data: list, loading, refresh } = useRequest(() => API.getGroups(), {});
const data = computed<SYS.ITreeGroup>(() => {
  return systemStore.getGroupTree(list?.value?.data || []);
});

// detail editor
const selectedData = ref<SYS.ITreeGroupObject | SYS.IReqCreateGroup>();
const visible = ref<boolean>(false);
const showDetails = (mode: 'edit' | 'create', row: SYS.ITreeGroupObject) => {
  if (mode === 'edit') {
    selectedData.value = row;
  } else {
    selectedData.value = {
      grpName: '',
      parentGrpId: row.grpId,
      description: '',
    };
  }

  visible.value = true;
};

// delete group
const { loading: grpDeleting, run: deleteGrp } = useRequest(API.deleteGroups, {
  manual: true,
  onSuccess: () => {
    refresh();
    MessagePlugin.success('删除成功');
  },
});
</script>
<style lang="less">
.operators-container {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
