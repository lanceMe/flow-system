<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <!-- <h5 style="font-size: 16px">{{ getWeek() }} | {{ getDate() }}</h5> -->
      <a-table :columns="columns" :data-source="orderData" />
    </ASpace>
    <check ref="checkRef" :data="checkData" :checkType="checkType" @on-submit="checkSubmit" />
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { Table, Space, message } from 'ant-design-vue';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';
  import dayjs from 'dayjs';
  import { getCourseList } from '/@/api/staff/index';
  import { useUserStore } from '/@/store/modules/user';

  export default defineComponent({
    components: {
      PageWrapper,
      ATable: Table,
      ASpace: Space,
    },
    setup() {
      const checkRef = ref();
      const formRef = ref();
      const selectPriceDate = ref();
      const orderData = ref([]);
      const courseList = ref<any>([]);

      const formState = reactive<{ [key: string]: any }>({
        status: undefined,
        orderType: undefined,
      });

      const calendarPriceRangeChange = (date) => {
        console.log(date);
        selectPriceDate.value = date;
      };

      const filterOption = (input: string, option: any) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      };

      const getList = () => {
        const userStore = useUserStore();
        getCourseList({
          'staff-id': userStore.getUserId,
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
        selectPriceDate,
        calendarPriceRangeChange,
        formRef,
        courseList,
        filterOption,
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
        data: [],
        columns: [
          {
            title: '课程名称',
            dataIndex: 'course_display_name',
            key: 'Nickname',
          },
          {
            title: '课程时间',
            dataIndex: 'course_start_time',
            key: 'phone',
          },
          {
            title: '预约人数',
            dataIndex: 'course_current_attenders',
            key: 'memberCard',
          },
          {
            title: '到场人数',
            dataIndex: 'course_checkedin_attenders',
            key: 'role',
          },
          {
            title: '候补人数',
            dataIndex: 'course_waiting_attenders',
            key: 'status',
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
