<template>
  <a-modal v-model:open="visible" @ok="onSubmit" :title="'新建通知流程'">
    <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol">
      <!-- 通知标题 -->
      <a-form-item label="通知标题" name="title">
        <a-input v-model:value="formState.title" />
      </a-form-item>

      <!-- 通知类型 -->
      <a-form-item label="通知类型" name="type">
        <a-radio-group v-model:value="formState.type">
          <a-radio v-for="item in Object.keys(NotifyType)" :key="item" :value="item">{{
            NotifyType[item]
          }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 展示时间 -->
      <a-form-item label="展示时间" name="displayTime">
        <a-range-picker v-model:value="formState.displayTime" show-time />
      </a-form-item>

      <!-- 跳转按钮文案 -->
      <a-form-item label="跳转按钮文案" name="buttonText">
        <a-input v-model:value="formState.buttonText" />
      </a-form-item>

      <!-- 通知链接 -->
      <a-form-item
        label="通知链接"
        name="link"
        :rules="[{ required: !!formState.buttonText, message: '请输入通知链接', trigger: 'blur' }]"
      >
        <a-input v-model:value="formState.link" />
      </a-form-item>

      <!-- 背景图片 -->
      <a-form-item
        label="背景图片"
        name="backgroundImage"
        :rules="[
          {
            required: formState.type === NotifyMap.Swiper,
            message: '请上传背景图片',
            trigger: 'blur',
          },
        ]"
      >
        <a-upload v-model:value="formState.backgroundImage">
          <a-button icon="upload">上传图片</a-button>
        </a-upload>
      </a-form-item>

      <!-- 通知灰度 -->
      <a-form-item label="通知灰度" name="grayscaleType">
        <a-radio-group v-model:value="formState.grayscaleType">
          <a-radio v-for="item in Object.keys(GrayscaleType)" :key="item" :value="item">{{
            GrayscaleType[item]
          }}</a-radio>
        </a-radio-group>
      </a-form-item>

      <!-- 灰度类型为手机尾号时 -->
      <template v-if="formState.grayscaleType === GrayscaleMap.PhoneSuffix">
        <!-- 选择手机尾号 -->
        <a-form-item label="选择手机尾号" name="selectedPhoneSuffix">
          <!-- 实现手机尾号的选择 -->
          <a-select
            v-model:value="formState.selectedPhoneSuffix"
            :options="PhoneTail"
            mode="tags"
            placeholder="请选择手机尾号"
            allow-clear
          />
        </a-form-item>
      </template>

      <!-- 灰度类型为随机比例时 -->
      <template v-if="formState.grayscaleType === GrayscaleMap.RandomRatio">
        <!-- 选择随机比例 -->
        <a-form-item label="选择随机比例" name="randomRatio">
          <a-input-number
            :min="1"
            :max="99"
            v-model:value="formState.randomRatio"
            :formatter="(value) => `${value}%`"
            :parser="(value) => value.replace('%', '')"
          />
        </a-form-item>
      </template>

      <!-- 灰度类型为指定手机号时 -->
      <template v-if="formState.grayscaleType === GrayscaleMap.SpecificNumbers">
        <!-- 选择指定手机号 -->
        <a-form-item label="选择指定手机号" name="selectedPhoneNumbers">
          <a-textarea v-model:value="formState.selectedPhoneNumbers" allow-clear />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import dayjs from 'dayjs';
  import {
    Form as AForm,
    FormItem as AFormItem,
    Input as AInput,
    Button as AButton,
    Radio as ARadio,
    RadioGroup as ARadioGroup,
    Modal as AModal,
    Upload as AUpload,
    RangePicker as ARangePicker,
    Select as ASelect,
    InputNumber as AInputNumber,
    Textarea as ATextarea,
  } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { NotifyType, NotifyMap, PhoneTail, GrayscaleType, GrayscaleMap } from './constant';

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
    type: NotifyMap.Banner,
    displayTime: [dayjs(), dayjs().add(1, 'day')],
    buttonText: '',
    link: '',
    backgroundImage: '',
    grayscaleType: GrayscaleMap.PhoneSuffix,
    selectedPhoneSuffix: [],
    randomRatio: 1,
    selectedPhoneNumbers: '',
  });
  const rules: Record<string, Rule[]> = {
    title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }, { max: 20 }],
    type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
    displayTime: [{ type: 'array', required: false, message: '请选择展示时间', trigger: 'change' }],
    buttonText: [
      { required: false, max: 12, message: '跳转按钮文案长度不能超过12个字符', trigger: 'blur' },
    ],

    grayscaleType: [{ required: true, message: '请选择通知灰度类型', trigger: 'change' }],
    selectedPhoneSuffix: [
      {
        required: true,
        message: '请选择手机尾号',
        trigger: 'change',
      },
    ],
    // randomRatio: [
    //   {
    //     required: formState.grayscaleType === 'randomRatio',
    //     type: 'number',
    //     message: '请选择随机比例',
    //     trigger: 'change',
    //   },
    // ],
    // selectedPhoneNumbers: [
    //   {
    //     required: true,
    //     message: '请选择指定手机号',
    //     trigger: 'change',
    //   },
    // ],
  };

  const onSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        console.log('提交表单', formState);
        const { selectedPhoneNumbers } = formState;
        const splitSelectedPhoneNumbers = selectedPhoneNumbers.split('\n').filter((item) => item);
        console.log(
          '%c [ splitSelectedPhoneNumbers ]-184',
          'font-size:13px; background:pink; color:#bf2c9f;',
          splitSelectedPhoneNumbers,
        );
        // 在这里可以执行表单提交的逻辑
      })
      .catch((error) => {
        console.log('表单验证失败', error);
      });
  };

  const labelCol = { style: { width: '116px' } };
</script>

<style lang="scss" scoped>
  .course-detail {
    margin-top: 20px;
  }
</style>
