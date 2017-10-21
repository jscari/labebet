<template>
<div>
   <EventEditor v-if="event" :event="event"/>
  </div>
</div>
</template>

<script>
import EventEditor from '~/components/EventEditor.vue';

import API from '~/utils/api.js';
export default {
  layout ({ params, query, error }) {
    return 'admin';
  },
  components: {
    EventEditor
  },
  data () {
    return { eventId: this.$route.params.id, event: null };
  },
  asyncData ({ params, error }) {
    return API.getEventQuestions(params.id)
      .then((res) => {
        return { event: res.data };
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Event not found' });
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
