<template>
  <t-dialog
    v-model:visible="props.visible"
    placement="center"
    :header="`${localData.name}的证件照片`"
    :confirm-btn="null"
    :cancel-btn="null"
    width="50%"
    @close="close"
  >
    <div v-if="preview">
      <t-button :loading="submitLoading" @click="clearFile">删除证件照片</t-button>
      <br />
      <br />
      <img :src="preview" alt="令牌失效，请重新登录" style="max-width: 100%; max-height: 800px" />
    </div>
    <t-upload
      v-model="uploadState.files"
      :auto-upload="false"
      theme="file-flow"
      accept="image/*"
      multiple
      :data="postData"
      :max="1"
      :size-limit="{ size: 0.5, unit: 'MB', message: '图片大小不超过512KB' }"
      :before-upload="handleBeforeUpload"
      :request-method="handleRequestMethod"
      @remove="onRemove"
    />
  </t-dialog>
</template>

<script lang="ts">
export default {
  name: 'DialogUpload',
};
</script>

<script setup lang="ts">
import { MessagePlugin } from 'tdesign-vue-next';
import type { RequestMethodResponse, UploadFile, UploadRemoveContext } from 'tdesign-vue-next';
import { computed, reactive, ref, watch } from 'vue';
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
      console.log('no update-list props');
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
      preview.value = preUrl.value;
    }
  },
);
const preUrl = computed(() => {
  const tokenSuffix = `&__token=${userStore.token}`;
  return `${props.data.idCardPhotoMediaUrl ? props.data.idCardPhotoMediaUrl + tokenSuffix : ''}`;
});
const preview = ref<string>('');
const uploadState = reactive({
  headers: { 'X-Auth-Token': userStore.token },
  files: [],
});
const postData = reactive<Record<string, any>>({
  typ: 'image/jpeg',
  usage: 'party-id-card-photo',
  mediaTm: props.data.idCardPhotoMediaTm,
  mediaId: props.data.idCardPhotoMediaId,
  refId: props.data.partyId,
  refTm: props.data.applicationDate,
});
// upload hook
const fileTypes = ['image/jpeg', 'image/pjpeg', 'image/png'];
const validFileType = (file: File) => {
  return fileTypes.includes(file.type);
};
const handleBeforeUpload = (file: File | UploadFile): boolean | Promise<boolean> => {
  if (file instanceof File && validFileType(file)) {
    preview.value = URL.createObjectURL(file);
    return true;
  }
  if (Reflect.has(file, 'raw')) {
    preview.value = URL.createObjectURL((file as UploadFile).raw);
    return true;
  }
  MessagePlugin.warning(`请上传文件类型为${fileTypes.join(',').replaceAll('image/', '')}的图片`);
  return false;
};
// 上传钩子
const handleRequestMethod = async (files: UploadFile): Promise<RequestMethodResponse> => {
  if (!files.raw) return Promise.resolve({ status: 'fail', error: '请选择图片', response: {} });
  files.percent = 0;
  const formData = new FormData();
  const deleteValue = ['', null, undefined];
  for (const key in postData) {
    if (!deleteValue.includes(postData[key])) formData.append(key, postData[key]);
  }
  formData.set('file', files.raw);
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
  try {
    if (localData.value.idCardPhotoMediaUrl) {
      submitLoading.value = true;
      const { idCardPhotoMediaTm, idCardPhotoMediaId, idCardPhotoMediaUrl, ...rest } = localData.value;
      await API.updateParty([rest]);
      handleSubmitSuccess();
    }
  } finally {
    submitLoading.value = false;
  }
  preview.value = '';
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
.dialog {
  display: flex;
  flex-direction: row;
}
</style>
