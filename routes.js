import express from "express";
import { storage } from "./storage.js";
import { api } from "./shared/routes.js";
import { insertTeamSchema, insertMatchSchema, insertNewsSchema } from "./shared/schema.js";
import { setupAuth, registerAuthRoutes } from "./auth.js";

export async function registerRoutes(server, app) {
  await setupAuth(app);
  registerAuthRoutes(app);

  app.get(api.teams.list.path, async (req, res) => {
    const teams = await storage.getTeams();
    res.json(teams);
  });
  
  app.get("/api/teams/:id", async (req, res) => {
    const team = await storage.getTeam(Number(req.params.id));
    if (!team) return res.status(404).json({ message: "Team not found" });
    res.json(team);
  });

  app.post(api.teams.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({message: "Unauthorized"});
    try {
      const input = insertTeamSchema.parse(req.body);
      const team = await storage.createTeam(input);
      res.status(201).json(team);
    } catch (e) { res.status(400).json({message: "Invalid input", error: e}); }
  });

  app.get(api.players.list.path, async (req, res) => {
    const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
    const players = await storage.getPlayers(teamId);
    res.json(players);
  });

  app.get(api.matches.list.path, async (req, res) => {
    const status = req.query.status;
    const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
    const matches = await storage.getMatches(status, teamId);
    res.json(matches);
  });

  app.get(api.news.list.path, async (req, res) => {
    const news = await storage.getNews();
    res.json(news);
  });
  
  app.post(api.news.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({message: "Unauthorized"});
    try {
      const input = insertNewsSchema.parse(req.body);
      const news = await storage.createNews(input);
      res.status(201).json(news);
    } catch (e) { res.status(400).json({message: "Invalid input", error: e}); }
  });

  await seedData();
}

async function seedData() {
  const teams = await storage.getTeams();
  if (teams.length === 0) {
    const teamA = await storage.createTeam({
      name: "Cyber United",
      logoUrl: "https://placehold.co/100x100/000/00f2fe?text=CU",
      group: "A",
      wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 1, points: 3
    });
    const teamB = await storage.createTeam({
      name: "Robo FC",
      logoUrl: "https://placehold.co/100x100/000/ff0055?text=RFC",
      group: "A",
      wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 2, points: 0
    });
    
    await storage.createNews({
      title: "Neon League Season X",
      description: "The digital arena is ready. Teams are syncing for the most intensive season yet.",
      imageUrl: "https://placehold.co/800x400/050505/00f2fe?text=NEON+ARENA"
    });

    await storage.createMatch({
      homeTeamId: teamA.id, awayTeamId: teamB.id,
      date: new Date(Date.now() - 86400000),
      status: "finished", homeScore: 2, awayScore: 1, round: "group"
    });
  }
}
