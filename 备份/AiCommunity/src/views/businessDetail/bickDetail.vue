<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom:1%;">
            <el-form :model="queryData" label-width="30%">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="小区名称">
                            <avue-cascader v-model="queryData.mallId" :dic="communityOptions" :props="defaultProp"
                                placeholder="全部" clearable style="width: 100%;" @change="selectDevice"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="充电站">
                            <avue-cascader v-model="queryData.deviceNo" :dic="deviceOptions" :props="defaultProp"
                                placeholder="全部" clearable style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="插座编号">
                            <el-select v-model="queryData.connectorNumber" placeholder="全部" clearable
                                style="width: 100%;">
                                <el-option v-for="item in deviceNumOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="日期">
                            <el-date-picker v-model="queryData.startTime" type="date" placeholder="选择日期"
                                value-format="yyyyMMdd" clearable style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="支付方式">
                            <el-select v-model="queryData.payType" placeholder="全部" clearable style="width: 100%;">
                                <el-option v-for="item in payOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="充电状态">
                            <el-select v-model="queryData.status" placeholder="全部" clearable style="width: 100%;">
                                <el-option v-for="item in staOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=10 class="col">
                        <el-form-item>
                            <el-button type="success" icon="el-icon-search" size="small"
                                style="background-color: #4cb678;float: right;margin-top: 7%;" @click="findBickDetail">
                                查询</el-button>
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
                            <template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}}
                                </span></template>
                        </el-table-column>
                        <el-table-column prop="deviceNo" label="充电站名称" min-width align="center"></el-table-column>
                        <el-table-column prop="chargeId" label="订单编号" min-width align="center"></el-table-column>
                        <el-table-column prop="connectorNumber" label="插座号" min-width align="center"></el-table-column>
                        <el-table-column prop="preHour" label="预充时间(h)" min-width align="center"></el-table-column>
                        <el-table-column prop="startTime" label="开始时间" min-width align="center"></el-table-column>
                        <el-table-column prop="endTime" label="结束时间" min-width align="center"></el-table-column>
                        <el-table-column prop="seconds" label="实际充电时长min" min-width align="center"></el-table-column>
                        <el-table-column prop="degree" label="耗电量(度)" min-width align="center"></el-table-column>
                        <el-table-column prop="totalFee" label="应收金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="payFee" label="实收金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="reduceFee" label="优惠金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="scoreFee" label="积分抵扣金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="createTime" label="订单时间" min-width align="center"></el-table-column>
                        <el-table-column prop="payType" label="支付方式" min-width align="center"></el-table-column>
                        <el-table-column prop="status" label="订单状态" min-width align="center"></el-table-column>
                        <el-table-column prop="statusDesc" label="订单描述" min-width align="center"></el-table-column>
                        <el-table-column prop="phone" label="充电用户" min-width align="center"></el-table-column>
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
    import { findBickMsg, getPermissionDevice } from '../../api/business';
    import { getUserMessage } from "../../api/house"

    export default {
        name: "bickDetail",
        data() {
            return {
                queryData: {

                },
                payOptions: [{
                    value: '0',
                    label: '其他',
                }, {
                    value: '1',
                    label: '账号余额支付',
                }, {
                    value: '2',
                    label: '支付宝',
                }, {
                    value: '3',
                    label: '微信',
                }],
                staOptions: [{
                    value: '0',
                    label: '待支付',
                }, {
                    value: '1',
                    label: '开始充电',
                }, {
                    value: '2',
                    label: '充电中',
                }, {
                    value: '3',
                    label: '充电完成',
                }, {
                    value: '4',
                    label: '待退款',
                }, {
                    value: '5',
                    label: '已退款',
                }, {
                    value: '6',
                    label: '停止充电',
                }],
                deviceNumOptions: [{
                    value: '1',
                    label: '1号插座',
                }, {
                    value: '2',
                    label: '2号插座',
                }, {
                    value: '3',
                    label: '3号插座',
                }, {
                    value: '4',
                    label: '4号插座',
                }, {
                    value: '5',
                    label: '5号插座',
                }, {
                    value: '6',
                    label: '6号插座',
                }, {
                    value: '7',
                    label: '7号插座',
                }, {
                    value: '8',
                    label: '8号插座',
                }, {
                    value: '9',
                    label: '9号插座',
                }, {
                    value: '10',
                    label: '10号插座',
                }],
                tableData: [],
                communityOptions: [],
                deviceOptions: [],
                allDeviceOptions: [],
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
            // this.findBickDetail();
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
                getPermissionDevice(userOrg, userOrgDesc, this.roleType, "CDB").then(resp => {
                    this.screenDevice(resp.data.data)
                })
            },
            findBickDetail() {
                if (this.queryData.startTime) {
                    const loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });
                    findBickMsg(this.queryData.mallId[0], this.queryData.deviceNo[1], this.queryData.connectorNumber,
                        this.queryData.startTime, this.queryData.startTime, this.queryData.status, this.queryData.payType, this.pageSize, this.pageNum).then(resp => {
                            this.tableData = resp.data.data.records;
                            this.total = resp.data.data.total;
                            this.pageSize = resp.data.data.size;
                            this.pageNum = resp.data.data.current;
                            let that = this;
                            for (var i = 0; i < that.tableData.length; i++) {
                                switch (that.tableData[i].payType) {
                                    case 0:
                                        that.tableData[i].payType = '其他';
                                        break;
                                    case 1:
                                        that.tableData[i].payType = '账号余额支付';
                                        break;
                                    case 2:
                                        that.tableData[i].payType = '支付宝';
                                        break;
                                    case 3:
                                        that.tableData[i].payType = '微信';
                                        break;
                                }
                                that.tableData[i].totalFee = resp.data.data.records[i].totalFee / 100
                                that.tableData[i].payFee = resp.data.data.records[i].status == 3 ? resp.data.data.records[i].payFee / 100 : "0";
                                that.tableData[i].reduceFee = resp.data.data.records[i].reduceFee / 100
                                that.tableData[i].scoreFee = resp.data.data.records[i].scoreFee / 100
                                that.tableData[i].seconds = (resp.data.data.records[i].seconds / 60).toFixed(2)
                                that.tableData[i].seconds = Math.ceil(that.tableData[i].seconds)
                                that.tableData[i].degree = (resp.data.data.records[i].degree / 1000).toFixed(2)
                                that.tableData[i].preHour = resp.data.data.records[i].preHour == 0 ? '充满' : resp.data.data.records[i].preHour;
                                that.tableData[i].statusDesc = that.tableData[i].status == 3 ? '' : that.tableData[i].statusDesc
                                switch (resp.data.data.records[i].status) {
                                    case 0:
                                        that.tableData[i].status = '待支付';
                                        break;
                                    case 1:
                                        that.tableData[i].status = '开始发起充电';
                                        break;
                                    case 2:
                                        that.tableData[i].status = '充电中';
                                        break;
                                    case 3:
                                        that.tableData[i].status = '充电完成';
                                        break;
                                    case 4:
                                        that.tableData[i].status = '待退款';
                                        break;
                                    case 5:
                                        that.tableData[i].status = '已退款';
                                        break;
                                    case 6:
                                        that.tableData[i].status = '发起停止充电';
                                        break;
                                }
                            }
                            loading.close();
                        })
                } else {
                    this.$message({
                        message: '请选择日期',
                        type: 'warning'
                    })
                }
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.findBickDetail();
            },
            handleCurrentChange(val) {
                this.pageNum = val ? val : 1;
                this.findBickDetail();
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
            screenDevice(data) {
                data.forEach((v, i) => {
                    if (v.children) {
                        for (var i = 0; i < v.children.length; i++) {
                            if (v.children[i].children) {
                                this.screenDevice(v.children)
                                return
                            } else if (v.children[i].orgName.length >= 10) {
                                this.deviceOptions.push(v)
                                return
                            }
                        }
                    }
                })
                this.allDeviceOptions = this.deviceOptions;
            },
            selectDevice(val) {
                this.deviceOptions = this.allDeviceOptions
                if (val.length != 0) {
                    this.deviceOptions.forEach(v => {
                        if (v.orgId == val[0]) {
                            this.deviceOptions = v
                        }
                    })
                    if (this.deviceOptions[1]) {
                        this.deviceOptions = []
                    }
                }
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