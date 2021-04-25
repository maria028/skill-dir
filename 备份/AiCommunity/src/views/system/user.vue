<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-card style="margin-bottom:1%;">
            <el-form v-model="query" label-width="30%">
                <el-row>
                    <el-col :span=6 class="col">
                        <el-form-item label="登录账号">
                            <el-input clearable placeholder="登录账号" v-model="query.loginName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=6 class="col">
                        <el-form-item label="用户昵称">
                            <el-input clearable placeholder="用户昵称" v-model="query.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span=2 :offset=10 class="col">
                        <el-form-item>
                            <el-button type="success" icon="el-icon-search" size="small"
                                style="background-color: #4cb678;float: right;margin-top: 7%;" @click="onLoad">查询
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <basic-container>
            <avue-crud :option="option" :data="data" ref="crud" v-model="form" :permission="permissionList"
                @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" :before-open="beforeOpen" :page="page"
                @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
                @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
                <template slot="menuLeft">
                    <el-button type="success" size="small" icon="el-icon-delete" v-if="permission.user_delete"
                        @click="handleDelete">{{$t('删 除')}}
                    </el-button>
                    <el-button type="success" size="small" v-if="permission.user_reset" icon="el-icon-refresh"
                        @click="handleReset">{{$t('密码重置')}}
                    </el-button>
                </template>
                <template slot-scope="{row}" slot="roleId">
                    <el-tag>{{row.roleName}}</el-tag>
                </template>
                <template slot-scope="{row}" slot="deptId">
                    <el-tag>{{row.deptName}}</el-tag>
                </template>
                <template slot="orgId" slot-scope="{row}">
                    <span>{{row.orgName}}</span>
                </template>
            </avue-crud>
        </basic-container>
    </div>
</template>

