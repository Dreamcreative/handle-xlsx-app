<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import type { UploadUserFile, UploadFile, UploadFiles, UploadProps } from 'element-plus';
import complain from 'src/utils/xlsx/complain';
import meridian from 'src/utils/xlsx/meridian';
import trina from 'src/utils/xlsx/trina';
import mapping from 'src/utils/xlsx/mapping';
import main from 'src/utils/xlsx/index';
import type { IData } from 'src/utils/index';

// 上传文件名称
const fileNames = ['天合表', '投诉分析表', '映射表', '经分表'];
// 文件后缀列表
// 上传文件列表
const fileLists = ref<UploadUserFile[]>([]);
// 上传成功文件名
const fileCompleteNames = ref<string[]>([]);
const handleChange: UploadProps['onChange'] = (files: UploadFile, uploadFiles: UploadFiles) => {
  const uniqueUpload = [];
  const fileSet = new Set<string>();
  for (let file of uploadFiles) {
    if (!fileSet.has(file.name)) {
      uniqueUpload.push(file);
      fileSet.add(file.name);
    } else {
      ElMessage.info(`${file.name}文件已上传，请选择其他文件`);
    }
  }
  fileCompleteNames.value = [...fileSet];
  fileLists.value = [...uniqueUpload];
};
const handleExceed = () => {
  ElMessage.info('最多只能上传4个文件');
};
const handleSubmit = async () => {
  if (fileLists.value?.length !== 4) {
    ElMessage.info('请上传全部文件后，再点击生成');
    return;
  }
  let complainData: IData = {
    data: {}
  };
  let meridianData: IData = {
    data: {}
  };
  let trinaData: IData = {
    data: {}
  };
  let mappingData: IData = {
    data: {}
  };
  for (let file of fileLists.value) {
    const { name, raw }: Pick<UploadFile, 'name' | 'raw'> = file;
    if (name.indexOf('投诉分析表') > -1) {
      complainData = await complain(raw?.path as any);
      continue;
    }
    if (name.indexOf('经分表') > -1) {
      meridianData = await meridian(raw?.path as any);
      continue;
    }
    if (name.indexOf('天合表') > -1) {
      trinaData = await trina(raw?.path as any);
      continue;
    }
    if (name.indexOf('映射表') > -1) {
      mappingData = await mapping(raw?.path as any);
      continue;
    }
  }

  await main({
    complain: complainData,
    meridian: meridianData,
    trina: trinaData,
    mapping: mappingData
  });
};
</script>

<template>
  <div class="uploadxlsx">
    <h3>处理 {{ fileNames.join('、') }} 生成汇总表</h3>
    <el-space>
      <div v-for="item in fileNames" :key="item">
        <el-tag :type="(fileCompleteNames + '').indexOf(item) > -1 ? 'success' : 'danger'">{{ item }}</el-tag>
      </div>
    </el-space>
    <el-upload
      class="upload"
      v-model:file-list="fileLists"
      multiple
      drag
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
      :auto-upload="false"
      :limit="4"
      :on-change="handleChange"
      :on-exceed="handleExceed"
    >
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">请上传 XLSX 格式文件</div>
      </template>
    </el-upload>
    <el-button class="uplaodBtn" type="primary" @click="handleSubmit">生成汇总表</el-button>
  </div>
</template>

<style scoped>
.uploadxlsx {
  height: 100%;
}
.upload {
  padding: 20px 0;
}
</style>
