import Elysia, { t } from "elysia";
import { base } from "../base";
import { pollOptions, polls, votes } from "../lib/db/schema";
import { db } from "../lib/db/db";
import { count, eq } from "drizzle-orm";

const poll = new Elysia({ prefix: "/poll" })
  .use(base)
  .post(
    "/",
    async ({ body }) => {
      const pollResult = await db
        .insert(polls)
        .values({ title: body.title })
        .returning({ id: polls.id });

      const options = body.options.map((option: string) => ({
        pollId: pollResult[0].id,
        text: option
      }));

      await db.insert(pollOptions).values(options);

      return { pollId: pollResult[0].id };
    },
    {
      body: t.Object({
        title: t.String(),
        options: t.Array(t.String())
      })
    }
  )
  .get(
    "/:id",
    async ({ params }) => {
      const id = Number(params.id);

      const pollResult = await db.select().from(polls).where(eq(polls.id, id));

      const votesSubquery = db
        .select({
          count: count(votes.id).as("count"),
          optionId: votes.optionId
        })
        .from(votes)
        .groupBy(votes.optionId)
        .as("votes");

      const optionsResult = await db
        .select({
          text: pollOptions.text,
          votes: votesSubquery.count,
          id: pollOptions.id
        })
        .from(pollOptions)
        .leftJoin(votesSubquery, eq(pollOptions.id, votesSubquery.optionId))
        .where(eq(pollOptions.pollId, id));

      return {
        title: pollResult[0].title,
        id: pollResult[0].id,
        options: optionsResult
      };
    },
    {
      params: t.Object({
        id: t.String()
      })
    }
  );

export { poll };
