import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table/src/types/table';

export function getFormSchema(): FormSchema[] {
  return [
    {
      field: 'display_name',
      component: 'Input',
      label: '课程名称',
      required: true,
    },
    {
      field: 'type',
      component: 'Select',
      label: '课程类别',
      required: true,
    },
    {
      field: 'sub_type',
      component: 'Select',
      label: '课程种类',
      required: true,
    },
    {
      field: 'sub_type',
      component: 'Select',
      label: '课程种类',
      required: true,
    },
    {
      field: 'min_attenders',
      component: 'InputNumber',
      label: '人数下限',
      // defaultValue: 3,
      required: true,
    },
    {
      field: 'max_attenders',
      component: 'InputNumber',
      label: '人数下限',
      // defaultValue: 20,
      required: true,
    },
    {
      field: 'reserve_type',
      component: 'Select',
      label: '预约方式',
      required: true,
    },
    {
      field: 'card_type',
      component: 'Select',
      label: '卡种',
      // required: true,
    },
    {
      field: 'price',
      component: 'InputNumber',
      label: '课程价格',
      // defaultValue: 20,
      required: true,
    },
    {
      field: 'max_attenders',
      component: 'InputNumber',
      label: '课程时长',
      // defaultValue: 20,
      required: true,
    },
    {
      field: 'wait_time',
      component: 'InputNumber',
      label: '候补时间限制',
      // defaultValue: 20,
      required: true,
    },
    {
      field: 'description',
      component: 'Input',
      label: '课程介绍',
      required: true,
    },
    {
      field: 'address',
      component: 'Input',
      label: '地点',
      required: true,
    },
  ];
}

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '课程名称',
      dataIndex: 'name',
      // fixed: 'left',
      width: 200,
    },
    {
      title: '课程类别',
      dataIndex: 'type',
      width: 150,
    },
    {
      title: '人数上限',
      width: 100,
      dataIndex: 'maxPeople',
    },
    {
      title: '创建日期',
      width: 150,
      dataIndex: 'reservation',
    },
    {
      title: '创建人',
      width: 150,
      dataIndex: 'cardType',
    },
  ];
}
