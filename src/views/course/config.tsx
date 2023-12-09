import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDate } from '/@/utils/dateUtil';
import { getTagList } from '/@/api/course';
import { getCardList } from '/@/api/cards';

export function getFormSchema(data): FormSchema[] {
  const { type, formData: f } = data || {};

  const dynamicDisabled = type === 'view';
  return [
    {
      field: 'ctpl-display-name',
      component: 'Input',
      label: '课程名称',
      required: true,
      defaultValue: f?.['ctpl_display_name'],
      dynamicDisabled,
    },
    {
      field: 'ctpl-type',
      component: 'Select',
      label: '课程类别',
      defaultValue: f?.['ctpl_type'],
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
      defaultValue: f?.['ctpl_tag'],
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
      defaultValue: f?.['ctpl_min_attenders'],
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
      defaultValue: f?.['ctpl_price'],
      // required: true,
      dynamicDisabled,
    },
    {
      field: 'ctpl-duration-minutes',
      component: 'InputNumber',
      label: '课程时长',
      defaultValue: f?.['ctpl_duration_minutes'],
      required: true,
      dynamicDisabled,
    },
    {
      field: 'ctpl-cancel-waiting-minutes',
      component: 'InputNumber',
      label: '候补时间限制',
      defaultValue: f?.['ctpl_cancel_waiting_minutes'],
      required: true,
      dynamicDisabled,
    },
    {
      field: 'ctpl-description',
      component: 'Input',
      label: '课程介绍',
      defaultValue: f?.['ctpl_description'],
      // required: true,
      dynamicDisabled,
    },
    {
      field: 'address',
      component: 'RadioGroup',
      label: '地点',
      defaultValue: f?.['ctpl_address'] === 'Mellow Climbing Gym' ? 1 : 2,
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
      defaultValue: f?.['ctpl_address'],
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
