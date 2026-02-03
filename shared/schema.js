import { pgTable, text, serial, integer, timestamp, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// --- Auth Tables ---
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- App Tables ---
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url").notNull(),
  group: text("group").notNull(), // 'A' or 'B'
  wins: integer("wins").default(0).notNull(),
  draws: integer("draws").default(0).notNull(),
  losses: integer("losses").default(0).notNull(),
  goalsFor: integer("goals_for").default(0).notNull(),
  goalsAgainst: integer("goals_against").default(0).notNull(),
  points: integer("points").default(0).notNull(),
});

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  name: text("name").notNull(),
  position: text("position").notNull(), // 'GK', 'DEF', 'MID', 'FWD'
  number: integer("number").notNull(),
  photoUrl: text("photo_url").notNull(),
  goals: integer("goals").default(0).notNull(),
  assists: integer("assists").default(0).notNull(),
  yellowCards: integer("yellow_cards").default(0).notNull(),
  redCards: integer("red_cards").default(0).notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  homeTeamId: integer("home_team_id").references(() => teams.id).notNull(),
  awayTeamId: integer("away_team_id").references(() => teams.id).notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull(), // 'scheduled', 'live', 'finished'
  homeScore: integer("home_score").default(0).notNull(),
  awayScore: integer("away_score").default(0).notNull(),
  round: text("round").notNull(), // 'group', 'playoff', 'semi', 'final'
});

export const matchEvents = pgTable("match_events", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  playerId: integer("player_id").references(() => players.id).notNull(),
  type: text("type").notNull(), // 'goal', 'assist', 'yellow', 'red'
  minute: integer("minute").notNull(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const teamsRelations = relations(teams, ({ many }) => ({
  players: many(players),
  homeMatches: many(matches, { relationName: "homeMatches" }),
  awayMatches: many(matches, { relationName: "awayMatches" }),
}));

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  homeTeam: one(teams, {
    fields: [matches.homeTeamId],
    references: [teams.id],
    relationName: "homeMatches"
  }),
  awayTeam: one(teams, {
    fields: [matches.awayTeamId],
    references: [teams.id],
    relationName: "awayMatches"
  }),
  events: many(matchEvents),
}));

export const matchEventsRelations = relations(matchEvents, ({ one }) => ({
  match: one(matches, {
    fields: [matchEvents.matchId],
    references: [matches.id],
  }),
  player: one(players, {
    fields: [matchEvents.playerId],
    references: [players.id],
  }),
}));

// Schemas
export const insertTeamSchema = createInsertSchema(teams).omit({ id: true });
export const insertPlayerSchema = createInsertSchema(players).omit({ id: true });
export const insertMatchSchema = createInsertSchema(matches).omit({ id: true });
export const insertMatchEventSchema = createInsertSchema(matchEvents).omit({ id: true });
export const insertNewsSchema = createInsertSchema(news).omit({ id: true, createdAt: true });
