<template>
  <header>
    <div>
      <a @click="go"></a>
      <span>{{title}}</span>
    </div>
  </header>
</template>

<script>


  export default {
    name: 'Header',
    props: ['title','href'],
    data() {
      return {
      }
    },
    methods:{
      go(){
        console.log(this.href)
        this.$router.push(this.href)
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../variable';

  header {
    background-color: @theme;
    padding: 0 15px;
    box-sizing: border-box;
    div {
      .base(@white, @Header-font-28);
      height: 108px;
      line-height: 108px;
      a {
        display: inline-block;
        width: 26px;
        height: 42px;
        background: url(../../assets/back.png) no-repeat;
        background-size: cover;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        padding-left: 40px;
      }
    }
  }
</style>
