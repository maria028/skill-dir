<template>
  <div style="height: 100%;position: relative;overflow: hidden;" v-if="sw">
    <basic-container>
      <div class="card clearfix" @mouseenter="mouseenter('doorPerson')" @mouseleave="mouseleave('doorPerson')"
        v-if="MJPflag">
        <a href="#" @click="rowClick({'type':'doorPerson','url':'https://cloud.zeno-tech.com/'})" style="width: 20%;">
          <img src="/img/homeIcon/rxd_s.png" class="sys_meu" id="doorPerson" style="float: left;margin: 3%;">
          <span
            style="display: block;width: 60%;float: left;height: 100%;line-height:400%;;font-size: 1.1rem;color: #555555FF;">人行道闸管理</span>
        </a>
      </div>

      <div class="card clearfix" @mouseenter="mouseenter('stopCar')" @mouseleave="mouseleave('stopCar')" v-if="DZCflag">
        <a href="#" @click="rowClick({'type':'stopCar','url':'http://www.yunparking.club/'})" style="width: 20%;">
          <img src="/img/homeIcon/stopCar_s.png" id="stopCar" class="sys_meu" style="float: left;margin: 3%">
          <span
            style="display: block;width: 60%;float: left;height: 100%;line-height:400%;font-size: 1.1rem;color: #555555FF;">停车收费管理</span>
        </a>
      </div>
      <div class="card clearfix" @mouseenter="mouseenter('monitoring')" @mouseleave="mouseleave('monitoring')"
        v-if="CAMflag">
        <a href="#" @click="jumpPage('/demo-iframe')" style="width: 20%;">
          <img src="/img/homeIcon/monitoring_s.png" id="monitoring" class="sys_meu" style="float: left;margin: 3%">
          <span
            style="display: block;width: 60%;float: left;height: 100%;line-height:400%;font-size: 1.1rem;color: #555555FF;">安防监控管理</span>
        </a>
      </div>
      <div class="card clearfix" @mouseenter="mouseenter('diandongCar')" @mouseleave="mouseleave('diandongCar')"
        v-if="CDCflag">
        <a href="#"
          @click="rowClick({'type':'diandongCar','url':'https://charging.sunriseyny.cn/charging-web/#/login'})"
          style="width: 20%;">
          <img src="/img/homeIcon/carCD_s.png" class="sys_meu" id="diandongCar" style="float: left;margin: 3%">
          <span
            style="display: block;width: 60%;float: left;height: 100%;line-height:400%;font-size: 1.1rem;color: #555555FF;">汽车充电管理</span>
        </a>
      </div>
      <div class="card clearfix" @mouseenter="mouseenter('shjMenu')" @mouseleave="mouseleave('shjMenu')" v-if="SHJflag">
        <a href="#" @click="rowClick({'type':'ProductManager','url':'http://shj.jufx.com/a/login'})"
          style="width: 20%;">
          <img src="/img/homeIcon/sp_s.png" class="sys_meu" id="shjMenu" style="float: left;margin: 3%">
          <span
            style="display: block;width: 60%;float: left;height: 100%;line-height:400%;font-size: 1.1rem;color: #555555FF;">销售商品管理</span>
        </a>
      </div>
      <div class="card clearfix" @mouseenter="mouseenter('robotMenu')" @mouseleave="mouseleave('robotMenu')"
        v-if="RRDflag">
        <a href="#" @click="rowClick({'type':'rrProduct','url':'http://rr.wewins.cn/rrjd_product/a/login'})"
          style="width: 20%;">
          <img src="/img/homeIcon/robot_s.png" class="sys_meu" id="robotMenu" style="float: left;margin: 3%">
          <span
            style="display: block;width: 60%;float: left;height: 100%;line-height:400%;font-size: 1.1rem;color: #555555FF;">服务机器人管理</span>
        </a>
      </div>
      <div class="cardTwo" v-if="MJPflag">
        <div class="clearfix">
          <span
            style="height: 28px;border-left: 5px solid #48D390;display: inline-block;margin:2%;float: left;"></span>
          <span
            style="font-size:1rem;font-family:PingFang SC;font-weight:bold;display: inline-block;color:rgba(85,85,85,1);line-height: 28px;float: left;margin: 2% 0;">
            温馨提示：轻未来社区业主信息录入方法
          </span>
        </div>
        <el-row type=flex>
          <el-col :span=6 :offset=1 style="background: #d7d7d7;opacity: 0.8;border-radius: 12px;">
            <div class="tag">步骤一、为业主开通门禁</div>
            <span
              style="font-size: .8rem;color: #333333;display: inline-block;width: 80%;margin: 0 10%;margin-bottom: 5%;">
              点击“人行道闸管理”，在人员管理中录入人员信息后，再将人脸入库
            </span>
          </el-col>
          <el-col :span=6 :offset=1 style="background: #d7d7d7;opacity: 0.8;border-radius: 12px;">
            <div class="tag">步骤二、录入业主车牌</div>
            <span
              style="font-size: .8rem;color: #333333;display: inline-block;width: 80%;margin: 0 10%;margin-bottom: 5%;">
              点击“停车收费管理”，录入业主车辆信息。
            </span>
          </el-col>
          <el-col :span=6 :offset=1 style="background: #d7d7d7;opacity: 0.8;border-radius: 12px;">
            <div class="tag">步骤三、绑定业主房号</div>
            <span
              style="font-size: .8rem;color: #333333;display: inline-block;width: 80%;margin: 0 10%;margin-bottom: 5%;">
              点击“居民管理”，将人员与房号绑定
            </span>
          </el-col>
        </el-row>
      </div>
      <div v-if="welcolme" style="color: #4cb678;text-align: center;margin-top: 10%;">
        <img src="../../public/img/index/人物.png" alt="">
        <h1 style="font-weight:normal;">欢迎使用轻未来社区</h1>
      </div>
      <!--      <div style="width:25%;display: inline-block ">-->
      <!--        <img src="/img/diandong_car.png" class="sys_meu">-->
      <!--      </div>-->
      <!--      <avue-card :option="option" :data="data" @row-click="rowClick">-->
      <!--      </avue-card>-->
    </basic-container>
  </div>
