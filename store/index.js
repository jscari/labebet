import API from '~/utils/api.js';

const handleAPIErrors = (e) => {
  if (e.response && e.response.status === 401) {
    console.log("document.location = '/admin/login'");
  } else {
    console.error('API Error');
  }
};

export const state = () => ({
  currentEventId: 'new',
  tournamentSlug: '',
  tournamentName: '',
  tournamentEvents: [],
  ranking: []
});

export const mutations = {
  // admin
  setCurrentEventId (state, eventId) {
    state.currentEventId = eventId;
  },
  setTournamentSlug (state, slug) {
    state.tournamentSlug = slug;
  },
  setTournamentName (state, name) {
    state.tournamentName = name;
  },
  updateTournamentEvents (state, events) {
    state.tournamentEvents = events;
  },
  setRanking (state, ranking) {
    state.ranking = ranking;
  }
};
export const actions = {
  setCurrentPlayerName ({ commit }, eventId) {
    commit('setCurrentPlayerName', eventId);
  },
  setCurrentPlayerCheck ({ commit }, eventId) {
    commit('setCurrentPlayerCheck', eventId);
  },
  setCurrentEventId ({ commit }, eventId) {
    commit('setCurrentEventId', eventId);
  },
  setCurrentEventNumber ({ commit }, eventNumber) {
    commit('setCurrentEventNumber', eventNumber);
  },
  setTournamentSlug ({ commit }, slug) {
    commit('setTournamentSlug', slug);
  },
  getTournamentEvents ({ commit }) {
    API.getTournamentEvents(this.state.tournamentSlug).then((res) => {
      commit('updateTournamentEvents', res.data.events);
      commit('setTournamentName', res.data.tournamentName);
    }).catch(handleAPIErrors);
  },
  getTournamentRanking ({ commit }) {
    API.getTournamentRanking(this.state.tournamentSlug).then((res) => {
      commit('setRanking', res.data);
    }).catch((err) => {
      console.error(err);
    });
  },
  saveCurrentEventQuestions ({ commit }, questions) {
    API.saveEventQuestions(this.state.tournamentSlug, this.state.currentEventId, questions).then((res) => {
      commit('setCurrentEventId', res.data.id);
    }).catch(handleAPIErrors);
  },
  saveCurrentEventTime ({ commit }, time) {
    API.saveEventTime(this.state.tournamentSlug, this.state.currentEventId, time).then((res) => {
      commit('setCurrentEventId', res.data.id);
    }).catch(handleAPIErrors);
  },
  saveCurrentEventAnswers ({ commit }, answers) {
    return API.saveEventAnswers(this.state.tournamentSlug, this.state.currentEventId, answers);
  },
  copyEvent ({ commit }, eventId) {
    const store = this;
    API.copyEvent(this.state.tournamentSlug, eventId).then((res) => {
      store.dispatch('getTournamentEvents');
    }).catch(handleAPIErrors);
  },
  deleteEvent ({ commit }, eventId) {
    const store = this;
    API.deleteEvent(this.state.tournamentSlug, eventId).then((res) => {
      store.dispatch('getTournamentEvents');
    }).catch(handleAPIErrors);
  }
};
