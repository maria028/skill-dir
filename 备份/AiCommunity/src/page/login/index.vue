<template>
  <div style="height: 100%">
    <div class="login-container"
         @keyup.enter.native="handleLogin">
      <img src="/img/login_bg_2.png" style="position: fixed;left: 0px;bottom: 0px;width: 60%">
      <div style="position: fixed;right: 0px;bottom: 0px">
        <userLogin v-if="activeName==='user'"></userLogin>
      </div>
    </div>

  </div>
</template>
<script>
    import {mapGetters} from "vuex";
    import {dateFormat} from "@/util/date";
    import {vaildatePc, validatenull} from "@/util/validate";


    export default {
        name: "login",
        components: {
            topLang: resolve => {
                require(['@/page/index/top/top-lang'], resolve)
            },
            topColor: resolve => {
                require(['@/page/index/top/top-color'], resolve)
            },
            userLogin: resolve => {
                require(['./userlogin'], resolve)
            },
            codeLogin: resolve => {
                require(['./codelogin'], resolve)
            },
            thirdLogin: resolve => {
                require(['./thirdlogin'], resolve)
            }
        },
        data() {
            return {
                time: "",
                activeName: "user",
                isPc: true,
                isFullScreen: false
            };
        },
        watch: {
            $route() {
                const params = this.$route.query;
                this.socialForm.state = params.state;
                this.socialForm.code = params.code;
                if (!validatenull(this.socialForm.state)) {
                    const loading = this.$loading({
                        lock: true,
                        text: `${
                            this.socialForm.state === "WX" ? "微信" : "QQ"
                        }登录中,请稍后。。。`,
                        spinner: "el-icon-loading"
                    });
                    setTimeout(() => {
                        loading.close();
                    }, 2000);
                }
            }
        },
        created() {
            this.$store.commit("SET_PAGE_FULL_SCREEN", false);
            this.$store.commit("SET_RECORD_QUERY_PARAM", null);
            this.getTime();
            const isPC = vaildatePc();
            this.isPc = isPC;
            var lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
            lang = lang.substr(0, 2);//截取lang前2位字符
            console.log("lang=="+lang);
            if(lang == 'zh'){
                this.handleSetLanguage('zh');
            }else{
                this.handleSetLanguage('en');
            }
            setInterval(() => {
                this.getTime();
            }, 1000);
        },
        mounted() {
        },
        computed: {
            ...mapGetters(["website","tag"])
        },
        props: [],
        methods: {
            getTime() {
                this.time = dateFormat(new Date());
            },    handleSetLanguage(lang) {
                this.$i18n.locale = lang;
                this.$store.commit("SET_LANGUAGE", lang);
                let tag = this.tag;
                let title = this.$router.$avueRouter.generateTitle(
                    tag.label,
                    (tag.meta || {}).i18n
                );
                //根据当前的标签也获取label的值动态设置浏览器标题
                this.$router.$avueRouter.setTitle(title);
            }

        }
    };
</script>

<style lang="scss">
  @import "@/styles/login.scss";
</style>
