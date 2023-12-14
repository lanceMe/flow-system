import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '到店时间',
      width: 150,
      dataIndex: 'checkin_time',
      format(text) {
        if (text) return formatToDateTime(text);
        return text;
      },
    },
    {
      title: '会员卡',
      dataIndex: 'cardcat_name',
      format(text) {
        return text || '--';
      },
      width: 150,
    },
    {
      title: '人数',
      dataIndex: 'checkin_persons',
      // fixed: 'left',
      width: 50,
      format(text) {
        return text || '--';
      },
    },
    {
      title: '卡种',
      dataIndex: 'cardcat_type',
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
      title: '签到方式',
      width: 100,
      dataIndex: 'checkin_channel',
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
      title: '备注',
      width: 150,
      dataIndex: 'checkin_remarks',
      format(text) {
        return text || '--';
      },
    },
  ];
}
