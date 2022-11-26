// 天合表

import xlsx from 'node-xlsx';
import utils from 'src/utils/index';
import type { IData } from 'src/utils/index';
export type trinaDataType = any;
export type trinaType<T> = {
  data: Array<T>;
  name: string;
};
export type DataType = {
  [key in string]: any;
};
export type indexMapType = {
  [key in string]: any;
};
const {
  trinaName,

  trinakey1,
  trinakey2,
  trinakey3,
  trinakey4,
  replaceEnglishBracketsToChiniese
} = utils;

export default async (path: string): Promise<IData> => {
  const data: DataType = {};
  const indexMap: indexMapType = {};

  console.log('正在读取...', trinaName);
  const trina: trinaType<trinaDataType> = xlsx.parse(path)[0];
  const trinaData: trinaDataType[] = trina.data;

  console.log('正在处理...', trinaName);
  trinaData.forEach((item: trinaDataType, index: number) => {
    if (index === 0) {
      item.forEach((name: string, index: number) => {
        indexMap[name] = index;
      });
    }
    if (index !== 0 && item[indexMap[trinakey1]]) {
      data[replaceEnglishBracketsToChiniese(item[indexMap[trinakey1]])] = {
        [trinakey2]: item[indexMap[trinakey2]],
        [trinakey3]: item[indexMap[trinakey3]],
        [trinakey4]: item[indexMap[trinakey4]]
      };
    }
  });
  // {
  //   '铸舜（上海）技术发展有限公司-后台添加': { '分配号码数': 1292, '平台配置并发数': 6000, '峰值': 45 },
  //   '卓越云讯（北京）科技有限公司': { '分配号码数': 7, '平台配置并发数': 150, '峰值': 7 }
  // }
  return {
    data: data
  };
};
