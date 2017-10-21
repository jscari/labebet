const KoaRouter = require('koa-router');
const authenticate = require('./middlewares/authenticate');

const router = new KoaRouter();
const adminRoutes = require('./admin-routes');
const publicRoutes = require('./public-routes');
adminRoutes(router);
publicRoutes(router);

router.get('/', async ctx => {
  ctx.body = 'API Labebet';
});
router.post('/login', async ctx => {
  await authenticate(ctx);
});

module.exports = router.routes();
