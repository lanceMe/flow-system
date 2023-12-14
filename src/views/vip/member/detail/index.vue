<template>
  <PageWrapper :class="`${prefixCls}-page-wrapper`">
    <div class="header">
      <div class="member-info">
        <Avatar :size="100" :src="profile?.['avatar_fileid'] || defaultAvatar" />
        <div class="basic-info">
          <span class="name">{{ profile?.['nickname'] || '--' }}</span>
          <span>手机号：{{ profile?.['phone_number'] || '--' }}</span>
          <span>注册时间：{{ creatAt }}</span>
        </div>
      </div>
      <div class="toolbar">
        <a-button type="primary" @click="handleBindCards" :disabled="true"> 绑卡 </a-button>
        <a-button type="primary" @click="handleEditMember" :disabled="true"> 编辑 </a-button>
      </div>
    </div>
    <Tabs :tabBarStyle="tabBarStyle">
      <template v-for="item in tabs" :key="item.key">
        <TabPane :tab="item.name">
          <component :is="item.component" :data="profile" />
        </TabPane>
      </template>
    </Tabs>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Tabs, Avatar } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { UserOutlined } from '@ant-design/icons-vue';
  import { getWxUser } from '/@/api/cards';

  import { tabs } from './config';

  import ConsumRecord from '/@/views/vip/member/detail/components/consumRecord/index.vue';
  import ArrivalRecord from '/@/views/vip/member/detail/components/arrivalRecord/index.vue';
  import ClassRecord from '/@/views/vip/member/detail/components/classRecord/index.vue';
  import MemberProfile from '/@/views/vip/member/detail/components/memberProfile/index.vue';

  import defaultAvatar from '/@/assets/images/header.jpg';
  import { useRouter } from 'vue-router';
  import { formatToDateTime } from '/@/utils/dateUtil';

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
      const profile = ref({});
      const creatAt = ref('');
      const { id } = useRouter()?.currentRoute?.value?.query || {};
      getWxUser(id).then((resp) => {
        profile.value = resp;
        creatAt.value = resp?.created_at ? formatToDateTime(resp.created_at) : '--';
      });
      function handleBindCards(event: any) {
        console.log('handleBindCards', event);
      }
      function handleEditMember(event: any) {
        console.log('handleEditMember', event);
      }

      return {
        prefixCls,
        tabs,
        tabBarStyle: {
          // width: '220px',
        },
        useDesign,
        handleBindCards,
        handleEditMember,
        defaultAvatar,
        profile,
        creatAt,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-vip-member';

  .@{prefix-cls} {
    &-page-wrapper {
      margin: 20px 30px;
      background-color: #fff;

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
