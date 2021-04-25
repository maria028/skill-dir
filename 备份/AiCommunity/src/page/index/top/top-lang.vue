<template>
  <el-dropdown trigger="click"
               @command="handleSetLanguage">
    <i class="icon-zhongyingwen"></i>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="language==='zh'"
                        command="zh">中文
      </el-dropdown-item>
      <el-dropdown-item :disabled="language==='en'"
                        command="en">English
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "top-lang",
        data() {
            return {};
        },
        created() {
            var lang = navigator.language||navigator.userLanguage;//常规浏览器语言和IE浏览器
            lang = lang.substr(0, 2);//截取lang前2位字符
            console.log("lang=="+lang);
            if(lang == 'zh'){
                this.handleSetLanguage('zh');
            }else{
                this.handleSetLanguage('en');
            }
        },
        mounted() {
        },
        computed: {
            ...mapGetters(["language", "tag"])
        },
        props: [],
        methods: {
            handleSetLanguage(lang) {
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

<style lang="scss" scoped>
</style>
