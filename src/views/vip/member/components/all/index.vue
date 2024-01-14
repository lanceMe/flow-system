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
              { label: '编辑', onClick: handleEdit.bind(null, record) },
            ]"
          />
        </template>
      </template>
      <template #toolbar>
        <!-- <a-button type="primary" @click="createCourse" :disabled="true"> 创建会员卡 </a-button> -->
      </template>
    </BasicTable>
    <Modal @register="registerModal" @submit-success="changeVipList" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTableColumns, getFormConfig } from './config';
  import { getVipList, getWxUser } from '/@/api/cards';
  import { useModal } from '/@/components/Modal';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { Avatar } from 'ant-design-vue';
  import defaultAvatar from '/@/assets/images/header.jpg';
  import { useRouter } from 'vue-router';
  import Modal from '/@/views/vip/member/detail/editUser.vue';

  export default defineComponent({
    components: { BasicTable, TableAction, Avatar, Modal },
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
      async function handleEdit(event: any) {
        getWxUser(event['wxuser_token']).then((resp) => {
          openModal(true, {
            type: 'edit',
            formData: event,
            userData: { 'wxuser-token': event['wxuser_token'], ...resp },
          });
        });
      }

      function handleView(event: any) {
        handleAvaterClick(event);
      }

      function changeVipList() {
        setTimeout(() => {
          reload();
        }, 1);
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
        handleEdit,
        handleView,
        registerModal,
        openModal,
        changeVipList,
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
