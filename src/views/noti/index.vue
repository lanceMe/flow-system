<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <a-form :model="formState" layout="inline" autocomplete="off" ref="formRef">
        <a-form-item name="text">
          <a-input v-model:value="formState.text" placeholder="通知内容" />
        </a-form-item>
        <a-form-item name="courseType">
          <a-select
            v-model:value="formState.notiType"
            placeholder="课程列表"
            style="width: 200px"
            allowClear
          >
            <a-select-option value="1">首页轮播图</a-select-option>
            <a-select-option value="2">Banner</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button style="margin: 0 10px" @click="resetForm">清空</a-button>
          <a-button type="primary" @click="onSearch">搜索</a-button>
        </a-form-item>
      </a-form>

      <h5 style="font-size: 16px">{{ getWeek() }} | {{ getDate() }}</h5>

      <div style="display: flex; flex-direction: row; justify-content: end" size="middle">
        <a-button class="reserve-item-ab" type="primary" @click="onSort">通知排序</a-button>
        <a-button class="reserve-item-ab" type="primary" @click="onSubmit">新建通知</a-button>
      </div>

      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button @click="handleView(record)" type="link">查看</a-button>
            <a-button @click="handleEdit(record)" type="link">编辑</a-button>
            <a-button @click="handleOffline(record)" type="link">下线</a-button>
          </template>
        </template>
      </a-table>
    </ASpace>
    <check ref="checkRef" />
    <sort ref="sortRef" :data="data" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import {
    Table,
    Form,
    FormItem,
    Input,
    Button,
    Select,
    SelectOption,
    Space,
  } from 'ant-design-vue';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';
  import check from './check.vue';
  import sort from './sort.vue';
  import dayjs from 'dayjs';
  import { NotifyType } from './constant';

  export default defineComponent({
    components: {
      PageWrapper,
      ATable: Table,
      AForm: Form,
      AFormItem: FormItem,
      AInput: Input,
      AButton: Button,
      ASelect: Select,
      ASelectOption: SelectOption,
      ASpace: Space,
      check,
      sort,
    },
    setup() {
      const checkRef = ref();
      const sortRef = ref();
      const formRef = ref();
      const formState = reactive({
        text: undefined,
        notiType: undefined,
        date: '',
      });
      return {
        dayjs,
        checkRef,
        sortRef,
        formState,
        formRef,
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
        data: [
          {
            key: '1',
            title: '通知标题示例测试1',
            type: NotifyType.Banner,
            status: '已上线',
            startTime: '1212',
            endTime: '232', // 举例：一小时后结束
            creator: '创建人示例',
          },
          {
            key: '2',
            title: '通知标题示例测试2',
            type: NotifyType.Banner,
            status: '已上线',
            startTime: '1212',
            endTime: '232', // 举例：一小时后结束
            creator: '创建人示例',
          },
          {
            key: '3',
            title: '通知标题示例测试3',
            type: NotifyType.Banner,
            status: '已上线',
            startTime: '1212',
            endTime: '232', // 举例：一小时后结束
            creator: '创建人示例',
          },
        ],
        columns: [
          {
            title: '通知标题',
            dataIndex: 'title',
            key: 'title',
          },
          {
            title: '通知类型',
            dataIndex: 'type',
            key: 'type',
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
          },
          {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
          },
          {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
          },
          {
            title: '创建人',
            dataIndex: 'creator',
            key: 'creator',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation', // 使用自定义渲染操作列
          },
        ],
        checkInType: {
          wechat: '微信小程序',
          backup: '后台',
        },
        cardType: {
          month: '月卡',
          demand: '次卡',
        },
        onSubmit() {
          checkRef.value.controlModal(true);
        },
        onSort() {
          sortRef.value.controlModal(true);
        },
        onSearch() {},

        // 处理查看操作
        handleView(record: Record<string, any>) {
          console.log('查看通知', record);
          // 这里可以添加具体的查看逻辑
        },

        // 处理编辑操作
        handleEdit(record: Record<string, any>) {
          console.log('编辑通知', record);
          // 这里可以添加具体的编辑逻辑
        },

        // 处理下线操作
        handleOffline(record: Record<string, any>) {
          console.log('下线通知', record);
          // 这里可以添加具体的下线逻辑
        },
        resetForm() {
          formRef.value.resetFields();
        },

        getWeek() {
          const datas = dayjs().day();
          const week = ['日', '一', '二', '三', '四', '五', '六'];
          return '星期' + week[datas];
        },
        getDate() {
          return dayjs().format('YYYY-MM-DD');
        },
      };
    },
  });
</script>
<style lang="less">
  .reserve-item {
    border-bottom: 1px solid #000;

    &-btn {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    &-ab {
      margin-left: 20px;
    }
  }
</style>
