<template>
  <PageWrapper :class="`${prefixCls}-page-wrapper`">
    <div class="p-4">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                {
                  label: '编辑',
                  type: 'primary',
                  onClick: handleEdit.bind(null, record),
                  // disabled: true,
                },
                {
                  label: '可售',
                  // disabled: true,
                  ifShow: record['for_sale_enabled'] === 0,
                  type: 'primary',
                  onClick: handleSale.bind(null, record),
                },
                {
                  label: '停售',
                  // disabled: true,
                  ifShow: record['for_sale_enabled'] === 1,
                  type: 'primary',
                  onClick: handleNotSale.bind(null, record),
                },
                {
                  label: '删除',
                  // disabled: true,
                  color: 'error',
                  type: 'primary',
                  onClick: handleDelete.bind(null, record),
                },
              ]"
            />
          </template>
        </template>
        <template #toolbar>
          <a-button type="primary" @click="createCard" :disabled="false"> 创建会员卡 </a-button>
        </template>
      </BasicTable>
    </div>
    <Modal @register="registerModal" @submit-success="changeCardsList" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTableColumns, getFormConfig } from '/@/views/vip/cards/config';
  import { PageWrapper } from '/@/components/Page';
  import { getCardList, deleteCard, saleCard, stopCardsType } from '/@/api/cards';
  import { useModal } from '/@/components/Modal';
  import Modal from '/@/views/vip/cards/detail/index.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { BasicTable, TableAction, PageWrapper, Modal },
    setup() {
      const [registerTable, { reload }] = useTable({
        api: getCardList,
        columns: getTableColumns(),
        canResize: false,
        bordered: true,
        useSearchForm: true,
        formConfig: getFormConfig(),
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        handleSearchInfoFn,
        afterFetch,
        // showIndexColumn: false,
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
        },
      });

      const searchParam = ref({ subType: '', type: '' });

      const [registerModal, { openModal: openModal }] = useModal();
      const { prefixCls } = useDesign('vip-cards');
      const { createConfirm } = useMessage();

      function createCard(event: any) {
        console.log('createCourse', event);
        openModal(true, { type: 'create' });
      }

      function handleEdit(event: any) {
        console.log('handleEdit', event);
        openModal(true, { type: 'edit', formData: event });
      }

      function handleSale(event: any) {
        console.log('handleSale', event);
        const { name } = event;
        createConfirm({
          iconType: 'info',
          title: '可售',
          content: `确认发售【${name}】卡?`,
          onOk: () => {
            saleCard({ 'cardcat-id': event.id, 'cardcat-enable': 1 }).then(() => {
              changeCardsList();
            });
          },
        });
      }
      function handleNotSale(event: any) {
        console.log('handleNotSale', event);
        const { name } = event;
        createConfirm({
          iconType: 'info',
          title: '停售',
          content: `确认停售【${name}】卡?停售后的卡片支持恢复销量`,
          onOk: () => {
            stopCardsType({ 'cardcat-id': event.id, 'cardcat-enable': 0 }).then(() => {
              changeCardsList();
            });
          },
        });
      }

      function handleDelete(event: any) {
        console.log('handleDelete', event);
        const { name } = event;
        createConfirm({
          iconType: 'error',
          title: '删除',
          content: `确认删除【${name}】卡?删除后将无法恢复销量`,
          // okButtonProps: {
          //   danger: true,
          //   type: 'primary',
          // },
          onOk: () => {
            deleteCard({ 'cardcat-id': event.id }).then(() => {
              changeCardsList();
            });
          },
        });
      }

      function changeCardsList() {
        reload();
      }

      //本地存储筛选信息
      function handleSearchInfoFn(params) {
        searchParam.value = params;
        return params;
      }

      //本地过滤筛选结果
      function afterFetch(data: []) {
        const { subType: st, type: t } = searchParam.value;
        const filterData = data.filter((item) => {
          const { type, class: cn } = item;
          return (!t || type === t) && (!st || cn === st);
        });
        return filterData;
      }

      return {
        registerTable,
        createCard,
        handleEdit,
        handleSale,
        handleNotSale,
        handleDelete,
        registerModal,
        openModal,
        changeCardsList,
        prefixCls,
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
