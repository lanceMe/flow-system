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
        <template #to_wxuser="{ model, field }">
          <AutoComplete
            placeholder="请输入接收用户"
            :options="wxUserData"
            @search="onUserSearch"
            v-model:value="selectedData"
            @select="(_, { wxuser_token }) => onUserSelect(wxuser_token, model, field)"
          />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import {
    getRenewSchema,
    getBindSchema,
    getDeductSchema,
    getStopSchema,
    getOverSchema,
  } from './config';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { changeCardins, bindCard, stopCard, overCard } from '/@/api/cards';

  import { FormSchema } from '/@/components/Form';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useRouter } from 'vue-router';
  import { encode } from '/@/utils/base64';
  import { AutoComplete } from 'ant-design-vue';
  import { getUserInfoByPhone } from '/@/api/booking';
  import { joinNonEmptyStrings } from '/@/utils';

  export default defineComponent({
    components: { BasicModal, BasicForm, AutoComplete },
    props: {
      userData: { type: Object },
    },
    emits: ['register', 'submitSuccess'],
    setup(props, { emit }) {
      const modelRef = ref({});
      const dataRef = ref({});
      const titleRef = ref('');
      const contentRef = ref('');
      const requestRef: any = ref(null);
      const { prefixCls } = useDesign('member-operation');
      const { createConfirm } = useMessage();
      const { id } = useRouter()?.currentRoute?.value?.query || {};
      const selectedData = ref('');
      const [registerForm, { validate, resetSchema, resetFields }] = useForm({
        schemas: [],
        showActionButtonGroup: false,
        baseColProps: {
          span: 18,
        },
        actionColOptions: {
          span: 24,
        },
      });

      const [register, { closeModal }] = useModalInner((data) => {
        data && onDataReceive(data);
        selectedData.value = '';
      });

      const wxUserData = ref([]);

      async function onUserSearch(value: string) {
        const isNumber = /^\d+$/.test(value);
        if (!isNumber) {
          wxUserData.value = [];
        } else {
          const userOrigins = (await getUserInfoByPhone(value)) || [];
          const sliced = userOrigins.slice(0, 100);
          wxUserData.value =
            sliced.map((user) => {
              const { wxuser_token, phone_number, nickname, remarks } = user;
              const label = joinNonEmptyStrings([phone_number, nickname, remarks], ':');
              const value = label;
              return { value, label, wxuser_token };
            }) || [];
        }
      }

      function onUserSelect(token, model, field) {
        model[field] = token;
      }

      function onDataReceive(data) {
        console.log('Data Received', data);
        init(data);
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      async function handlesubmit() {
        try {
          const values = await validate();
          confirmMsg(values);
        } catch (error) {
          console.error(error);
        }
      }

      function postApi(values) {
        const { formData, type } = dataRef.value as any;
        const requestFunc = requestRef.value;
        const { expire_date, resume_date, to_wxuser_token } = values;

        let params = {};
        switch (type) {
          case 'renew':
          case 'deduct':
            params = {
              'cardins-id': formData['cardins_id'],
              attr: expire_date ? 'expire_date' : 'expire_date',
              value: expire_date || expire_date,
            };
            break;
          case 'bind':
            params = {
              'wxuser-token': id,
              'cardcat-id': values['cardcat-id'],
              'cardins-count': values['cardins-count'],
              'seller-staff-id': values['seller-staff-id'],
              'checkin-remarks': encode(values['checkin-remarks']),
            };
            break;
          case 'stop':
            params = {
              'cardins-id': formData['cardins_id'],
              'resume-date': resume_date,
            };
            break;
          case 'over':
            params = {
              'cardins-id': formData['cardins_id'],
              'to-wxuser-token': to_wxuser_token,
            };
            break;
          default:
        }

        requestFunc(params).then(() => {
          closeModal();
          emit('submitSuccess');
        });
      }

      function init(data) {
        const { type } = data;
        dataRef.value = data;
        let schemas: FormSchema[] = [];
        switch (type) {
          case 'renew':
            titleRef.value = '续卡';
            requestRef.value = changeCardins;
            schemas = getRenewSchema(data);
            contentRef.value =
              '续卡后，用户当前的会员卡有效期和次数将会被同步更新，确认操作请点击确定';
            break;
          case 'bind':
            titleRef.value = '绑卡';
            requestRef.value = bindCard;
            schemas = getBindSchema(data);
            contentRef.value = '绑卡后，用户将会拥有一张所选卡种的全新会员卡，确认操作请点击确定';
            break;
          case 'deduct':
            titleRef.value = '扣费';
            requestRef.value = changeCardins;
            schemas = getDeductSchema(data);
            contentRef.value =
              '扣费后，用户当前的会员卡有效期和次数将会被手动扣除，确认操作请点击确定';
            break;
          case 'stop':
            titleRef.value = '停卡';
            requestRef.value = stopCard;
            schemas = getStopSchema(data);
            contentRef.value =
              '停卡后，用户当前的会员卡有效期和次数将会暂停扣除，直到下次消费，确认操作请点击确认';
            break;
          case 'over':
            titleRef.value = '转卡';
            requestRef.value = overCard;
            schemas = getOverSchema(data);
            contentRef.value = '转卡后，用户当前的会员卡有效期和次数将转到接受用户名下，请确认操作';
            break;

          default:
            titleRef.value = '';
            break;
        }
        // const schemas: FormSchema[] = getFormSchema(data);
        setFormData(schemas);
      }

      async function setFormData(schemas) {
        // await resetFields();
        await resetSchema(schemas);
        nextTick(() => {
          resetFields();
          // updateSchema(schemas, true);
        });
      }

      function confirmMsg(values) {
        createConfirm({
          iconType: 'info',
          title: titleRef.value,
          content: contentRef.value,
          onOk: () => {
            postApi(values);
          },
        });
      }

      return {
        register,
        registerForm,
        model: modelRef,
        handleVisibleChange,
        handlesubmit,
        title: titleRef,
        prefixCls,
        wxUserData,
        onUserSearch,
        onUserSelect,
        selectedData,
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
