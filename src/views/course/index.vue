<template>
  <PageWrapper>
    <div class="p-4">
      <BasicTable @register="registerTable">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <TableAction
              :actions="[
                { label: '查看', onClick: handleView.bind(null, record) },
                { label: '编辑', onClick: handleEdit.bind(null, record) },
                {
                  label: '删除',
                  color: 'error',
                  ifShow: true,
                  popConfirm: {
                    title: '确认删除？',
                    confirm: handleDelete.bind(null, record),
                  },
                },
              ]"
            />
          </template>
        </template>
        <template #toolbar>
          <a-button type="primary" @click="createCourse"> 创建课程 </a-button>
        </template>
      </BasicTable>
    </div>
    <Modal @register="registerModal" @submit-success="changeCourseList" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTableColumns } from '/@/views/course/config';
  import { PageWrapper } from '/@/components/Page';
  import { getTempleteList, deleteTemplete } from '/@/api/course';
  import { useModal } from '/@/components/Modal';
  import Modal from '/@/views/course/detail/index.vue';

  export default defineComponent({
    components: { BasicTable, TableAction, PageWrapper, Modal },
    setup() {
      const [registerTable, { reload }] = useTable({
        api: getTempleteList,
        columns: getTableColumns(),
        canResize: false,
        bordered: true,
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
        },
      });

      const [registerModal, { openModal: openModal }] = useModal();

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
      function handleDelete(event) {
        deleteTemplete(event['ctpl_id']).then(() => {
          reload();
        });
      }

      return {
        registerTable,
        createCourse,
        handleEdit,
        handleView,
        handleDelete,
        registerModal,
        openModal,
        changeCourseList,
      };
    },
  });
</script>
