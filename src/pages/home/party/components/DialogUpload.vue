<template>
  <TDialog
    v-model:visible="props.visible"
    placement="center"
    :header="`${localData.name}的证件照片`"
    :confirm-btn="null"
    :cancel-btn="{
      content: '关闭',
    }"
    width="60%"
    @confirm="confirm"
    @close="close"
  >
    <div>
      <t-button :loading="submitLoading" @click="confirm">上传证件照片</t-button>
      <t-button v-if="preview" :loading="submitLoading" @click="clearFile">删除证件照片</t-button>
      <div v-if="preview" class="previewArea">
        <img :src="preview" alt="令牌失效，请重新登录" />
      </div>
    </div>
    <t-upload
      v-show="false"
      ref="uploadRef"
      v-model="uploadState.files"
      theme="files"
      draggable
      accept="image/*"
      :before-upload="handleBeforeUpload"
      :request-method="handleRequestMethod"
      @remove="onRemove"
      @success="handleSubmitSuccess"
    />
  </TDialog>
</template>

<script lang="ts">
export default {
  name: 'DialogUpload',
};
</script>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import type { RequestMethodResponse, UploadFile, UploadRemoveContext } from 'tdesign-vue-next';
import { reactive, ref, watch } from 'vue';
import { $computed } from 'vue/macros';
import type { PropType } from 'vue';
import { to } from 'await-to-js';
import * as API from '@/api';

import * as BIZ from '@/types/business';
import { useUserStore } from '@/store';
// CONSTANTS
type IPropsData = Partial<BIZ.IParty>;
// CONSTANTS END

// hooks
const userStore = useUserStore();
// instance
const emit = defineEmits(['update:visible']);
const props = defineProps({
  data: {
    type: Object as PropType<IPropsData>,
    default: () => ({}),
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  updateList: {
    type: Function as PropType<() => Promise<any>>,
    default: () => {
      console.error('not provide update-list props');
    },
  },
});
// main
const localData = ref<IPropsData>({ ...props.data });
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      localData.value = { ...props.data };
      console.log(localData.value);
      preview.value = preUrl;
    }
  },
);
const preUrl = $computed(() => {
  const tokenSuffix = `&__token=${userStore.token}`;
  return `${props.data.idCardPhotoMediaUrl ? props.data.idCardPhotoMediaUrl + tokenSuffix : ''}`;
});
const preview = ref<string>('');
const uploadState = reactive({
  size: 0.5 * 1024 * 1024,
  files: [],
});
const postData = $computed<Record<string, any>>(() => ({
  typ: 'image/jpeg',
  usage: 'party-id-card-photo',
  mediaTm: localData.value.idCardPhotoMediaTm,
  mediaId: localData.value.idCardPhotoMediaId,
  refId: localData.value.partyId,
  refTm: localData.value.applicationDate,
}));
// upload hook
const fileTypes = ['image/jpeg', 'image/pjpeg', 'image/png'];
const validFileType = (file: File) => {
  return fileTypes.includes(file.type);
};
const handleBeforeUpload = (file: File | UploadFile): boolean | Promise<boolean> => {
  const fileInstance = file instanceof File ? file : file.raw!;
  if (fileInstance.size > uploadState.size) {
    MessagePlugin.warning(`上传的图片不能大于 ${uploadState.size / 1024 / 1024}MB`);
    return false;
  }
  if (!validFileType(fileInstance)) {
    MessagePlugin.warning(`请上传文件类型为${fileTypes.join(',').replaceAll('image/', '')}的图片`);
    return false;
  }
  preview.value = URL.createObjectURL(fileInstance);
  return true;
};
// 上传钩子
const handleRequestMethod = async (files: UploadFile): Promise<RequestMethodResponse> => {
  if (!files.raw) return Promise.resolve({ status: 'fail', error: '请选择图片', response: {} });
  files.percent = 0;
  const formData = new FormData();
  const deleteValue = ['', null, undefined];
  for (const key in postData) {
    if (!deleteValue.includes(postData[key])) formData.append(key, postData[key]);
    console.log(`${key}`, postData[key]);
  }
  formData.append('file', files.raw);
  const [err, data] = await to(API.upload(formData));
  if (err) return Promise.resolve({ status: 'fail', error: err.toString(), response: {} });
  if (data?.errCode === 0) {
    files.percent = 100;
    return Promise.resolve({ status: 'success', response: data });
  }
  return Promise.resolve({ status: 'fail', error: data?.message, response: {} });
};

// upload events
// 上传成功后删除
const onRemove = (context: UploadRemoveContext) => {
  clearFile();
};

// submit
const submitLoading = ref<boolean>(false);
const clearFile = async () => {
  if (localData.value.idCardPhotoMediaUrl) {
    try {
      submitLoading.value = true;
      const { idCardPhotoMediaTm, idCardPhotoMediaId, idCardPhotoMediaUrl, ...rest } = localData.value;
      await API.updateParty([rest]);
      handleSubmitSuccess();
    } finally {
      submitLoading.value = false;
    }
  }
  preview.value = '';
  uploadState.files = [];
};
const uploadRef = ref();
const confirm = () => {
  uploadRef.value.triggerUpload();
};
const close = () => {
  emit('update:visible', false);
  uploadState.files = [];
};
const handleSubmitSuccess = () => {
  MessagePlugin.success(`提交成功`);
  close();
  props.updateList?.();
};
</script>

<style lang="less" scoped>
.previewArea {
  margin: 20px auto;
  width: 850px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed #666;

  img {
    max-width: 100%;
    max-height: 100%;
  }
}
</style>
