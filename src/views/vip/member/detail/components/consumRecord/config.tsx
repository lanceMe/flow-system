import { BasicColumn } from '/@/components/Table/src/types/table';
import { formatToDateTime } from '/@/utils/dateUtil';
import dayjs from 'dayjs';

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
      title: '消费记录',
      dataIndex: 'cardins_expire_date',
      format(text, { cardcat_class: type1, cardins_max_consume_times, cardins_consume_times }) {
        if (type1 === 'bundle') {
          if (!cardins_max_consume_times || !cardins_max_consume_times) return '--';
          if (cardins_max_consume_times === 'NULL') return '无限次';
          return `${Math.max(0, cardins_max_consume_times - cardins_consume_times)}次`;
        } else if (type1 === 'time') {
          if (!text) return '--';
          const now = dayjs().format('YYYY-MM-DD');
          const leftDays = dayjs(text).diff(now, 'day');
          return `${leftDays}天`;
        }
        return text || '--';
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

export function getTableColumns1(): BasicColumn[] {
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
      title: '消费记录',
      dataIndex: 'record_diff',
      format(text, { cardcat_class: type1 }) {
        if (!text) return '--';
        if (type1 === 'bundle') {
          return `${text}次`;
        } else if (type1 === 'time') {
          return `${text}天`;
        }
        return text;
      },
      width: 50,
    },
    {
      title: '余额',
      dataIndex: 'record_remain',
      format(text, { cardcat_class: type1 }) {
        if (!text) return '--';
        if (type1 === 'bundle') {
          return Number(text) >= 0 ? `+${text}次` : `${text}次`;
        } else if (type1 === 'time') {
          return Number(text) >= 0 ? `+${text}天` : `${text}天`;
        }
        return text;
      },
      width: 50,
    },
    {
      title: '金额',
      width: 150,
      dataIndex: 'record_price',
      format(text) {
        return text || '';
      },
    },
    {
      title: '消费方法',
      width: 150,
      dataIndex: 'record_action',
      format(type) {
        let formatText = type || '--';
        switch (type) {
          case 'wxpay':
            formatText = '小程序购买';
            break;
          case 'manual_new':
            formatText = '后台绑卡';
            break;

          case 'manual_modify_max_times':
            formatText = '后台划卡/延卡次数';
            break;
          case 'manual_modify_expire_date':
            formatText = '后台划卡/延卡过期时间';
            break;
          case 'checkin_daypass':
            formatText = '签到（daypass扫码签到+后台签到）';
            break;
          case 'cancel_checkin_daypass':
            formatText = '取消签到';
            break;
          case 'reserve_or_wait_course':
            formatText = '课程卡预约/候补';
            break;
          case 'cancel_reserve_or_wait_course':
            formatText = '课程卡取消预约/候补';
            break;
          case 'suspend':
            formatText = '后台停卡';
            break;

          case 'resume':
            formatText = '后台停卡恢复';
            break;
          case 'disable':
            formatText = '后台作废卡(不可逆转)';
            break;
          default:
            break;
        }

        return formatText;
      },
    },
    {
      title: '消费时间',
      width: 150,
      dataIndex: 'record_time',
      format(text) {
        if (text) return formatToDateTime(text);
        return text || '--';
      },
    },
  ];
}
