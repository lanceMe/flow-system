<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <a-form name="horizontal_login" layout="inline" autocomplete="off" ref="formRef">
        <a-form-item name="coach">
          <a-select
            v-model:value="formState.coach"
            placeholder="教练"
            style="width: 200px"
            mode="multiple"
          >
            <a-select-option value="demand">{{ cardType.demand }}</a-select-option>
            <a-select-option value="month">{{ cardType.month }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="courseType">
          <a-select
            v-model:value="formState.courseType"
            placeholder="课程列表"
            style="width: 200px"
            mode="multiple"
          >
            <a-select-option value="group">团课</a-select-option>
            <a-select-option value="private">私教课</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="date">
          <a-date-picker v-model:value="formState.date" type="date" placeholder="日期" />
        </a-form-item>
        <a-form-item>
          <a-button style="margin: 0 10px" @click="resetForm">清空</a-button>
          <a-button type="primary" @click="onSearch">搜索</a-button>
        </a-form-item>
      </a-form>

      <h5 style="font-size: 16px">{{ getWeek() }} | {{ getDate() }}</h5>

      <ASpace style="display: flex; flex-direction: row-reverse" size="middle">
        <a-button type="primary" @click="onSubmit">预约</a-button>
        <div>当日到店人数：34</div>

        <div>预收/确认：1325.8元/238元 </div>
      </ASpace>

      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'phone'">
            {{ record.phone }}
          </template>
          <template v-else-if="column.key === 'num'">
            {{ record.num }}
          </template>
          <template v-else-if="column.key === 'memberCard'">
            {{ record.memberCard }}
          </template>
          <template v-else-if="column.key === 'memberCardType'">
            {{ cardType[record.memberCardType] }}
          </template>
          <template v-else-if="column.key === 'checkInTime'">
            {{ dayjs(record.checkInTime).format('YYYY-MM-DD HH:MM:ss') }}
          </template>
          <template v-else-if="column.key === 'confirmType'">
            {{ record.confirmType }}
          </template>
          <template v-else-if="column.key === 'checkInType'">
            {{ checkInType[record.checkInType] }}
          </template>
          <template v-else-if="column.key === 'memo'">
            {{ record.memo }}
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-button @click="resetForm" type="link">立即签到</a-button>
            <a-button type="link" @click="onSubmit">取消签到</a-button>
          </template>
        </template>
      </a-table>
    </ASpace>
    <check ref="checkRef" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import {
    Table,
    Form,
    FormItem,
    Input,
    Button,
    Select,
    SelectOption,
    DatePicker,
    Space,
  } from 'ant-design-vue';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';
  import check from './check.vue';
  import dayjs from 'dayjs';

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
      ADatePicker: DatePicker,
      ASpace: Space,
      check,
    },
    setup() {
      const checkRef = ref();
      const formRef = ref();

      return {
        dayjs,
        checkRef,
        formRef,
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
        data: [
          {
            key: '1',
            Nickname: 'Mike',
            phone: 32,
            num: 1,
            memberCard: 1,
            checkInTime: dayjs(),
            reserve: 111,
            status: 'wechat',
            memo: 777,
          },
        ],
        columns: [
          {
            title: '昵称',
            dataIndex: 'Nickname',
            key: 'Nickname',
          },
          {
            title: '手机号',
            dataIndex: 'phone',
            key: 'phone',
          },
          {
            title: '人数',
            dataIndex: 'num',
            key: 'num',
          },
          {
            title: '会员卡',
            dataIndex: 'memberCard',
            key: 'memberCard',
          },
          {
            title: '预约渠道',
            dataIndex: 'reserve',
            key: 'reserve',
          },
          {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
          },
          {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo',
          },
          {
            title: '预约时间',
            dataIndex: 'checkInTime',
            key: 'checkInTime',
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
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
        onSearch() {},
        resetForm() {
          formRef.value.resetFields();
        },
        formState: {
          coach: undefined,
          courseType: undefined,
          date: '',
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
