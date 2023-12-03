<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <a-form name="horizontal_login" layout="inline" autocomplete="off">
        <a-form-item name="username" :rules="[{ required: true, message: '请输入手机号' }]">
          <a-input v-model:value="formState.phone" placeholder="手机号" />
        </a-form-item>
        <a-form-item name="memberCardType">
          <a-select
            v-model:value="formState.memberCardType"
            placeholder="卡种"
            style="width: 200px"
          >
            <a-select-option value="demand">{{ cardType.demand }}</a-select-option>
            <a-select-option value="month">{{ cardType.month }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="date">
          <a-date-picker v-model:value="formState.date" show-time type="date" placeholder="日期" />
        </a-form-item>
        <a-form-item>
          <a-button style="margin: 0 10px" @click="resetForm">清空</a-button>
          <a-button type="primary" @click="onSubmit">搜索</a-button>
        </a-form-item>
      </a-form>

      <h5 style="font-size: 16px">{{ getWeek() }} | {{ getDate() }}</h5>

      <ASpace style="display: flex; flex-direction: row-reverse" size="middle">
        <a-button type="primary" @click="onSubmit">签到</a-button>
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
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
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
    },
    setup() {
      return {
        dayjs,
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
            memberCardType: 'month',
            checkInTime: dayjs(),
            confirmType: 111,
            checkInType: 'wechat',
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
            title: '卡种',
            dataIndex: 'memberCardType',
            key: 'memberCardType',
          },
          {
            title: '签到时间',
            dataIndex: 'checkInTime',
            key: 'checkInTime',
          },
          {
            title: '预收/确认',
            dataIndex: 'confirmType',
            key: 'confirmType',
          },
          {
            title: '签到方式',
            dataIndex: 'checkInType',
            key: 'checkInType',
          },
          {
            title: '备注',
            dataIndex: 'memo',
            key: 'memo',
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
        onSubmit() {},
        resetForm() {},
        formState: {
          phone: '',
          memberCardType: undefined,
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
