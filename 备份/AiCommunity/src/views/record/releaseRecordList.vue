<template>
  <div style="width: 98%;margin:0 1%">
    <el-card style="margin-bottom:1%;">
      <el-form label-width="20%">
        <el-row>
          <el-col :span=6 class="col">
            <el-form-item label="日期">
              <el-date-picker v-model="currentDate" type="date" placeholder="选择日期" @change="timeChange"
                :clearable="clearable" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span=6 class="col">
            <el-form-item label="小区">
              <el-select v-model="value" placeholder="请选择小区" clearable filterable :change="mallChange(value)"
                style="width: 100%;">
                <el-option v-for="item in mallList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span=2 :offset=10 class="col">
            <el-form-item>
              <el-button type="success" icon="el-icon-search" size="small" @click="queryData"
                style="background-color: #4cb678;float: right;margin-top: 7%;">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row>
        <el-col :span=24>
          <el-table :data="tableData" stripe border :header-cell-style="{background:'#D8E3FA'}"
            :default-sort="{prop: '', order: ''}">
            <el-table-column type="expand" label="序号" width="50" align="center">
              <template slot-scope="props">
                <el-table :data="props.row.recordList" style="width: 100%">
                  <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
                  <el-table-column prop="type" label="垃圾类型" width="180" align="center"></el-table-column>
                  <el-table-column prop="weight" label="垃圾重量(kg)" width="180" align="center"></el-table-column>
                  <el-table-column prop="time" label="拍摄时间" align="center"></el-table-column>
                  <el-table-column prop="address" label="拍摄照片" align="center">
                    <template scope="scope">
                      <el-popover placement="right" trigger="hover">
                        <img :src='scope.row.imageUrl'>
                        <img slot="reference" :src='scope.row.imageUrl' style="width: 20%;">
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column prop="resultInfo" label="AI识别结果" align="center"></el-table-column>
                  <el-table-column prop="time" label="AI识别时间" align="center"></el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="房号" prop="fullRoom" align="center" min-width></el-table-column>
            <el-table-column label="小区" prop="mallName" align="center" width=115></el-table-column>
            <el-table-column label="设备编号" prop="deviceNo" align="center" min-width></el-table-column>
            <el-table-column label="认证方式" prop="authType" align="center" min-width></el-table-column>
            <el-table-column label="易腐垃圾(kg)" prop="perishableWeight" align="center" width=110></el-table-column>
            <el-table-column label="其他垃圾(kg)" prop="otherWeight" align="center" width=110></el-table-column>
            <el-table-column label="可回收垃圾(kg)" prop="recyclableWeight" align="center" width=120></el-table-column>
            <el-table-column label="有害垃圾(kg)" prop="harmfulWeight" align="center" width=110></el-table-column>
            <el-table-column label="认证时间" prop="createTime" align="center" min-width></el-table-column>
            <el-table-column label="卡号" prop="cardNum" align="center" min-width></el-table-column>
            <el-table-column label="人脸" prop="faceImageUrl" align="center">
              <template scope="scope">
                <img :src="scope.row.faceImageUrl" width="40" height="40" />
                <!-- onerror="javascript:this.src = 'img/face_nomal.png'" -->
              </template>
            </el-table-column>

            <!--      <el-table-column-->
            <!--        label="识别结果"-->
            <!--        prop="resultInfo"-->
            <!--      >-->
            <!--        <template scope="scope">-->
            <!--          <img :src="scope.row.resultInfo" style="width: 40%"/>-->
            <!--        </template>-->
            <!--      </el-table-column>-->
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span=24>
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
            :current-page="page.currentPage" :page-sizes="[50, 190, 150, 100]" :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="page.total" style="float: right;">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
  </div>

</template>

