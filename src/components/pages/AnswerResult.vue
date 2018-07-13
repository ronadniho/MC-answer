<template>
  <div class="container">
    <Header
      :title="title"
      :href="href"
    />
    <div class="result">
      <div class="result-top"></div>
      <div class="result-content">
        <div class="result-score">
          <h1>92<!--{{message}}--><span>分</span></h1>
          <div class="tips">
            <em></em>
            <span>得分</span>
            <em></em>
          </div>
          <!--<img src="../../assets/pass-x.png" alt="">-->
          <img class="no" src="../../assets/no-x.png" alt="">
        </div>
        <div class="result-img">
          <!--<img src="../../assets/pass-lg.png" alt="">-->
          <img src="../../assets/no-lg.png" alt="">
        </div>
        <div class="result-description">
          <!--<p>恭喜你，通过测试!</p>-->
          <p class="no">请再接再厉呀!</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import Header from '../common/Header';
  import {_post} from '../../api/index'
  import {__BASE64} from "../../api/base64";

  export default {
    name: 'Answer',
    components: {
      Header,
    },
    props: [
      'id',
      'mode'
    ],
    data() {
      return {
        title: '考试结果',
        message: '',
        href: '/',
      }
    },
    created: function () {
      console.log(this.$route.query)
      console.log(this.$route.query.message)
      this.message = __BASE64.adecode(this.$route.query.message);
    },
    methods: {}
  }
</script>

<style scoped lang="less">
  @import '../../variable';

  .container{
    height: @max;
    background-color:#f6f6f6;
  }
  .result {
    position: relative;
    .result-top {
      background: url(../../assets/result-top.png) no-repeat;
      background-size: cover;
      width: @max;
      height: 400px;
    }
    .result-content {
      padding: 59px;
      box-sizing: border-box;
      width: 660px;
      height: 870px;
      position: absolute;
      top: 36%;
      left: 50%;
      margin-left: -330px;
      background-color: @white;
      border-radius: 5px;
      .result-score{
        color:#ffa800;
        position: relative;
        h1{
          font-size:120px;
          text-align: center;
          line-height: 220px;
          span{
            font-size:24px;
          }
        }
        .tips{
          font-size:28px;
          color:#757575;
          text-align: center;
          em{
            border-bottom:1px solid #dbdbdb;/*no*/
            display: inline-block;
            width: 117px;
            vertical-align: middle;
          }
        }
        img{
          position: absolute;
          top: 0;
          right: -50px;
          width: 171px;
          height: 149px;
        }
        img.no{
          width: 153px;
          height: 153px;
        }
      }
      .result-img{
        padding-top: 62px;
        img{
          width: 528px;
          height: 182px;
        }

      }
      .result-description{
        padding-top: 119px;
        p{
          text-align: center;
          color:@theme;
          font-size: 34px;
        }
      }
    }
  }

</style>
