<template>
  <div style="width: 98%;margin: 0 1%;">
    <el-card>
    <div style="margin-left: 1rem;">
      <el-button type="success" size="small" icon="el-icon-plus" @click="append">
        新增
      </el-button>
    </div>
   <div style="margin-top: 1rem">
     <el-tree
       :data="data"
       node-key="id"
       default-expand-all
       :expand-on-click-node="false"
       :props="defaultProps">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
           <el-button
             type="text"
             size="mini"
             @click="() => updateArea(data)">
             <i class="el-icon-edit"></i>
            修改
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            <i class="el-icon-delete"></i>
              删除
          </el-button>

        </span>
      </span>
     </el-tree>
   </div>

    <el-drawer
      title="新增"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="行政级别" prop="type">
          <el-select v-model="form.type" placeholder="请选择行政级别">
            <el-option label="省" value="1"></el-option>
            <el-option label="市" value="2"></el-option>
            <el-option label="县区" value="3"></el-option>
            <el-option label="街道乡镇" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级行政区" >
          <el-input placeholder="请选择 上级行政区" clearable v-model="form.area.nodeName"@clear="clearArea" @focus="showParent"></el-input>
        </el-form-item>
        <el-form-item label="行政区代码" prop="id">
          <el-input v-model="form.id" placeholder="请选择输入行政区代码"></el-input>
        </el-form-item>
        <el-form-item label="行政区名称" prop="name">
          <el-input v-model="form.name" placeholder="请选择输入行政区"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>

        </el-form-item>
      </el-form>
    </el-drawer>

    <el-dialog title="区县信息" :visible.sync="dialogTableVisible">
      <el-tree
        :data="data"
        node-key="id"
        default-expand-all
        @node-click="chooseArea"
        :props="defaultProps">
      </el-tree>
    </el-dialog>


  </el-card>
</div>
</template>

<script>
    import {getArea} from "../../api/system/device";
    import {submitArea,removeArea,detailArea} from "../../api/system/area";

    export default {
        name: "organizational",
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'nodeName'
                },
                data: [],
                drawer: false,
                direction: 'rtl',
                detailDrawer:false,
                dialogTableVisible:false,
                form: {
                    name: '',
                    id:'',
                    area:{},
                    parentId:'0',
                    type:'1'
                },
                rules:{
                    name: [
                        { required: true, message: '请输入区县名称', trigger: 'blur' }
                    ],
                    id:[
                        { required: true, message: '请输入区县ID', trigger: 'blur' }
                        ]

                },
                areaDataInfo:{}
            };
        },
        methods: {
            onSubmit(){
                this.$refs["form"].validate((valid) => {
                    if (valid) {
                      submitArea(this.form.id,this.form.name,this.form.type,this.form.parentId).then(res=>{
                          this.getData();
                          this.drawer=false;

                      });
                    } else {
                        return false;
                    }
                });

            },
            clearArea(){
                this.form.area={};
                this.form.parentId='0';
            },
            chooseArea(data){
                console.log(data);
                this.form.area=data;
                this.form.parentId=data.id;
                this.dialogTableVisible=false;
            },
            showParent(){
                this.dialogTableVisible=true;
            },
            getData() {
                getArea().then(res => {
                    let data = res.data.data;
                    this.data = this.getChildren(data);
                    console.log(res);
                });
            },getChildren(data){
                data.forEach(v=>{
                     let name=v.name;
                     let id=v.id;
                     let  children=v.children;
                     v.nodeName=name+" | "+id
                     this.areaDataInfo[id]= v;
                     if(children.length >0){
                         this.getChildren(children);
                     }
                });
                return data;
            },getDetail(node,data){
                console.log(node);
                this.detailDrawer=true;
                detailArea(data.id).then(res=>{
                    console.log(res);
                });
            },
            remove(node, data) {
                this.$confirm('确认【'+data.nodeName+'】删除？')
                    .then(_ => {
                     removeArea(data.id).then(res=>{
                         this.getData();
                     });
                    })
                    .catch(_ => {});
                // const parent = node.parent;
                // const children = parent.data.children || parent.data;
                // const index = children.findIndex(d => d.id === data.id);
                // children.splice(index, 1);
            },
            append() {
                 this.drawer=true;
                 this.$refs["form"].resetFields();
                 this.form.area={};
                 this.form.id="";
                 this.form.name="";
                 this.form.type="1";

                // const newChild = { id: "11", label: '1111', children: [] };
                // console.log(data);
                // if (!data.children) {
                //     this.$set(data, 'children', []);
                // }
                // data.children.push(newChild);
            }, handleClose(done) {
                done();
            },updateArea(data){
                this.form.id=data.id;
                this.form.name=data.name;
                this.form.type=data.type+"";
                this.form.parentId=data.parentId;
                let areaInfo=this.areaDataInfo[data.parentId];
                if(areaInfo!=null){
                    this.form.area=areaInfo;
                }
                this.drawer=true;
                console.log(this.form);

            }
        }, mounted() {
            this.getData();
        }
    }

</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  /deep/ .el-select-dropdown__list {
    list-style: none;
    padding: 16px 0;
    margin: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

</style>
