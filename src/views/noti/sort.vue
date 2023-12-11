<template>
  <a-modal v-model:open="visible" @ok="onSubmit" :title="'通知排序'">
    <s-table :columns="columns" :data-source="sort.data" :pagination="false" />
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, toRef } from 'vue';
  import { Modal as AModal } from 'ant-design-vue';
  import { DefaultRecordType } from '@surely-vue/table/dist/src/components/interface';

  const props = defineProps({
    data: {
      type: Array<DefaultRecordType>,
      default: () => [],
    },
    submit: {
      type: Function,
      default: () => {},
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
  const visible = ref(false);
  const controlModal = (bl: boolean) => {
    visible.value = bl;
  };
  defineExpose({
    controlModal,
  });

  const sort = reactive({
    data: toRef(props.data),
  });

  const onSubmit = () => {
    props?.submit(sort.data);
  };
</script>

<style lang="scss" scoped></style>
