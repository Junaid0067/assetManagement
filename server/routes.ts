import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { 
  insertItemSchema, insertEmployeeSchema, insertAllocationSchema,
  insertMaintenanceSchema, insertItemRequestSchema, insertReportSchema,
  Permissions, Role
} from "@shared/schema";

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

  // Maintenance Record routes
  app.get("/api/maintenance", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userRole = req.user.role as Role;
    if (!Permissions.canApproveMaintenance(userRole)) return res.sendStatus(403);
    const records = await storage.getMaintenanceRecords();
    res.json(records);
  });

  app.get("/api/maintenance/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userRole = req.user.role as Role;
    if (!Permissions.canApproveMaintenance(userRole)) return res.sendStatus(403);
    const record = await storage.getMaintenanceRecord(parseInt(req.params.id));
    if (!record) return res.sendStatus(404);
    res.json(record);
  });

  app.post("/api/maintenance", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userRole = req.user.role as Role;
    if (!Permissions.canApproveMaintenance(userRole)) return res.sendStatus(403);
    const parsed = insertMaintenanceSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const record = await storage.createMaintenanceRecord(parsed.data);
    res.status(201).json(record);
  });

  app.patch("/api/maintenance/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userRole = req.user.role as Role;
    if (!Permissions.canApproveMaintenance(userRole)) return res.sendStatus(403);
    const record = await storage.updateMaintenanceRecord(parseInt(req.params.id), req.body);
    res.json(record);
  });

  // Item Request routes
  app.get("/api/requests", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const requests = await storage.getItemRequests();
    res.json(requests);
  });

  app.get("/api/requests/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const request = await storage.getItemRequest(parseInt(req.params.id));
    if (!request) return res.sendStatus(404);
    res.json(request);
  });

  app.post("/api/requests", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertItemRequestSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const request = await storage.createItemRequest(parsed.data);
    res.status(201).json(request);
  });

  app.patch("/api/requests/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userRole = req.user.role as Role;
    if (req.body.status === "APPROVED" && !Permissions.canApproveRequests(userRole)) {
      return res.sendStatus(403);
    }
    const request = await storage.updateItemRequest(parseInt(req.params.id), {
      ...req.body,
      approvedBy: req.body.status === "APPROVED" ? req.user.id : undefined,
      approvalDate: req.body.status === "APPROVED" ? new Date().toISOString() : undefined
    });
    res.json(request);
  });

  // Report routes
  app.get("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userRole = req.user.role as Role;
    if (!Permissions.canViewReports(userRole)) return res.sendStatus(403);
    const reports = await storage.getReports();
    res.json(reports);
  });

  app.get("/api/reports/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userRole = req.user.role as Role;
    if (!Permissions.canViewReports(userRole)) return res.sendStatus(403);
    const report = await storage.getReport(parseInt(req.params.id));
    if (!report) return res.sendStatus(404);
    res.json(report);
  });

  app.post("/api/reports", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const userRole = req.user.role as Role;
    if (!Permissions.canCreateReports(userRole)) return res.sendStatus(403);
    const parsed = insertReportSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const report = await storage.createReport({
      ...parsed.data,
      generatedBy: req.user.id,
    });
    res.status(201).json(report);
  });

  const httpServer = createServer(app);
  return httpServer;
}