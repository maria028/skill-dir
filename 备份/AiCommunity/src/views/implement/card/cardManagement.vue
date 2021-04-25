<template>
    <div style="width: 98%;margin:0 1%">
        <el-card style="margin-bottom:1%;">
            <el-form :model="cardData" label-width="30%">
                <el-row>
                    <!-- <el-col :span=6 class="col">
                        <el-form-item label="组织架构">
                            <avue-cascader v-model="cardData.optionInfo" :dic="options" :props="defaultProps"
                                placeholder="省-市-区-街道" @change="selectedRegion" style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span=6 class="col">
                        <el-form-item label="小区名称">
                            <!-- <el-select placeholder="请选择小区" v-model="cardData"></el-select> -->
                            <avue-cascader v-model="cardData.optionCommunity" :dic="communityoptions"
                                :props="defaultProp" placeholder="小区名称" style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="卡片状态">
                            <el-select placeholder="请选择" v-model="cardData.cardStatus" clearable style="width: 100%;">
                                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="卡片号码">
                            <el-autocomplete class="inline-input" v-model="cardData.cardNum"
                                :fetch-suggestions="querySearch" style="width: 100%;" placeholder="卡片号码"
                                :trigger-on-focus="false" @select="handleSelect" clearable></el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <!-- </el-row>
                <el-row> -->
                    <el-col :span=2 :offset=4 class="col">
                        <el-form-item>
                            <el-button type="success" icon="el-icon-search" size="small"
                                style="background-color: #4cb678;float: right;margin-top: 7%;" @click="query">查询
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card>
            <el-row>
                <el-col :span="24">
                    <el-button icon="el-icon-plus" type="success" size="small" @click="addCard"
                        style="float: left;background-color: #4cb678;">卡入库</el-button>
                    <el-upload action="/上传文件的接口" :on-change="onChange" :auto-upload="false" :show-file-list="false"
                        accept=".xls, .xlsx" style="float: left;margin: 0 1%;">
                        <el-button type="success" size="small" style="background-color: #4cb678;">导入卡号</el-button>
                    </el-upload>
                    <el-button type="success" size="small" style="float: left;background-color: #4cb678;"
                        @click="exportToExcel">模板下载</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-table :data="tableData" stripe :header-cell-style="{background:'#D8E3FA'}"
                        :default-sort="{prop: '', order: ''}" border>
                        <el-table-column type="index" fixed label="序号" width="100" align="center">
                            <template slot-scope="scope"><span>{{scope.$index+(pageNum - 1) * pageSize + 1}}
                                </span></template>
                        </el-table-column>
                        <el-table-column prop="mallName" label="小区名称" min-width align="center"></el-table-column>
                        <el-table-column prop="cardNum" label="卡号" min-width align="center"></el-table-column>
                        <el-table-column prop="houseName" label="卡片状态" min-width align="center"></el-table-column>
                        <el-table-column prop="fullRoom" label="卡归属" min-width align="center"></el-table-column>
                        <el-table-column label="操作" width="140" align="center">
                            <template slot-scope="scope">
                                <el-button size="small" type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">
                                    修改</el-button>
                                <el-button size="small" type="text" icon="el-icon-delete"
                                    @click="handleDelete(scope.row)">删除</el-button>
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
        <el-drawer title="卡入库" :visible.sync="cardDrawer" :direction="direction" size="30%">
            <el-form :model="cardList" label-width="80px">
                <el-form-item label="小区">
                    <avue-cascader v-model="cardList.mallId" :dic="newOptions" style="width: 70%;" :props="defaultProps"
                        placeholder="请选择小区"></avue-cascader>
                </el-form-item>
                <el-form-item label="卡编号">
                    <el-input placeholder="请输入卡编号" clearable style="width: 70%;" v-model="cardList.cardNum"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="medium" type="primary" style="margin-left: 25%;" @click="addCardMsg"
                        v-preventReClick="3000">确定</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
        <el-drawer title="修改信息" :visible.sync="cardChange" :direction="direction" size="30%">
            <el-form :model="changeList" label-width="80px">
                <el-form-item label="小区">
                    <el-input style="width: 70%;" v-model="changeList.mallName" disabled></el-input>
                </el-form-item>
                <el-form-item label="卡号">
                    <el-input style="width: 70%;" v-model="changeList.cardNum"></el-input>
                </el-form-item>
                <el-form-item label="卡片状态">
                    <el-select placeholder="请选择" v-model="changeList.houseName" clearable style="width: 70%;" disabled>
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="卡归属">
                    <el-input style="width: 70%;" v-model="changeList.fullRoom" disabled></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="medium" type="primary" style="margin-left: 25%;" @click="changeSubmit">确定
                    </el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { cardFind, cardSubmit, cardRemove, getUserMessage } from '../../../api/house';
    import { export_json_to_excel } from '../../../excel/export2Excel';

    export default {
        name: "cardManagement",
        data() {
            return {
                cardData: {
                    optionInfo: [],
                    optionCommunity: [],
                    cardStatus: '',
                },
                restaurants: [],
                options: [],
                newOptions: [],
                allMallId: [],
                communityoptions: [],
                tableData: [

                ],
                statusOptions: [{
                    value: "1",
                    label: "未发放",
                }, {
                    value: "2",
                    label: "已发放",
                }],
                direction: "rtl",
                cardDrawer: false,
                cardChange: false,
                defaultProps: { label: 'orgName', value: 'orgId', checkStrictly: true },
                defaultProp: { label: 'orgName', value: 'orgId', checkStrictly: false },
                cardList: [

                ],
                changeList: [

                ],
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
            // this.cardFindMsg(null, null, null, this.pageSize, this.pageNum);
            this.query();
        },
        methods: {
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
                console.log('*-*-*-' + this.cardData.cardNum);
            },
            addCard() {
                this.cardDrawer = true;
                delete this.cardList.mallId;
                delete this.cardList.cardNum;
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
                    that.newOptions = resp.data.data;
                })
            },
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
                    this.getAllMallId(resp.data.data);
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
            getAllMallId(data) {
                data.forEach(v => {
                    if (v.children) {
                        this.getAllMallId(v.children);
                    } else if (v.orgId.length > 10) {
                        this.allMallId.push(v)
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
            //                 }
            //             }
            //             if (v.children.length == 0) {
            //                 delete v.children
            //             }
            //         }
            //     })
            // },
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
            cardFindMsg(mallId, cardStatus, cardNum, pageSize, pageNum) {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                cardFind(mallId, cardStatus, cardNum, pageSize, pageNum).then(resp => {
                    let that = this
                    let cardArr = [];
                    this.tableData = resp.data.data.records
                    this.total = resp.data.data.total;
                    // debugger
                    for (var i = 0; i < resp.data.data.records.length; i++) {
                        cardArr.push({ value: resp.data.data.records[i].cardNum });
                        if (resp.data.data.records[i].houseId == '' || resp.data.data.records[i].houseId == '0') {
                            that.tableData[i].houseName = "未发放";
                        } else {
                            that.tableData[i].houseName = "已发放";
                        }
                    }
                    this.restaurants = cardArr;
                    loading.close();
                })
            },
            handleEdit(data) {
                this.cardChange = true;
                this.changeList = data;
            },
            handleDelete(data) {
                this.$confirm('确认删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    cardRemove(data.id).then(resp => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.query();
                    })
                })
            },
            addCardMsg() {
                if (this.cardList.mallId == '') {
                    this.$message({
                        message: "请选择小区",
                        type: "warning"
                    })
                    return
                }
                if (this.cardList.cardNum && this.cardList.cardNum.length > 8) {
                    cardSubmit('', this.cardList.mallId[this.cardList.mallId.length - 1], this.cardList.cardNum).then(resp => {
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        })
                        this.query();
                        this.cardDrawer = false;
                    })
                } else {
                    this.$message({
                        message: "请输入正确卡号",
                        type: "warning"
                    })
                    return
                }
            },
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
                    console.log(that.communityoptions)
                })
            },
            handleSizeChange(val) {
                this.pageSize = val
                this.cardFindMsg(this.cardData.cardStatus, this.cardData.optionCommunity[0], this.cardData.cardNum, this.pageSize, this.pageNum)
            },
            handleCurrentChange(val) {
                this.pageNum = val ? val : 1;
                this.cardFindMsg(this.cardData.cardStatus, this.cardData.optionCommunity[0], this.cardData.cardNum, this.pageSize, this.pageNum)
            },
            query() {
                // if (this.cardData.optionCommunity.length == 0) {
                //     // this.cardData.optionCommunity.push(this.cardData.optionInfo[this.cardData.optionInfo.length - 1])
                //     this.$message.warning("请选择小区")
                //     return
                // }
                this.pageNum = 1;
                if (this.cardData.cardNum == null || this.cardData.cardNum == '') {
                    delete this.cardData.cardNum
                }
                this.cardFindMsg(this.cardData.cardStatus, this.cardData.optionCommunity[0], this.cardData.cardNum, this.pageSize, this.pageNum)
            },
            changeSubmit() {
                // if(this.changeList.houseId == '未发放'){
                //     this.changeList.houseId = '0';
                // }
                cardSubmit(this.changeList.id, this.changeList.mallId, this.changeList.cardNum, this.changeList.houseId,
                    this.changeList.fullRoom, this.changeList.building, this.changeList.createTime, this.changeList.createUser,
                    this.changeList.mallName, this.changeList.memberId, this.changeList.room, this.changeList.unit,
                    this.changeList.updateTime, this.changeList.updateUser).then(resp => {
                        this.$message({
                            type: 'success',
                            message: '保存成功!'
                        })
                        this.query();
                        this.cardChange = false;
                    })
            },
            // ----------以下为导入Excel数据功能--------------
            // 文件选择回调
            onChange(file, fileList) {
                console.log(fileList);
                this.fileData = file; // 保存当前选择文件
                this.readExcel(); // 调用读取数据的方法
            },
            // 读取数据
            readExcel(e) {
                console.log(e);
                let that = this;
                const files = that.fileData;
                console.log(files);
                if (!files) {
                    //如果没有文件
                    return false;
                } else if (!/\.(xls|xlsx)$/.test(files.name.toLowerCase())) {
                    this.$message.error("上传格式不正确，请上传xls或者xlsx格式");
                    return false;
                }
                const fileReader = new FileReader();
                fileReader.onload = ev => {
                    try {
                        const data = ev.target.result;
                        // console.log(data)
                        const workbook = this.XLSX.read(data, {
                            type: "binary"
                        });
                        console.log(workbook.SheetNames);
                        if (workbook.SheetNames.length >= 1) {
                            this.$message({
                                message: "导入数据表格成功",
                                showClose: true,
                                type: "success"
                            });
                        }
                        const wsname = workbook.SheetNames[0]; //取第一张表
                        const ws = this.XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
                        console.log(ws);
                        that.outputs = []; //清空接收数据
                        for (var i = 0; i < ws.length; i++) {
                            var sheetData = {
                                // 键名为绑定 el 表格的关键字，值则是 ws[i][对应表头名]
                                mallName: ws[i]["小区名称"],
                                cardNum: ws[i]["卡号"],
                                houseName: ws[i]["卡片状态"],
                                fullRoom: ws[i]["卡归属"],
                            };
                            // that.tableData.unshift(sheetData);
                            if (sheetData.cardNum.length < 8) {
                                that.$message.warning(sheetData.cardNum + '格式不正确');
                                break
                            } else {
                                that.allMallId.forEach(v => {
                                    if (v.orgName == sheetData.mallName) {
                                        cardSubmit('', v.orgId, sheetData.cardNum);
                                    }
                                })
                            }
                        }
                        this.$refs.upload.value = "";
                    } catch (e) {
                        return false;
                    }
                };
                fileReader.readAsBinaryString(files.raw);
            },
            // ----------以下为导出Excel数据功能--------------
            exportToExcel() {
                //excel数据导出
                require.ensure([], () => {
                    const tHeader = [
                        "小区名称",
                        "卡号",
                        "卡片状态",
                        "卡归属",
                    ];
                    const filterVal = [];
                    const list = this.tableData;
                    const data = this.formatJson(filterVal, list);
                    export_json_to_excel({
                        header: tHeader,
                        data,
                        filename: '导入模板excel'
                    })
                });
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]));
            },
        }
    }
</script>

<style lang="scss" scoped>
    .col {
        height: 35px;
    }

    @import "../../../styles/style.scss";
</style>