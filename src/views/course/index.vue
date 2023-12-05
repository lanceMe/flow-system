<template>
  <PageWrapper>
    <ASpace direction="vertical" style="width: 100%" size="middle">
      <ASpace style="display: flex; flex-direction: row-reverse" size="middle">
        <a-button type="primary" @click="linkTo('create')">创建课程</a-button>
      </ASpace>

      <a-table :columns="columns" :data-source="data" :scroll="{ x: 1000 }">
        <template #bodyCell="{ column }">
          <template v-if="column.key === 'operation'">
            <a-button type="link" @click="linkTo('view')">查看</a-button>
            <a-button type="link" @click="linkTo('edit')">编辑</a-button>
          </template>
        </template>
      </a-table>
    </ASpace>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import {
    Table,
    Form,
    FormItem,
    Input,
    Button,
    Select,
    SelectOption,
    DatePicker,
    Space,
  } from 'ant-design-vue';

  import { openWindow } from '/@/utils';
  import { PageWrapper } from '/@/components/Page';
  import dayjs from 'dayjs';
  import { useRoute, useRouter } from 'vue-router';

  export default defineComponent({
    components: {
      PageWrapper,
      ATable: Table,
      AForm: Form,
      AFormItem: FormItem,
      AInput: Input,
      AButton: Button,
      ASelect: Select,
      ASelectOption: SelectOption,
      ADatePicker: DatePicker,
      ASpace: Space,
    },
    setup() {
      const router = useRouter();

      return {
        dayjs,
        toIconify: () => {
          openWindow('https://iconify.design/');
        },
        data: [
          {
            key: '1',
            name: 'Mike',
            courseType: 32,
            num: 1,
            memberCard: 1,
            memberCardType: 'month',
            checkInTime: dayjs(),
            confirmType: 111,
            checkInType: 'wechat',
            memo: 777,
          },
        ],
        columns: [
          {
            title: '课程名称',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            fixed: 'left',
          },
          {
            title: '课程类别',
            dataIndex: 'courseType',
            key: 'courseType',
            width: 150,
          },
          {
            title: '课程种类',
            dataIndex: 'courseCategory',
            key: 'num',
            width: 150,
          },
          {
            title: '人数下限',
            dataIndex: 'minMember',
            key: 'minMember',
            width: 150,
          },
          {
            title: '人数上限',
            dataIndex: 'maxMember',
            key: 'maxMember',
            width: 150,
          },
          {
            title: '预约方式',
            dataIndex: 'bookType',
            key: 'bookType',
            width: 150,
          },
          {
            title: '卡种',
            dataIndex: 'card',
            key: 'card',
            width: 150,
          },
          {
            title: '课程价格',
            dataIndex: 'coursePrice',
            key: 'coursePrice',
            width: 150,
          },
          {
            title: '课程时长',
            dataIndex: 'courseLength',
            key: 'courseLength',
            width: 150,
          },
          {
            title: '是否允许候补',
            dataIndex: 'isAlternate',
            key: 'isAlternate',
            width: 150,
          },
          {
            title: '候补时间限制',
            dataIndex: 'alternateTime',
            key: 'alternateTime',
            width: 150,
          },
          {
            title: '课程介绍',
            dataIndex: 'courseIntro',
            key: 'courseIntro',
            width: 150,
          },
          {
            title: '课程介绍',
            dataIndex: 'courseIntro',
            key: 'courseIntro',
            width: 150,
          },
          {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            width: 200,
            fixed: 'right',
          },
        ],
        linkTo(type: string) {
          router.push({
            path: '/course/detail',
            // name: 'home',
            query: {
              type,
            },
          });
        },

        onSubmit() {},
        resetForm() {},
        formState: {
          phone: '',
          memberCardType: undefined,
          date: '',
        },
        getWeek() {
          const datas = dayjs().day();
          const week = ['日', '一', '二', '三', '四', '五', '六'];
          return '星期' + week[datas];
        },
        getDate() {
          return dayjs().format('YYYY-MM-DD');
        },
      };
    },
  });
</script>
