<template>
  <div class="main-bg">
    <div class="header">
      <div style="font-size:3vh;">王马社区·养老用电监控</div>
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
    </div>
    <div style="text-align: center;margin-top: 1vh">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="小区">
          <el-select v-model="formInline.mallId" placeholder="请选择小区" @change="mallChange">
            <el-option
              v-for="item in mallList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select v-model="formInline.building" placeholder="请选择楼栋" @change="buildingChange">
            <el-option
              v-for="item in buildingData"
              :key="item.buildingVal"
              :label="item.buildingName"
              :value="item.buildingVal">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select v-model="formInline.unit" placeholder="请选择单元">
            <el-option
              v-for="item in unitData"
              :key="item.unitVal"
              :label="item.unitName"
              :value="item.unitVal">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-select v-model="formInline.dateType"  @change="cumulantChange">
            <el-option label="按日" value="1"></el-option>
            <el-option label="按月" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            placeholder="选择日期时间"
            v-model="formInline.startDate"
            :format="valueFormat"
            :value-format="valueFormat"
            :clearable="false"
            :type="timeType"
            @change="startDateChange">
          </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-date-picker
            placeholder="选择日期时间"
            v-model="formInline.endDate"
            :format="valueFormat"
            :value-format="valueFormat"
            :clearable="false"
            :type="timeType"
            @change="endDateChange">
          </el-date-picker>
        </el-form-item>

        <el-form-item >
          <div style="width:3vw"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="qryBtn" @click="getVisualData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bg1">
      <div class="bg2">
        <div class="water1" v-for="item in houseData">
          <div class="wBg">
            <div class="m_water">{{item.eleUsage}}</div>
            <div class="m_lj">用电量（度）</div>
          </div>
          <div class="w_house">{{item.mallName}} | {{item.houseName}}</div>
        </div>


      </div>
      <div class="bg3">
        <div class="warn_title">
          <span style="font-size: 2vh">最近7天告警总数：</span>
          <span style="color: red;font-size: 4vh;font-weight: bold;position: relative;top:.5vh">
             {{alarmNum}}
           </span>
        </div>
        <div class="box_warn_bg" v-if="alarmList.length > 3">
          <vue-seamless-scroll :data="alarmList" class="seamless-warp" :class-option="classOption">
            <div class="box-warn" v-for="(item,i) in alarmList">
              <span >{{i+1}}、{{item}}</span>
            </div>
          </vue-seamless-scroll>
        </div>
        <div class="box_warn_bg"v-else>
            <div class="box-warn" v-for="(item,i) in alarmList">
              <span >{{i+1}}、{{item}}</span>
            </div>
        </div>
      </div>
    </div>
    <div style="width: 100%;text-align: center">
      <div class="bg4">
        <div class="title_bg" style="margin-top:1vh;margin-left: 1%;width: 20%">
          <span>独居老人生活用电监测趋势：</span>
        </div>
        <div style="text-align: left;color: white;font-size: 2vh;margin-left: 1vw">（{{titleContent}}）</div>
        <div style="width: 100%;height:100%;position: relative;bottom:5vh" ref="waterUse" id="waterUse"></div>
      </div>

      <div class="bg5">
        <div class="title_bg" style="margin-top:1vh;margin-left: 1%;width: 20%">
          <span>独居老人生活用电明细：</span>
        </div>
        <div style="margin-top: 0.92vh;padding-left: 1%;padding-right:1%">
          <el-table
            :data="tableData"
            height="19vh"
            style="width: 100%;background-color: transparent;margin: 0 auto;border:  1px solid #377AFF;"
            border
            ref="table"
            :row-style="{height: '2vh'}"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="houseName"
              label="小区"
              width="180">
            </el-table-column>
            <el-table-column
              prop="houseNum"
              label="户号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="oldName"
              label="老人名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="date"
              label="日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="eleCumLast"
              label="上次累积量（度）"
              width="180">
            </el-table-column>
            <el-table-column
              prop="eleCum"
              label="本次累积量（度）"
              width="180">
            </el-table-column>
            <el-table-column
              prop="eleUsage"
              label="用电量（度）"
              width="180">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
    import { fullscreenToggel, listenfullscreen } from "../../util/util";
    import { mapGetters, mapState } from "vuex";
    import {getMallByUser} from "../../api/mall";
    import {getElectricVisualData} from "../../api/electric";
    import {getByUint} from "../../api/house";
    import vueSeamlessScroll from 'vue-seamless-scroll'
    const echarts = require('echarts');
    export default {
        name: "powerMonitoring",
        data(){
            return{
                isNoWran:false,
                titleContent:'日用电量(度)',
                valueFormat:'yyyy-MM-dd',
                mallList:[],
                formInline:{mallId:'',building:'',unit:'',dateType:'1',startDate:'',endDate:''},
                tableData:[],
                xAxisData:[],
                alarmNum:'0',
                alarmList:[],
                houseData:[],
                timeType:'date',
                legendData:[],
                seriesData:[],
                xAxisData:[],
                echartsChart:null,
                buildingData:[],
                unitData:[],
                timerObj:null,
                mallId:'',
                intervalData:3,
                yAxisData:{
                    max: 4,
                    min: 0,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: 'white', //x轴data 的颜色
                        }
                    }
                }

            }
        },  comments:{
            vueSeamlessScroll
        },

        computed: {
            ...mapState({
                showFullScren: state => state.common.showFullScren,
            }),
            ...mapGetters([
                "isFullScren", "monitorInfo", 'MapInfo', 'pointDataInfo', "userInfo"
            ]),
            classOption () {
                return {
                    step: 0.2, // 数值越大速度滚动越快
                    limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
                    hoverStop: false, // 是否开启鼠标悬停stop
                    direction: 1, // 0向下 1向上 2向左 3向右
                    openWatch: true, // 开启数据实时监控刷新dom
                    singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                    singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                    waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
                }
            }
        }, created() {
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
        }, mounted() {
            let that= this;
            window.onresize = function(){ // 定义窗口大小变更通知事件
                console.log("窗口大小变化");
                if(that.echartsChart !=null){
                    that.echartsChart.resize();
                }
            };
            listenfullscreen(this.setScreen);
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
            this.$nextTick(() => {
                console.log("页面渲染完成");
                let time=(new Date).getTime();
                let yesterday=new Date(time);
                let month=yesterday.getMonth();
                let day=yesterday.getDate();
                yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
                this.formInline.startDate = yesterday;
                this.formInline.endDate = yesterday;
                this.getMallData();

            });
        },destroyed(){
            this.$store.commit("SET_PAGE_FULL_SCREEN", false);
        },methods:{
            startDateChange(v){
                var d1 = new Date(v);
                var d2 = new Date(this.formInline.endDate);
                if(d1 > d2)
                {
                    alert("开始时间必须小于结束时间！");
                    return false;
                }

            },endDateChange(v){
                var d1 = new Date(this.formInline.startDate);
                var d2 = new Date(v);
                if(d1 > d2)
                {
                    alert("结束时间必须大于开始时间！");
                    return false;
                }
            },dataDifference(endDate,startDate){
                let dataSpan
                let tempDate
                let iDays
                endDate = Date.parse(endDate)
                startDate = Date.parse(startDate)
                dataSpan = startDate - endDate
                dataSpan = Math.abs(dataSpan)
                iDays = Math.floor(dataSpan/(24*3600*1000))
                console.log("iDays=="+iDays)
                return iDays
            },
            conver(s) {
                return s < 10 ? '0' + s : s;
            },
            cumulantChange(value){
                console.log("value=="+value);
                if( value === '1'){
                    console.log("按日查询")
                    this.valueFormat = 'yyyy-MM-dd';
                    this.timeType  = 'date';
                    let time=(new Date).getTime();
                    let yesterday=new Date(time);
                    let month=yesterday.getMonth();
                    let day=yesterday.getDate();
                    yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
                    this.formInline.startDate = yesterday;
                    this.formInline.endDate = yesterday;
                    this.titleContent = '日用电量(度)';
                    this.intervalData = 3;
                }else{
                    this.valueFormat = 'yyyy-MM';
                    this.formInline.startDate = this.getLastMonth();
                    this.timeType = 'month';
                    this.titleContent = '月用电量(度)';
                    this.intervalData = 0;
                }
            },
            getLastMonth(){//获取上个月日期
                let date = new Date;
                let year = date.getFullYear();
                let month = date.getMonth();
                if(month == 0){
                    year = year -1;
                    month = 12;
                }
                return year+"-"+month;
            },
            getMallData(){
                this.mallList.push({"id":"","name":"全部"});
                getMallByUser().then(res =>{
                    let mallData = res.data.data;
                    if(this.mallList.length >0 ){
                        this.mallId= mallData[0].id;
                        //获取楼栋
                        // this.getByUintData("1");
                        this.buildingData = new Array();
                        this.buildingData.push({"buildingName":"全部","buildingVal":""});
                        this.unitData = new Array();
                        this.unitData.push({"unitName":"全部","unitVal":""});
                        this.getVisualData();
                    }
                });

            },buildingChange(val){
                console.log("选择的楼栋："+this.formInline.building);
                this.getByUintData("2");
            },mallChange(){
                this.getByUintData("1");
            },getByUintData(type){
                let _this = this;
                if(type === '1'){
                    this.buildingData = new Array();
                    this.buildingData.push({"buildingName":"全部","buildingVal":""});
                    // getByUint(null, this.mallId,null).then(res =>{
                    //     let data = res.data.data;
                    //     const dataMap = new Map();
                    //     data.forEach(v=>{
                    //         dataMap.set(v.building+"栋",v.building)
                    //     });
                    //     this.buildingData = new Array();
                    //     this.buildingData.push({"buildingName":"全部","buildingVal":""})
                    //     dataMap.forEach(function(value,key){
                    //         console.log(value,key);
                    //         _this.buildingData.push({"buildingName":key,"buildingVal":value});
                    //     });
                    //     if(this.buildingData.length >0 ){
                    //         this.formInline.building = this.buildingData[0].buildingVal;
                    //         //获取单元
                    //         this.getByUintData("2");
                    //     }else{
                    //         this.formInline.building = '';
                    //         this.formInline.unit =  '';
                    //     }
                    //
                    // });
                }else if(type === "2"){
                    this.unitData = new Array();
                    this.unitData.push({"unitName":"全部","unitVal":""});
                    // getByUint(this.formInline.building, this.formInline.mallId,null).then(res =>{
                    //     let data = res.data.data;
                    //     const dataMap = new Map();
                    //     data.forEach(v=>{
                    //         dataMap.set(v.unit+"单元",v.unit)
                    //     });
                    //     this.unitData = new Array();
                    //     this.unitData.push({"unitName":"全部","unitVal":""})
                    //     dataMap.forEach(function(value,key){
                    //         console.log(value,key);
                    //         _this.unitData.push({"unitName":key,"unitVal":value});
                    //     });
                    //     if(_this.unitData.length > 0){
                    //         this.formInline.unit =  _this.unitData[0].unitVal;
                    //         this.getVisualData();
                    //     }else{
                    //         this.formInline.unit =  '';
                    //     }
                    //
                    // });
                }


            },getVisualData(){
                if( this.formInline.dateType === '1'){
                    let day = this.dataDifference(this.formInline.endDate,this.formInline.startDate);
                    if(day > 0){
                        this.intervalData = 0;
                    }
                    if(day > 31){
                        this.$message({
                            type: "warn",
                            message: "开始时间和结束时间不超过31天!"
                        });
                        return
                    }
                }

                getElectricVisualData(this.formInline.building,
                    this.formInline.dateType,this.formInline.endDate,
                    this.mallId,this.formInline.startDate,this.formInline.unit).then(res=>{
                    let _this = this;
                    let data = res.data.data;
                    this.tableData = data.details;
                    this.alarmNum = data.alarmNum;
                    this.alarmList = data.alarmList;
                    if(this.alarmList.length === 0){
                        this.isNoWran = true;
                    }else{
                        this.isNoWran = false;
                    }
                    this.houseData = data.houseData;
                    this.legendData = new Array();
                    this.xAxisData = new Array();
                    this.seriesData = new Array();
                    const dataMap = new Map();
                    let isHaveData = false;
                    this.houseData.forEach(v=>{
                        let  houseName = v.houseName;
                        this.legendData.push(houseName);
                        let eleUsageList = v.eleUsageList;
                        let seriesObj = {};
                        seriesObj.name = houseName;
                        seriesObj.type ='line';
                        seriesObj.smooth='true';
                        let serData = new Array();
                        eleUsageList.forEach(vv => {
                            let  date = vv.date;
                            let usage = vv.usage;
                            if(usage >0){
                                 isHaveData = true;
                            }
                            serData.push(usage);
                            dataMap.set(date,date)
                        });

                        seriesObj.data = serData;
                        this.seriesData.push(seriesObj);
                    });
                    dataMap.forEach(function(value,key){
                        _this.xAxisData.push(value);
                    });
                    if(this.tableData.length > 2){
                        this.tableScroll();
                    }
                    if(isHaveData){
                        this.yAxisData={
                                axisLabel: {
                                show: true,
                                    textStyle: {
                                    color: 'white', //x轴data 的颜色
                                }
                            }
                        }
                    }

                    this.initData();

                });
            },tableScroll(){
                if(this.timerObj !=null){
                    clearInterval(this.timerObj);
                }
                clearInterval();
                // 拿到表格挂载后的真实DOM
                const table = this.$refs.table
                // 拿到表格中承载数据的div元素
                const divData = table.bodyWrapper
                // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
                this.timerObj = setInterval(() => {
                    // 元素自增距离顶部1像素
                    divData.scrollTop += 1
                    // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
                    if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
                        // 重置table距离顶部距离
                        divData.scrollTop = 0
                    }
                }, 500)
            },
            setScreen() {
                this.$store.commit("SET_FULLSCREN");
            }, handleScreen() {
                fullscreenToggel();
            },goToHome() {
                this.$router.push("/wel");
                this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            }, initData(){
                //初始化ehcharts实例
                let myChart=echarts.init(document.getElementById("waterUse"));
                //指定图表的配置项和数据
                let option={
                    toolbox: {
                        show : false,
                        feature: {
                            saveAsImage: {
                                show:false,//控制保存按钮显示隐藏
                            }
                        }
                    },
                    color: ['#E81515', '#24FCF9', '#FFEA00'],
                    tooltip :{
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }

                    },
                    grid: {
                        left: '3%',
                        right: '3%',
                        bottom: '10%',
                        top: '28%',
                        containLabel: true
                    },
                    //图例-每一条数据的名字叫销量
                    legend:{
                        data:this.legendData,
                        textStyle: {//图例文字的样式
                            color: 'white',
                            fontSize: 10
                        },
                        left:'right',
                        padding:[0,60,0,0]
                    },
                    //x轴
                    xAxis:{
                        data:this.xAxisData,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                                fontSize: 10
                            },
                            interval:this.intervalData
                        },
                        boundaryGap: false // 不留白，从原点开始
                    },
                    //y轴没有显式设置，根据值自动生成y轴
                    yAxis:this.yAxisData,
                    //数据-data是最终要显示的数据
                    series:this.seriesData
                };
                //使用刚刚指定的配置项和数据项显示图表
                myChart.setOption(option);
                this.echartsChart = myChart;
            }
        }
    }
