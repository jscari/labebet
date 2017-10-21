
import axios from 'axios';
const API_URL = process.env.API_URL;

export default {
  getEventQuestions (eventId) {
    return axios.get(`${API_URL}/event/questions/${eventId}`);
  },
  getEventAnswers (eventId) {
    console.error(`${API_URL}/event/answers/${eventId}`);
    return axios.get(`${API_URL}/event/answers/${eventId}`);
  },
  getTournamentEvents (tournamentSlug) {
    return axios.get(`${API_URL}/${tournamentSlug}/event/list`);
  },
  getTournamentRanking (tournamentSlug) {
    return axios.get(`${API_URL}/${tournamentSlug}/ranking`);
  },
  saveEventQuestions (tournamentSlug, eventId, questions) {
    return axios.put(`${API_URL}/${tournamentSlug}/event/questions/${eventId}`, { questions });
  },
  saveEventTime (tournamentSlug, eventId, time) {
    return axios.put(`${API_URL}/${tournamentSlug}/event/closeat/${eventId}`, { time });
  },
  saveEventAnswers (tournamentSlug, eventId, answers) {
    return axios.put(`${API_URL}/${tournamentSlug}/event/answers/${eventId}`, { answers });
  },
  copyEvent (tournamentSlug, eventId) {
    return axios.put(`${API_URL}/${tournamentSlug}/event/copy/${eventId}`);
  },
  deleteEvent (tournamentSlug, eventId) {
    return axios.post(`${API_URL}/${tournamentSlug}/event/delete/${eventId}`);
  },
  sendAnswers (tournamentSlug, eventNumber, jwt, answers) {
    axios.defaults.headers.common['Authorization'] = jwt;
    return axios.post(`${API_URL}/${tournamentSlug}/bet/`, { eventNumber, answers });
  },
  passwordLogin (username, password) {
    return axios.post(`${API_URL}/login`, { username, password });
  },
  playerCheckLogin (tournamentSlug, playerName, playerCheck) {
    return axios.post(`${API_URL}/login`, { tournamentSlug, playerName, playerCheck });
  }
};
