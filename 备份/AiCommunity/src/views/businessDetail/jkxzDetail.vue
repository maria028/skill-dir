<template>
    <div style="width: 98%;margin: 0 1%">
        <el-card style="margin-bottom: 1%;">
            <el-form :model="queryData" label-width="30%">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="小区名称">
                            <avue-cascader v-model="queryData.mallId" :dic="communityOptions" :props="defaultProp"
                                placeholder="全部" clearable style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="手机号码">
                            <el-input v-model="queryData.phone" placeholder="请输入手机号码" clearable style="width: 100%;">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="测量时间">
                            <el-date-picker v-model="queryData.startDate" type="date" placeholder="选择日期"
                                value-format="yyyyMMdd" clearable style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=4 class="col">
                        <el-button type="success" icon="el-icon-search" size="small"
                            style="background-color: #4cb678;float: right;margin-top: 7%;" @click="query">查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card>
            <el-row>
                <el-col :span=24>
                    <el-table :data="tableData" stripe :header-cell-style="{background:'#D8E3FA'}"
                        :default-sort="{prop: '', order: ''}" border>
                        <el-table-column type="index" fixed label="序号" align="center">
                            <template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}}
                                </span></template>
                        </el-table-column>
                        <el-table-column prop="mallName" label="小区名称" min-width align="center"></el-table-column>
                        <el-table-column prop="cardNo" label="卡号" min-width align="center"></el-table-column>
                        <el-table-column prop="idCard" label="身份证号" min-width align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名" min-width align="center"></el-table-column>
                        <el-table-column prop="sex" label="性别" min-width align="center"></el-table-column>
                        <el-table-column prop="age" label="年龄" min-width align="center"></el-table-column>
                        <el-table-column prop="phoneNumber" label="手机号码" min-width align="center"></el-table-column>
                        <el-table-column prop="createTime" label="测量时间" min-width align="center"></el-table-column>
                        <el-table-column prop="height" label="身高" min-width align="center"></el-table-column>
                        <el-table-column prop="weight" label="体重" min-width align="center"></el-table-column>
                        <el-table-column prop="bmi" label="体重指数" min-width align="center"></el-table-column>
                        <el-table-column prop="hwResult" label="身高体重结论" min-width align="center"></el-table-column>
                        <el-table-column prop="ssy" label="收缩压" min-width align="center"></el-table-column>
                        <el-table-column prop="szy" label="舒张压" min-width align="center"></el-table-column>
                        <el-table-column prop="mb" label="脉搏" min-width align="center"></el-table-column>
                        <el-table-column prop="pressureResult" label="血压结论" min-width align="center"></el-table-column>
                        <el-table-column prop="temperature" label="体温值" min-width align="center"></el-table-column>
                        <el-table-column prop="tempResult" label="体温结论" min-width align="center"></el-table-column>
                        <el-table-column prop="oxygen" label="血氧饱和度" min-width align="center"></el-table-column>
                        <el-table-column prop="pulse" label="脉率" min-width align="center"></el-table-column>
                        <el-table-column prop="oxyResult" label="血氧结论" min-width align="center"></el-table-column>
                        <el-table-column prop="fatRate" label="体脂肪率" min-width align="center"></el-table-column>
                        <el-table-column prop="basicMetabolism" label="基础代谢" min-width align="center"></el-table-column>
                        <el-table-column prop="shape" label="体型" min-width align="center"></el-table-column>
                        <el-table-column prop="fatResult" label="体脂结论" min-width align="center"></el-table-column>
                        <el-table-column prop="bloodSugar" label="血糖值" min-width align="center"></el-table-column>
                        <el-table-column prop="bloodSugarResult" label="血糖结论" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="uricAcid" label="尿酸值" min-width align="center"></el-table-column>
                        <el-table-column prop="uricAcidResult" label="尿酸值结论" min-width align="center"></el-table-column>
                        <el-table-column prop="cholesterol" label="胆固醇" min-width align="center"></el-table-column>
                        <el-table-column prop="cholesterolResult" label="胆固醇结论" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="waist" label="腰围" min-width align="center"></el-table-column>
                        <el-table-column prop="hip" label="臀围" min-width align="center"></el-table-column>
                        <el-table-column prop="waistResult" label="腰围结论" min-width align="center"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pageNum" :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" style="float: right;">
                    </el-pagination>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { healthStationMsg } from '../../api/business';
    import { getUserMessage } from "../../api/house"

    export default {
        name: "jkxzDetail",
        data() {
            return {
                queryData: {},
                tableData: [],
                communityOptions: [],
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
                pageSize: 50,
                pageNum: 1,
                total: 0,
            }
        },
        computed: {
            ...mapGetters(["tenantId", "userInfo"])
        },
        created() {
            this.getOrganization();
        },
        methods: {
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
                getUserMessage(userOrg, userOrgDesc, this.roleType).then(resp => {
                    this.screenRegion(resp.data.data);
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
            query() {
                if (this.queryData.startDate) {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    healthStationMsg(this.queryData.mallId[0], this.queryData.startDate,
                        this.queryData.startDate, this.queryData.phone, this.pageSize, this.pageNum).then(resp => {
                            this.tableData = resp.data.data.records;
                            this.communityOptions.forEach(v => {
                                for (var i = 0; i < this.tableData.length; i++) {
                                    if (this.tableData[i].mallId == v.orgId) {
                                        this.tableData[i].mallName = v.orgName;
                                    }
                                }
                            })
                            this.total = resp.data.data.total;
                            this.pageSize = resp.data.data.size;
                            this.pageNum = resp.data.data.current;
                            loading.close();
                        })
                } else {
                    this.$message({
                        message: '请选择时间',
                        type: 'warning'
                    })
                }
            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.query();
            },
            handleCurrentChange() {
                this.pageNum = val ? val : 1;
                this.query();
            },
        }
    }
</script>

<style lang="scss" scoped>
    .col {
        height: 35px;
    }

    @import "../../styles/style.scss";
</style>