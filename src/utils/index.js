const path = require('path');
const fs = require('fs');

export default {
  inputDir: 'input',
  outputDir: 'output',
  complaintName: '投诉分析表',
  meridianName: '经分表',
  trinaName: '天合表',
  mappingName: '映射表',
  totalName: '汇总表',

  trinakey1: '目标客户名称',
  trinakey2: '分配号码数',
  trinakey3: '平台配置并发数',
  trinakey4: '峰值',

  complaintkey1: '备注',
  complaintkey2: '投诉总量',
  complaintkey3: '违规催收',

  mappingkey1: '集团名称',
  mappingkey2: 'e55计费号',
  mappingkey3: '投诉编号',
  mappingkey4: '天合表名称',
  mappingkey5: '投诉分析表名称',

  meridiankey1: 'e55计费号',
  meridiankey2: '产品名称',
  meridiankey3: '当日优惠后消费金额',
  meridiankey4: '日期',
  meridiankey5: '全国语音',
  meridiankey6: 'AI',
  meridiankey7: '地市',
  meridiankey8: '集团名称',

  totalkey1: 'e55计费号',
  totalkey2: '投诉编号',
  totalkey3: '出账收入',
  totalkey4: '码号数量',
  totalkey5: '账户并发',
  totalkey6: '平均峰值并发',
  totalkey7: '投诉总量',
  totalkey8: '催收投诉总量',
  totalkey9: '是否AI',

  totalHeader: [
    '地市',
    '集团名称',
    'e55计费号',
    '投诉编号',
    '出账收入',
    '码号数量',
    '账户并发',
    '平均峰值并发',
    '投诉总量',
    '催收投诉总量',
    '非催收投诉总量',
    'ARPU值',
    '收入/并发',
    '收入/非催收投诉',
    '是否AI'
  ],

  totalSpilt: '_',
  complaintNumberDefault: '-',
  deleteFolderRecursive: function deleteFolderRecursive(url) {
    var files = [];
    /**
     * 判断给定的路径是否存在
     */
    if (fs.existsSync(url)) {
      /**
       * 返回文件和子目录的数组
       */
      files = fs.readdirSync(url);
      files.forEach(function (file, index) {
        var curPath = path.join(url, file);
        /**
         * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
         */
        if (fs.statSync(curPath).isDirectory()) {
          // recurse
          deleteFolderRecursive(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      /**
       * 清除文件夹
       */
      fs.rmdirSync(url);
    } else {
      console.log('给定的路径不存在，请给出正确的路径');
    }
  },
  // 将英文括号转为中午括号
  replaceEnglishBracketsToChiniese: function (name) {
    const reg = /(（|）)/gi;
    if (!name) return;
    name = name.replace(reg, match => {
      if (match === '（') return '(';
      if (match === '）') return ')';
    });
    return name;
  },
  environment: () => {
    var agent = navigator.userAgent.toLowerCase();
    var isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    if (agent.indexOf('win32') >= 0 || agent.indexOf('wow32') >= 0) {
      return 'windows';
    }
    if (agent.indexOf('win64') >= 0 || agent.indexOf('wow64') >= 0) {
      return 'windows';
    }
    if (isMac) {
      return 'mac';
    }
  }
};
