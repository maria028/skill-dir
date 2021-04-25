<template>
    <div style="width:98%;margin: 0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form label-width="30%" :model="query">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="日期">
                            <el-date-picker v-model="query.startDate" type="date" placeholder="选择日期"
                                value-format="yyyy-MM-dd" clearable style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="手机号码">
                            <el-input v-model="query.phone" clearable placeholder="请输入" style="width: 100%;"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="订单状态">
                            <el-select v-model="query.status" clearable style="width: 100%;">
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span=6 class="col">
                        <el-form-item label="支付方式">
                            <el-select v-model="query.payType" clearable style="width: 100%;">
                                <el-option v-for="item in payOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row> -->
                    <el-col :span=2 :offset=4 class="col">
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
                        <el-table-column prop="" label="充电桩名称|编号" min-width align="center"></el-table-column>
                        <el-table-column prop="connectorId" label="充电枪" min-width align="center"></el-table-column>
                        <el-table-column prop="id" label="订单编号" min-width align="center"></el-table-column>
                        <el-table-column prop="" label="充电时间(h)" min-width align="center"></el-table-column>
                        <el-table-column prop="status" label="订单状态" min-width align="center"></el-table-column>
                        <el-table-column prop="chargeEnergy" label="累计充电量(度)" min-width align="center"></el-table-column>
                        <el-table-column prop="chargeFee" label="累计电费(度)" min-width align="center"></el-table-column>
                        <el-table-column prop="serviceFee" label="累计服务费(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="totalFee" label="累计总金额(元)" min-width align="center"></el-table-column>
                        <el-table-column prop="startTime" label="充电开始时间" min-width align="center"></el-table-column>
                        <el-table-column prop="endTime" label="充电结束时间" min-width align="center"></el-table-column>
                        <el-table-column prop="createTime" label="订单时间" min-width align="center"></el-table-column>
                        <el-table-column prop="payType" label="支付方式" min-width align="center"></el-table-column>
                        <el-table-column prop="phone" label="手机号码" min-width align="center"></el-table-column>
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
    import { getChargingList } from '../../api/business';

    export default {
        name: 'carChargingDetail',
        data() {
            return {
                query: {},
                tableData: [],
                statusOptions: [{
                    value: 1,
                    label: '交易中',
                }, {
                    value: 2,
                    label: '成功',
                }, {
                    value: 3,
                    label: '失败',
                }],
                payOptions: [{
                    value: 1,
                    label: '平台账户',
                }, {
                    value: 2,
                    label: '运营商账户',
                }, {
                    value: 3,
                    label: '电卡',
                }, {
                    value: 4,
                    label: '支付宝',
                }, {
                    value: 5,
                    label: '接口厂商',
                }],
                pageSize: 50,
                pageNum: 1,
                total: 0,
            }
        },
        methods: {
            queryMsg() {
                if(this.query.startDate == "" || this.query.startDate == null){
                    this.$message.warning("请选择日期");
                    return
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getChargingList(this.query.startDate, this.query.startDate, this.query.phone,
                    this.query.status, this.query.payType, this.pageSize, this.pageNum).then(resp => {
                        this.tableData = resp.data.data.records
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
        },
    }
</script>

<style lang="scss" scoped>
    .col {
        height: 35px;
    }

    @import "../../styles/style.scss";
</style>