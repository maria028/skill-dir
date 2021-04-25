<template>
    <div style="width: 98%;margin:0 1%">
        <el-card style="margin-bottom:1%;">
            <el-form v-model="query" label-width="20%">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="小区">
                            <avue-cascader v-model="query.mallId" :dic="mallOptions" :props="defaultProps"
                                :show-all-levels="false" placeholder="请选择" style="width: 100%;"  @change="selectedMall">
                            </avue-cascader>
                        </el-form-item>
                    </el-col>
                  <el-col :span=6 class="col" v-if="chooseMallGrand.length !=0">
                    <el-form-item label="苑">
                      <avue-cascader v-model="query.garden" :dic="chooseMallGrand" :props="defaultGardenProps"
                                     :show-all-levels="false" placeholder="请选择" style="width: 100%;" @change="pageReset">
                      </avue-cascader>
                    </el-form-item>
                  </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="楼宇">
                            <el-select v-model="query.building" clearable style="width: 100%;">
                                <el-option v-for="item in buildOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="单元">
                            <el-select v-model="query.unit" clearable style="width: 100%;">
                                <el-option v-for="item in unitOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="房号">
                            <el-select v-model="query.room" clearable style="width: 100%;">
                                <el-option v-for="item in roomOptions" :key="item.value" :label="item.label"
                                    :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span=2 :offset=22 class="col">
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
            <avue-crud :option="option" :data="data" ref="crud" v-model="form" :page="page" @on-load="getData"
                @refresh-change="getData" @selection-change="selectionChange" :span-method="spanMethod"
                @size-change="sizeChange" @current-change="currentChange" @search-reset="searchReset"
                @search-change="searchChange">
                <!--        <template slot="menuLeft">-->
                <!--          <el-button type="primary" plain size="small" @click="dealCard">绑定一卡通</el-button>-->
                <!--        </template>-->
                <template slot="cardList" slot-scope="scope">


                    <div>
                        <div style="width: 100%" v-for="card in scope.row.cardList">
                            {{card.cardNum}}
                        </div>

                    </div>

                </template>

                <template slot="acctNo" slot-scope="scope">
                    <div v-if="scope.row.acctNo !=''" style="width: 100%">
                        {{scope.row.acctNo}}

                    </div>
                    <div v-else>

                    </div>

                </template>
                <template slot="memberName" slot-scope="scope">
                    <span>{{scope.row.memberName}}
                        <el-tag type="danger" v-if="scope.row.isHolder==1">户主</el-tag>
                    </span>
                </template>
                <template slot="carPlate" slot-scope="scope">
                    <div v-for="(item,i) in scope.row.carPlate" v-if="scope.row.carPlate!=''" style="width: 100%">
                        {{item}}
                        <!-- <el-button type="text" size="small"  @click="unBindPlate(scope.row,item)">解绑</el-button> -->
                    </div>
                    <div>

                    </div>

                </template>
