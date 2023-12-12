<template>
  <div :class="`${prefixCls}-page-wrapper`">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'attend_status'">
          <Tag v-if="text === 'reserved'" color="blue">已预约</Tag>
          <Tag v-else-if="text === 'checkedin'" color="green">已签到</Tag>
          <Tag v-else color="default">已取消</Tag>
        </template>
        <!-- <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              { label: '查看', onClick: handleView.bind(null, record), disabled: true },
              { label: '编辑', onClick: handleEdit.bind(null, record), disabled: true },
            ]"
          />
        </template> -->
      </template>
      <template #toolbar>
        <!-- <a-button type="primary" @click="createCourse" :disabled="true"> 创建会员卡 </a-button> -->
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { getTableColumns } from './config';
  import { getCourseHistory } from '/@/api/cards';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRouter } from 'vue-router';
  import { Tag } from 'ant-design-vue';

  export default defineComponent({
    components: { BasicTable, Tag },
    setup() {
      const { id } = useRouter()?.currentRoute?.value?.query || {};
      const [registerTable] = useTable({
        api: getCourseHistory,
        searchInfo: { 'wxuser-token': id },
        columns: getTableColumns(),
        canResize: false,
        bordered: true,
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        // showIndexColumn: false,
      });

      const { prefixCls } = useDesign('vip-cards');
      function handleEdit(event: any) {
        console.log('handleEdit', event);
      }

      function handleView(event: any) {
        console.log('handleView', event);
      }

      function createCourse(event: any) {
        console.log('createCourse', event);
      }

      return {
        registerTable,
        createCourse,
        handleEdit,
        handleView,
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
