<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <a-form name="horizontal_login" layout="inline" autocomplete="off" ref="formRef">
        <a-form-item name="status">
          <a-select
            v-model:value="formState.status"
            placeholder="角色"
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
            placeholder="状态"
            style="width: 200px"
            mode="multiple"
          >
            <a-select-option
              v-for="item in orderTypeList"
              :value="item.value"
              :key="item.value"
              :label="item.label"
              >{{ item.label }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button style="margin: 0 10px" @click="resetForm">清空</a-button>
          <a-button type="primary" @click="onSearch">搜索</a-button>
        </a-form-item>
      </a-form>

      <!-- <h5 style="font-size: 16px">{{ getWeek() }} | {{ getDate() }}</h5> -->
      <a-table :columns="columns" :data-source="orderData" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            {{ record.staff_role?.join(',') }}
          </template>
          <template v-if="column.key === 'status'">
            {{
              !record.staff_enable
                ? '停用'
                : record.staff_update_password_immediately
                ? '正常'
                : '未激活'
            }}
          </template>

          <!-- <template v-if="column.key === 'operation'">
            <a-button @click="handleEdit(record)" type="link">编辑</a-button>
            <a-button v-if="record.staff_enable" @click="handleView(record)" type="link"
              >启用</a-button
            >
            <a-button v-else @click="handleView(record)" type="link">停用</a-button>
          </template> -->
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
  import check from './check.vue';
  import dayjs from 'dayjs';
  import { getStaffList } from '/@/api/staff/index';
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
          label: 'admin',
          value: 'admin',
        },
        {
          label: 'manager',
          value: 'manager',
        },
        {
          label: 'financial',
          value: 'financial',
        },
        {
          label: 'reception',
          value: 'reception',
        },
        {
          label: 'coach',
          value: 'coach',
        },
      ];
      const orderTypeList = [
        {
          label: '正常',
          value: 'enabled',
        },
        {
          label: '停用',
          value: 'disabled',
        },
        {
          label: '未激活',
          value: 'inactive',
        },
      ];
      const formState = reactive<{ [key: string]: any }>({
        status: undefined,
        orderType: undefined,
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
        getStaffList({
          'staff-role': formState.status?.join(','),
          'staff-status': formState.orderType?.join(','),
        }).then((res) => {
          console.log('===res', res);
          orderData.value = res;
        });
      };

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
        statusList,
        filterOption,
        orderTypeList,
        subtypeEnum,
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
        data: [],
        columns: [
          {
            title: '昵称',
            dataIndex: 'staff_nickname',
            key: 'Nickname',
          },
          {
            title: '姓名',
            dataIndex: 'staff_name',
            key: 'phone',
          },
          {
            title: '联系方式',
            dataIndex: 'staff_phone_number',
            key: 'memberCard',
          },
          {
            title: '角色',
            dataIndex: 'staff_role',
            key: 'role',
          },
          {
            title: '状态',
            dataIndex: 'staff_enable',
            key: 'status',
          },
          {
            title: '操作',
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
          formState.status = undefined;
          formState.orderType = undefined;
        },
        handleEdit(record: Record<string, any>) {
          console.log('编辑通知', record);
          // 这里可以添加具体的编辑逻辑
          checkRef.value.controlModal(true);
          checkType.value = 'edit';
          checkData.value = record;
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
