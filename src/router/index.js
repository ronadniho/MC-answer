import Vue from 'vue'
import Router from 'vue-router'
import AnswerList from '@/components/pages/AnswerList'
import AnswerResult from '@/components/pages/AnswerResult'
import Answer from '@/components/pages/Answer'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AnswerList',
      component: AnswerList
    },
    {
      path: '/answer',
      name: 'Answer',
      component: Answer,
      props: true
    },
    {
      path: '/answerResult',
      name: 'AnswerResult',
      component: AnswerResult,
      props: true
    },
    {
      path:'*',
      redirect:'/'
    }
  ]
})