<script>
  import { queryList } from "../../api/mobile/mobile";
  import { getMall } from "../../api/mall";
  import { mapGetters, mapState } from "vuex";
  export default {
    name: "releaseRecordList",
    data() {
      return {
        clearable: false,
        currentDate: new Date(),
        chooseDate: "",
        tableData: [],
        descData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        form: {},
        query: {},
        selectionList: [],
        page: {
          pageSize: 50,
          currentPage: 1,
          total: 0
        },
        mallData: {},
        mallList: [],
        value: '',
        mallId: null,
        selectData: {
          id: ''
        }
      }
    },
    mounted() {
      this.getNowDate();
      this.getMallData();
    },
    computed: {
      ...mapGetters(['tenantId'])
    },
    methods: {
      mallChange(val) {

        this.mallId = val;
      },
      timeChange() {
        console.log(this.currentDate);
        const d = new Date(this.currentDate);
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
        this.chooseDate = datetime;
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
        this.chooseDate = year + seperator1 + month + seperator1 + strDate;
      },
      selectionChange(list) {
        this.selectionList = list;
      }, spanMethod({ row, column, rowIndex, columnIndex }) {
        console.log(row);
        if (columnIndex === 0
          || columnIndex === 1 ||
          columnIndex === 2
          || columnIndex === 3
          || columnIndex === 4
          || columnIndex === 5
          || columnIndex === 6
        ) {
          if (rowIndex % 3 === 0) {
            return {
              rowspan: 3,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }, getMallData() {
        getMall(this.tenantId, 1, 1000, "", "").then(res => {
          const records = res.data.data.records;
          this.mallList = records;
          records.forEach(v => {
            let id = v.id;
            let name = v.name;
            this.mallData[id] = name
          });
          this.getData();
        });
      }, queryData() {
        this.page.currentPage = 1;
        this.getData();
      }, getData() {
        let seperator1 = "-";
        let dateStr = this.chooseDate;
        let queryDate = dateStr.replace(seperator1, "").replace(seperator1, "");
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        queryList(queryDate, this.page.currentPage, this.page.pageSize, this.mallId).then(res => {
          const data = res.data.data;
          var tableList = new Array();
          const records = data.records;
          this.page.total = data.total;
          records.forEach(res => {
            let mallName = this.mallData[res.mallId];
            let cardNum = res.cardNum;
            let faceImageUrl = res.faceImageUrl;
            let detectResult = res.detectResult;
            var authType = '直接投放';
            let desc = res.desc;
            let perishableWeight = 0;
            let recyclableWeight = 0;
            let harmfulWeight = 0;
            let otherWeight = 0;
            var recordList = new Array();
            desc.forEach(dv => {
              let type = dv.type;
              let images = dv.images;
              let weight = dv.weight;
              if (type == '易腐垃圾') {
                perishableWeight = perishableWeight + weight;
              } else if (type == '可回收物') {
                recyclableWeight = recyclableWeight + weight;
              } else if (type == '有害垃圾') {
                harmfulWeight = harmfulWeight + weight;
              } else if (type == '其他垃圾') {
                otherWeight = otherWeight + weight;
              }
              let index = 0;
              images.forEach(iv => {
                iv.bigImageUrl = iv.imageUrl + ".src.jpg";
                iv.type = type;
                let detectResult = iv.detectResult;
                var resultInfo = "识别通过"
                if (detectResult < 0) {//识别失败
                  resultInfo = "识别失败";
                } else if (detectResult == 99) {//无效记录
                  resultInfo = "无效记录";
                } else if (detectResult == 2) {//无效图片
                  resultInfo = "无效图片";
                } else if (detectResult == 0) {//未识别
                  resultInfo = "未识别";
                } else if (detectResult == 9) {//无图片
                  resultInfo = "无图片";
                } else if (detectResult == 1) {//识别通过
                  resultInfo = "识别通过";
                }
                index = index + 1;
                iv.resultInfo = resultInfo;

                recordList.push(iv);
              });
            });
            res.perishableWeight = perishableWeight;
            res.recyclableWeight = recyclableWeight;
            res.harmfulWeight = harmfulWeight;
            res.otherWeight = otherWeight;
            console.log(recordList);
            res.recordList = recordList;
            if (cardNum != '') {
              authType = "刷卡"
            } else if (faceImageUrl != '') {
              authType = "刷脸"
            }
            res.mallName = mallName;
            res.authType = authType;
            if (faceImageUrl == '') {
              res.faceImageUrl = 'img/face_nomal.png'
            } else {
              res.faceImageUrl = ".." + faceImageUrl;
            }
            if (cardNum != '' && faceImageUrl == '') {
              res.faceImageUrl = '/img/card_img.png';
            }
            var resultInfo = "/img/pass.png"
            if (detectResult < 0) {//识别失败
              resultInfo = "/img/un_pass.png";
            } else if (detectResult == 99) {//无效记录
              resultInfo = "/img/interference_img.png";
            } else if (detectResult == 2) {//无效图片
              resultInfo = "/img/invalid_img_icon.png";
            } else if (detectResult == 0) {//未识别
              resultInfo = "/img/unidentified_icon.png";
            } else if (detectResult == 9) {//无图片
              resultInfo = "/img/no_have_img.png";
            } else if (detectResult == 1) {//识别通过
              resultInfo = "/img/pass.png";
            }
            res.resultInfo = resultInfo;
            tableList.push(res)
          })
          this.tableData = tableList;
          loading.close()
        });
      }, handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.page.pageSize = val;
        this.getData();

      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.page.currentPage = val;
        this.getData();

      }
    }
  }
</script>

<style lang="scss" scoped>
  .m-table-expand {
    font-size: 0;
  }

  .m-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .m-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .m-img {
    display: inline-block;
  }

  .m-img img {
    width: 80%;
  }

  .m-desc-img {
    display: inline-block;
  }

  .m-label {
    width: 150px;
  }

  .col {
    height: 35px;
  }

  @import "../../styles/style.scss";
</style>