</script>

<style scoped>

  .main-bg {
    background: url(/img/data_visualization.png);
    background-size: 100%, 100%;
    padding-left: 1.5%;
    padding-right: 1.5%;
    overflow-y: hidden;
  }
  .header {
    color: white;
    width: 100%;
    text-align: center;
    background-image: url("../../../public/img/monitoring/monitoring_top.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 8vh;
    text-align: center;
    display: flex;
    justify-content: center;/*实现水平居中*/
    align-items:center; /*实现垂直居中*/
  }
  .qryBtn{
    background-image: url("/img/monitoring/qry_btn.png");
    width: 8.07vw;
    height: 5vh;
    line-height: 5vh;

  }
  /deep/.el-button{
    font-size: 2vh;
    padding: 0;
  }
  .bg2{
    background: url("/img/monitoring/bg_2.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    width: 70%;
    height: 25.4vh;
    display: flex;
    justify-content:space-around;
    align-items: center;
  }
  .bg3{
    background: url("/img/monitoring/bg3.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    width: 30%;
    height: 25.4vh;
    margin-left: 1vw;
  }
  .bg4{
    background: url("/img/monitoring/bg4.png");
    text-align: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    width: 100%;
    display: inline-block;
    height: 29.8vh;
    margin-top: 1vh;
    text-align: center;
  }
  .bg5{
    background: url("/img/monitoring/bg5.png");
    text-align: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    width: 100%;
    display: inline-block;
    height: 26vh;
    margin-top: 1vh;
    text-align: center;
  }
  .wBg{
    background: url("/img/monitoring/elec_bg.png");
    text-align: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    width: 17.42vw;
    height: 17.2vh;

  }
  .water1{
    vertical-align:middle;
  }
  .w_house{
    color: white;
    font-size: 2vh;
    margin-top: 1vh;
  }
  .m_water{
    color: white;
    font-size: 4vh;
    font-weight: bold;
    position: relative;
    top:18%;
    transform:translateY(-18%);
  }
  .m_lj{
    color: white;
    font-size: 2vh;
    position: relative;
    top:20%;
    transform:translateY(-20%);
  }
  .title_bg{
    background: url("/img/monitoring/title_bg.png");
    text-align: left;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 4vh;
    padding-left:0.9vw;
    color: white;
    line-height: 4vh;
    font-size: 1.8vh;
  }
  .warn_title{
    margin-left: 8vw;
    font-size: 1.8vh;
    color: white;
    text-align: left;
     height: 8vh;
    line-height: 8vh;
  }
  .warn_bg{
    color: red;
    font-size: 5vh;
    font-weight: bold;
  }
  .no_warn_bg{
    margin-top: 9vh;
  }
  .box_warn_bg{
    /*display: flex;*/
    /*flex-flow: column;*/
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: 17vh;
  }
  .box-warn {
    width: 90%;
    margin: 0 auto;
    border: 1px solid #0E1F73;
    background-color: #0E1F73;
    height: 4vh;
    overflow: hidden;
    color: white;
    font-size: 2vh;
    line-height: 4vh;
    margin-top: 1vh;
  }
  .bg1{
    text-align: center;
    display: flex;
  }

  /deep/.el-input__inner{
    -webkit-appearance: none;
    background-color: #FFF0;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #377AFF;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #fff;
    display: inline-block;
    font-size: 1.8vh;
    height: 5vh;
    line-height: 5vh;
    outline: 0;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 11vw;
  }
  /deep/.el-form--inline .el-form-item {
    margin-right: 2vw;
  }
  /deep/.el-form-item__label {
    text-align: right;
    vertical-align: middle;
    float: none;
    font-size: 1.8vh;
    color: #fff;
    line-height: 5vh;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 11vw;
  }
  /deep/ .el-form-item__content {
    line-height: 4vh;
    font-size: 2vh;
  }
  /deep/ .el-table th, .el-table tr {
    background-color: transparent;
    font-size: 2vh;
  }
  /deep/ .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 2.3vh;
    padding-right: 10px;
    text-align: center;
    font-size: 2vh;
  }
  /deep/  .el-table::before {
    content: '';
    position: absolute;
    background-color: transparent;
    z-index: 1;
  }
  /deep/.el-table th, /deep/.el-table tr {
    background-color: transparent;
    color: white;
    height: 1vh;
  }
  /deep/.el-table td, /deep/.el-table th.is-leaf {
    border-bottom: 1px solid #377AFF;
  }
  /deep/ .el-table tbody tr:hover>td { background-color: transparent }
  /deep/.el-input__icon{
    line-height: 4vh;
  }

  /deep/ .el-input input::-webkit-input-placeholder {
    color:white;
  }
  /deep/ .el-input input::-moz-input-placeholder {
    color:white;
  }
  /deep/ .el-input input::-ms-input-placeholder {
    color:white;
  }

  .seamless-warp{
    width: 100%;
    height: calc(97%);
    overflow: hidden;
  }

  /deep/.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: hidden !important;
    overflow-x: hidden !important;
  }

  /deep/ .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #EBEEF5;
    border-bottom-width: 0px;
  }
  /deep/.el-table--border td{
    border-right: 1px solid #377aff;
  }
  /deep/.el-table--border::after, .el-table--group::after{
    width: 0px;
  }
  /deep/.el-table--border th{
    border-right:1px solid #377aff;
  }
  /deep/ .el-table colgroup col[name='gutter']{
    display: none;
    width: 0px!important;
  }
  /deep/ .el-table th.gutter{
    display: none;
    width:0px !important;
  }
  /deep/ .gutter{
    width: 0px !important;
  }
  /deep/.el-table--scrollable-x .el-table__body-wrapper {
    overflow-x: hidden;
  }
  /deep/.el-table td{
    padding: 8px 0;
  }

  /deep/.el-scrollbar__wrap{
    overflow-y: hidden;
  }
  /deep/.el-form-item {
    margin-bottom: 1vh;
  }


</style>


