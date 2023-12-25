<template>
  <PageWrapper :class="`${prefixCls}-form`">
    <div :class="`pt-3px pr-3px`">
      <div v-if="userStore.firstLogin" class="first-login"
        >新用户首次登录，需修改密码后方能正常使用</div
      >
      <BasicForm @register="registerForm" />
      <a-button @click="handleSubmit" type="primary"> 确认修改 </a-button>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { FormSchema } from '/@/components/Form';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useUserStore } from '/@/store/modules/user';
  import { Button as AButton } from 'ant-design-vue';
  import { validatePassword } from '/@/utils/validator';
  import { PageWrapper } from '/@/components/Page';

  export default defineComponent({
    components: { PageWrapper, BasicForm, AButton },
    props: {
      userData: { type: Object },
    },
    setup() {
      const { prefixCls } = useDesign('password');
      const schemas: FormSchema[] = [
        {
          field: 'staff-password-old', // 老密码
          component: 'InputPassword',
          label: '旧密码',
          required: true,
        },
        {
          field: 'staff-password',
          component: 'InputPassword',
          label: '新密码',
          rules: [
            {
              required: true,
              trigger: 'blur',
              validator: (_, val) => {
                const check = validatePassword(val);
                if (check) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  '长度为 8~32 位，包含大写字母、小写字母、数字、特殊字符中的3种',
                );
              },
            },
          ],
        },
      ];
      const userStore = ref(useUserStore());

      const [registerForm, { validate }] = useForm({
        // labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        showResetButton: false,
        submitButtonOptions: { text: '确认修改' },
        baseColProps: {
          span: 10,
        },
        actionColOptions: {
          span: 24,
        },
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          postApi(values);
        } catch (error) {
          console.error(error);
        }
      }

      function postApi(values) {
        userStore.value.changePassword(values);
      }

      return {
        schemas,
        registerForm,
        handleSubmit,
        prefixCls,
        userStore,
      };
    },
  });
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-password';
  .@{prefix-cls} {
    &-form {
      height: calc(100% - 100px);
      margin: 30px;
      padding: 20px;
      background-color: #fff;

      .ant-form-item {
        width: 350px;
        margin-bottom: 40px !important;
      }

      .first-login {
        margin-bottom: 20px;
        color: red;
      }
    }
  }
</style>
