<template>
  <div id="app" class="content-bg" @click="isTimeOut">
    <!--// 缓存组件跳转的页面-->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" class="ui-view" transition-mode="out-in"></router-view>
    </keep-alive>
    <!--非缓存组件跳转页面-->
    <router-view v-if="!$route.meta.keepAlive" class="ui-view" transition-mode="out-in"></router-view>
  </div>


</template>

<script>

    export default {
        name: "app",
        data() {
            return {
              lastTime: new Date().getTime(), // 最后一次点击的时间
              currentTime: new Date().getTime(), // 当前点击的时间
              timeOut: 3600 * 1000, // 设置超时时间:60分钟
              t1: ''
            };
        },
        watch: {},
        created() {
            // this.$notify.success({
            //   title: "授权信息",
            //   dangerouslyUseHTMLString: true,
            //   message:
            //     '<p>欢迎使用Saber!</p>' +
            //     '<p>该系统采用BladeX与AvueX开发，</p>' +
            //     '<p>若要商用强烈推荐高度定制的商业化框架，具体授权信息请访问如下地址。️</p>' +
            //     '</br>' +
            //     '<p>BladeX 授权地址：<a target="_blank" href="https://bladex.vip/#/vip">点击授权</a></p>' +
            //     '<p>AvueX 授权地址：<a target="_blank" href="https://avuejs.com/vip">点击授权</a></p>',
            //   duration: 20000,
            //   type: "success"
            // });
            // setTimeout(()=>{
            //   this.$notify.success({
            //     title: "开发手册",
            //     dangerouslyUseHTMLString: true,
            //     message:
            //       '<p>后端开发手册：<a target="_blank" href="https://www.kancloud.cn/smallchill/blade">点击查看</a></p>'+
            //       '<p>前端开发手册：<a target="_blank" href="https://www.kancloud.cn/smallwei/avue">点击查看</a></p>',
            //     duration: 20000,
            //     type: "success"
            //   });
            // },500);
            this.lastTime = new Date().getTime()
        },mounted() {
          this.t1 = setInterval(this.tTime, 3000);
        },
        methods: {
          isTimeOut () {
            this.lastTime = new Date().getTime()  //当界面被点击更新点击时间
          },
          tTime() {
            this.currentTime = new Date().getTime();
            if (this.currentTime -this.lastTime > this.timeOut) {
              //未登录状态
              if(this.$route.path == '/login'){
                this.lastTime = new Date().getTime();
              }else{
                clearInterval(this.t1)
                this.$alert('登录超时，请重新登录', '提示', {
                  confirmButtonText: '确定',
                  callback: action =>{
                    this.$store.dispatch("LogOut").then(() => {
                        this.$router.push({path: "/login"});
                         this.$router.go(0);
                    });
                  }
                });
              }
            }
          }
        },
        computed: {}
    };
</script>
<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
  }

  .content-bg {
    background-color: #f3f8f7;
  }
</style>
