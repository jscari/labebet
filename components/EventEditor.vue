<template>
  <div class="column">

    <div v-if="step === 'select-type'">
      <div class="content">
        <div class="button is-primary add-question" v-on:click="add_QUESTION_AS_MULTIPLE_CHOICE"> Ajouter une question à choix multiple</div>
        <div class="button is-primary add-question" v-on:click="add_QUESTION_AS_NUMBER"> Ajouter une question sur un nombre</div>
      </div>
    </div>

    <div v-if="step === 'set-question'">
      <h3 class="subtitle">  <b>Intitulé de la question</b> </h3>
      <div class="control question">
        <input class="input" type="text" v-model="myEvent.questions[0].text" size="80" v-on:keyup="updateCanQuestionBeDone" />
      </div>
      <div class="button is-primary" v-if="canQuestionBeDone" v-on:click="finishQuestionsSetup">Valider</div>
    </div>
    <div v-if="step === 'set-choices'">
      <h3 class="subtitle">  <b>Lister les réponses possibles</b> </h3>
      <div class="columns" v-for="(choice, j) in myEvent.questions[0].choices" :key="'c'+0+':'+j">
        <input class="input column is-10" type="text" v-model="myEvent.questions[0].choices[j]" size="80" v-bind:id="'choice' + 0 + '-' + j" v-on:keyup.13="choiceEnter(0)"  v-on:keydown="updateCanChoicesBeDone"/>
        <div class="column is-2" style="cursor:pointer;" v-on:click="removeChoice(0, j)">X</div>
      </div>
      <div>
        <div class="add-choice tag is-info"  v-on:click="addChoice(0)">Ajouter une réponse</div>
        <div class="choices-done tag is-primary" v-if="canChoicesBeDone" v-on:click="finishChoicesSetup">Valider</div>
      </div>
    </div>

    <div v-if="step === 'select-date'">
      <h3 class="subtitle">
        <b>Date de clôture</b>
      </h3>
      <h3 class="subtitle">Choisir une date à partir de laquelle les joueurs ne peuvent plus participer. </h3>
      <div class="content">
        <EventTimeEditor v-if="event" :event="event" />
        <div class="finish tag is-info"  v-on:click="finish">Terminer</div>
      </div>
    </div>
    <div v-if="step === 'done'">
      <h3 class="subtitle">
        <b>Fini !</b>
      </h3>
      <div class="content">
        <a class="see-results tag is-info" href="/">Voir et participer</a>
        <a class="go-to-admin tag is-primary" href="/admin/events">Administrer votre tournoi</a>
      </div>
    </div>
  </div>
