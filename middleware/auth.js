export default function (context, callback) {
  context.userAgent = context.isServer ? context.req.headers['user-agent'] : navigator.userAgent;
  console.log(context.req.headers);
  callback(new Error());
}
