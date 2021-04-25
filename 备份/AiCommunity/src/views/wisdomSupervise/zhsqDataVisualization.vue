<template>
  <div class="main-bg">
    <!--top start-->
    <div style="color: white;width:100%;text-align: center;" v-if="!flag5">
      <img src="/img/top_bg.png" style="width: 100%;">
      <div style="position:absolute;top:10px;width: 100%;text-align: center">
        <div style="font-size: 1.5rem">{{communityName}} · 轻未来社区</div>
      </div>
    </div>
    <!--top end-->
    <div style="width: 100%;text-align: center" v-if="!flag5">
      <ul class="top-bar__left" style="margin-top: 40px" @mouseenter="move()" @mouseleave="move()">
        <li class="tab" style="position: relative;right: 30px">
          <img src="/img/tab_bg.png">
          <span :class="this.flag == true ? 'active': 'ordinary'" @click="jump()">实时动态</span>
        </li>
        <li class="tab" style="position: relative;right: 110px">
          <img src="/img/tab_bg.png">
          <span :class="this.flag2 == true ? 'active': 'ordinary'" @click="jump2()">实时数据</span>
        </li>
        <li class="tab" style="position: relative;right: 190px">
          <img src="/img/tab_bg.png">
          <span :class="this.flag3 == true ? 'active': 'ordinary'" @click="jump3()">综合分析</span>
        </li>
        <li class="tab" style="position: relative;right: 270px" v-if="AIFlag">
          <img src="/img/tab_bg.png">
          <span :class="this.flag4 == true ? 'active': 'ordinary'" @click="jump4()">安防监控</span>
        </li>
        <li class="tab" style="position: relative;right: 350px" v-if="AIFlag">
          <img src="/img/tab_bg.png">
          <span :class="this.flag5 == true ? 'active': 'ordinary'" @click="jump5()">宣传专栏</span>
        </li>
        <li class="tab" style="position: relative;right: 430px" v-show="seen" v-if="AIFlag">
          <img src="/img/tab_bg.png">
          <span class="ordinary" @click="play()">&nbsp;&nbsp;&nbsp;{{textPlay}}</span>
        </li>
        <li class="tab" style="position: relative;right: 270px" v-show="seen" v-if="!AIFlag">
          <img src="/img/tab_bg.png">
          <span class="ordinary" @click="play()">&nbsp;&nbsp;&nbsp;{{textPlay}}</span>
        </li>

      </ul>
      <!-- <div style="position: relative;bottom: 20px;width: 30%;margin: auto;"> -->
      <!-- <span >{{areaName}} > {{communityName}}</span> -->
      <avue-cascader v-model="optionInfo" :dic="options" :props="defaultProps" @change="handleContentChaChange"
        :placeholder="msg" style="position: relative;bottom: 20px;"></avue-cascader>
      <!-- </div> -->
      <div class="top-bar__right" style="margin-top: 20px">
        <el-tooltip effect="dark" content="首页" placement="bottom">
          <div class="top-bar__item">
            <i class="el-icon-s-home" style="color: white;cursor: pointer;" @click="goToHome"></i>
          </div>
        </el-tooltip>
        <el-tooltip v-if="showFullScren" effect="dark"
          :content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')" placement="bottom">
          <div class="top-bar__item">
            <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'" @click="handleScreen"
              style="color: white;cursor: pointer;"></i>
          </div>
        </el-tooltip>
        <span style="color: #9EBBEA;font-size: 1rem;position: relative;left: 15px">今日实时数据：({{nowDate}})</span>
      </div>
    </div>
    <!-- 第一屏 -->
    <div ref="one" v-show="flag" style="height: 100%;">
      <svg version="1.1" ref="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 5 100 60"
        xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none meet" x="0px" y="0px" width="100%"
        height="100%" overflow="auto" enable-background="new 0 0 0 0" xml:space="preserve">
        <image width="100%" height="100%" x="0" y="0" :href="imgURL" />

        <g style="cursor: pointer;" v-for="(user,i) in imgObj" v-show="user.show">
          <image width="5%" height="6%" :href="user.url" :x="user.x" :y="user.y" />
        </g>
        <g style="cursor: pointer;" v-for="(user,i) in carObj" v-show="user.show">
          <image width="100%" height="100%" :href="user.url" x=0 y=0 />
        </g>
        <g style="cursor: pointer;" v-for="(user,i) in cartoonObj" v-show="user.show">
          <image width="5%" height="6%" :href="user.url" :x="user.x" :y="user.y" />
        </g>
      </svg>
    </div>
    <!-- 第二屏数据 -->
    <div ref="two" v-show="flag2" style="height: 100%;">
      <!-- 进出人员 -->
      <el-row type="flex">
        <el-col :span="8"
          style="background: url(/img/top_bg_1.png) no-repeat center center;background-size: 100% 100%;margin: 0 1% 1% 1%;">
          <!-- <img src="/img/top_bg_1.png" style="width: 100%;display: inline-block;"/> -->
          <!-- <div> -->
          <div style="text-align: center;line-height: 245%;color: #BACCEA;font-size: .9rem;padding-left: 4.5%;">人流量
          </div>
          <div style="color: rgb(192, 232, 255);padding-left: 4.5%;">
            今日进出人员总数：<span style="color:white">{{doorVisualData.personInOutCount}}人次</span>
          </div>
          <div class="clearfix">
            <div style="width: 50%;height:100%;float: left;margin-top: 7%;" ref="jczrs"></div>
            <div style="width: 50%;height:100%;float: left;margin-top: 7%;" ref="jinchuType"></div>
          </div>
          <div class="clearfix">
            <div style="width:50%;color: #C0E8FF;font-size: .8rem;float: left;text-align: center;margin: 1% 0;">业主访客占比
            </div>
            <div style="width:50%;color: #C0E8FF;font-size: .8rem;float: left;text-align: center;margin: 1% 0;">出入方式
            </div>
          </div>
          <!-- </div> -->
        </el-col>
        <!-- 车辆进出 -->
        <el-col :span="8"
          style="background: url(/img/top_bg_1.png) no-repeat center center;background-size: 100% 100%;margin: 0 1% 1% 1%;">
          <div style="text-align: center;line-height: 245%;color: #BACCEA;font-size: .9rem;padding-left: 4.5%;">车流量
          </div>
          <div style="color: rgb(192, 232, 255);padding-left: 4.5%;">
            今日入场总次数：<span style="color:white">{{doorVisualData.carInCount}}次</span>
          </div>
          <div class="clearfix">
            <div style="width: 50%;height:100%;margin-top:7%;float: left;" ref="crcs"></div>
            <div style="width: 50%;height:100%;margin-top:7%;float: left;" ref="stopCar"></div>
          </div>
          <div class="clearfix">
            <div style="width:50%;color: #C0E8FF;font-size: .8rem;float: left;text-align: center;margin: 1% 0;">出入场占比
            </div>
            <div style="width:50%;color: #C0E8FF;font-size: .8rem;float: left;text-align: center;margin: 1% 0;">停车占比
            </div>
          </div>
        </el-col>
        <!-- 电瓶车充电 -->
        <el-col :span="8"
          style="background: url(/img/top_bg_1.png) no-repeat center center;background-size: 100% 100%;margin: 0 1% 1% 1%;">
          <div style="text-align: center;line-height: 245%;color: #BACCEA;font-size: .9rem;padding-left: 4.5%;">电瓶车充电
          </div>
          <el-row type="flex">
            <el-col :span="8"
              style="background: url(/img/cdk.png) no-repeat center center;background-size: 100% 100%;margin:2%;">
              <div style="color: white;font-size: bold;text-align: center;margin: 90% 0 10% 0;">
                {{bikeChargeVisualData.connectorCount}}
              </div>
            </el-col>
            <el-col :span="8"
              style="background: url(/img/jrsf.png) no-repeat center center;background-size: 100% 100%;margin: 2%;">
              <div style="color: white;font-size: bold;text-align: center;margin: 90% 0 10% 0;">
                {{bikeChargeVisualData.fee}}
              </div>
            </el-col>
            <el-col :span="8"
              style="background: url(/img/dl2.png) no-repeat center center;background-size: 100% 100%;margin: 2%;">
              <div style="color: white;font-size: bold;text-align: center;margin: 90% 0 10% 0;">
                {{bikeChargeVisualData.degree}}
              </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="6">
          <div>
            <div style="background: url(/img/left_title.png) no-repeat center center;background-size: 100% 100%;
              color: #B4CCEA;font-size: .9rem;padding: 2%;width: 86%;margin: 0 5%;" class="clearfix">
              <span style="float: left;">商品销售</span>
              <span style="float: right;">在线：{{shjVisualData.itemDeviceCount}}台</span>
            </div>
            <div class="clearfix">
              <div
                style="background: url(/img/bg_jiner.png) no-repeat center center;background-size: 100% 100%;width: 40%;margin: 3% 5%;float: left;">
                <div style="color: #73F8F8;font-size: 2rem;font-weight: bold;text-align: center;padding-top: 10%;">
                  {{shjVisualData.itemCount}}</div>
                <div style="color: #B4CCEA;font-size: 1rem;text-align: center;padding-bottom: 10%;">今日金额（元）</div>
              </div>
              <div
                style="background: url(/img/bg_jiner.png) no-repeat center center;background-size: 100% 100%;width: 40%;margin: 3% 5%;float: left;">
                <div style="color: #73F8F8;font-size: 2rem;font-weight: bold;text-align: center;padding-top: 10%;">
                  {{shjVisualData.itemCount}}</div>
                <div style="color: #B4CCEA;font-size: 1rem;text-align: center;padding-bottom: 10%;">销售数量（件）</div>
              </div>
            </div>
          </div>
          <div>
            <div style="background: url(/img/left_title.png) no-repeat center center;background-size: 100% 100%;
              color: #B4CCEA;font-size: .9rem;padding: 2%;width: 86%;margin: 0 5%;" class="clearfix">
              <span style="float: left;">药品销售</span>
              <span style="float: right;">在线：{{shjVisualData.medDeviceCount}}台</span>
            </div>
            <div class="clearfix">
              <div
                style="background: url(/img/bg_jiner.png) no-repeat center center;background-size: 100% 100%;width: 40%;margin: 3% 5%;float: left;">
                <div style="color: #73F8F8;font-size: 2rem;font-weight: bold;text-align: center;padding-top: 10%;">
                  {{shjVisualData.medFee}}</div>
                <div style="color: #B4CCEA;font-size: 1rem;text-align: center;padding-bottom: 10%;">今日金额（元）</div>
              </div>
              <div
                style="background: url(/img/bg_jiner.png) no-repeat center center;background-size: 100% 100%;width: 40%;margin: 3% 5%;float: left;">
                <div style="color: #73F8F8;font-size: 2rem;font-weight: bold;text-align: center;padding-top: 10%;">
                  {{shjVisualData.medCount}}</div>
                <div style="color: #B4CCEA;font-size: 1rem;text-align: center;padding-bottom: 10%;">销售数量（件）</div>
              </div>
            </div>
          </div>
          <div>
            <div style="background: url(/img/left_title.png) no-repeat center center;background-size: 100% 100%;
              color: #B4CCEA;font-size: .9rem;padding: 2%;width: 86%;margin: 0 5%;" class="clearfix">
              <span style="float: left;">机器人互动</span>
              <span style="float: right;">在线：{{robotVisualData.deviceCount}}台</span>
            </div>
            <div class="clearfix">
              <div
                style="background: url(/img/bg_jiner.png) no-repeat center center;background-size: 100% 100%;width: 40%;margin: 3% 5%;float: left;">
                <div style="color: #73F8F8;font-size: 2rem;font-weight: bold;text-align: center;padding-top: 10%;">
                  {{robotVisualData.voiceCount}}</div>
                <div style="color: #B4CCEA;font-size: 1rem;text-align: center;padding-bottom: 10%;">互动次数（次）</div>
              </div>
              <div
                style="background: url(/img/bg_jiner.png) no-repeat center center;background-size: 100% 100%;width: 40%;margin: 3% 5%;float: left;">
                <div style="color: #73F8F8;font-size: 2rem;font-weight: bold;text-align: center;padding-top: 10%;">
                  {{robotVisualData.businessCount}}</div>
                <div style="color: #B4CCEA;font-size: 1rem;text-align: center;padding-bottom: 10%;">服务次数（次）</div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <el-row type="flex">
            <el-col
              style="background: url(/img/chart_bg.png) no-repeat center center;background-size: 100% 100%;margin: 0 1% 1% 1%;">
              <div style="color: white;font-size: .9rem;line-height: 280%;padding-left: 4.5%;">垃圾分类</div>
              <!-- <div style="color: rgb(192, 232, 255);padding-left: 4.5%;">
                    投放次数：<span style="color:white">{{doorVisualData.personInOutCount}}次</span>
                  </div> -->
              <div class="clearfix">
                <div
                  style="width: 30%;float: left;background: url(/img/bg.png) no-repeat center center;background-size: 70% 70%;">
                  <div style="color: #73F8F8;font-size: 2rem;font-weight: bold;text-align: center;margin: 10% 0 45%;">
                    {{refuseVisualData.today.totalWeight}}</div>
                  <!-- <div style="color: #73F8F8;text-align: center;margin-bottom: 25%;">kg</div> -->
                </div>
                <div style="width: 40%;float: left;height: 120%;" ref="ljfl"></div>
                <div
                  style="width: 30%;float: left;background: url(/img/bg.png) no-repeat center center;background-size: 70% 70%;">
                  <div style="color: #73F8F8;font-size: 2rem;font-weight: bold;text-align: center;margin: 10% 0 45%;">
                    {{refuseVisualData.today.totalTimes}}</div>
                  <!-- <div style="color: #73F8F8;text-align: center;margin-bottom: 25%;">&nbsp</div> -->
                </div>
              </div>
              <div class="clearfix">
                <div style="width: 26%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 2% 2%;">
                  垃圾总量(千克)</div>
                <div
                  style="width: 16%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 0 2% 4%;"
                  v-if="AIFlag">(千克)</div>
                <div
                  style="width: 16%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 4% 2% 0;"
                  v-if="AIFlag">(千克)</div>
                <div style="width: 8%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 0 2% 4%;"
                  v-if="!AIFlag">(千克)</div>
                <div style="width: 8%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin-left: 1%;"
                  v-if="!AIFlag">(千克)</div>
                <div style="width: 8%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin-left: 1%;"
                  v-if="!AIFlag">(千克)</div>
                <div
                  style="width: 8%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 1% 2% 1%;"
                  v-if="!AIFlag">(千克)</div>
                <!-- <div style="width: 40%;float: left;height: 1px;"></div> -->
                <div style="width: 26%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 2% 2%;">
                  投放次数(次)</div>
              </div>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col
              style="background: url(/img/chart_bg.png) no-repeat center center;background-size: 100% 100%;margin: 0 1% 1% 1%;">
              <div style="color: white;font-size: .9rem;line-height: 280%;padding-left: 4.5%;">健康小站</div>
              <div class="clearfix">
                <div
                  style="width: 30%;float: left;background: url(/img/bg.png) no-repeat center center;background-size: 70% 70%;">
                  <div style="color: #73F8F8;font-size: 2rem;font-weight: bold;text-align: center;margin: 10% 0 53%;">
                    {{healthyVisualData.measuredCount}}</div>
                  <!-- <div style="color: #73F8F8;text-align: center;margin-bottom: 25%;">人</div> -->
                </div>
                <div style="width: 35%;float: left;height: 120%;" ref="jkxz"></div>
                <div style="width: 35%;float: left;height: 120%;" ref="ages"></div>
              </div>
              <div class="clearfix">
                <div style="width: 30%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 0% 2%;">
                  今日测量(人)</div>
                <div style="width: 35%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 0% 2%;">
                  健康数据分析</div>
                <div style="width: 35%;float: left;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 0% 2%;">
                  今日测量年龄分布</div>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row type="flex">
            <el-col
              style="background: url(/img/top_bg_1.png) no-repeat center center;background-size: 100% 100%;margin: 0 3% 1%;">
              <div style="text-align: center;line-height: 245%;color: #BACCEA;font-size: .9rem;padding-left: 4.5%;">
                电动汽车充电</div>
              <el-row type="flex">
                <el-col :span="8"
                  style="background: url(/img/cdz.png) no-repeat center center;background-size: 100% 100%;margin:2%;">
                  <div style="color: white;font-size: bold;text-align: center;margin: 90% 0 10% 0;">
                    {{carChargeVisualData.connectorCount}}
                  </div>
                </el-col>
                <el-col :span="8"
                  style="background: url(/img/jrsf.png) no-repeat center center;background-size: 100% 100%;margin: 2%;">
                  <div style="color: white;font-size: bold;text-align: center;margin: 90% 0 10% 0;">
                    {{carChargeVisualData.fee}}
                  </div>
                </el-col>
                <el-col :span="8"
                  style="background: url(/img/dl2.png) no-repeat center center;background-size: 100% 100%;margin: 2%;">
                  <div style="color: white;font-size: bold;text-align: center;margin: 90% 0 10% 0;">
                    {{carChargeVisualData.degree}}
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col
              style="background: url(/img/top_bg_1.png) no-repeat center center;background-size: 100% 100%;margin: 0 3% 1%;">
              <div style="text-align: center;line-height: 245%;color: #BACCEA;font-size: .9rem;padding-left: 4.5%;">设备状态
              </div>
              <el-row>
                <div ref="sbzxl" style="width: 50%;height: 150%;float: left;margin-left: 10%;"></div>
                <div style="width: 60;margin: 5% 0;color: #C0E8FF;font-size: .8rem;padding-left: 60%;">总设备数(台)：<span
                    style="color:#b7feff;font-weight: bold;margin-left: 2%;display: inline-block;width: 10%;text-align: right;">{{deviceTotal}}</span>
                </div>
                <div style="width: 60;margin: 5% 0;color: #C0E8FF;font-size: .8rem;padding-left: 60%;">在线设备(台)：<span
                    style="color:#b7feff;font-weight: bold;margin-left: 2%;display: inline-block;width: 10%;text-align: right;">{{deviceOnline}}</span>
                </div>
                <div style="width: 60;margin: 5% 0;color: #C0E8FF;font-size: .8rem;padding-left: 60%;">离线设备(台)：<span
                    style="color:#b7feff;font-weight: bold;margin-left: 2%;display: inline-block;width: 10%;text-align: right;">{{deviceLeave}}</span>
                </div>
              </el-row>
              <el-row>
                <div style="width: 100%;text-align: center;color: #C0E8FF;font-size: .8rem;margin: 0 0% 2%;">设备在线率</div>
              </el-row>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>




    <!--第三屏-->
    <div ref="three" v-show="flag4" style="height: 100%;" v-if="AIFlag">

