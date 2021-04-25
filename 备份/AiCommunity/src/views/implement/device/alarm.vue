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
        name: "alarm",
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
                        alarmTime: '2019-12-04 16:11',
                        alarmInfo: '正常',
                        deviceNo: '3001'

                    }, {
                        mallNo: '300001',
                        alarmTime: '2019-12-04 16:11',
                        alarmInfo: '正常',
                        deviceNo: '3001'

                    }, {
                        mallNo: '300001',
                        alarmTime: '2019-12-04 16:11',
                        alarmInfo: '正常',
                        deviceNo: '3001'

                    }, {
                        mallNo: '300001',
                        alarmTime: '2019-12-04 16:11',
                        alarmInfo: '正常',
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
                            label: "告警时间",
                            prop: "alarmTime",
                            type: 'date',
                            search: true,
                        }, {
                            label: "告警说明",
                            prop: "alarmInfo"
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
