<template>
  <router-view :class="[mode]" />
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useSettingStore } from './store/modules/setting';

export default defineComponent({
  setup() {
    const settingStore = useSettingStore();

    const mode = computed(() => {
      return settingStore.getMode;
    });

    return {
      mode,
    };
  },
});
</script>
<style lang="less">
@import '@/style/variables.less';

#nprogress .bar {
  background: @brand-color !important;
}
</style>
