<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-form v-model="query" label-width="30%">
            <el-row>
                <el-col :span=6 class="col">
                    <el-form-item label="字典编号">
                        <el-input v-model="query.code" clearable placeholder="字典编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="字典名称">
                        <el-input v-model="query.dictValue" clearable placeholder="字典名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="字典备注">
                        <el-input v-model="query.remark" clearable placeholder="字典备注"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=2 :offset=4 class="col">
                    <el-form-item>
                        <el-button type="success" size="medium" @click="onLoad">查询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               :before-open="beforeOpen"
               @row-del="rowDel"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="success"
                   size="small"
                   icon="el-icon-delete"
                   v-if="permission.dict_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</div>
</template>

<script>
    import {add, getDict, getDictTree, getList, remove, update} from "@/api/system/dict";
    import {mapGetters} from "vuex";

    export default {
        data() {
            return {
                form: {},
                selectionList: [],
                query: {},
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                option: {
                    searchMenuSpan:true,
                    tip: false,
                    tree: true,
                    border: true,
                    index: true,
                    indexLabel: "序号",
                    align: "center",
                    refreshBtn: false,
                    columnBtn: false,
                    selection: true,
                    viewBtn: true,
                    column: [
                        {
                            label: "字典编号",
                            prop: "code",
                            // search: true,
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请输入字典编号",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "字典名称",
                            prop: "dictValue",
                            // search: true,
                            rules: [{
                                required: true,
                                message: "请输入字典名称",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "上级字典",
                            prop: "parentId",
                            type: "tree",
                            dicData: [],
                            hide: true,
                            props: {
                                label: "title"
                            },
                            rules: [{
                                required: false,
                                message: "请选择上级字典",
                                trigger: "click"
                            }]
                        },
                        {
                            label: "字典键值",
                            prop: "dictKey",
                            type: "number",
                            rules: [{
                                required: true,
                                message: "请输入字典键值",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "字典排序",
                            prop: "sort",
                            type: "number",
                            rules: [{
                                required: true,
                                message: "请输入字典排序",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "字典备注",
                            prop: "remark",
                            // search: true,
                            span: 24,
                            hide: true,
                        },
                    ]
                },
                data: []
            };
        },
        computed: {
            ...mapGetters(["permission"]),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permission.dict_add, false),
                    viewBtn: this.vaildData(this.permission.dict_view, false),
                    delBtn: this.vaildData(this.permission.dict_delete, false),
                    editBtn: this.vaildData(this.permission.dict_edit, false)
                };
            },
            ids() {
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            }
        },
        methods: {
            rowSave(row, loading, done) {
                add(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowUpdate(row, index, loading, done) {
                update(row).then(() => {
                    loading();
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
                    console.log(error);
                });
            },
            rowDel(row) {
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        return remove(row.id);
                    })
                    .then(() => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                    });
            },
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params) {
                this.query = params;
                this.onLoad(this.page, params);
            },
            selectionChange(list) {
                this.selectionList = list;
            },
            handleDelete() {
                if (this.selectionList.length === 0) {
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                this.$confirm("确定将选择数据删除?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        return remove(this.ids);
                    })
                    .then(() => {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.$refs.crud.toggleSelection();
                    });
            },
            beforeOpen(done, type) {
                if (["edit", "view"].includes(type)) {
                    getDict(this.form.id).then(res => {
                        this.form = res.data.data;
                    });
                }
                done();
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            onLoad(page, params = {}) {
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    this.data = res.data.data;
                    getDictTree().then(res => {
                        const data = res.data.data;
                        const index = this.$refs.crud.findObject(this.option.column,"parentId");
                        index.dicData = data;
                    });
                });
            }
        }
    };
</script>

<style scoped>
    /deep/.el-table--small {
        font-size: 14px;
    }

    /deep/.avue-crud .el-table th {
        color: #909399;
    }

    .col {
        height: 45px;
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
</style>
