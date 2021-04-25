<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom:1%;">
            <el-form v-model="query" label-width="30%">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="组织架构">
                            <!-- <el-select v-model="query.name" clearable>
                            <el-option v-for="item in areaIdOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select> -->
                            <avue-cascader  :dic="options" check-strictly :props="defaultProps"
                                placeholder="省-市-区-街道" @change="selectedRegion" style="width: 100%;"></avue-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="小区名称">
                            <!-- <el-select v-model="query.areaId" clearable>
                            <el-option v-for="item in nameOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select> -->
<!--                            <avue-cascader v-model="query.areaId" :dic="communityoptions" :props="defaultProp"-->
<!--                                placeholder="小区名称" style="width: 100%;"></avue-cascader>-->
                          <avue-input v-model="query.name" placeholder="小区名称"></avue-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=10 class="col">
                        <el-form-item>
                            <el-button type="success" icon="el-icon-search" size="small"
                                style="background-color: #4cb678;float: right;margin-top: 7%;" @click="getMall">查询
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <basic-container>
            <avue-crud :option="option" :data="data" ref="crud" v-model="form" :page="page"
                @selection-change="selectionChange" @on-load="getMall" @size-change="sizeChange"
                @current-change="currentChange" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave"
                @search-reset="searchReset" @search-change="searchChange" @refresh-change="getMall">
              <template slot="menuLeft">
                <el-button  type="success"
                            size="small"
                            icon="el-icon-s-custom"
                            @click="handleGarden">苑管理
                </el-button>
              </template>
                <template slot-scope="scope" slot="menu">
                    <el-button icon="el-icon-s-home" size="small" type="text" @click="roomNumDetail(scope.row)">房号详情
                    </el-button>
                </template>
            </avue-crud>

            <el-drawer title="房号详情" :visible.sync="drawer" :direction="direction" :before-close="handleClose"
                size="100%">
                <avue-crud :data="roomData" :option="roomOption" v-model="roomObj" :page="roomPage"
                           :search.sync="roomQuery"
                               @size-change="sizeRoomChange" @current-change="currentRoomChange"
                           @search-reset="searchRoomReset"
                       @search-change="searchRoomChange"
                           @row-del="rowRoomDel"
                           @row-update="rowEdit">
                  <template slot="menuLeft">
                    <el-button  type="success"
                                size="small"
                                icon="el-icon-plus"
                    @click="addRoom">新增
                    </el-button>
                  </template>
