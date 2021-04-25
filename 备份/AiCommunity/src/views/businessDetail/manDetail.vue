<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form label-width="30%" :model="query">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="小区名称">
                            <avue-cascader v-model="query.mallId" :dic="communityOptions" :props="defaultProp"
                                placeholder="全部" clearable style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <!-- <el-form-item label="开门方式">
                            <el-select v-model="query.operation" clearable style="width: 100%;">
                                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="用户名字">
                            <el-input v-model="query.userName" clearable placeholder="用户名称" style="width: 100%;">
                            </el-input>
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
                            <el-button type="success" size="small" @click="queryMsg" icon="el-icon-search"
                                style="background-color: #4cb678;float: right;margin-top: 7%;">
                                查询
                            </el-button>
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
                        <el-table-column type="index" width="50" fixed label="序号" align="center">
                            <template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}}
                                </span></template>
                        </el-table-column>
                        <el-table-column prop="mallName" width="120" label="小区名称" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="deviceName" label="设备名称" min-width align="center"></el-table-column>
                        <el-table-column prop="inOutType" label="出入类型" min-width align="center"></el-table-column>
                        <el-table-column prop="houseId" label="房号" min-width align="center"></el-table-column>
                        <el-table-column prop="userName" label="用户名字" min-width align="center"></el-table-column>
                        <el-table-column prop="userPhone" label="手机号码" min-width align="center"></el-table-column>
                        <el-table-column prop="operation" label="开门方式" min-width align="center"></el-table-column>
                        <el-table-column prop="createTime" label="时间" min-width align="center"></el-table-column>
                        <el-table-column prop="cardNo" label="卡号" min-width align="center"></el-table-column>
                        <el-table-column label="记录图片" min-width align="center">
                            <template scope="scope">
                                <img :src="scope.row.pic" width="100%">
                            </template>
                        </el-table-column>
                        <el-table-column prop="owner" label="是否业主" min-width align="center"></el-table-column>
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
    import { getPersonList, getDeviceList } from "../../api/business"

    export default {
        name: 'manDetail',
        data() {
            return {
                query: {},
                communityOptions: [],
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
                // typeOptions: [{
                //     label: '刷卡',
                //     value: 'card',
                // }, {
                //     label: '刷脸',
                //     value: 'face',
                // }],
                tableData: [],
                deviceList: [],
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
                getDeviceList(null, "MJP").then(resp => {
                    this.deviceList = resp.data.data.records;
                })
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
                    this.$message.warning("请选择开始日期");
                    return
                }
                if (this.query.endDate == '' || this.query.endDate == null) {
                    this.$message.warning("请选择结束日期");
                    return
                }
                if (this.query.operation == '') {
                    delete this.query.operation;
                }
                if (this.query.userName == '') {
                    delete this.query.userName;
                }
                let that = this
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getPersonList(this.query.mallId[0], this.query.userName, this.query.startDate,
                    this.query.endDate, this.pageSize, this.pageNum).then(resp => {
                        that.tableData = resp.data.data.records;
                        for (var j = 0; j < that.tableData.length; j++) {
                            for (var i = 0; i < that.communityOptions.length; i++) {
                                if (that.tableData[j].mallId == that.communityOptions[i].orgId) {
                                    that.tableData[j].mallName = that.communityOptions[i].orgName
                                }
                            }
                            that.tableData[j].inOutType = that.tableData[j].inOutType == 1 ? "入小区" : "出小区";
                            that.tableData[j].operation = that.tableData[j].operation == "face" ? "刷脸" : "刷卡";
                            that.tableData[j].owner = that.tableData[j].houseMemberId == "" ? "否" : "是";
                            that.tableData[j].pic = (that.tableData[j].pic).indexOf("http") == -1 ? "https://sq.wewins.cn" + that.tableData[j].pic : that.tableData[j].pic;
                            if(that.tableData[j].operation == "刷卡"){
                                that.tableData[j].pic = "/img/card.png"
                            }
                            that.deviceList.forEach(v => {
                                if(that.tableData[j].deviceNo == v.deviceNo){
                                    that.tableData[j].deviceName = v.deviceName
                                }
                            })
                        }
                        that.pageSize = resp.data.data.size;
                        that.pageNum = resp.data.data.current;
                        that.total = resp.data.data.total;
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
        },
    }
</script>

<style lang="scss" scoped>
    .col {
        height: 35px;
    }

    @import "../../styles/style.scss";
</style>
