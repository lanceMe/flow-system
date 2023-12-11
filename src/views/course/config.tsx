import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDate } from '/@/utils/dateUtil';
import { getTagList, getCoachList } from '/@/api/course';
import dayjs from 'dayjs';
// import { getCardList } from '/@/api/cards';

export function getFormSchema(data): FormSchema[] {
  const { type, formData: f } = data || {};
  const dynamicDisabled = type === 'view';
  const showDef = type !== 'create';
  const address = f?.['ctpl_address'] === 'Mellow Climbing Gym' ? 1 : 2;
  return [
    {
      field: 'ctpl-display-name',
      component: 'Input',
      label: '课程名称',
      required: true,
      defaultValue: showDef ? f?.['ctpl_display_name'] : undefined,
      dynamicDisabled,
    },
    {
      field: 'ctpl-type',
      component: 'Select',
      label: '课程类别',
      defaultValue: showDef ? f?.['ctpl_type'] : undefined,
      required: true,
      dynamicDisabled,
      componentProps: {
        options: [
          { label: '团课', value: 'group', key: 'group' },
          { label: '公开课', value: 'open', key: 'open' },
          { label: '中级私教课', value: 'privatelv1', key: 'privatelv1' },
          { label: '高级私教课', value: 'privatelv2', key: 'privatelv2' },
          { label: '特殊课程', value: 'special', key: 'special' },
        ],
      },
    },
    {
      field: 'ctpl-tag',
      component: 'ApiSelect',
      label: '课程种类',
      required: true,
      dynamicDisabled,
      defaultValue: showDef ? f?.['ctpl_tag'] : undefined,
      componentProps: {
        api: getTagList,
        immediate: true,
        // mode: 'multiple',
        onChange: (e, v) => {
          console.log('ApiSelect====>:', e, v);
        },
      },
    },
    // {
    //   fields: ['ctpl-max-attenders'],
    //   field: 'ctpl-min-attenders',
    //   component: 'InputNumber',
    //   label: '人数上下限',
    //   slot: 'attenders',
    //   defaultValue: f?.['ctpl_min_attenders'],
    //   defaultValueObj: {
    //     'ctpl-max-attenders': f?.['ctpl_max_attenders'],
    //   },
    //   required: true,
    //   dynamicDisabled,
    // },

    {
      field: 'ctpl-min-attenders',
      component: 'InputNumber',
      label: '人数下限',
      defaultValue: showDef ? f?.['ctpl_min_attenders'] : undefined,
      required: true,
      dynamicDisabled,
    },

    {
      field: 'ctpl-max-attenders',
      component: 'InputNumber',
      label: '人数上限',
      defaultValue: f?.['ctpl_max_attenders'],
      required: true,
      dynamicDisabled,
    },
    // {
    //   field: 'ctpl-reserve-type',
    //   component: 'ApiSelect',
    //   label: '预约方式',
    //   // defaultValue: f?.['ctpl_type'],
    //   // required: true,
    //   dynamicDisabled,
    //   componentProps: {
    //     api: getCardList,
    //     immediate: true,
    //     labelField: 'name',
    //     valueField: 'id',
    //     onChange: (e, v) => {
    //       console.log('ApiSelect====>:', e, v);
    //     },
    //   },
    // },

    // {
    //   field: 'ctpl-cards-type',
    //   component: 'Select',
    //   label: '卡种',
    //   // defaultValue: f?.['ctpl_type'],
    //   // required: true,
    //   dynamicDisabled,
    //   componentProps: {
    //     options: [
    //       { label: '团课', value: 'group', key: 'group' },
    //       { label: '中级私教课', value: 'privatelv1', key: 'privatelv1' },
    //       { label: '高级私教课', value: 'privatelv2', key: 'privatelv2' },
    //     ],
    //   },
    // },
    {
      field: 'ctpl-price',
      component: 'InputNumber',
      label: '课程价格',
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      // required: true,
      dynamicDisabled,
    },
    {
      field: 'ctpl-duration-minutes',
      component: 'InputNumber',
      label: '课程时长',
      defaultValue: showDef ? f?.['ctpl_duration_minutes'] : undefined,
      required: true,
      dynamicDisabled,
    },
    {
      field: 'ctpl-cancel-waiting-minutes',
      component: 'InputNumber',
      label: '候补时间限制',
      defaultValue: showDef ? f?.['ctpl_cancel_waiting_minutes'] : undefined,
      required: true,
      dynamicDisabled,
    },
    {
      field: 'ctpl-no-cancel-reserve-minutes',
      component: 'InputNumber',
      label: '取消时间限制',
      defaultValue: showDef ? f?.['ctpl_no_cancel_reserve_minutes'] : undefined,
      required: true,
      dynamicDisabled,
    },
    {
      field: 'ctpl-description',
      component: 'Input',
      label: '课程介绍',
      defaultValue: showDef ? f?.['ctpl_description'] : undefined,
      // required: true,
      dynamicDisabled,
    },
    {
      field: 'address',
      component: 'RadioGroup',
      label: '地点',
      defaultValue: showDef ? address : undefined,
      componentProps: {
        options: [
          { label: '岩馆地址', value: 1 },
          { label: '其他地址', value: 2 },
        ],
      },
    },
    {
      field: 'ctpl-address',
      component: 'Input',
      label: '',
      defaultValue: showDef ? f?.['ctpl_address'] : undefined,
      required: ({ values }) => {
        return values.address === 2;
      },
      ifShow: ({ values }) => {
        return values.address === 2;
      },
      dynamicDisabled,
    },
  ];
}

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '课程名称',
      dataIndex: 'ctpl_display_name',
      // fixed: 'left',
      width: 200,
    },
    {
      title: '课程类别',
      dataIndex: 'ctpl_type',
      format(type) {
        let formatText = type;
        switch (type) {
          case 'group':
            formatText = '团课';
            break;
          case 'open':
            formatText = '公开课';
            break;
          case 'privatelv1':
            formatText = '中级私教课';
            break;
          case 'privatelv2':
            formatText = '高级私教课';
            break;
          case 'special':
            formatText = '特殊课程';
            break;
          default:
            break;
        }

        return formatText;
      },
      width: 150,
    },
    {
      title: '人数上限',
      width: 100,
      dataIndex: 'ctpl_max_attenders',
    },
    {
      title: '创建日期',
      width: 150,
      dataIndex: 'ctpl_created_at',
      format(text) {
        if (text) return formatToDate(text);
        return text;
      },
    },
    {
      title: '创建人',
      width: 150,
      dataIndex: 'cardType',
    },
  ];
}

