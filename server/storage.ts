import { users, items, employees, allocations, maintenanceRecords, itemRequests, reports } from "@shared/schema";
import type { 
  User, InsertUser, Item, InsertItem, Employee, InsertEmployee, 
  Allocation, InsertAllocation, MaintenanceRecord, InsertMaintenanceRecord,
  ItemRequest, InsertItemRequest, Report, InsertReport, Role
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Item operations
  getItems(): Promise<Item[]>;
  getItem(id: number): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: number, item: Partial<InsertItem>): Promise<Item>;
  deleteItem(id: number): Promise<void>;

  // Employee operations
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee>;
  deleteEmployee(id: number): Promise<void>;

  // Allocation operations
  getAllocations(): Promise<Allocation[]>;
  getAllocation(id: number): Promise<Allocation | undefined>;
  createAllocation(allocation: InsertAllocation): Promise<Allocation>;
  updateAllocation(id: number, allocation: Partial<InsertAllocation>): Promise<Allocation>;

  // Maintenance operations
  getMaintenanceRecords(): Promise<MaintenanceRecord[]>;
  getMaintenanceRecord(id: number): Promise<MaintenanceRecord | undefined>;
  createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord>;
  updateMaintenanceRecord(id: number, record: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord>;

  // Item Request operations
  getItemRequests(): Promise<ItemRequest[]>;
  getItemRequest(id: number): Promise<ItemRequest | undefined>;
  createItemRequest(request: InsertItemRequest): Promise<ItemRequest>;
  updateItemRequest(id: number, request: Partial<InsertItemRequest>): Promise<ItemRequest>;

  // Report operations
  getReports(): Promise<Report[]>;
  getReport(id: number): Promise<Report | undefined>;
  createReport(report: InsertReport): Promise<Report>;

  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  public sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Item operations
  async getItems(): Promise<Item[]> {
    return await db.select().from(items);
  }

  async getItem(id: number): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item;
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const [item] = await db.insert(items).values(insertItem).returning();
    return item;
  }

  async updateItem(id: number, updateData: Partial<InsertItem>): Promise<Item> {
    const [item] = await db
      .update(items)
      .set(updateData)
      .where(eq(items.id, id))
      .returning();
    if (!item) throw new Error("Item not found");
    return item;
  }

  async deleteItem(id: number): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const employee = {
      ...insertEmployee,
      joinDate: new Date(insertEmployee.joinDate)
    };
    const [result] = await db.insert(employees).values(employee).returning();
    return result;
  }

  async updateEmployee(id: number, updateData: Partial<InsertEmployee>): Promise<Employee> {
    const employeeData = { ...updateData };
    if (updateData.joinDate) {
      employeeData.joinDate = new Date(updateData.joinDate).toISOString();
    }
    const [employee] = await db
      .update(employees)
      .set(employeeData)
      .where(eq(employees.id, id))
      .returning();
    if (!employee) throw new Error("Employee not found");
    return employee;
  }

  async deleteEmployee(id: number): Promise<void> {
    await db.delete(employees).where(eq(employees.id, id));
  }

  // Allocation operations
  async getAllocations(): Promise<Allocation[]> {
    return await db.select().from(allocations);
  }

  async getAllocation(id: number): Promise<Allocation | undefined> {
    const [allocation] = await db.select().from(allocations).where(eq(allocations.id, id));
    return allocation;
  }

  async createAllocation(allocation: InsertAllocation): Promise<Allocation> {
    const allocationData = {
      ...allocation,
      issueDate: new Date(allocation.issueDate).toISOString(),
      returnDate: allocation.returnDate ? new Date(allocation.returnDate).toISOString() : null
    };
    const [result] = await db.insert(allocations).values(allocationData).returning();
    return result;
  }

  async updateAllocation(id: number, updateData: Partial<InsertAllocation>): Promise<Allocation> {
    const [allocation] = await db
      .update(allocations)
      .set(updateData)
      .where(eq(allocations.id, id))
      .returning();
    if (!allocation) throw new Error("Allocation not found");
    return allocation;
  }

  // Maintenance Record operations
  async getMaintenanceRecords(): Promise<MaintenanceRecord[]> {
    return await db.select().from(maintenanceRecords);
  }

  async getMaintenanceRecord(id: number): Promise<MaintenanceRecord | undefined> {
    const [record] = await db.select().from(maintenanceRecords).where(eq(maintenanceRecords.id, id));
    return record;
  }

  async createMaintenanceRecord(record: InsertMaintenanceRecord): Promise<MaintenanceRecord> {
    const maintenanceData = {
      ...record,
      maintenanceDate: new Date(record.maintenanceDate).toISOString(),
      nextMaintenanceDate: record.nextMaintenanceDate ? new Date(record.nextMaintenanceDate).toISOString() : null
    };
    const [result] = await db.insert(maintenanceRecords).values(maintenanceData).returning();
    return result;
  }

  async updateMaintenanceRecord(id: number, updateData: Partial<InsertMaintenanceRecord>): Promise<MaintenanceRecord> {
    const recordData = { ...updateData };
    if (updateData.maintenanceDate) {
      recordData.maintenanceDate = new Date(updateData.maintenanceDate).toISOString();
    }
    if (updateData.nextMaintenanceDate) {
      recordData.nextMaintenanceDate = new Date(updateData.nextMaintenanceDate).toISOString();
    }
    const [record] = await db
      .update(maintenanceRecords)
      .set(recordData)
      .where(eq(maintenanceRecords.id, id))
      .returning();
    if (!record) throw new Error("Maintenance record not found");
    return record;
  }

  // Item Request operations
  async getItemRequests(): Promise<ItemRequest[]> {
    return await db.select().from(itemRequests);
  }

  async getItemRequest(id: number): Promise<ItemRequest | undefined> {
    const [request] = await db.select().from(itemRequests).where(eq(itemRequests.id, id));
    return request;
  }

  async createItemRequest(request: InsertItemRequest): Promise<ItemRequest> {
    const requestData = {
      ...request,
      requestDate: new Date(request.requestDate).toISOString()
    };
    const [result] = await db.insert(itemRequests).values(requestData).returning();
    return result;
  }

  async updateItemRequest(id: number, updateData: Partial<InsertItemRequest> & { approvalDate?: string }): Promise<ItemRequest> {
    const requestData = { ...updateData };
    if (updateData.requestDate) {
      requestData.requestDate = new Date(updateData.requestDate).toISOString();
    }
    if (updateData.approvalDate) {
      requestData.approvalDate = new Date(updateData.approvalDate).toISOString();
    }
    const [request] = await db
      .update(itemRequests)
      .set(requestData)
      .where(eq(itemRequests.id, id))
      .returning();
    if (!request) throw new Error("Item request not found");
    return request;
  }

  // Report operations
  async getReports(): Promise<Report[]> {
    return await db.select().from(reports);
  }

  async getReport(id: number): Promise<Report | undefined> {
    const [report] = await db.select().from(reports).where(eq(reports.id, id));
    return report;
  }

  async createReport(report: InsertReport): Promise<Report> {
    const [result] = await db.insert(reports).values({
      ...report,
      generatedAt: new Date().toISOString()
    }).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();