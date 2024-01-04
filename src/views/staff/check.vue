<template>
  <a-modal class="my-modal" v-model:open="visible" @ok="onSubmit" :title="title + '员工信息'">
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
      <!-- 昵称 -->
      <a-form-item label="姓名" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <!-- 登录手机号 -->
      <a-form-item label="登录手机号" name="phone">
        <a-input v-model:value="formState.phone" />
      </a-form-item>
      <!-- 性别 -->
      <a-form-item label="性别" name="gender">
        <a-radio-group v-model:value="formState.gender">
          <a-radio :key="1" value="male">男</a-radio>
          <a-radio :key="2" value="female"> 女</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="员工角色" name="status">
        <a-select v-model:value="formState.status" style="width: 200px" mode="multiple">
          <a-select-option
            v-for="item in statusList"
            :value="item.value"
            :key="item.value"
            :label="item.label"
            >{{ item.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="formState.status.indexOf('coach') !== -1"
        label="小程序是否可见"
        name=" isMiniVisible"
      >
        <a-radio-group v-model:value="formState.isMiniVisible">
          <a-radio :key="1" :value="1">是</a-radio>
          <a-radio :key="2" :value="0"> 否</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="个人介绍" name="desc">
        <a-textarea
          v-model:value="formState.desc"
          @change="textareaChange"
          show-count
          :maxlength="100"
        />
      </a-form-item>

      <!-- 头像 -->
      <a-form-item label="头像" name="backgroundImage" action="/v1/upload_public_file">
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
    SelectOption as ASelectOption,
    message,
  } from 'ant-design-vue';
  import type { Rule } from 'ant-design-vue/es/form';
  import { postUploadFile, postNotification } from '/@/api/noti/index';
  import { NotifyType, NotifyMap, PhoneTail, GrayscaleType, GrayscaleMap } from './constant';
  import { encode } from '/@/utils/base64';

  class State {
    title = '';
    phone = '';
    gender = 'male';
    backgroundImage = [];
    desc = '';
    name = '';
    status = [];
    isMiniVisible = 0;
  }
  const formRef = ref();
  const visible = ref(false);
  const controlModal = (bl: boolean, isClear: boolean = false) => {
    if (isClear) {
      Object.assign(formState, new State());
    }
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

  const formState = reactive(new State());

  const id = ref<any>(null);

  const textareaChange = (e) => {
    if (e.inputType !== 'deleteContentBackward') {
      let lines = formState.desc.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (!lines[i].startsWith('• ')) {
          lines[i] = '• ' + lines[i];
        }
      }
      formState.desc = lines.join('\n');
    }
  };

  const statusList = [
    {
      label: 'admin',
      value: 'admin',
    },
    {
      label: 'manager',
      value: 'manager',
    },
    {
      label: 'financial',
      value: 'financial',
    },
    {
      label: 'reception',
      value: 'reception',
    },
    {
      label: 'coach',
      value: 'coach',
    },
  ];

  watch(
    () => props.data,
    (value) => {
      if (!value) return;
      console.log('=valuewatch', value);
      formState.title = value.staff_nickname;
      formState.name = value.staff_name;
      formState.phone = value.staff_phone_number;
      formState.gender = value.staff_gender;
      formState.status = value.staff_role ?? [];
      formState.isMiniVisible = value.staff_miniapp_visible;
      formState.desc = value.staff_short_description;
      formState.backgroundImage = value.staff_avatar_url
        ? [
            {
              thumbUrl: value.staff_avatar_url,
              response: {
                url: value.staff_avatar_url,
              },
            },
          ]
        : [];
      id.value = value.staff_id;
    },
    { immediate: true },
  );
  const rules: Record<string, Rule[]> = {
    title: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    phone: [{ required: true, message: '请选择手机号', trigger: 'change' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    desc: [{ required: true, message: '请输入个人介绍', trigger: 'change' }],
    status: [{ required: true, message: '请选择员工角色', trigger: 'change' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
    backgroundImage: [{ required: true, message: '请选择头像', trigger: 'change' }],
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
        // 在这里可以执行表单提交的逻辑
        const backgroundImage = formState.backgroundImage?.[0]?.response?.url ?? '';
        const parmas = {
          'staff-nickname': encode(formState.title),
          'staff-name': encode(formState.name),
          'staff-role': formState.status.join(','),
          'staff-short-description': encode(formState.desc),
          'staff-miniapp-visible':
            formState.status.indexOf('coach') !== -1 ? formState.isMiniVisible : 0,
          'staff-avatar-url': encode(backgroundImage),
          'staff-phone-number': formState.phone,
          'staff-gender': formState.gender,
          'staff-id': id.value,
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
      filename: 'header.png',
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

  .ant-modal-body {
    padding-right: 20px !important;
  }
</style>
