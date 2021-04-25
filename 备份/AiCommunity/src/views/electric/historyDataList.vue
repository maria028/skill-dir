<template>
  <el-container>
    <el-main style="background-color: white;margin-left:1%;border-top-left-radius: 10px;border-top-right-radius: 10px">
      <div style="margin-left: 10px;margin-top: 10px">
        <el-input v-model="condition" style="width: 200px" placeholder="单元/表计名称"></el-input>
        <el-date-picker
          v-model="dateTime"
          :type="dateTimeType"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions"
          style="margin-left: 10px"
          :value-format="valueFormat"
          :format="valueFormat">

        </el-date-picker>
        <el-select  v-model="cumulant" style="margin-left: 10px" placeholder="请选择"@change="cumulantChange">
          <el-option
            v-for="item in ljOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select v-model="rateType" v-if="isCumulant" style="margin-left: 10px" placeholder="请选择">
          <el-option
            v-for="item in rateOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="success" icon="el-icon-search" size="small"
                   style="background-color: #4cb678;margin-left: 10px" @click="getData">查询
        </el-button>

      </div>
      <el-table
        :data="tableData"
        stripe
        fixed
        header-align ="center"
        height="400px"
        style="width: 99%;"
        v-if="isCumulant">
        <el-table-column
          type="selection"
          width="55"
          fixed="left"/>
        <el-table-column
          type="index"
          label="序号"
          width="50"
          fixed="left"/>
        <el-table-column
          prop="deviceName"
          label="表计名称"
          width="180"
          fixed="left">
        </el-table-column>
        <el-table-column
          prop="mallName"
          label="所在单元"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="通讯地址">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="数据时间"
        width="180">
        </el-table-column>
        <el-table-column
          prop="rate"
          label="费率">
        </el-table-column>
        <el-table-column
          prop="positiveActive"
          label="正向有功">
        </el-table-column>
        <el-table-column
          prop="positiveReactive"
          label="正向无功">
        </el-table-column>
        <el-table-column
          prop="reverseActive"
          label="反向有功">
        </el-table-column>
        <el-table-column
          prop="positiveReactive"
          label="反向无功">
        </el-table-column>
      </el-table>

      <el-table
        :data="tableData"
        stripe
        fixed
        header-align ="center"
        max-height="400px"
        style="width: 99%;"
        v-if="isMoment">
        <el-table-column
          type="selection"
          width="55"
          fixed="left">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="50"
          fixed="left">
        </el-table-column>
        <el-table-column
          prop="deviceName"
          label="表计名称"
          width="180"
          fixed="left">
        </el-table-column>
        <el-table-column
          prop="mallName"
          label="所在单元"
          width="180">
        </el-table-column>
        <el-table-col
          prop="meterReadingTime"
          label="数据时间"
          width="180">
        </el-table-col>
        <el-table-column
          prop="address"
          label="通讯地址">
        </el-table-column>
        <el-table-column
          prop="voltageA"
          label="A相电压">
        </el-table-column>
        <el-table-column
          prop="voltageB"
          label="B相电压">
        </el-table-column>
        <el-table-column
          prop="voltageC"
          label="C相电压">
        </el-table-column>
        <el-table-column
          prop="electricCurrentA"
          label="A相电流">
        </el-table-column>
        <el-table-column
          prop="electricCurrentB"
          label="B相电流">
        </el-table-column>
        <el-table-column
          prop="electricCurrentC"
          label="C相电流">
        </el-table-column>

        <el-table-column
          prop="activePowerTotal"
          label="总有功功率">
        </el-table-column>

        <el-table-column
          prop="activePowerA"
          label="A相有功功率">
        </el-table-column>

        <el-table-column
          prop="activePowerB"
          label="B相有功功率">
        </el-table-column>

        <el-table-column
          prop="activePowerC"
          label="C相有功功率">
        </el-table-column>
        <el-table-column
          prop="reactivePowerTotal"
          label="总无功功率">
        </el-table-column>
        <el-table-column
          prop="reactivePowerA"
          label="A相无功功率">
        </el-table-column>
        <el-table-column
          prop="reactivePowerB"
          label="B相无功功率">
        </el-table-column>
        <el-table-column
          prop="reactivePowerC"
          label="C相无功功率">
        </el-table-column>
        <el-table-column
          prop="powerFactorTotal"
          label="总功率因数">
        </el-table-column>
        <el-table-column
          prop="powerFactorA"
          label="A相功率因数">
        </el-table-column>
        <el-table-column
          prop="powerFactorB"
          label="B相功率因数">
        </el-table-column>
        <el-table-column
          prop="powerFactorC"
          label="C相功率因数">
        </el-table-column>
      </el-table>
      <el-table
        :data="tableData"
        stripe
        fixed
        header-align ="center"
        max-height="400px"
        style="width: 99%;"
        v-if="isNeed">
        <el-table-column
          type="selection"
          width="55"
          fixed="left">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="50"
          fixed="left">
        </el-table-column>
        <el-table-column
          prop="deviceName"
          label="表计名称"
          width="180"
          fixed="left">
        </el-table-column>
        <el-table-column
          prop="mallName"
          label="所在单元"
          width="180">
        </el-table-column>
        <el-table-column
          prop="address"
          label="通讯地址">
        </el-table-column>
        <el-table-column
          prop="meterReadingTime"
          label="数据时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="positiveActiveTime"
          label="正向有功发生时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="positiveActiveMax"
          label="正向有功最大需量"
          width="150">
        </el-table-column>
        <el-table-column
          prop="positiveReactiveTime"
          label="正向无功发生时间"
          width="150">
        </el-table-column>
        <el-table-column
          prop="positiveReactiveMax"
          label="正向无功最大需量"
          width="150">
        </el-table-column>
        <el-table-column
          prop="reverseActiveTime"
          label="反向有功发生时间"
          width="150">
        </el-table-column>

        <el-table-column
          prop="reverseActiveMax"
          label="反向有功最大需量"
          width="150">
        </el-table-column>

        <el-table-column
          prop="reverseReactiveTime"
          label="反向无功发生时间"
          width="150">
        </el-table-column>

        <el-table-column
          prop="reverseReactiveMax"
          label="反向无功最大需量"
          width="150">
        </el-table-column>

      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[100, 200, 300, 400]"
        background
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total"
       style="position: fixed;right: 10px">
      </el-pagination>
    </el-main>

  </el-container>

