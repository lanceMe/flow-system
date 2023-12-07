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
      <BasicForm @register="registerForm" :model="model">
        <!-- <template #attenders="{ model, field, disabled }">
          <div :class="`${prefixCls}-form__attenders`">
            <a-input v-model:value="model[field]" :disabled="disabled" />
            <div> ~ </div>
            <a-input v-model:value="model['ctpl-max-attenders']" :disabled="disabled" />
          </div>
        </template> -->
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { getFormSchema } from '/@/views/course/config';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { editTemplete, createTemplete } from '/@/api/course';
  import { encode } from '/@/utils/base64';

  export default defineComponent({
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    emits: ['submitSuccess'],
    setup(props, { emit }) {
      const modelRef = ref({});
      const dataRef = ref({});
      const titleRef = ref('');
      const { prefixCls } = useDesign('course');
      const schemas = getFormSchema(dataRef.value);

      const [registerForm, { updateSchema, validate, resetFields, resetSchema }] = useForm({
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
        const requestFunc = type === 'create' ? createTemplete : editTemplete;
        const params = {
          ...values,
          'ctpl-no-cancel-reserve-minutes': data?.['ctpl_no_cancel_reserve_minutes'] || 60,
          'ctpl-id': data?.['ctpl_id'],
          'ctpl-display-name': encode(values['ctpl-display-name']),
          'ctpl-description': encode(values['ctpl-description']),
          'ctpl-address': encode(values['ctpl-address']),
          'ctpl-tag': encode(values['ctpl-tag']),
          'ctpl-address-lat': 0,
          'ctpl-address-long': 0,
        };
        console.log('postApi', params, data);
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
            titleRef.value = '编辑课程';
            break;
          case 'create':
            titleRef.value = '新建课程';
            break;
          default:
            titleRef.value = '查看课程';
            break;
        }
      }

      async function setFormData(data) {
        dataRef.value = data;
        const schemas = getFormSchema(data);
        if (data.type === 'create') resetSchema(data);
        else resetFields();
        // await resetSchema(schemas);
        await updateSchema(schemas);
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
    &__attenders {
      display: flex;
      align-items: center;

      > div {
        margin: 0 8px;
      }
    }
  }
</style>
