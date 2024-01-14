import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '上课时间',
      width: 150,
      dataIndex: 'course_start_time',
      format(text) {
        if (text) return formatToDateTime(text);
        return text;
      },
    },
    {
      title: '课程',
      dataIndex: 'course_display_name',
      format(text) {
        return text || '--';
      },
      width: 150,
    },
    {
      title: '教练',
      dataIndex: 'coach_nickname',
      // fixed: 'left',
      width: 100,
      format(text) {
        return text || '--';
      },
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
      title: '人数',
      width: 50,
      dataIndex: 'number',
      format(text) {
        return text || '--';
      },
    },
    {
      title: '预约时间',
      width: 150,
      dataIndex: 'attend_at',
      format(text) {
        if (text) return formatToDateTime(text);
        return text;
      },
    },
    {
      title: '预约状态',
      width: 100,
      dataIndex: 'attend_status',
      format(status) {
        let formatText = status;
        switch (status) {
          case 'reserved':
            formatText = '已预约';
            break;
          case 'checkedin':
            formatText = '已签到';
            break;
          default:
            formatText = '已取消';
            break;
        }

        return formatText;
      },
    },
    {
      title: '卡种',
      dataIndex: 'cardcat_type',
      format(type, { cardcat_class: type1 }) {
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
      title: '预约方式',
      width: 100,
      dataIndex: 'attend_channel',
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
      dataIndex: 'attend_remarks',
      format(text) {
        return text || '--';
      },
    },
  ];
}
