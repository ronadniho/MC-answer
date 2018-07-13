<template>
  <div>
    <Header
      :title="title"
      :href="href"
    />
    <!--答题-->
    <div class="container answer" v-if="layerToggle">
      <!--页码-->
      <div class="action flex">
        <div class="tip">
          <span>{{page}}</span>
          <span>/{{totalPage}}</span>
        </div>
        <div class="action-btn flex flex-align-center">
          <a @click="answerCardToggle">
            <img src="../../assets/answer.png" alt="">
            <span>答题卡</span>
          </a>
          <a @click="signToggle" v-for="(item,index) in examlist" v-if="index+1==page">
            <img src="../../assets/sign.png" alt="">
            <span>{{item.sign?'已标记':'标记'}}</span>
          </a>
        </div>
      </div>
      <!--主内容-->
      <div class="content">
        <!--标题-->
        <div class="subject">
          <b>{{examName}}</b>
        </div>
        <!--答案-->
        <div class="result">
          <!--item-->
          <div class="result-item" v-for="(item,index) in examlist" :key="item.id">
            <div v-if="index+1==page">
              <!--题目-->
              <div class="title">
                {{item.examtitle}}
              </div>
              <!--item-->
              <div class="box-item single" v-if="item.examcategory==0||item.examcategory==2">

                <div class="box" v-for="child in item.answerList" :key="child.answerid">
                  <input type="radio"
                         :id="'radio'+child.answerid"
                         name="radio"
                         v-model="item.selectid"
                         :value="child.answerid"/>
                  <label :for="'radio'+child.answerid">{{child.answer}}</label>
                </div>

              </div><!--单选-->

              <div class="box-item multi" v-if="item.examcategory==1">

                <div class="box" v-for="child in item.answerList" :key="child.answerid">
                  <input type="checkbox"
                         :id="'checkbox'+child.answerid"
                         :value="child.answerid"
                         v-model="item.selectid"/>
                  <label :for="'checkbox'+child.answerid">{{child.answer}}</label>
                </div>
              </div><!--多选-->
            </div>
          </div>
        </div>

      </div>
      <!--控制器-->
      <div class="submit flex flex-justify-center">
        <div>
          <button :class="page>1?'':'no'" @click="prev">上一题</button>
        </div>
        <div v-if="page<totalPage">
          <button :class="page<totalPage?'':'no'" @click="next">下一题</button>
        </div>
        <div v-if="page==totalPage">
          <button @click="submit">交卷</button>
        </div>
      </div>
    </div>

    <!--答题卡-->
    <div class="container answerCard" v-if="!layerToggle">
      <div class="subject flex">
        <b>
          学习贯彻党的十九大精神专题班结业考试
        </b>
        <a @click="answerCardToggle">&times;</a>
      </div>
      <div class="guide">
        <dl class="clr">
          <dt>单选题</dt>

          <dd class="lt" v-for="(item,index) in examlist" v-if="item.examcategory==0">
            <span @click="guide" :data-index="index+1" :class="[item.selectid?'sel':'', item.sign?'sign':'']">{{index+1}}</span>
          </dd>
        </dl>
      </div>
      <div class="guide">
        <dl class="clr">
          <dt>多选题</dt>

          <dd class="lt" v-for="(item,index) in examlist" v-if="item.examcategory==1">
            <span @click="guide" :data-index="index+1" :class="[item.selectid.length?'sel':'', item.sign?'sign':'']">{{index+1}}</span>
          </dd>
        </dl>
      </div>
      <div class="guide">
        <dl class="clr">
          <dt>判断题</dt>

          <dd class="lt" v-for="(item,index) in examlist" v-if="item.examcategory==2">
            <span @click="guide" :data-index="index+1" :class="[item.selectid?'sel':'', item.sign?'sign':'']">{{index+1}}</span>
          </dd>
        </dl>
      </div>
      <div class="submit">
        <button @click="submit">交卷并查看结果</button>
      </div>
    </div>

    <!--loading-->
    <div class="modal" v-if="loading">
      <img src="../../assets/loading.gif" alt="">
    </div>

    <div class="modal" v-if="result" @click="resultToggle">
      <div>
        <h4>{{message}}</h4>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '../common/Header';
  import {_post} from '../../api/index'
  import {__BASE64} from '../../api/base64'

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
        title: '考试',
        href: '/',
        layerToggle: true,//true为默认答题状态
        totalPage: 0,//总页数
        page: 1,//当前页码
        classid: '',
        studentId: '',
        sessionId: '',
        examlist: [],//题目集合
        examName: '',//标题
        exampass: 0,//通过分数线
        loading: true,//加载动画
        result: false,//得分页状态
        message: '',
      }
    },
    created: function () {
      console.log(__BASE64)
      console.log(this.$route.query)
      this.classid = this.$route.query.classid;
      console.log(this.classid)
      if (this.classid) {
        var state = this.getSession(this.classid);
        console.log(state)
      }
      if (!state) {
        this.getClassExamlist50(this.$route.query.classid);
      }
      else {
        this.common(state);
      }
    },
    methods: {
      getClassExamlist50(classid) {
        /*_post({
          url: 'api/getClassExamlist50', data: {
            classid: classid,
          }
        }).then(res => {
            console.log(res)
            // this.ad(res.data);
            if (res.data.result) {
              console.log(res.data.examdetaillist)
              console.log(res.data.examlist)

              var examlist = res.data.examlist;
              var examdetaillist = res.data.examdetaillist;
              var tar;
              examlist.map(val => {
                val.page = this.page;//给缓存添加当前页
                val.answerList = [];//答案集合
                val.sign = false;//标记状态
                tar = val.id;//题目id
                val.isright = 0;
                val.examcategory == 1 && (val.selectid = []);//字符串转数组方便html模板渲染
                examdetaillist.map(vals => {
                  vals.examid == tar && val.answerList.push(vals)
                });


              });
              this.common(examlist);

              // this.examlist = examlist;
              // this.totalPage = examlist.length;
              // this.examName = examlist[0].answerList[0].category;
              //
              // this.loading = false;
              // this.setSession(this.examlist);


            }
          }
        ).catch(err => {
          alert(err)
        })*/

         _post({
           url: 'api/Login', data: {
             "clienttype": "wechatapp",
             "logname": "xieyan",
             "password": "YTExMTExMTEx",
             "inputyzmcode": ""
           }
         }).then(res => {
           console.log(res)
           console.log('sessionId:' + res.data.loginUser.sessionId)
           console.log('studentId:' + res.data.loginUser.studentId)
           this.sessionId = res.data.loginUser.sessionId;
           this.studentId = res.data.loginUser.studentId;


           _post({
             url: 'api/getClassExamlist50', data: {
               classid: classid,
             }
           }).then(res => {
               console.log(res)
               // this.ad(res.data);
               if (res.data.result) {
                 console.log(res.data.examdetaillist)
                 console.log(res.data.examlist)

                 var examlist = res.data.examlist;
                 var examdetaillist = res.data.examdetaillist;
                 var tar;
                 examlist.map(val => {
                   val.page = this.page;//给缓存添加当前页
                   val.answerList = [];//答案集合
                   val.sign = false;//标记状态
                   tar = val.id;//题目id
                   val.isright = 0;
                   val.examcategory == 1 && (val.selectid = []);//字符串转数组方便html模板渲染
                   examdetaillist.map(vals => {
                     vals.examid == tar && val.answerList.push(vals)
                   });


                 });
                 this.common(examlist);

                 // this.examlist = examlist;
                 // this.totalPage = examlist.length;
                 // this.examName = examlist[0].answerList[0].category;
                 //
                 // this.loading = false;
                 // this.setSession(this.examlist);


               }
             }
           ).catch(err => {
             alert(err)
           })
         }).catch(err => {
           alert(err)
         })

      },
      common(data) {
        this.examlist = data;
        this.totalPage = data.length;
        this.examName = data[0].answerList[0].category;

        this.loading = false;
        this.setSession(data);
        console.log(data)
      },
      guide(e) {
        console.log(e)
        console.log(e.path[0].dataset.index);
        this.layerToggle = !this.layerToggle;
        this.page = e.path[0].dataset.index;
      },
      submit() {
        console.log(this.examlist);
        this.loading = true;
        var answerLen;
        var temArr;
        /*处理数据结构*/
        this.examlist.map(val => {
          if (val.examcategory != 1 && val.selectid) {//是单选或判断  并且有值
            var selectid = val.selectid;
            var temVari = false;//临时变量
            val.answerList.map(vals => {
              if (vals.answerid == selectid) {
                vals.isselect = true;
                if (vals.isright) {
                  val.isright = 1;
                  temVari = true;
                }
              }
              else {
                !temVari && (val.isright = 0);
                vals.isselect = 0;
              }
            })
          }
          else if (val.examcategory == 1) {//是多选
            console.log('--------')
            console.log(val.answerList.length)
            answerLen = val.answerList.length;//答案len
            if (val.selectid.length) { //有值
              temArr = [];//临时变量
              for (var i = 0; i < answerLen; i++) {
                temArr.push(false)
              }
              console.log(temArr)
              for (var j = 0, answerList = val.answerList; j < answerList.length; j++) {
                for (var o = 0, selArr = val.selectid; o < selArr.length; o++) {
                  if (answerList[j].answerid == selArr[o]) {
                    answerList[j].isselect = true;
                    temArr[j] = true;
                    break;
                  }
                }
                if (o == selArr.length) {
                  answerList[j].isselect = 0;
                  temArr[j] = false;
                }
              }
              console.log(this.examlist)
              console.log(temArr)
              var state = true;
              for (var i = 0; i < answerList.length; i++) {
                if (answerList[i].isselect != answerList[i].isright) {
                  state = false;
                  break;
                }
              }
              val.isright = state ? true : false;
            }
            else {//没值
              val.answerList.map(vals => {
                vals.isselect = 0;

              });
            }
          }
        });
        console.log(this.examlist)


        console.log(this.classid);
        console.log(this.studentId);
        _post({
          url: 'api/CommonSQL',
          data: {
            key: ["getAppTopicClassProgress"],
            postData: {
              "classid": this.classid,
              "studentid": this.studentId
            }
          }
        }).then(res => {
          console.log(res);
          console.log(res.data[0].exampass)
          this.exampass = res.data[0].exampass;
          _post({
            url: 'api/SubmitStudenExam',
            data: {
              "classid": this.classid,
              "userid": this.studentId,
              "examlist": this.examlist,
              "exampass": this.exampass,
            }
          }).then(res => {
            console.log(res)
            console.log(res.data.message);
            this.message = res.data.message;
            localStorage.removeItem([this.classid]);
            this.loading = false;
            this.result = true;
            this.$router.push({path: 'answerResult', query: {'message': __BASE64.encoder(this.message)}})
          });
        });
      },

      setSession(val) {
        localStorage.setItem([this.classid], JSON.stringify(val));
      },
      getSession(classid) {
        return JSON.parse(localStorage.getItem([classid]));
      },

      answerCardToggle() {
        this.layerToggle = !this.layerToggle;
        this.setSession(this.examlist);
      },
      resultToggle() {
        this.result = !this.result;
        this.$router.push('/')
      },
      signToggle() {
        console.log(this.page)
        this.examlist[this.page - 1].sign = !this.examlist[this.page - 1].sign;
        this.setSession(this.examlist);
      },
      next() {
        if (this.page < this.totalPage) {
          this.page++;
          this.setSession(this.examlist);
        }
      },
      prev() {
        if (this.page > 1) {
          this.page--;
          this.setSession(this.examlist);
        }
      },
    }
  }

