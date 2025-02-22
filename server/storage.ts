import { User, InsertUser, Item, InsertItem, Employee, InsertEmployee, Allocation, InsertAllocation } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

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

  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private items: Map<number, Item>;
  private employees: Map<number, Employee>;
  private allocations: Map<number, Allocation>;
  public sessionStore: session.SessionStore;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.items = new Map();
    this.employees = new Map();
    this.allocations = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.currentIds = {
      users: 1,
      items: 1,
      employees: 1,
      allocations: 1,
    };
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { ...insertUser, id, isAdmin: false };
    this.users.set(id, user);
    return user;
  }

  // Item operations
  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async getItem(id: number): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const id = this.currentIds.items++;
    const item: Item = { ...insertItem, id };
    this.items.set(id, item);
    return item;
  }

  async updateItem(id: number, updateData: Partial<InsertItem>): Promise<Item> {
    const item = this.items.get(id);
    if (!item) throw new Error("Item not found");
    const updatedItem = { ...item, ...updateData };
    this.items.set(id, updatedItem);
    return updatedItem;
  }

  async deleteItem(id: number): Promise<void> {
    this.items.delete(id);
  }

  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = this.currentIds.employees++;
    const employee: Employee = { ...insertEmployee, id };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: number, updateData: Partial<InsertEmployee>): Promise<Employee> {
    const employee = this.employees.get(id);
    if (!employee) throw new Error("Employee not found");
    const updatedEmployee = { ...employee, ...updateData };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: number): Promise<void> {
    this.employees.delete(id);
  }

  // Allocation operations
  async getAllocations(): Promise<Allocation[]> {
    return Array.from(this.allocations.values());
  }

  async getAllocation(id: number): Promise<Allocation | undefined> {
    return this.allocations.get(id);
  }

  async createAllocation(insertAllocation: InsertAllocation): Promise<Allocation> {
    const id = this.currentIds.allocations++;
    const allocation: Allocation = { ...insertAllocation, id };
    this.allocations.set(id, allocation);
    return allocation;
  }

  async updateAllocation(id: number, updateData: Partial<InsertAllocation>): Promise<Allocation> {
    const allocation = this.allocations.get(id);
    if (!allocation) throw new Error("Allocation not found");
    const updatedAllocation = { ...allocation, ...updateData };
    this.allocations.set(id, updatedAllocation);
    return updatedAllocation;
  }
}

export const storage = new MemStorage();
