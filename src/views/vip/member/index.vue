<template>
  <PageWrapper :class="`${prefixCls}-page-wrapper`">
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
  import { Tabs } from 'ant-design-vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  import { tabs } from './config';

  import All from '/@/views/vip/member/components/all/index.vue';
  import CardsToFail from '/@/views/vip/member/components/cardsToFail/index.vue';
  import Last from '/@/views/vip/member/components/last/index.vue';
  import CourseToFail from '/@/views/vip/member/components/courseToFail/index.vue';

  export default defineComponent({
    components: {
      PageWrapper,
      Tabs,
      TabPane: Tabs.TabPane,
      All,
      CardsToFail,
      Last,
      CourseToFail,
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

      .ant-tabs-nav {
        padding-left: 1rem;
      }
    }
  }
</style>
