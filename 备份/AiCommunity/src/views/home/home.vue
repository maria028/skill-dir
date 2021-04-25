<template>
  <div class="home">
    <ul>
      <li v-for="(val, key) in list" :key="key" :class="val.Style" @click="toNext(val.userType)">
        <p class="title">{{val.title}}</p>
        <div class="ProductionToday">今日生产<span class="price">{{val.ProductionToday}}</span> 公斤</div>
        <div class="yesterday">昨日同比<span class="arrow"></span>
          <div class="price">{{val.yesterday}}</div>
        </div>
        <div class="today">今日占比<span class="arrow"></span>
          <div class="price">{{val.today}}</div>
        </div>
        <span class="seeMore">查看更多...</span>
      </li>
    </ul>
    <div class="home_right">
      <div class="title">
        今日八大类垃圾产生量
      </div>
      <div id="barChart">
        <!--进度条形图-->
      </div>
      <div class="title" style="margin-top: 16px">
        今日八大类垃圾分布
      </div>
      <div id="pieChart">

      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "home",
        data() {
            return {
                list: [
                    {
                        title: '餐厨垃圾',
                        ProductionToday: '2500',
                        yesterday: '51%',
                        today: '45%',
                        Style: 'color1',
                        userType: '1'
                    },
                    {
                        title: '大件垃圾',
                        ProductionToday: '2500',
                        yesterday: '51%',
                        today: '45%',
                        Style: 'color2',
                        userType: '2'
                    },
                    {
                        title: '工业垃圾',
                        ProductionToday: '2500',
                        yesterday: '51%',
                        today: '45%',
                        Style: 'color3',
                        userType: '3'
                    },
                    {
                        title: '建筑垃圾',
                        ProductionToday: '2500',
                        yesterday: '51%',
                        today: '45%',
                        Style: 'color4',
                        userType: '4'
                    },
                    {
                        title: '生活垃圾',
                        ProductionToday: '2500',
                        yesterday: '51%',
                        today: '45%',
                        Style: 'color5',
                        userType: '5'
                    },
                    {
                        title: '固废垃圾',
                        ProductionToday: '2500',
                        yesterday: '51%',
                        today: '45%',
                        Style: 'color6',
                        userType: '6'
                    },
                    {
                        title: '医疗垃圾',
                        ProductionToday: '2500',
                        yesterday: '51%',
                        today: '45%',
                        Style: 'color7',
                        userType: '7'
                    },
                    {
                        title: '园林垃圾',
                        ProductionToday: '2500',
                        yesterday: '51%',
                        today: '45%',
                        Style: 'color8',
                        userType: '8'
                    },
                ],
                listdata: [
                    {value: 335, name: '餐厨垃圾'},
                    {value: 310, name: '大件垃圾'},
                    {value: 234, name: '工业垃圾'},
                    {value: 135, name: '建筑垃圾'},
                    {value: 1548, name: '生活垃圾'},
                    {value: 234, name: '固废垃圾'},
                    {value: 135, name: '医疗垃圾'},
                    {value: 1548, name: '园林垃圾'}
                ],
                dataArr: ['餐厨垃圾', '大件垃圾', '工业垃圾', '建筑垃圾', '生活垃圾', '固废垃圾', '医疗垃圾', '园林垃圾'],
                BarData: [],
                arr: []
            }
        },
        methods: {
            // 柱状图
            eightBar(arrs) {
                this.chart = this.$echarts.init(document.getElementById("barChart"));
                let that = this;
                this.chart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '15%',
                        bottom: '10%',
                        containLabel: true
                    },
                    barWidth: 15,
                    xAxis: {
                        name: '单位：公斤',
                        type: 'value',
                        boundaryGap: [0, 1],
                        axisLine: {
                            show: false
                        }
                    },
                    axisLabel: {
                        color: "#666" //刻度线标签颜色
                    },
                    yAxis: {
                        type: 'category',
                        // that.list
                        data: that.dataArr.reverse(),
                        axisLine: {
                            lineStyle: {
                                color: ['#fff']
                            }
                        }
                    },
                    series: [
                        {
                            name: '垃圾八大类',
                            type: 'bar',
                            data: arrs,
                            // // 表格展示的时间
                            // animationDuration: 3000,
                            // // 第二项出来的时间和第一项隔得时间
                            // animationDelay:100,
                            itemStyle: {
                                //通常情况下：
                                normal: {
                                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                    color: function (params) {
                                        var colorList = ['#ff6f00', '#fdd835', '#3f51b5', '#50cdf6', '#739a51', '#336c89', '#bf4749', '#dd9a31'];
                                        return colorList[params.dataIndex];
                                    },
                                    borderColor: '#fff',
                                },
                                //鼠标悬停时：
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                        }
                    ],
                });
            },
            // 饼状图
            pieChart(listData) {
                this.chart = this.$echarts.init(document.getElementById("pieChart"));
                this.chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b}: {c} ({d}%)"
                    },
                    geo3D: {},
                    legend: {
                        right: '2%',
                        orient: 'right',
                        textStyle: {
                            color: '#abcdef'
                        }
                    },
                    series: [
                        {
                            name: '垃圾分类',
                            type: 'pie',
                            radius: ['30%', '80%'],
                            center: ['35%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center'
                                },
                                emphasis: {
                                    show: true,
                                    textStyle: {
                                        fontSize: '20',
                                        fontWeight: 'bold'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                                    color: function (params) {
                                        var colorList = ['#dd9a31', '#bf4749', '#336c89', '#739a51', '#50cdf6', '#3f51b5', '#fdd835', '#ff6f00'];
                                        return colorList[params.dataIndex];
                                    },
                                    borderColor: '#fff',
                                },
                            },
                            // data:['餐厨垃圾','大件垃圾','工业垃圾','建筑垃圾','生活垃圾','固废垃圾','医疗垃圾','园林垃圾']
                            // 表格展示的时间
                            animationDuration: 3000,
                            // 第二项出来的时间和第一项隔得时间
                            // animationDelay:100,
                            data: listData
                        }
                    ]
                })
            },
            // 路由跳转
            toNext(lyType) {
                console.log(lyType, '垃圾类型');
                // 基本信息表
                this.$http({
                    method: 'get',
                    url: '/xcljfl/trash/findTrashInfo', // 这里的xcljfl 是proxyTable配置中的/xcljfl
                    params: {
                        id: 1000000
                    }
                }).then((src) => {
                    console.log(src.data.data, '数据');
                    let data = src.data.data;
                    sessionStorage.setItem('Transh', JSON.stringify(data));
                    sessionStorage.setItem('lyType', lyType);
                    this.$router.push({
                        path: '/OnTheSite/index',
                        name: '投放点'
                    })
                }).catch((err) => {
                    console.log(err);
                });
            }
        },
        beforeCreate() {
            this.$nextTick(function () {
                this.$http({
                    method: 'get',
                    url: '/xcljfl/trash/getTrashInfo', // 这里的xcljfl 是proxyTable配置中的/xcljfl
                }).then((src) => {
                    // this.$set(this.detailId, index, new Movie(res.id, res.wish_count));
                    console.log(src, '首页');
                    let data = src.data.data;
                    for (let i in this.list) {
                        for (let j in data) {
                            if (i == j - 1) {
                                let obj = data[j];
                                if (obj != null) {
                                    if (obj.total != null) {
                                        this.list[i].ProductionToday = obj.total;
                                        this.BarData[i] = obj.total;
                                        this.listdata[i].value = obj.total
                                    } else {
                                        this.list[i].ProductionToday = "0";
                                        this.BarData[i] = 0;
                                        this.listdata[i].value = 0
                                    }
                                    if (obj.zb != null) {
                                        this.list[i].today = obj.zb;
                                    } else {
                                        this.list[i].today = "0";
                                    }
                                    if (obj.hb != null) {
                                        this.list[i].yesterday = obj.hb;
                                    } else {
                                        this.list[i].yesterday = "0";
                                    }
                                } else {
                                    this.list[i].ProductionToday = "0";
                                    this.list[i].today = "0";
                                    this.list[i].yesterday = "0";
                                }
                            }
                        }
                    }
                    // 执行柱状图
                    this.eightBar(this.BarData.reverse());
                    this.pieChart(this.listdata);
                }).catch((err) => {
                    console.log(err);
                })
            })
        },
    }
