<template>
  <div>
    <el-form :inline="true" :model="form" class="m-form-inline" style="margin-left: 10px">
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
        <el-button type="primary" @click="getTempUnusualStatistics">{{$t('查询')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="mallName"
        label="网点名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="deviceNo"
        label="设备"
        width="180">
      </el-table-column>
      <el-table-column
        prop="total"
        label="总量">
      </el-table-column>
      <el-table-column
        prop="high"
        label="高温数">
      </el-table-column>
      <el-table-column
        prop="low"
        label="低温数">
      </el-table-column>
      <el-table-column
        prop="unusual"
        label="异常率">
        <template  scope="scope">
          <el-tag  v-if="numFilter(scope.row.unusual) <=10 ">{{numFilter(scope.row.unusual)}}%</el-tag>
          <el-tag type="warning" v-if="numFilter(scope.row.unusual) < 50 && numFilter(scope.row.unusual) >10">{{numFilter(scope.row.unusual)}}%</el-tag>
          <el-tag type="danger" v-if="numFilter(scope.row.unusual) >=50">{{numFilter(scope.row.unusual)}}%</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
    import {tempUnusualStatistics} from "../../api/tempCheck";

    export default {
        name: "tempUnusualStatistics",
        data() {
            return {
                form:{startDate:new Date(),
                    endDate:new Date()},
                tableData: []
            }
        },  mounted(){
            this.getNowDate();
            this.getTempUnusualStatistics();
        },methods: {
            getTempUnusualStatistics(){
                const loading = this.$loading({
                    lock: true,
                    text: '正在加载数据,请稍候...',
                    spinner: "el-icon-loading"
                });
                tempUnusualStatistics(this.form.startDate,this.form.endDate).then( res => {
                    const  data=res.data.data;
                    this.tableData=data;
                    loading.close();
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

            }, getNowDate() {
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
                this.form.startDate  =nowDate;
                this.form.endDate= nowDate;
            }, // 截取当前数据到小数点后两位
            numFilter(value) {
                const realVal = parseFloat(value).toFixed(2);
                return realVal;
            }
        }
    }
</script>

<style scoped>

</style>
