<template>
  <div style="width: 98%;margin: 0 1%;">
    <el-form v-model="querForm" label-width="30%">
      <el-row>
        <el-col :span=6 class="col">
          <el-form-item label="字典名称">
            <el-input v-model="querForm.dictLabel" placeholder="请输入字典名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=6 class="col">
          <el-form-item label="字典key值">
            <el-input v-model="querForm.dictKey" placeholder="请输入字典key值" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=2 :offset=10 class="col">
          <el-button type="success" size="medium" @click="queryData">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
  <basic-container>
    <el-row>
      <el-col :span=24>
        <el-button type="success" icon="el-icon-plus" size="small" @click="addDict">新增</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span=24>
        <el-table :data="tableData" border stripe default-expand-all :header-cell-style="{background:'#F5F7FA'}"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="id" style="margin-top: 10px">
          <el-table-column prop="dictLabel" label="字典名称" width="180" align="center">
          </el-table-column>
          <el-table-column prop="dictKey" label="字典key值" width="100" align="center">
          </el-table-column>
          <el-table-column prop="dictValue" label="字典键值" width="180" align="center">
          </el-table-column>
          <el-table-column prop="orgTypeName" label="组织类型" align="center">
          </el-table-column>
          <el-table-column prop="orgName" label="组织值" align="center">
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
          :current-page="page.currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="100"
          layout="total, sizes, prev, pager, next, jumper" :total="page.total" style="float: right;">
        </el-pagination>
      </el-col>
    </el-row>


    <el-drawer :title="draWerTitle" :visible.sync="drawer" :direction="direction" :before-close="handleClose"
      :wrapperClosable="false" :destroy-on-close="true" size="50%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级字典" prop="parentId">
          <avue-input v-model="form.parentId" placeholder="请选择内容" type="tree" :dic="parentDic" :props="dicProps">
          </avue-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="dictLabel">
          <el-input v-model="form.dictLabel"></el-input>
        </el-form-item>
        <el-form-item label="字典key" prop="dictKey">
          <el-input v-model="form.dictKey"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="form.dictValue"></el-input>
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
          <el-cascader v-model="form.orgValue" :options="options" :show-all-levels="false" :props="defaultProps">
          </el-cascader>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{submitText}}</el-button>
          <el-button @click="onCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </basic-container>
</div>
</template>

<script>
  import { dictList, getOrg, dictSubmit, dictRemove, dictUpdate, tree } from "../../api/update";

  export default {
    name: "dictConfig",
    data() {
      return {
        querForm: {},
        parentDic: [],
        submitText: '立即创建',
        tableData: [],
        page: { pageSize: '10', currentPage: 1, total: 0 },
        draWerTitle: '新增',
        drawer: false,
        defaultProps: { label: 'orgName', value: 'orgId' },
        dicProps: { label: 'title', value: 'value' },
        form: {
          "dictLabel": '',
          "dictKey": "",
          "dictValue": '',
          "orgType": '',
          'orgValue': ''
        },
        rules: {
          dictLabel: [
            { required: true, message: '请输入名字', trigger: 'blur' }
          ],
          dictKey: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
          dictValue: [
            { required: true, message: '请输入属性值', trigger: 'change' }
          ],
          orgValue: [
            { required: true, message: '请选择组织架构值', trigger: 'change' }
          ],
          orgType: [
            { required: true, message: '请选择组织类型', trigger: 'change' }
          ],

        },
        direction: 'rtl',
        options: [],

      }
    },
    mounted() {
      this.getDictList();
    },
    watch: {
      'form.orgType'() {
        console.log("orgType==" + this.form.orgType);
        if (this.form.orgType != '' && this.form.orgType != undefined) {
          this.getOrgData(this.form.orgType);
        }

      }

    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.getDictList();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.currentPage = val;
        this.getDictList();
      }, getDictList() {
        dictList(this.page.currentPage, this.page.pageSize,
          this.querForm.dictKey, this.querForm.orgValue, this.querForm.dictLabel).then(res => {
            let data = res.data.data;
            // const total = data.total;
            // const records = data.records;
            this.tableData = data;
            // this.page.total = total;
          });
      }, addDict() {
        tree().then(res => {
          this.drawer = true;
          this.form = {};
          this.parentDic = res.data.data;

        });
      }, handleClose(done) {
        done();
      }, getOrgData(orgType) {
        this.options = new Array();
        getOrg(orgType).then(res => {
          this.options = res.data.data;
        });
      }, onCancel() {
        this.drawer = false;
      }, onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let orgDesc = this.form.orgValue;
            let orgValue = orgDesc[orgDesc.length - 1];
            let rowData = this.form;
            rowData.orgValue = orgValue;
            rowData.orgDesc = orgDesc.join(",");
            if (this.draWerTitle === '新增') {
              dictSubmit(rowData).then(res => {
                this.drawer = false;
                this.getDictList();
              });
            } else {
              dictUpdate(rowData).then(res => {
                console.log(res);
                this.drawer = false;
                this.getDictList();
              });
            }
          }
        });
      }, handleDelClick(row) {
        let children = row.children;
        if (children != undefined && children.length > 0) {
          this.$confirm("该项包含子属性，确定将选择数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              return dictRemove(row.id)
            })
            .then(() => {
              this.getDictList();
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            });
        } else {
          this.$confirm("确定将选择数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              return dictRemove(row.id)
            })
            .then(() => {
              this.getDictList();
              this.$message({
                type: "success",
                message: "操作成功!"
              });
            });
        }


      }, updateClick(row) {

        tree().then(res => {
          this.parentDic = res.data.data;
          row.orgType = row.orgType + "";
          this.form = row;
          this.drawer = true;
          this.draWerTitle = '修改';
          this.submitText = '修改'

        });


      }, queryData() {
        this.page.currentPage = 1;
        this.getDictList();
      }
    }
  }
</script>

<style scoped>
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