<template>
  <PageWrapper>
    <div class="header">
      <img :src="data?.staff_avatar_url" alt="" />
      <div class="header-info">
        <div class="header-info-name">{{ data?.staff_nickname }}</div>
        <div class="header-info-phone">登录手机号：{{ data?.staff_phone_number }}</div>
        <div class="header-info-time">创建时间：{{ data?.staff_created_at }}</div>
      </div>

      <a-button class="header-edit" @click="handleCreate" type="primary">编辑</a-button>
    </div>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="员工资料">
        <a-descriptions title="" :column="1">
          <a-descriptions-item label="姓名">{{ data.staff_name }}</a-descriptions-item>
          <a-descriptions-item label="昵称">{{ data.staff_nickname }}</a-descriptions-item>
          <a-descriptions-item label="登录手机号">{{
            data.staff_phone_number
          }}</a-descriptions-item>
          <a-descriptions-item label="角色">{{ data.staff_role?.join(',') }}</a-descriptions-item>
          <a-descriptions-item label="性别">{{ data.staff_gender }}</a-descriptions-item>
          <a-descriptions-item label="个人介绍">
            {{ data.staff_short_description }}
          </a-descriptions-item>
        </a-descriptions>
      </a-tab-pane>
      <a-tab-pane v-if="isShowCourse" key="2" tab="我的课程" force-render>
        <course-table />
      </a-tab-pane>
    </a-tabs>
    <check ref="checkRef" :data="data" :checkType="checkType" @on-submit="checkSubmit" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { defineComponent, onMounted, ref, computed } from 'vue';
  import {
    Table,
    Tabs as ATabs,
    TabPane as ATabPane,
    Descriptions as ADescriptions,
    DescriptionsItem as ADescriptionsItem,
    message,
  } from 'ant-design-vue';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';
  import dayjs from 'dayjs';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '/@/store/modules/user';
  import { getStaffInfo, postStaffInfo, putStaffInfo } from '/@/api/staff/index';
  import course from '/@/router/routes/config/course';
  import courseTable from './course-table.vue';
  import check from '../check.vue';

  const activeKey = ref('1');
  const data = ref<any>({});
  const isShowCourse = computed(() => {
    return data.value?.staff_role && data.value?.staff_role?.indexOf('coach') !== -1;
  });
  const checkRef = ref();
  const checkType = ref('edit');
  const userStore = useUserStore();
  const handleCreate = () => {
    checkRef.value.controlModal(true);
    checkType.value = 'edit';
  };
  const checkSubmit = (item) => {
    console.log('===onSubmit', item);
    putStaffInfo(item).then(() => {
      message.success('编辑成功');
      checkRef.value.controlModal(false);
      getStaffInfo({
        'staff-id': userStore.getUserId,
      }).then((res) => {
        console.log('===res', res);
        data.value = res;
      });
    });
  };

  onMounted(() => {
    getStaffInfo({
      'staff-id': userStore.getUserId,
    }).then((res) => {
      console.log('===res', res);
      data.value = res;
    });
  });
</script>
<style lang="scss">
  .header {
    display: flex;

    img {
      width: 88px;
      height: 88px;
      margin-right: 22px;
      border-radius: 50%;
    }

    &-info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &-name {
        font-size: 24px;
      }

      &-time {
        color: #888d92;
      }
    }

    &-edit {
      margin-top: 25px;
      margin-left: auto;
    }

    .ant-modal-body {
      padding-right: 20px !important;
    }
  }
</style>
