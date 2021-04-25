<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom:1%;">
            <el-form v-model="query" label-width="30%">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="手机号码">
                            <!-- <el-input v-model="query.phone" clearable placeholder="手机号码"></el-input> -->
                            <el-autocomplete class="inline-input" v-model="query.phone" :fetch-suggestions="querySearch"
                                style="width: 100%;" placeholder="手机号码" :trigger-on-focus="false" @select="handleSelect"
                                clearable></el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="注册时间">
                            <el-date-picker v-model="query.createTime" type="date" placeholder="选择日期"
                                style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="小区名称">
                            <avue-cascader v-model="query.mallId" :dic="communityOptions" :props="defaultProp"
                                placeholder="全部" clearable style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=4 class="col">
                        <el-form-item>
                            <el-button type="success" icon="el-icon-search" size="small"
                                style="background-color: #4cb678;float: right;margin-top: 7%;" @click="getData">查询
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <basic-container>
            <!-- <div>
                <avue-crud :data="tableData" :option="option" v-model="obj" :page="page" :before-close="beforeOpen"
                    @on-load="getData" @size-change="sizeChange" @current-change="currentChange"
                    @search-reset="searchReset" @search-change="searchChange">
                    <template slot="avatar" slot-scope="scope">
                        <el-image v-if="scope.row.avatar != ''" style="width: 60px; height: 60px"
                            :src="scope.row.avatar" fit="contain" lazy />
                    </template>
                    <template slot-scope="scope" slot="menu">
                        <el-button icon="el-icon-edit" size="small" type="text">修改密码</el-button>
                    </template>
                </avue-crud>
            </div> -->
            <el-row>
                <el-col :span=24>
                    <el-table :data="tableData" stripe :header-cell-style="{background:'#D8E3FA'}"
                        :default-sort="{prop: '', order: ''}" border>
                        <el-table-column prop="mallName" label="小区名称" min-width align="center"></el-table-column>
                        <el-table-column prop="phone" label="手机号码" min-width align="center"></el-table-column>
                        <el-table-column prop="nickName" label="昵称" min-width align="center"></el-table-column>
                        <el-table-column label="头像" min-width align="center">
                            <template scope="scope">
                                <img style="width: 60px; height: 60px" :src="scope.row.avatar">
                            </template>
                        </el-table-column>
                        <el-table-column prop="accountId" label="用户账户" min-width align="center"></el-table-column>
                        <el-table-column prop="createTime" label="注册时间" min-width align="center"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-pagination @size-change="sizeChange" @current-change="currentChange"
                        :current-page="page.currentPage" :page-sizes="[10, 20, 30, 40, 50, 100]" :page-size="page.pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="page.total" style="float: right;"
                        background>
                    </el-pagination>
                </el-col>
            </el-row>
        </basic-container>
    </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { getAccountList } from "../../api/user";
    import { getUserMessage } from "../../api/house";

    export default {
        name: "userList",
        data() {
            return {
                obj: {},
                tableData: [],
                restaurants: [],
                query: {},
                communityOptions: [],
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
                page: {
                    pageSize: 50,
                    currentPage: 1,
                    total: 0
                },
                option: {
                    searchMenuSpan: true,
                    page: true,
                    stripe: true,
                    border: true,
                    align: "center",
                    header: false,
                    addBtn: false,
                    delBtn: false,
                    editBtn: false,
                    menu: false,
                    column: [
                        {
                            label: "注册帐号",
                            prop: "loginName",
                            hide: true
                        }, {
                            label: "小区名称",
                            prop: "mallName",
                        }, {
                            label: "手机号码",
                            prop: "phone",
                            // search:true
                        }, {
                            label: "支付宝Id",
                            prop: "aliId",
                            hide: true
                        }, {
                            label: "微信Id",
                            prop: "wxId",
                            hide: true
                        }, {
                            label: "昵称",
                            prop: "nickName",
                        }, {
                            label: "头像",
                            prop: "avatar",
                            slot: true
                        }, {
                            label: "用户账户",
                            prop: "accountId",
                        }, {
                            label: "注册时间",
                            prop: "createTime",
                            // search:true,
                            type: "date"
                        }
                    ]
                }
            }
        }, mounted() {

        },
        computed: {
            ...mapGetters(["tenantId", "userInfo"])
        },
        created() {
            this.getOrganization();
            this.getData();
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
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect(item) {
                console.log('*-*-*-' + this.query.phone);
            },
            getData() {
                if (this.query.phone == '') {
                    delete this.query.phone;
                }
                if (this.query.mallId) {
                    if (this.query.mallId.length != 0) {
                        this.query.mallId = this.query.mallId[this.query.mallId.length - 1];
                    } else {
                        delete this.query.mallId
                    }
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getAccountList(this.page.currentPage, this.page.pageSize, this.query.createTime, this.query.phone, this.query.mallId).then(res => {
                    const data = res.data.data;
                    const records = data.records;
                    let phonrArr = new Array();
                    for (var i = 0; i < records.length; i++) {
                        phonrArr.push({ value: records[i].phone })
                    }
                    this.restaurants = phonrArr;
                    this.tableData = records;
                    this.page.total = data.total;
                    loading.close();
                });
            }, beforeOpen() {

            }, sizeChange(val) {
                // this.page.currentPage = 1
                this.page.pageSize = val
                this.getData()
            }, currentChange(val) {
                // this.$message.success('页码' + val)
                this.page.currentPage = val ? val : 1
                this.getData()
            }, searchReset() {
                this.query = {};
                this.getData();
            }, searchChange(params, done) {
                this.query = params;
                console.log(params);
                let createTime = params.createTime;
                if (createTime != null) {
                    createTime = this.formatDate(createTime);
                    this.query.createTime = createTime;
                }

                this.getData();
                done();
            }, formatDate(shijianchuo) {
                //时间戳是整数，否则要parseInt转换
                let time = new Date(shijianchuo); // 需要使用Date格式进行日期转化，若是时间戳、字符串时间，需要通过new Date(..)转化

                let y = time.getFullYear();

                let m = time.getMonth() + 1;

                let d = time.getDate();

                let h = time.getHours();

                let mm = time.getMinutes();

                let s = time.getSeconds();

                return y + '-' + this.isZero(m) + '-' + this.isZero(d)

            }, isZero(m) {

                return m < 10 ? '0' + m : m

            }
        }
    }
</script>

<style lang="scss" scoped>
    /deep/.el-table--small {
        font-size: 14px;
    }

    /deep/.avue-crud .el-table th {
        color: #909399;
    }

    .col {
        height: 35px;
    }

    /deep/.el-button--primary {
        background-color: #4cb678;
        border-color: #4cb678
    }

    /deep/.avue-crud .el-table th {
        background: #F5F7FA;
    }

    /deep/.avue-crud {
        width: 100%;
    }

    @import "../../styles/style.scss"
</style>