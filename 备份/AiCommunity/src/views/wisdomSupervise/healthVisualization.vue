<template>
  <div class="main-bg">
    <div class="header">
      <div style="font-size:4vh;text-align: center;padding-bottom: 1.5vh">王马社区·健康养老数字化</div>
      <div class="top-bar__right" style="padding-bottom: 2vh">
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
    <div class="reltime">
      <div class="bg1">
        <div class="dataTitle">实时动态</div>
        <div class="data1">
        </div>

      </div>
      <div class="bg1">
        <div class="dataTitle">告警监控</div>
        <div class="warn_bg">
          <div class="warn_echarts">
            <div class="warn_level">告警等级</div>
            <div style="width: 100%;height: 100%;margin-top: 1vh" id="warn_echarts"></div>
          </div>
          <div class="warn_table">
            <div v-if="warnData.length >0 ">
              <div style="height: 20vh;margin-top: 1vh">
                <vue-seamless-scroll  v-if="warnData.length >4 " :data="warnData" class="seamless-warp" :class-option="classOption">
                  <div class="box-warn" v-for="(item,i) in warnData">
                    <div class="topdirection"></div>
                    <div class="warn_text">{{i+1}},{{item.detail}}</div>
                    <div class="old_person_line">老人路线图</div>
                  </div>
                </vue-seamless-scroll>
                <div v-else>
                  <div class="box-warn" v-for="(item,i) in warnData">
                    <div class="topdirection"></div>
                    <div class="warn_text">{{i+1}},{{item.detail}}</div>
                    <div class="old_person_line">老人路线图</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
               <div class="no_warn">
                 <div class="no_warn_icon"></div>
                 <div class="no_warn_text">设备正常运行，没有告警信息</div>
               </div>
            </div>


          </div>
        </div>
      </div>
    </div>

    <div class="bottom_main">
      <div class="bottom_left">
        <div class="bottom_bg">
          <div class="bottom_title">体检概述</div>
          <div class="tj">
            <div id="clzc" style="width: 100%;height: 100%;margin-left: 1.5vw;margin-top: 3vh;display: none"></div>
            <div >
              <div class="no_data_title">测量状况</div>
              <div class="no_data">暂无数据</div>
            </div>
            <div id="tjrs" style="width: 100%;height: 100%;margin-top: 3vh"></div>
          </div>
        </div>
        <div class="bottom_bg" >
          <div class="bottom_title">健身运动</div>
          <div id="jsrs" style="width: 100%;height: 95%;margin-top: 2vh;margin-left: 1.5vw;"></div>
        </div>
      </div>
      <div class="bottom_center">

      </div>
      <div class="bottom_right">
        <div class="bottom_bg">
          <div class="bottom_title">售药概况</div>
          <div class="tj">
            <div id="saleTop" style="width: 100%;height: 100%;margin-left: 1.5vw;margin-top: 3vh"></div>
            <div id="saleTime" style="width: 100%;height: 100%;margin-top: 3vh"></div>
          </div>
        </div>
        <div class="bottom_bg">
          <div class="bottom_title">在线问诊</div>
          <div class="tj">
            <div id="wzTop" style="width: 100%;height: 100%;margin-left: 1.5vw;margin-top: 3vh"></div>
            <div id="wzPerson" style="width: 100%;height: 100%;margin-top: 3vh"></div>
          </div>

        </div>
      </div>

    </div>
    <div class="bottom_line"></div>
  </div>
</template>

