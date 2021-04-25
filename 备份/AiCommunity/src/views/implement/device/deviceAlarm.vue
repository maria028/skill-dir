<template>
  <div class="main-bg">
    <div class="header">
      <div style="font-size:4vh;text-align: center;">王马社区·设备告警</div>
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
          <el-select v-model="formInline.mallId" placeholder="请选择小区">
            <el-option
              v-for="item in mallList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
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
        <el-form-item label="-">
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
          <el-button type="primary" class="qryBtn" @click="getAlarmListData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div style="width: 100%;text-align: center">
      <div class="bg4" style="height: 35vh">
        <div class="title_bg" style="margin-top:1vh;margin-left: 1%;width: 20%">
          <span>设备告警：</span>
        </div>
        <div style="width: 100%;height:99%;position: relative;bottom: 20%" ref="waterUse" id="waterUse"></div>
      </div>

      <div class="bg4" style="height: 45vh">
        <div class="title_bg" style="margin-top:1vh;margin-left: 1%;width: 20%;">
          <span>告警明细：</span>
        </div>
        <div style="margin-top: 0.92vh;padding-left: 1%;padding-right:1%" >
          <el-table
            :data="tableData"
            style="width: 100%;background-color: transparent;margin: 0 auto;border: 1px solid #377AFF;"
            border
            height="38vh"
            ref="table"
            :row-style="{height: '2vh'}"
          >
            <el-table-column
              type="index"
              width="50"
              label="序号">
            </el-table-column>
            <el-table-column
              prop="mallName"
              label="小区"
              width="180">
            </el-table-column>
            <el-table-column
              prop="deviceNo"
              label="设备编号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="deviceName"
              label="设备名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="alarmTime"
              label="告警时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="level"
              label="告警等级"
              width="180">
            </el-table-column>
            <el-table-column
              prop="detail"
              label="告警内容"
              width="358">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
    import { fullscreenToggel, listenfullscreen } from "../../../util/util";
    import { mapGetters, mapState } from "vuex";
    import {getMallByUser} from "../../../api/mall";
    import {getAlarmList} from "../../../api/mall";
    import vueSeamlessScroll from 'vue-seamless-scroll'

    const echarts = require('echarts');
    export default {
        name: "deviceAlarm",
        comments:{
            vueSeamlessScroll
        },
        data(){
            return{
                valueFormat:'yyyy-MM-dd',
                mallList:[],
                formInline:{mallId:'',startDate:'',endDate:''},
                tableData:[],
                xAxisData:[],
                alarmNum:'0',
                alarmList:[],
                houseData:[],
                timeType:'date',
                legendData:['总数','一般','严重','警告'],
                seriesData:[{'name':'总数','type':'line','data':[12,34,45,55,67,77,87,8,6,8,2,4,3]},
                    {'name':'一般','type':'line','data':[1,6,78,8,8,9,12,4,9,78,82,8,2]},
                    {'name':'严重','type':'line','data':[32,14,35,75,47,67,67,48,36,18,12,41,31]},
                    {'name':'警告','type':'line','data':[62,74,5,25,47,67,97,28,36,68,23,45,37]}],
                xAxisData:['1','2','4','5','6','7','10','11','12','13','14'],
                echartsChart:null,
                buildingData:[],
                unitData:[],
                timerObj:null

            }
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
        },destroyed(){
            this.$store.commit("SET_PAGE_FULL_SCREEN", false);
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
                let day2 = new Date();
                day2.setTime(day2.getTime());
                let s2 = this.conver(day2.getFullYear())+"-" + this.conver((day2.getMonth()+1)) + "-" + this.conver(day2.getDate());
                this.formInline.startDate = this.getDay();
                this.formInline.endDate = s2;
                this.getMallData();

            });
        },methods:{
            getDay(){
                //获取当前时间
                let myDate = new Date();
                let arr = myDate.toLocaleDateString();
                console.log(arr,'rediddatarediddatarediddatarediddata');
                //获取三十天前日期
                let lw = new Date(myDate - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
                let lastY = lw.getFullYear();
                let lastM = lw.getMonth()+1;
                let lastD = lw.getDate();
                let startdate=lastY+"-"+(lastM<10 ? "0" + lastM : lastM)+"-"+(lastD<10 ? "0"+ lastD : lastD);
                return startdate;
            },
            startDateChange(v){
                var d1 = new Date(v);
                var d2 = new Date(this.formInline.endDate);
                if(d1 > d2) {
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
            },
            conver(s) {
                return s < 10 ? '0' + s : s;
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
                getMallByUser().then(res =>{
                    this.mallList = res.data.data;
                    if(this.mallList.length >0 ){
                        this.formInline.mallId=  this.mallList[0].id;
                        this.getAlarmListData();
                    }
                });
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
            },getAlarmListData(){
                let   _this = this;
                let day = this.dataDifference(this.formInline.endDate,this.formInline.startDate);
                if(day > 30){
                    this.$message({
                        type: "warn",
                        message: "开始时间和结束时间不超过30天!"
                    });
                    return
                }
                getAlarmList(this.formInline.mallId,this.formInline.startDate,this.formInline.endDate).then(res=>{
                    let data = res.data.data;
                    this.tableData = data.alarmList;

                    let alarmNumsList = data.alarmNumsList;
                    this.legendData = new Array();
                    this.xAxisData = new Array();
                    this.seriesData = new Array();
                    const dataMap = new Map();
                    alarmNumsList.forEach(v=>{
                        let level = v.level;
                        this.legendData.push(level);
                        let  results = v.results;
                        let seriesObj = {};
                        seriesObj.name = level;
                        seriesObj.type ='line';
                        let serData = new Array();
                        results.forEach(vv=>{
                            let result = vv.result;
                            let query = vv.query;
                            dataMap.set(query,query);
                            serData.push(result);
                        });
                        seriesObj.data = serData;
                        this.seriesData.push(seriesObj);
                    });
                    dataMap.forEach(function(value,key){
                        _this.xAxisData.push(value);
                    });
                    if(this.tableData.length > 5){
                        this.tableScroll();
                    }
                    this.initData();
                });

            }, startmarquee(lh,speed,delay){
                var t;
                var oHeight = 210; /**//** div的高度 **/
                var p=false;
                var o=document.getElementById("table");
                oHeight = o.clientHeight;
                var preTop = 0;
                o.scrollTop = 0;
                function start(){
                    t=setInterval(scrolling,speed);
                    o.scrollTop += 1;
                }
                function scrolling(){
                    if(o.scrollTop%lh!=0 && o.scrollTop%(o.scrollHeight-oHeight-1)!=0){
                        preTop = o.scrollTop;
                        o.scrollTop+=1;
                        if(preTop >= o.scrollHeight || preTop==o.scrollTop){
                            o.scrollTop = 0;
                        }
                        }else{
                        clearInterval(t);
                        setTimeout(start,delay);
                    }
                    }
                setTimeout(start,delay);
            },tableScroll(){
                if(this.timerObj !=null){
                    clearInterval(this.timerObj);
                }
               // 拿到表格挂载后的真实DOM
                const table = this.$refs.table
                // 拿到表格中承载数据的div元素
                const divData = table.bodyWrapper
                // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
               this.timerObj =  setInterval(() => {
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
                    color: ['#24FCF9','#FFEA00','#E81515','#FF670B'],
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
                        padding:[30,60,0,0],
                        icon: "rect",
                        itemHeight: 10,
                    },
                    //x轴
                    xAxis:{
                        data:this.xAxisData,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                                fontSize: 10
                            }
                        }
                    },
                    //y轴没有显式设置，根据值自动生成y轴
                    yAxis:{ axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            }
                        }},
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
  }
  .header {
    color: white;
    width: 100%;
    text-align: center;
    background-image: url("/img/monitoring/monitoring_top.png");
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

  .bg4{
    background: url("/img/monitoring/bg4.png");
    text-align: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    width: 100%;
    display: inline-block;
    height: 23.3vh;
    margin-top: 1vh;
    text-align: center;
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
    height: calc(99%);
    overflow: hidden;
  }
  table,table tr th, table tr td {
    border:1px solid #0094ff;
    color: white;
    font-size: 2vh
  }
  table{width: 100%;border: 1px solid #0094ff;}
  th,td{border: 1px solid #0094ff;text-align: center;width: 12.5%}
  .tab-scroll{height: 19vh;width: 99.99%;overflow: hidden;}

  /deep/.el-table--scrollable-y .el-table__body-wrapper {
    overflow-y: hidden;
    overflow-x:hidden;
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
</style>
[if IE]>
<style scoped lang="scss">
  .header {
    color: white;
    width: 100%;
    text-align: center;
    background-image: url("/img/monitoring/monitoring_top.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 8vh;
    text-align: center;
    display: flex;
    align-items:center; /*实现垂直居中*/
  }
</style>

<![endif]