<script>
    import { add, getList, getUser, remove, resetPassword, update } from "@/api/system/user";
    import { getDeptTree } from "@/api/system/dept";
    import { getRoleTree } from "@/api/system/role";
    import { mapGetters } from "vuex";
    import website from '@/config/website';
    import { baseUrl } from '@/config/env';
    import { getRoleDetail, getRoleListByIds } from "../../api/system/role";
    import { getAreaByType } from "../../api/system/area";
    import { getMallTree } from "../../api/mall";
    import { getDeviceByTenant } from "../../api/system/device";
    import { getPermissionOrgData } from "../../api/system/user";
    import form from "../util/form";


    export default {
        data() {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('请输入密码')));
                } else {
                    callback();
                }
            };
            const validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error(this.$t('请再次输入密码')));
                } else if (value !== this.form.password) {
                    callback(new Error(this.$t('两次输入密码不一致!')));
                } else {
                    callback();
                }
            };
            return {
                form: {},
                selectionList: [],
                query: {},
                arr: [],
                isSuperAdmin: false,
                userRoleType: 0,
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                init: {
                    roleTree: [],
                    deptTree: [],
                },
                option: {},
                data: []
            };
        },
        watch: {
            'language'() {
                this.onLoad(this.page);
            },
            'form.tenantId'() {
                if (this.form.tenantId !== '') {
                    // getDeptTree(this.form.tenantId).then(res => {
                    //     const index = this.$refs.crud.findColumnIndex("deptId");
                    //     this.option.column[index].dicData = res.data.data;
                    // });
                    this.getRoleTreeData();

                }
            },
            'form.roleId'() {
                console.log("roleId==" + this.form.roleId + ">>>")
                if (this.form.roleId != '' && this.form.roleId != null) {
                    let roleIds = this.form.roleId;
                    getPermissionOrgData(roleIds).then(res => {
                        if (roleIds == 24 || roleIds == 34) {
                            let orgData = res.data.data;
                            const index = this.$refs.crud.findObject(this.option.column, "orgId");
                            index.dicData = orgData;
                        } else if (roleIds == 33 || roleIds == 35 || roleIds == 37) {
                            const index = this.$refs.crud.findObject(this.option.column, "orgId");
                            index.dicData = [];
                            this.getMall(res.data.data, index.dicData);
                        } else {
                            const index = this.$refs.crud.findObject(this.option.column, "orgId");
                            index.dicData = [];
                            this.getArea(res.data.data, index.dicData);
                        }
                    });

                }
            }
        },
        computed: {
            ...mapGetters(["permission", 'tenantId', 'userInfo', 'language']),
            permissionList() {
                return {
                    addBtn: this.vaildData(this.permission.user_add, false),
                    viewBtn: this.vaildData(this.permission.user_view, false),
                    delBtn: this.vaildData(this.permission.user_delete, false),
                    editBtn: this.vaildData(this.permission.user_edit, false)
                };
            },
            ids() {
                let ids = [];
                this.selectionList.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            },
        },
        methods: {
            getArea(arr, form) {
                if (arr.length != 0) {
                    arr.forEach(v => {
                        if (v.children) {
                            this.getArea(v.children, form)
                        } else {
                            form.push(v);
                        }
                    })
                }
            },
            getMall(arr, form) {
                if (arr.length != 0) {
                    arr.forEach(v => {
                        if (v.children) {
                            this.getMall(v.children, form)
                        } else if (v.orgId.length >= 17) {
                            form.push(v);
                        }
                    })
                }
            },
            rowSave(row, loading, done) {
                // row.deptId = row.deptId.join(",");
                // row.roleId = row.roleId.join(",");
                let orgIds = row.orgId;
                console.log(orgIds);
                let orgDescArray = "";
                let orgIdArray = new Array();
                orgIds.forEach(v => {
                    let orgId = v[v.length - 1];
                    orgIdArray.push(orgId);
                    orgDescArray = orgDescArray + v + "|";
                })
                console.log(orgIdArray);
                row.orgId = orgIdArray.toString();
                row.orgDesc = orgDescArray;
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
                debugger
                // row.deptId = row.deptId.join(",");
                // row.roleId = row.roleId.join(",");
                let orgIds = []
                orgIds.push(row.orgId);
                console.log(orgIds);
                let orgIdArray = new Array();
                let orgDescArray = "";
                orgIds.forEach(v => {
                    console.log(v);
                    if (Array.isArray(v)) {
                        let orgId = v[v.length - 1];
                        orgIdArray.push(orgId);
                        orgDescArray = orgDescArray + v + "|";
                    } else {
                        let orgObj = v.split(",");
                        let orgId = orgObj[orgObj.length - 1];
                        orgIdArray.push(orgId);
                        orgDescArray = orgDescArray + v + "|";
                    }

                })
                console.log(orgIdArray);
                console.log("orgDescArray===" + orgDescArray.substring(0, orgDescArray.length - 1));
                row.orgId = orgIdArray.toString();
                row.orgDesc = orgDescArray;
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
                console.log(list);
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
                }).then(() => {
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
            handleReset() {
                if (this.selectionList.length === 0) {
                    this.$message.warning("请选择至少一条数据");
                    return;
                }
                this.$confirm("确定将选择账号密码重置为123456?", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        return resetPassword(this.ids);
                    })
                    .then(() => {
                        this.$message({
                            type: "success",
                            message: "操作成功!"
                        });
                        this.$refs.crud.toggleSelection();
                    });
            },
            beforeOpen(done, type) {
                if (["edit", "view"].includes(type)) {
                    getUser(this.form.id).then(res => {
                        this.form = res.data.data;
                        // this.form.deptId = this.form.deptId.split(",");
                        // this.form.deptId.forEach((ele, index) => {
                        //     this.form.deptId[index] = Number(ele);
                        // });
                        console.log("this.form.roleId===" + this.form.roleId);
                        this.form.roleId = Number(this.form.roleId);
                        // this.form.roleId = this.form.roleId.split(",");
                        // this.form.roleId.forEach((ele, index) => {
                        //     this.form.roleId[index] = Number(ele);
                        // });

                        let roleIds = this.form.roleId;
                        getPermissionOrgData(roleIds).then(res => {
                            let orgData = res.data.data;
                            const index = this.$refs.crud.findObject(this.option.column, "orgId");
                            // index.dicData = orgData;

                        });

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
                let op = {
                    searchMenuSpan: true,
                    emptyText: this.$t('暂无数据'),
                    tip: false,
                    border: true,
                    index: true,
                    align: "center",
                    indexLabel: "序号",
                    selection: true,
                    stripe: true,
                    viewBtn: true,
                    refreshBtn: false,
                    columnBtn: false,
                    column: [
                        {
                            label: this.$t('登录账号'),
                            prop: "loginName",
                            // search: true,
                            labelWidth: 120,
                            width: 120,
                            rules: [{
                                required: true,
                                message: this.$t('请输入登录账号'),
                                trigger: "blur"
                            }],
                            span: website.tenantMode ? 12 : 24,
                        },
                        {
                            label: this.$t('所属租户'),
                            prop: "tenantId",
                            type: "tree",
                            labelWidth: 170,
                            width: 130,
                            hide: true,
                            dicUrl: baseUrl + "/system/tenant/select",
                            props: {
                                label: "tenantName",
                                value: "tenantId"
                            },
                            hide: !website.tenantMode,
                            addDisplay: false,
                            editDisplay: false,
                            viewDisplay: false,

                            rules: [{
                                message: "请输入所属租户",
                                trigger: "click"
                            }]
                        },
                        {
                            label: this.$t('密码'),
                            prop: 'password',
                            hide: true,
                            editDisplay: false,
                            viewDisplay: false,
                            rules: [{ required: true, validator: this.validatePass, trigger: 'blur' }]
                        },
                        {
                            label: this.$t('确认密码'),
                            prop: 'password2',
                            hide: true,
                            labelWidth: 140,
                            editDisplay: false,
                            viewDisplay: false,
                            rules: [{ required: true, validator: this.validatePass2, trigger: 'blur' }]
                        },
                        {
                            label: this.$t('用户昵称'),
                            prop: "name",
                            // search: true,
                            labelWidth: 120,
                            width: 120,
                            rules: [{
                                required: true,
                                message: this.$t("请输入用户昵称"),
                                trigger: "blur"
                            }]
                        },
                        {
                            label: this.$t('用户姓名'),
                            prop: "realName",
                            rules: [{
                                required: true,
                                message: this.$t("请输入用户姓名"),
                                trigger: "blur"
                            }]
                        },
                        {
                            label: this.$t('所属角色'),
                            prop: "roleId",
                            type: "tree",
                            dicData: [],
                            props: {
                                label: "title"
                            },
                            slot: true,
                            rules: [{
                                required: true,
                                message: this.$t("请选择所属角色"),
                                trigger: "click"
                            }]

                        }, {
                            label: this.$t('组织架构'),
                            prop: "orgId",
                            multiple: true,
                            type: "cascader",
                            dicData: [],
                            labelWidth: 140,
                            slot: true,
                            showAllLevels: false,
                            filterable: true,
                            props: {
                                label: "orgName",
                                value: "orgId",
                                multiple: true,

                            }, rules: [{
                                required: true,
                                message: this.$t("请选择组织架构"),
                                trigger: "click"
                            }]
                        },
                        {
                            label: this.$t('手机号码'),
                            prop: "phone",
                            overHidden: true,
                            hide: true,
                        },
                        {
                            label: this.$t('电子邮箱'),
                            prop: "email",
                            hide: true,
                            overHidden: true
                        },
                        {
                            label: this.$t('用户性别'),
                            prop: "sex",
                            type: "select",
                            dicData: [
                                {
                                    label: this.$t("男"),
                                    value: 1
                                },
                                {
                                    label: this.$t("女"),
                                    value: 2
                                },
                                // {
                                //     label: this.$t("未知"),
                                //     value: -1
                                // }
                            ],
                            hide: true
                        },
                        {
                            label: this.$t("用户生日"),
                            type: "date",
                            prop: "birthday",
                            format: "yyyy-MM-dd hh:mm:ss",
                            valueFormat: "yyyy-MM-dd hh:mm:ss",
                            hide: true
                        },
                        {
                            label: this.$t("账号状态"),
                            prop: "statusName",
                            hide: true,
                            display: false,
                            dicData: [{
                                label: this.$t("进"),
                                value: 1
                            }]
                        }
                    ]
                };
                this.option = op;
                this.form.tenantId = this.tenantId;
                console.log(this.userInfo);
                let authority = this.userInfo.authority
                if (authority == 'administrator') {
                    this.isSuperAdmin = true;
                } else {
                    this.isSuperAdmin = false;
                }
                params.tenantId = this.tenantId;
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.data = data.records;
                });
                // getDeptTree(this.form.tenantId).then(res => {
                //     console.log(res);
                //     const index = this.$refs.crud.findColumnIndex("deptId");
                //     this.option.column[index].dicData = res.data.data;
                // });
                this.getRoleTreeData();

            }, getRoleTreeData() {
                getRoleTree(this.form.tenantId).then(res => {
                    const index = this.$refs.crud.findObject(this.option.column, "roleId");
                    let roleData = res.data.data;
                    if (this.isSuperAdmin) {
                        index.dicData = roleData;
                    } else {
                        let role = this.userInfo.roleList[0];
                        let roleType = role.roleType;
                        this.userRoleType = roleType;
                        console.log("roleType==" + roleType);
                        let roleList = new Array();
                        roleData.forEach(v => {
                            let roleId = v.id;
                            let title = v.title;
                            v.title = this.$t(title);
                            getRoleDetail(roleId).then(res => {
                                let roleData = res.data.data;
                                let rTye = roleData.roleType;
                                if (rTye > roleType) {
                                    roleList.push(v)
                                }
                            });
                        });
                        index.dicData = roleList;

                    }

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