<!--      <el-row type="flex">-->
<!--        <el-col :span="24" style="margin-right:1%;text-align: center;">-->
<!--          <div style="width: 1000px;height: 600px;margin: 0 auto;">-->
<!--            <div>-->
<!--              <iframe src="/iframe.html" frameborder="0" v-on:load="iframeLoaded"></iframe>-->
<!--              <iframe src="/iframe.html" frameborder="0" v-on:load="iframeLoaded"></iframe>-->
<!--            </div>-->
<!--            <div>-->
<!--              <iframe src="/iframe.html" frameborder="0" v-on:load="iframeLoaded"></iframe>-->
<!--              <iframe src="/iframe.html" frameborder="0" v-on:load="iframeLoaded"></iframe>-->
<!--            </div>-->
<!--          </div>-->
<!--        </el-col>-->

<!--      </el-row>-->

    </div>

    <!--第四屏-->
    <div ref="four" v-show="flag3" style="height: 100%;">
      <!-- <el-row>
          <div style="font-size: 1rem;color: #B4CCEA;padding: 2%;">
            综合分析
          </div>
        </el-row> -->
      <el-row type="flex" style="margin-top: 3%;">
        <el-col :span="8"
         v-bind:class ='main_bg'>
          <div style="color: white;font-size: .85rem;line-height: 350%;padding-left: 4.5%;">
             <span @click="personInOrOut('day')" v-bind:style={position:sxData,bottom:personOut}>最近7天人员流动(人次)</span>
            <span v-bind:class="monthLeft" @click="personInOrOut('month')">最近6个月人员流动(人次)</span>
          </div>
          <div ref="ryld" style="width: 100%;height: 400%;"></div>
        </el-col>
        <el-col :span="8"
                v-bind:class ='car_main_bg'>
          <div style="color: white;font-size: .9rem;line-height: 350%;padding-left: 4.5%;">
            <span @click="carInOrOut('day')" v-bind:style={position:sxData,bottom:carDayBotoom}>最近7天车流量(车次)</span>
            <span v-bind:class="carMonthClass" @click="carInOrOut('month')">最近6个月车流量(人次)</span>
          </div>
          <div ref="carLl" style="width: 100%;height: 80%;"></div>
        </el-col>
        <el-col :span="8"
              v-bind:class="refuse_visual_bg">
          <div style="color: white;font-size: .8rem;line-height: 350%;padding-left: 4.5%;">
            <span @click="getRefuseVisual('day')" v-bind:style={position:sxData,bottom:refuseDayBotoom}>最近7天垃圾投放量(千克)</span>
            <span style="position: relative;bottom: 5px;left: 24.3%;" @click="getRefuseVisual('month')">最近6个月垃圾投放量(千克)</span>
          </div>
          <div ref="ljtfl" style="width: 100%;height: 80%;"></div>
        </el-col>
      </el-row>
      <el-row type="flex">
        <el-col :span="8"
                v-bind:class="charge_main_bg">
          <div style="color: white;font-size: .8rem;line-height: 350%;padding-left: 4.5%;">
            <span @click="getCharge('day')" v-bind:style={position:sxData,bottom:chargeDayBotoom}>最近7天充电次数(次)</span>
            <span v-bind:class="chargeMonthClass" @click="getCharge('month')">最近6个月充电次数(次)</span>
          </div>
          <div ref="cdcs" style="width: 100%;height: 400%;"></div>
        </el-col>
        <el-col :span="8"
                v-bind:class="shj_main_bg">
          <div style="color: white;font-size: .9rem;line-height: 350%;padding-left: 4.5%;">
            <span @click="getShj('day')" v-bind:style={position:sxData,bottom:shjDayBotoom}>
             最近7天商品销售(元)
          </span>
            <span v-bind:class="shjMonthClass" @click="getShj('month')">
             最近6个月商品销售(元)
          </span>
          </div>
          <div ref="spxs" style="width: 100%;height: 80%;"></div>
        </el-col>
        <el-col :span="8"
                v-bind:class="health_main_bg">
          <div style="color: white;font-size: .9rem;line-height: 350%;padding-left: 4.5%;">
            <span @click="getHealth('day')" v-bind:style={position:sxData,bottom:healDayBotoom}>
              最近7天健康小站(人次)
            </span>
            <span  v-bind:class="healMonthClass" @click="getHealth('month')">
              最近6个月健康小站(人次)
            </span>
          </div>
          <div ref="ypxs" style="width: 100%;height: 80%;"></div>
        </el-col>
      </el-row>
    </div>


    <!-- 第五屏 -->
    <div ref="five" v-show="flag5" style="height: 100%;">
      <!-- <img src="../../../public/img/XC1.jpg" width="100%" height="100%"> -->
      <div class="lunbo">
        <div class="my_ul">
          <li class="my_li1"></li>
          <li class="my_li2"></li>
          <li class="my_li3"></li>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
  import { fullscreenToggel, listenfullscreen } from "../../util/util";
  import { mapGetters, mapState } from "vuex";
  import { getBigScreenData } from "../../api/house";
  import { getUserMessage } from "../../api/house";
  import SockJS from 'sockjs-client';
  import Stomp from 'stompjs';
  import { getToken } from "../../util/auth";
  import coordinatesData from "../../config/coordinatesData";
   // import screenfull from 'screenfull';
  import demoIframe from './demo-iframe'

  const echarts = require('echarts');
  export default {
    // inject: ['reload'],
    name: "zhsqDataVisualization",
    components: {
      demoIframe
    },
    data() {
      return {
          healMonthClass:'health_day_month',
          health_main_bg:'chart_main_bg',
          healDayBotoom:'0px',
          shj_main_bg:'chart_main_bg',
          shjMonthClass:'shj_day_left',
          shjDayBotoom:'0px',
          charge_main_bg:'chart_main_bg',
          chargeMonthClass:'charge_day_left',
          chargeDayBotoom:'0px',
          main_bg:'chart_main_bg',
          car_main_bg:'chart_main_bg',
          refuse_visual_bg:'chart_main_bg',
          refuseDayBotoom:'0px',
          carDayBotoom:'0px',
          carMonthClass:'car_day_left',
          stompClient: '',
          monthLeft :'person_day_left',
          personOut:'0px',
          sxData:'relative',
        timer: '',
        timer2: '',
        msg: '',
        imgURL: coordinatesData[0].map,
        iLoadedCount: 0,
        textPlay: '暂停',
        seen: false,
        AIFlag: true,
        flag: true, // 标志位
        flag2: true,
        flag3: true,
        flag4: true,
        flag5: false,
        imgObj: coordinatesData[0].dev,
        carObj: coordinatesData[0].car,
        cartoonObj: coordinatesData[0].cartoon,
        isFullScren: false,
        dataArr: [],
        value: 1,    // 监控
        g_iWndIndex: 0,//当前选中的窗口
        g_bPTZAuto: false,
        pumpRoomName: "",
        cameraArray: [{ "ipAddr": "192.168.10.3" }, { "ipAddr": "192.168.10.4" }, { "ipAddr": "192.168.10.8" }, { "ipAddr": "192.168.10.2" }],
        webVideo: {},
        iWidth: '70%',
        iHeight: '100%',
        iProtocol: 1,
        szIP: "192.168.10.3",
        szIP2: "192.168.10.4",
        szIP3: "192.168.10.8",
        szIP4: "192.168.10.2",
        szPort: "80",
        szUsername: "admin",
        szPassword: "a1234567",
        iStreamType: 1,
        bZeroChannel: false,
        maskData: {
          maskShow: false,
          title: '提示',
          content: '失败',
          cancel: false
        },
        index: '',
        defaultProps: { label: 'orgName', value: 'orgId', checkStrictly: true },
        optionInfo: [{ children: [], label: 'orgName', value: 'orgId' }],
        orgId: '',
        options: [],
        // cityName: '萍乡市',
        areaName: '',
        // streetName: '东大街',
        communityName: '',
        cityMap: [],
        deviceTotal: '',
        deviceOnline: '',
        deviceLeave: '',
        nowDate: "",
        jczrsList: [{ "name": '访客', "value": 20 }, { "name": '业主', "value": 80 }],
        carList: [{ "name": '访客', "value": 20 }, { "name": '业主', "value": 80 }],
        crcsList: [{ "name": '入场', "value": 20 }, { "name": '出场', "value": 80 }],
        jcfsLabelData: ["其他", "刷卡", "刷脸"],
        jcfsValueData: ["10", "100", "20"],
        ljflLabelData: ["易腐", "其他"],
        ljflLabelData2: ["易腐", "其他", "可回收", "有害"],
        ljflTableData: ['总量', '易腐垃圾', '其他垃圾'],
        ljflTableData2: ['总量', '易腐垃圾', '其他垃圾', '可回收物', '有害垃圾'],
        ljflValveData: [],
        sbzxlValveData: [{ 'name': "", 'value': "" }],
        jkxzData: [{ "name": '低血压', "value": 0 }, { "name": '高血压', "value": 0 }, { "name": '标准', "value": 0 }],
        jktzData: [{ "name": '瘦', "value": 0 }, { "name": '标准', "value": 0 }, { "name": '轻胖', "value": 0 }, { "name": '重胖', "value": 0 }],
        agesData: [],
        shjVisualData: {
          'itemDeviceCount': 0,
          'medDeviceCount': 0,
          'medFees': [],
          'itemFees': [],
          "medCounts": [],
          "itemCounts": [],'halfYearItemFees':[],' halfYearMedFees':[]
        },
        lastDays: [],
        bikeChargeVisualData: { 'connectorCount': 0, 'fee': 0, 'degree': 0, 'chargeCounts': [] ,'halfYearChargeCounts':[]},
        carChargeVisualData: { 'connectorCount': 0, 'fee': 0, 'degree': 0, 'chargeCounts': [] ,'halfYearChargeCounts':[]},
        doorVisualData: {
          'personInOutCount': 0,
          'holderPersonInOutCount': 0,
          'visitorPersonInOutCount': 0,
          'facePersonInOutCount': 0,
          "cardPersonInOutCount": 0,
          'otherPersonInOutCount': 0,
          'personInCounts': [],
          'personOutCounts': [],
          'monthPersonInCounts':[],
          'monthPersonOutCounts':[],
          'carParkCount': 0,
          'idleCarCount': 0,
          'holderCarCount': 0,
          'visitorCarCount': 0,
          'carInCounts': [0, 0, 0, 0, 0, 0, 0],
          'carOutCounts': [0, 0, 0, 0, 0, 0, 0],
          'monthCarInCounts':[0,0,0,0,0,0],
           'monthCarOutCounts':[0,0,0,0,0,0]
        },
        healthyVisualData: { 'measuredCount': 0, 'pressureMap': {}, 'fatMap': {} ,' halfYearMeasuredCounts':[]},
        robotVisualData: { 'deviceCount': 0, 'voiceCount': 0, 'businessCount': 0 },
        refuseVisualData: {
          'houseCount': 0, 'mallCount': 0, 'device2Count': 0, 'device4Count': 0, 'device': [],
          'today': {
            'totalTimes': 0,
            'totalTimesAm': 0,
            'totalTimesPm': 0,
            'totalCorrectTimes': 0,
            'totalCorrectTimesRate': '',
            'perishableTimes': 0,
            'RecyclableTimes': 0,
            'HarmfulTimes': 0,
            'otherTimes': 0,
            'perishableCorrectTimes': 0,
            'RecyclableCorrectTimes': 0,
            'harmfulCorrectTimes': 0,
            'perishableCorrectTimesRate': 0,
            'recyclableCorrectTimesRate': 0,
            'harmfulCorrectTimesRate': 0,
            'otherCorrectTimes': 0,
            'otherCorrectTimesRate': 0,
            'totalWeight': 0,
            'totalWeightAm': 0,
            'totalWeightPm': 0,
            'perishableWeight': 0,
            'recyclableWeight': 0,
            'harmfulWeight': 0,
            'otherWeight': 0,
            'faceAuthTimes': 0,
            'cardAuthTimes': 0,
            'noAuthTimes': 0,
            'totalAuthTimes': 0
          }, 'lastMonth': [], 'lastMonth': []
        },
        totalWeightMonDataList: [],//月总重量
        perishableWeightMonDataList: [],//易腐垃圾重量
        recyclableWeightMonDataList: [],//可回收物重量
        harmfulWeightMonDataList: [],//有害垃圾重量
        otherWeightMonDataList: [],//其他重量,
          totalWeightDataList: [0, 0, 0, 0, 0, 0, 0],//总重量
          perishableWeightDataList: [0, 0, 0, 0, 0, 0, 0],//易腐垃圾重量
          recyclableWeightDataList: [0, 0, 0, 0, 0, 0, 0],//可回收物重量
          harmfulWeightDataList: [0, 0, 0, 0, 0, 0, 0],//有害垃圾重量
          otherWeightDataList: [0, 0, 0, 0, 0, 0, 0],//其他重量
        TimerMethod: null,
        TimerGetData: null,
          roleType: '0',
          reqType: '2',
          reqId:''
      }
    },
    components: {

    },
    computed: {
      ...mapState({
        showFullScren: state => state.common.showFullScren,

      }),
      ...mapGetters([
        "userInfo"
      ])
    },
    watch: {

    },
    created() {
      this.$store.commit("SET_PAGE_FULL_SCREEN", true);
      this.getDate();
      this.getUserMsg();
      this.handleScreen();
      this.init();
    },
    beforeDestroy() {
      // console.log("当前Vue 结束！");
      this.$store.commit("SET_PAGE_FULL_SCREEN", false);
      this.$once('hook:beforeDestroy', () => {
        if (this.TimerMethod != null) {
          clearInterval(this.TimerMethod);
        }
        if (this.TimerGetData != null) {
          clearInterval(this.TimerGetData);
        }
      });
      this.disconnect();
      clearInterval(this.timer);
      clearInterval(this.timer2);
    },
    destroyed() {
      for (var i = 0; i < this.cameraArray.length; i++) {
        WebVideoCtrl.I_Stop({ iWndIndex: i });
      }
      var iRet = WebVideoCtrl.I_Logout(this.szIP);
      if (iRet !== 0) {
        console.log("WebVideoCtrl I_Logout failed");
      } else {
        console.log("WebVideoCtrl I_Logout success");
      }
    },
    beforeMount() {

    },
    mounted() {
        console.log("页面渲染完成！");
      listenfullscreen(this.setScreen);
      this.lastDays = this.getLastDate();
      console.log(this.lastDays)
      this.$store.commit("SET_PAGE_FULL_SCREEN", true);
      this.$nextTick(() => {
        this.timer2 = setInterval(() => {
          this.getDate();
          this.getBigScreen();
          // 监听窗口大小改变，screenfull.isFullscreen的值为是否全屏，若是则true，反之false
          // window.onresize = () => {
          //   this.isFullScren = screenfull.isFullscreen
          // }
        }, 30 * 1000);
        let index = this.index;
        index = 0;
        // this.TimerGetData = setInterval(()=> { this.getBigScreen()},30*1000);
        this.TimerMethod = setInterval(() => {
          console.log("index==" + index)
          // console.log(this.$refs.one)
          if (index == 0) {
            index++;
            // document.getElementById("one").style.display='block';
            // document.getElementById("two").style.display='none';
            // document.getElementById("three").style.display='none';
            this.flag = true;
            this.flag2 = false;
            this.flag3 = false;
            this.flag4 = false;
            this.flag5 = false;
          } else if (index == 1) {
            index++;
            // document.getElementById("one").style.display='none';
            // document.getElementById("two").style.display='block';
            // document.getElementById("three").style.display='none';
            this.flag = false;
            this.flag2 = true;
            this.flag3 = false
            this.flag4 = false
            this.flag5 = false
          } else if (index == 2) {
            if (this.AIFlag == false) {
              index = 0;
            } else {
              index++;
            }
            // document.getElementById("one").style.display='none';
            // document.getElementById("two").style.display='none';
            // document.getElementById("three").style.display='block';
            this.flag = false;
            this.flag2 = false;
            this.flag3 = true;
            this.flag4 = false;
            this.flag5 = false;
          } else if (index == 3) {
            index++;
            this.flag = false;
            this.flag2 = false;
            this.flag3 = false;
            this.flag4 = true;
            this.flag5 = false;
          } else if (index == 4) {
            index = 0;
            this.flag = false;
            this.flag2 = false;
            this.flag3 = false;
            this.flag4 = false;
            this.flag5 = true;
          }
        }, 10 * 1000);
        // this.timer2 = setInterval(() => {
        //   console.log("刷一次")
        //   this.reload();
        //   this.handleScreen();
        // }, 30*1000);
        if (this.AIFlag == true) {
          this.videoInitPlugin();
        }
      })
      this.initWebSocket();

    },
    methods: {
      initWebSocket() {
        this.connection();
        let that = this;
        //   断开重连机制,尝试发送消息,捕获异常发生时重连
        this.timer = setInterval(() => {
          try {
            that.stompClient.send("/app/heart");
          } catch (err) {
            console.log("断线了: " + err);
            that.connection();
          }
        }, 5000);
      },
      connection() {
        let that = this;
        // 建立连接对象
        if (typeof (WebSocket) == "undefined") {
          console.log("遗憾：您的浏览器不支持WebSocket");
          return;
        }
        let url = "https://sq.wewins.cn/rest/report/webSocket?token=zhsq&accessToken=" + getToken();
        let socket = new SockJS(url);
        // 获取STOMP子协议的客户端对象
        this.stompClient = Stomp.over(socket);
        // 定义客户端的认证信息,按需求配置
        let headers = {
          Authorization: ''
        }
        // 向服务器发起websocket连接
        this.stompClient.connect({}, () => {
          console.log("连接成功；开始订阅！")
          // this.stompClient.subscribe('/topic/getResponse', (msg) => { // 订阅服务端提供的某个topic
          //     console.log('订阅成功')
          //     console.log(msg);  // msg.body存放的是服务端发送给我们的信息
          // },headers);
          this.stompClient.subscribe('/topic/zhsq', function (response) {
            console.log("接收到的消息");
            console.log(response);
            let resp = JSON.parse(response.body);
            // let resp = [{"type":"asd","message":{"deviceNo":"47","deviceType":"asd","inOutType":null,"optNum":100}},
            // {"type":"CAR_DOOR","message":{"deviceNo":"47","deviceType":"asd","inOutType":null,"optNum":100}}];
            // debugger
             console.log(that.carObj)
            if (resp.message != null) {
              for (var j = 0; j < that.imgObj.length; j++) {
                if (resp.type == "DZC" || resp.type == "MJP") {
                  if (resp.message.deviceNo == that.imgObj[j].deviceNo) {
                    console.log("有车辆进出")
                    that.carObj[that.imgObj[j].No].show = true;
                    setTimeout(() => {
                      for (var i = 0; i < that.carObj.length; i++) {
                        that.carObj[i].show = false;
                      }
                    }, 4000);
                  } else {
                    console.log("++无车辆进出")
                  }
                } else {
                  if (resp.message.deviceNo == that.imgObj[j].deviceNo) {
                    console.log("有其他数据")
                    that.cartoonObj[that.imgObj[j].No].show = true;
                    setTimeout(() => {
                      // debugger
                      for (var i = 0; i < that.imgObj.length; i++) {
                        that.cartoonObj[that.imgObj[i].No].show = false;
                      }
                    }, 4000);
                  }
                }
              }
            } else {
              console.log("无其他数据")
            }

          });
        }, (err) => {
          // 连接发生错误时的处理函数
          console.log('失败')
          console.log(err);
        });
      },    //连接 后台
      disconnect() {
        if (this.stompClient) {
          this.stompClient.disconnect();
        }
      },  // 断开连接
      jump() {
        // this.initWebSocket();
        this.flag = true;
        this.flag2 = false;
        this.flag3 = false;
        this.flag4 = false;
        this.flag5 = false;
        this.index = 0;
      },
      jump2() {
        this.flag = false;
        this.flag2 = true;
        this.flag3 = false;
        this.flag4 = false;
        this.flag5 = false;
        this.index = 1;
      },
      jump3() {
        this.flag = false;
        this.flag2 = false;
        this.flag3 = true;
        this.flag4 = false;
        this.flag5 = false;
        this.index = 2;
      },
      jump4() {
        this.flag = false;
        this.flag2 = false;
        this.flag3 = false;
        this.flag4 = true;
        this.flag5 = false;
        this.index = 3;
      },
      jump5() {
        this.flag = false;
        this.flag2 = false;
        this.flag3 = false;
        this.flag4 = false;
        this.flag5 = true;
        this.index = 4;
      },
      move() {
        this.seen = !this.seen;
      },
      play() {
        clearInterval(this.TimerMethod);
        if (this.TimerMethod != null) {
          this.textPlay = '继续';
          console.log("---" + this.TimerMethod)
          this.TimerMethod = null;
        } else {
          this.textPlay = '暂停';
          let index = this.index;
          // this.TimerGetData = setInterval(()=> { this.getBigScreen()},30*1000);
          this.TimerMethod = setInterval(() => {
            console.log("index==" + index)
            console.log(this.$refs.one)
            if (index == 0) {
              index++;
              // document.getElementById("one").style.display='block';
              // document.getElementById("two").style.display='none';
              // document.getElementById("three").style.display='none';
              this.flag = true;
              this.flag2 = false;
              this.flag3 = false;
              this.flag4 = false;
              this.flag5 = false;
            } else if (index == 1) {
              index++;
              // document.getElementById("one").style.display='none';
              // document.getElementById("two").style.display='block';
              // document.getElementById("three").style.display='none';
              this.flag = false;
              this.flag2 = true;
              this.flag3 = false
              this.flag4 = false
              this.flag5 = false
            } else if (index == 2) {
              if (this.AIFlag == false) {
                index = 0;
              } else {
                index++;
              }
              // document.getElementById("one").style.display='none';
              // document.getElementById("two").style.display='none';
              // document.getElementById("three").style.display='block';
              this.flag = false;
              this.flag2 = false;
              this.flag3 = true;
              this.flag4 = false;
              this.flag5 = false;
            } else if (index == 3) {
              index++;
              this.flag = false;
              this.flag2 = false;
              this.flag3 = false;
              this.flag4 = true;
              this.flag5 = false;
            } else if (index == 4) {
              index = 0;
              this.flag = false;
              this.flag2 = false;
              this.flag3 = false;
              this.flag4 = false;
              this.flag5 = true;
            }
          }, 10 * 1000);
        }
      },
      getLastDate() {
        let dateList = new Array();
        dateList.push(this.getDay(-1));
        dateList.push(this.getDay(-2));
        dateList.push(this.getDay(-3));
        dateList.push(this.getDay(-4));
        dateList.push(this.getDay(-5));
        dateList.push(this.getDay(-6));
        dateList.push(this.getDay(-7));
        return dateList;
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
      },
      getMonths() {
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
      },
      getDay(day) {
        // debugger
        var today = new Date();
        var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
        today.setTime(targetday_milliseconds); //注意，这行是关键代码
        var tYear = today.getFullYear();
        var tMonth = today.getMonth();
        var tDate = today.getDate();
        tMonth = this.doHandleMonth(tMonth + 1);
        tDate = this.doHandleMonth(tDate);
        // return tMonth + tDate;
        return tMonth.toString() + tDate.toString();
      },
      doHandleMonth(month) {
        var m = month;
        if (month.toString().length == 1) {
          m = "0" + month;
        }
        return m;
      },
      goToHome() {
        this.$router.push("/wel");

        this.$store.commit("SET_PAGE_FULL_SCREEN", false);
        this.handleScreen();
      },
      setScreen() {
        this.$store.commit("SET_FULLSCREN");
      },
      handleScreen() {
        fullscreenToggel();
        this.isFullScren = !this.isFullScren;
        console.log("isFullScren==" + this.isFullScren)
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

        var now = year + '-' + this.conver(month) + "-" + this.conver(date) + " " + this.conver(h) + ':' + this.conver(m);
        this.nowDate = now;
      },
      conver(s) {
        return s < 10 ? '0' + s : s;
      },
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
        // console.log('_______'+userOrgDesc,this.roleType)
        let that = this;
        getUserMessage(userOrg, userOrgDesc, this.roleType, "0").then(resp => {
          // console.log('接到-数据')
          // console.log(resp)
          // this.areaName = resp.data.data[0].orgName;
          // this.communityName = resp.data.data[0].children[0].orgName;
          console.log(that.filterMall(resp.data.data));
          that.options = resp.data.data;
          if (that.options[0].children) {
             this.getFirstOrgName(that.options[0].children);
          } else {
            this.dataArr.push({ name: that.options[0].orgName ,orgId: that.options[0].orgId})
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
          that.optionInfo.value = resp.data.data[0].orgId;
          that.orgId = that.dataArr[that.dataArr.length - 1].orgId
          if (that.orgId == '1288001885620092929') {
            this.AIFlag = false;
            this.imgURL = coordinatesData[1].map;
            this.cartoonObj = coordinatesData[1].cartoon;
            this.imgObj = coordinatesData[1].dev;
          }
          that.getOrgName(that.options);
          if (that.roleType === 4) {
              that.reqType = 2;
          }
          // that.communityName=that.cityMap[that.optionInfo];
          // for(var keyname in that.cityMap){
          //   that.communityName = that.cityMap[keyname];
          // }
           that.getBigScreen();
        })
      },
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
                //过滤东门新村
                if (v.orgId == '360302001') {
                  v.children.splice(1, 1)
                }
              }
            })
          }
        })
        return data
      },
      getOrgName(data) {
        data.forEach(v => {
          this.cityMap[v.orgId] = v.orgName;
          if (v.children != null) {
            this.getOrgName(v.children);
          }
        })
      },
      getFirstOrgName(data) {
          console.log(data);

        // data.forEach(v => {
        this.dataArr.push({ name: data[0].orgName, orgId: data[0].orgId })
        if (data[0].children != null && data[0].children.length > 0) {
          this.getFirstOrgName(data[0].children);
        }
        // })
      },
      handleContentChaChange(value) {
        console.log(this.options)
        console.log(value);

        this.changeCommunity(this.options, value)
        if (typeof value[value.length - 1] == "string") {
          this.orgId = value[value.length - 1];
        }
          this.reqId = this.orgId;
          console.log("this.reqId=="+this.reqId);
          if (this.roleType === 4) {//网点管理员
              if (value.length == 2) {
                  this.reqType = "3"
              } else if (value.length == 1) {
                  this.reqType = "2"
              }
          } else {
              if (this.orgId.length <= 9) {
                  this.reqType = 1;
              } else {
                  this.reqType = 2;
              }
          }
        coordinatesData.forEach(v => {
          if (this.orgId == v.orgId) {
            this.AIFlag = v.monitoringFlag;
            this.imgURL = v.map;
            this.cartoonObj = v.cartoon
            this.imgObj = v.dev
          }
        })
        this.getDate();
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
      getBigScreen() {
          console.log("this.orgId =="+this.orgId+";this.reqType=="+this.reqType)
        if (this.orgId == "" || this.orgId == null) {
          return
        }
        console.log("roleType=="+this.roleType+";this.orgId")
          if (this.roleType === 4) {//网点管理员
              if (this.orgId.length == 2) {
                  this.reqType = "3"
              } else if (this.orgId.length == 1) {
                  this.reqType = "2"
              }
          } else {
              if (this.orgId.length <= 9) {
                  this.reqType = 1;
              } else {
                  this.reqType = 2;
              }
          }
          console.log("this.orgId2 =="+this.orgId+";this.reqType2=="+this.reqType)
        getBigScreenData(this.reqType, this.orgId).then(res => {
          const data = res.data.data;
          let that = this;
          console.log(data);
          that.shjVisualData = data.shjVisualData;
          that.bikeChargeVisualData = data.bikeChargeVisualData;
          that.bikeChargeVisualData.fee = Number(data.bikeChargeVisualData.fee).toFixed(2);
          that.bikeChargeVisualData.degree = Number(data.bikeChargeVisualData.degree).toFixed(2);
          console.log("0000" + data.bikeChargeVisualData.fee)
          that.carChargeVisualData = data.carChargeVisualData;
          that.doorVisualData = data.doorVisualData;
          if (data.doorVisualData.carInCounts.length == 0) {
            that.doorVisualData.carInCounts = [0, 0, 0, 0, 0, 0, 0]
          }
          if (data.doorVisualData.carOutCounts.length == 0) {
            that.doorVisualData.carOutCounts = [0, 0, 0, 0, 0, 0, 0]
          }
          that.healthyVisualData = data.healthyVisualData;
          that.robotVisualData = data.robotVisualData;
          that.refuseVisualData = data.refuseVisualData;
          that.refuseVisualData.today.totalTimes = data.refuseVisualData.today.totalTimes;
          that.refuseVisualData.today.totalWeight = parseInt(data.refuseVisualData.today.totalWeight);
          that.deviceTotal = data.refuseVisualData.device.length;
          let onlineArr = [];
          let leaveArr = [];
          let shjArr = [];
          let shjArr2 = [];
          let rbtArr = [];
          for (var i = 0; i < data.refuseVisualData.device.length; i++) {
            // debugger
            if (data.refuseVisualData.device[i].isOnline == true) {
              onlineArr.push(data.refuseVisualData.device[i]);
            } else {
              leaveArr.push(data.refuseVisualData.device[i])
            }
            if (data.refuseVisualData.device[i].deviceName.indexOf('货') != -1) {
              if (data.refuseVisualData.device[i].isOnline == true) {
                shjArr.push(data.refuseVisualData.device[i]);
              }
            } else if (data.refuseVisualData.device[i].deviceName.indexOf('药') != -1) {
              if (data.refuseVisualData.device[i].isOnline == true) {
                shjArr2.push(data.refuseVisualData.device[i]);
              }
            }
            if (that.orgId != "1288001885620092929") {
              // 设备状态
              for (var j = 0; j < that.imgObj.length; j++) {
                if (data.refuseVisualData.device[i].deviceNo == that.imgObj[j].deviceNo) {
                  that.imgObj[j].show = !data.refuseVisualData.device[i].isOnline;
                  that.imgObj[j + 1].show = data.refuseVisualData.device[i].isOnline;
                }
              }
            }
          }
          that.deviceOnline = onlineArr.length;
          that.deviceLeave = leaveArr.length;
          that.shjVisualData.itemDeviceCount = shjArr.length;
          that.shjVisualData.medDeviceCount = shjArr2.length;
          that.robotVisualData.deviceCount = rbtArr.length;
          that.sbzxlValveData = [{ name: '设备在线率', value: parseInt(that.deviceOnline / that.deviceTotal * 100) }]
          /**停车占比**/
          that.carList = new Array();
          that.crcsList = new Array();
          //访客停车
          if (that.doorVisualData.visitorCarCount == 0 && that.doorVisualData.holderCarCount != 0) {
            that.carList.push({ "name": '业主', "value": that.doorVisualData.holderCarCount });
          } else if (that.doorVisualData.visitorCarCount != 0 && that.doorVisualData.holderCarCount == 0) {
            that.carList.push({ "name": '访客', "value": that.doorVisualData.visitorCarCount });
          } else {
            that.carList.push({ "name": '访客', "value": that.doorVisualData.visitorCarCount });
            that.carList.push({ "name": '业主', "value": that.doorVisualData.holderCarCount });
          }
          //出入车次
          if (that.doorVisualData.carInCount == 0 && that.doorVisualData.carOutCount != 0) {
            that.crcsList.push({ "name": '出场', "value": that.doorVisualData.carOutCount });
          } else if (that.doorVisualData.carInCount != 0 && that.doorVisualData.carOutCount == 0) {
            that.crcsList.push({ "name": '入场', "value": that.doorVisualData.carInCount });
          } else {
            that.crcsList.push({ "name": '入场', "value": that.doorVisualData.carInCount });
            that.crcsList.push({ "name": '出场', "value": that.doorVisualData.carOutCount });
          }

          /**人员进出**/
          that.jczrsList = new Array();
          that.jczrsList.push({ "name": '业主', "value": that.doorVisualData.holderPersonInOutCount });
          that.jczrsList.push({ "name": '访客', "value": that.doorVisualData.visitorPersonInOutCount });

          /**进出方式 刷脸 刷卡 其他**/
          that.jcfsValueData = new Array();
          //其他
          that.jcfsValueData.push(that.doorVisualData.otherPersonInOutCount);
          //刷卡
          that.jcfsValueData.push(that.doorVisualData.cardPersonInOutCount)
          //刷脸
          that.jcfsValueData.push(that.doorVisualData.facePersonInOutCount);

          /**健康数据分析**/

          // const pressureMap = this.healthyVisualData.pressureMap;
          // if(pressureMap !=null && JSON.stringify(pressureMap) != "{}"){
          //     this.jkxzData = new Array();
          //     for (let key in pressureMap) {
          //         let pInfo = {'name': key, "value": pressureMap[key]};
          //         this.jkxzData.push(pInfo)
          //     }
          // }
          that.jkxzData.push(that.healthyVisualData.pressureMap);
          //体脂

          const fatMap = that.healthyVisualData.fatMap;
          if (fatMap != null && JSON.stringify(fatMap) != "{}") {
            that.jktzData = new Array();
            for (let key in fatMap) {
              let pInfo = { 'name': key, "value": fatMap[key] };
              that.jktzData.push(pInfo)
            }
          }

          //今日测量年龄分布
          that.agesData = new Array();
          that.agesData.push({ name: '>60', value: that.healthyVisualData.ages[3] + that.healthyVisualData.ages[4] });
          that.agesData.push({ name: '40-60', value: that.healthyVisualData.ages[2] });
          that.agesData.push({ name: '<40', value: that.healthyVisualData.ages[1] + that.healthyVisualData.ages[0] });

          /**垃圾分类  ljflLabelData:["易腐","其他","可回收","有害"]**/
          that.ljflValveData = new Array();
          that.ljflValveData.push(that.refuseVisualData.today.perishableWeight);
          that.ljflValveData.push(that.refuseVisualData.today.otherWeight);
          that.ljflValveData.push(that.refuseVisualData.today.recyclableWeight);
          that.ljflValveData.push(that.refuseVisualData.today.harmfulWeight);
          /**
           * 最近七天的垃圾总量
           * totalWeightMonDataList:[],//月总重量
           perishableWeightMonDataList:[],//易腐垃圾重量
           recyclableWeightMonDataList:[],//可回收物重量
           harmfulWeightMonDataList:[],//有害垃圾重量
           otherWeightMonDataList:[],
           * **/
          that.totalWeightMonDataList = new Array();
          that.perishableWeightMonDataList = new Array();
          that.recyclableWeightMonDataList = new Array();
          that.harmfulWeightMonDataList = new Array();
          that.otherWeightMonDataList = new Array();
          const lastDaily = that.refuseVisualData.lastDaily;
          lastDaily.forEach((v, index) => {
            if (index <= 6) {
              that.totalWeightMonDataList.push(v.totalWeight);
              that.perishableWeightMonDataList.push(v.perishableWeight);
              that.recyclableWeightMonDataList.push(v.recyclableWeight);
              that.harmfulWeightMonDataList.push(v.harmfulWeight);
              that.otherWeightMonDataList.push(v.otherWeight);
            }
          })
          if (that.totalWeightMonDataList.length == 0) {
            that.totalWeightMonDataList = [0, 0, 0, 0, 0, 0, 0]
          }
          if (that.perishableWeightMonDataList.length == 0) {
            that.perishableWeightMonDataList = [0, 0, 0, 0, 0, 0, 0]
          }
          if (that.recyclableWeightMonDataList.length == 0) {
            that.recyclableWeightMonDataList = [0, 0, 0, 0, 0, 0, 0]
          }
          if (that.harmfulWeightMonDataList.length == 0) {
            that.harmfulWeightMonDataList = [0, 0, 0, 0, 0, 0, 0]
          }
          if (that.otherWeightMonDataList.length == 0) {
            that.otherWeightMonDataList = [0, 0, 0, 0, 0, 0, 0]
          }
          let  halfYearMonth = data.refuseVisualData.halfYearMonth;
            that.totalWeightDataList = new Array();
            that.perishableWeightDataList = new Array();
            that.recyclableWeightDataList = new Array();
            that.harmfulWeightDataList = new Array();
            that.otherWeightDataList = new Array();
            halfYearMonth.forEach(v=>{
                that.totalWeightDataList.push(v.totalWeight);
                that.perishableWeightDataList.push(v.perishableWeight);
                that.recyclableWeightDataList.push(v.recyclableWeight);
                that.harmfulWeightDataList.push(v.harmfulWeight);
                that.otherWeightDataList.push(v.otherWeight);
            })
          console.log("+++++++++++++++++++")
          that.initData();
        });
      },lastMonthDate(){
            //创建现在的时间
            var data=new Date();
            //获取年
            var year=data.getFullYear();
            //获取月
            var mon=data.getMonth()+1;
            var arry=new Array();
            for(var i=0;i<6;i++){
                mon=mon-1;
                if(mon<=0){
                    year=year-1;
                    mon=mon+12;
                }
                if(mon<10){
                    mon="0"+mon;
                }

                arry[i]=year+""+mon;
            }
            //倒序
            // arry.reverse();
            return arry;
        },carInOrOut(type){
          if( type === 'day'){
              this.car_main_bg = 'chart_main_bg';
              this.carDayBotoom = '0px';
              this.carMonthClass = 'car_day_left';

              /**
               * 车流量
               */
              const carLlZX = echarts.init(this.$refs.carLl);
              carLlZX.setOption({
                  tooltip: {
                      trigger: 'axis'
                  },
                  color: ['#e971c8', '#b1f60b'],
                  legend: {
                      icon: "circle",
                      data: ['入场', '出场'],
                      textStyle: {//图例文字的样式
                          color: 'white',
                          fontSize: 10
                      }
                  },
                  xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: this.lastDays,
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
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
                  yAxis: {
                      type: 'value',
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
                          }
                      },
                      minInterval: 1
                  },
                  series: [
                      {
                          name: '入场',
                          type: 'line',
                          smooth: false,
                          data: this.doorVisualData.carInCounts
                      },
                      {
                          name: '出场',
                          type: 'line',
                          smooth: false,
                          data: this.doorVisualData.carOutCounts
                      }
                  ]
              });
          }else if(type === 'month'){
              let monthDate  = this.lastMonthDate();
              this.car_main_bg = 'chart_main_right_bg';
              this.carDayBotoom = '7px';
              this.carMonthClass = 'car_month_left';
              console.log("最近6个月的时间"+monthDate)
              const carLlZX = echarts.init(this.$refs.carLl);
              carLlZX.setOption({
                  tooltip: {
                      trigger: 'axis'
                  },
                  color: ['#e971c8', '#b1f60b'],
                  legend: {
                      icon: "circle",
                      data: ['入场', '出场'],
                      textStyle: {//图例文字的样式
                          color: 'white',
                          fontSize: 10
                      }
                  },
                  xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: monthDate,
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
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
                  yAxis: {
                      type: 'value',
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
                          }
                      },
                      minInterval: 1
                  },
                  series: [
                      {
                          name: '入场',
                          type: 'line',
                          smooth: false,
                          data: this.doorVisualData.monthCarInCounts
                      },
                      {
                          name: '出场',
                          type: 'line',
                          smooth: false,
                          data: this.doorVisualData.monthCarOutCounts
                      }
                  ]
              });
          }
        },personInOrOut(type){//人员进出及流动
            if(type === 'day'){
                this.personOut = '0px';
                this.main_bg = 'chart_main_bg'
                this.monthLeft = 'person_day_left';
                /**
                 * 人员流动
                 * **/
                const ryldZX = echarts.init(this.$refs.ryld);
                ryldZX.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#FBD319', '#E971c8'],
                    legend: {
                        icon: "circle",
                        data: ['出', '入'],
                        textStyle: {//图例文字的样式
                            color: 'white',
                            fontSize: 10
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.lastDays,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
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
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            }
                        },
                        minInterval: 1
                    },
                    series: [
                        {
                            name: '出',
                            type: 'line',
                            smooth: false,
                            data: this.doorVisualData.personOutCounts
                        },
                        {
                            name: '入',
                            type: 'line',
                            smooth: false,
                            data: this.doorVisualData.personInCounts
                        }
                    ]
                });
            }else if(type === 'month'){
                this.personOut = '6px';
                this.main_bg = 'chart_main_right_bg';
                this.monthLeft = 'person_month_left';
                let monthDate  = this.lastMonthDate();
                console.log("最近6个月的时间"+monthDate)
                const ryldZX = echarts.init(this.$refs.ryld);
                ryldZX.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#FBD319', '#E971c8'],
                    legend: {
                        icon: "circle",
                        data: ['出', '入'],
                        textStyle: {//图例文字的样式
                            color: 'white',
                            fontSize: 10
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: monthDate,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                                fontSize:10
                            }
                        }
                    },
                    grid: {
                        left: '4%',
                        right: '5%',
                        bottom: '3%',
                        top: '15%',//距上边距
                        containLabel: true
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            }
                        },
                        minInterval: 1
                    },
                    series: [
                        {
                            name: '出',
                            type: 'line',
                            smooth: false,
                            data: this.doorVisualData.monthPersonOutCounts
                        },
                        {
                            name: '入',
                            type: 'line',
                            smooth: false,
                            data: this.doorVisualData.monthPersonInCounts
                        }
                    ]
                });
            }
        },getRefuseVisual(type){
          if(type === 'day'){
              this.refuse_visual_bg = 'chart_main_bg';
              this.refuseDayBotoom = '0px';
              /**
               * 垃圾投放量
               */
              const ljtflZX = echarts.init(this.$refs.ljtfl);
              ljtflZX.setOption({
                  tooltip: {
                      trigger: 'axis'
                  },
                  color: ['#e1f3ff', '#32b7e9', '#fbd319', '#b1f60b', '#e971c8'],
                  legend: {
                      icon: "circle",
                      data: this.AIFlag == false ? this.ljflTableData2 : this.ljflTableData,
                      textStyle: {//图例文字的样式
                          color: 'white',
                          fontSize: 10
                      }
                  },
                  xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: this.lastDays,
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
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
                  yAxis: {
                      type: 'value',
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
                          }
                      }
                  },
                  series: this.AIFlag == false ? [
                      {
                          name: '总量',
                          type: 'line',
                          smooth: false,
                          data: this.totalWeightMonDataList
                      },
                      {
                          name: '易腐垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.perishableWeightMonDataList
                      },
                      {
                          name: '其他垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.otherWeightMonDataList
                      },
                      {
                          name: '可回收物',
                          type: 'line',
                          smooth: false,
                          data: this.recyclableWeightMonDataList
                      },
                      {
                          name: '有害垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.harmfulWeightMonDataList
                      }
                  ] : [
                      {
                          name: '总量',
                          type: 'line',
                          smooth: false,
                          data: this.totalWeightMonDataList
                      },
                      {
                          name: '易腐垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.perishableWeightMonDataList
                      },
                      {
                          name: '其他垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.otherWeightMonDataList
                      },
                  ]
              });

          }else if(type === 'month'){

              let monthDate  = this.lastMonthDate();
              this.refuse_visual_bg = 'chart_main_right_bg';
              this.refuseDayBotoom = '5px';
              /**
               * 垃圾投放量
               */
              const ljtflZX = echarts.init(this.$refs.ljtfl);
              ljtflZX.setOption({
                  tooltip: {
                      trigger: 'axis'
                  },
                  color: ['#e1f3ff', '#32b7e9', '#fbd319', '#b1f60b', '#e971c8'],
                  legend: {
                      icon: "circle",
                      data: this.AIFlag == false ? this.ljflTableData2 : this.ljflTableData,
                      textStyle: {//图例文字的样式
                          color: 'white',
                          fontSize: 10
                      }
                  },
                  xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: monthDate,
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
                              fontSize: 9
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
                  yAxis: {
                      type: 'value',
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
                          }
                      }
                  },
                  series: this.AIFlag == false ? [
                      {
                          name: '总量',
                          type: 'line',
                          smooth: false,
                          data: this.totalWeightDataList
                      },
                      {
                          name: '易腐垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.perishableWeightDataList
                      },
                      {
                          name: '其他垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.otherWeightDataList
                      },
                      {
                          name: '可回收物',
                          type: 'line',
                          smooth: false,
                          data: this.recyclableWeightDataList
                      },
                      {
                          name: '有害垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.harmfulWeightDataList
                      }
                  ] : [
                      {
                          name: '总量',
                          type: 'line',
                          smooth: false,
                          data: this.totalWeightDataList
                      },
                      {
                          name: '易腐垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.perishableWeightDataList
                      },
                      {
                          name: '其他垃圾',
                          type: 'line',
                          smooth: false,
                          data: this.otherWeightMonDataList
                      },
                  ]
              });
          }
        },getCharge(type){
            if( type === 'day'){
                this.charge_main_bg = 'chart_main_bg';
                this.chargeDayBotoom = '0px';
                this.chargeMonthClass = 'charge_day_left'
                /**
                 * 充电次数
                 */
                const cdcsZX = echarts.init(this.$refs.cdcs);
                cdcsZX.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#b1f60b', '#9b4aeb'],
                    legend: {
                        icon: "circle",
                        data: ['电动汽车', '电瓶车'],
                        textStyle: {//图例文字的样式
                            color: 'white',
                            fontSize: 10
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.lastDays,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
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
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            }
                        },
                        minInterval: 1
                    },
                    series: [
                        {
                            name: '电动汽车',
                            type: 'line',
                            smooth: true,
                            data: this.carChargeVisualData.chargeCounts,
                            areaStyle: {
                                normal: {}
                            }
                        },
                        {
                            name: '电瓶车',
                            type: 'line',
                            smooth: true,
                            data: this.bikeChargeVisualData.chargeCounts,
                            areaStyle: {
                                normal: {}
                            }
                        }
                    ]
                });


            }else if( type === 'month'){
                let monthDate  = this.lastMonthDate();
                this.charge_main_bg = 'chart_main_right_bg';
                this.chargeDayBotoom = '5px';
                this.chargeMonthClass = 'charge_month_right'
                /**
                 * 充电次数
                 */
                const cdcsZX = echarts.init(this.$refs.cdcs);
                cdcsZX.setOption({
                    tooltip: {
                        trigger: 'axis'
                    },
                    color: ['#b1f60b', '#9b4aeb'],
                    legend: {
                        icon: "circle",
                        data: ['电动汽车', '电瓶车'],
                        textStyle: {//图例文字的样式
                            color: 'white',
                            fontSize: 10
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: monthDate,
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                                fontSize: 9
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
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: 'white', //x轴data 的颜色
                            }
                        },
                        minInterval: 1
                    },
                    series: [
                        {
                            name: '电动汽车',
                            type: 'line',
                            smooth: true,
                            data: this.carChargeVisualData.halfYearChargeCounts,
                            areaStyle: {
                                normal: {}
                            }
                        },
                        {
                            name: '电瓶车',
                            type: 'line',
                            smooth: true,
                            data: this.bikeChargeVisualData.halfYearChargeCounts,
                            areaStyle: {
                                normal: {}
                            }
                        }
                    ]
                });


            }
        },getShj(type){
           if(type === 'day'){
               this.shj_main_bg= 'chart_main_bg';
               this.shjMonthClass = 'shj_day_left';
               this.shjDayBotoom = '0px';
               /**
                * 商品销售
                */
               const spxsZX = echarts.init(this.$refs.spxs);
               spxsZX.setOption({
                   tooltip: {
                       trigger: 'axis'
                   },
                   color: ['#e1f3ff', '#9b4aeb'],
                   legend: {
                       icon: "circle",
                       data: ['商品销售', '药品销售'],
                       textStyle: {//图例文字的样式
                           color: 'white',
                           fontSize: 10
                       }
                   },
                   xAxis: {
                       type: 'category',
                       boundaryGap: false,
                       data: this.lastDays,
                       axisLabel: {
                           show: true,
                           textStyle: {
                               color: 'white', //x轴data 的颜色
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
                           type: 'value',
                           axisLabel: {
                               show: true,
                               textStyle: {
                                   color: 'white', //x轴data 的颜色
                               }
                           }
                       },
                       {
                           type: 'value',
                           axisLabel: {
                               show: true,
                               textStyle: {
                                   color: 'white', //x轴data 的颜色
                               }
                           }
                       }],
                   series: [
                       {
                           name: '商品销售',
                           type: 'line',
                           smooth: true,
                           data: this.shjVisualData.itemFees,
                           areaStyle: {
                               normal: {}
                           }
                       },
                       {
                           name: '药品销售',
                           type: 'line',
                           smooth: true,
                           data: this.shjVisualData.medFees,
                           areaStyle: {
                               normal: {}
                           }
                       }
                   ]
               });
           }else if(type  === 'month'){
               let monthDate  = this.lastMonthDate();
               this.shj_main_bg= 'chart_main_right_bg';
               this.shjMonthClass = 'shj_month_right';
               this.shjDayBotoom = '5px';
               /**
                * 商品销售
                */
               const spxsZX = echarts.init(this.$refs.spxs);
               spxsZX.setOption({
                   tooltip: {
                       trigger: 'axis'
                   },
                   color: ['#e1f3ff', '#9b4aeb'],
                   legend: {
                       icon: "circle",
                       data: ['商品销售', '药品销售'],
                       textStyle: {//图例文字的样式
                           color: 'white',
                           fontSize: 10
                       }
                   },
                   xAxis: {
                       type: 'category',
                       boundaryGap: false,
                       data: monthDate,
                       axisLabel: {
                           show: true,
                           textStyle: {
                               color: 'white', //x轴data 的颜色
                               fontSize: 9
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
                           type: 'value',
                           axisLabel: {
                               show: true,
                               textStyle: {
                                   color: 'white', //x轴data 的颜色
                               }
                           }
                       },
                       {
                           type: 'value',
                           axisLabel: {
                               show: true,
                               textStyle: {
                                   color: 'white', //x轴data 的颜色
                               }
                           }
                       }],
                   series: [
                       {
                           name: '商品销售',
                           type: 'line',
                           smooth: true,
                           data: this.shjVisualData.halfYearItemFees,
                           areaStyle: {
                               normal: {}
                           }
                       },
                       {
                           name: '药品销售',
                           type: 'line',
                           smooth: true,
                           data: this.shjVisualData.halfYearMedFees,
                           areaStyle: {
                               normal: {}
                           }
                       }
                   ]
               });
           }
        },getHealth(type){
          if(type === 'day'){
              this.health_main_bg = 'chart_main_bg';
              this.healDayBotoom = '0px';
              this.healMonthClass = 'health_day_left';
              /**
               * 健康小站
               */
              const ypxsZX = echarts.init(this.$refs.ypxs);
              ypxsZX.setOption({
                  tooltip: {
                      trigger: 'axis'
                  },
                  color: ['#b1f60b'],
                  legend: {
                      icon: "circle",
                      orient: 'vertical',
                      x: 'right',
                      y: 'top',
                      padding: [0, 50, 0, 0],
                      data: ['测量人数'],
                      textStyle: {//图例文字的样式
                          color: 'white',
                          fontSize: 10
                      }
                  },
                  xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: this.lastDays,
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
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
                  yAxis: {
                      type: 'value',
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
                          },
                          // formatter: (v)=>{
                          //     return parseInt(v);
                          // }
                      },
                      minInterval: 1
                  },
                  series: [
                      {
                          name: '测量人数',
                          type: 'line',
                          smooth: true,
                          data: this.healthyVisualData.measuredCounts,
                          areaStyle: {
                              normal: {}
                          }
                      },
                      // {
                      //     name: '销售金额（元）',
                      //     type: 'line',
                      //     smooth: true,
                      //     data: this.shjVisualData.medFees
                      // }
                  ]
              });
          }else if(type ==='month'){
              let monthDate  = this.lastMonthDate();
              this.health_main_bg = 'chart_main_right_bg';
              this.healDayBotoom = '5px';
              this.healMonthClass = 'health_month_right';
              /**
               * 健康小站
               */
              const ypxsZX = echarts.init(this.$refs.ypxs);
              ypxsZX.setOption({
                  tooltip: {
                      trigger: 'axis'
                  },
                  color: ['#b1f60b'],
                  legend: {
                      icon: "circle",
                      orient: 'vertical',
                      x: 'right',
                      y: 'top',
                      padding: [0, 50, 0, 0],
                      data: ['测量人数'],
                      textStyle: {//图例文字的样式
                          color: 'white',
                          fontSize: 10
                      }
                  },
                  xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: monthDate,
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
                              fontSize: 9
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
                  yAxis: {
                      type: 'value',
                      axisLabel: {
                          show: true,
                          textStyle: {
                              color: 'white', //x轴data 的颜色
                          },
                          // formatter: (v)=>{
                          //     return parseInt(v);
                          // }
                      },
                      minInterval: 1
                  },
                  series: [
                      {
                          name: '测量人数',
                          type: 'line',
                          smooth: true,
                          data: this.healthyVisualData.halfYearMeasuredCounts,
                          areaStyle: {
                              normal: {}
                          }
                      },
                      // {
                      //     name: '销售金额（元）',
                      //     type: 'line',
                      //     smooth: true,
                      //     data: this.shjVisualData.medFees
                      // }
                  ]
              });
          }
        },
      initData() {
        // debugger
        /**进出总人数**/
        const jczrsPie = echarts.init(this.$refs.jczrs);
        // console.log(jczrsPie);
        jczrsPie.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
          },
          label: {
            color: '#ffffff'
          },
          labelLine: {
            lineStyle: {
              color: '#ffffff'
            },
            smooth: 0.1,
            length: 1,
            length2: 1
          },
          color: ['#f6df05', '#5ffc49', '#8CB50B'],
          legend: {
            orient: 'horizontal',
            bottom: 0,
            data: ['业主', '访客'],
            textStyle: {
              color: 'white'
            }
          },
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['50%', '70%'],
              center: ['50%', '40%'],
              data: this.jczrsList,
              roseType: 'radius',
              itemStyle: {
                emphasis: {
                  shadowBlur: 1,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  label: {
                    show: false,
                    // formatter: '{d}%'
                    // formatter: '{b} : {c} ({d}%)'
                  },
                  labelLine: { show: false }
                }
              }
            }
          ]
        });
        /**
         * 进出方式
         */
        const jcfsBar = echarts.init(this.$refs.jinchuType);
        jcfsBar.setOption({
          tooltip: {
            trigger: 'item'
          },
          grid: [
            {
              left: '8%',
              top: '12%',
              right: '5%',
              bottom: '8%',
              containLabel: true
            },
            {
              left: '10%',
              top: '12%',
              right: '5%',
              bottom: '8%',
              containLabel: true
            }
          ],
          xAxis: [{
            max: 'max',
            show: false
          }],
          yAxis: [{
            axisTick: 'none',
            axisLine: 'none',
            offset: '0',
            axisLabel: {
              textStyle: {
                color: '#c0e8ff', //y轴字体颜色
                fontSize: '10'
              }
            },
            data: this.jcfsLabelData
          }, {
            axisTick: 'none',
            axisLine: 'none',
            show: false,
            axisLabel: {
              textStyle: {
                color: '#c0e8ff',
                fontSize: '10'
              }
            },
            data: ['', '', '']
          }, {
            axisLine: {
              lineStyle: {
                color: 'rgba(0,0,0,0)' //y轴线颜色
              }
            },
            data: []
          },
          {  //设置柱状图右边参数
            show: false,
            inverse: false,
            data: [1, 1, 1],
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
          }
          ],
          series: [
            {
              name: '',
              type: 'bar',
              stack: 'b',
              yAxisIndex: 0,
              data: this.jcfsValueData,
              label: {
                normal: {
                  show: false,
                  position: 'right',
                  distance: 10,
                  formatter: function (param) {
                    return param.value + '%'
                  },
                  textStyle: {
                    color: '#ffffff',
                    fontSize: '16'
                  }
                }
              },
              barWidth: 10,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    1, 0, 0, 0,
                    [
                      { offset: 0, color: '#0cd6ff' },
                      { offset: 1, color: '#00fef3' }
                    ]
                  ),

                  barBorderRadius: [1, 1, 1, 1],
                }
              },
              z: 2
            }, { //背景灰框
              name: '',
              type: 'bar',
              position: 'right',
              yAxisIndex: 1,
              barGap: '-100%',//设置-100% 则表示灰色柱状图与红色柱状图重合
              data: [2500, 2500, 2500],
              barWidth: 10,
              itemStyle: {
                show: false,
                normal: {
                  color: '#132e77',
                  barBorderRadius: [1, 1, 1, 1],
                },
                textStyle: {
                  color: 'red',
                }

              },
              z: 1  // 设置维度越高表示覆盖低的
            },
          ]
        });
        // 出入车次比
        const crcsPie = echarts.init(this.$refs.crcs);
        crcsPie.setOption({
          title: {
            text: '',
            subtext: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
          },
          label: {
            color: '#ffffff'
          },
          labelLine: {
            lineStyle: {
              color: '#ffffff'
            },
            smooth: 0.1,
            length: 1,
            length2: 1
          },
          color: ['#fbd319', '#e971c8', '#8CB50B'],
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['10%', '55%'],
              center: ['50%', '50%'],
              data: this.crcsList,
              roseType: 'radius',
              itemStyle: {
                emphasis: {
                  shadowBlur: 1,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  label: {
                    show: true,
                    // formatter: '{d}%',
                    lineHeight: 5,
                    borderWidth: 1,

                    // formatter: '{b} : {c} ({d}%)'
                  },
                  labelLine: { show: true }
                }
              }
            }
          ]
        });
        /**停车占比**/
        const stopCarPie = echarts.init(this.$refs.stopCar);
        stopCarPie.setOption({
          title: {
            text: '',
            subtext: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {c}"
          },
          label: {
            color: '#ffffff'
          },
          labelLine: {
            lineStyle: {
              color: '#ffffff'
            },
            smooth: 0.1,
            length: 1,
            length2: 1
          },
          color: ['#12d7f9', '#6cf752', '#8CB50B'],
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['10%', '55%'],
              center: ['50%', '50%'],
              data: this.carList,
              roseType: 'radius',
              itemStyle: {
                emphasis: {
                  shadowBlur: 1,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  label: {
                    show: true,
                    // formatter: '{d}%',
                    lineHeight: 5,
                    borderWidth: 1,

                    // formatter: '{b} : {c} ({d}%)'
                  },
                  labelLine: { show: true }
                }
              }
            }
          ]
        });

        /**
         * 垃圾分类
         * **/
        const ljflBar = echarts.init(this.$refs.ljfl);
        ljflBar.setOption({
          color: ["#132e77", "#4CCEFE", '#b1f60b', '#e971c8'],
          title: {
            show: false,
            text: "统计总量",
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
            data: this.AIFlag == false ? this.ljflLabelData2 : this.ljflLabelData,
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
              barWidth: 10,
              data: ["100", "100", "100", "100",],
              name: "",
              type: "bar",
              z: 1
            },
            {
              barWidth: 10,
              data: this.ljflValveData,
              name: "",
              type: "bar",
              z: 2
            }
          ]
        });


        /***
         * 健康小站 血压
         */
        const jkxzPie = echarts.init(this.$refs.jkxz);
        jkxzPie.setOption({
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
            smooth: 0.1,
            length: 1,
            length2: 1
          },
          color: ['#b1f60b', '#e971c8', '#fbd319'],
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['30%', '50%'],
              center: ['50%', '50%'],
              data: this.jkxzData,
              roseType: 'radius',
              itemStyle: {
                emphasis: {
                  shadowBlur: 1,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                normal: {
                  label: {
                    show: true,

                    // formatter: '{d}%'
                    //  formatter: '{b} : {c} ({d}%)'
                  },
                  labelLine: { show: true }
                }
              }
            }
          ]
        });
        //
        /**体脂**/
        // const jktzPie = echarts.init(this.$refs.jktz);
        // jktzPie.setOption({
        //     tooltip: {
        //         trigger: 'item',
        //         formatter: "{a} <br/>{b} : {c} ({d}%)"
        //     },
        //     label: {
        //         color: '#ffffff'
        //     },
        //     labelLine: {
        //         lineStyle: {
        //             color: '#ffffff',

        //         },
        //         smooth: 0.1,
        //         length: 1,
        //         length2: 1
        //     },
        //     color: ['#fbd319', '#12d7f9', '#b1f60b'],
        //     series: [
        //         {
        //             name: '体脂',
        //             type: 'pie',
        //             radius: ["20%","70%"],
        //             center: ['50%', '50%'],
        //             data: this.jktzData,
        //             roseType: 'radius',
        //             itemStyle: {
        //                 emphasis: {
        //                     shadowBlur: 1,
        //                     shadowOffsetX: 0,
        //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 },
        //                 normal: {
        //                     label: {
        //                         show: true,

        //                         // formatter: '{d}%'
        //                         //  formatter: '{b} : {c} ({d}%)'
        //                     },
        //                     labelLine: {show: true}
        //                 }
        //             }
        //         }
        //     ]
        // });
        //
        //今日测量年龄分布
        const agesPie = echarts.init(this.$refs.ages)
        agesPie.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          label: {
            color: '#ffffff'
          },
          labelLine: {
            lineStyle: {
              color: '#ffffff',

            },
            smooth: 0.1,
            length: 1,
            length2: 1
          },
          color: ['#fbd319', '#12d7f9', '#b1f60b'],
          legend: {
            show: false,
            orient: 'horizontal',
            bottom: 0,
            data: ['<40', '40-60', '>60'],
            textStyle: {
              color: 'white',
              fontSize: 5
            }
          },
          series: [{
            name: '',
            type: 'pie',
            radius: ['30%', '50%'],
            center: ['50%', '50%'],
            data: this.agesData,
            roseType: 'radius',
            itemStyle: {
              emphasis: {
                shadowBlur: 1,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                label: {
                  show: true,
                },
                labelLine: { show: true }
              }
            }
          }]
        });
        // 设备状态
        const sbzxlGauge = echarts.init(this.$refs.sbzxl);
        sbzxlGauge.setOption({
          tooltip: {
            show: true,
            formatter: "{b}: {c}%",
          },
          series: [{
            name: "设备在线率",
            type: "gauge",
            radius: "75%",
            center: ["50%", "55%"],
            data: this.sbzxlValveData,
            splitNumber: 10,
            axisLine: {
              lineStyle: {
                color: [
                  [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0.1,
                      color: '#06009c'
                    }, {
                      offset: 1,
                      color: '#09acff'
                    }
                  ])]
                ],
                width: 20
              }
            },
            splitLine: {
              length: 5,
              lineStyle: {
                color: '#1db6fd',
                shadowBlur: 10,
                shadowColor: '#1db6fd'
              }
            },
            axisTick: {
              length: 3,
              splitNumber: 10,
              lineStyle: {
                color: '#1db6fd',
                shadowBlur: 10,
                shadowColor: '#1db6fd'
              },
            },
            axisLabel: {
              show: true,
              color: 'white',
              distance: 2,
              fontSize: 10
            },
            title: {
              show: false,
              offsetCenter: [0, '80%'],
              textStyle: {
                color: '#C0E8FF',
                fontSize: 10
              },
            },
            pointer: {
              show: true,
              width: 3,
            },
            itemStyle: {
              color: 'auto',
              opacity: 1,
            },
            detail: {
              offsetCenter: [0, '80%'],
              show: true,
              color: "#b1f6f8",
              fontSize: 16,
              formatter: "{value}%"
            }
          }]
        });
          //门禁统计
       this.personInOrOut("day");
       //车辆统计
       this.carInOrOut("day");
       //垃圾分类统计
        this.getRefuseVisual("day");
        //充电统计
       this.getCharge("day");
       this.getShj("day");
       this.getHealth('day');

      },
      //全屏
      clickFullScreen: function () {
        WebVideoCtrl.I_FullScreen(true);
      },
      //切换
      changeWndNum: function (iType) {
        console.log(iType);
        var iType = parseInt(iType, 10);
        WebVideoCtrl.I_ChangeWndNum(iType);
      },
      downLoadPlugin: function () {
        if (confirm(`是否下载该插件?`)) {
          window.location.href = process.env.BASE_API + `/WebComponentsKit.exe`;
        }
      },
      videoInitPlugin: function () {
        // var _this = this;
        var iRet = WebVideoCtrl.I_CheckPluginInstall();
        if (iRet === -1) {
          alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
          this.downLoadPlugin();
          return;
        }
        this.initPlugin()
      },
      initPlugin: function () {
        var that = this;
        WebVideoCtrl.I_InitPlugin(this.iWidth, this.iHeight, {
          bWndFull: true,//是否支持单窗口双击全屏，默I_CheckPluginInstall
          iWndowType: 1,
          // cbSelWnd: function (xmlDoc) {
          //   var giWndIndex = parseInt($(xmlDoc).find("SelectWnd").eq(0).text(), 10);
          //   var szInfo = "当前选择的窗口编号：" + giWndIndex;
          //
          //   console.log(szInfo);
          // },
          cbInitPluginComplete: function () {
            WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
            // 检查插件是否最新
            if (WebVideoCtrl.I_CheckPluginVersion() === -1) {
              alert("检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！");
              return;
            }
            console.log("cameraArray length:", that.cameraArray);
            for (var i = 0; i < that.cameraArray.length; i++) {
              var szIP = that.cameraArray[i].ipAddr;
              var cameraId = that.cameraArray[i].channelId;
              console.log("szIP ===" + szIP)
              WebVideoCtrl.I_Login(szIP, that.iProtocol, that.szPort, that.szUsername, that.szPassword, {
                async: false,
                success: function (xmlDoc) {
                  console.log(xmlDoc);//不能删除
                  // 开始预览
                  var szDeviceIdentify = szIP + "_" + that.szPort;
                  setTimeout(that.startRealPlay(szDeviceIdentify, i, 1), 500);  //1为通道号,  i 为窗口
                },
                error: function () {
                  console.log("login error");
                }
              });
            }
          },
        });
      },
      startRealPlay: function (szDeviceIdentify, iWndIndex, iChannelID) {
        console.log("startRealPlay: ", szDeviceIdentify, iWndIndex, iChannelID);
        WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
          iWndIndex: iWndIndex,
          iStreamType: 1,
          iChannelID: iChannelID,
          bZeroChannel: false,
          success: function () {
            console.log("开始预览成功 ");
          },
          error: function (status, xmlDoc2) {
            console.log(xmlDoc2)//不能删除
            if (status === 403) {
              console.log("szInfo 设备不支持Websocket取流！");
            } else {
              console.log("开始预览失败 ");
            }
          }
        });
      },
      mouseDownPTZControl: function (iPTZIndex) {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(0);

        if (oWndInfo !== null) {
          if (iPTZIndex === 9 && this.g_bPTZAuto) {
            iPTZSpeed = 0;
          } else {
            this.g_bPTZAuto = false;
          }

          WebVideoCtrl.I_PTZControl(iPTZIndex, false, {
            iPTZSpeed: 4,
            success: function (xmlDoc) {
              console.log(xmlDoc);
              if (iPTZIndex === 9 && this.g_bPTZAuto) {
                console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！");
              } else {
                console.log(oWndInfo.szDeviceIdentify + " 开启云台成功！");
              }
              if (iPTZIndex === 9) {
                this.g_bPTZAuto = !this.g_bPTZAuto;
              }
            },
            error: function (status, xmlDoc) {
              console.log(oWndInfo.szDeviceIdentify + " 开启云台失败！", status, xmlDoc);
            }
          });
        }
      },
      mouseUpPTZControl: function () {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);

        if (oWndInfo !== null) {
          WebVideoCtrl.I_PTZControl(1, true, {
            success: function (xmlDoc) {
              console.log(oWndInfo.szDeviceIdentify + " 停止云台成功！", xmlDoc)
            },
            error: function (status, xmlDoc) {
              console.log(oWndInfo.szDeviceIdentify + " 停止云台失败！", status, xmlDoc);
            }
          });
        }
      },
      getWebVideoCtrl(oIframe) {
        return oIframe.contentWindow.WebVideoCtrl;
      },
      iframeLoaded() {
        this.iLoadedCount++;
        let that = this
        if (1 === this.iLoadedCount) {
          var oLiveView = {
            iProtocol: 1,            // protocol 1��http, 2:https
            szIP: "192.168.10.3",    // protocol ip
            szPort: "80",            // protocol port
            szUsername: "admin",     // device username
            szPassword: "a1234567", // device password
            iStreamType: 2,          // stream 1��main stream  2��sub-stream  3��third stream  4��transcode stream
            iChannelID: 1,           // channel no
            bZeroChannel: false      // zero channel
          };
          var g_aIframe = $("iframe");
          $.each(g_aIframe, function (i, oIframe) {
            var oWebVideoCtrl = that.getWebVideoCtrl(oIframe);
            // ��¼�豸
            oWebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
              success: function (xmlDoc) {
                // ��ʼԤ��
                var szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
                setTimeout(function () {
                  oWebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                    iStreamType: oLiveView.iStreamType,
                    iChannelID: oLiveView.iChannelID,
                    bZeroChannel: oLiveView.bZeroChannel
                  });
                }, 1000);
              }
            });
          });
        }
        if (2 === this.iLoadedCount) {
          var oLiveView = {
            iProtocol: 1,            // protocol 1��http, 2:https
            szIP: "192.168.10.4",    // protocol ip
            szPort: "80",            // protocol port
            szUsername: "admin",     // device username
            szPassword: "a1234567", // device password
            iStreamType: 2,          // stream 1��main stream  2��sub-stream  3��third stream  4��transcode stream
            iChannelID: 1,           // channel no
            bZeroChannel: false      // zero channel
          };
          var g_aIframe = $("iframe");
          $.each(g_aIframe, function (i, oIframe) {
            var oWebVideoCtrl = that.getWebVideoCtrl(oIframe);
            // ��¼�豸
            oWebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
              success: function (xmlDoc) {
                // ��ʼԤ��
                var szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
                setTimeout(function () {
                  oWebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                    iStreamType: oLiveView.iStreamType,
                    iChannelID: oLiveView.iChannelID,
                    bZeroChannel: oLiveView.bZeroChannel
                  });
                }, 1000);
              }
            });
          });
        }
        if (3 === this.iLoadedCount) {
          var oLiveView = {
            iProtocol: 1,            // protocol 1��http, 2:https
            szIP: "192.168.10.8",    // protocol ip
            szPort: "80",            // protocol port
            szUsername: "admin",     // device username
            szPassword: "a1234567", // device password
            iStreamType: 2,          // stream 1��main stream  2��sub-stream  3��third stream  4��transcode stream
            iChannelID: 1,           // channel no
            bZeroChannel: false      // zero channel
          };
          var g_aIframe = $("iframe");
          $.each(g_aIframe, function (i, oIframe) {
            var oWebVideoCtrl = that.getWebVideoCtrl(oIframe);
            // ��¼�豸
            oWebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
              success: function (xmlDoc) {
                // ��ʼԤ��
                var szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
                setTimeout(function () {
                  oWebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                    iStreamType: oLiveView.iStreamType,
                    iChannelID: oLiveView.iChannelID,
                    bZeroChannel: oLiveView.bZeroChannel
                  });
                }, 1000);
              }
            });
          });
        }
        if (4 === this.iLoadedCount) {
          var oLiveView = {
            iProtocol: 1,            // protocol 1��http, 2:https
            szIP: "192.168.10.2",    // protocol ip
            szPort: "80",            // protocol port
            szUsername: "admin",     // device username
            szPassword: "a1234567", // device password
            iStreamType: 2,          // stream 1��main stream  2��sub-stream  3��third stream  4��transcode stream
            iChannelID: 1,           // channel no
            bZeroChannel: false      // zero channel
          };
          var g_aIframe = $("iframe");
          $.each(g_aIframe, function (i, oIframe) {
            var oWebVideoCtrl = that.getWebVideoCtrl(oIframe);
            // ��¼�豸
            oWebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
              success: function (xmlDoc) {
                // ��ʼԤ��
                var szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
                setTimeout(function () {
                  oWebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                    iStreamType: oLiveView.iStreamType,
                    iChannelID: oLiveView.iChannelID,
                    bZeroChannel: oLiveView.bZeroChannel
                  });
                }, 1000);
              }
            });
          });
        }
      },
      loadJS(src) {
        const $script = window.document.createElement('script');
        $script.src = src;
        window.document.body.appendChild($script);
        return new Promise((resolve) => { $script.onload = resolve; });
      },
      async init() {
        await this.loadJS("@/views/jquery-1.7.1.min.js");
        await this.loadJS("@/views/codebase/webVideoCtrl.js");

        var g_aIframe = $("iframe");

        $(function () {
          // ������Ƿ��Ѿ���װ��
          var iRet = WebVideoCtrl.I_CheckPluginInstall();
          if (-1 == iRet) {
            alert("����δ��װ�������˫��������Ŀ¼���WebComponentsKit.exe��װ��");
            return;
          }

          // �ر������
          $(window).unload(function () {
            $.each(g_aIframe, function (i, oIframe) {
              this.getWebVideoCtrl(oIframe).I_Stop();
            });
          });
        });
      }
    },

  }
