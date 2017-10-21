<template>
<div>
  <div id="tournament-header">
    <span class="back" v-if="eventId !== null" v-on:click="eventId=null"> < </span>
    <span class="back" v-else></span>
    <span id="tournament-title" v-if="eventId === null"> {{this.$store.state.tournamentName}}</span>
    <span id="tournament-title" v-else >{{ eventTitle }}</span>
    <a id="topright-link" href="/admin/events">...</a>
  </div>
  <div id="topsubmenu" v-if="eventId === null">
      <span v-on:click="tab='events'" v-bind:class="{ active: tab === 'events' }">Paris</span>
      <span v-on:click="tab='ranking'" v-bind:class="{ active: tab === 'ranking' }">Classement</span>
  </div>
  <div id="events" v-bind:class="eventsColumnCss">
    <div v-if="hasEvents">
      <a v-for="ev in events" class="event-link" v-bind:key="ev.id" v-on:click="choseEvent(ev)" >{{formatEventTitle(ev)}}</a>
    </div>
  </div>
  <div id="event" v-if="eventId !== null && tab === 'events'">
    <iframe v-bind:src="'/event/' + eventId + '?embed=1'" />
  </div>
  <div id ="ranking-title" v-bind:class="rankingColumnCss" v-if="this.$store.state.ranking && eventId === null">Classement</div>
  <div id="ranking"  v-bind:class="rankingColumnCss" v-if="this.$store.state.ranking && eventId === null">
    <div v-for="player in this.$store.state.ranking" class="player-ranking"  v-bind:key="'p'+player.name">
      <span class="player-name">{{player.name}}</span>
      <span class="player-points">{{player.points}}</span>
    </div>
  </div>
</div>
</template>

<script>

export default {
  layout ({ params, query, error }) {
    return 'home';
  },
  mounted () {
    const host = window.location.host;
    const parts = host.split('.');
    this.$store.dispatch('setTournamentSlug', parts[0]);
    this.$store.dispatch('getTournamentEvents');
    this.$store.dispatch('getTournamentRanking');
  },
  data () {
    return { eventId: null, tab: 'events' };
  },
  computed: {
    hasEvents () {
      return this.$store.state.tournamentEvents && this.$store.state.tournamentEvents.length > 0;
    },
    events () {
      return this.$store.state.tournamentEvents;
    },
    eventsColumnCss () {
      return {
        hideOnMobile: this.tab !== 'events' || this.eventId !== null
      };
    },
    rankingColumnCss () {
      return {
        hideOnMobile: this.tab !== 'ranking'
      };
    }
  },
  components: { },
  methods: {
    // compute an event title
    formatEventTitle (ev) {
      var e = ev;
      console.log(e);
      var firstQuestion = (e.questions && e.questions[0] && e.questions[0].text) || 'Non configuré pour l\'instant';
      var moreThanOneQ = e.questions && e.questions.length > 1;
      return firstQuestion + (moreThanOneQ ? ` (et ${e.questions.length - 1} autres questions)` : '');
    },
    // click on an event
    choseEvent (ev) {
      this.eventId = ev.id;
      this.eventTitle = this.formatEventTitle(ev);
    }
  }
};
</script>

<style>
#tournament-header {
    line-height: 80px;
    font-size: 18px;
    font-weight: bolder;
    color: white;
    position: relative;
    background-color: #27736f;
    background-image: linear-gradient(180deg,rgba(0,0,0,.3),rgba(0,0,0,.3)),linear-gradient(90deg,#27736f 0,#2f847e 10%,#389790 20%,#42a99e 50%,#259791 80%,#198686 90%,#116b79);
}
#topright-link {
  color: white;
  text-decoration: none;
    position: absolute;
    right: 0;
    vertical-align: middle;
    font-weight: 700;
    padding-right: 10px;
    font-size: 38px;
    line-height: 60px;
}
.back {
  cursor: pointer;
  display: inline-block;
  font-size: 30px;
  width: 80px;
  text-align: center;
}
#tournament-title {
  display: inline-block;
    padding-left: 0px;
}
#topsubmenu {

  box-shadow: 0 4px 2px -2px gray;
  background-color: #27736f;
  background-image: linear-gradient(180deg,rgba(0,0,0,.3),rgba(0,0,0,.3)),linear-gradient(90deg,#27736f 0,#2f847e 10%,#389790 20%,#42a99e 50%,#259791 80%,#198686 90%,#116b79);

}
#topsubmenu span {
  cursor: pointer;
  display: inline-block;
  width: 50%;
  text-align: center;
  font-size: 20px;
  line-height: 40px;
  color: #eee;
}
#topsubmenu span.active {
  color: white;
  border-bottom: 3px solid white;
}
#events {
    background: #198686;
    color: white;
}
#events.hideOnMobile {
  display: none;
}
#ranking.hideOnMobile {
  display: none;
}

#ranking-title {
  text-align: center;
  line-height: 80px;
  font-size: 22px;
  font-weight: bolder;
}
#ranking-title.hideOnMobile {
  display: none;
}
@media (min-width: 1024px) {
  #topsubmenu span {
    display: none;
  }
  #ranking.hideOnMobile, #ranking-title.hideOnMobile {
    display: block;
  }
  #events {
    display: block !important;
    float: left;
    width: 400px;
    border-right: 1px solid #ddd;
    font-weight: bold;
  }
  #event {
    padding-left: 430px;
    padding-right: 20px;
  }
}
.event-link {
  cursor: pointer;
  display: block;
    text-align: left;
    padding-left: 8px;
    border-bottom: 1px solid #ddd;
    width: 100%;
    transition: background-color 0.5s ease;
    height: 60px;
    line-height: 60px;
}
.event-link:hover {
     background-color: #27736f;
}
iframe {
  vertical-align: top;
  border: 0;
  height: 500px;
  width: 100%;
}
#ranking {
  width: 400px;
  margin: auto;
}
.player-name {
    display: inline-block;
    width: 200px;
    text-align: left;
}
.player-points {
    display: inline-block;
    width: 200px;
    text-align: center;
}
</style>

  }
</style>
