<template>
  <a-modal v-model:open="visible" @ok="onSubmit" :title="'通知排序'">
    <s-table :columns="columns" :data-source="compData" :pagination="false" />
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, computed, watch, defineEmits } from 'vue';
  import { Modal as AModal } from 'ant-design-vue';
  import { DefaultRecordType } from '@surely-vue/table/dist/src/components/interface';

  const props = defineProps({
    data: {
      type: Array<DefaultRecordType>,
      default: () => [],
    },
  });
  const columns = [
    {
      title: '通知标题',
      dataIndex: 'title',
      key: 'title',
      rowDrag: true,
    },
  ];
  const cloneData = ref<any>([]);
  const compData = computed(() => {
    return cloneData.value.filter((item) => item.type === 'homepage' && item.status !== 'offline');
  });
  const visible = ref(false);
  const controlModal = (bl: boolean) => {
    visible.value = bl;
  };
  const emits = defineEmits(['onSubmit']);
  defineExpose({
    controlModal,
  });
  watch(
    () => props.data,
    (newProps) => {
      console.log('=newProps', newProps);
      cloneData.value = newProps;
    },
  );

  const onSubmit = () => {
    emits('onSubmit', compData.value);
  };
</script>

<style lang="scss" scoped></style>
