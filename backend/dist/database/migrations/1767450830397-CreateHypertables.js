"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateHypertables1767450830397 = void 0;
class CreateHypertables1767450830397 {
    async up(queryRunner) {
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
        await queryRunner.query(`ALTER TABLE converter_snapshots ADD PRIMARY KEY (id, timestamp);`);
        await queryRunner.query(`ALTER TABLE bus_snapshots ADD PRIMARY KEY (id, timestamp);`);
        await queryRunner.query(`ALTER TABLE res_snapshots ADD PRIMARY KEY (id, timestamp);`);
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
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS idx_converter_snapshots_converter_time;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_bus_snapshots_bus_time;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_res_snapshots_unit_time;`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_res_snapshots_type_time;`);
    }
}
exports.CreateHypertables1767450830397 = CreateHypertables1767450830397;
//# sourceMappingURL=1767450830397-CreateHypertables.js.map