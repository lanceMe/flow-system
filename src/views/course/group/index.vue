<template>
  <PageWrapper>
    <div :class="`${prefixCls}__toolbar`">
      <a-button type="primary" @click="createCourse"> 创建课程 </a-button>
      <a-button type="primary" @click="createCourse"> 导入课表 </a-button>
      <a-button type="primary" @click="createCourse"> 发布课程 </a-button>
      <a-button type="primary" @click="createCourse"> 导出课表 </a-button>
    </div>
    <div :class="`${prefixCls}-calendar`" ref="calendarDivRef" :style="{ width, height }"></div>
    <Modal @register="registerModal" />
  </PageWrapper>
</template>

<script lang="ts">
  import { Ref, defineComponent, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useModal } from '/@/components/Modal';
  import Modal from '/@/views/course/detail/index.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useCalendar } from '/@/views/course/calendar';

  export default defineComponent({
    components: { PageWrapper, Modal },
    props: {
      loading: Boolean,
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '300px',
      },
    },
    setup() {
      const { prefixCls } = useDesign('course');

      const [registerModal, { openModal: openModal }] = useModal();

      const calendarDivRef = ref<HTMLDivElement | null>(null);

      const { register } = useCalendar(calendarDivRef as Ref<HTMLDivElement>);

      const calendar = register();

      function handleEdit(event: any) {
        console.log('handleEdit', event);
        openModal(true, { type: 'edit' });
      }

      function handleView(event: any) {
        console.log('handleView', event);
        openModal(true, { type: 'view' });
      }

      function createCourse(event: any) {
        console.log('createCourse', event);
        openModal(true, { type: 'create' });
      }

      return {
        createCourse,
        handleEdit,
        handleView,
        registerModal,
        openModal,
        prefixCls,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-course';

  .@{prefix-cls} {
    &__toolbar {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      > * {
        margin-right: 8px;
      }
    }
  }
</style>