<script>
    import { fullscreenToggel, listenfullscreen } from "../../util/util";
    import { mapGetters, mapState } from "vuex";
    import {getHealthVisualData} from "../../api/system/monitor";
    import vueSeamlessScroll from 'vue-seamless-scroll'
    const echarts = require('echarts');
    export default {
        name: "healthVisualization",
        comments:{
            vueSeamlessScroll
        },
        data(){
            return{
                echartsChart:null,
                clzhChart:null,
                tjrsChart:null,
                jsrsChart:null,
                saleTopChart:null,
                saleTimeChart:null,
                wzTopChart:null,
                wzPersonChart:null,
                warnData:[],
                xData:[],
                warnEcheartsData:[],
                alarmTotalNum:0
            }
        },
        computed: {
            ...mapState({
                showFullScren: state => state.common.showFullScren,
            }),
            ...mapGetters([
                "isFullScren", "userInfo"
            ]),
            classOption () {
                return {
                    step: 0.2, // 数值越大速度滚动越快
                    limitMoveNum: 2, // 开始无缝滚动的数据量 this.dataList.length
                    hoverStop: true, // 是否开启鼠标悬停stop
                    direction: 1, // 0向下 1向上 2向左 3向右
                    openWatch: true, // 开启数据实时监控刷新dom
                    singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                    singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                    waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
                }
            }
        }, destroyed(){
            this.$store.commit("SET_PAGE_FULL_SCREEN", false);
        },created() {
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
        },mounted() {
            let that= this;
            window.onresize = function(){ // 定义窗口大小变更通知事件
                console.log("窗口大小变化");
                if(that.echartsChart !=null){
                    that.echartsChart.resize();
                }
                if(that.clzhChart !=null){
                    that.clzhChart.resize();
                }
                if(that.tjrsChart !=null){
                    that.tjrsChart.resize();
                }
                if(that.saleTopChart !=null){
                    that.saleTopChart.resize();
                }
                if(that.saleTimeChart !=null){
                    that.saleTimeChart.resize();
                }

            };
            listenfullscreen(this.setScreen);
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
            this.$nextTick(() => {
                console.log("页面渲染完成");
                this.xData = new Array();
                this.xData.push(this.getDay(-7));
                this.xData.push(this.getDay(-6));
                this.xData.push(this.getDay(-5));
                this.xData.push(this.getDay(-4));
                this.xData.push(this.getDay(-3));
                this.xData.push(this.getDay(-2));
                this.xData.push(this.getDay(-1));
                this.getVisualData();


            });
        },methods:{
            goToHome() {
                this.$router.push("/wel");
                this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            },handleScreen() {
                fullscreenToggel();
            },getVisualData(){
               getHealthVisualData(null,null).then(res => {
                   let data = res.data.data;
                   let  alarmReportVo = data.alarmReportVo;
                   let  alarmNum = alarmReportVo.alarmNum;//警告数量
                    this.alarmTotalNum = alarmReportVo.alarmTotalNum;//告警总数
                   let  genNum = alarmReportVo.genNum;//一般告警数量
                   let seriousNum = alarmReportVo.seriousNum //紧急告警数量
                   this.warnEcheartsData.push( {value: seriousNum, name: '紧急'});
                   this.warnEcheartsData.push( {value: alarmNum, name: '告警'});
                   this.warnEcheartsData.push( {value: genNum, name: '一般'});
                   let  alarmList = alarmReportVo.alarmList;
                    this.warnData = alarmList;

                   this.initData();
               });
            },initData(){
                let myChart=echarts.init(document.getElementById("warn_echarts"));
                let option = {
                    tooltip: {
                        trigger: 'item',
                        show: false //显示提示框
                    },
                    toolbox:{
                        show:false,
                        feature:{
                            saveAsImage:{
                                show:false
                            }
                        }
                    },
                    color: ['#E81515', '#FFEA00', '#24FCF9'],
                    legend: {
                        left: 'center',
                        textStyle: {//图例文字的样式
                            color: 'white',
                            fontSize: 10
                        },
                        padding:[0,40,10,0],
                        itemHeight: 10,
                        itemWidth:10,
                        formatter: function(name) {
                            var data = option.series[0].data;
                            var total = 0;
                            var tarValue;
                            for (var i = 0; i < data.length; i++) {
                                total += data[i].value;
                                if (data[i].name == name) {
                                    tarValue = data[i].value;
                                }
                            }
                            var v = tarValue;

                            return `${name} ${v}`;
                        }
                    },
                    series: [
                        {
                            type: 'pie',
                            radius: ['50%', '80%'],
                            avoidLabelOverlap: false,
                            hoverAnimation:false,
                            itemStyle: {
                                borderRadius: 1,
                                borderColor: '#fff',
                                borderWidth: 1
                            },
                            label: {
                                show: true,
                                position: 'center',
                                normal: {
                                    show: true,
                                    position: 'center',
                                    color:'#ffffff',
                                    formatter:'{active|告警数量}'+'\n\r'+'{total|'+this.alarmTotalNum+'}',
                                    rich: {
                                        total:
                                            {
                                                fontSize: 20,
                                                color: '#01E4F3'
                                            },
                                        active: {
                                            fontSize: 10,
                                            color:'#ffffff',
                                            lineHeight:20,
                                        },
                                    },
                                },
                                emphasis: {//中间文字显示
                                    show: true,
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    fontSize: '40',
                                    fontWeight: 'bold'
                                }
                            },
                            labelLine: {
                                show: false
                            },
                            data:this.warnEcheartsData
                        }
                    ]
                };
                myChart.setOption(option);
                this.echartsChart = myChart;
                //测量状况
                let clzc = echarts.init(document.getElementById("clzc"));
                 let  clOption = {
                     title: {
                         text: '测量状况',
                         left: 'left',
                         textStyle: {//图例文字的样式
                             color: '#01E4F3',
                             fontSize: 12
                         },
                     },
                    legend: {
                        textStyle: {//图例文字的样式
                            color: 'white',
                            fontSize: 10
                        },
                        orient: 'vertical',
                        x:'right',      //可设定图例在左、右、居中
                        y:'bottom',     //可设定图例在上、下、居中
                        padding:[50,130,0,0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
                        itemHeight: 7,
                        itemWidth:10
                    },
                     color: [ '#24FCF9','#FFEA00','#E81515'],
                     toolbox:{
                         show:false,
                         feature:{
                             saveAsImage:{
                                 show:false
                             }
                         }
                     },

                    series: [
                        {
                            type: 'pie',
                            radius: [20, 30],
                            center: ['50%', '55%'],
                            roseType: 'area',
                            itemStyle: {
                                borderRadius: 8
                            },

                            data: [
                                {value: 0, name: '正常'},
                                {value: 0, name: '低血压'},
                                {value: 0, name: '高血压'}
                            ]
                        }
                    ]
                };
                clzc.setOption(clOption);
                this.clzhChart = clzc;
                //体检人数
                let  tjrs = echarts.init(document.getElementById("tjrs"));
                let  tjrsOption = {
                    color: [ '#24FCF9','#FFEA00','#E81515'],
                    title: {
                        text: '体检人数',
                        left: 'left',
                        textStyle: {//图例文字的样式
                            color: '#01E4F3',
                            fontSize: 12
                        },
                    },
                    grid: {
                        left: '0%',
                        right: '5%',
                        bottom: '0%',
                        top: '25%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data:  this.xData,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                                fontSize: 10
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        },
                        boundaryGap: false // 不留白，从原点开始
                    },
                    yAxis: {
                        type: 'value',
                        max: 5,
                        min: 0,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    series: [{
                        data: [0, 0, 0, 0, 0, 0,0],
                        type: 'line'
                    }]
                };
                tjrs.setOption(tjrsOption);
                this.tjrsChart = tjrs;

                //健身人数
                let  jsrs = echarts.init(document.getElementById("jsrs"));
                let jsrsOption = {
                    color: [ '#24FCF9','#FFEA00','#E81515'],
                    title: {
                        text: '健身人数',
                        left: 'left',
                        textStyle: {//图例文字的样式
                            color: '#01E4F3',
                            fontSize: 12
                        },
                    },
                    xAxis: {

                        boundaryGap: false,
                        data: this.xData,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '2' //坐标线的宽度
                            }
                        },
                //设置网格线颜色
                splitLine: {
                    show: true,
                        lineStyle:{
                        color: ['#315070'],
                        width: 1,
                            type: 'solid'
                    }
                }
                    },
                    yAxis: {
                        type: 'value',
                        max: 5,
                        min: 0,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    grid: {
                        left: '1%',
                        right: '10%',
                        bottom: '20%',
                        top: '20%',
                        containLabel: true
                    },
                    series: [{
                        data: [0, 0, 0, 0, 0, 0, 0],
                        type: 'line',
                        areaStyle: {}
                    }]
                };
                jsrs.setOption(jsrsOption);
                this.jsrsChart = jsrs;

                //top3药品
                let  saleTop = echarts.init(document.getElementById("saleTop"));
               let saleTopOption = {
                   color: [ '#33C5F1','#FFEA00','#E81515'],
                   title: {
                       text: 'TOP3药品',
                       left: 'left',
                       textStyle: {//图例文字的样式
                           color: '#01E4F3',
                           fontSize: 12
                       },
                   },
                    xAxis: {
                        type: 'category',
                        data: ['999感冒灵', '创口贴', '止咳糖浆'],
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            },
                            interval:0
                        }, axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: false,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                   grid: {
                       left: '1%',
                       right: '1%',
                       bottom: '0%',
                       top: '30%',
                       containLabel: true
                   },
                    yAxis: {
                        type: 'value',
                        max: 5,
                        min: 0,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            }
                        }, axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: false,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    series: [{
                        data: [ 0, 0, 0],
                        type: 'bar',
                        barWidth : 15,
                        center: ['50%', '50%'],
                        itemStyle:{
                            normal:{
                                label:{
                                    show: true,		//开启显示
                                    position: 'top',	//在上方显示
                                    textStyle: {	    //数值样式
                                        color: 'black',
                                        fontSize: 10,
                                        color: 'white'
                                    }
                                }
                            }
                        }
                    }]
                };
                saleTop.setOption(saleTopOption);
                this.saleTopChart = saleTop;

                //购药次数
                let saleTime = echarts.init(document.getElementById("saleTime"));
                let  saleTimeOption = {
                    color: [ '#24FCF9','#FFEA00','#E81515'],
                    title: {
                        text: '购药次数',
                        left: 'left',
                        textStyle: {//图例文字的样式
                            color: '#01E4F3',
                            fontSize: 12
                        },
                    },
                    grid: {
                        left: '0%',
                        right: '5%',
                        bottom: '0%',
                        top: '23%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data:this.xData,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        },
                        boundaryGap: false // 不留白，从原点开始
                    },
                    yAxis: {
                        type: 'value',
                        max: 5,
                        min: 0,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            }
                        }, axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    series: [{
                        data: [0, 0, 0, 0, 0, 0, 0],
                        type: 'line'
                    }]
                };
                saleTime.setOption(saleTimeOption);
                this.saleTimeChart = saleTime;


                //top3问诊
                let  wzTop = echarts.init(document.getElementById("wzTop"));
                let wzTopOption = {
                    color: [ '#33C5F1','#FFEA00','#E81515'],
                    title: {
                        text: '问诊类别TOP3',
                        left: 'left',
                        textStyle: {//图例文字的样式
                            color: '#01E4F3',
                            fontSize: 12
                        },
                    },
                    xAxis: {
                        type: 'category',
                        data: ['高血压', '糖尿病', '感冒'],
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            },
                            interval:0
                        }, axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: false,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '0%',
                        top: '30%',
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                        max: 5,
                        min: 0,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            }
                        }, axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: false,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    series: [{
                        data: [ 0, 0, 0],
                        type: 'bar',
                        barWidth : 15,
                        center: ['50%', '50%'],
                        itemStyle:{
                            normal:{
                                label:{
                                    show: true,		//开启显示
                                    position: 'top',	//在上方显示
                                    textStyle: {	    //数值样式
                                        color: 'black',
                                        fontSize: 10,
                                        color: 'white'
                                    }
                                }
                            }
                        }
                    }]
                };
                wzTop.setOption(wzTopOption);
                this.wzTopChart = wzTop;

                //购药次数
                let wzPerson = echarts.init(document.getElementById("wzPerson"));
                let  wzPersonOption = {
                    color: [ '#24FCF9','#FFEA00','#E81515'],
                    title: {
                        text: '问诊人数',
                        left: 'left',
                        textStyle: {//图例文字的样式
                            color: '#01E4F3',
                            fontSize: 12
                        },
                    },
                    grid: {
                        left: '0%',
                        right: '5%',
                        bottom: '0%',
                        top: '23%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: this.xData,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            }
                        },
                        axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        },
                        boundaryGap: false // 不留白，从原点开始
                    },
                    yAxis: {
                        type: 'value',
                        max: 5,
                        min: 0,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //y轴data 的颜色
                                fontSize: 10
                            }
                        }, axisLine: {
                            lineStyle: {
                                type:  'solid' ,
                                color:  '#1E4590' , //左边线的颜色
                                width: '1' //坐标线的宽度
                            }
                        },
                        //设置网格线颜色
                        splitLine: {
                            show: true,
                            lineStyle:{
                                color: ['#1E4590'],
                                width: 1,
                                type: 'solid'
                            }
                        }
                    },
                    series: [{
                        data: [0, 0, 0, 0, 0, 0, 0],
                        type: 'line'
                    }]
                };
                wzPerson.setOption(wzPersonOption);
                this.wzPersonChart = wzPerson;
            },getDay(day){
                var today = new Date();
                var targetday_milliseconds=today.getTime() + 1000*60*60*24*day;
                today.setTime(targetday_milliseconds); //注意，这行是关键代码
                var tYear = today.getFullYear();
                var tMonth = today.getMonth();
                var tDate = today.getDate();
                tMonth = this.doHandleMonth(tMonth + 1);
                tDate = this.doHandleMonth(tDate);
                return tMonth+"-"+tDate;
            }, doHandleMonth(month){
                var m = month;
                if(month.toString().length == 1){
                    m = "0" + month;
                }
                return m;
            }
        }
    }
