<template>
  <div style="width: 98%;margin:0 1%">
    <el-card style="margin-bottom:1%;">
    <el-form :model="querForm" label-width="30%">
      <el-row>
        <el-col :span=6 class="col"> 
          <el-form-item label="设备编号">
            <el-input v-model="querForm.deviceNo" clearable placeholder="请输入设备编号" style="width: 100%;"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span=2 :offset=16 class="col">
          <el-form-item>
            <el-button type="success" icon="el-icon-search" size="small" style="background-color: #4cb678;float: right;margin-top: 7%;" @click="queryData">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span=24>
          <el-table :data="tableData" stripe  :header-cell-style="{background:'#F5F7FA'}"
          :default-sort="{prop: '', order: ''}" border>
            <el-table-column type="expand" align='center'>
              <template slot-scope="props">
                <el-table :data="props.row.dictConfigVOList" style="width: 100%">
                  <el-table-column prop="dictLabel" label="字典名称" width="180" align='center'>
                  </el-table-column>
                  <el-table-column prop="dictKey" label="字典key值" width="100" align='center'>
                  </el-table-column>
                  <el-table-column prop="dictValue" label="字典键值" width="180" align='center'>
                  </el-table-column>
                  <el-table-column prop="orgTypeName" label="组织类型" align='center'>
                  </el-table-column>
                  <el-table-column prop="orgName" label="组织值" align='center'>
                  </el-table-column>
      
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="设备编号" prop="deviceNo" align='center'>
            </el-table-column>
            <el-table-column label="设备名称" prop="deviceName" align='center'>
            </el-table-column>
            <el-table-column label="网点名称" prop="mallName" align='center'>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=24>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
          :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10"
          layout="total, sizes, prev, pager, next, jumper" :total="page.total" style="float: right;">
        </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  import { getDeviceConfig } from "../../../api/system/device";
  import { mapGetters, mapState } from "vuex";

  export default {
    name: "DeviceConfig",
    data() {
      return {
        querForm: {},
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        tableData: []
      }
    },
    computed: {
      ...mapState({}),
      ...mapGetters(['tenantId'
      ])
    },
    mounted() {
      this.getDeviceConfigData();
    },
    methods: {
      queryData() {
        this.page.currentPage = 1;
        this.getDeviceConfigData();

      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.getDeviceConfigData();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.currentPage = val;
        this.getDeviceConfigData();
      },
      getDeviceConfigData() {
        const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
        getDeviceConfig(this.tenantId, this.page.currentPage, this.page.pageSize, this.querForm.deviceNo).then(res => {
          const data = res.data.data;
          this.tableData = data.records;
          this.page.total = Number(data.total);
          loading.close()
        });
      }
    }

  }
</script>

<style lang="scss" scoped>
  .col{
    height: 45px;
  }
  @import "../../../styles/style.scss"
</style>