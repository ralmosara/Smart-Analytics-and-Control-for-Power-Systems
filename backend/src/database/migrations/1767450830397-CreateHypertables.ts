import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHypertables1767450830397 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop existing primary key constraints (they don't include timestamp, which is required for hypertables)
        // Use DO blocks to safely drop constraints if they exist
        await queryRunner.query(`
            DO $$
            DECLARE
                constraint_name text;
            BEGIN
                SELECT conname INTO constraint_name
                FROM pg_constraint
                WHERE conrelid = 'converter_snapshots'::regclass AND contype = 'p';
                IF constraint_name IS NOT NULL THEN
                    EXECUTE 'ALTER TABLE converter_snapshots DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name);
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$
            DECLARE
                constraint_name text;
            BEGIN
                SELECT conname INTO constraint_name
                FROM pg_constraint
                WHERE conrelid = 'bus_snapshots'::regclass AND contype = 'p';
                IF constraint_name IS NOT NULL THEN
                    EXECUTE 'ALTER TABLE bus_snapshots DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name);
                END IF;
            END $$;
        `);

        await queryRunner.query(`
            DO $$
            DECLARE
                constraint_name text;
            BEGIN
                SELECT conname INTO constraint_name
                FROM pg_constraint
                WHERE conrelid = 'res_snapshots'::regclass AND contype = 'p';
                IF constraint_name IS NOT NULL THEN
                    EXECUTE 'ALTER TABLE res_snapshots DROP CONSTRAINT IF EXISTS ' || quote_ident(constraint_name);
                END IF;
            END $$;
        `);

        // Convert to hypertables (7-day chunks)
        await queryRunner.query(`
            SELECT create_hypertable('converter_snapshots', 'timestamp',
                chunk_time_interval => INTERVAL '7 days', if_not_exists => TRUE);
        `);

        await queryRunner.query(`
            SELECT create_hypertable('bus_snapshots', 'timestamp',
                chunk_time_interval => INTERVAL '7 days', if_not_exists => TRUE);
        `);

        await queryRunner.query(`
            SELECT create_hypertable('res_snapshots', 'timestamp',
                chunk_time_interval => INTERVAL '7 days', if_not_exists => TRUE);
        `);

        // Create composite primary keys that include timestamp
        await queryRunner.query(`ALTER TABLE converter_snapshots ADD PRIMARY KEY (id, timestamp);`);
        await queryRunner.query(`ALTER TABLE bus_snapshots ADD PRIMARY KEY (id, timestamp);`);
        await queryRunner.query(`ALTER TABLE res_snapshots ADD PRIMARY KEY (id, timestamp);`);

        // Create composite indexes for efficient time-series queries
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_converter_snapshots_converter_time
            ON converter_snapshots (converter_id, timestamp DESC);
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_bus_snapshots_bus_time
            ON bus_snapshots (bus_id, timestamp DESC);
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_res_snapshots_unit_time
            ON res_snapshots (unit_id, timestamp DESC);
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_res_snapshots_type_time
            ON res_snapshots (type, timestamp DESC);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop indexes
        await queryRunner.query(`DROP INDEX IF EXISTS idx_converter_snapshots_converter_time;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_bus_snapshots_bus_time;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_res_snapshots_unit_time;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_res_snapshots_type_time;`);

        // Note: TimescaleDB doesn't provide a simple way to revert hypertables to regular tables
        // In practice, you would need to drop and recreate the tables as regular PostgreSQL tables
    }

}
