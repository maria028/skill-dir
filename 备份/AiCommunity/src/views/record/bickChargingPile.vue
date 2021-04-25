<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form :model="query" label-width="30%">
                <el-row>
                    <!-- <el-col :span=6 class="col">
                        <el-form-item label="组织架构">
                            <avue-cascader v-model="query.optionInfo" :dic="options" :props="defaultProps"
                                placeholder="省-市-区-街道" @change="selectedRegion" style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span=6 class="col">
                        <el-form-item label="小区">
                            <avue-cascader v-model="query.community" :dic="communityoptions" :props="defaultProp"
                                placeholder="小区名称" @change="selectedCommunity" style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="充电站">
                            <el-select v-model="query.device" clearable placeholder="充电站" @change="selectedSocket"
                                style="width: 100%;">
                                <el-option v-for="item in deviceOptions" :key="item.deviceNo" :label="item.deviceName"
                                    :value="item.deviceNo"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=10 class="col">
                        <el-form-item>
                            <el-button type="success" icon="el-icon-search" size="small"
                                style="background-color: #4cb678;float: right;margin-top: 7%;" @click="queryMsg">查询
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-row type=flex>
            <el-col :span=12 style="margin-bottom: 0;">
                <el-card style="margin-right: 1%;">
                    <el-row>
                        <el-col :span=24>
                            <span style="font-weight: bold;">实时监控</span>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 2% 0;">
                        <el-col :span=6>
                            <div style="font-size: 14px;">温度</div>
                            <div style="font-size: 18px;color:rgba(76,182,91,1);padding: 5% 0;font-weight: bold;">
                                {{temperature}}&#8451;</div>
                        </el-col>
                        <el-col :span=6>
                            <div style="font-size: 14px;">功率</div>
                            <div style="font-size: 18px;color:rgba(76,182,91,1);padding: 5% 0;font-weight: bold;">
                                {{power}}w</div>
                        </el-col>
                        <el-col :span=6>
                            <div style="font-size: 14px;">源电流</div>
                            <div style="font-size: 18px;color:rgba(76,182,91,1);padding: 5% 0;font-weight: bold;">
                                {{currentmA}}mA</div>
                        </el-col>
                        <el-col :span=6>
                            <div style="font-size: 14px;">电度</div>
                            <div style="font-size: 18px;color:rgba(76,182,91,1);padding: 5% 0;font-weight: bold;">
                                {{degree}}kwh</div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span=6>
                            <div style="font-size: 14px;">电流</div>
                            <div style="font-size: 18px;color:rgba(76,182,91,1);padding: 5% 0;font-weight: bold;">
                                {{currentA}}A</div>
                        </el-col>
                        <el-col :span=6>
                            <div style="font-size: 14px;">电压</div>
                            <div style="font-size: 18px;color:rgba(76,182,91,1);padding: 5% 0;font-weight: bold;">
                                {{voltage}}V</div>
                        </el-col>
                        <el-col :span=6>
                            <div style="font-size: 14px;">错误码</div>
                            <div style="font-size: 18px;color:rgba(76,182,91,1);padding: 5% 0;font-weight: bold;">
                                {{errorCode}}</div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span=12 style="margin-bottom: 0;">
                <el-card style="margin-left: 1%;height: 100%;">
                    <el-row>
                        <el-col :span=24>
                            <span style="font-weight: bold;">异常告警</span>
                        </el-col>
                    </el-row>
                    <el-row style="margin: 0 5%;">
                        <el-col :span=24 style="text-align: center;margin: 12% 0;">
                            <div>{{errorMessage}}</div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>
        <el-card style="margin-top: 1%;">
            <el-row>
                <el-col :span=24>
                    <span style="font-weight: bold;">充电插座状态</span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span=6 class="card" v-for="(item,i) in socketMsg">
                    <div style="margin:5% 0 0 10%;">插座{{i}}</div>
                    <img src="../../../public/img/socket.png" width="20%" style="margin: 5% 10% 10% 10%;float: left;">
                    <div style="margin-top: 5%;">状态：{{item.status}}</div>
                    <div>功率：{{item.power}}W</div>
                    <el-button type="success" plain size="mini" style="float: right;margin: 5%;" @click="findMsg(i)">
                        充电详情</el-button>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog :title="title" :visible.sync="centerDialogVisible" width="80%" center>
            <el-table :data="tableData" stripe :header-cell-style="{background:'#D8E3FA'}"
                :default-sort="{prop: '', order: ''}" border>
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号码" min-width align="center"></el-table-column>
                <el-table-column min-width label="金额" align="center">
                    <template slot-scope="scope"><span>{{scope.row.payFee}}元</span></template>
                </el-table-column>
                <el-table-column prop="status" label="充电状态" min-width align="center"></el-table-column>
                <el-table-column min-width label="充电时长" align="center">
                    <template slot-scope="scope"><span>{{scope.row.seconds}}分钟</span></template>
                </el-table-column>
                <el-table-column prop="startTime" label="开始时间" min-width align="center"></el-table-column>
                <el-table-column prop="endTime" label="结束时间" min-width align="center"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>


