<template>
  <div>
    <card title="用户管理" class="list-card-container">
      <t-row justify="space-between">
        <div class="left-operation-container">
          <t-button v-if="hasPermission(['create:user'])" @click="handleCreateUser"> 新增用户 </t-button>
          <t-button variant="base" theme="default" @click="handleExport"> 导出 </t-button>
          <!-- <p v-if="!!selectedRowKeys.length" class="selected-count">已选{{ selectedRowKeys.length }}项</p> -->
        </div>
        <div style="display: flex; flex-direction: row; gap: 20px">
          <t-input
            v-model="searchValue"
            class="search-input"
            placeholder="请输入你需要搜索的内容"
            clearable
            @enter="handleSearch"
          >
            <!-- <template #suffix-icon>
              <search-icon size="20px" />
            </template> -->
          </t-input>
          <t-button @click="handleSearch"><search-icon size="20px" />搜索</t-button>
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

        <template #op="{ row }">
          <t-tooltip content="详情" style="margin: 0 30px 0px 0">
            <t-icon name="bulletpoint" size="xs" style="cursor: pointer" @click="handleClickDetail(row)" />
          </t-tooltip>
          <t-tooltip theme="danger" content="删除" style="margin: 0 30px 0px 0">
            <t-icon name="delete" size="xs" style="cursor: pointer" @click="handleClickDelete(row)" />
          </t-tooltip>
          <t-tooltip theme="primary" content="更多" style="margin: 0 0px 0px 0">
            <!-- <t-icon name="more" size="xs" style="cursor: pointer" /> -->
            <t-dropdown :options="dropDownOptions" @click="handleDropdown">
              <t-button variant="text">
                <t-icon name="more" size="xs" style="cursor: pointer" />
              </t-button>
            </t-dropdown>
          </t-tooltip>
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
    <dialog-form v-model:data="selectedData" v-model:visible="visible" :update-user-list="refresh" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, Ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { SearchIcon } from 'tdesign-icons-vue-next';
import { DropdownOption, MessagePlugin, TableChangeData } from 'tdesign-vue-next';

import { useRequest } from 'vue-request';
import { CONTRACT_STATUS, CONTRACT_TYPES, CONTRACT_PAYMENT_TYPES } from '@/constants';
import Card from '@/components/card/index.vue';
import DialogForm from './components/DialogFormUser.vue';

import { COLUMNS } from './constants';
import * as API from '@/api';
import { usePermissionCheck } from '@/hooks';
import type * as SYS from '@/types/system';
import type * as USER from '@/types/user';

const DEFAULT_PAGINATION = {
  defaultPageSize: 20,
  total: 0,
  defaultCurrent: 1,
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
    const router = useRouter();
    // data init
    const pagination: Ref<typeof DEFAULT_PAGINATION> = ref(DEFAULT_PAGINATION);
    const searchValue: Ref<string> = ref('');
    const selectedData: Ref<USER.IUserType> = ref(INITIAL_DATA);
    const queryParams: Ref<SYS.IReqGetUser> = ref({
      __limit: DEFAULT_PAGINATION.defaultPageSize,
      __page: DEFAULT_PAGINATION.defaultCurrent,
      __sortBy: 'createTime$desc',
    });

    // request
    const {
      data: list,
      loading,
      refresh,
    } = useRequest(API.getUser, {
      manual: true,
      defaultParams: [queryParams.value],
      onSuccess: (res) => {
        if (res.count ?? false) {
          pagination.value = {
            ...pagination.value,
            total: res.count as number,
          };
        }
      },
    });
    const data = computed(() => {
      return list?.value?.data;
    });

    const visible = ref(false);
    const handleCreateUser = () => {
      visible.value = true;
    };

    // export
    const handleExport = () => {
      console.log('todo');
    };

    // search
    const handleSearch = (searchValue: string) => {
      if (searchValue) queryParams.value.userName = searchValue;
      refresh();
    };

    // user detail
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
    const handleClickDelete = (row: { rowIndex: any }) => {
      deleteIdx.value = row.rowIndex;
      confirmVisible.value = true;
    };
    const { loading: userDeleting, run: deleteUser } = useRequest(API.deleteUser, { manual: true });
    const resetIdx = () => {
      deleteIdx.value = -1;
    };
    const onConfirmDelete = () => {
      deleteUser({ userId: data.value![deleteIdx.value].userId! });
      refresh();
      confirmVisible.value = false;
      MessagePlugin.success('删除成功');
      resetIdx();
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

    onMounted(() => {
      refresh();
    });

    return {
      data,
      list,
      refresh,
      hasPermission,
      visible,
      selectedData,
      handleCreateUser,
      handleExport,
      handleSearch,
      dropDownOptions,
      handleDropdown,
      CONTRACT_STATUS,
      CONTRACT_TYPES,
      CONTRACT_PAYMENT_TYPES,
      COLUMNS,
      searchValue,
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
      rehandleChange(changeParams: TableChangeData) {
        const { pagination } = changeParams;
        queryParams.value = {
          ...queryParams.value,
          __limit: pagination?.pageSize,
          __page: pagination?.current,
        };
        refresh();
      },
      handleSetupContract() {
        router.push('/form/base');
      },
    };
  },
  methods: {},
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
</style>
