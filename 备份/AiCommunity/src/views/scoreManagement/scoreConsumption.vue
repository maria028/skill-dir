<template>
    <div style="margin: 0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form label-width="30%" :model="query">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="小区名字">
                            <avue-cascader v-model="query.mallId" :dic="communityOptions" :props="defaultProp"
                                placeholder="全部" clearable style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="业主房号">
                            <el-input v-model="query.fullRoom" clearable style="width: 100%;"
                                placeholder="请输入 例如6-1-103"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="开始时间">
                            <el-date-picker v-model="query.startDate" type="date" placeholder="选择日期"
                                :picker-options="pickerOptionsStart" value-format="yyyy-MM-dd" clearable
                                style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="结束时间">
                            <el-date-picker v-model="query.endDate" type="date" placeholder="选择日期"
                                :picker-options="pickerOptionsEnd" value-format="yyyy-MM-dd" clearable
                                style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=2 :offset=22 class="col">
                        <el-form-item>
                            <el-button type="success" size="small" icon="el-icon-search" @click="queryMsg"
                                style="background-color: #4cb678;float: right;margin-top: 7%;">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card>
            <el-row>
                <el-col :span=24>
                    <el-table :data="tableData" stripe :header-cell-style="{background:'#D8E3FA'}"
                        :default-sort="{prop: '', order: ''}" border>
                        <el-table-column prop="mallName" label="小区名称" min-width align="center"></el-table-column>
                        <el-table-column prop="fullRoom" label="业主房号" min-width align="center"></el-table-column>
                        <el-table-column prop="value" label="消费积分" min-width align="center"></el-table-column>
                        <!-- <el-table-column prop="" label="抵扣金额(元)" min-width align="center"></el-table-column> -->
                        <el-table-column prop="reason" label="消费说明" min-width align="center"></el-table-column>
                        <el-table-column prop="createTime" label="消费时间" min-width align="center"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pageNum" :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="total" style="float: right;"
                        background>
                    </el-pagination>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { getUserMessage } from "../../api/house"
    import { getScoreLogList } from "../../api/business"

    export default {
        name: 'scoreGet',
        data() {
            return {
                query: { mallId: [], fullRoom: '', startDate: '', endDate: '' },
                communityOptions: [],
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
                tableData: [],
                pageSize: 50,
                pageNum: 1,
                total: 0,
                pickerOptionsStart: {
                    disabledDate: time => {
                        let endDateVal = this.query.endDate;
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.query.startDate;
                        if (beginDateVal) {
                            return (time.getTime() < new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
                            );
                        }
                    }
                }
            }
        },
        computed: {
            ...mapGetters(["tenantId", "userInfo"])
        },
        created() {
            this.getOrganization();
            if (this.$route.query.mallId) {
                let route = this.$route.query
                this.query.fullRoom = route.fullRoom;
                this.query.mallId = [];
                this.query.mallId.push(route.mallId);
                var myDate = new Date();
                var year = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var date = myDate.getDate();
                this.query.startDate = year + '-' + this.conver(month - 3) + "-" + this.conver(date);
                this.query.endDate = year + '-' + this.conver(month) + "-" + this.conver(date);
                this.queryMsg();
            }
        },
        methods: {
            // 获取组织结构
            getOrganization() {
                let userOrgList = this.userInfo.userOrgList;
                let roleData = this.userInfo.roleList;
                let userOrgDesc = '';
                let userOrg = "";
                if (roleData.length > 0) {
                    this.roleType = roleData[0].roleType;
                }
                userOrgList.forEach(v => {
                    let orgId = v.orgId;
                    let orgDesc = v.orgDesc;
                    userOrgDesc = userOrgDesc + orgDesc + "#";
                    userOrg = userOrg + orgId + "#";
                });
                let that = this;
                getUserMessage(userOrg, userOrgDesc, this.roleType).then(resp => {
                    this.screenRegion(resp.data.data);
                });
            },
            screenRegion(data) {
                data.forEach(v => {
                    if (v.children) {
                        this.screenRegion(v.children)
                    } else if (v.orgId.length >= 10) {
                        this.communityOptions.push(v)
                    }
                })
            },
            queryMsg() {
                if (this.query.startDate == '' || this.query.startDate == null) {
                    this.$message.warning("请选择开始时间");
                    return
                }
                if (this.query.endDate == '' || this.query.endDate == null) {
                    this.$message.warning("请选择结束时间");
                    return
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getScoreLogList(this.query.mallId[0], this.query.fullRoom, this.query.startDate, this.query.endDate, -1, this.pageSize, this.pageNum).then(resp => {
                    this.tableData = resp.data.data.records;
                    this.pageSize = resp.data.data.size;
                    this.pageNum = resp.data.data.current;
                    this.total = resp.data.data.total;
                    loading.close();
                })
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.queryMsg();
            },
            handleCurrentChange(val) {
                this.pageNum = val ? val : 1;
                this.queryMsg();
            },
            conver(s) {
                return s < 10 ? '0' + s : s;
            },
        }
    }
</script>

<style lang="scss" scoped>
    .col {
        height: 35px;
    }

    @import "../../styles/style.scss";
</style>