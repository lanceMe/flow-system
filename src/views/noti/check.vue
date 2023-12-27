<template>
  <a-modal v-model:open="visible" @ok="onSubmit" :title="title + '通知'">
    <a-form
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :disabled="isDisabled"
    >
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
      <a-form-item
        v-if="title === '新建'"
        label="通知排序"
        name="sort"
        :rules="[{ required: true, message: '请输入排序', trigger: 'change', type: 'number' }]"
      >
        <a-input-number
          v-model:value="formState.sort"
          :min="0"
          :max="props.homepageLength ? props.homepageLength : 0"
          :disabled="formState.type === 'banner'"
        />
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
        action="/v1/upload_public_file"
        :rules="[
          {
            required: formState.type === NotifyMap.Swiper,
            message: '请上传背景图片',
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

      <!-- 通知范围 -->
      <a-form-item label="通知范围" name="grayscaleType">
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
    homepageLength: {
      type: Number,
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
    type: NotifyMap.Banner,
    displayTime: [dayjs(), dayjs().add(1, 'day')],
    buttonText: '',
    link: '',
    backgroundImage: [],
    grayscaleType: GrayscaleMap.AllUsers,
    selectedPhoneSuffix: [],
    selectedPhoneNumbers: '',
    sort: 0,
  });

  watch(
    () => props.data,
    (value) => {
      currentId.value = value.notif_id ?? '';
      formState.title = value.notif_title ?? '';
      formState.type = value.notif_type ?? NotifyMap.Banner;
      formState.displayTime = value.notif_display_since
        ? [dayjs(value.notif_display_since), dayjs(value.notif_display_until)]
        : [dayjs(), dayjs().add(1, 'day')];
      formState.buttonText = value.notif_btn_text ?? '';
      formState.link = value.notif_target_url ?? '';
      formState.backgroundImage = value.notif_image_url
        ? [
            {
              thumbUrl: value.notif_image_url,
              response: {
                url: value.notif_image_url,
              },
            },
          ]
        : [];

      if (!value.notif_visible_phone_rule) {
        formState.grayscaleType = GrayscaleMap.AllUsers;
        formState.selectedPhoneSuffix = [];
        formState.selectedPhoneNumbers = '';
      } else if (value.notif_visible_phone_rule.indexOf('*') === -1) {
        formState.grayscaleType = GrayscaleMap.SpecificNumbers;
        formState.selectedPhoneNumbers = value.notif_visible_phone_rule.replace(/,/g, '\n');
      } else {
        formState.grayscaleType = GrayscaleMap.PhoneSuffix;
        // 使用正则表达式匹配数字
        const match = value.notif_visible_phone_rule.match(/\d+/);
        // 将匹配到的数字转换成数组
        formState.selectedPhoneSuffix = match?.[0]?.split('').map(Number) ?? [];
      }
      console.log('=valuewatch', value);
    },
  );
  watch(
    () => formState.type,
    (value) => {
      if (value === 'banner') {
        formState.sort = 0;
      }
    },
    { immediate: true },
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
          'notif-sort-at': formState.sort,
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
