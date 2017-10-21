<template>
<div>
  <div class="content">
    <table v-if="hasEvents">
      <tr v-for="ev in events" class="event" v-bind:key="ev.id">
        <td >{{eventTitle(ev)}}</td>
        <td v-if="ev.closeAt !== null">{{eventCloseAt(ev)}}</td>
        <td v-if="ev.last_answer_at === null"><a v-bind:href="'/admin/events/create/' + ev.id">Modifier</a></td>
        <td v-if="ev.last_answer_at !== null" >{{eventLastAnswer(ev)}}</td>
        <td v-if="ev.last_answer_at === null"> </td>
        <td v-if="ev.last_answer_at !== null"><a v-bind:href="'/admin/events/correct-answers/' + ev.id">Donner les bonnes réponses</a></td>
        <td><a v-on:click.prevent="copy(ev.id)">Copier</a></td>
        <td><a v-on:click.prevent="remove(ev.id)">Supprimer</a></td>
      </tr>
    </table>
    <a class="button is-primary add-question" href="/admin/events/create/new" >Nouveau pari</a>
    
</div>
</div>
</template>

<script>

import moment from 'moment';

export default {
  layout ({ params, query, error }) {
    return 'admin';
  },
  mounted () {
    const host = window.location.host;
    const parts = host.split('.');
    this.$store.dispatch('setTournamentSlug', parts[0]);
    this.$store.dispatch('getTournamentEvents');
  },
  computed: {
    hasEvents () {
      return this.$store.state.tournamentEvents && this.$store.state.tournamentEvents.length > 0;
    },
    events () {
      return this.$store.state.tournamentEvents;
    }
  },
  components: { },
  methods: {
    // compute an event title
    eventTitle (ev) {
      var e = ev;
      var firstQuestion = (e.questions && e.questions[0] && e.questions[0].text) || 'Non configuré pour l\'instant';
      var moreThanOneQ = e.questions && e.questions.length > 1;
      return firstQuestion + (moreThanOneQ ? ` (et ${e.questions.length - 1} autres questions)` : '');
    },
    // format last_answer_at
    eventLastAnswer (ev) {
      return 'Dernière réponse le ' + moment(ev.last_answer_at).format('DD/MM à h:mm');
    },
    // closing date
    eventCloseAt (ev) {
      return 'Termine le  ' + moment(ev.closeAt).format('DD/MM à h:mm');
    },
    // copy an event
    copy (eventId) {
      this.$store.dispatch('copyEvent', eventId);
    },
    // delete an event
    remove (eventId) {
      this.$store.dispatch('deleteEvent', eventId);
    }
  }
};
</script>

<style>

</style>