<!--                <template slot="imageUrl" slot-scope="scope">-->
<!--                    <el-image v-if="scope.row.imageUrl!=''" style="width: 60px; height: 60px" :src="scope.row.imageUrl"-->
<!--                        fit="contain" lazy>-->
<!--                        <div slot="error" class="image-slot">-->
<!--                            <i class="el-icon-picture-outline"></i>-->
<!--                        </div>-->
<!--                    </el-image>-->
<!--                </template>-->
                <template slot="opertion" slot-scope="scope">
                    <el-button type="text" size="small" @click="addMember(scope.row)">新增</el-button>
                    <el-button type="text" size="small" v-if="scope.row.memberId != '' "
                        @click="updateMember(scope.row)">修改</el-button>
                    <el-button type="text" size="small" v-if="scope.row.memberId != '' "
                        @click="btnDelMember(scope.row)">删除</el-button>
                    </br>
                    <el-button type="text" size="small" v-if="scope.row.memberName != '' " @click="dealCard(scope.row)">
                        发卡</el-button>
                    <el-button type="text" size="small" v-if="scope.row.memberName != '' "
                        @click="unBindCardData(scope.row)">解绑</el-button>
                    </br>
                    <el-button type="text" size="small" v-if="scope.row.memberName != '' "
                        @click="addAccount(scope.row)">绑定帐号</el-button>
                    <el-button type="text" size="small" v-if="scope.row.memberName != '' "
                        @click="unBindAccountData(scope.row)">解绑</el-button>
                </template>
            </avue-crud>
        </basic-container>
        <el-drawer :title="drawerTitle" :visible.sync="drawer" :direction="direction" :before-close="handleClose"
            :before-upload="beforUpload" size="30%" v-if="jucheng">
            <el-form ref="memberForm" :model="memberForm" label-width="20%" :rules="rules">
                <!-- <span style="margin: 0 0 3% 3%;display: block;font-size: 14px;color: #606266;">户号：{{doorNo}}</span> -->
                <el-form-item label="户号">
                    <el-input v-model="doorNo" disabled style="width:90%"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" required>
                    <el-input v-model="phone" maxlength="11" show-word-limit style="width: 70%;" :disabled="!addMsg">
                    </el-input>
                    <el-button type="primary" @click="findMember" size="small" :disabled="!addMsg"
                        v-preventReClick="3000" style="margin-left: 1%;">查询</el-button>
                </el-form-item>
                <el-form-item label="成员姓名">
                    <el-input v-model="memberName" disabled clearable style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="成员照片">
                    <el-upload class="upload-demo" action="#" :on-preview="handlePreview" :on-remove="handleRemove"
                        :file-list="fileList" :before-upload="beforeAvatarUpload" :auto-upload=false list-type="picture"
                        :limit="1" :on-exceed="handleExceed" :on-change="onchange" disabled style="width: 90%;">
                        <!-- <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                    </el-upload>
                    <!--          <van-uploader v-model="faceImageUrl"-->
                    <!--                        multiple-->
                    <!--                        :after-read="afterRead"-->
                    <!--                        :max-count="1"-->
                    <!--                        :preview-full-image="false"/>-->
                    <!-- <img :src="memberImg" alt="" width="20%" > -->
                </el-form-item>
                <el-form-item label="车牌号">
                    <!-- <el-input v-model="plate" disabled
                    clearable style="width: 95%;"></el-input> -->
                    <el-select v-model="plate" style="width: 90%;" v-if="addMsg">
                        <el-option v-for="item in plateOptions" :key="item.plate" :value="item.plate"
                            :label="item.plate"></el-option>
                    </el-select>
                    <el-input v-for="(item,index) in memberPlate" v-model="plates[index]" clearable style="width: 90%;"
                        :key="index" v-if="!addMsg && memberPlate != ''"></el-input>
                    <el-input v-model="carPlate" clearable style="width: 90%;" v-if="addPlate"></el-input>
                    <el-button type="text" size="small" v-if="!addMsg && !addPlate" @click="addPlate = true">绑定车牌号
                    </el-button>
                </el-form-item>
                <el-form-item label="一卡通">
                    <!-- <el-select v-model="chooseCardNoS" clearable multiple filterable  placeholder="请选择卡号">
            <el-option :label="card.cardNum" v-for="card in cardNos" :value="card.cardNum"></el-option>
          </el-select> -->
                    <el-input v-model="chooseCardNoS" clearable disabled style="width: 90%;"></el-input>
                </el-form-item>

                <!-- <el-form-item label="绑定帐户"  >
          <el-select v-model="chooseUserId" clearable placeholder="请选择帐户">
            <el-option  v-for="acc in  accountList" :label="acc.phone" :value="acc.userId"></el-option>
          </el-select>
        </el-form-item> -->
                <el-form-item label="是否户主">
                    <el-switch v-model="isHolder"></el-switch>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
                    <el-button @click="cancelDrawer" size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
        <el-drawer :title="drawerTitle" :visible.sync="drawer" :direction="direction" :before-close="handleClose"
            :before-upload="beforUpload" size="30%" v-if="!jucheng">
            <el-form ref="memberForm" :model="memberForm" label-width="20%" :rules="rules">
                <el-form-item label="户号">
                    <el-input v-model="doorNo" disabled style="width:90%"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" required>
                    <el-input v-model="phone" maxlength="11" show-word-limit style="width: 90%;">
                    </el-input>
                </el-form-item>
                <el-form-item label="成员姓名">
                    <el-input v-model="memberName" clearable style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="成员照片">
                    <el-upload class="upload-demo" action="#" :on-preview="handlePreview" :on-remove="handleRemove"
                        :file-list="fileList" :before-upload="beforeAvatarUpload" :auto-upload=false list-type="picture"
                        :limit="1" :on-exceed="handleExceed" :on-change="onchange" style="width: 90%;">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="车牌号">
                    <el-input v-for="(item,index) in memberPlate" v-model="plates[index]" clearable style="width: 90%;"
                        :key="index" v-if="!addMsg && memberPlate != ''"></el-input>
                    <el-input v-model="carPlate" clearable style="width: 90%;" v-if="addPlate"></el-input>
                    <el-button type="text" size="small" v-if="!addMsg && !addPlate" @click="addPlate = true">绑定车牌号
                    </el-button>
                </el-form-item>
                <el-form-item label="一卡通">
                    <el-input v-model="chooseCardNoS" clearable style="width: 70%;"></el-input>
                    <el-button type="primary" size="small" style="margin-left: 1%;" @click="readCard">读卡</el-button>
                </el-form-item>
                <el-form-item label="是否户主">
                    <el-switch v-model="isHolder"></el-switch>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="small" @click="onSubmit">保存</el-button>
                    <el-button @click="cancelDrawer" size="small">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
        <el-dialog title="请选择" :visible.sync="dialogVisible" width="50%" :before-close="handleClose2">
            <el-radio-group v-model="radio" style="width: 100%;">
                <el-row v-for="(user,i) in doorPersonResults" style="margin: 1%;">
                    <el-radio :label="i" style="width:100%;" border>
                        <el-col :span=4 style="padding-left: 10px;"> 姓名：{{user.name}}</el-col>
                        <el-col :span=7> 卡号：{{user.idNum}}</el-col>
                        <el-col :span=10>手机号码：{{user.phone}}</el-col>
                    </el-radio>
                </el-row>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addMemberMsg">确 定</el-button>
            </span>
        </el-dialog>
        <el-drawer title="发卡" :visible.sync="cardDrawer" :direction="direction" size="30%">
            <!-- <div style="position: relative;left: 10px;
      padding-top: 10px;padding-bottom: 10px;font-size: 14px;color: #606266">卡号归属信息：{{cardInfo}}</div>
      <avue-form :option="cardOption" v-model="cardNos" @submit="submitCard"></avue-form> -->
            <el-form ref="cardNos" :model="cardNos" label-width="20%" :rules="rules">
                <el-form-item label="房号">
                    <el-input v-model="cardInfoRoom" disabled style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="业主">
                    <el-input v-model="cardInfoOwner" disabled style="width: 90%;"></el-input>
                </el-form-item>
                <el-form-item label="卡号">
                    <el-select v-model="cardNos.cardNo" clearable style="width: 70%;">
                        <el-option v-for="item in cardOption" :key="item.cardNum" :label="item.cardNum"
                            :value="item.cardNum"></el-option>
                    </el-select>
                    <el-button type="primary" size="small" style="margin-left: 1%;" @click="readCard">读卡</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="submitCard(cardNos)">提交</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>


        <el-drawer title="帐号绑定" :visible.sync="accountDrawer" :direction="direction" size="30%">
            <!-- <avue-form :option="accountOption" v-model="accountList" @submit="submitAccount"></avue-form> -->
            <el-form ref="accountList" :model="accountList" label-width="20%" :rules="rules">
                <el-form-item label="账号">
                    <el-select v-model="accountList.userId" clearable style="width: 90%;" filterable>
                        <el-option v-for="item in accountOption" :key="item.userId" :label="item.phone"
                            :value="item.userId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="submitAccount(accountList)">提交</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
        <el-drawer title="车牌号绑定" :visible.sync="plateDrawer" :direction="direction" size="30%">
            <el-form ref="plateList" :model="plateList" label-width="20%" :rules="rules">
                <el-form-item label="车牌号">

                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="submitPlate">提交</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>

