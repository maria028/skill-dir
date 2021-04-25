<template>
    <div style="width: 98%;margin:0 1%;">
        <el-card style="margin-bottom: 1%;">
            <el-form label-width="30%" :model="query">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="手机号码">
                            <el-autocomplete class="inline-input" v-model="query.phone" :fetch-suggestions="querySearch"
                                style="width: 100%;" placeholder="手机号码" :trigger-on-focus="false" @select="handleSelect"
                                clearable></el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="el-col">
                        <el-form-item label="账户归属">
                            <avue-cascader v-model="query.mallId" :dic="options" :props="defaultProps"
                                placeholder="省-市-区-街道" style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=10 class="col">
                        <el-form-item>
                            <el-button type="success" icon="el-icon-search" size="small" @click="queryMsg"
                                style="background-color: #4cb678;float: right;margin-top: 7%;">
                                查询</el-button>
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
                        <el-table-column label="操作" width="140" align="center">
                            <template slot-scope="scope">
                                <el-row>
                                    <el-button type="text" style="padding: 0;font-size: 20px;"
                                        @click="topUpMoney(scope.row)">充值</el-button>
                                    <el-button type="text" style="padding: 0;font-size: 20px;">转账</el-button>
                                </el-row>
                                <el-row>
                                    <el-button type="text" style="padding: 0;"
                                        @click="jumpPage('/account/top-up', scope.row)">充值记录</el-button>
                                </el-row>
                                <el-row>
                                    <el-button type="text" style="padding: 0;"
                                        @click="jumpPage('/account/trading',scope.row)">消费记录</el-button>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mallName" label="账户归属" min-width align="center"></el-table-column>
                        <el-table-column prop="phone" label="手机号码" min-width align="center"></el-table-column>
                        <el-table-column prop="nickName" label="名字" min-width align="center"></el-table-column>
                        <el-table-column prop="accountId" label="资金账户" min-width align="center"></el-table-column>
                        <el-table-column prop="balance" label="账户余额(元)" min-width align="center"></el-table-column>
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
        <el-dialog title="充值" :visible.sync="centerDialogVisible" width="40%" center>
            <el-form label-width="30%" :model="topUp">
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="手机号码">
                            <span>{{phone}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="商户名称">
                            <span>{{mallName}}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=12>
                        <el-form-item label="名字">
                            <span>{{name}}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span=12>
                        <el-form-item label="充值金额">
                            <el-input clearable placeholder="请输入" v-model="topUp.payMoney" style="width:85%;">
                            </el-input>
                            </el-input>
                            <!-- onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode)))" -->
                            <span style="margin-left: 3%;">元</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=2 :offset=11>
                        <el-button type="success" size="small" style="background-color: #4cb678;" @click="showInner">确定
                        </el-button>
                    </el-col>
                </el-row>
            </el-form>
            <el-dialog width="30%" :visible.sync="innerVisible" append-to-body center>
                <el-row>
                    <div style="text-align: center;font-weight: bold;margin-bottom: 5%;">确定充值{{topUp.payMoney}}元吗？</div>
                </el-row>
                <el-row>
                    <div style="text-align: center;">
                        <el-button type="success" size="small" style="background-color: #4cb678;" @click="submit">确定
                        </el-button>
                        <el-button type="success" size="small" style="background-color: #4cb678;"
                            @click="innerVisible = false">取消</el-button>
                    </div>
                </el-row>
            </el-dialog>
            <el-dialog width="30%" :visible.sync="payVisible" append-to-body center title="支付" @close="close">
                <el-row>
                    <el-col :span=24>
                        <div style="text-align: center;font-weight: bold;margin-bottom: 5%;">
                            支付金额{{topUp.payMoney}}元，请在{{seconds}}秒内完成支付，充值期间请勿关闭页面</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <div id="qrcode" ref="qrcode" style="display:flex;justify-content:center"></div>
                    </el-col>
                </el-row>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { getUserMessage, getAccountList, pcChargeCode, payResultQuery, chargeAccount } from '../../api/house';
    import QRCode from 'qrcodejs2'

    export default {
        name: 'account',
        components: { QRCode },
        // inject: ['reload'],
        data() {
            return {
                query: {},
                options: [],
                defaultProps: { label: 'orgName', value: 'orgId', checkStrictly: true },
                tableData: [],
                restaurants: [],
                centerDialogVisible: false,
                innerVisible: false,
                payVisible: false,
                topUp: {},
                account: '',
                phone: '',
                mallName: '',
                name: '',
                mallId: '',
                userId: '',
                outTradeNo: '',
                qrCode: '',
                timer: '',
                seconds: 180,
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
            this.query.mallId = [];
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
            },
            screenRegion(data) {
                data.forEach(v => {
                    if (v.children) {
                        this.screenRegion(v.children)
                    } else if (v.orgId.length >= 10) {
                        this.options.push(v)
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
            queryMsg() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getAccountList(this.query.phone, this.query.mallId[this.query.mallId.length - 1], this.pageSize, this.pageNum).then(resp => {
                    this.tableData = resp.data.data.records;
                    this.tableData.forEach(v => {
                        v.balance = v.balance / 100;
                    })
                    let phonrArr = new Array();
                    for (var i = 0; i < resp.data.data.records.length; i++) {
                        phonrArr.push({ value: resp.data.data.records[i].phone })
                    }
                    phonrArr.forEach(v => {
                        for (var k = 1; k < phonrArr.length; k++) {
                            if (phonrArr[k].value == v.value) {
                                phonrArr.splice(k, 1)
                            }
                        }
                    })
                    this.restaurants = phonrArr;
                    this.pageNum = resp.data.data.current;
                    this.pageSize = resp.data.data.size;
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
            jumpPage(url, data) {
                this.$router.push({ path: url, query: data })
            },
            topUpMoney(row) {
                this.account = row.accountId;
                this.userId = row.userId;
                this.phone = row.phone;
                this.mallName = row.mallName;
                this.name = row.nickName;
                this.mallId = row.mallId;
                delete this.topUp.payMoney;
                this.centerDialogVisible = true;
            },
            showInner() {
                if (this.topUp.payMoney && this.topUp.payMoney >= 0.01) {
                    this.innerVisible = true;
                } else {
                    this.$message.warning("请输入正确金额")
                }
            },
            submit() {
                let product = this.phone + '充值' + this.topUp.payMoney + '元';
                pcChargeCode(this.mallId, product, this.topUp.payMoney * 100).then(resp => {
                    this.qrCode = resp.data.data.qrCode;
                    this.outTradeNo = resp.data.data.tradeSequence;
                    this.qrcodedraw();
                })
                this.payVisible = true;
                this.timer = setInterval(() => {
                    this.seconds--;
                    payResultQuery(this.outTradeNo).then(resp => {
                        if (resp.data.data.tradeState == 'SUCCESS' && resp.data.data.resultCode == 'SUCCESS' && resp.data.data.returnCode == 'SUCCESS') {
                            chargeAccount(this.mallId, this.outTradeNo, this.topUp.payMoney * 100, this.userId).then(resp => {
                                clearInterval(this.timer);
                                this.payVisible = false;
                                this.innerVisible = false;
                                this.centerDialogVisible = false;
                                this.seconds = 180;
                                this.$message.success("支付成功")
                                this.queryMsg();
                            })
                        }
                    })
                    if (this.seconds <= 0) {
                        clearInterval(this.timer);
                        this.payVisible = false;
                        this.innerVisible = false;
                        this.seconds = 180;
                        this.$message.warning("订单超时")
                    }
                }, 1000);

            },
            qrcodedraw() { // 生成二维码
                document.getElementById("qrcode").innerHTML = "";
                this.qrcode = new QRCode(this.$refs.qrcode, {
                    width: 200, // 二维码宽度
                    height: 200, // 二维码高度
                    text: this.qrCode,
                    correctLevel: 3
                })
            },
            close() {
                clearInterval(this.timer);
                this.payVisible = false;
                this.innerVisible = false;
                this.seconds = 180;
                // this.$message.warning("取消支付")
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