// 投诉分析表
import xlsx from 'node-xlsx';
import utils from 'src/utils/index';
import type { IData } from 'src/utils/index';
const { complaintName, complaintkey1, complaintkey2, complaintkey3 } = utils;
export type DataType = {
  [key in string]: any;
};
export type indexMapType = {
  [key in string]: any;
};
export type complainDataType = any;
export type complainType<T> = {
  data: Array<T>;
  name?: string;
};
export default async function handleComplaint(path: string): Promise<IData> {
  const data: DataType = {};
  const indexMap: indexMapType = {};

  console.log('正在读取...', complaintName);
  const complaint: complainType<complainDataType> = await xlsx.parse(path)[0];
  const complaintData: complainDataType[] = complaint.data || [];

  console.log('正在处理...', complaintName);
  complaintData.forEach((item, index) => {
    if (index === 0) {
      item.forEach((name: string, index: number) => {
        indexMap[name] = index;
      });
    }
    if (index !== 0 && item[indexMap[complaintkey1]]) {
      data[item[indexMap[complaintkey1]]] = {
        [complaintkey2]: item[indexMap[complaintkey2]],
        [complaintkey3]: item[indexMap[complaintkey3]] ?? ''
      };
    }
  });
  // {
  // hzaf: { '投诉总量': 0, '违规催收': 0 },
  // bjxn: { '投诉总量': 0, '违规催收': 0 }
  // }
  return { data: data };
}
