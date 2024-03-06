<template>
  <a-modal v-model:open="visible" @ok="onSubmit" :title="title">
    <a-form
      class="course-detail"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :disabled="isDisabled"
    >
      <a-form-item label="Method" name="method">
        <a-input v-model:value="formState.method" />
      </a-form-item>
      <a-form-item label="URI" name="desc">
        <a-input v-model:value="formState.url" />
      </a-form-item>
      <a-form-item label="Code" name="code">
        <a-input v-model:value="formState.code" />
      </a-form-item>
      <a-form-item label="Params" name="params">
        <a-textarea v-model:value="formState.params" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, watch } from 'vue';
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

  const formRef = ref();
  const visible = ref(false);
  const controlModal = (bl: boolean) => {
    visible.value = bl;
  };

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
    checkType: {
      type: String,
      default: '',
    },
    homepageLength: {
      type: Number,
    },
  });
  defineExpose({
    controlModal,
  });

  watch(
    () => props.data,
    (value) => {
      formState.url = props?.data?.url ?? '';
      formState.method = props?.data?.method ?? '';
      formState.params = props?.data?.params ?? '';
      formState.code = props?.data?.code ?? '';

      console.log('=valuewatch', value);
    },
  );

  const isDisabled = computed(() => {
    return props.checkType === 'view';
  });

  const currentId = ref('');

  const title = computed(() => {
    if (props.checkType === 'view') {
      return '查看';
    } else if (props.checkType === 'create') {
      return '新建';
    } else if (props.checkType === 'edit') {
      return '编辑';
    }
    return '';
  });

  const formState = reactive({
    method: props?.data?.method,
    url: props?.data?.url,
    params: props?.data?.params,
    code: props?.data?.code,
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
  };

  const onSubmit = () => {
    if (isDisabled.value) {
      controlModal(false);
      return;
    }
    formRef.value
      .validate()
      .then(() => {})
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

  .ant-modal-body {
    padding-right: 20px !important;
  }
</style>
