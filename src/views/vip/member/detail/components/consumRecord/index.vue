<template>
  <div :class="`${prefixCls}-page-wrapper`">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'cardins_status'">
          <Tag v-if="text === 'inactive'" color="blue">未开卡</Tag>
          <Tag v-else-if="text === 'active'" color="success">已开卡</Tag>
          <Tag v-else-if="text === 'exhausted'" color="warning">已用完</Tag>
          <Tag v-else-if="text === 'transferred'" color="warning">已转卡</Tag>
          <Tag v-else-if="text === 'suspended'" color="warning">已暂停</Tag>
          <Tag v-else-if="text === 'refunded'" color="warning">已退款</Tag>
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
                // disabled:
                //   record.cardins_status !== 'inactive' && record.cardins_status !== 'active',
                onClick: handleOperation.bind(null, 'deduct', record),
              },
              {
                label: record.cardins_status === 'suspended' ? '恢复' : '停卡',
                // disabled:
                //   record.cardins_status !== 'inactive' && record.cardins_status !== 'active',
                onClick:
                  record.cardins_status === 'suspended'
                    ? hanleResume.bind(null, record)
                    : handleOperation.bind(null, 'stop', record),
              },
              {
                label: '作废',
                disabled: true,
                // disabled:
                //   record.cardins_status !== 'inactive' && record.cardins_status !== 'active',
                onClick: handleBan.bind(null, record),
              },
              {
                label: '转卡',
                disabled: true,
                // disabled:
                //   record.cardins_status !== 'inactive' && record.cardins_status !== 'active',
                onClick: handleOperation.bind(null, 'over', record),
              },
              {
                label: '消费明细',
                onClick: handleDetail.bind(null, record),
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <Modal @register="registerModal" @submit-success="reLoad" />
    <ModalDetail @register="registerModal1" @submit-success="reLoad" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTableColumns } from './config';
  import { getUserCardList, resumeCard } from '/@/api/cards';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRouter } from 'vue-router';

  import { useModal } from '/@/components/Modal';
  import Modal from '/@/views/vip/member/detail/operation/index.vue';
  import ModalDetail from '/@/views/vip/member/detail/components/consumRecord/detail.vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Tag } from 'ant-design-vue';

  const props = {
    data: { type: Object, default: {} },
  };

  export default defineComponent({
    components: { BasicTable, Tag, TableAction, Modal, ModalDetail },
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
        showIndexColumn: false,
        tableSetting: { fullScreen: true },
        // showIndexColumn: false,
        actionColumn: {
          width: 260,
          title: '操作',
          dataIndex: 'action',
        },
      });

      const [registerModal, { openModal: openModal }] = useModal();
      const [registerModal1, { openModal: openModal1 }] = useModal();

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
      function handleDetail(event: any) {
        console.log('handleDetail', event);
        openModal1(true, event);
      }

      function hanleResume(event: any) {
        createConfirm({
          iconType: 'info',
          title: '恢复',
          type: 'info',
          content: '恢复后，取消当前会员卡暂停状态，确认操作请点击确定',
          okButtonProps: { danger: true },
          // okType: 'primary',
          onOk: async () => {
            await resumeCard({
              'cardins-id': event['cardins_id'],
            });
            reLoad();
            // postApi(values);
          },
        });
      }
      function reLoad() {
        reloadTable();
      }

      return {
        registerTable,
        handleOperation,
        prefixCls,
        TableAction,
        registerModal,
        registerModal1,
        reLoad,
        handleBan,
        hanleResume,
        handleDetail,
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

  // .ant-btn-dangerous {
  //   background-color: #ed6f6f !important;
  // }
</style>
