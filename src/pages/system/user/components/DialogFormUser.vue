<template>
  <t-dialog
    v-model:visible="props.visible"
    placement="center"
    :header="`${mode === 'new' ? '新增' : defaultUserName + '的'}用户信息`"
    width="40%"
    :confirm-btn="{
      content: `${submitLoading ? '保存中...' : '提交'}`,
      theme: 'primary',
      loading: submitLoading,
    }"
    @confirm="onClickConfirm"
    @close="close"
  >
    <t-form
      ref="form"
      :data="props.data"
      label-align="left"
      layout="vertical"
      :colon="true"
      :rules="FORM_RULES"
      label-width="120px"
    >
      <t-form-item label="用户账号" name="userName">
        <t-input v-model="props.data.userName"></t-input>
      </t-form-item>
      <t-form-item v-if="mode === 'new'" label="默认密码" name="initPwd">
        <t-input v-model="props.data.initPwd" type="password"></t-input>
      </t-form-item>
      <t-form-item label="用户姓名" name="personName">
        <t-input v-model="props.data.personName"></t-input>
      </t-form-item>
      <t-form-item label="所属分组" name="grpId">
        <t-cascader
          v-model="props.data.grpId"
          :loading="groupLoading"
          :keys="{ label: 'grpName', value: 'grpId', children: 'children' }"
          :options="groupData"
          check-strictly
          clearable
          placeholder="请选择"
        />
      </t-form-item>
      <t-form-item label="分组数据授权" name="dataGrps">
        <t-tree-select
          v-model="props.data.dataGrps"
          :loading="groupLoading"
          :data="groupData"
          :tree-props="{ keys: { label: 'grpName', value: 'grpId', children: 'children' } }"
          style="flex: 1"
          multiple
          clearable
          placeholder="请选择"
        />
      </t-form-item>
      <t-form-item label="用户角色" name="roles">
        <t-select v-model="selectedRolesFilter" placeholder="请选择用户角色" multiple>
          <t-option
            v-for="item in roleData"
            :key="item.roleId"
            :value="item.roleId"
            :label="item.roleName"
            :loading="roleLoading"
          ></t-option>
        </t-select>
      </t-form-item>
      <t-form-item label="备注" name="description">
        <t-input v-model="props.data.description"></t-input>
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import type { FormRule, FormValidateParams, FormValidateResult } from 'tdesign-vue-next';
import { onMounted, computed, ref, watch } from 'vue';
import { useRequest } from 'vue-request';
import type * as USER from '@/types/user';
import type * as SYS from '@/types/system';
import { useSystemStore } from '@/store';
import * as API from '@/api';
import { is } from '@/utils/types-utils';

// CONSTANTS
const INITIAL_DATA: {
  userId: string;
  userName: string;
  grpId: string;
  initPwd?: string;
  personName: string;
  description: string;
  roles: USER.IRolesType;
  dataGrps: string[];
} = {
  userId: '',
  userName: '',
  grpId: '',
  initPwd: '',
  personName: '',
  description: '',
  roles: [],
  dataGrps: [],
};
const FORM_RULES: Record<'userName' | 'initPwd' | 'grpId' | 'personName', FormRule[]> = {
  userName: [{ required: true, message: '不能为空' }],
  initPwd: [{ required: true, message: '不能为空' }],
  personName: [{ required: true, message: '不能为空' }],
  grpId: [{ required: true, message: '请选择分组' }],
};
// CONSTANTS END
const emit = defineEmits(['update:visible', 'update:data']);
const systemStore = useSystemStore();

const form = ref<{ validate: (params?: FormValidateParams) => FormValidateResult<typeof INITIAL_DATA> } | null>(null);

const props = withDefaults(
  defineProps<{
    data: USER.IUserType & { initPwd?: string };
    visible: boolean;
    updateUserList: () => Promise<any>;
  }>(),
  {
    data: () => ({}),
    visible: false,
  },
);
const defaultUserName = ref('');
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      defaultUserName.value = props.data.personName ?? '';
    }
  },
);

const mode = computed(() => {
  if (props.data?.userId) {
    return 'edit';
  }
  return 'new';
});

const selectedRoles = ref<{ roleId: string }[]>([]);
const selectedRolesFilter = computed({
  get() {
    return props.data.roles?.map((role) => role.roleId);
  },
  // perf: set in submit stage
  set(newRoles: string[] | undefined) {
    selectedRoles.value = [];
    newRoles?.forEach((roleId) => {
      selectedRoles.value?.push({ roleId });
    });
  },
});

// fetch
const {
  data: groupData,
  loading: groupLoading,
  run: runGetGroups,
} = useRequest(API.getGroups, {
  manual: true,
  initialData: [] as SYS.ITreeGroup,
  formatResult: (data) => {
    const { data: group } = data;
    if (group) return systemStore.getGroupTree(group);
    return [];
  },
});

const {
  data: roleData,
  loading: roleLoading,
  run: runGetRoles,
} = useRequest(API.getRoles, {
  manual: true,
  initialData: [],
  formatResult: (data) => {
    return data.data;
  },
});

// submit
const resetData = () => {
  emit('update:data', INITIAL_DATA);
};
const close = () => {
  emit('update:visible', false);
  resetData();
};
const handleSubmitSuccess = () => {
  MessagePlugin.success(`${mode.value === 'new' ? '创建' : '修改'}用户成功`);
  close();
  props.updateUserList?.();
  resetData();
};
const { loading: userCreating, run: runCreateUser } = useRequest(API.createUser, {
  manual: true,
  onSuccess: handleSubmitSuccess,
});
const { loading: userUpdating, run: runUpdateUser } = useRequest(API.updateUser, {
  manual: true,
  onSuccess: handleSubmitSuccess,
});
const submitData = ref<SYS.IReqCreateUser | SYS.IReqUpdateUser | Record<string, any>>({});

const submitLoading = computed(() => userUpdating.value || userCreating.value);
const onClickConfirm = async () => {
  const validateResult = await form.value!.validate();
  if (validateResult === true) {
    submitData.value = { ...submitData.value, ...props.data, roles: selectedRoles };
    try {
      if (mode.value === 'new') {
        await runCreateUser(submitData.value as SYS.IReqCreateUser);
      } else if (mode.value === 'edit') {
        type BeforeSubmitType = SYS.IReqUpdateUser & { initPwd?: 'string' };
        if (is<BeforeSubmitType>(submitData.value)) {
          delete submitData.value.initPwd;
          await runUpdateUser(submitData.value);
        }
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    console.log('error submit', validateResult);
  }
};

onMounted(() => {
  runGetGroups();
  runGetRoles();
});
</script>

<style lang="less" scoped></style>
