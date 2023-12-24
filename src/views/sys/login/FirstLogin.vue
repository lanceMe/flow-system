<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="首次登录，请修改密码"
    @visible-change="handleVisibleChange"
    width="600px"
    @ok="handlesubmit"
  >
    <div :class="`${prefixCls}-form pt-3px pr-3px`">
      <BasicForm @register="registerForm" :model="model" />
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { FormSchema } from '/@/components/Form';

  export default defineComponent({
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    emits: ['register', 'submitSuccess'],
    setup(props, { emit }) {
      const modelRef = ref({});

      const titleRef = ref('');
      const { prefixCls } = useDesign('course');
      const schemas: FormSchema[] = [
        {
          field: 'staff-password',
          component: 'InputPassword',
          label: '新密码',
          required: true,
        },
      ];

      const [registerForm, { validate, getFieldsValue }] = useForm({
        // labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        baseColProps: {
          span: 10,
        },
        actionColOptions: {
          span: 24,
        },
      });

      const [register, { closeModal }] = useModalInner((data) => {
        // data && onDataReceive(data);
      });

      function handleVisibleChange(v) {
        // v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      async function handlesubmit() {
        try {
          const values = await validate();
        } catch (error) {
          console.error(error);
        }
      }

      return {
        register,
        schemas,
        registerForm,
        model: modelRef,
        handleVisibleChange,
        handlesubmit,
        title: titleRef,
        prefixCls,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-course-form';
  .@{prefix-cls} {
    &__attenders {
      display: flex;
      align-items: center;

      > div {
        margin: 0 8px;
      }
    }
  }
</style>
