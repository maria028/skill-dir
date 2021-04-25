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
        name: "faceManagement",
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
                        faceName: '张三',
                        faceImg: '/img/face_img.png',
                        faceTime: '2019-12-05 09:36',
                        faceFrom: 'APP',
                        mallName: '中国人工智能小镇',
                        faceId: '201912090509371222'

                    }, {
                        faceName: '张三',
                        faceImg: '/img/face_img.png',
                        faceTime: '2019-12-05 09:36',
                        faceFrom: 'APP',
                        mallName: '中国人工智能小镇',
                        faceId: '201912090509371222'

                    }, {
                        faceName: '张三',
                        faceImg: '/img/face_img.png',
                        faceTime: '2019-12-05 09:36',
                        faceFrom: 'APP',
                        mallName: '中国人工智能小镇',
                        faceId: '201912090509371222'
                    }, {
                        faceName: '张三',
                        faceImg: '/img/face_img.png',
                        faceTime: '2019-12-05 09:36',
                        faceFrom: 'APP',
                        mallName: '中国人工智能小镇',
                        faceId: '201912090509371222'

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
                            label: "人脸名称",
                            prop: "faceName",
                            search: true
                        }, {
                            label: '人脸照片',
                            prop: 'faceImg',
                            imgWidth: 50,
                            listType: 'picture-img',
                            type: 'upload'
                        }, {
                            label: "人脸采集渠道",
                            prop: "faceFrom"
                        }, {
                            label: "网点",
                            prop: "mallName",
                            search: true
                        },
                        {
                            label: "人脸ID",
                            prop: "faceId"
                        }, {
                            label: "采集时间",
                            prop: "faceTime",
                            search: true,
                            type: 'date'
                        }
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
