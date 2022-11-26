// 映射表
import xlsx from 'node-xlsx';
import utils from 'src/utils/index';
import type { IData } from 'src/utils/index';
export type mappingDataType = any;
export type mappingType<T> = {
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
  mappingName,

  mappingkey1,
  mappingkey2,
  mappingkey3,
  mappingkey4,
  replaceEnglishBracketsToChiniese
} = utils;
export default async (path: string): Promise<IData> => {
  const data: mappingDataType = {};
  const indexMap: indexMapType = {};
  console.log('正在读取...', mappingName);
  const mapping: mappingType<mappingDataType> = await xlsx.parse(path)[0];
  const mappingData: mappingDataType[] = mapping.data || [];

  console.log('正在处理...', mappingName);
  mappingData.forEach((item, index) => {
    if (index === 0) {
      item.forEach((name: string, index: number) => {
        indexMap[name] = index;
      });
    }
    if (index !== 0 && item[indexMap[mappingkey1]]) {
      data[item[indexMap[mappingkey2]]] = {
        // 集团名称
        name: replaceEnglishBracketsToChiniese(item[indexMap[mappingkey1]]),
        // 投诉编号
        complaintNumber: item[indexMap[mappingkey3]],
        // name 不存在时，取name2
        name2: replaceEnglishBracketsToChiniese(item[indexMap[mappingkey4]])
      };
    }
  });
  // {
  // e5537048760: { name: '中共文成县委政法委员会', complaintNumber: undefined,name2: '中共文成县委政法委员会' },
  // e5539081828: { name: '中国人寿保险股份有限公司金华分公司', complaintNumber: undefined, name2: '中国人寿保险股份有限公司金华分公司'}
  // }
  return {
    data: data
  };
};
