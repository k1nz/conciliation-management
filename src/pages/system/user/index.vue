<template>
  <div>
    <card title="用户管理" class="list-card-container">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button :disabled="!hasPermission(['create:user'])" @click="handleCreateUser"> 新增用户 </t-button>
        </div>
        <div style="display: flex; flex-direction: row; gap: 20px">
          <t-input
            v-model="queryParams.userName$like"
            class="search-input"
            placeholder="请输入你需要搜索的内容"
            clearable
            @enter="handleSearch(true)"
          >
          </t-input>
          <div>
            <t-button @click="handleSearch(true)">
              <template #icon>
                <search-icon size="20px" />
              </template>
              搜索
            </t-button>
          </div>
        </div>
      </t-row>

      <t-table
        :data="data"
        :columns="COLUMNS"
        :row-key="rowKey"
        vertical-align="top"
        :hover="true"
        :pagination="pagination"
        :loading="loading"
        @change="rehandleChange"
      >
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 }}
        </template>
        <template #disabled="{ row }">
          <t-tag v-if="row.disabled" theme="danger" variant="light"> 已停用 </t-tag>
          <t-tag v-else theme="success" variant="light"> 正常 </t-tag>
        </template>

        <template #op="{ row, rowIndex }">
          <div class="operators-container">
            <t-tooltip content="详情">
              <t-button shape="square" variant="text" @click="handleClickDetail(row)">
                <t-icon name="bulletpoint" size="xs" />
              </t-button>
            </t-tooltip>
            <t-tooltip theme="danger" content="删除">
              <t-button shape="square" variant="text" @click="handleClickDelete(rowIndex)">
                <t-icon name="delete" size="xs" />
              </t-button>
            </t-tooltip>
            <t-tooltip theme="primary" content="更多">
              <t-dropdown :options="dropDownOptions" @click="handleDropdown">
                <t-button variant="text">
                  <t-icon name="more" size="xs" />
                </t-button>
              </t-dropdown>
            </t-tooltip>
          </div>
        </template>
      </t-table>
    </card>

    <t-dialog
      v-model:visible="confirmVisible"
      header="确认删除当前所选用户？"
      :body="confirmBody"
      :on-cancel="onCancel"
      :confirm-btn="{
        content: `${userDeleting ? '删除中...' : '确认'}`,
        loading: userDeleting,
      }"
      @confirm="onConfirmDelete"
    />
    <dialog-form v-model:data="selectedData" v-model:visible="visible" :update-user-list="handleSearch" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { SearchIcon } from 'tdesign-icons-vue-next';
import { DropdownOption, MessagePlugin, TableChangeData } from 'tdesign-vue-next';

import { useRequest } from 'vue-request';
import Card from '@/components/card/index.vue';
import DialogForm from './components/DialogFormUser.vue';

import { COLUMNS } from './constants';
import * as API from '@/api';
import { usePermissionCheck } from '@/hooks';
import type * as SYS from '@/types/system';
import type * as USER from '@/types/user';

const DEFAULT_PAGINATION = {
  pageSize: 20,
  current: 1,
};

type PickedData = 'userName' | 'grpId' | 'personName' | 'description' | 'roles' | 'dataGrps';
const INITIAL_DATA: Pick<USER.IUserType, PickedData> & { initPwd?: string } = {
  userName: '',
  grpId: '',
  personName: '',
  description: '',
  roles: [],
  dataGrps: [],
};

const dropDownOptions = [
  {
    content: '修改密码',
    value: 'changePassword',
  },
  {
    content: '停用账号',
    value: 'forbidden',
  },
];

export default defineComponent({
  name: 'ListBaseCard',
  components: {
    Card,
    SearchIcon,
    DialogForm,
  },
  setup() {
    const hasPermission = usePermissionCheck();

    // request
    const pagination = ref<typeof DEFAULT_PAGINATION & { total?: number }>(DEFAULT_PAGINATION);
    const queryParams = ref({
      __sortBy: 'createTime$desc',
    });
    const refreshDeps = computed(() => ({
      __limit: pagination.value.pageSize,
      __page: pagination.value.current,
    }));
    const queryParamsFormat = computed<SYS.IReqGetUser>(() => ({
      ...refreshDeps.value,
      ...queryParams.value,
    }));
    const {
      data: list,
      loading,
      refresh,
    } = useRequest(() => API.getUser(queryParamsFormat.value), {
      refreshDeps: [refreshDeps],
      onSuccess: (res) => {
        if (res.count !== undefined) {
          pagination.value.total = res.count || 0;
        }
      },
    });
    const data = computed(() => {
      return list?.value?.data || [];
    });
    const handleSearch = async (resetPagination = true) => {
      if (resetPagination) pagination.value = { ...pagination.value, current: 1 };
      else await refresh();
    };

    const rehandleChange = (changeParams: TableChangeData) => {
      const { pageSize, current } = changeParams.pagination!;
      pagination.value = {
        ...pagination.value,
        pageSize: pageSize as number,
        current: current || 1,
      };
    };

    const visible = ref(false);
    const handleCreateUser = () => {
      visible.value = true;
    };

    // export
    const handleExport = () => {
      console.log('todo');
    };

    // user detail
    const selectedData = ref<USER.IUserType>(INITIAL_DATA);
    const handleClickDetail = (row: USER.IUserType) => {
      selectedData.value = { ...row };
      visible.value = true;
    };

    // delete user
    const confirmVisible = ref(false);
    const deleteIdx = ref(-1);
    const confirmBody = computed(() => {
      if (deleteIdx.value > -1) {
        const { userName } = data.value![deleteIdx.value];
        return `你将删除 ${userName} 的用户信息，是否确认删除?`;
      }
      return '';
    });
    const handleClickDelete = (rowIndex: number) => {
      deleteIdx.value = rowIndex;
      confirmVisible.value = true;
    };
    const resetIdx = () => {
      deleteIdx.value = -1;
    };
    const deleteCallback = () => {
      handleSearch();
      confirmVisible.value = false;
      MessagePlugin.success('删除成功');
      resetIdx();
    };
    const { loading: userDeleting, run: deleteUser } = useRequest(API.deleteUser, {
      manual: true,
      onSuccess: deleteCallback,
    });
    const onConfirmDelete = () => {
      deleteUser({ userId: data.value![deleteIdx.value].userId! });
    };

    const onCancel = () => {
      resetIdx();
    };

    const handleDropdown = (data: DropdownOption) => {
      // TODO:
      if (data.value === 'changePassword') {
        MessagePlugin.success('密码修改');
      } else if (data.value === 'forbidden') {
        MessagePlugin.success('账号已停用');
      }
    };

    return {
      data,
      list,
      refresh,
      handleSearch,
      hasPermission,
      visible,
      queryParams,
      selectedData,
      handleCreateUser,
      handleExport,
      dropDownOptions,
      handleDropdown,
      COLUMNS,
      loading,
      pagination,
      confirmBody,
      confirmVisible,
      rowKey: 'index',
      handleClickDetail,
      handleClickDelete,
      onConfirmDelete,
      userDeleting,
      onCancel,
      rehandleChange,
    };
  },
});
</script>
<style lang="less" scoped>
@import '@/style/variables';

.payment-col {
  display: flex;

  .trend-container {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }
}

.left-operation-container {
  padding: 6px 0;
  margin-bottom: 16px;

  .selected-count {
    display: inline-block;
    margin-left: 8px;
    color: @text-color-secondary;
  }
}

.search-input {
  width: 360px;
}
.operators-container {
  display: flex;
  flex-direction: row;
  gap: 5px;
}
</style>