</template>
<script>
import EventTimeEditor from '~/components/EventTimeEditor.vue';
export default {
  components: { EventTimeEditor },
  data () {
    return {
      myEvent: Object.assign({}, this.event),
      canQuestionBeDone: false,
      canChoicesBeDone: false,
      questionDone: false,
      choicesDone: false,
      done: false,
      saveTimeout: null
    };
  },
  props: ['event'],
  computed: {
    step () {
      if (this.done) {
        return 'done';
      }
      if (this.myEvent.questions.length === 0) {
        return 'select-type';
      }
      if (this.myEvent.questions.length > 0 && !this.questionDone) {
        return 'set-question';
      }
      if (this.questionDone && !this.choicesDone && this.myEvent.questions[0].type === 'QUESTION_AS_MULTIPLE_CHOICE') {
        return 'set-choices';
      }
      if (this.questionDone && this.choicesDone && this.myEvent.questions[0].type === 'QUESTION_AS_MULTIPLE_CHOICE') {
        return 'select-date';
      }
      if (this.questionDone && this.myEvent.questions[0].type === 'QUESTION_AS_NUMBER') {
        return 'select-date';
      }
      return 'error';
    }
  },
  mounted () {
    this.updateCanQuestionBeDone();
  },
  methods: {
    add_QUESTION_AS_MULTIPLE_CHOICE () {
      var q = {
        type: 'QUESTION_AS_MULTIPLE_CHOICE',
        choices: []
      };
      this._addQuestion(q);
    },
    add_QUESTION_AS_NUMBER () {
      var q = {
        type: 'QUESTION_AS_NUMBER',
        choices: []
      };
      this._addQuestion(q);
    },
    _addQuestion (q) {
      this.myEvent.questions.push(q);
    },
    removeQuestion (i) {
      this.myEvent.questions.splice(i, 1);
    },
    addChoice (i) {
      this.myEvent.questions[i].choices.push('');
    },
    removeChoice (i, j) {
      this.myEvent.questions[i].choices.splice(j, 1);
      this.updateCanChoicesBeDone();
    },
    save () {
      this.$store.dispatch('saveCurrentEventQuestions', this.myEvent.questions);
    },
    // user typed 'Enter' in a choice input
    choiceEnter (i) {
      var choicesCount = this.myEvent.questions[i].choices.length;
      this.addChoice(i);
      setTimeout(function () {
        document.getElementById('choice' + i + '-' + choicesCount).focus();
      }, 300);
    },
    // check if the question is long enough
    updateCanQuestionBeDone () {
      var q = this.myEvent.questions[0];
      if (!q) return;
      // q.type === 'QUESTION_AS_NUMBER' && 
      if (q.text && q.text.length > 5) {
        this.canQuestionBeDone = true;
        this.updateCanChoicesBeDone();
      }
    },
    // check if we have enough choices
    updateCanChoicesBeDone () {
      if (!this.myEvent.questions[0]) return;
      var choices = JSON.parse(JSON.stringify(this.myEvent.questions[0])).choices; // without this parse choices is undefined...
      if (!choices) return;
      for (var c = 0; c < choices.length; c++) {
        if (choices[c].trim().length > 0) {
          this.canChoicesBeDone = true;
          return;
        }
      }
      this.canChoicesBeDone = false;
    },
    // clean question and go to the next step
    finishQuestionsSetup () {
      this.myEvent.questions[0].text = this.myEvent.questions[0].text.trim();
      this.queueChange();
      this.questionDone = true;
      if (this.myEvent.questions[0].type === 'QUESTION_AS_MULTIPLE_CHOICE' &&
        this.myEvent.questions[0].choices && this.myEvent.questions[0].choices.length === 0) {
        this.addChoice(0);
      }
    },
    // clean choices and go to the next step
    finishChoicesSetup () {
      var choices = JSON.parse(JSON.stringify(this.myEvent.questions[0])).choices; // without this parse choices is undefined... 
      for (var i = 0; i < choices.length; i++) {
        choices[i] = choices[i].trim();
        if (!choices[i]) { choices.splice(i, 1); i--; }
      }
      this.myEvent.questions[0].choices = choices;
      this.choicesDone = true;
      this.queueChange();
    },
    // finish setup
    finish () {
      this.done = true;
      this.queueChange();
    },
    // ask for an auto save, but we wait some ms before saving in case another change is made
    queueChange () {
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }
      this.saveTimeout = setTimeout(this.save.bind(this), 300);
    }
  },
  watch: {}
};
</script>
<style>
.question {
  margin-bottom: 50px
}
.button.add-question {
  display: block;
  line-height: 150px;
  margin-bottom: 5px;
  height: 150px;
  max-width: 400px;
  font-size: 21px;
}
.tag.add-choice, .tag.choices-done {
  cursor:pointer;
  user-select: none;
  display: inline-block;
  vertical-align: top;
  height: 45px;
  line-height: 45px;
  font-size: 20px;
}
.tag.choices-done {
  margin-left: 10px;
}
.tag.finish {
  cursor:pointer;
  user-select: none;
  text-decoration: none;
  margin-top: 50px;
  height: 35px;
  line-height: 35px;
  font-size: 18px;
}
a.tag.see-results, a.tag.go-to-admin {
  cursor:pointer;
  user-select: none;
  text-decoration: none;
  margin-top: 50px;
  height: 35px;
  line-height: 35px;
  font-size: 18px;
  margin-right: 10px; 
}
a.tag:hover {
  text-decoration: none !important;
}
</style>
