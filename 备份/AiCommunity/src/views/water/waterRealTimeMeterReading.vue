<template>
  <el-container>
    <el-main style="background-color: white">
      <div style="margin-left: 10px;margin-top: 10px">
        <el-form :inline="true" :model="formInline">
          <el-form-item label="小区">
            <el-select v-model="formInline.mallId" placeholder="请选择小区" @change="mallChange">
              <el-option
                v-for="item in mallList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房号">
            <el-input v-model="formInline.room" placeholder="请输入房号"></el-input>
          </el-form-item>
          <el-form-item label="时间">
            <el-date-picker
              type="date"
              placeholder="开始时间"
              v-model="formInline.startDate"
              :format="valueFormat"
              :value-format="valueFormat"
              :clearable="false"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="-">
            <el-date-picker
              type="date"
              placeholder="结束时间"
              v-model="formInline.endDate"
              :format="valueFormat"
              :value-format="valueFormat"
              :clearable="false">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-search" size="small"
                       style="background-color: #4cb678;margin-left: 10px" @click="getElectricDetailData">查询
            </el-button>
          </el-form-item>
        </el-form>


      </div>


      <el-table
        :data="tableData"
        stripe
        fixed
        header-align ="center"
       >
        <el-table-column
          type="index"
          label="序号"
          width="50">
        </el-table-column>
        <el-table-column
          prop="houseName"
          label="小区"
          >
        </el-table-column>
        <el-table-column
          prop="houseNum"
          label="户号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="date"
          label="上报时间">
        </el-table-column>
        <el-table-column
          prop="waterCumLast"
          label="上一次累积量">
        </el-table-column>
        <el-table-column
          prop="waterCum"
          label="本次累积量">
        </el-table-column>
        <el-table-column
          prop="waterUsage"
          label="用水量（升）">
        </el-table-column>

      </el-table>
    </el-main>
  </el-container>
</template>

<script>
  import {getWaterDetail} from "../../api/waterRes";
  import {getMallByUser} from "../../api/mall";
  export default {
        name: "waterRealTimeMeterReading",
        data() {
            return {
                valueFormat:'yyyy-MM-dd',
                formInline:{mallId:'',building:'',unit:'',startDate:'',endDate:'',room:''},
                mallList:[],
                buildingData:[],
                unitData:[],
                page: {
                    pageSize: 50,
                    currentPage: 1,
                    total: 20
                },
                data:[],
                tableData: [],
                value: ''

            }
        },created(){
        },mounted() {
          this.$nextTick(() => {
               this.getNowDate();
              this.getMallData();
          });
      },
        methods: {
            mallChange(){

            },conver(s) {
                return s < 10 ? '0' + s : s;
            },getNowDate(){
                let time=(new Date).getTime()-24*60*60*1000;
                let yesterday=new Date(time);
                let month=yesterday.getMonth();
                let day=yesterday.getDate();
                yesterday=yesterday.getFullYear() + "-" + (yesterday.getMonth()> 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" +(yesterday.getDate()> 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
                this.formInline.startDate = yesterday;
                this.formInline.endDate = yesterday;
            },
            getMallData(){
                getMallByUser().then(res =>{
                    this.mallList = res.data.data;
                    if(this.mallList.length >0 ){
                        this.formInline.mallId=  this.mallList[0].id;
                         this.getElectricDetailData();
                    }
                });
            },getElectricDetailData(){
                getWaterDetail(this.formInline.building,this.formInline.endDate,
                    this.formInline.mallId,this.formInline.startDate,this.formInline.unit,this.formInline.room).then(res =>{
                    let data= res.data.data;
                    this.tableData = data;

                });
            },
            buildingChange(){

            },getElectricMomentList(){

            }
        }
    }
</script>

<style lang="scss" scoped>
  @import "../../styles/style.scss";
</style>
