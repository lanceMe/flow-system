import { FormSchema } from '/@/components/Form';
import { getCardList } from '/@/api/cards';

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
            const {
              name,
              type,
              class: clasic,
              max_consume_times,
              max_expire_days,
              price,
            } = card || {};
            let localType: string = type;
            if (type === 'daypass' && clasic === 'time') localType = 'daypass1';
            const typeStr = `${CardType[localType]},`;
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
  ];
}

export function getRenewSchema(data): FormSchema[] {
  const { type, formData: f, userData: d } = data || {};
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
      // required: true,
      componentProps: {
        // placeholder: '扣费天数',
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      field: 'max_consume_times',
      component: 'InputNumber',
      label: '续卡次数',
      // required: true,
      componentProps: {
        // placeholder: '',
      },
      // rules: [
      //   {
      //     required: true,
      //     pattern: /^[1-9]\d*$/,
      //     message: '请输入大于0的整数',
      //   },
      // ],
    },
  ];
}
export function getDeductSchema(data): FormSchema[] {
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
      field: 'expire_date',
      component: 'DatePicker',
      label: '扣费时长',
      // required: true,
      componentProps: {
        format: 'YYYY-MM-DD HH:mm',
      },
    },
    {
      field: 'max_consume_times',
      component: 'InputNumber',
      label: '扣费次数',
      required: true,
      componentProps: {
        // placeholder: '',
      },
      // rules: [
      //   {
      //     required: true,
      //     pattern: /^[1-9]\d*$/,
      //     message: '请输入大于0的整数',
      //   },
      // ],
    },
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
      field: 'renewDuration',
      component: 'InputNumber',
      label: '停卡时长',
      required: true,
      componentProps: {
        placeholder: '',
      },
      rules: [
        {
          required: true,
          pattern: /^[1-9]\d*$/,
          message: '请输入大于0的整数',
        },
      ],
    },
  ];
}