export function getFormSchema1(data): FormSchema[] {
  const { type, formData: fd, templeteData: td, calendar: c } = data || {};
  const dynamicDisabled = type === 'view';
  const isNeedFillTemplete = td !== undefined;
  const showDef = type === 'edit' || type === 'view' || isNeedFillTemplete;
  const f = isNeedFillTemplete ? td : fd;

  const address = !f?.['address'] || f?.['address'] === 'Mellow Climbing Gym' ? 1 : 2;

  const startDate = f?.['start_time']
    ? dayjs(f?.['start_time'])
    : c?.startStr
    ? dayjs(c.startStr)
    : undefined;
  const endDate =
    startDate && f?.['duration_minutes']
      ? startDate.add(f?.['duration_minutes'], 'm')
      : c?.endStr
      ? dayjs(c.endStr)
      : undefined;

  const start = startDate?.format('YYYY-MM-DD HH:mm:sss') || '';
  const end = endDate?.format('YYYY-MM-DD HH:mm:sss') || '';
  const ret: FormSchema[] = [
    {
      field: 'course_id',
      component: 'ApiSelect',
      label: '课程名称',
      required: true,
      defaultValue: showDef ? f?.['course_id'] : undefined,
      dynamicDisabled,
      slot: 'course_name',
    },
    {
      field: 'coach-id',
      component: 'ApiSelect',
      label: '课程教练',

      rules: [
        {
          required: true,
          trigger: 'blur',
        },
      ],
      defaultValue: showDef ? f?.['coach_id'] : undefined,
      dynamicDisabled,
      componentProps: {
        api: getCoachList,
        immediate: true,
        labelField: 'nickname',
        valueField: 'coach_id',
      },
    },
    {
      field: '[course-start-time, endDateTime]',
      label: '日期时间范围',

      component: 'RangePicker',
      required: true,
      dynamicDisabled,
      // defaultValue: ['2023-12-10 13:00', '2023-12-10 14:00'],
      // defaultValue: showDef ? [start, end] : ['', ''],

      componentProps: {
        format: 'YYYY-MM-DD HH:mm',
        placeholder: ['开始时间', '结束时间'],
        showTime: { format: 'HH:mm' },
      },
      colProps: {
        span: 26,
      },
    },

    {
      field: 'course-min-attenders',
      component: 'InputNumber',
      label: '人数下限',
      defaultValue: showDef ? f?.['min_attenders'] : undefined,
      required: true,
      dynamicDisabled,
    },

    {
      field: 'course-max-attenders',
      component: 'InputNumber',
      label: '人数上限',
      defaultValue: showDef ? f?.['max_attenders'] : undefined,
      required: true,
      dynamicDisabled,
    },
    {
      field: 'course-cancel-waiting-minutes',
      component: 'InputNumber',
      label: '候补时间限制',
      defaultValue: showDef ? f?.['cancel_waiting_minutes'] : undefined,
      required: true,
      dynamicDisabled,
    },
    {
      field: 'course-no-cancel-reserve-minutes',
      component: 'InputNumber',
      label: '取消时间限制',
      defaultValue: showDef ? f?.['no_cancel_reserve_minutes'] : undefined,
      required: true,
      dynamicDisabled,
    },
    {
      field: 'course-description',
      component: 'Input',
      label: '课程描述',
      defaultValue: showDef ? f?.['description'] : undefined,
      // required: true,
      dynamicDisabled,
    },
    {
      field: 'address',
      component: 'RadioGroup',
      label: '地点',
      defaultValue: showDef ? address : undefined,
      componentProps: {
        options: [
          { label: '岩馆地址', value: 1 },
          { label: '其他地址', value: 2 },
        ],
      },
    },
    {
      field: 'course-address',
      component: 'Input',
      label: '',
      defaultValue: showDef ? f?.['address'] : undefined,
      required: ({ values }) => {
        return values.address === 2;
      },
      ifShow: ({ values }) => {
        return values.address === 2;
      },
      dynamicDisabled,
    },
  ];

  const rangePicker = ret.find((item) => item.field === '[course-start-time, endDateTime]');

  if (rangePicker && start && end) {
    rangePicker.defaultValue = [start, end];
  }
  console.log(start, end, showDef, 8888889);
  return ret;
}
