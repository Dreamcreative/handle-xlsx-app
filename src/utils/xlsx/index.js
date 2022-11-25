import xlsx from 'node-xlsx';
import utils from 'src/utils/index';
import fs from 'fs';
import path from 'path';
import { ElMessage } from 'element-plus';
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
  meridiankey8,
  environment
} = utils;
export default async ({ complain, meridian, trina, mapping }) => {
  const result = [];

  const complainData = complain.data || {};
  const meridianData = meridian.data || {};
  const trinaData = trina.data || {};
  const mappingData = mapping.data || {};
  const indexMap = [];
  totalHeader.forEach((name, index) => {
    indexMap[name] = index;
  });
  result[0] = totalHeader;
  // 地市 索引
  const cityIndex = indexMap[meridiankey7];
  // 集团名称 索引
  const nameIndex = indexMap[meridiankey8];
  // e55计费号 索引
  const e55Index = indexMap[totalkey1];
  // 投诉编码 索引
  const complaintNumberIndex = indexMap[totalkey2];
  // 出账收入 索引
  const outaccountIndex = indexMap[totalkey3];
  // 码号数量 索引
  const codeNumberIndex = indexMap[totalkey4];
  // 账户并发 索引
  const accountIndex = indexMap[totalkey5];
  // 平均峰值并发 索引
  const averagePeakIndex = indexMap[totalkey6];
  // 投诉总量 索引
  const complaintsIndex = indexMap[totalkey7];
  // 催收投诉总量 索引
  const collectionIndex = indexMap[totalkey8];
  // 是否AI 索引
  const aiIndex = indexMap[totalkey9];
  for (let key in meridianData) {
    // const [e55, complaintNumber] = key.split(totalSpilt);
    // const item = data[key];
    const { data = 0, isAI = false, city = '', name = '', isNationalVoice = false } = meridianData[key];
    // 如果不是全国语音，不处理，继续处理下一条数据
    if (!isNationalVoice) continue;
    const item = new Array(totalHeader.length).fill(complaintNumberDefault);
    item[cityIndex] = city;
    item[nameIndex] = name;
    // 出账收入
    item[outaccountIndex] = data ?? '';
    // 是否AI
    item[aiIndex] = isAI ? '是' : '否';
    item[e55Index] = key;

    // 码号数量 账户并发 平均峰值并发
    const { name: companyName = '', complaintNumber = '', name2 = '' } = mappingData[key] || {};
    // 如果 companyName匹配不到，就使用name2匹配
    const valueObj = trinaData[companyName] || trinaData[name2];
    item[complaintNumberIndex] = complaintNumber;
    if (valueObj) {
      item[codeNumberIndex] = valueObj[trinakey2];
      item[accountIndex] = valueObj[trinakey3];
      item[averagePeakIndex] = valueObj[trinakey4];
    }
    // 投诉
    if (complaintNumber !== complaintNumberDefault) {
      const tempcomplaint = complainData[complaintNumber];
      if (tempcomplaint) {
        item[complaintsIndex] = tempcomplaint[complaintkey2];
        item[collectionIndex] = tempcomplaint[complaintkey3];
      }
    }
    result.push(item);
  }
  const buffer = xlsx.build([{ name: '汇总表', data: result }]);
  fs.writeFileSync(`/汇总表.xlsx`, buffer);
  console.log(1111, '已生成');
};
