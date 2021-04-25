<template>
    <div class="main-bg">
        <div class="header">
            <div style="font-size: 1.5rem;position: relative;text-align: center">{{cityName}}垃圾分类可视化数据平台</div>
            <div class="top-bar__right" style="margin-top: 10px;">
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
        </div>
        <div>
            <div style="font-size: 1rem;color: white;width: 100%;margin-bottom: 1%;"> 今日实时数据：({{nowDate}})</div>
            <el-row type="flex">
                <el-col :span=5 style="margin-right: 1%;" class="card">
                    <div class="m-Statistics-top">垃圾投放总量</div>
                    <div style="color: #73F8F8;text-align: center;margin: 3% 0;">
                        <span style="font-size: 1.5rem;">{{today.totalWeight}}</span>
                        <span style="font-size: .8rem;">kg</span>
                    </div>
                    <div style="font-size: .7rem;color:#C0E8FF;text-align: center;margin-bottom: 12%;">
                        <span style="margin-right: 2%;">上午段：{{today.totalWeightAm}}kg</span>
                        <span style="margin-left: 2%;">下午段：{{today.totalWeightPm}}kg</span>
                    </div>
                </el-col>
                <el-col :span=5 style="margin-right: 1%;" class="card">
                    <div class="m-Statistics-top">垃圾投放总次数</div>
                    <div style="color: #73F8F8;text-align: center;margin: 3% 0;">
                        <span style="font-size: 1.5rem;">{{today.totalTimes}}</span>
                        <span style="font-size: .8rem;">次</span>
                    </div>
                    <div style="font-size: .7rem;color:#C0E8FF;text-align: center;margin-bottom: 12%;">
                        <span style="margin-right: 2%;">上午段：{{today.totalTimesAm}}次</span>
                        <span style="margin-left: 2%;">下午段：{{today.totalTimesPm}}次</span>
                    </div>
                </el-col>
                <el-col :span=5 style="margin-right: 1%;" class="card">
                    <div class="m-Statistics-top">投放人次</div>
                    <div style="color: #73F8F8;text-align: center;margin: 3% 0;">
                        <span style="font-size: 1.5rem;">{{today.totalAuthTimes}}</span>
                        <span style="font-size: .8rem;">人</span>
                    </div>
                    <div style="font-size: .7rem;color:#C0E8FF;text-align: center;">
                        <span style="margin-right: 2%;">刷脸：{{today.faceAuthTimes}}次</span>
                        <span style="margin-left: 2%;">刷卡：{{today.totalWeightPm}}次</span>
                    </div>
                    <div style="font-size: .7rem;color:#C0E8FF;text-align: center;">直接投放：{{today.noAuthTimes}}次</div>
                </el-col>
                <el-col :span=5 style="margin-right: 1%;" class="card">
                    <div class="m-Statistics-top">投放正确率</div>
                    <div style="color: #73F8F8;text-align: center;margin: 3% 0;">
                        <span style="font-size: 1.5rem;">{{today.totalCorrectTimesRate}}</span>
                        <span style="font-size: .8rem;">%</span>
                    </div>
                </el-col>
                <el-col :span=5 class="card">
                    <div style="margin-top: 1.5rem;">
                        <span class="span-left">网点数量</span>
                        <span class="span-right">{{mallCount}}个</span>
                    </div>
                    <div>
                        <span class="span-left">二分类亭</span>
                        <span class="span-right">{{device2Count}}台</span>
                    </div>
                    <div>
                        <span class="span-left">四分类亭</span>
                        <span class="span-right">{{device4Count}}台</span>
                    </div>
                </el-col>
            </el-row>
            <!-- <div style="color: white;position: relative;bottom: 1rem">
                <div class="m-Statistics">
                    <img src="/img/top_bg_jx.png" />
                    <div class="m-Statistics-top" style="position: relative;bottom: 11px;">垃圾投放总量</div>
                    <div style="color: #73F8F8;font-size: 1.5rem;position: relative;bottom: 6px;">
                        {{today.totalWeight}}<span
                            style="font-size: .8rem;position: relative;bottom: 2px;left: 2px">kg</span></div>
                    <div style="font-size: .7rem;color:#C0E8FF">
                        <span>上午段：{{today.totalWeightAm}}kg</span>
                        <span style="margin-left: 2rem">下午段：{{today.totalWeightPm}}kg</span>
                    </div>
                </div>

                <div class="m-Statistics">
                    <img src="/img/top_bg_jx.png" />
                    <div class="m-Statistics-top" style="position: relative;bottom: 11px;">垃圾投放总次数</div>
                    <div style="color: #73F8F8;font-size: 1.5rem;position: relative;bottom: 6px;">
                        {{today.totalTimes}}<span
                            style="font-size: .8rem;position: relative;bottom: 2px;left: 2px">次</span></div>
                    <div style="font-size: .7rem;color:#C0E8FF">
                        <span>上午段：{{today.totalTimesAm}}次</span>
                        <span style="margin-left: 2rem">下午段：{{today.totalTimesPm}}次</span>
                    </div>
                </div>

                <div class="m-Statistics">
                    <img src="/img/top_bg_jx.png" />
                    <div class="m-Statistics-top" style="margin-top: 1rem;color: white">投放人次</div>
                    <div style="color: #73F8F8;font-size: 1.5rem">{{today.totalAuthTimes}}<span
                            style="font-size: .8rem;position: relative;bottom: 2px;left: 2px">人</span></div>
                    <div style="font-size: .7rem;color:#C0E8FF">
                        <span>刷脸：{{today.faceAuthTimes}}次</span>
                        <span style="margin-left: 2rem">刷卡：{{today.cardAuthTimes}}次</span>
                    </div>
                    <div
                        style="font-size: .7rem;color:#C0E8FF;text-align: left;margin-left: 3.9rem;margin-top: 0.1rem;">
                        <span>直接投放：{{today.noAuthTimes}}次</span>
                    </div>
                </div>

                <div class="m-Statistics">
                    <img src="/img/top_bg_jx.png" />
                    <div class="m-Statistics-top">投放正确率</div>
                    <div style="color: #73F8F8;font-size: 1.5rem">{{today.totalCorrectTimesRate}}<span
                            style="font-size: 1rem">%</span></div>
                    <div style="font-size: .7rem;color:#C0E8FF">
                    </div>
                </div>

                <div class="m-Statistics">
                    <img src="/img/top_bg_jx.png" />
                    <div style="width: 100%;display: flow-root;margin-top: .7rem;display: none">
                        <span class="span-left">参与户数</span>
                        <span class="span-right" style="color: #73F8F8;">{{houseCount}}<span
                                style="font-size: .8rem">户</span></span>
                    </div>
                    <div style="width: 100%;display: flow-root ;margin-top: 1.5rem;">
                        <span class="span-left">网点数量</span>
                        <span class="span-right" style="color: #73F8F8">{{mallCount}}<span
                                style="font-size: .8rem">个</span></span>
                    </div>
                    <div style="width: 100%;display: flow-root;margin-top: .2rem">
                        <span class="span-left">二分类亭</span>
                        <span class="span-right" style="color: #73F8F8">{{device2Count}}<span
                                style="font-size: .8rem">台</span></span>
                    </div>
                    <div style="width: 100%;display: flow-root;margin-top: .2rem">
                        <span class="span-left">四分类亭</span>
                        <span class="span-right" style="color: #73F8F8">{{device4Count}}<span
                                style="font-size: .8rem">台</span></span>
                    </div>

                </div>
            </div> -->
        </div>

        <div>
            <!--left-->
            <div class="center_bg" style="margin-left: 1rem">
                <div class="chart-bg"
                    style="background: url(/img/chart_bg.png);background-size: 100%,100%;width: 450px">
                    <div class="chart-title div-title">每类垃圾重量(kg)</div>
                    <div id="weightDiv" style="width: 100%;height:100%;">
                    </div>
                </div>
                <div class="chart-bg"
                    style="background: url(/img/chart_bg.png);background-size: 100%,100%;width: 450px">

                    <div class="chart-title div-title">投放方式占比</div>
                    <div id="toufangDiv" style="width: 100%;height:100%;font-size: 2rem;color: white">
                    </div>
                </div>
            </div>
            <!--center-->
            <div class="center_bg">
                <div style="margin-left: 1rem">
                    <avue-cascader v-model="optionInfo" :dic="options" :props="defaultProps"
                        @change="handleContentChaChange" :placeholder="placeholder"></avue-cascader>
                    <!--          <el-cascader :options="options" v-model="optionInfo"  :props="defaultProps" @change="handleContentChaChange">-->
                    <!--          </el-cascader>-->
                </div>
                <Map style="width: 400px;position: relative;left: 1rem" :mapImag="mapInfo" :circleList="circleList"
                    :isShowLine="false" isShow="2" />
            </div>

            <!--right-->
            <div class="center_bg">
                <div class="chart-bg"
                    style="background: url(/img/chart_bg.png);background-size: 100%,100%;width: 460px">

                    <div class="chart-title div-title">每类垃圾投放次数</div>
                    <div id="ljtfcsDiv" style="width: 95%;height:80%;">
                    </div>
                </div>
                <div class="chart-bg"
                    style="background: url(/img/chart_bg.png);background-size: 100%,100%;width: 460px">
                    <div class="chart-title div-title">垃圾投放正确率</div>
                    <div id="toufangRightDiv" style="width: 100%;height:100%;">
                    </div>
                </div>
            </div>
        </div>

        <div style="margin-top: .5rem;margin-left: 14px">
            <div style="color: white">综合分析</div>
            <div style="position: relative;bottom: 0rem">
                <div class="chart-bg" style="display: inline-block;">
                    <img :src="weightBtn" class="chart-bg-img" />
                    <div class="chart-title">
                        <span @click="changeMon(0)" v-bind:style="{color:leftColor,position: sxData,top:leftTop}">
                            {{weightTitle}}</span>
                        <span style="position: relative;left: 10rem;bottom: 3px;" v-bind:style="{color:rightColor}"
                            @click="changeMon(1)">
                            当年每月垃圾总量
                        </span>
                    </div>
                    <div id="recodeDiv" style="width: 95%;height:73%;position: relative;top:20px;">
                    </div>

                </div>
                <div class="chart-bg" style="display: inline-block;">
                    <img :src="timeBtn" class="chart-bg-img" />
                    <div class="chart-title">
                        <span @click="changeTimeMon(0)"
                            v-bind:style="{color:leftTimeTitleColor,position: sxData,top:leftTimeTitleTop}">
                            {{timeTitle}}</span>
                        <span @click="changeTimeMon(1)"
                            style="position: relative;left: 7.5rem;bottom: 3px;color: #9EB6D5"
                            v-bind:style="{color:rightTimeTitleColor}">
                            当年每月垃圾投放次数
                        </span>
                    </div>
                    <div id="recodeDiv2" style="width: 95%;height:73%;position: relative;top:20px">
                    </div>
                </div>

                <div class="chart-bg" style="display: inline-block;">
                    <img :src="CorrectRateBtn" class="chart-bg-img" />
                    <div class="chart-title">
                        <span @click="changeCorrectRate(0)"
                            v-bind:style="{color:leftCorrectRateColor,position: sxData,top:CorrectRateTop}">
                            {{CorrectRateTitle}}
                        </span>

                        <span @click="changeCorrectRate(1)" v-bind:style="{color:rightCorrectRateColor}"
                            style="position: relative;left: 8.7rem;bottom: 3px;color: #9EB6D5">
                            当年每月投放正确率
                        </span>
                    </div>
                    <div id="recodeDiv3" style="width: 95%;height:73%;position: relative;top:20px">
                    </div>
                </div>
            </div>
        </div>


    </div>

