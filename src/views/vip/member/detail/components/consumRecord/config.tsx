import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '会员卡',
      width: 150,
      dataIndex: 'cardcat_name',
      format(text) {
        return text || '--';
      },
    },
    {
      title: '卡种',
      dataIndex: 'cardcat_type',
      format(type, { cardcat_class: type1 }) {
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
      title: '余额',
      dataIndex: 'cardins_consume_times',
      format(text, { cardcat_class: type1, cardcat_max_consume_times, cardins_consume_times }) {
        if (type1 === 'bundle') {
          if (cardcat_max_consume_times === 'NULL') return '无限次';
          return `${Math.max(0, cardcat_max_consume_times - cardins_consume_times)}次`;
        }
        return '--';
      },
      width: 50,
    },

    {
      title: '购买时间',
      width: 150,
      dataIndex: 'cardins_created_at',
      format(text) {
        if (text) return formatToDateTime(text);
        return text;
      },
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'cardins_status',
    },
  ];
}
