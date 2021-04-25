<template>
  <div style="background: #000c17 !important;">
    <div style="color: white;width:100%;text-align: center;">
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
    <div style="width: 100%;height: 5px;background: #1C243A;margin-top: 5px">
    </div>
    <div style="color: white;padding: .5rem;padding-left: 2rem">
      投放点
    </div>
    <!--中转站-->
    <div class="transferStation" style="background: #1C243A !important;">
      <div class="left">
        <div class="top" style="margin-top: .5rem">
          <div class="title">
            分类垃圾桶{{deviceNo}}
          </div>
          <div class="from" style="margin-left: .9rem">
            <div class="m-toufang-info">
              <p v-for="(val, key) in information" :key="key">{{val.text}}: {{val.value}}</p>
            </div>
            <!--          <div class="m-toufang-info">-->
            <!--            <p v-for="(val, key) in information" :key="key">{{val.text}}: {{val.value}}</p>-->
            <!--          </div >-->
          </div>
          　
        </div>
        <div class="center">
          <div class="title"> 本周垃圾分类情况</div>
          <ul class="Classification">
            <li :class="{active : key === cut}" v-for="(val, key) in Classification" :key="key" @click="switcher(key)">
              {{val}}
            </li>
          </ul>
          <div id="myChartId" class="barChart">
          </div>
        </div>
        <div class="bottom">
          <div class="title">
            垃圾分类照片
          </div>
          <div v-for="item in  imageList">
            <img class="div-img" :src="item">
          </div>
        </div>
      </div>
      <div class="center">
        <div class="top">
          <div style="font-size:1rem;margin-top: 1rem;color: white;margin-left: 20px">
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
          <Map STYLE="position: relative;top: .3rem;width: 450px;left: 30px" :mapImag="mapData" :lineX="pointData.lineX"
               :lineY="pointData.lineY" :circleList="circleList"
               v-on:onChildByValue="getMonitorData" :isShowLine="true" :isShow="1"/>
          <!--<putInMap STYLE="position: relative;bottom: .3rem"></putInMap>-->
        </div>
      </div>
      <div class="right">
        <div class="todayClassification">
          <span class="percentage">{{nowTfData.perishableCorrectTimesRate}}</span>
          <div class="text">
          <span class="arrows" v-if="nowTfData.arrowsBlue">
                <span></span>
          </span>
            <i class="el-icon-caret-top m-down" style="color: red" v-else></i>
            <span class="price" style="font-size: .7rem">{{nowTfData.perishableCorrectTimesRateCompareRate}}</span>
            <p class="TodayRate">今日分类准确率</p>
          </div>
        </div>
        <div class="clear"></div>
        <div class="title">
          垃圾投放记录
        </div>
        <div style="height: 1px;background: black;width: 100%"></div>
        <table style="font-size: .8rem; color:#6F6F71; width: 100%;" v-for="item in  recordList">
          <tr style="height: 30px">
            <td style="padding-left: 1rem">{{item.cardNum}}-****-***</td>
            <td style="padding-left: 1rem;width: 150px">{{item.refuseType}}</td>
            <td style="padding-left: 1rem">{{item.totalWeight}}公斤</td>
            <td style="padding-left: 1rem">{{item.createTime}}</td>
          </tr>
        </table>
        <div style="height: 1px;background: black;width: 100%"></div>
        <div style="width: 100%;text-align: center">
          <div class="img" v-for="(val, key) in imgList" :key=key>
            <img :src="val">
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
    import {fullscreenToggel} from "../../util/util";
    import {mapGetters, mapState} from "vuex";
    import {getMonitor} from "../../api/system/monitor";

    const echarts = require('echarts');
    export default {
        name: "treatmentFacilities",
        data() {
            return {
                cityName: "金华市",
                areaName: '金东区',
                areaNameData: {"金华市": "金东区", "桐乡市": "乌镇"},
                cityDatas: ["金华市", "桐乡市"],
                mapData: "",
                mapImgData: {"金华市": "img/map/jinghua2.png", "桐乡市": "img/map/wuzhen2.png"},
                deviceNo: "0801",
                devicenoData: {"金华市": "0801", "桐乡市": "8003"},
                pointData: {},
                mapPoint: {
                    "金华市": [{"lineX": 131, "lineY": 241, "deviceNo": "0801", "fill": "#142E73"}],
                    "桐乡市": [{"lineX": 251, "lineY": 101, "deviceNo": "8003", "fill": '#6d3ff0'},
                        {"lineX": 261, "lineY": 111, "deviceNo": "8002", "fill": "#BF4645"}]
                },
                circleList: [],
                //今日时间
                nowDate: "",
                information: [],
                tableList: [
                    {
                        garbageCategory: '垃圾种类(单位:公斤)',
                        monday: '周一',
                        tuesday: '周二',
                        wednesday: '周三',
                        thursday: '周四',
                        Friday: '周五',
                        Saturday: '周六',
                        sunday: '周日'
                    },
                ],
                imgList: ['http://rrmobile.wewins.cn/RRServiceWeb/camlj/cam1/2019-10-17/cam1_08.59.11[755@35801].jpg',
                    'http://rrmobile.wewins.cn/RRServiceWeb/camlj/cam1/2019-10-17/cam1_08.59.11[755@35801].jpg'],
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
                contrast: '30',
                finalWeight: '3000',
                imageList: [],
                recordList: [],
                xAxisData: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
                //今日识别率
                nowTfData: {},
                TimerMethod: null
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
                "isFullScren", "monitorInfo", "MapInfo", 'pointDataInfo'
            ])
        },
        methods: {
            goToHome() {
                this.$router.push("/wel");
                this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            },
            handleCommand(command) {
                this.$store.dispatch("saveMapInfo", command).then(res => {
                    var pointData = this.pointData = this.mapPoint[command][0];
                    this.$store.commit("SET_POINT_DATA", pointData);
                    this.dealMapInfo();
                    this.getData();
                });
                // this.cityName=command;
                // console.log(command)
                // this.deviceNo=this.devicenoData[command];
                // this.mapData=this.mapImgData[command];
                // this.pointData=this.mapPoint[command][0];
                // this.circleList=this.mapPoint[command];
                // this.areaName=this.areaNameData[command];
                //
                // this.$message('click on item ' + command);
            },
            forwardTfd() {
                this.$router.push("/transferStation/transferStation");

            },
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

                var now = year + '-' + this.conver(month) + "-" + this.conver(date) + " " + this.conver(h) + ':' + this.conver(m) + ":" + this.conver(s);
                this.nowDate = now;
            }, conver(s) {
                return s < 10 ? '0' + s : s;
            },
            toPoint(percent) {
                var str = percent.replace("%", "");
                var strPoint = str / 100;
                return strPoint.toFixed(2);
            },
            getWeek(i) {
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
            }, getMonitorData(val) {
                console.log(val)
                this.$store.dispatch('savePoint', val).then(res => {
                    this.pointData = val;
                    this.deviceNo = val.deviceNo;
                    this.getData();
                });
            },
            getData() {//获取监控信息
                this.getDate();
                this.$store.dispatch("getMonitor", this.deviceNo).then(res => {
                    this.dealData();

                });

            }, dealData() {
                // const data=res.data.data;
                const data = this.monitorInfo;
                const lastImageUrl = data.lastImageUrl;
                if (lastImageUrl.length > 28) {
                    this.imageList = lastImageUrl.slice(0, 28);
                } else {
                    this.imageList = lastImageUrl;
                }

                let mallAddress = data.mallAddress;
                let mallName = data.mallName;
                this.information = new Array();
                let mallAddressInfo = {text: '地址', value: mallAddress};
                let mallNameInfo = {text: '名称', value: mallName};
                this.information.push(mallAddressInfo);
                this.information.push(mallNameInfo);
                this.imgList = new Array();
                const lastFaceImageUrl = data.lastFaceImageUrl;
                const lastRefuseImageUrl = data.lastRefuseImageUrl;
                if (lastFaceImageUrl.search("http:") > -1) {
                    this.imgList.push(lastFaceImageUrl);
                } else {
                    this.imgList.push("http://rs.wewins.cn/" + lastFaceImageUrl);
                }
                this.imgList.push(lastRefuseImageUrl);
                const lastThrowLog = data.lastThrowLog;
                this.recordList = new Array();
                for (let i = 0; i < lastThrowLog.length; i++) {
                    let item = lastThrowLog[i];
                    var cardNum = item.cardNum;
                    var descJson = item.desc;
                    var createTime = item.createTime;
                    var refuseType = "";
                    var totalWeight = 0;

                    for (let j = 0; j < descJson.length; j++) {
                        let descInfo = descJson[j];
                        let type = descInfo.type;
                        refuseType = refuseType + type + " "
                        let weight = descInfo.weight;
                        var aNew = Math.round(weight * 100) / 100
                        totalWeight = totalWeight + aNew;
                    }

                    var aNew = Math.round(totalWeight * 100) / 100
                    if (aNew == 0) {
                        aNew = "0.1"
                    }
                    this.recordList.push({
                        "cardNum": cardNum,
                        "createTime": createTime,
                        "descJson": descJson,
                        "refuseType": refuseType,
                        "totalWeight": aNew
                    })

                }
                //获取最14天的投放记录
                var lastDaily = data.lastDaily;
                var weekDate = new Array();
                var lastWeekDate = new Array();
                //获取本周对应的时间
                for (let i = 0; i < this.xAxisData.length; i++) {
                    weekDate.push(this.getWeek(i))
                    lastWeekDate.push(this.getWeek(i - 7))
                }
                this.WeekQuality = new Array();
                this.WeekHandleWeight = new Array();
                //获取本周对应的分类质量
                for (let i = 0; i < weekDate.length; i++) {
                    var wDate = weekDate[i];
                    for (let j = 0; j < lastDaily.length; j++) {
                        let lastDailyData = lastDaily[j];
                        let ymd = lastDailyData.ymd;
                        let perishableCorrectRate = lastDailyData.perishableCorrectTimesRate;
                        let totalWeight = lastDailyData.totalWeight;
                        if (perishableCorrectRate == "") {
                            perishableCorrectRate = "0";
                        }

                        if (wDate == ymd) {
                            this.WeekQuality.push(this.toPoint(perishableCorrectRate))
                            this.WeekHandleWeight.push(totalWeight);
                        }

                    }
                }
                console.log(this.WeekQuality)
                //获取上周对应的分类质量及分类重量
                const nowTfData = lastDaily[0];
                if (nowTfData.perishableCorrectTimesRateCompareRate.indexOf("-") > -1) {
                    nowTfData.arrowsBlue = true;
                } else {
                    nowTfData.arrowsBlue = false;
                }
                this.nowTfData = nowTfData;
                for (let i = 0; i < lastWeekDate.length; i++) {
                    var wDate = lastWeekDate[i];
                    for (let j = 0; j < lastDaily.length; j++) {
                        let lastDailyData = lastDaily[j];
                        let ymd = lastDailyData.ymd;
                        let perishableCorrectRate = lastDailyData.perishableCorrectTimesRate;
                        let totalWeight = lastDailyData.totalWeight;
                        if (perishableCorrectRate == "") {
                            perishableCorrectRate = "0";
                        }
                        if (wDate == ymd) {
                            this.lassWeekQuality[i] = this.toPoint(perishableCorrectRate);
                            this.lassWeight[i] = totalWeight;
                        }

                    }
                }
                this.switcher(this.cut);
            },
            getImageList() {
                for (let i = 0; i < 28; i++) {
                    this.imageList.push("http://rrmobile.wewins.cn/RRServiceWeb/camlj/cam1/2019-10-17/cam1_08.59.11[755@35801].jpg")
                }
                for (let i = 0; i < 10; i++) {
                    this.recordList.push(i)
                }

            },
            handleScreen() {
                fullscreenToggel();
            },
            setScreen() {
                this.$store.commit("SET_FULLSCREN");
            },
            switcher(key) {
                this.cut = key;

                if (key === 1) {
                    this.initChart(this.WeekHandleWeight, this.lassWeight) //收运重量
                } else {
                    this.initChart(this.WeekQuality, this.lassWeekQuality)//垃圾分类质量
                }
            },
            // 本周垃圾分类情况
            initChart(week, lassweek) {
                // console.log(week, lassweek,'本周垃圾分类情况条形图');
                this.bar = echarts.init(document.getElementById("myChartId"));
                // 把配置和数据放这里
                this.bar.setOption({
                    color: ['#3398DB', '#83b15a'],
                    legend: {
                        data: ['上周', '本周'],
                        right: '10px',
                        top: '25px',
                        icon: "circle",   //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
                        itemWidth: 10,  // 设置宽度
                        itemHeight: 10, // 设置高度
                        itemGap: 30, // 设置间距
                        textStyle: {
                            color: ["#616f71",]
                        },
                        // 图例布局方向
                        orient: 'right',
                        selectedMode: false
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '5%',
                        right: '20%',
                        bottom: '5%',
                        top: '20%',
                        containLabel: true,
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.xAxisData,
                            // axisLabel: {
                            //
                            //   //这个是倾斜角度，也是考虑到文字过多的时候，方式覆盖采用倾斜
                            //
                            //   //这里是考虑到x轴文件过多的时候设置的，如果文字太多，默认是间隔显示，设置为0，标示全部显示，当然，如果x轴都不显示，那也就没有意义了
                            //   interval :0
                            // },
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: {
                                color: "#999",     //刻度线标签颜色
                                // rotate: 30,
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLabel: {
                                color: "#999" //刻度线标签颜色
                            },
                        }
                    ],
                    // zAxis:[],
                    series: [
                        {
                            name: '上周',
                            type: 'line',
                            data: lassweek,
                            color: ['#83b15a'],
                            // 表格展示的时间
                            animationDuration: 3000,
                            // 第二项出来的时间和第一项隔得时间
                            animationDelay: 100
                        },
                        {
                            name: '本周',
                            type: 'line',
                            data: week,
                            color: ['#bf444c'],
                            // 表格展示的时间
                            animationDuration: 3000,
                            // 第二项出来的时间和第一项隔得时间
                            animationDelay: 100

                        }
                    ],
                })
            },
            dealMapInfo() {
                this.cityName = this.MapInfo;
                console.log("cityName==" + this.MapInfo);
                if (this.cityName == undefined || this.cityName == '') {
                    this.cityName = "金华市"
                }
                this.circleList = this.mapPoint[this.cityName];
                this.mapData = this.mapImgData[this.cityName];
                this.pointData = this.pointDataInfo;
                this.deviceNo = this.devicenoData[this.cityName];
                if (this.pointData == undefined || JSON.stringify(this.pointData) == "{}") {
                    this.pointData = this.mapPoint[this.cityName][0];
                } else {
                    this.deviceNo = this.pointData.deviceNo;
                }


                this.areaName = this.areaNameData[this.cityName];

            }
        },
        created() {
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
        },
        beforeMount() {

        },
        mounted() {
            this.dealMapInfo();
            this.dealData();
            this.TimerMethod = setInterval(() => {
                this.getData();

            }, 30 * 1000)
            // this.getData();
            this.$store.commit("SET_PAGE_FULL_SCREEN", true);
        },
        beforeDestroy() {
            this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            console.log("当前Vue 结束！")
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

  .div-img {
    float: left;
    transform: scale(0.8);
    width: 50px;
    height: 50px;
  }

  .m-toufang-info {
    width: 100%;
    display: inline-block;
    font-size: .7rem;
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
    justify-content: space-between;
    height: 100%;

    .left {
      width: 382px;

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
          border-top: solid 1px #000;
          border-bottom: solid 1px #000;
          border-left: solid 1px #000;
          padding: 4px 16px;
          box-sizing: border-box;
          width: 371px;
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
          margin: 15px 0 0 3px;
          padding: 0;
          display: flex;
          font-size: .8rem;

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
          font-size: 20px;
          font-weight: normal;
          position: relative;
          right: 20px;
        }
      }
    }

    .right {
      width: 35%;

      .todayClassification {
        float: right;
        display: block;
        padding: 1px 24px 6px 17px;
        width: 168px;
        box-sizing: border-box;
        height: 50px;
        background: #17181a;
        border-radius: 5px;
        vertical-align: top;

        .percentage {
          font-size: 17px;
          display: block;
          text-align: center;
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

          .arrows-red {
            span {
              border: solid 4px transparent;
              border-top: red solid 6px;
              display: inline-block;
              margin: 0px 2px 4px 2px;
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
        margin-top: 10px;
        width: 130px;
        height: 234px;
        display: inline-block;
        margin-left: 30px;
        margin-right: 30px;

        img {
          width: 100%;
          height: 100%;

        }
      }
    }
  }
</style>
