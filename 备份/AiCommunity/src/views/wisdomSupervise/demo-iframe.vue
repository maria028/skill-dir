<template>
    <div>
        <div>
            <iframe src="/iframe.html" frameborder="0" v-on:load="iframeLoaded"></iframe>
            <iframe src="/iframe.html" frameborder="0" v-on:load="iframeLoaded"></iframe>
        </div>
        <div>
            <iframe src="/iframe.html" frameborder="0" v-on:load="iframeLoaded"></iframe>
            <iframe src="/iframe.html" frameborder="0" v-on:load="iframeLoaded"></iframe>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    export default {
        name: 'demoIframe',
        props: {},
        components: {},
        data() {
            return {
                iLoadedCount: 0,
            };
        },
        computed: {

        },
        methods: {
            getWebVideoCtrl(oIframe) {
                return oIframe.contentWindow.WebVideoCtrl;
            },
            iframeLoaded() {
                this.iLoadedCount++
                let that = this
                if (1 === this.iLoadedCount) {
                    var oLiveView = {
                        iProtocol: 1,            // protocol 1��http, 2:https
                        szIP: "192.168.10.3",    // protocol ip
                        szPort: "80",            // protocol port
                        szUsername: "admin",     // device username
                        szPassword: "12345678q", // device password
                        iStreamType: 2,          // stream 1��main stream  2��sub-stream  3��third stream  4��transcode stream
                        iChannelID: 1,           // channel no
                        bZeroChannel: false      // zero channel
                    };
                    var g_aIframe = $("iframe");
                    $.each(g_aIframe, function (i, oIframe) {
                        var oWebVideoCtrl = that.getWebVideoCtrl(oIframe);
                        // ��¼�豸
                        oWebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
                            success: function (xmlDoc) {
                                // ��ʼԤ��
                                var szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
                                setTimeout(function () {
                                    oWebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                                        iStreamType: oLiveView.iStreamType,
                                        iChannelID: oLiveView.iChannelID,
                                        bZeroChannel: oLiveView.bZeroChannel
                                    });
                                }, 1000);
                            }
                        });
                    });
                }
                if (2 === this.iLoadedCount) {
                    var oLiveView = {
                        iProtocol: 1,            // protocol 1��http, 2:https
                        szIP: "192.168.10.4",    // protocol ip
                        szPort: "80",            // protocol port
                        szUsername: "admin",     // device username
                        szPassword: "12345678q", // device password
                        iStreamType: 2,          // stream 1��main stream  2��sub-stream  3��third stream  4��transcode stream
                        iChannelID: 1,           // channel no
                        bZeroChannel: false      // zero channel
                    };
                    var g_aIframe = $("iframe");
                    $.each(g_aIframe, function (i, oIframe) {
                        var oWebVideoCtrl = that.getWebVideoCtrl(oIframe);
                        // ��¼�豸
                        oWebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
                            success: function (xmlDoc) {
                                // ��ʼԤ��
                                var szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
                                setTimeout(function () {
                                    oWebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                                        iStreamType: oLiveView.iStreamType,
                                        iChannelID: oLiveView.iChannelID,
                                        bZeroChannel: oLiveView.bZeroChannel
                                    });
                                }, 1000);
                            }
                        });
                    });
                }
                if (3 === this.iLoadedCount) {
                    var oLiveView = {
                        iProtocol: 1,            // protocol 1��http, 2:https
                        szIP: "192.168.10.8",    // protocol ip
                        szPort: "80",            // protocol port
                        szUsername: "admin",     // device username
                        szPassword: "12345678q", // device password
                        iStreamType: 2,          // stream 1��main stream  2��sub-stream  3��third stream  4��transcode stream
                        iChannelID: 1,           // channel no
                        bZeroChannel: false      // zero channel
                    };
                    var g_aIframe = $("iframe");
                    $.each(g_aIframe, function (i, oIframe) {
                        var oWebVideoCtrl = that.getWebVideoCtrl(oIframe);
                        // ��¼�豸
                        oWebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
                            success: function (xmlDoc) {
                                // ��ʼԤ��
                                var szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
                                setTimeout(function () {
                                    oWebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                                        iStreamType: oLiveView.iStreamType,
                                        iChannelID: oLiveView.iChannelID,
                                        bZeroChannel: oLiveView.bZeroChannel
                                    });
                                }, 1000);
                            }
                        });
                    });
                }
                if (4 === this.iLoadedCount) {
                    var oLiveView = {
                        iProtocol: 1,            // protocol 1��http, 2:https
                        szIP: "192.168.10.2",    // protocol ip
                        szPort: "80",            // protocol port
                        szUsername: "admin",     // device username
                        szPassword: "12345678q", // device password
                        iStreamType: 2,          // stream 1��main stream  2��sub-stream  3��third stream  4��transcode stream
                        iChannelID: 1,           // channel no
                        bZeroChannel: false      // zero channel
                    };
                    var g_aIframe = $("iframe");
                    $.each(g_aIframe, function (i, oIframe) {
                        var oWebVideoCtrl = that.getWebVideoCtrl(oIframe);
                        // ��¼�豸
                        oWebVideoCtrl.I_Login(oLiveView.szIP, oLiveView.iProtocol, oLiveView.szPort, oLiveView.szUsername, oLiveView.szPassword, {
                            success: function (xmlDoc) {
                                // ��ʼԤ��
                                var szDeviceIdentify = oLiveView.szIP + "_" + oLiveView.szPort;
                                setTimeout(function () {
                                    oWebVideoCtrl.I_StartRealPlay(oLiveView.szIP, {
                                        iStreamType: oLiveView.iStreamType,
                                        iChannelID: oLiveView.iChannelID,
                                        bZeroChannel: oLiveView.bZeroChannel
                                    });
                                }, 1000);
                            }
                        });
                    });
                }
            },
            loadJS(src) {
                const $script = window.document.createElement('script');
                $script.src = src;
                window.document.body.appendChild($script);
                return new Promise((resolve) => { $script.onload = resolve; });
            },
            async init() {
                await this.loadJS("@/views/jquery-1.7.1.min.js");
                await this.loadJS("@/views/codebase/webVideoCtrl.js");

                var g_aIframe = $("iframe");

                $(function () {
                    // ������Ƿ��Ѿ���װ��
                    var iRet = WebVideoCtrl.I_CheckPluginInstall();
                    if (-1 == iRet) {
                        alert("����δ��װ�������˫��������Ŀ¼���WebComponentsKit.exe��װ��");
                        return;
                    }

                    // �ر������
                    $(window).unload(function () {
                        $.each(g_aIframe, function (i, oIframe) {
                            this.getWebVideoCtrl(oIframe).I_Stop();
                        });
                    });
                });




            }
        },
        created() {

        },
        mounted() {
            this.init();
        },
        beforeDestroy() {

        },
        watch: {

        },
    };
</script>
<style lang="scss" scoped>
    iframe {
        margin: 0;
        padding: 0;
        border: 0;
        width: 500px;
        height: 300px;
    }
</style>
