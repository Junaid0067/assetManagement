import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Items table
export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull(),
  description: text("description"),
  warranty: text("warranty"),
});

export const insertItemSchema = createInsertSchema(items).omit({ 
  id: true 
});

// Employees table
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  department: text("department").notNull(),
  joinDate: timestamp("join_date").notNull(),
  status: text("status").notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({ 
  id: true 
});

// Allocations table
export const allocations = pgTable("allocations", {
  id: serial("id").primaryKey(),
  itemId: integer("item_id").notNull(),
  employeeId: integer("employee_id").notNull(),
  quantity: integer("quantity").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  returnDate: timestamp("return_date"),
  status: text("status").notNull(),
});

export const insertAllocationSchema = createInsertSchema(allocations).omit({ 
  id: true 
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
