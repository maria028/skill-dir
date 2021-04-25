<template>
  <div >
    <div style="background-color: white;padding-top: 10px;padding-bottom: 10px;padding-left: 10px">
      <el-form :inline="true" :model="form" class="m-form-inline">
        <el-form-item :label="$t('组织架构')">
          <avue-input  v-model="form.orgId"
                       :placeholder="$t('请输入查询的关键字')"
                       filterable
                       type="tree"
                       :props="defaultProps"
                       :dic="optionData"/>
        </el-form-item>
        <el-form-item :label="$t('查询日期')" >
          <el-date-picker
            v-model="form.startDate"
            type="date"
            :placeholder="$t('选择日期')"
            format="yyyy-MM-dd"
            :clearable="false"
            @change="startDateChangeDate"
            style="width: 150px">
          </el-date-picker>
          -
          <el-date-picker
            v-model="form.endDate"
            type="date"
            :clearable="false"
            :placeholder="$t('选择日期')"
            format="yyyy-MM-dd"
            @change="endDateChangeDate"
            style="width: 150px">
          </el-date-picker>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="submit">{{$t('查询')}}</el-button>
        </el-form-item>
      </el-form>

<!--      <avue-form v-model="form" :inline="true" :option="queryOption" @submit="submit"></avue-form>-->
    </div>

    <div style="background-color: #fff;margin-top: 10px">
      <avue-data-panel :option="option">
      </avue-data-panel>
    </div>
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%;background-color: white"
    >
      <el-table-column
        prop="areaName"
        :label="$t('区县/网点')"
       >
      </el-table-column>
      <el-table-column
        prop="totalTempNum"
        :label="$t('测温人数')"
        >
      </el-table-column>
      <el-table-column
        prop="normalTempNum"
        :label="$t('正常人数')"
        >
      </el-table-column>
      <el-table-column
        prop="highTempNum"
        :label="$t('高温人数')">
      </el-table-column>
      <el-table-column
        prop="lessHighTempNum"
        :label="$t('温度偏高人数')">
      </el-table-column>
      <el-table-column
        prop="noMaskTempSum"
        :label="$t('未戴口罩')">
      </el-table-column>
    </el-table>
    <div style="text-align: right;margin-right: 20px;display: none">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getAreaByType} from "../../api/system/area";
  import {getVitalTemp,getPermissionTempOrgData} from "../../api/tempCheck";
  import {mapGetters, mapState} from "vuex";


  export default {
        name: "statisticalReport",
        data(){
            return{
                defaultProps:{label:'orgName',value:'orgId',checkStrictly: true},
                treeData:[],
                provinceList:[],
                vitalData:{},
                cityList:[],
                areaIds:'',
                tableData:[],
                currentPage:1,
                total:0,
                option:{},
                areaNames:'',
                form:{'orgId':'33',startDate:new Date(),
                    endDate:new Date()},
                queryOption:{},
                userOrg:'',
                userOrgDesc:'',
                roleType:'0',
                optionData:[],
            }
        },
        computed:{
            ...mapGetters(['tenantId',"userInfo",'language'])
        },
      mounted(){
            this.getNowDate();
           this.getOrgData();
      },
      watch: {
            'language'(){

                this.getOrgData();
            }
      },
        methods:{
            getOrgData(){
                let userOrgList=this.userInfo.userOrgList;
                let roleData=this.userInfo.roleList;
                let userOrgDesc="";
                let  userOrg="";
                console.log(roleData)
                if(roleData.length > 0){
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
                    let data=res.data.data;
                    let dataArray=new Array();
                    dataArray.push({'orgId':"-1",'orgName':'全部'})
                    data.forEach( v =>{
                        dataArray.push(v);
                    })
                    let  optionData=dataArray;
                    this.optionData=optionData;
                    if(this.roleType === 4){
                        this.form.orgId=optionData[1].orgId;
                    }else{
                        this.form.orgId=optionData[0].orgId;
                    }
                    let queryOption={
                        submitText:this.$t('查询'),
                        gutter:10,
                        emptyBtn:false,
                        labelWidth:150,
                        menuPosition:'right',
                        column: [{
                            label:this.$t('组织架构'),
                            prop: 'orgId',
                            type: 'tree',
                            props:{label:'orgName',value:'orgId'},
                            dicData:optionData
                        },{
                            label: this.$t("查询日期"),
                            prop: "daterange",
                            type: "daterange",
                            startPlaceholder: '开始日期',
                            endPlaceholder: '结束日期',
                            valueFormat:'yyyy-MM-dd'
                        }]
                    };
                    this.queryOption=queryOption;

                    this.getVitalTempData(null);
                    // this.getAreaDataByType(1,0);
                });
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
                let  nowDate=year + seperator1 + month + seperator1 + strDate;
                let mdate=new Array();
                mdate.push(nowDate);
                mdate.push(nowDate);
                this.form.daterange=mdate;
                this.form.startDate  =nowDate;
                this.form.endDate= nowDate;
            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage=val;
                console.log(`当前页: ${val}`);
            },getVitalTempData(done){
                let startDate=this.form.startDate
                let endDate=this.form.endDate;
                const loading = this.$loading({
                    lock: true,
                    text: '正在加载数据,请稍候...',
                    spinner: "el-icon-loading"
                });
                getVitalTemp(startDate,endDate,this.form.orgId,this.roleType,this.userOrg).then(res=>{
                    loading.close();
                    let data=res.data.data;
                    this.vitalData=data;
                    this.tableData=data.areaList;
                    let optionInfo={
                        span:6,
                        data: [
                            {
                                title: this.$t('测温总人数'),
                                count: this.vitalData.totalTempNum,
                                icon: 'el-icon-user',
                                color: '#00a7d0',
                            },
                            {
                                title: this.$t('正常总人数'),
                                count: this.vitalData.normalTempNum,
                                icon: 'el-icon-info',
                                color: 'rgb(27, 201, 142)',
                            },
                            {
                                title: this.$t('高温总人数'),
                                count: this.vitalData.highTempNum,
                                icon: 'el-icon-message-solid',
                                color: 'rgb(230, 71, 88)',
                            },
                            {
                                title: this.$t('温度偏高总人数'),
                                count: this.vitalData.lessHighTempNum,
                                icon: 'el-icon-key',
                                color: 'rgba(255, 120, 0, 1)',
                            },
                            {
                                title: this.$t('未戴口罩总人数'),
                                count: this.vitalData.noMaskTempSum,
                                icon: 'el-icon-user',
                                color: 'rgba(255, 0, 0, 1)',
                            }
                        ]
                    }
                    if(done!=null){
                        done();
                    }

                    this.option=optionInfo;
                }).catch(() => {
                    loading.close()
                });
            },startDateChangeDate(date){
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
                 this.form.startDate = datetime;
            },endDateChangeDate(date){
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
                this.form.endDate = datetime;

            },provinceChange(m){
                this.getAreaDataByType(2,m);
            },cityChange(m){
                this.getAreaDataByType(3,m);
            },submit(form,done){
                console.log(form);
                this.getVitalTempData(done);
            }
        }
    }
</script>

<style scoped>
  /deep/.el-form-item {
    margin-bottom: 0px;
  }
  /deep/ .avue-data-panel .item-icon {
    font-size: 42px;
  }
  /deep/.el-col-md-6 {
           width: 20%;
  }
  /deep/ .avue-data-panel .item-title {
    line-height: 18px;
    color: rgba(0,0,0,.45);
    font-size: 13px;
    margin-bottom: 12px;
  }

</style>
