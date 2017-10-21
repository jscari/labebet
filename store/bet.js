import API from '~/utils/api.js';

export const state = () => ({
  playerName: 'guest',
  playerCheck: 'none',
  eventNumber: -1,
  jwt: null,
  loginError: null,
  answersSaved: false
});

export const mutations = {
  // user bet
  setCurrentEventNumber (state, currentEventNumber) {
    state.eventNumber = currentEventNumber;
  },
  setCurrentPlayerName (state, currentPlayerName) {
    state.playerName = currentPlayerName;
  },
  setCurrentPlayerCheck (state, currentPlayerCheck) {
    state.playerCheck = currentPlayerCheck;
  },
  setJWT (state, token) {
    state.jwt = token;
  },
  setLoginError (state, err) {
    console.error(err);
    state.loginError = err.msg || err;
  },
  answersSaved (state, bool) {
    state.answersSaved = bool;
  }
};
export const actions = {
  setCurrentPlayerName ({ commit }, eventId) {
    commit('setCurrentPlayerName', eventId);
  },
  setCurrentPlayerCheck ({ commit }, eventId) {
    commit('setCurrentPlayerCheck', eventId);
  },
  setCurrentEventNumber ({ commit }, eventNumber) {
    try {
      const n = parseInt(eventNumber, 10);
      commit('setCurrentEventNumber', n);
    } catch (e) {}
  },
  setJWT ({ commit }, token) {
    commit('setJWT', token);
  },
  sendAnswers ({ commit }, answers) {
    commit('answersSaved', false);
    API.sendAnswers(this.state.tournamentSlug, this.state.bet.eventNumber, this.state.bet.jwt, answers).then((res) => {
      commit('answersSaved', true);
    }).catch((err) => {
      // commit('setAnswersSaveError', err);
      console.error(err);
    });
  },
  login ({ commit }, creds) {
    API.passwordLogin(creds.username, creds.password).then((res) => {
      console.log(res);
      if (res.data && res.data.token) {
        commit('setJWT', res.data.token);
      } else {
        commit('setLoginError', new Error('No token returned'));
      }
    }).catch((err) => {
      commit('setLoginError', err);
    });
  }
};
