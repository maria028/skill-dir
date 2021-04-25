<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-form v-model="query" label-width="30%">
            <el-row>
                <el-col :span=6 class="col">
                    <el-form-item label="部门名称">
                        <el-input v-model="query.deptName" clearable placeholder="部门名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="所属租户">
                        <el-select v-model="query.tenantId" clearable placeholder="所属租户">
                            <el-option v-for="item in tenantOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="部门全称">
                        <el-input v-model="query.fullName" clearable placeholder="部门全称"></el-input>
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
                   v-if="permission.dept_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</div>
</template>

<script>
    import {add, getDept, getDeptTree, getList, remove, update,select} from "@/api/system/dept";
    import {mapGetters} from "vuex";
    import website from '@/config/website';
    import {baseUrl} from '@/config/env';

    export default {
        data() {
            return {
                form: {},
                selectionList: [],
                tenantOptions: [],
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
                    selection: true,
                    viewBtn: true,
                    columnBtn:false,
                    refreshBtn: false,
                    column: [
                        {
                            label: "部门名称",
                            prop: "deptName",
                            // search: true,
                            rules: [{
                                required: true,
                                message: "请输入部门名称",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "所属租户",
                            prop: "tenantId",
                            type: "tree",
                            dicUrl: baseUrl + "/system/tenant/select",
                            addDisplay: false,
                            editDisplay: false,
                            viewDisplay: website.tenantMode,
                            span: 24,
                            props: {
                                label: "tenantName",
                                value: "tenantId"
                            },
                            hide: !website.tenantMode,
                            // search: website.tenantMode,
                            rules: [{
                                required: true,
                                message: "请输入所属租户",
                                trigger: "click"
                            }]
                        },
                        {
                            label: "部门全称",
                            prop: "fullName",
                            // search: true,
                            rules: [{
                                required: true,
                                message: "请输入部门全称",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "上级部门",
                            prop: "parentId",
                            dicData: [],
                            type: "tree",
                            hide: true,
                            props: {
                                label: "title"
                            },
                            rules: [{
                                required: false,
                                message: "请选择上级部门",
                                trigger: "click"
                            }]
                        },

                        {
                            label: "排序",
                            prop: "sort",
                            type: "number",
                            rules: [{
                                required: true,
                                message: "请输入排序",
                                trigger: "blur"
                            }]
                        },

                        {
                            label: "备注",
                            prop: "remark",
                            span: 24,
                            rules: [{
                                required: false,
                                message: "请输入备注",
                                trigger: "blur"
                            }]
                        }
                    ]
                },
                data: []
            };
        },
        computed: {
            ...mapGetters(["permission"]),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permission.dept_add, false),
                    viewBtn: this.vaildData(this.permission.dept_view, false),
                    delBtn: this.vaildData(this.permission.dept_delete, false),
                    editBtn: this.vaildData(this.permission.dept_edit, false)
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
        created() {
            this.selectData();
        },
        methods: {
            selectData() {
                select().then(resp => {
                    resp.data.data.forEach(v => {
                        this.tenantOptions.push({value: v.tenantId, label: v.tenantName})
                    })
                })
            },
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
            beforeOpen(done, type) {
                if (["edit", "view"].includes(type)) {
                    getDept(this.form.id).then(res => {
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
                    getDeptTree().then(res => {
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
