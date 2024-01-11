<template>
  <PageWrapper :class="`${prefixCls}-page-wrapper`">
    <div :class="`${prefixCls}__toolbar`">
      <a-button type="primary" @click="createCourse"> 创建课程 </a-button>
      <!-- <a-button type="primary" @click="importCourse"> 导入课表 </a-button> -->
      <a-button type="primary" @click="publishCourses"> 发布课程 </a-button>
      <!-- <a-button type="primary" @click="exportCurse"> 导出课表 </a-button> -->
    </div>
    <div :class="`${prefixCls}-calendar__toolbar`">
      <div class="date-title">{{ curDate.format('YYYY年M月') }}</div>
      <div class="toolbar">
        <ASelect
          placeholder="全部课程"
          style="width: 200px"
          allowClear
          @change="onCourseTypeChange"
        >
          <a-select-option value="groupopen">团课</a-select-option>
          <a-select-option value="private">私教课</a-select-option>
        </ASelect>
        <ApiSelect
          :api="getCoachList"
          labelField="nickname"
          valueField="coach_id"
          placeholder="全部教练"
          :allowClear="true"
          mode="multiple"
          @change="handleCoachChange"
        />
        <div class="week-select">
          <!-- <a-button class="sufix">前</a-button> -->
          <ADatePicker
            :allowClear="false"
            v-model:value="curDate"
            format="第w周"
            picker="week"
            @change="onDatePickerChange"
          />
          <!-- <a-button class="sufix">后</a-button> -->
        </div>
      </div>
    </div>
    <div :class="`${prefixCls}-calendar`" ref="divRef" :style="{ width }">
      <div :class="`${prefixCls}-container`">
        <FullCalendar :options="opts" ref="fulcalendarRef">
          <template #eventContent="{ event }">
            <div
              :class="`cell-content ${event.extendedProps.isExpired ? 'expired' : ''}`"
              @dblclick="handleBbClick"
            >
              <div class="title">{{ event.extendedProps['display_name'] }}</div>
              <div class="event-time">{{ event.extendedProps.timeStr }}</div>
              <div class="coach">{{ event.extendedProps['coach_nickname'] }}</div>
              <div class="reverse"
                >{{ event.extendedProps.reverseStr
                }}<span>{{ event.extendedProps.asignStr }}</span></div
              >
            </div>
          </template>
        </FullCalendar>
      </div>
    </div>
    <Modal @register="registerModal" @submit-success="changeCourseList" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import Modal from '/@/views/course/detail/index1.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import {
    getCoachList,
    deleteCourse,
    getCourseList,
    publishCourse,
    getTempleteList,
  } from '/@/api/course';
  import { ApiSelect } from '/@/components/Form';
  import { DatePicker as ADatePicker, Select, SelectOption } from 'ant-design-vue';
  import FullCalendar from '@fullcalendar/vue3';
  // import dayGridPlugin from '@fullcalendar/daygrid';
  import { CalendarOptions } from '@fullcalendar/core';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import dayjs from 'dayjs';
  import { useRouter } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';

  const Color = {
    normal: {
      group: '#75855D',
      teengroup: '#75855D',
      trialgroup: '#75855D',
      open: '#C8D67A',
      privatelv1: '#EED5D2',
      privatelv2: '#f3d1cd',
      trialprivate: '#EED5D2',
      teenprivatelv1: '#EED5D2',
      teenprivatelv2: '#EED5D2',
      special: '#cde6c7',
    },
    expired: {
      group: 'rgba(117, 133, 93, 0.8)',
      teengroup: 'rgba(117, 133, 93, 0.8)',
      trialgroup: 'rgba(117, 133, 93, 0.8)',
      open: 'rgba(200, 214, 122, 0.8)',
      privatelv1: 'rgba(238, 213, 210, 0.8)',
      privatelv2: 'rgb(243, 209, 205,0.8)',
      trialprivate: 'rgba(238, 213, 210, 0.8)',
      teenprivatelv1: 'rgb(243, 209, 205,0.8)',
      teenprivatelv2: 'rgba(238, 213, 210, 0.8)',
      special: 'rgb(205, 230, 199,0.8)',
    },
  };

  export default defineComponent({
    components: {
      PageWrapper,
      Modal,
      ApiSelect,
      ADatePicker,
      FullCalendar,
      ASelect: Select,
      ASelectOption: SelectOption,
    },
    props: {
      loading: Boolean,
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '300px',
      },
      type: {
        type: String as PropType<string>,
        default: 'groupopen',
      },
    },
    // emits: ['cellSelect', 'eventClick'],
    setup(props) {
      const { prefixCls } = useDesign('course');
      const [registerModal, { openModal: openModal }] = useModal();
      const divRef = ref<HTMLDivElement | null>(null);
      const curDate = ref(dayjs());
      const fulcalendarRef = ref<any>(null);
      const coachIds = ref([]);
      const courseType = ref<string | undefined>(undefined);
      let counter = 0;
      let timer: any = -1;
      const router = useRouter();
      const { createConfirm } = useMessage();

      const opts: CalendarOptions = reactive({
        plugins: [
          timeGridPlugin,
          interactionPlugin, // needed for dateClick
        ],
        headerToolbar: false,
        initialView: 'timeGridWeek',
        locale: 'zh-cn',
        editable: false,
        allDaySlot: false,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: false,
        weekends: true,
        slotMinTime: '08:00:00',
        slotMaxTime: '24:00:00',
        slotDuration: '01:00:00',
        contentHeight: 580,
        // scrollTime: '08:00:00',
        scrollTime: dayjs().subtract(1, 'h').format('HH:mm:00'),
        nowIndicator: true,
        slotLabelFormat: {
          hour: 'numeric',
        },
        events: requestData,
        select: onSelect,
        eventClick: onEventClick,
      });

      function getWeekdDay(date?: string | dayjs.Dayjs) {
        const day = dayjs(date);
        const saturday = day.endOf('week').format('YYYY-MM-DD');
        const sunDay = day.startOf('week').format('YYYY-MM-DD');
        return [saturday, sunDay];
      }

      function requestData(info, successCallback, failureCallback) {
        const startDate = dayjs(info.startStr).format('YYYY-MM-DD');
        const endDate = dayjs(info.endStr).format('YYYY-MM-DD');
        getCourseList(startDate, endDate)
          .then((courses: []) => {
            //筛选
            const coachs = coachIds.value;
            const filterCourse = courses.filter((course: any) => {
              let isInCoachs = true;
              let isAvable = false;
              if (coachs.length > 0) {
                // 通过教练筛选
                isInCoachs = coachs.indexOf(course['coach_id']) !== -1;
              }
              if (isInCoachs) {
                if (courseType.value === undefined) {
                  isAvable = true;
                }
                //通过课程类型筛选
                else if (courseType.value === 'private' && course?.type?.includes('private')) {
                  isAvable = true;
                } else if (
                  courseType.value === 'groupopen' &&
                  (course.type === 'open' ||
                    course?.type?.includes('group') ||
                    course.type === 'special')
                ) {
                  isAvable = true;
                }
              }
              return isAvable;
            });

            const schedules = filterCourse.map((course: any) => {
              const {
                start_time,
                display_name,
                duration_minutes,
                current_attenders,
                max_attenders,
              } = course;
              const startDate = dayjs(start_time);
              const endDate = startDate.add(duration_minutes, 'm');
              const start = startDate.format('YYYY-MM-DD HH:mm');
              const end = endDate.format('YYYY-MM-DD HH:mm');

              const isExpired = calcExpired(course);
              const timeStr = `${startDate.format('HH:mm')} ~ ${endDate.format('HH:mm')}`;
              const reverseStr = `约：${current_attenders}/${max_attenders}`;
              const asignStr = `签：${current_attenders}`;
              const backound = formatBackend(course, isExpired);
              return {
                start,
                end,
                timeStr,
                reverseStr,
                asignStr,
                title: display_name,
                isExpired,
                color: backound,
                ...course,
              };
            });

            successCallback(schedules);
          })
          .catch((error) => {
            failureCallback(error);
          });
      }
      function calcExpired(course) {
        const { start_time } = course;
        const startDate = dayjs(start_time);

        return startDate.isBefore(dayjs());
      }

      function formatBackend(course, isExpired) {
        const color = isExpired ? Color.expired : Color.normal;
        const { type } = course;
        return color[type] || '#94d6da';
      }

      function onSelect(info) {
        console.log('onSelect', info);
        createCourse(info);
      }

      function onEventClick(info) {
        console.log('onEventClick', info);
        const data = info?.event?.['_def']?.extendedProps;
        const { course_id, type, start_time, coach_id } = data || {};

        counter++;
        if (counter === 2) {
          console.log('双击事件');
          counter = 0;
          clearTimeout(timer);
          handleEdit(data);
        }

        timer = setTimeout(() => {
          if (counter === 1) {
            console.log('单机事件');
            counter = 0;
            router.push({
              path: '/checkIn/reserveManage',
              // name: 'home',
              query: { type, course_id, start_time, coach_id },
            });
          }
        }, 250);
      }

      function handleBbClick(info) {
        console.log('handleBbClick', info);
      }

      async function handleEdit(data: any) {
        openModal(true, { type: 'edit', courseType: props.type, formData: data });
      }

      async function createCourse(info?: any) {
        openModal(true, { type: 'create', courseType: props.type, calendar: info });
      }
      function handleView(event: any) {
        console.log('handleView', event);
        openModal(true, { type: 'view', courseType: props.type });
      }

      function handleCoachChange(value: []) {
        coachIds.value = value;
        const calendarApi = fulcalendarRef.value?.getApi();
        calendarApi?.refetchEvents();
      }

      function changeCourseList() {
        console.log('更新日历看板');
        const calendarApi = fulcalendarRef.value?.getApi();
        calendarApi?.refetchEvents();
        // reload();
      }
      function handleDelete(event) {
        deleteCourse(event['ctpl_id']).then(() => {
          // reload();
        });
      }

      function publishCourses(event: any) {
        console.log('publishCourse', event);
        // 给定的日期
        const saturday = curDate.value.endOf('week').format('YYYY-MM-DD');
        createConfirm({
          iconType: 'info',
          title: '发布课程',
          content:
            '发布课程后，14天内的小程序将会更新到小程序，已预约的课程不支持删除或修改人数上限',
          onOk: () => {
            publishCourse(saturday, props.type);
          },
        });
      }

      function onDatePickerChange(date) {
        // curDate.value = date;
        const [firstDay] = getWeekdDay(date);
        const calendarApi = fulcalendarRef.value?.getApi();
        calendarApi.gotoDate(firstDay);
        // opts.initialDate = date.format('YYYY-MM-DD');
      }

      function onCourseTypeChange(event) {
        courseType.value = event;
        const calendarApi = fulcalendarRef.value?.getApi();
        calendarApi?.refetchEvents();
      }

      function importCourse(event: any) {
        console.log('importCourse', event);
      }

      function exportCurse(event: any) {
        console.log('exportCurse', event);
      }

      return {
        divRef,
        createCourse,
        handleEdit,
        handleView,
        registerModal,
        openModal,
        prefixCls,
        publishCourses,
        importCourse,
        exportCurse,
        getCoachList,
        curDate,
        opts,
        fulcalendarRef,
        changeCourseList,
        handleCoachChange,
        onDatePickerChange,
        handleBbClick,
        onCourseTypeChange,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-course';

  .@{prefix-cls} {
    &-page-wrapper {
      margin: 20px;
      padding: 8px;
      background-color: #fff;
    }

    &__toolbar {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      > * {
        margin-left: 8px;
      }
    }

    &-calendar__toolbar {
      display: flex;
      justify-content: space-between;
      margin: 15px 0 0;

      .date-title {
        font-size: 30px;
        font-weight: bold;
      }

      .toolbar {
        display: flex;

        > * {
          margin-left: 20px;
        }

        .ant-select {
          width: 200px;
        }

        .ant-picker {
          width: 140px;
        }
      }

      .ant-select-selector {
        border: none !important;
        background-color: #f2f2f2 !important;
      }

      button,
      .ant-input,
      .ant-picker,
      .ant-input-number,
      .ant-input-affix-wrapper {
        border: none !important;
        background-color: #f2f2f2 !important;
      }

      .week-select {
        display: inline-block;

        .ant-picker {
          margin: 0 5px;
        }

        .sufix {
          height: 28px;
          padding: 4px 10px;
        }
      }

      .ant-select-selection-placeholder {
        color: #000 !important;
      }
    }

    &-container {
      --fc-border-color: #f2f2f2;

      .fc-day-today {
        background-color: #ecf4fd !important;
      }

      .fc .fc-timegrid-slot {
        height: 90px;
      }

      .fc-timegrid-axis {
        background-color: #f2f2f2;
      }

      .fc-timegrid-slot-label {
        padding-right: 10px;
      }

      .fc-col-header-cell {
        height: 50px;
        background-color: #f2f2f2;

        .fc-col-header-cell-cushion {
          line-height: 50px;
        }
      }

      .fc-col-header-cell-cushion {
        color: #000;
      }

      .fc-event-main {
        padding: 8px;

        .cell-content {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          color: #2e2e2a;

          .reverse > span {
            display: inline-block;
            padding-left: 10px;
          }

          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .expired {
          color: #6c6c63;
        }
      }

      .fc-direction-ltr .fc-timegrid-col-events {
        margin: 0 10% 0 1px;
      }
    }
  }
</style>
