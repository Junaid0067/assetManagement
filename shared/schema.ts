import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with roles (existing)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("USER"),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).extend({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "MANAGER", "USER"]).default("USER"),
});

// Items table with enhanced tracking
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull(),
  description: text("description"),
  warranty: text("warranty"),
  qrCode: text("qr_code").unique(),
  purchaseDate: date("purchase_date"),
  purchasePrice: integer("purchase_price"),
  expectedLifespan: integer("expected_lifespan"), // in months
  maintenanceInterval: integer("maintenance_interval"), // in days
  minimumStock: integer("minimum_stock"),
  status: text("status").default("ACTIVE"),
});

export const insertItemSchema = createInsertSchema(items).omit({
  id: true,
  qrCode: true,
});

// Employees table (existing)
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  joinDate: timestamp("join_date").notNull(),
  status: text("status").notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).extend({
  code: z.string().min(1, "Employee code is required"),
  name: z.string().min(1, "Name is required"),
  department: z.string().min(1, "Department is required"),
  status: z.string().min(1, "Status is required"),
  joinDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
});

// Allocations table with enhanced tracking
export const allocations = pgTable("allocations", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  employeeId: integer("employee_id").notNull(),
  quantity: integer("quantity").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  returnDate: timestamp("return_date"),
  status: text("status").notNull(),
  // qrScanData: jsonb("qr_scan_data"),
});

export const insertAllocationSchema = createInsertSchema(allocations).omit({
  id: true,
  // qrScanData: true
});

// New tables for additional features

// Maintenance Records
export const maintenanceRecords = pgTable("maintenance_records", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  maintenanceDate: timestamp("maintenance_date").notNull(),
  type: text("type").notNull(), // SCHEDULED, REPAIR, INSPECTION
  cost: integer("cost"),
  description: text("description"),
  performedBy: text("performed_by"),
  nextMaintenanceDate: timestamp("next_maintenance_date"),
  status: text("status").notNull(), // PENDING, IN_PROGRESS, COMPLETED
});

export const insertMaintenanceSchema = createInsertSchema(
  maintenanceRecords,
).omit({
  id: true,
});

// Item Requests
export const itemRequests = pgTable("item_requests", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull(),
  itemId: integer("item_id").notNull(),
  quantity: integer("quantity").notNull(),
  requestDate: timestamp("request_date").notNull(),
  status: text("status").notNull(), // PENDING, APPROVED, REJECTED
  approvedBy: integer("approved_by"),
  approvalDate: timestamp("approval_date"),
  notes: text("notes"),
});

export const insertItemRequestSchema = createInsertSchema(itemRequests).omit({
  id: true,
  approvalDate: true,
});

// Reports
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // INVENTORY, MAINTENANCE, ALLOCATION, ANALYTICS
  generatedBy: integer("generated_by").notNull(),
  generatedAt: timestamp("generated_at").notNull(),
  parameters: jsonb("parameters"),
  data: jsonb("data").notNull(),
});

export const insertReportSchema = createInsertSchema(reports).omit({
  id: true,
  generatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Allocation = typeof allocations.$inferSelect;
export type InsertAllocation = z.infer<typeof insertAllocationSchema>;

export type MaintenanceRecord = typeof maintenanceRecords.$inferSelect;
export type InsertMaintenanceRecord = z.infer<typeof insertMaintenanceSchema>;

export type ItemRequest = typeof itemRequests.$inferSelect;
export type InsertItemRequest = z.infer<typeof insertItemRequestSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type Role = "ADMIN" | "MANAGER" | "USER";

// Enhanced permissions
export const Permissions = {
  canManageUsers: (role: Role) => role === "ADMIN",
  canManageItems: (role: Role) => ["ADMIN", "MANAGER"].includes(role),
  canManageEmployees: (role: Role) => ["ADMIN", "MANAGER"].includes(role),
  canViewReports: (role: Role) => ["ADMIN", "MANAGER"].includes(role),
  canCreateReports: (role: Role) => role === "ADMIN",
  canApproveMaintenance: (role: Role) => ["ADMIN", "MANAGER"].includes(role),
  canApproveRequests: (role: Role) => ["ADMIN", "MANAGER"].includes(role),
  canManageQRCodes: (role: Role) => ["ADMIN", "MANAGER"].includes(role),
  canExportData: (role: Role) => role === "ADMIN",
};
