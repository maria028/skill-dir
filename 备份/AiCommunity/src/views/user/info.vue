<template>
  <div>
    <basic-container>
      <avue-tabs :option="option"
                 v-model="form"
                 @change="handleChange"
                 @submit="handleSubmit"></avue-tabs>
    </basic-container>
  </div>
</template>

<script>
    import option from "@/const/user/info";
    import {mapGetters, mapState} from "vuex";
    import {update, updatePassword} from "@/api/system/user";

    export default {
        data() {
            return {
                type: "info",
                option: option,
                form: {}
            };
        },
        computed: {
            ...mapState({}),
            ...mapGetters([])
        },
        created() {
            this.handleWitch();
        },
        methods: {
            handleSubmit() {
                if (this.type === "info") {
                    update(this.form).then(res => {
                        if (res.data.success) {
                            this.$message({
                                type: "success",
                                message: "修改信息成功!"
                            });
                        } else {
                            this.$message({
                                type: "error",
                                message: res.data.msg
                            });
                        }
                    })
                } else {
                    updatePassword(this.form.oldPassword, this.form.newPassword, this.form.newPassword1).then(res => {
                        if (res.data.success) {
                            this.$message({
                                type: "success",
                                message: "修改密码成功!"
                            });
                        } else {
                            this.$message({
                                type: "error",
                                message: res.data.msg
                            });
                        }
                    })
                }
                // this.$message({
                //   message: this.form,
                //   type: "success"
                // });
            },
            handleWitch() {
                if (this.type === "info") {
                    this.form = {
                        username: "smallwei",
                        name: "smallwei",
                        phone: "1888888888888",
                        detail: "这是一个个性签名"
                    };
                } else if (this.type === "password") {
                    this.form = {
                        oldpassword: '',
                        newpassword: '',
                        newpasswords: ''
                    };
                }
            },
            handleChange(item) {
                this.type = item.prop;
                this.handleWitch();
            }
        }
    };
</script>

<style>
</style>
