CREATE TABLE "allocations" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"issue_date" timestamp NOT NULL,
	"return_date" timestamp,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"department" text NOT NULL,
	"join_date" timestamp NOT NULL,
	"status" text NOT NULL,
	CONSTRAINT "employees_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "item_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"request_date" timestamp NOT NULL,
	"status" text NOT NULL,
	"approved_by" integer,
	"approval_date" timestamp,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"quantity" integer NOT NULL,
	"description" text,
	"warranty" text,
	"qr_code" text,
	"purchase_date" date,
	"purchase_price" integer,
	"expected_lifespan" integer,
	"maintenance_interval" integer,
	"minimum_stock" integer,
	"status" text DEFAULT 'ACTIVE',
	CONSTRAINT "items_qr_code_unique" UNIQUE("qr_code")
);
--> statement-breakpoint
CREATE TABLE "maintenance_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_id" integer NOT NULL,
	"maintenance_date" timestamp NOT NULL,
	"type" text NOT NULL,
	"cost" integer,
	"description" text,
	"performed_by" text,
	"next_maintenance_date" timestamp,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"generated_by" integer NOT NULL,
	"generated_at" timestamp NOT NULL,
	"parameters" jsonb,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"role" text DEFAULT 'USER' NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
