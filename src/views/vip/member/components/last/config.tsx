import { FormProps } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';

export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: `phone-number`,
        component: 'Input',
        componentProps: { placeholder: '手机号' },
        colProps: { xl: 6, xxl: 6 },
      },
      {
        field: `cardcat-class`,
        component: 'Select',
        colProps: { xl: 6, xxl: 6 },
        componentProps: {
          placeholder: '卡别',
          options: [
            { label: '次数卡', value: 'bundle', key: 'bundle' },
            { label: '时间卡', value: 'time', key: 'time' },
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
      dataIndex: 'wxuser_nickname',
      // fixed: 'left',
      width: 200,
      align: 'left',
    },
    {
      title: '性别',
      dataIndex: 'wxuser_gender',
      // fixed: 'left',
      width: 50,
      format(text) {
        return text || '--';
      },
    },
    {
      title: '手机号',
      dataIndex: 'wxuser_phone_number',
      // fixed: 'left',
      width: 120,
    },
    {
      title: '会员卡',
      dataIndex: 'cardcat_name',
      // fixed: 'left',
      width: 150,
      format(text) {
        return text || '--';
      },
    },
    {
      title: '抱石水平',
      width: 100,
      dataIndex: 'wxuser_bouldering_grade',
      format(text) {
        return text || '--';
      },
    },
    {
      title: '最近到店',
      width: 150,
      // sorter: true,
      dataIndex: 'wxuser_last_checkin_daypass_at',
      format(text) {
        if (text) return formatToDateTime(text);
        return text || '--';
      },
    },
    {
      title: '注册时间',
      width: 150,
      // sorter: true,
      dataIndex: 'wxuser_created_at',
      format(text) {
        if (text) return formatToDateTime(text);
        return text || '--';
      },
    },
    {
      title: '用户备注',
      width: 150,
      align: 'left',
      // sorter: true,
      dataIndex: 'wxuser_remarks',
      format(text) {
        // if (text) return formatToDateTime(text);
        return text || '--';
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
