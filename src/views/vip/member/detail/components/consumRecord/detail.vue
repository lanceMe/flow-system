<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="消费明细"
    @visible-change="handleVisibleChange"
    width="1200px"
    :show-ok-btn="false"
    :show-cancel-btn="false"
  >
    <BasicTable @register="registerTable1" />
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getcardRecordList } from '/@/api/cards';
  import { getTableColumns1 } from './config';

  export default defineComponent({
    components: { BasicModal, BasicTable },
    props: {
      userData: { type: Object },
    },

    setup(props) {
      const modelRef = ref({});
      const searchInfo: any = ref({});
      const [registerTable1, { reload }] = useTable({
        title: '消费明细',
        api: getcardRecordList,
        beforeFetch,
        columns: getTableColumns1(),
        canResize: false,
        bordered: true,
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        // showIndexColumn: false,
      });

      const [register] = useModalInner((data) => {
        data && onDataReceive(data);
      });

      function onDataReceive(data) {
        console.log('Data Received', data, data?.['wxuser_token'], data?.['cardins_id']);

        searchInfo.value = {
          'wxuser-token': data?.['wxuser_token'],
          'cardins-id': data?.['cardins_id'],
        };
        nextTick(() => {
          reload();
        });
      }

      function beforeFetch() {
        return searchInfo.value;
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      return {
        register,
        model: modelRef,
        handleVisibleChange,
        registerTable1,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-course-form';
  .@{prefix-cls} {
    &__attenders {
      display: flex;
      align-items: center;

      > div {
        margin: 0 8px;
      }
    }
  }
</style>
