<template>
  <router-view :class="[mode]" />
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
// import { useStore } from 'vuex';
import { useSettingStore } from './store/modules/setting';

export default defineComponent({
  setup() {
    // const store = useStore();
    const store = useSettingStore()

    const mode = computed(() => {
      // return store.getters['setting/mode'];
      return store.mode
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
