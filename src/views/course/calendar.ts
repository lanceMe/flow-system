import type { Ref } from 'vue';
import { tryOnUnmounted, useDebounceFn } from '@vueuse/core';
import { unref, nextTick, watch, computed, ref } from 'vue';
import { useEventListener } from '/@/hooks/event/useEventListener';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

import { Calendar, CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

export function useCalendar(elRef: Ref<HTMLDivElement>, options?: CalendarOptions) {
  const { getDarkMode: getSysDarkMode } = useRootSetting();
  let instance: Calendar | null = null;

  const cacheOptions = ref({}) as Ref<CalendarOptions>;

  let resizeFn: Fn = resize;
  let removeResizeFn: Fn = () => {};
  resizeFn = useDebounceFn(resize, 200);
  const defaultOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek',
    },
  };
  const opt = options || defaultOptions;

  function register() {
    console.log(elRef, 13123213123);
    const el = unref(elRef);
    if (!el || !unref(el)) {
      return;
    }
    console.log(elRef, el, 1231);
    instance = new Calendar(el, opt);
    const { removeEvent } = useEventListener({
      el: window,
      name: 'resize',
      listener: resizeFn,
    });
    removeResizeFn = removeEvent;
    return instance;
  }

  function setOptions(options: CalendarOptions, clear = true) {
    cacheOptions.value = options;
  }

  function resize() {}

  tryOnUnmounted(() => {
    if (!instance) return;
    removeResizeFn();
    instance.destroy();
    instance = null;
  });

  function getInstance(): Calendar | null {
    if (!instance) {
      register();
    }
    return instance;
  }

  return {
    register,
    setOptions,
    resize,
    getInstance,
  };
}
