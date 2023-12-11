<template>
  <PageWrapper :class="`${prefixCls}-page-wrapper`">
    <div class="header">
      <div class="member-info">
        <Avatar :size="100">
          <template #icon><UserOutlined /></template>
        </Avatar>
        <div class="basic-info">
          <span class="name">Name</span>
          <span>手机号：123456789110</span>
          <span>注册时间：2023-11-05</span>
        </div>
      </div>
      <div class="toolbar">
        <a-button type="primary" @click="handleBindCards"> 绑卡 </a-button>
        <a-button type="primary" @click="handleEditMember"> 编辑 </a-button>
      </div>
    </div>
    <Tabs :tabBarStyle="tabBarStyle">
      <template v-for="item in tabs" :key="item.key">
        <TabPane :tab="item.name">
          <component :is="item.component" />
        </TabPane>
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, Avatar } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { UserOutlined } from '@ant-design/icons-vue';

  import { tabs } from './config';

  import ConsumRecord from '/@/views/vip/member/detail/components/consumRecord/index.vue';
  import ArrivalRecord from '/@/views/vip/member/detail/components/arrivalRecord/index.vue';
  import ClassRecord from '/@/views/vip/member/detail/components/classRecord/index.vue';
  import MemberProfile from '/@/views/vip/member/detail/components/memberProfile/index.vue';

  export default defineComponent({
    components: {
      PageWrapper,
      Tabs,
      TabPane: Tabs.TabPane,
      ConsumRecord,
      ArrivalRecord,
      ClassRecord,
      MemberProfile,
      UserOutlined,
      Avatar,
    },
    setup() {
      const { prefixCls } = useDesign('vip-member');
      return {
        prefixCls,
        tabs,
        useDesign,
        tabBarStyle: {
          // width: '220px',
        },
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-vip-member';

  .@{prefix-cls} {
    &-page-wrapper {
      .ant-row {
        flex-direction: row;
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 30px;
      }

      .member-info {
        display: flex;
        justify-content: flex-start;
      }

      .toolbar {
        > * {
          margin-left: 15px;
        }
      }

      .basic-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px 40px;

        .name {
          font-size: 30px;
        }
      }

      .ant-tabs-nav {
        padding-left: 1rem;
      }
    }
  }
</style>
