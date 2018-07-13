<template>
  <div>
    <Header
      :title="title"
      :href="href"
    />
    <!--考试列表-->
    <div class="container">

      <div class="no-complete" v-if="notTest.length">
        <div class="title">未完成</div>
        <!--列表组件-->
        <ul>
          <li class="flex" v-for="item in notTest">
            <div class="lf">
              <span>{{item.classname}}</span>
              <div class="progress">已看完{{item.progress}}%</div>
              <div class="tips">学习时长未满足不能进行考试</div>
            </div>
            <div class="rf flex flex-align-center flex-justify-center">
              <button @click="routeLink" :data-classid="item.classid" v-if="item.progress<=90">考试</button>
              <button @click="routeLink" v-if="item.progress>90" :data-classid="item.classid" >{{item.examcount>0?'重考':'考试'}}</button>

            </div>
          </li>
        </ul>
      </div>


      <div class="complete" v-if="alreadyTest.length">
        <div class="title">已完成</div>
        <!--列表组件-->
        <ul>
          <li class="flex" v-for="item in alreadyTest">
            <div class="lf">
              <span>{{item.classname}}</span>
              <p>结业得分：{{item.maxexamscore}}</p>
            </div>
            <div class="rf flex flex-align-center flex-justify-center">
              <button class="back" :data-classid="item.classid" @click="routeLink">重考</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--modal-->
    <div class="modal" v-if="result">
      <div class="modal-diag">
        <div class="modal-bg">
          <p>你有一次考试没完成，是否继续?</p>
        </div>
        <div class="btn-group">
          <button @click="continuer">继续</button>
          <button @click="again">重新开始</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '../common/Header';
  import axios from 'axios';
  import {_post} from '../../api/index'

  export default {
    name: 'AnswerList',
    components: {
      Header,
    },
    data() {
      return {
        title: '网络学院',
        href: '',
        data: [],//页面渲染的数据
        notTest: [],//没有考试
        alreadyTest: [],//可以考试
        result: false,
        classid:'',
        userid:'',
      }
    },
    created: function () {
      console.log(this.$route.query)
      console.log(this.$route.query.userid)
      console.log(this.$route.query.sessionid)
      this.userid = this.$route.query.userid
      /*
      // axios.get(`/ts/api/Session`)
      axios.get(`/ts/DemoApi/oftenGoods.php`)
        .then(response=>{
          console.log(response)
        })*/

      _post({
        url: 'api/CommonSQL', data: {
          key: ["getIfFinishClassInfoUseWeicatApp"],
          postData: {
            // userid: this.userid,
            userid: '488c5c77-e642-4a88-8f51-171ede6bcd99'
          }
        }
      }).then(res => {
        console.log(res)
        if (res.status == '200') {
          var data = res.data;
          console.log(data)
          this.data = data;
          var notTest = [];
          var alreadyTest = [];
          data.map((val) => {
            val.progress = Math.ceil(((val.compulsorynumber + val.electivenumber) / (val.requiredpassmark + val.electivepassmark)) * 100);
            val.graduatestatus ? alreadyTest.push(val) : notTest.push(val);
          });
          this.notTest = notTest;
          this.alreadyTest = alreadyTest;
        }
      }).catch(err => {
        alert('网络错误' + error)
      })

      /* axios.post(`/ts/api/CommonSQL`,
         {
           key: ["getIfFinishClassInfoUseWeicatApp"],
           postData: {
             userid: '488c5c77-e642-4a88-8f51-171ede6bcd99'
           }
         })
         .then(response => {
           console.log(response)
           // this.oftenGoods = response.data;
         })
         .catch(error => {
           alert('网络错误' + error)
         })*/
    },
    methods: {
      getSession(classid) {
        return JSON.parse(localStorage.getItem([classid]));
      },
      routeLink(e) {
        console.log(e.path[0].dataset.classid)
        this.classid = e.path[0].dataset.classid;
        var state = this.getSession(e.path[0].dataset.classid)
        if (state) {
          this.result = !this.result;
        }
        else{
          this.continuer();
        }

      },
      continuer(){
        this.$router.push({path:'answer',query:{'classid': this.classid }})
      },
      again(){
        localStorage.removeItem([this.classid]);
        this.$router.push({path:'answer',query:{'classid': this.classid }})
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../variable';

  .container {
    .title {
      background-color: @answerList-title-bg-col;
      font-size: @answerList-font-24;
      color: @answerList-col-62;
      padding: 0 25px;
      box-sizing: border-box;
      line-height: 62px;
    }
    ul {
      li {
        border-bottom: 1px solid @answerList-col-dc; /*no*/
        div.lf {
          width: 590px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          padding: 17px 0 17px 25px;
          box-sizing: border-box;
          span {
            color: @answerList-col-62;
            font-size: @answerList-font-32;
            height: 88px;
            line-height: 48px;
          }
          p {
            font-size: @answerList-font-24;
            color: @theme;
            line-height: 32px;
          }
          .progress{
            color:@theme;

          }
          .tips{
            font-size:24px;
            line-height:41px;
            color:#a8a8a8;

          }
        }
        div.rf {
          flex-grow: 1;
          button {
            border-radius: 25px; /*no*/
            border: 0;
            color: @white;
            font-size: @answerList-font-24;
            background-color: @theme;
            height: 60px;
            line-height: 60px;
            padding: 0 37px;
            box-sizing: border-box;
          }
          button.back {
            color: @theme;
            background-color: @answerList-col-feecec;
          }
        }

      }
    }
  }

  .modal {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: @max;
    height: @max;
    background-color: rgba(0, 0, 0, .4);
    .modal-diag{
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -310px;
      margin-top: -309px;
      .modal-bg{
        width: 620px;
        height: 520px;
        background:url(../../assets/modal-bg.png) no-repeat;
        background-size:cover;
        position: relative;
        p{
          width: 520px;
          color:@theme;
          font-size:30px;
          position: absolute;
          bottom: 46px;
          left: 50%;
          margin-left: -260px;
          text-align: center;
        }
      }
      .btn-group{
        width: @max;
        height: 98px;
        display: table;
        content: '';
        clear: both;
        button{
          color:@white;
          font-size:30px;
          background-color:@theme;
          height: 98px;
          line-height: 98px;
          border: 0;
          width: @max/2;
          box-sizing: border-box;
          padding: 0;
          margin: 0;
          float:left;
        }
        button:last-child{
          background-color: #918181;
        }
      }
    }
  }
</style>
