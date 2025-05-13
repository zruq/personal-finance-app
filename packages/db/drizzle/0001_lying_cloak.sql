ALTER TABLE "transaction" RENAME COLUMN "party" TO "party_id";--> statement-breakpoint
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_party_party_id_fk";
--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_party_id_party_id_fk" FOREIGN KEY ("party_id") REFERENCES "public"."party"("id") ON DELETE no action ON UPDATE no action;