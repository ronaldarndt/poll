import { treaty } from "@elysiajs/eden";
import { App } from "api";

const api = treaty<App>("localhost:3000");

export { api };
