import { FormProps, FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDate } from '/@/utils/dateUtil';
import dayjs from 'dayjs';

export function getFormSchema(data): FormSchema[] {
  const { type, formData: f } = data || {};
  const dynamicDisabled = type === 'view';
  const showDef = type !== 'create';
  return [
    {
      field: 'cardcat-name',
      component: 'Input',
      label: '卡名',
      required: true,
      defaultValue: showDef ? f?.['name'] : undefined,
      dynamicDisabled,
    },
    {
      field: `cardcat-channel `,
      component: 'Select',
      label: '售卖渠道',
      required: true,
      defaultValue: showDef ? f?.['channel'] : undefined,
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
      field: 'cardcat-type',
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
      field: `cardcat-class`,
      component: 'Select',
      label: '二级卡种',
      required: true,
      defaultValue: showDef ? f?.['class'] : undefined,
      componentProps: {
        // placeholder: '二级卡种',
        options: [
          { label: '时间卡', value: 'time', key: 'time' },
          { label: '次数卡', value: 'bundle', key: 'bundle' },
        ],
      },
    },

    {
      field: 'cardcat-description',
      component: 'InputTextArea',
      defaultValue: showDef ? f?.['description'] : undefined,
      required: true,
      label: '使用规则',
      colProps: { span: 24 },
    },
    {
      field: 'cardcat-max-consume-times',
      component: 'InputNumber',
      label: '最大可使用次数',
      defaultValue: showDef ? f?.['max_consume_times'] : undefined,
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
      field: 'cardcat-max-expire-days',
      component: 'InputNumber',
      label: '最大可使用天数',
      defaultValue: showDef ? f?.['max_expire_days'] : undefined,
      dynamicDisabled,
      rules: [
        {
          required: true,
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
    {
      field: `cardcat-for-sale-enabled`,
      component: 'Select',
      label: '是否可售总开关',
      defaultValue: showDef ? f?.['for_sale_enabled'] : undefined,
      colProps: { span: 24 },
      required: true,
      componentProps: {
        placeholder: '',
        options: [
          { label: '是', value: 1, key: 1 },
          { label: '否', value: 0, key: 0 },
        ],
      },
    },
    {
      field: 'cardcat-for-sale-since',
      component: 'DatePicker',
      label: '预约上架时间',
      defaultValue: showDef ? f?.['for_sale_since'] : undefined,
      componentProps: {
        // placeholder: '扣费天数',
        showTime: ['HH:mm'],
        format: 'YYYY-MM-DD HH:mm',
        // valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      field: 'cardcat-for-sale-until',
      component: 'DatePicker',
      label: '预约下架时间',
      defaultValue: showDef ? f?.['for_sale_until'] : undefined,
      componentProps: {
        // placeholder: '扣费天数',
        showTime: ['HH:mm'],
        format: 'YYYY-MM-DD HH:mm',
        // valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      field: 'cardcat-price',
      component: 'InputNumber',
      label: '购买价',
      defaultValue: showDef ? f?.['price'] : undefined,
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
      field: 'cardcat-display-list-price',
      component: 'InputNumber',
      label: '划线价',
      defaultValue: showDef ? f?.['display_list_price'] : undefined,
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
      field: 'cardcat-rebuy-price',
      component: 'InputNumber',
      label: '续卡价',
      defaultValue: showDef ? f?.['rebuy_price'] : undefined,
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
      field: 'cardcat-max-wxuser-buy-cardins',
      component: 'InputNumber',
      label: '最大可购买次数',
      defaultValue: showDef ? f?.['max_wxuser_buy_cardins'] : undefined,
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
      field: `cardcat-display-ontop`,
      component: 'Select',
      label: '小程序：是否置顶',
      required: true,
      defaultValue: showDef ? f?.['display_ontop'] : undefined,
      componentProps: {
        placeholder: '',
        options: [
          { label: '是', value: 1, key: 1 },
          { label: '否', value: 0, key: 0 },
        ],
      },
    },

    {
      field: `cardcat-display-bgstyle`,
      component: 'Select',
      label: '小程序：卡面背景图',
      required: true,
      defaultValue: showDef ? f?.['display_bgstyle'] : undefined,
      componentProps: {
        // placeholder: '',
        options: [
          { label: '粉色', value: 'pink', key: 'pink' },
          { label: '棕色', value: 'brown', key: 'brown' },
          { label: '浅色', value: 'lightgreen', key: 'lightgreen' },
          { label: '深绿', value: 'deepgreen', key: 'deepgreen' },
        ],
      },
    },
    {
      field: 'cardcat-display-title',
      component: 'Input',
      label: '小程序：顶部主标题',
      required: true,
      defaultValue: showDef ? f?.['display_title'] : undefined,
      dynamicDisabled,
    },
    {
      field: 'cardcat-display-subtitle',
      component: 'Input',
      label: '小程序：顶部副标题',
      required: true,
      defaultValue: showDef ? f?.['display_subtitle'] : undefined,
      dynamicDisabled,
    },
    {
      field: 'cardcat-display-badge',
      component: 'ApiSelect',
      label: '小程序：卡面徽章',
      dynamicDisabled,
      defaultValue: showDef ? f?.['display_badge'] : undefined,
      componentProps: {
        options: [
          { label: '试营业9折', value: 'trial', key: 'trial' },
          { label: '优惠续卡', value: 'discount_rebuy', key: 'discount_rebuy' },
        ],
      },
    },
    {
      field: 'cardcat-display-footnote',
      component: 'Input',
      label: '小程序：底部文案',
      defaultValue: showDef ? f?.['display_footnote'] : undefined,
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
