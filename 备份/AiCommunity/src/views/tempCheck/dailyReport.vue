<template>
  <div>
    <div  style="background-color: white;padding-top: 20px;padding-left: 10px;">
      <el-form :inline="true" :model="formInline" class="m-form-inline" >
        <el-form-item :label="$t('组织架构')">
<!--          <el-cascader-->
<!--            :placeholder="$t('请输入查询的关键字')"-->
<!--            :options="options"-->
<!--            :props="defaultProps"-->
<!--            filterable-->
<!--            v-model="formInline.orgId"-->
<!--            :show-all-levels="false"></el-cascader>-->

          <avue-input  v-model="formInline.orgId"
                       :placeholder="$t('请输入查询的关键字')"
                       filterable
                       type="tree"
                       :props="defaultProps"
                       :dic="options"/>
        </el-form-item>
        <el-form-item :label="$t('日期')" >
          <el-date-picker
            v-model="formInline.dateTime"
            type="date"
            :placeholder="$t('选择日期')"
            format="yyyy-MM-dd"
            @change="changeDate"
            style="width: 150px">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('状态')" >
          <el-select v-model="formInline.tempState" :placeholder="$t('选择状态')" style="width: 80px">
            <el-option :label="$t('全部')" value="全部"></el-option>
            <el-option :label="$t('正常')" value="正常"></el-option>
            <el-option :label="$t('高温')" value="高温"></el-option>
            <el-option :label="$t('偏高')" value="偏高"></el-option>
            <el-option :label="$t('未戴口罩')" value="未戴口罩"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="getTempDataList">{{$t('查询')}}</el-button>
          <el-button type="primary" @click="resetForm">{{$t('清空')}}</el-button>
          <span style="margin-left: 20px">
            <el-checkbox v-model="checked"><span style="font-size: 10px;color: gainsboro">导出图片</span></el-checkbox>
                     <el-button type="primary"plain  @click="handleExcel" >导出报表</el-button>
          </span>

        </el-form-item>
      </el-form>

    </div>
    <div style="font-size: 12px;padding-top: 5px;padding-bottom: 5px;background-color: white;margin-top: 10px" id="tempVistal">
      <span style="margin-left: 10px">{{$t('共')}}</span><span style="color: red"> {{total}} </span><span>{{$t('条')}}</span>,
      <span></span><span style="color: red">{{highTempTotal}} </span><span>{{$t('条')}} {{$t('高温')}},
      {{normalTempTotal}} {{$t('条')}} {{$t('正常')}}, {{lessHighTempSum}} {{$t('条')}} {{$t('偏高')}}, {{noMaskTempSum}} {{$t('条')}} {{$t('未戴口罩')}}</span>
    </div>

    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%;background-color: white"
    >
      <el-table-column
        prop="mallName"
        :label="$t('网点名称')"
        width="180">
      </el-table-column>
      <el-table-column
        prop="deviceNo"
        :label="$t('设备编号')"
        width="130">
      </el-table-column>
      <el-table-column
        prop="faceImageUrl"
        :label="$t('人脸照片')"
        width="180">
        <template scope="scope">

          <el-popover placement="right" title="" trigger="hover">
            <img :src="scope.row.faceImageUrl">
            <img slot="reference" :src="scope.row.faceImageUrl" alt="" style="max-height: 50px;max-width: 50px">
          </el-popover>
          <!--          <el-image-->
          <!--            style="width: 50px; height: 50px"-->
          <!--            :src="scope.row.faceImageUrl"-->
          <!--            :preview-src-list="scope.row.faceImageUrlList">-->
          <!--          </el-image>-->
          <span style="position: relative;bottom: 16px;left: 5px">{{scope.row.faceName}}</span>
          <!--          <img :src="scope.row.faceImageUrl" onerror = "javascript:this.src = 'img/face_nomal.png'"width="40" height="40"/>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="tempValue"
        :label="$t('温度')">
      </el-table-column>
      <el-table-column
        prop="tempState"
        :label="$t('状态')">
      </el-table-column>
      <el-table-column
        prop="createTime"
        :label="$t('时间')">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-right: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[40, 80, 120, 160]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

  </div>

</template>

