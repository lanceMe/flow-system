import { FormSchema } from '/@/components/Form';
import { getCardList } from '/@/api/cards';
import { getStaffList } from '/@/api/staff';

const CardType = {
  privatelv1: '私教课',
  privatelv2: '私教课',
  group: '团课',
  daypass: '次数卡',
  daypass1: '时间卡',
};

export function getBindSchema(data): FormSchema[] {
  const { formData: f, userData: d } = data || {};
  return [
    {
      field: 'nickname',
      component: 'Input',
      label: '昵称',
      defaultValue: d?.['nickname'],
      dynamicDisabled: true,
    },

    {
      field: 'cardcat-id',
      component: 'ApiSelect',
      label: '会员卡',
      rules: [
        {
          required: true,
          trigger: 'blur',
        },
      ],
      componentProps: {
        api: getCardList,
        immediate: true,
        labelField: 'showTitle',
        valueField: 'id',
        afterFetchFn: (res: []) => {
          if (!res || res.length < 1) return res;
          for (const card of res) {
            const { name, class: clasic, max_consume_times, max_expire_days, price } = card || {};
            const priceStr = `${price || 0}RMB,`;
            const leftTimesStr = clasic === 'bundle' ? `可用${max_consume_times || '--'}次,` : '';
            const leftDurStr = `${max_expire_days || '--'}天有效期`;

            // @ts-ignore
            card.showTitle = `${name}(${priceStr}${leftTimesStr}${leftDurStr})`;
          }
          return res;
        },
      },
    },
    {
      field: 'cardins-count',
      component: 'InputNumber',
      label: '数量',
      defaultValue: 1,
      componentProps: {
        placeholder: '绑卡数量',
      },
      rules: [
        {
          required: true,
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
    {
      field: 'seller-staff-id',
      component: 'ApiSelect',
      label: '推荐人',

      componentProps: {
        api: getStaffList,
        labelField: 'staff_nickname',
        valueField: 'staff_id',
        placeholder: '推荐人（可选）',
      },
    },
    {
      field: 'checkin-remarks',
      component: 'InputTextArea',
      label: '备注',
    },
  ];
}

export function getRenewSchema(data): FormSchema[] {
  const { type, formData: f, userData: d } = data || {};
  const showTimes = f?.['cardcat_class'] !== 'time';
  return [
    {
      field: 'nickname',
      component: 'Input',
      label: '昵称',
      defaultValue: d?.['nickname'],
      dynamicDisabled: true,
    },
    {
      field: 'cardcat_name',
      component: 'Input',
      label: '会员卡',
      // defaultValue: `${f?.['cardcat_name']} | ${f?.['cardcat_name']}`,
      defaultValue: `${f?.['cardcat_name']}`,
      dynamicDisabled: true,
    },
    {
      field: 'expire_date',
      component: 'DatePicker',
      label: '续卡时长',
      required: true,
      componentProps: {
        // placeholder: '扣费天数',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
    // {
    //   field: 'max_consume_times',
    //   component: 'InputNumber',
    //   label: '续卡次数',
    //   show: showTimes,
    //   // required: true,
    //   componentProps: {
    //     // placeholder: '',
    //   },
    //   // rules: [
    //   //   {
    //   //     required: true,
    //   //     pattern: /^[1-9]\d*$/,
    //   //     message: '请输入大于0的整数',
    //   //   },
    //   // ],
    // },
  ];
}
export function getDeductSchema(data): FormSchema[] {
  const { type, formData: f, userData: d } = data || {};
  const showTimes = f?.['cardcat_class'] !== 'time';
  return [
    {
      field: 'nickname',
      component: 'Input',
      label: '昵称',
      required: true,
      defaultValue: d?.['nickname'],
      dynamicDisabled: true,
    },
    {
      field: 'cardcat_name',
      component: 'Input',
      label: '会员卡',
      required: true,
      // defaultValue: `${f?.['cardcat_name']} | ${f?.['cardcat_name']}`,
      defaultValue: `${f?.['cardcat_name']}`,
      dynamicDisabled: true,
    },
    {
      field: 'expire_date',
      component: 'DatePicker',
      label: '扣费时长',
      required: true,
      componentProps: {
        format: 'YYYY-MM-DD',
      },
    },
    // {
    //   field: 'max_consume_times',
    //   component: 'InputNumber',
    //   label: '扣费次数',
    //   required: true,
    //   show: showTimes,
    //   componentProps: {
    //     // placeholder: '',
    //   },
    //   // rules: [
    //   //   {
    //   //     required: true,
    //   //     pattern: /^[1-9]\d*$/,
    //   //     message: '请输入大于0的整数',
    //   //   },
    //   // ],
    // },
  ];
}
export function getStopSchema(data): FormSchema[] {
  const { type, formData: f, userData: d } = data || {};
  return [
    {
      field: 'nickname',
      component: 'Input',
      label: '昵称',
      required: true,
      defaultValue: d?.['nickname'],
      dynamicDisabled: true,
    },
    {
      field: 'cardcat_name',
      component: 'Input',
      label: '会员卡',
      required: true,
      // defaultValue: `${f?.['cardcat_name']} | ${f?.['cardcat_name']}`,
      defaultValue: `${f?.['cardcat_name']}`,
      dynamicDisabled: true,
    },
    {
      field: 'resume_date',
      component: 'DatePicker',
      label: '停卡时长',
      required: true,
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
    // {
    //   field: 'renewDuration',
    //   component: 'InputNumber',
    //   label: '停卡时长',
    //   required: true,
    //   componentProps: {
    //     placeholder: '',
    //   },
    //   rules: [
    //     {
    //       required: true,
    //       pattern: /^[1-9]\d*$/,
    //       message: '请输入大于0的整数',
    //     },
    //   ],
    // },
  ];
}

export function getOverSchema(data): FormSchema[] {
  const { formData: f, userData: d } = data || {};
  const { phone_number, nickname, remarks } = d;
  const name = `${phone_number}${nickname ? `:${nickname}` : ''}${remarks ? `:${remarks}` : ''}`;
  return [
    {
      field: 'nickname',
      component: 'Input',
      label: '转出用户',
      required: true,
      defaultValue: name,
      dynamicDisabled: true,
    },
    {
      field: 'cardcat_name',
      component: 'Input',
      label: '会员卡',
      required: true,
      // defaultValue: `${f?.['cardcat_name']} | ${f?.['cardcat_name']}`,
      defaultValue: `${f?.['cardcat_name']}`,
      dynamicDisabled: true,
    },
    {
      field: 'nickname1',
      component: 'AutoComplete',
      label: '接收用户',
      required: true,
      defaultValue: d?.['nickname1'],
      componentProps: {},
    },
  ];
}
