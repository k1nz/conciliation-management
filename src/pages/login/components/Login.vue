<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="userName">
        <t-input v-model="formData.userName" size="large" placeholder="请输入账号">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          placeholder="请输入登录密码"
        >
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <t-checkbox>记住账号</t-checkbox>
      </div>
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit" :loading="loading"> 登录 </t-button>
    </t-form-item>
  </t-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { MessagePlugin, SubmitContext } from 'tdesign-vue-next';
import { useCounter } from '@/hooks';
import { useUserStore } from '@/store/modules/user';
import { ILoginInfoType } from '@/types/user';

const INITIAL_DATA: ILoginInfoType = {
  userName: 'admin',
  password: 'aadmin',
  typ: 'web',
  lang: 'zh',
};

const FORM_RULES = {
  userName: [{ required: true, message: '账号必填', type: 'error' }],
  password: [{ required: true, message: '密码必填', type: 'error' }],
};

export default defineComponent({
  setup() {
    const type = ref('password');

    const formData = ref({ ...INITIAL_DATA });
    const showPsw = ref(false);

    const [countDown, handleCounter] = useCounter();

    const switchType = (val: string) => {
      type.value = val;
    };

    const userStore = useUserStore();
    const loading = ref(false);

    const onSubmit = async ({ validateResult }: SubmitContext<FormData>) => {
      if (validateResult === true) {
        try {
          loading.value = true;
          await userStore.login(formData.value);
          MessagePlugin.success('登陆成功');
        } catch (e) {
          console.log(e);
        } finally {
          loading.value = false;
        }
      }
    };

    return {
      loading,
      FORM_RULES,
      formData,
      showPsw,
      type,
      switchType,
      countDown,
      handleCounter,
      onSubmit,
    };
  },
});
</script>
