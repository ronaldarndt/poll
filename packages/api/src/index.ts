import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { Logestic } from "logestic";
import { poll } from "./controllers";
import { cors } from "@elysiajs/cors";
import "./lib/env";
import { vote } from "./controllers/vote";

const app = new Elysia()
  .use(cors({ origin: true }))
  .use(swagger())
  .use(Logestic.preset("common"))
  .use(poll)
  .use(vote)
  .get("/", () => "hello world");

type App = typeof app;

export default app;
export { App };
