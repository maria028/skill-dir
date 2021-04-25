<template>
  <div class="avue-contail"
       :class="{'avue--collapse':isCollapse}" >
    <div class="avue-header" :class="{mHide:isPageFullScreen==true}">
      <!-- 顶部导航栏 -->
      <top/>
    </div>

    <div class="avue-layout">
      <div class="avue-left" :class="{mHide:isPageFullScreen==true}">
        <!-- 左侧导航栏 -->
        <sidebar/>
      </div>
      <div class="avue-main" :class="{mAvueMain:isPageFullScreen==true}">
        <!-- 顶部标签卡 -->
        <tags :class="{mHide:isPageFullScreen==true}"/>
        <!-- 主体视图层 -->
        <el-scrollbar style="height:100%">
          <keep-alive>
            <router-view class="avue-view"
                         v-if="$route.meta.keepAlive"/>
          </keep-alive>
          <router-view class="avue-view"
                       v-if="!$route.meta.keepAlive"/>
        </el-scrollbar>

      </div>
    </div>
    <!-- <el-footer class="avue-footer">
      <img src="/svg/logo.svg"
           alt=""
           class="logo">
      <p class="copyright">© 2018 Avue designed by smallwei</p>
    </el-footer> -->
    <div class="avue-shade"
         @click="showCollapse"></div>
  </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import admin from "@/util/admin";
    import {vaildatePc,validatenull} from "@/util/validate";
    import {getStore,setStore} from "../../util/store";
    import {calcDate} from "../../util/date";

    export default {
        components: {
            top: resolve => {
                require(['./top/'], resolve)
            },
            tags: resolve => {
                require(['./tags'], resolve)
            },
            sidebar: resolve => {
                require(['./sidebar/'], resolve)
            }
        },
        name: "index",
        data() {
            return {
                //刷新token锁
                refreshLock: false,
                //刷新token的时间
                refreshTime: "",
                isPc: true
            };
        },
        created() {
            //实时检测刷新token
             this.refreshToken();
            //判断是否是PC端
            const isPC = vaildatePc();
            this.isPc = isPC;

        },
        mounted() {
            this.init();

        },
        computed: mapGetters(["isLock", "isCollapse", "website", "userInfo", "isPageFullScreen"]),
        props: [],
        methods: {
            showCollapse() {
                this.$store.commit("SET_COLLAPSE");
            },
            // 屏幕检测
            init() {
                this.$store.commit("SET_SCREEN", admin.getScreen());
                window.onresize = () => {
                    setTimeout(() => {
                        this.$store.commit("SET_SCREEN", admin.getScreen());
                    }, 0);
                };
            },
            // 10分钟检测一次token
            refreshToken() {
               // this.refreshTime = setInterval(() => {
               //   const token = getStore({
               //     name: "token",
               //     debug: true
               //   });
               //   const date = calcDate(token.datetime, new Date().getTime());
               //   if (validatenull(date)) return;
               //   if (!(date.seconds >= this.website.tokenTime) && !this.refreshLock) {
               //     this.refreshLock = true;
               //     // this.$store
               //     //   .dispatch("RefeshToken")
               //     //   .then(() => {
               //     //     this.refreshLock = false;
               //     //   })
               //     //   .catch(() => {
               //     //     this.refreshLock = false;
               //     //   });
               //   }
               // }, 10000);
             }
        }
    };
</script>
<style lang="scss" scoped>
  .mHide {
    display: none;
  }

  .mAvueMain {
    position: absolute;
    left: 0px !important;
    padding: 0;
    padding-bottom:0px;
    width: calc(100% - 0px);
    height: calc(100% - 0px);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
  }
  /deep/.avue-logo_title {
    display: block;
    text-align: center;
    font-weight: 300;
    font-size: 16px;
    background-color: #4cb678;
  }
</style>
