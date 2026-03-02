CREATE TABLE "evaluation_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" varchar(50) NOT NULL,
	"version" varchar DEFAULT '1.0' NOT NULL,
	"template_scheme" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"coach_ids" jsonb NOT NULL,
	"evaluation_template_id" uuid NOT NULL,
	"evaluation_data" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"submitted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_evaluation_template_id_evaluation_templates_id_fk" FOREIGN KEY ("evaluation_template_id") REFERENCES "public"."evaluation_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "evaluation_templates_type_idx" ON "evaluation_templates" USING btree ("type");--> statement-breakpoint
CREATE INDEX "evaluations_player_id_idx" ON "evaluations" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "evaluations_evaluation_template_id_idx" ON "evaluations" USING btree ("evaluation_template_id");