</script>

<style scoped lang="scss">
  .home {
    display: flex;

    ul {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      list-style: none;
      width: 774px;
      color: #fff;

      li {
        width: 243px;
        height: 168px;
        border: solid 3px #dd9a31;
        margin: 0 15px 15px 0;
        box-sizing: border-box;
        padding: 10px;
        text-align: center;
        border-radius: 3px;
        font-size: 14px;
        background: #17181a;

        p {
          margin: 0;
          padding: 0;
        }

        .title {
          font-size: 22px;
          line-height: 30px;
          color: #ccc;
        }

        .ProductionToday {
          .price {
            color: red;
            margin-left: 42px;
          }
        }

        .yesterday {
          .arrow {
            display: inline-block;
            border: solid 7px transparent;
            border-bottom: solid 9px red;
            margin-left: 22px;
          }

          .price {
            display: inline;
            color: red;
          }
        }

        .today {
          .arrow {
            display: inline-block;
            border: solid 7px transparent;
            border-top: solid 9px #33ac38;
            margin: 0 6px 0 22px;
            margin-bottom: -5px;
          }

          .price {
            display: inline;
            color: #33ac38;
          }
        }

        div {
          line-height: 30px;
        }

        .seeMore {
          display: block;
          text-align: right;
          line-height: 33px;
        }
      }

      .color1 {
        border-color: #dd9a31;
      }

      .color2 {
        border-color: #3f51b5;
      }

      .color3 {
        border-color: #757574;
      }

      .color4 {
        border-color: #ff6f00;
      }

      .color5 {
        border-color: #f58b8b;
      }

      .color6 {
        border-color: #50cdf6;
      }

      .color7 {
        border-color: #991c3b;
      }

      .color8 {
        border-color: #36a248;
      }
    }

    .home_right {
      flex: 1;
      margin-left: 56px;

      .title {
        font-size: 11px;
        border-left: solid 6px #333;
        text-indent: 5px;
        height: 17px;
        color: #ccc;
        line-height: 17px;
        margin-bottom: 7px;
      }

      #barChart {
        width: 382px;
        height: 263px;
        border: solid 1px #17181a;
      }

      #pieChart {
        width: 382px;
        height: 245px;
        border: solid 1px #000;
      }
    }
  }
</style>
