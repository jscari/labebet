<template>
<div>
  <h1 class="title">Enregistrer les bonnes réponses</h1>
      <EventAnswersEditor v-if="!noAnswers" :answers="answers" :questions="questions"/>
      <div class="content" v-if="noAnswers">
        Vous devez avoir au moins un participant avant de pouvoir enregistrer les bonnes réponses
      </div>
  <br/>
  </div>
</div>
</template>

<script>
import EventAnswersEditor from '~/components/EventAnswersEditor.vue';

import API from '~/utils/api.js';
export default {
  layout ({ params, query, error }) {
    return 'admin';
  },
  components: {
    EventAnswersEditor
  },
  data () {
    return { eventId: this.$route.params.id, answers: null, noAnswers: false };
  },
  asyncData ({ params, error }) {
    return API.getEventAnswers(params.id)
      .then((res) => {
        console.log(res);
        if (!res.data.answers) {
          return { noAnswers: true };
        } else {
          return { answers: res.data.answers, questions: res.data.questions };
        }
      })
      .catch((e) => {
        return { noAnswers: true };
      });
  },
  mounted () {
    const host = window.location.host;
    const parts = host.split('.');
    this.$store.dispatch('setTournamentSlug', parts[0]);
    this.$store.dispatch('setCurrentEventId', this.$route.params.id);
    this.$store.dispatch('getTournamentEvents');
  },
  methods: { }
};
</script>

<style>

</style>
