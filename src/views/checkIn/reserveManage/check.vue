<template>
  <a-modal v-model:open="open" @ok="onSubmit" :title="'预约课程'">
    <a-form
      class="course-detail"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item ref="phone" label="手机号" name="phone">
        <a-input v-model:value="formState.phone" />
      </a-form-item>
      <a-form-item label="签到人数" name="checkNumber">
        <a-input-number v-model:value="formState.checkNumber" :min="1" />
      </a-form-item>
      <a-form-item label="会员卡" name="cardType">
        <a-select
          v-model:value="formState.cardType"
          placeholder="请选择会员卡"
          @change="handleCardTypeChange"
        >
          <a-select-option value="1">课程卡</a-select-option>
          <a-select-option value="2">仅会员</a-select-option>
          <a-select-option value="3">付费</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="课程介绍" name="desc">
        <a-textarea v-model:value="formState.desc" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Dayjs } from 'dayjs';
  import { reactive, ref, toRaw, UnwrapRef, computed, toRefs } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { Rule } from 'ant-design-vue/es/form';
  import {
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
    Button as AButton,
    Select as ASelect,
    SelectOption as ASelectOption,
    DatePicker as ADatePicker,
    InputNumber as AInputNumber,
    Modal as AModal,
  } from 'ant-design-vue';

  const router = useRoute();
  console.log(router.query.type);
  const formRef = ref();
  const labelCol = { span: 5 };
  const wrapperCol = { span: 13 };
  const formState: UnwrapRef<any> = reactive({
    phone: '',
    checkNumber: 1,
    cardType: undefined,
    desc: '',
  });
  const open = ref(false);

  const controlModal = (bl: boolean) => {
    open.value = bl;
  };
  defineExpose({
    controlModal,
  });

  const rules: Record<string, Rule[]> = {
    phone: [{ required: true, message: '请选择手机号', trigger: 'change' }],
    checkNumber: [{ required: true, message: '请选择签到人数', trigger: 'change' }],
    cardType: [{ required: true, message: '请选择会员卡', trigger: 'change' }],
    desc: [{ required: false, message: 'Please input desc', trigger: 'blur' }],
  };
  const handleCardTypeChange = () => {
    console.log(formRef.value.clearValidate);
    // 预约方式变化时的处理
    // if (formState.bookType !== 1) {
    //   // 非课程卡预约方式时清空卡种
    //   formRef.value.clearValidate('card'); // 去除卡种的必填规则
    // } else {
    //   // 课程卡预约方式时，添加卡种的必填规则
    //   formRef.value.validateField('card');
    // }
  };

  const onSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState));
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const resetForm = () => {
    formRef.value.resetFields();
  };
</script>
<style lang="scss" scoped>
  .course-detail {
    margin-top: 20px;
  }
</style>
