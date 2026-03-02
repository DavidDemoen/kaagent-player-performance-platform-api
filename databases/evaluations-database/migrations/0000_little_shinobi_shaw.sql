CREATE TABLE "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"data_objects" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"submitted_at" timestamp DEFAULT '1970-01-01 00:00:00.000' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_templates" (
	"name" varchar(255) NOT NULL,
	"version" varchar(50) NOT NULL,
	"type" varchar(50) NOT NULL,
	"schema" jsonb NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE INDEX "evaluations_player_id_idx" ON "evaluations" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "evaluations_author_id_idx" ON "evaluations" USING btree ("author_id");