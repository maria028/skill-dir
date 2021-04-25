<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-form v-model="query" label-width="30%">
            <el-row>
                <el-col :span=6 class="col">
                    <el-form-item label="通知标题">
                        <el-input v-model="query.title" clearable placeholder="通知标题"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="通知类型">
                        <el-select v-model="query.category" clearable placeholder="通知类型">
                            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
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
               :page="page"
               @row-del="rowDel"
               v-model="form"
               :permission="permissionList"
               @row-update="rowUpdate"
               @row-save="rowSave"
               :before-open="beforeOpen"
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
                   v-if="permission.notice_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
      <template slot-scope="{row}"
                slot="category">
        <el-tag>{{row.categoryName}}</el-tag>
      </template>
    </avue-crud>
  </basic-container>
</div>
</template>

<script>
    import {add, getList, getNotice, remove, update, select} from "@/api/dept/notice";
    import {mapGetters} from "vuex";
    import {baseUrl} from '@/config/env';

    export default {
        data() {
            return {
                form: {},
                query: {},
                typeOptions: [],
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                selectionList: [],
                option: {
                    searchMenuSpan:true,
                    tip: false,
                    border: true,
                    index: true,
                    indexLabel: "序号",
                    align: "center",
                    viewBtn: true,
                    columnBtn: false,
                    refreshBtn:false,
                    selection: true,
                    column: [
                        {
                            label: "通知标题",
                            prop: "title",
                            row: true,
                            // search: true,
                            rules: [{
                                required: true,
                                message: "请输入通知标题",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "通知类型",
                            type: "select",
                            row: true,
                            dicUrl: baseUrl + "/system/dict/dictionary?code=notice",
                            props: {
                                label: "dictValue",
                                value: "dictKey"
                            },
                            slot: true,
                            prop: "category",
                            // search: true,
                            rules: [{
                                required: true,
                                message: "请输入通知类型",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "通知日期",
                            prop: "releaseTime",
                            type: "date",
                            format: "yyyy-MM-dd hh:mm:ss",
                            valueFormat: "yyyy-MM-dd hh:mm:ss",
                            rules: [{
                                required: true,
                                message: "请输入通知日期",
                                trigger: "blur"
                            }]
                        },
                        {
                            label: "通知内容",
                            prop: "content",
                            span: 24,
                            minRows: 6,
                            type: "textarea"
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
                    addBtn: this.vaildData(this.permission.notice_add, false),
                    viewBtn: this.vaildData(this.permission.notice_view, false),
                    delBtn: this.vaildData(this.permission.notice_delete, false),
                    editBtn: this.vaildData(this.permission.notice_edit, false)
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
        created(){
            this.typeSelect()
        },
        methods: {
            typeSelect(){
                select().then(resp => {
                    resp.data.data.forEach(v => {
                        this.typeOptions.push({value: v.dictKey, label: v.dictValue})
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
                    getNotice(this.form.id).then(res => {
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
