<template>
  <a-modal v-model:open="visible" @ok="onSubmit" :title="'新建通知流程'">
    <a-form ref="formRef" :model="formState" :rules="rules">
      <!-- 通知标题 -->
      <a-form-item label="通知标题" name="title">
        <a-input v-model:value="formState.title" />
      </a-form-item>

      <!-- 通知类型 -->
      <a-form-item label="通知类型" name="type">
        <a-radio-group v-model:value="formState.type">
          <a-radio value="1">首页轮播图</a-radio>
          <a-radio value="2">Banner</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 展示时间 -->
      <a-form-item label="展示时间" name="displayTime">
        <a-range-picker v-model:value="formState.displayTime" />
      </a-form-item>

      <!-- 跳转按钮文案 -->
      <a-form-item label="跳转按钮文案" name="buttonText">
        <a-input v-model:value="formState.buttonText" />
      </a-form-item>

      <!-- 通知链接 -->
      <a-form-item label="通知链接" name="link">
        <a-input v-model:value="formState.link" />
      </a-form-item>

      <!-- 背景图片 -->
      <a-form-item label="背景图片" name="backgroundImage">
        <a-upload v-model:value="formState.backgroundImage">
          <a-button icon="upload">上传图片</a-button>
        </a-upload>
      </a-form-item>

      <!-- 通知灰度 -->
      <a-form-item label="通知灰度" name="grayscaleType">
        <a-radio-group v-model:value="formState.grayscaleType">
          <a-radio value="phoneSuffix">手机尾号</a-radio>
          <a-radio value="randomRatio">随机比例</a-radio>
          <a-radio value="specificNumbers">指定手机号</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 灰度类型为手机尾号时 -->
      <template v-if="formState.grayscaleType === 'phoneSuffix'">
        <!-- 选择手机尾号 -->
        <a-form-item label="选择手机尾号" name="selectedPhoneSuffix">
          <!-- 实现手机尾号的选择 -->
        </a-form-item>
      </template>

      <!-- 灰度类型为随机比例时 -->
      <template v-if="formState.grayscaleType === 'randomRatio'">
        <!-- 选择随机比例 -->
        <a-form-item label="选择随机比例" name="randomRatio">
          <!-- 实现随机比例的选择 -->
        </a-form-item>
      </template>

      <!-- 灰度类型为指定手机号时 -->
      <template v-if="formState.grayscaleType === 'specificNumbers'">
        <!-- 选择指定手机号 -->
        <a-form-item label="选择指定手机号" name="selectedPhoneNumbers">
          <!-- 实现指定手机号的选择 -->
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import {
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
    Button as AButton,
    Select as ASelect,
    Radio as ARadio,
    RadioGroup as ARadioGroup,
    SelectOption as ASelectOption,
    DatePicker as ADatePicker,
    InputNumber as AInputNumber,
    Modal as AModal,
    Upload as AUpload,
    RangePicker as ARangePicker,
  } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';

  const formRef = ref();
  const visible = ref(false);
  const controlModal = (bl: boolean) => {
    visible.value = bl;
  };
  defineExpose({
    controlModal,
  });

  const formState = reactive({
    title: '',
    type: undefined,
    displayTime: [],
    buttonText: '',
    link: '',
    backgroundImage: '',
    grayscaleType: undefined,
    selectedPhoneSuffix: [],
    randomRatio: undefined,
    selectedPhoneNumbers: [],
  });

  const rules: Record<string, Rule[]> = {
    title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
    type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
    displayTime: [{ type: 'array', required: false, message: '请选择展示时间', trigger: 'change' }],
    buttonText: [
      { required: false, max: 12, message: '跳转按钮文案长度不能超过12个字符', trigger: 'blur' },
    ],
    link: [{ required: false, message: '请输入通知链接', trigger: 'blur' }],
    backgroundImage: [
      { required: formState.type === '1', message: '请上传背景图片', trigger: 'blur' },
    ],
    grayscaleType: [{ required: true, message: '请选择通知灰度类型', trigger: 'change' }],
    selectedPhoneSuffix: [
      {
        required: formState.grayscaleType === 'phoneSuffix',
        message: '请选择手机尾号',
        trigger: 'change',
      },
    ],
    randomRatio: [
      {
        required: formState.grayscaleType === 'randomRatio',
        type: 'number',
        message: '请选择随机比例',
        trigger: 'change',
      },
      { type: 'number', min: 1, max: 99, message: '请输入1-99之间的整数', trigger: 'change' },
    ],
    selectedPhoneNumbers: [
      {
        required: formState.grayscaleType === 'specificNumbers',
        message: '请选择指定手机号',
        trigger: 'change',
      },
    ],
  };

  const onSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        console.log('提交表单', formState);
        // 在这里可以执行表单提交的逻辑
      })
      .catch((error) => {
        console.log('表单验证失败', error);
      });
  };
</script>

<style lang="scss" scoped>
  .course-detail {
    margin-top: 20px;
  }
</style>
