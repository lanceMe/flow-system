<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <a-form name="horizontal_login" layout="inline" autocomplete="off" ref="formRef">
        <a-form-item name="status">
          <a-select
            v-model:value="formState.status"
            placeholder="商品类型"
            style="width: 200px"
            :filter-option="filterOption"
            mode="multiple"
          >
            <a-select-option
              v-for="item in statusList"
              :value="item.value"
              :key="item.value"
              :label="item.label"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item name="orderType">
          <a-select
            v-model:value="formState.orderType"
            placeholder="订单状态"
            style="width: 200px"
            mode="multiple"
          >
            <a-select-option value="paid">已支付成功</a-select-option>
            <a-select-option value="closed">已超时取消</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="date">
          <a-range-picker
            v-model:value="formState.date"
            type="date"
            :disabled-date="disabledDate"
            :onCalendarChange="calendarPriceRangeChange"
          />
        </a-form-item>
        <a-form-item>
          <a-button style="margin: 0 10px" @click="resetForm">清空</a-button>
          <a-button type="primary" @click="onSearch">搜索</a-button>
        </a-form-item>
      </a-form>

      <!-- <h5 style="font-size: 16px">{{ getWeek() }} | {{ getDate() }}</h5> -->
      <a-table :columns="columns" :data-source="orderData" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'subtype'">
            {{ subtypeEnum[record.order_subtype] }}
          </template>
          <template v-if="column.key === 'memberCard'">
            <img class="member-img" :src="record.wxuser_avatar_fileid" alt="" />
            <span>{{ record.wxuser_nickname }}</span>
          </template>
          <template v-if="column.key === 'payType'"> 微信支付 </template>
          <template v-if="column.key === 'offPrice'">
            {{ record.order_original_price - record.order_paid_price }}
          </template>
        </template>
      </a-table>
    </ASpace>
    <check ref="checkRef" @success="successCheckIn" />
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
    DatePicker,
    Space,
    RangePicker,
    Pagination,
    message,
  } from 'ant-design-vue';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';
  import check from './check.vue';
  import dayjs from 'dayjs';
  import { getOrderList } from '/@/api/order/index';
  import { useRouter } from 'vue-router';

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
      APagination: Pagination,
      check,
      message,
    },
    setup() {
      const checkRef = ref();
      const formRef = ref();
      const selectPriceDate = ref();
      const currentPage = reactive({
        current: 1,
        total: 10,
      });
      const orderData = ref([]);
      const courseList = ref<any>([]);
      const statusList = [
        {
          label: 'Daypass次卡',
          value: 'card_daypass_bundle',
        },
        {
          label: 'Daypass时间卡',
          value: 'card_daypass_time',
        },
        {
          label: '团课卡',
          value: 'card_group',
        },
        {
          label: '中级私教课',
          value: 'card_privatelv1',
        },
        {
          label: '高级私教课',
          value: 'card_privatelv2',
        },
        {
          label: '特殊课程',
          value: 'special_course',
        },
      ];
      const formState = reactive<{ [key: string]: any }>({
        status: undefined,
        orderType: undefined,
        date: [dayjs(), dayjs()],
      });
      const subtypeEnum = ref({
        special_course: '特殊课程',
        card_privatelv2: '高级私教课',
        card_privatelv1: '中级私教课',
        card_group: '团课卡',
        card_daypass_time: 'Daypass时间卡',
        card_daypass_bundle: 'Daypass次卡',
      });

      const calendarPriceRangeChange = (date) => {
        console.log(date);
        selectPriceDate.value = date;
      };

      const filterOption = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };

      const getList = (current) => {
        currentPage.current = current;
        getOrderList({
          'from-date': formState.date?.[0].format('YYYY-MM-DD'),
          'to-date': formState.date?.[1].format('YYYY-MM-DD'),
          'order-status': formState.orderType?.length
            ? formState.orderType?.join(',')
            : 'paid,closed',
          'order-subtype': formState.status?.length
            ? formState.status?.join(',')
            : 'card_daypass_bundle,card_daypass_time,card_group,card_privatelv1,card_privatelv2,special_course',
        }).then((res) => {
          orderData.value = res;
          console.log('===res', res);
        });
      };

      getList(1);

      return {
        dayjs,
        checkRef,
        orderData,
        formState,
        currentPage,
        selectPriceDate,
        calendarPriceRangeChange,
        formRef,
        courseList,
        statusList,
        filterOption,
        subtypeEnum,
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
        data: [],
        columns: [
          {
            title: '订单编号',
            dataIndex: 'order_id',
            key: 'Nickname',
          },
          {
            title: '交易流水号',
            dataIndex: 'order_wxpay_transaction_id',
            key: 'phone',
          },
          {
            title: '会员',
            dataIndex: 'wxuser_nickname',
            key: 'memberCard',
          },
          {
            title: '商品',
            dataIndex: 'cardcat_name',
            key: 'reserve',
          },
          {
            title: '商品类型',
            dataIndex: 'order_subtype',
            key: 'subtype',
          },
          {
            title: '商品金额',
            dataIndex: 'order_original_price',
            key: 'memo',
          },
          {
            title: '支付金额',
            dataIndex: 'order_paid_price',
            key: 'checkInTime',
          },
          {
            title: '折扣金额',
            dataIndex: 'attend_updated_at',
            key: 'offPrice',
          },
          {
            title: '支付时间',
            dataIndex: 'order_paid_at',
            key: 'orderPaidAtt',
          },
          {
            title: '支付方式',
            dataIndex: 'payType',
            key: 'payType',
          },
          {
            title: '支付状态',
            dataIndex: 'order_status',
            key: 'checkInTime',
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
        onSubmit(item) {
          console.log('===item', item);
          checkRef.value.controlModal(true, item);
        },
        successCheckIn() {
          message.success('预约成功');
          checkRef.value.controlModal(false);
          getList(1);
        },
        onSearch() {
          console.log(formState);
          if (!formState.date?.length) {
            message.error('请选择日期');
            return;
          }
          getList(1);
        },

        resetForm() {
          formState.status = undefined;
          formState.orderType = undefined;
          formState.date = [];
        },
        disabledDate(current: any) {
          if (!selectPriceDate.value) {
            return false;
          }
          const tooLate =
            selectPriceDate.value[0] && current.diff(selectPriceDate.value[0], 'days') >= 31;
          const tooEarly =
            selectPriceDate.value[1] && selectPriceDate.value[1].diff(current, 'days') >= 31;
          return !!tooEarly || !!tooLate;
        },
        pageNumberChange(page: number) {
          console.log('change');
          getList(page);
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
    padding-bottom: 15px;
    border-bottom: 1px solid #000;

    .course-name {
      font-weight: 500;
    }

    &-btn {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    &-ab {
      margin-left: 20px;
    }
  }

  .member-img {
    width: 40px;
    margin-right: 10px;
  }

  .margin-right-10 {
    margin-right: 10px;
  }
</style>
