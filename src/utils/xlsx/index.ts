import xlsx from 'node-xlsx';
import utils from 'src/utils/index';
import fs from 'fs';
import moment from 'moment';
import { cwd } from 'process';
import type { IData } from 'src/utils/index';
export type IndexDataType = any;
export type IndexType<T> = {
  data: Array<T>;
  name: string;
};
export type DataType = {
  [key in string]: string;
};
export type indexMapType = {
  [key in string]: any;
};
export interface IndexProps {
  complain: IData;
  meridian: IData;
  trina: IData;
  mapping: IData;
}
const {
  totalkey1,
  totalkey2,
  totalkey3,
  totalkey4,
  totalkey5,
  totalkey6,
  totalkey7,
  totalkey8,
  totalkey9,
  complaintNumberDefault,

  complaintkey2,
  complaintkey3,
  trinakey2,
  trinakey3,
  trinakey4,
  totalHeader,
  meridiankey7,
  meridiankey8
} = utils;
export default async ({ complain, meridian, trina, mapping }: IndexProps) => {
  const result = [];

  const complainData = complain.data;
  const meridianData = meridian.data;
  const trinaData = trina.data;
  const mappingData = mapping.data;
  const indexMap: string[] = [];
  totalHeader.forEach((name, index: number) => {
    (indexMap as any)[name] = index;
  });
  result[0] = totalHeader;
  // 地市 索引
  const cityIndex = indexMap[meridiankey7 as any];
  // 集团名称 索引
  const nameIndex = indexMap[meridiankey8 as any];
  // e55计费号 索引
  const e55Index = indexMap[totalkey1 as any];
  // 投诉编码 索引
  const complaintNumberIndex = indexMap[totalkey2 as any];
  // 出账收入 索引
  const outaccountIndex = indexMap[totalkey3 as any];
  // 码号数量 索引
  const codeNumberIndex = indexMap[totalkey4 as any];
  // 账户并发 索引
  const accountIndex = indexMap[totalkey5 as any];
  // 平均峰值并发 索引
  const averagePeakIndex = indexMap[totalkey6 as any];
  // 投诉总量 索引
  const complaintsIndex = indexMap[totalkey7 as any];
  // 催收投诉总量 索引
  const collectionIndex = indexMap[totalkey8 as any];
  // 是否AI 索引
  const aiIndex = indexMap[totalkey9 as any];
  for (let key in meridianData) {
    // const [e55, complaintNumber] = key.split(totalSpilt);
    // const item = data[key];
    const { data = 0, isAI = false, city = '', name = '', isNationalVoice = false } = meridianData[key];
    // 如果不是全国语音，不处理，继续处理下一条数据
    if (!isNationalVoice) continue;
    const item = new Array(totalHeader.length).fill(complaintNumberDefault);
    item[cityIndex as any] = city;
    item[nameIndex as any] = name;
    // 出账收入
    item[outaccountIndex as any] = data ?? '';
    // 是否AI
    item[aiIndex as any] = isAI ? '是' : '否';
    item[e55Index as any] = key;

    // 码号数量 账户并发 平均峰值并发
    const { name: companyName = '', complaintNumber = '', name2 = '' } = mappingData[key] || {};
    // 如果 companyName匹配不到，就使用name2匹配
    const valueObj = trinaData[companyName] || trinaData[name2];
    item[complaintNumberIndex as any] = complaintNumber;
    if (valueObj) {
      item[codeNumberIndex as any] = valueObj[trinakey2];
      item[accountIndex as any] = valueObj[trinakey3];
      item[averagePeakIndex as any] = valueObj[trinakey4];
    }
    // 投诉
    if (complaintNumber !== complaintNumberDefault) {
      const tempcomplaint = complainData[complaintNumber];
      if (tempcomplaint) {
        item[complaintsIndex as any] = tempcomplaint[complaintkey2];
        item[collectionIndex as any] = tempcomplaint[complaintkey3];
      }
    }
    result.push(item);
  }
  const buffer = xlsx.build([{ name: '汇总表', data: result, options: {} }]);
  fs.writeFileSync(`${cwd()}/汇总表${moment().format('YYYY-MM-DD')}.xlsx`, buffer);
  console.log(1111, '已生成');
};
