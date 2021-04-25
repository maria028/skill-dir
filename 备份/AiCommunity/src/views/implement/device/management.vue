<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom:1%;">
        <el-form v-model="query" label-width="30%">
            <el-row>
                <el-col :span=6 class="col">
                    <el-form-item label="小区名称">
                        <el-select v-model="query.mallId" clearable placeholder="小区名称" style="width: 100%;">
                            <el-option v-for="item in mallOption" :key="item.id" :label="item.mallNo" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="设备编号">
                        <el-input v-model="query.deviceNo" clearable placeholder="设备编号" style="width: 100%;"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="设备状态">
                        <el-select v-model="query.isOnline" clearable placeholder="设备状态" style="width: 100%;">
                            <el-option v-for="item in isOnlineOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="设备类型">
                        <el-select v-model="query.deviceType" clearable placeholder="设备类型" style="width: 100%;">
                            <el-option v-for="item in typeOptions" :key="item.deviceType" :label="item.deviceName" :value="item.deviceType"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span=2 :offset=22 class="col">
                    <el-form-item>
                        <el-button type="success" icon="el-icon-search" size="small" style="background-color: #4cb678;float: right;margin-top: 7%;" @click="onLoad">查询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </el-card>
        <basic-container>
            <avue-crud :option="option" :data="data" ref="crud" v-model="form" :page="page"
                @selection-change="selectionChange" @on-load="onLoad" @row-del="rowDel" @row-update="rowUpdate"
                @row-save="rowSave" @size-change="sizeChange" @current-change="currentChange" @search-reset="searchReset"
                @search-change="searchChange" @refresh-change="onLoad">
                <template slot-scope="scope" slot="paramJsonLabel" v-if="showParamJson">
                    <span>设备参数</span>
                </template>

                <template slot-scope="scope" slot="paramJsonForm" v-if="showParamJson">
                    <el-radio-group v-model="radio">
                        <el-radio :label="1">进</el-radio>
                        <el-radio :label="2">出</el-radio>
                    </el-radio-group>
                </template>

            </avue-crud>
        </basic-container>
    </div>
</template>

