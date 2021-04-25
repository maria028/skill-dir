<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-form v-model="query" label-width="30%">
            <el-row>
                <el-col :span=6 class="col">
                    <el-form-item label="菜单名称">
                        <el-input v-model="query.name" clearable placeholder="菜单名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="菜单编号">
                        <el-input v-model="query.code" clearable placeholder="菜单编号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=2 :offset=10 class="col">
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
                   v-if="permission.menu_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="source">
        <div style="text-align:center">
          <i :class="row.source"></i>
        </div>
      </template>
    </avue-crud>
  </basic-container>
</div>
</template>

<script>
    import {add, getList, getMenu, remove, update} from "@/api/system/menu";
    import {mapGetters} from "vuex";
    import iconList from "@/config/iconList";
    import {baseUrl} from '@/config/env';

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
                    dialogWidth: "60%",
                    tree: true,
                    border: true,
                    index: true,
                    indexLabel: "序号",
                    align: "center",
                    selection: true,
                    columnBtn: false,
                    refreshBtn: false,
                    viewBtn: true,
                    column: [
                        {
                            label: "菜单名称",
                            prop: "name",
                            // search: true,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入菜单名称",
                                    trigger: "blur"
                                }
                            ]
                        },
                        {
                            label: "路由地址",
                            prop: "path",
                            rules: [
                                {
                                    required: true,
                                    message: "请输入路由地址",
                                    trigger: "blur"
                                }
                            ]
                        },
                        {
                            label: "上级菜单",
                            prop: "parentId",
                            type: "tree",
                            dicUrl: baseUrl + "/system/menu/tree",
                            hide: true,
                            props: {
                                label: "title"
                            },
                            rules: [
                                {
                                    required: false,
                                    message: "请选择上级菜单",
                                    trigger: "click"
                                }
                            ]
                        },
                        {
                            label: "菜单图标",
                            prop: "source",
                            type: "icon",
                            slot: true,
                            iconList: iconList,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入菜单图标",
                                    trigger: "click"
                                }
                            ]
                        },
                        {
                            label: "菜单编号",
                            prop: "code",
                            // search: true,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入菜单编号",
                                    trigger: "blur"
                                }
                            ]
                        },
                        {
                            label: "菜单类型",
                            prop: "category",
                            type: "radio",
                            dicData: [
                                {
                                    label: "菜单",
                                    value: 1
                                },
                                {
                                    label: "按钮",
                                    value: 2
                                }
                            ],
                            hide: true,
                            rules: [
                                {
                                    required: true,
                                    message: "请选择菜单类型",
                                    trigger: "blur"
                                }
                            ]
                        },
                        {
                            label: "菜单别名",
                            prop: "alias",
                            rules: [
                                {
                                    required: true,
                                    message: "请输入菜单别名",
                                    trigger: "blur"
                                }
                            ]
                        },
                        {
                            label: "按钮功能",
                            prop: "action",
                            type: "radio",
                            dicData: [
                                {
                                    label: "工具栏",
                                    value: 0
                                },
                                {
                                    label: "操作栏",
                                    value: 1
                                },
                                {
                                    label: "工具操作栏",
                                    value: 2
                                }
                            ],
                            hide: true,
                            rules: [
                                {
                                    required: true,
                                    message: "请选择按钮功能",
                                    trigger: "blur"
                                }
                            ]
                        },
                        {
                            label: "菜单排序",
                            prop: "sort",
                            type: "number",
                            rules: [
                                {
                                    required: true,
                                    message: "请输入菜单排序",
                                    trigger: "blur"
                                }
                            ]
                        },
                        {
                            label: "新窗口",
                            prop: "isOpen",
                            type: "radio",
                            dicData: [
                                {
                                    label: "否",
                                    value: 0
                                },
                                {
                                    label: "是",
                                    value: 1
                                },
                            ],
                            hide: true
                        },
                        {
                            label: "菜单备注",
                            prop: "remark",
                            type: "textarea",
                            span: 24,
                            minRows: 6,
                            hide: true
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
                    addBtn: this.vaildData(this.permission.menu_add, false),
                    viewBtn: this.vaildData(this.permission.menu_view, false),
                    delBtn: this.vaildData(this.permission.menu_delete, false),
                    editBtn: this.vaildData(this.permission.menu_edit, false)
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
                    getMenu(this.form.id).then(res => {
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
