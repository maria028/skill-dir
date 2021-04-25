<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom:1%;">
        <el-form v-model="query" label-width="30%">
            <el-row>
                <el-col :span=6 class="col">
                    <el-form-item label="角色名称">
                        <el-input clearable placeholder="角色名称" v-model="query.roleName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="角色别名">
                        <el-input clearable placeholder="角色别名" v-model="query.roleAlias"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=2 :offset=10 class="col">
                    <el-form-item>
                        <el-button type="success" icon="el-icon-search" size="small" style="background-color: #4cb678;" @click="onLoad">查询</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        </el-card>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
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
                   v-if="permission.role_delete"
                   @click="handleDelete">删 除
        </el-button>
        <el-button  type="success"
                    size="small"
                   icon="el-icon-delete"
                   @click="handleRole">权限设置
        </el-button>
      </template>
    </avue-crud>
    <el-dialog title="角色配置"
               :visible.sync="box"
               width="20%">
      <el-tree :data="list"
               show-checkbox
               node-key="id"
               ref="tree"
               check-strictly="true"
               :default-checked-keys="defaultObj"
               :props="props">
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="box = false">取 消</el-button>
        <el-button type="primary"
                   @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</div>
</template>

<script>
    import {add, getList, getRole, getRoleTree, grant, grantTree, remove, update} from "@/api/system/role";
    import {mapGetters} from "vuex";
    import website from '@/config/website';
    import {baseUrl} from '@/config/env';
    import {getDictionary} from "../../api/system/dict";

    export default {
        data() {
            return {
                form: {},
                box: false,
                props: {
                    label: "title",
                    value: "key"
                },
                list: [],
                defaultObj: [],
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
                    align: "center",
                    indexLabel: "序号",
                    selection: true,
                    viewBtn: true,
                    stripe: true,
                    dialogWidth: 300,
                    dialogHeight: 400,
                    column: [
                        {
                            label: "角色名称",
                            prop: "roleName",
                            // search: true,
                            span: 24,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入角色名称",
                                    trigger: "blur"
                                }
                            ]
                        },{
                            label: "角色类型",
                            prop: "roleType",
                            type: "tree",
                            dicUrl: baseUrl + "/system/dict/dictionary?code=role_type",
                            props: {
                                label: "dictValue",
                                value: "dictKey"
                            },
                            span: 24,
                            rules: [
                                {
                                    required: true,
                                    message: "请选择角色类型",
                                    trigger: "click"
                                }
                            ]
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

                            rules: [{
                                required: true,
                                message: "请输入所属租户",
                                trigger: "click"
                            }]
                        },
                        {
                            label: "角色别名",
                            prop: "roleAlias",
                            // search: true,
                            span: 24,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入角色别名",
                                    trigger: "blur"
                                }
                            ]
                        },
                        {
                            label: "上级角色",
                            prop: "parentId",
                            dicData: [],
                            type: "tree",
                            hide: true,
                            span: 24,
                            props: {
                                label: "title"
                            },
                            rules: [
                                {
                                    required: false,
                                    message: "请选择上级角色",
                                    trigger: "click"
                                }
                            ]
                        },
                        {
                            label: "角色排序",
                            prop: "sort",
                            type: "number",
                            span: 24,
                            rules: [
                                {
                                    required: true,
                                    message: "请输入角色排序",
                                    trigger: "blur"
                                }
                            ]
                        }
                    ]
                },
                data: []
            };
        },
        computed: {
            ...mapGetters(["permission","tenantId"]),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permission.role_add, false),
                    viewBtn: this.vaildData(this.permission.role_view, false),
                    delBtn: this.vaildData(this.permission.role_delete, false),
                    editBtn: this.vaildData(this.permission.role_edit, false)
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
            submit() {
                const menuLIst = this.$refs.tree.getCheckedKeys().join(",");
                grant(this.ids, menuLIst).then(() => {
                    this.box = false;
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                    this.onLoad(this.page);
                });
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
                });
            },
            rowUpdate(row, index, loading, done) {
                if(row.$parentId == row.roleName){
                    loading();
                    this.$message.warning("上级角色不能选择自己");
                    return
                }
                update(row).then(() => {
                    this.onLoad(this.page);
                    loading();
                    this.$message({
                        type: "success",
                        message: "操作成功!"
                    });
                }, error => {
                    done();
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
            handleRole() {
                if (this.selectionList.length !== 1) {
                    this.$message.warning("只能选择一条数据");
                    return;
                }
                this.defaultObj = [];
                grantTree()
                    .then(res => {
                        this.list = res.data.data;
                        return getRole(this.ids);
                    })
                    .then(res => {
                        this.defaultObj = res.data.data;
                        this.box = true;
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
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
            },
            onLoad(page, params = {}) {
                params.tenantId=this.tenantId;
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    this.data = res.data.data;
                    getRoleTree().then(res => {
                        const data = res.data.data;
                        const index = this.$refs.crud.findObject( this.option.column,"parentId");
                        index.dicData = data;
                    });
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
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
    @import "../../styles/style.scss"
</style>
