require('dotenv').config();
const Koa = require('koa');
const app = new Koa();
const { Nuxt, Builder } = require('nuxt');
const koabetterBody = require('koa-better-body');
const cors = require('koa-cors');
const api = require('./api/api');
app
  .use(cors())
  .use(koabetterBody({ fields: 'body' }));

const frontRoutes = async (ctx, next) => {
  ctx.status = 200;// koa defaults to 404 when it sees that status is unset
  return new Promise((resolve, reject) => {
    ctx.res.on('close', resolve);
    ctx.res.on('finish', resolve);
    nuxt.render(ctx.req, ctx.res, promise => {
      // nuxt.render passes a rejected promise into callback on error.
      promise.then(resolve).catch(reject);
    });
  });
};
// middle ware, check if we ask api.* or other domains
async function forwardToApiOrWww (ctx, next) {
  const host = ctx.request && ctx.request.header && ctx.request.header.host;
  console.log({ header: ctx.request.header });
  console.log({ host });
  if (host.indexOf('api.') === 0) {
    return api(ctx, next);
  }
  return frontRoutes(ctx, next);
}
app.use(forwardToApiOrWww);

// Require nuxt config
const config = require('./nuxt.config.js');

// Create a new nuxt instance
const nuxt = new Nuxt(config);

// Enable live build & reloading on dev
if (nuxt.options.dev) {
  new Builder(nuxt).build();
}

app.listen(3000);
console.log('Server listening on 3000');
