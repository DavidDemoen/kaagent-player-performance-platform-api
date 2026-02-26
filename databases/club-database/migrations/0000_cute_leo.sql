CREATE TABLE "teams" (
	"team_key" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opteamal_key" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "teams_opteamal_key_unique" UNIQUE("opteamal_key")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"opteamal-id" uuid NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"birth_date" date NOT NULL,
	"gender" varchar(255) NOT NULL,
	"shirt_number" integer DEFAULT -1 NOT NULL,
	"nationality" varchar(255) NOT NULL,
	"second_nationality" varchar(255),
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "players_opteamal-id_unique" UNIQUE("opteamal-id")
);
--> statement-breakpoint
CREATE TABLE "players_positions_history" (
	"player_id" uuid NOT NULL,
	"position_name" varchar(255) NOT NULL,
	"is_current" boolean NOT NULL,
	"valid_from_dt" timestamp NOT NULL,
	"valid_to_dt" timestamp,
	CONSTRAINT "players_positions_history_pkey" PRIMARY KEY("player_id","position_name")
);
--> statement-breakpoint
CREATE TABLE "player_positions" (
	"name" varchar(255) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players_teams_history" (
	"player_id" uuid NOT NULL,
	"team_key" uuid NOT NULL,
	"is_current" boolean NOT NULL,
	"is_primary_team" boolean NOT NULL,
	CONSTRAINT "players_teams_history_pkey" PRIMARY KEY("player_id","team_key")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "players_positions_history" ADD CONSTRAINT "players_positions_history_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players_positions_history" ADD CONSTRAINT "players_positions_history_position_name_player_positions_name_fk" FOREIGN KEY ("position_name") REFERENCES "public"."player_positions"("name") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players_teams_history" ADD CONSTRAINT "players_teams_history_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "players_teams_history" ADD CONSTRAINT "players_teams_history_team_key_teams_team_key_fk" FOREIGN KEY ("team_key") REFERENCES "public"."teams"("team_key") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "teams_name_idx" ON "teams" USING btree ("name");--> statement-breakpoint
CREATE INDEX "teams_opteamal_key_idx" ON "teams" USING btree ("opteamal_key");--> statement-breakpoint
CREATE INDEX "players_full_name_idx" ON "players" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX "players_opteamal_id_idx" ON "players" USING btree ("opteamal-id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");