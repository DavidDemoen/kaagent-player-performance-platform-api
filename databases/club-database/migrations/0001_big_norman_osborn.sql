-- Only add the column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='players' AND column_name='slug'
    ) THEN
        ALTER TABLE "players" ADD COLUMN "slug" varchar(255);
    END IF;
END$$;

-- Backfill slug values
UPDATE "players" SET "slug" = lower(replace(first_name, ' ', '-') || '-' || replace(last_name, ' ', '-')) WHERE "slug" IS NULL;

-- Set NOT NULL constraint if not already set
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='players' AND column_name='slug' AND is_nullable='YES'
    ) THEN
        ALTER TABLE "players" ALTER COLUMN "slug" SET NOT NULL;
    END IF;
END$$;