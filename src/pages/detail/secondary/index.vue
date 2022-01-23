<template>
  <div>
    <div class="secondary-notification">
      <t-tabs v-model="tabValue">
        <t-tab-panel v-for="(tab, tabIndex) in TAB_LIST" :key="tabIndex" :value="tab.value" :label="tab.label">
          <t-list v-if="msgDataList.length > 0" class="secondary-msg-list" :split="true">
            <t-list-item v-for="(item, index) in msgDataList" :key="index">
              <p :class="['content', { unread: item.status }]" @click="setReadStatus(item)">
                <t-tag size="small" :theme="NOTIFICATION_TYPES[item.quality]" variant="light">
                  {{ item.type }}
                </t-tag>
                {{ item.content }}
              </p>
              <template #action>
                <span class="msg-date">{{ item.date }}</span>

                <div class="msg-action">
                  <t-tooltip
                    class="set-read-icon"
                    :overlay-style="{ margin: '6px' }"
                    :content="item.status ? '设为已读' : '设为未读'"
                  >
                    <span class="msg-action-icon" @click="setReadStatus(item)">
                      <t-icon v-if="!!item.status" name="queue" size="16px" />
                      <t-icon v-else name="chat" />
                    </span>
                  </t-tooltip>
                  <t-tooltip content="删除通知" :overlay-style="{ margin: '6px' }">
                    <span @click="handleClickDeleteBtn(item)">
                      <t-icon name="delete" size="16px" />
                    </span>
                  </t-tooltip>
                </div>
              </template>
            </t-list-item>
          </t-list>
          <div v-else class="secondary-msg-list__empty-list">
            <empty-icon></empty-icon>
            <p>暂无通知</p>
          </div>
        </t-tab-panel>
      </t-tabs>
    </div>
    <t-dialog
      v-model:visible="visible"
      header="删除通知"
      :body="`确认删除通知：${selectedItem && selectedItem.content}吗？`"
      :on-confirm="deleteMsg"
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, ComputedRef } from 'vue';
import { NOTIFICATION_TYPES } from '@/constants';
import { NotificationItem } from '@/interface';
import EmptyIcon from '@/assets/assets-empty.svg?component';
import { useNotificationStore } from '@/store/modules/notification';

const TAB_LIST = [
  {
    label: '全部通知',
    value: 'msgData',
  },
  {
    label: '未读通知',
    value: 'unreadMsg',
  },
  {
    label: '已读通知',
    value: 'readMsg',
  },
];

export default defineComponent({
  name: 'DetailSecondary',
  components: {
    EmptyIcon,
  },
  setup() {
    const tabValue = ref('msgData');

    const visible = ref(false);
    const selectedItem = ref<NotificationItem>();

    const notificationStore = useNotificationStore();

    const msgDataList: ComputedRef<NotificationItem[]> = computed(() => {
      if (tabValue.value === 'msgData') return notificationStore.msgData;
      if (tabValue.value === 'unreadMsg') return notificationStore.unreadMsg;
      if (tabValue.value === 'readMsg') return notificationStore.readMsg;
      return [];
    });

    const handleClickDeleteBtn = (item: NotificationItem) => {
      visible.value = true;
      selectedItem.value = item;
    };

    const setReadStatus = (item: NotificationItem) => {
      notificationStore.msgData.forEach((e: NotificationItem) => {
        if (e.id === item.id) {
          e.status = !e.status;
        }
      });
    };

    const deleteMsg = () => {
      const item = selectedItem.value;
      notificationStore.msgData.forEach((e: NotificationItem, index: number) => {
        if (e.id === item?.id) {
          notificationStore.msgData.splice(index, 1);
        }
      });
      visible.value = false;
    };

    return {
      TAB_LIST,
      NOTIFICATION_TYPES,
      visible,
      selectedItem,
      tabValue,
      msgDataList,
      handleClickDeleteBtn,
      setReadStatus,
      deleteMsg,
    };
  },
});
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
