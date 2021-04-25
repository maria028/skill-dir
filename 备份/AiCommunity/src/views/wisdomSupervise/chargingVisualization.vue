<template>
    <div class="box-bg">
        <div style="width: 99%;">
            <div class="header clearfix">
                <div class="title">{{communityName}}充电可视化</div>
                <div class="top-bar__right">
                    <el-tooltip effect="dark" content="首页" placement="bottom">
                        <div class="top-bar__item">
                            <i class="el-icon-s-home" @click="goToHome"></i>
                        </div>
                    </el-tooltip>
                    <el-tooltip v-if="showFullScren" effect="dark"
                        :content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')" placement="bottom">
                        <div class="top-bar__item">
                            <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'" @click="handleScreen"></i>
                        </div>
                    </el-tooltip>
                </div>
                <div class="mall">
                    <avue-cascader style="width: 100%;" v-model="optionInfo" :dic="options" :props="defaultProps"
                        :placeholder="msg" @change="handleContentChaChange" :clearable="clear"></avue-cascader>
                </div>
                <div class="time">实时数据：（{{newDate}}）</div>
            </div>
            <div>
                <el-row type=flex>
                    <el-col :span=8>
                        <el-row>
                            <el-col class="tag">
                                <div class="titles">充电概况</div>
                                <div>
                                    <div style="width: 50%;float: left;">
                                        <div class="cdFont">最近24小时充电使用次数：{{chargeAllCount}}次</div>
                                        <div class="chart" ref="syl"></div>
                                        <div class="cdFont">使用率：{{chargeUsage}}%</div>
                                    </div>
                                    <div style="width: 45%;float: left;">
                                        <div class="chart" style="margin-top: 16px;" ref="czs"></div>
                                        <div class="cdFont" style="text-align: left;padding-left: 24%;">当前充电插座使用情况</div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col class="tag">
                                <div class="titles">耗电量</div>
                                <div class="chart" style="height: 100%;margin-top: -40px;" ref="hdl"></div>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span=8 class="tagCen">
                        <div class="titles" style="margin-top: 3%;">实时监控</div>
                        <el-row type=flex>
                            <el-col :span=12>
                                <div class="battery">{{degreeDay}}（度）</div>
                                <div class="cdFont" style="margin-top: 3%;">消耗电量</div>
                            </el-col>
                            <el-col :span=12>
                                <div class="timeFrame">{{highTime}}</div>
                                <div class="cdFont" style="margin-top: 3%;">用电高峰时段</div>
                            </el-col>
                        </el-row>
                        <div class="box-warn" style="height: 47%;">
                            <el-row type=flex>
                                <el-col :span=10 style="margin-bottom: 0;">
                                    <el-select style="width: 85%;" v-model="devicePile" @change="selectDevice">
                                        <el-option v-for="item in pileOptions" :key="item.deviceNo"
                                            :label="item.deviceName" :value="item.deviceNo"></el-option>
                                    </el-select>
                                </el-col>
                                <el-col :span=3 class="warnTitle">空闲</el-col>
                                <el-col :span=3 class="warnTitle">充电中</el-col>
                                <el-col :span=3 class="warnTitle">异常</el-col>
                            </el-row>
                            <transition name="el-fade-in">
                                <div class="circle-box" v-show="show">
                                    <div v-for="(item,i) in chargingArr" class="circle-title">
                                        <img :src="item.imgUrl" width="50">
                                        <span class="chargNum">{{i+1>9?i+1:'0'+(i+1)}}</span>
                                    </div>
                                </div>
                            </transition>
                            <div class="circle-box2">
                                <span class="circle" :class="{ circle2:item.selected }" style="cursor: pointer;"
                                    v-for="item in pileOptions" @click="selectDevice(item.deviceNo)"></span>
                            </div>
                        </div>
                        <div style="position: relative;margin: 1% 0;">
                            <span class="warn">安全告警</span>
                            <span class="warn2"></span>
                        </div>
                        <div class="box-warn" style="height: 30px;">
                            <div style="background-color: #253a6c;width: 100%;height: 400%;padding-top: 1%;">
                                <div :class="{lunbo:flag}">
                                    <span v-for="(item,i) in infoList" class="warnTxt"><span
                                            v-if="flag">{{i+1}}、</span>{{item}}</span>
                                    <span v-for="(item,i) in infoList" class="warnTxt" v-show="flag"><span
                                            v-if="flag">{{i+1}}、</span>{{item}}</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span=8 style="margin-left: -12px;">
                        <el-row>
                            <el-col class="tag">
                                <div class="titles">用电安全</div>
                                <div class="chart" ref="ydaq" style="height: 100%;margin-top: -40px;width: 95%;"></div>
                            </el-col>
                            <el-col class="tag">
                                <div class="titles2">插座使用率TOP5</div>
                                <div class="chart" style="height: 100%;margin-top: -40px;" ref="syTop">
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </div>
            <span class="time">综合分析</span>
            <div>
                <el-row type=flex>
                    <el-col :span=8 class="tag">
                        <el-select v-model="dayOption1" style="margin: 1%;z-index: 99;" class="select_d"
                            @change="changeAQYD">
                            <el-option v-for="item in dayOptions1" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <div class="chart" style="height: 100%;margin-top: -40px;" ref="aqyds"></div>
                    </el-col>
                    <el-col :span=8 class="tag">
                        <el-select v-model="dayOption2" style="margin: 1%;z-index: 99;" class="select_d"
                            @change="changeCDCS">
                            <el-option v-for="item in dayOptions2" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <div class="chart" style="height: 100%;margin-top: -40px;" ref="cdcs"></div>
                    </el-col>
                    <el-col :span=8 class="tag">
                        <el-select v-model="dayOption3" style="margin: 1%;z-index: 99;" class="select_d"
                            @change="changeHDL">
                            <el-option v-for="item in dayOptions3" :key="item.value" :label="item.label"
                                :value="item.value"></el-option>
                        </el-select>
                        <div class="chart" style="height: 100%;margin-top: -40px;" ref="hdls"></div>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import { fullscreenToggel, listenfullscreen } from "../../util/util";
    import { mapGetters, mapState } from "vuex";
    import { getUserMessage } from "../../api/house";
    import { getDeviceList, getVisualData } from "../../api/business";
    import screenfull from 'screenfull';
    const echarts = require('echarts');

    export default {
        name: "chargingVisualization",
        data() {
            return {
                defaultProps: { label: 'orgName', value: 'orgId', checkStrictly: true },
                optionInfo: [{ children: [], label: 'orgName', value: 'orgId' }],
                options: [],
                msg: '',
                communityName: '',
                newDate: '',
                dataArr: [],
                orgId: '',
                chargeAllCount: '',
                isFullScren: false,
                chargeUsage: '',
                UFCount: [],
                degreeDay: '',
                show: true,
                safe: [],
                devicePile: '',
                pileOptions: [],
                flag: false,
                clear: false,
                highTime: '',
                deviceArr: [],
                infoList: [],
                degreeH24: [],
                top5List: {
                    chargeId: [],
                    num: []
                },
                chargingArr: [
                    { imgUrl: "/img/chargingVisualization/green.png" },
                    { imgUrl: "/img/chargingVisualization/yellow.gif" },
                    { imgUrl: "/img/chargingVisualization/green.png" },
                    { imgUrl: "/img/chargingVisualization/green.png" },
                    { imgUrl: "/img/chargingVisualization/green.png" },
                    { imgUrl: "/img/chargingVisualization/green.png" },
                    { imgUrl: "/img/chargingVisualization/red.png" },
                    { imgUrl: "/img/chargingVisualization/green.png" },
                    { imgUrl: "/img/chargingVisualization/green.png" },
                    { imgUrl: "/img/chargingVisualization/green.png" },
                ],
                deviceDegreeH24VOS: [],
                socketList: [],
                dayOption1: '0',
                dayOptions1: [{
                    value: '0',
                    label: '最近7天安全用电'
                }, {
                    value: '1',
                    label: '最近半年安全用电'
                }],
                dayOption2: '0',
                dayOptions2: [{
                    value: '0',
                    label: '最近7天充电次数'
                }, {
                    value: '1',
                    label: '最近半年充电次数'
                }],
                dayOption3: '0',
                dayOptions3: [{
                    value: '0',
                    label: '最近7天耗电量'
                }, {
                    value: '1',
                    label: '最近半年耗电量'
                }],
                timer: '',
                weekDay: [],
                weekCDCS: [],
                weekHDL: [],
                monthDay: [],
                monthYDAQ: [],
                monthCDCS: [],
                monthHDL: [],
                weekNormalChargeCounts: [],
                weekOverLoadChargeCounts: [],
                weekFreeChargeCounts: [],
                halfYearNormalChargeCounts: [],
                halfYearOverLoadChargeCounts: [],
                halfYearFreeChargeCounts: [],
                chargeD7VOS: [],
                weekDegreeVOS: [],
                chargeHalfYearVOS: [],
                halfYearDegreeVOS: [],
                deviceCsArr: [],
                deviceHdlArr: [],
                timer2: '',
                time: [],
            }
        },
        computed: {
            ...mapState({
                showFullScren: state => state.common.showFullScren,
            }),
            ...mapGetters([
                "isFullScren", "monitorInfo", 'MapInfo', 'pointDataInfo', "userInfo"
            ])
        },
        watch: {},
        created() {
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
            this.getDate();
            this.getUserMsg();
            getDeviceList(null, "CDB", 50).then(resp => {
                this.deviceArr = resp.data.data.records
            })
            // if (this.userInfo.loginName == 'znxz' || this.userInfo.loginName == 'adminL') {
            //     this.orgId = '1288001885620092929'
            // } else {
            //     this.orgId = '1272361230558552066'
            // }
        },
        mounted() {
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
            this.$nextTick(() => {
                this.getBigScreen();
                this.timer = setInterval(() => {
                    this.getDate();
                    console.log("页面重新渲染！");
                    this.getBigScreen();
                    // 监听窗口大小改变，screenfull.isFullscreen的值为是否全屏，若是则true，反之false
                    window.onresize = () => {
                        this.isFullScren = screenfull.isFullscreen
                    }
                }, 35 * 1000);
                let i = 0;
                this.timer2 = setInterval(() => {
                    this.selectDevice(this.pileOptions[i].deviceNo);
                    this.devicePile = this.pileOptions[i].deviceNo;
                    if (i + 1 < this.pileOptions.length) {
                        i++
                    } else {
                        i = 0;
                    }
                }, 10 * 1000);
            })
        },
        beforeDestroy() {
            this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            clearInterval(this.timer);
            clearInterval(this.timer2);
        },
        methods: {
            getUserMsg() {
                let userOrgList = this.userInfo.userOrgList;
                let roleData = this.userInfo.roleList;
                let userOrgDesc = '';
                let userOrg = "";
                if (roleData.length > 0) {
                    console.log("roleType=" + roleData[0].roleType + ">>>");
                    this.roleType = roleData[0].roleType;
                }
                userOrgList.forEach(v => {
                    let orgId = v.orgId;
                    let orgDesc = v.orgDesc;
                    userOrgDesc = userOrgDesc + orgDesc + "#";
                    userOrg = userOrg + orgId + "#";
                });
                let that = this;
                getUserMessage(userOrg, userOrgDesc, this.roleType, "CDB").then(resp => {
                    that.options = resp.data.data;
                    if (that.options[0].children) {
                        this.getFirstOrgName(that.options[0].children);
                    } else {
                        this.dataArr.push({ name: that.options[0].orgName })
                    }
                    that.dataArr.forEach(j => {
                        that.msg = that.msg + '/' + j.name;
                        this.communityName = j.name
                    })
                    if (that.options[0].children) {
                        this.msg = that.options[0].orgName + this.msg
                    } else {
                        this.msg = that.options[0].orgName
                    }
                    that.orgId = that.dataArr[that.dataArr.length - 1].orgId
                    that.optionInfo.value = resp.data.data[0].orgId;
                    that.reqId = that.optionInfo;
                    if (that.roleType === 4) {
                        that.reqType = 2;
                    }
                    that.getBigScreen();
                })
            },
            getFirstOrgName(data) {
                this.dataArr.push({ name: data[0].orgName, orgId: data[0].orgId })
                if (data[0].children != null) {
                    this.getFirstOrgName(data[0].children);
                }
            },
            getDate() {
                var myDate = new Date();
                //获取当前年
                var year = myDate.getFullYear();
                //获取当前月
                var month = myDate.getMonth() + 1;
                //获取当前日
                var date = myDate.getDate();
                var h = myDate.getHours();
                var m = myDate.getMinutes();
                //获取当前时间
                var now = year + '-' + this.conver(month) + "-" + this.conver(date) + " " + this.conver(h) + ':' + this.conver(m);
                this.newDate = now;
                //获取最近7天
                this.weekDay = new Array();
                if (date < 8) {
                    for (let i = 1; i < date; i++) {
                        this.weekDay.push(this.conver(month) + "-" + this.conver(date - i));
                    }
                    let lastmonth = month == 1 ? 12 : month - 1;
                    if (lastmonth == 1 || lastmonth == 3 || lastmonth == 5 || lastmonth == 7 || lastmonth == 8 || lastmonth == 10 || lastmonth == 12) {
                        for (let i = 0; i < 8 - date; i++) {
                            this.weekDay.push(this.conver(lastmonth) + "-" + this.conver(31 - i));
                        }
                    } else if (lastmonth == 2) {
                        if (year % 4 == 0) {
                            for (let i = 0; i < 8 - date; i++) {
                                this.weekDay.push(this.conver(lastmonth) + "-" + this.conver(29 - i));
                            }
                        } else {
                            for (let i = 0; i < 8 - date; i++) {
                                this.weekDay.push(this.conver(lastmonth) + "-" + this.conver(28 - i));
                            }
                        }
                    } else {
                        for (let i = 0; i < 8 - date; i++) {
                            this.weekDay.push(this.conver(lastmonth) + "-" + this.conver(30 - i));
                        }
                    }
                } else {
                    for (let i = 1; i < 8; i++) {
                        this.weekDay.push(this.conver(month) + "-" + this.conver(date - i));
                    }
                }
                //获取最近半年
                this.monthDay = new Array();
                if (month > 6) {
                    for (let i = 1; i < 7; i++) {
                        this.monthDay.push(year + '-' + this.conver(month - i))
                    }
                } else {
                    for (let i = 1; i < month; i++) {
                        this.monthDay.push(year + '-' + this.conver(month - i))
                    }
                    for (let i = 0; i < 7 - month; i++) {
                        this.monthDay.push((year - 1) + '-' + this.conver(12 - i))
                    }
                }
                //获取最近24小时
                this.time = new Array();
                for (let i = 0; i < h + 1; i++) {
                    this.time.push(this.conver(h - i) + ':00')
                }
                for (let i = 23 - h; i > 0; i--) {
                    this.time.push(this.conver(h + i) + ':00')
                }
                // let arr = new Array();
                // for (let i = 0; i < this.time.length; i++) {
                //     if (i % 2 == 0) {
                //         arr.push(this.time[i])
                //     }
                // }
                // this.time = arr
            },
            conver(s) {
                return s < 10 ? '0' + s : s;
            },
            getBigScreen() {
                if (this.orgId == "" || this.orgId == null) {
                    return
                }
                let that = this
                getVisualData("2", this.orgId).then(resp => {
                    //数据初始化
                    this.UFCount = new Array();
                    this.safe = new Array();
                    this.top5List.chargeId = new Array();
                    this.top5List.num = new Array();
                    this.pileOptions = new Array();
                    this.weekCDCS = new Array();
                    this.weekHDL = new Array();
                    this.monthYDAQ = new Array();
                    this.monthCDCS = new Array();
                    this.monthHDL = new Array();
                    this.weekNormalChargeCounts = new Array();
                    this.weekOverLoadChargeCounts = new Array();
                    this.weekFreeChargeCounts = new Array();
                    this.halfYearNormalChargeCounts = new Array();
                    this.halfYearOverLoadChargeCounts = new Array();
                    this.halfYearFreeChargeCounts = new Array();
                    this.chargeD7VOS = new Array();
                    this.weekDegreeVOS = new Array();
                    this.chargeHalfYearVOS = new Array();
                    this.halfYearDegreeVOS = new Array();
                    this.deviceCsArr = new Array();
                    this.deviceHdlArr = new Array();
                    this.deviceDegreeH24VOS = new Array();
                    let data = resp.data.data;
                    this.chargeAllCount = data.chargeAllCount;
                    this.chargeUsage = data.chargeUsage;
                    this.UFCount.push({ name: '使用插座数', value: data.chargeUserCount }, { name: '空闲插座数', value: data.chargeFreeCount });
                    this.degreeDay = data.degreeDay;
                    this.highTime = data.highTime;
                    that.safe.push({ name: '过载断电', value: data.overLoadNum }, { name: '空载断电', value: data.freeNum }, { name: '充满自停', value: data.normalNum })
                    this.infoList = data.infoList.length == 0 ? ["暂无告警信息"] : data.infoList;
                    this.flag = data.infoList.length == 0 || data.infoList.length == 1 ? false : true;
                    this.degreeH24 = data.degreeH24;
                    data.top5List.forEach(v => {
                        this.deviceArr.forEach(k => {
                            if (v.deviceNo == k.deviceNo) {
                                that.top5List.chargeId.push(k.deviceName + '-' + v.chargeId);
                                this.top5List.num.push({ name: k.deviceName + ' ' + v.chargeId, value: v.num });
                            }
                        })
                    })
                    data.deviceDegreeH24VOS.forEach(v => {
                        this.deviceArr.forEach(k => {
                            if (v.deviceNo == k.deviceNo) {
                                this.deviceDegreeH24VOS.push({ name: k.deviceName, value: v.degrees.reverse() })
                            }
                        })
                    })
                    this.socketList = data.socketList;
                    data.socketList.forEach(v => {
                        this.deviceArr.forEach(k => {
                            if (v.deviceNo == k.deviceNo) {
                                this.pileOptions.push({ deviceName: k.deviceName, deviceNo: k.deviceNo, selected: false })
                                this.deviceCsArr.push(k.deviceName);
                                this.deviceHdlArr.push(k.deviceName);
                            }
                        })
                    })
                    this.deviceCsArr.push("总次数");
                    this.deviceHdlArr.push("总耗电量");
                    that.pileOptions[0].selected = true;
                    this.devicePile = this.pileOptions[0].deviceNo;
                    this.weekCDCS = data.chargeCounts;
                    this.weekHDL = data.weekDegree;
                    this.monthCDCS = data.halfYearChargeCounts;
                    this.monthHDL = data.halfYearDegree;
                    this.weekNormalChargeCounts = data.weekNormalChargeCounts;
                    this.weekOverLoadChargeCounts = data.weekOverLoadChargeCounts;
                    this.weekFreeChargeCounts = data.weekFreeChargeCounts;
                    this.halfYearNormalChargeCounts = data.halfYearNormalChargeCounts;
                    this.halfYearOverLoadChargeCounts = data.halfYearOverLoadChargeCounts;
                    this.halfYearFreeChargeCounts = data.halfYearFreeChargeCounts;
                    data.chargeD7VOS.forEach(v => {
                        this.deviceArr.forEach(k => {
                            if (v.deviceNo == k.deviceNo) {
                                this.chargeD7VOS.push({ name: k.deviceName, value: v.chargeCounts })
                            }
                        })
                    })
                    data.weekDegreeVOS.forEach(v => {
                        this.deviceArr.forEach(k => {
                            if (v.deviceNo == k.deviceNo) {
                                this.weekDegreeVOS.push({ name: k.deviceName, value: v.degrees })
                            }
                        })
                    })
                    data.chargeHalfYearVOS.forEach(v => {
                        this.deviceArr.forEach(k => {
                            if (v.deviceNo == k.deviceNo) {
                                this.chargeHalfYearVOS.push({ name: k.deviceName, value: v.chargeCounts })
                            }
                        })
                    })
                    data.halfYearDegreeVOS.forEach(v => {
                        this.deviceArr.forEach(k => {
                            if (v.deviceNo == k.deviceNo) {
                                this.halfYearDegreeVOS.push({ name: k.deviceName, value: v.degrees })
                            }
                        })
                    })
                    this.selectDevice(this.devicePile);
                    this.initData();
                })
            },
            selectDevice(val) {
                this.devicePile = val;
                this.show = false
                setTimeout(() => {
                    this.show = true
                }, 200);
                this.socketList.forEach((v, i) => {
                    if (v.deviceNo == val) {
                        this.pileOptions.forEach(k => {
                            k.selected = false;
                        })
                        this.pileOptions[i].selected = true
                        for (let i = 0; i < v.socketDaily.length; i++) {
                            switch (v.socketDaily[i]) {
                                case 0:
                                    this.chargingArr[i].imgUrl = '/img/chargingVisualization/green.png';
                                    break;
                                case 2:
                                    this.chargingArr[i].imgUrl = '/img/chargingVisualization/yellow.gif';
                                    break;
                                case 3:
                                    this.chargingArr[i].imgUrl = '/img/chargingVisualization/red.png';
                                    break;
                            }
                        }
                    }
                })
            },
            goToHome() {
                this.$router.push("/wel");
                this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            },
            handleScreen() {
                fullscreenToggel();
                this.isFullScren = !this.isFullScren;
            },
            handleContentChaChange(value) {
                console.log(this.options)
                console.log(value);
                this.changeCommunity(this.options, value)
                if (typeof value[value.length - 1] == "string") {
                    this.orgId = value[value.length - 1];
                }
                this.dayOption1 = '0';
                this.dayOption2 = '0';
                this.dayOption3 = '0';
                this.getDate();
                console.log("页面重新渲染！");
                this.getBigScreen();
            },
            changeCommunity(options, value) {
                options.forEach(v => {
                    value.forEach(k => {
                        if (v.orgId == k) {
                            if (v.children) {
                                this.changeCommunity(v.children, value)
                            } else {
                                this.communityName = v.orgName;
                            }
                        }
                    })
                })
            },
            initData() {
                //充电使用率
                const syl = echarts.init(this.$refs.syl);
                syl.setOption({
                    color: ["#cccccc", "#00c7f1"],
                    title: {
                        show: false,
                        text: "使用率",
                        textStyle: {
                            fontSize: 16,
                            padding: "10px"
                        }
                    },
                    tooltip: {
                        show: true,
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} "
                    },
                    xAxis: {
                        data: [0],
                        color: 'white',
                        axisLine: {
                            show: false,
                        },
                        axisLabel: {
                            textStyle: {
                                color: '#c0e8ff'
                            }
                        }
                    },
                    axisTick: {
                        show: false,
                    },
                    yAxis: {
                        show: false,
                        splitArea: { show: false }
                    },
                    grid: {
                        show: false,
                        height: '90',
                        top: '10'
                    },
                    series: [
                        {
                            barGap: "-100%", /*这里设置包含关系，只需要这一句话*/
                            barWidth: 20,
                            data: ["100"],
                            name: "",
                            type: "bar",
                            z: 1
                        },
                        {
                            barWidth: 20,
                            data: [this.chargeUsage],
                            name: "",
                            type: "bar",
                            z: 2
                        }
                    ]
                }, true);

                //插座使用情况
                const czs = echarts.init(this.$refs.czs);
                czs.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    label: {
                        color: '#ffffff'
                    },
                    labelLine: {
                        lineStyle: {
                            color: '#ffffff'
                        },
                        smooth: 0.5,
                        length: 10,
                        length2: 10
                    },
                    color: ['#ff6b7f', '#00c7f1'],
                    // legend: {
                    //     data: ["使用插座数", "空闲插座数"],
                    //     orient: 'vertical',
                    //     y: 'center',
                    //     x: 'right',
                    //     icon: "circle",
                    //     textStyle: {
                    //         color: '#fff',
                    //         fontSize: '10'
                    //     },
                    //     itemWidth: 8,
                    //     itemHeight: 8,
                    // },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '30',
                            center: ['60%', '60%'],
                            clockwise: false,
                            hoverOffset: false,
                            data: this.UFCount,
                            roseType: false,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: '{b}\n{c}'
                                    },
                                    labelLine: { show: true }
                                }
                            },
                        }
                    ]
                }, true);

                //用电安全
                const ydaq = echarts.init(this.$refs.ydaq);
                ydaq.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    label: {
                        color: '#ffffff'
                    },
                    labelLine: {
                        lineStyle: {
                            color: '#ffffff'
                        },
                        smooth: 0.5,
                        length: 10,
                        length2: 10
                    },
                    color: ['#4d8dd7', '#d24c55', '#52d772'],
                    // legend: {
                    //     data: ["过载断电", "空载断电", "充满自停"],
                    //     orient: 'vertical',
                    //     y: 'center',
                    //     x: 'right',
                    //     icon: "circle",
                    //     textStyle: {
                    //         color: '#fff',
                    //         fontSize: '10'
                    //     },
                    //     itemWidth: 8,
                    //     itemHeight: 8,
                    // },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '40',
                            center: ['50%', '50%'],
                            hoverOffset: false,
                            clockwise: false,
                            data: this.safe,
                            roseType: false,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: '{b}:{d}%'
                                    },
                                    labelLine: { show: true }
                                }
                            }
                        }
                    ]
                }, true);

                //插座使用率TOP5
                const syTop = echarts.init(this.$refs.syTop);
                syTop.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "({b}):{c}"
                    },
                    label: {
                        color: '#ffffff'
                    },
                    xAxis: {
                        show: true,
                        type: 'category',
                        data: this.top5List.chargeId,
                        axisLine: {
                            show: false,
                            lineStyle: {
                                color: '#ffffff',
                            }
                        },
                        axisTick: {
                            show: false,
                        },
                        axisLabel: {
                            interval: 0,
                            // rotate: 10,
                            formatter: function (value, index) {
                                let v = value.substring(0, 2) + '...' + value.substring(value.length - 4, value.length)
                                return value.length > 7 ? v : value
                            }
                        }
                    },
                    yAxis: {
                        show: true,
                        type: 'value',
                        minInterval: 1,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            },
                            formatter: '{value}'

                        }
                    },
                    color: ['#5DAFF6', '#9B4AEB', '#8CB50B', '#F7C44E'],
                    series: [
                        {
                            name: '',
                            data: this.top5List.num,
                            type: 'bar',
                            roseType: 'radius',
                            barWidth: '40',
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {
                                    color: function (params) {
                                        var colorList = ['#4b9bcb', '#d35e70', '#6bd163', '#ca5378', '#dc8863'];
                                        return colorList[params.dataIndex]
                                    },
                                    label: { show: false, position: 'top' },
                                    barBorderRadius: [5, 5, 0, 0],
                                    barCategoryGap: '10%',  // 柱形的间距
                                },
                            }
                        }
                    ]
                }, true);

                //24h耗电量
                let arr = new Array()
                let color = ["#52d772", "#d24c55", "#5488c8"]
                this.deviceDegreeH24VOS.forEach((v, i) => {
                    arr.push({
                        name: v.name,
                        type: 'line',
                        data: v.value.reverse(),
                        barWidth: 5,
                        color: color[i]
                    })
                })
                arr.push({
                    name: '总电量',
                    type: 'line',
                    data: this.degreeH24,
                    color: '#ffb600',
                    // symbol: 'none'
                })
                const hdl = echarts.init(this.$refs.hdl);
                hdl.setOption({
                    tooltip: {
                        trigger: 'item',
                    },
                    label: {
                        color: '#ffffff'
                    },
                    xAxis: {
                        show: true,
                        type: 'category',
                        data: this.time.reverse(),
                        boundaryGap: false,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#ffffff',
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            interval: 1,
                            rotate: 40
                        }
                    },
                    yAxis: {
                        name: '(耗电量/度)',
                        nameTextStyle: {
                            fontSize: '12'
                        },
                        show: true,
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            },
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: 'white',
                            }
                        },
                        splitLine: {
                            show: false  //显示网格线
                        }
                    },
                    grid: {
                        left: '8%',
                        // top: '12%',
                        right: '5%',
                        bottom: '15%',
                        containLabel: true
                    },
                    series: arr
                }, true)
                this.changeAQYD(this.dayOption1);
                this.changeCDCS(this.dayOption2);
                this.changeHDL(this.dayOption3);
            },
            changeAQYD(val) {
                const aqyds = echarts.init(this.$refs.aqyds);
                aqyds.setOption({
                    tooltip: {
                        trigger: 'item',
                    },
                    label: {
                        color: '#ffffff'
                    },
                    xAxis: {
                        show: true,
                        type: 'category',
                        data: val == 0 ? this.weekDay : this.monthDay,
                        boundaryGap: false,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#5488c8',
                            }
                        },
                        axisTick: {
                            show: false
                        },
                    },
                    yAxis: {
                        name: '(数量/次)',
                        nameTextStyle: {
                            fontSize: '12'
                        },
                        show: true,
                        type: 'value',
                        minInterval: 1,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            },
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#5488c8',
                            },
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#5488c8',
                            }
                        }
                    },
                    legend: {
                        data: ["充满自停", "过载断电", "空载断电"],
                        // right: 50,
                        // top: 20,
                        bottom: 15,
                        icon: "circle",
                        textStyle: {
                            color: '#fff',
                            fontSize: '12'
                        },
                        itemWidth: 8,
                        itemHeight: 8,
                    },
                    series: [
                        {
                            name: '充满自停',
                            type: 'line',
                            data: val == 0 ? this.weekNormalChargeCounts : this.halfYearNormalChargeCounts,
                            color: '#52d772',
                            // symbol: 'none'
                        },
                        {
                            name: '过载断电',
                            type: 'line',
                            data: val == 0 ? this.weekOverLoadChargeCounts : this.halfYearOverLoadChargeCounts,
                            color: '#4d8dd7',
                            // symbol: 'none'
                        },
                        {
                            name: '空载断电',
                            type: 'line',
                            data: val == 0 ? this.weekFreeChargeCounts : this.halfYearFreeChargeCounts,
                            color: '#d34650',
                            // symbol: 'none'
                        }
                    ]
                }, true);
            },
            changeCDCS(val) {
                let arr = new Array()
                let color = ["#01c7ef", "#ff4869", "#b6a0f9"]
                if (val == 0) {
                    this.chargeD7VOS.forEach((v, i) => {
                        arr.push({
                            name: v.name,
                            type: 'bar',
                            data: v.value,
                            barWidth: 5,
                            color: color[i]
                        })
                    })
                    arr.push({
                        name: '总次数',
                        type: 'line',
                        data: this.weekCDCS,
                        color: '#358dac',
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: "#358dac" },
                                    { offset: 1, color: "#1b2849" }
                                ])
                            }
                        }, //填充区域样式
                    })
                } else {
                    this.chargeHalfYearVOS.forEach((v, i) => {
                        arr.push({
                            name: v.name,
                            type: 'bar',
                            data: v.value,
                            barWidth: 5,
                            color: color[i]
                        })
                    })
                    arr.push({
                        name: '总次数',
                        type: 'line',
                        data: this.monthCDCS,
                        color: '#358dac',
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: "#358dac" },
                                    { offset: 1, color: "#1b2849" }
                                ])
                            }
                        }, //填充区域样式
                    })
                }
                const cdcs = echarts.init(this.$refs.cdcs);
                cdcs.setOption({
                    tooltip: {
                        trigger: 'item',
                    },
                    label: {
                        color: '#ffffff'
                    },
                    xAxis: {
                        show: true,
                        type: 'category',
                        data: val == 0 ? this.weekDay : this.monthDay,
                        // boundaryGap: false,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#5488c8',
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            },
                        },
                    },
                    yAxis: {
                        name: '(充电次数)',
                        nameTextStyle: {
                            fontSize: '12'
                        },
                        show: true,
                        type: 'value',
                        minInterval: 1,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            },
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#5488c8',
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#5488c8',
                            }
                        }
                    },
                    legend: {
                        data: this.deviceCsArr,
                        // right: 50,
                        // top: 20,
                        bottom: 15,
                        icon: "circle",
                        textStyle: {
                            color: '#fff',
                            fontSize: '12'
                        },
                        itemWidth: 8,
                        itemHeight: 8,
                    },
                    series: arr
                }, true);
            },
            changeHDL(val) {
                let arr = new Array()
                let color = ["#01c7ef", "#ff4869", "#b6a0f9"]
                if (val == 0) {
                    this.weekDegreeVOS.forEach((v, i) => {
                        arr.push({
                            name: v.name,
                            type: 'bar',
                            data: v.value,
                            barWidth: 5,
                            color: color[i]
                        })
                    })
                    arr.push({
                        name: '总耗电量',
                        type: 'line',
                        data: this.weekHDL,
                        color: '#4366a8',
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: "#4366a8" },
                                    { offset: 1, color: "#1b2849" }
                                ])
                            }
                        }, //填充区域样式
                    })
                } else {
                    this.halfYearDegreeVOS.forEach((v, i) => {
                        arr.push({
                            name: v.name,
                            type: 'bar',
                            data: v.value,
                            barWidth: 5,
                            color: color[i]
                        })
                    })
                    arr.push({
                        name: '总耗电量',
                        type: 'line',
                        data: this.monthHDL,
                        color: '#4366a8',
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                    { offset: 0, color: "#4366a8" },
                                    { offset: 1, color: "#1b2849" }
                                ])
                            }
                        }, //填充区域样式
                    }, true)
                }
                const hdls = echarts.init(this.$refs.hdls);
                hdls.setOption({
                    tooltip: {
                        trigger: 'item',
                    },
                    label: {
                        color: '#ffffff'
                    },
                    xAxis: {
                        show: true,
                        type: 'category',
                        data: val == 0 ? this.weekDay : this.monthDay,
                        // boundaryGap: false,
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '##5488c8',
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            },
                        },
                    },
                    yAxis: {
                        name: '(耗电量/度)',
                        show: true,
                        type: 'value',
                        nameTextStyle: {
                            fontSize: '12'
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            },
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {
                                color: '#5488c8',
                            }
                        },
                        splitLine: {
                            lineStyle: {
                                color: '#5488c8',
                            }
                        }
                    },
                    legend: {
                        data: this.deviceHdlArr,
                        // right: 50,
                        // top: 20,
                        bottom: 15,
                        icon: "circle",
                        textStyle: {
                            color: '#fff',
                            fontSize: '12'
                        },
                        itemWidth: 8,
                        itemHeight: 8,
                    },
                    series: arr
                }, true);
            }
        }
    }