</script>

<style scoped lang="less">
  @import '../../variable';

  .container {
    width: @max;
  }

  .answer {
    padding-bottom: 152px;
    .action {
      padding: 0 24px;
      box-sizing: border-box;
      border-bottom: 1px solid @answer-col-c9; /*no*/
      .tip {
        flex-grow: 1;
        .base(@answer-col-62, @answer-col-62);
        line-height: 88px;
        span {
          .base(@theme, @answer-font-32);
        }
        span + span {
          .base(@answer-col-62, @answer-font-24);
        }
      }
      .action-btn {
        flex-grow: 1;
        justify-content: flex-end;
        a {
          width: 138px;
          height: 58px;
          border: 1px solid @answer-col-c9; /*no*/
          border-radius: 3px; /*no*/
          padding-left: 22px;
          margin-left: 10px;
          img {
            width: 26px;
            height: 33px;
            vertical-align: middle;
          }
          span {
            padding-left: 10px;
            vertical-align: middle;
            line-height: 58px;
            .base(@answer-col-62, @answer-font-20);
          }
        }
      }
    }

    .content {
      padding: 0 24px;
      box-sizing: border-box;
      .subject {
        b {
          .base(@answer-col-62, @answer-font-32);
          line-height: 88px;
          width: 728px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .result {
        padding-top: 46px;
        box-sizing: border-box;
        .title {
          .base(@answer-col-62, @answer-font-28);
          line-height: 56px;
        }
        .single {
          .box {
            width: 100%;
            min-height: 69px;
            padding: 15px 0;
          }

          input {
            display: none;
          }

          label {
            width: 100%;
            height: 100%;
            display: inline-block;
            position: relative;
            line-height: 69px;
            .base(@answer-col-62, @answer-font-28);
            padding-left: 100px;
            box-sizing: border-box;
          }
          label:active {
            background: #EEEEEE;
          }
          label:after {
            content: ""; /*必须设置*/
            display: inline-block;
            width: 70px;
            height: 70px;
            border: 1px solid @answer-col-c9; /*no*/
            position: absolute;
            top: 0px;
            left: 15px;
            border-radius: 50%;
            box-sizing: border-box;
          }

          input:checked + label:after {
            /*background-color: @theme;*/
            background: url(../../assets/raido.png) no-repeat;
            background-size: cover;
          }
        }
        .multi {
          .box {
            width: 100%;
            min-height: 70px;
            padding: 15px 0;
          }
          input {
            display: none;
          }
          label {
            width: 100%;
            height: 100%;
            display: inline-block;
            line-height: 70px;
            position: relative;
            .base(@answer-col-62, @answer-font-28);
            padding-left: 100px;
            box-sizing: border-box;
          }
          label:active {
            background: #EEEEEE;
          }
          label:after {
            content: "";
            width: 71px;
            height: 70px;
            /*border: 1px solid @answer-col-c9; !*no*!*/
            display: inline-block;
            position: absolute;
            top: 0px;
            left: 15px;
            background: url(../../assets/no-multi.png) no-repeat;
            background-size: cover;
          }
          input:checked + label:after {
            content: "";
            /* color: @white;
             text-align: center;
             font-size: 60px;*/
            background: url(../../assets/multi.png) no-repeat;
            background-size: cover;
          }

        }
      }
    }

    .submit {
      position: fixed;
      bottom: 0;
      background-color: @white;
      width: @max;
      height: 152px;
      padding-top: 32px;
      box-sizing: border-box;
      text-align: center;
      div {
        flex-grow: 1;
        button {
          background-color: @theme;
          border-radius: 5px; /*no*/
          border: 0;
          width: 258px;
          line-height: 88px;
          .base(@white, @answer-font-30);
        }
        button.no {
          color: @answer-col-62;
          background-color: @white;
          border: 1px solid @answer-col-c9; /*no*/
        }
      }

    }
  }

  .answerCard {
    padding-bottom: 152px;
    .subject {
      padding: 0 27px;
      box-sizing: border-box;
      border-bottom: 1px solid @answer-col-c9; /*no*/
      b {
        .base(@answer-col-62, @answer-font-32);
        line-height: 88px;
        width: 728px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      a {
        display: inline-block;
        font-size: 50px;
        height: 50px;
        line-height: 88px;
      }
    }
    .guide {
      padding-top: 36px;
      dl {
        width: @max;
        dt {
          .base(@answer-col-62, @answer-font-28);
          padding: 0 24px;
          box-sizing: border-box;

        }
        dd {
          .base(@answer-col-62, @answer-font-28);
          width: 20%;
          height: 108px;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            display: block;
            border-radius: 50%;
            border: 4px solid @answer-col-c9; /*no*/
            .base(@answer-col-62, @answer-font-28);
            width: 68px;
            height: 68px;
            line-height: 68px;
            text-align: center;
          }
          span.sel {
            background-color: @theme;
            color: @white;
          }
          span.sign {
            border-color: #1F86FF
          }
        }
      }
    }
    .submit {
      position: fixed;
      bottom: 0;
      background-color: @white;
      width: @max;
      height: 152px;
      padding-top: 32px;
      box-sizing: border-box;
      text-align: center;
      button {
        background-color: @theme;
        border-radius: 5px; /*no*/
        border: 0;
        width: 500px;
        line-height: 88px;
        .base(@white, @answer-font-30);
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
    img {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300px;
      height: 300px;
      margin-left: -150px;
      margin-top: -150px;
    }
    div {
      width: 400px;
      height: 200px;
      background-color: @white;
      color: @theme;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -200px;
      margin-top: -100px;
    }
  }
</style>
