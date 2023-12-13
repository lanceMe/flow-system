<template>
  <div :class="`${prefixCls}-page-wrapper`">
    <span class="info">性别：{{ data.gender || '未设置' }}</span>
    <span class="info">抱石水平：{{ data.bouldering_grade || '--' }}</span>
    <span class="info">大岩壁水平：{{ data.wall_grade || '--' }}</span>
    <span class="info">身高：{{ data.height || '--' }}</span>
    <span class="info">体重：{{ data.weight || '--' }}</span>
    <span class="info">生日：{{ data.birthday ? formatToDate(data.birthday) : '--' }}</span>
    <span class="info">是否野攀：{{ data.nickname1 || '--' }}</span>
    <span class="info">备注：{{ data.remarks || '--' }}</span>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { formatToDate } from '/@/utils/dateUtil';

  export default defineComponent({
    components: {},
    props: ['data'],
    setup() {
      const { prefixCls } = useDesign('vip-cards');
      return {
        prefixCls,
        formatToDate,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-vip-cards';

  .@{prefix-cls} {
    &-page-wrapper {
      // padding: 8px;
      // background-color: #fff;
      display: flex;
      flex-direction: column;
      margin: 0 0 40px 40px;
      font-size: 16px;

      > span {
        margin-top: 20px;
      }

      .ant-row {
        flex-direction: row;
      }
    }
  }
</style>
