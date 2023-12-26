<template>
  <a-modal v-model:open="visible" @ok="onSubmit" :title="title + '员工信息'">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :disabled="isDisabled"
    >
      <!-- 昵称 -->
      <a-form-item label="昵称" name="title">
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <!-- 登录手机号 -->
      <a-form-item label="登录手机号" name="phone">
        <a-input v-model:value="formState.title" />
      </a-form-item>
      <!-- 通知标题 -->
      <a-form-item label="性别" name="gender">
        <a-radio-group v-model:value="formState.type">
          <a-radio :key="1" :value="1">男</a-radio>
          <a-radio :key="2" :value="0"> 女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="个人介绍" name="desc">
        <a-textarea v-model:value="formState.desc" show-count :maxlength="100" />
      </a-form-item>

      <!-- 头像 -->
      <a-form-item
        label="头像"
        name="backgroundImage"
        action="/v1/upload_public_file"
        :rules="[
          {
            required: formState.type === NotifyMap.Swiper,
            message: '头像',
            trigger: 'blur',
          },
        ]"
      >
        <a-upload
          v-model:file-list="formState.backgroundImage"
          :max-count="1"
          list-type="picture"
          :customRequest="customRequest"
        >
          <a-button icon="upload">上传图片</a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, watch } from 'vue';
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
    message,
  } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { postUploadFile, postNotification } from '/@/api/noti/index';
  import { NotifyType, NotifyMap, PhoneTail, GrayscaleType, GrayscaleMap } from './constant';
  import { encode } from '/@/utils/base64';

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
  });
  defineExpose({
    controlModal,
  });

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
    title: '',
    type: 1,
    displayTime: [dayjs(), dayjs().add(1, 'day')],
    backgroundImage: [],
    desc: '',
  });

  watch(
    () => props.data,
    (value) => {
      console.log('=valuewatch', value);
    },
  );
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

  const emits = defineEmits(['onSubmit']);

  const onSubmit = () => {
    if (isDisabled.value) {
      controlModal(false);
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        console.log('提交表单', formState);
        const { selectedPhoneNumbers } = formState;
        // postNotification().then(()=>{

        // })
        // 在这里可以执行表单提交的逻辑
        const backgroundImage = formState.backgroundImage?.[0]?.response?.url ?? '';
        let phoneRule = '';
        if (formState.grayscaleType === GrayscaleMap.PhoneSuffix) {
          phoneRule = `*[${formState.selectedPhoneSuffix.join('')}]`;
        } else if (formState.grayscaleType === GrayscaleMap.SpecificNumbers) {
          const splitSelectedPhoneNumbers = selectedPhoneNumbers
            .split('\n')
            .map((item) => item.trim());
          phoneRule = splitSelectedPhoneNumbers.join(',');
        } else if (formState.grayscaleType === GrayscaleMap.AllUsers) {
          phoneRule = '*';
        }
        const parmas = {
          'notif-title': encode(formState.title),
          'notif-type': formState.type,
          'notif-display-since': formState.displayTime?.[0]?.format('YYYY-MM-DDTHH:mm:ss'),
          'notif-display-until': formState.displayTime?.[1]?.format('YYYY-MM-DDTHH:mm:ss'),
          'notif-btn-text': encode(formState.buttonText),
          'notif-target-url': encode(formState.link),
          'notif-image-url': encode(backgroundImage),
          'notif-visible-phone-rule': phoneRule,
          'notif-id': currentId.value,
        };
        emits('onSubmit', parmas, props.checkType);
        // postNotification({
        //   'notif-title': encode(formState.title),
        //   'notif-type': formState.type,
        //   'notif-display-since': formState
        // });
      })
      .catch((error) => {
        console.log('表单验证失败', error);
      });
  };

  const customRequest = (file) => {
    // file 是上传的文件 其内容会在放在下面截图中
    // 后端需要接受的参数是 formData数据，
    postUploadFile({
      name: 'file',
      file: file.file,
      filename: 'banner.png',
    })
      .then((res) => {
        console.log(res);
        file.onSuccess(res.data, file);
      })
      .catch((err) => {
        // 调用实例的失败方法通知组件该文件上传失败
        file.onError(err);
      });

    // uploadFile 我自己的接口
  };

  const labelCol = { style: { width: '116px' } };
</script>

<style lang="scss" scoped>
  .course-detail {
    margin-top: 20px;
  }
</style>
