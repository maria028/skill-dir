<template>
    <div style="width: 98%;margin: 0 1%;">
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
                        <el-form-item label="设备编号">
                            <!-- <avue-cascader v-model="query.deviceNo" :dic="deviceOptions" :props="defaultProp"
                                placeholder="全部" clearable style="width: 100%;" @change="getDeviceNo"></avue-cascader> -->
                            <el-select v-model="query.deviceNo" placeholder="全部" clearable style="width: 100%;"
                                :disabled="flag">
                                <el-option v-for="item in deviceOptions" :key="item.orgId" :label="item.orgName"
                                    :value="item.orgId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=10 class="col">
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
                        <el-table-column type="index" width="50" fixed label="序号" align="center">
                            <template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}}
                                </span></template>
                        </el-table-column>
                        <el-table-column prop="mallName" label="小区" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="deviceNo" label="设备编号" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="maxPower" label="充电站最大功率(W)" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="overloadPower" label="单个插座的过载功率(W)" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="overloadDuration" label="过载持续时间(ms)" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="noLoadPower" label="单个插座的空载功率(W)" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="startNoLoadTime" label="刚上电时的空载时间(ms)" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="noLoadTime" label="充电过程中的空载时间(ms)" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="fullPower" label="充满电时的功率(W)" min-width align="center">
                        </el-table-column>
                        <el-table-column prop="fullTime" label="充满时间(s)" min-width align="center">
                        </el-table-column>
                        <el-table-column label="操作" min-width align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="settingShow(scope.row)">参数设置</el-button>
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
        <el-dialog title="参数设置" :visible.sync="dialogFormVisible" top="100px" width="60%" center>
            <el-form label-width="45%" :model="parameter">
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="充电桩">
                            <span>{{parameter.deviceNo}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- <el-form-item label="插口数">
                    <el-input style="width: 30%;" v-model="parameter"></el-input>
                    <span style="margin-left: 1%;">个</span>
                </el-form-item> -->
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="充满电时的功率">
                            <el-input style="width: 80%;" clearable placeholder="请输入" v-model="parameter.fullPower">
                            </el-input>
                            <span style="margin-left: 5%;">W</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="充满时间">
                            <el-input style="width: 80%;" clearable placeholder="请输入" v-model="parameter.fullTime">
                            </el-input>
                            <span style="margin-left: 5%;">S</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="最大功率">
                            <el-input style="width: 80%;" clearable placeholder="请输入" v-model="parameter.maxPower">
                            </el-input>
                            <span style="margin-left: 5%;">W</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="单个插座空载功率">
                            <el-input style="width: 80%;" clearable placeholder="请输入" v-model="parameter.noLoadPower">
                            </el-input>
                            <span style="margin-left: 5%;">W</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="充电过程中的空载时间">
                            <el-input style="width: 80%;" clearable placeholder="请输入" v-model="parameter.noLoadTime">
                            </el-input>
                            <span style="margin-left: 5%;">MS</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="过载持续时间">
                            <el-input style="width: 80%;" clearable placeholder="请输入"
                                v-model="parameter.overloadDuration">
                            </el-input>
                            <span style="margin-left: 5%;">MS</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="单个插座的过载功率">
                            <el-input style="width: 80%;" clearable placeholder="请输入" v-model="parameter.overloadPower">
                            </el-input>
                            <span style="margin-left: 5%;">W</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="刚上电时的空载时间">
                            <el-input style="width: 80%;" clearable placeholder="请输入"
                                v-model="parameter.startNoLoadTime">
                            </el-input>
                            <span style="margin-left: 5%;">MS</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=24>
                        <el-form-item label-width="40%">
                            <el-button type="success" size="small" style="background-color: #4cb678;margin-left: 5%;"
                                @click="submit">确定</el-button>
                            <el-button @click="dialogFormVisible = false" size="small">取消</el-button>
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
    import { getConfigList, getPermissionDevice, callDownloadCfg } from "../../api/business"

    export default {
        name: 'bickParameterSettings',
        data() {
            return {
                dialogFormVisible: false,
                query: { mallId: [], deviceNo: "" },
                parameter: {
                    mallId: '',
                    maxPower: '',
                    overloadPower: '',
                    overloadDuration: '',
                    noLoadPower: '',
                    startNoLoadTime: '',
                    noLoadTime: '',
                    fullPower: '',
                    fullTime: ''
                },
                flag: true,
                tableData: [],
                communityOptions: [],
                deviceOptions: [],
                allDeviceOptions: [],
                alloptions: [],
                deviceNos: [],
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
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
                    this.queryMsg();
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
            selectDevice(val) {
                // this.deviceOptions = this.allDeviceOptions
                if (val.length != 0 && typeof val == "object") {
                    this.flag = false;
                    this.deviceOptions = []
                    this.allDeviceOptions.forEach(v => {
                        if (v.orgId == val[0]) {
                            delete this.query.deviceNo
                            this.deviceOptions = v.children
                        }
                    })
                    // if (this.deviceOptions[1]) {
                    //     this.deviceOptions = []
                    // }
                } else if (val.length == 0) {
                    delete this.query.deviceNo
                    this.flag = true;
                }
            },
            getDeviceNo(val) {
                if (val.length != 0) {
                    this.deviceNos = val
                }
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
                if (this.query.mallId.length == 0) {
                    delete this.query.mallId
                } else if (typeof this.query.mallId == "object") {
                    this.query.mallId = this.query.mallId[0]
                }
                if (this.query.deviceNo == "") {
                    delete this.query.deviceNo
                }
                let that = this
                this.tableData = [];
                if (that.query.mallId == null && that.query.deviceNo == null) {
                    this.getTableData(this.allDeviceOptions)
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getConfigList(that.query.mallId, that.query.deviceNo, that.pageSize, that.pageNum).then(resp => {
                    if (that.query.mallId.length == 0 && that.query.deviceNo == null) {
                        resp.data.data.records.forEach(v => {
                            that.tableData.forEach(k => {
                                if (v.deviceNo == k.deviceNo) {
                                    k.maxPower = v.maxPower < 0 ? "—" : v.maxPower;
                                    k.overloadPower = v.overloadPower < 0 ? "—" : v.overloadPower;
                                    k.overloadDuration = v.overloadDuration < 0 ? "—" : v.overloadDuration;
                                    k.noLoadPower = v.noLoadPower < 0 ? "—" : v.noLoadPower;
                                    k.startNoLoadTime = v.startNoLoadTime < 0 ? "—" : v.startNoLoadTime;
                                    k.noLoadTime = v.noLoadTime < 0 ? "—" : v.noLoadTime;
                                    k.fullPower = v.fullPower < 0 ? "—" : v.fullPower;
                                    k.fullTime = v.fullTime < 0 ? "—" : v.fullTime;
                                    k.id = v.id
                                }
                            })
                        })
                    } else {
                        that.tableData = resp.data.data.records;
                        that.tableData.forEach(v => {
                            that.communityOptions.forEach(k => {
                                if (v.mallId == k.orgId) {
                                    v.mallName = k.orgName
                                }
                            })
                        })
                    }
                    this.total = resp.data.data.total;
                    this.pageSize = resp.data.data.size;
                    this.pageNum = resp.data.data.current;
                    loading.close();
                })
            },
            getTableData(arr) {
                if (arr.length != 0) {
                    arr.forEach(v => {
                        v.children.forEach(k => {
                            this.tableData.push({ mallId: v.orgId, mallName: v.orgName, deviceNo: k.orgName, maxPower: "—", overloadPower: "—", overloadDuration: "—", noLoadPower: "—", startNoLoadTime: "—", noLoadTime: "—", fullPower: "—", fullTime: "—" })
                        })
                    })
                }
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.queryMsg();
            },
            handleCurrentChange(val) {
                this.pageNum = val ? val : 1;
                this.queryMsg();
            },
            settingShow(row) {
                this.dialogFormVisible = true;
                this.parameter = {
                    mallId: '',
                    maxPower: '',
                    overloadPower: '',
                    overloadDuration: '',
                    noLoadPower: '',
                    startNoLoadTime: '',
                    noLoadTime: '',
                    fullPower: '',
                    fullTime: ''
                }
                this.parameter.mallId = row.mallId;
                this.parameter.deviceNo = row.deviceNo;
                this.parameter.fullPower = row.fullPower == "—" ? "5" : row.fullPower;
                this.parameter.fullTime = row.fullTime == "—" ? "120" : row.fullTime;
                this.parameter.maxPower = row.maxPower == "—" ? "5500" : row.maxPower;
                this.parameter.noLoadPower = row.noLoadPower == "—" ? "15" : row.noLoadPower;
                this.parameter.noLoadTime = row.noLoadTime == "—" ? "60000" : row.noLoadTime;
                this.parameter.overloadDuration = row.overloadDuration == "—" ? "500" : row.overloadDuration;
                this.parameter.overloadPower = row.overloadPower == "—" ? "1000" : row.overloadPower;
                this.parameter.startNoLoadTime = row.startNoLoadTime == "—" ? "60000" : row.startNoLoadTime;
                this.parameter.id = row.id
            },
            submit() {
                if (this.parameter.mallId && this.parameter.mallId != '' && this.parameter.deviceNo && this.parameter.deviceNo != '' &&
                    this.parameter.fullPower && this.parameter.fullPower != '' && this.parameter.fullTime && this.parameter.fullTime != '' &&
                    this.parameter.maxPower && this.parameter.maxPower != '' && this.parameter.noLoadPower && this.parameter.noLoadPower != '' &&
                    this.parameter.noLoadTime && this.parameter.noLoadTime != '' && this.parameter.overloadDuration && this.parameter.overloadDuration != '' &&
                    this.parameter.overloadPower && this.parameter.overloadPower != '' && this.parameter.startNoLoadTime && this.parameter.startNoLoadTime != '') {
                    callDownloadCfg(this.parameter.mallId, this.parameter.deviceNo, this.parameter.fullPower,
                        this.parameter.fullTime, this.parameter.maxPower, this.parameter.noLoadPower,
                        this.parameter.noLoadTime, this.parameter.overloadDuration,
                        this.parameter.overloadPower, this.parameter.startNoLoadTime, this.parameter.id).then(resp => {
                            this.dialogFormVisible = false;
                            this.$message.success("参数设置成功");
                            this.queryMsg()
                        })
                } else {
                    this.$message.warning("请输入正确参数!")
                }
            },
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