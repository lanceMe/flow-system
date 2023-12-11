import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDate } from '/@/utils/dateUtil';
// import { getTagList, getCoachList } from '/@/api/course';
import dayjs from 'dayjs';
// import { getCardList } from '/@/api/cards';

export function getFormSchema(data): FormSchema[] {
  const { type, formData: f } = data || {};
  const dynamicDisabled = type === 'view';
  const showDef = type !== 'create';
  return [
    {
      field: 'cardins-name',
      component: 'Input',
      label: '会员卡名称',
      required: true,
      defaultValue: showDef ? f?.['name'] : undefined,
      dynamicDisabled,
    },
    {
      field: 'cardins-type',
      component: 'Select',
      label: '卡种',
      defaultValue: showDef ? f?.['type'] : undefined,
      required: true,
      dynamicDisabled,
      componentProps: {
        options: [
          { label: '课程卡-中级私教', value: 'privatelv1', key: 'privatelv1' },
          { label: '课程卡-高级私教', value: 'privatelv2', key: 'privatelv2' },
          { label: '课程卡-团课', value: 'group', key: 'group' },
          { label: 'Daypass-次数卡', value: 'daypass1', key: 'daypass1' },
          { label: 'Daypass-时间卡', value: 'daypass2', key: 'daypass2' },
        ],
      },
    },
    {
      field: 'sell-channel',
      component: 'Select',
      label: '售卖渠道',
      defaultValue: showDef ? f?.['sell_channel'] : undefined,
      required: true,
      dynamicDisabled,
      componentProps: {
        options: [
          { label: '小程序', value: 'mini', key: 'mini' },
          { label: '后台', value: 'backend', key: 'backend' },
        ],
      },
    },
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

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `name`,
        component: 'Input',
        componentProps: { placeholder: '会员卡名称' },
        colProps: { xl: 6, xxl: 6 },
      },
      {
        field: `type`,
        component: 'Select',
        colProps: { xl: 6, xxl: 6 },
        componentProps: {
          placeholder: '卡种',
          options: [
            { label: '课程卡-中级私教', value: 'privatelv1', key: 'privatelv1' },
            { label: '课程卡-高级私教', value: 'privatelv2', key: 'privatelv2' },
            { label: '课程卡-团课', value: 'group', key: 'group' },
            { label: 'Daypass-次数卡', value: 'daypass1', key: 'daypass1' },
            { label: 'Daypass-时间卡', value: 'daypass2', key: 'daypass2' },
          ],
        },
      },
      {
        field: `channel`,
        component: 'Select',
        componentProps: {
          placeholder: '售卖渠道',
          options: [
            { label: '小程序', value: 'wx', key: 'wx' },
            { label: '后台', value: 'manual', key: 'manual' },
          ],
        },
        colProps: { xl: 6, xxl: 6 },
      },
    ],
  };
}
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '会员卡名称',
      dataIndex: 'name',
      // fixed: 'left',
      width: 200,
    },
    {
      title: '卡种',
      dataIndex: 'type',
      format(type, { class: type1 }) {
        let formatText = type;
        switch (type) {
          case 'privatelv1':
            formatText = '课程卡-中级私教';
            break;
          case 'privatelv2':
            formatText = '课程卡-高级私教';
            break;
          case 'group':
            formatText = '课程卡-团课';
            break;
          case 'daypass':
            if (type1 === 'bundle') formatText = 'Daypass-次数卡';
            else formatText = 'Daypass-时间卡';

            break;
          default:
            break;
        }

        return formatText;
      },
      width: 150,
    },
    {
      title: '售卖渠道',
      width: 100,
      dataIndex: 'channel',
      format(type) {
        let formatText = type;
        switch (type) {
          case 'wx':
            formatText = '小程序';
            break;
          case 'manual':
            formatText = '后台';
            break;

          default:
            break;
        }
        return formatText;
      },
    },
    {
      title: '创建日期',
      width: 150,
      dataIndex: 'created_at',
      format(text) {
        if (text) return formatToDate(text);
        return text;
      },
    },
    {
      title: '创建人',
      width: 150,
      dataIndex: 'created_by',
      format(name) {
        return name || '--';
      },
    },
  ];
}