<script>
    import { mapGetters, mapState } from "vuex";
    import { getUserMessage } from '../../api/house';
    import { getDeviceList, getDeviceStatusExt, findBickMsg } from "../../api/business";

    export default {
        name: "bickChargingPile",
        data() {
            return {
                query: { community: '', device: '' },
                options: [],
                communityoptions: [],
                deviceOptions: [],
                defaultProps: { label: 'orgName', value: 'orgId', checkStrictly: true },
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
                temperature: '0',  //温度
                power: '0', //功率
                currentmA: '0', //源电流
                currentA: '0',  //电流
                degree: '0', //电度
                voltage: '0', //电压
                errorCode: '0', //错误码
                errorMessage: '暂无告警信息', //异常告警
                socketMsg: [],
                communityName: '',
                deviceName: '',
                socketNo: '',
                centerDialogVisible: false,
                title: "",
                tableData: [],
            }
        },
        created() {
            this.getOrganization();

        },
        computed: {
            ...mapGetters(["tenantId", "userInfo"])
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
                    let arr = [];
                    arr.push(that.communityoptions[0].orgId)
                    that.query.community = that.communityoptions[0].orgId;
                    that.selectedCommunity(arr);
                });
            },
            screenRegion(data) {
                data.forEach(v => {
                    if (v.children) {
                        this.screenRegion(v.children)
                    } else if (v.orgId.length >= 10) {
                        this.communityoptions.push(v)
                    }
                })
            },
            // screenRegion(data) {
            //     data.forEach(v => {
            //         // debugger
            //         if (v.children) {
            //             for (var i = 0; i < v.children.length; i++) {
            //                 if (v.children[i].children) {
            //                     this.screenRegion(v.children);
            //                 } else if (v.children[i].orgId.length > 10) {
            //                     v.children.splice(i, 1);
            //                     i--;
            //                 }
            //             }
            //             if (v.children.length == 0) {
            //                 delete v.children;
            //             }
            //         }
            //     })
            // },
            selectedRegion(e) {
                console.log(e[e.length - 1])
                let that = this;
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
                getUserMessage(userOrg, userOrgDesc, this.roleType).then(resp => {
                    that.communityoptions = [];
                    that.screenCommunity(resp.data.data, e[e.length - 1]);
                    if (that.communityoptions.length > 1) {
                        for (var i = 0; i < that.communityoptions.length; i++) {
                            for (var j = i + 1; j < that.communityoptions.length; j++) {
                                if (that.communityoptions[i].orgId == that.communityoptions[j].orgId && that.communityoptions[i].orgName == that.communityoptions[j].orgName) {
                                    that.communityoptions.splice(j, 1);
                                    j = i;
                                }
                            }
                        }
                    }
                })
            },
            screenCommunity(data, e) {
                let that = this;
                data.forEach(v => {
                    // debugger
                    if (v.children) {
                        for (var i = 0; i < v.children.length; i++) {
                            if (v.children[i].children) {
                                that.screenCommunity(v.children, e);
                            } else if (v.orgId == e) {
                                for (var i = 0; i < v.children.length; i++) {
                                    that.communityoptions.push(v.children[i]);
                                }
                            }
                        }
                    }
                })
            },
            selectedCommunity(e) {
                delete this.query.device;
                if (e.length != 0 && typeof e == "object") {
                    for (var i = 0; i < this.communityoptions.length; i++) {
                        if (this.communityoptions[i].orgId == e[e.length - 1]) {
                            this.communityName = this.communityoptions[i].orgName;
                        }
                    }
                    getDeviceList(e[e.length - 1], "CDB").then(resp => {
                        this.deviceOptions = resp.data.data.records;
                        this.query.device = this.deviceOptions[0].deviceNo
                        this.selectedSocket(this.query.device)
                    })
                }
            },
            selectedSocket(e) {
                if (e.length != 0) {
                    for (var i = 0; i < this.deviceOptions.length; i++) {
                        if (this.deviceOptions[i].deviceNo == e) {
                            this.deviceName = this.deviceOptions[i].deviceName
                        }
                    }
                }
                this.queryMsg()
            },
            queryMsg() {
                if (this.query.device == "" || this.query.device == null) {
                    this.$message.warning("请选择充电站")
                    return
                }
                let that = this;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getDeviceStatusExt("CDB", this.query.device).then(resp => {
                    that.temperature = resp.data.data.temperature;
                    that.power = resp.data.data.power;
                    that.currentmA = resp.data.data.current;
                    that.currentA = resp.data.data.current / 1000;
                    that.degree = resp.data.data.degree / 1000;
                    that.voltage = resp.data.data.voltage;
                    that.errorCode = resp.data.data.errorCode;
                    that.errorMessage = resp.data.data.errorMessage == '' ? '暂无告警信息' : resp.data.data.errorMessage;
                    for (var i in resp.data.data.connectorMap) {
                        resp.data.data.connectorMap[i].status = resp.data.data.connectorMap[i].status == 0 ? "充电中" : "断开";
                    }
                    that.socketMsg = resp.data.data.connectorMap;
                    loading.close()
                })
            },
            findMsg(index) {
                this.socketNo = index;
                this.title = this.deviceName + "-" + this.socketNo + "号插口当日充电明细";
                this.centerDialogVisible = true
                let date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let today = year.toString() + month.toString() + strDate.toString();
                // today = "20200814"
                findBickMsg(this.query.community, this.query.device, index, today, today).then(resp => {
                    this.tableData = resp.data.data.records;
                    let that = this;
                    for (var i = 0; i < resp.data.data.records.length; i++) {
                        that.tableData[i].payFee = resp.data.data.records[i].payFee / 100
                        that.tableData[i].seconds = (resp.data.data.records[i].seconds / 60).toFixed(2)
                        that.tableData[i].seconds = Math.ceil(that.tableData[i].seconds)
                        switch(that.tableData[i].status) {
                            case 0:
                              that.tableData[i].status = "待支付";
                              break;
                            case 1:
                              that.tableData[i].status = "开始发起充电";
                              break;
                            case 2:
                              that.tableData[i].status = "充电中";
                              break;
                            case 3:
                              that.tableData[i].status = "充电完成";
                              break;
                            case 4:
                              that.tableData[i].status = "待退款";
                              break;
                            case 5:
                              that.tableData[i].status = "已退款";
                              break;
                            case 6:
                              that.tableData[i].status = "发起停止充电";
                              break;
                        }
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .col {
        height: 35px;
    }

    .card {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(248, 248, 248, 1);
        box-shadow: 1px 2px 6px 0px rgba(68, 130, 230, 0.15);
        border-radius: 3px;
        /* margin-right: 1%; */
    }

    @import "../../styles/style.scss";
</style>