<template>
  <PageWrapper>
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              { label: '查看', onClick: handleView.bind(null, record) },
              { label: '编辑', onClick: handleEdit.bind(null, record) },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <a-button type="primary" @click="createCourse"> 创建课程 </a-button>
      </template>
    </BasicTable>
    <Modal @register="registerModal" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTableColumns } from '/@/views/course/config';
  import { PageWrapper } from '/@/components/Page';
  import { demoListApi } from '/@/api/demo/table';
  import { useModal } from '/@/components/Modal';
  import Modal from '/@/views/course/detail/index.vue';

  export default defineComponent({
    components: { BasicTable, TableAction, PageWrapper, Modal },
    setup() {
      const [registerTable] = useTable({
        api: demoListApi,
        columns: getTableColumns(),
        canResize: false,
        bordered: true,
        actionColumn: {
          width: 160,
          title: '操作',
          dataIndex: 'action',
        },
      });

      const [registerModal, { openModal: openModal }] = useModal();

      function handleEdit(event: any) {
        console.log('handleEdit', event);
        openModal(true, { type: 'edit' });
      }

      function handleView(event: any) {
        console.log('handleView', event);
        openModal(true, { type: 'view' });
      }

      function createCourse(event: any) {
        console.log('createCourse', event);
        openModal(true, { type: 'create' });
      }

      return {
        registerTable,
        createCourse,
        handleEdit,
        handleView,
        registerModal,
        openModal,
      };
    },
  });
</script>