</template>

<script>
  import { mapGetters } from "vuex";
  import { getLoginEncryptionInfo } from "../api/encryption";
  import { getLoginInfo } from "../util/auth";
  import { getDeviceList } from "../api/system/device"

  export default {
    name: "wel",
    data() {
      return {
        welInfo: '您好，欢迎使用智能垃圾分类站管理平台！',
        sw: true,
        MJPflag: false,
        DZCflag: false,
        CAMflag: false,
        CDCflag: false,
        SHJflag: false,
        RRDflag: false,
        welcolme: false,
      };
    },
    computed: {
      ...mapGetters(["userInfo", 'tenantId', "userInfo"]),
    },
    created() {
      if (this.userInfo.loginName == 'sw') {
        this.sw = false
      }
      this.getDeviceMsg();
    },
    methods: {
      getDeviceMsg() {
        let that = this;
        getDeviceList(this.tenantId, 1, 500).then(resp => {
          resp.data.data.records.forEach(v => {
            if (v.deviceType == "MJP") {
              this.MJPflag = true;
            }
            if (v.deviceType == "DZC") {
              this.DZCflag = true;
            }
            if (v.deviceType == "CAM") {
              this.CAMflag = true;
            }
            if (v.deviceType == "CDC") {
              this.CDCflag = true;
            }
            if (v.deviceType == "SHJ") {
              this.SHJflag = true;
            }
            if (v.deviceType == "RRM") {
              this.RRDflag = true;
            }
          })
          if (that.MJPflag == false && that.DZCflag == false && that.CAMflag == false && that.CDCflag == false && that.SHJflag == false && that.RRDflag == false) {
            that.welcolme = true
          }
        })
      },
      mouseenter(_this) {
        // document.getElementById(_this).style = 'opacity:0.5;float:left;margin: 3%;'
      }, mouseleave(_this) {
        // document.getElementById(_this).style = 'float:left;margin: 3%;'
      },
      rowClick(row) {
        console.log(row);
        const type = row.type;
        const url = row.url;
        let loginForm = JSON.parse(getLoginInfo());
        const loading = this.$loading({
          lock: true,
          text: this.$t('登录中,请稍后'),
          spinner: "el-icon-loading"
        });
        getLoginEncryptionInfo(type, loginForm.username, loginForm.password)
          .then(res => {
            const encryInfo = res.data.data;
            window.open(url + "?Id=" + encryInfo, "_blank");
            loading.close();
          }).catch(() => {
            loading.close();
          })
      },
      jumpPage(url, data) {
          console.log("url=="+url)
        this.$router.push({ path: url, query: data })
      },
    }
  };
