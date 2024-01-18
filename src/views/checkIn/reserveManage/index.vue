<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <a-form name="horizontal_login" layout="inline" autocomplete="off" ref="formRef">
        <a-form-item name="coach">
          <a-select
            v-model:value="formState.coach"
            placeholder="教练"
            style="width: 200px"
            :filter-option="filterOption"
            mode="multiple"
          >
            <a-select-option
              v-for="item in coachList"
              :value="item.coach_id"
              :key="item.coach_id"
              :label="item.nickname"
              >{{ item.nickname }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item name="courseType">
          <a-select
            v-model:value="formState.courseType"
            placeholder="课程类别"
            style="width: 200px"
            mode="multiple"
          >
            <a-select-option value="group">成人团课</a-select-option>
            <a-select-option value="teengroup">青少年团课</a-select-option>
            <a-select-option value="trialgroup">体验团课</a-select-option>
            <a-select-option value="open">公开课</a-select-option>
            <a-select-option value="privatelv1">成人中级私教</a-select-option>
            <a-select-option value="privatelv2">成人高级私教</a-select-option>
            <a-select-option value="trialprivate">私教体验课</a-select-option>
            <a-select-option value="teenprivatelv1">青少年中级私教</a-select-option>
            <a-select-option value="teenprivatelv2">青少年高级私教</a-select-option>
            <a-select-option value="special">特殊课程</a-select-option>
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
      <div class="reserve-item" v-for="item in courseList" :key="item.course_id">
        <div style="display: flex; flex-direction: row" size="middle">
          <div class="course-name margin-right-10">{{ item.course_display_name }}</div>
          <div class="margin-right-10">{{ item.course_start_time }}</div>
          <div class="margin-right-10">{{ item.coach_nickname }}</div>
          <div class="reserve-item-btn">
            <a-button class="reserve-item-ab" type="primary" @click="onSubmit(item)">预约</a-button>
          </div>
        </div>

        <a-table :columns="columns" :data-source="item.wxusers" :pagination="false">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              {{ attendStatus[record.attend_status] }}
            </template>

            <template v-if="column.key === 'operation'">
              <a-button
                type="link"
                v-if="record.attend_status === 'checkedin'"
                @click="onCancelCheckIn(record, item.course_id)"
                >取消消课</a-button
              >
              <a-button
                type="link"
                v-if="record.attend_status === 'reserved'"
                @click="cancelReserve(record, item.course_id)"
                >取消预约</a-button
              >
              <a-button
                type="link"
                v-if="record.attend_status === 'waiting'"
                @click="cancelWaiting(record, item.course_id)"
                >取消候补</a-button
              >
              <a-button
                type="link"
                v-if="record.attend_status === 'reserved'"
                @click="noShowCourse(record, item.course_id)"
                >未到场</a-button
              >
              <a-button
                type="link"
                v-if="record.attend_status === 'reserved'"
                @click="checkInCourse(record, item.course_id)"
                >消课</a-button
              >
            </template>
          </template>
        </a-table>
      </div>
      <a-empty v-if="!courseList.length" />
      <a-pagination
        v-else
        v-model:current="currentPage.current"
        :total="currentPage.total"
        @change="pageNumberChange"
        show-less-items
      />
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
    Empty,
  } from 'ant-design-vue';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';
  import check from './check.vue';
  import dayjs from 'dayjs';
  import {
    getCoachList,
    getCheckinList,
    deleteReserveCourse,
    noShowReserveCourse,
    deleteCheckinCoures,
    deleteWaitingCourse,
    checkinCoure,
  } from '/@/api/booking/course';
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
      AEmpty: Empty,
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
      const courseList = ref<any>([]);

      const coachList = ref();
      const router = useRouter();
      const query = router.currentRoute.value.query;

      const startTime = query?.start_time?.split(' ')[0]
        ? dayjs(query?.start_time?.split(' ')[0])
        : dayjs();
      const courseType = query?.type ? [query?.type] : [];
      const coach = query.coach_id ? [query.coach_id] : [];
      console.log('===query', query, startTime, courseType, coach);
      const formState = reactive<{ [key: string]: any }>({
        coach,
        courseType,
        date: [startTime, startTime],
      });
      const attendStatus = ref({
        reserved: '已预约',
        waiting: '候补中',
        checkedin: '已消课',
        noshow: '未到场',
        cancelled: '已取消',
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
        getCheckinList({
          'from-date': formState.date?.[0].format('YYYY-MM-DD'),
          'to-date': formState.date?.[1].format('YYYY-MM-DD'),
          'coach-id': formState.coach?.join(','),
          'course-type': formState.courseType?.length
            ? formState.courseType?.join(',')
            : 'group,open,privatelv1,privatelv2',
          'page-index': currentPage.current - 1,
          'page-size': 10,
        }).then((res) => {
          console.log('===res', res);
          currentPage.total = res.total_pages * 10;
          courseList.value = res.course_list;
        });
      };

      getList(1);
      getCoachList().then((res) => {
        console.log('=====res', res);
        coachList.value = res;
      });

      return {
        dayjs,
        checkRef,
        formState,
        currentPage,
        selectPriceDate,
        calendarPriceRangeChange,
        formRef,
        courseList,
        coachList,
        filterOption,
        attendStatus,
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
        data: [],
        columns: [
          {
            title: '昵称',
            dataIndex: 'wxuser_nickname',
            key: 'Nickname',
          },
          {
            title: '手机号',
            dataIndex: 'wxuser_phone_number',
            key: 'phone',
          },
          {
            title: '会员卡',
            dataIndex: 'cardcat_name',
            key: 'memberCard',
          },
          {
            title: '预约渠道',
            dataIndex: 'attend_channel',
            key: 'reserve',
          },
          {
            title: '状态',
            dataIndex: 'attend_status',
            key: 'status',
          },
          {
            title: '备注',
            dataIndex: 'attend_remarks',
            key: 'memo',
          },
          {
            title: '预约时间',
            dataIndex: 'attend_updated_at',
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
          getList(1);
        },

        resetForm() {
          formState.coach = undefined;
          formState.courseType = undefined;
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
        cancelReserve(item, id) {
          console.log(item, id);
          deleteReserveCourse({
            'wxuser-token': item.wxuser_token,
            'course-id': id,
          }).then(() => {
            message.success('取消预约成功');
            getList(currentPage.current);
          });
        },
        cancelWaiting(item, id) {
          deleteWaitingCourse({
            'wxuser-token': item.wxuser_token,
            'course-id': id,
          }).then(() => {
            message.success('取消候补成功');
            getList(currentPage.current);
          });
        },
        onCancelCheckIn(item, id) {
          deleteCheckinCoures({
            'wxuser-token': item.wxuser_token,
            'course-id': id,
          }).then(() => {
            message.success('取消消课成功');
            getList(currentPage.current);
          });
        },

        noShowCourse(item, id) {
          noShowReserveCourse({
            'wxuser-token': item.wxuser_token,
            'course-id': id,
          }).then(() => {
            message.success('未到场记录成功');
            getList(currentPage.current);
          });
        },

        checkInCourse(item, id) {
          checkinCoure({
            'wxuser-token': item.wxuser_token,
            'course-id': id,
          }).then(() => {
            message.success('消课成功');
            getList(currentPage.current);
          });
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
    margin-right: 5px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 2px 2px 5px #bbb;

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

  .margin-right-10 {
    margin-right: 10px;
  }
</style>
