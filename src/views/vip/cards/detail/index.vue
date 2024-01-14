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
  import { editTemplete, createTemplete } from '/@/api/course';
  import { encode } from '/@/utils/base64';

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

      const [registerForm, { updateSchema, validate, resetFields, getFieldsValue }] = useForm({
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
        const requestFunc = type === 'create' ? createTemplete : editTemplete;
        const [address, lat, long] = calAddress(values?.address, values?.['ctpl-address']);
        const params = {
          ...values,
          // 'ctpl-no-cancel-reserve-hours': data?.['ctpl_no_cancel_reserve_hours'] || 60,
          'ctpl-id': data?.['ctpl_id'],
          'ctpl-display-name': encode(values['ctpl-display-name']),
          'ctpl-description': encode(values['ctpl-description']),
          'ctpl-address': encode(address as string),
          'ctpl-tag': encode(values['ctpl-tag']),
          'ctpl-address-lat': lat,
          'ctpl-address-long': long,
        };
        console.log('postApi', address, lat, long, values, data);
        requestFunc(params).then((resp) => {
          console.log(resp, params);
          closeModal();
          emit('submitSuccess');
        });
      }

      function calAddress(addressType: number, addressInput: string) {
        let lat = '39.97337859782243';
        let long = '116.49615152848547';
        let text = 'Mellow Climbing Gym';
        if (addressType === 2) {
          lat = '0';
          long = '0';
          text = addressInput;
        }
        return [text, lat, long];
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
        const dataJoin = initAddress(data);
        dataRef.value = dataJoin;

        const schemas = getFormSchema(dataJoin, getFieldsValue);

        await resetFields();
        nextTick(() => {
          updateSchema(schemas, true);
        });
      }

      function initAddress(data) {
        const f = data?.formData || {};
        const addr = f['ctpl_address'];
        let address = 1;
        if (addr && addr !== 'Mellow Climbing Gym') address = 2;
        f.address = address;
        data.formData = f;
        return data;
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