<script>

    import {getMall} from "../../api/mall";
    import {getDeviceByMall} from "../../api/mall";
    import {getTempList,getPermissionTempOrgData,getExcelData,send} from "../../api/tempCheck";
    import {mapGetters, mapState} from "vuex";
    import {getRoleListByIds} from "../../api/system/role";
    import {getUserOrg} from "../../api/system/user";
    import {getDeviceByTenant} from "../../api/system/device";
    import {getMallByIds} from "../../api/mall";

    export default {
        name: "dailyReport",
        data() {
            return {
                checked:false,
                value: [],
                options:[],
                defaultProps:{label:'orgName',value:'orgId',checkStrictly: true},
                currentPage: 1,
                total:0,
                pageSize:40,
                highTempTotal:0,
                normalTempTotal:0,
                lessHighTempSum:0,
                noMaskTempSum:0,
                value1: '',
                tableData: [],
                formInline: {
                    mallId: null,
                    deviceNo:null,
                    tempState:'全部',
                    dateTime:new Date()
                },
                permissionDevice:[],
                roleType:0,
                mallList:[],
                deviceList:[],
                permDeviceNos:null,
                permMallIds:null,
                userOrg:'',
                userOrgDesc:'',
                roleType:'0'
            }
        },
        mounted(){
            console.log(this.userInfo);

            this.getRoleListDataByIds();
            this.getNowDate();
            let userOrgList=this.userInfo.userOrgList;
            let roleData=this.userInfo.roleList;
            let userOrgDesc="";
            let  userOrg="";
            console.log(roleData)
            if(roleData.length > 0){
                console.log("roleType="+roleData.roleType+">>>");
                this.roleType=roleData[0].roleType;
            }
            userOrgList.forEach(v => {
                let orgId=v.orgId;
                let orgDesc=v.orgDesc;
                userOrgDesc=userOrgDesc+orgDesc+"#";
                userOrg=userOrg+orgId+"#";

            });
            this.userOrg=userOrg;
            this.userOrgDesc=userOrgDesc;
            console.log("roleType=="+this.roleType+">>>");
            getPermissionTempOrgData(userOrg,userOrgDesc,this.roleType).then(res => {
                this.options=res.data.data;
            });

        },
        watch: {
            'formInline.tempState'() {


            },
            'language'(){
                this.getTempDataList();
            }
        },
        computed: {
            ...mapState({}),
            ...mapGetters(['tenantId',"userInfo",'language'])
        },
        methods: {
            getRoleListDataByIds(){
                getRoleListByIds().then(res=>{
                    let data=res.data.data;
                    var roleType = data[0].roleType;
                    for(var i = 1; i < data.length; i++) {
                        var v = data[i];
                        let roleTypeVal=v.roleType;
                        roleTypeVal > roleType ? roleType = roleTypeVal : null
                    }
                    this.roleType=roleType;
                    console.log("roleType=="+roleType);
                    if(roleType ==4){//网点管理
                        this.mallList=new Array();
                        getUserOrg().then(res=>{
                            console.log(res);
                            let orgData=res.data.data;
                            getMall(this.tenantId,1,1000,"","").then(res=>{
                                let records=res.data.data.records;
                                let mList=new Array();
                                this.permMallIds=new Array();
                                orgData.forEach(v=>{
                                    let orgId=v.orgId;
                                    records.forEach(m=>{
                                        let id=m.id;
                                        if(orgId == id  ){
                                            mList.push(m);
                                            this.permMallIds.push(id);
                                        }
                                    })
                                    this.mallList=mList;
                                    this.getDeviceByMallData(true);
                                });
                            });
                        })
                    }else if(roleType ==5){ //设备管理
                        getUserOrg().then(res=>{
                            let orgData=res.data.data;
                            let deviceList=new Array();
                            let MallList=new Array();
                            this.permDeviceNos=new Array();
                            getDeviceByTenant().then(res=>{
                                let deviceData=res.data.data;
                                orgData.forEach(v=>{
                                    let orgId=v.orgId;
                                    deviceData.forEach(d=>{
                                        let deviceId=d.id;
                                        let mallId=d.mallId;
                                        let deviceNo=d.deviceNo;
                                        console.log("orgId=="+orgId+";deviceId=="+deviceId)
                                        if(orgId == deviceId){
                                            deviceList.push(d);
                                            MallList.push(mallId);
                                            this.permDeviceNos.push(deviceNo);
                                        }
                                    })
                                });

                                this.permissionDevice=deviceList;
                                let mallIds=MallList.join(",");
                                getMallByIds(mallIds).then(res=>{
                                    let mallData=res.data.data;
                                    this.mallList=mallData;
                                    this.getTempDataList();
                                });
                            });

                        });

                    }else{
                        this.getMallData();
                    }

                });
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.pageSize=val;
                 this.getTempDataList();
            },
            handleCurrentChange(val) {
                this.currentPage=val;
                this.getTempDataList();
                console.log(`当前页: ${val}`);
            },getMallData(){
                this.mallList=new Array();
                getMall(this.tenantId,1,1000,"","").then(res=>{
                    let records=res.data.data.records;
                    this.mallList=records;
                    this.getDeviceByMallData(true);
                });
            },getDeviceByMallData(isGetTemp){
                this.formInline.deviceNo=null;
                getDeviceByMall(this.formInline.mallId).then(res=>{
                    let records=res.data.data;
                    this.deviceList=new Array();
                    records.forEach(v=>{
                        v.deviceName=v.deviceName+"|" +v.deviceNo;
                        if(this.roleType == 5){
                            this.permissionDevice.forEach(d=>{
                                if(d.id == v.id){
                                    this.deviceList.push(v);
                                }
                            })
                        }else{
                            this.deviceList.push(v);
                        }

                    });
                    if(isGetTemp){
                        this.getTempDataList();
                    }

                });
            },getTempDataList(){
                console.log(this.formInline);
                let tempState=this.formInline.tempState;
                if( this.formInline.tempState == '全部' || tempState === '-1'){
                    tempState=null;
                }
                let deviceNo=this.formInline.deviceNo;
                if(this.formInline.deviceNo == '-1'){
                    deviceNo=null;
                }
                let deviceNos=null;
                if(this.permDeviceNos !=null && this.permDeviceNos.length>0){
                    console.log(this.permDeviceNos);
                    deviceNos=this.permDeviceNos.join(",");
                }

                let mallIds=null;
                if(this.permMallIds !=null && this.permMallIds.length > 0){
                    mallIds=this.permMallIds.join(",");
                }
                let orgId="";
                if( this.formInline.orgId !=null &&  this.formInline.orgId.length>0){
                    orgId=this.formInline.orgId;
                }
                const loading = this.$loading({
                    lock: true,
                    text: '正在加载数据,请稍候...',
                    spinner: "el-icon-loading"
                });
                getTempList(this.currentPage,this.pageSize,
                    this.formInline.dateTime,this.formInline.dateTime,
                    this.formInline.mallId,
                    deviceNo,
                    tempState,
                    this.userOrg,
                    this.userOrgDesc,
                    this.roleType,
                    orgId).then(res=>{
                    loading.close();
                    let data=res.data.data;
                    let tempData=data.tempData;
                    this.highTempTotal=data.highTempSum;
                    this.normalTempTotal=data.normalTempSum;
                    this.lessHighTempSum=data.lessHighTempSum;
                    this.noMaskTempSum=data.noMaskTempSum;
                    let records=tempData.records;
                    this.tableData=new Array();
                    this.total=tempData.total;
                    if(this.formInline.tempState == '全部'){
                        document.getElementById("tempVistal").style.display='block';
                    }else{
                        document.getElementById("tempVistal").style.display='none';
                    }
                    records.forEach(v=>{
                        let faceImageUrl=v.faceImageUrl;
                        if(faceImageUrl!=''){
                            faceImageUrl='http://tc.wewins.cn'+faceImageUrl;
                        }
                        let tempValue=v.tempValue;
                        if(tempValue <30){
                            v.tempValue="-";
                        }
                        let tempState=v.tempState;
                        v.tempState=this.$t(tempState);
                        let faceImageUrlList=new Array();
                        faceImageUrlList.push(faceImageUrl)
                        v.faceImageUrl=faceImageUrl;
                        v.faceImageUrlList=faceImageUrlList;
                        this.tableData.push(v)
                    })
                }).catch(() => {
                    loading.close()
                });
            },changeDate(date){
                console.log(date);
                const d = new Date(date);
                var m = d.getMonth() + 1;
                var day = d.getDate();
                if (m <= 9) {
                    m = "0" + m;
                }
                if (day <= 9) {
                    day = "0" + day;
                }
                var seperator1 = "-";
                const datetime = d.getFullYear() + seperator1 + m + seperator1 + day
                this.formInline.dateTime = datetime;
            },
            getNowDate() {
                var date = new Date();
                var seperator1 = "-";
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                this.formInline.dateTime  = year + seperator1 + month + seperator1 + strDate;
            },mallChange(m){
                console.log(m);
                this.formInline.mallId=m;
                this.formInline.deviceNo='-1';
                this.getDeviceByMallData(false);
            }, resetForm() {
                this.formInline.mallId=null;
                this.formInline.deviceNo=null;
                this.formInline.orgId=null;
                this.currentPage=1;
                this.getNowDate();
                this.formInline.tempState='全部';
            }, handleChange(value) {
                console.log(value);
            },handleNodeClick(v){
                console.log(v);
                this.formInline.orgId = v.orgId
                this.formInline.orgName = v.orgName
                this.$refs.selectReport.blur();
            },handleExcel() {

                console.log(this.formInline);
                let tempState=this.formInline.tempState;
                if( this.formInline.tempState == '全部' || tempState === '-1'){
                    tempState=null;
                }
                let deviceNo=this.formInline.deviceNo;
                if(this.formInline.deviceNo == '-1'){
                    deviceNo=null;
                }
                let deviceNos=null;
                if(this.permDeviceNos !=null && this.permDeviceNos.length>0){
                    console.log(this.permDeviceNos);
                    deviceNos=this.permDeviceNos.join(",");
                }

                let mallIds=null;
                if(this.permMallIds !=null && this.permMallIds.length > 0){
                    mallIds=this.permMallIds.join(",");
                }
                let orgId="";
                if( this.formInline.orgId !=null &&  this.formInline.orgId.length>0){
                    orgId=this.formInline.orgId;
                }
                let loadingTex='正在导出数据,请稍候...';
                if(this.checked){
                     loadingTex='正在导出图片，导出会比较慢,请耐心稍候...';
                }
                const loading = this.$loading({
                    lock: true,
                    text: loadingTex,
                    spinner: "el-icon-loading"
                });
                // location.href ="http://10.201.30.19/temp/check/getExcelData?startDate="+this.formInline.dateTime
                //     +"&endDate="+this.formInline.dateTime+"&mallId="+this.formInline.mallId+"&deviceNo="+deviceNo
                //     +"&tempState="+tempState+"&userOrg="+ this.userOrg+"&userOrgDesc="+ this.userOrgDesc+"&roleType="+this.roleType+"&orgId="+orgId
                getExcelData(this.formInline.dateTime,this.formInline.dateTime,
                    this.formInline.mallId,
                    deviceNo,
                    tempState,
                    this.userOrg,
                    this.userOrgDesc,
                    this.roleType,
                    orgId,this.checked).then( res => {
                    loading.close();
                    console.log(res);
                    window.location.href ="http://tc.wewins.cn"+res.data.data

                }).catch(() => {
                    loading.close();
                });
            }
        }
    }
</script>

<style scoped>

  /deep/ .el-image-viewer__close {
    top: 40px;
    right: 40px;
    width: 40px;
    height: 40px;
    font-size: 40px;
    color: red;
  }
  /deep/.el-cascader-node.in-active-path, .el-cascader-node.is-active, .el-cascader-node.is-selectable.in-checked-path {
    color: black;
    font-weight: 700;
  }
  /deep/ .el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid #DCDFE6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 10px;
    height: 10px;
    background-color: #FFF;
    z-index: 1;
    -webkit-transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
  }

  /deep/ .el-checkbox__label {
    display: inline-block;
    padding-left: 4px;
    line-height: 19px;
    font-size: 14px;
  }



</style>
