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
                        <el-form-item label="统计方式">
                            <el-select v-model="query.orderType" clearable style="width: 100%;" placeholder="全部"
                                @change="chooseDate">
                                <el-option v-for="item in orderOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="开始时间">
                            <el-date-picker v-model="query.startDate" type="date" placeholder="选择日期"
                                :picker-options="pickerOptionsStart" value-format="yyyy-MM-dd" clearable
                                style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="结束时间">
                            <el-date-picker v-model="query.endDate" type="date" placeholder="选择日期"
                                :picker-options="pickerOptionsEnd" value-format="yyyy-MM-dd" clearable
                                style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=2 :offset=22 class="col">
                        <el-form-item>
                            <el-button type="success" size="small" icon="el-icon-search" @click="queryMsg"
                                style="background-color: #4cb678;float: right;margin-top: 7%;">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card>
            <el-row>
                <el-col :span=24>
                    <span>实收金额：{{payPriceTotal}}元 优惠金额：{{reducePriceTotal}}元 交易笔数：{{tradeCount}}</span>
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
                        <!-- <el-table-column prop="" label="日期" min-width align="center"></el-table-column> -->
                        <el-table-column prop="mallName" label="商户名称" min-width align="center"></el-table-column>
                        <el-table-column prop="tradeCount" label="交易笔数" min-width align="center"></el-table-column>
                        <el-table-column prop="payPriceTotal" label="实收金额(元)" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="reducePriceTotal" label="优惠金额(元)" min-width align="center">
                        </el-table-column>
                        <!-- <el-table-column prop="aliPayTotal" label="支付宝(元)" min-width align="center" v-if="type">
                        </el-table-column>
                        <el-table-column prop="wxPayTotal" label="微信(元)" min-width align="center" v-if="type">
                        </el-table-column>
                        <el-table-column prop="accountPayTotal" label="余额支付(元)" min-width align="center" v-if="type">
                        </el-table-column> -->
                        <!-- <el-table-column prop="" label="银联(元)" min-width align="center" v-if="type"></el-table-column>
                        <el-table-column prop="" label="积分(元)" min-width align="center" v-if="type"></el-table-column> -->
                        <el-table-column prop="bikeChargeTotal" label="电瓶车充电(元)" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="shjChargeTotal" label="售货机(元)" key=1 min-width align="center"
                            v-if="type">
                        </el-table-column>
                        <el-table-column prop="syjChargeTotal" label="售药机(元)" min-width align="center" v-if="type">
                        </el-table-column>
                        <!-- <el-table-column prop="" label="账户充值(元)" min-width align="center" v-if="!type"></el-table-column>
                        <el-table-column prop="" label="新零售(元)" min-width align="center" v-if="!type"></el-table-column>
                        <el-table-column prop="" label="PC充值(元)" min-width align="center" v-if="!type"></el-table-column> -->
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
    import { getUserMessage } from "../../api/house"
    import { getBusinessIncome } from "../../api/business"
    import { getDeviceList } from "../../api/system/device"

    export default {
        name: 'operatingIncome',
        data() {
            return {
                query: { mallId: [], orderType: "0", startDate: '', endDate: '' },
                communityOptions: [],
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
                orderOptions: [{
                    value: '0',
                    label: '日报',
                }, {
                    value: '1',
                    label: '月报',
                }],
                tableData: [],
                SHJarr: [],
                CDBarr: [],
                type: true,
                payPriceTotal: '',
                reducePriceTotal: '',
                tradeCount: '',
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
            this.chooseDate();
            this.getDeviceMsg();
            this.queryMsg();
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
            getDeviceMsg() {
                getDeviceList(this.tenantId, 1, 500, null, 'SHJ').then(resp => {
                    this.SHJarr = resp.data.data.records;
                })
                getDeviceList(this.tenantId, 1, 500, null, 'CDB').then(resp => {
                    this.CDBarr = resp.data.data.records;
                })
            },
            chooseDate() {
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var date = myDate.getDate();
                if (this.query.orderType == "0") {
                    if (date == 1) {
                        if (month == 1) {
                            this.query.startDate = (year - 1) + '-' + this.conver(12) + "-" + this.conver(31);
                            this.query.endDate = (year - 1) + '-' + this.conver(12) + "-" + this.conver(31);
                        } else {
                            this.query.startDate = year + '-' + this.conver(month - 1) + "-" + this.conver(date);
                            this.query.endDate = year + '-' + this.conver(month - 1) + "-" + this.conver(date);
                        }
                    } else {
                        this.query.startDate = year + '-' + this.conver(month) + "-" + this.conver(date - 1);
                        this.query.endDate = year + '-' + this.conver(month) + "-" + this.conver(date - 1);
                    }
                } else {
                    this.query.startDate = year + '-' + this.conver(month) + "-" + this.conver(1);
                    this.query.endDate = year + '-' + this.conver(month) + "-" + this.conver(date);
                }
            },
            queryMsg() {
                // if (this.query.orderType == '' || this.query.orderType == null) {
                //     this.$message.warning("请选择统计方式");
                //     return
                // }
                let that =this
                if (this.query.startDate == '' || this.query.startDate == null) {
                    this.$message.warning("请选择开始日期");
                    return
                }
                if (this.query.endDate == '' || this.query.endDate == null) {
                    this.$message.warning("请选择结束日期");
                    return
                }
                // this.type = this.query.orderType == "0" ? true : false;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getBusinessIncome(this.query.mallId[0], this.query.startDate, this.query.endDate, this.pageSize, this.pageNum).then(resp => {
                    this.tableData = resp.data.data.businessIncomeList;
                    this.tableData.forEach(v => {
                        v.payPriceTotal = v.payPriceTotal / 100;
                        v.reducePriceTotal = v.reducePriceTotal / 100;
                        v.aliPayTotal = v.aliPayTotal / 100;
                        v.wxPayTotal = v.wxPayTotal / 100;
                        v.accountPayTotal = v.accountPayTotal / 100;
                        let bikeChargeTotal = v.bikeChargeTotal / 100;
                        let shjChargeTotal = v.shjChargeTotal / 100;
                        let syjChargeTotal = v.syjChargeTotal / 100;
                        v.bikeChargeTotal = "/";
                        v.shjChargeTotal = "/";
                        v.syjChargeTotal = "/";
                        this.CDBarr.forEach(k => {
                            if (v.mallId == k.mallId) {
                                v.bikeChargeTotal = bikeChargeTotal
                            }
                        })
                        this.SHJarr.forEach(k => {
                            if (v.mallId == k.mallId) {
                                v.shjChargeTotal = shjChargeTotal
                                v.syjChargeTotal = syjChargeTotal
                            }
                        })
                    })
                    this.payPriceTotal = resp.data.data.payPriceTotal / 100;
                    this.reducePriceTotal = resp.data.data.reducePriceTotal / 100;
                    this.tradeCount = resp.data.data.tradeCount;
                    this.type = !this.tableData.every(val => val.shjChargeTotal == "/");
                    loading.close();
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