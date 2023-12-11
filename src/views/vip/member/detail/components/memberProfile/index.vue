<template>
  <div :class="`${prefixCls}-page-wrapper`">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              { label: '查看', onClick: handleView.bind(null, record), disabled: true },
              { label: '编辑', onClick: handleEdit.bind(null, record), disabled: true },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="createCourse" :disabled="true"> 创建会员卡 </a-button>
      </template>
    </BasicTable>
    <Modal @register="registerModal" @submit-success="changeCourseList" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTableColumns, getFormConfig } from './config';
  import { getCardList } from '/@/api/cards';
  import { useModal } from '/@/components/Modal';
  import Modal from '/@/views/course/detail/index.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    components: { BasicTable, TableAction, Modal },
    setup() {
      const [registerTable, { reload }] = useTable({
        api: getCardList,
        columns: getTableColumns(),
        canResize: false,
        bordered: true,
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

      const searchParam = ref({ name: '', channel: '', type: '' });

      const [registerModal, { openModal: openModal }] = useModal();
      const { prefixCls } = useDesign('vip-cards');
      function handleEdit(event: any) {
        console.log('handleEdit', event);
        openModal(true, { type: 'edit', formData: event });
      }

      function handleView(event: any) {
        console.log('handleView', event);
        openModal(true, { type: 'view', formData: event });
      }

      function createCourse(event: any) {
        console.log('createCourse', event);
        openModal(true, { type: 'create' });
      }

      function changeCourseList() {
        reload();
      }

      //本地存储筛选信息
      function handleSearchInfoFn(params) {
        searchParam.value = params;
        return params;
      }

      //本地过滤筛选结果
      function afterFetch(data: []) {
        const { name: n, type: t, channel: c } = searchParam.value;
        const filterData = data.filter((item) => {
          const { name, type, class: cn, channel } = item;
          return (
            (!n || name === n) &&
            (!c || channel === c) &&
            (!t ||
              type === t ||
              (t === 'daypass1' && type === 'daypass' && cn === 'bundle') ||
              (t === 'daypass2' && type === 'daypass' && cn === 'time'))
          );
        });
        return filterData;
      }

      return {
        registerTable,
        createCourse,
        handleEdit,
        handleView,
        registerModal,
        openModal,
        changeCourseList,
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
</style>
