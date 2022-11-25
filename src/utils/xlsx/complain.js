// 投诉分析表
import xlsx from 'node-xlsx';
import utils from 'src/utils/index';
const { complaintName, complaintkey1, complaintkey2, complaintkey3 } = utils;

export default async function handleComplaint(path) {
  const data = {};
  const indexMap = {};

  console.log('正在读取...', complaintName);
  const complaint = await xlsx.parse(path)[0];
  const complaintData = complaint.data || [];

  console.log('正在处理...', complaintName);
  complaintData.forEach((item, index) => {
    if (index === 0) {
      item.forEach((name, index) => {
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
