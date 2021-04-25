<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-row>
            <el-col :span=10 class="col">
                <el-cascader :options="options" change-on-select :props="props" clearable separator="-"
                    style="width: 100%;" expand-trigger="hover" v-model="mallId"></el-cascader>
            </el-col>
            <el-col :span=2>
                <el-button type="success" icon="el-icon-search" size="small" @click="query"
                    style="background-color: #4cb678;margin: 4% 0 0 3%;">查询</el-button>
            </el-col>
            <el-col :span=6 :offset=6 class="col">
                <span style="font-size: 16px;float: right;margin: 2% 2% 0 0;">今日实时数据({{newDate}})</span>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span=5 style="margin-right: 1%;">
                <el-card>
                    <div>
                        <img src="../../../public/img/battery/user.png" alt="" width="10%"
                            style="margin-right: 5%;vertical-align: text-top;">
                        <span>充电用户数（人）</span>
                    </div>
                    <div style="color: #6B5AF4;font-size: 45px;margin-top: 8%;">{{userCount}}</div>
                </el-card>
            </el-col>
            <el-col :span=5 style="margin-right: 1%;">
                <el-card>
                    <div>
                        <img src="../../../public/img/battery/battery.png" alt="" width="10%"
                            style="margin-right: 5%;vertical-align: text-top;">
                        <span>充电次数（次）</span>
                    </div>
                    <div style="color: #F74F77;font-size: 45px;margin-top: 8%;">{{chargeCount}}</div>
                </el-card>
            </el-col>
            <el-col :span=5 style="margin-right: 1%;">
                <el-card>
                    <div>
                        <img src="../../../public/img/battery/consumption.png" alt="" width="10%"
                            style="margin-right: 5%;vertical-align: text-top;">
                        <span>消耗电量（千瓦时）</span>
                    </div>
                    <div style="color: #1CA3FF;font-size: 45px;margin-top: 8%;">{{degree}}</div>
                </el-card>
            </el-col>
            <el-col :span=5 style="margin-right: 1%;">
                <el-card>
                    <div>
                        <img src="../../../public/img/battery/fee.png" alt="" width="10%"
                            style="margin-right: 5%;vertical-align: text-top;">
                        <span>收费金额（元）</span>
                    </div>
                    <div style="color: #F7B84F;font-size: 45px;margin-top: 8%;">{{fee}}</div>
                </el-card>
            </el-col>
            <el-col :span=5>
                <el-card>
                    <div>
                        <img src="../../../public/img/battery/integral.png" alt="" width="10%"
                            style="margin-right: 5%;vertical-align: text-top;">
                        <span>充电消耗积分（个）</span>
                    </div>
                    <div style="color: #7767F8;font-size: 45px;margin-top: 8%;">{{score}}</div>
                </el-card>
            </el-col>
        </el-row>
        <el-card>
            <el-row>
                <el-col :span=24>
                    <span style="font-weight: bold;">当日实时电量消耗</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span=24>
                    <div ref="realTime" style="width: 100%;height: 200%;"></div>
                </el-col>
            </el-row>
        </el-card>
        <div style="margin: 1% 0;">
            <span style="border: 2px solid #48D390;margin-right: 1%;"></span>
            <span>综合分析</span>
        </div>
        <el-card>
            <el-row>
                <el-col :span=24>
                    <span style="font-weight: bold;">最近30天充电收入</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span=24>
                    <div ref="income" style="width: 100%;height: 200%;"></div>
                </el-col>
            </el-row>
        </el-card>
        <el-card style="margin-top: 1%;">
            <el-row>
                <el-col :span=24>
                    <span style="font-weight: bold;">最近30天耗电量</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span=24>
                    <div ref="power" style="width: 100%;height: 200%;"></div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { getUserMessage } from '../../api/house';
    import { getPermissionDevice, getVisualData } from '../../api/business';

    const echarts = require('echarts');
    export default {
        name: "batteryCharge",
        data() {
            return {
                newDate: '',
                options: [],
                degree: '',
                userCount: '',
                chargeCount: '',
                fee: '',
                degreeH24: [],
                degrees: [],
                fees: [],
                score: '',
                props: { value: "orgId", label: "orgName", children: "children" },
                deviceNumOptions: [{
                    orgId: '01',
                    orgName: '1号插座',
                }, {
                    orgId: '02',
                    orgName: '2号插座',
                }, {
                    orgId: '03',
                    orgName: '3号插座',
                }, {
                    orgId: '04',
                    orgName: '4号插座',
                }, {
                    orgId: '05',
                    orgName: '5号插座',
                }, {
                    orgId: '06',
                    orgName: '6号插座',
                }, {
                    orgId: '07',
                    orgName: '7号插座',
                }, {
                    orgId: '08',
                    orgName: '8号插座',
                }, {
                    orgId: '09',
                    orgName: '9号插座',
                }, {
                    orgId: '10',
                    orgName: '10号插座',
                }],
                mallId: [],
                queryId: '',
                reqType: '',
                lastDays: [],
                lastTimes: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
                    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
                    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
                    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",],
            }
        },
        created() {
            this.getDate();
            this.getOrganization();
        },
        mounted() {
            setInterval(() => {
                this.getDate();
                console.log("页面渲染！");
            }, 30 * 1000);
            console.log("页面渲染完成！");
        },
        computed: {
            ...mapGetters(["tenantId", "userInfo"])
        },
        methods: {
            getDate() {
                var myDate = new Date();
                //获取当前年
                var year = myDate.getFullYear();
                //获取当前月
                var month = myDate.getMonth() + 1;
                //获取当前日
                var date = myDate.getDate();
                var h = myDate.getHours(); //获取当前小时数(0-23)
                var m = myDate.getMinutes(); //获取当前分钟数(0-59)
                var s = myDate.getSeconds();
                //获取当前时间
                var now = year + '-' + this.conver(month) + "-" + this.conver(date) + " " + this.conver(h) + ':' + this.conver(m);
                this.newDate = now;
                this.lastDays = [];
                if (date == 31) {
                    var days = 30;
                    for (var i = 0; i < days; i++) {
                        this.lastDays.push(this.conver(month) + "-" + this.conver(i + 1))
                    }
                } else {
                    var days = month - 1 == 1 || 3 || 5 || 7 || 8 || 10 || 12 ? date + 1 : date;
                    if (month - 1 != 2) {
                        var day = month - 1 == 1 || 3 || 5 || 7 || 8 || 10 || 12 ? "31" : "30";
                    } else {
                        var day = year % 4 == 0 ? "29" : "28";
                    }
                    for (var j = days; j <= day; j++) {
                        this.lastDays.push(this.conver(month - 1) + "-" + this.conver(j))
                    }
                    for (var i = 0; i < date - 1; i++) {
                        this.lastDays.push(this.conver(month) + "-" + this.conver(i + 1))
                    }
                }
                console.log(this.lastDays)


            },
            conver(s) {
                return s < 10 ? '0' + s : s;
            },
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
                getPermissionDevice(userOrg, userOrgDesc, this.roleType, "CDB").then(resp => {
                    this.addSocket(resp.data.data)
                    that.options = resp.data.data
                    this.initialize(resp.data.data)
                    this.query();
                })
            },
            initialize(data) {
                this.mallId.push(data[0].orgId);
                if (data[0].orgId.length > 15) {
                    return
                }
                if (data[0].children) {
                    this.initialize(data[0].children)
                }
            },
            addSocket(data) {
                data.forEach(v => {
                    if (v.children) {
                        this.addSocket(v.children);
                    } else if (v.orgName.length > 10) {
                        v.children = this.deviceNumOptions
                    }
                })
            },
            query() {
                this.queryId = ''
                if (this.mallId.length == 0 && this.queryId == '') {
                    this.$message.warning("请选择地区!");
                    return
                }
                if (this.mallId[this.mallId.length - 1].length == 2) {
                    this.reqType = "4";
                    this.queryId = this.mallId[this.mallId.length - 2] + this.mallId[this.mallId.length - 1];
                } else if (this.mallId[this.mallId.length - 1].length > 12 && this.mallId[this.mallId.length - 1].length < 19) {
                    this.reqType = "3";
                    this.queryId = this.mallId[this.mallId.length - 1];
                } else if (this.mallId[this.mallId.length - 1].length >= 19) {
                    this.reqType = "2";
                    this.queryId = this.mallId[this.mallId.length - 1];
                } else {
                    this.reqType = "1";
                    this.queryId = this.mallId[this.mallId.length - 1];
                }
                let that = this;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getVisualData(this.reqType, this.queryId).then(resp => {
                    that.userCount = resp.data.data.userCount;
                    that.chargeCount = resp.data.data.chargeCount;
                    that.degree = resp.data.data.degree;
                    that.fee = resp.data.data.fee;
                    that.score = resp.data.data.score;
                    that.degreeH24 = resp.data.data.degreeH24;
                    that.degrees = resp.data.data.degrees.reverse();
                    that.fees = resp.data.data.fees.reverse();
                    this.initData();
                    loading.close();
                })
            },
            initData() {
                //当日实时电量消耗
                const realTime = echarts.init(this.$refs.realTime);
                realTime.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#4CB678'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.lastTimes,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#999999', //x轴data 的颜色
                                fontSize: 10
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '5%',
                        bottom: '3%',
                        top: '15%',//距上边距
                        containLabel: true
                    },
                    yAxis: [
                        {
                            name: '度',
                            type: 'value',
                            show: true,
                            axisTick: { //y轴刻度线
                                show: false
                            },
                            axisLine: { //y轴
                                show: false
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#999999', //x轴data 的颜色
                                    fontSize: 10
                                }
                            }
                        }],
                    series: [
                        {
                            name: '',
                            type: 'line',
                            smooth: true,
                            data: this.degreeH24,
                            areaStyle: {
                                normal: {
                                    color: {
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: "#4CB678" // 0% 处的颜色
                                        }, {
                                            offset: 0.9,
                                            color: "#ffffff" // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            }
                        }
                    ]
                });
                //最近三十天耗电量
                const power = echarts.init(this.$refs.power);
                power.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#4CB678'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.lastDays,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#999999', //x轴data 的颜色
                                fontSize: 10
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '5%',
                        bottom: '3%',
                        top: '15%',//距上边距
                        containLabel: true
                    },
                    yAxis: [
                        {
                            name: '度',
                            type: 'value',
                            show: true,
                            axisTick: { //y轴刻度线
                                show: false
                            },
                            axisLine: { //y轴
                                show: false
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#999999', //x轴data 的颜色
                                    fontSize: 10
                                }
                            }
                        }],
                    series: [
                        {
                            name: '',
                            type: 'line',
                            smooth: false,
                            data: this.degrees,
                            areaStyle: {
                                normal: {
                                    color: {
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0,
                                            color: "#4CB678" // 0% 处的颜色
                                        }, {
                                            offset: 0.9,
                                            color: "#ffffff" // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            }
                        }
                    ]
                });
                //最近三十天充电收入
                const income = echarts.init(this.$refs.income);
                income.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#4CB678'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: this.lastDays,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#999999', //x轴data 的颜色
                                fontSize: 10
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '5%',
                        bottom: '3%',
                        top: '15%',//距上边距
                        containLabel: true
                    },
                    yAxis: [
                        {
                            name: '元',
                            type: 'value',
                            show: true,
                            axisTick: { //y轴刻度线
                                show: false
                            },
                            axisLine: { //y轴
                                show: false
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#999999', //x轴data 的颜色
                                    fontSize: 10
                                }
                            }
                        }],
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            data: this.fees,
                            barWidth: 20,
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0, 0, 0, 1,
                                        [
                                            { offset: 0, color: '#4CB678' },
                                            { offset: 1, color: '#66D38C' }
                                        ]
                                    )
                                }
                            },
                        }
                    ]
                });
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
<style>
    .el-cascader-panel .el-radio {
        position: absolute;
        z-index: 10;
        padding: 0 10px;
        width: 132px;
        height: 34px;
        line-height: 34px;
    }

    .el-cascader-panel .el-radio__input {
        visibility: hidden;
    }

    .el-cascader-panel .el-input-node__postfix {
        top: 10px;
    }
</style>