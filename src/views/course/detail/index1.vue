<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="title"
    @visible-change="handleVisibleChange"
    width="600px"
    @ok="handlesubmit"
  >
    <div :class="`${prefixCls}-form course-from pt-3px pr-3px`">
      <BasicForm @register="registerForm">
        <template #course_name="{ model, field, disabled }">
          <ApiSelect
            :api="getTempleteList"
            placeholder="请选择课程"
            labelField="ctpl_display_name"
            valueField="ctpl_id"
            :disabled="disabled"
            :afterFetchFn="afterFetchFn"
            v-model:value="model[field]"
            @change="handleCouseChange"
          />
          <!-- <a-input v-model:value="model[field]" :disabled="disabled" /> -->
        </template>
        <!-- <template #formHeader>
          <a-form-item label="课程名称" name="course-display-name" class="ant-col-10">
            <a-select
              labelField="ctpl_display_name"
              valueField="ctpl_id"
              :fieldNames="{ label: 'ctpl_display_name', value: 'ctpl_id' }"
              placeholder="请选择课程"
              v-model:value="couseTempleteId"
              :options="options"
              @change="handleCouseChange"
            />
          </a-form-item>
        </template> -->
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { ApiSelect, BasicForm, useForm } from '/@/components/Form/index';
  import { getFormSchema1 } from '/@/views/course/config';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { createCourse, editCourse, getTempleteList, deleteCourse } from '/@/api/course';
  import { encode } from '/@/utils/base64';
  import dayjs from 'dayjs';
  import { useMessage } from '/@/hooks/web/useMessage';

  export default defineComponent({
    components: { BasicModal, BasicForm, ApiSelect },
    props: {
      userData: { type: Object },
    },
    emits: ['register', 'submitSuccess'],
    setup(props, { emit }) {
      const dataRef = ref<any>({});
      const titleRef = ref('');
      const { prefixCls } = useDesign('course');
      const schemas = getFormSchema1(dataRef.value);
      const couseTemplete = ref<any>({});
      const options = ref([]);
      const cancelText = ref('取消');

      const { createConfirm } = useMessage();
      // const cancelButtonProps = ref(null);
      const [registerForm, { updateSchema, validate, resetFields, getFieldsValue }] = useForm({
        // labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        baseColProps: {
          span: 15,
        },
        actionColOptions: {
          span: 24,
        },
      });

      const [registerModal, { closeModal, setModalProps }] = useModalInner((data) => {
        data && onDataReceive(data);
      });

      function onDataReceive(data) {
        console.log('Data Received', data);
        const { type } = data;
        dataRef.value = data;
        setModalProps({
          cancelText: type === 'edit' ? '取消课程' : '取消',
          autoClose: type === 'edit' ? false : true,
          cancelButtonProps: {
            type: type === 'edit' ? 'primary' : 'default',
            danger: type === 'edit' ? true : false,
            onClick: () => {
              handelCandel();
            },
          },
        });
        setType(type);
        setFormData(data);
      }

      function handleCouseChange(_, info) {
        const data = dataRef.value;
        couseTemplete.value = info;

        const templeteData = {
          course_templete_id: info['value'],
          display_name: info['label'],
          min_attenders: info['ctpl_min_attenders'],
          max_attenders: info['ctpl_max_attenders'],
          cancel_if_not_enough_attenders_hours: info['ctpl_cancel_if_not_enough_attenders_hours'],
          no_cancel_reserve_hours: info['ctpl_no_cancel_reserve_hours'],
          description: info['ctpl_description'],
          address: info['ctpl_address'],
        };
        setFormData({ ...data, templeteData });
      }

      function handleVisibleChange(v) {
        v && props.userData && nextTick(() => onDataReceive(props.userData));
      }

      function handelCandel() {
        if (dataRef.value.type === 'edit') {
          const data = dataRef.value?.formData;
          const { display_name, course_id } = data;
          createConfirm({
            iconType: 'error',
            title: '取消课程',
            content: `确认取消【${display_name}】?删除后将无法恢复`,
            onOk: () => {
              deleteCourse(course_id).then(() => {
                closeModal();
                emit('submitSuccess');
              });
            },
          });
        }
      }

      async function handlesubmit() {
        try {
          const values = await validate();
          postApi(values);
        } catch (error) {
          console.error(error);
        }
      }

      function postApi(values) {
        const { formData: data, type } = dataRef.value as any;
        const requestFunc = type === 'create' ? createCourse : editCourse;
        const courseId = type === 'create' ? undefined : data?.['course_id'];
        const s = values?.['course-start-time'];
        const e = values?.endDateTime;
        const courseDur = dayjs(e).diff(s, 'm');

        const [address, lat, long] = calAddress(values?.address, values?.['course-address']);
        const temp = couseTemplete.value;
        const params = {
          ...values,
          'course-display-name': encode(data?.['display_name'] || temp?.['label']),
          'course-description': encode(values['course-description']),
          'course-address': encode(address as string),
          'course-address-lat': lat,
          'course-address-long': long,
          'course-duration-minutes': courseDur,
          'course-tag': encode(values['course-tag'] || temp?.['ctpl_tag'] || 'test'),
          'course-id': courseId,
          'course-type': data?.['type'] || temp?.['ctpl_type'] || 'group',
          'course-price': data?.['course_price'] || temp?.['ctpl_price'] || '20',
          course_templete_id: undefined,
        };
        console.log('postApi', params, address, lat, long);
        requestFunc(params).then((resp) => {
          console.log(resp, params);
          closeModal();
          emit('submitSuccess');
        });
      }

      function calAddress(addressType: number, addressInput: string) {
        let lat = '39.97337859782243';
        let long = '116.49615152848547';
        let text = 'Mellow Climbing Gym';
        if (addressType === 2) {
          lat = '0';
          long = '0';
          text = addressInput;
        }
        return [text, lat, long];
      }

      function setType(type: string) {
        setTitle(type);
      }

      function setTitle(type: string) {
        switch (type) {
          case 'edit':
            titleRef.value = '编辑课程';
            break;
          case 'create':
            titleRef.value = '创建课程';
            break;
          default:
            titleRef.value = '查看课程';
            break;
        }
      }

      async function setFormData(data) {
        dataRef.value = data;
        const schemas = getFormSchema1(data, getFieldsValue);

        await resetFields();
        console.log(schemas, 'setFormData');
        nextTick(() => {
          updateSchema(schemas, true);
        });
      }

      function initAddress(data) {
        const f = data?.formData || {};
        const addr = f['ctpl_address'];
        let address = 1;
        if (addr && addr !== 'Mellow Climbing Gym') address = 2;
        f.address = address;
        data.formData = f;
        return data;
      }

      function afterFetchFn(res: []) {
        if (!res || res.length < 1) return res;
        const { courseType: type } = dataRef.value as any;
        const list = [];
        for (const course of res) {
          if (
            type === 'private' &&
            (course['ctpl_type'] === 'privatelv1' || course['ctpl_type'] === 'privatelv2')
          ) {
            list.push(course);
          } else if (
            type === 'groupopen' &&
            (course['ctpl_type'] === 'open' ||
              course['ctpl_type'] === 'group' ||
              course['ctpl_type'] === 'special')
          ) {
            list.push(course);
          }
        }
        return list;
      }

      return {
        registerModal,
        schemas,
        registerForm,
        handleVisibleChange,
        handlesubmit,
        setTitle,
        title: titleRef,
        prefixCls,
        options,
        handleCouseChange,
        getTempleteList,
        afterFetchFn,
        cancelText,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-course';
  .@{prefix-cls} {
    &__attenders {
      display: flex;
      align-items: center;

      > div {
        margin: 0 8px;
      }
    }
  }

  .course-from .ant-form-item-label {
    text-align: left;
  }
</style>
