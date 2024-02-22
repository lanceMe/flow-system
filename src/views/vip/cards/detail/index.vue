<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :title="title"
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
  import { getFormSchema } from '/@/views/vip/cards/config';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { encode } from '/@/utils/base64';
  import { editCard, createCard } from '/@/api/cards';

  export default defineComponent({
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    emits: ['register', 'submitSuccess'],
    setup(props, { emit }) {
      const modelRef = ref({});
      const dataRef = ref({});
      const titleRef = ref('');
      const { prefixCls } = useDesign('course');
      const schemas = getFormSchema(dataRef.value);

      const [registerForm, { updateSchema, validate, resetFields }] = useForm({
        // labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        layout: 'horizontal',
        baseColProps: {
          span: 12,
        },
        actionColOptions: {
          span: 24,
        },
      });

      const [register, { closeModal }] = useModalInner((data) => {
        data && onDataReceive(data);
      });

      function onDataReceive(data) {
        console.log('Data Received', data);

        const { type } = data;
        setType(type);
        setFormData(data);
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      async function handlesubmit() {
        try {
          const values = await validate();
          postApi(values);
        } catch (error) {
          console.error(error);
        }
      }

      function postApi(values) {
        const { formData: data, type } = dataRef.value as any;
        const requestFunc = type === 'create' ? createCard : editCard;
        const params = {
          ...values,
          // 'ctpl-no-cancel-reserve-hours': data?.['ctpl_no_cancel_reserve_hours'] || 60,
          'cardcat-id': data?.['id'],
          'cardcat-name': encode(values['cardcat-name']),
          'cardcat-description': encode(values['cardcat-description']),
          'cardcat-display-title': encode(values['cardcat-display-title']),
          'cardcat-display-subtitle': encode(values['cardcat-display-subtitle']),
          'cardcat-display-footnote': encode(values['cardcat-display-footnote']),
        };
        console.log('postApi', values, data);
        requestFunc(params).then((resp) => {
          console.log(resp, params);
          closeModal();
          emit('submitSuccess');
        });
      }

      function setType(type: string) {
        setTitle(type);
      }

      function setTitle(type: string) {
        switch (type) {
          case 'edit':
            titleRef.value = '编辑卡包';
            break;
          case 'create':
            titleRef.value = '新建卡包';
            break;
          default:
            titleRef.value = '查看卡包';
            break;
        }
      }

      async function setFormData(data) {
        dataRef.value = data;
        const schemas = getFormSchema(data);
        await resetFields();
        nextTick(() => {
          updateSchema(schemas, true);
        });
      }

      return {
        register,
        schemas,
        registerForm,
        model: modelRef,
        handleVisibleChange,
        handlesubmit,
        setTitle,
        title: titleRef,
        prefixCls,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-course-form';
  .@{prefix-cls} {
    .ant-row {
      flex-flow: row;
      flex-wrap: wrap;
    }

    .ant-form-item .ant-row {
      flex-flow: column;
      margin-right: 50px;
    }

    .ant-picker {
      width: 100%;
    }
  }
</style>
