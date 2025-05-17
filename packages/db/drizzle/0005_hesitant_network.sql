ALTER TABLE "transaction" ADD COLUMN "category" varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "description" varchar;--> statement-breakpoint
ALTER TABLE "transaction" ADD COLUMN "date" timestamp NOT NULL;