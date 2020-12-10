import { Application } from "./deps.js";
import { router } from './routes/routes.js';
import * as middleware from './middlewares/middlewares.js';
import { Session, viewEngine, engineFactory, adapterFactory, oakCors } from "./deps.js";

const app = new Application();

const session = new Session({ framework: "oak" });
await session.init();

app.use(session.use()(session));

const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, ejsEngine, {
  viewRoot: "./views"
}));

app.use(middleware.logMiddleware);
app.use(middleware.errorMiddleware);
app.use(middleware.limitAccessMiddleware);
// app.use(middleware.requestTimingMiddleware);
app.use(middleware.serveStaticFilesMiddleware);

app.use(oakCors());
app.use(router.routes());

if (!Deno.env.get('TEST_ENVIRONMENT')) {
  app.listen({ port: 7777 });
}
      
export default app;
