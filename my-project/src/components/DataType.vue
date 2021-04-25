<template>
  <div>
    <h1>数据类型及其判断方式</h1>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
  },
  created() {
    this.typeofFunc();
  },
  methods: {
    typeofFunc() {
      console.log(typeof "123"); //  string
      console.log(typeof 1); //  number
      console.log(typeof true); //  boolean
      console.log(typeof Symbol("1")); // symbol
      // console.log(typeof 111n); //  bigint
      console.log(typeof undefined); // undefined
      console.log(typeof null); // object
      console.log(typeof { a: 1, b: 2 }); // object
      function c() {
        console.log("123");
      }
      console.log(typeof c); //  function
    }
  }
};
</script>

<style scoped></style>
