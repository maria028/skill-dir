<template>
    <div style="width: 98%; margin: 0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form label-width="30%" :model="query">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="小区名称">
                            <avue-cascader v-model="query.mallId" :dic="communityOptions" :props="defaultProp"
                                placeholder="全部" clearable style="width: 100%;" @change="selectDevice"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="充电桩">
                            <el-select v-model="query.deviceNo" placeholder="全部" clearable style="width: 100%;"
                                :disabled="flag">
                                <el-option v-for="item in deviceOptions" :key="item.orgId" :label="item.orgName"
                                    :value="item.orgId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset="10" class="col">
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
                    <el-button icon="el-icon-plus" type="success" size="small" @click="addRate"
                        style="float: left;background-color: #4cb678;">新增</el-button>
                </el-col>
                <el-col :span=24>
                    <el-table :data="tableData" stripe :header-cell-style="{background:'#D8E3FA'}"
                        :default-sort="{prop: '', order: ''}" border>
                        <el-table-column type="index" width="50" fixed label="序号" align="center">
                            <template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}}
                                </span></template>
                        </el-table-column>
                        <el-table-column prop="mallName" label="小区名称" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="deviceName" label="充电桩" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="feeType" label="费率类型" min-width align="center">
                        </el-table-column>
                        <el-table-column label="费率详情" min-width align="center">
                            <template slot-scope="scope">
                                <div v-for="item in scope.row.configOptions">{{item.fee}}元/{{item.times}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" min-width align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="settingChange(scope.row)">修改</el-button>
                                <el-button type="text" @click="settingDel(scope.row)" v-show="scope.row.mallId != 0">
                                    删除</el-button>
                            </template>
                        </el-table-column>
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
        <el-dialog title="设置充电费用" :visible.sync="dialogFormVisible" top="100px" width="60%" center>
            <el-form label-width="30%" :model="parameter">
                <el-form-item label="费率设置范围">
                    <el-radio v-model="parameter.type" label="1">按小区设置</el-radio>
                    <el-radio v-model="parameter.type" label="2">按设备设置</el-radio>
                </el-form-item>
                <el-form-item label="选择小区" v-if="parameter.type == 1" label-width="26%">
                    <avue-cascader v-model="parameter.mallId" :dic="communityOptions" :props="defaultProp"
                        placeholder="全部" clearable></avue-cascader>
                </el-form-item>
                <el-form-item label="选择设备" v-if="parameter.type == 2" label-width="26%">
                    <avue-cascader v-model="parameter.mallId" :dic="communityOptions" :props="defaultProp"
                        placeholder="全部" clearable @change="selectDevice"></avue-cascader>
                    <span> — </span>
                    <el-select v-model="parameter.deviceNo" placeholder="全部" clearable :disabled="flag">
                        <el-option v-for="item in deviceOptions" :key="item.orgId" :label="item.orgName"
                            :value="item.orgId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="按次设置费率"></el-form-item>
                <el-row style="width:85%;margin-left: 15%;" v-for="(item,index) in parameter.list" :key="index">
                    <el-col :span=10>
                        <el-form-item label="充电金额">
                            <el-input placeholder="请输入" v-model="parameter.list[index].money" style="width: 80%;">
                            </el-input><span style="margin-left: 3%;">元</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=10>
                        <el-form-item label="可充时长">
                            <el-input placeholder="请输入" v-model="parameter.list[index].time" style="width: 80%;">
                            </el-input><span style="margin-left: 3%;">小时</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2>
                        <el-button type="primary" icon="el-icon-plus" circle size="small" @click="addList"
                            v-if="index == 0" style="float: right;margin-top: 5%;">
                        </el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=24>
                        <el-form-item label-width="0" style="text-align: center;">
                            <el-button icon="el-icon-circle-plus-outline" type="primary" size="small" @click="submit"
                                style="margin:0 5px;">保存</el-button>
                            <el-button icon="el-icon-circle-close" size="small" @click="close" style="margin:0 5px;">取消
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { getUserMessage } from "../../api/house"
    import { getPermissionDevice, getConfig, rateSubmit } from "../../api/business"

    export default {
        name: 'bickRate',
        data() {
            return {
                query: {
                    mallId: [],
                    deviceNo: '',
                },
                tableData: [],
                communityOptions: [],
                deviceOptions: [],
                allDeviceOptions: [],
                flag: false,
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
                parameter: {
                    type: "1",
                    list: [{ money: '', time: '' }]
                },
                dialogFormVisible: false,
                pageSize: 50,
                pageNum: 1,
                total: 0,
            }
        },
        computed: {
            ...mapGetters(["tenantId", "userInfo"])
        },
        created() {
            this.getOrganization();
            this.queryMsg();
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
                getPermissionDevice(userOrg, userOrgDesc, this.roleType, "CDB").then(resp => {
                    this.screenDevice(resp.data.data)
                })
            },
            screenDevice(data) {
                let that = this
                data.forEach((v, i) => {
                    if (v.children) {
                        for (var i = 0; i < v.children.length; i++) {
                            if (v.children[i].children) {
                                that.screenDevice(v.children)
                                return
                            } else if (v.children[i].orgName.length >= 10) {
                                v.children.forEach(k => {
                                    that.deviceOptions.push(k)
                                })
                                that.allDeviceOptions.push(v)
                                return
                            }
                        }
                    }
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
            selectDevice(val) {
                if (val.length != 0 && typeof val == "object") {
                    this.flag = false;
                    this.deviceOptions = []
                    this.allDeviceOptions.forEach(v => {
                        if (v.orgId == val[0]) {
                            delete this.query.deviceNo
                            this.deviceOptions = v.children
                        }
                    })
                } else if (val.length == 0) {
                    delete this.query.deviceNo
                    this.flag = true;
                }
            },
            queryMsg() {
                if (this.query.deviceNo == "" || this.query.deviceNo == null) {
                    delete this.query.deviceNo;
                }
                let that = this
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getConfig(this.query.mallId[0], this.query.deviceNo, this.pageSize, this.pageNum).then(resp => {
                    this.tableData = resp.data.data.records;
                    this.tableData.forEach(v => {
                        let arr = [];
                        v.configOptions = []
                        if (v.id == 0) {
                            v.mallName = "—";
                            v.deviceName = "—";
                        }
                        v.feeType = v.feeType == 0 ? "按次设置费率" : "—";
                        v.config.split(";").forEach(j => {
                            j.split(",").forEach((k, i) => {
                                arr.push(k)
                            })
                        })
                        for (var i = 0; i < arr.length; i++) {
                            if (i % 2 == 0) {
                                v.configOptions.push({ fee: arr[i], times: arr[i + 1] == 0 ? "充满" : arr[i + 1] + "小时" });
                            }
                        }
                    })
                    this.pageSize = resp.data.data.size;
                    this.pageNum = resp.data.data.current;
                    this.total = resp.data.data.total;
                    loading.close();
                })
            },
            addRate() {
                this.dialogFormVisible = true;
                this.parameter = {
                    type: "1",
                    list: [{ money: '', time: '' }]
                };
            },
            addList() {
                const item = { money: '', time: '' };
                this.parameter.list.push(item)
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.queryMsg();
            },
            handleCurrentChange(val) {
                this.pageNum = val ? val : 1;
                this.queryMsg();
            },
            submit() {
                if (this.parameter.mallId.length == 0 || this.parameter.mallId == null) {
                    this.$message.warning("请选择小区")
                    return
                }
                if (this.parameter.type == 1) {
                    this.parameter.deviceNo = 0;
                }
                if (this.parameter.type == 2 && (this.parameter.deviceNo == "" || this.parameter.deviceNo == null)) {
                    this.$message.warning("请选择设备")
                    return
                }
                let config = '';
                for (var i = 0; i < this.parameter.list.length; i++) {
                    if ((this.parameter.list[i].money == '' || this.parameter.list[i].money == null) || (this.parameter.list[i].time == "" || this.parameter.list[i].time == null)) {
                        this.parameter.list.splice(i, 1);
                        i--;
                    }
                }
                this.parameter.list.forEach((v, i) => {
                    if (v.money != "" && v.time != "") {
                        if (i != this.parameter.list.length - 1) {
                            config = config + v.money + "," + v.time + ";";
                        } else {
                            config = config + v.money + "," + v.time
                        }
                    }
                })
                if (config == "") {
                    this.$message.warning("请输入费率");
                    return
                }
                rateSubmit(this.parameter.mallId[0], this.parameter.deviceNo, "0", config, this.parameter.id).then(resp => {
                    this.$message.success("设置成功");
                    this.dialogFormVisible = false;
                    this.queryMsg();
                })
            },
            close() {
                this.dialogFormVisible = false;
            },
            settingChange(row) {
                this.dialogFormVisible = true;
                console.log(row);
                let arr = [];
                row.config.split(";").forEach(v => {
                    v.split(",").forEach(k => {
                        arr.push(k)
                    })
                })
                const item = [];
                for (var i = 0; i < arr.length; i++) {
                    if (i % 2 == 0) {
                        item.push({ money: arr[i], time: arr[i + 1] });
                    }
                }
                this.parameter = {
                    type: '2',
                    mallId: [row.mallId],
                    deviceNo: row.deviceNo,
                    id: row.id,
                    list: item
                }
            },
            settingDel(row) {
                this.$confirm('确定删除?', '提示', {
                    cancelButtonText: '取消',
                    confirmButtonText: '确定',
                    type: 'warning'
                }).then(() => {
                    rateSubmit(row.mallId, row.deviceNo, "0", row.config, row.id, 1).then(_ => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryMsg();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    .col {
        height: 35px;
    }

    .el-form-item {
        margin-bottom: 10px;
    }

    @import "../../styles/style.scss";
</style>