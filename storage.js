import { 
  teams, players, matches, matchEvents, news, users
} from "./shared/schema.js";
import { db } from "./db.js";
import { eq, desc, asc, and, or } from "drizzle-orm";

export class DatabaseStorage {
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

  async getPlayers(teamId) {
    if (teamId) {
      return await db.select().from(players).where(eq(players.teamId, teamId));
    }
    return await db.select().from(players);
  }

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

  async getNews() {
    return await db.select().from(news).orderBy(desc(news.createdAt));
  }
  async createNews(insertNews) {
    const [item] = await db.insert(news).values(insertNews).returning();
    return item;
  }
}

export const storage = new DatabaseStorage();
