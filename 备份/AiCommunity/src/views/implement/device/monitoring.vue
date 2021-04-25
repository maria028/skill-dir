<template>
  <basic-container>
    <avue-crud :option="option"
               :data="data"
               ref="crud"
               v-model="form"
               :page="page"
               @selection-change="selectionChange"
    >
    </avue-crud>
  </basic-container>
</template>

<script>

    export default {
        name: "monitoring",
        data() {
            return {
                form: {},
                query: {},
                selectionList: [],
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                data: [
                    {
                        mallNo: '300001',
                        statusInfo: '中国人工智能小镇',
                        deviceStatus: '正常',
                        deviceNo: '3001'

                    }, {
                        mallNo: '300001',
                        statusInfo: '中国人工智能小镇',
                        deviceStatus: '正常',
                        deviceNo: '3001'

                    }, {
                        mallNo: '300001',
                        statusInfo: '中国人工智能小镇',
                        deviceStatus: '正常',
                        deviceNo: '3001'

                    }, {
                        mallNo: '300001',
                        statusInfo: '中国人工智能小镇',
                        deviceStatus: '正常',
                        deviceNo: '3001'

                    }
                ],
                option: {
                    searchMenuSpan:true,
                    tip: false,
                    border: true,
                    index: true,
                    indexLabel: '序号',
                    selection: false,
                    viewBtn: true,
                    addBtn: false,
                    menu: false,
                    page: true,
                    stripe: true,
                    column: [
                        {
                            label: "网点编号",
                            prop: "mallNo",
                            search: true
                        }, {
                            label: '设备编号',
                            prop: 'deviceNo',
                            search: true
                        }, {
                            label: "设备状态",
                            prop: "deviceStatus",
                            search: true,
                        }, {
                            label: "设备状态说明",
                            prop: "statusInfo"
                        },
                    ]
                }

            }
        },
        methods: {
            selectionChange(list) {
                this.selectionList = list;
            }
        }
    }
</script>

<style scoped>

</style>
