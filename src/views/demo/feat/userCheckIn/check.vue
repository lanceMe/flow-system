<template>
  <a-modal v-model:open="open" @ok="handleSubmit" :title="'签到'" :confirm-loading="confirmLoading">
    <a-form
      class="course-detail"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :disabled="disableItem"
    >
      <a-form-item ref="name" label="课程名称" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="课程类别" name="courseType">
        <a-select v-model:value="formState.courseType" placeholder="请选择课程类别">
          <a-select-option value="1">团课</a-select-option>
          <a-select-option value="2">私教课</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="课程种类" name="courseCategory">
        <a-select v-model:value="formState.courseCategory" placeholder="请选择课程种类">
          <a-select-option value="1">攀岩</a-select-option>
          <a-select-option value="2">瑜伽</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="人数下限" name="minMember">
        <a-input-number v-model:value="formState.minMember" />
      </a-form-item>
      <a-form-item label="人数上限" name="maxMember">
        <a-input-number v-model:value="formState.maxMember" />
      </a-form-item>
      <a-form-item label="预约方式" name="bookType">
        <a-select
          v-model:value="formState.bookType"
          placeholder="请选择预约方式"
          @change="handleBookTypeChange"
        >
          <a-select-option value="1">课程卡</a-select-option>
          <a-select-option value="2">仅会员</a-select-option>
          <a-select-option value="3">付费</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="卡种" name="card">
        <a-select v-model:value="formState.card" placeholder="请选择卡种">
          <a-select-option value="1">团课</a-select-option>
          <a-select-option value="2">中级私教</a-select-option>
          <a-select-option value="3">高级私教</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="课程价格" name="coursePrice">
        <a-input-number v-model:value="formState.coursePrice" />
      </a-form-item>
      <a-form-item label="课程时长" name="courseLength">
        <a-input-number v-model:value="formState.courseLength">
          <template #addonAfter>
            <div>分钟</div>
          </template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="候补时间限制" name="alternateTime">
        <a-input-number v-model:value="formState.alternateTime">
          <template #addonAfter>
            <div>分钟</div>
          </template>
        </a-input-number>
      </a-form-item>
      <a-form-item label="课程介绍" name="courseIntro">
        <a-textarea v-model:value="formState.courseIntro" />
      </a-form-item>
      <a-form-item label="地址" name="address">
        <a-input v-model:value="formState.address" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">创建</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
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

  const props = defineProps({
    open: Boolean,
  });

  const { open } = toRefs(props);
  const router = useRoute();
  console.log(router.query.type);
  const pageType = ref(router.query.type);
  const formRef = ref();
  const labelCol = { span: 5 };
  const wrapperCol = { span: 13 };
  const formState: UnwrapRef<any> = reactive({
    name: '',
    region: undefined,
    date1: undefined,
    delivery: false,
    type: [],
    resource: '',
    desc: '',
  });
  const disableItem = computed(() => {
    return pageType.value === 'view';
  });
  const checkCard = async (_rule: Rule, value: string) => {
    if (formState.bookType === '1' && !value) {
      return Promise.reject('预约方式为课程卡，卡种必选');
    }
  };
  const checkMaxMember = async (_rule: Rule, value: number) => {
    console.log('formState.minMember', formState.minMember, value);
    if (!value) {
      return Promise.reject('请选择人数上限');
    }
    if (formState.minMember > value) {
      return Promise.reject('人数上限需大于等于人数下限');
    }
  };

  const checkCoursePrice = async (_rule: Rule, value: string) => {
    if (formState.bookType === '3' && !value) {
      return Promise.reject('预约方式为付费，课程价格必填');
    }
  };

  const rules: Record<string, Rule[]> = {
    name: [{ required: true, message: '请选择课程名称', trigger: 'change' }],
    courseType: [{ required: true, message: '请选择课程类别', trigger: 'change' }],
    courseCategory: [{ required: true, message: '请选择课程种类', trigger: 'change' }],
    minMember: [{ required: true, message: '请选择人数下限', trigger: 'change' }],
    maxMember: [{ required: true, validator: checkMaxMember, trigger: 'change' }],
    bookType: [{ required: true, message: '请选择预约方式', trigger: 'change' }],
    card: [{ required: false, validator: checkCard, trigger: 'change' }],
    coursePrice: [{ required: false, validator: checkCoursePrice, trigger: 'change' }],
    courseLength: [{ required: true, message: '请选择课程时长', trigger: 'change' }],
    date1: [{ required: true, message: 'Please pick a date', trigger: 'change', type: 'object' }],
    type: [
      {
        type: 'array',
        required: true,
        message: 'Please select at least one activity type',
        trigger: 'change',
      },
    ],
    resource: [{ required: true, message: 'Please select activity resource', trigger: 'change' }],
    desc: [{ required: true, message: 'Please input activity form', trigger: 'blur' }],
  };
  const handleBookTypeChange = () => {
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
