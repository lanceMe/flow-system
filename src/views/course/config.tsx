import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDate } from '/@/utils/dateUtil';
import { getTagList, getCoachList } from '/@/api/course';
import dayjs from 'dayjs';
// import { getCardList } from '/@/api/cards';

export function getFormSchema(
  data,
  getFieldsValue: Function | undefined = undefined,
): FormSchema[] {
  const { type, formData: f } = data || {};
  const dynamicDisabled = type === 'view';
  const showDef = type !== 'create';
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
          { label: '成人团课', value: 'group', key: 'group' },
          { label: '青少年团课', value: 'teengroup', key: 'teengroup' },
          { label: '体验团课', value: 'trialgroup', key: 'trialgroup' },
          { label: '公开课', value: 'open', key: 'open' },
          { label: '成人中级私教', value: 'privatelv1', key: 'privatelv1' },
          { label: '成人高级私教', value: 'privatelv2', key: 'privatelv2' },
          { label: '私教体验课', value: 'trialprivate', key: 'trialprivate' },
          { label: '青少年中级私教', value: 'teenprivatelv1', key: 'teenprivatelv1' },
          { label: '青少年高级私教', value: 'teenprivatelv2', key: 'teenprivatelv2' },
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
    {
      field: 'ctpl-min-attenders',
      component: 'InputNumber',
      label: '人数下限',
      defaultValue: showDef ? f?.['ctpl_min_attenders'] : undefined,
      required: true,
      dynamicDisabled,
      rules: [
        {
          required: true,
          type: 'integer',
        },
        {
          required: true,
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },

    {
      field: 'ctpl-max-attenders',
      component: 'InputNumber',
      label: '人数上限',
      defaultValue: showDef ? f?.['ctpl_max_attenders'] : undefined,
      required: true,
      dynamicDisabled,
      rules: [
        {
          required: true,
          trigger: 'blur',
        },
        {
          type: 'integer',
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
        {
          validator: (_, val) => {
            let min = f?.['ctpl_min_attenders'] || 0;
            if (getFieldsValue) {
              const fieldsValue = getFieldsValue();
              min = fieldsValue?.['ctpl-min-attenders'] || 0;
            }
            if (min > val) {
              return Promise.reject('人数下限必须不能大于人数上限');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'ctpl-price',
      component: 'InputNumber',
      label: '课程价格',
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      required: true,
      dynamicDisabled,
      rules: [
        {
          validator: (_, val) => {
            if (val < 0) {
              return Promise.reject('价格大于0');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'ctpl-duration-minutes',
      component: 'InputNumber',
      label: '课程时长',
      defaultValue: showDef ? f?.['ctpl_duration_minutes'] : undefined,
      required: true,
      dynamicDisabled,
      componentProps: {
        placeholder: '请输入课程持续多少分钟',
      },
      rules: [
        {
          required: true,
          type: 'integer',
        },
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
    {
      field: 'ctpl-cancel-if-not-enough-attenders-hours',
      component: 'InputNumber',
      label: '开课确认时间',
      defaultValue: showDef ? f?.['ctpl_cancel_if_not_enough_attenders_hours'] : undefined,
      required: true,
      dynamicDisabled,
      componentProps: {
        placeholder: '开课前几小时确认报名人数，若不足下限则取消',
      },
      rules: [
        {
          required: true,
          type: 'integer',
        },
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
    {
      field: 'ctpl-no-cancel-reserve-hours',
      component: 'InputNumber',
      label: '取消时间限制',
      defaultValue: showDef ? f?.['ctpl_no_cancel_reserve_hours'] : undefined,
      required: true,
      dynamicDisabled,
      componentProps: {
        placeholder: '开课前几小时不允许取消报名',
      },
      rules: [
        {
          required: true,
          type: 'integer',
        },
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
    {
      field: 'ctpl-description',
      component: 'InputTextArea',
      label: '课程介绍',
      defaultValue: showDef ? f?.['ctpl_description'] : undefined,
      // required: true,
      dynamicDisabled,
      componentProps: {
        rows: 4,
      },
    },
    // {
    //   field: 'address',
    //   component: 'RadioGroup',
    //   label: '地点',
    //   defaultValue: f?.address,
    //   componentProps: {
    //     options: [
    //       { label: '岩馆地址', value: 1 },
    //       { label: '其他地址', value: 2 },
    //     ],
    //   },
    // },
    // {
    //   field: 'ctpl-address',
    //   component: 'Input',
    //   label: '',
    //   defaultValue: showDef ? f?.['ctpl_address'] : undefined,
    //   required: ({ values }) => {
    //     return values.address === 2;
    //   },
    //   ifShow: ({ values }) => {
    //     return values.address === 2;
    //   },
    //   dynamicDisabled,
    // },
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
            formatText = '成人团课';
            break;
          case 'teengroup':
            formatText = '青少年团课';
            break;
          case 'trialgroup':
            formatText = '体验团课';
            break;
          case 'open':
            formatText = '公开课';
            break;
          case 'privatelv1':
            formatText = '成人中级私教';
            break;
          case 'privatelv2':
            formatText = '成人高级私教';
            break;
          case 'trialprivate':
            formatText = '私教体验课';
            break;
          case 'teenprivatelv1':
            formatText = '青少年中级私教';
            break;
          case 'teenprivatelv2':
            formatText = '青少年高级私教';
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

export function getFormSchema1(
  data,
  getFieldsValue: Function | undefined = undefined,
): FormSchema[] {
  const { type, formData: fd, templeteData: td, calendar: c } = data || {};
  const dynamicDisabled = type === 'view';
  const isNeedFillTemplete = td !== undefined;
  const showDef = type === 'edit' || type === 'view' || isNeedFillTemplete;
  const f = isNeedFillTemplete ? td : fd;

  // const address = !f?.['address'] || f?.['address'] === 'Mellow Climbing Gym' ? 1 : 2;

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

  const start = startDate?.format('YYYY-MM-DD HH:mm') || '';
  const end = endDate?.format('YYYY-MM-DD HH:mm') || '';
  const ret: FormSchema[] = [
    {
      field: 'course_templete_id',
      component: 'ApiSelect',
      label: '课程名称',
      defaultValue: showDef ? f?.['display_name'] : undefined,
      dynamicDisabled,
      slot: 'course_name',
      rules: [
        {
          required: true,
          trigger: 'blur',
        },
      ],
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
      rules: [
        {
          required: true,
          trigger: 'blur',
          type: 'integer',
        },
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },

    {
      field: 'course-max-attenders',
      component: 'InputNumber',
      label: '人数上限',
      defaultValue: showDef ? f?.['max_attenders'] : undefined,
      required: true,
      dynamicDisabled,
      rules: [
        {
          required: true,
          trigger: 'blur',
          type: 'integer',
        },
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
        {
          validator: (_, val) => {
            let min = f?.['min_attenders'] || 0;
            if (getFieldsValue) {
              const fieldsValue = getFieldsValue();
              min = fieldsValue?.['course-min-attenders'] || 0;
            }
            if (min > val) {
              return Promise.reject('人数下限不能大于人数上限');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'course-cancel-if-not-enough-attenders-hours',
      component: 'InputNumber',
      label: '开课确认时间',
      defaultValue: showDef ? f?.['cancel_if_not_enough_attenders_hours'] : undefined,
      dynamicDisabled,
      componentProps: {
        placeholder: '开课前几小时确认报名人数，若不足下限则取消',
      },
      rules: [
        {
          required: true,
          type: 'integer',
        },
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
    {
      field: 'course-no-cancel-reserve-hours',
      component: 'InputNumber',
      label: '取消时间限制',
      defaultValue: showDef ? f?.['no_cancel_reserve_hours'] : undefined,
      required: true,
      dynamicDisabled,
      componentProps: {
        placeholder: '开课前几小时不允许取消报名',
      },
      rules: [
        {
          required: true,
          type: 'integer',
        },
        {
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
    {
      field: 'course-description',
      component: 'InputTextArea',
      label: '课程描述',
      defaultValue: showDef ? f?.['description'] : undefined,
      // required: true,
      dynamicDisabled,
      componentProps: {
        rows: 4,
      },
    },
    // {
    //   field: 'address',
    //   component: 'RadioGroup',
    //   label: '地点',
    //   defaultValue: showDef ? address : undefined,
    //   componentProps: {
    //     options: [
    //       { label: '岩馆地址', value: 1 },
    //       { label: '其他地址', value: 2 },
    //     ],
    //   },
    // },
    // {
    //   field: 'course-address',
    //   component: 'Input',
    //   label: '',
    //   defaultValue: showDef ? f?.['address'] : undefined,
    //   required: ({ values }) => {
    //     return values.address === 2;
    //   },
    //   ifShow: ({ values }) => {
    //     return values.address === 2;
    //   },
    //   dynamicDisabled,
    // },
  ];

  const rangePicker = ret.find((item) => item.field === '[course-start-time, endDateTime]');

  if (rangePicker && start && end) {
    rangePicker.defaultValue = [start, end];
  }
  return ret;
}