</template>

<script>
    import { fullscreenToggel, listenfullscreen } from "../../util/util";
    import { mapGetters, mapState } from "vuex";
    import { getArea } from "../../api/system/device";
    const echarts = require('echarts');
    import { getPermissionTempOrgData } from "../../api/tempCheck";
    import { getUserMessage } from "../../api/house";
    import { getVisualData } from "../../api/system/monitor";
    import mapPointData from "../../config/mapPointData";
    import mapData from "../../config/mapData";
    import cityMapPointData from "../../config/cityMapPointData";
    import coordinatesData from "../../config/coordinatesData";
    export default {
        name: "dataVisualization",
        data() {
            return {
                defaultProps: { label: 'orgName', value: 'orgId', checkStrictly: true },
                nowDate: "",//当前时间
                TimerMethod: null,
                mapInfo: 'img/map/东大街地图.png',
                options: [],
                dataArr: [],
                optionInfo: [],
                reqId: '330106',
                houseCount: '0',//参与户数
                mallCount: '0',//网点数
                device2Count: '0', //1托2数
                device4Count: '0',//1托4数
                today: {
                    cardAuthTimes: "0",
                    faceAuthTimes: "0",
                    harmfulCorrectTimes: "0",
                    harmfulCorrectTimesRate: "100%",
                    harmfulTimes: "0",
                    harmfulWeight: "0",
                    noAuthTimes: "0",
                    otherCorrectTimes: "0",
                    otherCorrectTimesRate: "100%",
                    otherTimes: "0",
                    otherWeight: "0",
                    perishableCorrectTimes: "0",
                    perishableCorrectTimesRate: "100%",
                    perishableTimes: "0",
                    perishableWeight: "0",
                    recyclableCorrectTimes: "0",
                    recyclableCorrectTimesRate: "100%",
                    recyclableTimes: "0",
                    recyclableWeight: "0",
                    totalAuthTimes: "0",
                    totalCorrectTimes: "0",
                    totalCorrectTimesRate: "100%",
                    totalTimes: "0",
                    totalTimesAm: "0",
                    totalTimesPm: "0",
                    totalWeight: "0",
                    totalWeightAm: "0",
                    totalWeightPm: "0",
                    ymd: "20201103",
                },
                placeholder: '',
                weightDivList: [0, 0, 0, 0],//每类垃圾重量
                toufangList: [0, 0],//投放方式
                toufangYTimesList: [0, 0, 0, 0],//投放次数Y
                toufangXTimesList: [0, 0, 0, 0],//投放次数X
                toufangCorrectTimesRateList: [100, 100, 100, 100],//投放正确率
                toufangCorrectTimesXRateList: [],
                laskTimes: [],//最近7天的时间
                totalWeightDataList: [0, 0, 0, 0, 0, 0, 0],//总重量
                perishableWeightDataList: [0, 0, 0, 0, 0, 0, 0],//易腐垃圾重量
                recyclableWeightDataList: [0, 0, 0, 0, 0, 0, 0],//可回收物重量
                harmfulWeightDataList: [0, 0, 0, 0, 0, 0, 0],//有害垃圾重量
                otherWeightDataList: [0, 0, 0, 0, 0, 0, 0],//其他重量
                totalTimesDataList: [0, 0, 0, 0, 0, 0, 0],//总次数
                perishableTimesDataList: [0, 0, 0, 0, 0, 0, 0],//易腐次数
                RecyclableTimesDataList: [0, 0, 0, 0, 0, 0, 0],//可回收物次数
                HarmfulTimesDataList: [0, 0, 0, 0, 0, 0, 0],//有害垃圾次数
                otherTimesDataList: [0, 0, 0, 0, 0, 0, 0],//其他次数次数

                perishableCorrectRateDataList: [0, 0, 0, 0, 0, 0, 0],//易腐投放正确率
                recyclableCorrectRateDataList: [0, 0, 0, 0, 0, 0, 0],//可回收物正确率
                harmfulCorrectRateDataList: [0, 0, 0, 0, 0, 0, 0],//有害垃圾正确率
                otherCorrectRateDataList: [0, 0, 0, 0, 0, 0, 0],//其他投放质量正确率

                monthDataList: [],//最近几个月的数据
                perishableCorrectTimesRateDataList: [],//易腐投放正确率
                recyclableCorrectTimesRateDataList: [],//可回收物正确率
                harmfulCorrectTimesRateDataList: [],//有害垃圾正确率
                otherCorrectTimesRateDataList: [],//其他投放质量正确率
                btnDayImg: '/img/tb_left_bg.png',
                btnMonImg: '/img/chart_right_bg.png',
                weightBtn: '/img/tb_left_bg.png',
                timeBtn: '/img/tb_left_bg.png',
                CorrectRateBtn: '/img/tb_left_bg.png',
                weightTitle: '最近七天垃圾总量',
                totalWeightMonDataList: [],//月总重量
                perishableWeightMonDataList: [],//易腐垃圾重量
                recyclableWeightMonDataList: [],//可回收物重量
                harmfulWeightMonDataList: [],//有害垃圾重量
                otherWeightMonDataList: [],//其他重量
                totalTimesMonDataList: [],//月总次数
                perishableMonTimesDataList: [],//易腐次数
                RecyclableMonTimesDataList: [],//可回收物次数
                HarmfulTimesMonDataList: [],//有害垃圾次数
                otherTimesMonDataList: [],//其他次数次数
                timeTitle: '最近七天垃圾投放次数',
                CorrectRateTitle: '最近7天投放正确率',
                circleList: [{ "lineX": 131, "lineY": 241, "deviceNo": "0801", "imgSrc": "/img/device-online.png" }],
                acColor: "#ffffff",
                nomalColor: '#9EB6D5',
                leftColor: '#ffffff',
                rightColor: '#9EB6D5',
                leftTop: '0px',
                sxData: 'relative',
                leftTimeTitleColor: '#ffffff',
                rightTimeTitleColor: '#9EB6D5',
                leftTimeTitleTop: '0px',
                leftCorrectRateColor: '#ffffff',
                rightCorrectRateColor: '#9EB6D5',
                CorrectRateTop: '0px',
                isCity: false,
                cityMap: {},
                cityName: '西湖区',
                roleType: '0',
                reqType: '2'

            }
        }, components: {
            Map: resolve => {
                require(['../OnTheSite/Map'], resolve)
            },
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
        },
        beforeMount() {

        },
        mounted() {
            let that = this;
            listenfullscreen(this.setScreen);
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
            this.getDate();
            this.TimerMethod = setInterval(() => {
                this.getDate();
                this.getData();
            }, 60 * 1000);
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
            this.$nextTick(function () {
                // console.log("渲染完成");
                // this.getArea();
                console.log(this.userInfo);
                let userOrgList = this.userInfo.userOrgList;
                let roleData = this.userInfo.roleList;
                let userOrgDesc = "";
                let userOrg = "";
                console.log(roleData)
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
                getUserMessage(userOrg, userOrgDesc, this.roleType, "RRL4,RRL2").then(res => {
                    console.log(that.filterMall(res.data.data));
                    that.options = res.data.data;
                    // this.placeholder = res.data.data[0].orgName
                    // this.placeholderMsg(res.data.data)
                    let dataArr = [];
                    if (that.options[0].children) {
                        this.getFirstOrgName(that.options[0].children);
                    } else {
                        this.dataArr.push({ name: that.options[0].orgName,orgId:that.options[0].orgId })
                    }
                    that.dataArr.forEach(j => {
                        that.placeholder = that.placeholder + '/' + j.name;
                        that.cityName = j.name
                    })
                    that.placeholder = that.options[0].orgName + that.placeholder
                    this.optionInfo = that.dataArr[that.dataArr.length-1].orgId;
                    this.getOrgName(this.options);
                    this.reqId = this.optionInfo;
                    if (this.roleType === 4) {
                        this.reqType = 2;
                    }
                    this.cityName = this.cityMap[this.optionInfo];
                    for(let i=0;i<that.dataArr.length;i++){
                        mapData.forEach(v=>{
                            if(that.dataArr[i].orgId == v.orgId){
                                that.mapInfo= v.map;
                            }
                        })
                    }
                    this.getData();

                });
            });
        },
        beforeDestroy() {
            // console.log("当前Vue 结束！");
            this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            this.$once('hook:beforeDestroy', () => {
                clearInterval(this.TimerMethod);
            })
        },
        methods: {
            filterMall(data) {
                data.forEach(v => {
                    if (v.children) {
                        v.children.forEach((k, i) => {
                            if (k.children) {
                                this.filterMall(v.children)
                            } else {
                                let flag = false
                                for (let i = 0; i < coordinatesData.length; i++) {
                                    if (k.orgId == coordinatesData[i].orgId) {
                                        flag = true
                                    }
                                }
                                if (flag == false) {
                                    for (let key in v) {
                                        if (v.orgId.length > 6) {
                                            delete v[key];
                                        } else {
                                            for (let j = 0; j < v.children.length; j++) {
                                                if (!v.children[j].orgId) {
                                                    v.children.splice(j, 1)
                                                    j--
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }
                })
                return data
            },
            placeholderMsg(data) {
                data.forEach(v => {
                    if (v.children) {
                        this.placeholder = this.placeholder + "/" + v.orgName
                        this.placeholderMsg(v.children);
                    }
                })
            },
            getFirstOrgName(data) {
                // data.forEach(v => {
                this.dataArr.push({ name: data[0].orgName,orgId:data[0].orgId })
                if (data[0].children != null) {
                    this.getFirstOrgName(data[0].children);
                }
                // })
            },
            getOrgName(data) {
                data.forEach(v => {
                    this.cityMap[v.orgId] = v.orgName;
                    if (v.children != null) {
                        this.getOrgName(v.children);
                    }
                })
            },
            changeMon(type) {
                // console.log("type=="+type)
                if (type == 1) {
                    this.weightBtn = this.btnMonImg;
                    this.rightColor = this.acColor;
                    this.leftColor = this.nomalColor;
                    this.leftTop = '-3px'
                    this.initWeightBar(this.monthDataList, this.totalWeightMonDataList,
                        this.perishableWeightMonDataList,
                        this.otherWeightMonDataList,
                        this.recyclableWeightMonDataList,
                        this.harmfulWeightMonDataList);
                } else if (type == 0) {
                    this.weightBtn = this.btnDayImg;
                    this.rightColor = this.nomalColor;
                    this.leftColor = this.acColor;
                    this.leftTop = '0px'
                    this.initWeightBar(this.laskTimes, this.totalWeightDataList,
                        this.perishableWeightDataList,
                        this.otherWeightDataList,
                        this.recyclableWeightDataList,
                        this.harmfulWeightDataList);
                }

            }, changeTimeMon(type) {
                if (type == 1) {
                    this.timeBtn = this.btnMonImg;
                    this.rightTimeTitleColor = this.acColor;
                    this.leftTimeTitleColor = this.nomalColor;
                    this.leftTimeTitleTop = "-3px"
                    //投放次数
                    this.initTimesBar(this.monthDataList,
                        this.totalTimesMonDataList,
                        this.perishableMonTimesDataList,
                        this.otherTimesMonDataList,
                        this.RecyclableMonTimesDataList,
                        this.HarmfulTimesMonDataList);
                } else {
                    this.timeBtn = this.btnDayImg;
                    this.rightTimeTitleColor = this.nomalColor;
                    this.leftTimeTitleColor = this.acColor;
                    this.leftTimeTitleTop = "0px"

                    //投放次数
                    this.initTimesBar(this.laskTimes,
                        this.totalTimesDataList,
                        this.perishableTimesDataList,
                        this.otherTimesDataList,
                        this.RecyclableTimesDataList,
                        this.HarmfulTimesDataList);
                }
            }, changeCorrectRate(type) {
                if (type == '1') {
                    this.CorrectRateBtn = this.btnMonImg;
                    this.leftCorrectRateColor = this.nomalColor;
                    this.rightCorrectRateColor = this.acColor;
                    this.CorrectRateTop = '-3px';
                    //投放准确率
                    this.initCorrectTimesRate(this.monthDataList,
                        this.perishableCorrectTimesRateDataList,
                        this.otherCorrectTimesRateDataList,
                        this.recyclableCorrectTimesRateDataList,
                        this.harmfulCorrectTimesRateDataList);
                } else {
                    this.CorrectRateBtn = this.btnDayImg;
                    this.leftCorrectRateColor = this.acColor;
                    this.rightCorrectRateColor = this.nomalColor;
                    this.CorrectRateTop = '0px';
                    //投放准确率
                    this.initCorrectTimesRate(this.laskTimes,
                        this.perishableCorrectRateDataList,
                        this.otherCorrectRateDataList,
                        this.recyclableCorrectRateDataList,
                        this.harmfulCorrectRateDataList);
                }

            },
            handleContentChaChange(value) {
                console.log(value);
                if (value.length != 0 && typeof value == "object") {
                    this.reqId = value[value.length - 1];
                    this.mapInfo = 'img/map/东大街地图.png';
                    this.isCity = false;
                    if (this.roleType === 4) {//网点管理员
                        if (value.length == 2) {
                            this.reqType = "3"
                        } else if (value.length == 1) {
                            this.reqType = "2"
                        }
                    } else {
                        if (this.reqId.length <= 9) {
                            this.reqType = 1;
                        } else {
                            this.reqType = 2;
                        }
                    }
                    if (value[2] == 0) {
                        this.reqId = value[1];
                        this.isCity = true;
                    }
                    this.changeCommunity(this.options, value);
                    mapData.forEach(v => {
                        value.forEach(k => {
                            if (v.orgId == k) {
                                this.mapInfo = v.map
                            }
                        })
                    })
                    this.getData();
                }
            },
            changeCommunity(options, value) {
                options.forEach(v => {
                    value.forEach(k => {
                        if (v.orgId == k) {
                            if (v.children) {
                                this.changeCommunity(v.children, value)
                            } else {
                                this.cityName = v.orgName;
                            }
                        }
                    })
                })
            },
            getArea() {
                getArea().then(res => {
                    let data = res.data.data;

                    var optionsList = new Array();
                    data.forEach(v => {
                        var optionObj = {};
                        optionObj.label = v.name;
                        optionObj.value = v.id;
                        this.cityMap[v.id] = v.name
                        if (v.children.length > 0) {
                            var cvList = new Array();
                            v.children.forEach(vc => {
                                var vcObj = {};
                                vcObj.label = vc.name;
                                vcObj.value = vc.id;
                                cvList.push(vcObj);
                                this.cityMap[vc.id] = vc.name
                                if (vc.children.length > 0) {
                                    var cvvList = new Array();
                                    var vcObj1 = {};
                                    vcObj1.label = '全部';
                                    vcObj1.value = '0';
                                    cvvList.push(vcObj1);
                                    vc.children.forEach(vcc => {
                                        var vccObj = {};
                                        vccObj.label = vcc.name;
                                        vccObj.value = vcc.id;
                                        this.cityMap[vcc.id] = vcc.name
                                        cvvList.push(vccObj);
                                    });
                                    vcObj.children = cvvList;
                                }
                            })
                            optionObj.children = cvList;
                        }
                        optionsList.push(optionObj);
                    });
                    this.options = optionsList;
                    this.optionInfo = ['33', '3301', '330106'];
                    this.getData();
                });
            },
            setScreen() {
                this.$store.commit("SET_FULLSCREN");
            },
            handleScreen() {
                // console.log("isFullScren==" + this.isFullScren)
                fullscreenToggel();
            }, goToHome() {
                this.$router.push("/wel");
                this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            }, getDate() {

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
                this.nowDate = now;
            }, conver(s) {
                return s < 10 ? '0' + s : s;
            }, getData() {
                getVisualData(this.reqType, this.reqId).then(res => {
                    let data = res.data.data;
                    // console.log(res);
                    this.houseCount = data.houseCount;
                    this.mallCount = data.mallCount;
                    this.device4Count = data.device4Count;
                    this.device2Count = data.device2Count;
                    let totayData = data.today;
                    if (Object.keys(totayData).length != 0) {
                        totayData.totalCorrectTimesRate = data.today.totalCorrectTimesRate.replace("%", "");
                        this.today = totayData;
                        this.weightDivList = new Array();
                        var device = data.device;
                        var devcieList = new Array();
                        device.forEach(res => {
                            var deviceMap = {};
                            const deviceNo = res.deviceNo;
                            const isOnline = res.isOnline;
                            var imgSrc = "/img/device-online.png"
                            if (!isOnline) {
                                imgSrc = "/img/unline.png";
                            }
                            var mapInfoData = mapPointData;
                            if (this.isCity) {
                                mapInfoData = cityMapPointData;
                            }
                            console.log("deviceNo==" + deviceNo)
                            var deviceMapInfo = mapInfoData[deviceNo];
                            if (deviceMapInfo != undefined && deviceMapInfo != null) {
                                deviceMapInfo.imgSrc = imgSrc;
                                devcieList.push(deviceMapInfo);
                            }

                        });
                        this.circleList = devcieList;
                        var perishableWeightData = {};
                        perishableWeightData.value = totayData.perishableWeight;
                        perishableWeightData.name = '易腐垃圾'
                        this.weightDivList.push(perishableWeightData);

                        if (this.reqId != '1272361230558552066') {
                            var harmfulWeightData = {}
                            harmfulWeightData.value = totayData.harmfulWeight;
                            harmfulWeightData.name = '有害垃圾'
                            this.weightDivList.push(harmfulWeightData);

                            var recyclableWeightData = {};
                            recyclableWeightData.value = totayData.recyclableWeight;
                            recyclableWeightData.name = '可回收垃圾'
                            this.weightDivList.push(recyclableWeightData);
                        }

                        var otherWeightData = {};
                        otherWeightData.value = totayData.otherWeight;
                        otherWeightData.name = '其他垃圾'
                        this.weightDivList.push(otherWeightData);
                        //投放方式
                        this.toufangList = new Array();
                        var cardAuthTimesData = {}
                        cardAuthTimesData.value = totayData.
                            cardAuthTimes;
                        cardAuthTimesData.name = '刷卡投放';
                        this.toufangList.push(cardAuthTimesData);

                        var faceAuthTimesData = {};
                        faceAuthTimesData.value = totayData.faceAuthTimes;
                        faceAuthTimesData.name = '刷脸投放';
                        this.toufangList.push(faceAuthTimesData);
                        var noAuthTimesData = {};
                        noAuthTimesData.value = totayData.noAuthTimes;
                        noAuthTimesData.name = '直接投放';
                        this.toufangList.push(noAuthTimesData);

                        this.toufangYTimesList = new Array();
                        this.toufangXTimesList = new Array();

                        this.toufangXTimesList.push(totayData.perishableTimes)
                        this.toufangYTimesList.push("易腐垃圾")
                        if (this.reqId != '1272361230558552066') {
                            this.toufangXTimesList.push(totayData.recyclableTimes)
                            this.toufangYTimesList.push("可回收垃圾")

                            this.toufangXTimesList.push(totayData.harmfulTimes)
                            this.toufangYTimesList.push("有害垃圾")
                        }
                        this.toufangXTimesList.push(totayData.otherTimes)
                        this.toufangYTimesList.push("其他垃圾");
                        console.log(this.toufangXTimesList)
                        this.toufangCorrectTimesRateList = new Array();
                        this.toufangCorrectTimesXRateList = new Array();

                        if (this.reqId != "1272361230558552066") {
                            var recyclableCorrectTimesRateData = {};
                            recyclableCorrectTimesRateData.value = this.toNum(totayData.recyclableCorrectTimesRate);
                            recyclableCorrectTimesRateData.name = '可回收垃圾';
                            this.toufangCorrectTimesRateList.push(totayData.recyclableCorrectTimesRate.replace("%", "").replace(".00", ""));
                            this.toufangCorrectTimesXRateList.push("可回收垃圾");

                            var harmfulCorrectTimesRateData = {};
                            harmfulCorrectTimesRateData.value = this.toNum(totayData.harmfulCorrectTimesRate);
                            harmfulCorrectTimesRateData.name = '有害垃圾';
                            this.toufangCorrectTimesRateList.push(totayData.harmfulCorrectTimesRate.replace("%", "").replace(".00", ""));
                            this.toufangCorrectTimesXRateList.push("有害垃圾");
                        }
                        var otherCorrectTimesRateData = {};
                        otherCorrectTimesRateData.value = this.toNum(totayData.otherCorrectTimesRate);
                        otherCorrectTimesRateData.name = '其他垃圾';
                        this.toufangCorrectTimesRateList.push(totayData.otherCorrectTimesRate.replace("%", "").replace(".00", ""));
                        this.toufangCorrectTimesXRateList.push("其他垃圾");

                        var perishableCorrectTimesRateData = {};
                        perishableCorrectTimesRateData.value = this.toNum(totayData.perishableCorrectTimesRate);
                        perishableCorrectTimesRateData.name = '易腐垃圾';
                        this.toufangCorrectTimesRateList.push(totayData.perishableCorrectTimesRate.replace("%", "").replace(".00", ""));
                        this.toufangCorrectTimesXRateList.push("易腐垃圾");
                    }
                    this.laskTimes = new Array()
                    var dateList = this.getLastDate();
                    console.log("dateList=="+dateList)
                    // 最近7天的情况，不含当天
                    var lastDaily = data.lastDaily;
                    //按月汇总，含当月
                    var lastMonth = data.lastMonth;
                    for (let i = 0; i < dateList.length; i++) {
                        let res = dateList[i];
                        // var xData = res.substring(4, res.length)
                        this.laskTimes.push(res);
                        lastDaily.forEach(v => {
                            let ymd = v.ymd;
                            let totalWeight = v.totalWeight;
                            let perishableWeight = v.perishableWeight;
                            let recyclableWeight = v.recyclableWeight;
                            let harmfulWeight = v.harmfulWeight;
                            let otherWeight = v.otherWeight;

                            let totalTimes = v.totalTimes;
                            let perishableTimes = v.perishableTimes;
                            let RecyclableTimes = v.recyclableTimes;
                            let HarmfulTimes = v.harmfulTimes;
                            let otherTimes = v.otherTimes;

                            //正确率
                            let perishableCorrectTimesRate = v.perishableCorrectTimesRate;
                            let recyclableCorrectTimesRate = v.recyclableCorrectTimesRate;
                            let harmfulCorrectTimesRate = v.harmfulCorrectTimesRate;
                            let otherCorrectTimesRate = v.otherCorrectTimesRate;

                            if (res == ymd) {

                                //投放重量
                                this.totalWeightDataList[i] = totalWeight;
                                this.perishableWeightDataList[i] = perishableWeight;
                                this.recyclableWeightDataList[i] = recyclableWeight + "";
                                this.harmfulWeightDataList[i] = harmfulWeight;
                                this.otherWeightDataList[i] = otherWeight;
                                console.log("ymd==" + ymd + ";recyclableWeight==" + recyclableWeight)

                                //投放次数
                                this.totalTimesDataList[i] = totalTimes;
                                this.perishableTimesDataList[i] = perishableTimes;
                                this.RecyclableTimesDataList[i] = RecyclableTimes;
                                this.HarmfulTimesDataList[i] = HarmfulTimes;
                                this.otherTimesDataList[i] = otherTimes;

                                this.perishableCorrectRateDataList[i] = perishableCorrectTimesRate.replace("%", "").replace(".00", "");
                                this.recyclableCorrectRateDataList[i] = recyclableCorrectTimesRate.replace("%", "").replace(".00", "");
                                this.harmfulCorrectRateDataList[i] = harmfulCorrectTimesRate.replace("%", "").replace(".00", "");
                                this.otherCorrectRateDataList[i] = otherCorrectTimesRate.replace("%", "").replace(".00", "");


                            }
                        });
                    }
                    var monList = this.getMonths();
                    this.monthDataList = new Array();
                    for (let i = 0; i < monList.length; i++) {
                        var vData = monList[i];
                        // console.log(vData)
                        let month = vData.split("-")[1];
                        var chinese = ['0', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
                        var result = '';
                        if (month.charAt(0) == "1" && month.charAt(1) != "0") {
                            result += ("十" + chinese[month.charAt(1)] + "");
                        } else if (month.charAt(0) == "1" && month.charAt(1) == "0") {
                            result += ("十");
                        } else {
                            result += (chinese[month.charAt(1)] + "");
                        }

                        this.monthDataList.push(result);
                        lastMonth.forEach(v => {
                            let ymd = v.ym;
                            var mm = vData.replace("-", "");
                            //
                            let perishableCorrectTimesRate = v.perishableCorrectTimesRate;
                            let recyclableCorrectTimesRate = v.recyclableCorrectTimesRate;
                            let harmfulCorrectTimesRate = v.harmfulCorrectTimesRate;
                            let otherCorrectTimesRate = v.otherCorrectTimesRate;
                            //投放重量
                            let totalWeight = v.totalWeight;
                            let perishableWeight = v.perishableWeight;
                            let recyclableWeight = v.recyclableWeight;
                            let harmfulWeight = v.harmfulWeight;
                            let otherWeight = v.otherWeight;

                            //投放次数
                            let totalTimes = v.totalTimes;
                            let perishableTimes = v.perishableTimes;
                            let RecyclableTimes = v.recyclableTimes;
                            let HarmfulTimes = v.harmfulTimes;
                            let otherTimes = v.otherTimes;
                            if (mm == ymd) {
                                let index = i;
                                // console.log("mm==="+mm+";ymd=="+ymd+";i=="+index);
                                // console.log(v);
                                this.totalWeightMonDataList[index] = totalWeight;
                                this.perishableWeightMonDataList[index] = perishableWeight;
                                this.recyclableWeightMonDataList[index] = recyclableWeight;
                                this.harmfulWeightMonDataList[index] = harmfulWeight;
                                this.otherWeightMonDataList[index] = otherWeight;

                                this.totalTimesMonDataList[index] = totalTimes;
                                this.perishableMonTimesDataList[index] = perishableTimes;
                                this.RecyclableMonTimesDataList[index] = RecyclableTimes;
                                this.HarmfulTimesMonDataList[index] = HarmfulTimes;
                                this.otherTimesMonDataList[index] = otherTimes;

                                this.perishableCorrectTimesRateDataList[index] = perishableCorrectTimesRate.replace("%", "").replace(".00", "");
                                this.recyclableCorrectTimesRateDataList[index] = recyclableCorrectTimesRate.replace("%", "").replace(".00", "");
                                this.harmfulCorrectTimesRateDataList[index] = harmfulCorrectTimesRate.replace("%", "").replace(".00", "");
                                this.otherCorrectTimesRateDataList[index] = otherCorrectTimesRate.replace("%", "").replace(".00", "");

                            }
                        });
                    }
                    this.initChart();
                });
            }, toNum(percent) {
                var num = percent.replace("%", "") / 100;
                return num;
            }, getLastDate() {
                var dateList = new Array();
                dateList.push(this.getDay(-7));
                dateList.push(this.getDay(-6));
                dateList.push(this.getDay(-5));
                dateList.push(this.getDay(-4));
                dateList.push(this.getDay(-3));
                dateList.push(this.getDay(-2));
                dateList.push(this.getDay(-1));
                return dateList;
            }, getWeek(i) {
                var now = new Date();
                var firstDay = new Date(now - (now.getDay() - 1) * 86400000);
                firstDay.setDate(firstDay.getDate() + i);

                var mon = Number(firstDay.getMonth()) + 1;
                var day = firstDay.getDate();
                if (day < 10) {
                    day = "0" + day;
                }
                if (mon < 10) {
                    mon = "0" + mon;
                }
                return now.getFullYear() + "" + mon + "" + day;
            }, getMonths() {
                var dataArr = [];
                var data = new Date();
                var year = data.getFullYear();
                data.setMonth(data.getMonth() + 1, 1); //获取到当前月份,设置月份
                for (var i = 0; i < 12; i++) {
                    // data.setMonth(data.getMonth() - 1); //每次循环一次 月份值减1
                    var m = i + 1;
                    m = m < 10 ? "0" + m : m;
                    dataArr.push(data.getFullYear() + "-" + m);
                }
                return dataArr;
            }, getDay(day) {
                let today = new Date();
                var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
                today.setTime(targetday_milliseconds); //注意，这行是关键代码
                var tYear = today.getFullYear();
                var tMonth = today.getMonth();
                var tDate = today.getDate();
                tMonth = this.doHandleMonth(tMonth + 1);
                tDate = this.doHandleMonth(tDate);
                return tYear.toString() + tMonth.toString() + tDate.toString();
                // return tMonth.toString() + tDate.toString();
            }, doHandleMonth(month) {
                var m = month;
                if (month.toString().length == 1) {
                    m = "0" + month;
                }
                return m;
            }, toPoint(percent) {
                var str = percent.replace("%", "");
                var strPoint = str / 100;
                return strPoint.toFixed(2);
            }, initWeightBar(xAxisData,
                totalWeightDataList,
                perishableWeightDataList,
                otherWeightDataList,
                recyclableWeightDataList,
                harmfulWeightDataList) {
                /***最近七天垃圾总量**/
                const recodedivBar = echarts.init(document.getElementById("recodeDiv"));
                recodedivBar.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#ffffff', '#5DAFF6', '#9B4AEB', '#8CB50B', '#F7C44E'],
                    legend: {
                        icon: "circle",
                        data: this.reqId == '1272361230558552066' ? ['总量', '易腐垃圾', '其他垃圾'] : ['总量', '易腐垃圾', '其他垃圾', '可回收物', '有害垃圾'],
                        textStyle: {//图例文字的样式
                            color: 'white',
                            fontSize: 10
                        },
                        "itemGap": 15,
                        'itemWidth': 10,
                        type: 'scroll',
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '1%',
                        top: '20%',//距上边距
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                                fontSize: 10
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            }
                        }
                    },
                    series: [
                        {
                            name: '总量',
                            type: 'line',
                            smooth: true,
                            data: totalWeightDataList
                        },
                        {
                            name: '易腐垃圾',
                            type: 'line',
                            smooth: true,
                            data: perishableWeightDataList
                        },
                        {
                            name: '其他垃圾',
                            type: 'line',
                            smooth: true,
                            data: otherWeightDataList
                        },
                        {
                            name: '可回收物',
                            type: 'line',
                            smooth: true,
                            data: recyclableWeightDataList
                        },
                        {
                            name: '有害垃圾',
                            type: 'line',
                            smooth: true,
                            data: harmfulWeightDataList
                        }
                    ]
                });
            }, initTimesBar(xAxisData,
                totalTimesDataList,
                perishableTimesDataList,
                otherTimesDataList,
                RecyclableTimesDataList,
                HarmfulTimesDataList) {
                /***最近7天垃圾投放次数**/
                const recodedivBar2 = echarts.init(document.getElementById("recodeDiv2"));
                recodedivBar2.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#ffffff', '#5DAFF6', '#9B4AEB', '#8CB50B', '#F7C44E'],
                    legend: {
                        icon: "circle",
                        data: this.reqId == '1272361230558552066' ? ['总量', '易腐垃圾', '其他垃圾'] : ['总量', '易腐垃圾', '其他垃圾', '可回收物', '有害垃圾'],
                        textStyle: {//图例文字的样式
                            color: 'white',
                            fontSize: 10
                        },
                        "itemGap": 15,
                        'itemWidth': 10,
                        type: 'scroll',
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '1%',
                        top: '20%',//距上边距
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                                fontSize: 10
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            }
                        }
                    },
                    series: [
                        {
                            name: '总量',
                            type: 'line',
                            smooth: true,
                            data: totalTimesDataList
                        },
                        {
                            name: '易腐垃圾',
                            type: 'line',
                            smooth: true,
                            data: perishableTimesDataList
                        },
                        {
                            name: '其他垃圾',
                            type: 'line',
                            smooth: true,
                            data: otherTimesDataList
                        },
                        {
                            name: '可回收物',
                            type: 'line',
                            smooth: true,
                            data: RecyclableTimesDataList
                        },
                        {
                            name: '有害垃圾',
                            type: 'line',
                            smooth: true,
                            data: HarmfulTimesDataList
                        }
                    ]
                });
            }, initCorrectTimesRate(xAxisData,
                perishableCorrectTimesRateDataList,
                otherCorrectTimesRateDataList,
                recyclableCorrectTimesRateDataList,
                harmfulCorrectTimesRateDataList) {
                // console.log(perishableCorrectTimesRateDataList)
                /***
                 * 投放正确率
                 */
                const recodedivBar3 = echarts.init(document.getElementById("recodeDiv3"));
                recodedivBar3.setOption({
                    tooltip: {
                        trigger: 'axis',
                    },
                    color: ['#ffffff', '#5DAFF6', '#9B4AEB', '#8CB50B', '#F7C44E'],
                    legend: {
                        icon: "circle",
                        data: this.reqId == '1272361230558552066' ? ['总量', '易腐垃圾', '其他垃圾'] : ['易腐垃圾', '其他垃圾', '可回收物', '有害垃圾'],
                        textStyle: {//图例文字的样式
                            color: 'white'
                        },
                        "itemGap": 15,
                        'itemWidth': 10,
                        type: 'scroll',
                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '1%',
                        top: '20%',//距上边距
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                                fontSize: 10
                            },


                        },

                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            },
                            formatter: '{value}%'

                        }
                    },
                    series: [
                        {
                            name: '易腐垃圾',
                            type: 'line',
                            smooth: true,
                            data: perishableCorrectTimesRateDataList
                        },
                        {
                            name: '其他垃圾',
                            type: 'line',
                            smooth: true,
                            data: otherCorrectTimesRateDataList
                        },
                        {
                            name: '可回收物',
                            type: 'line',
                            smooth: true,
                            data: recyclableCorrectTimesRateDataList
                        },
                        {
                            name: '有害垃圾',
                            type: 'line',
                            smooth: true,
                            data: harmfulCorrectTimesRateDataList
                        }
                    ]
                });
            }, initChart() {
                const bar = echarts.init(document.getElementById("weightDiv"));
                bar.setOption({

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
                    color: ['#5DAFF6', '#9B4AEB', '#8CB50B', '#F7C44E'],
                    series: [
                        {
                            name: '每类垃圾重量',
                            type: 'pie',
                            radius: '49',
                            center: ['50%', '50%'],
                            data: this.weightDivList,
                            roseType: 'radius',
                            label: {
                                normal: {
                                    textStyle: {
                                        color: 'white', //x轴data 的颜色
                                    },
                                }
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: '{b} : {c}\n  ({d}%)'
                                    },

                                    labelLine: { show: true }
                                },
                            }
                        }
                    ]
                }, true);

                /**投放方式占比**/
                const toufangDivBar = echarts.init(document.getElementById("toufangDiv"));
                toufangDivBar.setOption({
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
                    color: ['#5DAFF6', '#F7C44E', '#8CB50B'],
                    series: [
                        {
                            name: '投放方式占比',
                            type: 'pie',
                            radius: '50',
                            center: ['50%', '50%'],
                            data: this.toufangList,
                            roseType: 'radius',
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {
                                    label: {
                                        show: true,
                                        formatter: '{b} : {c} ({d}%)'
                                    },
                                    labelLine: { show: true }
                                }
                            }
                        }
                    ]
                });

                /**垃圾投放次数**/
                const ljtfcsDivBar = echarts.init(document.getElementById("ljtfcsDiv"));
                ljtfcsDivBar.setOption({
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '1%',
                        top: '19%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff',

                            }
                        }
                    },
                    color: ['#5DAFF6', '#9B4AEB', '#8CB50B', '#F7C44E'],
                    yAxis: {
                        type: 'category',
                        data: this.toufangYTimesList,
                        //设置轴线的属性
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff',
                            }
                        }
                    },
                    series: [
                        {
                            name: '',
                            type: 'bar',
                            data: this.toufangXTimesList,
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    color: function (params) {
                                        var colorList = ['#5DAFF6', '#9B4AEB', '#8CB50B', '#F7C44E'];
                                        return colorList[params.dataIndex]
                                    },
                                    label: { show: true, position: 'top' }
                                },
                                barBorderRadius: [18, 18, 0, 0],
                                barCategoryGap: '10%',  // 柱形的间距
                            }
                        },

                    ]
                });

                /**垃圾投放正确率**/
                const toufangRightDivBar = echarts.init(document.getElementById("toufangRightDiv"));
                toufangRightDivBar.setOption({
                    tooltip: {
                        trigger: 'item',

                    },
                    label: {
                        color: '#ffffff'
                    },
                    xAxis: {
                        type: 'category',
                        data: this.toufangCorrectTimesXRateList,
                        axisLine: {
                            lineStyle: {
                                color: '#ffffff',
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            },
                            formatter: '{value}%'

                        }

                    },
                    color: ['#5DAFF6', '#9B4AEB', '#8CB50B', '#F7C44E'],
                    series: [
                        {
                            name: '垃圾投放正确率',
                            data: this.toufangCorrectTimesRateList,
                            type: 'bar',
                            roseType: 'radius',
                            barWidth: '30%',
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                },
                                normal: {

                                    color: function (params) {
                                        var colorList = ['#5DAFF6', '#9B4AEB', '#8CB50B', '#F7C44E'];
                                        return colorList[params.dataIndex]
                                    },
                                    label: { show: true, position: 'top' }
                                },
                                barBorderRadius: [18, 18, 0, 0],
                                barCategoryGap: '10%',  // 柱形的间距

                            }
                        }
                    ]
                });

                this.weightBtn = this.btnDayImg;
                this.rightColor = this.nomalColor;
                this.leftColor = this.acColor;
                this.leftTop = '0px'
                if (this.reqId == '1272361230558552066') {
                    this.recyclableWeightDataList = [];
                    this.harmfulWeightDataList = [];
                    this.RecyclableTimesDataList = [];
                    this.HarmfulTimesDataList = [];
                    this.recyclableCorrectRateDataList = [];
                    this.harmfulCorrectRateDataList = [];
                }
                this.initWeightBar(this.laskTimes, this.totalWeightDataList,
                    this.perishableWeightDataList,
                    this.otherWeightDataList,
                    this.recyclableWeightDataList,
                    this.harmfulWeightDataList);

                this.timeBtn = this.btnDayImg;
                this.rightTimeTitleColor = this.nomalColor;
                this.leftTimeTitleColor = this.acColor;
                this.leftTimeTitleTop = "0px"
                //投放次数
                this.initTimesBar(this.laskTimes,
                    this.totalTimesDataList,
                    this.perishableTimesDataList,
                    this.otherTimesDataList,
                    this.RecyclableTimesDataList,
                    this.HarmfulTimesDataList);


                this.CorrectRateBtn = this.btnDayImg;
                this.leftCorrectRateColor = this.acColor;
                this.rightCorrectRateColor = this.nomalColor;
                this.CorrectRateTop = '0px';
                this.initCorrectTimesRate(this.laskTimes,
                    this.perishableCorrectRateDataList,
                    this.otherCorrectRateDataList,
                    this.recyclableCorrectRateDataList,
                    this.harmfulCorrectRateDataList);

            },

        }
    }
