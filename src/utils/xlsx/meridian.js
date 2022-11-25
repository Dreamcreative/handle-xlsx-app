// 经分表

import xlsx from 'node-xlsx';
import utils from 'src/utils/index';
const {
  inputDir,
  outputDir,
  meridianName,

  meridiankey1,
  meridiankey2,
  meridiankey3,
  meridiankey4,
  meridiankey5,
  meridiankey6,
  meridiankey7,
  meridiankey8,
  replaceEnglishBracketsToChiniese
} = utils;
export default async path => {
  const data = {};
  const indexMap = {};
  const temp = {};

  console.log('正在读取...', meridianName);
  const meridian = xlsx.parse(path)[0];
  const meridianData = meridian.data || [];

  console.log('正在处理...', meridianName);
  const firstItem = meridianData.shift();
  firstItem.forEach((name, index) => {
    indexMap[name] = index;
  });
  meridianData.forEach(item => {
    const key = item[indexMap[meridiankey1]];
    if (!temp[key]) {
      temp[key] = [];
    }
    temp[key].push(item);
  });
  for (let key in temp) {
    const item = temp[key];
    const item0 = item[0];
    let city = item0[indexMap[meridiankey7]] || '';
    let name = item0[indexMap[meridiankey8]] || '';
    let isAI = false;
    let isNationalVoice = false;
    const result = item.reduce((total, cur) => {
      if (!isAI && cur[indexMap[meridiankey2]]?.indexOf(meridiankey6) > -1) {
        isAI = true;
      }
      if (cur[indexMap[meridiankey2]]?.indexOf(meridiankey5) > -1) {
        isNationalVoice = true;
        total += cur[indexMap[meridiankey3]] || 0;
      }
      return total;
    }, 0);
    data[key] = {
      // 数据按天统计值
      data: result,
      // 是否AI
      isAI: isAI,
      // 地市
      city: city,
      // 公司名称
      name: replaceEnglishBracketsToChiniese(name),
      isNationalVoice: isNationalVoice
    };
  }
  // {
  // e5537055432: {
  //   data: 0,
  //     isAI: false,
  //       city: '',
  //         name: '温州红源汽车销售服务有限公司',
  //           isNationalVoice: false
  // },
  // e5537056112: {
  //   data: 0,
  //     isAI: true,
  //       city: '',
  //         name: '平阳县五水共治建设美丽浙南水乡领导小组办公室',
  //           isNationalVoice: false
  // }
  // }
  return {
    data: data
  };
};
