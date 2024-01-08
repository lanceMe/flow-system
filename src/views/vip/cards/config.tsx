import { getTagList } from '/@/api/course';
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
      label: '卡名',
      required: true,
      defaultValue: showDef ? f?.['name'] : undefined,
      dynamicDisabled,
    },
    {
      field: `channel`,
      component: 'Select',
      label: '售卖渠道',
      required: true,
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      componentProps: {
        // placeholder: '售卖渠道',
        options: [
          { label: '小程序', value: 'wx', key: 'wx' },
          { label: '后台', value: 'manual', key: 'manual' },
        ],
      },
      // colProps: { xl: 6, xxl: 6 },
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
          { label: '成人中级私教', value: 'privatelv1', key: 'privatelv1' },
          { label: '成人高级私教', value: 'privatelv2', key: 'privatelv2' },
          { label: '私教体验课', value: 'trialprivate', key: 'trialprivate' },
          { label: '青少年中级私教', value: 'teenprivatelv1', key: 'teenprivatelv1' },
          { label: '青少年高级私教', value: 'teenprivatelv2', key: 'teenprivatelv2' },
          { label: '成人团课', value: 'group', key: 'group' },
          { label: '青少年团课', value: 'teengroup', key: 'teengroup' },
          { label: '体验团课', value: 'trialgroup', key: 'trialgroup' },
          { label: 'Daypass', value: 'daypass', key: 'daypass' },
        ],
      },
    },
    {
      field: `subType`,
      component: 'Select',
      label: '二级卡种',
      required: true,
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      componentProps: {
        // placeholder: '二级卡种',
        options: [
          { label: '时间卡', value: 'time', key: 'time' },
          { label: '次数卡', value: 'bundle', key: 'bundle' },
        ],
      },
    },
    {
      field: 'checkin-remarks',
      component: 'InputTextArea',
      required: true,
      label: '使用规则',
      colProps: { span: 24 },
    },
    {
      field: 'ctpl-min-attenders',
      component: 'InputNumber',
      label: '最大可使用次数',
      defaultValue: showDef ? f?.['ctpl_min_attenders'] : undefined,
      dynamicDisabled,
      rules: [
        {
          required: false,
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },

    {
      field: 'ctpl-min-attenders1',
      component: 'InputNumber',
      label: '最大可使用天数',
      defaultValue: showDef ? f?.['ctpl_min_attenders'] : undefined,
      dynamicDisabled,
      rules: [
        {
          required: false,
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
    {
      field: `subType1`,
      component: 'Select',
      label: '是否可售总开关',
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      colProps: { span: 24 },
      required: true,
      componentProps: {
        placeholder: '',
        options: [
          { label: '是', value: true, key: 'yes' },
          { label: '否', value: false, key: 'no' },
        ],
      },
    },
    {
      field: 'expire_date1',
      component: 'DatePicker',
      label: '预约上架时间',
      componentProps: {
        // placeholder: '扣费天数',
        showTime: true,
        // format: 'YYYY-MM-DD ',
        // valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      field: 'expire_date',
      component: 'DatePicker',
      label: '预约下架时间',
      componentProps: {
        // placeholder: '扣费天数',
        showTime: true,
        // format: 'YYYY-MM-DD',
        // valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      field: 'ctpl-price',
      component: 'InputNumber',
      label: '购买价',
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      required: true,
      dynamicDisabled,
      rules: [
        {
          validator: (_, val) => {
            if (val < 0) {
              return Promise.reject('价格不能小于0');
            }
            return Promise.resolve();
          },
        },
      ],
    },

    {
      field: 'ctpl-price1',
      component: 'InputNumber',
      label: '划线价',
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      required: false,
      dynamicDisabled,
      rules: [
        {
          validator: (_, val) => {
            if (val < 0) {
              return Promise.reject('价格不能小于0');
            }
            return Promise.resolve();
          },
        },
      ],
    },

    {
      field: 'ctpl-price3',
      component: 'InputNumber',
      label: '续卡价',
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      required: false,
      dynamicDisabled,
      rules: [
        {
          validator: (_, val) => {
            if (val < 0) {
              return Promise.reject('价格不能小于0');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      field: 'ctpl-min-attenders3',
      component: 'InputNumber',
      label: '最大可购买次数',
      defaultValue: showDef ? f?.['ctpl_min_attenders'] : undefined,
      dynamicDisabled,
      rules: [
        {
          required: false,
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
    {
      field: `subType2`,
      component: 'Select',
      label: '小程序：是否置顶',
      required: true,
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      componentProps: {
        placeholder: '',
        options: [
          { label: '是', value: true, key: 'yes' },
          { label: '否', value: false, key: 'no' },
        ],
      },
    },

    {
      field: `display_bgstyle`,
      component: 'Select',
      label: '小程序：卡面背景图',
      required: true,
      defaultValue: showDef ? f?.['ctpl_price'] : undefined,
      componentProps: {
        placeholder: '',
        options: [
          { label: '粉色', value: true, key: 'pink' },
          { label: '棕色', value: false, key: 'brown' },
          { label: '浅色', value: true, key: 'lightgreen' },
          { label: '深绿', value: false, key: 'deepgreen' },
        ],
      },
    },

    {
      field: 'ctpl-tag',
      component: 'ApiSelect',
      label: '小程序：顶部主标题',
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
      field: 'ctpl-tag1',
      component: 'ApiSelect',
      label: '小程序：顶部副标题',
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
      field: 'ctpl-tag2',
      component: 'ApiSelect',
      label: '小程序：卡面徽章',
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
      field: 'ctpl-description',
      component: 'Input',
      label: '小程序：底部文案',
      defaultValue: showDef ? f?.['ctpl_description'] : undefined,
      // required: true,
      dynamicDisabled,
    },
  ];
}

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      // {
      //   field: `name`,
      //   component: 'Input',
      //   componentProps: { placeholder: '会员卡名称' },
      //   colProps: { xl: 6, xxl: 6 },
      // },
      {
        field: `type`,
        component: 'Select',
        colProps: { xl: 6, xxl: 6 },
        componentProps: {
          placeholder: '卡种',
          options: [
            { label: '成人中级私教', value: 'privatelv1', key: 'privatelv1' },
            { label: '成人高级私教', value: 'privatelv2', key: 'privatelv2' },
            { label: '私教体验课', value: 'trialprivate', key: 'trialprivate' },
            { label: '青少年中级私教', value: 'teenprivatelv1', key: 'teenprivatelv1' },
            { label: '青少年高级私教', value: 'teenprivatelv2', key: 'teenprivatelv2' },
            { label: '成人团课', value: 'group', key: 'group' },
            { label: '青少年团课', value: 'teengroup', key: 'teengroup' },
            { label: '体验团课', value: 'trialgroup', key: 'trialgroup' },
            { label: 'Daypass', value: 'daypass', key: 'daypass' },
          ],
        },
      },
      {
        field: `subType`,
        component: 'Select',
        colProps: { xl: 6, xxl: 6 },
        componentProps: {
          placeholder: '二级卡种',
          options: [
            { label: '时间卡', value: 'time', key: 'time' },
            { label: '次数卡', value: 'bundle', key: 'bundle' },
          ],
        },
      },
      // {
      //   field: `channel`,
      //   component: 'Select',
      //   componentProps: {
      //     placeholder: '售卖渠道',
      //     options: [
      //       { label: '小程序', value: 'wx', key: 'wx' },
      //       { label: '后台', value: 'manual', key: 'manual' },
      //     ],
      //   },
      //   colProps: { xl: 6, xxl: 6 },
      // },
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
          case 'group':
            formatText = '成人团课';
            break;
          case 'teengroup':
            formatText = '青少年团课';
            break;
          case 'trialgroup':
            formatText = '体验团课';
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
      sorter: true,
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
