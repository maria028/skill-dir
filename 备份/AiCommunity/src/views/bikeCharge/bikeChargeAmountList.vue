<template>
  <div style="width: 98%;margin: 0 1%;">
    <el-card style="margin-bottom: 1%;">
      <el-form label-width="30%" :model="query">
        <el-row>
          <el-col :span=6 class="col">
            <el-form-item label="小区名称">
              <avue-cascader v-model="query.mallId" :dic="communityOptions" :props="defaultProp"
                             placeholder="全部" clearable style="width: 100%;"></avue-cascader>
            </el-form-item>
          </el-col>
          <el-col :span=6 class="col">
            <el-form-item label="开始月份">
              <el-date-picker v-model="query.startDate" type="month" placeholder="选择日期"
                              :picker-options="pickerOptionsStart" value-format="yyyy-MM" clearable
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span=6 class="col">
            <el-form-item label="结束月份">
              <el-date-picker v-model="query.endDate" type="month" placeholder="选择日期"
                              :picker-options="pickerOptionsEnd" value-format="yyyy-MM" clearable
                              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span=2 :offset=4 class="col">
            <el-form-item>
              <el-button type="success" size="small" icon="el-icon-search" @click="getDateByMonthData"
                         style="background-color: #4cb678;float: right;margin-top: 7%;">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span=24>
          <el-table :data="tableData" stripe :header-cell-style="{background:'#D8E3FA'}"
                    :default-sort="{prop: '', order: ''}" border>
            <el-table-column type="index" width="50" fixed label="序号" align="center">
            </el-table-column>
            <el-table-column prop="month" label="月份" min-width align="center"></el-table-column>
            <el-table-column prop="name" width="120" label="小区" min-width align="center"></el-table-column>
            <el-table-column prop="degree" label="用电总量(度)" min-width align="center"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                         :current-page="pageNum" :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize"
                         layout="total, sizes, prev, pager, next, jumper" :total="total" style="float: right;"
                         background>
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>

</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { getUserMessage } from "../../api/house";
    import {getDateByMonth} from "../../api/business";

    export default {
        name: "bikeChargeAmountList",
        data(){
            return {
                query:{mallId: [], startDate: '', endDate: ''},
                pageSize: 50,
                pageNum: 1,
                total: 0,
                tableData: [],
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
                communityOptions: [],
                pickerOptionsStart: {
                    disabledDate: time => {
                        let endDateVal = this.query.endDate;
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                }, pickerOptionsEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.query.startDate;
                        if (beginDateVal) {
                            return (time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
                            );
                        }
                    }
                },
                roleType:''
            }
        }, computed: {
            ...mapGetters(["tenantId", "userInfo"])
        }, created() {
            this.getOrganization();
        }, methods: {      // 获取组织结构
            getOrganization() {
                let userOrgList = this.userInfo.userOrgList;
                let roleData = this.userInfo.roleList;
                let userOrgDesc = '';
                let userOrg = "";
                if (roleData.length > 0) {
                    this.roleType = roleData[0].roleType;
                }
                userOrgList.forEach(v => {
                    let orgId = v.orgId;
                    let orgDesc = v.orgDesc;
                    userOrgDesc = userOrgDesc + orgDesc + "#";
                    userOrg = userOrg + orgId + "#";
                });
                let that = this;
                this.communityOptions = new Array();
                this.communityOptions.push({"orgId":'',"orgName":"全部"})
                getUserMessage(userOrg, userOrgDesc, this.roleType).then(resp => {
                    this.screenRegion(resp.data.data);
                    that.query.mallId.push(that.communityOptions[0].orgId)
                    that.chooseDate();
                     that.getDateByMonthData();
                });
            },
            screenRegion(data) {
                data.forEach(v => {
                    if (v.children) {
                        this.screenRegion(v.children)
                    } else if (v.orgId.length >= 10) {
                        this.communityOptions.push(v)
                    }
                })
            },
            handleSizeChange(val) {
                this.pageSize = val
                 this.getDateByMonthData();
            },
            handleCurrentChange(val) {
                this.pageNum = val ? val : 1;
                 this.getDateByMonthData();
            }, chooseDate() {
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var date = myDate.getDate();
                if (month - 5 < 1) {
                    this.query.startDate = (year - 1) + '-' + this.conver(month + 7);
                    this.query.endDate = year + '-' + this.conver(month);
                } else {
                    this.query.startDate = year + '-' + this.conver(month - 5);
                    this.query.endDate = year + '-' + this.conver(month);
                }
            },conver(s) {
                return s < 10 ? '0' + s : s;
            },getDateByMonthData(){

                if (this.query.startDate == '' || this.query.startDate == null) {
                    this.$message.warning("请选择开始日期");
                    return
                }
                if (this.query.endDate == '' || this.query.endDate == null) {
                    this.$message.warning("请选择结束日期");
                    return
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                let starDate = this.query.startDate.replace("-","");
                let endDate = this.query.endDate.replace("-","");
                getDateByMonth(this.query.mallId[0],this.pageSize,this.pageNum,starDate,endDate)
                    .then(resp => {
                        this.tableData = resp.data.data.records;
                        this.total = resp.data.data.total;
                        loading.close()
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>
  .col {
    height: 35px;
  }

  @import "../../styles/style.scss";
</style>
