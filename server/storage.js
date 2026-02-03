import { 
  teams, players, matches, matchEvents, news, users
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc, asc, and, or } from "drizzle-orm";

export class DatabaseStorage {
  // Auth
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData) {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Teams
  async getTeams() {
    return await db.select().from(teams).orderBy(desc(teams.points), desc(teams.goalsFor));
  }
  async getTeam(id) {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }
  async createTeam(insertTeam) {
    const [team] = await db.insert(teams).values(insertTeam).returning();
    return team;
  }
  async updateTeam(id, update) {
    const [team] = await db.update(teams).set(update).where(eq(teams.id, id)).returning();
    return team;
  }
  async deleteTeam(id) {
    await db.delete(teams).where(eq(teams.id, id));
  }

  // Players
  async getPlayers(teamId) {
    if (teamId) {
      return await db.select().from(players).where(eq(players.teamId, teamId));
    }
    return await db.select().from(players);
  }
  async getPlayer(id) {
    const [player] = await db.select().from(players).where(eq(players.id, id));
    return player;
  }
  async createPlayer(insertPlayer) {
    const [player] = await db.insert(players).values(insertPlayer).returning();
    return player;
  }
  async updatePlayer(id, update) {
    const [player] = await db.update(players).set(update).where(eq(players.id, id)).returning();
    return player;
  }
  async deletePlayer(id) {
    await db.delete(players).where(eq(players.id, id));
  }

  // Matches
  async getMatches(status, teamId) {
    let query = db.select().from(matches);
    
    const conditions = [];
    if (status) conditions.push(eq(matches.status, status));
    if (teamId) conditions.push(or(eq(matches.homeTeamId, teamId), eq(matches.awayTeamId, teamId)));
    
    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(asc(matches.date));
    }
    
    return await query.orderBy(asc(matches.date));
  }
  async getMatch(id) {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }
  async createMatch(insertMatch) {
    const [match] = await db.insert(matches).values(insertMatch).returning();
    return match;
  }
  async updateMatch(id, update) {
    const [match] = await db.update(matches).set(update).where(eq(matches.id, id)).returning();
    return match;
  }
  async deleteMatch(id) {
    await db.delete(matches).where(eq(matches.id, id));
  }

  // Match Events
  async getMatchEvents(matchId) {
    return await db.select().from(matchEvents).where(eq(matchEvents.matchId, matchId)).orderBy(asc(matchEvents.minute));
  }
  async createMatchEvent(insertEvent) {
    const [event] = await db.insert(matchEvents).values(insertEvent).returning();
    return event;
  }
  async deleteMatchEvent(id) {
    await db.delete(matchEvents).where(eq(matchEvents.id, id));
  }

  // News
  async getNews() {
    return await db.select().from(news).orderBy(desc(news.createdAt));
  }
  async getNewsItem(id) {
    const [item] = await db.select().from(news).where(eq(news.id, id));
    return item;
  }
  async createNews(insertNews) {
    const [item] = await db.insert(news).values(insertNews).returning();
    return item;
  }
  async updateNews(id, update) {
    const [item] = await db.update(news).set(update).where(eq(news.id, id)).returning();
    return item;
  }
  async deleteNews(id) {
    await db.delete(news).where(eq(news.id, id));
  }
}

export const storage = new DatabaseStorage();
