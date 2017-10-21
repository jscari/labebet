<template>
  <div class="question">
            <div class="response-container">
              <InputNumberQuestion v-if="question.type== 'QUESTION_AS_NUMBER'" :question="question" :chose="chose" ref="question" />
              <MultipleChoicesQuestion v-if="question.type == 'QUESTION_AS_MULTIPLE_CHOICE'" :question="question" :chose="chose" ref="question" />
            </div>
        </div>
</template>
<script>
import MultipleChoicesQuestion from './MultipleChoicesQuestion.vue';
import InputNumberQuestion from './InputNumberQuestion.vue';
export default {
  components: {
    MultipleChoicesQuestion, InputNumberQuestion
  },
  props: ['question', 'chose'],
  data () {
    return { textAnswer: '' };
  },
  methods: {
    cleanAnswer () {
      this.$refs.question.cleanAnswer();
    }
  },
  watch: {
    textAnswer: function (val, oldVal) {
      this.chose(val);
    }
  }
};
</script>
<style>
      .labequestion {
        width: 100%;
      }
      .question {
        background-color: #ffffff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
      }
      .choice-text {
        color: #ffffff;
        background-color: #4c94ff;
        padding: 10px 15px;
        font-size:18px;
        font-weight:bold;
        margin:0;
      }
      /** InputNumberQuestion */
      .response-number {
        font-size: 24px;
        width: 100%;
        height: 38px;
        text-align: right;
        padding: 20px 5px;
        border-style: solid;
        border-width: 0px 1px 1px 1px;
        border-color: #f5f5f5;
      }
      /** MultipleChoicesQuestion */
      .response-mcq {
        height: 38px;
        line-height: 38px;
        text-align: right;
        border-style: solid;
        border-width: 0px 1px 1px 1px;
        border-color: #f5f5f5;
        padding-right: 5px;
        cursor: pointer;
      }
      .response-mcq:hover {
        background: #d5d5d5;
      }
      .response-mcq.active {
        background: #c5c5c5;
      }
</style>
