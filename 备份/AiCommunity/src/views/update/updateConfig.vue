<template>
  <div style="width: 98%;margin: 0 1%;">
    <el-form v-model="querForm" label-width="30%">
      <el-row>
        <el-col :span=6 class="col">
          <el-form-item label="包名">
            <el-input v-model="querForm.packageName" placeholder="请输入完整的包名" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=2 :offset=16 class="col">
          <el-form-item>
            <el-button type="success" size="medium" @click="queryData">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-card>
      <el-row>
        <el-col :span=24>
          <el-button type="success" size="small" icon="el-icon-plus" @click="addUpdate">新增</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=24>
          <el-table :data="tableData" border stripe :header-cell-style="{background:'#F5F7FA'}">
            <el-table-column prop="fileTypeName" label="文件类型" width="180" align="center">
            </el-table-column>
            <el-table-column prop="versionCode" label="版本Code" width="100" align="center">
            </el-table-column>
            <el-table-column prop="versionName" label="版本名称" width="100" align="center">
            </el-table-column>
            <el-table-column prop="packageName" label="包名" width="180" align="center">
            </el-table-column>
            <el-table-column prop="orgTypeName" label="组织类型" align="center">
            </el-table-column>
            <el-table-column prop="orgName" label="组织值" align="center">
            </el-table-column>
            <el-table-column prop="updateDesc" label="描述" align="center">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
                <el-button @click="updateClick(scope.row)" type="text" size="small">修改</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=24>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" background
            layout="total, sizes, prev, pager, next, jumper" :total="page.total" style="float: right;">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-drawer :title="draWerTitle" :visible.sync="drawer" :direction="direction" :before-close="handleClose"
      :wrapperClosable="false" :open="openDrawer" :destroy-on-close="true" size="50%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="附件版本" prop="fileVerson">
          <el-select filterable placeholder="请输入关键词" v-model="form.fileVerson" @change="selectChange">
            <el-option v-for="item in fileVersonData" :key="item.id" :label="item.label" :value="item.id"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="附件类型" prop="fileType">
          <el-radio-group v-model="form.fileType">
            <el-radio label="0">apk应用</el-radio>
            <el-radio label="1">补丁包</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload class="upload-demo" action="#" :on-preview="handlePreview" :on-remove="handleRemove"
            :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList"
            :auto-upload=false :on-change="onchange">
            <el-button size="small" type="primary">文件上传</el-button>
            <div slot="tip" style="color: red;display: none" id="uploadTip">请上传附件！</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="SDK版本" prop="sdkVersion">
          <el-radio-group v-model="form.sdkVersion">
            <el-radio label="0">全部</el-radio>
            <el-radio label="1">7.0版本以上</el-radio>
            <el-radio label="2">7.0版本以下</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="版本Code" label-width="90px" prop="versionCode">
          <el-input v-model="form.versionCode" type="number"></el-input>
        </el-form-item>
        <el-form-item label="版本名称" prop="versionName">
          <el-input v-model="form.versionName"></el-input>
        </el-form-item>
        <el-form-item label="包名" prop="packageName">
          <el-input v-model="form.packageName"></el-input>
        </el-form-item>
        <el-form-item label="升级类型" prop="updateType">
          <el-radio-group v-model="form.updateType">
            <el-radio label="0">静默升级</el-radio>
            <el-radio label="1">强制升级</el-radio>
            <el-radio label="2">UI提示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组织类型" prop="orgType">
          <el-select v-model="form.orgType" placeholder="请选择组织类型">
            <el-option label="全部" value="0"></el-option>
            <el-option label="省" value="1"></el-option>
            <el-option label="市" value="2"></el-option>
            <el-option label="区/县" value="3"></el-option>
            <el-option label="街道" value="4"></el-option>
            <el-option label="网点" value="5"></el-option>
            <el-option label="设备" value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组织值" prop="orgValue">
          <el-cascader v-model="form.orgValue" :options="options" :show-all-levels="false" :props="defaultProps"
            filterable></el-cascader>
        </el-form-item>
        <el-form-item label="描述" prop="updateDesc">
          <el-input v-model="form.updateDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{submitText}}</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

  </div>


</template>

