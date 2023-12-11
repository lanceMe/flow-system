import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';
import dayjs from 'dayjs';

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `name`,
        component: 'Input',
        componentProps: { placeholder: '手机号' },
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
    ],
  };
}
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '昵称',
      dataIndex: 'name',
      // fixed: 'left',
      width: 150,
    },
    {
      title: '性别',
      dataIndex: 'name',
      // fixed: 'left',
      width: 100,
    },
    {
      title: '会员卡',
      dataIndex: 'name',
      // fixed: 'left',
      width: 150,
    },
    // {
    //   title: '卡种',
    //   dataIndex: 'type',
    //   format(type, { class: type1 }) {
    //     let formatText = type;
    //     switch (type) {
    //       case 'privatelv1':
    //         formatText = '课程卡-中级私教';
    //         break;
    //       case 'privatelv2':
    //         formatText = '课程卡-高级私教';
    //         break;
    //       case 'group':
    //         formatText = '课程卡-团课';
    //         break;
    //       case 'daypass':
    //         if (type1 === 'bundle') formatText = 'Daypass-次数卡';
    //         else formatText = 'Daypass-时间卡';

    //         break;
    //       default:
    //         break;
    //     }

    //     return formatText;
    //   },
    //   width: 150,
    // },
    {
      title: '抱石水平',
      width: 100,
      dataIndex: 'type',
      format() {
        return '--';
      },
    },
    {
      title: '最近到店',
      width: 150,
      dataIndex: 'created_at',
      format(text) {
        if (text) return formatToDateTime(text);
        return text;
      },
    },
    {
      title: '注册时间',
      width: 150,
      dataIndex: 'created_at',
      format(text) {
        if (text) return formatToDateTime(text);
        return text;
      },
    },
    // {
    //   title: '创建人',
    //   width: 150,
    //   dataIndex: 'created_by',
    //   format(name) {
    //     return name || '--';
    //   },
    // },
  ];
}
