<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form label-width="30%" :model="query">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="手机号码">
                            <el-input clearable placeholder="请输入" v-model="query.phone" style="width: 100%;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="小区名称">
                            <avue-cascader v-model="query.mallId" :dic="options" :props="defaultProps" placeholder="请选择"
                                style="width: 100%;" @change="getDevice"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="交易设备">
                            <el-select v-model="query.deviceNo" clearable style="width: 100%;">
                                <el-option v-for="item in deviceOptions" :key="item.deviceNo" :label="item.deviceName"
                                    :value="item.deviceNo"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="交易状态">
                            <el-select v-model="query.payStatus" clearable placeholder="请选择" style="width: 100%;">
                                <el-option v-for="item in payOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="开始日期">
                            <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" clearable
                                :picker-options="pickerOptionsStart" style="width: 100%;" v-model="query.startDate">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="结束日期">
                            <el-date-picker type="date" placeholder="选择日期" value-format="yyyy-MM-dd" clearable
                                :picker-options="pickerOptionsEnd" style="width: 100%;" v-model="query.endDate">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=10 class="col">
                        <el-button type="success" icon="el-icon-search" size="small" @click="queryMsg"
                            style="background-color: #4cb678;float: right;margin-top: 7%;">
                            查询</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card>
            <el-row>
                <el-col :span=24>
                    <el-table :data="tabelData" stripe :header-cell-style="{background:'#D8E3FA'}"
                        :default-sort="{prop: '', order: ''}" border>
                        <el-table-column type="index" width="50" fixed label="序号" align="center">
                            <template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}}
                                </span></template>
                        </el-table-column>
                        <el-table-column prop="phone" label="手机号码" width="120" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="mallName" label="小区名称" min-width align="center"></el-table-column>
                        <el-table-column prop="deviceNo" label="交易设备" min-width align="center"></el-table-column>
                        <el-table-column prop="orderDesc" label="交易商品" min-width align="center"></el-table-column>
                        <el-table-column prop="totalPrice" label="应收金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="payPrice" label="实付金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="reducePrice" label="优惠金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="payType" label="支付方式" min-width align="center"></el-table-column>
                        <el-table-column prop="payDate" label="交易时间" min-width align="center"></el-table-column>
                        <el-table-column prop="outTradeNo" label="交易流水" min-width align="center"></el-table-column>
                        <el-table-column prop="payStatus" label="交易状态" min-width align="center"></el-table-column>
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
    import { getUserMessage, getTrading } from '../../api/house';
    import { getDeviceList } from '../../api/business'

    export default {
        name: 'trading',
        data() {
            return {
                query: { phone: '', startDate: '', endDate: '', mallId: [] },
                options: [],
                defaultProps: { label: 'orgName', value: 'orgId', checkStrictly: true },
                deviceOptions: [],
                payOptions: [{
                    value: '0',
                    label: '待支付',
                }, {
                    value: '1',
                    label: '已支付',
                }, {
                    value: '2',
                    label: '用户支付中',
                }, {
                    value: '3',
                    label: '待退款',
                }, {
                    value: '4',
                    label: '已退款',
                },{
                    value: '-1',
                    label: '支付失败',
                },{
                    value: '-2',
                    label: '退款失败',
                }],
                tabelData: [],
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
            this.getDevice();
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
                });
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
            getDevice(val) {
                if (typeof val == "object") {
                    val = val[val.length - 1];
                }
                getDeviceList(val).then(resp => {
                    let deviceArr = [];
                    resp.data.data.records.forEach(v => {
                        if (v.deviceType != "RRL4" && v.deviceType != "RRL2") {
                            deviceArr.push(v)
                        }
                    })
                    this.deviceOptions = deviceArr;
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
                if (this.query.payStatus == "") {
                    delete this.query.payStatus;
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
                getTrading(this.query.phone, this.query.mallId[this.query.mallId.length - 1],
                    this.query.deviceNo, this.query.payStatus, this.query.startDate, this.query.endDate,
                    this.pageSize, this.pageNum).then(resp => {
                        this.tabelData = resp.data.data.records;
                        for (var i = 0; i < that.tabelData.length; i++) {
                            switch (that.tabelData[i].payType) {
                                case "1":
                                    that.tabelData[i].payType = '账号';
                                    break;
                                case "2":
                                    that.tabelData[i].payType = '支付宝';
                                    break;
                                case "3":
                                    that.tabelData[i].payType = '微信';
                                    break;
                                case "4":
                                    that.tabelData[i].payType = '银联';
                                    break;
                                case "5":
                                    that.tabelData[i].payType = '积分';
                                    break;
                            };
                            switch (that.tabelData[i].payStatus) {
                                case "0":
                                    that.tabelData[i].payStatus = '待支付';
                                    break;
                                case "1":
                                    that.tabelData[i].payStatus = '已支付';
                                    break;
                                case "2":
                                    that.tabelData[i].payStatus = '用户支付中';
                                    break;
                                case "3":
                                    that.tabelData[i].payStatus = '待退款';
                                    break;
                                case "4":
                                    that.tabelData[i].payStatus = '已退款';
                                    break;
                                case "-1":
                                    that.tabelData[i].payStatus = '支付失败';
                                    break;
                                case "-2":
                                    that.tabelData[i].payStatus = '退款失败';
                                    break;
                            };
                            that.tabelData[i].totalPrice = that.tabelData[i].totalPrice / 100;
                            that.tabelData[i].payPrice = that.tabelData[i].payStatus == "已支付" ? that.tabelData[i].payPrice / 100 : 0;
                            that.tabelData[i].reducePrice = that.tabelData[i].reducePrice / 100;
                            that.tabelData[i].deviceNo = that.tabelData[i].deviceNo == "pcCharge" ? "PC充值" : that.tabelData[i].deviceNo;
                        }
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