import { postUploadFile } from '/@/api/noti';
import { FormSchema } from '/@/components/Form';
import { encode } from '/@/utils/base64';
// tab的list
export const tabs = [
  {
    key: '1',
    name: '消费记录',
    component: 'ConsumRecord',
  },
  {
    key: '2',
    name: '到店记录',
    component: 'ArrivalRecord',
  },
  {
    key: '3',
    name: '上课记录',
    component: 'ClassRecord',
  },
  {
    key: '4',
    name: '会员资料',
    component: 'MemberProfile',
  },
];

export function getUserSchema(data): FormSchema[] {
  const { userData: d } = data || {};

  return [
    {
      field: 'nickname',
      component: 'Input',
      label: '昵称',
      required: true,
      defaultValue: d?.['nickname'],
    },
    {
      field: 'phone',
      component: 'Input',
      label: '手机号',
      required: true,
      defaultValue: d?.['phone_number'],
    },
    {
      field: 'avatar_fileid',
      component: 'ImageUpload',
      label: '头像',
      defaultValue: d?.['avatar_fileid'] || '',
      required: true,
      componentProps: {
        apiRespKey: 'data.url',
        api: (option) => {
          return new Promise((r, re) => {
            const { wxUserId } = d;
            const { file } = option;
            const params = {
              name: 'file',
              file,
              filename: encode(`avatar_${wxUserId}`),
            };
            postUploadFile(params)
              .then((resp) => {
                r(resp?.data?.url || '');
              })
              .catch((error) => {
                re(error);
              });
          });
        },
      },
    },
    {
      field: 'remarks',
      component: 'Input',
      defaultValue: d?.['remarks'] || '',
      label: '备注',
    },
  ];
}
