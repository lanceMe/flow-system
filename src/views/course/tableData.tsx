import { BasicColumn } from '/@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '课程名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 200,
    },
    {
      title: '课程类别',
      dataIndex: 'type',
      width: 150,
    },
    {
      title: '课程种类',
      dataIndex: 'species',
    },
    {
      title: '人数下限',
      dataIndex: 'miniPeople',
      width: 150,
    },
    {
      title: '人数上限',
      width: 150,
      dataIndex: 'maxPeople',
    },
    {
      title: '预约方式',
      width: 150,
      dataIndex: 'reservation',
    },
    {
      title: '卡种',
      width: 150,
      dataIndex: 'cardType',
    },
    {
      title: '课程价格',
      width: 150,
      dataIndex: 'price',
    },
    {
      title: '课程时长',
      width: 150,
      dataIndex: 'courseTime',
    },
    {
      title: '是否允许候补',
      width: 150,
      dataIndex: 'isAlternate',
    },
    {
      title: '候补时间限制',
      width: 150,
      dataIndex: 'alternateTime',
    },
    {
      title: '课程介绍',
      width: 150,
      dataIndex: 'description',
    },
    {
      title: '地点',
      width: 150,
      dataIndex: 'address',
    },
    {
      width: 160,
      title: '操作',
      align: 'center',
      slots: { default: 'action' },
      fixed: 'right',
    },
  ];
}

export function getMergeHeaderColumns(): BasicColumn[] {
  return [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 300,
      customCell: (_, index) => ({
        colSpan: index === 9 ? 6 : 1,
      }),
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 300,
      customCell: cellContent,
    },
    {
      title: '地址',
      dataIndex: 'address',
      colSpan: 2,
      width: 120,
      sorter: true,
      customCell: (_, index) => ({
        rowSpan: index === 2 ? 2 : 1,
        colSpan: index === 3 || index === 9 ? 0 : 1,
      }),
    },
    {
      title: '编号',
      dataIndex: 'no',
      colSpan: 0,
      filters: [
        { text: 'Male', value: 'male', children: [] },
        { text: 'Female', value: 'female', children: [] },
      ],
      customCell: cellContent,
    },
    {
      title: '开始时间',
      dataIndex: 'beginTime',
      width: 200,
      customCell: cellContent,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
      customCell: cellContent,
    },
  ];
}

export function getBasicData() {
  return (() => {
    const arr: any = [];
    for (let index = 0; index < 40; index++) {
      arr.push({
        id: `${index}`,
        name: 'John Brown',
        age: `1${index}`,
        no: `${index + 10}`,
        address: 'New York No. 1 Lake ParkNew York No. 1 Lake Park',
        beginTime: new Date().toLocaleString(),
        endTime: new Date().toLocaleString(),
      });
    }
    return arr;
  })();
}
