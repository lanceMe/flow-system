export const NotifyType = {
  Banner: 'Banner',
  Swiper: '首页轮播图',
};
export const NotifyMap = {
  Banner: 'Banner',
  Swiper: 'Swiper',
};

export const PhoneTail = [...Array(10)].map((_, i) => ({
  label: i,
  value: i,
}));
export const GrayscaleMap = {
  PhoneSuffix: 'phoneSuffix',
  RandomRatio: 'randomRatio',
  SpecificNumbers: 'specificNumbers',
};

export const GrayscaleType = {
  [GrayscaleMap.PhoneSuffix]: '手机尾号',
  [GrayscaleMap.RandomRatio]: '随机比例',
  [GrayscaleMap.SpecificNumbers]: '指定手机号',
};
export const FormatTime = 'YYYY-MM-DD HH:MM:SS';
