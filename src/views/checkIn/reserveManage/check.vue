<template>
  <a-modal v-model:open="open" @ok="onSubmit" :title="'预约课程:' + courseInfo.course_display_name">
    <a-form
      class="course-detail"
      ref="formRef"
      :model="formState"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item ref="phone" label="手机号" name="phone">
        <a-select
          v-model:value="formState.phone"
          show-search
          placeholder="Select users"
          style="width: 100%"
          :filter-option="false"
          :not-found-content="phoneState.fetching ? undefined : null"
          :options="phoneState.data"
          @search="fetchUser"
          @change="onWxChange"
        >
          <template v-if="phoneState.fetching" #notFoundContent>
            <a-spin size="small" />
          </template>
        </a-select>
      </a-form-item>
      <a-form-item label="会员卡" name="cardType">
        <a-select
          v-model:value="formState.cardType"
          placeholder="请选择会员卡"
          @change="handleCardTypeChange"
          :status="cardListFilter.length ? '' : 'error'"
        >
          <!--eslint-disable-next-line vue/valid-v-for-->
          <a-select-option v-for="item in cardListFilter" :value="item.cardins_id">{{
            item.cardcat_name
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="备注" name="desc">
        <a-textarea v-model:value="formState.desc" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { Dayjs } from 'dayjs';
  import { reactive, ref, toRaw, UnwrapRef, watch, computed, toRefs } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { Rule } from 'ant-design-vue/es/form';
  import { debounce } from 'lodash-es';
  import { getUserInfoByPhone, getCardInfo, getCourseCardInfo } from '/@/api/booking';
  import { postReserveCourse } from '/@/api/booking/course';
  import { encode } from '/@/utils/base64';

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
    Spin as ASpin,
    message,
  } from 'ant-design-vue';

  class State {
    phone = '';
    checkNumber = 1;
    cardType = undefined;
    desc = '';
  }

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
  const cardList = ref<any>([]);
  const cardListFilter = ref<any>([]);
  const courseInfo = ref<any>({});

  const controlModal = (bl: boolean, item: any) => {
    if (item) {
      courseInfo.value = item;
    }
    Object.assign(formState, new State());

    console.log(courseInfo.value);
    open.value = bl;
  };

  const emits = defineEmits(['success']);
  defineExpose({
    controlModal,
  });

  const phoneState = reactive({
    data: [],
    value: undefined,
    fetching: false,
  });

  const rules: Record<string, Rule[]> = {
    phone: [{ required: true, message: '请选择手机号', trigger: 'change' }],
    checkNumber: [{ required: true, message: '请选择签到人数', trigger: 'change' }],
    cardType: [{ required: true, message: '请选择会员卡', trigger: 'change' }],
    desc: [{ required: false, message: 'Please input desc', trigger: 'blur' }],
  };

  const fetchUser = debounce((value) => {
    if (!value) return;
    console.log('fetching user', value);
    phoneState.data = [];
    phoneState.fetching = true;
    getUserInfoByPhone(value).then((body) => {
      console.log('===body', body);
      const data = body.map((user) => ({
        label: `${user.phone_number}:${user.nickname}:${user.remarks}`,
        value: user.wxuser_token,
      }));
      phoneState.data = data;
      phoneState.fetching = false;
    });
  }, 300);

  watch(
    () => formState.checkNumber,
    (value: any) => {
      formState.cardType = undefined;
      if (value === 1) {
        cardListFilter.value = cardList.value;
      } else if (value > 1) {
        console.log('===value', value);
        cardListFilter.value = cardList.value?.filter((item) => {
          return item.cardcat_max_consume_times !== null;
        });
      }
    },
  );

  const handleCardTypeChange = (value) => {
    console.log(value);
  };

  const onSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState));
        postReserveCourse({
          'wxuser-token': formState.phone,
          'cardins-id': formState.cardType,
          'checkin-remarks': encode(formState.desc),
          'course-id': courseInfo.value.course_id,
        }).then(() => {
          emits('success');
        });
      })
      .catch((error) => {
        console.log('error', error);
      });
  };
  const onWxChange = (wxToken) => {
    console.log('====course_id', courseInfo.value['course_id']);
    getCourseCardInfo(wxToken, courseInfo.value['course_id']).then((res) => {
      cardList.value = res;
      console.log('===getCardInfo', res, cardList.value);
      cardListFilter.value = cardList.value;
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
