<template>
  <div class="amap-page-container">
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink"
         x="0px" y="0px" width="419px" height="484px" viewBox="0 0 419 484"
         enable-background="new 0 0 419 484" xml:space="preserve">
      <image id="image0" width="419" height="484" x="0" y="0" :href="mapImag"/>

      <!--@click="dumpster"-->
      <g style="cursor:pointer">
        <g v-show="1 == isShow" @click="dumpster(val)" v-for="(val,key) in circleList">
          <circle :cx="val.lineX" :cy="val.lineY" r="3" :fill="val.fill" stroke="#fff"></circle>
          <line v-show="isShowLine" x1="100" y1="100" :x2="lineX" :y2="lineY" style="stroke:#fff;stroke-width:3"></line>
          <line v-show="isShowLine" x1="100" y1="100" x2="-50" y2="10" style="stroke:#fff;stroke-width:3"></line>
          <line v-show="isShowLine" x1="100" y1="100" :x2="lineX" :y2="lineY" style="stroke:#dd9a31;stroke-width:1"></line>
          <line v-show="isShowLine" x1="100" y1="100" x2="-50" y2="10" style="stroke:#dd9a31;stroke-width:1"></line>
        </g>

        <g v-show="2 == isShow" @click="dumpster(val)" v-for="(val,key) in circleList">
          <image :href="val.imgSrc" :x="val.lineX" :y="val.lineY"></image>
          <line v-show="isShowLine" x1="100" y1="100" :x2="lineX" :y2="lineY" style="stroke:#fff;stroke-width:3"></line>
          <line v-show="isShowLine" x1="100" y1="100" x2="-50" y2="10" style="stroke:#fff;stroke-width:3"></line>
          <line v-show="isShowLine" x1="100" y1="100" :x2="lineX" :y2="lineY" style="stroke:#dd9a31;stroke-width:1"></line>
          <line v-show="isShowLine" x1="100" y1="100" x2="-50" y2="10" style="stroke:#dd9a31;stroke-width:1"></line>
        </g>
      </g>
</svg>

  </div>
</template>

<script>
    export default {
        name: 'Map',
        props: ['mapImag', 'lineX', 'lineY', 'circleList','isShowLine','isShow'],
        data() {
            return {
                siteX: '155',
                siteY: '255',
                X: '208',
                Y: '208',
                isShow: '1',
                isShowLine:true
            }
        },
        methods: {
            dumpster(val) {
                this.$emit("onChildByValue", val);
            }
        },
        created() {
        },
        beforeMount() {
        }
    }
</script>

<style scoped lang="scss">
  .amap-page-container {

    width: initial;
    height: initial;
    /*border: solid 2px #479ed5;*/
    position: relative;

    svg {
      width: 100%;
      height: 100%;
    }
  }
</style>
