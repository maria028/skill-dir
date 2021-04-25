<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form :model="query" label-width="30%">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="设备编号">
                            <el-select v-model="query.deviceNo" clearable style="width: 100%;">
                                <el-option v-for="item in deviceOptions" :key="item.deviceNo" :label="item.deviceNo"
                                    :value="item.deviceNo"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=16 class="col">
                        <el-form-item>
                            <el-button type="success" size="small" icon="el-icon-search" @click="getMsg"
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
                        <el-table-column prop="groupName" min-width label="组号" align="center">
                        </el-table-column>
                        <el-table-column prop="deviceNo" label="设备编号" min-width align="center"></el-table-column>
                        <el-table-column label="漏水阈值" min-width align="center">
                            <el-table-column prop="leakDuration" label="时间(分钟)" min-width align="center">
                            </el-table-column>
                            <el-table-column prop="leakSpeed" label="流速(m³/H)" min-width align="center">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="爆管阈值" min-width align="center">
                            <el-table-column prop="boomDuration" label="时间(分钟)" min-width align="center">
                            </el-table-column>
                            <el-table-column prop="boomSpeed" label="流速(m³/H)" min-width align="center">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="反向阈值" min-width align="center">
                            <el-table-column prop="reverseDuration" label="时间(分钟)" min-width align="center">
                            </el-table-column>
                            <el-table-column prop="reverseSpeed" label="累计水量(m³)" min-width align="center">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="操作" min-width align="center">
                            <template slot-scope="scope">
                                <!-- <el-button type="text" size="small" @click="staSwich(scope.row)">{{scope.row.btnStatus}}
                                </el-button> -->
                                <el-button type="text" size="small" @click="update(scope.row)">编辑</el-button>
                                <!-- <el-button type="text" size="small">删除</el-button> -->
                            </template>
                        </el-table-column>
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
        <el-dialog :visible.sync="dialogFormVisible">
            <el-form label-width="30%">
                <el-row>
                    <el-col :span=24>
                        <span style="font-weight: bold;">漏水阀值</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="时间(分钟)">
                            <el-input v-model="timeLS" clearable style="width: 100%;" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="流速(m³/H)">
                            <el-input v-model="velocityLS" clearable style="width: 100%;" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=24>
                        <span style="font-weight: bold;">爆管阀值</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="时间(分钟)">
                            <el-input v-model="timeBG" clearable style="width: 100%;" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="流速(m³/H)">
                            <el-input v-model="velocityBG" clearable style="width: 100%;" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=24>
                        <span style="font-weight: bold;">反向阀值</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="时间(分钟)">
                            <el-input v-model="timeFX" clearable style="width: 100%;" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="累计水量(m³)">
                            <el-input v-model="velocityFX" clearable style="width: 100%;" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=24>
                        <span style="font-weight: bold;">夜间用水时间</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=23 :offset=1>
                        <span>时段一</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="开始时间">
                            <!-- <el-date-picker v-model="startTime1" type="datetime" clearable placeholder="选择日期时间"
                                style="width: 100%;"></el-date-picker> -->
                            <el-select v-model="startTime1" clearable style="width: 100%;">
                                <el-option v-for="item in timeOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="结束时间">
                            <!-- <el-date-picker v-model="endTime1" type="datetime" clearable placeholder="选择日期时间"
                                style="width: 100%;"></el-date-picker> -->
                            <el-select v-model="endTime1" clearable style="width: 100%;">
                                <el-option v-for="item in timeOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=23 :offset=1>
                        <span>时段二</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="开始时间">
                            <!-- <el-date-picker v-model="startTime2" type="datetime" clearable placeholder="选择日期时间"
                                style="width: 100%;"></el-date-picker> -->
                            <el-select v-model="startTime2" clearable style="width: 100%;">
                                <el-option v-for="item in timeOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="结束时间">
                            <!-- <el-date-picker v-model="endTime2" type="datetime" clearable placeholder="选择日期时间"
                                style="width: 100%;"></el-date-picker> -->
                            <el-select v-model="endTime2" clearable style="width: 100%;">
                                <el-option v-for="item in timeOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=23 :offset=1>
                        <span>时段三</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="开始时间">
                            <!-- <el-date-picker v-model="startTime3" type="datetime" clearable placeholder="选择日期时间"
                                style="width: 100%;"></el-date-picker> -->
                            <el-select v-model="startTime3" clearable style="width: 100%;">
                                <el-option v-for="item in timeOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="结束时间">
                            <!-- <el-date-picker v-model="endTime3" type="datetime" clearable placeholder="选择日期时间"
                                style="width: 100%;"></el-date-picker> -->
                            <el-select v-model="endTime3" clearable style="width: 100%;">
                                <el-option v-for="item in timeOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=24>
                        <el-form-item>
                            <el-button type="success" size="mini" style="background-color: #4cb678;margin-left: 20%;"
                                @click="submit">保存
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { getThreshold, setThreshold, listThreshold, getDeviceGroup, operate } from "../../api/waterRes"

    export default {
        name: 'waterParameter',
        data() {
            return {
                deviceNo: '',
                timeLS: '',
                timeBG: '',
                timeFX: '',
                velocityLS: '',
                velocityBG: '',
                velocityFX: '',
                startTime1: '',
                endTime1: '',
                startTime2: '',
                action: '',
                endTime2: '',
                startTime3: '',
                endTime3: '',
                nightTimes: '',
                dialogFormVisible: false,
                deviceOptions: [],
                query: [],
                tableData: [],
                timeOptions: [{
                    value: '0',
                    label: '00:00',
                }, {
                    value: '1',
                    label: '01:00',
                }, {
                    value: '2',
                    label: '02:00',
                }, {
                    value: '3',
                    label: '03:00',
                }, {
                    value: '4',
                    label: '04:00',
                }, {
                    value: '5',
                    label: '05:00',
                }, {
                    value: '6',
                    label: '06:00',
                }, {
                    value: '7',
                    label: '07:00',
                }, {
                    value: '8',
                    label: '08:00',
                }, {
                    value: '9',
                    label: '09:00',
                }, {
                    value: '10',
                    label: '10:00',
                }, {
                    value: '11',
                    label: '11:00',
                }, {
                    value: '12',
                    label: '12:00',
                }, {
                    value: '13',
                    label: '13:00',
                }, {
                    value: '14',
                    label: '14:00',
                }, {
                    value: '15',
                    label: '15:00',
                }, {
                    value: '16',
                    label: '16:00',
                }, {
                    value: '17',
                    label: '17:00',
                }, {
                    value: '18',
                    label: '18:00',
                }, {
                    value: '19',
                    label: '19:00',
                }, {
                    value: '20',
                    label: '20:00',
                }, {
                    value: '21',
                    label: '21:00',
                }, {
                    value: '22',
                    label: '22:00',
                }, {
                    value: '23',
                    label: '23:00',
                }],
                pageSize: 50,
                pageNum: 1,
                total: 0,
            }
        },
        created() {
            this.getMsg();
            this.getDeviceMsg();
        },
        methods: {
            getDeviceMsg() {
                this.deviceOptions = []
                getDeviceGroup(0).then(resp => {
                    resp.data.data.forEach(v => {
                        for (var i = 0; i < v.deviceNos.length; i++) {
                            this.deviceOptions.push({ deviceNo: v.deviceNos[i] })
                        }
                    })
                })
            },
            getMsg() {
                listThreshold(this.query.deviceNo, this.pageSize, this.pageNum).then(resp => {
                    this.tableData = resp.data.data.records;
                    this.tableData.forEach(v => {
                        v.boomDuration = v.boomDuration < 0 ? "—" : v.boomDuration;
                        v.boomSpeed = v.boomSpeed < 0 ? "—" : v.boomSpeed / 1000;
                        v.leakDuration = v.leakDuration < 0 ? "—" : v.leakDuration;
                        v.leakSpeed = v.leakSpeed < 0 ? "—" : v.leakSpeed / 1000;
                        v.reverseDuration = v.reverseDuration < 0 ? "—" : v.reverseDuration;
                        v.reverseSpeed = v.reverseSpeed < 0 ? "—" : v.reverseSpeed / 1000;
                        v.btnStatus = v.chargeStatus == false ? '关闭阀门' : '开启阀门';
                    })
                    this.total = resp.data.data.total;
                    this.pageNum = resp.data.data.current;
                    this.pageSize = resp.data.data.size;
                })
            },
            submit() {
                if (this.startTime1 && this.startTime1 != '' && this.endTime1 && this.endTime1 != '' && this.startTime2 && this.startTime2 != '' && this.endTime2 && this.endTime2 != '' && this.startTime3 && this.startTime3 != '' && this.endTime3 && this.endTime3 != '') {
                    this.nightTimes = this.startTime1 + '-' + this.endTime1 + ',' + this.startTime2 + '-' + this.endTime2 + ',' + this.startTime3 + '-' + this.endTime3;
                } else if (this.startTime1 && this.startTime1 != '' && this.endTime1 && this.endTime1 != '' && this.startTime2 && this.startTime2 != '' && this.endTime2 && this.endTime2 != '') {
                    this.nightTimes = this.startTime1 + '-' + this.endTime1 + ',' + this.startTime2 + '-' + this.endTime2
                } else if (this.startTime1 && this.startTime1 != '' && this.endTime1 && this.endTime1 != '') {
                    this.nightTimes = this.startTime1 + '-' + this.endTime1
                }
                setThreshold(this.deviceNo, this.timeLS, this.velocityLS * 1000, this.timeBG, this.velocityBG * 1000, this.timeFX, this.velocityFX * 1000, this.nightTimes).then(resp => {
                    this.$message.success("保存成功");
                    this.dialogFormVisible = false;
                    this.getMsg();
                });
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.getMsg();
            },
            handleCurrentChange(val) {
                this.pageNum = val ? val : 1;
                this.getMsg();
            },
            update(val) {
                console.log(val);
                this.dialogFormVisible = true;
                this.timeLS = val.leakDuration == "—" ? '' : val.leakDuration;
                this.timeBG = val.boomDuration == "—" ? '' : val.boomDuration;
                this.timeFX = val.reverseDuration == "—" ? '' : val.reverseDuration;
                this.velocityLS = val.leakSpeed == "—" ? '' : val.leakSpeed;
                this.velocityBG = val.boomSpeed == "—" ? '' : val.boomSpeed;
                this.velocityFX = val.reverseSpeed == "—" ? '' : val.reverseSpeed;
                this.deviceNo = val.deviceNo;
                this.startTime1 = '';
                this.endTime1 = '';
                this.startTime2 = '';
                this.endTime2 = '';
                this.startTime3 = '';
                this.endTime3 = '';
                if (val.nightTimes != '') {
                    let arr = []
                    val.nightTimes.split(',').forEach(v => {
                        v.split('-').forEach(k => {
                            arr.push(k)
                        })
                    })
                    this.startTime1 = arr[0];
                    this.endTime1 = arr[1];
                    this.startTime2 = arr[2];
                    this.endTime2 = arr[3];
                    this.startTime3 = arr[4];
                    this.endTime3 = arr[5];
                }
            },
            staSwich(val) {
                this.action = val.btnStatus == '开启阀门' ? "2" : "1";
                operate(this.action, val.deviceNo).then(resp => {
                    setTimeout(() => {
                        this.$message.success("操作成功")
                        this.getMsg();
                    }, 3000);
                })
            },
            // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            //     console.log("****"+row.groupName)
            //     console.log(column)
            //     console.log(rowIndex)
            //     console.log(columnIndex)

            //     if (columnIndex === 0) {
            //         if (rowIndex % 2 === 0) {
            //             return {
            //                 rowspan: 4,
            //                 colspan: 1
            //             };
            //         } else {
            //             return {
            //                 rowspan: 0,
            //                 colspan: 0
            //             };
            //         }
            //     }
            // },
        }
    }
</script>

<style lang="scss" scoped>
    .col {
        height: 35px;
    }

    @import "../../styles/style.scss";
</style>