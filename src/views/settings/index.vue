<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <a-form name="horizontal_login" layout="inline" autocomplete="off" ref="formRef">
        <a-form-item name="user">
          <a-select
            v-model:value="formState.user"
            placeholder="操作人"
            style="width: 200px"
            :filter-option="filterOption"
          >
            <a-select-option
              v-for="item in userList"
              :value="item.value"
              :key="item.value"
              :label="item.label"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item name="operation">
          <a-select v-model:value="formState.operation" placeholder="操作模块" style="width: 200px">
            <a-select-option
              v-for="item in orderTypeList"
              :value="item.value"
              :key="item.value"
              :label="item.label"
              >{{ item.label }}</a-select-option
            >
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
          <template v-if="column.key === 'code'">
            <div class="success" v-if="record.code === 200">成功</div>
            <div class="fail" v-else>失败</div>
          </template>

          <template v-if="column.key === 'operation'">
            <a-button @click="handleView(record)" type="link">详情</a-button>
          </template>
        </template>
      </a-table>
    </ASpace>
    <check ref="checkRef" :data="checkData" :checkType="checkType" @on-submit="checkSubmit" />
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
  import dayjs from 'dayjs';
  import { getOperationList, getOperationModuleList } from '/@/api/setting/index';
  import { getStaffList } from '/@/api/staff';
  import { encode } from '/@/utils/base64';
  import check from './check.vue';

  export default defineComponent({
    components: {
      PageWrapper,
      check,
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

      const userList = ref<any>([]);

      const orderTypeList = ref<any>([]);
      const formState = reactive<{ [key: string]: any }>({
        user: undefined,
        operation: undefined,
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

      const getList = () => {
        console.log({
          'from-date': formState.date?.[0].format('YYYY-MM-DD'),
          'to-date': formState.date?.[1].format('YYYY-MM-DD'),
          'staff-id': formState.user,
          'operation-module': encode(formState.operation),
        });
        getOperationList({
          'from-date': formState.date?.[0].format('YYYY-MM-DD'),
          'to-date': formState.date?.[1].format('YYYY-MM-DD'),
          'staff-id': formState.user,
          'operation-module': encode(formState.operation),
        }).then((res) => {
          console.log('===res', res);
          orderData.value = res;
        });
      };
      const getStaff = () => {
        getStaffList({}).then((res) => {
          console.log('===getStaffList', res);
          userList.value = res.map((item) => {
            return {
              value: item.staff_id,
              label: item.staff_nickname,
            };
          });
        });
      };
      const getModule = () => {
        getOperationModuleList({}).then((res) => {
          console.log('===getOperationModuleList', res);
          orderTypeList.value = res.map((item) => {
            return {
              value: item,
              label: item,
            };
          });
        });
      };
      getModule();
      getStaff();
      getList();
      const checkData = ref<any>(null);
      const checkType = ref('create');
      const checkSubmit = () => {};

      return {
        dayjs,
        checkRef,
        checkData,
        checkSubmit,
        checkType,
        orderData,
        formState,
        currentPage,
        selectPriceDate,
        calendarPriceRangeChange,
        formRef,
        courseList,
        userList,
        filterOption,
        orderTypeList,
        subtypeEnum,
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
        data: [],
        columns: [
          {
            title: '操作人',
            dataIndex: 'staff_nickname',
            key: 'nickname',
          },
          {
            title: '操作 ip',
            dataIndex: 'ip',
            key: 'ip',
          },
          {
            title: '操作模块',
            dataIndex: 'module',
            key: 'module',
          },
          {
            title: '操作说明',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: '结果',
            dataIndex: 'code',
            key: 'code',
          },
          {
            title: '操作时间',
            dataIndex: 'time',
            key: 'time',
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
        onSubmit(item) {
          console.log('===item', item);
          checkRef.value.controlModal(true, item);
        },
        successCheckIn() {
          message.success('预约成功');
          checkRef.value.controlModal(false);
          getList();
        },
        onSearch() {
          getList();
        },

        resetForm() {
          formState.user = undefined;
          formState.orderType = undefined;
        },
        handleView(record: Record<string, any>) {
          console.log('查看', record);
          // 这里可以添加具体的查看逻辑
          checkRef.value.controlModal(true);
          checkType.value = 'view';
          checkData.value = record;
        },
        disabledDate(current: any) {
          if (!selectPriceDate.value) {
            return false;
          }
          const tooLate =
            selectPriceDate.value[0] && current.diff(selectPriceDate.value[0], 'days') >= 365;
          const tooEarly =
            selectPriceDate.value[1] && selectPriceDate.value[1].diff(current, 'days') >= 365;
          return !!tooEarly || !!tooLate;
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

  .success {
    color: #30953b;
  }

  .fail {
    color: #ea8989;
  }

  .margin-right-10 {
    margin-right: 10px;
  }
</style>
