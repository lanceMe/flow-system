<template>
  <div :class="`${prefixCls}-page-wrapper`">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'cardins_status'">
          <Tag v-if="text === 'inactive'" color="blue">未开卡</Tag>
          <Tag v-else-if="text === 'active'" color="success">已开卡</Tag>
          <Tag v-else color="error">已作废</Tag>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                label: '续卡',
                onClick: handleOperation.bind(null, 'renew', record),
              },
              {
                label: '扣费',
                disabled:
                  record.cardins_status !== 'inactive' && record.cardins_status !== 'active',
                onClick: handleOperation.bind(null, 'deduct', record),
              },
              {
                label: '停卡',
                disabled: true,
                // disabled:
                //   record.cardins_status !== 'inactive' && record.cardins_status !== 'active',
                onClick: handleOperation.bind(null, 'stop', record),
              },
              {
                label: '作废',
                disabled: true,
                // disabled:
                //   record.cardins_status !== 'inactive' && record.cardins_status !== 'active',
                onClick: handleBan.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <br />
    <br />
    <BasicTable @register="registerTable1" />
    <Modal @register="registerModal" @submit-success="reLoad" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTableColumns, getTableColumns1 } from './config';
  import { getUserCardList, getcardRecordList } from '/@/api/cards';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRouter } from 'vue-router';

  import { useModal } from '/@/components/Modal';
  import Modal from '/@/views/vip/member/detail/operation/index.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Tag } from 'ant-design-vue';

  const props = {
    data: { type: Object, default: {} },
  };

  export default defineComponent({
    components: { BasicTable, Tag, TableAction, Modal },
    props,
    setup(props) {
      const { id } = useRouter()?.currentRoute?.value?.query || {};
      const { createConfirm } = useMessage();
      const [registerTable, { reload: reloadTable }] = useTable({
        title: '会员卡明细',
        api: getUserCardList,
        searchInfo: { 'wxuser-token': id },
        columns: getTableColumns(),
        canResize: false,
        bordered: true,
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        // showIndexColumn: false,
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
        },
      });

      const [registerTable1] = useTable({
        title: '会员卡消费明细',
        api: getcardRecordList,
        searchInfo: { 'wxuser-token': id },
        columns: getTableColumns1(),
        canResize: false,
        bordered: true,
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        // showIndexColumn: false,
      });

      const [registerModal, { openModal: openModal }] = useModal();

      const { prefixCls } = useDesign('vip-cards');

      function handleOperation(type: string, event: any) {
        console.log('handleOperation', event);
        openModal(true, { type, formData: event, userData: props.data });
      }

      function handleBan(event: any) {
        createConfirm({
          iconType: 'error',
          title: '作废',
          type: 'error',
          content: '作废后，用户当前会员卡不可使用，确认操作请点击确定',
          okButtonProps: { danger: true },
          // okType: 'primary',
          onOk: () => {
            // postApi(values);
          },
        });
      }
      function reLoad() {
        reloadTable();
      }

      return {
        registerTable,
        registerTable1,
        handleOperation,
        prefixCls,
        TableAction,
        registerModal,
        reLoad,
        handleBan,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-vip-cards';

  .@{prefix-cls} {
    &-page-wrapper {
      // margin: 20px;
      // padding: 8px;
      // background-color: #fff;
      .ant-row {
        flex-direction: row;
      }
    }
  }

  .ant-btn-dangerous {
    background-color: #ed6f6f !important;
  }
</style>
