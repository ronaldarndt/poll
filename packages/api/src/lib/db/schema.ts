import {
  bigint,
  pgTable,
  serial,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

export const polls = pgTable("polls", {
  id: serial("id").primaryKey(),
  title: varchar("title"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const pollOptions = pgTable("poll_options", {
  id: serial("id").primaryKey(),
  pollId: bigint("poll_id", { mode: "number" }).references(() => polls.id),
  text: varchar("text"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  pollId: bigint("poll_id", { mode: "number" }).references(() => polls.id),
  optionId: bigint("option_id", { mode: "number" }).references(
    () => pollOptions.id
  ),
  voterIp: varchar("voter_ip"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});