<!--                  <template slot="searchMenu" slot-scope="scope">-->
<!--                    <el-button size="small" type="success" icon="el-icon-search" @click="roomQueryData">查询</el-button>-->
<!--                  </template>-->
                </avue-crud>
            </el-drawer>

          <el-drawer :title="grantTitle" :visible.sync="grantDrawer" direction="rtl" :before-close="handleClose"
                     size="35%">

            <el-row v-for="(domain, index) in grantForm.grantItem" :key="index+1">
              <el-form :inline="true" class="demo-form-inline" style="margin-left: 20px">
                <el-form-item label="苑名"
                              :prop="'grantItem.' + index + '.name'">
                  <el-input v-model="domain.grantName" placeholder="请输入苑名"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="info" icon="el-icon-delete" size="small" @click="delGrantRow(domain,index)">删除</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button type="warning" icon="el-icon-plus" size="small" @click="addGrantRow">新增</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <center>
              <el-button type="primary" @click="saveGrant">保存</el-button>
              <el-button type="info" @click="handleClose" >取消</el-button>
            </center>

          </el-drawer>

          <el-drawer title="新增" :visible.sync="roomDrawer" direction="rtl" :before-close="handleRoomClose"
                     size="50%">
            <el-form ref="roomForm" :model="roomForm" :rules="roomFormRules" label-width="120px" label-position="right">
              <el-form-item label="小区：">
                <el-input  v-model="roomForm.name"disabled style="width: 40%"></el-input>
              </el-form-item>
              <el-form-item label="苑名：" v-if="grantData.length > 0">
                <el-select v-model="roomForm.garden" placeholder="请选择苑名" style="width: 40%">
                  <el-option  v-for="val in grantData" :label="val" :value="val"></el-option>
                </el-select>
              </el-form-item>
              <el-row>
                <el-col span="12" >
                  <el-form-item label="楼栋开始："  prop="buildBegin">
                    <el-input v-model="roomForm.buildBegin"  placeholder="请输入楼栋编号" ></el-input>
                  </el-form-item>
                </el-col>
                <el-col span="12" >
                  <el-form-item label="楼栋结束：" prop="buildEnd">
                    <el-input v-model="roomForm.buildEnd" placeholder="请输入楼栋编号"  style="position: relative;right: 10px;" ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col span="12" >
                  <el-form-item label="单元数：" prop="unitNum">
                    <el-select v-model="roomForm.unitNum" filterable  placeholder="请选择单元数" style="display: block">
                      <el-option label="无" value="无"></el-option>
                      <el-option v-for="val in maxUnitNum" :label="val" :value="val"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col span="12" >
                  <el-form-item label="每栋最大层数：" prop="floorNum">
                    <el-select v-model="roomForm.floorNum"  filterable placeholder="请选择每栋最大层数" style="display: block;position: relative;right: 10px;">
                      <el-option v-for="val in maxUnitNum" :label="val" :value="val"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row >
                <el-col span="10" >
                  <el-form-item label="每单元户数：" prop="roomNum">
                    <el-select v-model="roomForm.roomNum" placeholder="请选择">
                      <el-option v-for="val in maxRoomNum" :label="val" :value="val"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col span="8" >
                  <el-form-item label="编号从：" prop="roomBegin">
                    <el-input v-model="roomForm.roomBegin"  placeholder="请输入"></el-input>
                  </el-form-item>
                </el-col>
                <el-col span="1" class="line" >
                  <div style="line-height: 40px;margin-left: 3px">到</div>
                </el-col>
                <el-col span="4">
                  <el-input v-model="roomForm.roomEnd"  placeholder="请输入" :style="styleObject" ></el-input>
                </el-col>
              </el-row>
              <el-form-item style="text-align: center">
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="onRoomCancel">取消</el-button>
              </el-form-item>
            </el-form>

          </el-drawer>

        </basic-container>
    </div>
</template>

