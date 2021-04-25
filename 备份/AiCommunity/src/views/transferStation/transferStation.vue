<template>
  <div style="background: #000c17 !important;">
    <div style="color: white;width:100%;text-align: center;padding:.5rem">
      <div style="display: flex;position: relative;top: 23px"> 今日实时数据：{{nowDate}}</div>
      <div style="font-size: 2rem;position: relative;bottom: 10px">生活垃圾监控平台</div>

      <div class="top-bar__right" style="position: absolute;right: -100px">
        <el-tooltip
          effect="dark"
          content="首页"
          placement="bottom">
          <div class="top-bar__item">
            <i class="el-icon-s-home" @click="goToHome"></i>
          </div>
        </el-tooltip>
        <img src="img/btn_change.png" class="m-change" @click="forwardTfd">
        <el-tooltip v-if="showFullScren"
                    effect="dark"
                    :content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')"
                    placement="bottom">
          <div class="top-bar__item">
            <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'"
               @click="handleScreen"></i>
          </div>
        </el-tooltip>
      </div>
    </div>

    <!--    <div style="width: 100%;color: white;font-size: .8rem;padding-left: .9rem">-->
    <!--      今日实时数据：{{nowDate}}-->
    <!--    <img src="img/btn_change.png" class="m-change"  @click="forwardTfd">-->
    <!--    </div>-->
    <div style="width: 100%;height: 5px;background: #1C243A;margin-top: 5px">
    </div>
    <div style="color: white;padding: .5rem">
      <div class="m-Statistics">
        <div class="m-center">{{total.totalPersonNum}}</div>
        <div class="m-js">
          <i class="el-icon-caret-bottom m-up" v-if="total.totalPersonNumRateDown"></i>
          <i class="el-icon-caret-top m-down" v-else></i>
          <span class="m-up m-font " v-if="total.totalPersonNumRateDown">{{total.totalPersonNumCompareRate}}</span>
          <span class="m-down m-font " v-else>{{total.totalPersonNumCompareRate}}</span>

          <span class="m-describe m-font">参与总人数</span>
        </div>

      </div>
      <div class="m-Statistics">
        <div class="m-center">{{total.totalWeight}}</div>
        <div class="m-js">
          <i class="el-icon-caret-bottom m-up" v-if="total.totalWeightRateDown"></i>
          <i class="el-icon-caret-top m-down" v-else></i>
          <span class="m-up m-font" v-if="total.totalWeightRateDown">{{total.totalWeightCompareRate}}</span>
          <span class="m-down m-font" v-else>{{total.totalWeightCompareRate}}</span>
          <span class="m-describe m-font">投放总重量（公斤）</span>
        </div>

      </div>
      <div class="m-Statistics">
        <div class="m-center">{{total.totalTimes}}</div>
        <div class="m-js">
          <i class="el-icon-caret-bottom m-up" v-if="total.totalTimesRateDown"></i>
          <i class="el-icon-caret-top m-down" v-else></i>
          <span class="m-up m-font" v-if="total.totalTimesRateDown">{{total.totalTimesCompareRate}}</span>
          <span class="m-down m-font" v-else>{{total.totalTimesCompareRate}}</span>
          <span class="m-describe m-font">投放次数</span>
        </div>

      </div>
      <div class="m-Statistics">
        <div class="m-center">{{total.perishableTimes}}</div>
        <div class="m-js">
          <i class="el-icon-caret-bottom m-up" v-if="total.perishableTimesRateDown"></i>
          <i class="el-icon-caret-top m-down" v-else></i>
          <span class="m-up m-font" v-if="total.perishableTimesRateDown">{{total.perishableTimesCompareRate}}</span>
          <span class="m-down m-font" v-else>{{total.perishableTimesCompareRate}}</span>
          <span class="m-describe m-font">易腐垃圾投放次数</span>
        </div>

      </div>
      <div class="m-Statistics">
        <div class="m-center">{{total.perishableCorrectTimesRate}}</div>
        <div class="m-js">
          <i class="el-icon-caret-bottom m-up" v-if="total.perishableCorrectTimesRateDown"></i>
          <i class="el-icon-caret-top m-down" v-else></i>
          <span class="m-up m-font" v-if="total.perishableCorrectTimesRateDown">{{total.perishableCorrectTimesRateCompareRate}}</span>
          <span class="m-down m-font" v-else>{{total.perishableCorrectTimesRateCompareRate}}</span>
          <span class="m-describe m-font">易腐垃圾识别率</span>
        </div>

      </div>
    </div>
    <!--中转站-->
    <div class="transferStation">

      <div class="left">
        <div class="top" style="margin-top: 1rem">

          <div class="title">
            分类垃圾桶{{deviceNo}}
          </div>
          　
          <div class="from" style="margin-left: .9rem">
            <div style="width: 100%;">
              <div class="m-toufang-info">
                <p v-for="(val, key) in information" :key="key">{{val.text}}: {{val.value}}</p>
              </div>
              <!--            <div class="m-toufang-info">-->
              <!--              <p v-for="(val, key) in information" :key="key">{{val.text}}: {{val.value}}</p>-->
              <!--            </div >-->

            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="title">
            居民投放详细信息
          </div>
          <div style="margin-left: .9rem">
            <div class="m-toufang" style="padding-left: .5rem;padding-top: 1.3rem">
              <span style="position: relative;bottom: .4rem">垃圾分类指标</span>
            </div>
            <div class="m-toufang" style="color: #DD9A31">投放次数
              <div style="font-size: .6rem">(单位：次)</div>
            </div>
            <div class="m-toufang" style="color: #C00000">易腐投放质量
              <div style="font-size: .6rem">(单位：%)</div>
            </div>
            <div class="m-toufang" STYLE="color: #4EC7EE">投放重量
              <div style="font-size: .6rem">(单位：公斤)</div>
            </div>
          </div>
          <div v-for="item in tableList" style="margin-left: .9rem">
            <div class="m-info" style="padding-left: .5rem">
              居民{{item.fullRoom}}
            </div>
            <div class="m-info" style="color: #DD9A31">{{item.totalTimes}}</div>
            <div class="m-info" style="color: #C00000">{{item.perishableCorrectTimesRate}}</div>
            <div class="m-info" STYLE="color: #4EC7EE">{{item.totalWeight}}</div>
          </div>
          <div style="position: relative;left: 27%;top:10px" v-if="isShowPage">
            <el-pagination background
                           small
                           layout="prev, pager, next" popper-class="m-page-bg"
                           :total="totalCount"
                           size="10"
                           @current-change="handleCurrentChange">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="center">
        <div class="top">
          <div style="font-size:1rem;margin-top: 1rem;color: white">
            浙江省 /
            <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{cityName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(city,index) in  cityDatas"
                                  :command="city" :key="index">{{city}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            {{areaName}}

          </div>
          <Map style="width: 500px" :mapImag="mapData" :lineX="pointData.lineX"
               :lineY="pointData.lineY" :circleList="circleList" :isShowLine="true"
               v-on:onChildByValue="getMonitorData" :isShow="1"/>
        </div>

      </div>
      <div class="right">
        <div class="title" style="margin-top: 1rem">
          最近7天垃圾投放记录
        </div>
        <div id="recode-div" style=" height:80%;width: 100%">

        </div>
      </div>
    </div>
  </div>
</template>

<script>

    import {fullscreenToggel, listenfullscreen} from "../../util/util";
    import {mapGetters, mapState} from "vuex";
    import {getMonitor} from "../../api/system/monitor";

    const echarts = require('echarts')

    export default {
        name: "transferStation",
        data() {
            return {
                information: [],
                cityName: "金华市",
                areaName: '',
                areaNameData: {"金华市": "金东区", "桐乡市": "乌镇"},
                cityDatas: ["金华市", "桐乡市"],
                mapData: "",
                mapImgData: {"金华市": "img/map/jinghua1.png", "桐乡市": "img/map/wuzhen1.png"},
                deviceNo: "",
                devicenoData: {"金华市": "0801", "桐乡市": "8003"},
                pointData: {},
                mapPoint: {
                    "金华市": [{"lineX": 131, "lineY": 241, "deviceNo": "0801", "fill": "#142E73"}],
                    "桐乡市": [{"lineX": 251, "lineY": 101, "deviceNo": "8003", "fill": '#6d3ff0'},
                        {"lineX": 261, "lineY": 111, "deviceNo": "8002", "fill": "#BF4645"}]
                },
                circleList: [],
                tableList: [],//居民投放信息
                Classification: ['分类质量', '收运重量'],
                cut: 0,
                // 上周质量
                lassWeekQuality: [0, 0, 0, 0, 0, 0, 0],
                // 上周重量
                lassWeight: [0, 0, 0, 0, 0, 0, 0],
                // 本周质量
                WeekQuality: [0, 0, 0, 0, 0, 0, 0],
                // 本周重量
                WeekHandleWeight: [0, 0, 0, 0, 0, 0, 0],
                xAxisData: [],
                total: {},
                totalCount: 10,
                contrast: '',
                finalWeight: '',
                recordOption: {},
                totalTimes: [],
                totalWeights: [],
                roomDaily: [],
                nowDate: "",//当前时间,
                isShowPage: true,
                TimerMethod: null,
                isRefuseData: false,


            }
        },
        components: {
            Map: resolve => {
                require(['../OnTheSite/Map'], resolve)
            },
        },
        computed: {
            ...mapState({
                showFullScren: state => state.common.showFullScren,

            }),
            ...mapGetters([
                "isFullScren", "monitorInfo", 'MapInfo', 'pointDataInfo'
            ])
        },
        watch: {},
        methods: {
            returnButton() {
                console.log("返回")
            },
            goToHome() {
                this.$router.push("/wel");
                this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            },
            handleCommand(command) {
                this.$store.dispatch("saveMapInfo", command).then(res => {
                    console.log("command==" + command);
                    this.isRefuseData = true;
                    var pointData = this.pointData = this.mapPoint[command][0];
                    this.$store.commit("SET_POINT_DATA", pointData);
                    this.dealMap(command);
                });


            },
            forwardTfd() {
                this.$router.push("/treatmentFacilities/treatmentFacilities");

            }
            ,
            handePaging(page) {
                var pageSize = 10;
                var pageNo = (page - 1) * pageSize;   //每页的起始索引
                if (pageNo > this.totalCount) {

                    this.tableList = this.roomDaily.slice(pageNo, this.totalCount);
                } else {
                    console.log("我开始分页==pageNo" + pageNo + ";pageNo*pageSize==" + pageNo * pageSize)
                    this.tableList = this.roomDaily.slice(pageNo, page * pageSize);
                }
            },
            handleCurrentChange(val) {
                console.log("currentPage 改变时会触发==" + val);
                this.handePaging(val);
            }, getMonitorData(val) {
                console.log(val)
                this.$store.dispatch('savePoint', val).then(res => {
                    this.pointData = val;
                    this.deviceNo = val.deviceNo;
                    this.getData();
                });

            },
            //获取监控信息
            getData() {
                this.getDate();

                this.$store.dispatch("getMonitor", this.deviceNo).then(res => {
                    this.dealData();
                });
            }, dealData() {
                console.log(this.monitorInfo)
                let data = this.monitorInfo;

                var total = data.total;
                this.total = total;
                // this.deviceNo=data.deviceNo;
                let mallAddress = data.mallAddress;
                let mallName = data.mallName;
                this.information = new Array();
                let mallAddressInfo = {text: '地址', value: mallAddress};
                let mallNameInfo = {text: '名称', value: mallName};
                this.information.push(mallAddressInfo);
                this.information.push(mallNameInfo);
                this.tableList = new Array()
                this.totalTimes = new Array();
                this.totalWeights = new Array();
                this.xAxisData = new Array();
                //获取总的数据
                if (total.totalPersonNumCompareRate.indexOf("-") > -1) {
                    total.totalPersonNumRateDown = true;
                } else {
                    total.totalPersonNumRateDown = false;
                }

                if (total.totalTimesCompareRate.indexOf("-") > -1) {
                    total.totalTimesRateDown = true;
                } else {
                    total.totalTimesRateDown = false;
                }

                if (total.otherTimesCompareRate.indexOf("-") > -1) {
                    total.otherTimesRateRateDown = true;
                } else {
                    total.otherTimesRateRateDown = false;
                }

                if (total.perishableTimesCompareRate.indexOf("-") > -1) {
                    total.perishableTimesRateDown = true;
                } else {
                    total.perishableTimesRateDown = false;
                }

                if (total.totalWeightCompareRate.indexOf("-") > -1) {
                    total.totalWeightRateDown = true;
                } else {
                    total.totalWeightRateDown = false;
                }

                if (total.perishableCorrectTimesRateCompareRate.indexOf("-") > -1) {
                    total.perishableCorrectTimesRateDown = true;
                } else {
                    total.perishableCorrectTimesRateDown = false;
                }
                //获取最近7天的投放记录
                var lastDaily = data.lastDaily;
                var lastDailyData = lastDaily.slice(0, 7);
                for (let i = 0; i < lastDailyData.length; i++) {
                    var element = lastDailyData[i];
                    var totalWeight = element.totalWeight;
                    var totalTimes = element.totalTimes;
                    var ymd = element.ymd;
                    var xData = ymd.substring(4, ymd.length)
                    this.totalTimes.push(totalTimes);
                    this.totalWeights.push(totalWeight)
                    this.xAxisData.push(xData);
                }
                this.initChart();
                //居民投放记录
                var roomDaily = data.roomDaily;
                this.roomDaily = roomDaily;
                this.totalCount = roomDaily.length;
                if (roomDaily.length <= 10) {
                    this.isShowPage = false;
                } else {
                    this.isShowPage = true;
                }
                this.handePaging(1);
                console.log(this.tableList)
            },
            handleScreen() {
                console.log("isFullScren==" + this.isFullScren)
                fullscreenToggel();
            },
            setScreen() {
                this.$store.commit("SET_FULLSCREN");
            },
            // 本周垃圾分类情况
            initChart() {
                console.log("初始化折线图")
                // console.log(week, lassweek,'本周垃圾分类情况条形图');
                this.bar = echarts.init(document.getElementById("recode-div"));
                // 把配置和数据放这里
                this.bar.setOption({
                    title: {
                        text: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['投放次数', '投放重量'],
                        textStyle: {//图例文字的样式
                            color: 'white'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.xAxisData,
                        nameTextStyle: {
                            color: 'white' //x轴名称的 颜色
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
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
                            name: '投放次数',
                            type: 'line',
                            stack: '总量',
                            data: this.totalTimes
                        },
                        {
                            name: '投放重量',
                            type: 'line',
                            stack: '总量',
                            data: this.totalWeights
                        }
                    ]
                });

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

                var now = year + '-' + this.conver(month) + "-" + this.conver(date) + " " + this.conver(h) + ':' + this.conver(m) + ":" + this.conver(s);
                this.nowDate = now;
            }, conver(s) {
                return s < 10 ? '0' + s : s;
            }, GetPercent(num) {
/// <summary>
                /// 求百分比
                /// </summary>
                /// <param name="num">当前数</param>
                /// <param name="total">总数</param>
                let total = 10000000
                num = parseFloat(num);
                total = parseFloat(total);
                if (isNaN(num) || isNaN(total)) {
                    return "-";
                }
                return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00) + "%";
            }, dealMapInfo() {
                this.dealMap(this.MapInfo);
            }, dealMap(cityName) {
                this.cityName = cityName;
                console.log("cityName==" + this.MapInfo);
                this.circleList = this.mapPoint[this.cityName];
                this.mapData = this.mapImgData[this.cityName];
                if (this.isRefuseData) {
                    this.pointData = this.mapPoint[this.cityName][0];
                } else {
                    this.pointData = this.pointDataInfo;
                }

                this.deviceNo = this.devicenoData[this.cityName];
                console.log(this.pointData)
                if (this.pointData == undefined || JSON.stringify(this.pointData) == "{}") {
                    this.pointData = this.mapPoint[this.cityName][0];
                } else {
                    this.deviceNo = this.pointData.deviceNo;
                }


                this.areaName = this.areaNameData[this.cityName];
                this.getData();
            }
        },
        created() {
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);


        },
        beforeMount() {

        },
        mounted() {
            listenfullscreen(this.setScreen);
            this.cityName = this.MapInfo;
            if (this.cityName == undefined || this.cityName == null || this.cityName == '') {
                this.cityName = "金华市";
            }
            this.$store.dispatch("saveMapInfo", this.cityName).then(res => {
                this.dealMapInfo();
            });
            this.TimerMethod = setInterval(() => {
                this.getData();

            }, 30 * 1000)

            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
        },
        beforeDestroy() {
            console.log("当前Vue 结束！");
            this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            this.$once('hook:beforeDestroy', () => {
                clearInterval(this.TimerMethod);
            })
        }
    }
</script>

<style scoped lang="scss">
  .el-dropdown-link {
    cursor: pointer;
    color: white;
    font-size: 1rem;
  }

  .el-icon-arrow-down {
    font-size: 1rem;
  }

  .m-change {
    width: 30%;
    /*position: absolute;*/
    /*right: 2px;*/
  }

  .m-toufang-info {
    width: 100%;
    display: inline-block
  }

  .m-page-bg {
    background-color: black !important;
  }

  .m-info {
    width: 24%;
    background: black;
    display: inline-block;
    padding-bottom: .5rem;
    padding-top: .5rem;
    text-align: center;
    font-size: .7rem;
    border-top: 1px solid #ccc;
    color: #999999;
  }

  .m-toufang {
    width: 24%;
    background: black;
    display: inline-block;
    padding-bottom: .5rem;
    padding-top: .5rem;
    text-align: center;
    font-size: .8rem;
    font-weight: bold;
    color: #999999;

  }

  .m-js {
    position: relative;
    left: 10%;
  }

  .m-font {
    font-size: 1rem;
    position: relative;
    bottom: 4px;
  }

  .m-describe {
    font-size: .8rem;
    color: #999999;
    margin-left: 1rem;
  }

  .m-center {
    text-align: center;
  }

  .m-Statistics {
    font-size: 1.7rem;
    width: 20%;
    display: inline-block;

  }

  .m-up {
    color: #3cc51f;

  }

  .m-down {
    color: red;


  }

  .content-bg {
    background-color: #000c17 !important;
  }

  .clear {
    clear: both;
  }

  .title {
    font-size: 1rem;
    border-left: solid 6px #333;
    text-indent: 5px;
    height: 17px;
    line-height: 17px;
    margin-bottom: 7px;
  }

  .transferStation {
    display: flex;
    color: #ccc;
    background: #1C243A;
    justify-content: space-between;
    height: 100%;

    .left {
      width: 35%;

      .top {
        position: relative;

        .line {
          position: absolute;
          display: inline-block;
          width: 20px;
          border: solid 0.75px #dd9a31;
          right: -22px;
          z-index: 2;
          top: 94.5px;
        }

        .from {
          font-size: 10px;
          border: solid 1px #000;
          padding: 4px 16px;
          box-sizing: border-box;
          width: 381px;
          height: 86px;
          border-radius: 3px;
          color: #777;
          display: flex;

          p {
            padding: 0;
            margin: 0;
            line-height: 20px;
            text-indent: 8px;
          }
        }
      }

      .center {
        margin-top: 17px;

        .Classification {
          list-style: none;
          margin: 30px 0 0 3px;
          padding: 0;
          display: flex;

          .active {
            background: #212326;
            border-bottom: 2px solid #28292b;
            margin-bottom: -2px;
          }

          li {
            line-height: 24px;
            margin: 0 1px;
            text-align: center;
            width: 73px;
            height: 24px;
            border: solid #000 1px;
            border-bottom: none;
            border-radius: 5px 5px 0 0;
            background: #17181a;
            color: #777;
          }
        }

        .barChart {
          border: solid 1px #000;
          border-radius: 5px;
          height: 185px;
          width: 380px;
          /*transform: rotateZ(1deg);*/
        }
      }

      .bottom {
        margin-top: 17px;

        .table {
          padding: 0;
          margin-top: 17px;

          table {
            background: #d4d4d4;

            tr {
              background: #1c243a;

              td {
                text-align: center;
                padding: 8px;
              }

              td:nth-child(1) {
                font-weight: bold;
                border-left: none;
              }
            }

            tr:nth-child(1) {
              font-weight: bold;
              font-size: 10px;
              background: #0d0d0d;
              color: #777777;

              td {
                border-top: none;
              }
            }

            tr:nth-child(2) {
              color: #dd9a31;
            }

            tr:nth-child(3) {
              color: #bf4749;
            }

            tr:nth-child(4) {
              color: #50cdf6;
            }

            tr:nth-child(5) {
              color: #82b059;
            }
          }
        }
      }
    }

    .center {
      flex: 1;

      .top {
        h5 {
          margin: 20px 0 0 0;
          text-indent: 2em;
          padding: 0;
          height: 60px;
          line-height: 60px;
          font-size: 21px;
        }
      }
    }

    .right {
      width: 35%;

      .todayClassification {
        float: right;
        display: block;
        padding: 10px 24px 6px 17px;
        width: 138px;
        box-sizing: border-box;
        height: 50px;
        background: #17181a;
        border-radius: 5px;
        vertical-align: top;

        .percentage {
          font-size: 17px;
          display: block;
          text-align: right;
        }

        .text {
          display: flex;
          align-items: center;
          border: solid transparent 0.5px;

          .arrows {
            span {
              border: solid 4px transparent;
              border-top: #22ac38 solid 6px;
              display: inline-block;
              margin: 4px 5px 0 2px;
            }
          }

          p {
            margin: 0 0 0 17px;
            font-size: 8px;
            color: #777777;
            padding: 0;
          }
        }
      }

      .img {
        margin-top: 20px;
        width: 385px;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  /deep/ .el-pagination.is-background .btn-next {
    background-color: black !important;
    color: white;
    border-radius: 2px;
  }

  /deep/ .el-pagination.is-background .btn-prev {
    border-radius: 2px;
    background-color: black !important;
    color: white;
  }

  /deep/ .el-pagination.is-background .el-pager li {
    margin: 0 5px;
    background-color: black !important;
    color: white;
    min-width: 17px;
    border-radius: 2px;
  }

  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #4D4E50 !important;
    color: #FFF;
  }
</style>
