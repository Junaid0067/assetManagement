import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertItemSchema, insertEmployeeSchema, insertAllocationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Items routes
  app.get("/api/items", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const items = await storage.getItems();
    res.json(items);
  });

  app.post("/api/items", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertItemSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const item = await storage.createItem(parsed.data);
    res.status(201).json(item);
  });

  app.patch("/api/items/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const item = await storage.updateItem(parseInt(req.params.id), req.body);
    res.json(item);
  });

  app.delete("/api/items/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteItem(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Employees routes
  app.get("/api/employees", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const employees = await storage.getEmployees();
    res.json(employees);
  });

  app.post("/api/employees", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertEmployeeSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const employee = await storage.createEmployee(parsed.data);
    res.status(201).json(employee);
  });

  app.patch("/api/employees/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const employee = await storage.updateEmployee(parseInt(req.params.id), req.body);
    res.json(employee);
  });

  app.delete("/api/employees/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.deleteEmployee(parseInt(req.params.id));
    res.sendStatus(204);
  });

  // Allocations routes
  app.get("/api/allocations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const allocations = await storage.getAllocations();
    res.json(allocations);
  });

  app.post("/api/allocations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertAllocationSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const allocation = await storage.createAllocation(parsed.data);
    res.status(201).json(allocation);
  });

  app.patch("/api/allocations/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const allocation = await storage.updateAllocation(parseInt(req.params.id), req.body);
    res.json(allocation);
  });

  const httpServer = createServer(app);
  return httpServer;
}