<script>
    import { mapGetters, mapState } from "vuex";
    import { baseUrl } from '@/config/env';
    import { add, getDeviceByMall, getMall, remove, update, getHouseByMallId,addGarden} from "../../../api/mall";
    import { getUserMessage,addRoomNum,removeRoomNum,updateRoomNum} from '../../../api/house';
    import { getArea } from "../../../api/system/device";

    export default {
        name: "list",
        data() {
            return {
                styleObject:{"margin-top": "3px"},
                grantMall:{},
                maxUnitNum:99,
                maxRoomNum:4,
                grantData:[],
                roomForm:{},
                roomFormRules: {
                    buildBegin: [
                        { required: true, message: '请输入楼栋编号', trigger: 'blur' }
                    ],
                    buildEnd:[
                        { required: true, message: '请输入楼栋编号', trigger: 'blur' }
                    ],unitNum:[
                        { required: true, message: '请选择单元数', trigger: 'change' }
                    ],floorNum:[
                        { required: true, message: '请选择', trigger: 'change' }
                    ],roomNum:[
                        { required: true, message: '请选择单元数', trigger: 'change' }
                    ],roomBegin:[
                        { required: true, message: '请输入', trigger: 'blur' }
                    ]
                },
                grantForm :{"grantName":"",grantItem: [{"grantName":""}]},
                roomPage: {
                    pageSize: 50,
                    currentPage: 1,
                    total: 20
                },
                options: [],
                defaultProps: { label: 'orgName', value: 'orgId', checkStrictly: true, filterable: true },
                defaultProp: { label: 'orgName', value: 'orgName', checkStrictly: true },
                drawer: false,
                grantDrawer:false,
                roomDrawer:false,
                grantTitle:'苑管理',
                communityoptions: [],
                chooseMallId: "",
                chooseMall:{},
                direction: 'ttb',
                form: {},
                roomQuery: {},
                query: { 'name': '', 'areaId': '' },
                nameOptions: [],
                areaIdOptions: [],
                selectionList: [],
                roomData: [],
                roomOption: {
                    searchMenuSpan: true,
                    page: true,
                    align: 'center',
                    menuAlign: 'center',
                    addBtn: false,
                    menu: true,
                    refreshBtn: false,
                    searchBtn: true,
                    header: true,
                    columnBtn: false,
                    menuPosition:'center',
                    column: [
                        {
                            label: '所属街道',
                            prop: 'orgName',
                            editDisabled:true
                        },
                        {
                            label: '小区名称',
                            prop: 'mallName',
                            editDisabled:true
                        }, {
                            label: '苑名',
                            prop: 'garden',
                            type:'select',
                            dicData:[],
                            size:'small',
                            width:50,
                            props: {
                                label: "name",
                                value: "id"
                            },
                            search: true,
                        }, {
                            label: "楼宇编号",
                            prop: "building",
                            search: true,
                            addDisplay: false,
                        }, {
                            label: "单元编号",
                            prop: "unit",
                            search: true,
                            addDisplay: false,
                        }, {
                            label: "房号",
                            prop: "room",
                            search: true,
                            addDisplay: false,
                        }
                    ]
                },
                roomObj: {},
                page: {
                    pageSize: 50,
                    currentPage: 1,
                    total: 20
                },
                areaData: [],
                data: [],
                option: {
                    searchMenuSpan: true,
                    menuPosition: 'center',
                    tip: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    align: 'center',
                    selection: true,
                    viewBtn: false,
                    dialogHeight: 450,
                    page: true,
                    menu: true,
                    stripe: true,
                    columnBtn: false,
                    refreshBtn: false,
                    column: [
                        {
                            label: "所属街道",
                            prop: "address",
                            // search: true,
                            type: "tree",
                            dicUrl: baseUrl + '/device/area/tree',
                            props: {
                                label: "name",
                                value: "id",
                                children: 'children',
                            },
                            rules: [
                                {
                                    required: true,
                                    message: "请选择所属街道",
                                    trigger: "click",
                                }
                            ]
                        }, {
                            label: '街道',
                            prop: 'areaId',
                            hide: true,
                            display: false
                        },
                        {
                            label: '小区名称',
                            prop: 'name',
                            // search: true,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入网点名称",
                                    trigger: "blur"
                                }
                            ]
                        },  {
                            label: '苑',
                            prop: 'garden'
                        },{
                            label: "联系人",
                            prop: "contactName",
                        }, {
                            label: "联系电话",
                            prop: "phone"

                        }
                    ]
                },
                current: 1,
                size: 10,
                total: 0,

            }
        },
        watch: {
            'form.address'() {
                let areaId = this.form.areaId;
                if (areaId != null && areaId != '' && areaId != undefined) {
                    this.form.address = areaId;
                }
                console.log("街道：" + this.form.address);
            }
        },
        computed: {
            ...mapGetters(["permission", "tenantId", "userInfo"]),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permission.mall_add, false),
                    delBtn: this.vaildData(this.permission.mall_delete, false),
                    editBtn: this.vaildData(this.permission.mall_update, false)
                }
            }
        },
        created() {
            this.getOrganization();
        },
        methods: {
            roomQueryData(){
                this.roomPage.currentPage = 1;
                this.getHouseByMallIdData();
            },
            rowEdit(row, index,done,loading){
                console.log(row);
                loading();
                updateRoomNum(row.id,row.building,row.garden,row.room,row.unit).then(res=>{
                    this.$message({
                        type: "success",
                        message: "修改成功!"
                    });
                    done();
                    this.roomNumDetail(this.chooseMall)
                });

            },
            onRoomCancel(){
                this.roomDrawer = false;
            },
            onSubmit(){
                this.roomForm.mallId = this.chooseMall.id;
                console.log(this.roomForm)
                if(  this.roomForm.roomEnd == '' ||   this.roomForm.roomEnd == null){
                 // document.getElementById("roomEnd").style.border='1px soild red'
                    this.styleObject={"margin-top": "3px",'border': '1px solid red', 'border-radius':' 5px'};
                }
                this.$refs["roomForm"].validate((valid) =>{
                    if (valid) {
                        addRoomNum(this.chooseMall.id,
                            this.roomForm.buildBegin,
                            this.roomForm.buildEnd,
                            this.roomForm.floorNum,
                            this.roomForm.garden,
                            this.roomForm.roomBegin,
                            this.roomForm.roomEnd,
                            this.roomForm.roomNum,
                            this.roomForm.unitNum).then(res =>{
                            this.$message({
                                type: "success",
                                message: "保存成功!"
                            });
                            this.roomDrawer = false;
                            this.roomNumDetail(this.chooseMall)
                        });
                    } else {
                        return false;
                    }
                });

            },
            addRoom(){
                // const indexMall = this.$refs.crud.findObject(this.roomOption.column, 'mallName');
                // indexMall.value = "mall"
                this.roomDrawer = true;
                console.log(this.chooseMall);
                this.roomForm = {};
                this.roomForm.name = this.chooseMall.name;
                this.grantData = new Array();
                if(this.chooseMall.garden !='' && this.chooseMall.garden != null){
                    this.grantData = this.chooseMall.garden.split(",");
                }
            },
            saveGrant(){
                console.log(this.grantForm.grantItem);
                let grantNames = [];
                this.grantForm.grantItem.forEach(ele => {
                    console.log(ele)
                    if(ele.grantName !='' && ele.grantName!=null){
                        grantNames.push(ele.grantName);
                    }
                });
                let grantNamesData = grantNames.join(",");
                console.log("grantNamesData=="+grantNamesData);
                this.grantDrawer = false;
                addGarden(this.grantMall.id,grantNamesData).then(res=>{
                    this.$message({
                        type: "success",
                        message: "保存成功!"
                    });
                    this.getMall();
                });

            },
            addGrantRow(){
                this.grantForm.grantItem.push({
                    grantName: ''
                });
            },
            delGrantRow(item, index){
                this.grantForm.grantItem.splice(index, 1)
            },
            getOrganization() {// 获取组织结构
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
                    let regionObj = resp.data.data;
                    this.screenRegion(regionObj);
                    this.options = regionObj;
                })
            },
            screenRegion(data) {
                data.forEach(v => {
                    // debugger
                    if (v.children) {
                        for (var i = 0; i < v.children.length; i++) {
                            if (v.children[i].children) {
                                this.screenRegion(v.children);
                            } else if (v.children[i].orgId.length > 10) {
                                v.children.splice(i, 1);
                                i--;
                            }
                        }
                        if (v.children.length == 0) {
                            delete v.children
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
            selectedRegion(e) {
                let areaData = e;
                let areaID = areaData[areaData.length -1];
                 console.log("areaData="+areaID);
                this.query.areaId =areaID;

                //  let areaIds =areaData.split(",");
                // console.log("areaId="+areaIds);
                // this.query.areaId = areaIds[areaIds.length-1];
                // let that = this;
                // let userOrgList = this.userInfo.userOrgList;
                // let roleData = this.userInfo.roleList;
                // let userOrgDesc = '';
                // let userOrg = "";
                // if (roleData.length > 0) {
                //     this.roleType = roleData[0].roleType;
                // }
                // userOrgList.forEach(v => {
                //     let orgId = v.orgId;
                //     let orgDesc = v.orgDesc;
                //     userOrgDesc = userOrgDesc + orgDesc + "#";
                //     userOrg = userOrg + orgId + "#";
                // });
                // getUserMessage(userOrg, userOrgDesc, this.roleType).then(resp => {
                //     that.communityoptions = [];
                //     that.screenCommunity(resp.data.data, e[e.length - 1]);
                //     if (that.communityoptions.length > 1) {
                //         for (var i = 0; i < that.communityoptions.length; i++) {
                //             for (var j = i + 1; j < that.communityoptions.length; j++) {
                //                 if (that.communityoptions[i].orgId == that.communityoptions[j].orgId && that.communityoptions[i].orgName == that.communityoptions[j].orgName) {
                //                     that.communityoptions.splice(j, 1);
                //                     j = i;
                //                 }
                //             }
                //         }
                //     }
                // })
            },
            roomNumDetail(mall) {
                let mallId = mall.id;
                this.chooseMall = mall;
                console.log("mallId==" + mallId);
                this.chooseMallId = mallId;
                const indexGarden = this.$refs.crud.findObject(this.roomOption.column, 'garden');
                console.log(indexGarden);

                let garden = this.chooseMall.garden;
                if(garden !='' && garden != null){
                    let grantData = garden.split(",");
                    let ditDatas = new Array();
                    grantData.forEach(v=>{
                        ditDatas.push({"name":v,"id":v});
                    });
                    console.log(ditDatas);
                    indexGarden.search = true;
                    indexGarden.dicData = ditDatas;

                }else{
                    indexGarden.search = false;
                }
                this.getHouseByMallIdData();
            }, getHouseByMallIdData() {
                const loading = this.$loading({
                    lock: true,
                    text: this.$t('获取房号详情,请稍后'),
                    spinner: "el-icon-loading"
                });
                if (this.roomQuery.building == '') {
                    delete this.roomQuery.building
                }
                if (this.roomQuery.unit == '') {
                    delete this.roomQuery.unit
                }
                if (this.roomQuery.room == '') {
                    delete this.roomQuery.room
                }
                if (this.roomQuery.garden == '') {
                    delete this.roomQuery.garden
                }
                getHouseByMallId(this.roomPage.currentPage,
                    this.roomPage.pageSize, this.chooseMallId,
                    this.roomQuery.building,
                    this.roomQuery.unit,
                    this.roomQuery.room,
                    this.roomQuery.garden).then(res => {
                        this.drawer = true;
                        const data = res.data.data;
                        let records = data.records;
                        this.roomData = records;
                        this.roomPage.total = data.total;
                        loading.close();
                    }).catch(() => {
                        loading.close()
                    });
            }, sizeRoomChange(val) {
                this.roomPage.currentPage = 1;
                this.roomPage.pageSize = val;
                this.getHouseByMallIdData();

            }, currentRoomChange(val) {
                this.roomPage.currentPage = val
                this.getHouseByMallIdData();
            }, searchRoomReset() {
                this.roomQuery = {};
                this.getHouseByMallIdData();
            }, searchRoomChange(params, done) {
                this.roomQuery = params;
                this.roomPage.currentPage = 1;
                this.getHouseByMallIdData();
                done();
            },handleRoomClose(){
                this.roomDrawer = false;
            }, handleClose() {
                this.drawer = false;
                this.grantDrawer = false;

            },
            selectionChange(list) {
                this.selectionList = list;
            }, getMall() {
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getMall(this.tenantId, this.page.currentPage, this.page.pageSize, this.query.name, this.query.areaId).then(res => {
                    let data = res.data.data;
                    let records = data.records;
                    let total = data.total;
                    this.page.total = total;
                    this.data = records;
                    loading.close();
                });
            },
            sizeChange(val) {
                this.page.currentPage = 1
                this.page.pageSize = val
                this.getMall()
                // this.$message.success('行数' + val)
            },
            currentChange(val) {
                this.$message.success('页码' + val)
                this.page.currentPage = val
                this.getMall()
            },rowRoomDel(row){
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    console.log(row.id)
                    removeRoomNum(row.id).then(res => {
                        this.roomNumDetail(this.chooseMall);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
                });
            },rowDel(row) {
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    console.log(row.id)
                    return remove(row.id);
                })
                    .then(() => {
                        this.getMall();
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
            }, rowUpdate(row, index, loading, done) {
                console.log(row);
                let areaId = row.areaId;
                let address = row.address;
                if (areaId != '' && areaId != undefined) {
                    var ar = this.familyTree(this.areaData, address);
                    console.log(ar);
                    if (ar) {
                        var addressName = '';
                        for (let i = ar.length - 1; i >= 0; i--) {
                            let itemData = ar[i];
                            let name = itemData.name;
                            console.log('name==' + name)
                            addressName = addressName + name;
                        }
                        if (ar.length > 0) {
                            row.address = addressName;
                            row.areaId = address;
                        }


                    }

                }

                update(row).then(() => {
                    loading();
                    this.getMall();
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            // 查找一个节点的所有父节点
            familyTree(arr1, id) {
                var temp = []
                var forFn = function (arr, id) {
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i]
                        if (item.id === id) {
                            temp.push(item)
                            forFn(arr1, item.parentId)
                            break
                        } else {
                            if (item.children) {
                                forFn(item.children, id)
                            }
                        }
                    }
                }
                forFn(arr1, id)
                return temp
            }, rowSave(row, loading, done) {
                let address = row.address;
                let areaId = address;
                console.log("areaId==" + areaId);
                console.log("address==" + address);
                if (areaId != '' && areaId != undefined) {
                    var ar = this.familyTree(this.areaData, address);
                    console.log(ar);
                    if (ar) {
                        var addressName = '';
                        for (let i = ar.length - 1; i >= 0; i--) {
                            let itemData = ar[i];
                            let name = itemData.name;
                            console.log('name==' + name)
                            addressName = addressName + name;
                        }
                        if (ar.length > 0) {
                            row.address = addressName;
                            row.areaId = address;
                        }


                    }

                }
                console.log(row);
                add(row).then(() => {
                    loading();
                    this.getMall();
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            }, searchReset() {
                this.query = {};
                this.getMall();
            }, searchChange(params, done) {
                this.query = params;
                params.areaId = params.address;
                console.log(params);
                this.getMall();
                done();
            }, cellMouseEnter(row) {
                console.log(row)

            },handleGarden(){
                if (this.selectionList.length !== 1) {
                    this.$message.warning("只能选择一条数据");
                    return;
                }
                console.log(this.selectionList);
                this.grantDrawer = true;
                let mallObj = this.selectionList[0];
                this.grantTitle = mallObj.name+" 苑管理";
                this.grantMall = mallObj;
                let grant = mallObj.garden;
                if(grant!=null && grant!='' && grant!=undefined){
                    let grants = grant.split(",");
                    this.grantForm.grantItem = new Array();
                    grants.forEach(ele =>{
                        this.grantForm.grantItem.push({
                            grantName: ele
                        })
                    })
                }else{
                    this.grantForm.grantItem = new Array();
                    this.grantForm.grantItem.push({
                        grantName: ""
                    })
                }

            }
        }, mounted() {
            getArea().then(res => {
                let data = res.data.data;
                this.areaData = data;
                console.log(data);

            });
        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-drawer__header {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        color: #72767b;
        display: flex;
        margin-bottom: 12px;
        padding: 20px 20px 0;
    }

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

    /deep/ .el-col-md-6 {
      width: 20%;
    }

    @import "../../../styles/style.scss";
</style>
<style rel="stylesheet/scss" lang="scss">
    .el-drawer {
        overflow: scroll
    }
</style>
