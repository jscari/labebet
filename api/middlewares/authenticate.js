const jwt = require('jsonwebtoken');
const userService = require('../services/user-service');

const _ok = (ctx, username) => {
  ctx.status = 200;
  ctx.body = {
    token: jwt.sign({ username: username }, process.env.JWT_SECRET),
    username: username
  };
};
const _ko = (ctx) => {
  ctx.status = 401;
  ctx.body = {
    error: 'Authentication failed'
  };
};
module.exports = async function (ctx) {
  console.log(ctx.request.body);
  if (ctx.request.body.password && ctx.request.body.username) {
    const user = await userService.getInternalUser(ctx.request.body.username);
    if (user) {
      if (await userService.checkPassword(user, ctx.request.body.password)) {
        return _ko(ctx);
      } else {
        return _ok(ctx, ctx.request.body.username);
      }
    } else {
      await userService.createInternalUser(ctx.request.body.username, ctx.request.body.password);
      const user = await userService.getInternalUser(ctx.request.body.username);
      if (user) {
        return _ok(ctx, ctx.request.body.username);
      } else {
        return _ko(ctx);
      }
    }
  }
  // TODO  login with player check
  return ctx;
};