</script>

<style scoped>
    * {
        font-weight: 100;
    }

    .box-bg {
        width: 100%;
        /* height: 100%; */
        background: url("../../../public/img/chargingVisualization/bgimg.png") no-repeat;
        background-size: 100% 100%;
        /* overflow: hidden; */
    }

    .header {
        width: 100%;
        /* height: 100%; */
        margin-bottom: 5px;
    }

    .el-icon-s-home:before {
        color: #fff;
        cursor: pointer;
    }

    .icon-quanping:before {
        color: #fff;
        cursor: pointer;
    }

    .icon-tuichuquanping:before {
        color: #fff;
        cursor: pointer;
    }


    .tag {
        background: url("../../../public/img/chargingVisualization/bgimg2.png") no-repeat center center;
        background-size: 100% 100%;
        height: 200px;
        margin: 5px;
    }

    .tagCen {
        background: url("../../../public/img/chargingVisualization/bgimg2.png") no-repeat center center;
        background-size: 100% 100%;
        margin: 2px 1% 9px;
    }

    .clearfix:after {
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        *zoom: 1;
    }

    .chart {
        width: 100%;
        height: 100px;
        float: left;
    }

    .titles,
    .titles2 {
        text-align: center;
        background: url("../../../public/img/chargingVisualization/titles.png") no-repeat center center;
        background-size: 100% 100%;
        color: #fff;
        font-size: 14px;
        height: 33px;
        line-height: 33px;
        margin: 2%;
    }

    .titles2 {
        background: url("../../../public/img/chargingVisualization/titles2.png") no-repeat center center;
        background-size: 110% 100%;
        font-size: 12px;
    }

    .cdFont {
        color: #fff;
        font-size: 14px;
        text-align: center;
    }

    .battery,
    .timeFrame {
        width: 80%;
        margin: 0 auto;
        font-weight: bold;
        font-size: 1.25rem;
        height: 50px;
        line-height: 50px;
        color: #fff;
        background: url("../../../public/img/chargingVisualization/dc.png") no-repeat center center;
        background-size: 100% 100%;
        text-align: center;
    }

    .timeFrame {
        background: url("../../../public/img/chargingVisualization/times.png") no-repeat center center;
        border-radius: 10px;
    }

    .warn {
        color: #ffffff;
        font-size: 14px;
        margin-left: 5%;
    }

    /* .warn::after {
        content: url(../../../public/img/chargingVisualization/warn.png);
    } */

    .warn2 {
        background: url(../../../public/img/chargingVisualization/warn.png) no-repeat center center;
        background-size: 100% 100%;
        display: inline-block;
        width: 14px;
        height: 12px;
        margin-left: 5px;
        position: absolute;
        left: 80px;
        top: 4px;
    }

    .box-warn {
        width: 90%;
        margin: 0 auto;
        border: 1px solid #18a5e7;
        overflow: hidden;
    }

    .lunbo {
        animation: warnMove 5s linear infinite;
    }

    @keyframes warnMove {
        0% {
            margin-top: 0;
        }

        50% {
            margin-top: -50px;
        }

        100% {
            margin-top: -100px;
        }
    }

    .warnTitle {
        font-size: 14px;
        color: #ffffff;
        display: inline-block;
        margin: 10px;
    }

    .warnTitle::before {
        content: ' ';
        position: absolute;
        margin-left: -12px;
        top: 15px;
        width: 8px;
        height: 8px;
        background-color: #52d772;
        border-radius: 4px;
    }

    .warnTitle:nth-child(3)::before {
        background-color: #f5b109;
    }

    .warnTitle:nth-child(4)::before {
        background-color: #e71717;
    }

    .circle-box {
        width: 92%;
        height: 120px;
        margin: 0 auto;
    }

    .top-bar__right {
        margin-top: 1%;
    }

    @media screen and (max-width:1377px) {
        .circle-title {
            width: 50px;
            height: 50px;
            margin: 5px 7px;
            float: left;
            position: relative;
        }

        .mall {
            position: relative;
            margin: 11px auto 0;
            width: 300px;
            top: 20px;
        }

        .time {
            color: #fff;
            font-size: 14px;
            margin-left: 1%;
            margin-top: -12px;
        }

        .title {
            text-align: center;
            height: 50px;
            margin: 0;
            top: 20px;
            position: relative;
            line-height: 50px;
            font-size: 28px;
            background-image: -webkit-linear-gradient(bottom, #79ceff, #fff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 500;
        }

        .titles,
        .titles2 {
            font-size: 13px;
        }

        .warnTxt,
        .el-input--mini {
            font-size: 12px;
            /* white-space: nowrap; */
            /* -webkit-transform-origin-x: 0; */
            /*缩小后文字居左*/
            /* -webkit-transform: scale(0.90); */
        }

        .cdFont {
            color: #fff;
            font-size: 14px;
            text-align: center;
        }

        .select_d {
            width: 40%;
        }

        .top-bar__right {
            margin-top: 10px;
        }

        .circle-box {
            width: 87%;
            height: 120px;
            margin: 0 auto;
        }

        /deep/.el-input__inner {
            font-size: 8px;
        }
    }

    @media screen and (min-width:1377px) {
        .circle-title {
            width: 50px;
            height: 50px;
            margin: 5px 15px;
            float: left;
            position: relative;
        }

        .mall {
            position: relative;
            margin: 0 auto;
            width: 300px;
            top: 40px;
        }

        .time {
            color: #fff;
            font-size: 1.25rem;
            margin-left: 1%;
        }

        .title {
            text-align: center;
            height: 50px;
            margin: 0;
            top: 20px;
            position: relative;
            line-height: 50px;
            font-size: 28px;
            background-image: -webkit-linear-gradient(bottom, #79ceff, #fff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 500;
        }
    }

    .circle-box2 {
        text-align: center;
        margin-top: 5px;
    }

    .circle {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #ffffff;
        margin: 0 5px;
    }

    .circle2 {
        background-color: #52d772;
    }

    .warnTxt {
        font-size: 13px;
        display: block;
        width: 95%;
        margin: 3px auto;
        color: #52d772;
        text-align: center;
        /* background-color: #253a6c; */
    }

    .chargNum {
        display: inline-block;
        width: 50px;
        position: absolute;
        left: 0;
        color: #ffffff;
        font-weight: bold;
        font-size: 20px;
        height: 50px;
        line-height: 50px;
        text-align: center;
    }

    /deep/.el-input__inner {
        background-color: transparent;
        background-image: none;
        border-radius: 4px;
        border: 1px solid transparent;
        border-top-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
        border-left-color: transparent;
        box-sizing: border-box;
        color: #fff;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        padding-right: 15px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
    }
</style>