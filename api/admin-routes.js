const userService = require('./services/user-service');
const eventService = require('./services/event-service');
const tournamentService = require('./services/tournament-service');
const authenticate = require('./middlewares/authenticate.js');
// Custom 401, we need it to add cors header for authentication errors
/*
router.use(async (ctx, next) => {
  try {
    await next;
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { error: err.message };
  }
});
*/

const throwHTTPForbidden = (ctx) => {
  ctx.status = 401;
  ctx.body = { 'error': 'Access forbidden' };
};
const throwHTTPParamsError = (ctx) => {
  ctx.status = 404;
  ctx.body = { 'error': 'Params error' };
};

// save event data (depends of the request body)
const saveEventData = async ctx => {
  const isNew = ctx.params.eventId === 'new';
  if (!eventService.isValidEventId(ctx.params.eventId) && !isNew) { throwHTTPParamsError(ctx); return; }
  if (!ctx.request.body || (!ctx.request.body.questions && !ctx.request.body.time)) { throwHTTPParamsError(ctx); return; }
  try {
    const userId = 0;
    if (!isNew) {
      const hasPermission = await userService.isOwner(userId, ctx.params.eventId);
      if (!hasPermission) {
        throwHTTPForbidden(ctx);
        return;
      }
    }
    const tournament = await tournamentService.getTournamentFromSlug(ctx.params.tournamentSlug);
    if (!tournament) {
      ctx.status = 404;
      ctx.body = { 'error': 'Unknown tournament' };
      return;
    }
    const event = isNew ? await eventService.createEvent(tournament.id) : await eventService.getEvent(ctx.params.eventId, tournament.id);
    if (!event) { throwHTTPParamsError(ctx); return; }
    const body = {};
    if (ctx.request.body.questions) {
      const savedEvent = await eventService.saveEventField(event, 'questions', ctx.request.body.questions);
      body.id = savedEvent.id;
      body.questions = savedEvent.questions;
    }
    if (ctx.request.body.time) {
      const d = new Date();
      d.setTime(ctx.request.body.time);
      const savedEvent = await eventService.saveEventField(event, 'close_at', d);
      body.id = savedEvent.id;
      body.closeAt = savedEvent.close_at;
    }
    ctx.body = body;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { 'error': 'Server error' };
  }
};
// get list of answers
const getEventAnswers = async ctx => {
  try {
    const event = await eventService.getEvent(ctx.params.eventId);
    const usersAnswers = await eventService.getUsersAnswers(event);
    const answersCount = {};
    // compile repondant count
    usersAnswers.forEach(ua => {
      const n = ua.question_number;
      if (typeof answersCount[n] === 'undefined') { answersCount[n] = {}; }
      const c = answersCount[n];
      const v = event.questions[n].type === 'QUESTION_AS_MULTIPLE_CHOICE'
        ? ua.answer_choice_number
        : ua.answer_numerical_value;
      c[v] = typeof c[v] !== 'undefined' ? c[v] + 1 : 1;
    });
    const questions = event.questions.map(q => q.text);
    const answers = [];
    // get answer text and respondant count
    event.questions.forEach((question, n) => {
      if (question.type === 'QUESTION_AS_MULTIPLE_CHOICE') {
        if (question.choices) {
          const a = [];
          question.choices.forEach((choice, c) => {
            a.push({
              value: choice,
              count: answersCount[n][c] || 0
            });
          });
          answers.push(a);
        } else {
          answers.push([]);
        }
      }
      if (question.type === 'QUESTION_AS_NUMBER') {
        if (answersCount[n]) {
          const a = [];
          Object.keys(answersCount[n]).forEach((choice, c) => {
            a.push({
              value: choice,
              count: answersCount[n][choice] || 0
            });
          });
          a.sort();
          answers.push(a);
        } else {
          answers.push([]);
        }
      }
    });

    const body = {
      id: event.id,
      questions,
      answers
    };
    ctx.body = body;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { 'error': 'Server error' };
  }
};
const copyEvent = async ctx => {
  try {
    const event = await eventService.getEvent(ctx.params.eventId);
    if (!event) {
      ctx.status = 404;
      ctx.body = { 'error': 'Unknown event' };
      return;
    }
    const copy = await eventService.createEvent(event.tournament_id);
    const qs = JSON.parse(JSON.stringify(event.questions));
    if (qs.length > 0) qs[0].text = `${qs[0].text} (copy)`;
    await eventService.saveEventField(copy, 'questions', qs);
    await eventService.saveEventField(copy, 'close_at', event.close_at);
    const body = {
      id: copy.id
    };
    ctx.body = body;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { 'error': 'Server error' };
  }
};
const deleteEvent = async ctx => {
  try {
    const event = await eventService.getEvent(ctx.params.eventId);
    if (!event) {
      ctx.status = 404;
      ctx.body = { 'error': 'Unknown event' };
      return;
    }
    await eventService.deleteEvent(ctx.params.eventId);
    const body = {
      message: 'event deleted'
    };
    ctx.body = body;
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { 'error': 'Server error' };
  }
};
// loop through player answers and set is_correct field
// check with SELECT name, question_number, answers.answer_choice_number, answer_numerical_value, is_correct  FROM answers, users WHERE answers.user_id = users.id ORDER BY question_number
const setCorrectAnswers = async ctx => {
  if (!ctx.request.body || (!ctx.request.body.answers)) { throwHTTPParamsError(ctx); return; }
  const answers = ctx.request.body.answers;
  try {
    const event = await eventService.getEvent(ctx.params.eventId);
    if (!event) {
      ctx.status = 404;
      ctx.body = { 'error': 'Unknown event' };
      return;
    }
    await eventService.setCorrectnessOfUsersAnswers(event, null, null, null, false);
    for (let questionNumber = 0; questionNumber < answers.length; questionNumber++) {
      const question = event.questions[questionNumber];
      const answer = answers[questionNumber];
      let answerChoiceNumber = null;
      let answerNumericalValue = null;
      if (question.type === 'QUESTION_AS_NUMBER') {
        answerNumericalValue = answer;
      } else {
        answerChoiceNumber = 0;
        for (let c = 0; c < question.choices.length; c++) {
          if (question.choices[c] === answer) {
            answerChoiceNumber = c;
            break;
          }
        }
      }
      await eventService.setCorrectnessOfUsersAnswers(event, questionNumber, answerChoiceNumber, answerNumericalValue, true);
      ctx.body = { id: event.id };
    }
  } catch (err) {
    console.error(err);
    ctx.status = 500;
    ctx.body = { 'error': 'Server error' };
  }
};
module.exports = (router) => {
  // save event questions
  router.put('/:tournamentSlug/event/questions/:eventId', saveEventData);
  // save event closeat
  router.put('/:tournamentSlug/event/closeat/:eventId', saveEventData);
  // save event  answers
  router.put('/:tournamentSlug/event/answers/:eventId', setCorrectAnswers);
  // copy event
  router.put('/:tournamentSlug/event/copy/:eventId', copyEvent);
  // delete event
  router.post('/:tournamentSlug/event/delete/:eventId', deleteEvent);
  // get list of answers
  router.get('/event/answers/:eventId', getEventAnswers);
};
