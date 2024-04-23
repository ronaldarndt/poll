import Elysia, { t } from "elysia";
import { db } from "../lib/db/db";
import { votes } from "../lib/db/schema";

const vote = new Elysia({ prefix: "/vote" }).post(
  "/",
  async ({ body }) => {
    await db
      .insert(votes)
      .values({ optionId: body.optionId, pollId: body.pollId });
    return { success: true };
  },
  {
    body: t.Object({ optionId: t.Number(), pollId: t.Number() })
  }
);

export { vote };
