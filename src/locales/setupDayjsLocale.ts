import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import 'dayjs/locale/zh-cn';

export function setupDayjsLocale() {
  dayjs.extend(updateLocale);
  dayjs.updateLocale('zh-cn', {
    weekStart: 1,
  });
}