</script>

<style scoped="scoped" lang="scss">
  .card {
    width: 20%;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(238, 238, 238, 1);
    box-shadow: 0px 2px 4px 0px rgba(56, 56, 56, 0.03);
    border-radius: 10px;
    float: left;
    margin-left: 4%;
    margin-top: 4%;
  }

  .cardTwo {
    width: 100%;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(238, 238, 238, 1);
    box-shadow: 0px 2px 4px 0px rgba(56, 56, 56, 0.03);
    border-radius: 10px;
    float: left;
    position: absolute;
    bottom: 3%;
  }

  .tag {
    width: 70%;
    margin: 5% 15%;
    background: #FFFFFF;
    border-radius: 12px;
    color: #4CB678;
    font-size: .9rem;
    font-weight: bold;
    text-align: center;
    line-height: 200%;
  }

  /deep/.el-card__body {
    padding: 0;
  }

  /deep/.el-card {
    width: 100%;
    height: 100%;
    background-color: #eff4fd;
    padding-bottom: 100%;
  }

  .wel {
    &__header {
      padding: 25px 40px;
      border-bottom: 1px solid #e8e8e8;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &__info {
      display: flex;
      align-items: center;

      &-img {
        border-radius: 72px;
        display: block;
        width: 72px;
        height: 72px;

        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }

      &-content {
        position: relative;
        margin-left: 24px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }

      &-title {
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 12px;
      }

      &-subtitle {
        position: relative;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
    }

    &__extra {
      &-item {
        position: relative;
        padding: 0 32px;
        display: inline-block;

        &:last-child {
          &::after {
            display: none;
          }
        }

        &:after {
          background-color: #e8e8e8;
          position: absolute;
          top: 30px;
          right: 0;
          width: 1px;
          height: 40px;
          content: "";
        }
      }

      &-title {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 4px;
      }

      &-subtitle {
        color: rgba(0, 0, 0, 0.85);
        font-size: 30px;
        line-height: 38px;
        margin: 0;

        span {
          color: rgba(0, 0, 0, 0.45);
          font-size: 20px;
        }
      }
    }
  }

  /deep/ .data-box .item-info .title {
    font-size: 18px;
    line-height: 40px;
    text-align: center;
  }

  /deep/ .avue-card__item {
    margin-bottom: 16px;
    border: 1px solid #e8e8e8;
    background-color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: rgba(0, 0, 0, .65);
    font-size: 17px;
    line-height: 1.2;
    -webkit-font-feature-settings: "tnum";
    font-feature-settings: "tnum";
    cursor: pointer;
    height: 100px;
    border-radius: 15px;
  }

  /deep/ .avue-card__title {
    color: rgba(0, 0, 0, .85);
    margin-bottom: 12px;
    font-size: 15px;
    position: relative;
    top: 14px;
  }

  .sys_meu {
    transform: scale(0.9);
    width: 30%;
    height: 30%;
  }

  .clearfix:after {
    content: "";
    height: 0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }

  .clearfix {
    zoom: 1;
  }
</style>