<script>
  import { saveAndUploadImage, getOrg, list, remove, update, updateFile, getUpdateByDevice, listUpdateConfig } from "../../api/update";
  import { mapGetters, mapState } from "vuex";
  import form from "../util/form";
  export default {
    name: "updateConfig",
    data() {
      return {
        value: '',
        fileVersonData: [],
        querForm: {},
        submitText: '立即创建',
        defaultProps: { label: 'orgName', value: 'orgId' },
        options: [],
        page: { pageSize: '10', currentPage: 1, total: 0 },
        form: {
          "orgValue": '',
          "orgType": "",
          "updateType": '0',
          "packageName": '',
          'fileType': '0',
          'versionCode': '',
          "versionName": '',
          "updateDesc": '',
          "fileVerson": '',
          'sdkVersion': '0'
        },
        rules: {
          packageName: [
            { required: true, message: '请输入包名', trigger: 'blur' }
          ],
          versionCode: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
          versionName: [{ required: true, message: '请输入版本名称', trigger: 'blur' }],
          orgValue: [
            { required: true, message: '请选择组织架构值', trigger: 'change' }
          ],
          orgType: [
            { required: true, message: '请选择组织类型', trigger: 'change' }
          ],
          updateType: [
            { required: true, message: '请选择更新类型', trigger: 'change' }
          ], fileType: [
            { required: true, message: '请选择文件类型', trigger: 'change' }
          ], sdkVersion: [{ required: true, message: '请选择SDK类型', trigger: 'change' }]
        },
        fileList: [],
        draWerTitle: '新增',
        tableData: [],
        drawer: false,
        uploadFile: null,
        uploadFileName: '',
        uploadFilePath: '',
        uploadMD5Code: '',
        direction: 'rtl',
        selectDataObj: {}
      }
    },
    computed: {
      ...mapState({}),
      ...mapGetters(['tenantId', "userInfo", 'language'])
    },
    mounted() {
      this.getList();
      getUpdateByDevice('RRT1', '4311', 'com.ist.temp').then(res => {
        console.log(res);
      });
    },
    watch: {
      'form.orgType'() {
        console.log("orgType==" + this.form.orgType);
        if (this.form.orgType != null && this.form.orgType != undefined) {
          this.getOrgData(this.form.orgType);
        }

      }

    },
    methods: {
      selectChange(val) {
        const data = this.selectDataObj[val];
        this.form.updateType = data.updateType + "";
        this.form.packageName = data.packageName;
        this.form.fileType = data.fileType + "";
        this.form.versionCode = data.versionCode;
        this.form.versionName = data.versionName;
        this.form.updateDesc = data.updateDesc;
        let fileList = new Array();
        const filePath = data.filePath;
        this.uploadFilePath = filePath;
        this.uploadMD5Code = data.md5Code;
        const file = {};
        var originFileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        file.name = originFileName;
        fileList.push(file);
        this.fileList = fileList;

      },
      openDrawer() {
        console.log("打开了drawer")
        this.getOrgData(0);
      },
      getOrgData(orgType) {
        this.options = new Array();
        getOrg(orgType).then(res => {
          this.options = res.data.data;
        });
      },
      handleClose(done) {
        done();
      }, addUpdate() {
        listUpdateConfig().then(res => {
          console.log(res);
          let data = res.data.data;
          const selectData = new Array();
          data.forEach(v => {
            let versionName = v.versionName;
            let packageName = v.packageName;
            v.label = packageName + "_" + versionName;
            this.selectDataObj[v.id] = v;
            selectData.push(v)
          })
          this.fileVersonData = selectData;
          this.drawer = true;
          this.uploadFileName = '';
          this.uploadFile = null;
          this.fileList = new Array();
          this.draWerTitle = '新增';
          this.submitText = '立即创建'
          const f = {
            "orgValue": '',
            "orgType": "",
            "updateType": '0',
            "packageName": '',
            'fileType': '0',
            'versionCode': '',
            "versionName": '',
            "updateDesc": '',
            "fileVerson": '',
            'sdkVersion': '0'
          };
          this.form = f;

        });

      }, handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.fileList = files;
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件，请删除之前选择的文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);

      }, onchange(file, filesList) {
        console.log(file);
        this.uploadFile = file.raw;
        this.uploadFileName = file.name;
      }, onSubmit() {
        console.log(this.form);
        this.$refs['form'].validate((valid) => {
          if (valid) {

            if (this.draWerTitle === '新增') {
              if (this.uploadFile === null && this.uploadFilePath === '') {
                document.getElementById("uploadTip").style.display = 'block';
                return;
              }
              document.getElementById("uploadTip").style.display = 'none';
              let formData = new FormData();
              let fileType = this.form.fileType;
              let updateType = this.form.updateType;
              let orgValue = this.form.orgValue;

              formData.append('orgDesc', orgValue);
              formData.append('orgValue', orgValue[orgValue.length - 1]);
              formData.append("versionCode", this.form.versionCode);
              formData.append("fileType", fileType);
              formData.append("versionName", this.form.versionName);
              formData.append("packageName", this.form.packageName);
              formData.append("updateType", updateType);
              formData.append("orgType", this.form.orgType);
              formData.append("updateDesc", this.form.updateDesc);
              formData.append("uploadFilePath", this.uploadFilePath);
              formData.append("uploadMD5Code", this.uploadMD5Code);
              formData.append("sdkVersion", this.form.sdkVersion);
              if (this.uploadFile != null) {
                formData.append('file', this.uploadFile);
                formData.append('fileName', this.uploadFileName);
              }
              saveAndUploadImage(formData).then(res => {
                this.drawer = false;
                this.getList();
              });
            } else {

              if (this.uploadFile == null) {
                const orgValue = this.form.orgValue;
                this.form.orgDesc = orgValue.join(",");
                this.form.orgValue = orgValue[orgValue.length - 1];
                this.form.fileType = Number(this.form.fileType);
                this.form.updateType = Number(this.form.updateType);
                this.form.orgType = Number(this.form.orgType);
                this.form.uploadFilePath = this.uploadFilePath;
                this.form.uploadMD5Code = this.uploadMD5Code;
                update(this.form).then(res => {
                  this.drawer = false;
                  this.getList();
                });
              } else {
                let formData = new FormData();
                let fileType = this.form.fileType;
                let updateType = this.form.updateType;
                let orgValue = this.form.orgValue;
                formData.append('id', this.form.id);
                formData.append('orgDesc', orgValue);
                formData.append('orgValue', orgValue[orgValue.length - 1]);
                formData.append("versionCode", this.form.versionCode);
                formData.append("fileType", fileType);
                formData.append("packageName", this.form.packageName);
                formData.append("updateType", updateType);
                formData.append("orgType", this.form.orgType);
                formData.append("versionName", this.form.versionName);
                formData.append("updateDesc", this.form.updateDesc);
                formData.append("uploadFilePath", this.uploadFilePath);
                formData.append("uploadMD5Code", this.uploadMD5Code);
                formData.append("sdkVersion", this.form.sdkVersion);
                if (this.uploadFile != null) {
                  formData.append('file', this.uploadFile);
                  formData.append('fileName', this.uploadFileName);
                }
                updateFile(formData).then(res => {
                  this.drawer = false;
                  this.getList();
                });
              }

            }

          } else {
            return false;
          }
        });


      }, onCancel() {
        this.drawer = false;
      }, queryData() {
        this.page.currentPage = 1;
        this.getList();
      }, getList() {
        if (this.querForm.packageName === '') {
          this.querForm.packageName = null;
        }
        list(this.page.currentPage, this.page.pageSize, this.querForm.packageName).then(res => {
          console.log(res);
          let data = res.data.data;
          const total = data.total;
          const records = data.records;
          this.tableData = records;
          this.page.total = total;
        });
      }, handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.currentPage = val;
        this.getList();

      }, handleDelClick(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.getList();
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });


      }, updateClick(row) {
        console.log(row);
        row.fileType = row.fileType + "";
        row.updateType = row.updateType + "";
        row.orgType = row.orgType + "";
        row.orgValue = row.orgDesc.split(",");
        let fileList = new Array();
        const filePath = row.filePath;
        const file = {};
        var originFileName = filePath.substr(filePath.lastIndexOf('/') + 1);
        file.name = originFileName;
        fileList.push(file);
        this.fileList = fileList;
        this.drawer = true;
        this.draWerTitle = '修改';
        this.submitText = '立即修改'
        this.uploadFileName = '';
        this.uploadFile = null;
        this.form = row;
      }
    }
  }
</script>

<style scoped>
  /deep/ .el-drawer__body {
    height: 0px;
    overflow: auto;
  }

  /deep/.el-table--small {
    font-size: 14px;
  }

  /deep/.avue-crud .el-table th {
    color: #909399;
  }

  .col {
    height: 45px;
  }

  /deep/.el-button--primary {
    background-color: #4cb678;
    border-color: #4cb678
  }

  /deep/.avue-crud .el-table th {
    background: #F5F7FA;
  }

  /deep/.avue-crud {
    width: 100%;
  }
</style>