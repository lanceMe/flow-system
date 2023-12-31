<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="用户基本信息"
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
  import { getUserSchema } from './config';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { changeUser } from '/@/api/sys/user';
  import { FormSchema } from '/@/components/Form';
  import { useRouter } from 'vue-router';
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
      const { prefixCls } = useDesign('user');
      const { id } = useRouter()?.currentRoute?.value?.query || {};
      const [registerForm, { validate, updateSchema }] = useForm({
        schemas: getUserSchema(dataRef.value),
        showActionButtonGroup: false,
        baseColProps: {
          span: 15,
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
        init({ ...data, wxUserId: id });
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
        //@ts-ignore
        const { userData: d } = dataRef.value;
        // const { nickname, phone,avatar_fileid,remarks } = values;
        const reqParamlist: any[] = [];
        console.log(d.nickname, values.nickname, d.nickname === values.nickname);
        if (d.nickname !== values.nickname)
          reqParamlist.push({ 'wxuser-token': id, attr: 'nickname', value: values.nickname });
        if (d.phone_number !== values.phone)
          reqParamlist.push({ 'wxuser-token': id, attr: 'phone', value: values.phone });
        if (d.avatar_fileid !== values.avatar_fileid)
          reqParamlist.push({
            'wxuser-token': id,
            attr: 'avatar_fileid',
            value: values.avatar_fileid,
          });
        if (d.remarks != values.remarks)
          reqParamlist.push({
            'wxuser-token': id,
            attr: 'remarks',
            value: values.remarks,
          });

        for (let i = 0, len = reqParamlist.length; i < len; i++) {
          const params = reqParamlist[i];
          params.value = encode(params.value);
          changeUser(params);
        }
        emit('submitSuccess');
        closeModal();
      }

      function init(data) {
        dataRef.value = data;
        const schemas: FormSchema[] = getUserSchema(data);
        setFormData(schemas);
      }

      async function setFormData(schemas) {
        // resetSchema(schemas);
        await updateSchema(schemas);
      }

      return {
        register,
        registerForm,
        model: modelRef,
        handleVisibleChange,
        handlesubmit,
        prefixCls,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-member-operation-form';

  .@{prefix-cls} {
    .ant-picker {
      width: 100%;
    }

    &__attenders {
      display: flex;
      align-items: center;

      > div {
        margin: 0 8px;
      }
    }
  }
</style>
