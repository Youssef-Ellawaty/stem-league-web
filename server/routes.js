import express from "express";
import { storage } from "./storage.js";
import { api } from "../shared/routes.js";
import { insertTeamSchema, insertPlayerSchema, insertMatchSchema, insertMatchEventSchema, insertNewsSchema } from "../shared/schema.js";
import { setupAuth, registerAuthRoutes } from "./auth.js";
import { z } from "zod";

export async function registerRoutes(server, app) {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Teams
  app.get(api.teams.list.path, async (req, res) => {
    const teams = await storage.getTeams();
    res.json(teams);
  });
  app.get(api.teams.get.path.replace(':id', ':id'), async (req, res) => {
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
  app.put(api.teams.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({message: "Unauthorized"});
    try {
      const input = insertTeamSchema.partial().parse(req.body);
      const team = await storage.updateTeam(Number(req.params.id), input);
      res.json(team);
    } catch (e) { res.status(400).json({message: "Invalid input", error: e}); }
  });

  // Players
  app.get(api.players.list.path, async (req, res) => {
    const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
    const players = await storage.getPlayers(teamId);
    res.json(players);
  });
  app.get(api.players.get.path.replace(':id', ':id'), async (req, res) => {
    const player = await storage.getPlayer(Number(req.params.id));
    if (!player) return res.status(404).json({ message: "Player not found" });
    res.json(player);
  });
  app.post(api.players.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({message: "Unauthorized"});
    try {
      const input = insertPlayerSchema.parse(req.body);
      const player = await storage.createPlayer(input);
      res.status(201).json(player);
    } catch (e) { res.status(400).json({message: "Invalid input", error: e}); }
  });
  app.put(api.players.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({message: "Unauthorized"});
    try {
      const input = insertPlayerSchema.partial().parse(req.body);
      const player = await storage.updatePlayer(Number(req.params.id), input);
      res.json(player);
    } catch (e) { res.status(400).json({message: "Invalid input", error: e}); }
  });

  // Matches
  app.get(api.matches.list.path, async (req, res) => {
    const status = req.query.status;
    const teamId = req.query.teamId ? Number(req.query.teamId) : undefined;
    const matches = await storage.getMatches(status, teamId);
    res.json(matches);
  });
  app.get(api.matches.get.path.replace(':id', ':id'), async (req, res) => {
    const match = await storage.getMatch(Number(req.params.id));
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  });
  app.post(api.matches.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({message: "Unauthorized"});
    try {
      const input = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(input);
      res.status(201).json(match);
    } catch (e) { res.status(400).json({message: "Invalid input", error: e}); }
  });
  app.put(api.matches.update.path.replace(':id', ':id'), async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({message: "Unauthorized"});
    try {
      const input = insertMatchSchema.partial().parse(req.body);
      const match = await storage.updateMatch(Number(req.params.id), input);
      res.json(match);
    } catch (e) { res.status(400).json({message: "Invalid input", error: e}); }
  });

  // News
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
      logoUrl: "https://placehold.co/100x100/000000/FFF?text=CU",
      group: "A",
      wins: 1, draws: 0, losses: 0, goalsFor: 2, goalsAgainst: 1, points: 3
    });
    const teamB = await storage.createTeam({
      name: "Robo FC",
      logoUrl: "https://placehold.co/100x100/FF0000/FFF?text=RFC",
      group: "A",
      wins: 0, draws: 0, losses: 1, goalsFor: 1, goalsAgainst: 2, points: 0
    });
    const teamC = await storage.createTeam({
      name: "Data Dynamos",
      logoUrl: "https://placehold.co/100x100/0000FF/FFF?text=DD",
      group: "B",
      wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, points: 0
    });

    await storage.createPlayer({
      teamId: teamA.id, name: "Neo", position: "FWD", number: 9, 
      photoUrl: "https://placehold.co/200x300/000000/FFF?text=Neo"
    });
    await storage.createPlayer({
      teamId: teamA.id, name: "Trinity", position: "MID", number: 10, 
      photoUrl: "https://placehold.co/200x300/000000/FFF?text=Trinity"
    });
    await storage.createPlayer({
      teamId: teamB.id, name: "Unit 734", position: "DEF", number: 4, 
      photoUrl: "https://placehold.co/200x300/FF0000/FFF?text=U734"
    });

    await storage.createNews({
      title: "STEM League Kickoff!",
      description: "The new season begins with a bang. Cyber United takes the lead.",
      imageUrl: "https://placehold.co/600x400/0000FF/FFF?text=Kickoff"
    });
    await storage.createNews({
      title: "New Rule Changes",
      description: "AI assistants are now allowed on the bench.",
      imageUrl: "https://placehold.co/600x400/00FF00/000?text=Rules"
    });

    await storage.createMatch({
      homeTeamId: teamA.id, awayTeamId: teamB.id,
      date: new Date(Date.now() - 86400000), // Yesterday
      status: "finished", homeScore: 2, awayScore: 1, round: "group"
    });
    
    await storage.createMatch({
      homeTeamId: teamC.id, awayTeamId: teamA.id,
      date: new Date(Date.now() + 86400000), // Tomorrow
      status: "scheduled", homeScore: 0, awayScore: 0, round: "group"
    });
  }
}