</script>

<style scoped>
    .content-bg {
        background-color: #020344 !important;
    }

    .main-bg {
        background: url(/img/data_visualization.png);
        background-size: 100%, 100%;

    }

    .m-popper-class {
        background-color: #020344 !important;
    }

    .m-Statistics {
        font-size: 1rem;
        width: 19%;
        padding-bottom: 1rem;
        overflow: hidden;
        height: 90px;
        display: inline-block;
        margin-left: .8rem;

    }

    .m-Statistics img {
        position: absolute;
        z-index: 0;
        width: 18%;
    }

    .m-Statistics div {
        text-align: center;
        width: 100%;

    }

    .m-Statistics-top {
        margin-top: 8%;
        font-weight: bold;
        color: #ffffff;
        text-align: center;
    }

    .span-left {
        /* float: left; */
        margin-left: 1rem;
        color: #ffffff;
    }

    .span-right {
        float: right;
        margin-right: 2rem;
        color: #73F8F8;
        font-size: .8rem;
    }

    .chart-bg {
        width: 33.3%;
        height: 250px;
        overflow: hidden;
        color: white;
        margin-top: 0.5rem;
    }

    .chart-bg-img {
        position: absolute;
        z-index: 0;
        width: 32.5%;
    }

    .img-right {
        width: 33% !important;
    }

    .center_bg {
        width: 32%;
        display: inline-block;
    }

    .chart-title {
        position: relative;
        left: 10px;
        top: 10px;
        width: 100%;
        font-size: .9rem;
    }

    .chart-title-right {
        position: relative;
        left: 5rem;
    }

    /deep/.el-cascader {
        position: relative;
        font-size: 14px;
        width: 230px !important;

    }

    /deep/.el-input__inner {
        -webkit-appearance: none;
        background-color: transparent;
        background-image: none;
        border-radius: 4px;
        border: 1px solid transparent;
        border-top-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
        border-left-color: transparent;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #fff;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        outline: 0;
        padding: 0 15px;
        padding-right: 15px;
        -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
    }

    /deep/.el-cascader__label {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        padding: 0 25px 0 15px;
        color: white;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        cursor: pointer;
        text-align: left;
        font-size: inherit;
    }

    /deep/ .el-cascader__label span {
        color: white;
    }


    .m-div {
        display: inline;
    }

    .div-title {
        position: relative;
        top: .7rem;
    }

    .header {
        color: white;
        width: 100%;
        height: 60px;
        text-align: center;
        background-image: url("../../../public/img/top_bg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
        padding-top: 20px;
    }

    .card {
        background-image: url('../../../public/img/top_bg_jx.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        -moz-background-size: 100% 100%;
    }
</style>
