<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-row>
            <el-col :span=24>
                <div style="text-align: center;font-weight: bold;color: coral;">{{notice}}</div>
            </el-col>
        </el-row>
        <el-card style="margin-bottom: 1%;">
            <el-form label-width="30%" :model="query">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="总表编号">
                            <el-select v-model="query.deviceNo" clearable style="width: 100%;">
                                <el-option v-for="item in deviceOptions" :key="item.deviceNo" :label="item.deviceNo"
                                    :value="item.deviceNo"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="查询日期">
                            <el-date-picker v-model="query.date" type="date" placeholder="选择日期" clearable
                                value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=10 class="col">
                        <el-form-item>
                            <el-button type="success" size="small" icon="el-icon-search" @click="queryMsg"
                                style="background-color: #4cb678;float: right;margin-top: 7%;">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-row>
            <el-col :span=24>
                <span style="border: 2px solid #48D390;"></span>
                <span style="color: #666666;margin-left: 1%;">用水量分析</span>
                <span style="color: #666666;margin-left: 1%;float:right;">当日实时 {{newDate}}</span>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span=18>
                <el-row>
                    <el-col :span=24>
                        <el-card>
                            <el-row>
                                <el-col :span=24>
                                    <span style="font-weight: bold;margin-right: 5%;">最近30天用水量</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span=24>
                                    <div ref="weekWater" style="width: 100%;height: 180%;"></div>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=24>
                        <el-card>
                            <el-row>
                                <el-col :span=24>
                                    <span style="font-weight: bold;margin-right: 5%;">最近24小时用水量监控</span>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span=24>
                                    <div ref="hourDay" style="width: 100%;height: 180%;"></div>
                                </el-col>
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span=6 style="margin-left: 1%;">
                <el-row>
                    <el-card style="margin-bottom: 5%;text-align: center;background-color: #4777E1;">
                        <div style="font-size: 14px;color: #ffffff;margin-top: 1%;">当前累计用水量</div>
                        <div style="font-weight: bold;font-size: 26px;margin-top: 12%;color: #ffffff;">{{usingTotal}}m³
                        </div>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card style="margin-bottom: 5%;text-align: center;background-color: #FD8B71;">
                        <div style="font-size: 14px;color: #ffffff;margin-top: 1%;">当日漏水事件</div>
                        <div style="font-weight: bold;font-size: 26px;margin-top: 12%;color: #ffffff;">{{leakTimes}}次
                        </div>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card style="margin-bottom: 5%;text-align: center;background-color: #AB71E9;">
                        <div style="font-size: 14px;color: #ffffff;margin-top: 1%;">当日爆管事件</div>
                        <div style="font-weight: bold;font-size: 26px;margin-top: 12%;color: #ffffff;">{{boomTimes}}次
                        </div>
                    </el-card>
                </el-row>
                <el-row>
                    <el-card style="text-align: center;background-color: #838FF1;">
                        <div style="font-size: 14px;color: #ffffff;margin-top: 1%;">当日反向事件</div>
                        <div style="font-weight: bold;font-size: 26px;margin-top: 12%;color: #ffffff;">{{reverseTimes}}次
                        </div>
                    </el-card>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24>
                <el-card style="margin-bottom: 1%;">
                    <el-row>
                        <el-col :span=24>
                            <span style="font-weight: bold;margin-right: 5%;">夜间时段用水量</span>
                        </el-col>
                        <el-col :span=24>
                            <el-table :data="waterNight" stripe :header-cell-style="{background:'#D8E3FA'}"
                                :default-sort="{prop: '', order: ''}" border empty-text="当日无数据">
                                <el-table-column type="index" fixed label="序号" width="50" min-width align="center">
                                </el-table-column>
                                <el-table-column label="时段一" min-width align="center">
                                    <el-table-column prop="startTime1" label="开始时间" min-width align="center">
                                    </el-table-column>
                                    <el-table-column prop="endTime1" label="结束时间" min-width align="center">
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column prop="waterUsage1" label="用水量(m³)" min-width align="center">
                                </el-table-column>
                                <el-table-column label="时段二" min-width align="center">
                                    <el-table-column prop="startTime2" label="开始时间" min-width align="center">
                                    </el-table-column>
                                    <el-table-column prop="endTime2" label="结束时间" min-width align="center">
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column prop="waterUsage2" label="用水量(m³)" min-width align="center">
                                </el-table-column>
                                <el-table-column label="时段三" min-width align="center">
                                    <el-table-column prop="startTime3" label="开始时间" min-width align="center">
                                    </el-table-column>
                                    <el-table-column prop="endTime3" label="结束时间" min-width align="center">
                                    </el-table-column>
                                </el-table-column>
                                <el-table-column prop="waterUsage3" label="用水量(m³)" min-width align="center">
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span=24>
                <el-card style="margin-bottom: 1%;">
                    <el-row>
                        <el-col :span=24>
                            <span style="font-weight: bold;margin-right: 5%;">每小时用水量监控</span>
                            <el-select clearable v-model="times" @change="changeTime">
                                <el-option v-for="item in timeOptions" :key="item.time" :label="item.time"
                                    :value="item.time"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span=24>
                            <div ref="everyHour" style="width: 100%;height: 200%;"></div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-row type="flex">
            <el-col :span=8>
                <el-card :body-style="{padding: '0'}">
                    <el-row style="background-color: #00BF6E;color: white;">
                        <el-col :span=24>
                            <div style="margin: 1% 0 0 3%;">当日爆管监测事件列表</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span=24>
                            <el-table :data="tableDataBG" stripe height="200" empty-text="当日无事件">
                                <el-table-column type="index" fixed label="序号" min-width align="center">
                                </el-table-column>
                                <el-table-column prop="startTime" label="开始时间" min-width align="center">
                                </el-table-column>
                                <!-- <el-table-column prop="endTime" label="结束时间" min-width align="center"></el-table-column> -->
                                <el-table-column prop="waterUsage" label="流水量(m³)" min-width align="center">
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span=8 style="margin-left: 1%;">
                <el-card :body-style="{padding: '0'}">
                    <el-row style="background-color: #00BF6E;color: white;">
                        <el-col :span=24>
                            <div style="margin: 1% 0 0 3%;">当日漏水监测事件列表</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span=24>
                            <el-table :data="tableDataLS" stripe height="200" empty-text="当日无事件">
                                <el-table-column type="index" fixed label="序号" min-width align="center">
                                </el-table-column>
                                <el-table-column prop="startTime" label="开始时间" min-width align="center">
                                </el-table-column>
                                <!-- <el-table-column prop="endTime" label="结束时间" min-width align="center"></el-table-column> -->
                                <el-table-column prop="waterUsage" label="流水量(m³)" min-width align="center">
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span=8 style="margin:0 1%;">
                <el-card :body-style="{padding: '0'}">
                    <el-row style="background-color: #00BF6E;color: white;">
                        <el-col :span=24>
                            <div style="margin: 1% 0 0 3%;">当日反向监测事件列表</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span=24>
                            <el-table :data="tableDataFX" stripe height="200" empty-text="当日无事件">
                                <el-table-column type="index" fixed label="序号" min-width align="center">
                                </el-table-column>
                                <el-table-column prop="startTime" label="开始时间" min-width align="center">
                                </el-table-column>
                                <!-- <el-table-column prop="endTime" label="结束时间" min-width align="center"></el-table-column> -->
                                <el-table-column prop="waterUsage" label="流水量(m³)" min-width align="center">
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { getDeviceGroup, getDeviceVisualData, operate, startDemo } from "../../api/waterRes"

    const echarts = require('echarts');
    export default {
        name: 'monitoringTotal',
        data() {
            return {
                query: {
                    date: '2020-09-10',
                    deviceNo: '',
                },
                timeOptions: [],
                newDate: "",
                notice: '',
                times: '',
                dayHours: [],
                tableDataBG: [],
                tableDataLS: [],
                tableDataFX: [],
                lastWeek: [],
                lastTimes: [],
                everyhours: ["00:05", "00:10", "00:15", "00:20", "00:25", "00:30", "00:35", "00:40", "00:45", "00:50", "00:55", "01:00"],
                groupOptions: [],
                deviceOptions: [],
                deviceNo: '',
                waterNight: [],
                interval: null,
                ip: '',
                status: '',
                btnStatus: '开启',
                type: "success",
                startTime: '',
                endTime: '',
                waterUsage: '',
                leakTimes: '',
                boomTimes: '',
                reverseTimes: '',
                usingTotal: '',
                waterDays: [],
                waterHours: [],
                waterHourMinutes: [],
                waterHourMinute: [],
                action: '',
            }
        },
        created() {
            var myDate = new Date();
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var date = myDate.getDate();
            var now = year + '-' + this.conver(month) + "-" + this.conver(date);
            this.query.date = now
            this.getDate();
            this.getDeviceMsg();
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
                var now = year + '-' + this.conver(month) + "-" + this.conver(date);
                this.newDate = now;
                this.lastWeek = [];
                this.timeOptions = [];
                this.dayHours = [];
                for (var i = 0; i < 24; i++) {
                    if (this.query.date == '') {
                        this.times = year + '-' + this.conver(month) + "-" + this.conver(date) + " " + this.conver(h - 1) + ':00'
                        this.timeOptions.push({ time: year + '-' + this.conver(month) + "-" + this.conver(date) + " " + this.conver(i) + ":00", index: i })
                    } else {
                        this.times = this.query.date + " " + this.conver(h - 1) + ':00'
                        this.timeOptions.push({ time: this.query.date + " " + this.conver(i) + ":00", index: i })
                    }
                    this.dayHours.push(this.conver(i) + ":00")
                }
                // if (date - 7 >= 0) {
                //     var days = 7;
                //     for (var i = 0; i < days; i++) {
                //         this.lastWeek.push(this.conver(month) + "." + this.conver(date - i));
                //     }
                // } else {
                //     var days = date;
                //     if (month != 2) {
                //         var day = month == 1 || 3 || 5 || 7 || 8 || 10 || 12 ? 31 : 30;
                //     } else {
                //         var day = year % 4 == 0 ? 29 : 28;
                //     }
                //     for (var j = days + day - 7; j <= day; j++) {
                //         this.lastWeek.push(this.conver(month - 1) + "." + this.conver(j))
                //     }
                //     for (var i = 1; i < days; i++) {
                //         this.lastWeek.push(this.conver(month) + "." + this.conver(i))
                //     }
                // }
                //最近30天
                if (date == 31) {
                    var days = 30;
                    for (var i = 0; i < days; i++) {
                        this.lastWeek.push(this.conver(month) + "-" + this.conver(i + 1))
                    }
                } else {
                    var days = month - 1 == 1 || 3 || 5 || 7 || 8 || 10 || 12 ? date + 1 : date;
                    if (month - 1 != 2) {
                        var day = month - 1 == 1 || 3 || 5 || 7 || 8 || 10 || 12 ? "31" : "30";
                    } else {
                        var day = year % 4 == 0 ? "29" : "28";
                    }
                    for (var j = days; j <= day; j++) {
                        this.lastWeek.push(this.conver(month - 1) + "-" + this.conver(j))
                    }
                    for (var i = 0; i < date - 1; i++) {
                        this.lastWeek.push(this.conver(month) + "-" + this.conver(i + 1))
                    }
                }
                this.lastWeek.reverse();
            },
            water(arr) {
                for (var i = 0; i < arr.length; i++) {
                    arr[i] = Number(arr[i] / 1000).toFixed(4)
                }
            },
            conver(s) {
                return s < 10 ? '0' + s : s;
            },
            changeTime(val) {
                this.everyhours = [];
                this.lastWeek = [];
                var month = parseInt(val[5] + val[6], 10);
                var date = parseInt(val[8] + val[9], 10);
                var myDate = new Date();
                //获取当前年
                var year = myDate.getFullYear();
                //最近30天
                if (date == 31) {
                    var days = 30;
                    for (var i = 0; i < days; i++) {
                        this.lastWeek.push(this.conver(month) + "-" + this.conver(i + 1))
                    }
                } else {
                    var days = month - 1 == 1 || 3 || 5 || 7 || 8 || 10 || 12 ? date + 1 : date;
                    if (month - 1 != 2) {
                        var day = month - 1 == 1 || 3 || 5 || 7 || 8 || 10 || 12 ? "31" : "30";
                    } else {
                        var day = year % 4 == 0 ? "29" : "28";
                    }
                    for (var j = days; j <= day; j++) {
                        this.lastWeek.push(this.conver(month - 1) + "-" + this.conver(j))
                    }
                    for (var i = 0; i < date - 1; i++) {
                        this.lastWeek.push(this.conver(month) + "-" + this.conver(i + 1))
                    }
                }
                this.lastWeek.reverse();
                for (var i = 0; i < this.timeOptions.length; i++) {
                    if (this.timeOptions[i].time == val) {
                        this.everyhours.push(this.conver(this.timeOptions[i].index) + ":00")
                        if (this.waterHourMinutes[i].length == 12) {
                            for (var j = 5; j < 56;) {
                                this.everyhours.push(this.conver(this.timeOptions[i].index) + ":" + this.conver(j))
                                j = j + 5;
                            }
                        } else if (this.waterHourMinutes[i].length == 60) {
                            for (var j = 1; j < 60;) {
                                this.everyhours.push(this.conver(this.timeOptions[i].index) + ":" + this.conver(j))
                                j = j + 1;
                            }
                        }
                        this.waterHourMinute = this.waterHourMinutes[i]
                    }
                }
                this.initData()
            },
            queryMsg() {
                this.getDate();
                let that = this;
                getDeviceVisualData(this.query.date, this.query.deviceNo).then(resp => {
                    this.deviceNo = resp.data.data.deviceNo;
                    this.ip = resp.data.data.ip;
                    this.status = resp.data.data.status == 1 ? '在线' : '离线';
                    this.btnStatus = resp.data.data.status == 1 ? '关闭' : '开启';
                    this.type = resp.data.data.status == 1 ? 'danger' : 'success';
                    this.startTime = resp.data.data.monthMax.startTime;
                    this.endTime = resp.data.data.monthMax.endTime;
                    this.waterUsage = resp.data.data.monthMax.waterUsage;
                    this.leakTimes = resp.data.data.leakTimes;
                    this.boomTimes = resp.data.data.boomTimes;
                    this.reverseTimes = resp.data.data.reverseTimes;
                    this.usingTotal = Number(resp.data.data.usingTotal / 1000).toFixed(4);
                    this.tableDataBG = resp.data.data.boomEvents;
                    this.time(this.tableDataBG);
                    this.tableDataLS = resp.data.data.leakEvents;
                    this.time(this.tableDataLS);
                    this.tableDataFX = resp.data.data.reverseEvents;
                    this.time(this.tableDataFX);
                    this.waterDays = resp.data.data.waterDays;
                    this.water(this.waterDays)
                    this.waterHours = resp.data.data.waterHours;
                    this.water(this.waterHours)
                    this.waterHourMinutes = resp.data.data.waterHourMinutes;
                    for (var i = 0; i < this.waterHourMinutes.length; i++) {
                        this.water(this.waterHourMinutes[i])
                    }
                    this.notice = resp.data.data.notice;
                    this.waterNight = [];
                    if (resp.data.data.waterNights.length != 0) {
                        that.waterNight.push({
                            startTime1: resp.data.data.waterNights[0].startTime,
                            startTime2: resp.data.data.waterNights[1].startTime,
                            startTime3: resp.data.data.waterNights[2].startTime,
                            endTime1: resp.data.data.waterNights[0].endTime,
                            endTime2: resp.data.data.waterNights[1].endTime,
                            endTime3: resp.data.data.waterNights[2].endTime,
                            waterUsage1: Number(resp.data.data.waterNights[0].waterUsage / 1000).toFixed(4),
                            waterUsage2: Number(resp.data.data.waterNights[1].waterUsage / 1000).toFixed(4),
                            waterUsage3: Number(resp.data.data.waterNights[2].waterUsage / 1000).toFixed(4)
                        });
                    }
                    // this.waterHourMinute = resp.data.data.waterHourMinutes[0];
                    // this.initData();
                    this.lang();
                    this.changeTime(this.times)
                    this.newDate = this.query.date;
                })
            },
            time(arr) {
                for (var i = 0; i < arr.length; i++) {
                    // debugger
                    arr[i].waterUsage = Number(arr[i].waterUsage / 1000).toFixed(4)
                    arr[i].startTime = arr[i].startTime.substring(0, arr[i].startTime.length - 3)
                    arr[i].endTime = arr[i].endTime.substring(0, arr[i].endTime.length - 3)
                }
            },
            initData() {
                //最近一周用水监控
                const weekWater = echarts.init(this.$refs.weekWater);
                weekWater.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#4CB678'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: true,
                        data: this.lastWeek,
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
                            name: '水量(m³)',
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
                                },
                            }
                        }],
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            data: this.waterDays,
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
                //每小时用水监控
                const everyHour = echarts.init(this.$refs.everyHour);
                everyHour.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#4CB678'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.everyhours,
                        axisLabel: {
                            show: true,
                            interval: 4,
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
                            name: '水量(m³)',
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
                                },
                            }
                        }],
                    series: [
                        {
                            name: '',
                            type: 'line',
                            smooth: true,
                            data: this.waterHourMinute,
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
                //24小时用水监控
                const hourDay = echarts.init(this.$refs.hourDay);
                hourDay.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#4CB678'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.dayHours,
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
                            name: '水量(m³)',
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
                                },
                            }
                        }],
                    series: [
                        {
                            name: '',
                            type: 'line',
                            smooth: true,
                            data: this.waterHours,
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
            },
            getDeviceMsg() {
                this.deviceOptions = []
                let that = this
                getDeviceGroup(1).then(resp => {
                    resp.data.data.forEach(v => {
                        for (var i = 0; i < v.deviceNos.length; i++) {
                            that.deviceOptions.push({ deviceNo: v.deviceNos[i] })
                        }
                    })
                    that.query.deviceNo = that.deviceOptions[0].deviceNo;
                    that.queryMsg()
                })
            },
            staSwich() {
                this.action = this.type == "success" ? "1" : "2";
                operate(this.action, this.query.deviceNo).then(resp => {
                    this.queryMsg();
                })
            },
            demo() {
                startDemo(this.query.date, this.query.deviceNo).then()
            },
            lang() {
                console.log(this.notice);
                clearInterval(this.interval)
                var _this = this;
                _this.interval = setInterval(function () {
                    //获取第一个字符
                    var start = _this.notice.substring(0, 1);
                    //得到后面的字符
                    var end = _this.notice.substring(1);
                    //重新赋值
                    _this.notice = end + start;
                }, 400)
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
