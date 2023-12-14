<template>
  <div :class="`${prefixCls}-page-wrapper`">
    <BasicTable @register="registerTable">
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'cardins_status'">
          <Tag v-if="text === 'inactive'" color="blue">未开卡</Tag>
          <Tag v-else-if="text === 'active'" color="success">已开卡</Tag>
          <Tag v-else color="error">已作废</Tag>
        </template>
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              { label: '续卡', onClick: handleView.bind(null, record), disabled: true },
              { label: '扣费', onClick: handleView.bind(null, record), disabled: true },
              { label: '停卡', onClick: handleView.bind(null, record), disabled: true },
              { label: '作废', onClick: handleEdit.bind(null, record), disabled: true },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <br />
    <br />
    <BasicTable @register="registerTable1" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { getTableColumns, getTableColumns1 } from './config';
  import { getUserCardList, getcardRecordList } from '/@/api/cards';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRouter } from 'vue-router';

  import { Tag } from 'ant-design-vue';

  export default defineComponent({
    components: { BasicTable, Tag, TableAction },
    setup() {
      const { id } = useRouter()?.currentRoute?.value?.query || {};
      const [registerTable] = useTable({
        title: '会员卡明细',
        api: getUserCardList,
        searchInfo: { 'wxuser-token': id },
        columns: getTableColumns(),
        canResize: false,
        bordered: true,
        showTableSetting: true,
        tableSetting: { fullScreen: true },
        // showIndexColumn: false,
        actionColumn: {
          width: 200,
          title: '操作',
          dataIndex: 'action',
        },
      });

      const [registerTable1] = useTable({
        title: '会员卡消费明细',
        api: getcardRecordList,
        searchInfo: { 'wxuser-token': id },
        columns: getTableColumns1(),
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
        registerTable1,
        createCourse,
        handleEdit,
        handleView,
        prefixCls,
        TableAction,
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
