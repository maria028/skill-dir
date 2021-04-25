<template>
    <div style="width: 98%;margin: 0 1%;">
        <el-form v-model="query" label-width="30%">
            <el-row>
                <el-col :span=6 class="col">
                    <el-form-item label="服务ID">
                        <el-input clearable placeholder="服务ID"></el-input>
                    </el-form-item> 
                </el-col>
                <el-col :span=6 class="col">
                    <el-form-item label="服务host">
                        <el-input clearable placeholder="服务host"></el-input>
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
               :before-open="beforeOpen"
               v-model="form"
               :permission="permissionList"
               :page="page"
               @search-change="searchChange"
               @search-reset="searchReset"
               @current-change="currentChange"
               @size-change="sizeChange"
               @on-load="onLoad">
    </avue-crud>
  </basic-container>
</div>
</template>

<script>
    import {getErrorList, getErrorLogs} from "@/api/logs";
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
                    viewBtn: true,
                    editBtn: false,
                    refreshBtn:false,
                    columnBtn:false,
                    header:false,
                    addBtn: false,
                    delBtn: false,
                    menuWidth: 120,
                    column: [
                        {
                            label: "服务id",
                            prop: "serviceId",
                            // search: true
                        },
                        {
                            label: "服务host",
                            prop: "serverHost",
                            // search: true
                        },
                        {
                            label: "服务ip",
                            prop: "serverIp"
                        },
                        {
                            label: "软件环境",
                            prop: "env"
                        },
                        {
                            label: "日志名",
                            prop: "title"
                        },
                        {
                            label: "请求方法",
                            prop: "method"
                        },
                        {
                            label: "请求接口",
                            prop: "requestUri"
                        },
                        {
                            label: "日志时间",
                            prop: "createTime"
                        },
                        {
                            label: "用户代理",
                            prop: "userAgent",
                            span: 24,
                            hide: true
                        },
                        {
                            label: "请求数据",
                            prop: "params",
                            type: "textarea",
                            span: 24,
                            minRows: 2,
                            hide: true
                        },
                        {
                            label: "日志数据",
                            prop: "stackTrace",
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
                    viewBtn: this.vaildData(this.permission.log_error_view, false)
                };
            }
        },
        methods: {
            searchReset() {
                this.query = {};
                this.onLoad(this.page);
            },
            searchChange(params) {
                this.query = params;
                this.onLoad(this.page, params);
            },
            beforeOpen(done, type) {
                if (["edit", "view"].includes(type)) {
                    getErrorLogs(this.form.strId).then(res => {
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
                getErrorList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
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
