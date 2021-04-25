<template>
  <div style="background-color: white;padding-top: 1vh;text-align: center">
    <el-form ref="form" :model="form" label-width="12vw">
      <div class="row_line" >
        <el-form-item label="温度超时报警延时值">
          <el-input v-model="form.ELE1"></el-input>
          <span class="unit">秒</span>
        </el-form-item>
        <el-form-item label="温度过高报警阀值">
          <el-input v-model="form.ELE2"></el-input>
          <span class="unit">度</span>
        </el-form-item>
      </div>
      <div class="row_line">
        <el-form-item label="电流超限报警延时值">
          <el-input v-model="form.ELE3"></el-input>
          <span class="unit">秒</span>
        </el-form-item>
        <el-form-item label="剩余电流过流报警阀值">
          <el-input v-model="form.ELE4"></el-input>
          <span class="unit">安</span>
        </el-form-item>
      </div>
      <div class="row_line">
        <el-form-item label="电流过流报警阀值">
          <el-input v-model="form.ELE5"></el-input>
          <span class="unit">安</span>
        </el-form-item>
        <el-form-item label="电压超限报警延时阀值">
          <el-input v-model="form.ELE6"></el-input>
          <span class="unit">秒</span>
        </el-form-item>
      </div>
      <div class="row_line">
        <el-form-item label="电压欠压报警阀值">
          <el-input v-model="form.ELE7"></el-input>
          <span class="unit">伏</span>
        </el-form-item>
        <el-form-item label="电压过压报警阀值">
          <el-input v-model="form.ELE8"></el-input>
          <span class="unit">伏</span>
        </el-form-item>
      </div>
      <div class="row_line">
        <el-form-item label="用电总量监测阀值">
          <el-input v-model="form.ELE9"></el-input>
          <span class="unit">小时</span>
        </el-form-item>
        <el-form-item label="用电总量小于">
          <el-input v-model="form.ELE10"></el-input>
          <span class="unit">度</span>
        </el-form-item>
        <el-form-item label="上报电量大于">
          <el-input v-model="form.ELE11"></el-input>
          <span class="unit">度</span>
        </el-form-item>
      </div>
      <div class="row_line">
        <el-form-item label="持续电总量监测阀值">
          <el-input v-model="form.ELE12"></el-input>
          <span class="unit">小时</span>
        </el-form-item>
        <el-form-item label="上报用电小于">
          <el-input v-model="form.ELE13"></el-input>
          <span class="unit">度</span>
        </el-form-item>
        <el-form-item label="上报用电大于">
          <el-input v-model="form.ELE14"></el-input>
          <span class="unit">度</span>
        </el-form-item>
      </div>
      <div class="row_line">
        <el-form-item label="用水总量监测阀值">
          <el-input v-model="form.WMT1"></el-input>
          <span class="unit">小时</span>
        </el-form-item>
        <el-form-item label="用水总量小于">
          <el-input v-model="form.WMT2"></el-input>
          <span class="unit">升</span>
        </el-form-item>
        <el-form-item label="用水总量大于">
          <el-input v-model="form.WMT3"></el-input>
          <span class="unit">升</span>
        </el-form-item>
      </div>
      <div class="row_line">
        <el-form-item label="持续用水总量监测阀值">
          <el-input v-model="form.WMT4"></el-input>
          <span class="unit">小时</span>
        </el-form-item>
        <el-form-item label="上报水量小于">
          <el-input v-model="form.WMT5"></el-input>
          <span class="unit">升</span>
        </el-form-item>
        <el-form-item label="上报水量大于">
          <el-input v-model="form.WMT6"></el-input>
          <span class="unit">升</span>
        </el-form-item>
      </div>
      <div class="row_line">
        <el-form-item>
          <el-button type="primary" @click="updateThresholdData">确定</el-button>
        </el-form-item>
      </div>

    </el-form>
  </div>


</template>

<script>
  import {getThresholdList,updateThreshold} from "../../../api/mall";

  export default {
        name: "parameterSetting",
        data(){
            return{
                form:{'ELE1':'','ELE2':'','ELE3':'','ELE4':'',
                    'ELE5':'','ELE6':'','ELE7':'','ELE8':'','ELE9':'','ELE10':''
                    ,'ELE11':'','ELE12':'','ELE13':'','ELE14':'','WMT1':'','WMT2':''
                    ,'WMT3':'','WMT4':'','WMT5':'','WMT6':''}
            }
        },created() {
            this.getThresholdListData();
      },methods:{
          getThresholdListData(){
              getThresholdList(null,null).then(res=>{
                  let data = res.data.data;
                  data.forEach(v=>{
                      let code = v.code;
                      let thresholdType =v.thresholdType;
                      let thresholdName = v.thresholdName;
                      let thresholdValue = this.cutZero(v.thresholdValue);
                      let key = thresholdType+code;
                      this.form[key] = thresholdValue;

                  });
              });
          },cutZero(old){
              //拷贝一份 返回去掉零的新串
            let  newstr=old;
              //循环变量 小数部分长度
              var leng = old.length-old.indexOf(".")-1
              //判断是否有效数
              if(old.indexOf(".")>-1){
                  //循环小数部分
                  for(let i=leng;i>0;i--){
                      //如果newstr末尾有0
                      if(newstr.lastIndexOf("0")>-1 && newstr.substr(newstr.length-1,1)==0){
                          var k = newstr.lastIndexOf("0");
                          //如果小数点后只有一个0 去掉小数点
                          if(newstr.charAt(k-1)=="."){
                              return  newstr.substring(0,k-1);
                          }else{
                              //否则 去掉一个0
                              newstr=newstr.substring(0,k);
                          }
                      }else{
                          //如果末尾没有0
                          return newstr;
                      }
                  }
              }
              return old;
          },updateThresholdData(){
              let dto= {};
              dto.continuePowerLess = this.form.ELE13;
              dto.continuePowerMore =   this.form.ELE14;
                  dto.continuePowerTime =  this.form.ELE12;
                  dto.continueWaterLess =   this.form.WMT5;
                  dto.continueWaterMore =   this.form.WMT6;
                  dto.continueWaterTime =    this.form.WMT4;
                  dto.eleOver =   this.form.ELE5;
                  dto.eleOverrun =   this.form.ELE3;
                  dto.powerLess =  this.form.ELE10;
                  dto.powerMore =   this.form.ELE11;
                  dto.powerTime =   this.form.ELE9;
                  dto.residueEleOver =  this.form.ELE4;
                  dto.tempOver =   this.form.ELE2;
                  dto.tempOverTime =  this.form.ELE1;
                  dto.voltageOver =  this.form.ELE8;
                  dto.voltageOverrun =  this.form.ELE6;
                  dto.voltageUnder =  this.form.ELE7;
                  dto.waterLess = this.form.WMT2;
                  dto.waterMore =  this.form.WMT3;
                  dto.waterTime =  this.form.WMT1;
              updateThreshold(dto).then(res=>{
                  this.$message({
                      type: 'success',
                      message: '设置成功!'
                  });
              });
          }
      }
    }
</script>

<style scoped>
  .row_line{
    display: flex;text-align: center; align-items:center;justify-content:center;
  }
  /deep/.el-input{
    width: 80%;
  }
  /deep/.el-form-item__content{
    display: flex;
  }
  .unit{
    margin-left:.3vw;
    width:2.5vw;
  }

  /deep/.el-form-item {
    margin-bottom: 15px;
  }

</style>
