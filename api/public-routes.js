const eventService = require('./services/event-service');
const tournamentService = require('./services/tournament-service');
const userService = require('./services/user-service');

const throwHTTPParamsError = (ctx) => {
  ctx.status = 404;
  ctx.body = { 'error': 'Params error' };
};

// get event data for a bet
const getEventData = async ctx => {
  try {
    let event = null;
    if (ctx.params.eventId === 'last') {
      const tournament = await tournamentService.getTournamentFromSlug(ctx.params.tournamentSlug);
      if (!tournament) {
        throwHTTPParamsError(ctx);
        return;
      }
      event = await eventService.getLastTournamentEvent(tournament.id);
      if (!event) {
        throwHTTPParamsError(ctx);
        return;
      }
    } else {
      event = await eventService.getEvent(ctx.params.eventId);
    }
    if (event) { // event can be {}
      const body = {
        id: event.id,
        eventNumber: event.event_number,
        questions: JSON.parse(JSON.stringify(event.questions || {}))
      };
      ctx.body = body;
    } else {
      ctx.status = 404;
      ctx.body = { 'error': 'Unknown eventId' };
    }
  } catch (err) {
    console.error(err);
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
};
// get event questions for editing it
const getEventQuestions = async ctx => {
  if (ctx.params.eventId === 'new') {
    ctx.body = { id: 'new', questions: [] };
    return;
  }
  try {
    const event = await eventService.getEvent(ctx.params.eventId);
    const body = {
      id: event.id,
      questions: JSON.parse(JSON.stringify(event.questions))
    };
    ctx.body = body;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { 'error': 'Server error' };
  }
};
// save a player answers
const savePlayerAnswers = async ctx => {
  console.log(ctx.request.body);
  if (!ctx.request.body || typeof ctx.request.body.answers === 'undefined') { throwHTTPParamsError(ctx); return; }
  if (!ctx.request.body || typeof ctx.request.body.eventNumber === 'undefined') { throwHTTPParamsError(ctx); return; }
  try {
    const tournament = await tournamentService.getTournamentFromSlug(ctx.params.tournamentSlug);
    if (!tournament) {
      console.error('savePlayerAnswers - Tournament not found');
      throwHTTPParamsError(ctx);
      return;
    }
    // check if user exists
    const token = ctx.request && ctx.request.header && ctx.request.header.authorization;
    if (!token) {
      console.error('savePlayerAnswers - Token not found');
      throwHTTPParamsError(ctx);
      return;
    }
    let user = await userService.getUserFromJWT(token);
    if (!user) {
      console.error('savePlayerAnswers - User not found from jwt');
      throwHTTPParamsError(ctx);
      return;
      /* user = await userService.createExternalUser(tournament.player_secret, ctx.params.playerName, ctx.params.playerCheck);
      if (!user) {
        console.error('savePlayerAnswers - User cannot be created');
        throwHTTPParamsError(ctx);
      } */
    }
    const event = await eventService.getTournamentEvent(tournament, ctx.request.body.eventNumber);
    if (!event) {
      console.error('savePlayerAnswers - Event not found');
      throwHTTPParamsError(ctx);
      return;
    }
    await eventService.saveUserAnswers(user, tournament, event, ctx.request.body.answers);
    ctx.status = 200;
    ctx.body = {
      'user': {
        id: user.id
      }
    };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { 'error': 'Server error' };
  }
};

// get list of a tournament events
const getTournamentEvents = async ctx => {
  try {
    const tournament = await tournamentService.getTournamentFromSlug(ctx.params.tournamentSlug);
    const events = await eventService.getEventsList(tournament);

    ctx.body = {
      tournamentName: tournament.name,
      events: JSON.parse(JSON.stringify(events))
    };
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { 'error': 'Server error' };
  }
};
// get tournament ranking
const getTournamentRanking = async ctx => {
  try {
    const tournament = await tournamentService.getTournamentFromSlug(ctx.params.tournamentSlug);
    if (!tournament) {
      throwHTTPParamsError(ctx);
      return;
    }
    const ranking = await tournamentService.getRanking();
    ctx.body = ranking;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { 'error': 'Server error' };
  }
};

module.exports = (router) => {
  // get event data for a bet
  router.get('/:tournamentSlug/event/data/:eventId', getEventData);
  // get list of a tournament events
  router.get('/:tournamentSlug/event/list', getTournamentEvents);
  // get event questions for editing it
  router.get('/event/questions/:eventId', getEventQuestions);
  // get tournament ranking
  router.get('/:tournamentSlug/ranking', getTournamentRanking);
  // user bet
  router.post('/:tournamentSlug/bet', savePlayerAnswers);
};
