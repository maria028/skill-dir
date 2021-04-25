<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form label-width="30%" :model="query">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="手机号码">
                            <el-input clearable placeholder="请输入" style="width: 100%;" v-model="query.phone"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="开始时间">
                            <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" clearable
                                :picker-options="pickerOptionsStart" style="width: 100%;" v-model="query.startDate">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="结束时间">
                            <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" clearable
                                :picker-options="pickerOptionsEnd" style="width: 100%;" v-model="query.endDate">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="账户归属">
                            <avue-cascader v-model="query.mallId" :dic="options" :props="defaultProps" placeholder="请选择"
                                style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=2 :offset=22 class="col">
                        <el-form-item>
                            <el-button type="success" icon="el-icon-search" size="small" @click="queryMsg"
                                style="background-color: #4cb678;float: right;margin-top: 7%;">
                                查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card>
            <el-row>
                <el-col :span=24>
                    <span>充值金额：{{totalValue}}元 交易笔数：{{total}}</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span=24>
                    <el-table :data="tableData" stripe :header-cell-style="{background:'#D8E3FA'}"
                        :default-sort="{prop: '', order: ''}" border>
                        <el-table-column type="index" width="50" fixed label="序号" align="center">
                            <template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}}
                                </span></template>
                        </el-table-column>
                        <el-table-column prop="phone" label="手机号码" min-width align="center"></el-table-column>
                        <el-table-column prop="mallName" label="账户归属" min-width align="center"></el-table-column>
                        <el-table-column prop="userName" label="名字" min-width align="center"></el-table-column>
                        <el-table-column prop="value" label="充值金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="payMoney" label="实付金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="payType" label="支付方式" min-width align="center"></el-table-column>
                        <el-table-column prop="originalId" label="订单编号" min-width align="center"></el-table-column>
                        <el-table-column prop="createTime" label="充值时间" min-width align="center"></el-table-column>
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
    import { accountLogList, getUserMessage } from '../../api/house';

    export default {
        name: 'top-up',
        data() {
            return {
                query: { phone: '', startDate: '', endDate: '', mallId: [] },
                options: [],
                defaultProps: { label: 'orgName', value: 'orgId', checkStrictly: true },
                tableData: [],
                totalValue: 0,
                pageSize: 50,
                pageNum: 1,
                total: 0,
                pickerOptionsStart: {
                    disabledDate: time => {
                        let endDateVal = this.query.endDate;
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.query.startDate;
                        if (beginDateVal) {
                            return (time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
                            );
                        }
                    }
                }
            }
        },
        computed: {
            ...mapGetters(["tenantId", "userInfo"])
        },
        created() {
            this.getOrganization();
            if (this.$route.query.accountId) {
                let route = this.$route.query
                this.query.phone = route.phone;
                this.query.mallId = [];
                this.query.mallId.push(route.mallId);
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var date = myDate.getDate();
                this.query.startDate = year + '-' + this.conver(month - 3) + "-" + this.conver(date);
                this.query.endDate = year + '-' + this.conver(month) + "-" + this.conver(date);
                this.queryMsg();
            }
        },
        methods: {
            // 获取组织结构
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
                })
            },
            screenRegion(data) {
                data.forEach(v => {
                    if (v.children) {
                        this.screenRegion(v.children)
                    } else if (v.orgId.length >= 10) {
                        this.options.push(v)
                    }
                })
            },
            queryMsg() {
                let that = this
                if (this.query.phone == "") {
                    delete this.query.phone;
                }
                if (this.query.deviceNo == "") {
                    delete this.query.deviceNo;
                }
                if (this.query.payType == "") {
                    delete this.query.payType;
                }
                if (this.query.startDate == '' || this.query.startDate == null) {
                    this.$message.warning("请选择开始时间");
                    return;
                }
                if (this.query.endDate == '' || this.query.endDate == null) {
                    this.$message.warning("请选择结束时间");
                    return;
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                accountLogList(this.query.phone, this.query.startDate, this.query.endDate,
                    this.query.mallId[this.query.mallId.length - 1], "1", this.pageSize, this.pageNum).then(resp => {
                        this.tableData = resp.data.data.page.records;
                        this.pageSize = resp.data.data.page.size;
                        this.pageNum = resp.data.data.page.current;
                        this.total = resp.data.data.page.total;
                        this.totalValue = resp.data.data.totalValue / 100;
                        for (var i = 0; i < this.tableData.length; i++) {
                            this.tableData[i].value = this.tableData[i].value / 100;
                            this.tableData[i].payMoney = this.tableData[i].payMoney / 100;
                            switch (this.tableData[i].payType) {
                                case "1":
                                    this.tableData[i].payType = '账号';
                                    break;
                                case "2":
                                    this.tableData[i].payType = '支付宝';
                                    break;
                                case "3":
                                    this.tableData[i].payType = '微信';
                                    break;
                                case "4":
                                    this.tableData[i].payType = '银联';
                                    break;
                                case "5":
                                    this.tableData[i].payType = '积分';
                                    break;
                            }
                        }
                        loading.close()
                    })
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.queryMsg();
            },
            handleCurrentChange(val) {
                this.pageNum = val ? val : 1;
                this.queryMsg();
            },
            conver(s) {
                return s < 10 ? '0' + s : s;
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