</script>

<style scoped lang="scss">
  .health_day_left{
    position: relative;
    left: 23%;
    bottom: 5px
  }
  .health_month_right{
    position: relative;
    left: 18%;
    bottom: 5px
  }
  .shj_day_left{
    position: relative;
    left: 28%;
    bottom: 5px;
  }
  .shj_month_right{
    position: relative;
    left: 23%;
    bottom: 5px;
  }
  .charge_day_left{
    position: relative;left: 34.5%;bottom: 5px
  }
  .charge_month_right{
    position: relative;left: 30%;bottom: 5px
  }
  .content-bg {
    background-color: #020344 !important;
  }
  .chart_main_bg{
    background: url(/img/tb_left_bg.png) no-repeat center center;background-size: 100% 100%;margin: 0 1% 1% 1%;
  }
  .chart_main_right_bg{
    background: url(/img/chart_right_bg.png) no-repeat center center;background-size: 100% 100%;margin: 0 1% 1% 1%;
  }
  .person_day_left{
    margin-left: 26%;position: relative;bottom: 5px
  }
  .person_month_left{
    margin-left: 20%;position: relative;bottom: 5px
  }
  .car_day_left{
     margin-left: 28%;position: relative;bottom: 5px
   }
  .car_month_left{
    margin-left: 23%;position: relative;bottom: 5px
  }
  .main-bg {
    background: url(/img/data_visualization.png);
    width: 100%;
    height: 100%;
    background-color: #84859b;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -o-background-size: cover;
    background-position: center 0;
    overflow-y: hidden
  }

  .tab {
    display: inline-block;
  }

  .tab img {
    width: 50%;
  }

  .top-bg {
    width: 32.2%;
    display: inline-block;
    height: 200px;
    vertical-align: middle;
    margin-bottom: 15px;
  }



  .div_cdz {
    width: 30%;
    display: inline-block;
    vertical-align: middle;
  }

  .div_cdz img {
    width: 100%;
    height: 146px;
  }

  .div_cdz span {
    position: relative;
    bottom: 31px;
    font-weight: bold;
    color: white;
  }

  .top_j {
    width: 100%;
    position: relative;
    height: 35px;

  }

  .div_j_2 {
    width: 50%;
    height: 108px;
  }

  .div_j_2 img {
    width: 90%;
    height: 100px;
    position: relative;
    bottom: 31px;

  }

  .div_j_2 img:nth-child(2) {
    margin-left: 15px;
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

  .chart-bg-img_2 {
    position: absolute;
    z-index: 0;
    width: 32.5%;
    height: 300px;
  }

  .chart-title {
    position: relative;
    left: 10px;
    top: 13px;
    width: 100%;
    font-size: .9rem;
  }

  .chart-title_2 {
    position: relative;
    left: 10px;
    top: 15px;
    width: 100%;
    font-size: .9rem;
  }

  .amap-page-container {

    width: initial;
    height: initial;
    /*border: solid 2px #479ed5;*/
    position: relative;

    /* svg {
      width: 100%;
      height: 100%;
    } */
  }

  /* 普通字体 */
  .ordinary {
    color: #CEEBF1;
    font-size: .8rem;
    position: relative;
    bottom: 12px;
    right: 40%;
    cursor: pointer;
  }

  /* 高亮字体 */
  .active {
    color: #21c0e0;
    font-weight: bold;
    font-size: .8rem;
    position: relative;
    bottom: 12px;
    right: 40%;
    cursor: pointer;
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
    /*ie6清除浮动的方式 只有IE6-IE7执行，其他浏览器不执行*/
  }

  iframe {
    margin: 0;
    padding: 0;
    border: 0;
    width: 500px;
    height: 300px;
  }

  .lunbo {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .lunbo li {
    width: 33.3%;
    height: 100%;
    float: left;

  }

  .my_ul {
    list-style: none;
    height: 100%;
    width: 300%;
    /*图片的的宽度 * 图片的数量 */
    animation: lunbo 10s infinite;
  }

  .my_li1 {
    background-image: url(../../../public/img/XC1.jpg);
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: 100% 100%;
  }

  .my_li2 {
    background-image: url(../../../public/img/XC2.jpg);
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: 100% 100%;
  }

  .my_li3 {
    background-image: url(../../../public/img/XC1.jpg);
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: 100% 100%;
  }

  @keyframes lunbo {
    0% {
      margin-left: 0;
    }

    25% {
      margin-left: 0;
    }

    50% {
      margin-left: -100%;
    }

    75% {
      margin-left: -100%;
    }

    100% {
      margin-left: -200%;
    }
  }

  /deep/ .el-cascader {
    font-size: 1rem;
    width: 20% !important;
    height: 20px;
    line-height: 20px;
    background: none;
  }

  /deep/ .el-input__inner {
    background: none;
    border-radius: 4px;
    border: 0px solid #DCDFE6;
    color: rgb(202, 227, 249);
    text-align: center;
  }

  /deep/input::-webkit-input-placeholder {
    /* WebKit browsers */
    color: rgb(202, 227, 249);
    font-size: 16px;
  }

  /deep/input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    color: rgb(202, 227, 249);
    font-size: 16px;
  }

  /deep/input::-ms-input-placeholder {
    /* Internet Explorer 10+ */
    color: rgb(202, 227, 249);
    font-size: 16px;
  }

  .avue-view {
    padding-bottom: 0;
  }
</style>
<style>
  /* 最大屏幕分辨率为1280px */
  @media screen and (max-width:1280px) {
    .content {
      width: 100%;
    }
  }

  /* 最小屏幕分辨率为1280px且最大为1440px  */
  @media (min-width: 1280px) and (max-width:1440px) {

    /* 第一屏分辨率兼容 */
    .tab_title {
      color: #BACCEA;
      font-size: .9rem;
      position: relative;
      top: 6px;
      left: 13px;
    }

    .ones {
      height: 100%;
      text-align: center;
      display: block;
      margin-top: -15px;
    }

    .pass2 {
      width: 100%;
      height: 100%;
      margin-top: -15px
    }

    /* 第二屏 */
    .monitoring {
      width: 100%;
      position: relative;
      top: 15px;
    }

    /* 第三屏 */
    .threeS {
      width: 100%;
      text-align: left;
      display: block;
    }

    .palette {
      width: 95%;
      height: 80%;
      position: relative;
      top: 30px;
    }
  }

  /* 最小屏幕分辨率为1440px且最大为1680px */
  @media (min-width: 1440px) and (max-width:1680px) {

    /* 第一屏分辨率兼容 */
    .tab_title {
      color: #BACCEA;
      font-size: .9rem;
      position: relative;
      top: -13px;
      left: 13px;
    }

    .oneS {
      height: 100%;
      text-align: center;
      display: block;
      margin-top: 30px;
    }

    .pass2 {
      width: 100%;
      height: 100%;
      margin-top: 10px
    }

    /* 第二屏 */
    .monitoring {
      width: 100%;
      position: relative;
      top: 50px;
    }

    /* 第三屏 */
    .threeS {
      width: 100%;
      text-align: left;
      display: block;
      margin-top: 30px;
    }

    .palette {
      width: 99%;
      height: 80%;
      position: relative;
      top: 30px;
    }
  }

  /* 最小屏幕分辨率为1920px */
  @media screen and (min-width:1920px) {
    .content {
      width: 100%;
    }
  }
</style>
