<template>
  <div>
    <t-dialog
      v-model:visible="innerVisible"
      header="修改密码"
      :on-close="close"
      :cancel-btn="null"
      :confirm-btn="null"
      :close-btn="false"
      :close-on-overlay-click="false"
      :close-on-esc-keydown="false"
    >
      <template #body>
        <div>
          <t-form
            ref="form"
            :data="formData"
            :rules="rules"
            :label-width="100"
            scroll-to-first-error="smooth"
            @reset="onReset"
            @submit="onSubmit"
          >
            <t-form-item label="原密码" name="oldPwd">
              <t-input v-model="formData.oldPwd" type="password" />
            </t-form-item>
            <t-form-item label="新密码" name="newPwd">
              <t-input v-model="formData.newPwd" type="password" />
            </t-form-item>
            <t-form-item label="确认密码" name="reNewPwd">
              <t-input v-model="formData.reNewPwd" type="password" />
            </t-form-item>
            <t-form-item>
              <t-button theme="primary" type="submit" style="margin-right: 10px" :loading="loading"> 提交 </t-button>
              <t-button theme="default" variant="base" type="reset" style="margin-right: 10px" :disabled="loading">
                重置
              </t-button>
              <t-button theme="default" variant="base" :disabled="loading" @click="close"> 取消 </t-button>
            </t-form-item>
          </t-form>
        </div>
      </template>
    </t-dialog>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, PropType, reactive, ref } from 'vue';
import { CustomValidator, FormRule } from 'tdesign-vue-next';
import { IChangePasswordData } from '@/api/interface/user';
import * as USER_API from '@/api/user';

const INITIAL_DATA = {
  oldPwd: '',
  newPwd: '',
  reNewPwd: '',
};

export default defineComponent({
  name: 'PasswordChange',
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const loading = ref(false);

    // dialog visibility
    const innerVisible = computed({
      get: () => props.visible,
      set: (newVal) => emit('update:visible', newVal),
    });

    const formData: IChangePasswordData = reactive({ ...INITIAL_DATA });

    // form validator
    const rePasswordValidator: CustomValidator = (val) => {
      return Promise.resolve(val === formData.newPwd);
    };
    const rules: Record<keyof IChangePasswordData, Array<FormRule>> = {
      oldPwd: [{ required: true, message: '请填写原密码', type: 'error' }],
      newPwd: [{ required: true, message: '请输入新密码', type: 'error' }],
      reNewPwd: [
        { required: true, message: '请重新输入新密码', type: 'error' },
        { validator: rePasswordValidator, message: '两次输入密码不一致', type: 'error' },
      ],
    };

    const close = () => {
      if (!loading.value) emit('update:visible', false);
      // else
    };

    const onReset = () => {
      Object.assign(formData, INITIAL_DATA);
    };

    const onSubmit = async () => {
      try {
        loading.value = true;
        await USER_API.changePassword(formData);
        loading.value = false;
        close();
      } catch (e) {
        loading.value = false;
        console.log(e);
      }
    };
    return {
      loading,
      innerVisible,
      onReset,
      onSubmit,
      formData,
      close,
      rules,
    };
  },
});
</script>
<style lang="less"></style>
