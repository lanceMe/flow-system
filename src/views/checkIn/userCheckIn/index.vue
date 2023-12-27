<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <a-form
        :model="formState"
        name="horizontal_login"
        layout="inline"
        autocomplete="off"
        ref="formRef"
      >
        <a-form-item name="phoneNumber">
          <a-input ref="phoneNumber" v-model:value="formState.phoneNumber" placeholder="手机号" />
        </a-form-item>
        <a-form-item name="memberCardType">
          <a-select
            v-model:value="formState.memberCardType"
            placeholder="卡种"
            allowClear
            style="width: 200px"
          >
            <a-select-option value="bundle">次数卡</a-select-option>
            <a-select-option value="time">时间卡</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="date">
          <a-date-picker
            v-model:value="formState.date"
            type="date"
            :disabled-date="disabledDate"
            placeholder="日期"
          />
        </a-form-item>
        <a-form-item>
          <a-button style="margin: 0 10px" @click="resetForm">清空</a-button>
          <a-button type="primary" @click="onSearch">搜索</a-button>
        </a-form-item>
      </a-form>

      <h5 style="font-size: 16px">{{ getWeek() }} | {{ getDate() }}</h5>

      <ASpace style="display: flex; flex-direction: row-reverse" size="middle">
        <a-button type="primary" @click="onSubmit">签到</a-button>
      </ASpace>

      <a-table :columns="columns" :data-source="data">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'operation'">
            <a-button type="link" :disabled="record.isCheckIn" @click="onCancelCheckIn(record)"
              >取消签到</a-button
            >
          </template>
        </template>
      </a-table>
    </ASpace>
    <check ref="checkRef" @success="successCheckIn" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive, computed } from 'vue';
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
    RangePicker,
    message,
  } from 'ant-design-vue';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';
  import { getCheckinList, deleteCheckin } from '/@/api/booking';
  import check from './check.vue';
  import dayjs from 'dayjs';

  const cardType = {
    bundle: '次数卡',
    time: '时间卡',
  };

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
      ARangePicker: RangePicker,
      ASpace: Space,
      check,
    },
    setup() {
      const checkRef = ref();
      const formRef = ref();
      const today = dayjs().format('YYYY-MM-DD');
      // const page = reactive({
      //   total: 0,
      //   current: 0,
      //   pageSize: 0,
      // });
      const selectPriceDate = ref();
      const formState = reactive<any>({
        phoneNumber: undefined,
        memberCardType: undefined,
        date: dayjs(),
      });

      const data = ref([]);
      const calendarPriceRangeChange = (date) => {
        selectPriceDate.value = date;
      };
      const getList = () => {
        const parmas = {
          'phone-number': formState.phoneNumber,
          'from-date': formState.date.format('YYYY-MM-DD'),
          'to-date': formState.date.format('YYYY-MM-DD'),
          'cardcat-class': formState.memberCardType,
        };
        getCheckinList(parmas).then((res) => {
          console.log('===res', res);
          data.value = res.checkin_daypass_list.map((item, index) => ({
            key: index,
            Nickname: item.wxuser_nickname,
            phone: item.wxuser_phone_number,
            num: item.checkin_persons,
            memberCard: item.cardcat_name,
            memberCardType: cardType[item.cardcat_class],
            checkInTime: item.checkin_time,
            confirmType: 111,
            checkInType: item.checkin_channel,
            memo: item.checkin_remarks,
            wxToken: item.wxuser_token,
            cardinsId: item.cardins_id,
            isCheckIn: formState.date.format('YYYY-MM-DD') !== today,
          }));
        });
      };
      getList();
      const disabledDate = (current: any) => {
        return current && current > dayjs().endOf('day');
      };

      return {
        dayjs,
        checkRef,
        formState,
        disabledDate,
        calendarPriceRangeChange,
        today,
        formRef,
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
        data,
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
        onSubmit() {
          checkRef.value.controlModal(true);
        },
        resetForm() {
          console.log(formRef.value.resetFields);
          formRef.value.resetFields();
        },
        onSearch() {
          const from = formState.date;
          if (!from) {
            message.error('请选择日期范围');
            return;
          }
          getList();
        },
        onCancelCheckIn(record) {
          console.log('===record', record);

          deleteCheckin({
            'wxuser-token': record.wxToken,
            'cardins-id ': record.cardinsId,
          }).then(() => {
            message.success('取消签到成功');
            getList();
          });
        },

        handleTableChange(value) {
          console.log('===value', value);
        },
        successCheckIn() {
          message.success('签到成功');
          checkRef.value.controlModal(false);
          getList();
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
