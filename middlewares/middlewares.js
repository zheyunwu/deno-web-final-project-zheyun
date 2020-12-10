import { send } from '../deps.js';

const logMiddleware = async({request, response, session}, next) => {
  const user = await session.get('user')
  const uid = user ? user.id : 'anonymous'
  console.log(`[log] ${new Date().toUTCString()} - ${request.method} - ${request.url.pathname} - User: ${uid}`);
  await next();
};

const errorMiddleware = async(context, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
}

const limitAccessMiddleware = async(context, next) => {
  const path = context.request.url.pathname;
  if (path.startsWith('/auth') || path.startsWith('/api'))  await next();
  else {
    if (await context.session.get('loggedin')) {
      await next();
    } else {
      context.response.status = 401;
      context.response.redirect('/auth/login')
    }
  }
}

const serveStaticFilesMiddleware = async(context, next) => {
  if (context.request.url.pathname.startsWith('/static')) {
    const path = context.request.url.pathname.substring(7);
  
    await send(context, path, {
      root: `${Deno.cwd()}/static`
    });
  
  } else {
    await next();
  }
}

export { logMiddleware, errorMiddleware, limitAccessMiddleware, serveStaticFilesMiddleware };