<script>
    import { add, getDeviceList, remove, update } from "../../../api/system/device";
    import { getMall } from "../../../api/mall";
    import { mapGetters, mapState } from "vuex";
    import deviceTypeData from "../../../config/deviceTypeData";

    export default {
        name: "management",
        data() {
            return {
                radio: 0,
                form: {},
                query: {},
                selectionList: [],
                mallDicData: {},
                mallOption: [],
                typeOptions: [{
                    deviceType: 'CDC',
                    deviceName: '汽车充电桩'
                },{
                    deviceType: 'CDB',
                    deviceName: '电瓶车充电桩'
                },{
                    deviceType: 'DZC',
                    deviceName: '车道闸'
                },{
                    deviceType: 'MJP',
                    deviceName: '门禁（人）'
                },{
                    deviceType: 'JKXZ',
                    deviceName: '健康小站'
                },{
                    deviceType: 'RRM',
                    deviceName: '大机器人'
                },{
                    deviceType: 'SHJ',
                    deviceName: '售货机'
                },{
                    deviceType: 'RRL4',
                    deviceName: '1托4'
                },{
                    deviceType: 'RRL2',
                    deviceName: '1托2'
                }],
                isOnlineOption:[{
                    value: true,
                    label: "在线"
                },{
                    value: false,
                    label: "离线"
                }],
                page: {
                    pageSize: 50,
                    currentPage: 1,
                    total: 0
                },
                data: [
                    {
                        mallId: '300001',
                        deviceType: '1托2',
                        deviceNo: '23232'

                    }, {
                        mallId: '300001',
                        deviceType: '1托2',
                        deviceNo: '23232'

                    }, {
                        mallId: '300001',
                        deviceType: '1托2',
                        deviceNo: '23232'

                    }, {
                        mallId: '300001',
                        deviceType: '1托2',
                        deviceNo: '23232'

                    }
                ],
                showParamJson: false,
                option: {
                    searchMenuSpan: true,
                    menuPosition: 'center',
                    align: 'center',
                    tip: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    selection: false,
                    viewBtn: false,
                    dialogHeight: 450,
                    page: true,
                    stripe: true,
                    refreshBtn:false,
                    columnBtn:false,
                    column: [
                        {
                            label: "小区名称",
                            prop: "mallNo",
                            type: "tree",
                            // search: true,
                            dicData: [],
                            minWidth: 120,
                            props: {
                                label: "name",
                                value: "id"
                            },
                            rules: [
                                {
                                    required: true,
                                    message: "请选择网点",
                                    trigger: "blur"
                                }
                            ]

                        }, {
                            label: '设备类型',
                            prop: 'deviceType',
                            type: 'tree',
                            minWidth: 150,
                            dicData: deviceTypeData,
                            props: {
                                label: "label",
                                value: "value",
                            },
                            rules: [
                                {
                                    required: true,
                                    message: "设备类型",
                                    trigger: "blur"
                                }
                            ]
                        }, {
                            label: "设备编号",
                            prop: "deviceNo",
                            minWidth: 180,
                            // search: true,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入设备编号",
                                    trigger: "click",

                                }
                            ]
                        }, {
                            label: "设备名称",
                            prop: "deviceName",
                            minWidth: 150,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入设备名称",
                                    trigger: "click",
                                }
                            ]
                        }, {
                            label: "设备状态",
                            prop: "deviceStatus",
                            minWidth: 80,
                            // search: true,
                            type: 'tree',
                            filterable: true,
                            dicData: [{ "label": "全部", "value": "-1" },
                            { "label": "在线", "value": "1" },
                            { "label": "离线", "value": "0" }],
                            addDisplay: false,
                            editDisplay: false,
                            viewDisplay: false,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入设备状态",
                                    trigger: "click",

                                }
                            ]
                        }, {
                            label: "设备参数",
                            prop: "paramJson",
                            hide: true,
                            formslot: true,
                            labelslot: true,
                            viewDisplay: true
                        }
                    ]
                }

            }
        },
        computed: {
            ...mapState({}),
            ...mapGetters(['tenantId'
            ])
        },
        watch: {
            'form.deviceType'() {
                if (this.form.deviceType === 'MJP') {
                    this.showParamJson = true;
                } else {
                    this.showParamJson = false;
                }

            },
            'form.mallNo'() {
                if(this.form.mallNo.length < 10){
                    this.form.mallNo = this.form.mallId
                }
                console.log("mallNo===" + this.form.mallNo);
                // let mallNo = this.form.mallNo;
                // debugger
                // let mallId = mallNo;
                // if (this.form.mallNo !== '' && mallId != undefined) {
                //     this.form.mallNo = mallId + "";
                // }
            },
            'form.paramJson'() {
                let paramJson = this.form.paramJson;
                console.log("paramJson===" + this.form.paramJson);
                if (paramJson != null && paramJson != '' && paramJson != undefined) {
                    let parmJso = JSON.parse(paramJson)
                    let inOutType = parmJso.inOutType;
                    console.log("inOutType===" + inOutType);
                    this.radio = inOutType;
                }
            }
        },
        methods: {

            selectionChange(list) {
                this.selectionList = list;
            }, onLoad() {
                let that = this
                if(this.query.mallId == ''){
                    delete this.query.mallId
                }
                if(this.query.deviceType == ''){
                    delete this.query.deviceType
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getDeviceList(this.tenantId, this.page.currentPage, this.page.pageSize,
                    this.query.mallId,
                    this.query.deviceType,
                    this.query.deviceName,
                    this.query.isOnline,
                    this.query.deviceNo).then(res => {
                        let data = res.data.data;
                        let records = data.records;
                        console.log(records)
                        let total = data.total;
                        this.page.total = total;
                        var dataList = new Array();
                        var sortDataList = new Array();
                        for (let i = 0; i < records.length; i++) {
                            var deviceData = records[i];
                            let mallName = deviceData.mallName;
                            let mallId = deviceData.mallId;
                            let mallSubName = deviceData.mallSubName;
                            let mallNo = mallName;
                            let isOnline = deviceData.isOnline;
                            if (isOnline) {
                                deviceData.deviceStatus = "在线";
                            } else {
                                deviceData.deviceStatus = "离线";
                            }
                            deviceData.mallNo = mallNo;
                            dataList.push(deviceData)
                        }
                        //按设备类型排序
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "CDC"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "CDB"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "DZC"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "MJP"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "JKXZ"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "RRM"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "SHJ"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "RRL4"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "RRL2"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "SALE"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "RRD0"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "GUIDE"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "WMT"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        for(var i=0;i<dataList.length;i++){
                            if(dataList[i].deviceType == "CAM"){
                                sortDataList.push(dataList[i])
                            }
                        }
                        this.data = sortDataList;
                        loading.close();
                    });
                getMall(this.tenantId, 1, 100, "", "").then(res => {
                    const mallData = res.data.data.records;
                    console.log(this.$refs.crud);
                    const index = this.$refs.crud.findObject(this.option.column, 'mallNo');
                    var mallList = new Array();
                    for (let i = 0; i < mallData.length; i++) {
                        var mallObj = mallData[i];
                        let mallName = mallObj.name;
                        let mallId = mallObj.id;
                        let mallNo = mallName;
                        mallObj.mallNo = mallNo;
                        mallList.push(mallObj)
                    }
                    that.mallOption = mallList;
                    index.dicData = mallList;

                });
            }, rowDel(row) {
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    console.log(row.id)
                    return remove(row.id);
                }).then(() => {
                    this.onLoad();
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                });
            },
            rowUpdate(row, index, loading, done) {
                console.log(row);
                let mallNo = row.mallNo;
                if (mallNo.indexOf("|") < 0) {
                    row.mallId = mallNo;
                }
                let deviceType = row.deviceType;
                if (deviceType === 'MJP') {
                    if (this.radio === 0) {
                        this.$message({
                            type: "error",
                            message: "请选择设备参数!"
                        });
                        done();
                        return;
                    }
                    let parmJson = {};
                    parmJson.inOutType = this.radio;
                    row.paramJson = JSON.stringify(parmJson);
                }
                console.log(row);
                update(row).then(() => {
                    loading();
                    this.onLoad();
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            }, rowSave(row, loading, done) {
                console.log("radio==" + this.radio);
                row.mallId = row.mallNo;
                let deviceType = row.deviceType;
                if (deviceType === 'MJP') {
                    if (this.radio === 0) {
                        this.$message({
                            type: "error",
                            message: "请选择设备参数!"
                        });
                        done();
                        return;
                    }
                    let parmJson = {};
                    parmJson.inOutType = this.radio;
                    row.paramJson = JSON.stringify(parmJson);
                }
                add(row).then(() => {
                    loading();
                    this.onLoad();
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            sizeChange(val) {
                this.page.currentPage = 1
                this.page.pageSize = val
                this.onLoad()
                // this.$message.success('行数' + val)
            }, currentChange(val) {
                this.page.currentPage = val
                this.onLoad()
                // this.$message.success('页码' + val)
            }, searchReset() {
                this.query = {};
                this.onLoad();
            }, searchChange(params, done) {
                params.mallId = params.mallNo;
                if (params.deviceStatus === '1') {
                    params.isOnline = true;
                } else if (params.deviceStatus === '0') {
                    params.isOnline = false;
                } else {
                    params.isOnline = null;
                }
                this.query = params;
                console.log(params);
                this.onLoad();
                done();
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
    /deep/.avue-crud .el-table th{
        background: #F5F7FA;
    }
    /deep/.avue-crud {
        width: 100%;
    }
  @import "../../../styles/style.scss";
</style>