<template>
  <div :class="`${prefixCls}-page-wrapper`">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'wxuser_nickname'">
          <Avatar
            :size="40"
            :src="record?.['wxuser_avatar_fileid'] || defaultAvatar"
            @click="handleAvaterClick(record)"
          />
          <span>{{ record['wxuser_nickname'] || '--' }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              { label: '查看', onClick: handleView.bind(null, record) },
              // { label: '编辑', disabled: true, onClick: handleEdit.bind(null, record) },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <!-- <a-button type="primary" @click="createCourse" :disabled="true"> 创建会员卡 </a-button> -->
      </template>
    </BasicTable>
    <Modal @register="registerModal" @submit-success="changeCourseList" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTableColumns, getFormConfig } from './config';
  import { getVipList } from '/@/api/cards';
  import { useModal } from '/@/components/Modal';
  import Modal from '/@/views/course/detail/index.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Avatar } from 'ant-design-vue';
  import defaultAvatar from '/@/assets/images/header.jpg';
  import { useRouter } from 'vue-router';

  export default defineComponent({
    components: { BasicTable, TableAction, Modal, Avatar },
    setup() {
      const [registerTable, { reload }] = useTable({
        api: getVipList,
        columns: getTableColumns(),
        canResize: false,
        bordered: true,
        useSearchForm: true,
        formConfig: getFormConfig(),
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        // handleSearchInfoFn,
        // afterFetch,
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
        },
      });
      const router = useRouter();
      const [registerModal, { openModal: openModal }] = useModal();
      const { prefixCls } = useDesign('vip-cards');
      function handleEdit(event: any) {
        console.log('handleEdit', event);
        openModal(true, { type: 'edit', formData: event });
      }

      function handleView(event: any) {
        handleAvaterClick(event);
      }

      function createCourse(event: any) {
        console.log('createCourse', event);
        openModal(true, { type: 'create' });
      }

      function changeCourseList() {
        reload();
      }

      function handleAvaterClick(record) {
        router.push({
          path: '/vip/memberDetail',
          // name: 'home',
          query: { id: record?.['wxuser_token'] },
        });
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
        defaultAvatar,
        handleAvaterClick,
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

      .ant-avatar {
        display: inline-block;
        margin-right: 10px;
      }
    }
  }
</style>
