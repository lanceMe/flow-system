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
        field: `cardcat-type`,
        component: 'Select',
        colProps: { xl: 6, xxl: 6 },
        componentProps: {
          placeholder: '卡别',
          options: [
            { label: '团课', value: 'group', key: 'group' },
            { label: '私教课', value: 'privatelv1,privatelv2', key: 'privatelv1,privatelv2' },
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
      title: '课程卡',
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
      title: '最近上课',
      width: 150,
      // sorter: true,
      dataIndex: 'wxuser_last_checkin_course_at',
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
