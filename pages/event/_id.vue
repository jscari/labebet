<template>
<div>
    <div v-if="show == 'all'" class="labebet">
      <BettingEvent v-for="(question, index) in questions" :key="index" :question="question" :chose="chose.bind(this, index)"></BettingEvent>
      <div class="submit-container">
        <a class="submit-vote push_button push_button_green" v-on:click="hasVoted()">Vote</a>
      </div>
    </div>
  <div v-if="show == 'one'" class="labebet">
      <BettingEvent :question="this.questions[this.questionNumber]" :chose="chose.bind(this, this.questionNumber)" ref="question"></BettingEvent>
      <div class="submit-container">
        <a class="submit-vote push_button push_button_green" v-on:click="hasVoted()">Vote</a>
      </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import BettingEvent from '~/components/BettingEvent.vue';

export default {
  layout ({ params, query, error }) {
    // if (!query['player']) { return 'must-login'; }
    return query['embed'] ? 'bet-on-event-as-widget' : 'bet-on-event-as-standalone';
  },
  components: {
    BettingEvent
  },
  data () {
    return { userId: this.$route.query.player, questionNumber: 0, step: 'vote', show: this.$route.query['show'] === 'one' ? 'one' : 'all', answers: [] };
  },
  asyncData ({ req, params, error }) {
    const host = req.headers.host;
    const parts = host.split('.');
    const apiURL = `${process.env.API_URL}/${parts[0]}/event/data/${params.id}`;
    console.log(apiURL);
    return axios.get(apiURL)
      .then((res) => {
        return { eventNumber: res.data.eventNumber, questions: res.data.questions };
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Event not found' });
      });
  },
  mounted () {
    const host = window.location.host;
    const parts = host.split('.');
    this.$store.dispatch('setTournamentSlug', parts[0]);
    this.$store.dispatch('bet/setCurrentEventNumber', this.eventNumber);
    this.$store.dispatch('bet/setCurrentPlayerName', this.$route.query.player);
    this.$store.dispatch('bet/setCurrentPlayerCheck', this.$route.query.check);
  },
  methods: {
    // send vote and display thanks
    sendAnswers () {
      console.log(JSON.parse(JSON.stringify(this.$store.state.bet)));
      let url = `/a/${this.$store.state.bet.eventNumber}`;
      if (this.$route.query['embed']) {
        url += `?embed=${this.$route.query['embed']}`;
      }
      url += `#${encodeURIComponent(this.answers[0])}`;
      window.open(url, '_self');
    },
    // user has voted
    hasVoted (val) {
      if (this.show === 'one') {
        if (this.answers[this.questionNumber] === null || this.answers[this.questionNumber] === '' || typeof this.answers[this.questionNumber] === 'undefined') {
          return;
        }
        this.questionNumber++;
        if (this.questionNumber === this.questions.length) {
          this.sendAnswers();
          return;
        }
        this.$refs.question.cleanAnswer();
        return;
      }
      if (this.show === 'all') {
        for (var a = 0; a < this.questions.length; a++) {
          if (this.answers[a] === null || this.answers[a] === '' || typeof this.answers[a] === 'undefined') {
            return;
          }
        }
        this.sendAnswers();
      }
    },
    // user chosing an answer
    chose (answerNumber, answerValue) {
      this.answers[answerNumber] = answerValue;
    }
  }
};
</script>

<style>
.submit-container {
  margin-top: 7px;
  position: relative;
}

.push_button_green {
    color: white;
    background-color: #1aa;
    box-shadow: 0 0 1px 1px rgba(255,255,255,0.8), 0 1px 0 0 rgba(0,0,0,0.298039);
    margin-right: 5px;
}
.push_button_green:hover {
    background-color: #116b79;
}
.push_button {
  float:right;
}

.push_button {
    display: inline-block;
    position: relative;
    padding: .615384615em 1em;
    vertical-align: middle;
    min-height: 2.461538462em;
    min-width: 10em;
    box-sizing: border-box;
    font-weight: 400;
    font-family: inherit;
    line-height: 1;
    text-align: center;
    text-decoration: none;
    border-radius: 2px;
    border: 1px solid transparent;
    cursor: pointer;
    outline: 0;
    touch-action: manipulation;
    transition: all .1s ease-in;
}



</style>
