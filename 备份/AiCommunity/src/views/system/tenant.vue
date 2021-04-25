<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-form v-model="query" label-width="30%">
            <el-row>
                <el-col :span=6 class="col">
                    <el-form-item label="租户ID">
                        <el-input v-model="query.tenantId" clearable placeholder="租户ID"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="租户名称">
                        <el-input v-model="query.tenantName" clearable placeholder="租户名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="联系人">
                        <el-input v-model="query.linkman" clearable placeholder="联系人"></el-input>
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
               :page="page"
               :permission="permissionList"
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
                   v-if="permission.tenant_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</div>
</template>

<script>
    import {add, getList, remove, update} from "@/api/system/tenant";
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
                    border: true,
                    index: true,
                    indexLabel: "序号",
                    align: "center",
                    selection: true,
                    columnBtn:false,
                    refreshBtn:false,
                    viewBtn: true,
                    dialogWidth: 300,
                    dialogHeight: 400,
                    column: [
                        {
                            label: "租户ID",
                            prop: "tenantId",
                            // search: true,
                            addDisplay: false,
                            editDisplay: false,
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请输入租户ID",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "租户名称",
                            prop: "tenantName",
                            // search: true,
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请输入参数名称",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "联系人",
                            prop: "linkman",
                            // search: true,
                            span: 24,
                            rules: [{
                                required: true,
                                message: "请输入联系人",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "联系电话",
                            prop: "contactNumber",
                            span: 24,
                        },
                        {
                            label: "联系地址",
                            prop: "address",
                            span: 24,
                            minRows: 6,
                            type: "textarea",
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
                    addBtn: this.vaildData(this.permission.tenant_add, false),
                    viewBtn: this.vaildData(this.permission.tenant_view, false),
                    delBtn: this.vaildData(this.permission.tenant_delete, false),
                    editBtn: this.vaildData(this.permission.tenant_edit, false)
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
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            onLoad(page, params = {}) {
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.data = data.records;
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