</template>

<script>
    import { getHouseMemberList } from "../../api/mobile/mobile";
    import { getMall } from "../../api/mall";
    import { removeHoseMember, addHoseMember, addCard, getAllAccount, getCardByMallId, bindAccount, unBindAccount, unBindCard, findMemberMsg, bindCarPlate, unbindCarPlate } from "../../api/house";
    import { mapGetters, mapState } from "vuex";
    import residentInfoList from "../../config/residentInfoList";
    import { getUserMessage } from '../../api/house';

    export default {
        name: "residentInfoList",
        data() {
            return {
                ws: null,
                doorNo: '',
                radio: '',
                queryData: [],
                doorPersonResults: [],
                fileList: [],
                plateOptions: [],
                addMsg: true,
                jucheng: true,
                memberPlate: [],
                cardDrawer: false,
                accountDrawer: false,
                addPlate: false,
                plateDrawer: false,
                cardNos: [],
                mallOptions: [],
                mallData:{},
                buildOptions: residentInfoList.buildOptions,
                unitOptions: residentInfoList.unitOptions,
                roomOptions: residentInfoList.roomOptions,
                defaultProps: { label: 'name', value: 'id', checkStrictly: true },
                defaultGardenProps: { label: 'name', value: 'name', checkStrictly: true },
                cardInfo: '',
                cardInfoRoom: '',
                cardInfoOwner: '',
                cardOption: {},
                accountInfo: '',
                accountOption: {},
                accountList: [],
                plateList: [],
                drawerTitle: '',
                houseId: '',
                mallId: '',
                memberImg: '',
                rules: {
                    memberName: [
                        { required: true, message: '请输入成员姓名', trigger: 'blur' }
                    ],
                    phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }]
                },
                plate: '',
                plates: [],
                carPlate: '',
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                drawer: false,
                direction: 'rtl',
                form: {},
                memberForm: {},
                query: { "mallId": null, "cardNumList": null, "userName": null, "building": null, "unit": null, "room": null ,"garden":null},
                selectionList: [],
                page: {
                    pageSize: 50,
                    currentPage: 1,
                    total: 0
                },
                mergeSpanArr: [], // 空数组，记录每一行的合并数
                mergeSpanArrIndex: '', // mergeSpanArr的索引
                data: [],
                option: {
                    searchMenuSpan: true,
                    tip: false,
                    border: true,
                    index: false,
                    indexLabel: '序号',
                    viewBtn: true,
                    addBtn: false,
                    align: 'center',
                    menu: false,
                    page: true,
                    border: true,
                    stripe: true,
                    menuAlign: 'center',
                    refreshBtn: false,
                    columnBtn: false,
                    selection: false,
                    header: false,
                    column: [
                        {
                            label: "小区名称",
                            prop: "mallName",
                            type: "tree",
                            minWidth: 80,
                            // search: true,
                            // clearable:true,
                            dicData: [],
                            props: {
                                label: "mallName",
                                value: "id"
                            }, rules: [
                                {
                                    required: true,
                                    message: "请选择网点",
                                    trigger: "blur"
                                }
                            ]
                        }, {
                            label: "网点Id",
                            prop: "mallId",
                            hide: true
                        },
                        //  {
                        //     label: "幢",
                        //     prop: "building",
                        //     search: true,
                        //     hide:true,
                        //     labelWidth:30
                        // }, {
                        //     label: "单元",
                        //     prop: "unit",
                        //     search: true,
                        //     hide:true
                        // }, {
                        //     label: "房号",
                        //     prop: "room",
                        //     search: true,
                        //     hide:true,
                        //     width:30
                        // },
                        {
                            label: "房号",
                            prop: "roomInfo",
                            minWidth: 80

                        }, {
                            label: "卡号",
                            prop: "cardNumList",
                            hide: true

                        }, {
                            label: "家庭成员",
                            children: [
                                {
                                    label: '名字',
                                    prop: "memberName",
                                    slot: true,
                                    minWidth: 80,
                                },
                                {
                                    label: '联系方式',
                                    prop: "phone",
                                    minWidth: 115
                                },
                                {
                                    label: '卡号',
                                    prop: "cardList",
                                    slot: true,
                                    minWidth: 100
                                },
                                {
                                    label: '车牌号',
                                    prop: "carPlate",
                                    minWidth: 90,
                                    slot: true
                                },
                                {
                                    label: '昵称',
                                    prop: "nickName",
                                    minWidth: 80
                                },
                                {
                                    label: '注册账号',
                                    prop: "acctNo",
                                    slot: true,
                                    minWidth: 115
                                },
                                {
                                    label: "成员照片",
                                    prop: "imageUrl",
                                    imgWidth: 150,
                                    listType: 'picture',
                                    type: 'img',
                                    slot: false,
                                },
                                {
                                    label: '操作',
                                    prop: 'opertion',
                                    slot: true,
                                    minWidth: 150
                                }]
                        }
                    ],
                    spanArr: [],
                    pos: 0
                },
                faceFile: null,
                memberInfo: {},
                memberName: '',
                phone: '',
                isHolder: false,
                faceImageUrl: [],
                memberId: '',
                chooseCardNoS: [],
                chooseUserId: '',
                chooseMallGrand:[],

            }

        },
        computed: {
            ...mapGetters(["tenantId", "userInfo"])
        },
        mounted() {
            // this.getOrganization();
            this.getMallData();
        },
        created() {
            console.log(this.userInfo);
            console.log("tenantId===" + this.tenantId);
            if (this.userInfo.loginName == 'znxz') {
                this.jucheng = false;
            }
            this.ws = new WebSocket("ws://127.0.0.1:10012/");
            this.ws.binaryType = "arraybuffer";
        },

        methods: {
            selectedMall(mall){
                console.log("mallId="+mall);
                this.chooseMallGrand = new Array();
                this.query.garden = null;
                if(mall !=null){
                    let chooseMall = this.mallData[mall];
                    let mallGrand = chooseMall.garden;
                    if(mallGrand !='' && mallGrand!=null){
                        let grands = mallGrand.split(",");
                        grands.forEach(v=>{
                            this.chooseMallGrand.push({"name":v});
                        })
                    }
                }

            },
            readCard() {
                let that = this
                this.ws.send("getCardId");
                this.ws.onmessage = function (evt) {
                    that.cardNos = { cardNo: evt.data };
                };
            },
            findMember() {
                let that = this;
                if (this.phone === '') {
                    this.$message.warning("请输入联系电话！");
                    return;
                }
                if (this.phone.length < 11) {
                    this.$message.warning("输入的电话有误!");
                    return
                }
                // getAllAccount().then(res => {
                //     for(var i=0;i<res.data.data.length;i++){
                //         if(this.phone == res.data.data[i].phone){
                //             this.chooseUserId = res.data.data[i].phone;
                //             return
                //         }
                //     }
                //      });
                findMemberMsg(this.phone).then(resp => {
                    if (resp.data.data.doorPersonResults.length != 0) {
                        if (resp.data.data.carInfoResults.length != 0) {
                            this.plate = resp.data.data.carInfoResults[0].plate;
                            this.plateOptions = resp.data.data.carInfoResults;
                        }
                        if (resp.data.data.doorPersonResults.length > 1) {
                            this.dialogVisible = true
                            that.doorPersonResults = resp.data.data.doorPersonResults
                            that.doorPersonResults = that.unique(resp.data.data.doorPersonResults);
                        } else {
                            this.memberName = resp.data.data.doorPersonResults[0].name;
                            this.chooseCardNoS = resp.data.data.doorPersonResults[0].idNum;
                            this.fileList = new Array();
                            this.fileList.push({ url: resp.data.data.doorPersonResults[0].pictureUrl })

                        }
                    } else {
                        this.$message.error('未找到该用户');
                    }
                })
            },
            unique(arr) {
                for (var i = 0; i < arr.length - 1; i++) {
                    for (var j = i + 1; j < arr.length; j++) {
                        if (arr[i].idNum == arr[j].idNum && arr[i].name == arr[j].name) {
                            arr.splice(j, 1);
                            //因为数组长度减小1，所以直接 j++ 会漏掉一个元素，所以要 j--
                            j--;
                        }
                    }
                }
                return arr;
            },
            pageReset() {
                this.page.pageSize = 50;
                this.page.currentPage = 1;
                this.page.total = 0;
            },
            addMemberMsg() {
                this.dialogVisible = false;
                findMemberMsg(this.phone).then(resp => {
                    this.memberName = resp.data.data.doorPersonResults[this.radio].name;
                    this.chooseCardNoS = resp.data.data.doorPersonResults[this.radio].idNum;
                    this.fileList = new Array();
                    this.fileList.push({ url: resp.data.data.doorPersonResults[this.radio].pictureUrl })
                })
            },
            handleClose2(done) {
                this.$confirm('确认关闭？').then(_ => {
                    done();
                }).catch(_ => { });
            },
            selectionChange(list) {
                console.log(list)
                this.selectionList = list;
            },
            spanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0
                    || columnIndex === 1

                ) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row > 0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }

                }
            },
            getData() {
                let that = this;
                if (this.query.mallId == null || this.query.mallId.length == 0) {
                    delete this.query.mallId
                } else if (typeof this.query.mallId != 'string') {
                    this.query.mallId = this.query.mallId[this.query.mallId.length - 1];
                }
                if (this.query.building == '') {
                    delete this.query.building
                }
                if (this.query.unit == '') {
                    delete this.query.unit
                }
                if (this.query.room == '') {
                    delete this.query.room
                }
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                if(this.query.garden !=null && this.query.garden.length >0){
                    this.query.garden = this.query.garden[this.query.garden.length-1];
                }
                getHouseMemberList(this.page.currentPage, this.page.pageSize, this.query.mallId, this.query.cardNum,
                    this.query.userName, this.query.building, this.query.unit, this.query.room,this.query.garden).then(res => {
                        console.log(res);
                        let records = res.data.data.records;
                        this.page.total = res.data.data.total;
                        let dataList = new Array();
                        let carPlateArr = new Array();
                        records.forEach(v => {
                            // that.mallOptions.push({ value: v.mallId, label: v.mallName })
                            // that.buildOptions.push({value: v.building,label: v.building})
                            // that.unitOptions.push({value: v.unit,label: v.unit})
                            // that.roomOptions.push({value: v.room,label: v.room})
                            let memberData = {};
                            if(v.garden !=null && v.garden !=''){
                                memberData.mallName = v.mallName+ "--"+v.garden;
                            } else{
                                memberData.mallName = v.mallName;
                            }
                            memberData.houseId = v.houseId;
                            memberData.ownerName = v.houseId;
                            memberData.building = v.building + '栋';
                            memberData.unit = v.unit + '单元';
                            memberData.room = v.room;
                            memberData.mallId = v.mallId;
                            memberData.nickName = v.nickName;
                            carPlateArr = v.carPlate.split(",");
                            // for(var i=0;i<carPlateArr.length;i++){
                            //     memberData.carPlate = carPlateArr[i];
                            // };
                            // debugger
                            memberData.carPlate = carPlateArr;
                            memberData.acctNo = v.accountPhone;
                            memberData.userId = v.userId;
                            if (v.unit != 0) {
                                memberData.roomInfo = v.building + "_" + v.unit + "_" + v.room;
                            } else {
                                memberData.roomInfo = v.building + "_" + v.room;
                            }

                            memberData.memberName = v.memberName;
                            memberData.phone = v.phone;
                            memberData.cardNumList = v.cardNumList;
                            memberData.memberId = v.memberId
                            if (v.imageUrl != '' && v.imageUrl.indexOf("http") == -1) {
                                memberData.imageUrl = "https://sq.wewins.cn" + v.imageUrl;
                            } else {
                                memberData.imageUrl = v.imageUrl;
                            }

                            memberData.isHolder = v.isHolder;
                            memberData.cardList = v.cardList;
                            // memberData.cardList.push({ cardNum: v.cardNumList });
                            dataList.push(memberData);
                        });
                        // that.mallOptions = that.unique(that.mallOptions)
                        this.data = dataList;
                        this.getSpanArr(dataList);
                        loading.close()
                    });

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
                })
            },
            screenRegion(data) {
                data.forEach(v => {
                    if (v.children) {
                        this.screenRegion(v.children)
                    } else if (v.orgId.length >= 10) {
                        this.mallOptions.push(v)
                    }
                })
            },
            // unique(arr) {
            //     const res = new Map();
            //     return arr.filter((arr) => !res.has(arr.mallId) && res.set(arr.mallId, 1));
            // },
            getMallData() {
                console.log("获取网点数据！")
                console.log("tenantId===" + this.tenantId);
                getMall(this.tenantId, 1, 100, "", "").then(res => {
                    const mallData = res.data.data.records;
                    const index = this.$refs.crud.findObject(this.option.column, "mallName");
                    var mallList = new Array();
                    this.mallOptions = mallData;
                    for (let i = 0; i < mallData.length; i++) {
                        var mallObj = mallData[i];
                        this.mallData[mallObj.id] = mallObj;
                        let mallName = mallObj.name;
                        let mallId = mallObj.id;
                        let mallNo = mallName;
                        mallObj.mallName = mallNo;
                        mallList.push(mallObj)
                    }
                    index.dicData = mallList;
                });
            },
            getSpanArr(data) {
                this.spanArr = new Array();
                for (let i = 0; i < data.length; i++) {
                    let houseInfo = data[i];
                    if (i === 0) {
                        this.spanArr.push(1);
                        this.pos = 0
                    } else {
                        // 判断当前元素与上一个元素是否相同
                        let currentId = data[i].houseId;
                        let lastId = data[i - 1].houseId;
                        console.log("currentId==" + currentId + ";lastId==" + lastId)
                        if (currentId === lastId) {
                            this.spanArr[this.pos] += 1;
                            this.spanArr.push(0);
                        } else {
                            this.spanArr.push(1);
                            this.pos = i;
                        }

                    }
                }
                console.log(this.spanArr);
            },
            sizeChange(val) {
                this.page.currentPage = 1
                this.page.pageSize = val
                this.getData()

            },
            currentChange(val) {
                this.page.currentPage = val
                this.getData()
                // this.$message.success('页码' + val)
            },
            searchReset() {
                this.query = {};
                this.getData();
            },
            searchChange(params, done) {
                console.log(params);
                this.page.currentPage = 1;
                if (params.mallName != undefined) {
                    this.query.mallId = params.mallName;
                }
                if (params.building != undefined) {
                    this.query.building = params.building;
                }
                if (params.unit != undefined) {
                    this.query.unit = params.unit;
                }
                if (params.room != undefined) {
                    this.query.room = params.room;
                }
                console.log(this.query);
                this.getData();
                done();
            },
            btnDelMember(member) {
                this.$confirm('确认删除【' + member.memberName + '】', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    removeHoseMember(member.memberId).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getData();
                    });

                }).catch(() => {

                });

            },
            handleClose(done) {
                done();
            },
            addMember(member) {
                this.addMsg = true;
                this.addPlate = false;
                console.log(member);
                // member.memberId='';
                this.doorNo = member.mallName + member.roomInfo;
                this.drawer = true;
                this.drawerTitle = '新增家庭成员';
                this.memberInfo = member;
                this.memberName = "";
                this.plate = "";
                this.phone = "";
                this.faceFile = null;
                this.isHolder = false;
                this.faceImageUrl = new Array();
                this.fileList = new Array();
                this.chooseUserId = "";
                this.mallId = member.mallId;
                this.chooseCardNoS = new Array();
                getCardByMallId(member.mallId).then(res => {
                    const data = res.data.data;
                    console.log(data);
                    this.cardNos = data;
                    getAllAccount().then(res => {
                        const data = res.data.data;
                        console.log(data);
                        this.accountList = data;
                    });
                });
            },
            updateMember(member) {
                this.addMsg = false;
                this.addPlate = false;
                this.memberPlate = [];
                this.faceImageUrl = [];
                this.carPlate = '';
                this.drawer = true;
                this.memberInfo = member;
                console.log(member);
                this.faceFile = null;
                let imgUrlList = new Array();
                let imgInfo = {};
                imgInfo.url = member.imageUrl;
                imgUrlList.push(imgInfo);
                this.memberName = member.memberName;
                this.doorNo = member.mallName + member.roomInfo;
                for (var i = 0; i < member.carPlate.length; i++) {
                    if (member.carPlate[i] != '') {
                        this.memberPlate.push(member.carPlate[i])
                    }
                }
                this.plates = [];
                member.carPlate.forEach(v => {
                    this.plates.push(v);
                })
                this.phone = member.phone;
                this.faceImageUrl = imgUrlList;
                if (member.isHolder == 1) {
                    this.isHolder = true;
                } else {
                    this.isHolder = false;
                };
                this.chooseCardNoS = new Array();
                let cardList = member.cardList;
                this.fileList = new Array();
                this.fileList.push({ url: member.imageUrl });
                cardList.forEach(card => {
                    this.chooseCardNoS.push(card.cardNum);
                })
                this.chooseUserId = member.userId;
                this.drawerTitle = '修改家庭成员';
                getCardByMallId(member.mallId).then(res => {
                    const data = res.data.data;
                    console.log(data);
                    this.cardNos = data;
                    getAllAccount().then(res => {
                        const data = res.data.data;
                        console.log(data);
                        this.accountList = data;
                    });
                });
            },
            afterRead(file) {
                console.log(file)
                let faceImageUrl = file.content;
                this.faceFile = file.file;
            },
            handleRemove(file) {

            },
            handlePreview(file) {
                console.log(file);
            },
            beforeAvatarUpload(file) {
                console.log(file);
            },
            onSubmit() {
                if (this.memberName === '') {
                    this.$message.warning(this.jucheng == false ? "请输入用户信息" : "请查询用户信息！");
                    return;
                }

                if (this.phone === '') {
                    this.$message.warning("请输入联系电话！");
                    return;
                }
                let formData = new FormData();
                if (this.memberInfo.memberId != '') {
                    formData.append("id", this.memberInfo.memberId);
                } else {
                    // if(this.faceFile==null){
                    //     this.$message.warning("请上传人脸！");
                    //     return;
                    // }
                }

                const loading = this.$loading({
                    lock: true,
                    text: '正在上传数据,请稍后。。。',
                    spinner: "el-icon-loading"
                });

                let isHolder = 0;
                if (this.isHolder) {
                    isHolder = 1;
                }

                if (this.chooseCardNoS.length > 0) {
                    formData.append("cardNum", this.chooseCardNoS);
                }

                if (this.chooseUserId != '') {
                    formData.append("accountUserId", this.chooseUserId);
                }
                formData.append("houseId", this.memberInfo.houseId);
                formData.append("building", this.memberInfo.building);
                formData.append("unit", this.memberInfo.unit);
                formData.append("room", this.memberInfo.room);
                formData.append("name", this.memberName);
                formData.append("phone", this.phone);
                if (this.addMsg == false) {
                    this.plate = this.plates[0];
                    for (var i = 1; i < this.plates.length; i++) {
                        if (this.plates[i] != '') {
                            if (this.plate == '') {
                                this.plate = this.plates[i]
                            } else {
                                this.plate = this.plate + ',' + this.plates[i];
                            }
                        }
                    }
                };
                if (this.carPlate.length != 0) {
                    if (this.plate != '') {
                        this.plate = this.plate + ',' + this.carPlate;
                    } else {
                        this.plate = this.carPlate;
                    }
                }
                formData.append("carPlate", this.plate);
                formData.append('isHolder', isHolder);
                formData.append('faceFile', this.faceFile);
                formData.append("mallId", this.mallId);
                formData.append("imageUrl", this.fileList[0].url);
                // if(this.carPlate != null && this.carPlate != ''){
                //     bindCarPlate(this.memberInfo.memberId,this.carPlate).then()
                // }
                addHoseMember(formData).then(res => {
                    this.drawer = false;
                    loading.close();
                    this.getData();
                }).catch(() => {
                    loading.close()
                })

            },
            beforUpload(file) {
                console.log(file);
                this.faceFile = file.raw;
            },
            cancelDrawer() {
                this.drawer = false;
            },
            dealCard(row) {
                console.log(row);
                // if (this.selectionList.length !== 1) {
                //     this.$message.warning("只能选择一条数据");
                //     return;
                // }
                // let houseIds = [];
                // let mallIds=[];
                // let  cardInfo=''
                // this.selectionList.forEach(ele => {
                //     houseIds.push(ele.houseId);
                //     mallIds.push(ele.mallId);
                //     cardInfo=ele.mallName +ele.building+"栋"+ele.unit+"单元"+ele.room;
                // });
                this.houseId = row.houseId;
                this.mallId = row.mallId
                this.cardInfo = row.mallName + row.roomInfo + "_" + row.memberName + "_" + row.phone;
                this.cardInfoRoom = row.mallName + row.roomInfo;
                this.cardInfoOwner = row.memberName + "_" + row.phone;
                let memberId = row.memberId;
                this.memberId = memberId;
                this.cardNos = [];
                getCardByMallId(this.mallId).then(res => {
                    this.cardDrawer = true;
                    const data = res.data.data;
                    //      let option=  {
                    //       column: [{
                    //           label: '卡号',
                    //           prop: 'cardNo',
                    //           type: 'select',
                    //           width: '95%',
                    //           drag: true,
                    //           filterable:true,
                    //           multiple: true,
                    //           props:{label:'cardNum',value:'cardNum'},
                    //           dicData: data
                    //       }
                    //       ]
                    //   };
                    this.cardOption = data;
                });
            },
            submitCard(form, done) {
                console.log(form);
                let cardNo = this.cardNos.cardNo;
                if (cardNo == null || cardNo == '') {
                    this.$message.warning("请选择绑定的卡号！");
                    return;
                }
                let formData = new FormData();
                let regInfo = this.RegistrationInfo;
                formData.append("cardNum", cardNo);
                formData.append("houseId", this.houseId);
                formData.append("mallId", this.mallId);
                formData.append("memberId", this.memberId);
                addCard(formData).then(res => {
                    this.$message.warning("绑定成功！");
                    this.cardDrawer = false;
                    done();
                }, error => {
                    done();
                });
                this.getData();
            },
            addCarPlate(row) {
                this.memberId = row.memberId;
                this.plateDrawer = true
            },
            addAccount(row) {
                console.log(row)
                let memberId = row.memberId;
                this.memberId = memberId;
                this.chooseUserId = "";
                getAllAccount().then(res => {
                    this.accountDrawer = true;
                    const data = res.data.data;
                    console.log(data);
                    this.accountList = [];
                    let option = {
                        column: [{
                            label: '帐号',
                            prop: 'userId',
                            type: 'select',
                            width: 300,
                            filterable: true,
                            props: { label: 'phone', value: 'userId' },
                            dicData: data
                        }
                        ]
                    };
                    this.accountOption = data;
                });

            },
            submitPlate() {
                if (this.carPlate == '') {
                    return this.$message.warning("请输入车牌号！")
                }
                bindCarPlate(this.memberId, this.carPlate).then(res => {
                    this.$message.success("绑定成功！");
                    this.plateDrawer = false;
                    this.getData();
                })
            },
            submitAccount(form, done) {
                console.log(form);
                // done();
                if (form.userId === '') {
                    return this.$message.error("请选择绑定的帐号！");
                }
                bindAccount(this.memberId, form.userId).then(res => {
                    this.$message.warning("绑定成功！");
                    this.accountDrawer = false;
                    this.getData();
                });

            },
            unBindAccountData(row) {
                if (row.acctNo == null || row.acctNo == '') {
                    return
                }
                this.$confirm('确认解绑【' + row.acctNo + '】', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    unBindAccount(row.memberId).then(res => {
                        this.$message.warning("解绑成功！");

                        this.getData();
                    });

                }).catch(() => {

                });
            },
            unBindPlate(row, item) {
                this.$confirm('确认解绑【' + item + '】', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    unbindCarPlate(row.memberId, item).then(res => {
                        this.$message.success("解绑成功！");
                        this.getData();
                    })
                }).catch(() => {

                });
            },
            unBindCardData(row) {
                console.log(row);
                if (row.cardNumList == null || row.cardNumList == '') {
                    return
                }
                row.cardNumList = row.cardNumList.split(",")
                this.$confirm('确认解绑【' + row.cardNumList[0] + '】', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    unBindCard(row.mallId, row.cardNumList[0]).then(res => {
                        this.$message.warning("解绑成功！");
                        this.getData();
                    });

                }).catch(() => {

                });
            },
            handleExceed(files, fileList) {
                this.fileList = files;
                console.log(files)
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件，请删除之前选择的文件`);
            },
            onchange(file, filesList) {
                console.log(file);
                this.faceFile = file.raw;
                // this.uploadFileName=file.name;
            }

        }
    }
</script>

<style lang="scss" scoped>
    /deep/ .el-drawer__body {
        height: 0px;
        overflow: auto;
    }

    /deep/.el-col-md-6 {
        width: 20%;
    }

    /deep/.el-upload-list {
        margin-top: -15%;
    }

    /deep/.el-table--small {
        font-size: 14px;
    }

    /deep/.avue-crud .el-table th {
        color: #909399;
    }

    /deep/.avue-crud {
        width: 100%;
    }

    .col {
        height: 35px;
    }

    /deep/.el-upload__tip {
        height: 20px;
        line-height: 20px;
    }

    /deep/ .el-radio__input {
        float: left;
    }

    /* /deep/.el-input__inner{
      height: 35px;
      background-color: #EDF5FB;
  }
  /deep/.avue-crud .el-table th{
        background: #D8E3FA;
    } */
    /* /deep/.el-radio__input{
      display: none;
  } */
    @import "../../styles/style.scss";
</style>
