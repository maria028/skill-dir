<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form label-width="30%" :model="query">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="车牌">
                            <el-input v-model="query.cardNo" clearable placeholder="请输入" style="width: 100%;"
                                @input="changePageNum">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="停车场">
                            <el-select v-model="query.parkName" clearable placeholder="请输入" style="width: 100%;">
                                <el-option v-for="item in parkOptions" :key="item.parkName" :value="item.parkName"
                                    :label="item.parkName"></el-option>
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
                        <!-- <el-form-item label="支付方式">
                            <el-select v-model="query.payType" clearable style="width: 100%;">
                                <el-option v-for="item in payOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item> -->
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
                            <el-button type="success" size="small" @click="queryMsg" icon="el-icon-search"
                                style="background-color: #4cb678;float: right;margin-top: 7%;">
                                查询
                            </el-button>
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
                        <el-table-column type="index" fixed label="序号" align="center">
                            <template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}}
                                </span></template>
                        </el-table-column>
                        <el-table-column prop="cardNo" label="车牌" min-width align="center"></el-table-column>
                        <el-table-column prop="parkName" label="停车场名称" min-width align="center"></el-table-column>
                        <el-table-column prop="deviceName" label="设备名称" min-width align="center"></el-table-column>
                        <el-table-column prop="inDate" label="入场时间" min-width align="center"></el-table-column>
                        <el-table-column prop="outDate" label="出场时间" min-width align="center"></el-table-column>
                        <el-table-column prop="second" label="停车时间" min-width align="center"></el-table-column>
                        <el-table-column prop="payAmount" label="实付金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="payType" label="付款方式" min-width align="center"></el-table-column>
                        <el-table-column prop="payTime" label="缴费时间" min-width align="center"></el-table-column>
                        <el-table-column prop="tradeStatus" label="订单状态" min-width align="center"></el-table-column>
                        <el-table-column label="操作人员" min-width align="center"></el-table-column>
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
    import { getCarList, getCarPark } from '../../api/business';
    import { getDeviceList } from "../../api/system/device"

    export default {
        name: 'carDetail',
        data() {
            return {
                query: {},
                parkOptions: [],
                // payOptions: [{
                //     value: '0',
                //     label: '其他',
                // }, {
                //     value: '1',
                //     label: '账号余额支付',
                // }, {
                //     value: '2',
                //     label: '支付宝',
                // }, {
                //     value: '3',
                //     label: '微信',
                // }],
                tableData: [],
                DZCarr: [],
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
        created() {
            this.getPark();
        },
        methods: {
            getPark() {
                let that = this
                getCarPark().then(resp => {
                    that.parkOptions = resp.data.data;
                    that.parkOptions.forEach((v, i) => {
                        if (v.id == "1293422515869958145") {
                            that.parkOptions.splice(i, 1)
                        }
                    })
                })
                getDeviceList(this.tenantId, 1, 500, null, 'DZC').then(resp => {
                    that.DZCarr = resp.data.data.records;
                })
            },
            queryMsg() {
                if (this.query.startDate == '' || this.query.startDate == null) {
                    this.$message.warning("请选择开始时间");
                    return
                }
                if (this.query.endDate == '' || this.query.endDate == null) {
                    this.$message.warning("请选择结束时间");
                    return
                }
                if (this.query.cardNo == '') {
                    delete this.query.cardNo;
                }
                if (this.query.parkName == '') {
                    delete this.query.parkName;
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getCarList(this.query.cardNo, this.query.parkName, this.query.startDate,
                    this.query.endDate, this.pageSize, this.pageNum).then(resp => {
                        this.tableData = resp.data.data.records;
                        this.tableData.forEach(v => {
                            this.DZCarr.forEach(k => {
                                if (v.deviceNo == k.deviceNo) {
                                    v.deviceName = k.deviceName
                                }
                            })
                        })
                        this.total = resp.data.data.total;
                        this.pageSize = resp.data.data.size;
                        this.pageNum = resp.data.data.current;
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
            changePageNum(e) {
                console.log(e);
                debugger
                this.pageNum = 1
            }
        },
    }
</script>

<style lang="scss" scoped>
    .col {
        height: 35px;
    }

    @import "../../styles/style.scss";
</style>