</script>

<style scoped>
  .main-bg {
    background: url(/img/monitoring/h_bg.png);
    background-size: 100%, 100%;
  }
  .header {
    color: white;
    width: 100%;
    text-align: center;
    background-image: url("/img/monitoring/health_top_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 9.62vh;
    text-align: center;
    display: flex;
    justify-content: center;/*实现水平居中*/
    align-items:center; /*实现垂直居中*/
  }
  .reltime{
    display: flex;
    justify-content:space-around;
    align-items: center;
    margin-top: 1.5vh;
  }
  .bg1{
    color: white;
    width: 46.66vw;
    text-align: center;
    background-image: url("/img/monitoring/real_time_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 28.52vh;
    align-items: center;
    display: flex;
    flex-flow: column;
  }
  .dataTitle{
    margin-top: .8vh;
    font-size: 2vh;
  }
  .data1{
    color: white;
    width: 39.89vw;
    text-align: center;
    background-image: url("/img/monitoring/data1.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 19.81vh;
    vertical-align:middle;
    margin-top: 1.3vh;
  }
  .box-warn {
    width: 90%;
    margin: 0 auto;
    border: 1px solid #25416F;
    background-color: #25416F;
    height: 4vh;
    overflow: hidden;
    color: white;
    font-size: 1.8vh;
    line-height: 4vh;
    margin-top: 1vh;
    display: flex;
    align-items: center;
    vertical-align:middle;
    padding-left: 1vw;
    margin-right: 2vw;
  }
  .warn_bg{
    display: flex;
    align-items: center;
    vertical-align:middle;
  }
  .warn_level{
    font-size: 1.8vh;
    color: #00E4F3;
    text-align: left;
    margin-left: 2vw;

  }
  .warn_echarts{
    width: 18.33vw;
    height: 19.81vh;
  }
  .warn_table{
    width: 28.33vw;
    height: 19.81vh;
    margin-top: 1.3vh;
  }
  .bottom_main{
    display: flex;
    align-items: center;
    vertical-align:middle;

    justify-content:space-around;
    padding-left: 1.5%;
    padding-right: 1.5%;
  }
  .bottom_bg{
    color: white;
    width: 30.36vw;
    text-align: center;
    background-image: url("/img/monitoring/bottom_bg.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 24.91vh;
    vertical-align:middle;
    margin-top: 2vh;
  }
  .bottom_line{
    width: 100%;
    background-image: url("/img/monitoring/bottom_line.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 2.59vh;
    margin-top: 1.6vh;
  }
  .bottom_center{
    width: 34.38vw;
    text-align: center;
    background-image: url("/img/monitoring/bottom_center.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 46.48vh;
    margin-top: 2vh;
  }
  .bottom_title{
    color: white;
    font-size: 2vh;
    position: relative;
    top:.7vh
  }
  .tj{
    display: flex;
    align-items: center;
    vertical-align:middle;
    align-content: center;
  }
  .seamless-warp{
    width: 100%;
    height: calc(100%);
    overflow: hidden;
  }
  .old_person_line{
    width: 7vw;
    color: #00E4F3;
    border: 1px solid #377AFF;
    height: 3vh;
    border-radius: 10px;
    line-height: 3vh;
    margin-left: 1vw;
  }
  .topdirection
  {    width: 14px;
    text-align: center;
    background-image: url("/img/chargingVisualization/warn.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 12px;
  }
  .warn_text{
    margin-left: 1vh;
    width: 15vw;
    overflow: hidden;/*超出部分隐藏*/
    white-space: nowrap;/*不换行*/
    text-overflow:ellipsis;/*超出部分省略号显示*/
  }
  .no_warn{
    display: flex;
    align-items: center;
    vertical-align:middle;
    justify-content:center;
    height: 20vh;
    width: 25vW;
    background-color: #243F6D ;filter:Alpha(opacity=50);
    text-align: center;
    margin-top: 1vh;
  }
  .no_warn_icon{
    width: 16px;
    text-align: center;
    background-image: url("/img/monitoring/no_warn_icon.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    -moz-background-size: 100% 100%;
    height: 16px;
  }
  .no_warn_text{
    margin-left: 1vw;
    font-size: 2vh;
  }
  .no_data_title{
    font-size: 1.9vh;
    color: #00E4F3;
    font-weight: bold;
    text-align: left;
    position: relative;
    left: 2vw;
    bottom: 2.5vh;
  }
  .no_data{
    width:10vw;
    height:5vh;
    font-size:1.7vh;
    line-height:5vh;
    position: relative;
    top:1vh;
    background-color: #243F6D ;
    filter:Alpha(opacity=30);
    margin-left: 2vw;
    margin-right: 1vw
  }
</style>