</template>

<script>
  import {historyCumulantList,historyMomentList,historyNeedList} from "../../api/electric";

  export default {
        name: "historyDataList",
        data() {
            return{
                valueFormat:'yyyy-MM-dd HH:mm',
                dateTimeType:'datetime',
                page: {
                    pageSize: 50,
                    currentPage: 1,
                    total: 20
                },
                tableData:[],
                condition:'',
                dateTime:'',
                isCumulant:true,
                isMoment:false,
                isNeed:false,
                cumulant:'累积量',
                rateType:'',
                rateOptions:[{
                    value: '',
                    label: '费率类型'
                },{
                    value: '1',
                    label: '总'
                },{
                    value: '2',
                    label: '尖'
                },{
                    value: '3',
                    label: '峰'
                },{
                    value: '4',
                    label: '平'
                },{
                    value: '5',
                    label: '谷'
                }],
                ljOptions:[{
                    value: '累积量',
                    label: '累积量'
                },{
                    value: '瞬时量',
                    label: '瞬时量'
                },{
                    value: '需量',
                    label: '需量'
                }],
                pickerOptions:{
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                }

            }
        },created(){
          let day2 = new Date();
          day2.setTime(day2.getTime());
          let s2 = day2.getFullYear()+"-" + (day2.getMonth()+1) + "-" + day2.getDate()+" 00:00";
          this.dateTime = s2;
            this.getData()
      },methods:{
          cumulantChange(value){
              console.log("value=="+value);
              this.cumulant = value;
              this.getData();
          },
            getData(){
                if(this.cumulant === '累积量'){
                    this.valueFormat = 'yyyy-MM-dd HH:mm';
                    this. dateTimeType = 'datetime';
                    this.isCumulant = true;
                    this.isNeed = false;
                    this.isMoment = false;
                   this.getHistoryCumulantList();
                }else if(this.cumulant === '瞬时量'){
                    this.valueFormat = 'yyyy-MM-dd HH:mm';
                    this. dateTimeType = 'datetime';
                    this.isCumulant = false;
                    this.isMoment = true;
                    this.isNeed = false;
                    this.getHistoryMomentList();
                }else if(this.cumulant === '需量'){
                    this.valueFormat = 'yyyy-MM';
                    this. dateTimeType = 'month';
                    this.isCumulant = false;
                    this.isMoment = false;
                    this.isNeed = true;
                    this.getHistoryNeedList();
                }
            },
            getHistoryCumulantList(){
                historyCumulantList(this.condition,this.page.currentPage,"1339757844432125960",
                    null,this.rateType,this.page.pageSize,this.dateTime).then(res=>{
                        this.tableData =res.data.data.records;
                        this.page.total = res.data.data.total;
                });
            },getHistoryMomentList(){
              console.log("dateTime=="+this.dateTime)
                 historyMomentList(this.condition,this.cumulant,
                     this.page.currentPage,"1339757844432125960",null,this.page.pageSize,this.dateTime).then(res=>{
                     this.tableData =res.data.data.records;
                     this.page.total = res.data.data.total;
                 });
          },getHistoryNeedList(){
              historyNeedList(this.condition,this.page.currentPage,"1339757844432125960",null,this.page.pageSize,this.dateTime).then(res=>{
                  this.tableData =res.data.data.records;
                  this.page.total = res.data.data.total;
              });
          },handleSizeChange(val) {
              console.log(`每页 ${val} 条`);
          },
          handleCurrentChange(val) {
              console.log(`当前页: ${val}`);
          }
        }
    }
</script>

<style lang="scss" scoped>
  @import "../../styles/style.scss";
</style>
